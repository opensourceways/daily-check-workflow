---
name: internal-link-analyzer
version: "2.0.0"
description: '站内内链分析与孤岛页面排查：扫描 VitePress 项目的全部 .md 页面、Vue 视图组件、i18n 数据文件、.content/ YAML 内容数据、全局布局组件与分类布局组件中的静态链接，调用线上列表 API 补充动态生成的文章内链，构建有向内链图，输出自包含 HTML 看板（含板块级/页面级 G6 关系图、上下游钻取表格、孤岛/无入链页面列表）。用于 GEO/SEO 优化场景下识别内链密度短板、定位需要补链的孤岛页面。触发词："内链分析"、"内链看板"、"孤岛页面"、"链接密度"、"站内链接关系图"、"internal link analysis"、"orphan pages"、"补链优化"、"GEO 内链"。'
license: MIT
metadata:
  author: persimmonzzz
  version: "2.0.0"
  tags:
    - seo
    - geo
    - internal-links
    - vitepress
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

# Internal Link Analyzer

分析 VitePress 项目的站内内链结构，识别孤岛页面、内链密度短板，为 GEO/SEO 优化提供数据支撑。输出自包含 HTML 看板（G6 关系图 + 上下游钻取表格 + 孤岛列表）。

## 适用场景

- 需要识别哪些页面缺少入链（SEO 爬虫难以发现）
- 需要评估内链密度是否足够（GEO 要求页面间有丰富的语义链接）
- 需要定位「孤岛」页面（既无内容内链又不在全局导航中）
- 需要可视化整个站点的链接关系（板块级 + 页面级关系图）

## 不适用场景

- 外链分析（外链域名仅统计，不分析外链关系）
- 页面内容质量评估（仅分析链接结构，不评估内容）
- 线上 HTML 抓取（本工具是静态分析 + API 补充，不抓取线上页面）

---

## 核心思想

### 链接来源的七层模型

VitePress 项目的链接来源不是单一的，必须按以下七层逐一提取，否则会大量漏链：

| 层 | 来源 | 注入方式 | 处理策略 |
|---|------|---------|---------|
| 1 | `.md` 正文 | Markdown 文件直接书写 | 提取 `[text](url)` + 裸 URL |
| 2 | `.md` `<script setup>` 引用的 Vue 组件 | 组件 import 链 | 递归扫描组件（5 层深度） |
| 3 | i18n 数据文件（`header-zh.ts` 等） | 组件 `import { useI18n }` | TS 对象属性 `href: '...'` 提取 |
| 4 | `.content/` YAML 内容数据 | `#content/` 虚拟模块 | YAML URL 字段提取（见下方字段列表） |
| 5 | 线上 API（新闻/博客/案例列表） | 组件运行时 `fetch` | 调用 API 补充 list→article 边 |
| 6 | 全局布局组件（AppHeader/AppFooter） | 主题 Layout 全局注入 | 单独归类为全局导航，**不注入每页出边** |
| 7 | 分类布局组件（LayoutAboutUs/LayoutSecurity 等） | 主题 Layout 按 category 动态注入 | 链接注入到同 category 的页面出边 |

> **最常遗漏的是第 4、6、7 层**。如果只扫描 .md 正文 + 组件静态链接，孤岛数会虚高 5-10 倍。

### 全局导航 vs 内容内链的分类原则

全局导航（AppHeader/AppFooter）的链接注入到**所有页面**，如果算作每页出链，会导致：
- 每页 +80 出链，内链密度指标失真
- 入链 Top 全是导航项，掩盖真正需要补链的内容页
- 孤岛数骤降但无 GEO 洞察价值

**正确做法**：全局导航单独归为「全局链接」，不注入到每页出边。页面分四类（互斥不重叠）：

| 类别 | 含义 | GEO 建议 |
|------|------|---------|
| 孤岛 | 无内容链且未入导航 | 最高优先级补链 |
| 仅导航 | 无内容上下游但在导航中 | 可接受 |
| 内容强·入口弱 | 有内容入链但不在导航 | 建议加导航/加链接 |
| 导航有·内容无 | 在导航但无内容入链 | 建议补内容内链 |

> **关键约束**：「孤岛」和「仅导航」必须互斥不重叠。孤岛 = 无内容上下游 ∧ 不在导航中；仅导航 = 无内容上下游 ∧ 在导航中。

### `.content/` YAML 的链接字段与三种格式

