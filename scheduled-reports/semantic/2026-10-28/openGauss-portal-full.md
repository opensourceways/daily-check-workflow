# HTML 语义化检查完全版报告 · openGauss 官网（openGauss-portal）

- 检查时间：2026-10-28T11:29:22.557Z
- 规范来源：**measures/10-HTML-semantic-check/规范.md「检查细节」**（header/footer/main/h1~h6/img alt/a 的缺失·重复·层级结构判定）；06/07/08 未覆盖项（黑名单文本、外链 noopener、失效锚点、alt 质量等）为附加项
检查抽样范围：门户类 = 首页（meta-refresh 跟随）+ 至多 4 个 sitemap 栏目页；文档类 = /zh/、/en/ 文档首页
- 解析口径：线上静态/SSR HTML 剔除 `<script>`/`<style>`/注释/`<noscript>` 后构建元素树；不含 JS 运行时插入的 DOM
- 可见性判定：仅能静态识别 `aria-hidden`（值非 false）、`hidden`、行内 `style="display:none"`；class/媒体查询控制的显隐无法判定，「多个同时可见」存在误报可能，请打开页面复核
- 顶层判定：`<header>`/`<footer>` 非 Sectioning Content（article/aside/main/section）或 `<nav>` 的后代即顶层候选

### openGauss 官网（openGauss-portal） — ❌

| 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 |
| --- | --- | --- | --- | --- |
| 5 | 22 | 3 | 0 | 0 |

## 抽查页面

- https://opengauss.org/ → https://opengauss.org/zh/（HTTP 200 ✅）
- https://opengauss.org/en/cve/（HTTP 200 ✅）
- https://opengauss.org/zh/faq/（HTTP 200 ✅）
- https://opengauss.org/en/news/（HTTP 200 ✅）
- https://opengauss.org/en/ogsp/（HTTP 200 ✅）

## 逐页明细

#### https://opengauss.org/zh/

- 规模：链接 133 个，图片 444 张，div 1435 个，语义区块 20 个（header 8/nav 1/main 1/article 0/section 7/aside 0/footer 3），标题序列 h1,h2,h2,h3,h2,h2,h2,h2,h2
- ❌ [10·img] `<img>` 不存在 alt 属性：22 处
    - src=/assets/banner-605.73_MGQdB.png
    - src=/assets/banner-sig_pc.i_QnQYJI.png
    - src=/assets/banner-internship_pc.CTD2an2j.png
    - src=/assets/banner-ai-coding.hLym4bXq.png
    - src=/assets/banner-605.73_MGQdB.png
    - src=/assets/annual2025.DdsBNt4L.png
    - src=/assets/ogce.Cr436ZaY.jpg
    - src=/assets/banner-forum.CIKV-lZz.png
    - src=/assets/banner20250408.De6y0baH.jpg
    - src=/assets/banner-team-up.BctTH7Mb.jpg

#### https://opengauss.org/en/cve/

- 规模：链接 68 个，图片 6 张，div 270 个，语义区块 4 个（header 1/nav 1/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1
- ✅ 未发现规范问题

#### https://opengauss.org/zh/faq/

- 规模：链接 125 个，图片 6 张，div 296 个，语义区块 4 个（header 1/nav 1/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2,h2
- ❌ [06·附加] 外链 target=_blank 缺 rel=noopener：3 处
    - text=“学习”-&gt;“文档”，href=https://docs.opengauss.org，rel=noreferrer
    - text=“学习”-&gt;“文档”，href=https://docs.opengauss.org，rel=noreferrer
    - text=“签署 CLA”，href=https://clasign.osinfra.cn/sign/gitee_opengauss-1614047760000855378?lang=zh，rel=noreferrer

#### https://opengauss.org/en/news/

- 规模：链接 75 个，图片 13 张，div 292 个，语义区块 4 个（header 1/nav 1/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1
- ✅ 未发现规范问题

#### https://opengauss.org/en/ogsp/

- 规模：链接 69 个，图片 6 张，div 271 个，语义区块 4 个（header 1/nav 1/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1
- ✅ 未发现规范问题

