# JSON-LD 检查完全版报告 · openEuler 文档（openEuler-docs）

- 检查时间：2026-10-24T10:14:27.082Z

### 项目信息

- 项目：openEuler 文档（openEuler-docs）
- 采样域名：https://docs.openeuler.org
- 结论：❌（硬性错误 2 类 / 告警 1 条）

### 采样页面

| 页面 | JSON-LD 块数 | 类型 |
| --- | --- | --- |
| / | 0 | - |
| https://docs.openeuler.org/en/docs/common/faq/caselibrary/pvs_vgs.html | 1 | BreadcrumbList、TechArticle |
| https://docs.openeuler.org/en/docs/common/faq/caselibrary/mountsysroot.html | 1 | BreadcrumbList、TechArticle、HowTo |

### 问题清单（全部 2 类硬性不符合）

- ❌ P0 三件套缺失：Organization / WebSite（采样页未出现该类型）
- ❌ Google 必填属性缺失 4 处（主要：TechArticle.image×2、TechArticle.datePublished×2）

### 告警（全部 1 条）

- ⚠️ @id 覆盖率 0%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）

### Google 必填属性缺失（全部 4 处）

| 页面 | 类型 | 缺失属性 |
| --- | --- | --- |
| https://docs.openeuler.org/en/docs/common/faq/caselibrary/pvs_vgs.html | TechArticle | image |
| https://docs.openeuler.org/en/docs/common/faq/caselibrary/pvs_vgs.html | TechArticle | datePublished |
| https://docs.openeuler.org/en/docs/common/faq/caselibrary/mountsysroot.html | TechArticle | image |
| https://docs.openeuler.org/en/docs/common/faq/caselibrary/mountsysroot.html | TechArticle | datePublished |
