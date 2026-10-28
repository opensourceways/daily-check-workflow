# HTML 语义化检查完全版报告 · openUBMC 官网（openUBMC-portal）

- 检查时间：2026-10-28T11:29:22.557Z
- 规范来源：**measures/10-HTML-semantic-check/规范.md「检查细节」**（header/footer/main/h1~h6/img alt/a 的缺失·重复·层级结构判定）；06/07/08 未覆盖项（黑名单文本、外链 noopener、失效锚点、alt 质量等）为附加项
检查抽样范围：门户类 = 首页（meta-refresh 跟随）+ 至多 4 个 sitemap 栏目页；文档类 = /zh/、/en/ 文档首页
- 解析口径：线上静态/SSR HTML 剔除 `<script>`/`<style>`/注释/`<noscript>` 后构建元素树；不含 JS 运行时插入的 DOM
- 可见性判定：仅能静态识别 `aria-hidden`（值非 false）、`hidden`、行内 `style="display:none"`；class/媒体查询控制的显隐无法判定，「多个同时可见」存在误报可能，请打开页面复核
- 顶层判定：`<header>`/`<footer>` 非 Sectioning Content（article/aside/main/section）或 `<nav>` 的后代即顶层候选

### openUBMC 官网（openUBMC-portal） — ❌

| 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 |
| --- | --- | --- | --- | --- |
| 5 | 15 | 0 | 2 | 0 |

## 抽查页面

- https://www.openubmc.cn/ → https://www.openubmc.cn/zh（HTTP 200 ✅）
- https://www.openubmc.cn/en/sig（HTTP 200 ✅）
- https://www.openubmc.cn/en/news（HTTP 200 ✅）
- https://www.openubmc.cn/en/blogs（HTTP 200 ✅）
- https://www.openubmc.cn/en/legal（HTTP 200 ✅）

## 逐页明细

#### https://www.openubmc.cn/zh

- 规模：链接 142 个，图片 90 张，div 715 个，语义区块 10 个（header 3/nav 3/main 1/article 0/section 2/aside 0/footer 1），标题序列 h1,h2,h2,h3,h3,h3,h2,h2,h2
- ❌ [10·header/footer] 多个同时可见的顶层 `<header>`：1 处
    - visible=3，classes=app-header.ly-header / app-header.ly-header / header.app-o-header
- ❌ [10·header/footer] `<header>`/`<footer>` 互为祖先/后代（自嵌套）：1 处
    - outer=header，inner=header，cls=header.app-o-header
- ❌ [10·img] `<img>` 不存在 alt 属性：1 处
    - src=data:image/svg+xml,%3csvg%20version=&#39;1.1&#39;%20xmlns=&#39;http://www.w3.org/2000/svg&#39;%20wid…
- ⚠️ [08·附加] 同页 alt 大量重复：2 处
    - alt=软通华方，count=3
    - alt=昆仑太科，count=3

#### https://www.openubmc.cn/en/sig

- 规模：链接 80 个，图片 9 张，div 413 个，语义区块 11 个（header 5/nav 2/main 1/article 0/section 2/aside 0/footer 1），标题序列 h1,h3,h3
- ❌ [10·header/footer] 多个同时可见的顶层 `<header>`：1 处
    - visible=3，classes=app-header.ly-header / app-header.ly-header / header.app-o-header
- ❌ [10·header/footer] `<header>`/`<footer>` 互为祖先/后代（自嵌套）：1 处
    - outer=header，inner=header，cls=header.app-o-header
- ❌ [10·h1~h6] 标题层级跳级：1 处
    - from=h1，to=h3，text=SIG Application Process
- ❌ [10·img] `<img>` 不存在 alt 属性：2 处
    - src=/assets/sig1.CUQ-VoR5.png
    - src=/assets/sig2.BffnOEUN.png
- ❌ [10·a] `<a>` 不存在 href 属性：1 处
    - text=Create Meeting，cls=hover-underline

#### https://www.openubmc.cn/en/news

- 规模：链接 81 个，图片 13 张，div 389 个，语义区块 7 个（header 3/nav 2/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1
- ❌ [10·header/footer] 多个同时可见的顶层 `<header>`：1 处
    - visible=3，classes=app-header.ly-header / app-header.ly-header / header.app-o-header
- ❌ [10·header/footer] `<header>`/`<footer>` 互为祖先/后代（自嵌套）：1 处
    - outer=header，inner=header，cls=header.app-o-header

#### https://www.openubmc.cn/en/blogs

- 规模：链接 93 个，图片 15 张，div 450 个，语义区块 7 个（header 3/nav 2/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1
- ❌ [10·header/footer] 多个同时可见的顶层 `<header>`：1 处
    - visible=3，classes=app-header.ly-header / app-header.ly-header / header.app-o-header
- ❌ [10·header/footer] `<header>`/`<footer>` 互为祖先/后代（自嵌套）：1 处
    - outer=header，inner=header，cls=header.app-o-header

#### https://www.openubmc.cn/en/legal

- 规模：链接 76 个，图片 6 张，div 270 个，语义区块 7 个（header 3/nav 2/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2
- ❌ [10·header/footer] 多个同时可见的顶层 `<header>`：1 处
    - visible=3，classes=app-header.ly-header / app-header.ly-header / header.app-o-header
- ❌ [10·header/footer] `<header>`/`<footer>` 互为祖先/后代（自嵌套）：1 处
    - outer=header，inner=header，cls=header.app-o-header

