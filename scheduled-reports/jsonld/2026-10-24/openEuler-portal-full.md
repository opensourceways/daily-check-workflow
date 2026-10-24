# JSON-LD 检查完全版报告 · openEuler 官网（openEuler-portal）

- 检查时间：2026-10-24T10:14:27.082Z

### 项目信息

- 项目：openEuler 官网（openEuler-portal）
- 采样域名：https://www.openeuler.org
- 结论：❌（硬性错误 1 类 / 告警 2 条）

### 采样页面

| 页面 | JSON-LD 块数 | 类型 |
| --- | --- | --- |
| / | 1 | Organization、SoftwareApplication |
| https://www.openeuler.org/zh/annual-report/openEuler-annual-report-2024 | 1 | WebPage、Report |
| https://www.openeuler.org/zh/annual-report/openEuler-annual-report-2025 | 1 | WebPage、Report |

### 问题清单（全部 1 类硬性不符合）

- ❌ P0 三件套缺失：WebSite / BreadcrumbList（采样页未出现该类型）

### 告警（全部 2 条）

- ⚠️ 结构与推荐项问题 1 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）
- ⚠️ @id 覆盖率 33%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）

### 结构与推荐项问题（全部 1 处）

- ⚠️ / · Organization：logo 为裸字符串,推荐 {"@type":"ImageObject","url":...} 形式
