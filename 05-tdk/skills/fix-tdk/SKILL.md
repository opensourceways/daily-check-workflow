---
name: fix-tdk
description: 修复网站 TDK、HTML meta tags 的缺失、重复、与正文不符的问题。当需要整改页面 title / description / keywords 与正文不符、彼此重复，或补齐缺失的 TDK 时使用。
---

# 修复 TDK（title / description / keywords）

以**页面正文真实内容**为依据来设计或订正每页的 TDK，解决三类问题：TDK 缺失、多页 TDK 重复、TDK 与正文不符。核心手段：先用 `to-md-snapshot` 把网页正文转成 Markdown，直接读这份 Markdown 来设计 TDK；再用 `calc-content-fit` 对 description / keywords 与正文做**粗略**贴合度核对。

## 前置：脚本命令（本机已可用则跳过）

两个脚本以 npm 包 `seo-html-tools` 提供（上游为 `daily-check-workflow` 仓库 **`specifications` 分支**的 `html-tools/`），全局安装后可直接使用命令 `to-md-snapshot` 与 `calc-content-fit`。先验证是否可用：

```bash
to-md-snapshot --help
```

命令存在即可跳过本节（示例中的 `to-md-snapshot` / `calc-content-fit` 均为全局命令）。若提示命令不存在，自行拉取并安装：

```bash
# 浅克隆 specifications 分支到稳定目录，在包目录安装依赖后注册全局命令
git clone --depth 1 --branch specifications --single-branch \
  https://github.com/opensourceways/daily-check-workflow.git "$HOME/.seo-geo/dcw-specs"
cd "$HOME/.seo-geo/dcw-specs/html-tools"
pnpm install
pnpm add -g file:.
```

- 脚本是 ESM 且依赖 `commander / cheerio / turndown / modern-ahocorasick`，必须在包目录先 `pnpm install`。
- 运行环境：Node ≥ 18（用到 `fetch`、`Intl.Segmenter`）。
- 全局命令落在 pnpm 全局 bin 目录（通常在 PATH 中）；不想全局注册时，也可在包目录内用 `pnpm exec to-md-snapshot ...` 方式执行。

## 页面 URL 约定

- 若本机已部署该项目，优先用对应本地端口 URL（如 `http://localhost:8082/zh/...`）；否则用线上 URL。
- 对 VitePress / Nuxt 这类 SSG/预渲染站，正文通常已渲染进 HTML，直接 `fetch` 即可拿到；纯客户端渲染的动态区块（API 列表等）可能拿不到——这类内容本就不该进 description（见下方原则），无影响。

## 步骤 1：抓取正文快照（to-md-snapshot）

```bash
# 输出到文件
to-md-snapshot \
  --url "http://localhost:8082/zh/compatibility/hardware/" \
  --filename /tmp/snap/hardware.md

# 或直接打印到 stdout（不落盘）
to-md-snapshot --url "<页面URL>"
```

参数（详见脚本头部注释）：

| 参数 | 说明 |
|------|------|
| `--url` | 必填，页面 URL |
| `-f, --filename` | 输出文件路径；不传则输出到 stdout |
| `-c, --content` | 正文容器选择器；不传则按 `article → main → [role=main] → #content → #main → .content → .article-content → .post-content → body` 依次取第一个命中的 |
| `-r, --remove` | 转 md 时要剥离的子元素选择器，可传多个、可逗号分隔（如 `.breadcrumb, .vp-nav, footer`） |

脚本已内置处理：剥离 `script/style/noscript/template`、去图片、表格转 Markdown、带 `.o-card-title` 的链接转 `[标题](href)`。

**用法要点**

- 主正文容器 class 各模板不统一（如 `main`/`.info-content`/`.intro-card`/`.markdown`）。默认选择器取不到或抓进大量导航/页脚时，用 `-c` 指定正文容器、用 `-r` 剥离公共 chrome（面包屑、导航、页脚、cookie 提示等）。
- 抓完**先看一眼 Markdown 是否只剩导航/空壳**——若是，说明选择器没命中，调 `-c/-r` 重抓；仍拿不到正文再考虑下钻页面源码（读 `.content/*.yaml`、i18n、组件模板）作为兜底。

## 步骤 2：读 Markdown 设计 / 修复 TDK

以 `to-md-snapshot` 产出的 Markdown 为**唯一事实来源**逐页判断，禁止凭板块名、旧 geo 文案或常识"套模板"改写。

