# TDK 重复检查完全版报告 · MindSpore 官网（MindSpore-portal）

- 检查时间：2026-11-20T07:57:30.332Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML（与 JSON-LD 维度共用同一份抓取），对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）
- canonical 豁免：同值组内每一页都声明了 `<link rel="canonical">` 且统一指向同一个规范版本 URL 时，视为站点已主动指定规范版本，不计重复；此类组单列在"canonical 豁免组"章节供复核
- 分级说明（2026-11 起）：keywords 重复为告警级——重复组明细仍列于本报告与 stats 供整改参考，但不触发提单；提单触发条件 = title/description 重复（canonical 豁免后）或三字段任一缺失
- 白名单跳过：URL 命中项目配置的 `tdkWhitelist`（projects.config.json）或 `--tdk-whitelist` 参数（两者并集；以 `/` 开头的条目按 URL 路径前缀匹配，其余按正则匹配（完整 URL 与 pathname 任一命中））的页面整页不参与判重与缺失检查，明细见完全版报告"TDK 白名单跳过页面"章节；仅影响 TDK 维度，JSON-LD 维度不受影响


### MindSpore 官网（MindSpore-portal）

- sitemap：https://www.mindspore.cn/sitemap.xml，收集页面 2339 个，成功抓取 109 个，失败 2 个
- ℹ️ TDK 白名单跳过 2228/2339 个页面（命中 tdkWhitelist/--tdk-whitelist 的路径前缀或正则，不参与判重/缺失检查）
- 抓取失败清单（前 2 个）：
  - https://www.mindspore.cn/news/detail/en → 404
  - https://www.mindspore.cn/news/detail → 404

#### TDK 白名单跳过页面（共 2228 页，不参与判重/缺失检查）

白名单规则（projects.config.json 的 tdkWhitelist 与 --tdk-whitelist 并集）：`^/(?:activities|news|technology-blogs|version-updates)/(?:zh|en)/`

