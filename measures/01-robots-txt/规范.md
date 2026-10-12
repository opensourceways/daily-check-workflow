# robots.txt 规范

## 规范来源

- [RFC 9309: Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309)
- [The Web Robots Page — robotstxt.org](https://www.robotstxt.org/)
- [Google 搜索中心：robots.txt 规范](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt?hl=zh-cn)
- [Content Signals](https://contentsignals.org/)

## 规范定义

| 字段 | 必选 | 含义 |
|------|------|------|
| User-agent | 是 | 指定规则适用的自动客户端（即搜索引擎抓取工具）的名称，星号 (`*`) 会匹配除各种 AdsBot 抓取工具之外的所有抓取工具 |
| disallow | 至少一个或多个 `disallow` 或 `allow` | 不希望用户代理抓取的目录或网页（相对于根网域而言），必须以 `/` 字符开头；如果它引用了某个目录，则必须以 `/` 标记结尾 |
| allow | 至少一个或多个 `disallow` 或 `allow` | 用户代理可以抓取的目录或网页（相对于根网域而言），*替换 `disallow` 规则，从而允许抓取已禁止访问的目录中的子目录或网页*，必须以 `/` 字符开头；如果它引用了某个目录，则必须以 `/` 标记结尾。 |
| sitemap | 是 | 相应网站的站点地图的位置 |
| Content-Signal | 是 | `ai-train=yes, search=yes, ai-input=yes` 网站对传统搜索引擎、实时生成式 AI 以及 AI 模型训练是否开放 |
| LLM-Policy | 是 | 指向 llms.txt |

## 关键要求

1. User-agent、disallow/allow 的路径必须以 `/` 开头
2. 引用目录时路径必须以 `/` 结尾
3. sitemap 声明应指向可访问的站点地图
4. GEO 专项应补充 Content-Signal 与 LLM-Policy 字段，明确对 AI 抓取/训练的态度
