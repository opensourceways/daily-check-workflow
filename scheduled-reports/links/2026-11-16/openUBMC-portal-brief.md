# 失效链接检查简短报告 · openUBMC 官网（openUBMC-portal）

- 检查时间：2026-11-16T16:18:48.625Z
- 已有未关闭 issue：本轮只扫描归档，未提单/未写回（写回需 force_check 强制执行）
- 数据源：https://gitcode.com/openUBMC/website（main 分支）
- 结论：❌

### 问题清单（44 个失效 URL，共 66 处引用）

状态分布：`403`×2、`418`×34、`521`×1、`网络错误`×7

#### HTTP 403（2 个）

| URL | 引用位置 |
| --- | --- |
| `https://summary.openubmc.cn` | packages/website/config/url-config/index.ts:7 |
| `https://www.openubmc.cn/docs/zh/` | .agents/skills/docs-update-news/SKILL.md:174 |

#### HTTP 418（34 个）

| URL | 引用位置 |
| --- | --- |
| `https://atomgit.com/openUBMC/account/issues/213` | packages/website/content/zh/version/26.09.md:108 |
| `https://atomgit.com/openUBMC/bios/issues/159` | packages/website/content/zh/version/26.09.md:94 |
| `https://atomgit.com/openUBMC/bios/issues/162` | packages/website/content/zh/version/26.09.md:94 |
| `https://atomgit.com/openUBMC/bios/issues/163` | packages/website/content/zh/version/26.09.md:94 |
| `https://atomgit.com/openUBMC/bios/issues/164` | packages/website/content/zh/version/26.09.md:94 |
| （其余 29 个见完全版） | - |

#### HTTP 521（1 个）

| URL | 引用位置 |
| --- | --- |
| `https://beian.miit.gov.cn/#/Integrated/index` | packages/website/config/url-config/index.ts:1 |

#### 网络错误（7 个）

| URL | 引用位置 |
| --- | --- |
| `http://192.168.xxx.xxx:7890` | packages/website/content/en/blogs/pki-cert-service-guide.md:56、packages/website/content/en/blogs/pki-cert-service-guide.md:57、packages/website/content/en/blogs/pki-cert-service-guide.md:80 等 8 处 |
| `http://license.coscl.org.cn/MulanPSL2` | packages/website/content/en/version/25.03.md:9、packages/website/content/en/version/25.06.md:9、packages/website/content/en/version/25.09.md:10 等 12 处 |
| `https://.../blob/main/openUBMC-26.09/open-source-software-notice.md` | .agents/skills/release-note-sync/SKILL.md:115 |
| `https://192.168.xxx.xxx/ejbca/ra/` | packages/website/content/en/blogs/pki-cert-service-guide.md:601、packages/website/content/zh/blogs/pki-cert-service-guide.md:622 |
| `https://etherpad.openUBMC.org/` | packages/website/locales/sig/sig-en.ts:50、packages/website/locales/sig/sig-zh.ts:49 |
| （其余 2 个见完全版） | - |
