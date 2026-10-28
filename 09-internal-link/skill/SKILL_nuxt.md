---
name: internal-link-analyzer
version: "1.0.0"
description: '站内内链分析与孤岛页面排查（Nuxt 3 适配版）：扫描 packages/website/pages 全部 .vue 页面、packages/website/content 全部 @nuxt/content 文章、.content/ YAML 内容数据、components 自动导入组件、全局布局组件与 JSON 导航数据中的静态链接，调用线上 SIG 列表 API 实例化 /sig/[id] 动态路由，本地枚举列表页→文章页动态内链，构建有向内链图，输出自包含 HTML 看板（含板块级/页面级 G6 关系图、上下游钻取表格、孤岛/无入链页面列表）。用于 GEO/SEO 优化场景下识别内链密度短板、定位需要补链的孤岛页面。触发词："内链分析"、"内链看板"、"孤岛页面"、"链接密度"、"站内链接关系图"、"internal link analysis"、"orphan pages"、"补链优化"、"GEO 内链"。'
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
    - "internal link analysis"
    - "orphan pages"
    - "补链优化"
    - "GEO 内链"
---

# Internal Link Analyzer（Nuxt 3 适配版）

分析 Nuxt 3 项目（mindspore-portal）的站内内链结构，识别孤岛页面、内链密度短板，为 GEO/SEO 优化提供数据支撑。输出自包含 HTML 看板（G6 关系图 + 上下游钻取表格 + 孤岛列表）。

## 适用场景

- 需要识别哪些页面缺少入链（SEO 爬虫难以发现）
- 需要评估内链密度是否足够（GEO 要求页面间有丰富的语义链接）
- 需要定位「孤岛」页面（既无内容内链又不在全局导航中）
- 需要可视化整个站点的链接关系（板块级 + 页面级关系图）
- 新增页面/组件后需要复核内链覆盖变化

## 不适用场景

- 外链分析（外链域名仅统计，不分析外链关系）
- 页面内容质量评估（仅分析链接结构，不评估内容）
- 线上 HTML 抓取（本工具是静态分析 + 本地 content 枚举 + SIG API 补充，不抓取线上页面）
- 部署期挂载路径分析（`/tutorials`、`/docs`、`/mindformers` 等非 Nuxt 路由的文档路径不计入页面集合）

---

## 核心思想

### Nuxt 与 VitePress 的三大结构差异

本项目与 VitePress 项目（如 openEuler-portal）的内链分布完全不同，直接套用 VitePress 分析器会大量漏链：

| 差异 | VitePress（openEuler） | Nuxt（mindspore-portal） |
|------|------------------------|--------------------------|
| 页面来源 | `app/{zh,en}/*.md` 单一来源 | `pages/**/*.vue` 文件路由 + `content/**/*.md` 文章双来源 |
| **组件引用** | `.md` 显式 import 组件 | **`components/` 目录自动导入**（模板标签无 import 语句） |
| **双语路由** | URL 前缀式 `/zh/...`、`/en/...` | **后缀式**：zh 无前缀 `/install`，en 加段 `/install/en`（物理双份 .vue 文件）；content 文章 `/{type}/{lang}/{slug}` |

> **最易踩坑的是组件自动导入**：Nuxt 的 `components/` 目录组件在模板中直接以标签使用（如 `<HomeBanner>`），没有 import 语句。只扫 import 链会让首页出链从 27 条掉到 1 条。必须建立「标签名 → 组件文件」索引（pathPrefix 命名规则）。

### 链接来源的七层模型

Nuxt 项目的链接来源必须按以下七层逐一提取，否则会大量漏链：

| 层 | 来源 | 注入方式 | 处理策略 |
|---|------|---------|---------|
| 1 | `pages/**/*.vue` | Nuxt 文件路由 | 提取页面文件链接（薄壳，链接少） |
| 2 | `views/<module>/The*.vue` | pages 显式 import | 递归扫描 import 链（6 层深度） |
| 3 | `components/**/*.vue` | **Nuxt 自动导入**（模板标签） | 建立标签索引，按 `<Tag` 匹配递归 |
| 4 | `.content/**/*.yaml` | `#content/` 虚拟模块（OPlusYamlContentVitePlugin） | js-yaml 解析 + URL 字段树遍历 |
| 5 | JSON 数据（`public/header.json`、`docs-menu.json`、`ms-version.json`） | `data/header/menu.ts` import | JSON 树遍历，`href: {zh, en}` 双语对象两值都收 |
| 6 | `content/**/*.md`（@nuxt/content） | catch-all 路由（`news/[...slug].vue` 等） | 每篇文章是页面节点；frontmatter `href`（活动外链跳转）+ 正文链接 |
| 7 | 全局布局组件（TheMain/AppFloat/AppFooter/SearchHeader） | `layouts/default.vue` 全局注入 | 单独归类为全局导航，**不注入每页出边** |

