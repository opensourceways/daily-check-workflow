# TDK 重复检查简短报告 · MindSpore 官网（MindSpore-portal）

- 检查时间：2026-11-20T07:50:01.237Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML（与 JSON-LD 维度共用同一份抓取），对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）
- canonical 豁免：同值组内每一页都声明了 `<link rel="canonical">` 且统一指向同一个规范版本 URL 时，视为站点已主动指定规范版本，不计重复；此类组单列在"canonical 豁免组"章节供复核
- 分级说明（2026-11 起）：keywords 重复为告警级——重复组明细仍列于本报告与 stats 供整改参考，但不触发提单；提单触发条件 = title/description 重复（canonical 豁免后）或三字段任一缺失
- 白名单跳过：URL 命中项目配置的 `tdkWhitelist`（projects.config.json）或 `--tdk-whitelist` 参数（两者并集；以 `/` 开头的条目按 URL 路径前缀匹配，其余按正则匹配（完整 URL 与 pathname 任一命中））的页面整页不参与判重与缺失检查，明细见完全版报告"TDK 白名单跳过页面"章节；仅影响 TDK 维度，JSON-LD 维度不受影响

- 检查范围：sitemap 全量页面 2339 个，成功抓取 2337 个（失败 2 个不计入）

**title**：38 组重复，涉及 79 个页面
- [重复 4 次] `精彩回顾 | 11月26日易用性SIG技术分享活动 | 新闻 | 昇思MindSpore社区`
  - https://www.mindspore.cn/news/zh/2001 
  - https://www.mindspore.cn/news/zh/2002 
  - https://www.mindspore.cn/news/zh/2004 
  - https://www.mindspore.cn/news/zh/2003 
- [重复 3 次] `加入“MindSpore Call for X计划”，与我们一起昇思！ | 活动中心 | 昇思MindSpore社区`
  - https://www.mindspore.cn/activities/zh/3738 
  - https://www.mindspore.cn/activities/zh/Call-for-X-2025 
  - https://www.mindspore.cn/activities/zh/call-for-x-2025 
- [重复 2 次] `干货分享就等你，初级高级都可以！ | 活动中心 | 昇思MindSpore社区`
  - https://www.mindspore.cn/activities/zh/1621 
  - https://www.mindspore.cn/activities/zh/1627 
- …其余 35 组见完全版报告

**description**：74 组重复，涉及 259 个页面
- [重复 21 次] `作者：于璠 来源：知乎`
  - https://www.mindspore.cn/technology-blogs/zh/2756 
  - https://www.mindspore.cn/technology-blogs/zh/2864 
  - https://www.mindspore.cn/technology-blogs/zh/2839 
  - https://www.mindspore.cn/technology-blogs/zh/2893 
  - https://www.mindspore.cn/technology-blogs/zh/2919 
  - …其余 16 个见完全版报告
- [重复 20 次] `携手共建MindSpore开源生态!`
  - https://www.mindspore.cn/activities/zh/2026-4-16 
  - https://www.mindspore.cn/activities/zh/2026-4-28 
  - https://www.mindspore.cn/activities/zh/2026-4-28-2 
  - https://www.mindspore.cn/activities/zh/2026-5-14 
  - https://www.mindspore.cn/activities/zh/2026-5-18 
  - …其余 15 个见完全版报告
- [重复 17 次] `作者：李锐锋 ｜来源：知乎`
  - https://www.mindspore.cn/technology-blogs/zh/2706 
  - https://www.mindspore.cn/technology-blogs/zh/2869 
  - https://www.mindspore.cn/technology-blogs/zh/2881 
  - https://www.mindspore.cn/technology-blogs/zh/2890 
  - https://www.mindspore.cn/technology-blogs/zh/2906 
  - …其余 12 个见完全版报告
- …其余 71 组见完全版报告

**keywords**（告警级，不触发提单）：5 组重复，涉及 2245 个页面
- [重复 1986 次] `MindSpore,MindSpore官网,pynative,MindSpore教程,MindSpore开源,MindSpore社区,MindSpore安装`
  - https://www.mindspore.cn/activities/en/1388 
  - https://www.mindspore.cn/activities/zh/1068 
  - https://www.mindspore.cn/activities/zh/1069 
  - https://www.mindspore.cn/activities/zh/1072 
  - https://www.mindspore.cn/activities/zh/1081 
  - …其余 1981 个见完全版报告
- [重复 244 次] `AI,MindSpore,AI computing,deep learning`
  - https://www.mindspore.cn/activities/en/1425 
  - https://www.mindspore.cn/activities/en/1467 
  - https://www.mindspore.cn/activities/en/1389 
  - https://www.mindspore.cn/activities/en/1459 
  - https://www.mindspore.cn/activities/en/1528 
  - …其余 239 个见完全版报告
- [重复 11 次] `SIG,sig,特别兴趣小组,开源深度学习框架,昇思教程,华为开源,昇思MindSpore,昇思官网,MindSpore官网,昇思,MindSpore`
  - https://www.mindspore.cn/sig/AKG 
  - https://www.mindspore.cn/sig/LLM%20Inference%20Serving 
  - https://www.mindspore.cn/sig/MindSpore%20Core 
  - https://www.mindspore.cn/sig/MindSpore%20Lite 
  - https://www.mindspore.cn/sig/MindSpore%20Science 
  - …其余 6 个见完全版报告
- …其余 2 组见完全版报告
