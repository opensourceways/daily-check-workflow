---
name: daily-check-dim-flow
description: 为 daily-check-workflow 仓库的某个维度（tdk/sitemap/robots.txt/json-ld/llms.txt 等）接入"例行检查 + 提 issue 到各项目 AtomGit 仓库"的 GitHub Actions 流程。当要求新接入/重构某维度的自动检查、定时提 issue、生成报告（简短/完全双报告或单一版）、防重复提单时使用。TDK 重复维度是模板实现，照搬到其他维度。
---

# daily-check-workflow：维度检查 + 提 issue 流程接入

仓库：`C:\Users\17231\assets\code\daily-check-workflow`（GitHub: `opensourceways/daily-check-workflow`）。
**新结构已合入 `main` 并成为工作分支**（原 archive 分支重构方案即现行方案），定时 cron 在 main 上生效。所有路径以仓库根为基准。

## 仓库结构

- `projects.config.json`：项目清单。关键字段：`id`、`name`、`repo`（gitcode URL，可解析出 AtomGit owner/repo）、`domain/domainAlias`、`sitemapUrl/sitemapAliasUrl`、`robotsUrl/robotsAliasUrl`（robots 维度：仅两者齐备的项目做主域/alias 一致性检查）、`llmsUrl`、`newVersions`（docs 站版本过滤）。
- `scripts/lib/`：`config.mjs`（loadProjects/filterProjects）、`http.mjs`（fetchText）、`sitemap.mjs`（parseSitemap，含 index 子 sitemap）、`html.mjs`（extractTitle/extractMeta，引号感知）、`robots.mjs`（parseRobots 分组 + 禁整站/路径格式/Content-Signal 比对）、`report.mjs`（writeStats/now）、`atomgit.mjs`（API 客户端 + parseOwnerRepo）。
- `scripts/config/check-rules.json`：可调规则（含 `robots.contentSignalExpected` 期望值；改规范口径只改这里，勿改脚本）。
- `scripts/checks/check-<dim>-*.mjs` / `<dim>-spec-check.mjs`：维度脚本；根 `package.json` 加 `check:<x>` 短命令。
- 产物三件套：`scheduled-reports/<dim>/<YYYY-MM-DD>/`（给人看的 md 报告，按日期分目录、目录内文件名不带维度/日期前缀，进 git，由 Action 回写）、`scripts/stats/<dim>-stats.json`（给机器，不进 git 也勿依赖同日多次跑）、控制台日志。`manual-review/issues/` 仅存历史平铺报告与人工核查快照（2026-10-13 及以前），不再新增。
- `measures/<NN-dim>/`：规范五件套（规范/检测方式/工具与脚本/各项目差异点/进展），每接入一个维度要同步更新"检测方式.md"和"工具与脚本.md"（后者**只描述本仓库问题扫描脚本**：`## <脚本名> 参数` 表与 `## <脚本名> 执行流程` mermaid 图，模板见 measures/03-sitemap 与 measures/01-robots-txt；讲"项目侧怎么落地/生成"的内容放可选的"实现方式.md"，见 measures/02-llms-txt 与 measures/04-json-ld）。

## 已接入的定时维度（前缀/cron 勿与既有的撞车）

| 维度 | 脚本 | workflow | 前缀 | cron (UTC) | 报告形态 |
|------|------|----------|------|------------|----------|
| TDK 重复（模板） | check-tdk-jsonld.mjs --dims=tdk | tdk-jsonld-check.yml（与 JSON-LD 共用抓取） | `[GEO TDK Duplicate]` | 周一 03:30 | 双报告 brief/full |
| robots.txt 规范 | check-robots.mjs | robots-txt-check.yml | `[GEO Robots.txt]` | 每日 04:00 | **单一版正文**（无 brief/full） |
| Sitemap 属性规范 | sitemap-spec-check.mjs | sitemap-spec-check.yml | `[GEO Sitemap]` | 每日 04:30 | 双报告 brief/full |
| llms.txt 规范 | check-llms-txt.mjs | llms-txt-check.yml | `[GEO llms.txt]` | 每日 05:00 | 双报告 brief/full |
| HTML 语义（a标签/结构/alt） | semantic-spec-check.mjs | html-semantic-check.yml | `[GEO HTML Semantic]` | 周三 05:30 | 双报告 brief/full |
| JSON-LD 规范 | check-tdk-jsonld.mjs --dims=jsonld | tdk-jsonld-check.yml（与 TDK 合并执行，原每日 json-ld-check.yml 已删） | `[GEO JSON-LD]` | 周一 03:30（原每日 06:00） | 双报告 brief/full |
| Issue 看板（非检查维度，只读汇总不提单） | collect-issues-dashboard.mjs | issues-dashboard.yml | 采集所有 `[GEO *]` 前缀 | 每日 06:00 | dashboard/issues-dashboard.md（未关闭 issue 状态 + 关联 PR，每次全量重生成，已关闭的自动移除） |