`.content/` 下的 YAML 文件通过 `OPlusYamlContentVitePlugin` 接入 VitePress，包含大量链接，但格式不统一：

**需提取的 URL 字段名**（不止 `href`/`url`/`path`/`link`）：

| 字段名 | 用途 | 示例 |
|--------|------|------|
| `href` | 通用链接 | `href: /zh/sig/sig-list/` |
| `url` | 项目详情链接 | `url: /projects/intelligence-boom` |
| `path` | 页面/PDF 路径 | `path: zh/annual-report/openEuler-annual-report-2025/` |
| `link` | 侧边栏路径段 | `link: charter` |
| `htmlPage` | 白皮书 HTML 预览页 | `htmlPage: /zh/whitepaper/openEuler-24.03-LTS-SP4-Technical-White-Paper` |
| `replay_link` | 直播回放链接 | `replay_link: /zh/interaction/summit-list/summit2025/#live` |
| `apply_event` / `apply_link` | 报名链接 | `apply_event: /zh/interaction/event-list/#activity-apply` |
| `contribution_detail_link` | 贡献详情链接 | `contribution_detail_link: https://datastat.openeuler.org/...` |

> **注意**：字段名不固定，新增 YAML 字段时需检查是否含 URL 值，并在脚本 `URL_FIELDS` 常量中补充。

**三种链接格式**：

| 格式 | 示例 | 提取方式 |
|------|------|---------|
| 完整路径 | `href: /zh/sig/sig-list/` | 直接提取 |
| 去 locale 路径 | `url: /projects/intelligence-boom` | 补全 → `/zh/projects/...` + `/en/projects/...` |
| 路径段 | `link: charter`（在 community/zh.yaml 中） | 按 YAML 目录推断 base path → `/{locale}/community/charter/` |

> **路径段格式最易遗漏**：`link: ai-coding-assistants` 不是 URL，但在 community 上下文中拼接为 `/{locale}/community/ai-coding-assistants/`。需要根据 YAML 文件在 `.content/` 下的路径推断 contentBasePath。

### 模板字符串链接的处理

组件中的链接常用模板字符串，必须展开后才能判定内链：

| 模板 | 来源 | 展开方式 |
|------|------|---------|
| `` `${locale}/download/` `` | 组件动态拼接 | 替换 `${locale}` → `zh` + `en` 两份 |
| `` `/${lang.value}/security/certificate-center/` `` | Layout 组件 computed | 替换 `${lang.value}` → `zh` + `en` 两份 |
| `` `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/other/legal/` `` | footer data | 替换为空（站内域名），剩余 `/zh/other/legal/` |
| `` `/${lang}${item.url}` `` | 组件 + YAML 数据 | YAML 提取 `url` 值 + 组件模板拼接，需组合处理 |

**locale 展开正则**：同时匹配 `${locale}` / `${locale.value}` / `${lang}` / `${lang.value}`，不能只匹配 `${locale}`。

**模板字符串提取需匹配的模式**：

| 模式 | 来源 | 正则 |
|------|------|------|
| `href="..."` / `href='...'` | HTML 属性 | `href\s*=\s*(?:"..."|'...')` |
| `href: '...'` / `url: '...'` | TS 对象属性 | `(?:href\|url\|path\|link)\s*:\s*(?:"..."|'...')` |
| `router.go(\`...\`)` | 编程式导航 | `.go\s*[(=]?\s*\`...\`` |
| `:to="..."` / `.push(\`...\`)` | router-link / 编程式 | `(?:\bto\|\.push)\s*[(=]?\s*\`...\`` |
| `return \`/${lang}...\`` | computed 返回值 | `return\s+\`(?:\/...\|https://...\|\${...}\/...)` |

> **注意**：`return \`...\`` 模式必须过滤非 URL 值（如 `return \`last-cell-0\``），仅匹配以 `/`、`https://` 或 `${` 开头的模板字符串。

### 分类布局组件的链接归属

VitePress 主题 Layout（`App.vue`）通过 `compMapping[frontmatter.category]` 动态选择布局组件。这些布局组件可能 import 了 content YAML（侧边栏导航），也可能在组件内部用 `router.go()` / `computed` 生成动态链接。

所有分类布局组件需逐一注册到 `CATEGORY_LAYOUT_COMPONENTS` 映射中，对应 `App.vue` 的 `compMapping`：

