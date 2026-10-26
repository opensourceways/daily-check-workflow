# JSON-LD 检查简短报告 · HiFloat（HiFloat）

- 检查时间：2026-10-26T09:07:26.808Z
- 采样入口：https://hifloat.gccorg.com
- 结论：❌

### 抓取概况

- sitemap 全量页面 50 个，成功抓取 50 个（失败 0 个不计入）；合法 JSON-LD 块 7 个（含块页面 7 个）
- 全站出现的 `@type`：BreadcrumbList、ItemList、Organization、WebSite、WebPage、CollectionPage
- P0 三件套（告警级）：✅ 全站齐备；Google 必填属性缺失（告警级）：0 处

### 问题清单（1 类硬性不符合）

- ❌ @context 异常块 1 个（应固定为 https://schema.org）

### 告警（2 条）

- ⚠️ 结构与推荐项问题 3 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）
- ⚠️ @id 覆盖率 13%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）
