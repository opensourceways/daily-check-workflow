# GEO Workflows

GEO（Generative Engine Optimization）/ SEO 自动化 workflow 集合，运行于 GitHub Actions（runner: `portal-x86`），对 AtomGit portal 仓库做可发现性巡检与 `[GEO]` issue 分析。

## 概述

三个独立 workflow，共享 `packages/core/` 公共库与 `packages/checks-shared/` 跨 workflow 检查项：

| Workflow | 用途 | 入口 | 触发 |
|---|---|---|---|
| **Daily File Check** | 逐项目 clone→构建→可插拔检查项（TDK / Schema / robots / sitemap / SSR / ...），按维度提 issue | `packages/geo-daily-check/src/check-single.js` | 每日 02:00 UTC / 手动 |
| **GEO Issue Analyze** | 扫描 `[GEO]` issue，程序化检查 + LLM 语义分析，评论或创建分析 issue | `packages/geo-issue-analyze/src/scan-issues.js` | 每日 03:00 UTC / 手动 |
| **Link Check** | 逐项目 clone→扫描源码 URL→HTTP HEAD 检测→按项目提 issue | `packages/link-checker/src/check-links.js` | 每周一 04:00 UTC / 手动 |

## 快速开始

```bash
pnpm install
export ATOMGIT_TOKEN=xxx

# Daily File Check：仅检查不提 issue
node packages/geo-daily-check/src/check-single.js --dryRun
node packages/geo-daily-check/src/check-single.js --project=openEuler --dryRun

# GEO Issue Analyze：扫描 + 分析某项目的 [GEO] issues
node packages/geo-issue-analyze/src/scan-issues.js --project=openEuler
node packages/geo-issue-analyze/src/process-single.js --dryRun --input=issue.json

# Link Check：扫描源码失效链接
node packages/link-checker/src/check-links.js --dryRun --all-communities
node packages/link-checker/src/check-links.js --community=openEuler --dryRun
```

> Windows 本地完整 checkout 大型 portal 仓库可能因 260 字符路径限制失败，属系统限制；Linux runner 不受影响。

## 仓库结构（pnpm workspace monorepo）

```text
packages/
  core/                          @geo-workflow/core 公共库
    src/
      index.js                   统一出口（re-export utils/atomgit-api/html-fetch）
      atomgit-api.js             AtomGit REST 客户端（retry + issue/PR API）
      html-fetch.js              HTTP 抓取 / parseHtml / fetchBrowser
      utils.js                   parseArgs / log / readInput / shouldIgnore /
                                 pickRandom / normalizePathname / matchGlob /
                                 iterateFiles / HTML_IGNORE

  checks-shared/                 @geo-workflow/checks-shared 跨 workflow 检查项
    src/
      index.js
      sitemap-inclusion.js       getSitemapUrls，被两个 workflow 共享

  geo-daily-check/               @geo-workflow/geo-daily-check
    src/
      check-single.js            入口（配置驱动逐项目）
      utils.js                   检查项常量（CHECK_DIMENSIONS / DIMENSION_DESCRIPTIONS）
                                 + re-export core 通用函数
      history-export.js          检查历史导出（daily-check-history.xlsx）
      checks/*.js                各可插拔检查项模块

  geo-issue-analyze/             @geo-workflow/geo-issue-analyze
    src/
      scan-issues.js             扫描各项目 [GEO] issues
      process-single.js         程序化检查 + opencode 分析 + 结果路由
      url-checks.js              URL 程序化检查（sitemap / llms 覆盖）

  link-checker/                  @geo-workflow/link-checker
    src/
      check-links.js             入口（配置驱动逐社区）
      link-scanner.js            源码 URL 提取 + HTTP 检测（HEAD→GET 回退）

.github/workflows/
  daily-file-check.yml           巡检 workflow
  geo-issue-analyze.yml          分析 workflow
  link-check.yml                 失效链接检测 workflow

.opencode/skills/
  render-change-analyzer/        tdk-schema-semantic 检查项用
  link-anchor-analyzer/         link-anchor 检查项用

docs/
  geo-issue-analyze.md           GEO Issue Analyze 设计文档
  daily-file-check.md            Daily File Check 设计文档

projects-config.yaml             待检项目配置（多 workflow 共享）
pnpm-workspace.yaml              声明 packages/* 为 workspace 包
```

## 配置

### repo secrets / variables

| 名称 | 类型 | 用途 |
|---|---|---|
| `ATOMGIT_TOKEN` | repo secret | AtomGit API 认证（提 issue / 评论 / 克隆私有仓库） |
| `AI_MODEL` | repo variable | opencode 模型 id，默认 `alibaba-cn/glm-5` |

### projects-config.yaml

项目配置字段（Daily File Check 与 GEO Issue Analyze 共享）：