| category | 布局组件 | 链接来源 |
|----------|---------|---------|
| `about-us` | LayoutAboutUs.vue | `#content/community` YAML（侧边栏路径段链接） |
| `wiki` | LayoutWiki.vue | `#content/wiki` YAML |
| `faq` | LayoutFAQ.vue | `#content/faq` YAML |
| `migration` | LayoutMigration.vue | `#content/migration` YAML |
| `security` | LayoutSecurity.vue | `router.go()` + `computed` 中的模板字符串 |
| `white-paper` | LayouWhitePaper.vue | `router.go()` 中的模板字符串 |

这些布局组件**不在 .md 的 import 链上**（它们由 App.vue 动态注入），但其链接应该归属于使用该 category 的所有页面。

处理方式：读取每个 .md 的 frontmatter `category`，将布局组件的链接（包括 content YAML + 组件内 `router.go` / `computed` 模板字符串）注入到同 category 的所有页面的出边中。

---

## 执行步骤

### 0. 适配项目配置（首次使用时）

将脚本 `scripts/internal-link-analyzer.js` 复制到目标项目，并修改以下配置：

| 配置项 | 说明 | 修改方式 |
|--------|------|---------|
| `INTERNAL_DOMAINS` | 内链域名列表 | 添加目标项目的所有内链域名 |
| `GLOBAL_LAYOUT_COMPONENTS` | 全局布局组件路径 | 检查 `theme/index.ts` 的 Layout，找到全局注入的 Header/Footer 组件 |
| `CATEGORY_LAYOUT_COMPONENTS` | 分类布局组件映射 | 检查 `App.vue` 的 `compMapping`，为每个 category 注册布局组件 |
| `fetchApiArticles` 的 `endpoints` | 线上列表 API | 添加新闻/博客/案例列表 API（如无 API 可用 `SKIP_API=1`） |
| `SRC_NEW` / `SRC_OLD` | 源码目录 | 根据项目结构调整（部分项目可能只有 `src/`） |
| `APP` | 应用目录 | 通常为 `app/`，部分项目可能为 `packages/website/` |

### 1. 运行分析脚本

```bash
node scripts/internal-link-analyzer.js
# 产物：internal-link-report.html（仓库根目录，浏览器直接打开）
```

环境变量：
- `SKIP_API=1`：跳过 API 调用（离线模式，仅静态分析）

### 2. 解读看板

#### 总览卡片

| 卡片 | 含义 | 关注阈值 |
|------|------|---------|
| 页面总数 | 扫描到的 .md 页面数 | — |
| 内链边总数 | 有向内链边数 | 平均每页 < 1 条 = 严重不足 |
| 孤岛页面 | 无内容链且未入导航 | > 5% = 需补链 |
| 未进入导航 | 不在 AppHeader/AppFooter 中 | — |
| 内容强·入口弱 | 有内容入链但不在导航 | 建议加导航 |
| 导航覆盖页 | 在全局导航中 | — |

#### 页面列表（上下游钻取）

点击任意行展开：
- ▲ 上游内链：哪些页面链接到本页（标题 + 路径）
- ▼ 下游内链：本页链接到哪些页面（标题 + 路径）
- 全局导航：是否在 AppHeader/AppFooter 中

状态筛选支持：孤岛 / 仅导航 / 未进入导航 / 内容强·入口弱 / 导航有·内容无 等。

#### 关系图

- **板块级图**：节点=板块，边宽=链接数，用于发现板块间的链接薄弱区
- **页面级图**：G6 fruchterman 布局，按板块过滤，搜索高亮节点与邻居，双击节点跳转钻取

### 3. 根据看板制定补链方案

优先级排序：
1. **孤岛页面** → 最高优先级，在相关列表页/聚合页中添加链接
2. **内容强·入口弱** → 在全局导航或首页快捷入口中添加链接
3. **导航有·内容无** → 在相关内容页面中添加正文链接
4. **板块间链接薄弱** → 在板块首页添加跨板块推荐链接

---

## 后续优化注意事项

### 1. 动态路由未纳入

`[sig].md` 等动态路由模板由 API 动态生成，无法静态枚举。SIG 详情页等完全由 API 驱动的动态路由未纳入图。如需覆盖，需要：
- 调用 SIG 列表 API 获取全部 SIG name
- 为每个 SIG 生成虚拟页面节点
- 分析 `[sig].md` 模板中的链接结构

### 2. 组件中 `v-for` 动态链接的局限

组件中 `` :href="`/${locale}${item.path}.html`" `` 这类链接，`item.path` 来自运行时 API 返回的数据。已通过调用 API 的 `textContent` 字段补充部分文章正文内链，但仍有局限：
- API 返回的 `textContent` 是纯文本（非 HTML），部分 Markdown 链接格式丢失
- 部分旧文章可能不在 API 索引中

