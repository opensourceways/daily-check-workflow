# GEO Workflow

自动化检查脚本体系，对各社区 GEO 整改措施进行检测并输出统计。

## 快速开始

仓库根即 Node 项目根（package.json 在根目录，检查脚本零依赖，无需安装）：

```bash
node scripts/checks/run-all.mjs          # 一键检查全部措施
node scripts/checks/check-sitemap.mjs    # 单独检查 sitemap
node scripts/checks/check-sitemap.mjs --site=openEuler-portal  # 检查单个项目
# 或使用根 package.json 短命令：pnpm run check:robots / check:tdk-dup / check:llms ...
```

## 脚本一览

| 脚本 | 措施 | 输出文件 |
|------|------|----------|
| check-robots.mjs | robots.txt | scripts/stats/robots-stats.json |
| check-llms-txt.mjs | llms.txt 规范检查（结构/描述覆盖率/llms-full/发现头/robots 联动/抽样链接；`--submit-issues` 支持提单，前缀 `[GEO llms.txt]`，brief/full 双报告） | scheduled-reports/llms/`<date>`/ + scripts/stats/llms-txt-stats.json |
| check-sitemap.mjs | sitemap 快速统计（旧版轻量） | scripts/stats/sitemap-stats.json |
| sitemap-spec-check.mjs | sitemap 属性规范检查（index 递归、newVersions/domainAlias 约定、xhtml:link 全集核实；`--submit-issues` 支持提单，前缀 `[GEO Sitemap]`） | scheduled-reports/sitemap/`<date>`/ + scripts/stats/sitemap-spec-stats.json |
| check-jsonld.mjs | JSON-LD 规范检查（采样页语法/@context/P0 三件套/必填属性/占位符；`--submit-issues` 支持提单，前缀 `[GEO JSON-LD]`，brief/full 双报告） | scheduled-reports/jsonld/`<date>`/ + scripts/stats/jsonld-stats.json |
| check-tdk.mjs | TDK | scripts/stats/tdk-stats.json |
| check-tdk-duplicate.mjs | TDK 重复判重（sitemap 全量逐页抓取分组判重；`--submit-issues` 支持提单，是"检查+提 issue"流程的模板实现） | scheduled-reports/tdk/`<date>`/ + scripts/stats/tdk-duplicate-stats.json |
| check-a-tag.mjs | a 标签语义 | scripts/stats/a-tag-stats.json |
| check-tag-structure.mjs | 标签结构语义化 | scripts/stats/tag-structure-stats.json |
| check-image-alt.mjs | 图片 alt 语义 | scripts/stats/image-alt-stats.json |
| semantic-spec-check.mjs | HTML 语义化规范抽查（以 measures/10「检查细节」为核心 + 06/07/08 附加项；`--submit-issues` 支持提单，前缀 `[GEO HTML Semantic]`，brief/full 双报告） | scheduled-reports/semantic/`<date>`/ + scripts/stats/semantic-spec-stats.json |
| fetch-prs.mjs | 各仓库 issue/PR 汇总 | scripts/stats/pr-summary.json |
| run-all.mjs | 一键执行全部检查 | scripts/stats/run-all-summary.json |

## 目录结构

```
（仓库根，Node 项目根：package.json / pnpm-lock.yaml / projects.config.json）
└── scripts/
    ├── config/          # 检查规则配置（check-rules.json）
    ├── lib/             # 公共库
    │   ├── config.mjs   # 读取 projects.config.json
    │   ├── http.mjs     # fetch 封装
    │   ├── sitemap.mjs  # sitemap XML 解析
    │   ├── robots.mjs   # robots.txt 解析
    │   ├── html.mjs     # HTML 解析工具
    │   ├── gitcode.mjs  # GitCode/AtomGit API
    │   ├── atomgit.mjs  # AtomGit API v5 + 提单流程公共实现（查重 precheckExistingIssues、新建/更新/评论 /close 写回 reconcileIssue，供 --submit-issues/--force 模式）
    │   └── report.mjs   # 统计输出
    ├── checks/          # 检查脚本
    ├── pr-gate-checks/  # PR 门禁静态文件检查（自包含，可复制到待检项目根运行）
    ├── stats/           # 输出目录（JSON）
    ├── pr-summary.md    # PR 汇总
    └── README.md
```

仓库根另有：

```
scheduled-reports/   # 定时 Action 自动执行产物（各维度扫描报告），目录结构 scheduled-reports/<维度>/<YYYY-MM-DD>/
manual-review/       # 人工核查记录与复盘（issues/ 下为接入自动目录前的历史自动报告，保留原位）
```

## 维度检查 + 提 issue 流程（模板）

例行"检查→生成简短/完全双报告→提 issue 到各项目 AtomGit 仓库（未关闭 issue 存在则跳过扫描+提单）"的流程以 **TDK 重复维度**为模板实现（自动产物统一写入 `../scheduled-reports/<维度>/<日期>/`）；查重与写回逻辑收敛在 `scripts/lib/atomgit.mjs` 的 `precheckExistingIssues`（扫描前）+ `reconcileIssue`（扫描后按结果新建/更新/评论 `/close`），各维度脚本共用：

