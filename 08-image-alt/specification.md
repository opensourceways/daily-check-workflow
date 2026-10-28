# 图片 alt 语义 规范

## 规范来源

- [HTML `<img>` 元素 — MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img)
- [Google 图片优化指南 — Google 搜索中心](https://developers.google.com/search/docs/appearance/google-images?hl=zh-cn)
- [WCAG 2.1 — 非文本内容](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)

## 规范定义

| 属性 | 必选 | 规范说明 |
|------|------|----------|
| alt | 是 | 图片的替代文本，描述图片内容/用途 |
| 装饰性图片 | 否 | 纯装饰图片应使用 `alt=""`（空 alt），非省略 alt 属性 |
| 信息性图片 | 是 | alt 文本应描述图片传达的信息 |
| 功能性图片 | 是 | alt 文本应描述功能（如按钮图标用 alt="搜索"） |
| 复杂图片 | 否 | 可用 `longdesc` 或 aria-describedby 提供长描述 |

## 关键要求

1. 每个 `<img>` 必须有 alt 属性（可为空字符串，但不可省略）
2. alt 文本应描述图片内容/用途，避免"图片""image"等无意义文本
3. 装饰性图片用 `alt=""`，信息性/功能性图片必须有描述性 alt
4. alt 文本不应重复页面已有标题文本
5. 图表/示意图应提供详细的 alt 描述

## 项目实现方式

参考 `img-alt-fix` Skill
