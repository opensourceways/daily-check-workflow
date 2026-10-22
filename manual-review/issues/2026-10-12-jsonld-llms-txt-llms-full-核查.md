# 2026-10-12 JSON-LD / llms.txt / llms-full.txt 深度核查

| 字段 | 内容 |
|------|------|
| 问题描述 | 10 个项目三项措施全量实测:llms.txt 4 站超限、4 站描述覆盖率 0%;llms-full.txt 6 站缺文件头、无一站使用规范 Source 格式;JSON-LD 7 站存在首页/全站覆盖缺口,openEuler 官网首页存在完全重复的注入块 |
| 影响范围 | 全部 10 个项目(其中 MindSpore 文档三项全缺;HiFloat 于 10-12 上午出现瞬时 504,复查时已恢复) |
| 核查方式 | 线上实抓(60+ 请求):HTTP 头、文件结构逐行解析、JSON-LD 块级/字段级校验、Range 请求实测 llms-full.txt 真实体积 |
| 责任人 | 见 [分工表](../../分工表.md):规范出具 JW / 检查工具 SJ / 实施落地 JW |
| 状态 | 跟进中 |
| 关联文档 | [llms.txt 进展](../../measures/02-llms-txt/进展.md) · [JSON-LD 进展](../../measures/04-json-ld/进展.md) · [2025-09-21 sitemap 复盘](2025-09-21-sitemap-复盘.md) |
| 检测数据 | `workflow/stats/llms-txt-stats.json` / `jsonld-stats.json`(2026-10-12 增强版脚本生成) |

---

## 一、总体符合度矩阵

| 项目 | llms.txt | llms-full.txt | JSON-LD |
|------|----------|---------------|---------|
| openEuler 官网 | 🟡 超限(2.6×) | 🟡 无规范 Source 格式 | 🟡 首页重复块、缺三件套之二 |
| openEuler 文档 | ❌ 超限(6.2×)+0% 描述 | ❌ 无文件头、`url:` 相对路径 | ❌ 首页 0 块、TechArticle 缺字段 |
| openGauss 官网 | 🟡 单节超载 | 🟡 头部与 llms.txt 不一致 | 🟡 Organization 无 logo、SoftwareApplication 缺 operatingSystem |
| openGauss 文档 | ❌ 超限(30×)+无 Summary+0% 描述 | ❌ 无文件头、103MB 体量 | ❌ 全站仅 FAQ 内页有 |
| MindSpore 官网 | 🟡 0% 描述 | ❌ 无文件头 | 🟡 首页 0 块 |
| MindSpore 文档 | ❌ 404 未部署 | ❌ 404 | ❌ 全站 0 块 |
| openUBMC 官网 | ✅ 最佳(99.1% 描述) | ❌ 无文件头 | 🟡 首页 0 块(/docs 有全套 @graph,全专项标杆) |
| openUBMC 文档 | ❌ 超限(6.4×)+0% 描述+robots 缺 LLM-Policy | ✅ 结构最佳(唯一规范文件头) | 🟡 首页有全套(@graph+@id 全覆盖),内容页 0 块 |
| UnifiedBus | 🟡 仅 8 条链接 1 分节、robots 缺 LLM-Policy | ✅ | 🟡 根路径 0 块(/zh、/en 有 WebSite+Organization)、Organization 缺 logo |
| HiFloat | 🟡 双 H1、描述 31%、robots 缺 LLM-Policy | 🟡 无文件头 | 🟡 首页 0 块、Organization 缺 logo |

## 二、llms.txt 检测明细(2026-10-12 实测)

