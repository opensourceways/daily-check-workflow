# JSON-LD 实现方式

> 本文总结两类前端项目（VitePress / Nuxt）如何在**构建时把 JSON-LD 数据自动注入到页面 HTML `<head>`**。两条技术路线并存：
>
> - **方案一：集中式数据归档 + 构建期统一注入**——每个路由对应的 JSON-LD 载荷预先落盘为数据目录（如 `.geo/jsonld/<route>/index.json`）随仓库提交，构建流程只做"按路由查找 → 写成 `<script type="application/ld+json">`"，不在构建时编造内容
> - **方案二：页面原生声明**——直接使用框架自带的页级机制（VitePress frontmatter `title`/`description`/`head`；Nuxt 页面 `<script setup>` 中的 `useSeoMeta`/`useHead`），载荷与页面同处一地
>
> 两种方式殊途同归：产物都是 HTML `<head>` 内的 `<script type="application/ld+json">`，都在构建（SSR 渲染/预渲染）阶段固化进静态 HTML，无运行时注入。

## 〇、集中式数据层（方案一公共前提）

- **存储形态**：归档目录默认为**项目仓库根目录下的 `.geo/`**（JSON-LD 载荷在 `.geo/jsonld/` 下）；目录内按路由镜像组织，每个路由目录一个 `index.json`，内容即完整的 JSON-LD 载荷（对象或数组，可含 Organization/WebSite/WebPage/BreadcrumbList/Article 等多节点）。
- **产出方式**：由构建外的离线流程生成并审核（如基于页面实际渲染内容用 AI 流水线生成、再校验"信息与页面内容一致"），产出物提交进仓库；构建只消费，不生产。
- **查找键归一化**：路由路径需与数据键严格对齐——去 `index.md`/`.md` 后缀、去末尾斜杠、对中文路径 `encodeURI`；**动态路由页**（由 `*.paths.ts` 参数化生成的页面）要用参数替换后的真实路径（`relativePath`）而不是模板路径（`filePath`）作为键。

## 一、VitePress 项目的实现

### 方案一：`transformPageData` 读数据归档注入 `frontmatter.head`

注入点是 VitePress 官方钩子 `transformPageData`：往 `pageData.frontmatter.head` 里写入 head 条目，官方构建（SSR 渲染每页）会把 `frontmatter.head` 序列化进 HTML `<head>`，无需任何后处理。

```ts
// .vitepress/config.ts
const setJSONLD = (pageData: PageData, lookupKey: string) => {
  const jsonFile = join(GEO_DIR, 'jsonld', lookupKey, 'index.json');
  if (!existsSync(jsonFile)) return;              // 无数据则不注入
  const payload = readFileSync(jsonFile, 'utf-8');

  const head = (pageData.frontmatter.head ??= []);
  const idx = head.findIndex(
    (item) => item[0] === 'script' && item[1]?.type === 'application/ld+json'
  );
  const entry: HeadConfig = ['script', { type: 'application/ld+json' }, payload];
  if (idx !== -1) head.splice(idx, 1, entry);     // 幂等：已有同类型条目则整体替换
  else head.push(entry);
};

export default defineConfig({
  transformPageData(pageData) {
    // 动态路由页 filePath 仍是模板路径，只有 relativePath 是真实页面路径
    const pagePath = pageData.relativePath;
    const lookupKey = pagePath.replace(/(?:\/index)?\.md$/, '');
    setJSONLD(pageData, lookupKey);
  },
});
```

要点：

- **payload 原样注入**：读取的是 JSON 文本，直接作为 script 内容，不做 `JSON.parse` 再序列化（保持离线产出的字节级一致）。
- **幂等去重**：注入前查找 head 中已有的 `application/ld+json` 条目并替换，避免与方案二 或 frontmatter 手写的条目重复（并存时归档数据优先）。
- **可编程兜底分支**：对内容集合类页面（纯 md + frontmatter 的文章），可以不走静态数据文件，而是在 transform 阶段用构建期代码从 frontmatter（title/summary/date/tags/作者/封面图）程序化拼装 JSON-LD（如 NewsArticle + BreadcrumbList 数组）直接 push 进 head。适合"字段齐全、可由内容推导"的模板化页面；自定义页面仍走数据文件。
- 缺失即跳过：数据文件不存在时不注入，也不报错（页面仍可有 TDK）。

### 方案二：页级 frontmatter 原生声明（零脚本）

VitePress 原生支持在每页 markdown 的 frontmatter 里声明 head 条目，构建时自动渲染进该页 `<head>`——JSON-LD 可以直接这样写在页面里，不需要任何 config 脚本：

```markdown
---
title: 页面标题
description: 页面描述
head:
  - - "script"
    - type: "application/ld+json"
    - |
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "页面标题"
      }
---
```

要点：

- `head` 条目与站点级 `config.head` 合并渲染，YAML 中每项是 `[tagName, attrs, innerHTML]` 三元数组；载荷用块标量（`|`）写原始 JSON，避免转义地狱。
- 数据与页面同处一地、同 PR 评审，适合**少量手工维护的页面**（落地页、活动页）或试验期页面；多语言页各自声明，无共享逻辑。
- 局限：载荷散落在各 md 中，难以批量生成/统一校验；与方案一并存时同一页只应有一条 ld+json（方案一的实现已做"已存在则替换"的幂等处理）。

## 二、Nuxt 项目的实现

### 方案一：模块 build 期 manifest + 全局路由中间件

不逐页读文件，而是用一个自定义 Nuxt 模块把数据目录**在构建初始化时一次性编入包体**，再由全局路由中间件在**预渲染阶段**按键注入：

