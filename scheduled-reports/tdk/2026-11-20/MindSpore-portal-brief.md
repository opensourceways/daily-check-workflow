# TDK 重复检查简短报告 · MindSpore 官网（MindSpore-portal）

- 检查时间：2026-11-20T07:57:30.332Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML（与 JSON-LD 维度共用同一份抓取），对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）
- canonical 豁免：同值组内每一页都声明了 `<link rel="canonical">` 且统一指向同一个规范版本 URL 时，视为站点已主动指定规范版本，不计重复；此类组单列在"canonical 豁免组"章节供复核
- 分级说明（2026-11 起）：keywords 重复为告警级——重复组明细仍列于本报告与 stats 供整改参考，但不触发提单；提单触发条件 = title/description 重复（canonical 豁免后）或三字段任一缺失
- 白名单跳过：URL 命中项目配置的 `tdkWhitelist`（projects.config.json）或 `--tdk-whitelist` 参数（两者并集；以 `/` 开头的条目按 URL 路径前缀匹配，其余按正则匹配（完整 URL 与 pathname 任一命中））的页面整页不参与判重与缺失检查，明细见完全版报告"TDK 白名单跳过页面"章节；仅影响 TDK 维度，JSON-LD 维度不受影响

- 检查范围：sitemap 全量页面 2339 个，成功抓取 109 个（失败 2 个不计入）
- TDK 白名单跳过 2228 个页面（命中路径前缀或正则，不参与判重/缺失检查；明细见完全版报告）

**title**：3 组重复，涉及 6 个页面
- [重复 2 次] `MindSpore官网`
  - https://www.mindspore.cn/courses/detail/en 
  - https://www.mindspore.cn/courses/detail 
- [重复 2 次] `文档中心 | 文档全景 | 昇思MindSpore社区`
  - https://www.mindspore.cn/docs 
  - https://www.mindspore.cn/view 
- [重复 2 次] `Documentation | Docs Overview | MindSpore Community`
  - https://www.mindspore.cn/docs/en 
  - https://www.mindspore.cn/view/en 

**description**：3 组重复，涉及 7 个页面
- [重复 3 次] `华为开源自研AI框架MindSpore。自动微分、并行加持，一次训练，可多场景部署。支持端边云全场景的深度学习训练推理框架，主要应用于计算机视觉、自然语言处理等…`
  - https://www.mindspore.cn/courses/detail/en 
  - https://www.mindspore.cn/courses/detail 
  - https://www.mindspore.cn/ 
- [重复 2 次] `昇思MindSpore文档中心，按核心框架与套件、工具分类展示文档全景，帮助快速定位所需版本与组件的文档。`
  - https://www.mindspore.cn/docs 
  - https://www.mindspore.cn/view 
- [重复 2 次] `MindSpore documentation center showing the docs overview of the core framework, …`
  - https://www.mindspore.cn/docs/en 
  - https://www.mindspore.cn/view/en 

**keywords**（告警级，不触发提单）：4 组重复，涉及 17 个页面
- [重复 11 次] `SIG,sig,特别兴趣小组,开源深度学习框架,昇思教程,华为开源,昇思MindSpore,昇思官网,MindSpore官网,昇思,MindSpore`
  - https://www.mindspore.cn/sig/AKG 
  - https://www.mindspore.cn/sig/LLM%20Inference%20Serving 
  - https://www.mindspore.cn/sig/MindSpore%20Core 
  - https://www.mindspore.cn/sig/MindSpore%20Lite 
  - https://www.mindspore.cn/sig/MindSpore%20Quantum 
  - …其余 6 个见完全版报告
- [重复 2 次] `MindSpore,MindSpore官网,pynative,MindSpore教程,MindSpore开源,MindSpore社区,MindSpore安装`
  - https://www.mindspore.cn/courses/detail/en 
  - https://www.mindspore.cn/courses/detail 
- [重复 2 次] `文档中心,文档全景,核心框架,套件,工具组件,昇思MindSpore`
  - https://www.mindspore.cn/docs 
  - https://www.mindspore.cn/view 
- …其余 1 组见完全版报告
