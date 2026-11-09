# JSON-LD 规范检查报告

- 检查时间：2026-11-09T11:55:32.309Z
- 检查范围：projects.config.json 中 10 个项目（跳过：openEuler-docs、openGauss-portal、openGauss-docs、MindSpore-portal、MindSpore-docs、openUBMC-portal、openUBMC-docs、HiFloat）
- 运行模式：提 issue（--submit-issues）；本次维度：tdk、jsonld
- 检查策略（2026-10 起）：不再采样——按各项目 sitemap 全量展开页面 URL 逐页抓取（与 TDK 重复维度共用同一份 HTML 抓取，脚本 check-tdk-jsonld.mjs）；默认跳过 docs 大站（--skip= 传空覆盖）；抓取失败页面单列不计入判定
- 规范来源：measures/04-json-ld/规范.md
- 检查项：硬性=JSON 语法、`@context`、整站无合法块、站点/sitemap 不可达（占位符检查 2026-10 起停用：英文业务文案含 todo/tbd 等词误伤，待重新设计）；告警=P0 三件套覆盖（Organization/WebSite/BreadcrumbList，已降级）、各类型 Google 必填属性（已降级）、同页重复块、面包屑项完整性、headline ≤110、publisher/Organization logo 形态、inLanguage、`@id` 覆盖率
- 特殊约定：提单触发仅上述硬性项（P0 三件套与 Google 必填属性缺失自 2026-10 起仅计告警）；每维度独立查重（前缀 `[GEO JSON-LD]`），未关闭 issue 期间不重复扫描提单
- 机器可读结果：scripts/stats/jsonld-stats.json

## 总览

| 项目 | sitemap 页面/抓取 | 合法块 | 语法错误 | @context 异常 | 占位符（停用） | P0 三件套（告警） | 必填缺失（告警） | 其他告警 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openEuler 官网（openEuler-portal） | 2042/2040（失败 2） | 1349 | 45 | 49 | 0 | ⚠️ 缺 WebSite | 592 | 2 | ❌，[issue](https://atomgit.com/openeuler/openEuler-portal/issues/383) |
| openEuler 文档（openEuler-docs） | - | - | - | - | - | - | - | - | ⏭️ 跳过 |
| openGauss 官网（openGauss-portal） | - | - | - | - | - | - | - | - | ⏭️ 跳过 |
| openGauss 文档（openGauss-docs） | - | - | - | - | - | - | - | - | ⏭️ 跳过 |
| MindSpore 官网（MindSpore-portal） | - | - | - | - | - | - | - | - | ⏭️ 跳过 |
| MindSpore 文档（MindSpore-docs） | - | - | - | - | - | - | - | - | ⏭️ 跳过 |
| openUBMC 官网（openUBMC-portal） | - | - | - | - | - | - | - | - | ⏭️ 跳过 |
| openUBMC 文档（openUBMC-docs） | - | - | - | - | - | - | - | - | ⏭️ 跳过 |
| UnifiedBus（UnifiedBus） | 136/136（失败 0） | 52 | 0 | 0 | 0 | ✅ | 0 | 2 | ⚠️ |
| HiFloat（HiFloat） | - | - | - | - | - | - | - | - | ⏭️ 跳过 |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 `<项目ID>-full.md`）

- openEuler 官网（openEuler-portal）：`scheduled-reports/jsonld/2026-11-09/openEuler-portal-full.md`，issue：https://atomgit.com/openeuler/openEuler-portal/issues/383

## 结论与建议

- 硬性不符合：openEuler-portal（JSON 语法错误块 45 个（涉及 45 个页面，如 https://www.openeuler.org/zh/community/program/ 、https://www.openeuler.org/en/faq/application-development/ 、https://www.openeuler.org/zh/faq/cloud-native/ ） 等 2 类），需优先整改。
- 存在告警：UnifiedBus（2 条，含 P0 三件套/必填属性等降级项），不触发提单，是否整改人工定夺。
- 跳过（默认跳过清单或已有未关闭 issue 查重）：openEuler-docs、openGauss-portal、openGauss-docs、MindSpore-portal、MindSpore-docs、openUBMC-portal、openUBMC-docs、HiFloat。

> 注：本报告由 scripts/checks/check-tdk-jsonld.mjs（--dims 含 jsonld）自动生成，与 TDK 重复维度共用抓取（同批次数据见 scripts/stats/jsonld-stats.json）。取值真实性（与页面可见内容一致、无编造）与富媒体资格（Rich Results Test）仍需人工抽查，见 measures/04-json-ld/检测方式.md。硬性不符合项目已按 --submit-issues 流程提 issue（告警不提单）。
