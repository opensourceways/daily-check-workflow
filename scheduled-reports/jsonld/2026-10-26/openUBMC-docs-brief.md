# JSON-LD 检查简短报告 · openUBMC 文档（openUBMC-docs）

- 检查时间：2026-10-26T09:07:26.808Z
- 采样入口：https://www.openubmc.cn/docs
- 结论：❌

### 抓取概况

- sitemap 全量页面 4218 个，成功抓取 4216 个（失败 2 个不计入）；合法 JSON-LD 块 0 个（含块页面 0 个）
- 全站出现的 `@type`：(无)
- P0 三件套（告警级）：缺 Organization / WebSite / BreadcrumbList；Google 必填属性缺失（告警级）：0 处

### 问题清单（1 类硬性不符合）

- ❌ 全站抓取到的 4216 个页面均未发现合法 JSON-LD 块

### 告警（1 条）

- ⚠️ P0 三件套缺失：Organization / WebSite / BreadcrumbList（全站抓取页面未出现该类型；已降级为告警级，人工定夺，不触发提单）