> **最常遗漏的是第 3、6、7 层**。如果只扫 import 链 + .md 正文，孤岛数会虚高 5-10 倍。

### 页面节点的四个来源

| 来源 | 生成方式 | 示例 |
|------|---------|------|
| vue 静态路由 | `pages/**/*.vue` → 去掉 `index.vue` | `/news`、`/install/en`、`/sig/meeting-guide` |
| content 文章 | `content/{type}/{lang}/*.md` → `/{type}/{lang}/{slug}` | `/news/zh/1039`、`/technology-blogs/en/3442` |
| SIG 详情页（动态路由实例化） | 线上 SIG API（`/api-magicapi/stat/sig/info`）的 `data[].name` → `/sig/{encodeURIComponent(name)}` + `/sig/{name}/en` | `/sig/MindSpore%20Lite` |
| 活动分类页（动态路由实例化） | `.content/activities/zh.yaml` 的 `event_series[].id` → `/activities/{id}` | `/activities/summits` |

动态路由模板（`[id].vue`、`[...slug].vue`，共 11 个）无法静态枚举的记录到 `dynamicRoutes`，不纳入图。

### MindSpore 双语路由模型

这是与 VitePress 前缀式（`/zh/`、`/en/`）完全不同的模型，locale 展开逻辑必须专门适配：

| 形态 | 示例 | 说明 |
|------|------|------|
| zh 无前缀 | `/install`、`/sig` | 中文默认路由 |
| en 后缀段 | `/install/en`、`/sig/en` | **物理独立 .vue 文件**（`pages/install/en/index.vue`） |
| content 文章 | `/news/zh/1039`、`/news/en/3612` | zh/en 是路径中段（content 目录结构） |

**模板字符串展开规则**（组件中最常见的链接写法）：

| 模板 | 展开结果 |
|------|---------|
| `` `/courses${isZh ? '' : '/en'}` `` | `/courses` + `/courses/en` |
| `` `/developers${isEn ? '/en' : ''}` `` | `/developers` + `/developers/en` |
| `` `/online-showroom/detail?category=${item.type}` `` | 路径静态、query 含运行时变量 → 只取路径 `/online-showroom/detail` |
| `` `/sig/${encodeURIComponent(name)}${isZh ? '' : '/en'}` `` | 路径含运行时变量 → 跳过（由 SIG 动态实例化补边） |

- locale 变量匹配 `isZh` / `isEn` / `locale` / `lang`（含 `.value`），zh 展开为空串、en 展开为 `/en`
- 三元双值模式（`:to="isZh ? '/calendar' : '/calendar/en'"`）两个分支都收集，噪音由 classify 过滤
- `${import.meta.env.VITE_MINDSPORE_URL}` 替换为空串（站内主域名），其它 env 变量跳过

### 全局导航 vs 内容内链的分类原则

全局导航（TheMain/AppFooter/AppFloat/SearchHeader）的链接注入到**所有页面**，如果算作每页出链，会导致：

- 每页 +50 出链，内链密度指标失真
- 入链 Top 全是导航项，掩盖真正需要补链的内容页
- 孤岛数骤降但无 GEO 洞察价值

**正确做法**：全局导航单独归为「全局链接」，不注入到每页出边。页面分四类（互斥不重叠）：

| 类别 | 含义 | GEO 建议 |
|------|------|---------|
| 孤岛 | 无内容上下游且不在导航 | 最高优先级补链 |
| 仅导航 | 无内容上下游但在导航 | 可接受 |
| 内容强·入口弱 | 有内容入链但不在导航 | 建议加导航/加链接 |
| 导航有·内容无 | 在导航但无内容入链 | 建议补内容内链 |

> **关键约束**：「孤岛」和「仅导航」必须互斥不重叠。孤岛 = 无内容上下游 ∧ 不在导航中；仅导航 = 无内容上下游 ∧ 在导航中。

