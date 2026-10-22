# GEO 整改看板

> 由 `generate-dashboard.mjs` 自动生成，请勿手动编辑。
> 生成时间：2026-10-13T03:33:00.274Z
>
> 矩阵状态优先取自各措施的 `进展.md`（人工维护），自动化检测结果作为补充标注。

## 措施 × 项目合规矩阵

| 项目 | robots.txt | llms.txt | sitemap | JSON-LD | TDK | a标签语义 | 标签结构 | 图片alt |
|------|------|------|------|------|------|------|------|------|
| openEuler 官网 | ✅️ | ✅ | ✅ | ✅ | ✅ | 🟡 | 🟡 | 🟡 |
| openEuler 文档 | ✅️ | 🟡 | ✅ | ✅ | 🟡 | ✅ | 🟡 | 🟡 |
| openGauss 官网 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 |
| openGauss 文档 | ✅ | 🟡 | ✅ | ✅ | 🟡 | ✅ | 🟡 | 🟡 |
| MindSpore 官网 | ✅ | ✅ | 🟡 | 🟡 | ✅ | ✅ | 🟡 | 🟡 |
| MindSpore 文档 | ✅ | ✅ | 🟡 | ✅ | 🟡 | ✅ | 🟡 | 🟡 |
| openUBMC 官网 | ✅ | ✅ | 🟡 | ✅ | 🟡 | 🟡 | 🟡 | 🟡 |
| openUBMC 文档 | ✅ | ✅️ | ✅ | ✅ | 🟡 | ✅ | 🟡 | 🟡 |
| UnifiedBus | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | 🟡 |
| HiFloat | ✅ | ✅️ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## 状态说明

| 标记 | 含义 |
|------|------|
| ✅ | 已完成：完全符合规范 |
| 🟡 | 部分完成：部分符合，有遗留问题 |
| ⚠️ | 有问题：已实施但存在缺陷 |
| ❌ | 未开始：尚未实施 |
| ⏳ | 待排查：尚未建立基线 |

## 项目详情

**openEuler**

- **a标签**：首页友情链接部分，纯图片链接缺少alt
- **标签结构**：顶部导航不是`<header>`元素
- **图片 alt**：首页banner、友情链接部分缺少alt

**openEuler 文档**

- **llms.txt**：体积过大待拆分
- **TDK**：文档的准确的description待补充
- **标签结构**：具体文档的标签结构无法由我们保证效果
- **图片 alt**：文档内的img alt待补充

**openGauss**

- **图片 alt**：首页banner缺少 alt，其他部分页面存在img缺少alt

**openGauss 文档**

- **llms.txt**：体积过大待拆分
- **TDK**：文档的准确的description待补充
- **标签结构**：具体文档的标签结构无法由我们保证效果
- **图片 alt**：文档内的img alt待补充

**MindSpore**

- **sitemap**：部分动态路由页面的lastmod缺少
- **JSON-LD**：首页缺JSON-LD，待发版
- **标签结构**：部分页面标题顺序不符合规范
- **图片 alt**：部分页面img缺少alt

**MindSpore 文档**

- **sitemap**：lastmod，所有文档数量过多
- **TDK**：文档的准确的description待补充
- **标签结构**：具体文档的标签结构无法由我们保证效果
- **图片 alt**：具体文档的img alt无法由我们保证效果

**openUBMC官网**

- **sitemap**：部分动态路由页面的lastmod缺少
- **TDK**：下载页面的title非SSG渲染，待排查
- **a标签**：首页友情链接部分，纯图片链接缺少alt
- **图片 alt**：部分页面img缺少alt

**openUBMC 文档**

- **TDK**：文档的准确的description待补充
- **标签结构**：具体文档的标签结构无法由我们保证效果
- **图片 alt**：具体文档的img alt无法由我们保证效果

**HiFloat**

## Issue / PR 统计

| 项目 | Issue 数 | PR 数 |
|------|----------|-------|
| _尚未运行 fetch-prs.mjs，执行 `node workflow/scripts/fetch-prs.mjs` 生成_ | - | - |

## 自动化检测状态

| 措施 | 检测脚本 | stats 文件 | 上次运行 |
|------|----------|------------|----------|
| robots.txt | `check-robots.mjs` | robots-stats.json | ✅ 2026-10-13T03:32:36.882Z |
| llms.txt | `check-llms-txt.mjs` | llms-txt-stats.json | ⏳ 未运行 |
| sitemap | `check-sitemap.mjs` | sitemap-stats.json | ⏳ 未运行 |
| JSON-LD | `check-jsonld.mjs` | jsonld-stats.json | ⏳ 未运行 |
| TDK | `check-tdk.mjs` | tdk-stats.json | ⏳ 未运行 |
| a标签语义 | `check-a-tag.mjs` | a-tag-stats.json | ⏳ 未运行 |
| 标签结构 | `check-tag-structure.mjs` | tag-structure-stats.json | ⏳ 未运行 |
| 图片alt | `check-image-alt.mjs` | image-alt-stats.json | ⏳ 未运行 |

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
- [定时检查自动报告](../scheduled-reports/)
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
