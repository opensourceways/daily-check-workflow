# 失效链接检查完全版报告 · openUBMC 官网（openUBMC-portal）

- 检查时间：2026-11-23T18:39:37.120Z
- 已有未关闭 issue：本轮只扫描归档，未提单/未写回（写回需 force_check 强制执行）

### 项目信息

- 项目：openUBMC 官网（openUBMC-portal）
- 数据源：`https://gitcode.com/openUBMC/website`（main 分支，取 AtomGit 同名镜像）
- 站点域名：https://www.openubmc.cn
- 相对路径前缀（urlPrefix）：`/zh`
- 结论：❌（失效 URL 109 个 / 142 处引用）

### 扫描概况

| 扫描文件 | 链接引用 | 探测 URL（去重后） | 有效 | 失效 |
| --- | --- | --- | --- | --- |
| 713 | 1191 | 852 | 743 | 109 |

### 失效链接明细（状态分布：`403`×2、`418`×85、`429`×1、`521`×1、`网络错误`×20）

#### HTTP 403（2 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://summary.openubmc.cn` | packages/website/config/url-config/index.ts:7 | — |
| `https://www.openubmc.cn/docs/zh/` | .agents/skills/docs-update-news/SKILL.md:174 | — |

#### HTTP 418（85 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://atomgit.com/openUBMC/account/issues/212` | packages/website/content/zh/version/26.09.md:39 | — |
| `https://atomgit.com/openUBMC/account/issues/213` | packages/website/content/zh/version/26.09.md:108 | — |
| `https://atomgit.com/openUBMC/account/issues/214` | packages/website/content/zh/version/26.09.md:39 | — |
| `https://atomgit.com/openUBMC/bios/issues/151` | packages/website/content/zh/version/26.09.md:69 | — |
| `https://atomgit.com/openUBMC/bios/issues/159` | packages/website/content/zh/version/26.09.md:94 | — |
| `https://atomgit.com/openUBMC/bios/issues/162` | packages/website/content/zh/version/26.09.md:94 | — |
| `https://atomgit.com/openUBMC/bios/issues/163` | packages/website/content/zh/version/26.09.md:94 | — |
| `https://atomgit.com/openUBMC/bios/issues/164` | packages/website/content/zh/version/26.09.md:94 | — |
| `https://atomgit.com/openUBMC/component_drivers/issues/456` | packages/website/content/zh/version/26.09.md:65 | — |
| `https://atomgit.com/openUBMC/docs/issues/793` | packages/website/content/zh/version/26.09.md:40 | — |
| `https://atomgit.com/openUBMC/docs/issues/794` | packages/website/content/zh/version/26.09.md:40 | — |
| `https://atomgit.com/openUBMC/docs/issues/799` | packages/website/content/zh/version/26.09.md:40 | — |
| `https://atomgit.com/openUBMC/docs/issues/832` | packages/website/content/zh/version/26.09.md:39 | — |
| `https://atomgit.com/openUBMC/docs/issues/836` | packages/website/content/zh/version/26.09.md:40 | — |
| `https://atomgit.com/openUBMC/docs/issues/837` | packages/website/content/zh/version/26.09.md:40 | — |
| `https://atomgit.com/openUBMC/docs/issues/846` | packages/website/content/zh/version/26.09.md:39 | — |
| `https://atomgit.com/openUBMC/docs/issues/851` | packages/website/content/zh/version/26.09.md:39 | — |
| `https://atomgit.com/openUBMC/docs/issues/853` | packages/website/content/zh/version/26.09.md:39 | — |
| `https://atomgit.com/openUBMC/fructrl/issues/76` | packages/website/content/zh/version/26.09.md:81 | — |
| `https://atomgit.com/openUBMC/general_hardware/issues/359` | packages/website/content/zh/version/26.09.md:55 | — |
| `https://atomgit.com/openUBMC/general_hardware/issues/368` | packages/website/content/zh/version/26.09.md:55 | — |
| `https://atomgit.com/openUBMC/general_hardware/issues/378` | packages/website/content/zh/version/26.09.md:73 | — |
| `https://atomgit.com/openUBMC/general_hardware/issues/379` | packages/website/content/zh/version/26.09.md:72 | — |
| `https://atomgit.com/openUBMC/infrastructure/issues/166` | packages/website/content/zh/version/26.09.md:47 | — |
| `https://atomgit.com/openUBMC/infrastructure/issues/185` | packages/website/content/zh/version/26.09.md:44 | — |
| `https://atomgit.com/openUBMC/infrastructure/issues/194` | packages/website/content/zh/version/26.09.md:45 | — |
| `https://atomgit.com/openUBMC/libmcpp/issues/131` | packages/website/content/zh/version/26.09.md:76 | — |
| `https://atomgit.com/openUBMC/libmcpp/issues/132` | packages/website/content/zh/version/26.09.md:76 | — |
| `https://atomgit.com/openUBMC/libmcpp/issues/133` | packages/website/content/zh/version/26.09.md:76 | — |
| `https://atomgit.com/openUBMC/libmcpp/issues/134` | packages/website/content/zh/version/26.09.md:76 | — |
| `https://atomgit.com/openUBMC/libmcpp/issues/135` | packages/website/content/zh/version/26.09.md:76 | — |
| `https://atomgit.com/openUBMC/libmcpp/issues/136` | packages/website/content/zh/version/26.09.md:76 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/20` | packages/website/content/zh/version/26.09.md:77、packages/website/content/zh/version/26.09.md:101 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/21` | packages/website/content/zh/version/26.09.md:77 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/22` | packages/website/content/zh/version/26.09.md:77 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/23` | packages/website/content/zh/version/26.09.md:77 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/24` | packages/website/content/zh/version/26.09.md:77 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/25` | packages/website/content/zh/version/26.09.md:77 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/26` | packages/website/content/zh/version/26.09.md:77 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/27` | packages/website/content/zh/version/26.09.md:77 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/28` | packages/website/content/zh/version/26.09.md:77 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/29` | packages/website/content/zh/version/26.09.md:77 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/30` | packages/website/content/zh/version/26.09.md:77 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/31` | packages/website/content/zh/version/26.09.md:77 | — |
| `https://atomgit.com/openUBMC/manifest/issues/296` | packages/website/content/zh/version/26.09.md:46 | — |
| `https://atomgit.com/openUBMC/manifest/issues/299` | packages/website/content/zh/version/26.09.md:41 | — |
| `https://atomgit.com/openUBMC/manifest/issues/300` | packages/website/content/zh/version/26.09.md:41 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/385` | packages/website/content/zh/version/26.09.md:53 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/387` | packages/website/content/zh/version/26.09.md:70 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/388` | packages/website/content/zh/version/26.09.md:78 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/392` | packages/website/content/zh/version/26.09.md:84 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/393` | packages/website/content/zh/version/26.09.md:83 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/402` | packages/website/content/zh/version/26.09.md:80 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/404` | packages/website/content/zh/version/26.09.md:71 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/405` | packages/website/content/zh/version/26.09.md:82 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/408` | packages/website/content/zh/version/26.09.md:79 | — |
| `https://atomgit.com/openUBMC/network_adapter/issues/352` | packages/website/content/zh/version/26.09.md:64 | — |
| `https://atomgit.com/openUBMC/network_adapter/issues/399` | packages/website/content/zh/version/26.09.md:56 | — |
| `https://atomgit.com/openUBMC/power_mgmt/issues/265` | packages/website/content/zh/version/26.09.md:92 | — |
| `https://atomgit.com/openUBMC/QA/issues/227` | packages/website/content/zh/version/26.09.md:106 | — |
| `https://atomgit.com/openUBMC/QA/issues/233` | packages/website/content/zh/version/26.09.md:106 | — |
| `https://atomgit.com/openUBMC/QA/issues/243` | packages/website/content/zh/version/26.09.md:107 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/908` | packages/website/content/zh/version/26.09.md:70 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/909` | packages/website/content/zh/version/26.09.md:54 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/911` | packages/website/content/zh/version/26.09.md:103 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/912` | packages/website/content/zh/version/26.09.md:100 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/913` | packages/website/content/zh/version/26.09.md:101 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/928` | packages/website/content/zh/version/26.09.md:89 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/929` | packages/website/content/zh/version/26.09.md:90 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/936` | packages/website/content/zh/version/26.09.md:84 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/937` | packages/website/content/zh/version/26.09.md:59 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/938` | packages/website/content/zh/version/26.09.md:102 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/947` | packages/website/content/zh/version/26.09.md:71 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/999` | packages/website/content/zh/version/26.09.md:85 | — |
| `https://atomgit.com/openUBMC/storage/issues/414` | packages/website/content/zh/version/26.09.md:59 | — |
| `https://atomgit.com/openUBMC/storage/issues/416` | packages/website/content/zh/version/26.09.md:59 | — |
| `https://atomgit.com/openUBMC/storage/issues/417` | packages/website/content/zh/version/26.09.md:60 | — |
| `https://atomgit.com/openUBMC/storage/issues/422` | packages/website/content/zh/version/26.09.md:61 | — |
| `https://atomgit.com/openUBMC/thermal_mgmt/issues/191` | packages/website/content/zh/version/26.09.md:95 | — |
| `https://atomgit.com/openUBMC/vpd/issues/630` | packages/website/content/zh/version/26.09.md:66 | — |
| `https://atomgit.com/openUBMC/vpd/issues/631` | packages/website/content/zh/version/26.09.md:93 | — |
| `https://atomgit.com/openUBMC/webui/issues/414` | packages/website/content/zh/version/26.09.md:54 | — |
| `https://atomgit.com/openUBMC/webui/issues/422` | packages/website/content/zh/version/26.09.md:91 | — |
| `https://atomgit.com/openUBMC/webui/issues/423` | packages/website/content/zh/version/26.09.md:88 | — |
| `https://atomgit.com/openUBMC/webui/issues/428` | packages/website/content/zh/version/26.09.md:60 | — |

