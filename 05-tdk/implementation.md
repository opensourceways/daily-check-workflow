# TDK 实现方式

> 本文总结两类前端项目（VitePress / Nuxt）如何在**构建时把每页的 TDK（title / description / keywords，及 canonical 等附属元信息）自动注入到页面 HTML**。两条技术路线并存：
>
> - **方案一：集中式数据归档 + 构建期统一注入**——每个路由一份 `<route>/index.json`（形如 `{ title, description, keywords, canonical }`），存放于仓库内的数据目录（如 `.geo/tdks/`），由离线流程（基于页面渲染内容生成并审核）维护，构建流程只做"按路由查找 → 写入 head"
> - **方案二：页面原生声明**——直接使用框架自带的页级机制（VitePress frontmatter `title`/`description`/`head`；Nuxt 页面 `<script setup>` 中的 `useSeoMeta`），数据与页面同处一地
>
> 两种方式都在构建（SSR 渲染/预渲染）阶段固化进静态 HTML 的 `<head>`。

## 〇、集中式数据层（方案一公共前提）

- **存储形态**：归档目录默认为**项目仓库根目录下的 `.geo/`**（TDK 数据在 `.geo/tdks/` 下）；目录内按路由镜像组织，每个路由目录一个 `index.json`，字段即 TDK 载荷；canonical 存站内相对路径，注入时拼接站点域名生成绝对 URL。
- **查找键归一化**：路由路径需与数据键严格对齐——去 `index.md`/`.md` 后缀、去末尾斜杠、对中文路径 `encodeURI`；动态路由页用参数替换后的真实路径作键。
- **缺数据兜底**：查不到数据条目时不编造——或回退站点级默认文案（i18n 全局 title/description），或回退页面自身 frontmatter（如文章页取 summary 作 description），title 保持不覆盖。

## 一、VitePress 项目的实现

### 方案一：`transformPageData` 写 pageData 字段 + `frontmatter.head`

VitePress 官方渲染消费 `pageData` 与 `frontmatter.head`，因此 TDK 注入全部走官方钩子，无需后处理：

```ts
// .vitepress/config.ts
const setTdk = (pageData: PageData, pagePath: string) => {
  // titleTemplate 按 locale 设置（如 `:title | 站点名`），config 层保持 titleTemplate: false
  pageData.titleTemplate = `:title | ${pagePath.startsWith('zh') ? '站点中文名' : '站点名'}`;

  const jsonFile = join(GEO_DIR, 'tdks', pagePath, 'index.json'); 
  const tdk = existsSync(jsonFile) ? JSON.parse(readFileSync(jsonFile, 'utf-8')) : null;
  if (!tdk) return; // 无数据则不注入

  const { title, description, keywords, canonical } = tdk;
  if (description) pageData.description = description;   // → <meta name="description">
  if (title) pageData.title = title;                     // → <title>（经 titleTemplate）

  const head = (pageData.frontmatter.head ??= []);
  if (canonical) {                                       // → <link rel="canonical">
    head.push(['link', { rel: 'canonical', href: `${HOSTNAME}${canonical}` }]);
  }
  if (keywords) {                                        // → <meta name="keywords">
    const idx = head.findIndex((item) => item[1]?.name === 'keywords');
    const entry: HeadConfig = ['meta', { name: 'keywords', content: keywords }];
    if (idx !== -1) head.splice(idx, 1, entry);          // 幂等：已存在则替换
    else head.push(entry);
  }
};

export default defineConfig({
  transformPageData(pageData) {
    const pagePath = pageData.relativePath;              // 动态路由页须用 relativePath
    const lookupKey = pagePath.replace(/(?:\/index)?\.md$/, '');
    setTdk(pageData, lookupKey);
  },
});
```

要点：

