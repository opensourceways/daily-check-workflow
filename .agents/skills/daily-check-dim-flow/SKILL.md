---
name: daily-check-dim-flow
description: 为 daily-check-workflow 仓库的某个维度（tdk/sitemap/robots.txt/json-ld/llms.txt 等）接入"例行检查 + 提 issue 到各项目 AtomGit 仓库"的 GitHub Actions 流程。当要求新接入/重构某维度的自动检查、定时提 issue、生成简短/完全双报告、防重复提单时使用。TDK 重复维度是模板实现，照搬到其他维度。
---

# daily-check-workflow：维度检查 + 提 issue 流程接入

仓库：`C:\Users\17231\assets\code\daily-check-workflow`（GitHub: `opensourceways/daily-check-workflow`）。
**当前新结构在 `archive` 分支**（main 是旧的一套，重构未开始）。所有路径以仓库根为基准。

## 仓库结构（新）

- `projects.config.json`：项目清单。关键字段：`id`、`name`、`repo`（gitcode URL，可解析出 AtomGit owner/repo）、`sitemapUrl`、`newVersions`（docs 站版本过滤）。
- `workflow/lib/`：`config.mjs`（loadProjects/filterProjects）、`http.mjs`（fetchText）、`sitemap.mjs`（parseSitemap，含 index 子 sitemap）、`html.mjs`（extractTitle/extractMeta，引号感知）、`report.mjs`（writeStats/now）、`atomgit.mjs`（API 客户端 + parseOwnerRepo）。
- `workflow/scripts/check-<dim>-*.mjs`：维度脚本；`workflow/package.json` 加 `check:<x>` 短命令。
- 产物三件套：`scheduled-reports/<dim>/<YYYY-MM-DD>/`（给人看的 md 报告，按日期分目录、目录内文件名不带维度/日期前缀，进 git）、`workflow/stats/<dim>-stats.json`（给机器，不进 git 也勿依赖同日多次跑）、控制台日志。
- `measures/<NN-dim>/`：规范五件套（规范/检测方式/工具与脚本/各项目差异点/进展），每接入一个维度要同步更新"检测方式.md"和"工具与脚本.md"。

## 模板参考实现（TDK 重复维度）

- `workflow/scripts/check-tdk-duplicate.mjs` —— 完整流程模板
- `workflow/lib/atomgit.mjs` —— AtomGit API 封装（全局 fetch，零依赖）
- `.github/workflows/tdk-duplicate-check.yml`（archive 分支）—— Action 编排模板
- `measures/05-tdk/检测方式.md`、`工具与脚本.md` —— 文档写法参照

## 检查脚本约定

1. CLI 参数（`process.argv` 手工解析，无依赖）：`--site=ID`、`--conc=10`、`--max=N`（试跑截断）、`--skip=a,b`（默认跳过清单，传空覆盖）、`--submit-issues`、`--dry-run`。
2. 数据源 = 对项目 `sitemapUrl` 全量展开（index 递归；有 `newVersions` 的 docs 站只取匹配版本子 sitemap，约定见 sitemap-spec-check）后**逐页实时 fetch HTML**，不发仓库构建产物。
3. 抓取：超时 20s + 2 次重试 + UA `geo-workflow-checker/1.0`；`mapLimit` 并发（默认 10）。失败页单列清单，不计入判重。
4. 写文件：**全部跑完一次性 `writeFile`**（勿流式/勿 partial——已试过，复杂且无法中途查看，已回退）。报告 UTF-8；markdown 中若引用 HTML 片段（如 `<meta name="description">`）一律用反引号包裹，否则被渲染吞掉。
5. 产物按日期归入 `YYYY-MM-DD/` 子目录（`now()` 的 ISO 前 10 位），目录内文件名不再带日期（汇总 `report.md`、明细 `detail.md`（可选）、每项目 `<ID>-brief.md`/`<ID>-full.md`）；同一天重跑覆盖目录内文件。旧报告（平铺命名、已进 git 的）保留原位，已提 issue 的链接不受影响。

## 提 issue 流程（--submit-issues 模式）

按项目循环，每项目：

1. **先查重再扫描**（核心防重复逻辑）：`findIssuesByTitlePrefix({owner, repo, prefix: '[GEO <Dim>]', state: 'open'})`。
   - 有未关闭 issue（**无论是否关联 PR**）→ 跳过该项目整个"扫描+提单"，results 记 `skipped:true`。
   - 查询失败：有 token（生产）→ 也跳过扫描（宁漏勿重）；无 token（本地）→ 只扫描不提单。
2. 扫描后有发现 → 为该项目写两个文件到 `scheduled-reports/<dim>/<YYYY-MM-DD>/`：
   - `<ID>-brief.md`（简短版：总览 + 每类 top3 组、每组最多 5 URL，超出注明"见完全版"）
   - `<ID>-full.md`（完全版：全部明细）
