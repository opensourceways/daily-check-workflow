---
name: json-ld-deploy
description: 为 VitePress / Nuxt 项目部署 JSON-LD 结构化数据（GEO 专项 04 措施）。当用户要求添加、修复或校验结构化数据、schema.org、JSON-LD、富媒体标记时使用。
---

# JSON-LD 结构化数据落地技能

为项目部署符合 [W3C JSON-LD 1.1](https://www.w3.org/TR/json-ld11/) + [schema.org](https://schema.org) + [Google 搜索中心规则](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=zh-cn) 的结构化数据。完整规范见本仓库 [../规范.md](../规范.md)。

## 第一步：前置信息收集

| 信息 | 来源 | 用途 |
|------|------|------|
| 站点 URL / 名称 / 描述 | 项目配置 / 用户提供 | WebSite 节点、canonical |
| 组织正式名称 + Logo（≥112×112px，绝对 URL） | 品牌资源 | Organization 节点 |
| 官方社媒链接（GitHub 组织页等） | 用户提供 | Organization.sameAs |
| 技术栈 | `package.json`（vitepress / nuxt / @nuxt/content） | 决策树入口 |
| 站内搜索 URL 模板 | 用户提供 | SearchAction（可选） |
| 站点默认分享图（≥1200px 宽） | 品牌资源 | TechArticle.image 兜底 |
| 是否有真实的评分/价格/作者数据 | 用户提供 | 决定 offers/aggregateRating/author 取值 |

## 第二步：按技术栈走决策树

```
技术栈是什么？
├─ VitePress（package.json 含 vitepress）
│    └─ 路径 A：head（站点级）+ transformPageData（页面级）官方 hooks
├─ Nuxt 3/4（package.json 含 nuxt）
│    ├─ 已用 @nuxtjs/seo ────→ 路径 B：nuxt-schema-org 已内置，补 identity 配置即可
│    └─ 纯 Nuxt ────────────→ 路径 B：安装 nuxt-schema-org 模块
└─ 其他 / 构建链受限（无法改构建配置）
     └─ 路径 C：兜底脚本 scripts/inject-jsonld.mjs（构建产物后处理注入）
```

选型原则：**官方 hooks / 生态模块 > 构建后处理**。前者数据源在 frontmatter/pageData 中，随内容自动更新；后者从构建产物 HTML 提取，取值有限。

## 路径 A：VitePress（官方 hooks，零依赖）

完整可复制配置见 [templates/vitepress.config.ts](templates/vitepress.config.ts)。核心结构：

1. 站点级（每页注入同一份）：`head` 配置项挂 Organization + WebSite 两个 ld+json 块
2. 页面级：`transformPageData(pageData)` 内基于 `pageData.relativePath / title / description / frontmatter / lastUpdated` 生成 WebPage + BreadcrumbList + TechArticle 的 `@graph`，push 进 `pageData.frontmatter.head`（VitePress 官方 canonical 示例的同款机制）
3. 建议同时开启 `lastUpdated: true`（git 修改时间 → dateModified）

```ts
import { defineConfig } from 'vitepress'

const SITE = {
  url: 'https://docs.example.com',
  name: 'openEuler 文档',
  orgName: 'openEuler社区',
  logo: 'https://docs.example.com/logo.png',
  defaultImage: 'https://docs.example.com/og-default.png',
}

export default defineConfig({
  lastUpdated: true,
  head: [
    ['script', { type: 'application/ld+json' }, JSON.stringify(organizationNode(SITE))],
    ['script', { type: 'application/ld+json' }, JSON.stringify(webSiteNode(SITE))],
  ],
  transformPageData(pageData) {
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify(pageGraph(pageData, SITE)),
    ])
  },
})
```

注意事项：

- 404 页跳过（`pageData.relativePath === '404.md'` 时 return）
- 面包屑末项 name 用 `pageData.title`，中间级用路径段（若站点有 sidebar title 映射，优先用映射）
- 无 frontmatter `date` 时省略 `datePublished`，**禁止编造**

## 路径 B：Nuxt（nuxt-schema-org，Nuxt 生态事实标准）

模块为 harlan-zw 维护（Nuxt SEO 套件成员，nuxt.com 自用），基于 Google 与 Yoast 最佳实践，自动注入 WebSite/WebPage 默认节点并维护 @graph 关联。

1. 安装：`npx nuxi@latest module add schema-org`
2. 配置站点身份（nuxt.config.ts，完整模板见 [templates/nuxt.config.ts](templates/nuxt.config.ts)）：

```ts
export default defineNuxtConfig({
  site: {
    url: 'https://www.example.com',
    name: '站点名称',
    description: '一句话描述',
  },
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: '组织正式名称',
      logo: '/logo.png',
      url: 'https://www.example.com',
    },
  },
})
```

3. 页面级节点：在页面/布局组件中调用 `useSchemaOrg`（用法模板见 [templates/nuxt-page.vue](templates/nuxt-page.vue)）：

```vue
<script setup>
useSchemaOrg([
  defineArticle({
    title: '安装指南',
    description: 'openEuler 24.03 LTS 安装流程',
    datePublished: '2026-01-15',
    inLanguage: 'zh-CN',
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: '首页', item: '/' },
      { name: '文档', item: '/docs' },
      { name: '安装指南' },
    ],
  }),
])
</script>
```

4. 常用 define* 节点：`defineWebSite` / `defineWebPage` / `defineArticle` / `defineBreadcrumb` / `defineOrganization` / `definePerson` / `defineProduct` / `defineEvent`；不在预置列表的类型直接传 schema.org 原始对象（或用 [google/schema-dts](https://github.com/google/schema-dts) 类型化）

注意事项：

- **模块需要 SSR**；纯 SPA 需手动 `useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(schema) }] })`
- identity 仅接受 `'Person' | 'Organization' | 'LocalBusiness'` 三种字符串；子类型用 `@type` 数组表达
- 默认节点（WebSite/WebPage）自动生成，可用 `schemaOrg.defaults: false` 关闭；用 Nuxt DevTools 的 Schema.org 面板调试
- 建议配合 Nuxt Robots：不可索引路径自动不加 schema

## 路径 C：兜底脚本（构建产物后处理）

适用：非 VitePress/Nuxt，或无法修改构建配置。脚本位于 [scripts/inject-jsonld.mjs](scripts/inject-jsonld.mjs)，零依赖（Node ≥18），在构建完成后扫描 dist HTML 注入。

```bash
# 基础（Organization + WebSite + WebPage + BreadcrumbList）
node inject-jsonld.mjs \
  --dist .vitepress/dist \
  --site-url https://docs.example.com \
  --site-name "openEuler 文档" \
  --org-name "openEuler社区" \
  --org-logo https://docs.example.com/logo.png \
  --lang zh-CN

# 文档站（额外注入 TechArticle，datePublished 取文件 mtime，image 用站点默认图）
node inject-jsonld.mjs \
  --dist .vitepress/dist \
  --site-url https://docs.example.com \
  --site-name "openEuler 文档" \
  --org-name "openEuler社区" \
  --org-logo https://docs.example.com/logo.png \
  --lang zh-CN \
  --article \
  --default-image https://docs.example.com/og-default.png
```

行为说明：

- 已含 `application/ld+json` 的页面自动跳过（不重复注入），`--force` 可覆盖
- URL 从相对路径推导（index.html → `/`，foo.html → `/foo`）；`--keep-html-ext` 保留扩展名
- 页面标题/描述取自 `<title>` / `<meta name="description">`；canonical 取自 `<link rel="canonical">`
- 推荐挂 CI：`build && node inject-jsonld.mjs ... && node validate-jsonld.mjs --dist ...`

## 第三步：本地校验

```bash
# 校验本地构建产物（CI 门禁，错误时退出码非 0）
node scripts/validate-jsonld.mjs --dist .vitepress/dist

# 校验线上页面
node scripts/validate-jsonld.mjs --url https://www.example.com/docs/install
```

校验项：JSON 语法、`@context` 正确性、各类型 Google 必填属性、BreadcrumbList/FAQPage 嵌套结构、占位符（TODO/xxx/待填/example.com）。

## 第四步：验收清单

对照 [../规范.md](../规范.md) 验收基线：

- [ ] 页面 HTML 源码（查看源代码，非 DevTools 元素面板）中存在 `application/ld+json`
- [ ] Organization（name+url+logo≥112px）+ WebSite（name+url）全站存在
- [ ] 层级 ≥2 页面有 BreadcrumbList，名称与可见面包屑一致
- [ ] 文档页 TechArticle：headline ≤110 字符、image ≥1200px、datePublished、author、publisher
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) 目标类型零错误
- [ ] [validator.schema.org](https://validator.schema.org/) 零错误
- [ ] `node scripts/validate-jsonld.mjs` 通过（CI 集成）

## 禁止事项

- 禁止编造任何取值：评分、价格、日期、作者、统计数据只能来自页面可见内容或真实事实
- 禁止占位符上线：`TODO`/`xxx`/`待填`/`example.com`
- 禁止纯客户端动态注入（SPA 运行时 useHead 到 HTML 之外的场景）——必须 SSG/SSR 输出或构建期后处理
- 禁止标记页面不可见的内容（隐藏 FAQ、隐藏 HowTo）
- 禁止向无关页面批量复制与页面无关的 Article/Product 标记
- 中文站取值禁止机器翻译，与页面语言一致

## 完成后动作

1. 更新本仓库 `measures/04-json-ld/进展.md` 与 `各项目差异点.md`
2. 运行 `node workflow/scripts/check-jsonld.mjs --site=<项目ID>` 确认 P0 三件套与必填属性通过
3. 若新增 Organization logo/sameAs 信息，同步 TDK 措施的站点信息源，保持一致