- 脚本：`scripts/checks/check-tdk-duplicate.mjs`（`--submit-issues` / `--dry-run` / `--force`）
- API：`scripts/lib/atomgit.mjs`（owner/repo 由 projects.config.json 的 gitcode URL 解析）
- Action：`../.github/workflows/tdk-duplicate-check.yml`（定时 + 手动 dispatch，报告 commit 回本仓库）
- **强制执行（`--force` / dispatch 输入 `force_check`）**：默认"已有未关闭同前缀 issue 即跳过扫描"避免重复提单；勾选 force_check 时不再被该查重拦截——照常检查，若该项目仍有本维度问题则就地 PATCH 更新原未关闭 issue 的内容（而非新建），若检查表明问题已消除（且本次为有效抓取复检）则在原 issue 内评论 `/close` 关闭。用于修复后想立即复核、更新或关闭存量 issue。dry-run / 无 token 时只打印将执行的动作、绝不写回

已接入该流程的维度：

- **TDK 重复**（模板）：`scripts/checks/check-tdk-duplicate.mjs` + `../.github/workflows/tdk-duplicate-check.yml`，前缀 `[GEO TDK Duplicate]`
- **Sitemap 属性规范**：`scripts/checks/sitemap-spec-check.mjs` + `../.github/workflows/sitemap-spec-check.yml`（每日 04:30 UTC），前缀 `[GEO Sitemap]`
- **robots.txt 规范**：`scripts/checks/check-robots.mjs` + `../.github/workflows/robots-txt-check.yml`（每日 04:00 UTC），前缀 `[GEO Robots.txt]`；因单项目报告很短，**不做简短/完全双报告**，issue 正文直接嵌入完整明细（当日汇总报告仍入库并在 issue 尾部附链接）；触发提单=硬性错误（告警与 robotsUrl 未配置不提单）
- **HTML 语义化**：`scripts/checks/semantic-spec-check.mjs` + `../.github/workflows/html-semantic-check.yml`（每周三 05:30 UTC），前缀 `[GEO HTML Semantic]`；按 measures/10「检查细节」抽样页面检查（门户=首页+sitemap 抽 4 栏目页，文档=/zh/、/en/ 首页，默认跳过 MindSpore-docs）；触发提单=存在 error 级问题（仅 warn 不提）；"多个同时可见的 header/footer/main"存在 class 控制显隐的已知误报场景，issue 正文已附复核说明
- **llms.txt 规范**：`scripts/checks/check-llms-txt.mjs` + `../.github/workflows/llms-txt-check.yml`（每日 05:00 UTC），前缀 `[GEO llms.txt]`；触发提单=P0 级硬性错误（P1/P2 计告警不提单；robots LLM-Policy 联动缺失仅告警，提单归 robots.txt 维度，避免同根因跨维度重复提单）；llmsUrl 未配置的项目记 ❌ 但不查重、不提单
- **JSON-LD 规范**：`scripts/checks/check-jsonld.mjs` + `../.github/workflows/json-ld-check.yml`（每日 06:00 UTC），前缀 `[GEO JSON-LD]`；采样首页+`check-rules.json` samplePages+llms.txt 前 2 条内容页；触发提单=P0 级硬性错误（语法/@context/P0 三件套/Google 必填属性/占位符；重复块、面包屑项、inLanguage、@id 覆盖率等计告警不提单）

其他维度接入时照此模式复制（直接复用 lib 的 `precheckExistingIssues`+`reconcileIssue`，即自带查重跳过与 `--force` 强制执行写回）；细则约定（前缀查重、双报告、汇总去重、链接分支、强制执行更新/关闭、验证 checklist）见 skill `daily-check-dim-flow`（~/.config/opencode/skills/）。注意：cron 定时只在默认分支（main）生效，archive 分支合入 main 前用 workflow_dispatch 验证。

## PR 门禁检查（pr-gate-checks/）

与定时检查（抓线上 + 提 issue）互补的一套**本地静态文件**检查：门禁步骤将 `scripts/pr-gate-checks/` 连同 `projects.config.json` 复制到待检项目根，执行 `node pr-gate-checks/check-robots.mjs`；用项目根 `package.json` 的 `name` 匹配 `repoInfo.packageName` 确定待检项目，再按 `repoInfo` 登记的路径检查（robots.txt 位于 `${repoInfo.publicDir}/robots.txt`）。只读本地文件、不联网、不提单，硬性错误退出码 1 拦截 PR；packageName 未登记（项目未接入）时跳过放行（退出码 0）。已接入：robots.txt 字段合规（check-robots.mjs）、最新提交新增页面的 TDK / JSON-LD 配置（check-new-page-tdk.mjs，按 `pageEntryPattern` 正则筛新增页面，两维度各自判定：归档 `tdkArchiveDir`/`jsonldArchiveDir` 或源码 frontmatter / useSeoMeta/useHead 任一满足即通过）。公共管道在 `gate-utils.mjs`，细则见目录内 README。

## 配置

项目信息统一在 `../projects.config.json` 中维护，脚本自动读取。
新增项目只需修改该配置文件，无需改动脚本。

## 看板

```bash
node dashboard/generate-dashboard.mjs   # 从 stats 汇聚生成看板
```
