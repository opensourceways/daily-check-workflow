---
name: internal-link-analyzer
description: 站内内链分析与孤岛页面排查：扫描 Nuxt 4 项目的 app/pages 文件路由页面、@nuxt/content 内容页（app/content/{zh,en}）、视图组件 import 链、Nuxt 自动导入组件、app/config 链接常量、CMS 导出 JSON（列表→详情动态内链）与全局布局组件（AppHeader/AppFooter）中的静态链接，合成内容页 prev/next 环绕链接，构建有向内链图，输出自包含 HTML 看板（含板块级/页面级 G6 关系图、上下游钻取表格、孤岛/死链/无入链页面列表）。用于 GEO/SEO 优化场景下识别内链密度短板、定位需要补链的孤岛页面与死链。触发词："内链分析"、"内链看板"、"孤岛页面"、"链接密度"、"站内链接关系图"、"死链排查"、"internal link analysis"、"orphan pages"、"补链优化"、"GEO 内链"。
license: MIT
metadata:
  author: persimmonzzz
  version: "1.0.0"
  tags:
    - seo
    - geo
    - internal-links
    - nuxt
    - link-graph
    - orphan-pages
  triggers:
    - "内链分析"
    - "内链看板"
    - "孤岛页面"
    - "链接密度"
    - "站内链接关系图"
    - "死链排查"
    - "internal link analysis"
    - "orphan pages"
    - "补链优化"
    - "GEO 内链"
---

# Internal Link Analyzer（Nuxt 4 版）

分析 hifloat-portal（Nuxt 4）的站内内链结构，识别孤岛页面、死链、内链密度短板，为 GEO/SEO 优化提供数据支撑。输出自包含 HTML 看板（G6 关系图 + 上下游钻取表格 + 孤岛/死链列表）。

> 本 skill 从 openEuler-portal（VitePress）的 internal-link-analyzer v2.0.0 移植适配，链接来源模型按 Nuxt 4 架构重新设计，看板功能规格保持跨项目一致。

## 适用场景

- 需要识别哪些页面缺少入链（SEO 爬虫难以发现）
- 需要评估内链密度是否足够（GEO 要求页面间有丰富的语义链接）
- 需要定位「孤岛」页面（既无内容内链又不在全局导航中）
- 需要排查死链（内链指向不存在的页面，常见为缺 `/{locale}` 前缀或目标页未创建）
- 需要可视化整个站点的链接关系（板块级 + 页面级关系图）

## 不适用场景

- 外链分析（外链域名仅统计，不分析外链关系）
- 页面内容质量评估（仅分析链接结构，不评估内容）
- 运行时 API 交互分析（搜索、邮件订阅接口属动态交互，不在静态内链范畴）

---

## 核心思想

### 链接来源的七层模型（Nuxt 4 版）

Nuxt 项目的链接来源必须按以下七层逐一提取，否则会大量漏链/误报：

| 层 | 来源 | 注入方式 | 处理策略 |
|---|------|---------|---------|
| 1 | `app/pages/**/*.vue` 页面 | Nuxt 文件路由 | 每页作图节点；`[...slug].vue` 登记为动态路由模板 |
| 2 | `app/content/{zh,en}/**/*.md` | `@nuxt/content`，挂在 `[...slug].vue` 下 | news/blogs/events 详情页节点；提取 `[text](url)` + 裸 URL + frontmatter `href` |
| 3 | 视图组件 import 链（`app/views/**`） | 页面 `import TheXxx` | 递归扫描（6 层）：`href`/`:to`/编程式导航/模板字符串 |
| 4 | **Nuxt 自动导入组件**（`app/components/**`） | 模板标签直接使用，**不在 import 链上** | 按模板标签名匹配组件注册表补扫（ContentWrapper/AppEmpty/AppHeaderSearch 等） |
| 5 | `app/config/*.ts` 链接常量 | 组件 `:href="CONFIG.X"` / `:href="LIVE"` | 解析常量表注入；`_ZH/_EN` 后缀常量按页面语言过滤 |
| 6 | CMS 导出 JSON（`app/content/cms/export/*.json`） | 视图 `import` + `v-for` 渲染 `item.link` / `item.link_zh` | JSON link 类字段提取 → 列表页→详情页动态内链（**无需线上 API**） |
| 7 | 全局布局组件（AppHeader/AppFooter） | `app/layouts/default.vue` 注入所有页面 | 单独归类为全局导航，**不注入每页出边** |

