---
name: internal-link-analyzer
description: '站内内链分析与孤岛页面排查（Nuxt 3 版）：扫描 packages/website/pages/ 全部 .vue 页面、视图组件递归链（显式 import + Nuxt 自动导入）、.content/ YAML 内容数据、config/statement/ 声明 Markdown、content/ 资讯 Markdown，调用线上 API（规范/白皮书/会议）枚举动态路由实例，构建有向内链图，输出自包含 HTML 看板（板块级/页面级 G6 关系图、上下游钻取表格、孤岛/无入链页面列表、管理页过滤开关、重定向跳板页识别）。用于 GEO/SEO 优化场景下识别内链密度短板、定位需要补链的孤岛页面。触发词："内链分析"、"内链看板"、"孤岛页面"、"链接密度"、"站内链接关系图"、"internal link analysis"、"orphan pages"、"补链优化"、"GEO 内链"。'
license: MIT
metadata:
  author: persimmonzzz
  version: "1.2.0"
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

# Internal Link Analyzer（UnifiedBus Portal · Nuxt 3 版）

分析灵衢社区官网（Nuxt 3 SSG/SPA 混合架构）的站内内链结构，识别孤岛页面、内链密度短板，为 GEO/SEO 优化提供数据支撑。输出自包含 HTML 看板（G6 关系图 + 上下游钻取表格 + 孤岛列表 + 管理页过滤）。

## 适用场景

- 需要识别哪些页面缺少入链（SEO 爬虫难以发现）
- 需要评估内链密度是否足够（GEO 要求页面间有丰富的语义链接）
- 需要定位「孤岛」页面（既无内容内链又不在全局导航中）
- 需要可视化整个站点的链接关系（板块级 + 页面级关系图）
- 需要排查死路由（如 `/meeting/create` 这类无任何引用的遗留页面）

## 不适用场景

- 外链分析（外链域名仅统计，不分析外链关系）
- 页面内容质量评估（仅分析链接结构，不评估内容）
- 线上 HTML 抓取（本工具是静态分析 + API 补充，不抓取线上页面）

---

## 核心思想

### 链接来源的七层模型（Nuxt 3 项目）

本项目的链接来源不是单一的，必须按以下七层逐一提取，否则会大量漏链：

| 层 | 来源 | 注入方式 | 处理策略 |
|---|------|---------|---------|
| 1 | `pages/**/*.vue` 页面文件 | Nuxt 文件路由 | 提取模板 `href/:href/:to` + script 链接 |
| 2 | 页面 import 的视图组件（`views/**`） | 显式 import（页面→视图一律显式） | 递归扫描（6 层深度） |
| 3 | 组件/composable 自动导入 | Nuxt auto-import（无 import 语句） | 解析 `.nuxt/components.d.ts`（权威注册表）+ `composables/` 导出名索引，按模板标签 / `useXxx(` 调用反查 |
| 4 | `.content/` YAML 内容数据（nav/home/learning/software/simulation） | `#content/` 虚拟模块（OPlusYamlContentVitePlugin） | YAML URL 字段提取（见下方字段列表） |
| 5 | `config/statement/{zh,en}/*.md` 声明 Markdown | TheStatement 按 `category` 静态绑定渲染（`import.meta.glob` raw） | Markdown `[text](url)` 链接归属到 `<TheStatement category="x">` 的声明页（如 privacy → 个人信息收集清单/第三方共享清单/cookies） |
| 6 | 线上 API（规范/白皮书/会议）+ `content/` 资讯 Markdown | 运行时 fetch / @nuxt/content | API 枚举动态实例，补 list→detail 边 |
| 7 | 全局布局（`layouts/default.vue` → AppHeader/AppHeaderMobile/AppFooter/CookieNotice） | Nuxt layout 全局注入 | 单独归类为全局导航，**不注入每页出边** |

> **最常遗漏的是第 3、5、7 层**。本项目导航数据不在组件里，而在 `.content/nav/{zh,en}.yaml`，经 `useNavs → useNavContent → #content/nav` 链路进入 AppHeader——必须沿 composable 调用链追踪。声明页（privacy/terms 等）的正文在 `config/statement/` 的 md 里而非 .vue 模板——漏掉该层会把 privacy 已内链的清单页误判为孤岛（v1.0.0 的实际教训）。若只扫 .vue 静态字符串，全局导航会完全丢失。

### 全局导航 vs 内容内链的分类原则

全局导航（AppHeader/AppFooter 引用链）的链接注入到**所有页面**，如果算作每页出链会导致内链密度指标失真、入链 Top 全是导航项。**正确做法**：全局导航单独归为「全局链接」。页面分四类（互斥不重叠）：

