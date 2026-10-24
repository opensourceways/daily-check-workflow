# llms.txt 规范检查报告

- 检查时间：2026-10-24T09:16:35.573Z
- 检查范围：projects.config.json 中 10 个项目
- 运行模式：提 issue（--submit-issues）
- 规范来源：measures/02-llms-txt/规范.md（验收基线 P0/P1/P2）
- 检查项：可访问性/Content-Type、H1 唯一、Summary、分节与链接结构（URL 可解析）、描述覆盖率（≥80%）与空冒号/无标题/超300、单节链接数（建议 5–20）、100k 体积、llms-full.txt（可达/文件头/Source 格式）、HTTP 发现头、.well-known 别名（含伪别名识别）、robots LLM-Policy 联动、抽样链接可达
- 特殊约定：提单触发 = P0 级硬性错误；P1/P2 与质量项仅计告警入报告；robots LLM-Policy 缺失在本维度计告警（提单由 01-robots-txt 维度负责，避免同一根因跨维度重复提单）；llmsUrl 未配置的项目记 ❌ 但不查重、不提单
- 机器可读结果：scripts/stats/llms-txt-stats.json

## 总览

| 项目 | llms.txt | 可访问 | Content-Type | H1 | Summary | 链接数 | 描述覆盖率 | ≤100k | llms-full | robots 联动 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openEuler 官网（openEuler-portal） | https://www.openeuler.org/llms.txt | ✅ (200) | ✅ | ✅ | ✅ | 1394 | 100.0% | ❌ | ✅ | ✅ | ❌，[issue](https://atomgit.com/openeuler/openEuler-portal/issues/362) |
| openEuler 文档（openEuler-docs） | https://docs.openeuler.org/llms.txt | ✅ (200) | ✅ | ✅ | ✅ | 6397 | 4.6% | ❌ | ✅ | ✅ | ❌，[issue](https://atomgit.com/openeuler/docs-website/issues/77) |
| openGauss 官网（openGauss-portal） | https://opengauss.org/llms.txt | ✅ (200) | ✅ | ✅ | ✅ | 155 | 100.0% | ✅ | ✅ | ✅ | ⚠️ |
| openGauss 文档（openGauss-docs） | https://docs.opengauss.org/llms.txt | ✅ (200) | ✅ | ✅ | ❌ | 21 | 0.0% | ✅ | ✅ | ✅ | ❌，[issue](https://atomgit.com/opengauss/docs-website/issues/36) |
| MindSpore 官网（MindSpore-portal） | https://www.mindspore.cn/llms.txt | ✅ (200) | ✅ | ✅ | ✅ | 48 | 0.0% | ✅ | ✅ | ✅ | ⚠️ |
| MindSpore 文档（MindSpore-docs） | https://www.mindspore.cn/docs/llms.txt | ❌ (404) | - | - | - | - | - | - | - | - | ❌，[issue](https://atomgit.com/mindspore/website-docs/issues/1) |
| openUBMC 官网（openUBMC-portal） | https://www.openubmc.cn/llms.txt | ✅ (200) | ✅ | ✅ | ✅ | 228 | 99.1% | ✅ | ✅ | ✅ | ⚠️ |
| openUBMC 文档（openUBMC-docs） | https://www.openubmc.cn/docs/llms.txt | ✅ (200) | ✅ | ✅ | ✅ | 4214 | 0.1% | ❌ | ✅ | - | ❌，[issue](https://atomgit.com/openUBMC/docs-website/issues/23) |
| UnifiedBus（UnifiedBus） | https://www.unifiedbus.com/llms.txt | ✅ (200) | ✅ | ✅ | ✅ | 8 | 100.0% | ✅ | ✅ | ✅ | ⚠️ |
| HiFloat（HiFloat） | https://hifloat.gccorg.com/llms.txt | ✅ (200) | ✅ | ❌ | ✅ | 13 | 30.8% | ✅ | ✅ | ✅ | ❌，[issue](https://atomgit.com/hifloat/hifloat-portal/issues/45) |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 `<项目ID>-full.md`）

- openEuler 官网（openEuler-portal）：`scheduled-reports/llms/2026-10-24/openEuler-portal-full.md`，issue：https://atomgit.com/openeuler/openEuler-portal/issues/362
- openEuler 文档（openEuler-docs）：`scheduled-reports/llms/2026-10-24/openEuler-docs-full.md`，issue：https://atomgit.com/openeuler/docs-website/issues/77
- openGauss 文档（openGauss-docs）：`scheduled-reports/llms/2026-10-24/openGauss-docs-full.md`，issue：https://atomgit.com/opengauss/docs-website/issues/36
- MindSpore 文档（MindSpore-docs）：`scheduled-reports/llms/2026-10-24/MindSpore-docs-full.md`，issue：https://atomgit.com/mindspore/website-docs/issues/1
- openUBMC 文档（openUBMC-docs）：`scheduled-reports/llms/2026-10-24/openUBMC-docs-full.md`，issue：https://atomgit.com/openUBMC/docs-website/issues/23
- HiFloat（HiFloat）：`scheduled-reports/llms/2026-10-24/HiFloat-full.md`，issue：https://atomgit.com/hifloat/hifloat-portal/issues/45

## 结论与建议

- 硬性不符合：openEuler-portal（体积 262,231 字符超 100,000 上限，应拆分 `/_llms/` 子索引）；openEuler-docs（体积 649,563 字符超 100,000 上限，应拆分 `/_llms/` 子索引）；openGauss-docs（缺少 Summary blockquote（`> 摘要`））；MindSpore-docs（llms.txt 不可访问 (404)）；openUBMC-docs（体积 635,708 字符超 100,000 上限，应拆分 `/_llms/` 子索引）；HiFloat（H1 不唯一（应仅一行 `# 站点名`）），需优先整改。
- 存在告警：openGauss-portal、MindSpore-portal、openUBMC-portal、UnifiedBus，多为 P1 基线（llms-full/描述覆盖率/发现头）与质量项，是否整改人工定夺。

> 注：本报告由 scripts/checks/check-llms-txt.mjs 自动生成（同批次数据见 scripts/stats/llms-txt-stats.json）。内容准确性（把 llms.txt 交给 agent 问答）与分组合理性仍需人工，见 measures/02-llms-txt/检测方式.md。硬性不符合项目已按 --submit-issues 流程提 issue（告警与 llmsUrl 未配置不提单）。
