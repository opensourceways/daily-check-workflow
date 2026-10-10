# GEO 整改看板

> 由 `generate-dashboard.mjs` 自动生成，请勿手动编辑。
> 生成时间：2026-10-10T04:00:02.195Z
>
> 矩阵状态优先取自各措施的 `进展.md`（人工维护），自动化检测结果作为补充标注。

## 措施 × 项目合规矩阵

| 项目 | robots.txt | llms.txt | sitemap | JSON-LD | TDK | a标签语义 | 标签结构 | 图片alt | 综合 |
|------|------|------|------|------|------|------|------|------|------|
| openEuler 官网 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | 🟡 (5/8) |
| openEuler 文档 | ✅ | ✅ | ⚠️ | ✅ | 🟡 | ❌ | ❌ | ❌ | ⚠️ (3/8) |
| openGauss 官网 | 🟡 | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ⚠️ (3/8) |
| openGauss 文档 | 🟡 | ❌ | ⚠️ | ✅ | 🟡 | ❌ | ❌ | ❌ | ⚠️ (1/8) |
| MindSpore 官网 | ✅ | ❌ | ⚠️ | ✅ | ✅ | ❌ | ❌ | ❌ | ⚠️ (3/8) |
| MindSpore 文档 | ❌ | ❌ | ⚠️ | ❌ | 🟡 | ❌ | ❌ | ❌ | ❌ (0/8) |
| openUBMC 官网 | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ⚠️ (3/8) |
| openUBMC 文档 | ❌ | ❌ | ✅ | ✅ | 🟡 | ❌ | ❌ | ❌ | ⚠️ (2/8) |
| UnifiedBus | ⚠️ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ⚠️ (2/8) |
| HiFloat | ✅ | ❌ | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ⚠️ (3/8) |

## 状态说明

| 标记 | 含义 |
|------|------|
| ✅ | 已完成：完全符合规范 |
| 🟡 | 部分完成：部分符合，有遗留问题 |
| ⚠️ | 有问题：已实施但存在缺陷 |
| ❌ | 未开始：尚未实施 |
| ⏳ | 待排查：尚未建立基线 |
| ✅⚡🟡 | 进展标记已完成，但自动化检测发现问题 |
| 🟡⚡✅ | 进展标记部分完成，自动化检测通过 |

## Issue / PR 统计

| 项目 | Issue 数 | PR 数 |
|------|----------|-------|
| _尚未运行 fetch-prs.mjs，执行 `node workflow/scripts/fetch-prs.mjs` 生成_ | - | - |

## 自动化检测状态

| 措施 | 检测脚本 | stats 文件 | 上次运行 |
|------|----------|------------|----------|
| robots.txt | `check-robots.mjs` | robots-stats.json | ✅ 2026-09-28T12:55:34.470Z |
| llms.txt | `check-llms.mjs` | llms-txt-stats.json | ⏳ 未运行 |
| sitemap | `check-sitemap.mjs` | sitemap-stats.json | ⏳ 未运行 |
| JSON-LD | `check-json.mjs` | jsonld-stats.json | ⏳ 未运行 |
| TDK | `check-tdk.mjs` | tdk-stats.json | ⏳ 未运行 |
| a标签语义 | `check-a-tag.mjs` | a-tag-stats.json | ⏳ 未运行 |
| 标签结构 | `check-tag-structure.mjs` | tag-structure-stats.json | ⏳ 未运行 |
| 图片alt | `check-image.mjs` | image-alt-stats.json | ⏳ 未运行 |

## 各措施详情

| 措施 | 规范 | 进展 | 差异点 | 检测方式 |
|------|------|------|--------|----------|
| robots.txt | [规范](../measures/01-robots-txt/规范.md) | [进展](../measures/01-robots-txt/进展.md) | [差异点](../measures/01-robots-txt/各项目差异点.md) | [检测](../measures/01-robots-txt/检测方式.md) |
| llms.txt | [规范](../measures/02-llms-txt/规范.md) | [进展](../measures/02-llms-txt/进展.md) | [差异点](../measures/02-llms-txt/各项目差异点.md) | [检测](../measures/02-llms-txt/检测方式.md) |
| sitemap | [规范](../measures/03-sitemap/规范.md) | [进展](../measures/03-sitemap/进展.md) | [差异点](../measures/03-sitemap/各项目差异点.md) | [检测](../measures/03-sitemap/检测方式.md) |
| JSON-LD | [规范](../measures/04-json-ld/规范.md) | [进展](../measures/04-json-ld/进展.md) | [差异点](../measures/04-json-ld/各项目差异点.md) | [检测](../measures/04-json-ld/检测方式.md) |
| TDK | [规范](../measures/05-tdk/规范.md) | [进展](../measures/05-tdk/进展.md) | [差异点](../measures/05-tdk/各项目差异点.md) | [检测](../measures/05-tdk/检测方式.md) |
| a标签语义 | [规范](../measures/06-a-tag-semantics/规范.md) | [进展](../measures/06-a-tag-semantics/进展.md) | [差异点](../measures/06-a-tag-semantics/各项目差异点.md) | [检测](../measures/06-a-tag-semantics/检测方式.md) |
| 标签结构 | [规范](../measures/07-tag-structure-semantics/规范.md) | [进展](../measures/07-tag-structure-semantics/进展.md) | [差异点](../measures/07-tag-structure-semantics/各项目差异点.md) | [检测](../measures/07-tag-structure-semantics/检测方式.md) |
| 图片alt | [规范](../measures/08-image-alt/规范.md) | [进展](../measures/08-image-alt/进展.md) | [差异点](../measures/08-image-alt/各项目差异点.md) | [检测](../measures/08-image-alt/检测方式.md) |

## 相关入口

- [总索引](../index.md)
- [项目配置](../projects.config.json)
- [人工检查问题](../manual-review/issues/)
- [复盘记录](../manual-review/retrospectives/)
- [归档文档](../archive/)
- [Workflow 说明](../workflow/README.md)

## 更新方式

```bash
# 1. 运行自动化检查（生成 stats JSON）
cd workflow && node scripts/run-all.mjs

# 2. 生成/更新看板
cd .. && node dashboard/generate-dashboard.mjs
```
