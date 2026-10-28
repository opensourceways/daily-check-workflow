# HTML 语义化检查完全版报告 · openEuler 官网（openEuler-portal）

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

## 抽查页面

- https://www.openeuler.org/ → https://www.openeuler.org/en/（HTTP 200 ✅）
- https://www.openeuler.org/zh/om/（HTTP 200 ✅）
- https://www.openeuler.org/en/faq/（HTTP 200 ✅）
- https://www.openeuler.org/zh/oEEP/（HTTP 200 ✅）
- https://www.openeuler.org/zh/nestos/（HTTP 200 ✅）

## 逐页明细

#### https://www.openeuler.org/en/

- 规模：链接 57 个，图片 40 张，div 212 个，语义区块 16 个（header 5/nav 0/main 1/article 0/section 5/aside 0/footer 5），标题序列 h1,h2,h3,h2,h2,h2,h2,h4
- ❌ [10·header/footer] 缺顶层 `<header>`（banner）：1 处
    - existing=5，note=现有元素均为 Sectioning Content/nav 的后代
- ❌ [10·h1~h6] 标题层级跳级：1 处
    - from=h2，to=h4，text=Feedback
- ❌ [10·img] `<img>` 不存在 alt 属性：9 处
    - src=/assets/text.DVX5V3tZ.png
    - src=/assets/pc.CXNjaqfA.jpg
    - src=/assets/pc.EU0VZA2W.jpg
    - src=/assets/pc.DRK61pBq.jpg
    - src=/assets/click.C45gWdzy.png
    - src=/assets/finance.Bg8z3_B5.png
    - src=/assets/atom-logo.DnvBM3xw.png
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAAB4CAMAAACaVfp+AAAAolBMVEUAAAD///////////////////…
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAKYklEQVQYGZXBa6zf5UHA8e9z+d3+98…
- ❌ [10·a] `<a>` 内无可见文本（或仅含无 alt 的 `<img>`）：1 处
    - href=https://openatom.cn，cls=(无class)
- ❌ [06·附加] 无语义链接文本：1 处
    - text=Learn More，href=https://datastat.openeuler.org/en/overview
- ❌ [06·附加] 外链 target=_blank 缺 rel=noopener：9 处
    - href=https://openatom.cn，rel=(无)
    - text=InfoQ，href=https://www.infoq.cn/?utm_source=openeuler&amp;utm_medium=youlian，rel=(无)
    - text=Authing，href=https://www.authing.cn/，rel=(无)
    - text=openGauss，href=https://www.opengauss.org/en/，rel=(无)
    - text=MindSpore，href=https://www.mindspore.cn/en/，rel=(无)
    - text=openUBMC，href=https://www.openubmc.cn/en/，rel=(无)
    - text=openFuyao，href=https://www.openfuyao.cn/en/，rel=(无)
    - text=Ebaina，href=http://www.ebaina.com/，rel=(无)
    - text=J. ICP B. No. 2020036654-1，href=https://beian.miit.gov.cn/#/Integrated/index，rel=(无)
- ⚠️ [08·附加] 同页 alt 大量重复：1 处
    - alt=openEuler，count=6
- ⚠️ [08·附加] alt 超过 125 字符：1 处
    - alt=Building Agentic Infra from the OS Up — Agentic Infra OS Conference &amp; openEuler Summit 2026, November 13-14, 2026, Beijing, China
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

#### https://www.openeuler.org/zh/om/

- 规模：链接 40 个，图片 11 张，div 139 个，语义区块 2 个（header 0/nav 0/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1,h4
- ❌ [10·header/footer] 缺顶层 `<header>`（banner）：1 处
    - existing=0
- ❌ [10·h1~h6] 标题层级跳级：1 处
    - from=h1，to=h4，text=满意度反馈
- ❌ [10·img] `<img>` 不存在 alt 属性：9 处
    - src=/assets/info-ill.DbgsdepK.png
    - src=/assets/OSMind-ill.DKipweqD.png
    - src=/assets/accounts-QR.D60Gt-UA.png
    - src=/assets/helper-QR.DKvV4mP_.png
    - src=/assets/atom-logo.DnvBM3xw.png
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAAB4CAMAAACaVfp+AAAAolBMVEUAAAD///////////////////…
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAKYklEQVQYGZXBa6zf5UHA8e9z+d3+98…
    - src=/assets/code-zgz.CdIznA-v.jpg
    - src=/assets/code-xzs.CwZX79H1.png
