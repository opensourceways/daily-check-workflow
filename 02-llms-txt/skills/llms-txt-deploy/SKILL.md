---
name: llms-txt-deploy
description: 为 VitePress / Nuxt 项目部署 llms.txt 与 llms-full.txt。当用户要求部署、生成、修复或检查 llms.txt / llms-full.txt / AI 可读文档入口时使用。
---

# llms.txt / llms-full.txt 落地技能

为项目部署符合 [llmstxt.org v2](https://llmstxt.org/) 规范的 `llms.txt`（结构化索引）与社区事实标准的 `llms-full.txt`（全量内容）。完整规范见本仓库 [specification.md](./references/specification.md)。

## 第一步：前置信息收集

执行前向用户确认（或从项目文件中读取）：

| 信息 | 来源 | 用途 |
|------|------|------|
| 站点正式名称 | 站点 `<title>` / 品牌名 | llms.txt 的 H1 |
| 一句话描述 | 项目 README / 站点 meta description | llms.txt 的 Summary（block quote） |
| 部署域名（含 https） | 项目配置 / 用户提供 | 链接绝对 URL 的前缀 |
| 技术栈 | `package.json` 依赖（vitepress / nuxt / @nuxt/content） | 决策树入口 |
| 站点地图 URL | robots.txt `Sitemap:` 行 | 兜底脚本数据源 |
| robots.txt 现状 | 线上 robots.txt | 检查 `LLM-Policy` 联动（见「完成后动作」） |

## 第二步：按技术栈走决策树

```
技术栈是什么？
├─ VitePress（package.json 含 vitepress）
│    └─ 路径 A：接入 vitepress-plugin-llms（推荐，零配置）
├─ Nuxt 3/4（package.json 含 nuxt）
│    ├─ 含 @nuxt/content ≥3.2 ──→ 路径 B1：nuxt-llms + Nuxt Content 自动收录
│    └─ 纯 Nuxt ───────────────→ 路径 B2：nuxt-llms + nuxt.config 静态配置
└─ 其他 / 构建链受限（无法新增构建依赖）
     └─ 路径 C：本技能兜底脚本 scripts/generate-llms-txt.mjs
```

选型原则：**生态插件 > 兜底脚本**。插件随每次构建自动更新且输出真 Markdown；兜底脚本仅在无法引入依赖时使用（HTML 提取为近似文本，质量低于插件）。

## 路径 A：VitePress（vitepress-plugin-llms）

该插件被 Vite / Vue.js / Vitest / Rolldown 官网采用，遵循 llmstxt.org v2。

1. 安装：

```bash
npm install vitepress-plugin-llms --save-dev
```

2. 修改 `.vitepress/config.ts`（参考模板 [templates/vitepress.config.ts](templates/vitepress.config.ts)）：

```ts
import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'

export default defineConfig({
  vite: {
    plugins: [llmstxt()],
  },
})
```

3. **质量关键**：为收录页面补 frontmatter `description`（链接描述的唯一来源）：

```markdown
---
title: 安装指南
description: openEuler 22.03 LTS SP4 物理机与虚拟机安装流程。
---
```

4. 可选内容裁剪：`<llm-only>仅 AI 可见</llm-only>`、`<llm-exclude>仅人类可见</llm-exclude>`
5. 构建并验证产物：

```bash
npm run docs:build
ls .vitepress/dist/llms.txt .vitepress/dist/llms-full.txt   # 必须存在
```

产物结构（官方 v2）：

```
.vitepress/dist/
├── llms.txt                 # 结构化索引
├── llms-full.txt            # 全量单文件
├── install.html             # 人类版
└── install.md               # 每页 Markdown 版
```

6. 部署后验证：`npx llms-txt-check https://<域名>`

## 路径 B1：Nuxt + Nuxt Content

1. 安装：`npm i nuxt-llms`（`@nuxt/content` 需 ≥3.2.0）
2. 配置（参考模板 [templates/nuxt.config.ts](templates/nuxt.config.ts)）：

```ts
export default defineNuxtConfig({
  modules: ['nuxt-llms', '@nuxt/content'],
  llms: {
    domain: 'https://www.example.com',
    title: '站点名称',
    description: '一句话描述',
  },
})
```

`@nuxt/content` 会通过 nuxt-llms 的 hooks 自动把 `content/` 目录全部内容收录进 `/llms.txt` 与 `/llms-full.txt`，无需逐页配置。

3. 启用 llms-full.txt（默认关闭，需显式配置 `full`）：

```ts
llms: {
  // ...同上
  full: {
    title: '站点名称 — Full Documentation',
    description: '全部内容的单文件版本',
  },
}
```

## 路径 B2：纯 Nuxt（无 Nuxt Content）

```ts
export default defineNuxtConfig({
  modules: ['nuxt-llms'],
  llms: {
    domain: 'https://www.example.com',          // 必填
    title: '站点名称',
    description: '一句话描述',
    sections: [                                  // 手工/程序化维护链接分组
      {
        title: 'Docs',
        description: '产品文档',
        links: [
          { title: '快速开始', description: '五分钟上手', href: 'https://www.example.com/docs/quick-start' },
          { title: 'API 参考', description: '全部接口说明', href: 'https://www.example.com/docs/api' },
        ],
      },
    ],
    notes: '备注信息（固定出现在文件末尾）',
  },
})
```

动态扩展（如从 CMS/API 拉取）：在 `server/plugins/` 中监听 hooks：

```ts
// server/plugins/llms.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('llms:generate', (event, options) => {
    options.sections.push({
      title: 'API Documentation',
      description: 'REST API endpoints',
      links: [{ title: 'Authentication', description: '鉴权方式', href: 'https://www.example.com/api/auth' }],
    })
  })
})
```

> Nuxt 路径注意：nuxt-llms 生成的是**服务端路由**（自动预渲染 `/llms.txt`、`/llms-full.txt`），不需要在 `public/` 下手工放文件；确认 `nitro.prerender` 未排除这两个路由。

## 路径 C：兜底脚本（零依赖）

适用：非 VitePress/Nuxt 项目，或构建链不允许新增依赖。脚本用 Node ≥18 原生能力运行，位于本目录 [scripts/generate-llms-txt.mjs](scripts/generate-llms-txt.mjs)。

从构建产物生成（推荐，离线、快）：

```bash
# VitePress 产物
node generate-llms-txt.mjs \
  --source dist --dist .vitepress/dist \
  --domain https://docs.example.com \
  --title "站点名称" \
  --description "一句话描述" \
  --full

# Nuxt 产物（.output/public）
node generate-llms-txt.mjs \
  --source dist --dist .output/public \
  --domain https://www.example.com \
  --title "站点名称" --description "一句话描述" --full
```

从线上 sitemap 生成（无构建产物时）：

```bash
node generate-llms-txt.mjs \
  --source sitemap --sitemap https://www.example.com/sitemap.xml \
  --domain https://www.example.com \
  --title "站点名称" --description "一句话描述" \
  --out ./public
```

说明：

- 生成 `llms.txt`（含 H1/Summary/Info/Pages/Optional 完整结构）与可选 `llms-full.txt`
- dist 模式优先拼接已存在的页面 `.md` / `.html.md`；否则做 HTML 正文近似提取（去导航/脚本/样式，保留正文文本）
- llms.txt 超 100,000 字符时输出告警（触发规范拆分策略）
- 建议挂入 CI：`build && node generate-llms-txt.mjs ...` 保证随构建刷新

## 第三步：验收清单

对照 [specification.md](./references/specification.md) P0/P1 基线逐项勾验：

- [ ] `https://<域名>/llms.txt` 返回 200，Content-Type 为 `text/plain` 或 `text/markdown`
- [ ] H1 唯一且为第一行；blockquote Summary 存在
- [ ] ≥1 个 H2 分节；链接为绝对 URL（推荐）或根相对路径，可解析、抽样 3 条可访问
- [ ] （P1）`/llms-full.txt` 返回 200，每页含 标题 + Source URL + 正文
- [ ] （P1）核心页面提供 `page.md` / `page.html.md`
- [ ] `npx llms-txt-check https://<域名>` 退出码为 0
- [ ] 只给 agent 提供 llms.txt，能正确回答"这个站点是什么/怎么安装/怎么使用"（官方推荐的人工验收）

## 禁止事项

- 禁止编造链接描述——描述只能来自页面 frontmatter `description` 或页面真实内容
- 禁止使用文档相对路径链接（如 `../page.md`）；推荐绝对 URL，其次根相对路径（以 `/` 开头）
- 禁止收录 `noindex` / hidden / 404 / 登录后页面
- 中文站点禁止机器翻译为英文后收录
- 禁止运行时动态拼接 llms.txt / llms-full.txt（必须为构建期或预渲染产物，保证可缓存与稳定）
- llms.txt 超 100,000 字符后禁止继续追加链接，应转拆分索引策略

## 完成后动作

1. 更新本仓库 `measures/02-llms-txt/进展.md` 与 `各项目差异点.md` 的项目状态
2. 检查 robots.txt 是否已有 `LLM-Policy: /llms.txt`（01 措施联动项），缺失则提示补齐
3. 在 `projects.config.json` 确认该项目 `llmsUrl` 已配置，使 `check-llms-txt.mjs` 巡检覆盖
