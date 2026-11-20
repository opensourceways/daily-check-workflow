# daily-check-workflow

> GEO（Generative Engine Optimization，面向生成式 AI 的内容可发现性与可解析性优化）专项自动化检查仓库：定时抓取各社区站点，检查 GEO 整改合规性，自动向各项目 AtomGit 仓库提 `[GEO *]` issue，并将报告与看板回写本仓库。

## 它做什么

1. **定时检查**：GitHub Actions 按 cron 定时（或手动 dispatch）运行各维度检查脚本，抓取各社区站点的线上页面。
2. **自动提单**：发现硬性问题时，向对应项目的 AtomGit 仓库提交 `[GEO <Dim>]` 前缀的 issue；已有未关闭同前缀 issue 时跳过，避免重复提单（`--force` 可强制复检并就地更新 / `/close` 存量 issue）。
3. **报告与看板**：每日扫描报告按维度归档到 `scheduled-reports/<维度>/<日期>/`，整体看板、GEO Issue 看板、开发者 Issue 闭环看板由脚本自动生成到 `dashboard/` 并 commit 回本仓库。

## 覆盖项目

openEuler 官网/文档 · openGauss 官网/文档 · MindSpore 官网/文档 · openUBMC 官网/文档 · UnifiedBus · HiFloat

项目唯一数据源是 [`projects.config.json`](projects.config.json)，新增项目只改配置、不改脚本。详见[项目清单](projects.md)。

## 检查维度

| 维度 | 脚本 | 提单前缀 | 定时（UTC） |
|------|------|----------|-------------|
| robots.txt 规范 | `check-robots.mjs` | `[GEO Robots.txt]` | 每日 04:00 |
| llms.txt 规范 | `check-llms-txt.mjs` | `[GEO llms.txt]` | 每日 05:00 |
| Sitemap 属性规范 | `sitemap-spec-check.mjs` | `[GEO Sitemap]` | 每日 04:30 |
| TDK 重复 | `check-tdk-jsonld.mjs --dims=tdk` | `[GEO TDK Duplicate]` | 每周一 03:30 |
| JSON-LD 规范 | `check-tdk-jsonld.mjs --dims=jsonld` | `[GEO JSON-LD]` | 每周一 03:30 |
| HTML 语义化 | `semantic-spec-check.mjs` | `[GEO HTML Semantic]` | 每周三 05:30 |
| 失效链接（死链） | `check-links.mjs` | `[GEO Link Check]` | 每周一 06:30 |

另有轻量统计维度（a 标签语义、标签结构语义化、图片 alt 等，不自动提单）与 PR 门禁检查（见下文）。

各维度的判定口径与期望值统一在 `scripts/config/check-rules.json` 维护；每个整改措施有五件套文档（规范 / 进展 / 各项目差异点 / 工具与脚本 / 检测方式），见 [`measures/`](measures/) 与[总览](index.md)。

## 快速开始

**零依赖**：Node ≥ 18（ESM `.mjs`），无任何运行时依赖，无需 `npm install`，clone 即用。

```bash
# 一键检查全部轻量措施（结果写入 scripts/stats/*.json）
node scripts/checks/run-all.mjs

# 检查单个项目单个措施
node scripts/checks/check-sitemap.mjs --site=openEuler-portal

# 或使用 package.json 短命令
pnpm run check:robots
pnpm run check:llms
pnpm run check:tdk-jsonld

# 生成/更新整体看板
node dashboard/generate-dashboard.mjs
```

### 带 issue 写回的维度（谨慎运行）

`--submit-issues` 会向外部 AtomGit 仓库真实提 issue。本地无 `ATOMGIT_TOKEN` 时只打印不写回，但 CI / 带 token 环境是真提单。本地验证一律优先：

```bash
# dry-run：只扫描与打印 issue 正文，不写报告文件、不提 issue
node scripts/checks/check-llms-txt.mjs --dry-run

# 小范围试跑：单站点 + 限制数量
node scripts/checks/check-tdk-jsonld.mjs --site=HiFloat --max=5
```

