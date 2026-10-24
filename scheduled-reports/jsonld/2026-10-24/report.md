# JSON-LD 规范检查报告

- 检查时间：2026-10-24T10:14:27.082Z
- 检查范围：projects.config.json 中 10 个项目
- 运行模式：提 issue（--submit-issues）
- 采样策略：首页 + `check-rules.json` 的 `samplePages`（/、/docs、/zh/docs）+ 各项目 llms.txt 前 2 条真实内容页链接，仅统计返回 200 的页面
- 规范来源：measures/04-json-ld/规范.md（验收基线 P0–P2）
- 检查项：JSON 语法、`@context`、P0 三件套覆盖（Organization/WebSite/BreadcrumbList）、各类型 Google 必填属性、占位符；告警级：重复块、面包屑项完整性、headline ≤110、publisher/Organization logo 形态、inLanguage、`@id` 覆盖率
- 特殊约定：提单触发 = P0 级硬性错误（语法错误/@context 异常/三件套缺失/必填属性缺失/占位符/首页不可访问）；P1 结构项仅计告警入报告
- 机器可读结果：scripts/stats/jsonld-stats.json

## 总览

| 项目 | 首页可访问 | 合法块 | 语法错误 | @context 异常 | P0 三件套 | 必填缺失 | 占位符 | 告警 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openEuler 官网（openEuler-portal） | ✅ | 3 | 0 | 0 | ❌ WebSite/BreadcrumbList | 0 | 0 | 2 | ❌，[issue](https://atomgit.com/openeuler/openEuler-portal/issues/363) |
| openEuler 文档（openEuler-docs） | ✅ | 2 | 0 | 0 | ❌ Organization/WebSite | 4 | 0 | 1 | ❌，[issue](https://atomgit.com/openeuler/docs-website/issues/78) |
| openGauss 官网（openGauss-portal） | ✅ | 3 | 0 | 0 | ❌ BreadcrumbList | 2 | 0 | 2 | ❌，[issue](https://atomgit.com/opengauss/website/issues/448) |
| openGauss 文档（openGauss-docs） | ✅ | 1 | 0 | 0 | ❌ Organization/WebSite | 0 | 0 | 1 | ❌，[issue](https://atomgit.com/opengauss/docs-website/issues/37) |
| MindSpore 官网（MindSpore-portal） | ✅ | 3 | 0 | 0 | ✅ | 0 | 0 | 2 | ⚠️ |
| MindSpore 文档（MindSpore-docs） | ✅ | 0 | 0 | 0 | ❌ Organization/WebSite/BreadcrumbList | 0 | 0 | 0 | ❌，[issue](https://atomgit.com/mindspore/website-docs/issues/2) |
| openUBMC 官网（openUBMC-portal） | ✅ | 5 | 0 | 0 | ✅ | 3 | 0 | 2 | ❌，[issue](https://atomgit.com/openUBMC/website/issues/312) |
| openUBMC 文档（openUBMC-docs） | ✅ | 1 | 0 | 0 | ✅ | 0 | 0 | 1 | ⚠️ |
| UnifiedBus（UnifiedBus） | ✅ | 2 | 0 | 0 | ❌ BreadcrumbList | 0 | 0 | 1 | ❌，[issue](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/113) |
| HiFloat（HiFloat） | ✅ | 3 | 0 | 0 | ✅ | 0 | 0 | 2 | ⚠️ |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 `<项目ID>-full.md`）

- openEuler 官网（openEuler-portal）：`scheduled-reports/jsonld/2026-10-24/openEuler-portal-full.md`，issue：https://atomgit.com/openeuler/openEuler-portal/issues/363
- openEuler 文档（openEuler-docs）：`scheduled-reports/jsonld/2026-10-24/openEuler-docs-full.md`，issue：https://atomgit.com/openeuler/docs-website/issues/78
- openGauss 官网（openGauss-portal）：`scheduled-reports/jsonld/2026-10-24/openGauss-portal-full.md`，issue：https://atomgit.com/opengauss/website/issues/448
- openGauss 文档（openGauss-docs）：`scheduled-reports/jsonld/2026-10-24/openGauss-docs-full.md`，issue：https://atomgit.com/opengauss/docs-website/issues/37
- MindSpore 文档（MindSpore-docs）：`scheduled-reports/jsonld/2026-10-24/MindSpore-docs-full.md`，issue：https://atomgit.com/mindspore/website-docs/issues/2
- openUBMC 官网（openUBMC-portal）：`scheduled-reports/jsonld/2026-10-24/openUBMC-portal-full.md`，issue：https://atomgit.com/openUBMC/website/issues/312
- UnifiedBus（UnifiedBus）：`scheduled-reports/jsonld/2026-10-24/UnifiedBus-full.md`，issue：https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/113

## 结论与建议

- 硬性不符合：openEuler-portal（P0 三件套缺失：WebSite / BreadcrumbList（采样页未出现该类型））；openEuler-docs（P0 三件套缺失：Organization / WebSite（采样页未出现该类型） 等 2 类）；openGauss-portal（P0 三件套缺失：BreadcrumbList（采样页未出现该类型） 等 2 类）；openGauss-docs（P0 三件套缺失：Organization / WebSite（采样页未出现该类型））；MindSpore-docs（采样页面未发现任何合法 JSON-LD 块 等 2 类）；openUBMC-portal（Google 必填属性缺失 3 处（主要：Article.image×1、Article.datePublished×1、Article.author×1））；UnifiedBus（P0 三件套缺失：BreadcrumbList（采样页未出现该类型）），需优先整改。
- 存在告警：MindSpore-portal、openUBMC-docs、HiFloat，多为 P1 结构/推荐项（重复块、inLanguage、@id 覆盖率等），是否整改人工定夺。

> 注：本报告由 scripts/checks/check-jsonld.mjs 自动生成（同批次数据见 scripts/stats/jsonld-stats.json）。取值真实性（与页面可见内容一致、无编造）与富媒体资格（Rich Results Test）仍需人工抽查，见 measures/04-json-ld/检测方式.md。硬性不符合项目已按 --submit-issues 流程提 issue（告警不提单）。