1. **先定位当前 TDK 从哪来**（决定改哪个文件才生效），两种模式：
   - 归档式：项目根 `.geo/tdks/{locale}/{route}/index.json` 里的 `{ title, description, keywords, canonical }`——**该文件会覆盖 md 的 head，是这类页 TDK 的唯一来源**，改这里即可。
   - 原生式：直接用页面源文件（VitePress frontmatter `title`/`description`/`head`；Nuxt `useSeoMeta`；news/blog 取 frontmatter `summary`；showcase 详情页 title 取 frontmatter）——改源文件。
2. **逐字段基于正文撰写**：
   - **title**：唯一，模式"页面首要内容/意图 + 网站名称"；同公司/同栏目多页须靠正文里的区分性信息（如案例名、步骤主题）拉开差异。
   - **description**：概括本页正文、唯一；**优先复用页面自身已有且准确的文案**（frontmatter description / banner subtitle / i18n 原文），缺失或明显不符时才新写；新写的每个说法都要能在正文中找到出处。
   - **keywords**：与正文相关的词，逗号分隔，优先级低；不得出现正文没有的词。
3. **消除重复**：同一值的 TDK 命中多页时，逐页回到各自主正文重写成差异化描述。
4. **消除"与正文不符"**：正文未提及的"专业细节/特定名词"一律删改，换成正文实际表述。
5. **news / blog 特例**：其 description 优先取 frontmatter `summary`；`summary` 缺失或跨页重复时，回退取**正文首段**（首段仍重复则并入次段，再兜底 title）。已在 md 中配置 `canonical` 的"重复页面整改"文件跳过，不覆盖其 description。

> 改动落在目标项目的源文件（`.geo/tdks/**` 或页面 frontmatter），遵循该项目既有组织与命名；本技能不改注入逻辑、不动可见横幅文案（除非就是 TDK 源）。

## 步骤 3：粗略贴合度核对（calc-content-fit）

把改写后的 description / keywords 对着**同一份正文 Markdown** 跑一遍覆盖率，低则回步骤 2 再改。这是**粗筛**，不替代语义判断。

```bash
# description（会自动分词）+ keywords 一起测；article 传快照文件
calc-content-fit /tmp/snap/hardware.md \
  -l zh-CN \
  -d "介绍 openEuler 硬件兼容性测试认证流程：社区认证与创新中心认证两条路径，含成为开发者、申请测试、了解策略、创建issue、执行测试、提交审核到结果发布七步。" \
  -k "硬件兼容性,认证流程,社区认证,创新中心认证"

# 也可从 stdin 喂正文（便于串联抓取）
to-md-snapshot --url "<URL>" \
  | calc-content-fit -k "openEuler,兼容性"
```

参数（详见脚本头部注释）：

| 参数 | 说明 |
|------|------|
| `[file]` | 正文文件路径；不传或传 `-` 则从 stdin 读取（`type x.md \| calc-content-fit -k ...`） |
| `-k, --keywords` | 逗号分隔关键词，可重复传多个 `-k` |
| `-d, --description` | 一段摘要，内部用 `Intl.Segmenter` 分词后参与计算 |
| `-l, --locale` | 摘要分词语言，默认 `zh-CN`（en / ja 等） |
| `-f, --filename` | 报告落盘路径；不传则打印 stdout |

**读结果**

- 输出为"词覆盖率 = 命中词数 / 总词数"，并列出**命中词（含次数）**与**未命中词**。
- **未命中词是重点**：description/keywords 里出现、正文却没有的词，通常是幻觉或离题——要么删掉，要么确认正文确实在讲它。
- 命中次数可辅助判断词密度：正文反复出现的主题词，description 却没覆盖，说明摘要没抓到主体。
- 经验阈值（粗略）：覆盖率明显偏低（如 < 60%）优先复查；接近 100% 不代表一定正确（见下）。

## 局限与禁止事项

- **字面命中 ≠ 语义正确**：脚本只做词/子串覆盖（AC 自动机 + `Intl.Segmenter`），无法判断"断章取义""以偏概全""同义改写却用词不同"。高分也要人/Agen看语义；真正的"贴合度审核"应作为**独立流程**运行，不由修复步骤自证。
- **禁止编造**：TDK 不得出现正文中不存在的实体、特性、数字、版本、结论。
- **禁止跨页复制**：不得把某页的 TDK 原样贴到多页造成重复。
- **改前先定位生效来源**：静态页常是 `.geo/tdks/**` 覆盖 md head，改 md 不生效；先确认模式再落笔。
- 脚本产物（快照、报告）放临时目录即可，不要写进目标项目仓库。
