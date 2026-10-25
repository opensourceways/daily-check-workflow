# robots.txt 规范检查报告

- 检查时间：2026-10-25T08:56:56.172Z
- 检查范围：projects.config.json 中 10 个项目；配置了 robotsAliasUrl 的项目额外检查主域/alias 一致性（当前：openEuler-portal、openEuler-docs）
- 运行模式：提 issue（--submit-issues）
- 规范来源：archive/SEO标准及覆盖情况.md（robots.txt 字段表），measures/01-robots-txt/规范.md
- 检查项：User-agent（必选）、allow/disallow（至少其一、路径以 / 开头）、sitemap（必选，含链接可访问性）、Content-Signal（必选，规范值 ai-train=yes, search=yes, ai-input=yes，期望值配置于 scripts/config/check-rules.json）、LLM-Policy（必选，指向 llms.txt 且可访问）、禁整站判定、主域/alias 内容一致性、跨域引用告警
- 特殊约定：Sitemap/LLM-Policy 的 host 与 robots.txt 所在 host 不一致时计告警（跨主机 Sitemap 声明可能不被搜索引擎识别），不计硬性错误；"引用目录须以 / 结尾"的目录语义判定不在脚本范围，见 measures/01-robots-txt/检测方式.md
- 机器可读结果：scripts/stats/robots-stats.json

## 总览

| 项目 | robots 地址（主域） | 主域可访问 | alias 可访问 | 主/alias 一致 | User-agent | allow∨disallow | 路径格式 | 禁整站 | Sitemap 链接 | Content-Signal | LLM-Policy 链接 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openEuler 官网（openEuler-portal） | https://www.openeuler.org/robots.txt | ✅ (200) | ✅ (200) | ✅ | ✅ | ✅ | ✅ | ✅ 否 | 1/1 可访问 | ✅ | 1/1 可访问 | ✅ |
| openEuler 文档（openEuler-docs） | https://docs.openeuler.org/robots.txt | ✅ (200) | ✅ (200) | ✅ | ✅ | ✅ | ✅ | ✅ 否 | 1/1 可访问 | ✅ | 1/1 可访问 | ✅ |
| openGauss 官网（openGauss-portal） | https://opengauss.org/robots.txt | ✅ (200) | - | - | ✅ | ✅ | ✅ | ✅ 否 | 1/1 可访问 | ✅ | 1/1 可访问 | ✅ |
| openGauss 文档（openGauss-docs） | https://docs.opengauss.org/robots.txt | ✅ (200) | - | - | ✅ | ✅ | ✅ | ✅ 否 | 1/1 可访问 | ✅ | 1/1 可访问 | ✅ |
| MindSpore 官网（MindSpore-portal） | https://www.mindspore.cn/robots.txt | ✅ (200) | - | - | ✅ | ✅ | ✅ | ✅ 否 | 2/2 可访问 | ✅ | 1/1 可访问 | ✅ |
| MindSpore 文档（MindSpore-docs） | 未配置 | ⏭️ 无独立 robots.txt | - | - | - | - | - | - | - | - | - | ❌ |
| openUBMC 官网（openUBMC-portal） | https://www.openubmc.cn/robots.txt | ✅ (200) | - | - | ✅ | ✅ | ✅ | ✅ 否 | 2/2 可访问 | ✅ | 1/1 可访问 | ✅ |
| openUBMC 文档（openUBMC-docs） | 未配置 | ⏭️ 无独立 robots.txt | - | - | - | - | - | - | - | - | - | ❌ |
| UnifiedBus（UnifiedBus） | https://www.unifiedbus.com/robots.txt | ✅ (200) | - | - | ✅ | ✅ | ✅ | ✅ 否 | 1/1 可访问 | ✅ | 1/1 可访问 | ✅ |
| HiFloat（HiFloat） | https://hifloat.gccorg.com/robots.txt | ✅ (200) | - | - | ✅ | ✅ | ✅ | ✅ 否 | 1/1 可访问 | ✅ | 1/1 可访问 | ✅ |

## 各项目明细

### openEuler 官网（openEuler-portal） — ✅