> **最常遗漏的是第 4、6 层**：自动导入组件不在 import 链上（漏扫），CMS JSON 的 `item.link` 是运行时渲染（需 JSON 字段提取）。最常误报的是把 `item.path` / `doc.href` 等动态表达式当 URL、把 `backUrl: '/'` 的 `url` 部分匹配当链接键、把 CONFIG 常量中的正则值当 URL、把 SEO `hreflang` 交替链接当内容内链——脚本分别用「静态链接候选白名单 + `\b` 键锚定 + 常量值 URL 过滤 + head 链接对象剔除」防护。

### 与 VitePress 版的关键差异

| 维度 | VitePress（openEuler） | Nuxt 4（本项目） |
|------|----------------------|------------------|
| 页面 | `app/{zh,en}/**/*.md` 文件路由 | `app/pages/**/*.vue` 文件路由 + `app/content/{zh,en}/*.md` 内容页 |
| 列表→详情动态内链 | 线上列表 API（fetch 补充） | CMS 导出 JSON（本地静态提取，无 API 依赖） |
| 分类布局注入 | App.vue `compMapping[category]` | `[...slug].vue` 动态路由模板按内容目录归属 |
| i18n 导航数据 | `i18n/` 目录 TS 对象 | 导航链接内联在 AppHeader 模板（i18n 文件无 URL） |
| 组件引用方式 | 显式 import | 显式 import + **Nuxt 自动导入**（需注册表补扫） |
| 链接常量 | 分散在组件/data | 集中在 `app/config/*.ts`（CONFIG 对象 + LIVE 等标量） |
| 内容环绕链接 | 无 | `queryContent().findSurround()` 的 prev/next（按同目录 date 降序**合成**） |

### 全局导航 vs 内容内链的分类原则

全局导航（AppHeader/AppFooter，由 `app/layouts/default.vue` 注入）的链接如果算作每页出链，会导致内链密度指标失真、入链 Top 全是导航项。**正确做法**：全局导航单独归为「全局链接」，不注入到每页出边。页面分四类（互斥不重叠）：

| 类别 | 含义 | GEO 建议 |
|------|------|---------|
| 孤岛 | 无内容上下游且未入导航 | 最高优先级补链 |
| 仅导航 | 无内容上下游但在导航中 | 可接受 |
| 内容强·入口弱 | 有内容入链但不在导航 | 可接受（文章页常态），重点页可加导航 |
| 导航有·内容无 | 在导航但无内容入链 | 建议补内容内链 |

### 模板字符串链接的 locale 上下文展开

组件中的 `` `/${locale}/space` `` 链接，展开目标取决于**所属页面的语言**：

- `pages/zh/index.vue` 扫描链中的 `${locale}` → 只展开 `zh`
- `pages/en/index.vue` 扫描链中的 `${locale}` → 只展开 `en`
- 全局布局组件（AppHeader/AppFooter 作用于双语言）→ 展开 `zh` + `en` 两份
- CONFIG 常量的 `_ZH/_EN` 后缀（如 `HIGH_FLOAT_8_TECHNICAL_STANDARD_DOC_ZH`）按页面语言过滤命中

> 若不分上下文全部展开 zh+en，会在 zh 详情页上产生大量 `/en/...` 幽灵死链（本项目 `/en/news`、`/en/technical` 页面真实缺失，需区分「latent 结构缺口」与「当前真死链」）。

### SEO 头部链接的排除原则

页面 `useHead` 中的 `rel: canonical` / `rel: alternate` + `hreflang` 链接对象是**双语站的结构性 SEO 元数据**（每页与其译页配对），不是内容内链。若计入图，每个页面都会获得跨语言幽灵边，污染「内容强·入口弱」等指标。脚本在提取前整体剔除这类对象字面量；`rel: icon` 等 head 链接指向的是资源，天然被 asset 分类排除。

