# JSON-LD 检查简短报告 · openGauss 官网（openGauss-portal）

- 检查时间：2026-10-24T10:14:27.082Z
- 采样入口：https://opengauss.org
- 结论：❌

### 采样概况

- 采样页面：/、/docs、/zh/docs、https://opengauss.org/zh/about-us/、https://opengauss.org/zh/advanced/；发现合法块 3 个；类型：Organization、WebSite、SoftwareApplication、LearningResource

### 问题清单（2 类硬性不符合）

- ❌ P0 三件套缺失：BreadcrumbList（采样页未出现该类型）
- ❌ Google 必填属性缺失 2 处（主要：SoftwareApplication.operatingSystem×2）

### 告警（2 条）

- ⚠️ 结构与推荐项问题 2 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）
- ⚠️ @id 覆盖率 0%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）
