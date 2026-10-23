# GEO 优化专项

> Generative Engine Optimization —— 面向生成式 AI 的内容可发现性与可解析性优化

## 总览

本项目用于统筹各社区/项目的 GEO 整改措施，包含规范定义、进展追踪、差异分析、自动化检查与人工复盘。

- 📊 [整体看板](dashboard/dashboard.md)（脚本自动生成，`node dashboard/generate-dashboard.mjs` 更新）
- 👥 [分工表](分工表.md)（各措施 × 各项目 责任人矩阵 + 整体措施分工）
- 🗂 [项目清单](projects.md) / [项目配置](projects.config.json)
- 🛠 [自动化检查脚本](scripts/README.md)
- 🔍 [人工检查问题](manual-review/issues/) / [复盘记录](manual-review/retrospectives/)
- 📦 [历史归档](archive/)

## 整改措施

每项措施一个文件夹，含规范、进展、各项目差异点、工具与脚本、检测方式五个文档。

### 准入层（GEO 核心：决定 AI 是否能抓取/理解站点）

| 编号 | 措施 | 规范 | 进展 | 差异点 | 检测 |
|------|------|------|------|--------|------|
| 01 | robots.txt | [规范](measures/01-robots-txt/规范.md) | [进展](measures/01-robots-txt/进展.md) | [差异](measures/01-robots-txt/各项目差异点.md) | [检测](measures/01-robots-txt/检测方式.md) |
| 02 | llms.txt | [规范](measures/02-llms-txt/规范.md) | [进展](measures/02-llms-txt/进展.md) | [差异](measures/02-llms-txt/各项目差异点.md) | [检测](measures/02-llms-txt/检测方式.md) |

### 可发现性层

| 编号 | 措施 | 规范 | 进展 | 差异点 | 检测 |
|------|------|------|------|--------|------|
| 03 | sitemap | [规范](measures/03-sitemap/规范.md) | [进展](measures/03-sitemap/进展.md) | [差异](measures/03-sitemap/各项目差异点.md) | [检测](measures/03-sitemap/检测方式.md) |

### AI 可解析层

| 编号 | 措施 | 规范 | 进展 | 差异点 | 检测 |
|------|------|------|------|--------|------|
| 04 | JSON-LD | [规范](measures/04-json-ld/规范.md) | [进展](measures/04-json-ld/进展.md) | [差异](measures/04-json-ld/各项目差异点.md) | [检测](measures/04-json-ld/检测方式.md) |

### 内容语义层

| 编号 | 措施 | 规范 | 进展 | 差异点 | 检测 |
|------|------|------|------|--------|------|
| 05 | TDK | [规范](measures/05-tdk/规范.md) | [进展](measures/05-tdk/进展.md) | [差异](measures/05-tdk/各项目差异点.md) | [检测](measures/05-tdk/检测方式.md) |
| 06 | a 标签语义 | [规范](measures/06-a-tag-semantics/规范.md) | [进展](measures/06-a-tag-semantics/进展.md) | [差异](measures/06-a-tag-semantics/各项目差异点.md) | [检测](measures/06-a-tag-semantics/检测方式.md) |
| 07 | 标签结构语义化 | [规范](measures/07-tag-structure-semantics/规范.md) | [进展](measures/07-tag-structure-semantics/进展.md) | [差异](measures/07-tag-structure-semantics/各项目差异点.md) | [检测](measures/07-tag-structure-semantics/检测方式.md) |
| 08 | 图片 alt 语义 | [规范](measures/08-image-alt/规范.md) | [进展](measures/08-image-alt/进展.md) | [差异](measures/08-image-alt/各项目差异点.md) | [检测](measures/08-image-alt/检测方式.md) |

> 新增措施时，复制 `measures/_template/` 文件夹，按编号顺序命名并在此登记。

## 涉及项目

openEuler 官网/文档 · openGauss 官网/文档 · MindSpore 官网/文档 · openUBMC 官网/文档 · UnifiedBus · HiFloat

详见 [项目清单](projects.md) 与 [配置文件](projects.config.json)。

## 快速使用

```bash
# 一键检查全部措施（生成 stats JSON，脚本零依赖，无需安装）
node scripts/checks/run-all.mjs

# 检查单个项目单个措施
node scripts/checks/check-sitemap.mjs --site=openEuler-portal

# 生成/更新看板
node dashboard/generate-dashboard.mjs

# 汇聚各仓库 issue/PR
node scripts/checks/fetch-prs.mjs
```