- **双通道写入**：`title`/`description` 写 `pageData` 字段（官方主题/渲染链路自动消费，`<title>` 经 `titleTemplate` 组装）；`keywords`/`canonical` 官方字段未覆盖，手动进 `frontmatter.head`。
- **head 条目幂等**：插入前查找同名 meta 并替换，避免与方案二（frontmatter 手写 head）的条目重复——并存时归档数据优先。
- **逐字段判空**：数据里的每个字段都是可选，缺什么保留什么（页面 frontmatter 原值/官方默认），不整体覆盖。
- **例外规则**：个别页面类型（如标题应从 frontmatter 直取的模板页）可按路径正则跳过数据中的 title。

### 方案二：页级 frontmatter 原生声明（零脚本）

VitePress 原生支持 frontmatter 的 `title` 与 `description` 字段，构建时自动渲染为 `<title>`（经 `titleTemplate` 组装）与 `<meta name="description">`；`keywords`/`canonical` 无专用 frontmatter 字段，通过 frontmatter `head` 数组声明（与站点级 head 合并渲染）：

```markdown
---
title: 页面标题              # → <title>（叠加 titleTemplate）
description: 页面描述        # → <meta name="description">
head:
  - - "meta"
    - name: "keywords"
      content: "关键词1, 关键词2"
  - - "link"
    - rel: "canonical"
      href: "https://example.com/path/"
---
```

要点：

- 零构建脚本代码，数据与正文同文件、同 PR 评审；适合**少量手工维护的页面**或试验期页面；`title`/`description` 缺省时自动回退 `config.locales.<locale>` 的站点级 title/description。
- canonical 需写完整绝对 URL（frontmatter 无拼接机制，需逐页自行维护）。
- 局限：无法批量生成/统一校验；与方案一 并存时，`transformPageData` 里"逐字段判空 + head 幂等替换"决定了归档值覆盖 frontmatter 值，同一页不应两边都指望。

## 二、Nuxt 项目的实现

### 方案一：模块 build 期 manifest + 全局路由中间件 + `useSeoMeta`

与 JSON-LD 同一个自定义模块承载：构建初始化时扫描 TDK 数据目录生成 `route → tdk` 清单，编为虚拟模块；全局路由中间件在预渲染阶段按键注入（模块骨架与守卫写法见 [JSON-LD 实现方式](04-json-ld/implementation.md) 对应小节，此处只列 TDK 差异部分）：

```ts
// modules/seo-manifest/index.ts —— 扫描 TDK 数据目录（同样产出虚拟模块）
const tdkManifest = await buildManifest<TdkInfo>(join(geoRoot, 'tdk'));
// 键 = 目录相对路径（根目录 → '/'），值 = { title, description, keywords }
addTemplate({
  filename: 'seo-tdk-manifest.mjs',
  getContents: () => `export default ${JSON.stringify(tdkManifest)};`,
});
```

```ts
// modules/seo-manifest/runtime/middleware.ts
import tdkManifest from '#build/seo-tdk-manifest';

export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.prerender) return;              // 仅预渲染阶段锁定 head

  const key = to.path === '/' ? '/' : to.path.endsWith('/') ? to.path.slice(0, -1) : to.path;
  const tdk = tdkManifest[key];                    // 缺数据 → undefined，走兜底
  useSeoMeta({
    title: tdk?.title || i18n.global.t('common.title'),             // 站点默认文案兜底
    description: tdk?.description || i18n.global.t('common.description'),
    ogDescription: tdk?.description || i18n.global.t('common.description'),
    keywords: tdk?.keywords || i18n.global.t('common.keywords'),
  });
});
```

要点：

- **`useSeoMeta` 一次映射多标签**：title/description/keywords 及 og 对应属性由 unhead 自动展开为 `<title>`、`<meta name=…>`、`<meta property=og:…>`，且按 key 去重，无需手写 head 条目。
- **每路由无条件调用**：中间件对每个路由都调 `useSeoMeta`（有数据用数据、无数据用站点默认），保证所有预渲染页面 head 完整、无遗漏。
- **数据进包体、运行时零 IO**：manifest 在构建初始化时读取目录一次；页面渲染（SSR/预渲染）仅做内存查表。
- **泛化版本**：`@opendesign-plus/nuxt-tdk-schema` 是同一模式的配置驱动版——`tdk`/`schema` 映射表由模块选项传入（键自动补 `/`、去尾 `/`），中间件里 `useSeoMeta(tdkInfo)` / `useHead(script)` 注入；站点本地模块的区别仅在于清单来自扫描数据目录。

