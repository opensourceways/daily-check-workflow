# HTML 语义化检查完全版报告 · openGauss 文档（openGauss-docs）

- 检查时间：2026-10-28T11:29:22.557Z
- 规范来源：**measures/10-HTML-semantic-check/规范.md「检查细节」**（header/footer/main/h1~h6/img alt/a 的缺失·重复·层级结构判定）；06/07/08 未覆盖项（黑名单文本、外链 noopener、失效锚点、alt 质量等）为附加项
检查抽样范围：门户类 = 首页（meta-refresh 跟随）+ 至多 4 个 sitemap 栏目页；文档类 = /zh/、/en/ 文档首页
- 解析口径：线上静态/SSR HTML 剔除 `<script>`/`<style>`/注释/`<noscript>` 后构建元素树；不含 JS 运行时插入的 DOM
- 可见性判定：仅能静态识别 `aria-hidden`（值非 false）、`hidden`、行内 `style="display:none"`；class/媒体查询控制的显隐无法判定，「多个同时可见」存在误报可能，请打开页面复核
- 顶层判定：`<header>`/`<footer>` 非 Sectioning Content（article/aside/main/section）或 `<nav>` 的后代即顶层候选

### openGauss 文档（openGauss-docs） — ❌

| 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 |
| --- | --- | --- | --- | --- |
| 2 | 21 | 0 | 2 | 0 |

## 抽查页面

- https://docs.opengauss.org/zh/（HTTP 200 ✅）
- https://docs.opengauss.org/en/（HTTP 200 ✅）

## 逐页明细

#### https://docs.opengauss.org/zh/

- 规模：链接 57 个，图片 13 张，div 219 个，语义区块 2 个（header 0/nav 0/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1,h2,h2,h2,h2,h2
- ❌ [10·header/footer] 缺顶层 `<header>`（banner）：1 处
    - existing=0
- ❌ [10·img] `<img>` 不存在 alt 属性：10 处
    - src=/dsl/assets/img/about.jpg
    - src=/dsl/assets/img/quick-start.jpg
    - src=/dsl/assets/img/qa.jpg
    - src=/dsl/assets/img/guide.jpg
    - src=/dsl/assets/img/icon-installation-bg.svg
    - src=/dsl/assets/img/icon-sql-bg.svg
    - src=/dsl/assets/img/icon-db-management-bg.svg
    - src=/dsl/assets/img/icon-db-om-bg.svg
    - src=/dsl/assets/img/icon-opt-bg.svg
    - src=/dsl/assets/img/icon-data-migration-bg.svg
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

#### https://docs.opengauss.org/en/

- 规模：链接 55 个，图片 12 张，div 210 个，语义区块 2 个（header 0/nav 0/main 1/article 0/section 0/aside 0/footer 1），标题序列 h1,h2,h2,h2,h2,h2
- ❌ [10·header/footer] 缺顶层 `<header>`（banner）：1 处
    - existing=0
- ❌ [10·img] `<img>` 不存在 alt 属性：9 处
    - src=/dsl/assets/img/about.jpg
    - src=/dsl/assets/img/quick-start.jpg
    - src=/dsl/assets/img/guide.jpg
    - src=/dsl/assets/img/icon-installation-bg.svg
    - src=/dsl/assets/img/icon-sql-bg.svg
    - src=/dsl/assets/img/icon-db-management-bg.svg
    - src=/dsl/assets/img/icon-db-om-bg.svg
    - src=/dsl/assets/img/icon-opt-bg.svg
    - src=/dsl/assets/img/icon-data-migration-bg.svg
- ⚠️ [07·附加] 缺 `<nav>` 区块：1 处
    - (无详情)

