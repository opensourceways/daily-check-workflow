# Sitemap 标准及覆盖情况

参考来源：[sitemaps.org - Home](https://www.sitemaps.org/)

| 属性         | 必选  | 规范                                                                                                                                                                                                                                                                                                                                            | openEuler-portal | openEuler-docs                     | openGauss-portal | openGauss-docs                     | MindSpore           | MindSpore-docs                     | openUBMC-portal | openUBMC-docs | UnifiedBus | HiFloat |
| ---------- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------- | ---------------- | ---------------------------------- | ------------------- | ---------------------------------- | --------------- | ------------- | ---------- | ------- |
| loc        | 是   | 页面的 URL。该 URL 必须以协议（如 http）开头                                                                                                                                                                                                                                                                                                                 | ✅                | ✅                                  | ✅                | ✅                                  | ✅                   | ✅                                  | ✅               | ✅             | ✅          | ✅       |
| lastmod    | 否   | 该页面的最后修改日期。该日期应采用 W3C 日期时间格式。此格式允许根据需要省略时间部分，使用 YYYY-MM-DD 格式。<br><br>该日期必须设置为链接**页面的最后修改日期，而非 sitemap 的生成日期**。                                                                                                                                                                                                                               | ✅                | ❌（构建时间，未准确反映真实更新时间）                | ✅                | ❌（文档页面数量庞大，且当前构建模式无法准确获取每个文档的更新时间） | ❌（构建时间，未准确反映真实更新时间） | ❌（文档页面数量庞大，且当前构建模式无法准确获取每个文档的更新时间） | ✅               | ✅             | ✅          | ✅       |
| changefreq | 否   | 该页面预计的更新频率。此值向搜索引擎提供一般性信息，可能与搜索引擎实际抓取该页面的频率并不完全一致。有效值包括：`always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`。应使用 `always` 值来描述每次访问时都会发生变化的文档。应使用 `never` 值来描述已归档的URL。<br><br>此标签的值仅被视为提示，而非指令。尽管搜索引擎爬虫在做出决策时可能会参考此信息，但它们对标记为 `hourly` 的页面实际爬取频率可能低于该值，而对标记为 `yearly` 的页面实际爬取频率可能高于该值。爬虫可能会定期爬取标记为 `never` 的页面，以便处理这些页面出现的意外变化。 | ✅                | ❌（文档页面数量庞大，且当前构建模式无法准确获取每个文档的更新时间） | ✅                | ❌（文档页面数量庞大，且当前构建模式无法准确获取每个文档的更新时间） | ✅                   | ❌（文档页面数量庞大，且当前构建模式无法准确获取每个文档的更新时间） | ✅               | ✅             | ✅          | ✅       |
| xhtml:link | 否   | 当页面存在其他语言版本，则包含该页面的 `<url>` 中应该用 `<xhtml:link rel="alternate" hreflang="" href=""/>` 列出网页每个语言版本（包括自身）                                                                                                                                                                                                                                         | ✅                | ✅                                  | ✅                | ✅                                  | ❌                   | ❌                                  | ❌               | ❌             | ✅          | ❌       |

**实现方式**

|            | openEuler-portal       | openEuler-docs                    | openGauss-portal       | openGauss-docs | MindSpore              | MindSpore-docs | openUBMC-portal  | openUBMC-docs | UnifiedBus             | HiFloat                |
| ---------- | ---------------------- | --------------------------------- | ---------------------- | -------------- | ---------------------- | -------------- | ---------------- | ------------- | ---------------------- | ---------------------- |
| loc        | Vitepress自动生成          | Vitepress自动生成                     | Vitepress自动生成          | Vitepress自动生成  | 脚本遍历构建产物生成             | 脚本遍历构建产物生成     | 脚本遍历pages生成      | 脚本遍历构建产物生成    | 脚本遍历构建产物生成             | 脚本遍历构建产物生成             |
| lastmod    | vite插件生成，遍历页面依赖的所有文件计算 | vitepress config 的sitemap配置中取构建时间 | vite插件生成，遍历页面依赖的所有文件计算 |                | vite插件生成，遍历页面依赖的所有文件计算 |                | 取路由入口vue文件的mtime |               | vite插件生成，遍历页面依赖的所有文件计算 | vite插件生成，遍历页面依赖的所有文件计算 |
| changefreq | 根据git提交时间计算            |                                   | 根据git提交时间计算            |                | 根据git提交时间计算            |                | 写死weekly         | 根据git提交时间计算   | 根据git提交时间计算            | 根据git提交时间计算            |
| xhtml:link | Vitepress自动生成          | Vitepress自动生成                     | Vitepress自动生成          | Vitepress自动生成  |                        |                |                  |               | 根据git提交时间计算            |                        |

# TDK 标准及覆盖情况

参考来源：[精选摘要和您的网站 | Google 搜索中心  |  Documentation  |  Google for Developers](https://developers.google.com/search/docs/appearance/featured-snippets?hl=zh-cn), [`<title>` HTML document title element - HTML | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/title)

| 属性          | 标准                                                                                                                                                                     | openEuler-portal | openEuler-docs | openGauss-portal | openGauss-docs | MindSpore | MindSpore-docs | openUBMC-portal | openUBMC-docs | UnifiedBus | HiFloat         |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | -------------- | ---------------- | -------------- | --------- | -------------- | --------------- | ------------- | ---------- | --------------- |
| title       | 每个页面的标题都应具有唯一性，且遵循模式：页面首要内容/意图，然后是网站名称。避免关键词堆砌                                                                                                                         | ✅                | ✅              | ✅                | ✅              | ✅         | ✅              | ✅               | ✅             | ✅          | ❌ 差新闻文章页面的title |
| description | 简短且相关的摘要告知用户特定网页的内容，要概括网页内容，具有唯一性。并非必须为句子格式，也可以包含关于网页的信息、分散在网页各处的重要信息片段（`<meta name="description" content="作者：A.N.（作家）；插图：V. Gogh；价格：17.99 美元；页数：784 页">`），避免简单的关键字堆砌。 | ✅                | ❌              | ✅                | ❌              | ✅         | ❌              | ✅               | ❌             | ✅          | ✅               |
| keywords    | 与页面内容相关的词语，用逗号分隔。（优先级低，google 搜索已不再支持）                                                                                                                                 | ✅                | ❌              | ✅                | ❌              | ✅         | ❌              | ✅               | ❌             | ❌          | ❌ 只有首页          |

# JSON-LD 标准及覆盖情况

**社区覆盖情况**

|         | openEuler-portal | openEuler-docs | openGauss-portal | openGauss-docs | MindSpore | MindSpore-docs | openUBMC-portal | openUBMC-docs | UnifiedBus | HiFloat |
| ------- | ---------------- | -------------- | ---------------- | -------------- | --------- | -------------- | --------------- | ------------- | ---------- | ------- |
| JSON-LD | ✅AI生成            | ✅脚本生成          | ✅AI生成            | ✅脚本生成          | ✅AI生成     | ❌              | ❌               | ✅脚本生成         | ❌          | ✅AI生成   |

标准参考 [serp-markup-builder — aaron-he-zhu/aaron-marketing-skills](https://www.skills.sh/aaron-he-zhu/aaron-marketing-skills/serp-markup-builder) 中的 JSON-LD 生成流程

**1. 识别内容类型 → 选定 schema 类型**

**通用映射：**

| 内容类型         | 主 schema            | 适用时追加                        |
| ------------ | ------------------- | ---------------------------- |
| 博客文章/文章      | Article             | FAQ、HowTo、Speakable          |
| 产品页          | Product             | Review、Offer、AggregateRating |
| 服务页          | Service             | FAQ、LocalBusiness            |
| 操作指南（How-to） | HowTo               | Article、FAQ                  |
| FAQ 页        | FAQPage             | Article                      |
| 活动           | Event               | Offer、Organization           |
| 视频           | VideoObject         | Article                      |
| 人物/作者        | Person              | Organization                 |
| 组织           | Organization        | ContactPoint、Logo            |
| 课程           | Course              | Organization                 |
| 招聘           | JobPosting          | Organization                 |
| 面包屑          | BreadcrumbList      | （永远随其他 schema 一起加）           |
| 软件/App       | SoftwareApplication | Review、Offer                 |

**按页面场景的细分**（schema-instructions-detail.md:10-15，CORE-EEAT O05 视角）

| 页面类型                       | 必需                                 | 条件性             |
| -------------------------- | ---------------------------------- | --------------- |
| 博客教程                       | Article、Breadcrumb                 | FAQ、HowTo       |
| Best-of / alternatives 对比页 | ItemList、Breadcrumb、FAQ            | AggregateRating |
| 落地页                        | SoftwareApplication、Breadcrumb、FAQ | WebPage         |
| FAQ 页                      | FAQPage、Breadcrumb                 | —               |
| 客户评价页                      | Review、Breadcrumb                  | FAQ、Person      |

**必加类型（P0 —— Always）**

schema-decision-tree.md:48：

- **Organization** — 全站基础实体
- **BreadcrumbList** — 任何页面都随其他 schema 一起加
- **WebSite（含 SearchAction）** — 站点级基础

其余按优先级：**P1** 内容类（Article、FAQPage、HowTo）→ **P2** 商业类（Product、Review、AggregateRating、Offer）→ **P3** 权威类（Person、SameAs、Speakable）→ **P4** 行业专用类型。

| Priority | Schema Types | Why |
|----------|-------------|-----|
| P0 -- Always | Organization, BreadcrumbList, WebSite (SearchAction) | Foundation for all sites |
| P1 -- Content | Article, FAQPage, HowTo | Direct rich result eligibility |
| P2 -- Commercial | Product, Review, AggregateRating, Offer | Revenue-impacting rich results |
| P3 -- Authority | Person, SameAs, Speakable | E-E-A-T signals, AI citation |
| P4 -- Specialized | Industry-specific types | Niche rich results |

**2. 生成 JSON-LD**

- **必填属性**：FAQPage=`mainEntity`+Q.name+A.text（≥2 对可见 Q&A，禁论坛/UGC/推广式 FAQ）；HowTo=`name`+`step`（≥2 步）；Article=`headline`（≤110 字符）+`image`（≥1200px）+`datePublished`+`author`+`publisher.logo`；Product=`name`+`image`（价格需 offers.price/priceCurrency/availability）；LocalBusiness=`name`+`address`；Organization=`name`+`url`。
- **取值纪律**：只从**可见页面内容或用户提供的真实事实**填充；可选属性仅"真实且页面可见"才加；未知值用**明确标注的占位符**，发布前移除；绝不编造 CTR/评分/价格/日期/作者；数值标 Measured/User-provided/Estimated。

# robots.txt

| 字段             | 必选                           | 含义                                                                                                        | openEuler-portal | openEuler-docs | openGauss-portal       | openGauss-docs | MindSpore | MindSpore-docs    | openUBMC-portal | openUBMC-docs    | UnifiedBus                        | HiFloat |
| -------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------- | -------------- | ---------------------- | -------------- | --------- | ----------------- | --------------- | ---------------- | --------------------------------- | ------- |
| User-agent     | 是                            | 指定规则适用的自动客户端（即搜索引擎抓取工具）的名称，星号 (`*`) 会匹配除各种 AdsBot 抓取工具之外的所有抓取工具                                           | ✅                | ✅              | ✅                      | ✅              | ✅         | 无，属MindSpore下的子目录 | ✅               | 无，属openUBMC下的子目录 | ✅                                 | ✅       |
| disallow       | 至少一个或多个 `disallow` 或 `allow` | 不希望用户代理抓取的目录或网页（相对于根网域而言），必须以 `/` 字符开头；如果它引用了某个目录，则必须以 `/` 标记结尾                                           |                  |                | ✅ `/*//` 指禁止抓取包含双斜杠的路径 |                |           |                   |                 |                  | ✅ 禁止了部分需要登录页面的抓取，也禁止了部分正常页面，待审视修改 |         |
| allow          | 至少一个或多个 `disallow` 或 `allow` | 用户代理可以抓取的目录或网页（相对于根网域而言），*替换 `disallow` 规则，从而允许抓取已禁止访问的目录中的子目录或网页*，必须以 `/` 字符开头；如果它引用了某个目录，则必须以 `/` 标记结尾。 | ✅                | ✅              | ✅                      | ✅              | ✅         |                   | ✅               |                  | ✅                                 | ✅       |
| sitemap        | 否                            | 相应网站的站点地图的位置                                                                                              | ✅                | ✅              | ✅                      | ✅              | ✅         |                   | ✅               |                  | ✅                                 | ✅       |
| Content-Signal | 否                            | `ai-train=no, search=yes, ai-input=yes` 网站对传统搜索引擎、实时生成式 AI 以及 AI 模型训练是否开放                                 | ✅                | ✅              | ❌                      | ❌              | ❌         |                   | ❌               |                  | ❌                                 | ❌       |
| LLM-Policy     | 否                            | 指向 llms.txt                                                                                               | ✅                | ✅              | ❌                      | ❌              | ❌         |                   | ❌               |                  | ❌                                 | ❌       |

# Issue情况

| 项目               | 总数  | 已解决 | 未解决 |
| ---------------- | --- | --- | --- |
| openEuler-portal | 44  | 42  | 2   |
| openEuler-docs   | 2   | 1   | 1   |
| openGauss-portal | 34  | 32  | 2   |
| openGauss-docs   | 0   | 0   | 0   |
| openUBMC         | 9   | 9   | 9   |
| openUBMC-docs    | 0   | 0   | 0   |
| UnifiedBus       | 0   | 0   | 0   |
| Hifloat          | 9   | 9   | 9   |

# 921 Sitemap 问题复盘

## openEuler-docs

**atom环境robots.txt中域名错误**

**根因：** 已有域名自动替换脚本，未在构建时调用，原因是：1）代码提交时遗漏。2）现网未充分测试，只看了org环境

**规避措施：** 现网已修复，后续定期人工/自动巡查现网 sitemap.xml 内域名是否正确

**文档的sitemap_index中出现不可访问项**

**根因：** 根据远程git仓库分支来拼接多版本sitemap地址，不稳定且容易引入不可访问的版本。涉及问题：sitemap index生成的逻辑未在多个项目间同步

**规避措施：** 使用项目内维护的多版本名称列表来拼接多个版本的sitemap地址，后续检查多个Vitepress项目间的相关逻辑是否同步、定期人工/自动巡查现网 sitemap 地址是否可访问

**hugo文档 sitemap 错误**

hugo构建版本的sitemap loc是相对路径，不符合规范

**根因：** sitemap由hugo自动生成，当前的构建方式（镜像构建时执行 hugo -b / --minify（Dockerfile:31），把 baseURL 覆盖成了 /）导致生成的 sitemap 的 baseUrl 为 /。涉及问题：1）巡查不充分，daily check自动化巡查未查出 sitemap.xml 元素值的规范性问题

**规避措施：** 定期人工/自动巡查

## openGauss-docs

**hugo文档 sitemap 错误**

hugo构建版本的sitemap loc是相对路径，不符合规范

**根因：** sitemap由hugo自动生成，当前的构建方式（镜像构建时执行 hugo -b / --minify（Dockerfile:31），把 baseURL 覆盖成了 /）导致生成的 sitemap 的 baseUrl 为 /。涉及问题：1）巡查不充分，daily check自动化巡查未查出 sitemap.xml 元素值的规范性问题

**规避措施：** 定期人工/自动巡查

## 落地措施

重构当前的落地措施

## 关于规避措施

当前措施，daily check自动巡查在sitemap方面的扫描能力/覆盖范围不足，且问题通过提issue的方式提出，感知度低。优化措施：先在本地创建针对 sitemap 的自动化巡查的脚本，主要检查：

- loc 地址是否符合规范、能否正常访问
- lastmod是否明显不正常（所有页面都一样）
- changefreq是否为never
- xhtml:link是否缺失

每天/定期人工调用执行，或用操作系统的定时任务执行