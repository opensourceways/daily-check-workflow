# TDK 重复检查完全版报告 · openUBMC 官网（openUBMC-portal）

- 检查时间：2026-11-27T02:02:56.125Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML（与 JSON-LD 维度共用同一份抓取），对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）
- canonical 豁免：同值组内每一页都声明了 `<link rel="canonical">` 且统一指向同一个规范版本 URL 时，视为站点已主动指定规范版本，不计重复；此类组单列在"canonical 豁免组"章节供复核
- 分级说明（2026-11 起）：keywords 重复为告警级——重复组明细仍列于本报告与 stats 供整改参考，但不触发提单；提单触发条件 = title/description 重复（canonical 豁免后）或三字段任一缺失
- 白名单跳过：URL 命中项目配置的 `tdkWhitelist`（projects.config.json）或 `--tdk-whitelist` 参数（两者并集；以 `/` 开头的条目按 URL 路径前缀匹配，其余按正则匹配（完整 URL 与 pathname 任一命中））的页面整页不参与判重与缺失检查，明细见完全版报告"TDK 白名单跳过页面"章节；仅影响 TDK 维度，JSON-LD 维度不受影响


### openUBMC 官网（openUBMC-portal）

- sitemap：https://www.openubmc.cn/sitemap.xml，收集页面 297 个，成功抓取 297 个，失败 0 个

#### title 重复检查

共 0 组重复，涉及 0 个页面

#### description 重复检查

共 9 组重复，涉及 19 个页面

##### [重复 3 次] openUBMC 是一款架构领先、开发友好、开放标准的开源 BMC。采用协议“木兰宽松许可证”（Mulan PSL V2），用户可以自由复制、使用、修改、分发，不论修改与否。 openUBMC 版本号采用点分位命名规则（X.Y.Z）模式，其中 X 表示每年发布版本，Y 表示每半年发布版本，Z 表示补丁版本。正常每半年会发布一个 Y 版本，每年发布两个版本。 openUBMC 生命周期初步规划为 0.5 年。

- https://www.openubmc.cn/en/version/1.0.0 
- https://www.openubmc.cn/en/version/latest 
- https://www.openubmc.cn/zh/version/1.0.0 

##### [重复 2 次] CLA 是 Contributor License Agreement 的缩写，一般翻译为贡献者许可协议。

- https://www.openubmc.cn/en/blogs/cla 
- https://www.openubmc.cn/zh/blogs/cla 

##### [重复 2 次] 注册openUBMC账号，成为社区的一员

- https://www.openubmc.cn/en/blogs/contribution-guide 
- https://www.openubmc.cn/zh/blogs/contribution-guide 

##### [重复 2 次] openUBMC 开源社区按照不同的SIG（Special Interest Group）来组织开发及版本相关工作。

- https://www.openubmc.cn/en/blogs/sig-meeting-guide 
- https://www.openubmc.cn/zh/blogs/sig-meeting-guide 

##### [重复 2 次] 作为25年首版本，openUBMC 25.03 采用木兰宽松许可证 2.0（Mulan PSL v2），用户可以自由复制、使用、修改、分发，不论修改与否。

- https://www.openubmc.cn/en/version/25.03 
- https://www.openubmc.cn/zh/version/25.03 

##### [重复 2 次] 作为25年第二个创新版本，openUBMC 25.06 采用木兰宽松许可证 2.0（Mulan PSL v2），用户可以自由复制、使用、修改、分发。

- https://www.openubmc.cn/en/version/25.06 
- https://www.openubmc.cn/zh/version/25.06 

##### [重复 2 次] 作为25年第三个创新版本，openUBMC 25.09 采用木兰宽松许可证 2.0（Mulan PSL v2），用户可以自由复制、使用、修改、分发。

- https://www.openubmc.cn/en/version/25.09 
- https://www.openubmc.cn/zh/version/25.09 

##### [重复 2 次] 2026年第一季度，openUBMC社区在技术迭代与生态建设上取得扎实进展。

- https://www.openubmc.cn/zh/news/community-opration-report4 
- https://www.openubmc.cn/zh/news/community-operation-report1-3 

##### [重复 2 次] 作为26年第3个创新版本，openUBMC 26.09 采用木兰宽松许可证 2.0（Mulan PSL v2），用户可以自由复制、使用、修改、分发。

- https://www.openubmc.cn/zh/version/26.09 
- https://www.openubmc.cn/zh/version/latest 

#### keywords 重复检查（告警级，不触发提单）

共 9 组重复，涉及 18 个页面

##### [重复 2 次] common.description

- https://www.openubmc.cn/en/course/course_kptest_introduction 
- https://www.openubmc.cn/en/course 

##### [重复 2 次] openUBMC,openUBMC 版本说明,版本说明详情,openUBMC 1.0.0 社区首版本正式上线！

- https://www.openubmc.cn/en/version/1.0.0 
- https://www.openubmc.cn/zh/version/1.0.0 

##### [重复 2 次] openUBMC,openUBMC 版本说明,版本说明详情,openUBMC 25.03 版本发布说明

- https://www.openubmc.cn/en/version/25.03 
- https://www.openubmc.cn/zh/version/25.03 

##### [重复 2 次] openUBMC,openUBMC 版本说明,版本说明详情,openUBMC 25.06 版本发布说明

- https://www.openubmc.cn/en/version/25.06 
- https://www.openubmc.cn/zh/version/25.06 

##### [重复 2 次] openUBMC,openUBMC 版本说明,版本说明详情,openUBMC 25.09 版本发布说明

- https://www.openubmc.cn/en/version/25.09 
- https://www.openubmc.cn/zh/version/25.09 

##### [重复 2 次] openUBMC,openUBMC 活动,活动详情,openUBMC Meetup 深圳站

- https://www.openubmc.cn/zh/events/detail/20251107shenzhen 
- https://www.openubmc.cn/zh/events/detail/20261030shenzhen-meetup 

##### [重复 2 次] openUBMC,openUBMC 活动,活动详情,openUBMC Meetup 成都站

- https://www.openubmc.cn/zh/events/detail/20260814chengdu-meetup 
- https://www.openubmc.cn/zh/events/detail/chengdu-meetup 

##### [重复 2 次] openUBMC,openUBMC 新闻资讯,新闻资讯详情,一图读懂10月社区文档更新清单

- https://www.openubmc.cn/zh/news/202510-docs-update 
- https://www.openubmc.cn/zh/news/202610-docs-update 

##### [重复 2 次] openUBMC,openUBMC 版本说明,版本说明详情,openUBMC 26.09 版本发布说明

- https://www.openubmc.cn/zh/version/26.09 
- https://www.openubmc.cn/zh/version/latest 

#### TDK 缺失检查

共 6 个页面存在 TDK 缺失

##### title 缺失（2 页）

- https://www.openubmc.cn/en/download/community-releases （元素缺失）
- https://www.openubmc.cn/zh/download/community-releases （元素缺失）

##### description 缺失（2 页）

- https://www.openubmc.cn/en/download/community-releases （元素缺失）
- https://www.openubmc.cn/zh/download/community-releases （元素缺失）

##### keywords 缺失（2 页）

- https://www.openubmc.cn/en/download/community-releases （元素缺失）
- https://www.openubmc.cn/zh/download/community-releases （元素缺失）