- https://www.mindspore.cn/activities/en/1388 
- https://www.mindspore.cn/activities/en/1389 
- https://www.mindspore.cn/activities/en/1425 
- https://www.mindspore.cn/activities/en/1459 
- https://www.mindspore.cn/activities/en/1467 
- https://www.mindspore.cn/activities/en/1468 
- https://www.mindspore.cn/activities/en/1528 
- https://www.mindspore.cn/activities/zh/1067 
- https://www.mindspore.cn/activities/zh/1068 
- https://www.mindspore.cn/activities/zh/1069 
- https://www.mindspore.cn/activities/zh/1072 
- https://www.mindspore.cn/activities/zh/1081 
- https://www.mindspore.cn/activities/zh/1082 
- https://www.mindspore.cn/activities/zh/1083 
- https://www.mindspore.cn/activities/zh/1086 
- https://www.mindspore.cn/activities/zh/1088 
- https://www.mindspore.cn/activities/zh/1090 
- https://www.mindspore.cn/activities/zh/1380 
- https://www.mindspore.cn/activities/zh/1381 
- https://www.mindspore.cn/activities/zh/1390 
- https://www.mindspore.cn/activities/zh/1391 
- https://www.mindspore.cn/activities/zh/1402 
- https://www.mindspore.cn/activities/zh/1417 
- https://www.mindspore.cn/activities/zh/1420 
- https://www.mindspore.cn/activities/zh/1421 
- https://www.mindspore.cn/activities/zh/1422 
- https://www.mindspore.cn/activities/zh/1429 
- https://www.mindspore.cn/activities/zh/1431 
- https://www.mindspore.cn/activities/zh/1432 
- https://www.mindspore.cn/activities/zh/1433 
- https://www.mindspore.cn/activities/zh/1434 
- https://www.mindspore.cn/activities/zh/1446 
- https://www.mindspore.cn/activities/zh/1452 
- https://www.mindspore.cn/activities/zh/1472 
- https://www.mindspore.cn/activities/zh/1479 
- https://www.mindspore.cn/activities/zh/1482 
- https://www.mindspore.cn/activities/zh/1490 
- https://www.mindspore.cn/activities/zh/1494 
- https://www.mindspore.cn/activities/zh/1510 
- https://www.mindspore.cn/activities/zh/1513 
- https://www.mindspore.cn/activities/zh/1539 
- https://www.mindspore.cn/activities/zh/1560 
- https://www.mindspore.cn/activities/zh/1564 
- https://www.mindspore.cn/activities/zh/1567 
- https://www.mindspore.cn/activities/zh/1570 
- https://www.mindspore.cn/activities/zh/1577 
- https://www.mindspore.cn/activities/zh/1597 
- https://www.mindspore.cn/activities/zh/1618 
- https://www.mindspore.cn/activities/zh/1621 
- https://www.mindspore.cn/activities/zh/1627 
- https://www.mindspore.cn/activities/zh/1652 
- https://www.mindspore.cn/activities/zh/1653 
- https://www.mindspore.cn/activities/zh/1654 
- https://www.mindspore.cn/activities/zh/1668 
- https://www.mindspore.cn/activities/zh/1672 
- https://www.mindspore.cn/activities/zh/1677 
- https://www.mindspore.cn/activities/zh/1679 
- https://www.mindspore.cn/activities/zh/1685 
- https://www.mindspore.cn/activities/zh/1705 
- https://www.mindspore.cn/activities/zh/1707 
- https://www.mindspore.cn/activities/zh/1722 
- https://www.mindspore.cn/activities/zh/1724 
- https://www.mindspore.cn/activities/zh/1725 
- https://www.mindspore.cn/activities/zh/1752 
- https://www.mindspore.cn/activities/zh/1754 
- https://www.mindspore.cn/activities/zh/1777 
- https://www.mindspore.cn/activities/zh/1780 
- https://www.mindspore.cn/activities/zh/1785 
- https://www.mindspore.cn/activities/zh/1786 
- https://www.mindspore.cn/activities/zh/1787 
- https://www.mindspore.cn/activities/zh/1788 
- https://www.mindspore.cn/activities/zh/1790 
- https://www.mindspore.cn/activities/zh/1791 
- https://www.mindspore.cn/activities/zh/1793 
- https://www.mindspore.cn/activities/zh/1808 
- https://www.mindspore.cn/activities/zh/1809 
- https://www.mindspore.cn/activities/zh/1810 
- https://www.mindspore.cn/activities/zh/1850 
- https://www.mindspore.cn/activities/zh/1852 
- https://www.mindspore.cn/activities/zh/1853 
- https://www.mindspore.cn/activities/zh/1855 
- https://www.mindspore.cn/activities/zh/1856 
- https://www.mindspore.cn/activities/zh/1857 
- https://www.mindspore.cn/activities/zh/1869 
- https://www.mindspore.cn/activities/zh/1872 
- https://www.mindspore.cn/activities/zh/1873 
- https://www.mindspore.cn/activities/zh/1874 
- https://www.mindspore.cn/activities/zh/1876 
- https://www.mindspore.cn/activities/zh/1884 
- https://www.mindspore.cn/activities/zh/190 
- https://www.mindspore.cn/activities/zh/1906 
- https://www.mindspore.cn/activities/zh/1919 
- https://www.mindspore.cn/activities/zh/192 
- https://www.mindspore.cn/activities/zh/1923 
- https://www.mindspore.cn/activities/zh/1925 
- https://www.mindspore.cn/activities/zh/1930 
- https://www.mindspore.cn/activities/zh/1931 
- https://www.mindspore.cn/activities/zh/1932 
- https://www.mindspore.cn/activities/zh/1935 
- https://www.mindspore.cn/activities/zh/1936 
- https://www.mindspore.cn/activities/zh/194 
- https://www.mindspore.cn/activities/zh/1942 
- https://www.mindspore.cn/activities/zh/1947 
- https://www.mindspore.cn/activities/zh/1948 
- https://www.mindspore.cn/activities/zh/1953 
- https://www.mindspore.cn/activities/zh/1965 
- https://www.mindspore.cn/activities/zh/1966 
- https://www.mindspore.cn/activities/zh/1968 
- https://www.mindspore.cn/activities/zh/1971 
- https://www.mindspore.cn/activities/zh/1972 
- https://www.mindspore.cn/activities/zh/1976 
- https://www.mindspore.cn/activities/zh/1979 
- https://www.mindspore.cn/activities/zh/1981 
- https://www.mindspore.cn/activities/zh/1989 
- https://www.mindspore.cn/activities/zh/1991 
- https://www.mindspore.cn/activities/zh/1993 
- https://www.mindspore.cn/activities/zh/1995 
- https://www.mindspore.cn/activities/zh/1998 
- https://www.mindspore.cn/activities/zh/1999 
- https://www.mindspore.cn/activities/zh/2000 
- https://www.mindspore.cn/activities/zh/2011 
- https://www.mindspore.cn/activities/zh/2025-06-19 
- https://www.mindspore.cn/activities/zh/2025-07-07 
- https://www.mindspore.cn/activities/zh/2025-07-17 
- https://www.mindspore.cn/activities/zh/2025-07-21 
- https://www.mindspore.cn/activities/zh/2025-08-18 
- https://www.mindspore.cn/activities/zh/2025-09-02 
- https://www.mindspore.cn/activities/zh/2025-10-17 
- https://www.mindspore.cn/activities/zh/2025-10-28 
- https://www.mindspore.cn/activities/zh/2025-11-13 
- https://www.mindspore.cn/activities/zh/2025-12-12 
- https://www.mindspore.cn/activities/zh/2025-12-2 
- https://www.mindspore.cn/activities/zh/2025-12-24 
- https://www.mindspore.cn/activities/zh/2025-12-3 
- https://www.mindspore.cn/activities/zh/2025-12-3-2 
- https://www.mindspore.cn/activities/zh/2025-12-30 
- https://www.mindspore.cn/activities/zh/2025-12-4 
- https://www.mindspore.cn/activities/zh/2025-12-5 
- https://www.mindspore.cn/activities/zh/2025-12-8 
- https://www.mindspore.cn/activities/zh/2026-1-14 
- https://www.mindspore.cn/activities/zh/2026-1-14-2 
- https://www.mindspore.cn/activities/zh/2026-2-11 
- https://www.mindspore.cn/activities/zh/2026-2-12 
- https://www.mindspore.cn/activities/zh/2026-2-13 
- https://www.mindspore.cn/activities/zh/2026-3-10 
- https://www.mindspore.cn/activities/zh/2026-3-25 
- https://www.mindspore.cn/activities/zh/2026-3-26 
- https://www.mindspore.cn/activities/zh/2026-3-27 
- https://www.mindspore.cn/activities/zh/2026-4-10 
- https://www.mindspore.cn/activities/zh/2026-4-16 
- https://www.mindspore.cn/activities/zh/2026-4-28 
- https://www.mindspore.cn/activities/zh/2026-4-28-2 
- https://www.mindspore.cn/activities/zh/2026-4-3 
- https://www.mindspore.cn/activities/zh/2026-5-11 
- https://www.mindspore.cn/activities/zh/2026-5-11-2 
- https://www.mindspore.cn/activities/zh/2026-5-12 
- https://www.mindspore.cn/activities/zh/2026-5-13 
- https://www.mindspore.cn/activities/zh/2026-5-14 
- https://www.mindspore.cn/activities/zh/2026-5-18 
- https://www.mindspore.cn/activities/zh/2026-5-18-2 
- https://www.mindspore.cn/activities/zh/2026-5-19 
- https://www.mindspore.cn/activities/zh/2026-5-19-2 
- https://www.mindspore.cn/activities/zh/2026-5-20 
- https://www.mindspore.cn/activities/zh/2026-5-20-2 
- https://www.mindspore.cn/activities/zh/2026-5-8 
- https://www.mindspore.cn/activities/zh/2026-5-9 
- https://www.mindspore.cn/activities/zh/2026-5-9-2 
- https://www.mindspore.cn/activities/zh/2026-7-13 
- https://www.mindspore.cn/activities/zh/2026-7-21 
- https://www.mindspore.cn/activities/zh/2026-7-22 
- https://www.mindspore.cn/activities/zh/2026-7-23 
- https://www.mindspore.cn/activities/zh/2026-7-28 
- https://www.mindspore.cn/activities/zh/2026-8-11 
- https://www.mindspore.cn/activities/zh/2026-8-25 
- https://www.mindspore.cn/activities/zh/2066 
- https://www.mindspore.cn/activities/zh/2069 
- https://www.mindspore.cn/activities/zh/2073 
- https://www.mindspore.cn/activities/zh/2075 
- https://www.mindspore.cn/activities/zh/2078 
- https://www.mindspore.cn/activities/zh/2079 
- https://www.mindspore.cn/activities/zh/2080 
- https://www.mindspore.cn/activities/zh/2081 
- https://www.mindspore.cn/activities/zh/2086 
- https://www.mindspore.cn/activities/zh/2087 
- https://www.mindspore.cn/activities/zh/2088 
- https://www.mindspore.cn/activities/zh/2089 
- https://www.mindspore.cn/activities/zh/2104 
- https://www.mindspore.cn/activities/zh/2109 
- https://www.mindspore.cn/activities/zh/216 
- https://www.mindspore.cn/activities/zh/2169 
- https://www.mindspore.cn/activities/zh/2180 
- https://www.mindspore.cn/activities/zh/2188 
- https://www.mindspore.cn/activities/zh/219 
- https://www.mindspore.cn/activities/zh/2197 
- https://www.mindspore.cn/activities/zh/2198 
- https://www.mindspore.cn/activities/zh/2199 
- https://www.mindspore.cn/activities/zh/2201 
- https://www.mindspore.cn/activities/zh/2205 
- https://www.mindspore.cn/activities/zh/2208 
- https://www.mindspore.cn/activities/zh/2209 
- https://www.mindspore.cn/activities/zh/2210 
- https://www.mindspore.cn/activities/zh/2212 
- https://www.mindspore.cn/activities/zh/2219 
- https://www.mindspore.cn/activities/zh/222 
- https://www.mindspore.cn/activities/zh/2223 
- https://www.mindspore.cn/activities/zh/2231 
- https://www.mindspore.cn/activities/zh/2237 
- https://www.mindspore.cn/activities/zh/2241 
- https://www.mindspore.cn/activities/zh/2243 
- https://www.mindspore.cn/activities/zh/2245 
- https://www.mindspore.cn/activities/zh/2246 
- https://www.mindspore.cn/activities/zh/2247 
- https://www.mindspore.cn/activities/zh/225 
- https://www.mindspore.cn/activities/zh/2253 
- https://www.mindspore.cn/activities/zh/226 
- https://www.mindspore.cn/activities/zh/2261 
- https://www.mindspore.cn/activities/zh/2263 
- https://www.mindspore.cn/activities/zh/2265 
- https://www.mindspore.cn/activities/zh/233 
- https://www.mindspore.cn/activities/zh/239 
- https://www.mindspore.cn/activities/zh/240 
- https://www.mindspore.cn/activities/zh/241 
- https://www.mindspore.cn/activities/zh/242 
- https://www.mindspore.cn/activities/zh/247 
- https://www.mindspore.cn/activities/zh/2477 
- https://www.mindspore.cn/activities/zh/2478 
- https://www.mindspore.cn/activities/zh/2479 
- https://www.mindspore.cn/activities/zh/248 
- https://www.mindspore.cn/activities/zh/2480 
- https://www.mindspore.cn/activities/zh/2481 
- https://www.mindspore.cn/activities/zh/249 
- https://www.mindspore.cn/activities/zh/2496 
- https://www.mindspore.cn/activities/zh/2497 
- https://www.mindspore.cn/activities/zh/2498 
- https://www.mindspore.cn/activities/zh/2507 
- https://www.mindspore.cn/activities/zh/2509 
- https://www.mindspore.cn/activities/zh/251 
- https://www.mindspore.cn/activities/zh/2510 
- https://www.mindspore.cn/activities/zh/252 
- https://www.mindspore.cn/activities/zh/2526 
- https://www.mindspore.cn/activities/zh/2527 
- https://www.mindspore.cn/activities/zh/2528 
- https://www.mindspore.cn/activities/zh/254 
- https://www.mindspore.cn/activities/zh/2554 
- https://www.mindspore.cn/activities/zh/2558 
- https://www.mindspore.cn/activities/zh/256 
- https://www.mindspore.cn/activities/zh/2574 
- https://www.mindspore.cn/activities/zh/2578 
- https://www.mindspore.cn/activities/zh/2589 
- https://www.mindspore.cn/activities/zh/2590 
- https://www.mindspore.cn/activities/zh/2600 
- https://www.mindspore.cn/activities/zh/2602 
- https://www.mindspore.cn/activities/zh/261 
- https://www.mindspore.cn/activities/zh/2624 
- https://www.mindspore.cn/activities/zh/264 
- https://www.mindspore.cn/activities/zh/265 
- https://www.mindspore.cn/activities/zh/2658 
- https://www.mindspore.cn/activities/zh/2665 
- https://www.mindspore.cn/activities/zh/2668 
- https://www.mindspore.cn/activities/zh/2669 
- https://www.mindspore.cn/activities/zh/267 
- https://www.mindspore.cn/activities/zh/2683 
- https://www.mindspore.cn/activities/zh/2689 
- https://www.mindspore.cn/activities/zh/2702 
- https://www.mindspore.cn/activities/zh/2724 
- https://www.mindspore.cn/activities/zh/2727 
- https://www.mindspore.cn/activities/zh/2728 
- https://www.mindspore.cn/activities/zh/2741 
- https://www.mindspore.cn/activities/zh/2755 
- https://www.mindspore.cn/activities/zh/2774 
- https://www.mindspore.cn/activities/zh/2786 
- https://www.mindspore.cn/activities/zh/2787 
- https://www.mindspore.cn/activities/zh/2841 
- https://www.mindspore.cn/activities/zh/2883 
- https://www.mindspore.cn/activities/zh/2896 
- https://www.mindspore.cn/activities/zh/2897 
- https://www.mindspore.cn/activities/zh/2902 
- https://www.mindspore.cn/activities/zh/2904 
- https://www.mindspore.cn/activities/zh/2905 
- https://www.mindspore.cn/activities/zh/2908 
- https://www.mindspore.cn/activities/zh/2917 
- https://www.mindspore.cn/activities/zh/2920 
- https://www.mindspore.cn/activities/zh/2939 
- https://www.mindspore.cn/activities/zh/2945 
- https://www.mindspore.cn/activities/zh/2962 
- https://www.mindspore.cn/activities/zh/2972 
- https://www.mindspore.cn/activities/zh/2991 
- https://www.mindspore.cn/activities/zh/3007 
- https://www.mindspore.cn/activities/zh/3028 
- https://www.mindspore.cn/activities/zh/3029 
- https://www.mindspore.cn/activities/zh/3052 
- https://www.mindspore.cn/activities/zh/3059 
- https://www.mindspore.cn/activities/zh/3079 
- https://www.mindspore.cn/activities/zh/3092 
- https://www.mindspore.cn/activities/zh/3115 
- https://www.mindspore.cn/activities/zh/315 
- https://www.mindspore.cn/activities/zh/3155 
- https://www.mindspore.cn/activities/zh/3162 
- https://www.mindspore.cn/activities/zh/317 
- https://www.mindspore.cn/activities/zh/319 
- …其余 1928 个见 stats JSON（tdk-duplicate-stats.json 的 whitelistSkipped.urls）