通用 CLI 参数（手工解析，无参数库）：`--site=<id>`、`--conc=<并发>`、`--max=<N>`、`--skip=<列表>`、`--submit-issues`、`--dry-run`、`--force`。

## 目录结构

```
├── .github/workflows/    # 定时维度检查 + 看板刷新（cron 只在 main 分支生效）
├── dashboard/            # 脚本生成的看板（整体 / GEO Issue / 开发者 Issue 闭环），勿手编
├── measures/<NN-dim>/    # 每项整改措施五件套文档（规范/进展/差异点/工具与脚本/检测方式）
├── scheduled-reports/    # 定时 Action 产物：<维度>/<YYYY-MM-DD>/（简短+完全双报告）
├── manual-review/        # 人工核查记录与复盘
├── archive/              # 历史归档
├── scripts/
│   ├── checks/           # 各维度检查脚本
│   ├── lib/              # 公共库（http/crawl/sitemap/robots/html/jsonld/atomgit/report…）
│   ├── config/           # 检查规则 check-rules.json、SLA、服务与责任人映射
│   ├── pr-gate-checks/   # PR 门禁静态检查（自包含，复制到被检项目根运行）
│   └── stats/            # 机器用的易失 JSON 输出（gitignore，勿手改）
├── projects.config.json  # 项目唯一数据源（新增项目只改这里）
├── index.md              # GEO 专项总览（措施矩阵、看板入口）
└── scripts/README.md     # 脚本详表与维度接入流程
```

## 看板

| 看板 | 说明 | 刷新 |
|------|------|------|
| [整体看板](dashboard/dashboard.md) | 各维度检查结果汇聚 | `node dashboard/generate-dashboard.mjs` |
| [GEO Issue 看板](dashboard/issues-dashboard.md) | 各项目未关闭 `[GEO *]` issue 状态与关联 PR | Action 每日 |
| [开发者 Issue 闭环看板](dashboard/developer-issues-dashboard.md) | 按责任人聚合的闭环率 / 首次响应 / 闭环时长 SLA | Action 每 12 小时 |

## PR 门禁检查（pr-gate-checks/）

与定时检查互补的**本地静态文件**检查：门禁步骤将 `scripts/pr-gate-checks/` 连同 `projects.config.json` 复制到待检项目根运行，按项目 `package.json` 的 `name` 匹配配置中的 `repoInfo.packageName`，未登记则跳过放行。只读本地文件、不联网、不提单，硬性错误退出码 1 拦截 PR。已接入：robots.txt 字段合规、新增页面 TDK / JSON-LD 配置。

## 新增 / 重构检查维度

例行「检查 → 生成简短/完全双报告 → 查重提 issue 到各项目 AtomGit 仓库」的流程以 **TDK 重复维度**（`scripts/checks/check-tdk-jsonld.mjs`）为模板实现：查重与写回收敛在 `scripts/lib/atomgit.mjs` 的 `precheckExistingIssues` + `reconcileIssue`，新维度直接复用。注意事项：

- issue 标题前缀 `[GEO <Dim>]` 是查重键，改前缀会使旧 issue 查重失效；新维度前缀与 cron 时间不得与既有维度撞车。
- 分支合入 main 前用 `workflow_dispatch`（`site` / `dry_run` / `force_check` 输入）验证。
- 需同步更新 `measures/<NN-dim>/` 的「工具与脚本」「检测方式」文档。

细则见 [`scripts/README.md`](scripts/README.md) 与[总览](index.md)。

## 环境变量 / Secrets

| Secret | 用途 |
|--------|------|
| `ATOMGIT_TOKEN` | 各维度检查提单 + GEO Issue 看板 |
| `HSJ_ATOMGIT_TOKEN` / `HSJ_GITHUB_TOKEN` | 死链检查（clone 镜像仓）与开发者 Issue 闭环看板 |