### 残留 `${...}` 插值的截断策略

`` `/${locale.value}/mail-list/subscribe?name=${addr.split('@')[0]}` `` 这类「静态前缀 + 运行时插值」链接：locale 替换后，在首个未解析 `${` 处**截断保留前缀**（`/zh/mail-list/subscribe?name=`），经 query 剥离后匹配到订阅页。v-for 数据驱动的详情链接（`` `/${locale}${item.path}` ``）截断后无目标，由第 6 层 JSON 提取补全。

### 内容环绕链接（prev/next）合成

`ContentRender.vue` 运行时 `queryContent(dir).sort({date:-1}).findSurround()` 生成上一篇/下一篇导航——内容板块的真实内链机制。脚本按「同内容目录、frontmatter date 降序」为每个内容页合成与相邻两篇的双向边（来源标记 `(content surround)`）。新增内容板块时无需配置，自动生效。

---

## 执行步骤

### 0. 前置：拉取内容（必需）

`app/content` 由资源仓库生成（gitignore 忽略），分析前必须先 merge：

```bash
pnpm merge   # 从 gitcode.com:hifloat/resources.git 拉取 zh 内容 + cms 导出 + public 资源
```

> 当前资源仓库**暂无 en 目录**：`/en/news|blogs|events/*` 详情页无内容（渲染 AppEmpty），仅 `/en` 静态路由存在。看板会显示 EN 内容缺失警告；en 侧指标需在补齐 en 内容后重跑复核。

### 1. 运行分析脚本

```bash
node scripts/internal-link-analyzer.js
# 产物：internal-link-report.html（仓库根目录，浏览器直接打开）
```

无环境变量、无线上 API 依赖（CMS JSON 本地静态提取）。产物已加入 `.gitignore`，不入 Git。

### 2. 解读看板

#### 总览卡片

| 卡片 | 含义 | 关注阈值 |
|------|------|---------|
| 页面总数 | .vue 页面 + .md 内容页 | — |
| 内链边总数 | 有向内链边数 | 平均每页 < 1 条 = 严重不足 |
| 孤岛页面 | 无内容链且未入导航 | > 5% = 需补链 |
| 死链 | 内链指向不存在页面 | > 0 = 需修复（缺 locale 前缀/页面缺失） |
| 未进入导航 | 不在 AppHeader/AppFooter 中 | — |
| 内容强·入口弱 | 有内容入链但不在导航 | 文章页属正常，重点页可加导航 |
| 同域 docs 链接 | `/docs` 文档站入口引用 | 检查覆盖度 |

#### 页面列表（上下游钻取）

点击任意行展开：▲ 上游内链 / ▼ 下游内链 / 全局导航状态 / 外链域名。状态筛选支持：孤岛 / 仅导航 / 未进入导航 / 内容强·入口弱 / 导航有·内容无 / 无内容上下游 / 有上下游。

#### 关系图

- **板块级图**：节点=板块（`/{locale}/{section}/`），边宽=链接数，用于发现板块间链接薄弱区
- **页面级图**：G6 fruchterman 布局，按板块过滤，搜索高亮节点与邻居，双击节点跳转钻取

#### 孤岛 / 关键数据页签

1. 死链列表（来源页面 + 原始链接 + 解析目标）
2. 孤岛页面（最高优先级补链）
3. 未进入全局导航的页面
4. 内容强·入口弱 / 导航有·内容无
5. 无内容上下游（仅靠导航存活）/ 无内容入链
6. 全局导航覆盖页面（含来源组件）
7. 同域 docs 入口（引用页面数）
8. 入链/出链 Top 20、外链域名 Top 25
9. 说明与方法论

### 3. 根据看板制定补链方案

