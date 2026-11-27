# TDK 重复检查简短报告 · openUBMC 官网（openUBMC-portal）

- 检查时间：2026-11-27T02:02:56.125Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML（与 JSON-LD 维度共用同一份抓取），对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）
- canonical 豁免：同值组内每一页都声明了 `<link rel="canonical">` 且统一指向同一个规范版本 URL 时，视为站点已主动指定规范版本，不计重复；此类组单列在"canonical 豁免组"章节供复核
- 分级说明（2026-11 起）：keywords 重复为告警级——重复组明细仍列于本报告与 stats 供整改参考，但不触发提单；提单触发条件 = title/description 重复（canonical 豁免后）或三字段任一缺失
- 白名单跳过：URL 命中项目配置的 `tdkWhitelist`（projects.config.json）或 `--tdk-whitelist` 参数（两者并集；以 `/` 开头的条目按 URL 路径前缀匹配，其余按正则匹配（完整 URL 与 pathname 任一命中））的页面整页不参与判重与缺失检查，明细见完全版报告"TDK 白名单跳过页面"章节；仅影响 TDK 维度，JSON-LD 维度不受影响

- 检查范围：sitemap 全量页面 297 个，成功抓取 297 个（失败 0 个不计入）

**description**：9 组重复，涉及 19 个页面
- [重复 3 次] `openUBMC 是一款架构领先、开发友好、开放标准的开源 BMC。采用协议“木兰宽松许可证”（Mulan PSL V2），用户可以自由复制、使用、修改、分发，…`
  - https://www.openubmc.cn/en/version/1.0.0 
  - https://www.openubmc.cn/en/version/latest 
  - https://www.openubmc.cn/zh/version/1.0.0 
- [重复 2 次] `CLA 是 Contributor License Agreement 的缩写，一般翻译为贡献者许可协议。`
  - https://www.openubmc.cn/en/blogs/cla 
  - https://www.openubmc.cn/zh/blogs/cla 
- [重复 2 次] `注册openUBMC账号，成为社区的一员`
  - https://www.openubmc.cn/en/blogs/contribution-guide 
  - https://www.openubmc.cn/zh/blogs/contribution-guide 
- …其余 6 组见完全版报告

**keywords**（告警级，不触发提单）：9 组重复，涉及 18 个页面
- [重复 2 次] `common.description`
  - https://www.openubmc.cn/en/course/course_kptest_introduction 
  - https://www.openubmc.cn/en/course 
- [重复 2 次] `openUBMC,openUBMC 版本说明,版本说明详情,openUBMC 1.0.0 社区首版本正式上线！`
  - https://www.openubmc.cn/en/version/1.0.0 
  - https://www.openubmc.cn/zh/version/1.0.0 
- [重复 2 次] `openUBMC,openUBMC 版本说明,版本说明详情,openUBMC 25.03 版本发布说明`
  - https://www.openubmc.cn/en/version/25.03 
  - https://www.openubmc.cn/zh/version/25.03 
- …其余 6 组见完全版报告

**TDK 缺失**：共 6 页 —— title 2 页（元素缺失 2 / 内容为空 0）；description 2 页（元素缺失 2 / 内容为空 0）；keywords 2 页（元素缺失 2 / 内容为空 0）
- https://www.openubmc.cn/en/download/community-releases （title 元素缺失）
- https://www.openubmc.cn/zh/download/community-releases （title 元素缺失）
- https://www.openubmc.cn/en/download/community-releases （description 元素缺失）
- https://www.openubmc.cn/zh/download/community-releases （description 元素缺失）
- https://www.openubmc.cn/en/download/community-releases （keywords 元素缺失）
- …其余 1 条见完全版报告
