# 失效链接检查完全版报告 · openUBMC 官网（openUBMC-portal）

- 检查时间：2026-11-16T16:18:48.625Z
- 已有未关闭 issue：本轮只扫描归档，未提单/未写回（写回需 force_check 强制执行）

### 项目信息

- 项目：openUBMC 官网（openUBMC-portal）
- 数据源：`https://gitcode.com/openUBMC/website`（main 分支，取 AtomGit 同名镜像）
- 站点域名：https://www.openubmc.cn
- 相对路径前缀（urlPrefix）：`/zh`
- 结论：❌（失效 URL 44 个 / 66 处引用）

### 扫描概况

| 扫描文件 | 链接引用 | 探测 URL（去重后） | 有效 | 失效 |
| --- | --- | --- | --- | --- |
| 709 | 1182 | 848 | 804 | 44 |

### 失效链接明细（状态分布：`403`×2、`418`×34、`521`×1、`网络错误`×7）

#### HTTP 403（2 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://summary.openubmc.cn` | packages/website/config/url-config/index.ts:7 | — |
| `https://www.openubmc.cn/docs/zh/` | .agents/skills/docs-update-news/SKILL.md:174 | — |

#### HTTP 418（34 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://atomgit.com/openUBMC/account/issues/213` | packages/website/content/zh/version/26.09.md:108 | — |
| `https://atomgit.com/openUBMC/bios/issues/159` | packages/website/content/zh/version/26.09.md:94 | — |
| `https://atomgit.com/openUBMC/bios/issues/162` | packages/website/content/zh/version/26.09.md:94 | — |
| `https://atomgit.com/openUBMC/bios/issues/163` | packages/website/content/zh/version/26.09.md:94 | — |
| `https://atomgit.com/openUBMC/bios/issues/164` | packages/website/content/zh/version/26.09.md:94 | — |
| `https://atomgit.com/openUBMC/component_drivers/issues/175` | packages/website/content/zh/version/26.09.md:146 | — |
| `https://atomgit.com/openUBMC/fructrl/issues/72` | packages/website/content/zh/version/26.09.md:149 | — |
| `https://atomgit.com/openUBMC/frudata/issues/49` | packages/website/content/zh/version/26.09.md:153 | — |
| `https://atomgit.com/openUBMC/general_hardware/issues/320` | packages/website/content/zh/version/26.09.md:152 | — |
| `https://atomgit.com/openUBMC/libmcpp/issues/118` | packages/website/content/zh/version/26.09.md:150 | — |
| `https://atomgit.com/openUBMC/network_adapter/issues/430` | packages/website/content/zh/version/26.09.md:142 | — |
| `https://atomgit.com/openUBMC/nsm/issues/6` | packages/website/content/zh/version/26.09.md:143 | — |
| `https://atomgit.com/openUBMC/pcie_device/issues/124` | packages/website/content/zh/version/26.09.md:147 | — |
| `https://atomgit.com/openUBMC/power_mgmt/issues/265` | packages/website/content/zh/version/26.09.md:92 | — |
| `https://atomgit.com/openUBMC/QA/issues/227` | packages/website/content/zh/version/26.09.md:106 | — |
| `https://atomgit.com/openUBMC/QA/issues/233` | packages/website/content/zh/version/26.09.md:106 | — |
| `https://atomgit.com/openUBMC/QA/issues/243` | packages/website/content/zh/version/26.09.md:107 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/799` | packages/website/content/zh/version/26.09.md:148 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/833` | packages/website/content/zh/version/26.09.md:151 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/911` | packages/website/content/zh/version/26.09.md:103 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/912` | packages/website/content/zh/version/26.09.md:100 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/913` | packages/website/content/zh/version/26.09.md:101 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/928` | packages/website/content/zh/version/26.09.md:89 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/929` | packages/website/content/zh/version/26.09.md:90 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/938` | packages/website/content/zh/version/26.09.md:102 | — |
| `https://atomgit.com/openUBMC/rootfs_user/issues/14` | packages/website/content/zh/version/26.09.md:154 | — |
| `https://atomgit.com/openUBMC/thermal_mgmt/issues/191` | packages/website/content/zh/version/26.09.md:95 | — |
| `https://atomgit.com/openUBMC/vpd/issues/525` | packages/website/content/zh/version/26.09.md:144 | — |
| `https://atomgit.com/openUBMC/vpd/issues/631` | packages/website/content/zh/version/26.09.md:93 | — |
| `https://atomgit.com/openUBMC/webui/issues/422` | packages/website/content/zh/version/26.09.md:91 | — |
| `https://atomgit.com/openUBMC/webui/issues/423` | packages/website/content/zh/version/26.09.md:88 | — |
| `https://raw.gitcode.com/` | .agents/skills/release-note-sync/SKILL.md:40 | — |
| `https://raw.gitcode.com/openUBMC/docs/raw/main/docs/public/docs-redirects.yaml` | packages/scripts/merge-docs-redirects.ts:67 | — |
| `https://raw.gitcode.com/openUBMC/release_management/raw/main/openUBMC-26.09/release-note.md` | .agents/skills/release-note-sync/SKILL.md:16 | — |