优先级排序：
1. **死链** → 立即修复（补 `/{locale}` 前缀、补缺失页面，或移除链接）
2. **孤岛页面** → 在相关列表页/聚合页中添加链接
3. **内容强·入口弱的重点页** → 在全局导航或首页快捷入口中添加链接
4. **导航有·内容无** → 在相关内容页面中添加正文链接
5. **板块间链接薄弱** → 在板块首页添加跨板块推荐链接
6. **EN 内容缺失** → 补齐资源仓库 en 目录后重跑复核（en 侧页面/内链整体缺口的前置项）

---

## 后续优化注意事项

### 1. 本项目当前基线（2026-10 扫描）

- 页面 43（25 个 .md 内容页 + 18 个 .vue 页面），内链边 170，孤岛 0，平均密度 3.95 条/页
- **静态死链 5 条全部有解释，用户可见死链 0 条**（经业务确认 2026-10）：
  - `/en → /en/news`：`HomeCommunityNews` 在 `TheHome.vue` 被**组件级** `v-if="isZh"` 守卫，英文站首页无新闻楼层，链接运行时不渲染
  - `/en → /en/technical?type=blogs|lives`：HomeResources 的元素级 `v-if="isZh"` 守卫，运行时不渲染
  - `/{zh,en}/mail-list/subscribe → /news` ×2：订阅页面包屑为订阅功能自身的层级语义（并非「回到新闻页」导航），业务预期现状，非缺陷
- 无内容入链页 6 个：mail-list confirm 页 ×4（邮件/API 直达落地页，属预期）+ `/zh|en/search` ×2（业务确认：搜索页为客户端接口数据页，非 SSR 渲染，无需 SEO 静态可达性，其入口 JS 跳转属正常设计）
- SEO `hreflang`/`canonical` 头部链接已排除（结构元数据，非内容内链）
- **导航自洽性已核查（2026-10）**：en 侧缺失页面（`news/index`、`technical/index`）的 AppHeader 导航项均有 `v-if="isZh"` 守卫；无守卫导航项（space/activity）目标页在 en 下均存在——导航零死链，守卫一致
- **AppFooter 仅含外链**（白皮书/模拟器/组织官网共 5 条，`CONFIG` 常量），零站内链接；全局导航覆盖（10 页）全部来自 AppHeader，属设计现状
- **整体结论：当前页面集合下静态内链结构健康**（孤岛 0、用户可见死链 0、密度 3.95），无代码级待修问题；en 内容补齐属资源仓库前置项
- 修复/新增页面后重跑脚本刷新基线

### 2. 新增页面/组件后的维护

脚本自动覆盖新增 `.vue` 页面、`.md` 内容页、组件与 CMS JSON。以下情况需手动更新脚本配置：

- 新增全局布局组件 → 添加到 `GLOBAL_LAYOUT_COMPONENTS`（检查 `app/layouts/default.vue`）
- 新增内链域名 → 添加到 `INTERNAL_DOMAINS`
- CMS JSON 新增 link 类字段名 → 添加到 `extractJsonLinks` 的 `JSON_LINK_KEYS`
- 新增链接常量文件 → 确认在 `app/config/` 下（`buildConstantsMap` 自动扫描）
- 新增内容板块（如 faq）→ 无需配置：`[...slug].vue` 模板归属与环绕链接合成均按目录自动推断

### 3. 已知的分析局限

- **不识别语言守卫（元素级与组件级均不识别）**：
  - 元素级：`v-if="isZh"` 直接守卫链接/区块（如 HomeResources 博客/直播区块 → `/en/technical?type=blogs|lives`）
  - 组件级：守卫写在父级模板的组件实例上（如 `TheHome.vue` 的 `<HomeCommunityNews v-if="isZh">`），组件内部所有链接在英文站运行时均不渲染（→ `/en/news`）
  - 报死链前必须人工复核两级守卫：先查链接所在元素，再沿 import 链向上查组件实例在父级模板中是否有 `v-if` 守卫；否则会把守卫保护的链接误判为用户可见死链（本项目曾误判 2 例）
