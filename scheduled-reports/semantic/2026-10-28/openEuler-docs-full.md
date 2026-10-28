# HTML 语义化检查完全版报告 · openEuler 文档（openEuler-docs）

- 检查时间：2026-10-28T11:29:22.557Z
- 规范来源：**measures/10-HTML-semantic-check/规范.md「检查细节」**（header/footer/main/h1~h6/img alt/a 的缺失·重复·层级结构判定）；06/07/08 未覆盖项（黑名单文本、外链 noopener、失效锚点、alt 质量等）为附加项
检查抽样范围：门户类 = 首页（meta-refresh 跟随）+ 至多 4 个 sitemap 栏目页；文档类 = /zh/、/en/ 文档首页
- 解析口径：线上静态/SSR HTML 剔除 `<script>`/`<style>`/注释/`<noscript>` 后构建元素树；不含 JS 运行时插入的 DOM
- 可见性判定：仅能静态识别 `aria-hidden`（值非 false）、`hidden`、行内 `style="display:none"`；class/媒体查询控制的显隐无法判定，「多个同时可见」存在误报可能，请打开页面复核
- 顶层判定：`<header>`/`<footer>` 非 Sectioning Content（article/aside/main/section）或 `<nav>` 的后代即顶层候选

### openEuler 文档（openEuler-docs） — ❌

| 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 |
| --- | --- | --- | --- | --- |
| 2 | 34 | 36 | 2 | 0 |

## 抽查页面

- https://docs.openeuler.org/zh/（HTTP 200 ✅）
- https://docs.openeuler.org/en/（HTTP 200 ✅）

## 逐页明细

#### https://docs.openeuler.org/zh/

- 规模：链接 64 个，图片 15 张，div 211 个，语义区块 2 个（header 0/nav 0/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1,h2,h2
- ❌ [10·header/footer] 缺顶层 `<header>`（banner）：1 处
    - existing=0
- ❌ [10·img] `<img>` 不存在 alt 属性：15 处
    - src=/dsl/assets/img/started-bg-light.png
    - src=/dsl/assets/img/install-guide-bg-light.png
    - src=/dsl/assets/img/qa-bg-light.png
    - src=/dsl/assets/img/docs-dev-guide-bg-light.png
    - src=/dsl/assets/img/server-bg.png
    - src=/dsl/assets/img/virtualization-bg.png
    - src=/dsl/assets/img/cloud-bg.png
    - src=/dsl/assets/img/edge-computing-bg.png
    - src=/dsl/assets/img/embedded-bg.png
    - src=/dsl/assets/img/dev-station-bg.svg
- ❌ [10·a] `<a>` 内无可见文本（或仅含无 alt 的 `<img>`）：1 处
    - href=https://openatom.cn，cls=(无class)
- ❌ [06·附加] 外链 target=_blank 缺 rel=noopener：18 处
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

#### https://docs.openeuler.org/en/

- 规模：链接 63 个，图片 15 张，div 204 个，语义区块 2 个（header 0/nav 0/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1,h2,h2
- ❌ [10·header/footer] 缺顶层 `<header>`（banner）：1 处
    - existing=0
- ❌ [10·img] `<img>` 不存在 alt 属性：15 处
    - src=/dsl/assets/img/started-bg-light.png
    - src=/dsl/assets/img/install-guide-bg-light.png
    - src=/dsl/assets/img/qa-bg-light.png
    - src=/dsl/assets/img/docs-dev-guide-bg-light.png
    - src=/dsl/assets/img/server-bg.png
    - src=/dsl/assets/img/virtualization-bg.png
    - src=/dsl/assets/img/cloud-bg.png
    - src=/dsl/assets/img/edge-computing-bg.png
    - src=/dsl/assets/img/embedded-bg.png
    - src=/dsl/assets/img/dev-station-bg.svg
- ❌ [10·a] `<a>` 内无可见文本（或仅含无 alt 的 `<img>`）：1 处
    - href=https://openatom.cn，cls=(无class)
- ❌ [06·附加] 外链 target=_blank 缺 rel=noopener：18 处
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