- ❌ [10·a] `<a>` 内无可见文本（或仅含无 alt 的 `<img>`）：1 处
    - href=https://openatom.cn，cls=(无class)
- ❌ [06·附加] 外链 target=_blank 缺 rel=noopener：14 处
    - href=https://openatom.cn，rel=(无)
    - text=木兰开源社区，href=https://portal.mulanos.cn/，rel=(无)
    - text=鲲鹏社区，href=https://www.hikunpeng.com/zh/，rel=(无)
    - text=鹏城实验室，href=https://pcl.ac.cn/，rel=(无)
    - text=InfoQ，href=https://www.infoq.cn/?utm_source=openeuler&amp;utm_medium=youlian，rel=(无)
    - text=开源社，href=https://kaiyuanshe.cn/，rel=(无)
    - text=中科微澜，href=http://www.vulab.com.cn/，rel=(无)
    - text=Authing，href=https://www.authing.cn/，rel=(无)
    - text=openGauss，href=https://www.opengauss.org/zh/，rel=(无)
    - text=昇思MindSpore，href=https://www.mindspore.cn/，rel=(无)
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

#### https://www.openeuler.org/en/faq/

- 规模：链接 99 个，图片 18 张，div 64 个，语义区块 2 个（header 0/nav 0/main 1/article 0/section 0/aside 0/footer 1），标题序列 h2,h1,h2,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h4
- ❌ [10·header/footer] 缺顶层 `<header>`（banner）：1 处
    - existing=0
- ❌ [10·img] `<img>` 不存在 alt 属性：3 处
    - src=/assets/atom-logo.DnvBM3xw.png
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAAB4CAMAAACaVfp+AAAAolBMVEUAAAD///////////////////…
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAKYklEQVQYGZXBa6zf5UHA8e9z+d3+98…
- ❌ [10·a] `<a>` 内无可见文本（或仅含无 alt 的 `<img>`）：1 处
    - href=https://openatom.cn，cls=(无class)
- ❌ [06·附加] 无语义链接文本：2 处
    - text=here，href=https://www.openeuler.org/en/sig/sig-list/
    - text=here，href=https://mailweb.openeuler.org/postorius/lists/kernel@openeuler.org/
- ❌ [06·附加] 外链 target=_blank 缺 rel=noopener：24 处
    - text=CLA，href=https://clasign.osinfra.cn/sign/6983225bdcbb19710248ccf0，rel=noreferrer
    - text=QuickIssue，href=https://quickissue.openeuler.org/en/issues/，rel=noreferrer
    - text=Gitee，href=https://gitee.com/openeuler，rel=noreferrer
    - text=GitHub，href=https://github.com/openeuler-mirror，rel=noreferrer
    - text=Gitee，href=https://gitee.com/src-openeuler，rel=noreferrer
    - text=Contribute Software Package，href=https://software-pkg.openeuler.org/en/package，rel=noreferrer
    - text=LinkedIn，href=https://www.linkedin.com/company/openeuler/posts/?feedView=all，rel=noreferrer
    - text=X，href=https://x.com/openEuler，rel=noreferrer
    - text=YouTube，href=https://www.youtube.com/@openeuler，rel=noreferrer
    - text=openEuler Forum，href=https://forum.openeuler.org/，rel=noreferrer
- ⚠️ [08·附加] 同页 alt 大量重复：1 处
    - alt=fig，count=3
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

#### https://www.openeuler.org/zh/oEEP/

- 规模：链接 40 个，图片 5 张，div 50 个，语义区块 2 个（header 0/nav 0/main 1/article 0/section 0/aside 0/footer 1），标题序列 h4
- ❌ [10·header/footer] 缺顶层 `<header>`（banner）：1 处
    - existing=0
