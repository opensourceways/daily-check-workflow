# 开发者 Issue 闭环看板

> 本文件由 `scripts/checks/collect-developer-issues.mjs` 自动生成（GitHub Action 定时执行，默认每 3 小时：北京时间 07 / 10 / 13 / 16 / 19 / 22 点），请勿手动编辑。
> 生成时间：2026-11-07T02:27:18.555Z
> 统计窗口：**2026-11-01**（北京时间当日 00:00）起创建的 issue；窗口起点与 SLA 阈值在 `scripts/config/issue-sla.json` 配置。
> 仓库范围：`scripts/config/services.json`（源自 项目信息.xlsx）；github.com 仓库走 GitHub API，gitcode / gitee / atomgit 仓库按 AtomGit 同名镜像采集。
> 关键词划归：标题/正文命中 `scripts/config/issue-routing.json` 规则的 issue（如 [GEO *] / 【GEO】）计入规则指定的责任人，不再计入原仓库责任人。
> 与 [GEO Issue 看板](issues-dashboard.md) 相互独立：本看板面向**全部 issue** 的开发者闭环考核，而非 `[GEO *]` 整改 issue。

## 责任人总览

| 责任人 | 仓库 | 窗口内 issue | 未关闭 | 已闭环 | 闭环率（≥80%） | 响应≤24h² | 平均响应 | 超时未响应 | 闭环≤120h³ | 平均闭环 | 超时未闭环 | 综合 |
|------|------|------|------|------|------|------|------|------|------|------|------|------|
| 黄世俊<br>[@HuangSJ-TY](https://github.com/HuangSJ-TY) · [@persimmonzzz](https://atomgit.com/persimmonzzz) | 6 | 9 | 4 | 5 | 56%（5/9）❌ | 83%（5/6） | 6.3h | 0 | 100%（5/5） | 19.7h | 1 | ❌ |
| 吴培聪<br>[@piecong](https://github.com/piecong) · [@piecong](https://atomgit.com/piecong) | 3 | 10 | 6 | 4 | 40%（4/10）❌ | 100%（8/8） | 0.0h | 2 | 100%（4/4） | 7.9h | 1 | ❌ |
| 张峻玮<br>[@zjwmiao](https://github.com/zjwmiao) · [@jwzmiao](https://atomgit.com/jwzmiao) | 5（🔄6） | 22 | 16 | 6 | 27%（6/22）❌ | 100%（2/2） | 0.0h | 15 | 100%（6/6） | 24.0h | 0 | ❌ |
| 周琪<br>[@sky-winter](https://github.com/sky-winter) · [@sky-winter](https://atomgit.com/sky-winter) | 6 | 23 | 4 | 19 | 83%（19/23）✅ | 83%（5/6） | 6.3h | 0 | 100%（19/19） | 38.4h | 1 | 🟡 |
| 黄泽麟<br>[@cctvcat](https://github.com/cctvcat) · [@cctvcat](https://atomgit.com/cctvcat) | 6 | 6 | 1 | 5 | 83%（5/6）✅ | 100%（3/3） | 7.6h | 0 | 100%（5/5） | 19.7h | 0 | ✅ |
| 刘勇<br>[@liuy2000139](https://github.com/liuy2000139) · [@liuyong2000139](https://atomgit.com/liuyong2000139) | 7 | 8 | 0 | 8 | 100%（8/8）✅ | 100%（7/7） | 1.6h | 0 | 100%（8/8） | 16.7h | 0 | ✅ |
| 龚壮邦<br>[@gzbang](https://github.com/gzbang) · [@gzbang](https://atomgit.com/gzbang) | 0 | 0 | 0 | 0 | — | — | — | 0 | — | — | 0 | — |
| 贾森森<br>[@wuming230](https://github.com/wuming230) · [@jiasensen](https://atomgit.com/jiasensen) | 0 | 0 | 0 | 0 | — | — | — | 0 | — | — | 0 | — |

> ² 响应达标率 = 首次响应 ≤ 24h 的 issue / 已响应 issue（分母不含评论拉取失败者；目标 100%）。
> ³ 闭环达标率 = 闭环时长 ≤ 120h 的 issue / 已闭环 issue（目标 100%）。
> 仓库列（🔄n）= 另有 n 个非名下仓库的 issue 按关键词划归计入本行指标（规则：scripts/config/issue-routing.json）。
> 综合标记：❌ 闭环率 < 80% ｜ 🟡 闭环率达标但存在超时未响应 / 超时未闭环 ｜ ✅ 全部达标 ｜ ⚠️ 名下仓库全部采集失败 ｜ — 窗口内无 issue。

## 黄世俊

> 平台账号：GitHub [@HuangSJ-TY](https://github.com/HuangSJ-TY) · AtomGit [@persimmonzzz](https://atomgit.com/persimmonzzz)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler 官网（openeuler/openEuler-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 2 条 issue 已按关键词划归他人（🔄→ 责任人），不计入本仓责任人指标

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#374](https://atomgit.com/openeuler/openEuler-portal/issues/374) CVE-2026-118764 | 未关闭 | 2026-11-01 | 2026-11-02 | @persimmonzzz | 35.8h | 开启 6.3d | 🔴 响应超24h；超120h未闭环 |
| [#378](https://atomgit.com/openeuler/openEuler-portal/issues/378) [GEO TDK Duplicate] openEuler 官网（openEuler-portal）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |
| [#379](https://atomgit.com/openeuler/openEuler-portal/issues/379) [GEO Link Check] openEuler 官网（openEuler-portal）：发现 638 个失效链接 🔄→张峻玮 | 未关闭 | 2026-11-03 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |
| [#380](https://atomgit.com/openeuler/openEuler-portal/issues/380) openEuler官网内容更新—成员单位（捐赠人）变更 | 未关闭 | 2026-11-03 | 2026-11-03 | @persimmonzzz | 2.1h | 开启 3.7d | 🟢 |
| [#382](https://atomgit.com/openeuler/openEuler-portal/issues/382) 会议活动日程以及嘉宾开发 | 未关闭 | 2026-11-06 | —（未响应） | — | — | 开启 13.7h | 🟢 |
| [#375](https://atomgit.com/openeuler/openEuler-portal/issues/375) 十月json提交 | 已闭环 | 2026-11-02 | —（未响应） | — | — | 1.1h | ✅ |
| [#376](https://atomgit.com/openeuler/openEuler-portal/issues/376) @opendesign-plus/components和@opensig/opendesign升级 | 已闭环 | 2026-11-02 | 2026-11-02 | @sky-winter | 0.0h | 31.0h | ✅ |
| [#377](https://atomgit.com/openeuler/openEuler-portal/issues/377) 下线官网首页【分享你的openEuler开发实践经验， 赢专属好礼!】banner | 已闭环 | 2026-11-02 | 2026-11-02 | @persimmonzzz | 0.0h | 8.1h | ✅ |
| [#381](https://atomgit.com/openeuler/openEuler-portal/issues/381) 开源组件升级 | 已闭环 | 2026-11-05 | 2026-11-05 | @sky-winter | 0.0h | 30.3h | ✅ |

### openEuler 软件中心（openeuler/easy-software · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#146](https://atomgit.com/openeuler/easy-software/issues/146) 开源软件升级 | 已闭环 | 2026-11-05 | —（未响应） | — | — | 28.1h | ✅ |

### openEuler 软件包贡献（opensourceways/software-package-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### openEuler lfs大文件服务（opensourceways/lfs-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### openEuler 会议转文字服务（opensourceways/easywhisperx-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### 基础设施服务 通用会议（opensourceways/meeting-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#185](https://github.com/opensourceways/meeting-website/issues/185) [任务]: 主题固定light，不随外部变化 | 未关闭 | 2026-11-06 | 2026-11-06 | @HuangSJ-TY | 0.0h | 开启 17.0h | 🟢 |

## 吴培聪

> 平台账号：GitHub [@piecong](https://github.com/piecong) · AtomGit [@piecong](https://atomgit.com/piecong)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### HiFloat 官网（hifloat/hifloat-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 1 条 issue 已按关键词划归他人（🔄→ 责任人），不计入本仓责任人指标

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#55](https://atomgit.com/hifloat/hifloat-portal/issues/55) 【测试载体】页脚版权行补充组织名（zh/en 双语同步） | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 5.0d | 🔴 超24h未响应；超120h未闭环 |
| [#56](https://atomgit.com/hifloat/hifloat-portal/issues/56) feat: [任务]:卡片样式修改 | 未关闭 | 2026-11-02 | 2026-11-02 | @piecong | 0.1h | 开启 5.0d | 🟢 |
| [#57](https://atomgit.com/hifloat/hifloat-portal/issues/57) feat: [任务]:下拉列表样式修改 | 未关闭 | 2026-11-02 | 2026-11-02 | @piecong | 0.2h | 开启 4.9d | 🟢 |
| [#58](https://atomgit.com/hifloat/hifloat-portal/issues/58) feat: [任务]:下拉弹框暗色模式颜色不正确 | 未关闭 | 2026-11-02 | 2026-11-02 | @piecong | 0.0h | 开启 4.8d | 🟢 |
| [#59](https://atomgit.com/hifloat/hifloat-portal/issues/59) [GEO TDK Duplicate] HiFloat（HiFloat）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |
| [#61](https://atomgit.com/hifloat/hifloat-portal/issues/61) 页脚相关链接分组优化（标题国际化 + 新增开源仓库入口）——组织 fork 交接链路验证轮 | 未关闭 | 2026-11-03 | —（未响应） | — | — | 开启 3.6d | 🔴 超24h未响应 |
| [#60](https://atomgit.com/hifloat/hifloat-portal/issues/60) feat: [任务]:调整标题顺序 | 已闭环 | 2026-11-03 | 2026-11-03 | @piecong | 0.0h | 2.2h | ✅ |

### HiFloat 资源（hifloat/resources · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#9](https://atomgit.com/hifloat/resources/issues/9) 删除和回退这个提交的修改 | 未关闭 | 2026-11-03 | 2026-11-03 | @piecong | 0.0h | 开启 3.6d | 🟢 |
| [#10](https://atomgit.com/hifloat/resources/issues/10) 解决合并冲突 | 已闭环 | 2026-11-04 | 2026-11-04 | @piecong | 0.0h | 2.2h | ✅ |
| [#11](https://atomgit.com/hifloat/resources/issues/11) 文档格式显示异常修改 | 已闭环 | 2026-11-04 | 2026-11-04 | @piecong | 0.0h | 14.5h | ✅ |

### HiFloat 文档（hifloat/docs-website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#20](https://atomgit.com/hifloat/docs-website/issues/20) [任务]:修改markdown文章内容显示异常 | 已闭环 | 2026-11-02 | 2026-11-02 | @piecong | 0.0h | 12.7h | ✅ |

## 张峻玮

> 平台账号：GitHub [@zjwmiao](https://github.com/zjwmiao) · AtomGit [@jwzmiao](https://atomgit.com/jwzmiao)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler 消息中心（opensourceways/message-manager-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### openEuler 贡献看板（openeuler/opendesign-datastat · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#9](https://atomgit.com/openeuler/opendesign-datastat/issues/9) 修复 vue-i18n cve | 未关闭 | 2026-11-03 | —（未响应） | — | — | 开启 4.0d | 🔴 超24h未响应 |

### openGauss 官网（opengauss/website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 2 条 issue 已按关键词划归他人（🔄→ 责任人），不计入本仓责任人指标

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#462](https://atomgit.com/opengauss/website/issues/462) [GEO TDK Duplicate] openGauss 官网（openGauss-portal）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |
| [#464](https://atomgit.com/opengauss/website/issues/464) [GEO Link Check] openGauss 官网（openGauss-portal）：发现 111 个失效链接 🔄→张峻玮 | 未关闭 | 2026-11-03 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |
| [#461](https://atomgit.com/opengauss/website/issues/461) [任务]: 更新发行版认证列表 | 已闭环 | 2026-11-02 | —（未响应） | — | — | 1.0h | ✅ |
| [#463](https://atomgit.com/opengauss/website/issues/463) [任务]: 替换栅格系统变量 | 已闭环 | 2026-11-02 | 2026-11-02 | @jwzmiao | 0.0h | 3.0d | ✅ |
| [#465](https://atomgit.com/opengauss/website/issues/465) [任务]:新闻博客页面padv端保持卡片里的图片和封面是上下布局 | 已闭环 | 2026-11-03 | —（未响应） | — | — | 23.1h | ✅ |
| [#466](https://atomgit.com/opengauss/website/issues/466) [任务]: 更新首页文案 | 已闭环 | 2026-11-03 | 2026-11-03 | @jwzmiao | 0.0h | 23.6h | ✅ |
| [#467](https://atomgit.com/opengauss/website/issues/467) [任务]:限制对社区规则制度相关的文件修改 | 已闭环 | 2026-11-04 | —（未响应） | — | — | 21.6h | ✅ |
| [#468](https://atomgit.com/opengauss/website/issues/468) [任务]: 贡献攻略页面升级 | 已闭环 | 2026-11-05 | —（未响应） | — | — | 2.9h | ✅ |

### openGauss 博客（opengauss/blog · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### 基础设施服务 对内贡献看板（opensourceways/datastat-manage-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#738](https://github.com/opensourceways/datastat-manage-website/issues/738) CI执行时间说明 P90 与实际取数口径（平均）不符 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |
| [#740](https://github.com/opensourceways/datastat-manage-website/issues/740) 蓝区自助诊断页支持 CodeHub（codehub.devcloud.*）链接 | 未关闭 | 2026-11-03 | —（未响应） | — | — | 开启 4.0d | 🔴 超24h未响应 |
| [#741](https://github.com/opensourceways/datastat-manage-website/issues/741) 脱敏蓝区诊断页 CodeHub 示例与测试用例（内网地址不入公开仓） | 未关闭 | 2026-11-03 | —（未响应） | — | — | 开启 4.0d | 🔴 超24h未响应 |
| [#745](https://github.com/opensourceways/datastat-manage-website/issues/745) 问数历史记录：无法查看完整答案 + 记录可能因 U+0000 报错 | 未关闭 | 2026-11-06 | —（未响应） | — | — | 开启 22.8h | 🟢 |

### openEuler 官网（openeuler/openEuler-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 非本责任人名下仓库，仅展示关键词划归 issue（规则：scripts/config/issue-routing.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#378](https://atomgit.com/openeuler/openEuler-portal/issues/378) [GEO TDK Duplicate] openEuler 官网（openEuler-portal）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |
| [#379](https://atomgit.com/openeuler/openEuler-portal/issues/379) [GEO Link Check] openEuler 官网（openEuler-portal）：发现 638 个失效链接 🔄→张峻玮 | 未关闭 | 2026-11-03 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |

### MindSpore 官网（mindspore/mindspore-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 非本责任人名下仓库，仅展示关键词划归 issue（规则：scripts/config/issue-routing.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#315](https://atomgit.com/mindspore/mindspore-portal/issues/315) [GEO TDK Duplicate] MindSpore 官网（MindSpore-portal）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |
| [#317](https://atomgit.com/mindspore/mindspore-portal/issues/317) [GEO Link Check] MindSpore 官网（MindSpore-portal）：发现 962 个失效链接 🔄→张峻玮 | 未关闭 | 2026-11-03 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |

### openUBMC 官网（openUBMC/website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 非本责任人名下仓库，仅展示关键词划归 issue（规则：scripts/config/issue-routing.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#329](https://atomgit.com/openUBMC/website/issues/329) [GEO TDK Duplicate] openUBMC 官网（openUBMC-portal）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |
| [#330](https://atomgit.com/openUBMC/website/issues/330) [GEO Link Check] openUBMC 官网（openUBMC-portal）：发现 116 个失效链接 🔄→张峻玮 | 未关闭 | 2026-11-03 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |

### openUBMC 文档（openUBMC/docs-website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 非本责任人名下仓库，仅展示关键词划归 issue（规则：scripts/config/issue-routing.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#28](https://atomgit.com/openUBMC/docs-website/issues/28) [GEO TDK Duplicate] openUBMC 文档（openUBMC-docs）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |

### UnifiedBus 官网（unifiedbus/UnifiedBus-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 非本责任人名下仓库，仅展示关键词划归 issue（规则：scripts/config/issue-routing.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#122](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/122) [GEO TDK Duplicate] UnifiedBus（UnifiedBus）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |

### HiFloat 官网（hifloat/hifloat-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 非本责任人名下仓库，仅展示关键词划归 issue（规则：scripts/config/issue-routing.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#59](https://atomgit.com/hifloat/hifloat-portal/issues/59) [GEO TDK Duplicate] HiFloat（HiFloat）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |

## 周琪

> 平台账号：GitHub [@sky-winter](https://github.com/sky-winter) · AtomGit [@sky-winter](https://atomgit.com/sky-winter)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler 官网（openeuler/openEuler-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 2 条 issue 已按关键词划归他人（🔄→ 责任人），不计入本仓责任人指标

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#374](https://atomgit.com/openeuler/openEuler-portal/issues/374) CVE-2026-118764 | 未关闭 | 2026-11-01 | 2026-11-02 | @persimmonzzz | 35.8h | 开启 6.3d | 🔴 响应超24h；超120h未闭环 |
| [#378](https://atomgit.com/openeuler/openEuler-portal/issues/378) [GEO TDK Duplicate] openEuler 官网（openEuler-portal）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |
| [#379](https://atomgit.com/openeuler/openEuler-portal/issues/379) [GEO Link Check] openEuler 官网（openEuler-portal）：发现 638 个失效链接 🔄→张峻玮 | 未关闭 | 2026-11-03 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |
| [#380](https://atomgit.com/openeuler/openEuler-portal/issues/380) openEuler官网内容更新—成员单位（捐赠人）变更 | 未关闭 | 2026-11-03 | 2026-11-03 | @persimmonzzz | 2.1h | 开启 3.7d | 🟢 |
| [#382](https://atomgit.com/openeuler/openEuler-portal/issues/382) 会议活动日程以及嘉宾开发 | 未关闭 | 2026-11-06 | —（未响应） | — | — | 开启 13.7h | 🟢 |
| [#375](https://atomgit.com/openeuler/openEuler-portal/issues/375) 十月json提交 | 已闭环 | 2026-11-02 | —（未响应） | — | — | 1.1h | ✅ |
| [#376](https://atomgit.com/openeuler/openEuler-portal/issues/376) @opendesign-plus/components和@opensig/opendesign升级 | 已闭环 | 2026-11-02 | 2026-11-02 | @sky-winter | 0.0h | 31.0h | ✅ |
| [#377](https://atomgit.com/openeuler/openEuler-portal/issues/377) 下线官网首页【分享你的openEuler开发实践经验， 赢专属好礼!】banner | 已闭环 | 2026-11-02 | 2026-11-02 | @persimmonzzz | 0.0h | 8.1h | ✅ |
| [#381](https://atomgit.com/openeuler/openEuler-portal/issues/381) 开源组件升级 | 已闭环 | 2026-11-05 | 2026-11-05 | @sky-winter | 0.0h | 30.3h | ✅ |

### openEuler 个人中心（opensourceways/oneid-workbench-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#197](https://github.com/opensourceways/oneid-workbench-website/issues/197) [任务]: 组件升级以及样式修改 | 已闭环 | 2026-11-03 | —（未响应） | — | — | 4.0h | ✅ |
| [#198](https://github.com/opensourceways/oneid-workbench-website/issues/198) [任务]: 将release分支合回main分支 | 已闭环 | 2026-11-03 | —（未响应） | — | — | 0.2h | ✅ |

### 基础设施服务 通用会议（opensourceways/meeting-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#185](https://github.com/opensourceways/meeting-website/issues/185) [任务]: 主题固定light，不随外部变化 | 未关闭 | 2026-11-06 | 2026-11-06 | @HuangSJ-TY | 0.0h | 开启 17.0h | 🟢 |

### 基础设施服务 华为账号（opensourceways/hwid-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### 基础设施服务 账号服务（opensourceways/oneid-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#339](https://github.com/opensourceways/oneid-website/issues/339) CVE-2026-118775 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 2.5d | ✅ |
| [#338](https://github.com/opensourceways/oneid-website/issues/338) CVE-2026-118777 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 2.5d | ✅ |
| [#340](https://github.com/opensourceways/oneid-website/issues/340) CVE-2026-118780 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 2.5d | ✅ |
| [#341](https://github.com/opensourceways/oneid-website/issues/341) CVE-2026-118781 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 2.5d | ✅ |
| [#343](https://github.com/opensourceways/oneid-website/issues/343) CVE-2026-118782 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 2.5d | ✅ |
| [#342](https://github.com/opensourceways/oneid-website/issues/342) CVE-2026-118779 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 2.5d | ✅ |
| [#344](https://github.com/opensourceways/oneid-website/issues/344) CVE-2026-119187 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 2.5d | ✅ |
| [#346](https://github.com/opensourceways/oneid-website/issues/346) CVE-2026-118778 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 2.5d | ✅ |
| [#345](https://github.com/opensourceways/oneid-website/issues/345) CVE-2026-119190 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 2.5d | ✅ |
| [#348](https://github.com/opensourceways/oneid-website/issues/348) CVE-2026-119188 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 2.5d | ✅ |
| [#347](https://github.com/opensourceways/oneid-website/issues/347) CVE-2026-119186 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 2.5d | ✅ |
| [#350](https://github.com/opensourceways/oneid-website/issues/350) [任务]: 隐私声明弹窗样式修改 | 已闭环 | 2026-11-03 | —（未响应） | — | — | 4.3h | ✅ |
| [#351](https://github.com/opensourceways/oneid-website/issues/351) [任务]: release分支合回main分支 | 已闭环 | 2026-11-03 | —（未响应） | — | — | 0.2h | ✅ |

### 基础设施服务 论坛（opensourceways/discourse-fully · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

## 黄泽麟

> 平台账号：GitHub [@cctvcat](https://github.com/cctvcat) · AtomGit [@cctvcat](https://atomgit.com/cctvcat)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler 文档（openeuler/docs-website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### openEuler 文档插件（opensourceways/vscode-doc-tools · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#186](https://github.com/opensourceways/vscode-doc-tools/issues/186) [任务]: release: 0.1.26 | 未关闭 | 2026-11-04 | 2026-11-04 | @cctvcat | 0.0h | 开启 3.0d | 🟢 |
| [#183](https://github.com/opensourceways/vscode-doc-tools/issues/183) CVE-2026-118773 | 已闭环 | 2026-10-31 | —（未响应） | — | — | 48.0h | ✅ |
| [#184](https://github.com/opensourceways/vscode-doc-tools/issues/184) [任务]: 优化对L+数字形式的锚点判断 | 已闭环 | 2026-11-02 | 2026-11-03 | @cctvcat | 22.7h | 22.7h | ✅ |

### openGauss 文档（opengauss/docs-website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### MindSpore 官网（mindspore/mindspore-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 2 条 issue 已按关键词划归他人（🔄→ 责任人），不计入本仓责任人指标

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#315](https://atomgit.com/mindspore/mindspore-portal/issues/315) [GEO TDK Duplicate] MindSpore 官网（MindSpore-portal）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |
| [#317](https://atomgit.com/mindspore/mindspore-portal/issues/317) [GEO Link Check] MindSpore 官网（MindSpore-portal）：发现 962 个失效链接 🔄→张峻玮 | 未关闭 | 2026-11-03 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |
| [#316](https://atomgit.com/mindspore/mindspore-portal/issues/316) [任务]: 优化新闻博客相关代码 | 已闭环 | 2026-11-02 | —（未响应） | — | — | 0.4h | ✅ |
| [#318](https://atomgit.com/mindspore/mindspore-portal/issues/318) [任务]: 优化首页zone英文版本的的内容 | 已闭环 | 2026-11-04 | 2026-11-04 | @cctvcat | 0.2h | 5.9h | ✅ |
| [#319](https://atomgit.com/mindspore/mindspore-portal/issues/319) [任务]:限制对社区规则制度相关的文件修改 | 已闭环 | 2026-11-04 | —（未响应） | — | — | 21.6h | ✅ |

### MindSpore 文档（mindspore/website-docs · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### 基础设施服务 vLLM看板（opensourceways/vLLM-dashboard-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

## 刘勇

> 平台账号：GitHub [@liuy2000139](https://github.com/liuy2000139) · AtomGit [@liuyong2000139](https://atomgit.com/liuyong2000139)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

### openEuler Quick Issue（openeuler/quick-issue · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### openEuler 兼容性测评（opensourceways/certification-website · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### openUBMC 官网（openUBMC/website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 2 条 issue 已按关键词划归他人（🔄→ 责任人），不计入本仓责任人指标

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#329](https://atomgit.com/openUBMC/website/issues/329) [GEO TDK Duplicate] openUBMC 官网（openUBMC-portal）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |
| [#330](https://atomgit.com/openUBMC/website/issues/330) [GEO Link Check] openUBMC 官网（openUBMC-portal）：发现 116 个失效链接 🔄→张峻玮 | 未关闭 | 2026-11-03 | —（未响应） | — | — | 开启 4.4d | 🔴 超24h未响应 |
| [#331](https://atomgit.com/openUBMC/website/issues/331) [任务]: 新增2026年度openUBMC社区贡献之星评选公告 | 已闭环 | 2026-11-03 | 2026-11-03 | @liuyong2000139 | 0.7h | 6.1h | ✅ |
| [#332](https://atomgit.com/openUBMC/website/issues/332) [任务]:贡献之星banner上线 | 已闭环 | 2026-11-03 | 2026-11-03 | @liuyong2000139 | 2.8h | 6.6h | ✅ |
| [#333](https://atomgit.com/openUBMC/website/issues/333) [任务]: 限制对社区规则制度相关的文件修改 | 已闭环 | 2026-11-03 | —（未响应） | — | — | 0.0h | ✅ |
| [#334](https://atomgit.com/openUBMC/website/issues/334) [任务]: 10月文档更新banner&新闻 | 已闭环 | 2026-11-04 | 2026-11-04 | @liuyong2000139 | 0.7h | 23.6h | ✅ |

### openUBMC 文档（openUBMC/docs-website · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 1 条 issue 已按关键词划归他人（🔄→ 责任人），不计入本仓责任人指标

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#28](https://atomgit.com/openUBMC/docs-website/issues/28) [GEO TDK Duplicate] openUBMC 文档（openUBMC-docs）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |

### UnifiedBus 官网（unifiedbus/UnifiedBus-portal · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json） ｜ 🔄 1 条 issue 已按关键词划归他人（🔄→ 责任人），不计入本仓责任人指标

| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |
|------|------|----------|----------|--------|----------|----------------|-----|
| [#122](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/122) [GEO TDK Duplicate] UnifiedBus（UnifiedBus）：TDK title/description/keywords 存在重复或缺失 🔄→张峻玮 | 未关闭 | 2026-11-02 | —（未响应） | — | — | 开启 4.6d | 🔴 超24h未响应 |
| [#123](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/123) [需求]: 限制对社区规则制度相关的文件修改 | 已闭环 | 2026-11-03 | 2026-11-03 | @liuyong2000139 | 0.1h | 0.6h | ✅ |
| [#124](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/124) CVE-2026-119200 | 已闭环 | 2026-11-05 | 2026-11-05 | @liuyong2000139 | 6.1h | 2.0d | ✅ |
| [#125](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/125) [任务]: openeuler summit 2026 banner | 已闭环 | 2026-11-05 | 2026-11-05 | @liuyong2000139 | 0.6h | 27.2h | ✅ |
| [#126](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/126) [任务]: 增加文档站的sitemap地址、llmstxt引用 | 已闭环 | 2026-11-05 | 2026-11-05 | @liuyong2000139 | 0.2h | 21.6h | ✅ |

### UnifiedBus 资源（unifiedbus/resources · atomgit）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

### 基础设施服务 CLA服务（opensourceways/app-cla-webui · github）

> 首次响应口径：责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）

_统计窗口内无 issue。_

## 龚壮邦

> 平台账号：GitHub [@gzbang](https://github.com/gzbang) · AtomGit [@gzbang](https://atomgit.com/gzbang)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

## 贾森森

> 平台账号：GitHub [@wuming230](https://github.com/wuming230) · AtomGit [@jiasensen](https://atomgit.com/jiasensen)（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）

## 状态与口径说明

- **闭环率**：已闭环 / 窗口内 issue 总数，目标 ≥ 80%；**首次响应**：机器人账号排除后，责任人平台 ID 已配置时仅统计责任人账号的首条回复（其自建 issue 上的本人操作评论如 /accept 也计为响应），未配置时降级为任意非创建者首条评论；**闭环时长**：创建 → 闭环（AtomGit 的 finished_at / GitHub 的 closed_at）。
- **超时未响应**：未关闭、无响应、龄期 > 24h；**超时未闭环**：未关闭、龄期 > 120h。评论拉取失败的 issue 响应指标按「未知」处理（详情表 ⚠️），不计入超时。
- 多责任人服务（如 openMind 官网）计入每位责任人的指标，详情表在各自分区重复展示；PR 不计入。
- **关键词划归**：标题/正文命中 `scripts/config/issue-routing.json` 规则的 issue 计入规则指定的责任人（如 [GEO *] / 【GEO】 GEO 整改 issue），不再计入原仓库责任人；首次响应按规则责任人的平台账号归因，详情表以 🔄 标注划归去向。
- 采集失败常见原因：GitHub 私有仓（需 repo secret `HSJ_GITHUB_TOKEN`——HSJ 账号且有 opensourceways 组织读权限的 PAT）；AtomGit 私有仓（需 repo secret `HSJ_ATOMGIT_TOKEN`）；AtomGit 404 = github / gitee 源仓库无同名镜像。
- 单仓库 issue 超过 1000 条时截断并在服务分区标注（现量级不会触及）。

## 相关入口

- [服务清单](../scripts/config/services.json)（服务名 / 责任人 / 仓库）· [责任人平台 ID 映射](../scripts/config/developers.json) · [SLA 配置](../scripts/config/issue-sla.json) · [关键词划归规则](../scripts/config/issue-routing.json)
- [采集脚本](../scripts/checks/collect-developer-issues.mjs) · [定时 workflow](../.github/workflows/developer-issues-dashboard.yml)
- [GEO Issue 看板](issues-dashboard.md) · [GEO 整改看板](dashboard.md) · [总索引](../index.md)

## 更新方式

```bash
# 全量采集并生成看板（本地无 token 时私有仓会标采集失败）
node scripts/checks/collect-developer-issues.mjs

# 临时覆盖统计窗口起点
node scripts/checks/collect-developer-issues.mjs --since=2026-11-01

# 只采集某责任人名下服务 / 单个服务（调试）
node scripts/checks/collect-developer-issues.mjs --developer=刘勇
node scripts/checks/collect-developer-issues.mjs --service=atomgit/openeuler/openEuler-portal
```
