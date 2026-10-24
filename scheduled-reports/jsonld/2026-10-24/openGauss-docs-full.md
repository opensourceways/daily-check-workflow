# JSON-LD 检查完全版报告 · openGauss 文档（openGauss-docs）

- 检查时间：2026-10-24T10:14:27.082Z

### 项目信息

- 项目：openGauss 文档（openGauss-docs）
- 采样域名：https://docs.opengauss.org
- 结论：❌（硬性错误 1 类 / 告警 1 条）

### 采样页面

| 页面 | JSON-LD 块数 | 类型 |
| --- | --- | --- |
| / | 0 | - |
| /docs | 0 | - |
| https://docs.opengauss.org/zh/docs/common/faq/core.html | 1 | BreadcrumbList、FAQPage |
| https://docs.opengauss.org/en.html | 0 | - |

### 问题清单（全部 1 类硬性不符合）

- ❌ P0 三件套缺失：Organization / WebSite（采样页未出现该类型）

### 告警（全部 1 条）

- ⚠️ @id 覆盖率 0%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）
