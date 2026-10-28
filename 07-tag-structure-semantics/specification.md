# 标签结构语义化 规范

## 规范来源

- [HTML 元素参考 — MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)
- [使用 HTML 区块和轮廓 — MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Heading_Elements)
- [Google 搜索中心：语义 HTML](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=zh-cn)

## 规范定义

| 规范点 | 必选 | 规范说明 |
|--------|------|----------|
| 标题层级 | 是 | 每页有且仅有一个 `<h1>`，标题层级递进不跳级（h1→h2→h3），不用于样式 |
| 语义化区块标签 | 是 | 使用 `<header>`/`<nav>`/`<main>`/`<article>`/`<section>`/`<aside>`/`<footer>` 替代纯 `<div>` |
| 表格语义 | 是 | 使用 `<table>`/`<thead>`/`<tbody>`/`<th>`，非 `<div>` 模拟 |
| 列表语义 | 推荐 | 使用 `<ul>`/`<ol>`/`<li>`，非 `<div>` 堆叠 |
| 表单语义 | 推荐 | 使用 `<label>` 关联控件，使用 `<fieldset>`/`<legend>` 分组 |
| 图文语义 | 推荐 | 图片用 `<figure>`/`<figcaption>`，时间用 `<time>`，强调用 `<strong>`/`<em>` |

**规范细节补充**

- `Sectioning Content`: 即 `<article>`、`<aside>`、`<main>`、或 `<section>` 四种元素
- `<header>`: 当 `<header>` 元素的上下文为 `<body>` 元素时，它定义了一个 `banner` 地标。当 HTML 标题元素是 `Sectioning Content` 或 `<nav>` 元素的后代时，则不视为 `banner` 地标。
- `<footer>`: 无障碍角色为 `contentinfo`，如果是 `Sectioning Content` 或 `<nav>` 元素的后代，则为 `generic`，逻辑同 `<header>`

> `banner` 角色用于定义全局的站点页眉，其中通常包含徽标（logo）、公司名称、搜索功能，还可能包含全局导航或标语。它通常位于页面顶部。
> 
> `contentinfo` 角色定义了一个页脚，其中包含版权信息、导航链接和隐私声明等识别信息，这些信息出现在网站内的每个文档中，该部分通常被称为页脚。每页应仅包含一个顶级“contentinfo”标记点角色。

## 关键要求

- `<header>`、`<footer>`

  - 缺失：页面缺失顶层`<header>`、`<footer>`，即除了作为 `Sectioning Content` 或 `<nav>` 元素的后代外，不存在其他`<header>`、`<footer>`，记为缺失（❌）
  - 重复：一个HTML中可以存在多个`<header>`、`<footer>`，但在同一时刻，只能有一个元素是可见的（未被设置 aria-hidden 属性以及css `display: none`），否则记为不合法（❌）
  - 层级结构：禁止自嵌套，`<header>`、`<footer>`的后代及祖先元素中不可以存在`<header>`或`<footer>`，如有则记为不合法（❌）

- `<main>`

  - 缺失：页面缺失顶层`<main>`，记为缺失（❌）
  - 重复：一个HTML中可以存在多个`<main>`，但在同一时刻，但在同一时刻，只能有一个元素是可见的（未被设置 aria-hidden 属性以及css `display: none`），否则记为不合法（❌）
  - 层级结构：禁止自嵌套，`<main>`的后代及祖先元素中不可以存在`<main>`，否则即为不合法（❌）

- `<h1>~<h6>`

  - 缺失：页面缺少`<h1>`，或元素内无可见文本内容，记为缺失（❌）
  - 重复：页面存在多个`<h1>`，记为不合法（❌）
  - 层级结构：标题层级递进不跳级（h1→h2→h3），禁止自嵌套，否则即为不合法（❌）