## 模板参考实现（TDK 重复维度）

- `scripts/checks/check-tdk-jsonld.mjs` —— 完整流程模板（2026-10 由 check-tdk-duplicate.mjs 与 check-jsonld.mjs 合并：sitemap 全量逐页抓取，`--dims=tdk,jsonld` 两维度共用同一份 HTML；查重/写回仍按维度独立。单维度分析器在 `scripts/lib/jsonld.mjs`，共用抓取在 `scripts/lib/crawl.mjs`）
- `scripts/lib/atomgit.mjs` —— AtomGit API 封装（全局 fetch，零依赖）+ 提单流程公共实现（`precheckExistingIssues` 查重 / `reconcileIssue` 新建·更新·/close 写回 / `closeIssueCommentBody`）
- `.github/workflows/tdk-jsonld-check.yml` —— Action 编排模板
- `measures/05-tdk/检测方式.md`、`工具与脚本.md` —— 文档写法参照

## 检查脚本约定

1. CLI 参数（`process.argv` 手工解析，无依赖）：`--site=ID`、`--conc=10`、`--max=N`（试跑截断）、`--skip=a,b`（默认跳过清单，传空覆盖）、`--submit-issues`、`--dry-run`、`--force`（仅配 `--submit-issues`，见"强制执行模式"）。轻量维度（如 robots，每项目仅 1~8 个 URL）可不实现 `--skip`/`--max`；未配置该维度关键字段（如 `robotsUrl`）的项目照常扫描记录但不查重、不提单。
2. 数据源 = 对项目 `sitemapUrl` 全量展开（index 递归；有 `newVersions` 的 docs 站只取匹配版本子 sitemap，约定见 sitemap-spec-check）后**逐页实时 fetch HTML**，不发仓库构建产物；robots/llms 类单文件维度直接 GET 目标文件。
3. 抓取：超时 20s + 2 次重试 + UA `geo-workflow-checker/1.0`；`mapLimit` 并发（默认 10）。失败页单列清单，不计入判重。
4. **缺失与判重分开**：提取函数返回 null（元素不存在）/ ''（元素存在但空），两者都不进判重分组，而是逐页记入独立的"缺失检查"小节（区分 `noElement`/`empty`），孤立缺失（仅 1 页）也会报告；判重只对有非空取值的页面分组。
5. 写文件：**全部跑完一次性 `writeFile`**（勿流式/勿 partial——已试过，复杂且无法中途查看，已回退）。报告 UTF-8；markdown 中若引用 HTML 片段（如 `<meta name="description">`）一律用反引号包裹，否则被渲染吞掉；**表格行必须与表头列数一致，跳过/未配置分支也要输出 `|…|` 表格行而非 `- ` 列表项**（曾因此断裂总览表）。
6. 产物按日期归入 `scheduled-reports/<dim>/YYYY-MM-DD/`（`now()` 的 ISO 前 10 位），目录内文件名不再带日期（汇总 `report.md`、明细 `detail.md`（可选）、每项目 `<ID>-brief.md`/`<ID>-full.md`）；同一天重跑覆盖目录内文件。旧报告（`manual-review/issues/<dim>/` 平铺命名、已进 git 的）保留原位，已提 issue 的链接不受影响。

## 提 issue 流程（--submit-issues 模式）

按项目循环，每项目：

1. **先查重再扫描**（核心防重复逻辑）：`findIssuesByTitlePrefix({owner, repo, prefix: '[GEO <Dim>]', state: 'open'})`。查重+扫描+写回已抽成 lib 公共实现：`precheckExistingIssues`（扫描前）+ `reconcileIssue`（扫描后按结果新建/更新/关闭），各维度脚本只传 `prefix`、`dimLabel`、`force`、`hasIssue`、`verifiedClean` 等参数。
   - 有未关闭 issue（**无论是否关联 PR**）→ 跳过该项目整个"扫描+提单"，results 记 `skipped:true`。`--force` 强制执行时**不拦截**（见第 5 条）。
   - 查询失败：有 token（生产）→ 也跳过扫描（宁漏勿重）；无 token（本地）→ 只扫描不提单。
