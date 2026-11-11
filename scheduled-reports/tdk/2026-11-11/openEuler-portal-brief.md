# TDK 重复检查简短报告 · openEuler 官网（openEuler-portal）

- 检查时间：2026-11-11T11:45:08.147Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML（与 JSON-LD 维度共用同一份抓取），对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）
- canonical 豁免：同值组内每一页都声明了 `<link rel="canonical">` 且统一指向同一个规范版本 URL 时，视为站点已主动指定规范版本，不计重复；此类组单列在"canonical 豁免组"章节供复核
- 分级说明（2026-11 起）：keywords 重复为告警级——重复组明细仍列于本报告与 stats 供整改参考，但不触发提单；提单触发条件 = title/description 重复（canonical 豁免后）或三字段任一缺失
- 白名单跳过：URL 命中项目配置的 `tdkWhitelist`（projects.config.json）或 `--tdk-whitelist` 参数（两者并集；以 `/` 开头的条目按 URL 路径前缀匹配，其余按正则匹配（完整 URL 与 pathname 任一命中））的页面整页不参与判重与缺失检查，明细见完全版报告"TDK 白名单跳过页面"章节；仅影响 TDK 维度，JSON-LD 维度不受影响

- 检查范围：sitemap 全量页面 2042 个，成功抓取 484 个（失败 0 个不计入）
- TDK 白名单跳过 1558 个页面（命中路径前缀或正则，不参与判重/缺失检查；明细见完全版报告）

**title**：1 组重复，涉及 2 个页面
- [重复 2 次] `openEuler | openEuler`
  - https://www.openeuler.org/en/sig/sig-guidance/ 
  - https://www.openeuler.org/en/sig/sig-list/ 

**description**：2 组重复，涉及 7 个页面
- [重复 4 次] `openEuler 是一个开源、免费的 Linux 发行版平台，将通过开放的社区形式与全球的开发者共同构建一个开放、多元和架构包容的软件生态体系。同时，open…`
  - https://www.openeuler.org/zh/sig/role-description/ 
  - https://www.openeuler.org/zh/sig/sig-guidance/ 
  - https://www.openeuler.org/zh/sig/sig-list/ 
  - https://www.openeuler.org/zh/sig/meeting-guide/ 
- [重复 3 次] `openEuler is an open source, free Linux distribution platform. The platform prov…`
  - https://www.openeuler.org/en/sig/role-description/ 
  - https://www.openeuler.org/en/sig/sig-guidance/ 
  - https://www.openeuler.org/en/sig/sig-list/ 

**keywords**（告警级，不触发提单）：32 组重复，涉及 83 个页面
- [重复 6 次] `OS migration, Linux os, open source, centos`
  - https://www.openeuler.org/en/migration/advantage/ 
  - https://www.openeuler.org/en/migration/background/ 
  - https://www.openeuler.org/en/migration/contact/ 
  - https://www.openeuler.org/en/migration/download/ 
  - https://www.openeuler.org/en/migration/guidance/ 
  - …其余 1 个见完全版报告
- [重复 6 次] `openEuler,北京,meetup,社区活动,Meetup,开源社区`
  - https://www.openeuler.org/zh/interaction/event-list/openEuler-ai-os-innovation-meetup-beijing 
  - https://www.openeuler.org/zh/interaction/event-list/openEuler-cloud-native-middleware-meetup 
  - https://www.openeuler.org/zh/interaction/event-list/openEuler-compiler-sig-meetup-beijing 
  - https://www.openeuler.org/zh/interaction/event-list/openEuler-diverse-computing-meetup-beijing 
  - https://www.openeuler.org/zh/interaction/event-list/openEuler-sig-long-heterogeneous-computing-meetup-beijing 
  - …其余 1 个见完全版报告
- [重复 4 次] `openEuler,能源,国家电网,电力`
  - https://www.openeuler.org/zh/showcase/energy/006e41a2-9e5f-621a3b40396e/ 
  - https://www.openeuler.org/zh/showcase/energy/009e4e30-a3e5-ecc4bdfd977b/ 
  - https://www.openeuler.org/zh/showcase/energy/guangfu/ 
  - https://www.openeuler.org/zh/showcase/energy/guojiadianw/ 
- …其余 29 组见完全版报告

**TDK 缺失**：共 7 页 —— keywords 7 页（元素缺失 7 / 内容为空 0）
- https://www.openeuler.org/en/sig/role-description/ （keywords 元素缺失）
- https://www.openeuler.org/zh/sig/role-description/ （keywords 元素缺失）
- https://www.openeuler.org/en/sig/sig-guidance/ （keywords 元素缺失）
- https://www.openeuler.org/zh/sig/sig-guidance/ （keywords 元素缺失）
- https://www.openeuler.org/en/sig/sig-list/ （keywords 元素缺失）
- …其余 2 条见完全版报告