> **本项目的现实特征**：约 2300 篇 content 文章被列表页链接（有入链）但不在导航 → 「内容强·入口弱」天然在 2000+ 量级，这是正常形态而非异常；孤岛数才是核心健康指标（当前 2 个，均经人工复核确认）。

### `.content/` YAML 的链接字段

`.content/` 下的 YAML 通过 OPlusYamlContentVitePlugin 接入（`import xxx from '#content/<dir>'` → 目录下**全部** yaml 按文件名聚合），链接字段（全库实测盘点）：

`href`、`url`、`link`、`link1`、`path`、`_path`、`btn_link`、`code_link`、`file_link`、`live_url`、`html_url`、`video_url`、`videoUrl`、`sig_repo`、`repo`、`etherpad`、`replay_link`、`apply_link`、`home_page`、`htmlPage`、`ppt_link`、`contribution_detail_link`

注意事项：

- 值可能为 `{zh, en}` 双语对象（两值都收集）或 `mailto:`（丢弃）
- 富文本字段（`detail`、`desc` 等）内嵌 `<a href="...">` HTML 链接（如 sig 的申请流程说明）
- `.content/home/` 下的 `news.yaml`、`activities.yaml`、`technology_blogs.yaml` 是 `scripts/create-home-info.mjs` 动态生成的（gitignored，本地存在则扫描），内含首页最新文章链接
- 新增 YAML 字段时检查是否含 URL 值，并在脚本 `URL_FIELD_RE` 常量中补充

### 列表页 → 文章页的动态内链（本地枚举，无需线上 API）

文章列表（`/news`、`/technology-blogs`、`/version-updates`、`/activities` 及 `/en` 版）通过 `getNews` → `queryContent` 运行时查询生成文章链接，`jumpLink = frontmatter.href || _path`。分析器直接枚举 `content/{type}/{lang}/` 目录生成这些边：

- 文章有 frontmatter `href`（如活动跳转 `/summit/summit2025`）→ 列表页链接到该 href
- 无 `href` → 列表页链接到文章页本身（`/{type}/{lang}/{slug}`）

SIG 列表页（`/sig`、`/sig/en`）→ SIG 详情页的边由 SIG API 实例化逻辑补充。

---

## 执行步骤

### 0. 适配项目配置（首次使用时）

脚本位于 `packages/website/scripts/internal-link-analyzer.mjs`，将脚本复制到目标 Nuxt 项目后修改以下配置：

| 配置项 | 说明 | 修改方式 |
|--------|------|---------|
| `INTERNAL_DOMAINS` | 内链域名列表 | 添加目标项目的所有内链域名 |
| `GLOBAL_LAYOUT_COMPONENTS` | 全局布局组件路径 | 检查 `layouts/default.vue`，找到全局注入的 Header/Footer 组件 |
| `CONTENT_ENTRY_MAP` | content 文章 catch-all 入口映射 | 检查 `pages/{type}/[...slug].vue` 的语言版本分布 |
| `LIST_PAGE_MAP` | 列表页 → 文章类型映射 | 检查哪些页面用 `queryContent` 渲染文章列表 |
| `SIG_API` / `SIG_LIST_PAGES` | 动态路由 API 与列表页 | 检查 `nuxt.config.ts` 的 prerender routes 生成逻辑 |
| `PAGES_DIR` / `CONTENT_MD_DIR` / `CONTENT_YAML_DIR` | 目录路径 | 根据项目结构调整 |

### 1. 运行分析脚本

```bash
# 在 packages/website 下运行
node scripts/internal-link-analyzer.mjs

# 或在仓库根运行
node packages/website/scripts/internal-link-analyzer.mjs

# 离线模式（跳过 SIG API，改用 .content/sig 的 sig_info）
SKIP_API=1 node scripts/internal-link-analyzer.mjs

# 产物：internal-link-report.html（仓库根目录，浏览器直接打开）
```

依赖：`js-yaml`（website 包已有，transitive 依赖，与 `create-home-info.mjs` 相同的引用方式）。

### 2. 解读看板

#### 总览卡片

| 卡片 | 含义 | 关注阈值 |
|------|------|---------|
| 页面总数 | vue 静态路由 + content 文章 + 动态实例化页面 | — |
| 内链边总数 | 有向内链边数 | 平均每页 < 1 条 = 严重不足 |
| 孤岛页面 | 无内容链且未入导航 | > 5% = 需补链 |
| 未进入导航 | 不在全局导航中 | — |
| 内容强·入口弱 | 有内容入链但不在导航 | 文章类站点天然大量，看趋势 |
| 导航覆盖页 | 在全局导航中 | — |