2. 扫描后有发现 → 触发条件=硬性错误（可选属性缺失不计；仅告警不提单，告警入报告供人工定夺）。默认写两个文件到 `scheduled-reports/<dim>/<YYYY-MM-DD>/`：
   - `<ID>-brief.md`（简短版：总览 + 每类 top3 组、每组最多 5 URL，超出注明"见完全版"）
   - `<ID>-full.md`（完全版：全部明细）
   - **单一版例外**：单项目明细本身很短（如 robots.txt 的一屏级清单+原文）→ 不写 brief/full，issue 正文直接内嵌完整明细（问题清单+现状原文+规范要点），尾部链接当日 `report.md`；此时汇总 `report.md` 两种模式都保留全量明细（明细与正文同源，不算重复）。
3. 提 1 个 issue 到该项目 AtomGit 仓库（owner/repo 由 `parseOwnerRepo(project.repo)` 从 gitcode URL 解析）：
   - 标题 = `[GEO <Dim>] <项目名>（<ID>）：<一句话（或 N 项）>`；前缀必须稳定（查重靠 `title.startsWith(prefix)`）。
   - 正文 = 简短版内容 + 指向完全版的链接（双报告维度）/ 完整明细（单一版维度）+ 固定"处理说明"文案（修复后关 issue；issue 未关闭期间不会重复扫描/重复提单；误报请评论说明后关闭）。
   - 链接 = `https://github.com/<GITHUB_REPOSITORY>/blob/<GITHUB_REF_NAME>/scheduled-reports/<dim>/<YYYY-MM-DD>/<文件名>`（分支跟随运行时 `GITHUB_REF_NAME`，脚本内本地缺省值仍是 `archive`，属历史遗留）。
   - `--dry-run` 或无 token/无 owner:repo → 只打印正文不提交、不写 brief/full。
4. **去重规则（双报告维度）**：`--submit-issues` 模式下当日 `report.md` 只写"头部+总览表+指向各项目 full 文件的清单"，明细不重复输出；手动模式（不带 --submit-issues）保持含全部明细的单一汇总。单一版维度不适用此条（见上）。
5. **强制执行模式（`--force`，仅配 `--submit-issues`；workflow 手动 dispatch 的 `force_check` 输入）**：供"修复 PR 已合并但想立即复核/关闭 issue"的场景。查重命中不再 block，照常扫描，扫描后由 `reconcileIssue` 按结果写回**原未关闭 issue**（不新建）：
   - 仍有问题 → `PATCH /repos/{owner}/{repo}/issues/{number}` 更新第一个 open issue 的标题与正文（`issueAction='updated'`；同前缀多个 open issue 只更新第一个并打日志提示）。
   - 无问题 → `closeIssueCommentBody()` 生成评论正文（说明行 + 空行 + 独占一行的 `/close`），对**每个** open issue POST 评论（`issueAction='close-commented'`）。
    - **verifiedClean 护栏（必传）**：只有"检查对象确实抓取成功、本次扫描有效完成"才允许评论 /close；抓取失败/未收集到数据时判不了"已修复"，只打日志不动原 issue，防止误关。各维度取值——tdk=`urlCount>0&&fetched>0`、jsonld=`checks.fetched>0`（2026-10 全量化后；原 `checks.accessible` 采样口径作废）、robots/llms=`checks.accessible`、sitemap=`accessible===true`、semantic=至少一个抽样页 accessible。
   - dry-run / 无 token → 仅打印"将更新 issue #N / 将评论 /close"，不写回；`--force` 单独传（不带 `--submit-issues`）无效果。
   - 报告口径：`运行模式`行追加 `--force 强制执行`；提单模式下 full 清单行标注"强制复检仍有问题，已更新原 issue"，/close 项目单列一行；stats `mode` 追加 `-force` 后缀。

## GitHub Action 模板（复制 tdk-jsonld-check.yml 改名字）

