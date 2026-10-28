# JSON-LD 规范

> JSON-LD 是「W3C 序列化格式 + schema.org 词汇表 + Google 消费规则」三层标准的组合。本规范按此三层展开，字段级定义各 schema 类型的必选/推荐属性与推荐配置。

## 规范来源

**官方标准**

- [W3C JSON-LD 1.1](https://www.w3.org/TR/json-ld11/) —— 序列化格式标准（`@context` / `@type` / `@id` / `@graph`）
- [schema.org 词汇表全量定义](https://schema.org/docs/full.html) —— 类型与属性的唯一权威定义（如 [Article](https://schema.org/Article)、[TechArticle](https://schema.org/TechArticle)、[BreadcrumbList](https://schema.org/BreadcrumbList)、[Organization](https://schema.org/Organization)、[WebSite](https://schema.org/WebSite)、[SoftwareApplication](https://schema.org/SoftwareApplication)、[FAQPage](https://schema.org/FAQPage)、[Person](https://schema.org/Person)、[Event](https://schema.org/Event)）
- [Google 搜索中心：结构化数据总纲](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=zh-cn) —— 消费端规则（格式选择、可见性要求、必填属性）
- [Google 搜索功能库（搜索库）](https://developers.google.com/search/docs/appearance/structured-data/search-gallery?hl=zh-cn) —— 各类型富媒体结果的字段要求：[文章](https://developers.google.com/search/docs/appearance/structured-data/article?hl=zh-cn)、[面包屑](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=zh-cn)、[组织 Logo](https://developers.google.com/search/docs/appearance/structured-data/logo?hl=zh-cn)、[软件应用](https://developers.google.com/search/docs/appearance/structured-data/software-app?hl=zh-cn)、[FAQ](https://developers.google.com/search/docs/appearance/structured-data/faqpage?hl=zh-cn)
- [Google 官方 TypeScript 类型 schema-dts](https://github.com/google/schema-dts) —— Google 维护的 schema.org 类型定义，可用于编码期校验
- 验证工具：[Rich Results Test](https://search.google.com/test/rich-results)（富媒体资格）与 [Schema.org Validator](https://validator.schema.org/)（词汇合法性）

**社区优秀实践**

- [nuxt-schema-org](https://nuxtseo.com/schema-org)（harlan-zw / Nuxt SEO 套件，当前 v6.x，Nuxt 生态事实标准）—— "Simple API based on Google and Yoast best practices"，30+ 预置节点
- [VitePress 官方 Site Config hooks](https://vitepress.dev/reference/site-config)（`head` / `transformPageData` / `transformHead`）—— VitePress 注入结构化数据的官方机制
- [serp-markup-builder（aaron-marketing-skills）](https://www.skills.sh/aaron-he-zhu/aaron-marketing-skills/serp-markup-builder) —— 本仓库原有引用，页面类型 → schema 映射的社区实践
- GEO 关联：[llmstxt.org v2](https://llmstxt.org/) 指出结构化数据可帮助 LLM 在上下文中正确解读站点信息

## 规范定义（三层结构）

| 层 | 标准 | 管什么 |
|----|------|--------|
| 序列化层 | W3C JSON-LD 1.1 | JSON 的语法形式（`@context`、`@graph`、`@id`） |
| 词汇层 | schema.org | 类型与属性名称的含义 |
| 消费层 | Google 搜索中心 | 哪些字段必填、什么取值能换来富媒体结果 / 被 AI 正确解读 |

## 一、序列化层规范（W3C JSON-LD 1.1）

| 字段 | 必选 | 含义 | 推荐配置 |
|------|------|------|----------|
| `@context` | 是 | 声明词汇表上下文 | 固定为 `"https://schema.org"`；禁止缺省或指向其他 host |
| `@type` | 是 | 实体类型 | 单个字符串；确需多类型用数组（如 `["Organization","LocalBusiness"]`）；**禁止用空对象/未知字符串** |
| `@id` | 强烈推荐 | 实体全局唯一标识（IRI），供 `@graph` 内互相引用 | 采用约定锚点：站点级 `https://<域名>/#organization`、`/#website`；页面级 `<页面URL>#webpage`、`#breadcrumb`、`#article` |
| `@graph` | 推荐 | 多实体打包为单块输出 | 全站 + 页面级节点合并进一个 `@graph`，减少 `<script>` 块数；也可每类一块（合法，Google 均支持） |
| 载体 `<script>` | 是 | `type="application/ld+json"`，内容为合法 JSON | 位于 `<head>` 或 `<body>` 均可（Google 不限制）；每页可多块 |
| 注入时机 | — | 必须出现在**服务端渲染/静态生成**的 HTML 中 | Google 能执行 JS，但多数 AI 爬虫不执行；SPA 动态注入视为不合格，需 SSG/SSR 输出或构建期后处理 |

## 二、通用内容规则（Google 消费层总纲）

1. **取值与页面可见内容一致**：结构化数据描述的内容必须对用户可见；禁止标记隐藏内容、编造数据（Google 总纲明确要求）
2. **必填属性完整**：缺失 Google 定义的必填属性 → 无富媒体资格；缺失推荐属性 → 结果降级。字段级要求见第三章
3. **日期格式**：ISO 8601（`2026-01-01` 或 `2026-01-01T08:00:00+08:00`），推荐带时区
4. **URL 规则**：一律绝对 URL（含协议）；必须可被爬取——不被本站 robots.txt `Disallow`，不指向 noindex 页面
5. **语言标记**：中文站所有页面级节点声明 `inLanguage: "zh-CN"`
6. **与页面语言一致**：`name`/`headline`/`description` 取值语言与页面实际语言一致，禁止机器翻译

## 三、类型与字段级规范（P0–P4）

### P0 —— 全站必加（每页注入）

#### Organization（组织/社区）

| 属性 | 必选 | 类型 | 含义 | 推荐配置 |
|------|------|------|------|----------|
| `@id` | 推荐 | IRI | 实体标识 | `https://<域名>/#organization` |
| `name` | **是** | Text | 组织正式名称 | 与站点页脚/关于页一致，如 `openEuler社区` |
| `url` | **是** | URL | 组织官网 | 站点根 URL |
| `logo` | 推荐 | ImageObject / URL | 组织 Logo | Google 指南：**≥112×112px**、可索引、绝对 URL；用 ImageObject 形式 `{"@type":"ImageObject","url":...}` |
| `sameAs` | 推荐 | URL[] | 官方社媒/资料页 | GitHub 组织页、官方公众号主页等真实链接 |
| `description` | 可选 | Text | 组织简介 | 与站点 meta description 一致 |
| `contactPoint` | 可选 | ContactPoint | 联系方式 | `{contactType:"customer service", email/telephone}`，仅真实存在的渠道 |
| `legalName` / `foundingDate` / `alternateName` | 可选 | — | 法律名/成立日/别名 | 仅真实信息 |

#### WebSite（站点）

| 属性 | 必选 | 类型 | 含义 | 推荐配置 |
|------|------|------|------|----------|
| `@id` | 推荐 | IRI | 实体标识 | `https://<域名>/#website` |
| `name` | **是** | Text | 站点名称 | 与 `<title>` 品牌部分一致 |
| `url` | **是** | URL | 站点根 URL | — |
| `inLanguage` | 推荐 | Text | 站点主语言 | `zh-CN` |
| `publisher` | 推荐 | 引用 | 关联组织 | `{"@id":"https://<域名>/#organization"}`（@graph 内引用） |
| `potentialAction` | 可选 | SearchAction | 站内搜索 | `{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://<域名>/search?q={search_term_string}"},"query-input":"required name=search_term_string"}`；注：Google 已于 2024-11 废弃 sitelinks searchbox 富媒体展示，仅存语义价值，仅站点确有搜索功能时添加 |

#### WebPage（页面，P0 推荐随页面注入）

| 属性 | 必选 | 类型 | 含义 | 推荐配置 |
|------|------|------|------|----------|
| `@id` | 推荐 | IRI | 页面标识 | `<页面URL>#webpage` |
| `url` | **是** | URL | 页面规范地址 | 与 `<link rel="canonical">` 一致 |
| `name` | **是** | Text | 页面标题 | 与 `<title>` / H1 一致 |
| `description` | 推荐 | Text | 页面摘要 | 与 meta description 一致 |
| `isPartOf` | 推荐 | 引用 | 所属站点 | `{"@id":"https://<域名>/#website"}` |
| `inLanguage` | 推荐 | Text | 页面语言 | `zh-CN` |
| `breadcrumb` | 推荐 | 引用 | 关联面包屑 | `{"@id":"<页面URL>#breadcrumb"}` |

#### BreadcrumbList（面包屑）

| 属性 | 必选 | 类型 | 含义 | 推荐配置 |
|------|------|------|------|----------|
| `@id` | 推荐 | IRI | 标识 | `<页面URL>#breadcrumb` |
| `itemListElement` | **是** | ListItem[] | 面包屑层级 | 首项为首页；**名称必须与页面可见面包屑/导航一致**；首页本身不需要 |

ListItem 项内字段：

| 属性 | 必选 | 含义 | 推荐配置 |
|------|------|------|----------|
| `position` | **是** | 层级序号 | 从 1 开始递增 |
| `name` | **是** | 该级显示名 | 与页面导航文案一致（中文站用中文） |
| `item` | 末项可省 | 该级 URL | 绝对 URL；Google 允许最后一项省略 `item` |

> 层级 ≥2 的页面必须提供 BreadcrumbList；首页可省略。

### P1 —— 内容页（文档/文章/博客）

文档站主力类型为 **TechArticle**（Article 的子类型，语义更精确，schema.org 合法），无技术属性的普通文章用 Article/BlogPosting。

| 属性 | 必选(Google) | 类型 | 含义 | 推荐配置 |
|------|--------------|------|------|----------|
| `headline` | **是** | Text | 文章标题 | **≤110 字符**（Google 明确限制），超长会被判定不合规 |
| `image` | **是** | URL[]/URL | 文章配图 | 绝对 URL；**宽 ≥1200px**；推荐 16:9、4:3、1:1 多比例数组；至少 1 张可索引 |
| `datePublished` | **是** | Date/DateTime | 发布时间 | frontmatter `date`；ISO 8601 |
| `dateModified` | 推荐 | Date/DateTime | 最后修改时间 | 构建系统 `lastUpdated`（git 时间），ISO 8601 |
| `author` | **是** | Person/Organization | 作者 | 推荐 `{"@type":"Person","name":...,"url":...}`；官方文档可用 Organization，但 Google 更偏好 Person |
| `publisher` | **是** | Organization | 发布方 | `{"@type":"Organization","name":...,"logo":{"@type":"ImageObject","url":...}}` |
| `description` | 推荐 | Text | 摘要 | 与 meta description 一致 |
| `mainEntityOfPage` | 推荐 | URL | 页面规范地址 | 页面绝对 URL |
| `inLanguage` | 推荐 | Text | 语言 | `zh-CN` |
| `isPartOf` | 可选 | 引用 | 所属文档集 | 指向 #website 或文档专栏页 |
| `proficiencyLevel` | 可选 | Text | 技术深度 | TechArticle 专属：`Beginner`/`Expert` |
| `keywords` | 可选 | Text | 关键词 | 逗号分隔，仅真实主题词 |
| `dependencies` | 可选 | Text | 依赖说明 | TechArticle 专属，如 `openEuler 24.03 LTS` |

### P2 —— 商业/下载页

#### SoftwareApplication（软件/发行版/工具）

| 属性 | 必选(Google) | 含义 | 推荐配置 |
|------|--------------|------|----------|
| `name` | **是** | 应用名 | 与下载页显示一致 |
| `operatingSystem` | **是** | 运行环境 | 如 `Linux`、`Windows 10`、`Android 8.0`；Web 应用用 `Web` |
| `applicationCategory` | **是** | 分类 | 枚举值：`BusinessApplication`、`DesignApplication`、`DeveloperApplication`、`EducationApplication`、`GameApplication`、`SocialNetworkingApplication` 等 |
| `offers` | 富媒体资格必需（与 aggregateRating 二选一） | 报价 | `{"@type":"Offer","price":"0","priceCurrency":"CNY","availability":"https://schema.org/InStock"}`；开源免费软件 price 用 `"0"` |
| `aggregateRating` | 富媒体资格必需（与 offers 二选一） | 评分 | **仅真实评分数据**：`ratingValue` + `ratingCount`，禁止编造 |
| `softwareVersion` | 推荐 | 版本号 | 如 `24.03 LTS` |
| `operatingSystemVersion` | 可选 | 系统版本要求 | — |
| `screenshot` | 可选 | 截图 | 绝对 URL |
| `releaseNotes` | 可选 | 发行说明链接 | 指向真实 release notes 页 |
| `datePublished` | 可选 | 发布日期 | 版本发布日 |

> 源码仓库页用 [SoftwareSourceCode](https://schema.org/SoftwareSourceCode)（`name`/`codeRepository`），不要与 SoftwareApplication 混用。社区操作系统发行版（openEuler/openGauss 等）的下载页适用 SoftwareApplication。

#### Event（活动/峰会/直播）

| 属性 | 必选(Google) | 含义 | 推荐配置 |
|------|--------------|------|----------|
| `name` | **是** | 活动名 | — |
| `startDate` | **是** | 开始时间 | ISO 8601 **带时区**：`2026-11-20T09:00:00+08:00` |
| `location` | **是** | 地点 | 线下：`{"@type":"Place","name":...,"address":{...}}`；线上：`{"@type":"VirtualLocation","url":...}` |
| `endDate` | 推荐 | 结束时间 | 同 startDate 格式 |
| `eventAttendanceMode` | 推荐 | 出席模式 | `OfflineEventAttendanceMode` / `OnlineEventAttendanceMode` / `MixedEventAttendanceMode` |
| `organizer` | 推荐 | 主办方 | 引用 Organization |
| `image` / `description` | 推荐 | 宣传图/简介 | 绝对 URL |

### P3 —— 权威信号

#### Person（作者/贡献者页）

| 属性 | 必选 | 含义 | 推荐配置 |
|------|------|------|----------|
| `name` | **是** | 姓名 | 真实姓名或社区 ID |
| `url` | 推荐 | 个人页 | 指向站内作者页 |
| `sameAs` | 推荐 | 外部身份 | GitHub 主页等 |
| `jobTitle` / `worksFor` | 可选 | 职务/所属 | worksFor 引用 Organization |

### P4 —— 特殊场景（注意废弃状态）

| 类型 | 状态 | 规则 |
|------|------|------|
| FAQPage | **富媒体受限**（[2023-08 Google 公告](https://developers.google.com/search/blog/2023/08/howto-faq-changes)：仅限知名权威政府/健康网站） | 标记仍合法且对 AI 理解有价值。`mainEntity: Question[]`，每项 `name`（问题全文）+ `acceptedAnswer: {text}`（答案）；**内容必须页面可见**；≥2 对真实 Q&A；禁止 UGC/论坛/推广式 FAQ |
| HowTo | **富媒体已废弃**（2023-09，同上公告） | 仅存语义价值，优先级最低 |
| Dataset | 正常 | 数据集页使用，`name`/`description`/`license`/`distribution` |

## 四、取值纪律（全类型通用）

1. 只从**可见页面内容或用户提供的真实事实**填充；可选属性仅"真实且页面可见"才加
2. **绝不编造**：评分、价格、日期、作者、统计数据一律以真实来源为准
3. 数值型数据标注来源（Measured / User-provided / Estimated）；Estimated 值不上线
4. 未知值**省略该属性**，禁止占位符（`TODO`/`xxx`/`待填`/`example.com`）上线
5. 禁止为凑富媒体结果而向页面塞不可见的 FAQ/HowTo/评论

## 五、内容类型 → schema 映射（页面决策表）

| 页面类型 | 必需 | 条件性 |
|----------|------|--------|
| 全部页面 | Organization、WebSite、WebPage、BreadcrumbList（层级≥2） | SearchAction（有站内搜索时） |
| 文档/教程页 | TechArticle | FAQ（真实 Q&A） |
| 博客/新闻页 | Article/BlogPosting | Person（真实作者） |
| 下载/产品页 | SoftwareApplication | offers（免费软件 price="0"） |
| 活动页 | Event | organizer 引用 |
| 作者/贡献者页 | Person | sameAs |
| FAQ 页 | FAQPage | — |
| 面包屑 | BreadcrumbList | 永远随页面类型一起加 |

## 六、本专项验收基线

| 级别 | 检查项 | 验收标准 |
|------|--------|----------|
| P0 | JSON-LD 存在且语法合法 | `JSON.parse` 通过；`@context` 为 `https://schema.org` |
| P0 | 站点级三件套 | Organization（name+url+logo）、WebSite（name+url）、BreadcrumbList 全站覆盖 |
| P0 | 必填属性完整 | 各类型 Google 必填属性齐全且非空 |
| P0 | 与可见内容一致 | 无编造数据；无占位符 |
| P1 | 内容页 TechArticle | headline ≤110 字符 + image ≥1200px + datePublished + author + publisher.logo |
| P1 | 实体关联 | `@id`/`@graph` 内引用完整（WebPage.isPartOf → WebSite → Organization） |
| P1 | 语言标记 | 页面级节点 `inLanguage: "zh-CN"` |
| P2 | 富媒体资格 | [Rich Results Test](https://search.google.com/test/rich-results) 目标类型零错误 |
| P2 | 词汇校验 | [validator.schema.org](https://validator.schema.org/) 零错误 |
| P2 | 扩展类型 | SoftwareApplication / Event / Person / FAQPage 按页面类型正确使用 |

## 关键要求

1. 结构化数据必须由 SSG/SSR 输出在最终 HTML 中，禁止纯客户端动态注入
2. `@context` 固定 `https://schema.org`；类型名称大小写敏感（`TechArticle` 非 `techarticle`）
3. Organization + WebSite + BreadcrumbList 为全站 P0 必加项
4. 文档/文章页使用 TechArticle，headline ≤110 字符，image ≥1200px 宽，日期 ISO 8601
5. 所有 URL 绝对化且可爬取；与 canonical 一致
6. 取值只来自页面可见内容或真实事实，禁止编造与占位符
7. FAQPage/HowTo 富媒体已受限/废弃（2023-08/09 Google 公告），仅按语义价值酌情使用
8. 上线前双工具验证：Rich Results Test + validator.schema.org；本地/CI 用 skill 的 validate-jsonld.mjs

## 项目实现方式

参考 [implementation](./implementation.md)