#### 页面列表（上下游钻取）

点击任意行展开：

- ▲ 上游内链：哪些页面链接到本页（标题 + 路径）
- ▼ 下游内链：本页链接到哪些页面（标题 + 路径）
- 全局导航：是否在 TheMain/AppFooter/AppFloat/SearchHeader 中

状态筛选支持：孤岛 / 仅导航 / 未进入导航 / 内容强·入口弱 / 导航有·内容无 等。

#### 关系图

- **板块级图**：节点=板块（路径第一段），边宽=链接数，用于发现板块间的链接薄弱区
- **页面级图**：G6 fruchterman 布局，按板块过滤，搜索高亮节点与邻居，双击节点跳转钻取

### 3. 根据看板制定补链方案

优先级排序：

1. **孤岛页面** → 最高优先级，在相关列表页/聚合页中添加链接
2. **内容强·入口弱** → 在全局导航或首页快捷入口中添加链接
3. **导航有·内容无** → 在相关内容页面中添加正文链接
4. **板块间链接薄弱** → 在板块首页添加跨板块推荐链接

---

## 后续优化注意事项

### 1. query 参数驱动的页面未实例化

`/courses/detail?id=`、`/calendar/detail?date=`、`/online-showroom/detail?id=`、`/news/detail?id=`（旧版 JSON 详情）等页面是静态路由 + query 参数形态，页面节点已入图，但指向它们的具体实例链接（运行时拼接）部分无法静态展开（query 含变量的已通过「取路径部分」策略覆盖）。如需完全覆盖，需结合线上 HTML 抓取复核。

### 2. 组件中 `v-for` 动态链接的局限

组件中 `` :href="`/install/${command.value?.version}/${file}`" `` 这类路径含运行时变量的链接无法静态展开（已跳过）。已覆盖的动态链接：

- 列表页 → content 文章（本地枚举）
- SIG 列表 → SIG 详情（API 实例化）
- activities 列表 → 分类页（yaml event_series 实例化）

### 3. 双语数据归属的妥协

组件同时 import `#content/xxx` 的 zh.yaml + en.yaml（如 `homeContent.zh.zone` / `homeContent.en.zone`），静态扫描无法判断组件渲染哪种语言 → 两种语言的链接都归属到引用组件的页面（zh 页与 en 页出链一致）。这与 openEuler 分析器的行为一致，不影响孤岛判定的正确性。

### 4. 新增页面/组件后的维护

当项目新增页面或组件时，重新运行脚本即可，脚本会自动：

- 扫描新增 pages/、content/ 页面
- 递归扫描 import 链与**自动导入组件**（模板标签）
- 调用 SIG API 获取最新 SIG 列表

但以下情况需要手动更新脚本配置：

- 新增全局布局组件 → 添加到 `GLOBAL_LAYOUT_COMPONENTS`
- 新增 content 类型（如新增 `content/blogs/`）→ 更新 `CONTENT_ENTRY_MAP` 与 `LIST_PAGE_MAP`
- 新增动态路由数据源 → 参照 SIG/活动分类添加实例化逻辑
- 新增内链域名 → 添加到 `INTERNAL_DOMAINS`
- 新增 YAML URL 字段名 → 添加到 `URL_FIELD_RE` 常量
- 新增 Nuxt 组件目录（非 `components/`）→ 调整自动导入索引逻辑

### 5. Nuxt 自动导入的命名规则

`buildAutoImportComponentIndex` 按 Nuxt 默认 `pathPrefix: true` 规则建索引：

- `components/home/Banner.vue` → `HomeBanner`
- `components/header/TheMain.vue` → `HeaderTheMain`
- 文件名已含目录前缀时去重：`components/home/calendar/HomeCalendar.vue` → `HomeCalendar`
- 裸文件名（无前缀）在全库唯一时也注册（兜底）

如果项目修改了 `nuxt.config.ts` 的 `components` 配置（如 `pathPrefix: false`），需同步调整索引逻辑。

### 6. 性能考量

- 全量扫描约 2400 页（2300 篇 content 文章）+ 组件链（memo 缓存）+ SIG API 耗时约 15-30 秒
- 页面级 G6 图节点超过 1400 时会限制孤岛节点数（前 200 个），避免浏览器卡死
- 报告 HTML 约 1-2MB（数据内嵌），浏览器直接打开无性能问题