#### title 重复检查

共 3 组重复，涉及 6 个页面

##### [重复 2 次] MindSpore官网

- https://www.mindspore.cn/courses/detail/en 
- https://www.mindspore.cn/courses/detail 

##### [重复 2 次] 文档中心 | 文档全景 | 昇思MindSpore社区

- https://www.mindspore.cn/docs 
- https://www.mindspore.cn/view 

##### [重复 2 次] Documentation | Docs Overview | MindSpore Community

- https://www.mindspore.cn/docs/en 
- https://www.mindspore.cn/view/en 

#### description 重复检查

共 3 组重复，涉及 7 个页面

##### [重复 3 次] 华为开源自研AI框架MindSpore。自动微分、并行加持，一次训练，可多场景部署。支持端边云全场景的深度学习训练推理框架，主要应用于计算机视觉、自然语言处理等AI领域，面向数据科学家、算法工程师等人群。主要具备基于源码转换的通用自动微分、自动实现分布式并行训练、数据处理、以及图执行引擎等功能特性。借助自动微分，轻松训练神经网络。框架开源，华为培育AI开发生态。

- https://www.mindspore.cn/courses/detail/en 
- https://www.mindspore.cn/courses/detail 
- https://www.mindspore.cn/ 

##### [重复 2 次] 昇思MindSpore文档中心，按核心框架与套件、工具分类展示文档全景，帮助快速定位所需版本与组件的文档。

