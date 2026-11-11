# llms.txt 规范检查报告

- 检查时间：2026-11-11T06:48:33.316Z
- 检查范围：projects.config.json 中 1 个项目
- 运行模式：提 issue（--submit-issues，--force 强制执行：已有未关闭 issue 时更新原 issue 或评论 /close）
- 指定项目：--site=openEuler-docs
- 规范来源：measures/02-llms-txt/规范.md（验收基线 P0/P1/P2）
- 检查项：可访问性/Content-Type、H1 唯一、Summary、分节与链接结构（URL 可解析）、描述覆盖率（≥80%）与空冒号/无标题/超300、单节链接数（建议 5–20）、100k 体积、llms-full.txt（可达/文件头/Source 格式）、HTTP 发现头、.well-known 别名（含伪别名识别）、robots LLM-Policy 联动、抽样链接可达
- 特殊约定：提单触发 = P0 级硬性错误；P1/P2 与质量项仅计告警入报告；robots LLM-Policy 缺失在本维度计告警（提单由 01-robots-txt 维度负责，避免同一根因跨维度重复提单）；llmsUrl 未配置的项目记 ❌ 但不查重、不提单
- 机器可读结果：scripts/stats/llms-txt-stats.json

## 总览

| 项目 | llms.txt | 可访问 | Content-Type | H1 | Summary | 链接数 | 描述覆盖率 | ≤100k | llms-full | robots 联动 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openEuler 文档（openEuler-docs） | https://docs.openeuler.org/llms.txt | ✅ (200) | ✅ | ✅ | ✅ | 121 | 0.0% | ✅ | ✅ | ✅ | ⚠️，[issue](https://atomgit.com/openeuler/docs-website/issues/77) |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 `<项目ID>-full.md`）


## 结论与建议

- 存在告警：openEuler-docs，多为 P1 基线（llms-full/描述覆盖率/发现头）与质量项，是否整改人工定夺。
- 强制复检问题已消除，已评论 /close 关闭原 issue：openEuler-docs。

> 注：本报告由 scripts/checks/check-llms-txt.mjs 自动生成（同批次数据见 scripts/stats/llms-txt-stats.json）。内容准确性（把 llms.txt 交给 agent 问答）与分组合理性仍需人工，见 measures/02-llms-txt/检测方式.md。硬性不符合项目已按 --submit-issues 流程提 issue（告警与 llmsUrl 未配置不提单）。
