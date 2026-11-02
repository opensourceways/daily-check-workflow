# TDK 重复性检查报告

- 检查时间：2026-11-02T11:31:46.644Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML 分组判重（title/description/keywords），数据与 JSON-LD 维度共用同一份抓取（脚本已合并为 check-tdk-jsonld.mjs）
- 判重字段：title（`<title>` 文本）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`），按去空格后的原文精确分组，同值对应 ≥2 个页面即记为重复组；空值/缺失不参与判重，单独计入"TDK 缺失检查"（区分元素缺失/内容为空）
- 运行模式：提 issue（--submit-issues）；本次维度：tdk、jsonld
- 特殊约定：默认跳过 openEuler-docs、openGauss-docs、MindSpore-docs 三个 docs 项目（与 JSON-LD 维度共用同一跳过清单）；如需检查可用 --skip= 传空覆盖；配置 newVersions 的 docs 项目仅收集匹配版本的子 sitemap 页面
- 完整重复组与缺失数据见：scripts/stats/tdk-duplicate-stats.json

## 总览

| 项目 | sitemap 页面数 | 成功抓取 | 抓取失败 | title 重复组/页 | description 重复组/页 | keywords 重复组/页 | 缺失页 t/d/k | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openEuler 官网（openEuler-portal） | 2042 | 2040 | 2 | 31/64 | 50/152 | 57/943 | 0/6/653 | ⚠️ 存在重复+缺失，[issue](https://atomgit.com/openeuler/openEuler-portal/issues/378) |
| openEuler 文档（openEuler-docs） | - | - | - | - | - | - | - | ⏭️ 跳过 |
| openGauss 官网（openGauss-portal） | 1339 | 1339 | 0 | 34/73 | 98/228 | 8/816 | 0/0/0 | ⚠️ 存在重复，[issue](https://atomgit.com/opengauss/website/issues/462) |
| openGauss 文档（openGauss-docs） | - | - | - | - | - | - | - | ⏭️ 跳过 |
| MindSpore 官网（MindSpore-portal） | 2430 | 2426 | 4 | 40/742 | 57/817 | 7/2338 | 0/0/0 | ⚠️ 存在重复，[issue](https://atomgit.com/mindspore/mindspore-portal/issues/315) |
| MindSpore 文档（MindSpore-docs） | - | - | - | - | - | - | - | ⏭️ 跳过 |
| openUBMC 官网（openUBMC-portal） | 276 | 276 | 0 | 14/37 | 15/58 | 8/46 | 2/2/2 | ⚠️ 存在重复+缺失，[issue](https://atomgit.com/openUBMC/website/issues/329) |
| openUBMC 文档（openUBMC-docs） | 4223 | 4221 | 2 | 57/128 | 1/4218 | 0/0 | 0/0/4221 | ⚠️ 存在重复+缺失，[issue](https://atomgit.com/openUBMC/docs-website/issues/28) |
| UnifiedBus（UnifiedBus） | 136 | 136 | 0 | 0/0 | 0/0 | 0/0 | 81/99/114 | ⚠️ 存在缺失，[issue](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/122) |
| HiFloat（HiFloat） | 52 | 52 | 0 | 2/10 | 4/11 | 1/2 | 1/9/45 | ⚠️ 存在重复+缺失，[issue](https://atomgit.com/hifloat/hifloat-portal/issues/59) |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录 `<项目ID>-full.md`）
- openEuler 官网（openEuler-portal）：`openEuler-portal-full.md`，issue：https://atomgit.com/openeuler/openEuler-portal/issues/378（已提单）
- openGauss 官网（openGauss-portal）：`openGauss-portal-full.md`，issue：https://atomgit.com/opengauss/website/issues/462（已提单）
- MindSpore 官网（MindSpore-portal）：`MindSpore-portal-full.md`，issue：https://atomgit.com/mindspore/mindspore-portal/issues/315（已提单）
- openUBMC 官网（openUBMC-portal）：`openUBMC-portal-full.md`，issue：https://atomgit.com/openUBMC/website/issues/329（已提单）
- openUBMC 文档（openUBMC-docs）：`openUBMC-docs-full.md`，issue：https://atomgit.com/openUBMC/docs-website/issues/28（已提单）
- UnifiedBus（UnifiedBus）：`UnifiedBus-full.md`，issue：https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/122（已提单）
- HiFloat（HiFloat）：`HiFloat-full.md`，issue：https://atomgit.com/hifloat/hifloat-portal/issues/59（已提单）