- https://www.mindspore.cn/docs 
- https://www.mindspore.cn/view 

##### [重复 2 次] MindSpore documentation center showing the docs overview of the core framework, suites and tools for quick access to the documents you need.

- https://www.mindspore.cn/docs/en 
- https://www.mindspore.cn/view/en 

#### keywords 重复检查（告警级，不触发提单）

共 4 组重复，涉及 17 个页面

##### [重复 11 次] SIG,sig,特别兴趣小组,开源深度学习框架,昇思教程,华为开源,昇思MindSpore,昇思官网,MindSpore官网,昇思,MindSpore

- https://www.mindspore.cn/sig/AKG 
- https://www.mindspore.cn/sig/LLM%20Inference%20Serving 
- https://www.mindspore.cn/sig/MindSpore%20Core 
- https://www.mindspore.cn/sig/MindSpore%20Lite 
- https://www.mindspore.cn/sig/MindSpore%20Quantum 
- https://www.mindspore.cn/sig/MindSpore%20Science 
- https://www.mindspore.cn/sig/MindSpore%20Transformers 
- https://www.mindspore.cn/sig/MindSpore%20Technical%20Committee 
- https://www.mindspore.cn/sig/MindSpore%20Usability 
- https://www.mindspore.cn/sig/Security%20%2526%20Trusted%20AI 
- https://www.mindspore.cn/sig/Parallel%20Training%20System 

##### [重复 2 次] MindSpore,MindSpore官网,pynative,MindSpore教程,MindSpore开源,MindSpore社区,MindSpore安装

- https://www.mindspore.cn/courses/detail/en 
- https://www.mindspore.cn/courses/detail 

##### [重复 2 次] 文档中心,文档全景,核心框架,套件,工具组件,昇思MindSpore

- https://www.mindspore.cn/docs 
- https://www.mindspore.cn/view 

##### [重复 2 次] MindSpore, documentation, core framework, suites, tools

- https://www.mindspore.cn/docs/en 
- https://www.mindspore.cn/view/en 

#### TDK 缺失检查

无缺失