如需完全覆盖，建议结合线上 HTML 抓取复核。

### 3. 新增页面/组件后的维护

当项目新增页面或组件时，需要重新运行脚本刷新报告。脚本会自动：
- 扫描新增的 .md 页面
- 递归扫描新增组件的 import 链
- 调用 API 获取最新文章列表

但以下情况需要手动更新脚本配置：
- 新增全局布局组件 → 添加到 `GLOBAL_LAYOUT_COMPONENTS`
- 新增分类布局组件 → 添加到 `CATEGORY_LAYOUT_COMPONENTS`
- 新增 API 数据源 → 添加到 `fetchApiArticles` 的 `endpoints`
- 新增内链域名 → 添加到 `INTERNAL_DOMAINS`
- 新增 YAML URL 字段名 → 添加到 `extractYamlLinks` 的 `URL_FIELDS` 常量

### 4. YAML 路径段链接的推断局限

`extractYamlLinks` 通过 YAML 文件在 `.content/` 下的路径推断 contentBasePath（如 `.content/community/zh.yaml` → base path `community`）。如果出现非标准路径映射（如 YAML 在 `.content/foo/` 但消费页面的 base path 是 `/zh/bar/`），需要手动维护映射表。

### 5. i18n 跳过策略

普通组件递归扫描时跳过 i18n 目录（`skipI18n: true`），避免导航链接通过 import 链污染每页出边。但全局布局组件扫描**不跳过** i18n（因为 AppHeader 的导航数据来自 i18n 的 `NAV_ROUTER`）。

### 6. `#content/` 别名解析

`resolveImport` 对 `#content/` 返回 YAML 文件路径数组（zh + en），而非单个文件。`scanComponent` 遇到 YAML 文件时用 `extractYamlLinks` 提取链接，不递归 import。

### 7. 性能考量

- 全量扫描约 1800 页 + 递归组件 + 多个 API（约 1500 篇文章）耗时约 10-15 秒
- 页面级 G6 图节点超过 1400 时会限制孤岛节点数（前 200 个），避免浏览器卡死
- 报告 HTML 约 700KB（数据内嵌），浏览器直接打开无性能问题

### 8. 报告不入 Git

`internal-link-report.html` 需加入 `.gitignore`，是生成产物不提交。脚本 `scripts/internal-link-analyzer.js` 入 Git。

### 9. 标题来源

- `.md` frontmatter `title` 字段
- API 返回的 `title` 字段（API 优先）
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
| 孤岛 / 关键数据 | 孤岛列表、仅导航列表、内容强入口弱、Top 入链/出链、外链域名 |

### 页面列表列

| 列 | 内容 |
|----|------|
| 标题 | 页面 title（无标题显示「（无标题）」） |
| 路径 | 页面 pagePath |
| 板块 | `/{locale}/{section}/` |
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
8. 说明与方法论（数据来源、判定逻辑、四类页面分类说明）

---

## 检查清单

运行分析前（首次适配项目时）：
- [ ] 确认 `INTERNAL_DOMAINS` 包含所有内链域名
- [ ] 确认 `GLOBAL_LAYOUT_COMPONENTS` 包含所有全局布局组件（检查 `theme/index.ts` 的 Layout）
- [ ] 确认 `CATEGORY_LAYOUT_COMPONENTS` 包含所有分类布局组件（检查 `App.vue` 的 `compMapping`）
- [ ] 确认 `fetchApiArticles` 的 `endpoints` 包含所有列表 API
- [ ] 确认 `SRC_NEW` / `SRC_OLD` / `APP` 路径正确
- [ ] 确认 `URL_FIELDS` 覆盖目标项目的 YAML URL 字段名
- [ ] 确认 `internal-link-report.html` 已加入 `.gitignore`

运行分析后（每次运行后）：
- [ ] 孤岛数 < 5% × 总页面数（否则需补链）
- [ ] 孤岛与仅导航列表零重叠（验证 `orphanPages ∩ contentOrphanPages = ∅`）
- [ ] 抽查孤岛页面是否确实无入链（排除脚本遗漏）
- [ ] 抽查全局导航覆盖数是否合理（通常 50-120 页）
- [ ] 检查板块关系图是否有明显断连的板块
- [ ] `npx eslint scripts/internal-link-analyzer.js` 无 error
