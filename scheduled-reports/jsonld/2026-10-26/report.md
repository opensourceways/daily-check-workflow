# JSON-LD 规范检查报告

- 检查时间：2026-10-26T09:07:26.808Z
- 检查范围：projects.config.json 中 10 个项目（跳过：openEuler-docs、openGauss-docs、MindSpore-docs）
- 运行模式：提 issue（--submit-issues，--force 强制执行：已有未关闭 issue 时更新原 issue 或评论 /close）；本次维度：jsonld
- 检查策略（2026-10 起）：不再采样——按各项目 sitemap 全量展开页面 URL 逐页抓取（与 TDK 重复维度共用同一份 HTML 抓取，脚本 check-tdk-jsonld.mjs）；默认跳过 docs 大站（--skip= 传空覆盖）；抓取失败页面单列不计入判定
- 规范来源：measures/04-json-ld/规范.md
- 检查项：硬性=JSON 语法、`@context`、整站无合法块、站点/sitemap 不可达（占位符检查 2026-10 起停用：英文业务文案含 todo/tbd 等词误伤，待重新设计）；告警=P0 三件套覆盖（Organization/WebSite/BreadcrumbList，已降级）、各类型 Google 必填属性（已降级）、同页重复块、面包屑项完整性、headline ≤110、publisher/Organization logo 形态、inLanguage、`@id` 覆盖率
- 特殊约定：提单触发仅上述硬性项（P0 三件套与 Google 必填属性缺失自 2026-10 起仅计告警）；每维度独立查重（前缀 `[GEO JSON-LD]`），未关闭 issue 期间不重复扫描提单
- 机器可读结果：scripts/stats/jsonld-stats.json

## 总览

| 项目 | sitemap 页面/抓取 | 合法块 | 语法错误 | @context 异常 | 占位符（停用） | P0 三件套（告警） | 必填缺失（告警） | 其他告警 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openEuler 官网（openEuler-portal） | 2037/2035（失败 2） | 1347 | 45 | 49 | 0 | ⚠️ 缺 WebSite | 592 | 2 | ❌，[issue](https://atomgit.com/openeuler/openEuler-portal/issues/363) |
| openEuler 文档（openEuler-docs） | - | - | - | - | - | - | - | - | ⏭️ 跳过 |
| openGauss 官网（openGauss-portal） | 1339/1339（失败 0） | 535 | 56 | 0 | 0 | ✅ | 266 | 2 | ❌，[issue](https://atomgit.com/opengauss/website/issues/448) |
| openGauss 文档（openGauss-docs） | - | - | - | - | - | - | - | - | ⏭️ 跳过 |
| MindSpore 官网（MindSpore-portal） | 2424/2420（失败 4） | 1728 | 2 | 5 | 0 | ✅ | 23 | 2 | ❌，[issue](https://atomgit.com/mindspore/mindspore-portal/issues/298) |
| MindSpore 文档（MindSpore-docs） | - | - | - | - | - | - | - | - | ⏭️ 跳过 |
| openUBMC 官网（openUBMC-portal） | 286/286（失败 0） | 249 | 0 | 0 | 0 | ✅ | 140 | 2 | ⚠️，[issue](https://atomgit.com/openUBMC/website/issues/312) |
| openUBMC 文档（openUBMC-docs） | 4218/4216（失败 2） | 0 | 0 | 0 | 0 | ⚠️ 缺 Organization/WebSite/BreadcrumbList | 0 | 0 | ❌，[issue](https://atomgit.com/openUBMC/docs-website/issues/24) |
| UnifiedBus（UnifiedBus） | 135/135（失败 0） | 55 | 0 | 0 | 0 | ✅ | 0 | 2 | ⚠️，[issue](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/113) |
| HiFloat（HiFloat） | 50/50（失败 0） | 7 | 0 | 1 | 0 | ✅ | 0 | 2 | ❌，[issue](https://atomgit.com/hifloat/hifloat-portal/issues/46) |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 `<项目ID>-full.md`）

- openEuler 官网（openEuler-portal）：`scheduled-reports/jsonld/2026-10-26/openEuler-portal-full.md`，issue：https://atomgit.com/openeuler/openEuler-portal/issues/363
- openGauss 官网（openGauss-portal）：`scheduled-reports/jsonld/2026-10-26/openGauss-portal-full.md`，issue：https://atomgit.com/opengauss/website/issues/448
- MindSpore 官网（MindSpore-portal）：`scheduled-reports/jsonld/2026-10-26/MindSpore-portal-full.md`，issue：https://atomgit.com/mindspore/mindspore-portal/issues/298
- openUBMC 文档（openUBMC-docs）：`scheduled-reports/jsonld/2026-10-26/openUBMC-docs-full.md`，issue：https://atomgit.com/openUBMC/docs-website/issues/24
- HiFloat（HiFloat）：`scheduled-reports/jsonld/2026-10-26/HiFloat-full.md`，issue：https://atomgit.com/hifloat/hifloat-portal/issues/46
- openUBMC 官网（openUBMC-portal）：强制复检未再发现硬性错误，已评论 /close 关闭原 issue：https://atomgit.com/openUBMC/website/issues/312
- UnifiedBus（UnifiedBus）：强制复检未再发现硬性错误，已评论 /close 关闭原 issue：https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/113

## 结论与建议

- 硬性不符合：openEuler-portal（JSON 语法错误块 45 个（涉及 45 个页面，如 https://www.openeuler.org/zh/community/program/ 、https://www.openeuler.org/en/faq/application-development/ 、https://www.openeuler.org/en/faq/cloud-native/ ） 等 2 类）；openGauss-portal（JSON 语法错误块 56 个（涉及 56 个页面，如 https://opengauss.org/zh/download/life-cycle/ 、https://opengauss.org/zh/honor/ 、https://opengauss.org/zh/summit/summit2024/ ））；MindSpore-portal（JSON 语法错误块 2 个（涉及 2 个页面，如 https://www.mindspore.cn/sig/en 、https://www.mindspore.cn/sig ） 等 2 类）；openUBMC-docs（全站抓取到的 4216 个页面均未发现合法 JSON-LD 块）；HiFloat（@context 异常块 1 个（应固定为 https://schema.org）），需优先整改。
- 存在告警：openUBMC-portal（3 条，含 P0 三件套/必填属性等降级项）；UnifiedBus（2 条，含 P0 三件套/必填属性等降级项），不触发提单，是否整改人工定夺。
- 跳过（默认跳过清单或已有未关闭 issue 查重）：openEuler-docs、openGauss-docs、MindSpore-docs。
- 强制复检仍有问题，已更新原 issue：openEuler-portal、openGauss-portal。
- 强制复检硬性错误已消除，已评论 /close 关闭原 issue：openUBMC-portal、UnifiedBus。

> 注：本报告由 scripts/checks/check-tdk-jsonld.mjs（--dims 含 jsonld）自动生成，与 TDK 重复维度共用抓取（同批次数据见 scripts/stats/jsonld-stats.json）。取值真实性（与页面可见内容一致、无编造）与富媒体资格（Rich Results Test）仍需人工抽查，见 measures/04-json-ld/检测方式.md。硬性不符合项目已按 --submit-issues 流程提 issue（告警不提单）。
