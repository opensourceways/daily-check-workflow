# HTML 元素语义化规范抽查报告

- 检查时间：2026-10-22T13:09:49.841Z
- 运行模式：提 issue（--submit-issues，dry-run）
- 指定项目：--site=openEuler-portal
- 规范来源：**measures/10-HTML-semantic-check/规范.md「检查细节」**（header/footer/main/h1~h6/img alt/a 的缺失·重复·层级结构判定）；06/07/08 未覆盖项（黑名单文本、外链 noopener、失效锚点、alt 质量等）为附加项
检查抽样范围：门户类 = 首页（meta-refresh 跟随）+ 至多 4 个 sitemap 栏目页；文档类 = /zh/、/en/ 文档首页
- 解析口径：线上静态/SSR HTML 剔除 `<script>`/`<style>`/注释/`<noscript>` 后构建元素树；不含 JS 运行时插入的 DOM
- 可见性判定：仅能静态识别 `aria-hidden`（值非 false）、`hidden`、行内 `style="display:none"`；class/媒体查询控制的显隐无法判定，「多个同时可见」存在误报可能，请打开页面复核
- 顶层判定：`<header>`/`<footer>` 非 Sectioning Content（article/aside/main/section）或 `<nav>` 的后代即顶层候选
- 判定：error 级为规范/附加必选项违规（❌），warn 级为建议项（⚠️）；客户端渲染壳页面记附加项，不做元素级检查；有 error 级问题即触发提 issue

## 总览

| 项目 | 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 | 结论 |
| --- | --- | --- | --- | --- | --- | --- |
| openEuler 官网（openEuler-portal） | 5 | 68 | 78 | 7 | 0 | ❌（dry-run 未提交） |

## 问题类型汇总

| 组 | 来源 | 级别 | 问题类型 | 总次数 | 涉及项目（次数） |
| --- | --- | --- | --- | --- | --- |
| header/footer | 10 检查细节 | ❌ | 缺顶层 `<header>`（banner） | 5 | openEuler-portal(5) |
| h1~h6 | 10 检查细节 | ❌ | 缺 `<h1>` 或 `<h1>` 内无可见文本 | 1 | openEuler-portal(1) |
| h1~h6 | 10 检查细节 | ❌ | 标题层级跳级 | 3 | openEuler-portal(3) |
| img | 10 检查细节 | ❌ | `<img>` 不存在 alt 属性 | 44 | openEuler-portal(44) |
| a | 10 检查细节 | ❌ | `<a>` 不存在 href 属性 | 1 | openEuler-portal(1) |
| a | 10 检查细节 | ❌ | `<a>` 内无可见文本（或仅含无 alt 的 `<img>`） | 14 | openEuler-portal(14) |
| 附加 | 06 附加 | ❌ | 无语义链接文本 | 3 | openEuler-portal(3) |
| 附加 | 06 附加 | ❌ | 外链 target=_blank 缺 rel=noopener | 75 | openEuler-portal(75) |
| 附加 | 08 附加 | ⚠️ | 同页 alt 大量重复 | 2 | openEuler-portal(2) |
| 附加 | 07 附加 | ⚠️ | 缺 `<nav>` 区块 | 5 | openEuler-portal(5) |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 `<项目ID>-full.md`）
- openEuler 官网（openEuler-portal）：`（dry-run 未写文件）`，（dry-run 未提交）

## 跳过/查重拦截

- 无