| 项目 | 体积 | 链接数 | 描述覆盖 | 分节(超载情况) | URL 形式 | robots LLM-Policy | .well-known |
|------|------|--------|----------|----------------|----------|-------------------|-------------|
| openEuler 官网 | 259,132 ⚠️ | 1,381 | 100% | 2 节,TOC 单节 1,059 条 | 绝对 | ✅ 指向 openatom.cn(跨域) | 404 |
| openEuler 文档 | 621,942 ⚠️ | 6,396 | **0%** | 9 节按版本号命名,最大 912 条 | 根相对(.md) | ✅ 指向 openatom.cn(跨域) | 404 |
| openGauss 官网 | 27,601 | 155 | 100% | 2 节,TOC 单节 94 条 | 绝对 | ✅ 指向非 www 域 | 404 |
| openGauss 文档 | 3,000,242 ⚠️ | 32,780 | **0%** | "latest" 单节 11,045 条 | 根相对(.md) | ✅ | **200 但返回 HTML(伪别名)** |
| MindSpore 官网 | 1,386 | 26 | **0%** | 5 节中文语义化(最佳) | 绝对 | ✅ | 404 |
| MindSpore 文档 | — | — | — | **404 未部署** | — | —(robots 亦 404) | — |
| openUBMC 官网 | 41,009 | 217 | 99.1% | 3 节,TOC 单节 154 条 | 绝对 | ✅ | **200 但返回 HTML(伪别名)** |
| openUBMC 文档 | 635,664 ⚠️ | 4,215 | **0%** | 49 节混入目录 slug(bingo/qemu/images;interface_custom 1,696 条) | 绝对(openubmc.cn 非 www) | **❌ 缺失** | 404 |
| UnifiedBus | 1,441 | 8 | 100% | 仅 1 节 8 条(覆盖不足) | 根相对 | **❌ 缺失** | 404 |
| HiFloat | 2,101 | 13 | 30.8% | 4 节(ZH/EN Index 功能重叠) | 根相对(.md) | **❌ 缺失** | 404 |

### llms.txt 关键发现

1. **P0 体积超限**(`>100,000` 字符,规范约定超限即升级 P0 整改):openGauss 文档(30 倍)、openEuler 文档(6.2 倍)、openUBMC 文档(6.4 倍)、openEuler 官网(2.6 倍)——均未实施 `/_llms/` 拆分子索引
2. **P1 描述覆盖率两极分化**(基线 ≥80%):openEuler 文档、openGauss 文档、MindSpore 官网、openUBMC 文档共 **43,417 条链接 0% 描述**;其余 4 站近 100%——说明两类生成链路并存,前者未接入 frontmatter `description`
3. **openGauss 文档缺 Summary**(blockquote 整体缺失)
4. **分节纪律普遍不达标**(规范推荐每节 5–20 条):单节最大 11,045 条;openEuler/openGauss 文档用版本号当节名、openUBMC 文档泄漏目录 slug;标杆:MindSpore 官网"安装/学习/资源/社区/动态"、openUBMC 文档前 7 节双语命名
5. **10 站全部缺失 HTTP 发现头**(`Link: rel="describedby"` / `X-Llms-Txt`)
6. **.well-known 伪别名**:openGauss 文档、openUBMC 官网返回 200 但内容是 HTML 兜底页(SPA 路由未排除该路径),比 404 更易误导消费工具
7. **robots.txt LLM-Policy 联动缺失**:openUBMC 文档、UnifiedBus、HiFloat;openEuler 两站指向 `*.openatom.cn` 镜像域(可访问但与主域不一致)
8. **10 站全部无 `## Optional` 收尾节**;openEuler 官网 6 条描述超 300 字符上限;UnifiedBus 链接标题直接复制整段 `<title>`
9. 相对 10-10 审计:**HiFloat 于 10-12 上午出现瞬时 504,全量复查时已恢复**,现存问题与 10-10 审计结论一致(双 H1、描述 30.8%、robots 缺 LLM-Policy);llms.txt 的 robots LLM-Policy 缺失站点为 3 个(openUBMC 文档、UnifiedBus、HiFloat)

## 三、llms-full.txt 检测明细(体积为 Range 请求实测真值)

