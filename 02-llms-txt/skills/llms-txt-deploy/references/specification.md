# llms.txt 规范

> 覆盖 **llms.txt** 与 **llms-full.txt** 两个文件：llms.txt 为官方标准，llms-full.txt 为社区事实标准（Mintlify 推广、VitePress/Nuxt 官方工具链均支持）。

## 规范来源

**官方规范**

- [llmstxt.org — The /llms.txt file, v2](https://llmstxt.org/)（Jeremy Howard / Answer.AI，2024-09 提出，2026-08 修订为 v2）—— llms.txt 唯一官方格式定义
- [AnswerDotAI/llms-txt 规范仓库](https://github.com/AnswerDotAI/llms-txt) —— 规范版本管理与社区讨论入口

**社区事实标准（llms-full.txt 与工程实践）**

- [Mintlify — llms.txt / llms-full.txt](https://www.mintlify.com/docs/ai/llmstxt) —— llms-full.txt、`/_llms/` 拆分索引、`/.well-known/` 别名、HTTP 发现头等工程约定的来源
- [vitepress-plugin-llms](https://github.com/okineadev/vitepress-plugin-llms) —— VitePress 生态标准实现，Vite / Vue.js / Vitest / Rolldown 官网采用
- [nuxt-llms](https://github.com/nuxtlabs/nuxt-llms) —— NuxtLabs 官方模块（atinux / farnabaz 维护），`@nuxt/content` ≥3.2 内置集成

**采纳背书**

- Chrome Lighthouse 将 llms.txt 纳入 [agentic browsing 审计](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt)
- OpenAI / Anthropic / Gemini 官方开发者文档均已发布 llms.txt（如 [docs.anthropic.com/llms.txt](https://docs.anthropic.com/llms.txt)）
- 内部联动：本专项 [01-robots-txt](../01-robots-txt/规范.md) 的 `LLM-Policy` 字段指向 llms.txt

## 规范定义（两文件分工）

| 文件 | 部署路径 | 角色 | 定位 | 规范地位 |
|------|----------|------|------|----------|
| llms.txt | `/llms.txt`（或子路径 `/docs/llms.txt`） | 结构化索引（目录） | 站点摘要 + 按重要性分组的链接清单；保持小体积可整体放入上下文，LLM 按需跟链 | llmstxt.org v2 官方定义 |
| llms-full.txt | `/llms-full.txt` | 全量内容（全书） | 全站（或全文档区）页面正文合并为单个 Markdown 文件，供 AI 一次拉取完整上下文、减少逐页爬取 | 社区事实标准（Mintlify 推广；vitepress-plugin-llms / nuxt-llms 均支持） |

## 一、llms.txt 规范

### 1.1 部署位置与发现机制

| 机制 | 值 | 级别 | 含义 | 来源与推荐 |
|------|-----|------|------|------------|
| 根路径 | `/llms.txt` | P0 | 站点级入口，覆盖全站页面 | 官方；本专项所有项目的默认部署位置，文件名全小写 |
| 子路径 | `/docs/llms.txt` | 可选 | 仅覆盖该路径下的页面；多个 llms.txt 同时适用时，agent 应使用**最具体**的一个 | 官方 v2；官网/文档分域名部署时，各自根路径部署即等价满足 |
| .well-known 别名 | `/.well-known/llms.txt` | P2 | 兼容遵循 RFC 8615 约定的工具 | Mintlify 实践；静态托管无法配置时可省略 |
| HTTP Link 头（描述发现） | `Link: </llms.txt>; rel="describedby"` | P1 | 声明"本资源由该 llms.txt 描述"；对 HTML 与非 HTML 资源均有效，可在服务器/CDN 层配置而无需改页面 | 官方 v2 |
| HTTP Link 头（页面 md 版） | `Link: </docs/page.md>; rel="alternate"; type="text/markdown"` | P1 | 指向当前页面的 Markdown 版本 | 官方 v2 |
| X-Llms-Txt 头 | `X-Llms-Txt: /llms.txt` | P2 | 便于工具单次探测 | Mintlify 实践 |
| robots.txt 联动 | `LLM-Policy: /llms.txt` | **本专项 P0** | 爬虫侧发现入口 | 本专项 01 措施 |

HTTP 响应头完整示例（可全站在网关/CDN 统一注入）：

```http
Link: </llms.txt>; rel="describedby", </llms-full.txt>; rel="llms-full-txt"
X-Llms-Txt: /llms.txt
```

### 1.2 文件格式（官方 v2，各节按固定顺序）

| # | 字段/章节 | 语法 | 必选 | 含义 | 推荐配置 |
|---|-----------|------|------|------|----------|
| 0 | BOM | UTF-8 字节序标记 | 否 | 允许存在以兼容部分编辑器 | 省略；输出 UTF-8 无 BOM |
| 1 | Title | `# 站点/项目名` | **是（全文件唯一必需字段）** | H1，须为文件第一行有效内容；站点/项目的正式名称 | 与站点 `<title>`、品牌名一致；全文件仅出现这一个 H1 |
| 2 | Summary | `> 摘要` | 强烈推荐 | 紧随 H1 的 blockquote；说明项目是什么、面向谁、核心价值，须包含理解文件其余部分所需的关键信息 | 1–3 句、≤200 字符；包含技术栈/语言/受众等检索关键词 |
| 3 | Info 段落 | 任意非标题 Markdown（段落、列表） | 否 | 补充背景与"如何使用本文件"的说明；不得使用任何标题语法 | 列表化 3–5 条：文档语言、内容约定、llms-full.txt 全量入口等 |
| 4 | Section | `## 分节名` + 链接列表 | 推荐至少一节 | H2 分节的 "file list"，按主题/重要性组织 | 官网类：Docs / Downloads / Community；文档类：Getting Started / User Guide / API Reference / FAQ |
| 5 | 链接项 | `- [标题](绝对URL): 描述` | Section 内必选 | 见 1.3 链接项字段 | 每节 5–20 条，按重要性降序排列 |
| 6 | Optional 节 | `## Optional` | 否 | **约定命名**的收尾分节；存放次要信息，agent 需要压缩上下文时可跳过 | 外部链接（GitHub、论坛）、低频页面统一放此节 |

完整示例（以 openEuler 文档站为例）：

```markdown
# openEuler 文档

> openEuler 是开源、免费的 Linux 发行版，面向服务器、云、边缘与嵌入式场景。本站提供安装、升级、运维与迁移的官方文档，文档语言为中文。

本文件遵循 llmstxt.org v2 规范，为 AI 助手提供 openEuler 文档的结构化索引。

- 文档语言：中文
- 全量文档：[llms-full.txt](https://docs.openeuler.org/llms-full.txt) 可一次拉取全部内容

## Docs

- [安装指南](https://docs.openeuler.org/zh/docs/22.03_LTS_SP4/docs/Installation/Installation.html.md): 物理机/虚拟机安装流程与参数说明
- [管理员指南](https://docs.openeuler.org/zh/docs/22.03_LTS_SP4/docs/Administration/Administration.html.md): 用户与权限、存储、网络等系统管理
- [容器指南](https://docs.openeuler.org/zh/docs/22.03_LTS_SP4/docs/Container/Container.html.md): iSula 与 Docker 容器栈的使用

## Optional

- [openEuler 社区](https://www.openeuler.org): 社区门户与 SIG 组织
```

### 1.3 链接项字段

| 字段 | 语法 | 必选 | 含义 | 推荐配置 |
|------|------|------|------|----------|
| 标题 | `[name]` | 是 | 链接显示名，即目标页面的页面名 | 与页面 `<title>` / frontmatter `title` 一致；禁止用 URL 兜底充当标题 |
| URL | `(url)` | 是 | 目标地址 | 优先指向页面的 Markdown 版本（`page.md` 或 `page.html.md`），其次 HTML 版。官方 v2 未强制形式，生态两派：Mintlify 生成**绝对 URL**，vitepress-plugin-llms 生成**根相对路径**（以 `/` 开头，工具按站点域名解析）。**本专项推荐绝对 URL**——llms.txt 会在不同上下文中被消费，相对 URL 依赖消费方正确拼接基准地址；若必须使用相对 URL，则必须为根相对路径，禁止文档相对路径（如 `../page.md`） |
| 描述 | `: notes` | 否 | `]` 后跟 `: ` 与一句话说明 | 强烈建议补全；来源为页面 frontmatter `description`，取第一段并按 **300 字符截断**（Mintlify 约定）。无描述时省略整个 `: ...`，不留空冒号 |

### 1.4 体积与拆分索引

| 规则 | 阈值 | 处理方式 | 来源 |
|------|------|----------|------|
| llms.txt 单文件上限 | 100,000 字符 | 超限时主文件退化为目录，分组链接移入 `/_llms/*.txt` 子索引，agent 递归跟随直至到达页面链接 | Mintlify 实践 |
| 子索引格式 | `/_llms/<group>.txt`（`text/plain`） | `.txt` 后缀使工具将其识别为索引；同路径 `.md` 以 `text/markdown` 兼容旧链接 | Mintlify 实践 |
| 拆分原则 | 不丢页面 | 拆分只移动、不删除；子索引可继续嵌套（如 `/_llms/api-reference/admin.txt`） | Mintlify 实践 |
| llms-full.txt | 不设上限 | 不受 100k 限制 | Mintlify 实践 |

> 当前 10 个项目体量均远低于阈值，触发前无需实施拆分；巡检脚本以 100k 字符为告警线，触发后拆分升级为 P0。

## 二、llms-full.txt 规范

### 2.1 定位

- 整站文档合并为**单个 Markdown 文件**，每页包含标题、source URL、description 与完整正文
- 用途：AI 一次请求获得全量上下文；显著减少逐页爬取流量
- 生成时机：**构建时静态生成**（VitePress 插件）或**服务端预渲染**（Nuxt 模块）；禁止运行时实时动态拼接（不可缓存、不稳定）
- 官方 llmstxt.org 未定义此文件，其结构遵循 Mintlify 确立的社区约定

### 2.2 文件结构

| 字段 | 必选 | 含义 | 推荐配置 |
|------|------|------|----------|
| H1 + Summary | 是 | 文件头，与 llms.txt 保持一致 | 可在标题后注明 "Full Documentation" 以示区分 |
| 页面分隔 | 是 | 每页一个内容块 | `---` 分隔线 + 页面标题（H2 起，与页面内标题层级顺延） |
| Source URL | 是 | 页面原始地址，供 AI 引用溯源 | 绝对 URL，独立成行（如 `Source: https://...`） |
| Description | 否 | 页面摘要 | 来自 frontmatter `description` |
| 正文 | 是 | 页面完整 Markdown 内容 | 保留标题层级、代码块、表格；不截断 |

片段示例：

```markdown
# openEuler 文档 — Full Documentation

> openEuler 是开源、免费的 Linux 发行版……

---

## 安装指南

Source: https://docs.openeuler.org/zh/docs/22.03_LTS_SP4/docs/Installation/Installation.html

（页面完整 Markdown 正文）
```

### 2.3 内容可见性规则

- 包含 agent 专属内容：`<llm-only>`（vitepress-plugin-llms）/ `for="agents"`（Mintlify），排除人类专属内容：`<llm-exclude>` / `for="humans"`
- 排除 `noindex: true`、hidden 页面与 404 页面（与 SEO 索引策略保持一致）

## 三、内容质量规范（两文件通用）

| # | 规则 | 依据 |
|---|------|------|
| 1 | 链接描述来源于页面 frontmatter `description`，取第一段、300 字符截断 | Mintlify 实践 |
| 2 | 排除 noindex / hidden / 404 / 登录后页面 | Mintlify 实践 |
| 3 | 中文站点保持中文，禁止机器翻译；标题、描述与页面语言一致 | 本专项约定（vitepress-plugin-llms 作者建议"仅英文"，适用于英文技术社区；本专项站点内容与受众均为中文，翻译反而引入信息损失，且现代模型（含国内模型）中文能力成熟） |
| 4 | 语言简洁清晰、链接必须带描述、避免含糊术语与未解释的行话 | llmstxt.org 官方指南 |
| 5 | 验收方式：**只把 llms.txt 提供给 agent**，测试其能否正确回答站点核心问题（是什么、怎么装、怎么用） | llmstxt.org 官方指南 |

## 四、本专项验收基线（P0/P1/P2）

| 级别 | 检查项 | 验收标准 |
|------|--------|----------|
| P0 | /llms.txt 可访问 | HTTP 200；Content-Type 为 `text/plain` 或 `text/markdown`（charset=utf-8） |
| P0 | H1 与 Summary | H1 唯一且为第一行；blockquote 摘要存在 |
| P0 | 结构化链接 | ≥1 个 H2 分节；链接为绝对 URL（推荐）或根相对路径（以 `/` 开头） |
| P0 | robots.txt 联动 | `LLM-Policy` 指向 /llms.txt |
| P1 | llms-full.txt | 200 可访问；每页含 标题 + Source URL + 正文 |
| P1 | 页面 Markdown 版本 | 核心文档页提供 `page.md`（或 `page.html.md`） |
| P1 | 链接描述覆盖率 | ≥80% 链接带 frontmatter description |
| P1 | HTTP Link 发现头 | `rel="describedby"` / `rel="alternate"; type="text/markdown"`（可在托管层实现） |
| P2 | .well-known 别名 | `/.well-known/llms.txt` 返回 200 |
| P2 | X-Llms-Txt 头 | 返回 `/llms.txt` |
| P2 | 拆分索引 | 仅当 llms.txt > 100,000 字符触发（触发后升级为 P0） |

## 关键要求

1. llms.txt 必须部署在根路径（或覆盖目标区域的子路径），文件名全小写
2. H1 为唯一必需字段；Summary 强烈建议提供
3. 链接优先绝对 URL，按重要性分组，优先指向页面 Markdown 版本；使用相对 URL 时必须为根相对路径（以 `/` 开头）
4. llms.txt 单文件 ≤100,000 字符，超限拆分 `/_llms/` 递归子索引，拆分不得丢失页面
5. llms-full.txt 为全量合并文件：头部与 llms.txt 一致，每页含 Source URL，构建期/预渲染生成
6. 内容排除 noindex/hidden 页面；描述来自 frontmatter `description`（300 字符截断）
7. 中文站点保持中文，禁止机器翻译
8. 与 robots.txt `LLM-Policy` 字段联动（本专项必选）
9. 上线后使用 `npx llms-txt-check <域名>` 与本仓库 `check-llms-txt.mjs` 双重验证
