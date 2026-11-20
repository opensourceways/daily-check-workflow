# AGENTS.md

GEO 优化专项检查仓库：零依赖 Node 脚本（ESM `.mjs`，Node ≥18）+ GitHub Actions，定时抓取各社区站点（openEuler / openGauss / MindSpore / openUBMC / UnifiedBus / HiFloat）检查 GEO 整改合规性，并向各项目 AtomGit 仓库提 `[GEO *]` issue，报告与看板回写本仓库。

- **不是 web 应用**：无依赖安装、无构建、无 lint、无测试套件；`pnpm-lock.yaml` 下没有任何运行时依赖，改完即跑。
- 仓库根即 Node 项目根；脚本可用 `node scripts/checks/xxx.mjs` 直接执行，或走根 `package.json` 的 `check:* / dashboard / issues-dashboard` 短命令。

## 改动前先想到的坑

- **有真实外部副作用的命令勿随手跑**：`--submit-issues` 会向外部仓库提 issue；本地无 `ATOMGIT_TOKEN` 时天然只打印，但 CI/带 token 环境是真写回。`--force` 会更新/`/close` 存量 issue。本地验证一律优先 `--dry-run` + `--site=<小站如 HiFloat> --max=N`。
- **本地跑检查会覆盖当日产物**：测试前备份 `scripts/stats/*.json` 与 `scheduled-reports/<dim>/<今日>/`。
- **`scripts/stats/*.json` 不进 git**（gitignore），是"给机器"的易失输出，勿手改、勿当历史数据源。
- **`dashboard/*.md` 全部是脚本生成物**，只许改生成器（`dashboard/generate-dashboard.mjs`、`collect-*-dashboard.mjs`）后重跑，勿手编产物。
- **cron 只在默认分支 `main` 生效**：分支合入 main 前用 `workflow_dispatch` 验证（workflow 的 `site` / `dry_run` / `force_check` 输入）。
- **issue 标题前缀 `[GEO <Dim>]` 是查重键**：改前缀会使旧 issue 查重失效、造成重复提单；新维度的前缀与 cron 时间不得与既有维度撞车（对照表见 skill）。
- 新项目的接入只改 `projects.config.json`，不改脚本；判定口径/期望值调整只改 `scripts/config/check-rules.json`，不改脚本内硬编码。
- **UnifiedBus-docs 特殊约定（2026-11-17 确认）**：暂只有测试环境 `unifiedbus.test.osinfra.cn`，sitemap/llms.txt 内部链接指向正式域 `www.unifiedbus.com` 不算问题；该 docs 路径**没有独立 robots.txt**（上线后挂 unifiedbus.com 子路径，sitemap/llms.txt 地址由主域 robots.txt 统一维护）→ 配置里勿给它设 `robotsUrl`（配置了必 404，会被 robots 维度判硬性错误、每日 Action 误提单）。
  - **已知风险（2026-11-17 晚，决策=暂不动配置/脚本，仅记录）**：测试站 sitemap 的 loc 又指回正式域 www.unifiedbus.com，而正式域尚未上线整改（仍是无 SSR 的 SPA 壳，无 title/meta/JSON-LD）→ TDK/JSON-LD 两维度按 loc 抓到的是未上线的正式域页面，结果无效，且"整站缺失/无合法块"属**硬性错误口径，周一 03:30 UTC 的 tdk-jsonld Action 会误提单**（下次触发 2026-11-23）。测量恢复有效的条件：站方把测试 sitemap loc 改回 test 域，或正式域完成上线。llms.txt 的 Summary 已上线（2026-11-17），该维度剩余硬性项=体积 168,552 字符超 100k，需拆 `/_llms/` 子索引。
- 重成本的全量抓取维度（`check-tdk-jsonld.mjs`）**不要加进 `run-all.mjs`**，按需手动或走 Action。

## 关键入口

- `scripts/checks/`：各维度检查脚本；CLI 为手工解析的 `--site --conc --max --skip --submit-issues --dry-run --force`（无参数库，新参数照此风格）。
- `scripts/lib/`：公共库；提单查重/写回收敛在 `atomgit.mjs` 的 `precheckExistingIssues` + `reconcileIssue`，新维度直接复用，勿复制私有实现。
- `projects.config.json`：项目唯一数据源（`repo` gitcode URL 可解析出 AtomGit owner/repo；`repoInfo` 供 pr-gate 匹配；`linkScan` 仅死链维度用）。
- `.github/workflows/`：定时维度检查 + 看板刷新；多数用 secret `ATOMGIT_TOKEN`，link-check 与开发者看板用 `HSJ_ATOMGIT_TOKEN` / `HSJ_GITHUB_TOKEN`。
- `scripts/pr-gate-checks/`：PR 门禁，**自包含**（连同 `projects.config.json` 复制到被检项目根运行），靠被检项目 `package.json` 的 `name` 匹配 `repoInfo.packageName`，未登记则跳过放行。
- `measures/<NN-dim>/`：每措施五件套文档（规范/进展/各项目差异点/工具与脚本/检测方式）；新增维度需同步"工具与脚本.md"（参数表 + mermaid 流程）与"检测方式.md"。
- `index.md` / `projects.md` / `scripts/README.md`：总览、项目表、脚本详表（README 与各脚本实际行为为准的口径见 skill）。

## 新增/重构检查维度

先加载项目 skill `daily-check-dim-flow`（`.agents/skills/`，含模板实现索引、双报告/brief-full 约定、AtomGit API 路径不对称、报告 markdown 排版禁忌、接入 checklist 等全部细则），照 TDK 重复维度（`check-tdk-jsonld.mjs`）复制。