| 字段 | 说明 |
|---|---|
| `name` | 项目名称 |
| `owner` / `repo` / `repo_url` / `branch` | 仓库定位 |
| `project_type` | `portal`（官网）/ `docs-website`（文档站）/ `docs`（纯文档存档，跳过构建） |
| `framework` / `build_cmd` / `build_dir` | 构建框架、脚本、产物目录 |
| `home` / `home_pages` | 首页地址（支持多镜像）/ 各语言首页（TDK 比对基线） |
| `accessible_routes` | 页面路由白名单（如 `/zh/**/*`） |
| `ignore_routes` | 跳过检查的路由正则 |
| `seo_config_dir` | TDK/JSON-LD 配置目录（仅用于 issue 正文提示） |
| `skip_check` | 跳过的检查项数组；`['all']` 跳过整个项目 |
| `enable_link_anchor_check` | 启用 link-anchor 检查（默认 false） |
| `enable_tdk_schema_semantic` | 启用 TDK/Schema 语义检查，含 render-change 分析（默认 false） |
| `semantic_analysis_commits_count` | 语义检查分析最近 N 个 commits（默认 5） |

检查项分两类：

- **低成本（默认启用）**：`robots-txt` / `sitemap-access` / `sitemap-tdk` / `sitemap-schema` / `sitemap-priority` / `url-access` / `llms-txt` / `sitemap-coverage` / `ssr-rendering`，通过 `skip_check` 跳过。
- **高成本（默认不启用）**：`link-anchor-check`（需 `enable_link_anchor_check: true`）、`tdk-schema-semantic`（需 `enable_tdk_schema_semantic: true`），同样可用 `skip_check` 跳过。

## 新增一个 Daily File Check 检查项

1. 写检查模块 `packages/geo-daily-check/src/checks/xxx.js`，函数签名遵循约定：
   ```js
   import { log } from '../utils.js';
   export async function checkXxx(project, { skip } /* + 按需参数 */) {
     if (skip.includes('xxx')) return { findings: [] };
     const findings = [];
     // ... 检查逻辑 ...
     findings.push({ url, check: 'xxx', message: '问题描述' });
     return { findings };
   }
   ```
   约定：`finding.check` 字段必须等于维度名；`skip` 由 `runProject` 透传，统一走 `skip_check`。

2. 在 `packages/geo-daily-check/src/utils.js` 的 `CHECK_DIMENSIONS` 加 `'xxx'`，并在 `DIMENSION_DESCRIPTIONS` 加中文描述（issue 正文"维度说明"会引用）。

3. 在 `check-single.js` 顶部 `import { checkXxx } from './checks/xxx.js';`，在 `runProject()` 按时机调用（构建前 / 线上并行 / 等待构建后三段，参考现有 robots / sitemap / coverage 位置），把 `findings` push 进 `onlineFindings` 或 `allFindings`。

4. 配置开关（二选一，写进 `projects-config.yaml`）：
   - 低成本：顶部"skip_check 取值"注释块加 `# xxx: <说明>`，项目想跳过写 `skip_check: ['xxx']`。
   - 高成本：加 `enable_xxx: true` 注释，并在 `runProject()` 用 `if (project.enable_xxx && !skip.includes('xxx'))` 守卫（参考 `enable_tdk_schema_semantic`）。

5. （可选）跨 workflow 共享：放到 `packages/checks-shared/src/`，并在其 `src/index.js` re-export。

## 验证 monorepo 改造

重构为纯结构性变更，验证三条链路即可：

1. **workspace 链接**：`pnpm install` 后 `node -e "import('@geo-workflow/core').then(m=>console.log(Object.keys(m)))"` 应打印 core 导出。
2. **入口 dryRun 冒烟**（不调 API、不提 issue），三个 workflow 各跑一次：
   ```bash
   node packages/geo-issue-analyze/src/process-single.js --dryRun --input=issue.json
   node packages/geo-daily-check/src/check-single.js --dryRun --project=openEuler
   node packages/link-checker/src/check-links.js --dryRun --all-communities
   ```
   关注：无 `Cannot find module '@geo-workflow/...'`；日志 `配置文件:` 指向仓库根 `projects-config.yaml`（验证 `REPO_ROOT` 路径计算）；re-export 的 `log/shouldIgnore/iterateFiles` 等函数调用正常。
3. **构建产物回归**：去掉 `--dryRun` 且不设 `ATOMGIT_TOKEN` 跑真实项目，确认 `buildDir`、`sitemap-coverage`、`tdk-schema-semantic` 仍能定位产物目录。

## 本地运行参数

| 参数 | 适用 | 说明 |
|---|---|---|
| `--dryRun` | 全部 | 仅检查、打印汇总，不提 issue（daily-check 仍会 clone/构建） |
| `--project=<name>` | daily-check / issue-analyze | 只跑配置里 `name` 匹配的单个项目 |
| `--config=<path>` | daily-check | 自定义配置文件路径，默认仓库根 `projects-config.yaml` |
| `--input=<path>` | issue-analyze process-single | 从文件读单条 issue JSON（也可 stdin） |
| `--community=<name>` / `--all-communities` | link-checker | 指定社区 / 全社区 |

## 详细文档

- [docs/geo-issue-analyze.md](docs/geo-issue-analyze.md) — GEO Issue Analyze 流程、脚本接口、配置字段
- [docs/daily-file-check.md](docs/daily-file-check.md) — Daily File Check 流程、检查项、issue 上报规则
- [AGENTS.md](AGENTS.md) — agent 导航用的仓库总览

## 包管理器

本仓库使用 **pnpm**（workspace）。安装依赖 `pnpm install`；添加依赖 `pnpm add <package-name>`；在指定包内加依赖 `pnpm --filter @geo-workflow/core add axios`。