| 项目 | 真实体积 | 文件头(H1+Summary) | 与 llms.txt 头部一致 | 页 Source URL 格式 |
|------|----------|--------------------|--------------------|-------------------|
| openEuler 官网 | 1.4MB | ✅ | ✅ | `---` 裸 URL 行(非规范) |
| openEuler 文档 | 58.5MB | **❌ 文件直接以页面块开头** | — | `url: /相对路径`(YAML 风格,脱离域名不可溯源) |
| openGauss 官网 | 686KB | ✅ | **❌ H1 完全不一致** | 裸 URL 行 |
| openGauss 文档 | 103.2MB | **❌** | — | `url: /相对路径` |
| MindSpore 官网 | 6.6MB | **❌** | — | 裸 URL 行 |
| MindSpore 文档 | — | **404** | — | — |
| openUBMC 官网 | 23.5MB | **❌** | — | 裸 URL 行 |
| openUBMC 文档 | 23.0MB | ✅(`# openUBMC — Full Documentation`) | ✅ | `> URL: <绝对URL>` blockquote |
| UnifiedBus | 153KB | ✅ | ✅ | 裸 URL 行 |
| HiFloat | 348KB | **❌** | — | 裸 URL 行 |

### llms-full.txt 关键发现

1. **6 站缺文件头**(openEuler 文档、openGauss 文档、MindSpore 官网、openUBMC 官网、HiFloat):文件第一行即页面内容块,AI 无法识别归属站点;**openUBMC 文档是唯一规范实现,可作为模板**
2. **无一站符合规范 Source 格式**(`Source: <绝对URL>` 独立成行),实测三种自定义格式;其中 openEuler 文档/openGauss 文档为**相对路径**,脱离域名完全无法溯源
3. openGauss 官网 llms-full 与 llms.txt 的 H1 完全不一致
4. openEuler/openGauss 官网的 llms-full 混入首页 banner/导航文案("View More"/"Learn More"),信噪比低
5. 体量警示:openGauss 文档 103MB、openEuler 文档 58.5MB(含全部历史版本,建议裁剪至 latest+LTS)

## 四、JSON-LD 检测明细

| 项目 | 首页 | 内容页采样 | 主要问题 |
|------|------|-----------|----------|
| openEuler 官网 | 2 块**完全重复** | 年报页 WebPage+Report | 重复注入;缺 WebSite/BreadcrumbList;全节点无 @id;logo 裸字符串;url/logo 指向 openatom.cn |
| openEuler 文档 | **0 块** | BreadcrumbList+TechArticle+HowTo | TechArticle 缺 image/datePublished;HowTo 富媒体已废弃(2023-09);缺 Organization/WebSite |
| openGauss 官网 | 3 节点 | about/进阶页 | Organization 缺 logo;WebSite 缺 inLanguage/publisher;SoftwareApplication 缺 operatingSystem/offers;无 @id |
| openGauss 文档 | **0 块** | 仅 FAQ 页 BreadcrumbList+FAQPage | 全站无 Organization/WebSite/WebPage |
| MindSpore 官网 | **0 块** | WebPage+BreadcrumbList+SoftwareApplication | 缺 Organization/WebSite;@id 1/3 |
| MindSpore 文档 | **0 块** | **0 块** | 全站未实施 |
| openUBMC 官网 | **0 块** | /docs 全套 @graph ✅ | /docs 的 @graph(WebPage→WebSite→Organization→BreadcrumbList)为**全专项标杆**;logo.url 相对路径;Article 页缺 image/datePublished/author |
| openUBMC 文档 | ✅(经重定向)全套 @graph+@id 100% | **0 块** | 首页(openubmc.cn/docs)有全套且 @id/@graph 全覆盖;**内容页 0 块**;www.openubmc.cn/docs/ 上午探测瞬时 404 |
| UnifiedBus | **0 块**(根路径) | /zh、/en 有 WebSite+Organization | 入口页缺;Organization 缺 logo |
| HiFloat | **0 块** | /docs、/zh 有 Organization(缺 logo)+WebSite+WebPage;activity 页有 BreadcrumbList+ItemList | 首页无;全节点无 @id |

### JSON-LD 关键发现

1. **P0 三件套(Organization+WebSite+BreadcrumbList)覆盖缺口**:首页/入口 0 块的有 openEuler 文档、MindSpore 官网/文档、openGauss 文档、openUBMC 官网、UnifiedBus(根路径)、HiFloat——10 站中 7 站;openUBMC 文档首页有全套但内容页 0 块
2. **openEuler 官网首页两块 JSON-LD 内容完全重复**(疑似 head 配置与插件各注入一次)
3. **@id/@graph 实体关联几乎缺失**:仅 openUBMC 官网(/docs,id 覆盖 94%)、openUBMC 文档(首页,id 覆盖 100%)、UnifiedBus(/zh、/en,id 覆盖 75%)实现;其余站点节点无 @id,无实体引用链
4. TechArticle/Article 必填字段缺失:image、datePublished(openEuler 文档、openUBMC 官网 Article 页)
5. 已部署部分无占位符、无 JSON 语法错误——**质量合格,核心短板是覆盖面与字段完整性**

