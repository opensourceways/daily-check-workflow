# JSON-LD 检查完全版报告 · openGauss 官网（openGauss-portal）

- 检查时间：2026-10-24T10:14:27.082Z

### 项目信息

- 项目：openGauss 官网（openGauss-portal）
- 采样域名：https://opengauss.org
- 结论：❌（硬性错误 2 类 / 告警 2 条）

### 采样页面

| 页面 | JSON-LD 块数 | 类型 |
| --- | --- | --- |
| / | 1 | Organization、WebSite、SoftwareApplication |
| https://opengauss.org/zh/about-us/ | 1 | SoftwareApplication |
| https://opengauss.org/zh/advanced/ | 1 | LearningResource |

### 问题清单（全部 2 类硬性不符合）

- ❌ P0 三件套缺失：BreadcrumbList（采样页未出现该类型）
- ❌ Google 必填属性缺失 2 处（主要：SoftwareApplication.operatingSystem×2）

### 告警（全部 2 条）

- ⚠️ 结构与推荐项问题 2 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）
- ⚠️ @id 覆盖率 0%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）

### Google 必填属性缺失（全部 2 处）

| 页面 | 类型 | 缺失属性 |
| --- | --- | --- |
| / | SoftwareApplication | operatingSystem |
| https://opengauss.org/zh/about-us/ | SoftwareApplication | operatingSystem |

### 结构与推荐项问题（全部 2 处）

- ⚠️ / · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ / · WebSite：缺少 inLanguage(中文站应为 zh-CN)
