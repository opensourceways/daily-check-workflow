# JSON-LD 检查简短报告 · openGauss 官网（openGauss-portal）

- 检查时间：2026-10-26T08:03:43.838Z
- 采样入口：https://opengauss.org
- 结论：❌

### 抓取概况

- sitemap 全量页面 1339 个，成功抓取 1339 个（失败 0 个不计入）；合法 JSON-LD 块 535 个（含块页面 591 个）
- 全站出现的 `@type`：Organization、SoftwareApplication、WebPage、WebSite、BreadcrumbList、CollectionPage、ItemList、Service、HowTo、TechArticle、Event、NewsArticle、ItemPage、Article、LearningResource 等 18 种
- P0 三件套（告警级）：✅ 全站齐备；Google 必填属性缺失（告警级）：266 处

### 问题清单（2 类硬性不符合）

- ❌ JSON 语法错误块 56 个（涉及 56 个页面，如 https://opengauss.org/zh/download/life-cycle/、https://opengauss.org/zh/honor/、https://opengauss.org/zh/summit/summit2024/）
- ❌ 占位符取值 6 处（TODO/待填/占位等，禁止上线）

### 告警（3 条）

- ⚠️ Google 必填属性缺失 266 处（主要：TechArticle.image×126、TechArticle.datePublished×126、WebPage.url×5 等；已降级为告警级，人工定夺，不触发提单）
- ⚠️ 结构与推荐项问题 169 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）
- ⚠️ @id 覆盖率 26%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）
