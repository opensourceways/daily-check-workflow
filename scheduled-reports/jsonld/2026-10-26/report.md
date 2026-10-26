# JSON-LD 规范检查报告

- 检查时间：2026-10-26T08:03:43.838Z
- 检查范围：projects.config.json 中 1 个项目
- 运行模式：提 issue（--submit-issues，--force 强制执行：已有未关闭 issue 时更新原 issue 或评论 /close）；本次维度：jsonld
- 指定项目：--site=openGauss-portal
- 检查策略（2026-10 起）：不再采样——按各项目 sitemap 全量展开页面 URL 逐页抓取（与 TDK 重复维度共用同一份 HTML 抓取，脚本 check-tdk-jsonld.mjs）；默认跳过 docs 大站（--skip= 传空覆盖）；抓取失败页面单列不计入判定
- 规范来源：measures/04-json-ld/规范.md
- 检查项：硬性=JSON 语法、`@context`、占位符、整站无合法块、站点/sitemap 不可达；告警=P0 三件套覆盖（Organization/WebSite/BreadcrumbList，已降级）、各类型 Google 必填属性（已降级）、同页重复块、面包屑项完整性、headline ≤110、publisher/Organization logo 形态、inLanguage、`@id` 覆盖率
- 特殊约定：提单触发仅上述硬性项（P0 三件套与 Google 必填属性缺失自 2026-10 起仅计告警）；每维度独立查重（前缀 `[GEO JSON-LD]`），未关闭 issue 期间不重复扫描提单
- 机器可读结果：scripts/stats/jsonld-stats.json

## 总览

| 项目 | sitemap 页面/抓取 | 合法块 | 语法错误 | @context 异常 | 占位符 | P0 三件套（告警） | 必填缺失（告警） | 其他告警 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openGauss 官网（openGauss-portal） | 1339/1339（失败 0） | 535 | 56 | 0 | 6 | ✅ | 266 | 2 | ❌，[issue](https://atomgit.com/opengauss/website/issues/448) |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 `<项目ID>-full.md`）

- openGauss 官网（openGauss-portal）：`scheduled-reports/jsonld/2026-10-26/openGauss-portal-full.md`，issue：https://atomgit.com/opengauss/website/issues/448

## 结论与建议

- 硬性不符合：openGauss-portal（JSON 语法错误块 56 个（涉及 56 个页面，如 https://opengauss.org/zh/download/life-cycle/、https://opengauss.org/zh/honor/、https://opengauss.org/zh/summit/summit2024/） 等 2 类），需优先整改。
- 强制复检仍有问题，已更新原 issue：openGauss-portal。

> 注：本报告由 scripts/checks/check-tdk-jsonld.mjs（--dims 含 jsonld）自动生成，与 TDK 重复维度共用抓取（同批次数据见 scripts/stats/jsonld-stats.json）。取值真实性（与页面可见内容一致、无编造）与富媒体资格（Rich Results Test）仍需人工抽查，见 measures/04-json-ld/检测方式.md。硬性不符合项目已按 --submit-issues 流程提 issue（告警不提单）。
