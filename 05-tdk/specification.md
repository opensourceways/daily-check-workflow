# TDK 规范

## 规范来源

- [为您网站上的每个网页创建独特的描述](https://developers.google.com/search/docs/appearance/snippet?hl=zh-cn#create-unique-descriptions-for-each-page-on-your-site)
- [`<title>` HTML document title element - HTML | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/title)

## 规范定义

| 属性 | 标准 |
|------|------|
| title | 每个页面的标题都应具有唯一性，且遵循模式：页面首要内容/意图，然后是网站名称。避免关键词堆砌 |
| description | 简短且相关的摘要告知用户特定网页的内容，要概括网页内容，具有唯一性。并非必须为句子格式，也可以包含关于网页的信息、分散在网页各处的重要信息片段（`<meta name="description" content="作者：A.N.（作家）；插图：V. Gogh；价格：17.99 美元；页数：784 页">`），避免简单的关键字堆砌。 |
| keywords | 与页面内容相关的词语，用逗号分隔。（优先级低，google 搜索已不再支持） |

## 关键要求

1. title 具唯一性，遵循"页面内容 - 网站名称"模式
2. description 概括页面内容，具有唯一性，避免关键字堆砌
3. keywords 优先级低，但应与页面内容相关

## 项目实现方式

参考 [implementation](./implementation.md)
