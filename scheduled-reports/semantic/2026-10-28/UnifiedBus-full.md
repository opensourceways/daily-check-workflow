# HTML 语义化检查完全版报告 · UnifiedBus（UnifiedBus）

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

## 抽查页面

- https://www.unifiedbus.com/（HTTP 200 ✅）
- https://www.unifiedbus.com/en/guid（HTTP 200 ✅）
- https://www.unifiedbus.com/en/news（HTTP 200 ✅）
- https://www.unifiedbus.com/en/legal（HTTP 200 ✅）
- https://www.unifiedbus.com/en/conduct（HTTP 200 ✅）

## 逐页明细

#### https://www.unifiedbus.com/

- 规模：链接 0 个，图片 0 张，div 2 个，语义区块 0 个（header 0/nav 0/main 0/article 0/section 0/aside 0/footer 0），标题序列 (无)
- ℹ️ 客户端渲染壳，静态 HTML 无实质内容（搜索引擎/AI 无法解析其语义结构）
- ❌ [07·附加] 页面为客户端渲染壳，静态 HTML 无实质内容：1 处
    - url=https://www.unifiedbus.com/

#### https://www.unifiedbus.com/en/guid

- 规模：链接 0 个，图片 0 张，div 2 个，语义区块 0 个（header 0/nav 0/main 0/article 0/section 0/aside 0/footer 0），标题序列 (无)
- ℹ️ 客户端渲染壳，静态 HTML 无实质内容（搜索引擎/AI 无法解析其语义结构）
- ❌ [07·附加] 页面为客户端渲染壳，静态 HTML 无实质内容：1 处
    - url=https://www.unifiedbus.com/en/guid

#### https://www.unifiedbus.com/en/news

- 规模：链接 16 个，图片 9 张，div 117 个，语义区块 6 个（header 3/nav 1/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1
- ❌ [10·header/footer] 多个同时可见的顶层 `<header>`：1 处
    - visible=3，classes=app-header.app-header-mobile.ly-header / app-header.app-header-pc.ly-header / header.app-o-header
- ❌ [10·header/footer] `<header>`/`<footer>` 互为祖先/后代（自嵌套）：1 处
    - outer=header，inner=header，cls=header.app-o-header
- ❌ [10·img] `<img>` 不存在 alt 属性：2 处
    - src=/category/news/2025-09-18/250918-02.jpg
    - src=/category/news/2025-09-18/250918-02.jpg
- ⚠️ [08·附加] 同页 alt 大量重复：1 处
    - alt=UnifiedBus，count=4

#### https://www.unifiedbus.com/en/legal

- 规模：链接 0 个，图片 0 张，div 2 个，语义区块 0 个（header 0/nav 0/main 0/article 0/section 0/aside 0/footer 0），标题序列 (无)
- ℹ️ 客户端渲染壳，静态 HTML 无实质内容（搜索引擎/AI 无法解析其语义结构）
- ❌ [07·附加] 页面为客户端渲染壳，静态 HTML 无实质内容：1 处
    - url=https://www.unifiedbus.com/en/legal

#### https://www.unifiedbus.com/en/conduct

- 规模：链接 14 个，图片 7 张，div 70 个，语义区块 6 个（header 3/nav 1/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1
- ❌ [10·header/footer] 多个同时可见的顶层 `<header>`：1 处
    - visible=3，classes=app-header.app-header-mobile.ly-header / app-header.app-header-pc.ly-header / header.app-o-header
- ❌ [10·header/footer] `<header>`/`<footer>` 互为祖先/后代（自嵌套）：1 处
    - outer=header，inner=header，cls=header.app-o-header
- ⚠️ [08·附加] 同页 alt 大量重复：1 处
    - alt=UnifiedBus，count=4