#### HTTP 521（1 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://beian.miit.gov.cn/#/Integrated/index` | packages/website/config/url-config/index.ts:1 | — |

#### 网络错误（7 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `http://192.168.xxx.xxx:7890` | packages/website/content/en/blogs/pki-cert-service-guide.md:56、packages/website/content/en/blogs/pki-cert-service-guide.md:57、packages/website/content/en/blogs/pki-cert-service-guide.md:80、packages/website/content/en/blogs/pki-cert-service-guide.md:81、packages/website/content/zh/blogs/pki-cert-service-guide.md:56、packages/website/content/zh/blogs/pki-cert-service-guide.md:57、packages/website/content/zh/blogs/pki-cert-service-guide.md:80、packages/website/content/zh/blogs/pki-cert-service-guide.md:81 | AbortError |
| `http://license.coscl.org.cn/MulanPSL2` | packages/website/content/en/version/25.03.md:9、packages/website/content/en/version/25.06.md:9、packages/website/content/en/version/25.09.md:10、packages/website/content/zh/version/25-12-LTS-SP2.md:11、packages/website/content/zh/version/25-12-LTS-SP3.md:11、packages/website/content/zh/version/25.03.md:10、packages/website/content/zh/version/25.06.md:10、packages/website/content/zh/version/25.09.md:11、packages/website/content/zh/version/25.12.md:11、packages/website/content/zh/version/26.03.md:11、packages/website/content/zh/version/26.06.md:10、packages/website/content/zh/version/26.09.md:11 | AbortError |
| `https://.../blob/main/openUBMC-26.09/open-source-software-notice.md` | .agents/skills/release-note-sync/SKILL.md:115 | ENOTFOUND |
| `https://192.168.xxx.xxx/ejbca/ra/` | packages/website/content/en/blogs/pki-cert-service-guide.md:601、packages/website/content/zh/blogs/pki-cert-service-guide.md:622 | ERR_SSL_SSLV3_ALERT_HANDSHAKE_FAILURE |
| `https://etherpad.openUBMC.org/` | packages/website/locales/sig/sig-en.ts:50、packages/website/locales/sig/sig-zh.ts:49 | ENOTFOUND |
| `https://myejbca.test.local:443/ejbca/ra/enrollwithusername.xhtml?username=superadmin` | packages/website/content/en/blogs/pki-cert-service-guide.md:161、packages/website/content/zh/blogs/pki-cert-service-guide.md:161 | EAI_AGAIN |
| `https://myejbca.test.local/ejbca/adminweb` | packages/website/content/en/blogs/pki-cert-service-guide.md:170、packages/website/content/zh/blogs/pki-cert-service-guide.md:171 | EAI_AGAIN |