- `v-for` 中完全由运行时数据拼出的链接（无静态前缀）无法提取，依赖 JSON 字段提取覆盖；如 CMS 数据与渲染模板字段名脱节会漏边
- `:href="isZh ? CONFIG.X_ZH : CONFIG.X_EN"` 三元表达式按「双常量提取 + 页面语言过滤」近似处理
- 搜索页结果、邮件订阅 API 返回的运行时链接不在静态范畴
- EN 内容补齐后，`/en` 侧指标才有意义；当前 en 详情页不存在（`content/en` 缺失）

### 4. 性能与产物

- 全量扫描（43 页 + 组件递归 + CMS JSON）耗时 < 1s
- 报告 HTML 约 80KB（数据内嵌 + G6 CDN），离线时表格与钻取仍可用，仅图谱不可用
- `internal-link-report.html` 不入 Git（已加 `.gitignore`）；`scripts/internal-link-analyzer.js` 入 Git

### 5. 标题来源

- `.md` frontmatter `title` 字段
- `.vue` 页面 `definePageMeta` 的 `title`（对象取 zh，字符串直取）
- CMS JSON 的 `link` → `title_zh`（列表数据优先）
- 无标题的页面显示「（无标题）」

---

## 看板功能规格（跨项目保持一致）

### 视觉风格

- 深色主题（`--bg: #0b1020`），亮色文字
- 卡片式布局，统计卡片 + 面板
- G6 @4.8.24 CDN 引入，降级保护（离线时表格仍可用）

### 页签结构

| 页签 | 内容 |
|------|------|
| 总览 / 板块关系图 | G6 力导向板块级图 + 板块统计表 |
| 页面列表（上下游钻取） | 可搜索/筛选表格，点击行展开上下游 |
| 页面级关系图 | G6 fruchterman 布局，搜索高亮，双击跳转 |
| 孤岛 / 关键数据 | 死链、孤岛、仅导航、内容强入口弱、Top 入链/出链、docs 入口、外链域名 |

### 页面列表列

| 列 | 内容 |
|----|------|
| 标题 | 页面 title（无标题显示「（无标题）」） |
| 路径 | 页面 pagePath |
| 板块 | `/{locale}/{section}/` |
| 出链 / 入链 | 下游 / 上游内链数 |
| 导航 | 在导航/未入导航 |
| 状态 | 孤岛/仅导航/内容孤岛/无入链/已连通 |

### 状态筛选选项

| 选项 | 筛选条件 |
|------|---------|
| 孤岛(无内容无导航) | `isOrphan: true` |
| 仅导航 | `isContentOrphan && inGlobalNav` |
| 未进入导航 | `!inGlobalNav` |
| 内容有·导航无 | `inCount > 0 && !inGlobalNav` |
| 导航有·内容无 | `inGlobalNav && inCount === 0` |
| 无内容上下游 | `isContentOrphan` |
| 有上下游 | `inCount > 0 && outCount > 0` |

---

## 检查清单

运行分析前（首次/内容变更后）：
- [ ] 已执行 `pnpm merge`（`app/content` 存在且非空）
- [ ] 确认 `INTERNAL_DOMAINS` 包含所有内链域名（当前 `hifloat.gccorg.com`）
- [ ] 确认 `GLOBAL_LAYOUT_COMPONENTS` 与 `app/layouts/default.vue` 注入的组件一致
- [ ] `internal-link-report.html` 在 `.gitignore` 中

运行分析后（每次运行后）：
- [ ] 死链数 = 0，或每条死链已逐条复核归属：元素级守卫 / 组件级守卫（沿 import 链查父级模板 `<Component v-if>`）/ 业务预期 / 真实缺失，仅「真实缺失」可建 issue
- [ ] 孤岛数 < 5% × 总页面数（否则需补链）
- [ ] 孤岛与仅导航列表零重叠（`orphanPages ∩ contentOrphanPages = ∅`）
- [ ] 抽查死链/孤岛页面是否确实无入链（排除脚本遗漏）
- [ ] 抽查全局导航覆盖数是否合理（当前 10 页）
- [ ] 检查板块关系图是否有明显断连的板块
- [ ] `node --check scripts/internal-link-analyzer.js` 通过（本仓无 ESLint 配置）
