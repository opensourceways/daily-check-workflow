# pr-gate-checks —— PR 门禁静态文件检查

对各项目的**仓库内静态文件**（robots.txt 等，位于 `repoInfo` 登记的路径）在 PR 门禁时运行的合规检查。与 `scripts/checks/`（定时抓取线上产物检查 + 提 issue）互补：本目录只读本地文件、不联网、不提单，存在硬性错误时以退出码 1 拦截 PR。

## 门禁流程约定

1. 待检项目的门禁步骤将本目录（`pr-gate-checks/`）连同 `projects.config.json` 复制到**项目根目录**；
2. 执行 `node pr-gate-checks/check-robots.mjs`；
3. 脚本读项目根 `package.json` 的 `name`，与 `projects.config.json` 各项目的 `repoInfo.packageName` 匹配，确定待检项目；
4. 按该项目 `repoInfo` 登记的静态文件路径定位并检查（robots.txt 位于 `${repoInfo.publicDir}/robots.txt`）。

`projects.config.json` 查找顺序：`--config=` / 环境变量 `PROJECTS_CONFIG` → `pr-gate-checks/` 目录内 → 项目根 → （在本仓库原位调试时）仓库根。项目根推断：`--root=` → 脚本上级目录（存在 package.json 时）→ cwd。

## 已接入维度

| 脚本 | 检查对象 | 位置约定 |
|------|----------|----------|
| check-robots.mjs | robots.txt 字段合规 | `${repoInfo.publicDir}/robots.txt` |
| check-new-page-tdk.mjs | 最新一次 git commit **新增**的页面文件是否配置 TDK / JSON-LD | 归档 `${repoInfo.tdkArchiveDir}` / `${repoInfo.jsonldArchiveDir}` 下 `<页面路径>/index.json`，或页面源码内配置 |

公共管道（`--root`/`--config` 解析、packageName 匹配等）在 `gate-utils.mjs`，目录内脚本互相 `import './gate-utils.mjs'` 是允许的（整目录一起复制）。

## check-new-page-tdk.mjs 检查逻辑

1. **找新增页面**：`git diff --name-status HEAD^1 HEAD`（合并提交同样与第一父对比；初始提交改用 `git show`）取状态为 A 的新增文件，整路径匹配 `repoInfo.pageEntryPattern`（**JS 正则源串**，自带 `^` `$` 锚点，路径分隔符恒为 `/`，如 `^app/(?:zh|en)/.*\.md$`）；无新增页面直接通过。CI 检出需 **fetch-depth ≥ 2**。
2. **逐页按 TDK、JSON-LD 两个维度分别判定**（单维度任一满足即通过，都不满足该维度报一条硬性错误）：
   - 归档检查：页面路径 = 文件路径去掉 `repoInfo.srcDir` 前缀、`index.*` 取其上级目录、其余去扩展名（`app/zh/foo/bar.md → zh/foo/bar`，`app/zh/index.md → zh`，与 portal `.geo` 归档组织一致），查对应维度归档目录（`tdkArchiveDir` / `jsonldArchiveDir`）下 `<页面路径>/index.json`；
   - 源码检查按 `project.stack` 分情况：
     - TDK——vitepress：md frontmatter 顶层 `title`/`description` 非空；nuxt：`useSeoMeta`/`useHead` 调用实参（跨调用并集）含 `title:` 与 `description:`；
     - JSON-LD——vitepress：frontmatter 块内声明 `script[type="application/ld+json"]`（按 MIME 串判定）；nuxt：同样两个 composable 的调用实参内涉及 `application/ld+json`；
     - 其他 stack：无源码级检查，仅依赖归档。
3. 维度对应归档目录未配置时该路径记 N/A（nuxt 类项目常态）；若同时源码检查也不可用，报"无法检查"错误提醒补配置。

## check-robots.mjs 检查项

硬性错误（退出码 1）：缺 User-agent；allow/disallow 均缺失；路径值不以 `/` 开头；`Disallow: /` 禁止整站；缺 Sitemap 声明（或值非绝对 URL）；缺 Content-Signal 或取值不符规范值（`ai-train=yes, search=yes, ai-input=yes`，与 `scripts/config/check-rules.json` 同步）；缺 LLM-Policy、非绝对 URL 或未指向 llms.txt。

告警（不拦截）：Sitemap / LLM-Policy 的 host 与项目 `domain`/`domainAlias` 不一致（跨域引用）。

未登记放行：项目根 `package.json` 的 `name` 未匹配到任何 `repoInfo.packageName` 时，视为该项目未接入门禁检查，打印 ⏭️ 后以退出码 0 跳过放行。

不做联网探测：链接可达性由每日定时检查（`scripts/checks/check-robots.mjs`）负责，PR 产物未部署，探测无意义且引入网络抖动。

## 本地调试（在本仓库原位运行）

```bash
node scripts/pr-gate-checks/check-robots.mjs --root=../openEuler-portal   # 指定待检项目根
node scripts/pr-gate-checks/check-robots.mjs --project=HiFloat            # 按项目 ID 指定（跳过 packageName 匹配）
```

## 自包含约束

本目录会被复制出仓库独立运行，脚本只可 import node 内置模块与本目录内文件（`./gate-utils.mjs`），**不得 import `../lib/*`**；与 `scripts/lib/`、`scripts/config/check-rules.json` 共享的解析函数和期望值以复制方式内联在脚本内（头部注释标明同步点），修改定时检查口径时须同步这里。
