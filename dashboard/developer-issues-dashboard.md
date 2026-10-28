# 开发者 Issue 闭环看板

> 本文件由 `scripts/checks/collect-developer-issues.mjs` 自动生成（GitHub Action 定时执行，默认每 12 小时），请勿手动编辑。
> 生成时间：2026-10-28T17:50:42.594Z
> 统计窗口：**2026-10-20**（北京时间当日 00:00）起创建的 issue；窗口起点与 SLA 阈值在 `scripts/config/issue-sla.json` 配置。
> 仓库范围：`scripts/config/services.json`（源自 项目信息.xlsx）；github.com 仓库走 GitHub API，gitcode / gitee / atomgit 仓库按 AtomGit 同名镜像采集。
> 与 [GEO Issue 看板](issues-dashboard.md) 相互独立：本看板面向**全部 issue** 的开发者闭环考核，而非 `[GEO *]` 整改 issue。

## 责任人总览

| 责任人 | 仓库 | 窗口内 issue | 未关闭 | 已闭环 | 闭环率（≥80%） | 响应≤24h² | 平均响应 | 超时未响应 | 闭环≤120h³ | 平均闭环 | 超时未闭环 | 综合 |
|------|------|------|------|------|------|------|------|------|------|------|------|------|
| 龚壮邦<br>[@gzbang](https://github.com/gzbang) · [@gzbang](https://atomgit.com/gzbang) | 1 | 8 | 7 | 1 | 13%（1/8）❌ | — | — | 7 | 100%（1/1） | 24.0h | 7 | ❌ |
| 黄世俊<br>[@HuangSJ-TY](https://github.com/HuangSJ-TY) · [@persimmonzzz](https://atomgit.com/persimmonzzz) | 2 | 21 | 9 | 12 | 57%（12/21）❌ | — | — | 7 | 92%（11/12） | 45.8h | 5 | ❌ |
| 黄泽麟<br>[@cctvcat](https://github.com/cctvcat) · [@cctvcat](https://atomgit.com/cctvcat) | 6（⚠️1 失败） | 59 | 32 | 27 | 46%（27/59）❌ | — | — | 26 | 100%（27/27） | 22.0h | 9 | ❌ |
| 贾森森<br>[@wuming230](https://github.com/wuming230) · [@jiasensen](https://atomgit.com/jiasensen) | 7（⚠️3 失败） | 15 | 12 | 3 | 20%（3/15）❌ | — | — | 12 | 100%（3/3） | 40.0h | 6 | ❌ |
| 刘勇<br>[@liuy2000139](https://github.com/liuy2000139) · [@liuyong2000139](https://atomgit.com/liuyong2000139) | 7 | 54 | 33 | 21 | 39%（21/54）❌ | 0%（0/6） | 2.7d | 23 | 100%（21/21） | 18.9h | 14 | ❌ |
| 吴培聪<br>[@piecong](https://github.com/piecong) · [@piecong](https://atomgit.com/piecong) | 3 | 18 | 10 | 8 | 44%（8/18）❌ | — | — | 8 | 100%（8/8） | 17.9h | 6 | ❌ |
| 张峻玮<br>[@zjwmiao](https://github.com/zjwmiao) · [@jwzmiao](https://atomgit.com/jwzmiao) | 5 | 23 | 10 | 13 | 57%（13/23）❌ | 50%（1/2） | 18.0h | 6 | 92%（12/13） | 40.5h | 3 | ❌ |
| 周琪<br>[@sky-winter](https://github.com/sky-winter) · [@sky-winter](https://atomgit.com/sky-winter) | 3 | 8 | 8 | 0 | 0%（0/8）❌ | — | — | 7 | — | — | 3 | ❌ |
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
| [#195](https://github.com/opensourceways/software-package-website/issues/195) CVE-2026-111759 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#196](https://github.com/opensourceways/software-package-website/issues/196) CVE-2026-112942 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#197](https://github.com/opensourceways/software-package-website/issues/197) CVE-2026-112943 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#199](https://github.com/opensourceways/software-package-website/issues/199) CVE-2026-111758 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#198](https://github.com/opensourceways/software-package-website/issues/198) CVE-2026-112944 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#200](https://github.com/opensourceways/software-package-website/issues/200) CVE-2026-111766 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#202](https://github.com/opensourceways/software-package-website/issues/202) CVE-2026-112945 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 5.9d | 🔴 超24h未响应；超120h未闭环 |
| [#201](https://github.com/opensourceways/software-package-website/issues/201) CVE-2026-112946 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 24.0h | ✅ |

## 黄世俊

> 平台账号：GitHub [@HuangSJ-TY](https://github.com/HuangSJ-TY) · AtomGit [@persimmonzzz](https://atomgit.com/persimmonzzz)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler 官网（openeuler/openEuler-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#354](https://atomgit.com/openeuler/openEuler-portal/issues/354) CVE-2026-111758 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#355](https://atomgit.com/openeuler/openEuler-portal/issues/355) CVE-2026-111759 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#356](https://atomgit.com/openeuler/openEuler-portal/issues/356) CVE-2026-111766 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#358](https://atomgit.com/openeuler/openEuler-portal/issues/358) 友好社区样式修改 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 6.3d | 🔴 超24h未响应；超120h未闭环 |
| [#361](https://atomgit.com/openeuler/openEuler-portal/issues/361) 【需求】兼容性列表新增"AI 南北向"支持页面 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.6d | 🔴 超24h未响应；超120h未闭环 |
| [#362](https://atomgit.com/openeuler/openEuler-portal/issues/362) [GEO llms.txt] openEuler 官网（openEuler-portal）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |
| [#363](https://atomgit.com/openeuler/openEuler-portal/issues/363) [GEO JSON-LD] openEuler 官网（openEuler-portal）：JSON-LD 规范问题（2 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.3d | 🔴 超24h未响应 |
| [#367](https://atomgit.com/openeuler/openEuler-portal/issues/367) 新增自动同步seo/geo相关规范、skill的脚本，移除旧逻辑 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 13.9h | 🟢 |
| [#368](https://atomgit.com/openeuler/openEuler-portal/issues/368) [GEO HTML Semantic] openEuler 官网（openEuler-portal）：抽样页面 HTML 语义化检查发现 127 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 6.3h | 🟢 |
| [#348](https://atomgit.com/openeuler/openEuler-portal/issues/348) 修改robots.txt内容 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 8.3h | ✅ |
| [#349](https://atomgit.com/openeuler/openEuler-portal/issues/349) 首页用户案例楼层样式修复 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 7.2d | 🔴 闭环超120h |
| [#350](https://atomgit.com/openeuler/openEuler-portal/issues/350) 更新opendesign-plus/plugins，加快构建 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 1.6h | ✅ |
| [#351](https://atomgit.com/openeuler/openEuler-portal/issues/351) 将@opendesign-plus/components升级至0.0.1-rc.90 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 2.8d | ✅ |
| [#352](https://atomgit.com/openeuler/openEuler-portal/issues/352) 首页【友好社区】及【发行厂商】楼层图片添加alt属性 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 2.9d | ✅ |
| [#353](https://atomgit.com/openeuler/openEuler-portal/issues/353) euler页脚二维码文字修改 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 2.8d | ✅ |
| [#357](https://atomgit.com/openeuler/openEuler-portal/issues/357) [GEO Daily Check] openeuler/openEuler-portal: [ssr-rendering] 2项检查未通过 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 4.1d | ✅ |
| [#359](https://atomgit.com/openeuler/openEuler-portal/issues/359) 将@opendesign-plus/components升级至0.0.1-rc.92 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 21.1h | ✅ |
| [#360](https://atomgit.com/openeuler/openEuler-portal/issues/360) 大会增加活动日程 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 20.0h | ✅ |
| [#364](https://atomgit.com/openeuler/openEuler-portal/issues/364) 兼容性列表样式修正 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 7.7h | ✅ |
| [#365](https://atomgit.com/openeuler/openEuler-portal/issues/365) 大会增加Sponsor的callfor 任务 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 6.2h | ✅ |
| [#366](https://atomgit.com/openeuler/openEuler-portal/issues/366) 升级@opendesign-plus/components版本 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 6.3h | ✅ |

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
| [#76](https://atomgit.com/openeuler/docs-website/issues/76) [GEO Sitemap] openEuler 文档（openEuler-docs）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.3d | 🔴 超24h未响应；超120h未闭环 |
| [#77](https://atomgit.com/openeuler/docs-website/issues/77) [GEO llms.txt] openEuler 文档（openEuler-docs）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |
| [#78](https://atomgit.com/openeuler/docs-website/issues/78) [GEO JSON-LD] openEuler 文档（openEuler-docs）：JSON-LD 规范问题（2 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.3d | 🔴 超24h未响应 |
| [#80](https://atomgit.com/openeuler/docs-website/issues/80) sitemap/HTML meta data 从文档frontmatter取值 | 未关闭 | 2026-10-27 | —（未响应） | — | — | 开启 32.7h | 🔴 超24h未响应 |
| [#81](https://atomgit.com/openeuler/docs-website/issues/81) 优化nginx | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 14.4h | 🟢 |
| [#82](https://atomgit.com/openeuler/docs-website/issues/82) [GEO HTML Semantic] openEuler 文档（openEuler-docs）：抽样页面 HTML 语义化检查发现 70 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 6.3h | 🟢 |
| [#69](https://atomgit.com/openeuler/docs-website/issues/69) 视频显示异常 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 1.7h | ✅ |
| [#70](https://atomgit.com/openeuler/docs-website/issues/70) robotstxt Sitemap策略冒号后加空格 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 0.9h | ✅ |
| [#71](https://atomgit.com/openeuler/docs-website/issues/71) 手册内搜索无法搜到内容 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 43.1h | ✅ |
| [#72](https://atomgit.com/openeuler/docs-website/issues/72) md有yaml元数据会导致锚点生成异常 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 0.3h | ✅ |
| [#73](https://atomgit.com/openeuler/docs-website/issues/73) llms.txt改为追加各版本文档链接分区 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 45.1h | ✅ |
| [#74](https://atomgit.com/openeuler/docs-website/issues/74) AppFooter仅在首页渲染 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 4.7d | ✅ |
| [#75](https://atomgit.com/openeuler/docs-website/issues/75) 修改nginx配置、优化构建 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 1.2h | ✅ |
| [#79](https://atomgit.com/openeuler/docs-website/issues/79) 未登录情况下会请求未读消息接口 | 已闭环 | 2026-10-26 | —（未响应） | — | — | 42.1h | ✅ |

### openEuler 文档插件（opensourceways/vscode-doc-tools · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#174](https://github.com/opensourceways/vscode-doc-tools/issues/174) CVE-2026-111759 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#173](https://github.com/opensourceways/vscode-doc-tools/issues/173) CVE-2026-111758 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#175](https://github.com/opensourceways/vscode-doc-tools/issues/175) CVE-2026-111766 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#177](https://github.com/opensourceways/vscode-doc-tools/issues/177) CVE-2026-109924 | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 3.9d | 🔴 超24h未响应 |
| [#176](https://github.com/opensourceways/vscode-doc-tools/issues/176) CVE-2026-109869 | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 3.9d | 🔴 超24h未响应 |

### openGauss 文档（opengauss/docs-website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#33](https://atomgit.com/opengauss/docs-website/issues/33) [任务]: @opendesign-plus/utils升级到0.0.1-rc.9 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 6.4d | 🔴 超24h未响应；超120h未闭环 |
| [#35](https://atomgit.com/opengauss/docs-website/issues/35) [GEO Sitemap] openGauss 文档（openGauss-docs）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.3d | 🔴 超24h未响应；超120h未闭环 |
| [#36](https://atomgit.com/opengauss/docs-website/issues/36) [GEO llms.txt] openGauss 文档（openGauss-docs）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |
| [#37](https://atomgit.com/opengauss/docs-website/issues/37) [GEO JSON-LD] openGauss 文档（openGauss-docs）：JSON-LD 规范问题（1 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.3d | 🔴 超24h未响应 |
| [#38](https://atomgit.com/opengauss/docs-website/issues/38) [任务]:导航修改个人中心跳转链接 | 未关闭 | 2026-10-27 | —（未响应） | — | — | 开启 32.4h | 🔴 超24h未响应 |
| [#39](https://atomgit.com/opengauss/docs-website/issues/39) [任务]: 优化nginx | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 14.2h | 🟢 |
| [#40](https://atomgit.com/opengauss/docs-website/issues/40) [GEO HTML Semantic] openGauss 文档（openGauss-docs）：抽样页面 HTML 语义化检查发现 21 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 6.3h | 🟢 |
| [#32](https://atomgit.com/opengauss/docs-website/issues/32) [任务]:  llms.txt改为追加各版本文档链接分区 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 2.0d | ✅ |
| [#34](https://atomgit.com/opengauss/docs-website/issues/34) [任务]: 修改nginx配置、优化构建 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 1.1h | ✅ |

### MindSpore 官网（mindspore/mindspore-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#280](https://atomgit.com/mindspore/mindspore-portal/issues/280) [任务]: 首页标题层级顺序不正确 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 7.5d | 🔴 超24h未响应；超120h未闭环 |
| [#282](https://atomgit.com/mindspore/mindspore-portal/issues/282) [任务]: 文档站 sitemap 为每个条目增加 lastmod 与 changefreq | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 7.3d | 🔴 超24h未响应；超120h未闭环 |
| [#294](https://atomgit.com/mindspore/mindspore-portal/issues/294) [GEO Sitemap] MindSpore 官网（MindSpore-portal）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.3d | 🔴 超24h未响应；超120h未闭环 |
| [#295](https://atomgit.com/mindspore/mindspore-portal/issues/295) CVE-2026-114132 | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.9d | 🔴 超24h未响应 |
| [#296](https://atomgit.com/mindspore/mindspore-portal/issues/296) CVE-2026-114133 | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.9d | 🔴 超24h未响应 |
| [#297](https://atomgit.com/mindspore/mindspore-portal/issues/297) CVE-2026-114130 | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.9d | 🔴 超24h未响应 |
| [#298](https://atomgit.com/mindspore/mindspore-portal/issues/298) [GEO JSON-LD] MindSpore 官网（MindSpore-portal）：JSON-LD 规范问题（2 类） | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 2.4d | 🔴 超24h未响应 |
| [#299](https://atomgit.com/mindspore/mindspore-portal/issues/299) [任务]: 修复sitemap问题（lastmod缺失、changefreq增加兜底、出现脏路径） | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 2.3d | 🔴 超24h未响应 |
| [#300](https://atomgit.com/mindspore/mindspore-portal/issues/300) [任务]: 同步master到dev | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 2.2d | 🔴 超24h未响应 |
| [#301](https://atomgit.com/mindspore/mindspore-portal/issues/301) [任务]: 新闻博客落地组件 | 未关闭 | 2026-10-27 | —（未响应） | — | — | 开启 38.4h | 🔴 超24h未响应 |
| [#303](https://atomgit.com/mindspore/mindspore-portal/issues/303) [任务]: 升级nuxt4 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 16.0h | 🟢 |
| [#305](https://atomgit.com/mindspore/mindspore-portal/issues/305) [GEO HTML Semantic] MindSpore 官网（MindSpore-portal）：抽样页面 HTML 语义化检查发现 199 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 6.3h | 🟢 |
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
| [#304](https://atomgit.com/mindspore/mindspore-portal/issues/304) [任务]: 新增安装命令2.11.0 | 已闭环 | 2026-10-28 | —（未响应） | — | — | 2.9h | ✅ |

### MindSpore 文档（mindspore/website-docs · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#1](https://atomgit.com/mindspore/website-docs/issues/1) [GEO llms.txt] MindSpore 文档（MindSpore-docs）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |
| [#2](https://atomgit.com/mindspore/website-docs/issues/2) [GEO JSON-LD] MindSpore 文档（MindSpore-docs）：JSON-LD 规范问题（2 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.3d | 🔴 超24h未响应 |

### openMind 官网（modelers/merlin-website · atomgit）

> ⚠️ 采集失败：AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像）

## 贾森森

> 平台账号：GitHub [@wuming230](https://github.com/wuming230) · AtomGit [@jiasensen](https://atomgit.com/jiasensen)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）
> ⚠️ 3 个仓库本次采集失败，其 issue 未计入指标：openMind 官网（AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像））、openMind 文档（AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像））、openMind 博客（AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像））

### openEuler lfs大文件服务（opensourceways/lfs-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#102](https://github.com/opensourceways/lfs-website/issues/102) CVE-2026-111759 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#101](https://github.com/opensourceways/lfs-website/issues/101) CVE-2026-111758 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#103](https://github.com/opensourceways/lfs-website/issues/103) CVE-2026-111766 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |

### openEuler 会议转文字服务（opensourceways/easywhisperx-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

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
| [#171](https://github.com/opensourceways/meeting-website/issues/171) CVE-2026-111766 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#172](https://github.com/opensourceways/meeting-website/issues/172) CVE-2026-111759 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#173](https://github.com/opensourceways/meeting-website/issues/173) CVE-2026-111758 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#174](https://github.com/opensourceways/meeting-website/issues/174) CVE-2026-114130 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 4.9d | 🔴 超24h未响应 |
| [#176](https://github.com/opensourceways/meeting-website/issues/176) CVE-2026-114132 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 4.9d | 🔴 超24h未响应 |
| [#177](https://github.com/opensourceways/meeting-website/issues/177) CVE-2026-114133 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 4.9d | 🔴 超24h未响应 |
| [#179](https://github.com/opensourceways/meeting-website/issues/179) CVE-2026-112945 | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 46.3h | 🔴 超24h未响应 |
| [#180](https://github.com/opensourceways/meeting-website/issues/180) CVE-2026-112942 | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 46.3h | 🔴 超24h未响应 |
| [#182](https://github.com/opensourceways/meeting-website/issues/182) CVE-2026-112946 | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 46.3h | 🔴 超24h未响应 |
| [#175](https://github.com/opensourceways/meeting-website/issues/175) CVE-2026-114131 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 3.0d | ✅ |
| [#178](https://github.com/opensourceways/meeting-website/issues/178) CVE-2026-112943 | 已闭环 | 2026-10-26 | —（未响应） | — | — | 24.1h | ✅ |
| [#181](https://github.com/opensourceways/meeting-website/issues/181) CVE-2026-112944 | 已闭环 | 2026-10-26 | —（未响应） | — | — | 24.1h | ✅ |

### 基础设施服务 华为账号（opensourceways/hwid-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

## 刘勇

> 平台账号：GitHub [@liuy2000139](https://github.com/liuy2000139) · AtomGit [@liuyong2000139](https://atomgit.com/liuyong2000139)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler Quick Issue（openeuler/quick-issue · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### openEuler 兼容性测评（opensourceways/certification-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#167](https://github.com/opensourceways/certification-website/issues/167) [任务]: 修复 OCookieNotice 组件背景色 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 11.3h | 🟢 |

### openUBMC 官网（openUBMC/website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#292](https://atomgit.com/openUBMC/website/issues/292) CVE-2026-111759 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 7.0d | 🔴 超24h未响应；超120h未闭环 |
| [#293](https://atomgit.com/openUBMC/website/issues/293) CVE-2026-111766 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 7.0d | 🔴 超24h未响应；超120h未闭环 |
| [#294](https://atomgit.com/openUBMC/website/issues/294) CVE-2026-112942 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 7.0d | 🔴 超24h未响应；超120h未闭环 |
| [#295](https://atomgit.com/openUBMC/website/issues/295) CVE-2026-112943 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 7.0d | 🔴 超24h未响应；超120h未闭环 |
| [#296](https://atomgit.com/openUBMC/website/issues/296) CVE-2026-112944 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 7.0d | 🔴 超24h未响应；超120h未闭环 |
| [#297](https://atomgit.com/openUBMC/website/issues/297) CVE-2026-111758 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 7.0d | 🔴 超24h未响应；超120h未闭环 |
| [#298](https://atomgit.com/openUBMC/website/issues/298) [任务]: 社区版下载所有版本页面title未SSG渲染 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 6.6d | 🔴 超24h未响应；超120h未闭环 |
| [#303](https://atomgit.com/openUBMC/website/issues/303) CVE-2026-112946 | 未关闭 | 2026-10-23 | 2026-10-26 | @liuyong2000139 | 3.4d | 开启 6.0d | 🔴 响应超24h；超120h未闭环 |
| [#304](https://atomgit.com/openUBMC/website/issues/304) CVE-2026-112945 | 未关闭 | 2026-10-23 | 2026-10-26 | @liuyong2000139 | 3.4d | 开启 6.0d | 🔴 响应超24h；超120h未闭环 |
| [#306](https://atomgit.com/openUBMC/website/issues/306) [任务]:学习课程分类 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.5d | 🔴 超24h未响应；超120h未闭环 |
| [#308](https://atomgit.com/openUBMC/website/issues/308) [GEO Sitemap] openUBMC 官网（openUBMC-portal）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.3d | 🔴 超24h未响应；超120h未闭环 |
| [#309](https://atomgit.com/openUBMC/website/issues/309) CVE-2026-114130 | 未关闭 | 2026-10-24 | 2026-10-26 | @liuyong2000139 | 2.4d | 开启 5.0d | 🔴 响应超24h |
| [#310](https://atomgit.com/openUBMC/website/issues/310) CVE-2026-114132 | 未关闭 | 2026-10-24 | 2026-10-26 | @liuyong2000139 | 2.4d | 开启 5.0d | 🔴 响应超24h |
| [#311](https://atomgit.com/openUBMC/website/issues/311) CVE-2026-114133 | 未关闭 | 2026-10-24 | 2026-10-26 | @liuyong2000139 | 2.4d | 开启 5.0d | 🔴 响应超24h |
| [#312](https://atomgit.com/openUBMC/website/issues/312) [GEO JSON-LD] openUBMC 官网（openUBMC-portal）：JSON-LD 规范问题（1 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.3d | 🔴 超24h未响应 |
| [#314](https://atomgit.com/openUBMC/website/issues/314) [LinkChecker][openUBMC] 196 broken link(s) with HTTP 404 (2026-10-26) | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 2.4d | 🔴 超24h未响应 |
| [#315](https://atomgit.com/openUBMC/website/issues/315) [任务]: 添加构建时整合文档重定向逻辑 | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 2.4d | 🔴 超24h未响应 |
| [#316](https://atomgit.com/openUBMC/website/issues/316) [任务]: 升级@opendesign-plus/components版本 | 未关闭 | 2026-10-27 | —（未响应） | — | — | 开启 38.4h | 🔴 超24h未响应 |
| [#317](https://atomgit.com/openUBMC/website/issues/317) [任务]:升级nuxt版本 | 未关闭 | 2026-10-27 | —（未响应） | — | — | 开启 32.4h | 🔴 超24h未响应 |
| [#318](https://atomgit.com/openUBMC/website/issues/318) [GEO HTML Semantic] openUBMC 官网（openUBMC-portal）：抽样页面 HTML 语义化检查发现 15 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 6.3h | 🟢 |
| [#291](https://atomgit.com/openUBMC/website/issues/291) [任务]:升级组件库版本 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 7.4h | ✅ |
| [#299](https://atomgit.com/openUBMC/website/issues/299) [任务]: CLA相关个人信息链接错误 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 21.6h | ✅ |
| [#300](https://atomgit.com/openUBMC/website/issues/300) [任务]:调整banner[openUBMC Meetup 深圳站议题征集] | 已闭环 | 2026-10-22 | —（未响应） | — | — | 29.4h | ✅ |
| [#301](https://atomgit.com/openUBMC/website/issues/301) [任务]: 1022活动更新 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 23.6h | ✅ |
| [#302](https://atomgit.com/openUBMC/website/issues/302) [任务]: SEO（修复部分页面的img alt缺失、sitemap lastmod/changefreq 增加兜底） | 已闭环 | 2026-10-22 | —（未响应） | — | — | 20.9h | ✅ |
| [#305](https://atomgit.com/openUBMC/website/issues/305) [任务]: 活动列表中，已过期的活动，还能在 进行中  标签页展示 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 6.6h | ✅ |
| [#307](https://atomgit.com/openUBMC/website/issues/307) [任务]: 新增用户案例 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 3.1h | ✅ |
| [#313](https://atomgit.com/openUBMC/website/issues/313) [任务]: bannner【openUBMC技术生态分论坛】下线 | 已闭环 | 2026-10-26 | —（未响应） | — | — | 2.0h | ✅ |

### openUBMC 文档（openUBMC/docs-website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#22](https://atomgit.com/openUBMC/docs-website/issues/22) [任务]: 文档中心优化 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.6d | 🔴 超24h未响应；超120h未闭环 |
| [#23](https://atomgit.com/openUBMC/docs-website/issues/23) [GEO llms.txt] openUBMC 文档（openUBMC-docs）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |
| [#24](https://atomgit.com/openUBMC/docs-website/issues/24) [GEO JSON-LD] openUBMC 文档（openUBMC-docs）：JSON-LD 规范问题（1 类） | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 2.4d | 🔴 超24h未响应 |
| [#25](https://atomgit.com/openUBMC/docs-website/issues/25) [GEO HTML Semantic] openUBMC 文档（openUBMC-docs）：抽样页面 HTML 语义化检查发现 2 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 6.3h | 🟢 |

### UnifiedBus 官网（unifiedbus/UnifiedBus-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#108](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/108) [GEO优化]：内链分析路由与配置问题 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.5d | 🔴 超24h未响应；超120h未闭环 |
| [#109](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/109) [GEO Sitemap] UnifiedBus（UnifiedBus）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.3d | 🔴 超24h未响应；超120h未闭环 |
| [#110](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/110) CVE-2026-114133 | 未关闭 | 2026-10-24 | 2026-10-26 | @liuyong2000139 | 2.5d | 开启 4.9d | 🔴 响应超24h |
| [#111](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/111) CVE-2026-114130 | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.9d | 🔴 超24h未响应 |
| [#112](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/112) CVE-2026-114132 | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.9d | 🔴 超24h未响应 |
| [#114](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/114) [任务]: 页面跳转时需要新增页面滚动逻辑 | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 2.7d | 🔴 超24h未响应 |
| [#117](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/117) [任务]: /zh\|en/meeting/create 与 /meeting/edit/:id 为死路由（无任何入口引用），建议删除 | 未关闭 | 2026-10-27 | —（未响应） | — | — | 开启 30.4h | 🔴 超24h未响应 |
| [#118](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/118) [GEO HTML Semantic] UnifiedBus（UnifiedBus）：抽样页面 HTML 语义化检查发现 9 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 6.3h | 🟢 |
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
| [#98](https://github.com/opensourceways/app-cla-webui/issues/98) CVE-2026-111766 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 24.0h | ✅ |
| [#99](https://github.com/opensourceways/app-cla-webui/issues/99) CVE-2026-111758 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 24.0h | ✅ |
| [#100](https://github.com/opensourceways/app-cla-webui/issues/100) CVE-2026-111759 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 16.3h | ✅ |

## 吴培聪

> 平台账号：GitHub [@piecong](https://github.com/piecong) · AtomGit [@piecong](https://atomgit.com/piecong)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### HiFloat 官网（hifloat/hifloat-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#38](https://atomgit.com/hifloat/hifloat-portal/issues/38) 【测试载体】hifloat 官网新增「往期活动」列表与详情 | 未关闭 | 2026-10-20 | —（未响应） | — | — | 开启 8.4d | 🔴 超24h未响应；超120h未闭环 |
| [#40](https://atomgit.com/hifloat/hifloat-portal/issues/40) [任务]: 页脚相关链接分组优化（标题国际化 + 新增开源仓库入口） | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 6.4d | 🔴 超24h未响应；超120h未闭环 |
| [#42](https://atomgit.com/hifloat/hifloat-portal/issues/42) 【测试载体】导航栏新增「文档」入口（新窗口打开） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.5d | 🔴 超24h未响应；超120h未闭环 |
| [#43](https://atomgit.com/hifloat/hifloat-portal/issues/43) 【测试载体】关于页联系信息更新（邮箱 + 地址行） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.5d | 🔴 超24h未响应；超120h未闭环 |
| [#44](https://atomgit.com/hifloat/hifloat-portal/issues/44) [GEO Sitemap] HiFloat（HiFloat）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.3d | 🔴 超24h未响应；超120h未闭环 |
| [#45](https://atomgit.com/hifloat/hifloat-portal/issues/45) [GEO llms.txt] HiFloat（HiFloat）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |
| [#46](https://atomgit.com/hifloat/hifloat-portal/issues/46) [GEO JSON-LD] HiFloat（HiFloat）：JSON-LD 规范问题（1 类） | 未关闭 | 2026-10-26 | —（未响应） | — | — | 开启 2.4d | 🔴 超24h未响应 |
| [#47](https://atomgit.com/hifloat/hifloat-portal/issues/47) [GEO HTML Semantic] HiFloat（HiFloat）：抽样页面 HTML 语义化检查发现 22 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 6.3h | 🟢 |
| [#48](https://atomgit.com/hifloat/hifloat-portal/issues/48) 【测试载体】页脚版权行补充组织名（zh/en 双语同步） | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 2.2h | 🟢 |
| [#39](https://atomgit.com/hifloat/hifloat-portal/issues/39) robotstxt Sitemap策略冒号后加空格 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 1.0h | ✅ |
| [#41](https://atomgit.com/hifloat/hifloat-portal/issues/41) 升级 nuxt-sitemap 增加lastmod、changefreq兜底值 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 5.2h | ✅ |

### HiFloat 资源（hifloat/resources · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#8](https://atomgit.com/hifloat/resources/issues/8) 刷新文档链接 | 已闭环 | 2026-10-28 | —（未响应） | — | — | 0.2h | ✅ |

### HiFloat 文档（hifloat/docs-website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#11](https://atomgit.com/hifloat/docs-website/issues/11) [任务]:修改文章内容的行号 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.2d | 🔴 超24h未响应；超120h未闭环 |
| [#12](https://atomgit.com/hifloat/docs-website/issues/12) [任务]:术语和定义章节去掉多余的目录 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 17.9h | ✅ |
| [#13](https://atomgit.com/hifloat/docs-website/issues/13) [任务]:版权保护文件不作为标题 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 4.8d | ✅ |
| [#14](https://atomgit.com/hifloat/docs-website/issues/14) [任务]:修改文章内容的行号 | 已闭环 | 2026-10-28 | —（未响应） | — | — | 0.7h | ✅ |
| [#15](https://atomgit.com/hifloat/docs-website/issues/15) [任务]:回合代码 | 已闭环 | 2026-10-28 | —（未响应） | — | — | 2.4h | ✅ |
| [#16](https://atomgit.com/hifloat/docs-website/issues/16) [任务]:修改文章内容的行号格式 | 已闭环 | 2026-10-28 | —（未响应） | — | — | 1.2h | ✅ |

## 张峻玮

> 平台账号：GitHub [@zjwmiao](https://github.com/zjwmiao) · AtomGit [@jwzmiao](https://atomgit.com/jwzmiao)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler 消息中心（opensourceways/message-manager-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### openEuler 贡献看板（openeuler/opendesign-datastat · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### openGauss 官网（opengauss/website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#446](https://atomgit.com/opengauss/website/issues/446) [任务]: 隐私声明文案修正 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.3d | 🔴 超24h未响应；超120h未闭环 |
| [#447](https://atomgit.com/opengauss/website/issues/447) [任务]: test seo check | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |
| [#448](https://atomgit.com/opengauss/website/issues/448) [GEO JSON-LD] openGauss 官网（openGauss-portal）：JSON-LD 规范问题（1 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.3d | 🔴 超24h未响应 |
| [#450](https://atomgit.com/opengauss/website/issues/450) [任务]:【社区组织】页面【秘书处】，英文站label没有hover显示全部内容 | 未关闭 | 2026-10-26 | 2026-10-26 | @jwzmiao | 2.4h | 开启 2.6d | 🟢 |
| [#452](https://atomgit.com/opengauss/website/issues/452) [任务]:修改个人中心链接跳转 | 未关闭 | 2026-10-27 | —（未响应） | — | — | 开启 32.8h | 🔴 超24h未响应 |
| [#453](https://atomgit.com/opengauss/website/issues/453) [任务]: 顶部导航外链未显示外链图标 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 7.7h | 🟢 |
| [#454](https://atomgit.com/opengauss/website/issues/454) [任务]: 优化 useCommon composable | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 6.7h | 🟢 |
| [#455](https://atomgit.com/opengauss/website/issues/455) [GEO HTML Semantic] openGauss 官网（openGauss-portal）：抽样页面 HTML 语义化检查发现 25 处规范问题 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 6.3h | 🟢 |
| [#437](https://atomgit.com/opengauss/website/issues/437) [任务]: 优化sitemap遗留问题（博客页面lastmod，修复sitemap导致构建慢） | 已闭环 | 2026-10-20 | —（未响应） | — | — | 2.1d | ✅ |
| [#438](https://atomgit.com/opengauss/website/issues/438) [任务]:  修复首页banner、友情链接图片alt缺失 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 2.7d | ✅ |
| [#439](https://atomgit.com/opengauss/website/issues/439) [任务]: 修改robots.txt内容 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 1.1h | ✅ |
| [#440](https://atomgit.com/opengauss/website/issues/440) [任务]: 补充图片alt属性 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 2.2d | ✅ |
| [#441](https://atomgit.com/opengauss/website/issues/441) [任务]: 顶部导航使用OHeader组件 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 2.0d | ✅ |
| [#442](https://atomgit.com/opengauss/website/issues/442) [GEO Daily Check] opengauss/website: [ssr-rendering] 4项检查未通过 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 6.1d | 🔴 闭环超120h |
| [#443](https://atomgit.com/opengauss/website/issues/443) CVE-2026-111758 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 24.0h | ✅ |
| [#444](https://atomgit.com/opengauss/website/issues/444) CVE-2026-111759 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 24.0h | ✅ |
| [#445](https://atomgit.com/opengauss/website/issues/445) CVE-2026-111766 | 已闭环 | 2026-10-22 | —（未响应） | — | — | 24.0h | ✅ |
| [#449](https://atomgit.com/opengauss/website/issues/449) [任务]: openGauss官网秘书处新增 法务专家 | 已闭环 | 2026-10-25 | 2026-10-26 | @jwzmiao | 33.5h | 37.0h | 🔴 响应超24h |
| [#451](https://atomgit.com/opengauss/website/issues/451) [任务]: 升级@opendesign-plus/components版本 | 已闭环 | 2026-10-27 | —（未响应） | — | — | 6.2h | ✅ |

### openGauss 博客（opengauss/blog · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### 基础设施服务 对内贡献看板（opensourceways/datastat-manage-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#724](https://github.com/opensourceways/datastat-manage-website/issues/724) 蓝区诊断同步按钮支持选起始时间补历史数据 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 6.4d | 🔴 超24h未响应；超120h未闭环 |
| [#726](https://github.com/opensourceways/datastat-manage-website/issues/726) trivy: markdown-it 14.3.2 DoS 漏洞 CVE-2026-111758/111766 升级到 14.3.3 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 6.4d | 🔴 超24h未响应；超120h未闭环 |
| [#723](https://github.com/opensourceways/datastat-manage-website/issues/723) CVE-2026-111766 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 24.0h | ✅ |
| [#722](https://github.com/opensourceways/datastat-manage-website/issues/722) CVE-2026-111758 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 24.0h | ✅ |

## 周琪

> 平台账号：GitHub [@sky-winter](https://github.com/sky-winter) · AtomGit [@sky-winter](https://atomgit.com/sky-winter)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler 个人中心（opensourceways/oneid-workbench-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#186](https://github.com/opensourceways/oneid-workbench-website/issues/186) CVE-2026-114133 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 4.9d | 🔴 超24h未响应 |
| [#187](https://github.com/opensourceways/oneid-workbench-website/issues/187) CVE-2026-114130 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 4.9d | 🔴 超24h未响应 |
| [#188](https://github.com/opensourceways/oneid-workbench-website/issues/188) CVE-2026-114132 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 4.9d | 🔴 超24h未响应 |
| [#189](https://github.com/opensourceways/oneid-workbench-website/issues/189) [任务]: gauss 个人中心开发 | 未关闭 | 2026-10-27 | —（未响应） | — | — | 开启 33.6h | 🔴 超24h未响应 |

### 基础设施服务 账号服务（opensourceways/oneid-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#325](https://github.com/opensourceways/oneid-website/issues/325) CVE-2026-111759 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#327](https://github.com/opensourceways/oneid-website/issues/327) CVE-2026-111758 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#326](https://github.com/opensourceways/oneid-website/issues/326) CVE-2026-111766 | 未关闭 | 2026-10-21 | —（未响应） | — | — | 开启 6.9d | 🔴 超24h未响应；超120h未闭环 |
| [#329](https://github.com/opensourceways/oneid-website/issues/329) [任务]: release合回main分支 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 11.2h | 🟢 |

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
