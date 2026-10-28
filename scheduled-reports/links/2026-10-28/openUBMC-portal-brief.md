# 失效链接检查简短报告 · openUBMC 官网（openUBMC-portal）

- 检查时间：2026-10-28T12:22:17.637Z
- 运行模式：dry-run（未提 issue）
- 数据源：https://gitcode.com/openUBMC/website（main 分支）
- 结论：❌

### 问题清单（198 个失效 URL，共 270 处引用）

状态分布：`403`×2、`404`×144、`418`×44、`521`×1、`网络错误`×7

#### HTTP 403（2 个）

| URL | 引用位置 |
| --- | --- |
| `https://summary.openubmc.cn` | packages/website/config/url-config/index.ts:7 |
| `https://www.openubmc.cn/docs/zh/` | .agents/skills/docs-update-news/SKILL.md:173 |

#### HTTP 404（144 个）

| URL | 引用位置 |
| --- | --- |
| `https://atomgit.com/api/v5/repos/` | .agents/skills/release-note-sync/SKILL.md:31 |
| `https://example.com/a.zip` | packages/website/utils/__tests__/repo-meta.test.ts:10 |
| `https://repo.openubmc.cn/tools/openUBMC_qemu_default.cpio.gz` | packages/website/utils/__tests__/repo-meta.test.ts:18 |
| `https://www.openubmc.cn/docs/en/development/quick_start/prepare_environment/docker_env.html` | packages/website/content/en/blogs/start_openUBMC.md:18 |
| `https://www.openubmc.cn/docs/en/development/quick_start/prepare_environment/ubuntu_env.html` | packages/website/content/en/blogs/Migration_system.md:36、packages/website/content/en/blogs/Migration_system.md:50 |
| （其余 139 个见完全版） | - |

#### HTTP 418（44 个）

| URL | 引用位置 |
| --- | --- |
| `https://atomgit.com/openUBMC/account/issues/213` | packages/website/content/zh/version/26.09.md:108 |
| `https://atomgit.com/openUBMC/bios/issues/159` | packages/website/content/zh/version/26.09.md:94 |
| `https://atomgit.com/openUBMC/bios/issues/162` | packages/website/content/zh/version/26.09.md:94 |
| `https://atomgit.com/openUBMC/bios/issues/163` | packages/website/content/zh/version/26.09.md:94 |
| `https://atomgit.com/openUBMC/bios/issues/164` | packages/website/content/zh/version/26.09.md:94 |
| （其余 39 个见完全版） | - |

#### HTTP 521（1 个）

| URL | 引用位置 |
| --- | --- |
| `https://beian.miit.gov.cn/#/Integrated/index` | packages/website/config/url-config/index.ts:1 |

#### 网络错误（7 个）

| URL | 引用位置 |
| --- | --- |
| `http://192.168.xxx.xxx:7890` | packages/website/content/en/blogs/pki-cert-service-guide.md:56、packages/website/content/en/blogs/pki-cert-service-guide.md:57、packages/website/content/en/blogs/pki-cert-service-guide.md:80 等 8 处 |
| `http://license.coscl.org.cn/MulanPSL2` | packages/website/content/en/version/25.03.md:9、packages/website/content/en/version/25.06.md:9、packages/website/content/en/version/25.09.md:10 等 12 处 |
| `https://.../blob/main/openUBMC-26.09/open-source-software-notice.md` | .agents/skills/release-note-sync/SKILL.md:113 |
| `https://192.168.xxx.xxx/ejbca/ra/` | packages/website/content/en/blogs/pki-cert-service-guide.md:601、packages/website/content/zh/blogs/pki-cert-service-guide.md:622 |
| `https://etherpad.openUBMC.org/` | packages/website/locales/sig/sig-en.ts:50、packages/website/locales/sig/sig-zh.ts:49 |
| （其余 2 个见完全版） | - |
