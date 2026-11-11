# HTML 元素语义化规范抽查报告

- 检查时间：2026-11-11T12:52:31.677Z
- 运行模式：提 issue（--submit-issues）
- 规范来源：**measures/10-HTML-semantic-check/规范.md「检查细节」**（header/footer/main/h1~h6/img alt/a 的缺失·重复·层级结构判定）；06/07/08 未覆盖项（黑名单文本、外链 noopener、失效锚点、alt 质量等）为附加项
检查抽样范围：门户类 = 首页（meta-refresh 跟随）+ 至多 4 个 sitemap 栏目页；文档类 = /zh/、/en/ 文档首页
- 解析口径：线上静态/SSR HTML 剔除 `<script>`/`<style>`/注释/`<noscript>` 后构建元素树；不含 JS 运行时插入的 DOM
- 可见性判定：仅能静态识别 `aria-hidden`（值非 false）、`hidden`、行内 `style="display:none"`；class/媒体查询控制的显隐无法判定，「多个同时可见」存在误报可能，请打开页面复核
- 顶层判定：`<header>`/`<footer>` 非 Sectioning Content（article/aside/main/section）或 `<nav>` 的后代即顶层候选
- nav 判定：不要求页面必须有 `<nav>`；存在多个 `<nav>` 时每个须有 `aria-label` 或 `aria-labelledby`（空值视同缺失），且同类属性的值不得跨 nav 重复（`aria-label` 与 `aria-labelledby` 之间互不比较）；仅一个 `<nav>` 时不检查
- 判定：error 级为规范/附加必选项违规（❌），warn 级为建议项（⚠️）；客户端渲染壳页面记附加项，不做元素级检查；有 error 级问题即触发提 issue

## 总览

| 项目 | 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 | 结论 |
| --- | --- | --- | --- | --- | --- | --- |
| openEuler 官网（openEuler-portal） | 5 | 15 | 5 | 77 | 0 | ❌，[issue](https://atomgit.com/openeuler/openEuler-portal/issues/390) |
| openEuler 文档（openEuler-docs） | - | - | - | - | - | ⏭️ 已有未关闭 issue，跳过 |
| openGauss 官网（openGauss-portal） | - | - | - | - | - | ⏭️ 已有未关闭 issue，跳过 |
| openGauss 文档（openGauss-docs） | - | - | - | - | - | ⏭️ 已有未关闭 issue，跳过 |
| MindSpore 官网（MindSpore-portal） | - | - | - | - | - | ⏭️ 已有未关闭 issue，跳过 |
| openUBMC 官网（openUBMC-portal） | - | - | - | - | - | ⏭️ 已有未关闭 issue，跳过 |
| openUBMC 文档（openUBMC-docs） | - | - | - | - | - | ⏭️ 已有未关闭 issue，跳过 |
| UnifiedBus（UnifiedBus） | - | - | - | - | - | ⏭️ 已有未关闭 issue，跳过 |
| HiFloat（HiFloat） | - | - | - | - | - | ⏭️ 已有未关闭 issue，跳过 |

## 问题类型汇总

| 组 | 来源 | 级别 | 问题类型 | 总次数 | 涉及项目（次数） |
| --- | --- | --- | --- | --- | --- |
| h1~h6 | 10 检查细节 | ❌ | 缺 `<h1>` 或 `<h1>` 内无可见文本 | 1 | openEuler-portal(1) |
| h1~h6 | 10 检查细节 | ❌ | 标题层级跳级 | 3 | openEuler-portal(3) |
| img | 10 检查细节 | ❌ | `<img>` 不存在 alt 属性 | 8 | openEuler-portal(8) |
| a | 10 检查细节 | ❌ | `<a>` 不存在 href 属性 | 3 | openEuler-portal(3) |
| 附加 | 06 附加 | ❌ | 无语义链接文本 | 5 | openEuler-portal(5) |
| 附加 | 06 附加 | ⚠️ | 外链 target=_blank 缺 rel=noopener | 75 | openEuler-portal(75) |
| 附加 | 08 附加 | ⚠️ | alt 超过 125 字符 | 2 | openEuler-portal(2) |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 `<项目ID>-full.md`）
- openEuler 官网（openEuler-portal）：`scheduled-reports/semantic/2026-11-11/openEuler-portal-full.md`，issue：https://atomgit.com/openeuler/openEuler-portal/issues/390

## 跳过/查重拦截

- openEuler 文档（openEuler-docs）：已存在未关闭的 HTML 语义化 issue（#82：https://atomgit.com/openeuler/docs-website/issues/82），跳过本次扫描与提单
- openGauss 官网（openGauss-portal）：已存在未关闭的 HTML 语义化 issue（#455：https://atomgit.com/opengauss/website/issues/455），跳过本次扫描与提单
- openGauss 文档（openGauss-docs）：已存在未关闭的 HTML 语义化 issue（#40：https://atomgit.com/opengauss/docs-website/issues/40），跳过本次扫描与提单
- MindSpore 官网（MindSpore-portal）：已存在未关闭的 HTML 语义化 issue（#305：https://atomgit.com/mindspore/mindspore-portal/issues/305），跳过本次扫描与提单
- MindSpore 文档（MindSpore-docs）：默认跳过（MindSpore-docs 本次不检查；用 --skip= 传空可强制检查）
- openUBMC 官网（openUBMC-portal）：已存在未关闭的 HTML 语义化 issue（#318：https://atomgit.com/openUBMC/website/issues/318），跳过本次扫描与提单
- openUBMC 文档（openUBMC-docs）：已存在未关闭的 HTML 语义化 issue（#25：https://atomgit.com/openUBMC/docs-website/issues/25），跳过本次扫描与提单
- UnifiedBus（UnifiedBus）：已存在未关闭的 HTML 语义化 issue（#118：https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/118），跳过本次扫描与提单
- HiFloat（HiFloat）：已存在未关闭的 HTML 语义化 issue（#47：https://atomgit.com/hifloat/hifloat-portal/issues/47），跳过本次扫描与提单