3. 提 1 个 issue 到该项目 AtomGit 仓库（owner/repo 由 `parseOwnerRepo(project.repo)` 从 gitcode URL 解析）：
   - 标题 = `[GEO <Dim>] <项目名>（<ID>）：<一句话>`；前缀必须稳定（查重靠 `title.startsWith(prefix)`）。
   - 正文 = 简短版内容 + 指向完全版的链接 + 固定"处理说明"文案（修复后关 issue；issue 未关闭期间不会重复扫描/重复提单；误报请评论说明后关闭）。
   - 链接 = `https://github.com/<GITHUB_REPOSITORY>/blob/<GITHUB_REF_NAME>/scheduled-reports/<dim>/<YYYY-MM-DD>/<file>-full.md`（分支跟随运行时 `GITHUB_REF_NAME`，本地缺省 `archive`）。
   - `--dry-run` 或无 token/无 owner:repo → 只打印正文不提交、不写 brief/full。
4. **去重规则**：`--submit-issues` 模式下当日汇总报告 `report-<date>.md` 只写"头部+总览表+指向各项目 full 文件的清单"，明细不重复输出；手动模式（不带 --submit-issues）保持含全部明细的单一汇总。

## GitHub Action 模板（复制 tdk-duplicate-check.yml 改名字）

- `on`: `schedule` cron（**cron 只在默认分支 main 生效**；archive 上只有 workflow_dispatch 可用，main 重构合并前属预期）+ `workflow_dispatch` inputs：`site`（可空）、`dry_run`（boolean）。
- `permissions: contents: write`（要把 brief/full/汇总报告 commit 回本仓库，issue 链接才能解析）；`concurrency: group: <dim>-check`。
- Job：`runs-on: ubuntu-latest`（纯网络抓取够用；只有需要构建被检项目的检查才用 self-hosted `portal-x86`）；setup-node 20；
  步骤 = 跑脚本（env `ATOMGIT_TOKEN: ${{ secrets.ATOMGIT_TOKEN }}`）→ `git add scheduled-reports/<dim>` → 有变更才 commit + `git pull --rebase` + push（identity 用 github-actions[bot]）。

## AtomGit API 要点（v5，base https://api.atomgit.com）

- 读（列 issues/pulls）公共仓可匿名；私有/受限仓无 token 返回 403（403=存在，404=不存在）。写必须 `Authorization: Bearer $ATOMGIT_TOKEN`。
- **路径不对称**：列表是 repo-scoped `GET /api/v5/repos/{owner}/{repo}/issues?state=open&per_page=100`；**创建是 owner-scoped** `POST /api/v5/repos/{owner}/issues`，`repo` 放 body；更新 `PATCH /repos/{owner}/{repo}/issues/{number}`（body 字段就叫 `body`）。评论 `POST /repos/{owner}/{repo}/issues/{number}/comments`。
- 建单返回 `number`，issue URL = `html_url` 兜底 `https://atomgit.com/{owner}/{repo}/issues/{number}`。

## 新维度接入 checklist

1. 读 `measures/<dim>/规范.md`、`检测方式.md`，确认判定标准与数据源（sitemap 全量 or 首页 or robots.txt 等）。
2. 写/改 `workflow/scripts/check-<dim>.mjs`：复用 lib；加 `--submit-issues`/`--dry-run`；遵循上面"提 issue 流程"（含查重跳过、双报告、汇总去重）。
3. 定该维度 issue 前缀 `[GEO <Dim>]`（写进代码常量并在文档注明——前缀变更会使旧 issue 查重失效造成重复提单）。
4. `node --check` + 本地小跑验证：`--site=<小站如 HiFloat> --max=50 --submit-issues`（无 token 天然不提单，能看正文与产物文件；**跑前备份 `workflow/stats/*.json`，测试会覆盖当日产物**）。
5. 复制 workflow yml 改名、cron、目录；更新 `workflow/package.json` 短命令与 `measures/<dim>/` 两个文档。
6. 不自动加进 `run-all.mjs`（重成本检查按需手动/Action 跑）。

## 其他注意

- Windows 控制台 GBK 乱码是显示问题，文件本身 UTF-8；核对内容用 Read 工具读文件而不是看 stdout。
- 后台长任务：`Start-Process node ...` 后工具会报 `Unknown: ChildProcess.kill`，进程实际存活，用 `Get-CimInstance Win32_Process` 查 PID。
- **main 重构（未完成）**：目标是把 archive 的 measures/workflow/manual-review/projects.config.json 结构刷到 main，迁移旧 `scripts/geo-daily-check`（robots/sitemap/llms 等检查逻辑并入新 lib）、`geo-issue-analyze`（issue 回复分析，需单独移植，暂无新实现）、旧 3 个 workflow 迁新结构后删除；合入 main 后各维度 cron 才生效。改动前先用 `git ls-tree -r origin/main` 对照旧逻辑，避免丢失已有能力。
