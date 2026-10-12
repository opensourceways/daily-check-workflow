# robots.txt 规范检查报告

- 检查时间：2026-10-12
- 检查范围：projects.config.json 中同时配置了 `robotsUrl` 和 `robotsAliasUrl` 的项目（共 2 个：openEuler-portal、openEuler-docs，各检查主域 + alias 域，共 4 个 URL）；其余 8 个项目未配置 robotsAliasUrl，不在本次范围
- 规范来源：archive/SEO标准及覆盖情况.md（robots.txt 字段表）
- 检查项：User-agent（必选）、allow/disallow（至少一个，路径须以 `/` 开头、目录须以 `/` 结尾）、sitemap（必选）、Content-Signal（必选，规范值 `ai-train=yes, search=yes, ai-input=yes`）、LLM-Policy（必选，指向 llms.txt）、涉及链接可访问性、是否 Disallow 整站、字段缺失

## 总览

| 项目 | robots 地址 | 可访问 | User-agent | allow/disallow | sitemap | Content-Signal | LLM-Policy | 禁整站 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openEuler-portal | https://www.openeuler.org/robots.txt | ✅ (200) | ✅ | ✅ (Allow: / + Disallow: /*//) | ✅ (200) | ✅ 值符合 | ✅ (200) | ✅ 未禁整站 | ⚠️ 有告警 |
| openEuler-portal (alias) | https://www.openeuler.openatom.cn/robots.txt | ✅ (200) | ✅ | ✅ (同上) | ✅ (200) | ✅ 值符合 | ✅ (200) | ✅ 未禁整站 | ⚠️ 有告警 |
| openEuler-docs | https://docs.openeuler.org/robots.txt | ✅ (200) | ✅ | ✅ (Allow: /) | ✅ (200) | ✅ 值符合 | ✅ (200) | ✅ 未禁整站 | ⚠️ 有告警 |
| openEuler-docs (alias) | https://docs.openeuler.openatom.cn/robots.txt | ✅ (200) | ✅ | ✅ (同上) | ✅ (200) | ✅ 值符合 | ✅ (200) | ✅ 未禁整站 | ⚠️ 有告警 |

## 实际内容

**openEuler-portal**（两域名内容完全一致）：

```
User-agent:*
Content-Signal: ai-train=yes,search=yes,ai-input=yes
Allow: /

Disallow: /*//
LLM-Policy: https://www.openeuler.openatom.cn/llms.txt
Sitemap:https://www.openeuler.openatom.cn/sitemap.xml
```

**openEuler-docs**（两域名内容完全一致）：

```
User-agent:*
Content-Signal: ai-train=yes,search=yes,ai-input=yes
Allow: /
LLM-Policy: https://docs.openeuler.openatom.cn/llms.txt

Sitemap:https://docs.openeuler.openatom.cn/sitemap_index.xml
```

## 链接可访问性

robots.txt 内引用的链接（Sitemap、LLM-Policy）全部可访问：

| 引用方 | 链接 | 状态 |
| --- | --- | --- |
| portal robots.txt | https://www.openeuler.openatom.cn/llms.txt | 200 |
| portal robots.txt | https://www.openeuler.openatom.cn/sitemap.xml | 200 |
| docs robots.txt | https://docs.openeuler.openatom.cn/llms.txt | 200 |
| docs robots.txt | https://docs.openeuler.openatom.cn/sitemap_index.xml | 200 |

## 问题清单

### ⚠️ 告警

1. **主域 robots.txt 跨域引用 alias 域链接**（www.openeuler.org、docs.openeuler.org 的 robots.txt 中 Sitemap/LLM-Policy 均指向 `*.openatom.cn`）
   - 按本仓库约定（domainAlias 视为合法域名）不计为硬性问题，但搜索引擎通常只接受与 robots.txt 所在主机一致（或已在 Search Console 验证）的 sitemap 声明，跨域 Sitemap 行可能不被识别，主域等效链接实测均可访问（均 200）。
   - 呼应 921 复盘"atom环境robots.txt中域名错误"：现两域 robots 内容逐字节相同、统一指向 .cn，域名自动替换脚本是否应对 robots.txt 生效需确认。

### ✅ 合规项

- **Content-Signal 取值**：现网 `ai-train=yes,search=yes,ai-input=yes` 符合规范值（2026-10-12 澄清：archive 原载 `ai-train=no` 仅为示例笔误，标准口径为全 `yes`，已同步更正 archive 与 measures/01-robots-txt/规范.md）。

- **字段缺失检查**：按 archive 规范 6 个字段（User-agent / disallow / allow / sitemap / Content-Signal / LLM-Policy），两项目均无缺失（disallow 与 allow 满足"至少其一"即可，docs 仅有 Allow: / 合规）。
- **禁整站检查**：所有 user-agent 组均无 `Disallow: /`，且 `Allow: /` 放行全站；portal 的 `Disallow: /*//` 仅禁止含双斜杠的路径（archive 表内已认可该写法），不构成整站封锁。
- **路径格式**：allow/disallow 值均以 `/` 开头，`/` 单独出现合规；`/*//` 为通配模式非目录引用，无需以 `/` 结尾判定。
- **主域与 alias 域一致性**：两项目各自两域名返回内容一致，无 921 复盘类域名漂移。

### ℹ️ 说明（格式风格，不影响解析）

- `User-agent:*`、`Sitemap:https://...` 冒号后无空格；`Content-Signal` 逗号后无空格——符合 RFC 9309 语法，仅作风格提示。

## 结论

2 个在范围内的项目（4 个 robots.txt）字段完整、取值符合规范（含 Content-Signal `ai-train=yes`）、链接均可访问、无整站 Disallow；仅余主域跨域引用 alias 域 Sitemap/LLM-Policy 一项待确认。