#### HTTP 429（1 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://atomgit.com/api/v5/repos/openUBMC/docs/contents/` | .agents/skills/release-note-sync/SKILL.md:31 | — |

#### HTTP 521（1 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://beian.miit.gov.cn/#/Integrated/index` | packages/website/config/url-config/index.ts:1 | — |

#### 网络错误（20 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `http://192.168.xxx.xxx:7890` | packages/website/content/en/blogs/pki-cert-service-guide.md:56、packages/website/content/en/blogs/pki-cert-service-guide.md:57、packages/website/content/en/blogs/pki-cert-service-guide.md:80、packages/website/content/en/blogs/pki-cert-service-guide.md:81、packages/website/content/zh/blogs/pki-cert-service-guide.md:56、packages/website/content/zh/blogs/pki-cert-service-guide.md:57、packages/website/content/zh/blogs/pki-cert-service-guide.md:80、packages/website/content/zh/blogs/pki-cert-service-guide.md:81 | AbortError |
| `http://license.coscl.org.cn/MulanPSL2` | packages/website/content/en/version/25.03.md:9、packages/website/content/en/version/25.06.md:9、packages/website/content/en/version/25.09.md:10、packages/website/content/zh/version/25-12-LTS-SP2.md:11、packages/website/content/zh/version/25-12-LTS-SP3.md:11、packages/website/content/zh/version/25.03.md:10、packages/website/content/zh/version/25.06.md:10、packages/website/content/zh/version/25.09.md:11、packages/website/content/zh/version/25.12.md:11、packages/website/content/zh/version/26.03.md:11、packages/website/content/zh/version/26.06.md:10、packages/website/content/zh/version/26.09.md:11 | AbortError |
| `https://.../blob/main/openUBMC-26.09/open-source-software-notice.md` | .agents/skills/release-note-sync/SKILL.md:115 | ENOTFOUND |
| `https://192.168.xxx.xxx/ejbca/ra/` | packages/website/content/en/blogs/pki-cert-service-guide.md:601、packages/website/content/zh/blogs/pki-cert-service-guide.md:622 | ERR_SSL_SSLV3_ALERT_HANDSHAKE_FAILURE |
| `https://beian.mps.gov.cn/#/query/webSearch` | packages/website/config/url-config/index.ts:5 | ETIMEDOUT |
| `https://etherpad.openUBMC.org/` | packages/website/locales/sig/sig-en.ts:50、packages/website/locales/sig/sig-zh.ts:49 | ENOTFOUND |
| `https://myejbca.test.local:443/ejbca/ra/enrollwithusername.xhtml?username=superadmin` | packages/website/content/en/blogs/pki-cert-service-guide.md:161、packages/website/content/zh/blogs/pki-cert-service-guide.md:161 | EAI_AGAIN |
| `https://myejbca.test.local/ejbca/adminweb` | packages/website/content/en/blogs/pki-cert-service-guide.md:170、packages/website/content/zh/blogs/pki-cert-service-guide.md:171 | EAI_AGAIN |
| `https://openubmc.cn` | packages/website/content/zh/news/20261103-star.md:22 | AbortError |
| `https://openubmc.cn/download` | packages/website/content/zh/version/25-12-LTS-SP2.md:34、packages/website/content/zh/version/25-12-LTS-SP3.md:35、packages/website/content/zh/version/26.03.md:63、packages/website/content/zh/version/26.06.md:91、packages/website/content/zh/version/26.09.md:113 | AbortError |
| `https://openubmc.cn/en` | packages/website/config/markdown/legal-notice-en.md:7 | AbortError |
| `https://openubmc.cn/en/download` | packages/website/content/en/news/2503-release.md:31、packages/website/content/en/version/25.06.md:40、packages/website/content/en/version/25.09.md:85 | AbortError |
| `https://openubmc.cn/en/marketplace/bmcsdk` | packages/website/content/en/blogs/start_openUBMC.md:59 | AbortError |
| `https://openubmc.cn/en/version/25.03` | packages/website/content/en/news/2503-release.md:33 | AbortError |
| `https://openubmc.cn/zh` | packages/website/config/markdown/legal-notice.md:7、packages/website/content/zh/blogs/start_openUBMC.md:101 | AbortError |
| `https://openubmc.cn/zh/code-of-conduct` | packages/website/content/zh/news/20261103-star.md:20 | AbortError |
| `https://openubmc.cn/zh/download` | packages/website/content/zh/news/2503-release.md:24、packages/website/content/zh/version/25.06.md:41、packages/website/content/zh/version/25.09.md:86、packages/website/content/zh/version/25.12.md:58 | AbortError |
| `https://openubmc.cn/zh/marketplace/bmcsdk` | packages/website/content/zh/blogs/start_openUBMC.md:58 | AbortError |
| `https://openubmc.cn/zh/sig/sig-list/` | .agents/skills/frontmatter-data-extractor/SKILL.md:60 | AbortError |
| `https://openubmc.cn/zh/version/25.03` | packages/website/content/zh/news/2503-release.md:26 | AbortError |
