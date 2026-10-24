# JSON-LD 检查简短报告 · openUBMC 官网（openUBMC-portal）

- 检查时间：2026-10-24T10:14:27.082Z
- 采样入口：https://www.openubmc.cn
- 结论：❌

### 采样概况

- 采样页面：/、/docs、/zh/docs、https://www.openubmc.cn/zh/ai-coding-assistants、https://www.openubmc.cn/zh/brand；发现合法块 5 个；类型：WebSite、WebPage、CollectionPage、Organization、BreadcrumbList、WebPageElement、Article、Brand

### 问题清单（1 类硬性不符合）

- ❌ Google 必填属性缺失 3 处（主要：Article.image×1、Article.datePublished×1、Article.author×1）

### 告警（2 条）

- ⚠️ 结构与推荐项问题 3 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）
- ⚠️ @id 覆盖率 89%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）