| 类别 | 含义 | GEO 建议 |
|------|------|---------|
| 孤岛 | 无内容链且未入导航 | 最高优先级补链 |
| 仅导航 | 无内容上下游但在导航中 | 可接受 |
| 内容强·入口弱 | 有内容入链但不在导航 | 建议加导航/加链接 |
| 导航有·内容无 | 在导航但无内容入链 | 建议补内容内链 |

> **本项目特有**：`CookieNotice.vue` import 了 `config/common.ts`（取 cookie key），会顺带把 `MY_MENUS`（my 侧边栏菜单）带入 layouts 扫描链。全局导航扫描时必须排除该文件的链接（脚本 `GLOBAL_NAV_SKIP_FILES`），否则 my/* 页面会被误判为「在导航中」。

### 本项目的链接书写模式（提取规则集）

| 模式 | 示例 | 提取方式 |
|------|------|---------|
| NuxtLink `:to` 模板串 | `` :to="`/${currentLocale}/feedback/detail/${row.id}`" `` | locale 变量展开 zh+en，`${row.id}` → `:param` 匹配动态模板 |
| 无前导斜杠相对链接 | `` :href="`${currentLocale}/privacy`" ``（AppFooter） | 展开后 `zh/privacy` → 补全 `/zh/privacy` |
| locale-less 路径 | `path: '/my/profile'`（MY_MENUS）、`software_link: '/software/ub-os-component'`（EXTRA_CONFIG） | 按 `handleUrl` 运行时约定展开为 `/zh` + `/en` 两版 |
| 编程式导航 | `navigateTo()` / `router.push/replace()` / `redirect()` / `handleUrl()` | `navRe` 正则捕获首参字符串/模板串 |
| `isPhone` 三元分流 | `` `/${currentLocale.value}/docs/${isPhone.value ? 'mobile/' : ''}${name}` `` | 移除 `${isPhone…}` 段，取 PC 形态 |
| `definePageMeta` backUrl | `backUrl: '/'`、`backUrl: '/learning/video-collection'` | AppHeaderMobile 返回按钮消费（移动端出链），localeless 展开为 zh+en；同语义的 `back:` 全仓无消费方（死配置），不计 |
| 字符串变换跳转 | `route.fullPath.replace('/docs/', '/docs/mobile/')` | **不提取**（第一参是被替换模式非目标 URL，navRe 已限定 `router.replace`） |
| YAML banner 文档标识 | `id: UB-Base-Specification-2.1.0-zh`（home yaml） | 映射为 `/{locale}/docs/{id}`（HomeBanner getDocViewUrl 的运行时行为） |
| 环境哨兵 | `__ENV:VITE_CDN_DOMAIN__/…`、`${import.meta.env.VITE_LOGIN_ORIGIN}/…` | 跳过（外部域，无法静态解析） |

**locale 展开正则**：同时匹配 `${currentLocale}` / `${currentLocale.value}` / `${locale}` / `${lang}` / `${anotherLang}`（含 `.value`），不能只匹配一种写法。

**跨语言边过滤**：`${currentLocale}` 展开会对每页产生 zh/en 两份链接，但 `pages/zh/**` 运行时只渲染本语言版本。脚本在 `addEdge` 中过滤跨语言边（zh→en / en→zh），语言切换属 UI 功能，不计入内容内链。

### 动态路由的模板/实例双层模型

本项目 50 个动态路由模板（`[name].vue` / `[...slug].vue`）分两类处理：

| 类型 | 模板 | 实例枚举来源 |
|------|------|-------------|
| **可枚举** | `docs/[name]`、`white-papers/[name]`、`news/[...slug]`、`meeting/replay/[...slug]`、`docs/version/[type]` | API（docs/white-paper/meeting 接口）、content/ 资讯 Markdown、静态链接中的具体 URL（如 video-collection/list 的 3 个 id） |
| **不可枚举** | `guid/*/detail/[id]`、`feedback/detail/[id]` 等 id 驱动页面 | 无（登录态数据），以**模板节点**代表全部实例 |

- 具体链接（无 `:param`）命中模板 → 注册为**实例页**，边指向实例
- 动态链接（含 `:param`）→ 边指向**模板节点**（聚合代表）
- **有实例的模板节点豁免孤岛判定**（如 `news/*slug` 有 31 个实例各自有入链，模板本身不算孤岛）
- **模板页壳出链归属到模板 + 全部实例**：模板 .vue（如 `news/[...slug].vue` → TheNewsDetail 面包屑 → `/zh/news`）的出链是每个实例页都渲染的公共 UI（面包屑/返回按钮），需同时加到模板节点与每个实例页的出边（source 标注「模板页壳」）。**漏掉这层会把所有详情页误判为出链 0**（v1.1.0 的实际教训）。注意排除 `config/common.ts`（视图常 import 其 LOCALE_RESOURCES_MAP，会顺带把 MY_MENUS 带入非 my 页面）

### 内链判定

- 域名：`www.unifiedbus.com` / `unifiedbus.com`
- 路径：`/zh/…`、`/en/…`（含规范化后的 `zh/…` 相对写法）
- 排除：`/api-*`（接口直链）、`/category|/statement|/_ipx|/nav`（资源）、文件后缀（pdf/png/…）
- `cdn.unifiedbus.com`、`id.unifiedbus.com` 计入**外链域名统计**（非内容页）

### 重定向跳板页模型（本项目特有）

部分页面**无自身内容、进入即跳转**，不参与孤岛/无入链优化统计（对 GEO 无补链价值），但跳转目标边保留：

| 模式 | 示例 | 页面 |
|------|------|------|
| `definePageMeta({ redirect })` | `/zh/legal → /zh/terms-of-use`、`/zh/software → /zh/software/ub-os-component` | legal、software（zh+en） |
| 空模板 + `onMounted navigateTo` | `/zh/guid → /zh/guid/vendor/list` | guid（zh+en） |
| 根 SPA 重定向 | `pages/index.vue` | 已跳过不入图 |

识别后标记 `isRedirect`，看板单独列出（「重定向跳板页」面板）。

### 管理页过滤（本项目特有）

`my/*`、guid 管理/审核、feedback 审核/详情、meeting 创建/编辑、`docs/license-agree`、`docs/mobile` 共约 76 页为管理/登录态页面，对 GEO 无优化价值。看板提供「隐藏管理/登录页」开关，一键聚焦公开内容页（脚本 `AUTH_PAGE_RE` 维护模式列表）。

> **注意**：`config/common.ts` 的 `LOGIN_GUARD_LIST`（`/zh/my`、`/zh/guid`、`/zh/feedback`、`/zh/docs/`）是**软守卫**——中间件仅 `await tryLogin()` 等待登录结果，**不拦截未登录访问**。docs/guid/feedback 首页仍是公开可渲染的内容页，不得标为管理页。

---

## 执行步骤

### 0. 前置

```bash
pnpm merge   # 拉取资讯内容（content/{zh,en}/news）；需 gitcode 凭据，缺失时脚本自动跳过并提示
```

### 1. 运行分析脚本

```bash
node scripts/internal-link-analyzer.js
# 产物：internal-link-report.html（仓库根目录，浏览器直接打开，已 gitignore）
```

环境变量：
- `SKIP_API=1`：跳过 API 调用（离线模式，仅静态分析）
- `SKIP_CONTENT=1`：跳过 content/ 资讯扫描

### 2. 解读看板

#### 总览卡片（随「隐藏管理页」开关联动重算）

| 卡片 | 含义 | 关注阈值 |
|------|------|---------|
| 页面总数 | 静态 + 模板 + 动态实例 | — |
| 内链边总数 | 有向内链边 | 平均每页 < 1 条 = 严重不足 |
| 孤岛页面 | 无内容链且未入导航 | > 5% = 需补链 |
| 未进入导航 | 不在 AppHeader/AppFooter 链中 | — |
| 内容强·入口弱 | 有内容入链但不在导航 | 建议加导航 |
| 导航覆盖页 | 在全局导航中 | — |

#### 页面列表（上下游钻取）

点击任意行展开：▲ 上游内链 / ▼ 下游内链 / 全局导航状态 / 外链域名。每页带类型徽标（静态/模板/资讯/规范/白皮书/会议/实例）与管理页标记。

#### 关系图

- **板块级图**：节点=板块，边宽=链接数，用于发现板块间链接薄弱区
- **页面级图**：G6 fruchterman 布局，按板块过滤，搜索高亮节点与邻居，双击节点跳转钻取（孤岛节点红色）

### 3. 根据看板制定补链方案

优先级排序：
1. **孤岛页面** → 最高优先级。在相关列表页/聚合页中添加链接，或确认是否为死路由（如 `/meeting/create` 实际入口在 `/my/meeting/create`，属可下线遗留页）
2. **导航有·内容无**（如 simulation、cookies）→ 在相关内容页正文/资讯文章中补语义链接
3. **内容强·入口弱** → 评估是否加入导航或首页快捷入口
4. **板块间链接薄弱** → 在板块首页添加跨板块推荐（看板块关系图断连区）

### 4. 历史基线参考（2026-10-23 修订版，v1.2.0）

| 指标 | 数值 | 结论 |
|------|------|------|
| 页面总数 | 234（静态 95 / 模板 50 / 实例 89） | — |
| 内链边 | 801（平均 3.4 条/页） | 密度中等，仍有提升空间 |
| 孤岛 | 7（协议页 3、死路由 4） | `specification-license-agreement-v{1,2}` 独立路由无入链（弹窗另有入口）；`/meeting/create\|edit` 为死路由（实际入口 `/my/meeting/*`） |
| 重定向跳板页 | 6（guid/legal/software × zh+en） | 非内容页，不参与统计 |
| 导航覆盖 | 18 页 | 覆盖率低但项目以内容页为主，可接受 |
| 详情页出链 | news 3 条（面包屑）、replay 2 条（面包屑）、docs 4 条、white-papers 1 条 | 均为功能性返回，缺语义推荐链接 |

> 版本修订记录：
> - v1.0.0 → v1.1.0：补扫 `config/statement/` 声明 md 层（+6 边），法务清单页非孤岛；新增重定向跳板页识别
> - v1.1.0 → v1.2.0：**补扫动态模板页壳出链**（面包屑/backUrl，+322 边）——此前详情页出链全为 0 系脚本漏扫所致（news 详情明明有面包屑回新闻聚合页）；`navRe` 限定 `router.replace` 消除 `str.replace` 误提取（曾产生 `/zh/docs/mobile` 假实例）；模板壳扫描排除 `config/common.ts`（MY_MENUS 曾污染 docs/white-papers 出链）

---

## 脚本配置维护（新增页面/组件时）

| 变更 | 需更新 |
|------|--------|
| 新增全局布局组件 | `GLOBAL_LAYOUT_COMPONENTS`（layouts/default.vue 的引用链） |
| 新增管理/登录态路由模式 | `AUTH_PAGE_RE` |
| 新增 YAML URL 字段 | `extractYamlLinks` 的 `YAML_URL_FIELDS` |
| 新增内链域名 | `INTERNAL_DOMAINS` |
| 新增「链路顺带引入但非导航」的数据文件 | `GLOBAL_NAV_SKIP_FILES` |
| 新增 API 数据源 | `fetchApiData` |
| 新增声明页/声明 md | 无需改脚本（TheStatement category 静态绑定自动匹配） |
| 新增重定向跳板页 | 无需改脚本（definePageMeta redirect / 空模板跳转自动识别） |
| 页脚新增法务链接 | 无需改脚本（AppFooter 链自动进全局导航） |

**无需手动更新**的部分：新增静态页面/视图组件/YAML banner（自动扫描）；`.nuxt/components.d.ts` 变化（每次运行时重新解析）。

## 已知局限

1. **动态拼接的导航链接**：HeaderUser 头像菜单 `` `/${currentLocale.value}/my/${isPhone…}` `` 含运行时三元，`my/profile` 的导航入链丢失（可在看板人工核对）。
2. **`route.fullPath.replace('/docs/', '/docs/mobile/')`** 类字符串变换跳转无法静态提取，`docs/mobile/:name` 模板无静态入链（实际由 PC 预览页路由跳转到达，且已归入管理页可过滤；模板自身有壳出链不算孤岛）。
3. **error.vue**（错误页 → /zh、/en）与 **nuxt.config.ts** llms/sitemap 链接未计入。
4. **activity API** 当前无 href 字段，未纳入；会议回放按运行时快照枚举，新会议需重跑。
5. **specification-license-agreement-v{1,2}** 孤岛为「弹窗内容页的独立路由版」，实际经弹窗交互到达，补链价值需结合业务判断。

## 检查清单

运行分析后（每次）：
- [ ] 孤岛数 < 5% × 公开页面数（管理页过滤后）
- [ ] 孤岛与仅导航列表零重叠
- [ ] 详情页出链核对：news 文章应含面包屑（→ /{locale}/news 或 /{locale}）、会议回放应含面包屑（→ /{locale}）——模板页壳层生效的标志；出现全 0 出链的详情页说明该层失效
- [ ] 出链抽查无 `my/*` 污染：docs/white-papers 等非 my 页面出链出现 `/zh/my/*` 说明模板壳/页面扫描未排除 `config/common.ts`
- [ ] 无字符串变换假链接：出现 `/zh/docs/mobile`（无 name 段）这类残缺实例说明 navRe 误提取 `str.replace` 第一参
- [ ] 声明页入链核对：privacy/terms/cookies/conduct 等声明页至少有出链（statement md 层生效；privacy 出链应含个人信息收集清单、第三方共享清单、cookies）
- [ ] 重定向跳板页清单仅含无内容跳转页（guid/legal/software 出现内容页说明误判）
- [ ] 抽查 2-3 个孤岛页面确认无入链（排除脚本遗漏，重点核对动态拼接链接与 statement md 内链）
- [ ] 跨语言边为 0（`zh→en` 边出现说明 locale 过滤失效）
- [ ] 全局导航覆盖数合理（当前基线 18 页，出现 my/* 页面说明 GLOBAL_NAV_SKIP_FILES 失效）
- [ ] 板块关系图无明显断连板块
- [ ] `npx eslint scripts/internal-link-analyzer.js` 无 error
