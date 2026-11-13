# TDK 重复检查简短报告 · MindSpore 官网（MindSpore-portal）

- 检查时间：2026-11-13T10:53:26.227Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML（与 JSON-LD 维度共用同一份抓取），对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）
- canonical 豁免：同值组内每一页都声明了 `<link rel="canonical">` 且统一指向同一个规范版本 URL 时，视为站点已主动指定规范版本，不计重复；此类组单列在"canonical 豁免组"章节供复核
- 分级说明（2026-11 起）：keywords 重复为告警级——重复组明细仍列于本报告与 stats 供整改参考，但不触发提单；提单触发条件 = title/description 重复（canonical 豁免后）或三字段任一缺失
- 白名单跳过：URL 命中项目配置的 `tdkWhitelist`（projects.config.json）或 `--tdk-whitelist` 参数（两者并集；以 `/` 开头的条目按 URL 路径前缀匹配，其余按正则匹配（完整 URL 与 pathname 任一命中））的页面整页不参与判重与缺失检查，明细见完全版报告"TDK 白名单跳过页面"章节；仅影响 TDK 维度，JSON-LD 维度不受影响

- 检查范围：sitemap 全量页面 2431 个，成功抓取 2427 个（失败 4 个不计入）

**title**：40 组重复，涉及 743 个页面
- [重复 510 次] `MindSpore官网`
  - https://www.mindspore.cn/activities/zh/2026-7-13 
  - https://www.mindspore.cn/activities/zh/2026-7-21 
  - https://www.mindspore.cn/activities/zh/2026-7-22 
  - https://www.mindspore.cn/activities/zh/2026-7-23 
  - https://www.mindspore.cn/activities/zh/2026-7-28 
  - …其余 505 个见完全版报告
- [重复 155 次] `MindSpore`
  - https://www.mindspore.cn/news/en/ https:/github.com/TL-System/plato 
  - https://www.mindspore.cn/news/en/https : /gitee.com/mindspore/mindspore 
  - https://www.mindspore.cn/technology-blogs/en/1077 
  - https://www.mindspore.cn/technology-blogs/en/1386 
  - https://www.mindspore.cn/technology-blogs/en/1401 
  - …其余 150 个见完全版报告
- [重复 4 次] `精彩回顾 | 11月26日易用性SIG技术分享活动`
  - https://www.mindspore.cn/news/zh/2001 
  - https://www.mindspore.cn/news/zh/2002 
  - https://www.mindspore.cn/news/zh/2003 
  - https://www.mindspore.cn/news/zh/2004 
- …其余 37 组见完全版报告

**description**：57 组重复，涉及 818 个页面
- [重复 511 次] `华为开源自研AI框架MindSpore。自动微分、并行加持，一次训练，可多场景部署。支持端边云全场景的深度学习训练推理框架，主要应用于计算机视觉、自然语言处理等…`
  - https://www.mindspore.cn/activities/zh/2026-7-13 
  - https://www.mindspore.cn/activities/zh/2026-7-21 
  - https://www.mindspore.cn/activities/zh/2026-7-22 
  - https://www.mindspore.cn/activities/zh/2026-7-23 
  - https://www.mindspore.cn/activities/zh/2026-7-28 
  - …其余 506 个见完全版报告
- [重复 155 次] `The all-scenario deep learning framework that best manifests the computing power…`
  - https://www.mindspore.cn/news/en/ https:/github.com/TL-System/plato 
  - https://www.mindspore.cn/news/en/https : /gitee.com/mindspore/mindspore 
  - https://www.mindspore.cn/technology-blogs/en/1077 
  - https://www.mindspore.cn/technology-blogs/en/1386 
  - https://www.mindspore.cn/technology-blogs/en/1401 
  - …其余 150 个见完全版报告
- [重复 13 次] `携手共建MindSpore开源生态!`
  - https://www.mindspore.cn/activities/zh/2026-4-16 
  - https://www.mindspore.cn/activities/zh/2026-5-18-2 
  - https://www.mindspore.cn/activities/zh/2026-5-14 
  - https://www.mindspore.cn/activities/zh/2026-5-19 
  - https://www.mindspore.cn/activities/zh/2026-5-19-2 
  - …其余 8 个见完全版报告
- …其余 54 组见完全版报告

**keywords**（告警级，不触发提单）：7 组重复，涉及 2339 个页面
- [重复 2061 次] `MindSpore,MindSpore官网,pynative,MindSpore教程,MindSpore开源,MindSpore社区,MindSpore安装`
  - https://www.mindspore.cn/activities/en/1388 
  - https://www.mindspore.cn/activities/zh/1068 
  - https://www.mindspore.cn/activities/zh/1069 
  - https://www.mindspore.cn/activities/zh/1072 
  - https://www.mindspore.cn/activities/en/1528 
  - …其余 2056 个见完全版报告
- [重复 259 次] `AI,MindSpore,AI computing,deep learning`
  - https://www.mindspore.cn/news/en/ https:/github.com/TL-System/plato 
  - https://www.mindspore.cn/news/en/1392 
  - https://www.mindspore.cn/news/en/1442 
  - https://www.mindspore.cn/news/en/1078 
  - https://www.mindspore.cn/news/en/1458 
  - …其余 254 个见完全版报告
- [重复 11 次] `SIG,sig,特别兴趣小组,开源深度学习框架,昇思教程,华为开源,昇思MindSpore,昇思官网,MindSpore官网,昇思,MindSpore`
  - https://www.mindspore.cn/sig/LLM Inference Serving 
  - https://www.mindspore.cn/sig/MindSpore Quantum 
  - https://www.mindspore.cn/sig/MindSpore Science 
  - https://www.mindspore.cn/sig/MindSpore Core 
  - https://www.mindspore.cn/sig/MindSpore Technical Committee 
  - …其余 6 个见完全版报告
- …其余 4 组见完全版报告
