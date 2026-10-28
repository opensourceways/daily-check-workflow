# 失效链接检查报告

- 检查时间：2026-10-28T12:22:17.637Z
- 检查范围：projects.config.json 中配置了 linkScan 的 4 个项目（共 10 个，未配置的记 ➖ 不扫描）
- 运行模式：提 issue（--submit-issues，dry-run）
- 探测参数：并发 5、超时 15s、抖动 0.5s（scripts/config/check-rules.json 的 links 段）
- 数据源与判定：clone 各项目源码仓（repo 的 AtomGit 同名镜像 + linkScan.branch 分支，浅克隆 depth=1）→ 扫描 .js/.ts/.jsx/.tsx/.vue/.html/.css/.md/.txt 文件提取 URL（变量拼接链接、图片、API 目录跳过）→ 唯一 URL 去重后 HEAD/GET 探测（<400 为有效，跟随重定向，网络错误计失效）
- 特殊约定：仅探测唯一 URL、引用位置映射回报告；clone 失败只记报告不提单（检查侧配置问题）；未配置 linkScan 的项目不扫描、不查重、不提单
- 机器可读结果：scripts/stats/link-stats.json

## 总览

| 项目 | 数据源 | 扫描文件 | 链接（引用/URL） | 失效（URL/引用） | 结论 |
| --- | --- | --- | --- | --- | --- |
| openEuler 官网（openEuler-portal） | `https://gitcode.com/openeuler/openEuler-portal`（master） | 2744 | 6892 / 3653 | 644 / 1151 | ❌（dry-run 未提交） |
| openEuler 文档（openEuler-docs） | 未配置 linkScan | - | - | - | ➖ |
| openGauss 官网（openGauss-portal） | `https://gitcode.com/opengauss/website`（v2） | 1347 | 4763 / 3444 | 100 / 348 | ❌（dry-run 未提交） |
| openGauss 文档（openGauss-docs） | 未配置 linkScan | - | - | - | ➖ |
| MindSpore 官网（MindSpore-portal） | `https://gitcode.com/mindspore/mindspore-portal`（master） | 3128 | 9591 / 3498 | 963 / 2630 | ❌（dry-run 未提交） |
| MindSpore 文档（MindSpore-docs） | 未配置 linkScan | - | - | - | ➖ |
| openUBMC 官网（openUBMC-portal） | `https://gitcode.com/openUBMC/website`（main） | 703 | 1147 / 827 | 198 / 270 | ❌（dry-run 未提交） |
| openUBMC 文档（openUBMC-docs） | 未配置 linkScan | - | - | - | ➖ |
| UnifiedBus（UnifiedBus） | 未配置 linkScan | - | - | - | ➖ |
| HiFloat（HiFloat） | 未配置 linkScan | - | - | - | ➖ |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 `<项目ID>-full.md`）

- openEuler 官网（openEuler-portal）：`scheduled-reports/links/2026-10-28/openEuler-portal-full.md`，（dry-run 未提交）
- openGauss 官网（openGauss-portal）：`scheduled-reports/links/2026-10-28/openGauss-portal-full.md`，（dry-run 未提交）
- MindSpore 官网（MindSpore-portal）：`scheduled-reports/links/2026-10-28/MindSpore-portal-full.md`，（dry-run 未提交）
- openUBMC 官网（openUBMC-portal）：`scheduled-reports/links/2026-10-28/openUBMC-portal-full.md`，（dry-run 未提交）

## 结论与建议

- 存在失效链接：openEuler-portal（644 个）、openGauss-portal（100 个）、MindSpore-portal（963 个）、openUBMC-portal（198 个），需按完全版报告修复。

> 注：本报告由 scripts/checks/check-links.mjs 自动生成（同批次数据见 scripts/stats/link-stats.json）。网络错误可能来自临时故障或目标站点对探测的拦截，修复建议仍需人工复核，见 measures/11-broken-link/检测方式.md。
