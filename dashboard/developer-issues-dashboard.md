# 开发者 Issue 闭环看板

> 本文件由 `scripts/checks/collect-developer-issues.mjs` 自动生成（GitHub Action 定时执行，默认每 12 小时），请勿手动编辑。
> 生成时间：2026-10-28T04:26:43.892Z
> 统计窗口：**2026-10-20**（北京时间当日 00:00）起创建的 issue；窗口起点与 SLA 阈值在 `scripts/config/issue-sla.json` 配置。
> 仓库范围：`scripts/config/services.json`（源自 项目信息.xlsx）；github.com 仓库走 GitHub API，gitcode / gitee / atomgit 仓库按 AtomGit 同名镜像采集。
> 与 [GEO Issue 看板](issues-dashboard.md) 相互独立：本看板面向**全部 issue** 的开发者闭环考核，而非 `[GEO *]` 整改 issue。

## 责任人总览

| 责任人 | 仓库 | 窗口内 issue | 未关闭 | 已闭环 | 闭环率（≥80%） | 响应≤24h² | 平均响应 | 超时未响应 | 闭环≤120h³ | 平均闭环 | 超时未闭环 | 综合 |
|------|------|------|------|------|------|------|------|------|------|------|------|------|
| 黄世俊<br>gh:未配置 · ag:未配置 | 2 | 20 | 8 | 12 | 60%（12/20）❌ | — | — | 7 | 92%（11/12） | 45.8h | 5 | ❌ |
| 黄泽麟<br>gh:未配置 · ag:未配置 | 6（⚠️4 失败） | 21 | 11 | 10 | 48%（10/21）❌ | — | — | 7 | 100%（10/10） | 29.8h | 1 | ❌ |
| 张峻玮<br>gh:未配置 · ag:未配置 | 5（⚠️2 失败） | 16 | 5 | 11 | 69%（11/16）❌ | 50%（1/2） | 18.0h | 3 | 91%（10/11） | 43.5h | 0 | ❌ |
| 龚壮邦<br>gh:未配置 · ag:未配置 | 1（⚠️1 失败） | 0 | 0 | 0 | — | — | — | 0 | — | — | 0 | ⚠️ |
| 贾森森<br>gh:未配置 · ag:未配置 | 7（⚠️7 失败） | 0 | 0 | 0 | — | — | — | 0 | — | — | 0 | ⚠️ |
| 李胜波<br>gh:未配置 · ag:未配置 | 2（⚠️2 失败） | 0 | 0 | 0 | — | — | — | 0 | — | — | 0 | ⚠️ |
| 刘勇<br>gh:未配置 · ag:未配置 | 7（⚠️6 失败） | 0 | 0 | 0 | — | — | — | 0 | — | — | 0 | ⚠️ |
| 吴培聪<br>gh:未配置 · ag:未配置 | 3（⚠️2 失败） | 0 | 0 | 0 | — | — | — | 0 | — | — | 0 | ⚠️ |
| 周琪<br>gh:未配置 · ag:未配置 | 3（⚠️3 失败） | 0 | 0 | 0 | — | — | — | 0 | — | — | 0 | ⚠️ |

> ² 响应达标率 = 首次响应 ≤ 24h 的 issue / 已响应 issue（分母不含评论拉取失败者；目标 100%）。
> ³ 闭环达标率 = 闭环时长 ≤ 120h 的 issue / 已闭环 issue（目标 100%）。
> 综合标记：❌ 闭环率 < 80% ｜ 🟡 闭环率达标但存在超时未响应 / 超时未闭环 ｜ ✅ 全部达标 ｜ ⚠️ 名下仓库全部采集失败 ｜ — 窗口内无 issue。

## 黄世俊

> 平台账号：GitHub 未配置 · AtomGit 未配置（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler 官网（openeuler/openEuler-portal · atomgit）

