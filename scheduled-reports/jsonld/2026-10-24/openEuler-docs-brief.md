# JSON-LD 检查简短报告 · openEuler 文档（openEuler-docs）

- 检查时间：2026-10-24T10:14:27.082Z
- 采样入口：https://docs.openeuler.org
- 结论：❌

### 采样概况

- 采样页面：/、/docs、/zh/docs、https://docs.openeuler.org/en/docs/common/faq/caselibrary/pvs_vgs.html、https://docs.openeuler.org/en/docs/common/faq/caselibrary/mountsysroot.html；发现合法块 2 个；类型：BreadcrumbList、TechArticle、HowTo

### 问题清单（2 类硬性不符合）

- ❌ P0 三件套缺失：Organization / WebSite（采样页未出现该类型）
- ❌ Google 必填属性缺失 4 处（主要：TechArticle.image×2、TechArticle.datePublished×2）

### 告警（1 条）

- ⚠️ @id 覆盖率 0%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）
