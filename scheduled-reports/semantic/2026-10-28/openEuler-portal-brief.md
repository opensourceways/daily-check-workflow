# HTML 语义化检查简短报告 · openEuler 官网（openEuler-portal）

- 检查时间：2026-10-28T11:29:22.557Z
- 规范来源：**measures/10-HTML-semantic-check/规范.md「检查细节」**（header/footer/main/h1~h6/img alt/a 的缺失·重复·层级结构判定）；06/07/08 未覆盖项（黑名单文本、外链 noopener、失效锚点、alt 质量等）为附加项
检查抽样范围：门户类 = 首页（meta-refresh 跟随）+ 至多 4 个 sitemap 栏目页；文档类 = /zh/、/en/ 文档首页
- 解析口径：线上静态/SSR HTML 剔除 `<script>`/`<style>`/注释/`<noscript>` 后构建元素树；不含 JS 运行时插入的 DOM
- 可见性判定：仅能静态识别 `aria-hidden`（值非 false）、`hidden`、行内 `style="display:none"`；class/媒体查询控制的显隐无法判定，「多个同时可见」存在误报可能，请打开页面复核
- 顶层判定：`<header>`/`<footer>` 非 Sectioning Content（article/aside/main/section）或 `<nav>` 的后代即顶层候选

### openEuler 官网（openEuler-portal） — ❌

| 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 |
| --- | --- | --- | --- | --- |
| 5 | 49 | 78 | 8 | 0 |

## 问题分类摘要（每类最多列 5 个页面）


**缺顶层 `<header>`（banner）**（[10·header/footer] ❌）：5 处，涉及 5 个页面
- https://www.openeuler.org/en/
- https://www.openeuler.org/zh/om/
- https://www.openeuler.org/en/faq/
- https://www.openeuler.org/zh/oEEP/
- https://www.openeuler.org/zh/nestos/

**缺 `<h1>` 或 `<h1>` 内无可见文本**（[10·h1~h6] ❌）：1 处，涉及 1 个页面
- https://www.openeuler.org/zh/oEEP/

**标题层级跳级**（[10·h1~h6] ❌）：3 处，涉及 3 个页面
- https://www.openeuler.org/en/
- https://www.openeuler.org/zh/om/
- https://www.openeuler.org/zh/nestos/

**`<img>` 不存在 alt 属性**（[10·img] ❌）：34 处，涉及 5 个页面
- https://www.openeuler.org/en/
- https://www.openeuler.org/zh/om/
- https://www.openeuler.org/en/faq/
- https://www.openeuler.org/zh/oEEP/
- https://www.openeuler.org/zh/nestos/

**`<a>` 不存在 href 属性**（[10·a] ❌）：1 处，涉及 1 个页面
- https://www.openeuler.org/zh/nestos/

**`<a>` 内无可见文本（或仅含无 alt 的 `<img>`）**（[10·a] ❌）：5 处，涉及 5 个页面
- https://www.openeuler.org/en/
- https://www.openeuler.org/zh/om/
- https://www.openeuler.org/en/faq/
- https://www.openeuler.org/zh/oEEP/
- https://www.openeuler.org/zh/nestos/

**无语义链接文本**（[06·附加] ❌）：3 处，涉及 2 个页面
- https://www.openeuler.org/en/
- https://www.openeuler.org/en/faq/

**外链 target=_blank 缺 rel=noopener**（[06·附加] ❌）：75 处，涉及 5 个页面
- https://www.openeuler.org/en/
- https://www.openeuler.org/zh/om/
- https://www.openeuler.org/en/faq/
- https://www.openeuler.org/zh/oEEP/
- https://www.openeuler.org/zh/nestos/

**同页 alt 大量重复**（[08·附加] ⚠️）：2 处，涉及 2 个页面
- https://www.openeuler.org/en/
- https://www.openeuler.org/en/faq/

**alt 超过 125 字符**（[08·附加] ⚠️）：1 处，涉及 1 个页面
- https://www.openeuler.org/en/

**缺 `<nav>` 区块**（[07·附加] ⚠️）：5 处，涉及 5 个页面
- https://www.openeuler.org/en/
- https://www.openeuler.org/zh/om/
- https://www.openeuler.org/en/faq/
- https://www.openeuler.org/zh/oEEP/
- https://www.openeuler.org/zh/nestos/