- ❌ [10·h1~h6] 缺 `<h1>` 或 `<h1>` 内无可见文本：1 处
    - existingH1=0，note=静态 HTML 无可见的 &lt;h1&gt;
- ❌ [10·img] `<img>` 不存在 alt 属性：5 处
    - src=/assets/atom-logo.DnvBM3xw.png
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAAB4CAMAAACaVfp+AAAAolBMVEUAAAD///////////////////…
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAKYklEQVQYGZXBa6zf5UHA8e9z+d3+98…
    - src=/assets/code-zgz.CdIznA-v.jpg
    - src=/assets/code-xzs.CwZX79H1.png
- ❌ [10·a] `<a>` 内无可见文本（或仅含无 alt 的 `<img>`）：1 处
    - href=https://openatom.cn，cls=(无class)
- ❌ [06·附加] 外链 target=_blank 缺 rel=noopener：14 处
    - href=https://openatom.cn，rel=(无)
    - text=木兰开源社区，href=https://portal.mulanos.cn/，rel=(无)
    - text=鲲鹏社区，href=https://www.hikunpeng.com/zh/，rel=(无)
    - text=鹏城实验室，href=https://pcl.ac.cn/，rel=(无)
    - text=InfoQ，href=https://www.infoq.cn/?utm_source=openeuler&amp;utm_medium=youlian，rel=(无)
    - text=开源社，href=https://kaiyuanshe.cn/，rel=(无)
    - text=中科微澜，href=http://www.vulab.com.cn/，rel=(无)
    - text=Authing，href=https://www.authing.cn/，rel=(无)
    - text=openGauss，href=https://www.opengauss.org/zh/，rel=(无)
    - text=昇思MindSpore，href=https://www.mindspore.cn/，rel=(无)
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

#### https://www.openeuler.org/zh/nestos/

- 规模：链接 60 个，图片 9 张，div 209 个，语义区块 12 个（header 5/nav 0/main 1/article 0/section 5/aside 0/footer 1），标题序列 h1,h2,h2,h2,h2,h2,h4
- ❌ [10·header/footer] 缺顶层 `<header>`（banner）：1 处
    - existing=5，note=现有元素均为 Sectioning Content/nav 的后代
- ❌ [10·h1~h6] 标题层级跳级：1 处
    - from=h2，to=h4，text=满意度反馈
- ❌ [10·img] `<img>` 不存在 alt 属性：8 处
    - src=/assets/architecture.RICK7GJK.jpg
    - src=/assets/qiling.CFY3yR1Q.png
    - src=/assets/skysolidiss.vXBI79xx.jpg
    - src=/assets/atom-logo.DnvBM3xw.png
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAAB4CAMAAACaVfp+AAAAolBMVEUAAAD///////////////////…
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAKYklEQVQYGZXBa6zf5UHA8e9z+d3+98…
    - src=/assets/code-zgz.CdIznA-v.jpg
    - src=/assets/code-xzs.CwZX79H1.png
- ❌ [10·a] `<a>` 不存在 href 属性：1 处
    - text=下载体验，cls=o-link.o-link-hover-underline.o-link-primary
- ❌ [10·a] `<a>` 内无可见文本（或仅含无 alt 的 `<img>`）：1 处
    - href=https://openatom.cn，cls=(无class)
- ❌ [06·附加] 外链 target=_blank 缺 rel=noopener：14 处
    - href=https://openatom.cn，rel=(无)
    - text=木兰开源社区，href=https://portal.mulanos.cn/，rel=(无)
    - text=鲲鹏社区，href=https://www.hikunpeng.com/zh/，rel=(无)
    - text=鹏城实验室，href=https://pcl.ac.cn/，rel=(无)
    - text=InfoQ，href=https://www.infoq.cn/?utm_source=openeuler&amp;utm_medium=youlian，rel=(无)
    - text=开源社，href=https://kaiyuanshe.cn/，rel=(无)
    - text=中科微澜，href=http://www.vulab.com.cn/，rel=(无)
    - text=Authing，href=https://www.authing.cn/，rel=(无)
    - text=openGauss，href=https://www.opengauss.org/zh/，rel=(无)
    - text=昇思MindSpore，href=https://www.mindspore.cn/，rel=(无)
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

