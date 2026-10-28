# HTML 语义化检查完全版报告 · MindSpore 官网（MindSpore-portal）

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

## 抽查页面

- https://www.mindspore.cn/（HTTP 200 ✅）
- https://www.mindspore.cn/msg（HTTP 200 ✅）
- https://www.mindspore.cn/sig（HTTP 200 ✅）
- https://www.mindspore.cn/lite（HTTP 200 ✅）
- https://www.mindspore.cn/news（HTTP 200 ✅）

## 逐页明细

#### https://www.mindspore.cn/

- 规模：链接 90 个，图片 197 张，div 771 个，语义区块 20 个（header 9/nav 0/main 1/article 0/section 9/aside 0/footer 1），标题序列 h4,h4,h4,h4,h1,h2,h2,h2,h3,h2,h2,h3,h2,h2,h3,h2
- ❌ [10·img] `<img>` 不存在 alt 属性：186 处
    - src=/_static/banner-deepseek1.Dp7n-ipe.jpg
    - src=/_static/banner.Dgo9jnSR.jpg
    - src=/_static/banner_internship.BzqLHdp0.jpg
    - src=/_static/banner-hackathon.K8u31IXb.jpg
    - src=data:image/svg+xml,%3csvg%20version=&#39;1.1&#39;%20xmlns=&#39;http://www.w3.org/2000/svg&#39;%20wid…
    - src=data:image/svg+xml,%3csvg%20version=&#39;1.1&#39;%20xmlns=&#39;http://www.w3.org/2000/svg&#39;%20wid…
    - src=data:image/svg+xml,%3csvg%20version=&#39;1.1&#39;%20xmlns=&#39;http://www.w3.org/2000/svg&#39;%20wid…
    - src=data:image/svg+xml,%3csvg%20version=&#39;1.1&#39;%20xmlns=&#39;http://www.w3.org/2000/svg&#39;%20wid…
    - src=/_static/tutorials1.IvMBFTkC.png
    - src=/_static/tutorials2.C8V0x5CM.png
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

#### https://www.mindspore.cn/msg

- 规模：链接 72 个，图片 13 张，div 334 个，语义区块 10 个（header 4/nav 1/main 1/article 0/section 3/aside 0/footer 1），标题序列 h1,h2,h2,h2,h3,h2
- ❌ [10·img] `<img>` 不存在 alt 属性：1 处
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABD5JREFUeF7tmV…

#### https://www.mindspore.cn/sig

- 规模：链接 74 个，图片 13 张，div 288 个，语义区块 9 个（header 4/nav 0/main 1/article 0/section 3/aside 0/footer 1），标题序列 h1,h2,h2,h2
- ❌ [10·img] `<img>` 不存在 alt 属性：8 处
    - src=/_static/sig1.C4E6h1il.jpg
    - src=/_static/sig2.2yaNx28a.jpg
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAMCAYAAADf7cuOAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKg…
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAMCAYAAADf7cuOAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKg…
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAMCAYAAADf7cuOAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKg…
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAMCAYAAADf7cuOAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKg…
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAMCAYAAADf7cuOAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKg…
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABD5JREFUeF7tmV…
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

#### https://www.mindspore.cn/lite

- 规模：链接 76 个，图片 6 张，div 271 个，语义区块 8 个（header 3/nav 0/main 1/article 0/section 3/aside 0/footer 1），标题序列 h3,h2,h2
- ❌ [10·h1~h6] 缺 `<h1>` 或 `<h1>` 内无可见文本：1 处
    - existingH1=0，note=静态 HTML 无可见的 &lt;h1&gt;
- ❌ [10·img] `<img>` 不存在 alt 属性：2 处
    - src=/_static/cover-light.D65ulCn2.png
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABD5JREFUeF7tmV…
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

#### https://www.mindspore.cn/news

- 规模：链接 71 个，图片 6 张，div 198 个，语义区块 3 个（header 1/nav 0/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1
- ❌ [10·img] `<img>` 不存在 alt 属性：1 处
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABD5JREFUeF7tmV…
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