- `on`: `schedule` cron（**cron 只在默认分支 main 生效**，结构已合入 main，定时任务已启用）+ `workflow_dispatch` inputs：`site`（可空）、`dry_run`（boolean）、`force_check`（boolean，强制执行：跳过查重拦截，有问题更新原 issue、无问题评论 /close；run 步骤按 `${{ inputs.force_check }}` 追加 `--force`）。
- `permissions: contents: write`（要把 brief/full/汇总报告 commit 回本仓库，issue 链接才能解析）；`concurrency: group: <dim>-check`。
- commit 步骤 `git add` 的目录**必须先判断存在**：`for d in ...; do if [ -e "$d" ]; then git add "$d"; fi; done`——维度可单选（如 tdk-jsonld 的 `--dims=jsonld`）或该维度目录从未在分支上提交过时，直接 `git add <缺失目录>` 会 `fatal: pathspec did not match any files` 使步骤失败（`git add --ignore-errors` 也挡不住，实测 exit 128）；且 Actions 默认 `bash -e`，勿用 `[ -e ] && git add` 短路写法（条件为假时该命令行 exit 1 会中断整步）。
- Job：`runs-on: ubuntu-latest`（纯网络抓取够用；只有需要构建被检项目的检查才用 self-hosted `portal-x86`）；setup-node 20；
  步骤 = 跑脚本（env `ATOMGIT_TOKEN: ${{ secrets.ATOMGIT_TOKEN }}`）→ `git add scheduled-reports/<dim>` → 有变更才 commit + `git pull --rebase` + push（identity 用 github-actions[bot]）。

## AtomGit API 要点（v5，base https://api.atomgit.com）

- 读（列 issues/pulls）公共仓可匿名；私有/受限仓无 token 返回 403（403=存在，404=不存在）。写必须 `Authorization: Bearer $ATOMGIT_TOKEN`。
- **路径不对称**：列表是 repo-scoped `GET /api/v5/repos/{owner}/{repo}/issues?state=open&per_page=100`；**创建是 owner-scoped** `POST /api/v5/repos/{owner}/issues`，`repo` 放 body；更新 `PATCH /repos/{owner}/{repo}/issues/{number}`（body 字段就叫 `body`，仅传要改的字段）。评论 `POST /repos/{owner}/{repo}/issues/{number}/comments`（关闭用评论正文末行独占一行的 `/close`，由 `closeIssueCommentBody()` 生成，同前缀多个 open issue 逐个评论）。
- 建单返回 `number`，issue URL = `html_url` 兜底 `https://atomgit.com/{owner}/{repo}/issues/{number}`。

## 新维度接入 checklist

1. 读 `measures/<dim>/规范.md`、`检测方式.md`，确认判定标准与数据源（sitemap 全量 or 首页 or robots.txt 等）。
2. 写/改 `scripts/checks/check-<dim>.mjs`：复用 lib；加 `--submit-issues`/`--dry-run`/`--force`；查重与写回直接调用 `precheckExistingIssues` + `reconcileIssue`（勿再复制脚本内私有实现）；遵循上面"提 issue 流程"（含查重跳过、强制执行更新/关闭原 issue 及 verifiedClean 护栏、报告形态选型【双报告 or 单一版】、汇总去重）。
3. 定该维度 issue 前缀 `[GEO <Dim>]`（写进代码常量并在文档注明——前缀变更会使旧 issue 查重失效造成重复提单）；cron 时间错开既有维度（见上表）。
4. `node --check` + 本地小跑验证：`--site=<小站如 HiFloat> --max=50 --submit-issues`（无 token 天然不提单，能看正文与产物文件；**跑前备份 `scripts/stats/*.json` 与当日 `scheduled-reports/<dim>/<date>/`，测试会覆盖当日产物**）；需要走通提单正文渲染但现网全绿时，可临时改 `check-rules.json` 期望值强制出错，验证后还原。
5. 复制 workflow yml 改名、cron、目录（`git add scheduled-reports/<dim>`）；更新根 `package.json` 短命令、本表"已接入的定时维度"、`measures/<dim>/` 两个文档（工具与脚本.md 含参数表 + mermaid 执行流程）。
6. 不自动加进 `run-all.mjs`（重成本检查按需手动/Action 跑）。

## 其他注意

- Windows 控制台 GBK 乱码是显示问题，文件本身 UTF-8；核对内容用 Read 工具读文件而不是看 stdout。
- 后台长任务：`Start-Process node ...` 后工具会报 `Unknown: ChildProcess.kill`，进程实际存活，用 `Get-CimInstance Win32_Process` 查 PID。
- **main 重构（已完成）**：archive 的 measures/workflow/manual-review/projects.config.json 结构已刷入 main，旧 `scripts/geo-daily-check` 已并入新 lib/脚本并删除。**遗留未做**：`geo-issue-analyze`（issue 回复分析）尚无新结构实现，需要时单独移植。
- **目录重构（已完成）**：`workflow/` → `scripts/`，`workflow/scripts/` → `scripts/checks/`，`package.json`/`pnpm-lock.yaml` 移至仓库根（仓库根即 Node 项目根，`scripts/` 不再是独立项目）。
- `scheduled-reports/` 目录当前可能不存在/为空——由定时 Action 首次运行后回写，本地只在跑脚本时生成。
