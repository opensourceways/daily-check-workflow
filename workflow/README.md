# GEO Workflow

自动化检查脚本体系，对各社区 GEO 整改措施进行检测并输出统计。

## 快速开始

```bash
cd workflow
node scripts/run-all.mjs          # 一键检查全部措施
node scripts/check-sitemap.mjs    # 单独检查 sitemap
node scripts/check-sitemap.mjs --site=openEuler-portal  # 检查单个项目
```

## 脚本一览

| 脚本 | 措施 | 输出文件 |
|------|------|----------|
| check-robots.mjs | robots.txt | stats/robots-stats.json |
| check-llms-txt.mjs | llms.txt | stats/llms-txt-stats.json |
| check-sitemap.mjs | sitemap 快速统计（旧版轻量） | stats/sitemap-stats.json |
| sitemap-spec-check.mjs | sitemap 属性规范检查（index 递归、newVersions/domainAlias 约定、xhtml:link 全集核实；`--submit-issues` 支持提单，前缀 `[GEO Sitemap]`） | manual-review/issues/sitemap/ + stats/sitemap-spec-stats.json |
| check-jsonld.mjs | JSON-LD | stats/jsonld-stats.json |
| check-tdk.mjs | TDK | stats/tdk-stats.json |
| check-tdk-duplicate.mjs | TDK 重复判重（sitemap 全量逐页抓取分组判重；`--submit-issues` 支持提单，是"检查+提 issue"流程的模板实现） | manual-review/issues/tdk/ + stats/tdk-duplicate-stats.json |
| check-a-tag.mjs | a 标签语义 | stats/a-tag-stats.json |
| check-tag-structure.mjs | 标签结构语义化 | stats/tag-structure-stats.json |
| check-image-alt.mjs | 图片 alt 语义 | stats/image-alt-stats.json |
| semantic-spec-check.mjs | HTML 语义化规范抽查（以 measures/10「检查细节」为核心 + 06/07/08 附加项；`--submit-issues` 支持提单，前缀 `[GEO HTML Semantic]`，brief/full 双报告） | manual-review/issues/semantic/ + stats/semantic-spec-stats.json |
| fetch-prs.mjs | 各仓库 issue/PR 汇总 | stats/pr-summary.json |
| run-all.mjs | 一键执行全部检查 | stats/run-all-summary.json |

## 目录结构

```
workflow/
├── package.json
├── config/          # workflow 配置
├── lib/             # 公共库
│   ├── config.mjs   # 读取 projects.config.json
│   ├── http.mjs     # fetch 封装
│   ├── sitemap.mjs  # sitemap XML 解析
│   ├── robots.mjs   # robots.txt 解析
│   ├── html.mjs     # HTML 解析工具
│   ├── gitcode.mjs  # GitCode/AtomGit API
│   ├── atomgit.mjs  # AtomGit API v5（提 issue 查重/建单，供 --submit-issues 模式）
│   └── report.mjs   # 统计输出
├── scripts/         # 检查脚本
├── stats/           # 输出目录（JSON）
├── pr-summary.md    # PR 汇总
└── README.md
```

## 维度检查 + 提 issue 流程（模板）

例行"检查→生成简短/完全双报告→提 issue 到各项目 AtomGit 仓库（未关闭 issue 存在则跳过扫描+提单）"的流程以 **TDK 重复维度**为模板实现：

- 脚本：`scripts/check-tdk-duplicate.mjs`（`--submit-issues` / `--dry-run`）
- API：`lib/atomgit.mjs`（owner/repo 由 projects.config.json 的 gitcode URL 解析）
- Action：`../.github/workflows/tdk-duplicate-check.yml`（定时 + 手动 dispatch，报告 commit 回本仓库）

已接入该流程的维度：

- **TDK 重复**（模板）：`scripts/check-tdk-duplicate.mjs` + `../.github/workflows/tdk-duplicate-check.yml`，前缀 `[GEO TDK Duplicate]`
- **Sitemap 属性规范**：`scripts/sitemap-spec-check.mjs` + `../.github/workflows/sitemap-spec-check.yml`（每日 04:30 UTC），前缀 `[GEO Sitemap]`
- **robots.txt 规范**：`scripts/check-robots.mjs` + `../.github/workflows/robots-txt-check.yml`（每日 04:00 UTC），前缀 `[GEO Robots.txt]`；因单项目报告很短，**不做简短/完全双报告**，issue 正文直接嵌入完整明细（当日汇总报告仍入库并在 issue 尾部附链接）；触发提单=硬性错误（告警与 robotsUrl 未配置不提单）
- **HTML 语义化**：`scripts/semantic-spec-check.mjs` + `../.github/workflows/html-semantic-check.yml`（每周三 05:30 UTC），前缀 `[GEO HTML Semantic]`；按 measures/10「检查细节」抽样页面检查（门户=首页+sitemap 抽 4 栏目页，文档=/zh/、/en/ 首页，默认跳过 MindSpore-docs）；触发提单=存在 error 级问题（仅 warn 不提）；"多个同时可见的 header/footer/main"存在 class 控制显隐的已知误报场景，issue 正文已附复核说明

其他维度接入时照此模式复制；细则约定（前缀查重、双报告、汇总去重、链接分支、验证 checklist）见 skill `daily-check-dim-flow`（~/.config/opencode/skills/）。注意：cron 定时只在默认分支（main）生效，archive 分支合入 main 前用 workflow_dispatch 验证。

## 配置

项目信息统一在 `../projects.config.json` 中维护，脚本自动读取。
新增项目只需修改该配置文件，无需改动脚本。

## 看板

```bash
node ../dashboard/generate-dashboard.mjs   # 从 stats 汇聚生成看板
```
