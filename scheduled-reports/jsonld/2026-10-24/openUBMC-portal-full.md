# JSON-LD 检查完全版报告 · openUBMC 官网（openUBMC-portal）

- 检查时间：2026-10-24T10:14:27.082Z

### 项目信息

- 项目：openUBMC 官网（openUBMC-portal）
- 采样域名：https://www.openubmc.cn
- 结论：❌（硬性错误 1 类 / 告警 2 条）

### 采样页面

| 页面 | JSON-LD 块数 | 类型 |
| --- | --- | --- |
| / | 1 | WebSite |
| /docs | 1 | WebPage、CollectionPage、WebSite、Organization、BreadcrumbList、WebPageElement |
| /zh/docs | 1 | WebPage、CollectionPage、WebSite、Organization、BreadcrumbList、WebPageElement |
| https://www.openubmc.cn/zh/ai-coding-assistants | 1 | Article |
| https://www.openubmc.cn/zh/brand | 1 | WebPage、Organization、Brand、WebSite |

### 问题清单（全部 1 类硬性不符合）

- ❌ Google 必填属性缺失 3 处（主要：Article.image×1、Article.datePublished×1、Article.author×1）

### 告警（全部 2 条）

- ⚠️ 结构与推荐项问题 3 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）
- ⚠️ @id 覆盖率 89%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）

### Google 必填属性缺失（全部 3 处）

| 页面 | 类型 | 缺失属性 |
| --- | --- | --- |
| https://www.openubmc.cn/zh/ai-coding-assistants | Article | image |
| https://www.openubmc.cn/zh/ai-coding-assistants | Article | datePublished |
| https://www.openubmc.cn/zh/ai-coding-assistants | Article | author |

### 结构与推荐项问题（全部 3 处）

- ⚠️ /docs · Organization：logo.url 非绝对 URL
- ⚠️ /zh/docs · Organization：logo.url 非绝对 URL
- ⚠️ https://www.openubmc.cn/zh/ai-coding-assistants · TechArticle：publisher 缺少 logo
