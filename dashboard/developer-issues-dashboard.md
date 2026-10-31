# 开发者 Issue 闭环看板

> 本文件由 `scripts/checks/collect-developer-issues.mjs` 自动生成（GitHub Action 定时执行，默认每 12 小时），请勿手动编辑。
> 生成时间：2026-10-31T16:45:34.887Z
> 统计窗口：**2026-10-20**（北京时间当日 00:00）起创建的 issue；窗口起点与 SLA 阈值在 `scripts/config/issue-sla.json` 配置。
> 仓库范围：`scripts/config/services.json`（源自 项目信息.xlsx）；github.com 仓库走 GitHub API，gitcode / gitee / atomgit 仓库按 AtomGit 同名镜像采集。
> 与 [GEO Issue 看板](issues-dashboard.md) 相互独立：本看板面向**全部 issue** 的开发者闭环考核，而非 `[GEO *]` 整改 issue。

## 责任人总览

| 责任人 | 仓库 | 窗口内 issue | 未关闭 | 已闭环 | 闭环率（≥80%） | 响应≤24h² | 平均响应 | 超时未响应 | 闭环≤120h³ | 平均闭环 | 超时未闭环 | 综合 |
|------|------|------|------|------|------|------|------|------|------|------|------|------|
| 龚壮邦<br>[@gzbang](https://github.com/gzbang) · [@gzbang](https://atomgit.com/gzbang) | 1 | 10 | 6 | 4 | 40%（4/10）❌ | — | — | 6 | 25%（1/4） | 6.8d | 4 | ❌ |
| 黄世俊<br>[@HuangSJ-TY](https://github.com/HuangSJ-TY) · [@persimmonzzz](https://atomgit.com/persimmonzzz) | 2 | 26 | 7 | 19 | 73%（19/26）❌ | — | — | 7 | 79%（15/19） | 2.5d | 4 | ❌ |
| 黄泽麟<br>[@cctvcat](https://github.com/cctvcat) · [@cctvcat](https://atomgit.com/cctvcat) | 6（⚠️1 失败） | 74 | 31 | 43 | 58%（43/74）❌ | — | — | 31 | 93%（40/43） | 31.4h | 20 | ❌ |
| 贾森森<br>[@wuming230](https://github.com/wuming230) · [@jiasensen](https://atomgit.com/jiasensen) | 7（⚠️3 失败） | 21 | 17 | 4 | 19%（4/21）❌ | — | — | 17 | 100%（4/4） | 42.1h | 9 | ❌ |
| 刘勇<br>[@liuy2000139](https://github.com/liuy2000139) · [@liuyong2000139](https://atomgit.com/liuyong2000139) | 7 | 76 | 46 | 30 | 39%（30/76）❌ | 11%（1/9） | 2.2d | 36 | 93%（28/30） | 28.9h | 24 | ❌ |
| 吴培聪<br>[@piecong](https://github.com/piecong) · [@piecong](https://atomgit.com/piecong) | 3 | 27 | 10 | 17 | 63%（17/27）❌ | — | — | 7 | 76%（13/17） | 42.5h | 5 | ❌ |
| 张峻玮<br>[@zjwmiao](https://github.com/zjwmiao) · [@jwzmiao](https://atomgit.com/jwzmiao) | 5 | 30 | 11 | 19 | 63%（19/30）❌ | 50%（1/2） | 18.0h | 11 | 89%（17/19） | 46.0h | 4 | ❌ |
| 周琪<br>[@sky-winter](https://github.com/sky-winter) · [@sky-winter](https://atomgit.com/sky-winter) | 3 | 11 | 2 | 9 | 82%（9/11）✅ | — | — | 2 | 33%（3/9） | 5.7d | 0 | 🟡 |
| 李胜波<br>gh:未配置 · ag:未配置 | 2（⚠️1 失败） | 0 | 0 | 0 | — | — | — | 0 | — | — | 0 | ⚠️ |

> ² 响应达标率 = 首次响应 ≤ 24h 的 issue / 已响应 issue（分母不含评论拉取失败者；目标 100%）。
> ³ 闭环达标率 = 闭环时长 ≤ 120h 的 issue / 已闭环 issue（目标 100%）。
> 综合标记：❌ 闭环率 < 80% ｜ 🟡 闭环率达标但存在超时未响应 / 超时未闭环 ｜ ✅ 全部达标 ｜ ⚠️ 名下仓库全部采集失败 ｜ — 窗口内无 issue。

## 龚壮邦

> 平台账号：GitHub [@gzbang](https://github.com/gzbang) · AtomGit [@gzbang](https://atomgit.com/gzbang)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler 软件包贡献（opensourceways/software-package-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#195](https://github.com/opensourceways/software-package-website/issues/195) CVE-2026-111759 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#197](https://github.com/opensourceways/software-package-website/issues/197) CVE-2026-112943 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#199](https://github.com/opensourceways/software-package-website/issues/199) CVE-2026-111758 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#200](https://github.com/opensourceways/software-package-website/issues/200) CVE-2026-111766 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#204](https://github.com/opensourceways/software-package-website/issues/204) CVE-2026-118256 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |
| [#203](https://github.com/opensourceways/software-package-website/issues/203) CVE-2026-118257 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |
| [#196](https://github.com/opensourceways/software-package-website/issues/196) CVE-2026-112942 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 9.0d | 🔴 闭环超120h |
| [#198](https://github.com/opensourceways/software-package-website/issues/198) CVE-2026-112944 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 9.0d | 🔴 闭环超120h |
| [#201](https://github.com/opensourceways/software-package-website/issues/201) CVE-2026-112946 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 24.0h | ✅ |
| [#202](https://github.com/opensourceways/software-package-website/issues/202) CVE-2026-112945 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 8.0d | 🔴 闭环超120h |

## 黄世俊

> 平台账号：GitHub [@HuangSJ-TY](https://github.com/HuangSJ-TY) · AtomGit [@persimmonzzz](https://atomgit.com/persimmonzzz)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler 官网（openeuler/openEuler-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#358](https://atomgit.com/openeuler/openEuler-portal/issues/358) 友好社区样式修改 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 9.2d | 🔴 超24h未响应；超120h未闭环 |
| [#361](https://atomgit.com/openeuler/openEuler-portal/issues/361) 【需求】兼容性列表新增"AI 南北向"支持页面 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 8.6d | 🔴 超24h未响应；超120h未闭环 |
| [#362](https://atomgit.com/openeuler/openEuler-portal/issues/362) [GEO llms.txt] openEuler 官网（openEuler-portal）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.3d | 🔴 超24h未响应；超120h未闭环 |
| [#363](https://atomgit.com/openeuler/openEuler-portal/issues/363) [GEO JSON-LD] openEuler 官网（openEuler-portal）：JSON-LD 规范问题（2 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.3d | 🔴 超24h未响应；超120h未闭环 |
| [#368](https://atomgit.com/openeuler/openEuler-portal/issues/368) [GEO HTML Semantic] openEuler 官网（openEuler-portal）：抽样页面 HTML 语义化检查发现 127 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 3.2d | 🔴 超24h未响应 |
| [#369](https://atomgit.com/openeuler/openEuler-portal/issues/369) 新闻列表、新闻详情和博客列表、博客详情组件替换 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 2.6d | 🔴 超24h未响应 |
| [#373](https://atomgit.com/openeuler/openEuler-portal/issues/373) 下线官网首页【openEuler领先商业实践 单位遴选征集工作】banner | 未关闭 | 2026-10-30 | —（未响应） | — | — | 开启 38.2h | 🔴 超24h未响应 |
| [#348](https://atomgit.com/openeuler/openEuler-portal/issues/348) 修改robots.txt内容 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 8.3h | ✅ |
| [#349](https://atomgit.com/openeuler/openEuler-portal/issues/349) 首页用户案例楼层样式修复 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 7.2d | 🔴 闭环超120h |
| [#350](https://atomgit.com/openeuler/openEuler-portal/issues/350) 更新opendesign-plus/plugins，加快构建 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 1.6h | ✅ |
| [#351](https://atomgit.com/openeuler/openEuler-portal/issues/351) 将@opendesign-plus/components升级至0.0.1-rc.90 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 2.8d | ✅ |
| [#352](https://atomgit.com/openeuler/openEuler-portal/issues/352) 首页【友好社区】及【发行厂商】楼层图片添加alt属性 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 2.9d | ✅ |
| [#353](https://atomgit.com/openeuler/openEuler-portal/issues/353) euler页脚二维码文字修改 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 2.8d | ✅ |
| [#354](https://atomgit.com/openeuler/openEuler-portal/issues/354) CVE-2026-111758 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 8.0d | 🔴 闭环超120h |
| [#355](https://atomgit.com/openeuler/openEuler-portal/issues/355) CVE-2026-111759 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 8.0d | 🔴 闭环超120h |
| [#356](https://atomgit.com/openeuler/openEuler-portal/issues/356) CVE-2026-111766 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 8.0d | 🔴 闭环超120h |
| [#357](https://atomgit.com/openeuler/openEuler-portal/issues/357) [GEO Daily Check] openeuler/openEuler-portal: [ssr-rendering] 2项检查未通过 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 4.1d | ✅ |
| [#359](https://atomgit.com/openeuler/openEuler-portal/issues/359) 将@opendesign-plus/components升级至0.0.1-rc.92 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 21.1h | ✅ |
| [#360](https://atomgit.com/openeuler/openEuler-portal/issues/360) 大会增加活动日程 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 20.0h | ✅ |
| [#364](https://atomgit.com/openeuler/openEuler-portal/issues/364) 兼容性列表样式修正 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 7.7h | ✅ |
| [#365](https://atomgit.com/openeuler/openEuler-portal/issues/365) 大会增加Sponsor的callfor 任务 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 6.2h | ✅ |
| [#366](https://atomgit.com/openeuler/openEuler-portal/issues/366) 升级@opendesign-plus/components版本 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 6.3h | ✅ |
| [#367](https://atomgit.com/openeuler/openEuler-portal/issues/367) 新增自动同步seo/geo相关规范、skill的脚本，移除旧逻辑 | 已闭环 | 2026-10-28 | —（未响应） | — | — | 27.0h | ✅ |
| [#370](https://atomgit.com/openeuler/openEuler-portal/issues/370) 官网活动概览页更新活动地点 | 已闭环 | 2026-10-29 | —（未响应） | — | — | 4.6h | ✅ |
| [#371](https://atomgit.com/openeuler/openEuler-portal/issues/371) 增加共建单位 | 已闭环 | 2026-10-29 | —（未响应） | — | — | 1.3h | ✅ |
| [#372](https://atomgit.com/openeuler/openEuler-portal/issues/372) 下线官网首页【贡献之星评选启动】banner | 已闭环 | 2026-10-29 | —（未响应） | — | — | 3.5h | ✅ |

### openEuler 软件中心（openeuler/easy-software · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

## 黄泽麟

> 平台账号：GitHub [@cctvcat](https://github.com/cctvcat) · AtomGit [@cctvcat](https://atomgit.com/cctvcat)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）
> ⚠️ 1 个仓库本次采集失败，其 issue 未计入指标：openMind 官网（AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像））

### openEuler 文档（openeuler/docs-website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#76](https://atomgit.com/openeuler/docs-website/issues/76) [GEO Sitemap] openEuler 文档（openEuler-docs）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 8.3d | 🔴 超24h未响应；超120h未闭环 |
| [#77](https://atomgit.com/openeuler/docs-website/issues/77) [GEO llms.txt] openEuler 文档（openEuler-docs）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.3d | 🔴 超24h未响应；超120h未闭环 |
| [#78](https://atomgit.com/openeuler/docs-website/issues/78) [GEO JSON-LD] openEuler 文档（openEuler-docs）：JSON-LD 规范问题（2 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.3d | 🔴 超24h未响应；超120h未闭环 |
| [#82](https://atomgit.com/openeuler/docs-website/issues/82) [GEO HTML Semantic] openEuler 文档（openEuler-docs）：抽样页面 HTML 语义化检查发现 70 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 3.2d | 🔴 超24h未响应 |
| [#69](https://atomgit.com/openeuler/docs-website/issues/69) 视频显示异常 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 1.7h | ✅ |
| [#70](https://atomgit.com/openeuler/docs-website/issues/70) robotstxt Sitemap策略冒号后加空格 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 0.9h | ✅ |
| [#71](https://atomgit.com/openeuler/docs-website/issues/71) 手册内搜索无法搜到内容 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 43.1h | ✅ |
| [#72](https://atomgit.com/openeuler/docs-website/issues/72) md有yaml元数据会导致锚点生成异常 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 0.3h | ✅ |
| [#73](https://atomgit.com/openeuler/docs-website/issues/73) llms.txt改为追加各版本文档链接分区 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 45.1h | ✅ |
| [#74](https://atomgit.com/openeuler/docs-website/issues/74) AppFooter仅在首页渲染 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 4.7d | ✅ |
| [#75](https://atomgit.com/openeuler/docs-website/issues/75) 修改nginx配置、优化构建 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 1.2h | ✅ |
| [#79](https://atomgit.com/openeuler/docs-website/issues/79) 未登录情况下会请求未读消息接口 | 已闭环 | 2026-10-26 | —（未响应） | — | — | 42.1h | ✅ |
| [#80](https://atomgit.com/openeuler/docs-website/issues/80) sitemap/HTML meta data 从文档frontmatter取值 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 45.7h | ✅ |
| [#81](https://atomgit.com/openeuler/docs-website/issues/81) 优化nginx | 已闭环 | 2026-10-28 | —（未响应） | — | — | 22.7h | ✅ |

### openEuler 文档插件（opensourceways/vscode-doc-tools · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#174](https://github.com/opensourceways/vscode-doc-tools/issues/174) CVE-2026-111759 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#173](https://github.com/opensourceways/vscode-doc-tools/issues/173) CVE-2026-111758 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#175](https://github.com/opensourceways/vscode-doc-tools/issues/175) CVE-2026-111766 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#177](https://github.com/opensourceways/vscode-doc-tools/issues/177) CVE-2026-109924 | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#176](https://github.com/opensourceways/vscode-doc-tools/issues/176) CVE-2026-109869 | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#178](https://github.com/opensourceways/vscode-doc-tools/issues/178) CVE-2026-87018 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 2.9d | 🔴 超24h未响应 |
| [#180](https://github.com/opensourceways/vscode-doc-tools/issues/180) CVE-2026-109932 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 2.9d | 🔴 超24h未响应 |
| [#179](https://github.com/opensourceways/vscode-doc-tools/issues/179) CVE-2026-109383 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 2.9d | 🔴 超24h未响应 |
| [#181](https://github.com/opensourceways/vscode-doc-tools/issues/181) CVE-2026-118257 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |
| [#182](https://github.com/opensourceways/vscode-doc-tools/issues/182) CVE-2026-118256 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |

### openGauss 文档（opengauss/docs-website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#33](https://atomgit.com/opengauss/docs-website/issues/33) [任务]: @opendesign-plus/utils升级到0.0.1-rc.9 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 9.4d | 🔴 超24h未响应；超120h未闭环 |
| [#35](https://atomgit.com/opengauss/docs-website/issues/35) [GEO Sitemap] openGauss 文档（openGauss-docs）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 8.3d | 🔴 超24h未响应；超120h未闭环 |
| [#36](https://atomgit.com/opengauss/docs-website/issues/36) [GEO llms.txt] openGauss 文档（openGauss-docs）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.3d | 🔴 超24h未响应；超120h未闭环 |
| [#37](https://atomgit.com/opengauss/docs-website/issues/37) [GEO JSON-LD] openGauss 文档（openGauss-docs）：JSON-LD 规范问题（1 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.3d | 🔴 超24h未响应；超120h未闭环 |
| [#40](https://atomgit.com/opengauss/docs-website/issues/40) [GEO HTML Semantic] openGauss 文档（openGauss-docs）：抽样页面 HTML 语义化检查发现 21 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 3.2d | 🔴 超24h未响应 |
| [#32](https://atomgit.com/opengauss/docs-website/issues/32) [任务]:  llms.txt改为追加各版本文档链接分区 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 2.0d | ✅ |
| [#34](https://atomgit.com/opengauss/docs-website/issues/34) [任务]: 修改nginx配置、优化构建 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 1.1h | ✅ |
| [#38](https://atomgit.com/opengauss/docs-website/issues/38) [任务]:导航修改个人中心跳转链接 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 2.7d | ✅ |
| [#39](https://atomgit.com/opengauss/docs-website/issues/39) [任务]: 优化nginx | 已闭环 | 2026-10-28 | —（未响应） | — | — | 2.0d | ✅ |
| [#41](https://atomgit.com/opengauss/docs-website/issues/41) [任务]: 顶部导航换成OHeader组件、footer显示调整 | 已闭环 | 2026-10-29 | —（未响应） | — | — | 2.4h | ✅ |
| [#42](https://atomgit.com/opengauss/docs-website/issues/42) [任务]: 修复初始化主题异常问题、修改文档导航其他文档链接的跳转方式 | 已闭环 | 2026-10-30 | —（未响应） | — | — | 2.2h | ✅ |

### MindSpore 官网（mindspore/mindspore-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#280](https://atomgit.com/mindspore/mindspore-portal/issues/280) [任务]: 首页标题层级顺序不正确 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 10.4d | 🔴 超24h未响应；超120h未闭环 |
| [#282](https://atomgit.com/mindspore/mindspore-portal/issues/282) [任务]: 文档站 sitemap 为每个条目增加 lastmod 与 changefreq | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 10.3d | 🔴 超24h未响应；超120h未闭环 |
| [#294](https://atomgit.com/mindspore/mindspore-portal/issues/294) [GEO Sitemap] MindSpore 官网（MindSpore-portal）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 8.3d | 🔴 超24h未响应；超120h未闭环 |
| [#298](https://atomgit.com/mindspore/mindspore-portal/issues/298) [GEO JSON-LD] MindSpore 官网（MindSpore-portal）：JSON-LD 规范问题（2 类） | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 5.3d | 🔴 超24h未响应；超120h未闭环 |
| [#299](https://atomgit.com/mindspore/mindspore-portal/issues/299) [任务]: 修复sitemap问题（lastmod缺失、changefreq增加兜底、出现脏路径） | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 5.2d | 🔴 超24h未响应；超120h未闭环 |
| [#300](https://atomgit.com/mindspore/mindspore-portal/issues/300) [任务]: 同步master到dev | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 5.2d | 🔴 超24h未响应；超120h未闭环 |
| [#301](https://atomgit.com/mindspore/mindspore-portal/issues/301) [任务]: 新闻博客落地组件 | 未关闭 | 2026-10-27 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |
| [#305](https://atomgit.com/mindspore/mindspore-portal/issues/305) [GEO HTML Semantic] MindSpore 官网（MindSpore-portal）：抽样页面 HTML 语义化检查发现 199 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 3.2d | 🔴 超24h未响应 |
| [#312](https://atomgit.com/mindspore/mindspore-portal/issues/312) [任务]: 隐私声明组件替换 | 未关闭 | 2026-10-30 | —（未响应） | — | — | 开启 33.3h | 🔴 超24h未响应 |
| [#314](https://atomgit.com/mindspore/mindspore-portal/issues/314) [GEO llms.txt] MindSpore 官网（MindSpore-portal）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-30 | —（未响应） | — | — | 开启 29.6h | 🔴 超24h未响应 |
| [#276](https://atomgit.com/mindspore/mindspore-portal/issues/276) [任务]: 修改robots.txt内容 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 7.3h | ✅ |
| [#277](https://atomgit.com/mindspore/mindspore-portal/issues/277) [任务]:website包里存在isClient函数，替换成使用@opensig/opendesign里的isClient变量 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 4.0h | ✅ |
| [#278](https://atomgit.com/mindspore/mindspore-portal/issues/278) [任务]:将isBrowser函数替换成@opensig/opendesign的isClient | 已闭环 | 2026-10-21 | —（未响应） | — | — | 29.3h | ✅ |
| [#279](https://atomgit.com/mindspore/mindspore-portal/issues/279) [任务]: 移除useWait.ts | 已闭环 | 2026-10-21 | —（未响应） | — | — | 25.9h | ✅ |
| [#281](https://atomgit.com/mindspore/mindspore-portal/issues/281) [任务]: 升级markdown-it到14.3.2 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 19.7h | ✅ |
| [#283](https://atomgit.com/mindspore/mindspore-portal/issues/283) CVE-2026-112943 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 2.0d | ✅ |
| [#284](https://atomgit.com/mindspore/mindspore-portal/issues/284) CVE-2026-112944 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 11.3h | ✅ |
| [#285](https://atomgit.com/mindspore/mindspore-portal/issues/285) CVE-2026-111758 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 11.3h | ✅ |
| [#286](https://atomgit.com/mindspore/mindspore-portal/issues/286) CVE-2026-111759 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 11.3h | ✅ |
| [#287](https://atomgit.com/mindspore/mindspore-portal/issues/287) CVE-2026-111766 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 11.3h | ✅ |
| [#288](https://atomgit.com/mindspore/mindspore-portal/issues/288) CVE-2026-112942 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 11.3h | ✅ |
| [#289](https://atomgit.com/mindspore/mindspore-portal/issues/289) [任务]: 升级vite版本到7.3.7 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 3.7h | ✅ |
| [#290](https://atomgit.com/mindspore/mindspore-portal/issues/290) [任务]:移除website里面的addMeeting、deleteMeeting、getMeetingSig api | 已闭环 | 2026-10-22 | —（未响应） | — | — | 24.9h | ✅ |
| [#291](https://atomgit.com/mindspore/mindspore-portal/issues/291) [任务]:优化website-docs的VueDOMPurifyHTML 配置 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 24.2h | ✅ |
| [#292](https://atomgit.com/mindspore/mindspore-portal/issues/292) CVE-2026-112946 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 24.0h | ✅ |
| [#293](https://atomgit.com/mindspore/mindspore-portal/issues/293) CVE-2026-112945 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 24.0h | ✅ |
| [#295](https://atomgit.com/mindspore/mindspore-portal/issues/295) CVE-2026-114132 | 已闭环 | 2026-10-24 | —（未响应） | — | — | 6.3d | 🔴 闭环超120h |
| [#296](https://atomgit.com/mindspore/mindspore-portal/issues/296) CVE-2026-114133 | 已闭环 | 2026-10-24 | —（未响应） | — | — | 6.3d | 🔴 闭环超120h |
| [#297](https://atomgit.com/mindspore/mindspore-portal/issues/297) CVE-2026-114130 | 已闭环 | 2026-10-24 | —（未响应） | — | — | 6.3d | 🔴 闭环超120h |
| [#303](https://atomgit.com/mindspore/mindspore-portal/issues/303) [任务]: 升级nuxt4 | 已闭环 | 2026-10-28 | —（未响应） | — | — | 2.0d | ✅ |
| [#304](https://atomgit.com/mindspore/mindspore-portal/issues/304) [任务]: 新增安装命令2.11.0 | 已闭环 | 2026-10-28 | —（未响应） | — | — | 2.9h | ✅ |
| [#306](https://atomgit.com/mindspore/mindspore-portal/issues/306) CVE-2026-118257 | 已闭环 | 2026-10-30 | —（未响应） | — | — | 7.8h | ✅ |
| [#307](https://atomgit.com/mindspore/mindspore-portal/issues/307) CVE-2026-118256 | 已闭环 | 2026-10-30 | —（未响应） | — | — | 7.8h | ✅ |
| [#308](https://atomgit.com/mindspore/mindspore-portal/issues/308) [任务]: 更新 2.11 版本新闻位置入口 | 已闭环 | 2026-10-30 | —（未响应） | — | — | 0.5h | ✅ |
| [#309](https://atomgit.com/mindspore/mindspore-portal/issues/309) [任务]: 修复文档显示 | 已闭环 | 2026-10-30 | —（未响应） | — | — | 0.5h | ✅ |
| [#310](https://atomgit.com/mindspore/mindspore-portal/issues/310) [任务]:移除最后一个hackthon的banner | 已闭环 | 2026-10-30 | —（未响应） | — | — | 27.8h | ✅ |
| [#313](https://atomgit.com/mindspore/mindspore-portal/issues/313) [任务]:添加2.11版本的banner | 已闭环 | 2026-10-30 | —（未响应） | — | — | 22.1h | ✅ |

### MindSpore 文档（mindspore/website-docs · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#1](https://atomgit.com/mindspore/website-docs/issues/1) [GEO llms.txt] MindSpore 文档（MindSpore-docs）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.3d | 🔴 超24h未响应；超120h未闭环 |
| [#2](https://atomgit.com/mindspore/website-docs/issues/2) [GEO JSON-LD] MindSpore 文档（MindSpore-docs）：JSON-LD 规范问题（2 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.3d | 🔴 超24h未响应；超120h未闭环 |

### openMind 官网（modelers/merlin-website · atomgit）

> ⚠️ 采集失败：AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像）

## 贾森森

> 平台账号：GitHub [@wuming230](https://github.com/wuming230) · AtomGit [@jiasensen](https://atomgit.com/jiasensen)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）
> ⚠️ 3 个仓库本次采集失败，其 issue 未计入指标：openMind 官网（AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像））、openMind 文档（AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像））、openMind 博客（AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像））

### openEuler lfs大文件服务（opensourceways/lfs-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#102](https://github.com/opensourceways/lfs-website/issues/102) CVE-2026-111759 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#101](https://github.com/opensourceways/lfs-website/issues/101) CVE-2026-111758 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#103](https://github.com/opensourceways/lfs-website/issues/103) CVE-2026-111766 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#104](https://github.com/opensourceways/lfs-website/issues/104) CVE-2026-118257 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |
| [#105](https://github.com/opensourceways/lfs-website/issues/105) CVE-2026-118256 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |

### openEuler 会议转文字服务（opensourceways/easywhisperx-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#91](https://github.com/opensourceways/easywhisperx-website/issues/91) CVE-2026-118257 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |
| [#92](https://github.com/opensourceways/easywhisperx-website/issues/92) CVE-2026-118256 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |

### openMind 官网（modelers/merlin-website · atomgit）

> ⚠️ 采集失败：AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像）

### openMind 文档（modelers/merlin-docs · atomgit）

> ⚠️ 采集失败：AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像）

### openMind 博客（modelers/merlin-blogs · atomgit）

> ⚠️ 采集失败：AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像）

### 基础设施服务 通用会议（opensourceways/meeting-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#171](https://github.com/opensourceways/meeting-website/issues/171) CVE-2026-111766 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#172](https://github.com/opensourceways/meeting-website/issues/172) CVE-2026-111759 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#173](https://github.com/opensourceways/meeting-website/issues/173) CVE-2026-111758 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#174](https://github.com/opensourceways/meeting-website/issues/174) CVE-2026-114130 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 7.9d | 🔴 超24h未响应；超120h未闭环 |
| [#176](https://github.com/opensourceways/meeting-website/issues/176) CVE-2026-114132 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 7.9d | 🔴 超24h未响应；超120h未闭环 |
| [#177](https://github.com/opensourceways/meeting-website/issues/177) CVE-2026-114133 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 7.9d | 🔴 超24h未响应；超120h未闭环 |
| [#179](https://github.com/opensourceways/meeting-website/issues/179) CVE-2026-112945 | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 4.9d | 🔴 超24h未响应 |
| [#182](https://github.com/opensourceways/meeting-website/issues/182) CVE-2026-112946 | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 4.9d | 🔴 超24h未响应 |
| [#183](https://github.com/opensourceways/meeting-website/issues/183) CVE-2026-118257 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.2h | 🔴 超24h未响应 |
| [#184](https://github.com/opensourceways/meeting-website/issues/184) CVE-2026-118256 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.2h | 🔴 超24h未响应 |
| [#175](https://github.com/opensourceways/meeting-website/issues/175) CVE-2026-114131 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 3.0d | ✅ |
| [#178](https://github.com/opensourceways/meeting-website/issues/178) CVE-2026-112943 | 已闭环 | 2026-10-26 | —（未响应） | — | — | 24.1h | ✅ |
| [#180](https://github.com/opensourceways/meeting-website/issues/180) CVE-2026-112942 | 已闭环 | 2026-10-26 | —（未响应） | — | — | 2.0d | ✅ |
| [#181](https://github.com/opensourceways/meeting-website/issues/181) CVE-2026-112944 | 已闭环 | 2026-10-26 | —（未响应） | — | — | 24.1h | ✅ |

### 基础设施服务 华为账号（opensourceways/hwid-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

## 刘勇

> 平台账号：GitHub [@liuy2000139](https://github.com/liuy2000139) · AtomGit [@liuyong2000139](https://atomgit.com/liuyong2000139)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler Quick Issue（openeuler/quick-issue · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#47](https://atomgit.com/openeuler/quick-issue/issues/47) CVE-2026-118256 | 未关闭 | 2026-10-30 | —（未响应） | — | — | 开启 45.2h | 🔴 超24h未响应 |
| [#48](https://atomgit.com/openeuler/quick-issue/issues/48) CVE-2026-118257 | 未关闭 | 2026-10-30 | —（未响应） | — | — | 开启 45.2h | 🔴 超24h未响应 |

### openEuler 兼容性测评（opensourceways/certification-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#167](https://github.com/opensourceways/certification-website/issues/167) [任务]: 修复 OCookieNotice 组件背景色 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 3.4d | 🔴 超24h未响应 |
| [#169](https://github.com/opensourceways/certification-website/issues/169) CVE-2026-118257 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |
| [#170](https://github.com/opensourceways/certification-website/issues/170) CVE-2026-118256 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |

### openUBMC 官网（openUBMC/website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#292](https://atomgit.com/openUBMC/website/issues/292) CVE-2026-111759 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#293](https://atomgit.com/openUBMC/website/issues/293) CVE-2026-111766 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#294](https://atomgit.com/openUBMC/website/issues/294) CVE-2026-112942 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#295](https://atomgit.com/openUBMC/website/issues/295) CVE-2026-112943 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#296](https://atomgit.com/openUBMC/website/issues/296) CVE-2026-112944 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#297](https://atomgit.com/openUBMC/website/issues/297) CVE-2026-111758 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 9.9d | 🔴 超24h未响应；超120h未闭环 |
| [#298](https://atomgit.com/openUBMC/website/issues/298) [任务]: 社区版下载所有版本页面title未SSG渲染 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 9.6d | 🔴 超24h未响应；超120h未闭环 |
| [#303](https://atomgit.com/openUBMC/website/issues/303) CVE-2026-112946 | 未关闭 | 2026-10-23 | 2026-10-26 | @liuyong2000139 | 3.4d | 开启 8.9d | 🔴 响应超24h；超120h未闭环 |
| [#304](https://atomgit.com/openUBMC/website/issues/304) CVE-2026-112945 | 未关闭 | 2026-10-23 | 2026-10-26 | @liuyong2000139 | 3.4d | 开启 8.9d | 🔴 响应超24h；超120h未闭环 |
| [#308](https://atomgit.com/openUBMC/website/issues/308) [GEO Sitemap] openUBMC 官网（openUBMC-portal）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 8.3d | 🔴 超24h未响应；超120h未闭环 |
| [#309](https://atomgit.com/openUBMC/website/issues/309) CVE-2026-114130 | 未关闭 | 2026-10-24 | 2026-10-26 | @liuyong2000139 | 2.4d | 开启 7.9d | 🔴 响应超24h；超120h未闭环 |
| [#310](https://atomgit.com/openUBMC/website/issues/310) CVE-2026-114132 | 未关闭 | 2026-10-24 | 2026-10-26 | @liuyong2000139 | 2.4d | 开启 7.9d | 🔴 响应超24h；超120h未闭环 |
| [#311](https://atomgit.com/openUBMC/website/issues/311) CVE-2026-114133 | 未关闭 | 2026-10-24 | 2026-10-26 | @liuyong2000139 | 2.4d | 开启 7.9d | 🔴 响应超24h；超120h未闭环 |
| [#312](https://atomgit.com/openUBMC/website/issues/312) [GEO JSON-LD] openUBMC 官网（openUBMC-portal）：JSON-LD 规范问题（1 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.3d | 🔴 超24h未响应；超120h未闭环 |
| [#314](https://atomgit.com/openUBMC/website/issues/314) [LinkChecker][openUBMC] 196 broken link(s) with HTTP 404 (2026-10-26) | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 5.4d | 🔴 超24h未响应；超120h未闭环 |
| [#315](https://atomgit.com/openUBMC/website/issues/315) [任务]: 添加构建时整合文档重定向逻辑 | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 5.4d | 🔴 超24h未响应；超120h未闭环 |
| [#318](https://atomgit.com/openUBMC/website/issues/318) [GEO HTML Semantic] openUBMC 官网（openUBMC-portal）：抽样页面 HTML 语义化检查发现 15 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 3.2d | 🔴 超24h未响应 |
| [#319](https://atomgit.com/openUBMC/website/issues/319) [任务]: 新闻博客页面的详情使用模板库组件 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 2.3d | 🔴 超24h未响应 |
| [#320](https://atomgit.com/openUBMC/website/issues/320) [任务]: 新闻博客列表使用模板组件 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 2.3d | 🔴 超24h未响应 |
| [#322](https://atomgit.com/openUBMC/website/issues/322) CVE-2026-118257 | 未关闭 | 2026-10-30 | 2026-10-31 | @liuyong2000139 | 39.1h | 开启 46.6h | 🔴 响应超24h |
| [#323](https://atomgit.com/openUBMC/website/issues/323) CVE-2026-118256 | 未关闭 | 2026-10-30 | 2026-10-31 | @liuyong2000139 | 39.1h | 开启 46.6h | 🔴 响应超24h |
| [#325](https://atomgit.com/openUBMC/website/issues/325) [任务]: 隐私声明组件替换 | 未关闭 | 2026-10-30 | —（未响应） | — | — | 开启 33.2h | 🔴 超24h未响应 |
| [#291](https://atomgit.com/openUBMC/website/issues/291) [任务]:升级组件库版本 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 7.4h | ✅ |
| [#299](https://atomgit.com/openUBMC/website/issues/299) [任务]: CLA相关个人信息链接错误 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 21.6h | ✅ |
| [#300](https://atomgit.com/openUBMC/website/issues/300) [任务]:调整banner[openUBMC Meetup 深圳站议题征集] | 已闭环 | 2026-10-22 | —（未响应） | — | — | 29.4h | ✅ |
| [#301](https://atomgit.com/openUBMC/website/issues/301) [任务]: 1022活动更新 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 23.6h | ✅ |
| [#302](https://atomgit.com/openUBMC/website/issues/302) [任务]: SEO（修复部分页面的img alt缺失、sitemap lastmod/changefreq 增加兜底） | 已闭环 | 2026-10-22 | —（未响应） | — | — | 20.9h | ✅ |
| [#305](https://atomgit.com/openUBMC/website/issues/305) [任务]: 活动列表中，已过期的活动，还能在 进行中  标签页展示 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 6.6h | ✅ |
| [#306](https://atomgit.com/openUBMC/website/issues/306) [任务]:学习课程分类 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 7.1d | 🔴 闭环超120h |
| [#307](https://atomgit.com/openUBMC/website/issues/307) [任务]: 新增用户案例 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 3.1h | ✅ |
| [#313](https://atomgit.com/openUBMC/website/issues/313) [任务]: bannner【openUBMC技术生态分论坛】下线 | 已闭环 | 2026-10-26 | —（未响应） | — | — | 2.0h | ✅ |
| [#316](https://atomgit.com/openUBMC/website/issues/316) [任务]: 升级@opendesign-plus/components版本 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 3.0d | ✅ |
| [#317](https://atomgit.com/openUBMC/website/issues/317) [任务]:升级nuxt版本 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 46.9h | ✅ |
| [#321](https://atomgit.com/openUBMC/website/issues/321) [任务]: 新增2026 openUBMC Meetup深圳站倒计时文章及图片 | 已闭环 | 2026-10-29 | —（未响应） | — | — | 20.6h | ✅ |
| [#324](https://atomgit.com/openUBMC/website/issues/324) [任务]:将css文件调整为link 外链引入的形式 | 已闭环 | 2026-10-30 | —（未响应） | — | — | 2.2h | ✅ |
| [#326](https://atomgit.com/openUBMC/website/issues/326) [任务]: 修复文档详情页header展示 | 已闭环 | 2026-10-30 | —（未响应） | — | — | 0.5h | ✅ |
| [#327](https://atomgit.com/openUBMC/website/issues/327) [任务]: cve漏洞升级 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 4.0h | ✅ |
| [#328](https://atomgit.com/openUBMC/website/issues/328) [任务]:修复构建之后有banner过期导致的链接错乱问题 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 3.2h | ✅ |

### openUBMC 文档（openUBMC/docs-website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#23](https://atomgit.com/openUBMC/docs-website/issues/23) [GEO llms.txt] openUBMC 文档（openUBMC-docs）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.3d | 🔴 超24h未响应；超120h未闭环 |
| [#24](https://atomgit.com/openUBMC/docs-website/issues/24) [GEO JSON-LD] openUBMC 文档（openUBMC-docs）：JSON-LD 规范问题（1 类） | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 5.3d | 🔴 超24h未响应；超120h未闭环 |
| [#25](https://atomgit.com/openUBMC/docs-website/issues/25) [GEO HTML Semantic] openUBMC 文档（openUBMC-docs）：抽样页面 HTML 语义化检查发现 2 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 3.2d | 🔴 超24h未响应 |
| [#26](https://atomgit.com/openUBMC/docs-website/issues/26) CVE-2026-118257 | 未关闭 | 2026-10-30 | —（未响应） | — | — | 开启 46.7h | 🔴 超24h未响应 |
| [#27](https://atomgit.com/openUBMC/docs-website/issues/27) CVE-2026-118256 | 未关闭 | 2026-10-30 | —（未响应） | — | — | 开启 46.7h | 🔴 超24h未响应 |
| [#22](https://atomgit.com/openUBMC/docs-website/issues/22) [任务]: 文档中心优化 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 6.2d | 🔴 闭环超120h |

### UnifiedBus 官网（unifiedbus/UnifiedBus-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#108](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/108) [GEO优化]：内链分析路由与配置问题 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 8.4d | 🔴 超24h未响应；超120h未闭环 |
| [#109](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/109) [GEO Sitemap] UnifiedBus（UnifiedBus）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 8.3d | 🔴 超24h未响应；超120h未闭环 |
| [#110](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/110) CVE-2026-114133 | 未关闭 | 2026-10-24 | 2026-10-26 | @liuyong2000139 | 2.5d | 开启 7.9d | 🔴 响应超24h；超120h未闭环 |
| [#111](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/111) CVE-2026-114130 | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.9d | 🔴 超24h未响应；超120h未闭环 |
| [#112](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/112) CVE-2026-114132 | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.9d | 🔴 超24h未响应；超120h未闭环 |
| [#114](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/114) [任务]: 页面跳转时需要新增页面滚动逻辑 | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 5.6d | 🔴 超24h未响应；超120h未闭环 |
| [#117](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/117) [任务]: /zh\|en/meeting/create 与 /meeting/edit/:id 为死路由（无任何入口引用），建议删除 | 未关闭 | 2026-10-27 | —（未响应） | — | — | 开启 4.2d | 🔴 超24h未响应 |
| [#118](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/118) [GEO HTML Semantic] UnifiedBus（UnifiedBus）：抽样页面 HTML 语义化检查发现 9 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 3.2d | 🔴 超24h未响应 |
| [#119](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/119) CVE-2026-118256 | 未关闭 | 2026-10-30 | 2026-10-30 | @liuyong2000139 | 12.4h | 开启 45.2h | 🟢 |
| [#120](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/120) CVE-2026-118257 | 未关闭 | 2026-10-30 | —（未响应） | — | — | 开启 45.2h | 🔴 超24h未响应 |
| [#121](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/121) [任务]: 将css文件调整为link 外链引入的形式 | 未关闭 | 2026-10-30 | —（未响应） | — | — | 开启 33.2h | 🔴 超24h未响应 |
| [#101](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/101) CVE-2026-111766 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 16.3h | ✅ |
| [#103](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/103) CVE-2026-112943 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 16.3h | ✅ |
| [#102](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/102) CVE-2026-112942 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 16.3h | ✅ |
| [#104](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/104) CVE-2026-112944 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 16.3h | ✅ |
| [#105](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/105) CVE-2026-111758 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 16.3h | ✅ |
| [#106](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/106) CVE-2026-111759 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 16.3h | ✅ |
| [#107](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/107) [任务]: 补充英文页面 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 3.0d | ✅ |
| [#113](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/113) [GEO JSON-LD] UnifiedBus（UnifiedBus）：JSON-LD 规范问题（1 类） | 已闭环 | 2026-10-24 | —（未响应） | — | — | 47.0h | ✅ |
| [#115](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/115) [任务]:将@opendesign-plus/components升级到0.0.1-rc.96 | 已闭环 | 2026-10-26 | —（未响应） | — | — | 1.6h | ✅ |
| [#116](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/116) [任务]:会议编辑仅修改 子会议时需要传递subId参数 | 已闭环 | 2026-10-26 | —（未响应） | — | — | 0.2h | ✅ |

### UnifiedBus 资源（unifiedbus/resources · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### 基础设施服务 CLA服务（opensourceways/app-cla-webui · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#102](https://github.com/opensourceways/app-cla-webui/issues/102) CVE-2026-118257 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.2h | 🔴 超24h未响应 |
| [#103](https://github.com/opensourceways/app-cla-webui/issues/103) CVE-2026-118256 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.2h | 🔴 超24h未响应 |
| [#104](https://github.com/opensourceways/app-cla-webui/issues/104) [任务]: 只吃超管角色进行员工签署激活 | 未关闭 | 2026-10-31 | —（未响应） | — | — | 开启 9.6h | 🟢 |
| [#98](https://github.com/opensourceways/app-cla-webui/issues/98) CVE-2026-111766 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 24.0h | ✅ |
| [#99](https://github.com/opensourceways/app-cla-webui/issues/99) CVE-2026-111758 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 24.0h | ✅ |
| [#100](https://github.com/opensourceways/app-cla-webui/issues/100) CVE-2026-111759 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 16.3h | ✅ |

## 吴培聪

> 平台账号：GitHub [@piecong](https://github.com/piecong) · AtomGit [@piecong](https://atomgit.com/piecong)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### HiFloat 官网（hifloat/hifloat-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#38](https://atomgit.com/hifloat/hifloat-portal/issues/38) 【测试载体】hifloat 官网新增「往期活动」列表与详情 | 未关闭 | 2026-10-20 | —（未响应） | — | — | 开启 11.3d | 🔴 超24h未响应；超120h未闭环 |
| [#44](https://atomgit.com/hifloat/hifloat-portal/issues/44) [GEO Sitemap] HiFloat（HiFloat）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 8.3d | 🔴 超24h未响应；超120h未闭环 |
| [#45](https://atomgit.com/hifloat/hifloat-portal/issues/45) [GEO llms.txt] HiFloat（HiFloat）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.3d | 🔴 超24h未响应；超120h未闭环 |
| [#46](https://atomgit.com/hifloat/hifloat-portal/issues/46) [GEO JSON-LD] HiFloat（HiFloat）：JSON-LD 规范问题（1 类） | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 5.3d | 🔴 超24h未响应；超120h未闭环 |
| [#47](https://atomgit.com/hifloat/hifloat-portal/issues/47) [GEO HTML Semantic] HiFloat（HiFloat）：抽样页面 HTML 语义化检查发现 22 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 3.2d | 🔴 超24h未响应 |
| [#52](https://atomgit.com/hifloat/hifloat-portal/issues/52) [任务] 页脚「相关链接」分组补全：机构链接改 i18n、新增「开源仓库」与「最新动态」入口（zh/en 双语） | 未关闭 | 2026-10-31 | —（未响应） | — | — | 开启 7.8h | 🟢 |
| [#53](https://atomgit.com/hifloat/hifloat-portal/issues/53) [粗需求] 活动信息在首页的可见性与活动列表条目信息补全（待需求梳理澄清） | 未关闭 | 2026-10-31 | —（未响应） | — | — | 开启 7.4h | 🟢 |
| [#54](https://atomgit.com/hifloat/hifloat-portal/issues/54) feat: [任务]:修改下拉框样式 | 未关闭 | 2026-10-31 | —（未响应） | — | — | 开启 7.2h | 🟢 |
| [#39](https://atomgit.com/hifloat/hifloat-portal/issues/39) robotstxt Sitemap策略冒号后加空格 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 1.0h | ✅ |
| [#40](https://atomgit.com/hifloat/hifloat-portal/issues/40) [任务]: 页脚相关链接分组优化（标题国际化 + 新增开源仓库入口） | 已闭环 | 2026-10-22 | —（未响应） | — | — | 7.3d | 🔴 闭环超120h |
| [#41](https://atomgit.com/hifloat/hifloat-portal/issues/41) 升级 nuxt-sitemap 增加lastmod、changefreq兜底值 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 5.2h | ✅ |
| [#42](https://atomgit.com/hifloat/hifloat-portal/issues/42) 【测试载体】导航栏新增「文档」入口（新窗口打开） | 已闭环 | 2026-10-23 | —（未响应） | — | — | 6.3d | 🔴 闭环超120h |
| [#43](https://atomgit.com/hifloat/hifloat-portal/issues/43) 【测试载体】关于页联系信息更新（邮箱 + 地址行） | 已闭环 | 2026-10-23 | —（未响应） | — | — | 6.3d | 🔴 闭环超120h |
| [#48](https://atomgit.com/hifloat/hifloat-portal/issues/48) 【测试载体】页脚版权行补充组织名（zh/en 双语同步） | 已闭环 | 2026-10-28 | —（未响应） | — | — | 22.3h | ✅ |
| [#49](https://atomgit.com/hifloat/hifloat-portal/issues/49) 【测试载体】首页主视觉区新增社区定位副标题（zh/en 双语同步） | 已闭环 | 2026-10-29 | —（未响应） | — | — | 1.3h | ✅ |
| [#50](https://atomgit.com/hifloat/hifloat-portal/issues/50) [任务]:调整样式 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 0.5h | ✅ |
| [#51](https://atomgit.com/hifloat/hifloat-portal/issues/51) feat: [任务]:修改样式 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 5.1h | ✅ |

### HiFloat 资源（hifloat/resources · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#8](https://atomgit.com/hifloat/resources/issues/8) 刷新文档链接 | 已闭环 | 2026-10-28 | —（未响应） | — | — | 15.6h | ✅ |

### HiFloat 文档（hifloat/docs-website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#11](https://atomgit.com/hifloat/docs-website/issues/11) [任务]:修改文章内容的行号 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 8.2d | 🔴 超24h未响应；超120h未闭环 |
| [#16](https://atomgit.com/hifloat/docs-website/issues/16) [任务]:修改文章内容的行号格式 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 3.4d | 🔴 超24h未响应 |
| [#12](https://atomgit.com/hifloat/docs-website/issues/12) [任务]:术语和定义章节去掉多余的目录 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 17.9h | ✅ |
| [#13](https://atomgit.com/hifloat/docs-website/issues/13) [任务]:版权保护文件不作为标题 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 5.6d | 🔴 闭环超120h |
| [#14](https://atomgit.com/hifloat/docs-website/issues/14) [任务]:修改文章内容的行号 | 已闭环 | 2026-10-28 | —（未响应） | — | — | 19.4h | ✅ |
| [#15](https://atomgit.com/hifloat/docs-website/issues/15) [任务]:回合代码 | 已闭环 | 2026-10-28 | —（未响应） | — | — | 19.3h | ✅ |
| [#17](https://atomgit.com/hifloat/docs-website/issues/17) [任务]:添加文章内容的行号 | 已闭环 | 2026-10-29 | —（未响应） | — | — | 1.3h | ✅ |
| [#18](https://atomgit.com/hifloat/docs-website/issues/18) [任务]:修改二级目录格式 | 已闭环 | 2026-10-29 | —（未响应） | — | — | 0.4h | ✅ |
| [#19](https://atomgit.com/hifloat/docs-website/issues/19) [任务]:修改markdown文章内容显示异常 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 0.6h | ✅ |

## 张峻玮

> 平台账号：GitHub [@zjwmiao](https://github.com/zjwmiao) · AtomGit [@jwzmiao](https://atomgit.com/jwzmiao)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler 消息中心（opensourceways/message-manager-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#148](https://github.com/opensourceways/message-manager-website/issues/148) CVE-2026-118256 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |
| [#149](https://github.com/opensourceways/message-manager-website/issues/149) CVE-2026-118257 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |

### openEuler 贡献看板（openeuler/opendesign-datastat · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### openGauss 官网（opengauss/website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#447](https://atomgit.com/opengauss/website/issues/447) [任务]: test seo check | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.5d | 🔴 超24h未响应；超120h未闭环 |
| [#448](https://atomgit.com/opengauss/website/issues/448) [GEO JSON-LD] openGauss 官网（openGauss-portal）：JSON-LD 规范问题（1 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 7.3d | 🔴 超24h未响应；超120h未闭环 |
| [#453](https://atomgit.com/opengauss/website/issues/453) [任务]: 顶部导航外链未显示外链图标 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 3.3d | 🔴 超24h未响应 |
| [#454](https://atomgit.com/opengauss/website/issues/454) [任务]: 优化 useCommon composable | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 3.2d | 🔴 超24h未响应 |
| [#455](https://atomgit.com/opengauss/website/issues/455) [GEO HTML Semantic] openGauss 官网（openGauss-portal）：抽样页面 HTML 语义化检查发现 25 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 3.2d | 🔴 超24h未响应 |
| [#457](https://atomgit.com/opengauss/website/issues/457) [任务]: 博客和新闻使用组件 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 2.4d | 🔴 超24h未响应 |
| [#460](https://atomgit.com/opengauss/website/issues/460) [任务]: gauss 首页创建会议角色限制 | 未关闭 | 2026-10-30 | —（未响应） | — | — | 开启 38.3h | 🔴 超24h未响应 |
| [#437](https://atomgit.com/opengauss/website/issues/437) [任务]: 优化sitemap遗留问题（博客页面lastmod，修复sitemap导致构建慢） | 已闭环 | 2026-10-20 | —（未响应） | — | — | 2.1d | ✅ |
| [#438](https://atomgit.com/opengauss/website/issues/438) [任务]:  修复首页banner、友情链接图片alt缺失 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 2.7d | ✅ |
| [#439](https://atomgit.com/opengauss/website/issues/439) [任务]: 修改robots.txt内容 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 1.1h | ✅ |
| [#440](https://atomgit.com/opengauss/website/issues/440) [任务]: 补充图片alt属性 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 2.2d | ✅ |
| [#441](https://atomgit.com/opengauss/website/issues/441) [任务]: 顶部导航使用OHeader组件 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 2.0d | ✅ |
| [#442](https://atomgit.com/opengauss/website/issues/442) [GEO Daily Check] opengauss/website: [ssr-rendering] 4项检查未通过 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 6.1d | 🔴 闭环超120h |
| [#443](https://atomgit.com/opengauss/website/issues/443) CVE-2026-111758 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 24.0h | ✅ |
| [#444](https://atomgit.com/opengauss/website/issues/444) CVE-2026-111759 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 24.0h | ✅ |
| [#445](https://atomgit.com/opengauss/website/issues/445) CVE-2026-111766 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 24.0h | ✅ |
| [#446](https://atomgit.com/opengauss/website/issues/446) [任务]: 隐私声明文案修正 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 5.9d | 🔴 闭环超120h |
| [#449](https://atomgit.com/opengauss/website/issues/449) [任务]: openGauss官网秘书处新增 法务专家 | 已闭环 | 2026-10-25 | 2026-10-26 | @jwzmiao | 33.5h | 37.0h | 🔴 响应超24h |
| [#450](https://atomgit.com/opengauss/website/issues/450) [任务]:【社区组织】页面【秘书处】，英文站label没有hover显示全部内容 | 已闭环 | 2026-10-26 | 2026-10-26 | @jwzmiao | 2.4h | 3.2d | ✅ |
| [#451](https://atomgit.com/opengauss/website/issues/451) [任务]: 升级@opendesign-plus/components版本 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 6.2h | ✅ |
| [#452](https://atomgit.com/opengauss/website/issues/452) [任务]:修改个人中心链接跳转 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 2.7d | ✅ |
| [#456](https://atomgit.com/opengauss/website/issues/456) [任务]: 手机端导航无法切换语言 | 已闭环 | 2026-10-29 | —（未响应） | — | — | 4.0h | ✅ |
| [#458](https://atomgit.com/opengauss/website/issues/458) CVE-2026-118257 | 已闭环 | 2026-10-30 | —（未响应） | — | — | 30.7h | ✅ |
| [#459](https://atomgit.com/opengauss/website/issues/459) CVE-2026-118256 | 已闭环 | 2026-10-30 | —（未响应） | — | — | 30.7h | ✅ |

### openGauss 博客（opengauss/blog · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### 基础设施服务 对内贡献看板（opensourceways/datastat-manage-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#724](https://github.com/opensourceways/datastat-manage-website/issues/724) 蓝区诊断同步按钮支持选起始时间补历史数据 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 9.4d | 🔴 超24h未响应；超120h未闭环 |
| [#726](https://github.com/opensourceways/datastat-manage-website/issues/726) trivy: markdown-it 14.3.2 DoS 漏洞 CVE-2026-111758/111766 升级到 14.3.3 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 9.4d | 🔴 超24h未响应；超120h未闭环 |
| [#723](https://github.com/opensourceways/datastat-manage-website/issues/723) CVE-2026-111766 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 24.0h | ✅ |
| [#722](https://github.com/opensourceways/datastat-manage-website/issues/722) CVE-2026-111758 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 24.0h | ✅ |

## 周琪

> 平台账号：GitHub [@sky-winter](https://github.com/sky-winter) · AtomGit [@sky-winter](https://atomgit.com/sky-winter)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler 个人中心（opensourceways/oneid-workbench-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#194](https://github.com/opensourceways/oneid-workbench-website/issues/194) CVE-2026-118257 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |
| [#195](https://github.com/opensourceways/oneid-workbench-website/issues/195) CVE-2026-118256 | 未关闭 | 2026-10-29 | —（未响应） | — | — | 开启 45.1h | 🔴 超24h未响应 |
| [#186](https://github.com/opensourceways/oneid-workbench-website/issues/186) CVE-2026-114133 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 7.3d | 🔴 闭环超120h |
| [#187](https://github.com/opensourceways/oneid-workbench-website/issues/187) CVE-2026-114130 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 7.3d | 🔴 闭环超120h |
| [#188](https://github.com/opensourceways/oneid-workbench-website/issues/188) CVE-2026-114132 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 7.3d | 🔴 闭环超120h |
| [#189](https://github.com/opensourceways/oneid-workbench-website/issues/189) [任务]: gauss 个人中心开发 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 3.8d | ✅ |

### 基础设施服务 账号服务（opensourceways/oneid-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#325](https://github.com/opensourceways/oneid-website/issues/325) CVE-2026-111759 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 7.0d | 🔴 闭环超120h |
| [#327](https://github.com/opensourceways/oneid-website/issues/327) CVE-2026-111758 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 7.0d | 🔴 闭环超120h |
| [#326](https://github.com/opensourceways/oneid-website/issues/326) CVE-2026-111766 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 7.0d | 🔴 闭环超120h |
| [#329](https://github.com/opensourceways/oneid-website/issues/329) [任务]: release合回main分支 | 已闭环 | 2026-10-28 | —（未响应） | — | — | 2.9d | ✅ |
| [#336](https://github.com/opensourceways/oneid-website/issues/336) [任务]: 组件升级以及放开mfa认证 | 已闭环 | 2026-10-29 | —（未响应） | — | — | 40.3h | ✅ |

### 基础设施服务 论坛（opensourceways/discourse-fully · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

## 李胜波

> 平台账号：GitHub 未配置 · AtomGit 未配置（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）
> ⚠️ 1 个仓库本次采集失败，其 issue 未计入指标：openMind 官网（AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像））

### openMind 官网（modelers/merlin-website · atomgit）

> ⚠️ 采集失败：AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像）

### 基础设施服务 vLLM看板（opensourceways/vLLM-dashboard-website · github）

> 首次响应口径：任意非创建者首条评论（责任人平台 ID 未配置，降级口径）

_统计窗口内无 issue。_

## ⚠️ 待补录

以下责任人出现在 scripts/config/services.json 但未在 scripts/config/developers.json 登记平台 ID（指标仍按仓库归属聚合，首次响应按降级口径）：李胜波。

## 状态与口径说明

- **闭环率**：已闭环 / 窗口内 issue 总数，目标 ≥ 80%；**首次响应**：issue 创建者之外的首条评论（机器人账号排除），责任人平台 ID 已配置时仅统计责任人的首条回复；**闭环时长**：创建 → 闭环（AtomGit 的 finished_at / GitHub 的 closed_at）。
- **超时未响应**：未关闭、无响应、龄期 > 24h；**超时未闭环**：未关闭、龄期 > 120h。评论拉取失败的 issue 响应指标按「未知」处理（详情表 ⚠️），不计入超时。
- 多责任人服务（如 openMind 官网）计入每位责任人的指标，详情表在各自分区重复展示；PR 不计入。
- 采集失败常见原因：GitHub 私有仓（需 repo secret `HSJ_GITHUB_TOKEN`——HSJ 账号且有 opensourceways 组织读权限的 PAT）；AtomGit 私有仓（需 repo secret `HSJ_ATOMGIT_TOKEN`）；AtomGit 404 = github / gitee 源仓库无同名镜像。
- 单仓库 issue 超过 1000 条时截断并在服务分区标注（现量级不会触及）。

## 相关入口

- [服务清单](../scripts/config/services.json)（服务名 / 责任人 / 仓库）· [责任人平台 ID 映射](../scripts/config/developers.json) · [SLA 配置](../scripts/config/issue-sla.json)
- [采集脚本](../scripts/checks/collect-developer-issues.mjs) · [定时 workflow](../.github/workflows/developer-issues-dashboard.yml)
- [GEO Issue 看板](issues-dashboard.md) · [GEO 整改看板](dashboard.md) · [总索引](../index.md)

## 更新方式

```bash
# 全量采集并生成看板（本地无 token 时私有仓会标采集失败）
node scripts/checks/collect-developer-issues.mjs

# 临时覆盖统计窗口起点
node scripts/checks/collect-developer-issues.mjs --since=2026-10-20

# 只采集某责任人名下服务 / 单个服务（调试）
node scripts/checks/collect-developer-issues.mjs --developer=刘勇
node scripts/checks/collect-developer-issues.mjs --service=atomgit/openeuler/openEuler-portal
```
