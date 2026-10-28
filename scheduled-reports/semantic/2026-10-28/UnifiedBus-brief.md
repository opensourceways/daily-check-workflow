# HTML 语义化检查简短报告 · UnifiedBus（UnifiedBus）

- 检查时间：2026-10-28T11:29:22.557Z
- 规范来源：**measures/10-HTML-semantic-check/规范.md「检查细节」**（header/footer/main/h1~h6/img alt/a 的缺失·重复·层级结构判定）；06/07/08 未覆盖项（黑名单文本、外链 noopener、失效锚点、alt 质量等）为附加项
检查抽样范围：门户类 = 首页（meta-refresh 跟随）+ 至多 4 个 sitemap 栏目页；文档类 = /zh/、/en/ 文档首页
- 解析口径：线上静态/SSR HTML 剔除 `<script>`/`<style>`/注释/`<noscript>` 后构建元素树；不含 JS 运行时插入的 DOM
- 可见性判定：仅能静态识别 `aria-hidden`（值非 false）、`hidden`、行内 `style="display:none"`；class/媒体查询控制的显隐无法判定，「多个同时可见」存在误报可能，请打开页面复核
- 顶层判定：`<header>`/`<footer>` 非 Sectioning Content（article/aside/main/section）或 `<nav>` 的后代即顶层候选

### UnifiedBus（UnifiedBus） — ❌

| 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 |
| --- | --- | --- | --- | --- |
| 5 | 6 | 3 | 2 | 0 |

## 问题分类摘要（每类最多列 5 个页面）


**多个同时可见的顶层 `<header>`**（[10·header/footer] ❌）：2 处，涉及 2 个页面
- https://www.unifiedbus.com/en/news
- https://www.unifiedbus.com/en/conduct

**`<header>`/`<footer>` 互为祖先/后代（自嵌套）**（[10·header/footer] ❌）：2 处，涉及 2 个页面
- https://www.unifiedbus.com/en/news
- https://www.unifiedbus.com/en/conduct

**`<img>` 不存在 alt 属性**（[10·img] ❌）：2 处，涉及 1 个页面
- https://www.unifiedbus.com/en/news

**页面为客户端渲染壳，静态 HTML 无实质内容**（[07·附加] ❌）：3 处，涉及 3 个页面
- https://www.unifiedbus.com/
- https://www.unifiedbus.com/en/guid
- https://www.unifiedbus.com/en/legal

**同页 alt 大量重复**（[08·附加] ⚠️）：2 处，涉及 2 个页面
- https://www.unifiedbus.com/en/news
- https://www.unifiedbus.com/en/conduct