- robots（主域）：https://www.openeuler.org/robots.txt（HTTP 200 ✅）
- robots（alias）：https://www.openeuler.openatom.cn/robots.txt（HTTP 200 ✅）
- 主域/alias 内容一致性：一致 ✅
- User-agent：*
- allow：/；disallow：/*//
- 路径格式：✅ 均以 / 开头；禁整站：✅ 否
- Sitemap 声明 1 条：
  - https://www.openeuler.org/sitemap.xml → ✅ (200)
- Content-Signal：ai-train=yes,search=yes,ai-input=yes；取值：✅ 符合规范值（ai-train=yes, search=yes, ai-input=yes）
- LLM-Policy：https://www.openeuler.org/llms.txt，指向 llms.txt：✅；访问结果：
  - https://www.openeuler.org/llms.txt → ✅ (200)
- robots 原文（主域）：

  ```
  User-agent:*
  Content-Signal: ai-train=yes,search=yes,ai-input=yes
  Allow: /
  Disallow: /*//
  LLM-Policy: https://www.openeuler.org/llms.txt
  Sitemap: https://www.openeuler.org/sitemap.xml
  ```

### openEuler 文档（openEuler-docs） — ✅

- robots（主域）：https://docs.openeuler.org/robots.txt（HTTP 200 ✅）
- robots（alias）：https://docs.openeuler.openatom.cn/robots.txt（HTTP 200 ✅）
- 主域/alias 内容一致性：一致 ✅
- User-agent：*
- allow：/；disallow：(无)
- 路径格式：✅ 均以 / 开头；禁整站：✅ 否
- Sitemap 声明 1 条：
  - https://docs.openeuler.org/sitemap_index.xml → ✅ (200)
- Content-Signal：ai-train=yes,search=yes,ai-input=yes；取值：✅ 符合规范值（ai-train=yes, search=yes, ai-input=yes）
- LLM-Policy：https://docs.openeuler.org/llms.txt，指向 llms.txt：✅；访问结果：
  - https://docs.openeuler.org/llms.txt → ✅ (200)
- robots 原文（主域）：

  ```
  User-agent:*
  Content-Signal: ai-train=yes,search=yes,ai-input=yes
  Allow: /
  LLM-Policy: https://docs.openeuler.org/llms.txt
  Sitemap: https://docs.openeuler.org/sitemap_index.xml
  ```

### openGauss 官网（openGauss-portal） — ✅

- robots（主域）：https://opengauss.org/robots.txt（HTTP 200 ✅）
- robots（alias）：未配置 robotsAliasUrl，不检查
- User-agent：*
- allow：/；disallow：/*//
- 路径格式：✅ 均以 / 开头；禁整站：✅ 否
- Sitemap 声明 1 条：
  - https://opengauss.org/sitemap.xml → ✅ (200)
- Content-Signal：ai-train=yes,search=yes,ai-input=yes；取值：✅ 符合规范值（ai-train=yes, search=yes, ai-input=yes）
- LLM-Policy：https://opengauss.org/llms.txt，指向 llms.txt：✅；访问结果：
  - https://opengauss.org/llms.txt → ✅ (200)
- robots 原文（主域）：

  ```
  User-agent:*
  Allow: /
  Disallow: /*//
  Content-Signal: ai-train=yes,search=yes,ai-input=yes
  LLM-Policy: https://opengauss.org/llms.txt
  Sitemap: https://opengauss.org/sitemap.xml
  ```

### openGauss 文档（openGauss-docs） — ✅

- robots（主域）：https://docs.opengauss.org/robots.txt（HTTP 200 ✅）
- robots（alias）：未配置 robotsAliasUrl，不检查
- User-agent：*
- allow：/；disallow：(无)
- 路径格式：✅ 均以 / 开头；禁整站：✅ 否
- Sitemap 声明 1 条：
  - https://docs.opengauss.org/sitemap_index.xml → ✅ (200)
- Content-Signal：ai-train=yes,search=yes,ai-input=yes；取值：✅ 符合规范值（ai-train=yes, search=yes, ai-input=yes）
- LLM-Policy：https://docs.opengauss.org/llms.txt，指向 llms.txt：✅；访问结果：
  - https://docs.opengauss.org/llms.txt → ✅ (200)
- robots 原文（主域）：

  ```
  User-agent:*
  Allow: /
  Content-Signal: ai-train=yes,search=yes,ai-input=yes
  LLM-Policy: https://docs.opengauss.org/llms.txt
  Sitemap: https://docs.opengauss.org/sitemap_index.xml
  ```

### MindSpore 官网（MindSpore-portal） — ✅

- robots（主域）：https://www.mindspore.cn/robots.txt（HTTP 200 ✅）
- robots（alias）：未配置 robotsAliasUrl，不检查
- User-agent：*
- allow：/；disallow：(无)
- 路径格式：✅ 均以 / 开头；禁整站：✅ 否
- Sitemap 声明 2 条：
  - https://www.mindspore.cn/sitemap.xml → ✅ (200)
  - https://www.mindspore.cn/sitemap-docs-index.xml → ✅ (200)
- Content-Signal：ai-train=yes,search=yes,ai-input=yes；取值：✅ 符合规范值（ai-train=yes, search=yes, ai-input=yes）
- LLM-Policy：https://www.mindspore.cn/llms.txt，指向 llms.txt：✅；访问结果：
  - https://www.mindspore.cn/llms.txt → ✅ (200)
- robots 原文（主域）：

  ```
  User-agent:*
  Allow: /
  Content-Signal: ai-train=yes,search=yes,ai-input=yes
  LLM-Policy: https://www.mindspore.cn/llms.txt
  Sitemap: https://www.mindspore.cn/sitemap.xml
  Sitemap: https://www.mindspore.cn/sitemap-docs-index.xml
  ```

### MindSpore 文档（MindSpore-docs） — ❌

- robotsUrl 未配置，项目无独立 robots.txt（属主站子目录），详见 measures/01-robots-txt/各项目差异点.md

### openUBMC 官网（openUBMC-portal） — ✅

- robots（主域）：https://www.openubmc.cn/robots.txt（HTTP 200 ✅）
- robots（alias）：未配置 robotsAliasUrl，不检查
- User-agent：*
- allow：/；disallow：(无)
- 路径格式：✅ 均以 / 开头；禁整站：✅ 否
- Sitemap 声明 2 条：
  - https://www.openubmc.cn/sitemap.xml → ✅ (200)
  - https://www.openubmc.cn/docs/sitemap.xml → ✅ (200)
- Content-Signal：ai-train=yes,search=yes,ai-input=yes；取值：✅ 符合规范值（ai-train=yes, search=yes, ai-input=yes）
- LLM-Policy：https://www.openubmc.cn/llms.txt，指向 llms.txt：✅；访问结果：
  - https://www.openubmc.cn/llms.txt → ✅ (200)
- robots 原文（主域）：

  ```
  User-agent: *
  Allow: /
  Content-Signal: ai-train=yes,search=yes,ai-input=yes
  LLM-Policy: https://www.openubmc.cn/llms.txt
  Sitemap: https://www.openubmc.cn/sitemap.xml
  Sitemap: https://www.openubmc.cn/docs/sitemap.xml
  ```

### openUBMC 文档（openUBMC-docs） — ❌

- robotsUrl 未配置，项目无独立 robots.txt（属主站子目录），详见 measures/01-robots-txt/各项目差异点.md

### UnifiedBus（UnifiedBus） — ✅

- robots（主域）：https://www.unifiedbus.com/robots.txt（HTTP 200 ✅）
- robots（alias）：未配置 robotsAliasUrl，不检查
- User-agent：*
- allow：/zh/guid$、/zh/guid/vendor/list$、/zh/guid/query/list$、/en/guid$、/en/guid/vendor/list$、/en/guid/query/list$、/；disallow：/zh/my/、/en/my/、/zh/feedback/、/en/feedback/、/zh/guid/、/en/guid/
- 路径格式：✅ 均以 / 开头；禁整站：✅ 否
- Sitemap 声明 1 条：
  - https://www.unifiedbus.com/sitemap.xml → ✅ (200)
- Content-Signal：ai-train=yes,search=yes,ai-input=yes；取值：✅ 符合规范值（ai-train=yes, search=yes, ai-input=yes）
- LLM-Policy：https://www.unifiedbus.com/llms.txt，指向 llms.txt：✅；访问结果：
  - https://www.unifiedbus.com/llms.txt → ✅ (200)
- robots 原文（主域）：

  ```
  User-agent: *
  Disallow: /zh/my/
  Disallow: /en/my/
  Disallow: /zh/feedback/
  Disallow: /en/feedback/
  Disallow: /zh/guid/
  Disallow: /en/guid/
  Allow: /zh/guid$
  Allow: /zh/guid/vendor/list$
  Allow: /zh/guid/query/list$
  Allow: /en/guid$
  Allow: /en/guid/vendor/list$
  Allow: /en/guid/query/list$
  Allow: /
  Content-Signal: ai-train=yes,search=yes,ai-input=yes
  LLM-Policy: https://www.unifiedbus.com/llms.txt
  Sitemap: https://www.unifiedbus.com/sitemap.xml
  ```

### HiFloat（HiFloat） — ✅

- robots（主域）：https://hifloat.gccorg.com/robots.txt（HTTP 200 ✅）
- robots（alias）：未配置 robotsAliasUrl，不检查
- User-agent：*
- allow：/；disallow：(无)
- 路径格式：✅ 均以 / 开头；禁整站：✅ 否
- Sitemap 声明 1 条：
  - https://hifloat.gccorg.com/sitemap.xml → ✅ (200)
- Content-Signal：ai-train=yes,search=yes,ai-input=yes；取值：✅ 符合规范值（ai-train=yes, search=yes, ai-input=yes）
- LLM-Policy：https://hifloat.gccorg.com/llms.txt，指向 llms.txt：✅；访问结果：
  - https://hifloat.gccorg.com/llms.txt → ✅ (200)
- robots 原文（主域）：

  ```
  User-agent:*
  Allow: /
  Content-Signal: ai-train=yes,search=yes,ai-input=yes
  LLM-Policy: https://hifloat.gccorg.com/llms.txt
  Sitemap:https://hifloat.gccorg.com/sitemap.xml
  ```

## 结论与建议

- 硬性不符合：MindSpore-docs（robotsUrl 未配置）；openUBMC-docs（robotsUrl 未配置），需优先整改。

> 注：本报告由 scripts/checks/check-robots.mjs 自动生成（同批次数据见 scripts/stats/robots-stats.json）。Content-Signal 期望值取自 scripts/config/check-rules.json；"引用目录须以 / 结尾"、disallow 误伤等业务判断仍需人工，见 measures/01-robots-txt/检测方式.md。硬性不符合项目已按 --submit-issues 流程提 issue（告警与 robotsUrl 未配置不提单）。