### 7. 报告不入 Git

`internal-link-report.html` 需加入 `.gitignore`，是生成产物不提交。脚本 `packages/website/scripts/internal-link-analyzer.mjs` 入 Git。

### 8. 标题来源

- `definePageMeta({ title: { zh, en } })`（按路由语言取值：`/en` 后缀取 en，其余取 zh）
- content 文章 frontmatter `title`
- SIG 详情页显示 `SIG：{名称}`
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
| 孤岛 / 关键数据 | 孤岛列表、仅导航列表、内容强入口弱、Top 入链/出链、外链域名、动态路由模板、说明与方法论 |

### 页面列表列

| 列 | 内容 |
|----|------|
| 标题 | 页面 title（无标题显示「（无标题）」） |
| 路径 | 页面 pagePath |
| 板块 | 路径第一段（`/news/`、`/sig/`、`/`） |
| 出链 | 下游内链数 |
| 入链 | 上游内链数 |
| 导航 | 在导航/未入导航 |
| 状态 | 孤岛/仅导航/内容孤岛/无入链/已连通 |

### 钻取详情

- 标题 + 路径
- 全局导航状态 + 来源组件
- ▲ 上游内链列表（标题 + 路径，可点击跳转钻取）
- ▼ 下游内链列表（标题 + 路径，可点击跳转钻取）
- 外链域名列表

### 状态筛选选项

| 选项 | 筛选条件 |
|------|---------|
| 孤岛(无内容无导航) | `isOrphan: true` |
| 仅导航 | `isContentOrphan && inGlobalNav` |
| 未进入导航 | `!inGlobalNav` |
| 内容强·入口弱 | `inCount > 0 && !inGlobalNav` |
| 导航有·内容无 | `inGlobalNav && inCount === 0` |
| 无内容上下游 | `isContentOrphan` |
| 有上下游 | `inCount > 0 && outCount > 0` |

### 孤岛 / 关键数据页签内容

1. 孤岛页面（无内容链且未入导航）+ 「最高优先级补链」标注
2. 仅靠导航存活（无内容上下游但在导航中）
3. 内容强·入口弱（有内容入链但不在导航）+ 「建议加导航/补链接」标注
4. 导航有·内容无（在导航但无内容入链）+ 「建议补内容内链」标注
5. 全局导航覆盖页面列表（标题 + 路径 + 来源组件）
6. 入链最多 / 出链最多 Top 20（带条形图）
7. 外链域名 Top 25（带条形图）
8. 动态路由模板列表（未纳入图的 `[id]` / `[...slug]` 模板）
9. 说明与方法论（数据来源、判定逻辑、四类页面分类说明）

---

## 检查清单

运行分析前（首次适配项目时）：

- [ ] 确认 `INTERNAL_DOMAINS` 包含所有内链域名（本项目：`www.mindspore.cn`）
- [ ] 确认 `GLOBAL_LAYOUT_COMPONENTS` 包含所有全局布局组件（检查 `layouts/default.vue` 与 `layouts/search.vue`）
- [ ] 确认 `CONTENT_ENTRY_MAP` 覆盖所有 content 类型的 catch-all 入口（含语言版本）
- [ ] 确认 `LIST_PAGE_MAP` 覆盖所有 `queryContent` 文章列表页
- [ ] 确认 SIG/活动分类等动态路由实例化配置正确（对照 `nuxt.config.ts` 的 prerender routes）
- [ ] 确认 `URL_FIELD_RE` 覆盖 `.content/` YAML 的 URL 字段名
- [ ] 确认 Nuxt 组件自动导入索引与项目 `components` 配置一致
- [ ] 确认 `internal-link-report.html` 已加入 `.gitignore`

运行分析后（每次运行后）：

- [ ] 孤岛数 < 5% × 总页面数（否则需补链；本项目当前 2/2436 ≈ 0.08%）
- [ ] 孤岛与仅导航列表零重叠（验证 `orphanPages ∩ contentOrphanPages = ∅`）
- [ ] 抽查孤岛页面是否确实无入链（排除脚本遗漏，全局搜索路径字符串）
- [ ] 抽查全局导航覆盖数是否合理（本项目约 50 页）
- [ ] 抽查首页/重点页出链是否完整（对照页面实际渲染的 banner/zone 链接）
- [ ] 检查板块关系图是否有明显断连的板块
- [ ] `npx eslint packages/website/scripts/internal-link-analyzer.mjs` 无 error
