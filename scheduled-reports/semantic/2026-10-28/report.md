# HTML 元素语义化规范抽查报告

- 检查时间：2026-10-28T11:29:22.557Z
- 运行模式：提 issue（--submit-issues）
- 规范来源：**measures/10-HTML-semantic-check/规范.md「检查细节」**（header/footer/main/h1~h6/img alt/a 的缺失·重复·层级结构判定）；06/07/08 未覆盖项（黑名单文本、外链 noopener、失效锚点、alt 质量等）为附加项
检查抽样范围：门户类 = 首页（meta-refresh 跟随）+ 至多 4 个 sitemap 栏目页；文档类 = /zh/、/en/ 文档首页
- 解析口径：线上静态/SSR HTML 剔除 `<script>`/`<style>`/注释/`<noscript>` 后构建元素树；不含 JS 运行时插入的 DOM
- 可见性判定：仅能静态识别 `aria-hidden`（值非 false）、`hidden`、行内 `style="display:none"`；class/媒体查询控制的显隐无法判定，「多个同时可见」存在误报可能，请打开页面复核
- 顶层判定：`<header>`/`<footer>` 非 Sectioning Content（article/aside/main/section）或 `<nav>` 的后代即顶层候选
- 判定：error 级为规范/附加必选项违规（❌），warn 级为建议项（⚠️）；客户端渲染壳页面记附加项，不做元素级检查；有 error 级问题即触发提 issue

## 总览

