# TDK 重复性检查报告

- 检查时间：2026-11-11T11:45:08.147Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML 分组判重（title/description/keywords），数据与 JSON-LD 维度共用同一份抓取（脚本已合并为 check-tdk-jsonld.mjs）
- 判重字段：title（`<title>` 文本）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`），按去空格后的原文精确分组，同值对应 ≥2 个页面即记为重复组；空值/缺失不参与判重，单独计入"TDK 缺失检查"（区分元素缺失/内容为空）
- 分级说明（2026-11 起）：keywords 重复降级为告警——重复组明细仍列于各项目报告及 stats JSON，供整改参考，但不计入提单触发条件；提单触发 = title/description 重复（canonical 豁免后）或三字段任一缺失
- canonical 豁免：同值组内所有页面均声明 `<link rel="canonical">` 且指向同一规范版本时，视为站点主动指定规范版本（搜索引擎仅索引规范版本），不计重复；豁免组数与明细单列于各项目报告的"canonical 豁免组"章节及 stats JSON 的 canonicalExempt 字段
- 白名单跳过：URL 命中项目配置的 `tdkWhitelist`（projects.config.json）或 `--tdk-whitelist` 参数（两者并集；以 `/` 开头的条目按 URL 路径前缀匹配、其余按正则匹配（完整 URL 与 pathname 任一命中），`--tdk-whitelist=` 传空整体关闭）的页面整页不参与判重与缺失检查；跳过明细见各项目报告"TDK 白名单跳过页面"章节及 stats JSON 的 whitelistSkipped 字段；仅影响 TDK 维度，JSON-LD 维度不受影响
- 运行模式：提 issue（--submit-issues，--force 强制执行：已有未关闭 issue 时更新原 issue 或评论 /close）；本次维度：tdk
- 指定项目：--site=openEuler-portal
- 特殊约定：默认跳过 openEuler-docs、openGauss-docs、MindSpore-docs 三个 docs 项目（与 JSON-LD 维度共用同一跳过清单）；如需检查可用 --skip= 传空覆盖；配置 newVersions 的 docs 项目仅收集匹配版本的子 sitemap 页面
- 本次白名单跳过：openEuler-portal 跳过 1558 页（规则：`^/(?:zh|en)/sig/[^/]+$`、`^/(?:zh|en)/(?:blog|news)/(?:[^/]+/)*[^/]*$`）
- 完整重复组与缺失数据见：scripts/stats/tdk-duplicate-stats.json

## 总览

| 项目 | sitemap 页面数 | 成功抓取 | 抓取失败 | title 重复组/页 | description 重复组/页 | keywords 重复组/页 | 缺失页 t/d/k | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openEuler 官网（openEuler-portal） | 2042 | 484 | 0 | 1/2 | 2/7 | 32/83 | 0/0/7 | ⚠️ 存在重复+缺失，[issue](https://atomgit.com/openeuler/openEuler-portal/issues/378) |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录 `<项目ID>-full.md`）
- openEuler 官网（openEuler-portal）：`openEuler-portal-full.md`，issue：https://atomgit.com/openeuler/openEuler-portal/issues/378（强制复检仍有问题，已更新原 issue）
