# JSON-LD 检查简短报告 · openEuler 官网（openEuler-portal）

- 检查时间：2026-10-26T09:07:26.808Z
- 采样入口：https://www.openeuler.org
- 结论：❌

### 抓取概况

- sitemap 全量页面 2037 个，成功抓取 2035 个（失败 2 个不计入）；合法 JSON-LD 块 1347 个（含块页面 1392 个）
- 全站出现的 `@type`：WebPage、Report、ItemList、Dataset、SoftwareApplication、TechArticle、Article、FAQPage、HowTo、BreadcrumbList、Organization、AboutPage、ProgramMembership、CollectionPage、ContactPage 等 28 种
- P0 三件套（告警级）：缺 WebSite；Google 必填属性缺失（告警级）：592 处

### 问题清单（2 类硬性不符合）

- ❌ JSON 语法错误块 45 个（涉及 45 个页面，如 https://www.openeuler.org/zh/community/program/ 、https://www.openeuler.org/en/faq/application-development/ 、https://www.openeuler.org/en/faq/cloud-native/ ）
- ❌ @context 异常块 49 个（应固定为 https://schema.org）

### 告警（4 条）

- ⚠️ P0 三件套缺失：WebSite（全站抓取页面未出现该类型；已降级为告警级，人工定夺，不触发提单）
- ⚠️ Google 必填属性缺失 592 处（主要：TechArticle.image×105、TechArticle.datePublished×104、Article.datePublished×97 等；已降级为告警级，人工定夺，不触发提单）
- ⚠️ 结构与推荐项问题 281 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）
- ⚠️ @id 覆盖率 9%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）
