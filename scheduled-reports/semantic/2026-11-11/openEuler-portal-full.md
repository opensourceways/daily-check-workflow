# HTML 语义化检查完全版报告 · openEuler 官网（openEuler-portal）

- 检查时间：2026-11-11T12:52:31.677Z
- 规范来源：**measures/10-HTML-semantic-check/规范.md「检查细节」**（header/footer/main/h1~h6/img alt/a 的缺失·重复·层级结构判定）；06/07/08 未覆盖项（黑名单文本、外链 noopener、失效锚点、alt 质量等）为附加项
检查抽样范围：门户类 = 首页（meta-refresh 跟随）+ 至多 4 个 sitemap 栏目页；文档类 = /zh/、/en/ 文档首页
- 解析口径：线上静态/SSR HTML 剔除 `<script>`/`<style>`/注释/`<noscript>` 后构建元素树；不含 JS 运行时插入的 DOM
- 可见性判定：仅能静态识别 `aria-hidden`（值非 false）、`hidden`、行内 `style="display:none"`；class/媒体查询控制的显隐无法判定，「多个同时可见」存在误报可能，请打开页面复核
- 顶层判定：`<header>`/`<footer>` 非 Sectioning Content（article/aside/main/section）或 `<nav>` 的后代即顶层候选
- nav 判定：不要求页面必须有 `<nav>`；存在多个 `<nav>` 时每个须有 `aria-label` 或 `aria-labelledby`（空值视同缺失），且同类属性的值不得跨 nav 重复（`aria-label` 与 `aria-labelledby` 之间互不比较）；仅一个 `<nav>` 时不检查

### openEuler 官网（openEuler-portal） — ❌

| 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 |
| --- | --- | --- | --- | --- |
| 5 | 15 | 5 | 77 | 0 |

## 抽查页面

- https://www.openeuler.org/ → https://www.openeuler.org/en/（HTTP 200 ✅）
- https://www.openeuler.org/zh/om/（HTTP 200 ✅）
- https://www.openeuler.org/en/faq/（HTTP 200 ✅）
- https://www.openeuler.org/zh/oEEP/（HTTP 200 ✅）
- https://www.openeuler.org/zh/nestos/（HTTP 200 ✅）

## 逐页明细

#### https://www.openeuler.org/en/

- 规模：链接 116 个，图片 43 张，div 475 个，语义区块 18 个（header 6/nav 1/main 1/article 0/section 5/aside 0/footer 5），标题序列 h1,h2,h3,h2,h2,h2,h2,h4
- ❌ [10·h1~h6] 标题层级跳级：1 处
    - from=h2，to=h4，text=Feedback
- ❌ [10·img] `<img>` 不存在 alt 属性：1 处
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAKYklEQVQYGZXBa6zf5UHA8e9z+d3+98…
- ❌ [10·a] `<a>` 不存在 href 属性：1 处
    - text=openEuler 24.03 LTS SP3，cls=item-label
- ❌ [06·附加] 无语义链接文本：2 处
    - text=More，href=/en/download/#get-openeuler
    - text=Learn More，href=https://datastat.openeuler.org/en/overview
- ⚠️ [06·附加] 外链 target=_blank 缺 rel=noopener：9 处
    - href=https://openatom.cn，rel=(无)
    - text=InfoQ，href=https://www.infoq.cn/?utm_source=openeuler&amp;utm_medium=youlian，rel=(无)
    - text=Authing，href=https://www.authing.cn/，rel=(无)
    - text=openGauss，href=https://www.opengauss.org/en/，rel=(无)
    - text=MindSpore，href=https://www.mindspore.cn/en/，rel=(无)
    - text=openUBMC，href=https://www.openubmc.cn/en/，rel=(无)
    - text=openFuyao，href=https://www.openfuyao.cn/en/，rel=(无)
    - text=Ebaina，href=http://www.ebaina.com/，rel=(无)
    - text=J. ICP B. No. 2020036654-1，href=https://beian.miit.gov.cn/#/Integrated/index，rel=(无)
- ⚠️ [08·附加] alt 超过 125 字符：2 处
    - alt=Building Agentic Infra from the OS Up — Agentic Infra OS Conference &amp; openEuler Summit 2026, November 13-14, 2026, Beijing, China
    - alt=100% coverage of mainstream computing architectures: ARM, x86, RISC-V, SW-64, LoongArch, NPU, GPU, DPU, supporting 100+ servers, 300+ boards…

#### https://www.openeuler.org/zh/om/

- 规模：链接 127 个，图片 14 张，div 460 个，语义区块 4 个（header 1/nav 1/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1,h4
- ❌ [10·h1~h6] 标题层级跳级：1 处
    - from=h1，to=h4，text=满意度反馈
- ❌ [10·img] `<img>` 不存在 alt 属性：1 处
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAKYklEQVQYGZXBa6zf5UHA8e9z+d3+98…
- ⚠️ [06·附加] 外链 target=_blank 缺 rel=noopener：14 处
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

#### https://www.openeuler.org/en/faq/

- 规模：链接 158 个，图片 21 张，div 327 个，语义区块 4 个（header 1/nav 1/main 1/article 0/section 0/aside 0/footer 1），标题序列 h2,h1,h2,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h3,h4
- ❌ [10·img] `<img>` 不存在 alt 属性：1 处
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAKYklEQVQYGZXBa6zf5UHA8e9z+d3+98…
- ❌ [10·a] `<a>` 不存在 href 属性：1 处
    - text=openEuler 24.03 LTS SP3，cls=item-label
- ❌ [06·附加] 无语义链接文本：3 处
    - text=More，href=/en/download/#get-openeuler
    - text=here，href=https://www.openeuler.org/en/sig/sig-list/
    - text=here，href=https://mailweb.openeuler.org/postorius/lists/kernel@openeuler.org/
- ⚠️ [06·附加] 外链 target=_blank 缺 rel=noopener：24 处
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

#### https://www.openeuler.org/zh/oEEP/

- 规模：链接 127 个，图片 8 张，div 371 个，语义区块 4 个（header 1/nav 1/main 1/article 0/section 0/aside 0/footer 1），标题序列 h4
- ❌ [10·h1~h6] 缺 `<h1>` 或 `<h1>` 内无可见文本：1 处
    - existingH1=0，note=静态 HTML 无可见的 &lt;h1&gt;
- ❌ [10·img] `<img>` 不存在 alt 属性：1 处
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAKYklEQVQYGZXBa6zf5UHA8e9z+d3+98…
- ⚠️ [06·附加] 外链 target=_blank 缺 rel=noopener：14 处
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

#### https://www.openeuler.org/zh/nestos/

- 规模：链接 147 个，图片 12 张，div 530 个，语义区块 14 个（header 6/nav 1/main 1/article 0/section 5/aside 0/footer 1），标题序列 h1,h2,h2,h2,h2,h2,h4
- ❌ [10·h1~h6] 标题层级跳级：1 处
    - from=h2，to=h4，text=满意度反馈
- ❌ [10·img] `<img>` 不存在 alt 属性：4 处
    - src=/assets/architecture.RICK7GJK.jpg
    - src=/assets/qiling.CFY3yR1Q.png
    - src=/assets/skysolidiss.vXBI79xx.jpg
    - src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAKYklEQVQYGZXBa6zf5UHA8e9z+d3+98…
- ❌ [10·a] `<a>` 不存在 href 属性：1 处
    - text=下载体验，cls=o-link.o-link-hover-underline.o-link-primary
- ⚠️ [06·附加] 外链 target=_blank 缺 rel=noopener：14 处
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