| 项目 | 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 | 结论 |
| --- | --- | --- | --- | --- | --- | --- |
| openEuler 官网（openEuler-portal） | 5 | 49 | 78 | 8 | 0 | ❌，[issue](https://atomgit.com/openeuler/openEuler-portal/issues/368) |
| openEuler 文档（openEuler-docs） | 2 | 34 | 36 | 2 | 0 | ❌，[issue](https://atomgit.com/openeuler/docs-website/issues/82) |
| openGauss 官网（openGauss-portal） | 5 | 22 | 3 | 0 | 0 | ❌，[issue](https://atomgit.com/opengauss/website/issues/455) |
| openGauss 文档（openGauss-docs） | 2 | 21 | 0 | 2 | 0 | ❌，[issue](https://atomgit.com/opengauss/docs-website/issues/40) |
| MindSpore 官网（MindSpore-portal） | 5 | 199 | 0 | 4 | 0 | ❌，[issue](https://atomgit.com/mindspore/mindspore-portal/issues/305) |
| openUBMC 官网（openUBMC-portal） | 5 | 15 | 0 | 2 | 0 | ❌，[issue](https://atomgit.com/openUBMC/website/issues/318) |
| openUBMC 文档（openUBMC-docs） | 2 | 0 | 2 | 0 | 0 | ❌，[issue](https://atomgit.com/openUBMC/docs-website/issues/25) |
| UnifiedBus（UnifiedBus） | 5 | 6 | 3 | 2 | 0 | ❌，[issue](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/118) |
| HiFloat（HiFloat） | 5 | 5 | 17 | 5 | 0 | ❌，[issue](https://atomgit.com/hifloat/hifloat-portal/issues/47) |

## 问题类型汇总

| 组 | 来源 | 级别 | 问题类型 | 总次数 | 涉及项目（次数） |
| --- | --- | --- | --- | --- | --- |
| header/footer | 10 检查细节 | ❌ | 多个同时可见的顶层 `<header>` | 7 | openUBMC-portal(5)、UnifiedBus(2) |
| header/footer | 10 检查细节 | ❌ | 缺顶层 `<header>`（banner） | 9 | openEuler-portal(5)、openEuler-docs(2)、openGauss-docs(2) |
| header/footer | 10 检查细节 | ❌ | `<header>`/`<footer>` 互为祖先/后代（自嵌套） | 7 | openUBMC-portal(5)、UnifiedBus(2) |
| h1~h6 | 10 检查细节 | ❌ | 缺 `<h1>` 或 `<h1>` 内无可见文本 | 2 | openEuler-portal(1)、MindSpore-portal(1) |
| h1~h6 | 10 检查细节 | ❌ | 标题层级跳级 | 4 | openEuler-portal(3)、openUBMC-portal(1) |
| img | 10 检查细节 | ❌ | `<img>` 不存在 alt 属性 | 308 | MindSpore-portal(198)、openEuler-portal(34)、openEuler-docs(30)、openGauss-portal(22)、openGauss-docs(19)、openUBMC-portal(3)、UnifiedBus(2) |
| a | 10 检查细节 | ❌ | `<a>` 不存在 href 属性 | 2 | openEuler-portal(1)、openUBMC-portal(1) |
| a | 10 检查细节 | ❌ | `<a>` 内无可见文本（或仅含无 alt 的 `<img>`） | 12 | openEuler-portal(5)、HiFloat(5)、openEuler-docs(2) |
| 附加 | 06 附加 | ❌ | 无语义链接文本 | 3 | openEuler-portal(3) |
| 附加 | 06 附加 | ❌ | 外链 target=_blank 缺 rel=noopener | 131 | openEuler-portal(75)、openEuler-docs(36)、HiFloat(17)、openGauss-portal(3) |
| 附加 | 07 附加 | ❌ | 页面为客户端渲染壳，静态 HTML 无实质内容 | 5 | UnifiedBus(3)、openUBMC-docs(2) |
| 附加 | 08 附加 | ⚠️ | 同页 alt 大量重复 | 6 | openEuler-portal(2)、openUBMC-portal(2)、UnifiedBus(2) |
| 附加 | 08 附加 | ⚠️ | alt 超过 125 字符 | 1 | openEuler-portal(1) |
| 附加 | 07 附加 | ⚠️ | 缺 `<nav>` 区块 | 18 | openEuler-portal(5)、HiFloat(5)、MindSpore-portal(4)、openEuler-docs(2)、openGauss-docs(2) |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 `<项目ID>-full.md`）
- openEuler 官网（openEuler-portal）：`scheduled-reports/semantic/2026-10-28/openEuler-portal-full.md`，issue：https://atomgit.com/openeuler/openEuler-portal/issues/368
- openEuler 文档（openEuler-docs）：`scheduled-reports/semantic/2026-10-28/openEuler-docs-full.md`，issue：https://atomgit.com/openeuler/docs-website/issues/82
- openGauss 官网（openGauss-portal）：`scheduled-reports/semantic/2026-10-28/openGauss-portal-full.md`，issue：https://atomgit.com/opengauss/website/issues/455
- openGauss 文档（openGauss-docs）：`scheduled-reports/semantic/2026-10-28/openGauss-docs-full.md`，issue：https://atomgit.com/opengauss/docs-website/issues/40
- MindSpore 官网（MindSpore-portal）：`scheduled-reports/semantic/2026-10-28/MindSpore-portal-full.md`，issue：https://atomgit.com/mindspore/mindspore-portal/issues/305
- openUBMC 官网（openUBMC-portal）：`scheduled-reports/semantic/2026-10-28/openUBMC-portal-full.md`，issue：https://atomgit.com/openUBMC/website/issues/318
- openUBMC 文档（openUBMC-docs）：`scheduled-reports/semantic/2026-10-28/openUBMC-docs-full.md`，issue：https://atomgit.com/openUBMC/docs-website/issues/25
- UnifiedBus（UnifiedBus）：`scheduled-reports/semantic/2026-10-28/UnifiedBus-full.md`，issue：https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/118
- HiFloat（HiFloat）：`scheduled-reports/semantic/2026-10-28/HiFloat-full.md`，issue：https://atomgit.com/hifloat/hifloat-portal/issues/47

## 跳过/查重拦截

- MindSpore 文档（MindSpore-docs）：默认跳过（MindSpore-docs 本次不检查；用 --skip= 传空可强制检查）
