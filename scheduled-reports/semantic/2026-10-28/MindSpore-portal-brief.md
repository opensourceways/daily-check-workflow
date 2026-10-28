# HTML 语义化检查简短报告 · MindSpore 官网（MindSpore-portal）

- 检查时间：2026-10-28T11:29:22.557Z
- 规范来源：**measures/10-HTML-semantic-check/规范.md「检查细节」**（header/footer/main/h1~h6/img alt/a 的缺失·重复·层级结构判定）；06/07/08 未覆盖项（黑名单文本、外链 noopener、失效锚点、alt 质量等）为附加项
检查抽样范围：门户类 = 首页（meta-refresh 跟随）+ 至多 4 个 sitemap 栏目页；文档类 = /zh/、/en/ 文档首页
- 解析口径：线上静态/SSR HTML 剔除 `<script>`/`<style>`/注释/`<noscript>` 后构建元素树；不含 JS 运行时插入的 DOM
- 可见性判定：仅能静态识别 `aria-hidden`（值非 false）、`hidden`、行内 `style="display:none"`；class/媒体查询控制的显隐无法判定，「多个同时可见」存在误报可能，请打开页面复核
- 顶层判定：`<header>`/`<footer>` 非 Sectioning Content（article/aside/main/section）或 `<nav>` 的后代即顶层候选

### MindSpore 官网（MindSpore-portal） — ❌

| 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 |
| --- | --- | --- | --- | --- |
| 5 | 199 | 0 | 4 | 0 |

## 问题分类摘要（每类最多列 5 个页面）


**缺 `<h1>` 或 `<h1>` 内无可见文本**（[10·h1~h6] ❌）：1 处，涉及 1 个页面
- https://www.mindspore.cn/lite

**`<img>` 不存在 alt 属性**（[10·img] ❌）：198 处，涉及 5 个页面
- https://www.mindspore.cn/
- https://www.mindspore.cn/msg
- https://www.mindspore.cn/sig
- https://www.mindspore.cn/lite
- https://www.mindspore.cn/news

**缺 `<nav>` 区块**（[07·附加] ⚠️）：4 处，涉及 4 个页面
- https://www.mindspore.cn/
- https://www.mindspore.cn/sig
- https://www.mindspore.cn/lite
- https://www.mindspore.cn/news

