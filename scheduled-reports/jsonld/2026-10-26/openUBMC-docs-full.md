# JSON-LD 检查完全版报告 · openUBMC 文档（openUBMC-docs）

- 检查时间：2026-10-26T09:07:26.808Z

### 项目信息

- 项目：openUBMC 文档（openUBMC-docs）
- 采样入口：https://www.openubmc.cn/docs ；sitemap 页面 4218 个，成功抓取 4216 个，失败 2 个
- 结论：❌（硬性错误 1 类 / 告警 1 条）

### 问题清单（全部 1 类硬性不符合）

- ❌ 全站抓取到的 4216 个页面均未发现合法 JSON-LD 块

### 告警（全部 1 条，不触发提单，是否整改人工定夺）

- ⚠️ P0 三件套缺失：Organization / WebSite / BreadcrumbList（全站抓取页面未出现该类型；已降级为告警级，人工定夺，不触发提单）

### P0 三件套（告警级）：全站未出现 Organization / WebSite / BreadcrumbList；三件套为 Organization/WebSite/BreadcrumbList，建议在首页模板统一注入

### 抓取失败页面（2 个，不计入判定）

- https://www.openubmc.cn/docs/zh/latest/hardware/component_adapt/power_adapt/tpsu&amp;psu_mgmt.html → 404
- https://www.openubmc.cn/docs/zh/latest/troubleshooting/troubleshooting_cases/fault_development/openUBMC%E4%B8%AD%E7%82%B9%E5%87%BBWeb%20UI%E7%95%8C%E9%9D%A2%E7%9A%84%E7%B3%BB%E7%BB%9F%E7%AE%A1%E7%90%86%E6%A0%8F%E4%B8%8B%E7%9A%84%E7%94%B5%E6%BA%90&amp;%E5%8A%9F%E7%8E%87%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%9B%9E%E9%A6%96%E9%A1%B5.html → 404
