# TDK 重复性检查报告

- 检查时间：2026-11-11T07:05:08.041Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML 分组判重（title/description/keywords），数据与 JSON-LD 维度共用同一份抓取（脚本已合并为 check-tdk-jsonld.mjs）
- 判重字段：title（`<title>` 文本）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`），按去空格后的原文精确分组，同值对应 ≥2 个页面即记为重复组；空值/缺失不参与判重，单独计入"TDK 缺失检查"（区分元素缺失/内容为空）
- canonical 豁免：同值组内所有页面均声明 `<link rel="canonical">` 且指向同一规范版本时，视为站点主动指定规范版本（搜索引擎仅索引规范版本），不计重复；豁免组数与明细单列于各项目报告的"canonical 豁免组"章节及 stats JSON 的 canonicalExempt 字段
- 运行模式：提 issue（--submit-issues，--force 强制执行：已有未关闭 issue 时更新原 issue 或评论 /close）；本次维度：tdk
- 指定项目：--site=openEuler-portal
- 特殊约定：默认跳过 openEuler-docs、openGauss-docs、MindSpore-docs 三个 docs 项目（与 JSON-LD 维度共用同一跳过清单）；如需检查可用 --skip= 传空覆盖；配置 newVersions 的 docs 项目仅收集匹配版本的子 sitemap 页面
- 完整重复组与缺失数据见：scripts/stats/tdk-duplicate-stats.json

## 总览

| 项目 | sitemap 页面数 | 成功抓取 | 抓取失败 | title 重复组/页 | description 重复组/页 | keywords 重复组/页 | 缺失页 t/d/k | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openEuler 官网（openEuler-portal） | 2042 | 2040 | 2 | 17/34 | 115/237 | 52/721 | 0/7/656 | ⚠️ 存在重复+缺失，[issue](https://atomgit.com/openeuler/openEuler-portal/issues/378) |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录 `<项目ID>-full.md`）
- openEuler 官网（openEuler-portal）：`openEuler-portal-full.md`，issue：https://atomgit.com/openeuler/openEuler-portal/issues/378（强制复检仍有问题，已更新原 issue）
