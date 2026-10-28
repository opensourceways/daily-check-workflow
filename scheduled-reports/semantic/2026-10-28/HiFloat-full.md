# HTML 语义化检查完全版报告 · HiFloat（HiFloat）

- 检查时间：2026-10-28T11:29:22.557Z
- 规范来源：**measures/10-HTML-semantic-check/规范.md「检查细节」**（header/footer/main/h1~h6/img alt/a 的缺失·重复·层级结构判定）；06/07/08 未覆盖项（黑名单文本、外链 noopener、失效锚点、alt 质量等）为附加项
检查抽样范围：门户类 = 首页（meta-refresh 跟随）+ 至多 4 个 sitemap 栏目页；文档类 = /zh/、/en/ 文档首页
- 解析口径：线上静态/SSR HTML 剔除 `<script>`/`<style>`/注释/`<noscript>` 后构建元素树；不含 JS 运行时插入的 DOM
- 可见性判定：仅能静态识别 `aria-hidden`（值非 false）、`hidden`、行内 `style="display:none"`；class/媒体查询控制的显隐无法判定，「多个同时可见」存在误报可能，请打开页面复核
- 顶层判定：`<header>`/`<footer>` 非 Sectioning Content（article/aside/main/section）或 `<nav>` 的后代即顶层候选

### HiFloat（HiFloat） — ❌

| 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 |
| --- | --- | --- | --- | --- |
| 5 | 5 | 17 | 5 | 0 |

## 抽查页面

- https://hifloat.gccorg.com/ → https://hifloat.gccorg.com/zh（HTTP 200 ✅）
- https://hifloat.gccorg.com/zh/news（HTTP 200 ✅）
- https://hifloat.gccorg.com/en/space（HTTP 200 ✅）
- https://hifloat.gccorg.com/en/activity（HTTP 200 ✅）
- https://hifloat.gccorg.com/zh/technical（HTTP 200 ✅）

## 逐页明细

#### https://hifloat.gccorg.com/zh

- 规模：链接 14 个，图片 25 张，div 175 个，语义区块 18 个（header 4/nav 0/main 1/article 0/section 12/aside 0/footer 1），标题序列 h1,h2,h2,h2,h2,h2,h3,h3,h3,h3,h3,h3,h2,h3,h3,h2
- ❌ [10·a] `<a>` 内无可见文本（或仅含无 alt 的 `<img>`）：1 处
    - href=/zh，cls=router-link-active.router-link-exact-active.header-logo
- ❌ [06·附加] 外链 target=_blank 缺 rel=noopener：4 处
    - text=开源仓库，href=https://github.com/orgs/GCC-HiFloat/repositories，rel=(无)
    - text=模拟仿真器，href=https://github.com/global-computing-consortium/HiFloat8，rel=(无)
    - text=模拟仿真器，href=https://github.com/global-computing-consortium/HiFloat4，rel=(无)
    - text=全球计算联盟，href=https://www.gccorg.com/，rel=(无)
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

#### https://hifloat.gccorg.com/zh/news

- 规模：链接 18 个，图片 0 张，div 168 个，语义区块 7 个（header 2/nav 0/main 1/article 0/section 3/aside 0/footer 1），标题序列 h1,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2
- ❌ [10·a] `<a>` 内无可见文本（或仅含无 alt 的 `<img>`）：1 处
    - href=/zh，cls=header-logo
- ❌ [06·附加] 外链 target=_blank 缺 rel=noopener：3 处
    - text=模拟仿真器，href=https://github.com/global-computing-consortium/HiFloat8，rel=(无)
    - text=模拟仿真器，href=https://github.com/global-computing-consortium/HiFloat4，rel=(无)
    - text=全球计算联盟，href=https://www.gccorg.com/，rel=(无)
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

#### https://hifloat.gccorg.com/en/space

- 规模：链接 6 个，图片 0 张，div 30 个，语义区块 5 个（header 2/nav 0/main 1/article 0/section 1/aside 0/footer 1），标题序列 h1
- ❌ [10·a] `<a>` 内无可见文本（或仅含无 alt 的 `<img>`）：1 处
    - href=/zh，cls=header-logo
- ❌ [06·附加] 外链 target=_blank 缺 rel=noopener：3 处
    - text=模拟仿真器，href=https://github.com/global-computing-consortium/HiFloat8，rel=(无)
    - text=模拟仿真器，href=https://github.com/global-computing-consortium/HiFloat4，rel=(无)
    - text=全球计算联盟，href=https://www.gccorg.com/，rel=(无)
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

#### https://hifloat.gccorg.com/en/activity

- 规模：链接 7 个，图片 4 张，div 62 个，语义区块 15 个（header 6/nav 0/main 1/article 0/section 7/aside 0/footer 1），标题序列 h1,h2,h3,h3,h3,h3
- ❌ [10·a] `<a>` 内无可见文本（或仅含无 alt 的 `<img>`）：1 处
    - href=/zh，cls=header-logo
- ❌ [06·附加] 外链 target=_blank 缺 rel=noopener：3 处
    - text=模拟仿真器，href=https://github.com/global-computing-consortium/HiFloat8，rel=(无)
    - text=模拟仿真器，href=https://github.com/global-computing-consortium/HiFloat4，rel=(无)
    - text=全球计算联盟，href=https://www.gccorg.com/，rel=(无)
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

#### https://hifloat.gccorg.com/zh/technical

- 规模：链接 11 个，图片 0 张，div 102 个，语义区块 7 个（header 2/nav 0/main 1/article 0/section 3/aside 0/footer 1），标题序列 h1,h2,h2,h2,h2,h2,h2,h2
- ❌ [10·a] `<a>` 内无可见文本（或仅含无 alt 的 `<img>`）：1 处
    - href=/zh，cls=header-logo
- ❌ [06·附加] 外链 target=_blank 缺 rel=noopener：4 处
    - text=直播回放 HiF8 HiF8数据格式及其训推应用 2026/03/23 19:0…，href=https://www.bilibili.com/video/BV1cDXwBrEWR/?spm_id_from=333.337.search-card.all.click&amp…，rel=(无)
    - text=模拟仿真器，href=https://github.com/global-computing-consortium/HiFloat8，rel=(无)
    - text=模拟仿真器，href=https://github.com/global-computing-consortium/HiFloat4，rel=(无)
    - text=全球计算联盟，href=https://www.gccorg.com/，rel=(无)
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