> 首次响应口径：任意非创建者首条评论（责任人平台 ID 未配置，降级口径）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#354](https://atomgit.com/openeuler/openEuler-portal/issues/354) CVE-2026-111758 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 6.4d | 🔴 超24h未响应；超120h未闭环 |
| [#355](https://atomgit.com/openeuler/openEuler-portal/issues/355) CVE-2026-111759 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 6.4d | 🔴 超24h未响应；超120h未闭环 |
| [#356](https://atomgit.com/openeuler/openEuler-portal/issues/356) CVE-2026-111766 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 6.4d | 🔴 超24h未响应；超120h未闭环 |
| [#358](https://atomgit.com/openeuler/openEuler-portal/issues/358) 友好社区样式修改 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 5.7d | 🔴 超24h未响应；超120h未闭环 |
| [#361](https://atomgit.com/openeuler/openEuler-portal/issues/361) 【需求】兼容性列表新增"AI 南北向"支持页面 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 5.1d | 🔴 超24h未响应；超120h未闭环 |
| [#362](https://atomgit.com/openeuler/openEuler-portal/issues/362) [GEO llms.txt] openEuler 官网（openEuler-portal）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 3.8d | 🔴 超24h未响应 |
| [#363](https://atomgit.com/openeuler/openEuler-portal/issues/363) [GEO JSON-LD] openEuler 官网（openEuler-portal）：JSON-LD 规范问题（2 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 3.8d | 🔴 超24h未响应 |
| [#367](https://atomgit.com/openeuler/openEuler-portal/issues/367) 新增自动同步seo/geo相关规范、skill的脚本，移除旧逻辑 | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 0.6h | 🟢 |
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

> 首次响应口径：任意非创建者首条评论（责任人平台 ID 未配置，降级口径）

_统计窗口内无 issue。_

## 黄泽麟

> 平台账号：GitHub 未配置 · AtomGit 未配置（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）
> ⚠️ 4 个仓库本次采集失败，其 issue 未计入指标：openEuler 文档插件（GitHub 403：匿名限额耗尽或私有仓无权限）、MindSpore 官网（AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN））、MindSpore 文档（AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN））、openMind 官网（AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像））

### openEuler 文档（openeuler/docs-website · atomgit）

> 首次响应口径：任意非创建者首条评论（责任人平台 ID 未配置，降级口径）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#76](https://atomgit.com/openeuler/docs-website/issues/76) [GEO Sitemap] openEuler 文档（openEuler-docs）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 4.8d | 🔴 超24h未响应 |
| [#77](https://atomgit.com/openeuler/docs-website/issues/77) [GEO llms.txt] openEuler 文档（openEuler-docs）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 3.8d | 🔴 超24h未响应 |
| [#78](https://atomgit.com/openeuler/docs-website/issues/78) [GEO JSON-LD] openEuler 文档（openEuler-docs）：JSON-LD 规范问题（2 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 3.8d | 🔴 超24h未响应 |
| [#80](https://atomgit.com/openeuler/docs-website/issues/80) sitemap/HTML meta data 从文档frontmatter取值 | 未关闭 | 2026-10-27 | —（未响应） | — | — | 开启 19.3h | 🟢 |
| [#81](https://atomgit.com/openeuler/docs-website/issues/81) 优化nginx | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 1.0h | 🟢 |
| [#69](https://atomgit.com/openeuler/docs-website/issues/69) 视频显示异常 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 1.7h | ✅ |
| [#70](https://atomgit.com/openeuler/docs-website/issues/70) robotstxt Sitemap策略冒号后加空格 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 0.9h | ✅ |
| [#71](https://atomgit.com/openeuler/docs-website/issues/71) 手册内搜索无法搜到内容 | 已闭环 | 2026-10-20 | —（未响应） | — | — | 43.1h | ✅ |
| [#72](https://atomgit.com/openeuler/docs-website/issues/72) md有yaml元数据会导致锚点生成异常 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 0.3h | ✅ |
| [#73](https://atomgit.com/openeuler/docs-website/issues/73) llms.txt改为追加各版本文档链接分区 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 45.1h | ✅ |
| [#74](https://atomgit.com/openeuler/docs-website/issues/74) AppFooter仅在首页渲染 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 4.7d | ✅ |
| [#75](https://atomgit.com/openeuler/docs-website/issues/75) 修改nginx配置、优化构建 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 1.2h | ✅ |
| [#79](https://atomgit.com/openeuler/docs-website/issues/79) 未登录情况下会请求未读消息接口 | 已闭环 | 2026-10-26 | —（未响应） | — | — | 42.1h | ✅ |

### openEuler 文档插件（opensourceways/vscode-doc-tools · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

### openGauss 文档（opengauss/docs-website · atomgit）

> 首次响应口径：任意非创建者首条评论（责任人平台 ID 未配置，降级口径）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#33](https://atomgit.com/opengauss/docs-website/issues/33) [任务]: @opendesign-plus/utils升级到0.0.1-rc.9 | 未关闭 | 2026-10-22 | —（未响应） | — | — | 开启 5.9d | 🔴 超24h未响应；超120h未闭环 |
| [#35](https://atomgit.com/opengauss/docs-website/issues/35) [GEO Sitemap] openGauss 文档（openGauss-docs）：sitemap 属性规范问题（错误 0 类 / 告警 1 类） | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 4.8d | 🔴 超24h未响应 |
| [#36](https://atomgit.com/opengauss/docs-website/issues/36) [GEO llms.txt] openGauss 文档（openGauss-docs）：llms.txt 规范问题（1 项） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 3.8d | 🔴 超24h未响应 |
| [#37](https://atomgit.com/opengauss/docs-website/issues/37) [GEO JSON-LD] openGauss 文档（openGauss-docs）：JSON-LD 规范问题（1 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 3.8d | 🔴 超24h未响应 |
| [#38](https://atomgit.com/opengauss/docs-website/issues/38) [任务]:导航修改个人中心跳转链接 | 未关闭 | 2026-10-27 | —（未响应） | — | — | 开启 19.0h | 🟢 |
| [#39](https://atomgit.com/opengauss/docs-website/issues/39) [任务]: 优化nginx | 未关闭 | 2026-10-28 | —（未响应） | — | — | 开启 0.8h | 🟢 |
| [#32](https://atomgit.com/opengauss/docs-website/issues/32) [任务]:  llms.txt改为追加各版本文档链接分区 | 已闭环 | 2026-10-21 | —（未响应） | — | — | 2.0d | ✅ |
| [#34](https://atomgit.com/opengauss/docs-website/issues/34) [任务]: 修改nginx配置、优化构建 | 已闭环 | 2026-10-23 | —（未响应） | — | — | 1.1h | ✅ |

### MindSpore 官网（mindspore/mindspore-portal · atomgit）

> ⚠️ 采集失败：AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN）

### MindSpore 文档（mindspore/website-docs · atomgit）

> ⚠️ 采集失败：AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN）

### openMind 官网（modelers/merlin-website · atomgit）

> ⚠️ 采集失败：AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像）

## 张峻玮

> 平台账号：GitHub 未配置 · AtomGit 未配置（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）
> ⚠️ 2 个仓库本次采集失败，其 issue 未计入指标：openEuler 消息中心（GitHub 403：匿名限额耗尽或私有仓无权限）、基础设施服务 对内贡献看板（GitHub 403：匿名限额耗尽或私有仓无权限）

### openEuler 消息中心（opensourceways/message-manager-website · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

### openEuler 贡献看板（openeuler/opendesign-datastat · atomgit）

> 首次响应口径：任意非创建者首条评论（责任人平台 ID 未配置，降级口径）

_统计窗口内无 issue。_

### openGauss 官网（opengauss/website · atomgit）

> 首次响应口径：任意非创建者首条评论（责任人平台 ID 未配置，降级口径）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#446](https://atomgit.com/opengauss/website/issues/446) [任务]: 隐私声明文案修正 | 未关闭 | 2026-10-23 | —（未响应） | — | — | 开启 4.8d | 🔴 超24h未响应 |
| [#447](https://atomgit.com/opengauss/website/issues/447) [任务]: test seo check | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 4.0d | 🔴 超24h未响应 |
| [#448](https://atomgit.com/opengauss/website/issues/448) [GEO JSON-LD] openGauss 官网（openGauss-portal）：JSON-LD 规范问题（1 类） | 未关闭 | 2026-10-24 | —（未响应） | — | — | 开启 3.8d | 🔴 超24h未响应 |
| [#450](https://atomgit.com/opengauss/website/issues/450) [任务]:【社区组织】页面【秘书处】，英文站label没有hover显示全部内容 | 未关闭 | 2026-10-26 | 2026-10-26 | @jwzmiao | 2.4h | 开启 2.0d | 🟢 |
| [#452](https://atomgit.com/opengauss/website/issues/452) [任务]:修改个人中心链接跳转 | 未关闭 | 2026-10-27 | —（未响应） | — | — | 开启 19.5h | 🟢 |
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

> 首次响应口径：任意非创建者首条评论（责任人平台 ID 未配置，降级口径）

_统计窗口内无 issue。_

### 基础设施服务 对内贡献看板（opensourceways/datastat-manage-website · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

## 龚壮邦

> 平台账号：GitHub 未配置 · AtomGit 未配置（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）
> ⚠️ 1 个仓库本次采集失败，其 issue 未计入指标：openEuler 软件包贡献（GitHub 403：匿名限额耗尽或私有仓无权限）

### openEuler 软件包贡献（opensourceways/software-package-website · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

## 贾森森

> 平台账号：GitHub 未配置 · AtomGit 未配置（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）
> ⚠️ 7 个仓库本次采集失败，其 issue 未计入指标：openEuler lfs大文件服务（GitHub 403：匿名限额耗尽或私有仓无权限）、openEuler 会议转文字服务（GitHub 403：匿名限额耗尽或私有仓无权限）、openMind 官网（AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像））、openMind 文档（AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像））、openMind 博客（AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像））、基础设施服务 通用会议（GitHub 403：匿名限额耗尽或私有仓无权限）、基础设施服务 华为账号（GitHub 403：匿名限额耗尽或私有仓无权限）

### openEuler lfs大文件服务（opensourceways/lfs-website · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

### openEuler 会议转文字服务（opensourceways/easywhisperx-website · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

### openMind 官网（modelers/merlin-website · atomgit）

> ⚠️ 采集失败：AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像）

### openMind 文档（modelers/merlin-docs · atomgit）

> ⚠️ 采集失败：AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像）

### openMind 博客（modelers/merlin-blogs · atomgit）

> ⚠️ 采集失败：AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像）

### 基础设施服务 通用会议（opensourceways/meeting-website · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

### 基础设施服务 华为账号（opensourceways/hwid-website · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

## 李胜波

> 平台账号：GitHub 未配置 · AtomGit 未配置（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）
> ⚠️ 2 个仓库本次采集失败，其 issue 未计入指标：openMind 官网（AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像））、基础设施服务 vLLM看板（GitHub 403：匿名限额耗尽或私有仓无权限）

### openMind 官网（modelers/merlin-website · atomgit）

> ⚠️ 采集失败：AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像）

### 基础设施服务 vLLM看板（opensourceways/vLLM-dashboard-website · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

## 刘勇

> 平台账号：GitHub 未配置 · AtomGit 未配置（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）
> ⚠️ 6 个仓库本次采集失败，其 issue 未计入指标：openEuler 兼容性测评（GitHub 403：匿名限额耗尽或私有仓无权限）、openUBMC 官网（AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN））、openUBMC 文档（AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN））、UnifiedBus 官网（AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN））、UnifiedBus 资源（AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN））、基础设施服务 CLA服务（GitHub 403：匿名限额耗尽或私有仓无权限）

### openEuler Quick Issue（openeuler/quick-issue · atomgit）

> 首次响应口径：任意非创建者首条评论（责任人平台 ID 未配置，降级口径）

_统计窗口内无 issue。_

### openEuler 兼容性测评（opensourceways/certification-website · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

### openUBMC 官网（openUBMC/website · atomgit）

> ⚠️ 采集失败：AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN）

### openUBMC 文档（openUBMC/docs-website · atomgit）

> ⚠️ 采集失败：AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN）

### UnifiedBus 官网（unifiedbus/UnifiedBus-portal · atomgit）

> ⚠️ 采集失败：AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN）

### UnifiedBus 资源（unifiedbus/resources · atomgit）

> ⚠️ 采集失败：AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN）

### 基础设施服务 CLA服务（opensourceways/app-cla-webui · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

## 吴培聪

> 平台账号：GitHub 未配置 · AtomGit 未配置（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）
> ⚠️ 2 个仓库本次采集失败，其 issue 未计入指标：HiFloat 官网（AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN））、HiFloat 文档（AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN））

### HiFloat 官网（hifloat/hifloat-portal · atomgit）

> ⚠️ 采集失败：AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN）

### HiFloat 资源（hifloat/resources · atomgit）

> 首次响应口径：任意非创建者首条评论（责任人平台 ID 未配置，降级口径）

_统计窗口内无 issue。_

### HiFloat 文档（hifloat/docs-website · atomgit）

> ⚠️ 采集失败：AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN）

## 周琪

> 平台账号：GitHub 未配置 · AtomGit 未配置（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）
> ⚠️ 3 个仓库本次采集失败，其 issue 未计入指标：openEuler 个人中心（GitHub 403：匿名限额耗尽或私有仓无权限）、基础设施服务 账号服务（GitHub 403：匿名限额耗尽或私有仓无权限）、基础设施服务 论坛（GitHub 403：匿名限额耗尽或私有仓无权限）

### openEuler 个人中心（opensourceways/oneid-workbench-website · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

### 基础设施服务 账号服务（opensourceways/oneid-website · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

### 基础设施服务 论坛（opensourceways/discourse-fully · github）

> ⚠️ 采集失败：GitHub 403：匿名限额耗尽或私有仓无权限

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
