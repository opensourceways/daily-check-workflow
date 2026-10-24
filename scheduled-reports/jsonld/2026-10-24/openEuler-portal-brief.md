# JSON-LD 检查简短报告 · openEuler 官网（openEuler-portal）

- 检查时间：2026-10-24T10:14:27.082Z
- 采样入口：https://www.openeuler.org
- 结论：❌

### 采样概况

- 采样页面：/、/docs、/zh/docs、https://www.openeuler.org/zh/annual-report/openEuler-annual-report-2024、https://www.openeuler.org/zh/annual-report/openEuler-annual-report-2025；发现合法块 3 个；类型：Organization、SoftwareApplication、WebPage、Report

### 问题清单（1 类硬性不符合）

- ❌ P0 三件套缺失：WebSite / BreadcrumbList（采样页未出现该类型）

### 告警（2 条）

- ⚠️ 结构与推荐项问题 1 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）
- ⚠️ @id 覆盖率 33%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）