### 方案二：页级 `useSeoMeta` 原生声明

Nuxt 原生支持直接在页面组件（`pages/**.vue`）的 `<script setup>` 里调用 `useSeoMeta`，SSR/预渲染时自动写入该路由的 head，不需要任何模块或中间件：

```vue
<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(...)     // 或 queryCollection 等内容数据源

useSeoMeta({
  title: post?.title,                              // 可由路由参数/内容数据实时推导
  description: post?.summary,
  keywords: post?.tags?.join(', '),
  ogTitle: post?.title,
  ogDescription: post?.summary,
})
</script>
```

要点：

- **数据驱动友好**：TDK 可在页面内由路由参数、内容集合查询、接口数据实时推导——对"标题/描述本身就是页面数据"的动态路由（文章详情、sig/项目详情页）比集中归档更自然；值缺省时 unhead/Nuxt 会回退 `nuxt.config` 的 `app.head` 或 layout 中的站点级默认。
- 站点默认兜底写在 `nuxt.config → app.head.titleTemplate/meta` 或全局 layout，页面级只声明差异部分。
- 局限：TDK 散落各页面组件、难以集中审计；若站点同时挂了方案一 的全局中间件，同一 meta 只应在一处声明（中间件每路由无条件调用会先占位，页面级再写会形成双重声明、结果依赖注册顺序），两种方案应按路由分工而非叠加。

## 三、方案对比

| 维度 | VitePress 方案一（归档+transform） | VitePress 方案二（frontmatter） | Nuxt 方案一（模块+中间件） | Nuxt 方案二（页级 useSeoMeta） |
|------|------|------|------|------|
| 数据存放位置 | 数据归档目录（与内容分离） | 页面 md frontmatter | 数据归档目录（与内容分离） | 页面 `.vue` 组件 |
| 需要的构建侧代码 | config 内读档/合并逻辑 | 零 | 自定义模块（或 `@opendesign-plus/nuxt-tdk-schema`） | 零 |
| 注入 API | `pageData.title/description` + `frontmatter.head` | frontmatter 原生字段 + `head`（同一渲染链路） | `useSeoMeta()`（unhead 映射 title/meta/og 并去重） | 同左 |
| title 组装 | `titleTemplate` 按 locale 设置 | frontmatter title + config `titleTemplate` | 数据即最终 title | 页面值 + 站点级 `titleTemplate` |
| canonical | 归档字段 + head 拼域名 | frontmatter head 手写绝对 URL | 不经此模块（页面侧自行维护） | 页面 `useHead({ link })` |
| 批量生成/统一校验 | 适合（集中数据适配流水线） | 不适合（散落各页） | 适合 | 不适合 |
| 单页数据驱动 | 需构建期兜底代码 | 只能静态写死 | 需先产出归档数据 | 适合（路由/内容数据直接推导） |
| 缺数据兜底 | 保留 frontmatter 原值 / summary 补 description | frontmatter 缺省回退站点级默认 | 站点级默认文案（i18n） | 站点级默认（app.head/layout） |
| 并存时的优先级 | 归档值覆盖 frontmatter（逐字段判空 + head 幂等替换） | —— | 中间件先注册占位 | 同一 meta 只应一处声明，避免双重声明 |

选型建议：**全站统一治理走方案一（归档 + 构建期注入），个别页面或"TDK 即页面数据"的动态路由就地声明走方案二（原生 frontmatter / useSeoMeta）**；同一页面的同一字段避免两条链路同时供给。