```ts
// modules/seo-manifest/index.ts —— 构建初始化时执行
export default defineNuxtModule({
  async setup(_opt, nuxt) {
    // 1. 递归扫描 <geoRoot>/jsonld/，收集每个路由目录的 index.json
    const jsonldManifest = await buildManifest(join(geoRoot, 'jsonld'));
    //    键 = 目录相对路径（根目录映射为 '/'），值 = JSON 解析后的载荷；解析失败的文件静默跳过

    // 2. 以虚拟模块形式打进构建产物（#build 引用），运行时零文件 IO
    addTemplate({
      filename: 'seo-jsonld-manifest.mjs',
      getContents: () => `export default ${JSON.stringify(jsonldManifest)};`,
    });

    // 3. 注册全局路由中间件
    addRouteMiddleware({ name: 'set-tdk-schema', global: true, path: resolve('./runtime/middleware.ts') });
  },
});
```

```ts
// modules/seo-manifest/runtime/middleware.ts —— 渲染（预渲染）每个路由时执行
import jsonldManifest from '#build/seo-jsonld-manifest';

export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.prerender) return;   // 只在预渲染阶段锁定 head，运行时/CSR 不执行

  const key = to.path === '/' ? '/' : to.path.endsWith('/') ? to.path.slice(0, -1) : to.path;
  const jsonld = jsonldManifest[key];
  if (jsonld) {
    useHead({
      script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonld) }],
    });
  }
});
```

要点：

- **manifest 化**：`route → payload` 的映射在 module setup 阶段构建一次，经 `addTemplate` 成为虚拟模块；中间件里只是纯内存查表，SSR 渲染每页无文件读取。
- **注入机制**：Nuxt 的 `useHead`（unhead）在 SSR 渲染时把 head 条目写入 HTML；由于整站是 `nuxt generate` 预渲染产物，JSON-LD 被固化进静态 HTML。
- **`import.meta.prerender` 守卫**：注入仅发生在预渲染（构建）阶段——线上部署的是静态产物，运行时不需要再跑这段逻辑。
- **键归一化**：中间件对 `to.path` 做去末尾斜杠、根路径特判，与 manifest 键（`/` 或 `/a/b`）对齐；动态路由页面须保证"渲染路径 = 数据键"。
- **泛化版本**：`@opendesign-plus/nuxt-tdk-schema`（OpenDesignPlus 内）是同一中间件模式的配置驱动版——tdk/schema 两张映射表由模块选项传入而非扫描目录，选项键会自动做补 `/`、去尾 `/` 归一；站点本地模块则是"扫描数据目录建 manifest"版。

### 方案二：页级 `useHead` 原生声明

Nuxt 原生支持直接在页面组件（`pages/**.vue`）的 `<script setup>` 里调用 `useHead` 注入 JSON-LD，SSR/预渲染时自动进入该路由的 HTML head，不需要任何模块或中间件：

```vue
<script setup lang="ts">
const { data: post } = await useAsyncData(...)   // 页级数据源

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.summary,
  datePublished: post.date,
}

useHead({
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(schema) }],
})
</script>
```

要点：

- **数据驱动友好**：载荷可以在页面内由路由参数、内容集合查询（如 `queryCollection`）、接口数据实时拼装——对"每页 schema 强依赖自身内容数据"的动态路由（文章详情、商品详情）比集中归档更自然。
- unhead 按声明顺序与 key 管理条目；页面级声明只作用于当前路由组件，天然按需生效。
- 局限与 VitePress 方案二 相同：载荷分散在各页面组件、难以集中审计；与方案一 的全局中间件并存时，同一份 JSON-LD 只应在**一处**声明（要么归档驱动、要么页面驱动），避免双重注入。

## 三、方案对比

| 维度 | VitePress 方案一（归档+transform） | VitePress 方案二（frontmatter） | Nuxt 方案一（模块+中间件） | Nuxt 方案二（页级 useHead） |
|------|------|------|------|------|
| 载荷存放位置 | 数据归档目录（与内容分离） | 页面 md frontmatter | 数据归档目录（与内容分离） | 页面 `.vue` 组件 |
| 需要的构建侧代码 | config 内读档/合并逻辑 | 零 | 自定义模块（或 `@opendesign-plus/nuxt-tdk-schema`） | 零 |
| 注入 API | `pageData.frontmatter.head` | `frontmatter.head`（同一机制，声明处不同） | `useHead({ script: [{ innerHTML }] })` | 同左 |
| 作用阶段守卫 | transformPageData 本身只在构建执行 | 构建 inherent | `import.meta.prerender` 显式判断 | SSR/预渲染 inherent |
| 批量生成/统一校验 | 适合（集中数据天然适配流水线） | 不适合（散落各页） | 适合 | 不适合 |
| 单页数据驱动动态装配 | 需构建期代码兜底分支 | 只能静态写死 | 需构建期生成归档数据 | 适合（页面内直接拿数据拼载荷） |
| 幂等/去重 | 手动查找替换已有 ld+json 条目 | 与方案一 共用 head 数组，注意别重复声明 | unhead 按 key 去重 | 同左，但与方案一 并存时只能一处声明 |
| 适用场景 | 全站批量治理（AI 流水线/人工审核后入库） | 少量手工页、试验页 | 全站批量治理 | 动态详情类页面、schema 与页面数据强耦合 |

选型建议：**全站统一治理走方案一（归档 + 构建期注入），个别页面就地维护走方案二（原生声明）**；同一页面避免两条链路同时供给同一份 JSON-LD。