## 五、整改建议(按优先级)

| 优先级 | 范围 | 动作 |
|--------|------|------|
| P0 | openGauss 文档、openEuler 文档/官网、openUBMC 文档 | llms.txt 落地 `/_llms/` 递归拆分子索引(vitepress-plugin-llms / nuxt-llms 均有现成配置) |
| P0 | openEuler 文档、openGauss 文档、MindSpore 官网、openUBMC 文档 | 链接描述接入 frontmatter `description`(300 字符截断),基线 ≥80%;建议 CI 加"缺 description 构建告警" |
| P0 | 7 站首页/全站缺口 | JSON-LD 三件套全站注入(VitePress `transformHead`/`transformPageData` 或 nuxt-schema-org);同步**修复 openEuler 官网首页重复块** |
| P0 | MindSpore 文档 | 三项措施整体落地(website-docs 仓库接入 vitepress-plugin-llms + JSON-LD 注入) |
| P0 | HiFloat | 修复双 H1(Docs 分节误用 H1→H2);补链接描述(31%→80%);robots.txt 补 LLM-Policy;首页补 JSON-LD |
| P0 | 6 站 | llms-full.txt 补统一文件头(直接复用 llms.txt 的 H1+Summary;参考 openUBMC 文档实现) |
| P1 | 全部 | llms-full.txt 页 Source 统一为 `Source: <绝对URL>` 独立成行(相对路径必须绝对化) |
| P1 | openUBMC 文档、UnifiedBus、HiFloat | robots.txt 补 LLM-Policy;openEuler 两站统一 LLM-Policy 至主域 |
| P1 | 文档类 4 站 | 分节语义化重组(快速入门/用户指南/API 参考/FAQ),单节控制在 5–20 条 |
| P1 | 全部 | 注入 `@id`(`/#organization`、`/#website`、`#webpage`、`#breadcrumb`)并用 `@graph` 打包——可直接参考 openUBMC 官网 /docs 实现 |
| P1 | openEuler 文档、openUBMC 官网 | TechArticle/Article 补 image(≥1200px)/datePublished/author |
| P1 | openGauss 官网 | SoftwareApplication 补 operatingSystem+offers;Organization 补 logo |
| P1 | 全部 | 网关/CDN 统一注入 `Link: </llms.txt>; rel="describedby"` + `X-Llms-Txt`(无需改页面) |
| P2 | 全部 | 补 `## Optional` 收尾节;logo 改 ImageObject 形式并绝对化;llms-full 排除 banner 噪音(llm-exclude);裁剪历史版本 |
| P2 | openGauss 文档、openUBMC 官网 | 修复 .well-known 伪别名(路由层排除,返回真实 txt 或 404) |
| P2 | openUBMC 文档 | 统一 www/非 www 域名(链接指向 openubmc.cn 但 www.openubmc.cn/docs/ 404、/docs/zh/latest/ 403) |

## 六、检测工具增强(随本次核查合入)

`check-llms-txt.mjs` / `check-jsonld.mjs` 已增强,新增能力(此前 `检测方式.md` 已承诺但未实现):

- llms.txt:描述覆盖率阈值(≥80%)、单节链接数分布、HTTP Link/X-Llms-Txt 头捕获、.well-known 伪别名识别(200+HTML)、llms-full.txt 结构检测(文件头/头部一致性/Source 格式分类/真实体积 Range 探测)
- JSON-LD:**修复 @context 数组形式误判**(块为 `[{...}]` 时原实现取不到 @context)、重复块检测、@id 覆盖率、@graph 使用、inLanguage/logo 形态校验
- `lib/http.mjs`:超时/网络异常不再导致脚本崩溃、支持字节上限截断读取(大文件结构分析不必全量下载)
