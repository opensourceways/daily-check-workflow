# JSON-LD 检查简短报告 · MindSpore 官网（MindSpore-portal）

- 检查时间：2026-10-26T09:07:26.808Z
- 采样入口：https://www.mindspore.cn
- 结论：❌

### 抓取概况

- sitemap 全量页面 2424 个，成功抓取 2420 个（失败 4 个不计入）；合法 JSON-LD 块 1728 个（含块页面 1729 个）
- 全站出现的 `@type`：NewsArticle、WebPage、BreadcrumbList、ItemList、Event、CollectionPage、Organization、HowTo、WebSite、SoftwareApplication、FAQPage、Article
- P0 三件套（告警级）：✅ 全站齐备；Google 必填属性缺失（告警级）：23 处

### 问题清单（2 类硬性不符合）

- ❌ JSON 语法错误块 2 个（涉及 2 个页面，如 https://www.mindspore.cn/sig/en 、https://www.mindspore.cn/sig ）
- ❌ @context 异常块 5 个（应固定为 https://schema.org）

### 告警（3 条）

- ⚠️ Google 必填属性缺失 23 处（主要：Event.location×12、WebPage.url×5、WebPage.name×2 等；已降级为告警级，人工定夺，不触发提单）
- ⚠️ 结构与推荐项问题 20 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）
- ⚠️ @id 覆盖率 3%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）
