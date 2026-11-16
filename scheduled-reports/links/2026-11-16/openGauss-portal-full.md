# 失效链接检查完全版报告 · openGauss 官网（openGauss-portal）

- 检查时间：2026-11-16T16:18:48.625Z
- 已有未关闭 issue：本轮只扫描归档，未提单/未写回（写回需 force_check 强制执行）

### 项目信息

- 项目：openGauss 官网（openGauss-portal）
- 数据源：`https://gitcode.com/opengauss/website`（v2 分支，取 AtomGit 同名镜像）
- 站点域名：https://opengauss.org
- 相对路径前缀（urlPrefix）：`/zh`
- 结论：❌（失效 URL 86 个 / 310 处引用）

### 扫描概况

| 扫描文件 | 链接引用 | 探测 URL（去重后） | 有效 | 失效 |
| --- | --- | --- | --- | --- |
| 1356 | 4764 | 3444 | 3358 | 86 |

### 失效链接明细（状态分布：`403`×12、`404`×26、`412`×2、`418`×8、`502`×2、`网络错误`×36）

#### HTTP 403（12 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `http://www.w3.org/2000/svg` | app/zh/migration/case/index.md:137、opendesign/checkbox/src/checkbox.tsx:65、opendesign/search/OSearch.vue:10、opendesign/select/OSelect.vue:63、opendesign/tag/src/tag.tsx:34 | — |
| `http://www.xugucn.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:60、app/.vitepress/src/data/showcase/showcase-zh.ts:60、app/.vitepress/src-new/data/showcase/showcase-en.ts:60、app/.vitepress/src-new/data/showcase/showcase-zh.ts:60、app/en/user-practice/dbv/xugucn/index.md:7、app/zh/user-practice/dbv/xugucn/index.md:7 | — |
| `https://e.huawei.com/cn/talent/#/cert/product-details?certifiedProductId=503&authenticationLevel=CTYPE_CARE_HCIA&technicalField=PSC&version=1.0` | app/zh/events/2022-10-28/Meetup.md:39 | — |
| `https://hwlive.263live.net` | app/.vitepress/src/data/url-config/index.ts:61 | — |
| `https://meetingvideo.obs.ap-southeast-1.myhuaweicloud.com` | app/.vitepress/src/data/url-config/index.ts:10、app/.vitepress/src-new/data/url-config/index.ts:12 | — |
| `https://obs-for-opengauss-summit.obs.cn-north-4.myhuaweicloud.com` | app/.vitepress/src/data/url-config/index.ts:2、app/.vitepress/src-new/data/url-config/index.ts:2 | — |
| `https://scjg.tj.gov.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:500、app/.vitepress/src/data/showcase/showcase-zh.ts:496、app/.vitepress/src-new/data/showcase/showcase-en.ts:500、app/.vitepress/src-new/data/showcase/showcase-zh.ts:496、app/en/user-practice/bigbusiness/tianjinshichangjianduwei/index.md:7、app/zh/user-practice/bigbusiness/tianjinshichangjianduwei/index.md:7 | — |
| `https://www.npmjs.com` | app/.vitepress/src-new/data/url-config/index.ts:60 | — |
| `https://www.thunisoft.cn/col82/index` | app/.vitepress/src/data/showcase/showcase-en.ts:92、app/.vitepress/src/data/showcase/showcase-zh.ts:92、app/.vitepress/src-new/data/showcase/showcase-en.ts:92、app/.vitepress/src-new/data/showcase/showcase-zh.ts:92、app/en/user-practice/dbv/huayuxinxi/index.md:7、app/zh/user-practice/dbv/huayuxinxi/index.md:7 | — |
| `https://www.zhihu.com/column/c_1358363246349635584` | app/zh/news/2026-06-05/new.md:170 | — |
| `https://zhuanlan.zhihu.com/p/182553920` | README.md:63、README_EN.md:63 | — |
| `https://zhuanlan.zhihu.com/p/429214913` | README.md:32、README_EN.md:32 | — |

#### HTTP 404（26 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `http://pgconf2020.postgres.cn/schedule.html` | app/.vitepress/src/data/events/events-en.ts:34、app/.vitepress/src/data/events/events-zh.ts:795、app/en/events/2021-01-15/2021-01-15-PostgreSQL.md:10、app/zh/events/2021-01-15/2021-01-15-PostgreSQL.md:11 | — |
| `http://www.gzsubzero.cn/index.html` | app/.vitepress/src/data/showcase/showcase-en.ts:746、app/.vitepress/src/data/showcase/showcase-zh.ts:691、app/.vitepress/src-new/data/showcase/showcase-en.ts:746、app/.vitepress/src-new/data/showcase/showcase-zh.ts:691、app/en/user-practice/others/gzsubzero/index.md:7、app/zh/user-practice/others/gzsubzero/index.md:7 | — |
| `http://www.vastdata.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:7、app/.vitepress/src/data/showcase/showcase-zh.ts:7、app/.vitepress/src-new/data/showcase/showcase-en.ts:7、app/.vitepress/src-new/data/showcase/showcase-zh.ts:7、app/en/user-practice/dbv/vastdata/index.md:7、app/zh/user-practice/dbv/vastdata/index.md:7 | — |
| `https://docs-opengauss.osinfra.cn/zh/docs/latest/docs/ReleaseNotes/Releasenotes.html` | app/zh/news/2024-03-30/index.md:20 | — |
| `https://gitcode.com/opengauss/openGauss-server/issues/6422` | app/zh/news/2026-08-30/index.md:111 | — |
| `https://gitcode.com/opengauss/openGauss-server/issues/6736` | app/zh/news/2025-12-30-603/index.md:128 | — |
| `https://gitcode.com/opengauss/openGauss-server/issues/7024` | app/zh/news/2025-07-15-602/index.md:301、app/zh/news/2025-12-30-603/index.md:164 | — |
| `https://gitcode.com/opengauss/openGauss-server/issues/7060` | app/zh/news/2025-07-15-602/index.md:306、app/zh/news/2025-12-30-603/index.md:162 | — |
| `https://gitcode.com/opengauss/openGauss-server/issues/7119` | app/zh/news/2025-07-15-602/index.md:308、app/zh/news/2025-12-30-603/index.md:163 | — |
| `https://gitcode.com/opengauss/openGauss-server/issues/7370` | app/zh/news/2025-12-30-603/index.md:148、app/zh/news/2025-12-30-603/index.md:165 | — |
| `https://gitcode.com/opengauss/org-issue/issues/41` | app/zh/news/2025-12-30-603/index.md:363、app/zh/news/2025-12-30-603/index.md:366、app/zh/news/2025-12-30-603/index.md:394 | — |
| `https://gitcode.com/opengauss/org-issue/issues/44` | app/zh/news/2025-12-30-603/index.md:341、app/zh/news/2025-12-30-603/index.md:343 | — |
| `https://gitee.com/opengauss/openGauss-server/pulls/3448` | app/zh/news/2023-12-20/index.md:87 | — |
| `https://magicstack.github.io` | app/.vitepress/src/data/url-config/index.ts:27、app/.vitepress/src-new/data/url-config/index.ts:29 | — |
| `https://opengauss.org/en/download.html` | app/en/news/2020-10-12/20201012.md:31、app/en/news/2020-12-31/20201231.md:104 | — |
| `https://opengauss.org/zh/docs/latest/docs/BriefTutorial/BriefTutorial.html` | app/zh/events/2021-08-17/findBug.md:34 | — |
| `https://opengauss.org/zh/download.html` | app/zh/news/2020-10-12/20201012.md:22、app/zh/news/2020-12-31/20201231.md:99、app/zh/news/2022-10-08/20221008.md:52 | — |
| `https://opengauss.org/zh/file/public-key/openGauss_0x912AD1B8_public` | app/en/vulnerability-management/index.md:55 | — |
| `https://opengauss.org/zh/interaction/event-list/meetup-feedback/` | app/zh/call-for-meetup/collect/index.md:81 | — |
| `https://schema.org/EventEnded` | app/.vitepress/scripts/generate-tdk-schema-for-articles.ts:80 | — |
| `https://www.shengjian.net/` | app/.vitepress/src/data/showcase/showcase-en.ts:1244、app/.vitepress/src/data/showcase/showcase-zh.ts:1190、app/.vitepress/src-new/data/showcase/showcase-en.ts:1244、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1190、app/en/user-practice/finance/shengjianwangluo/index.md:7、app/zh/user-practice/finance/shengjianwangluo/index.md:7 | — |
| `https://www.xfusion.com/cn/product/database-solution/fusiondb` | app/.vitepress/src/data/showcase/showcase-en.ts:71、app/.vitepress/src/data/showcase/showcase-zh.ts:71、app/.vitepress/src-new/data/showcase/showcase-en.ts:71、app/.vitepress/src-new/data/showcase/showcase-zh.ts:71、app/en/user-practice/dbv/chaojubian/index.md:7、app/zh/user-practice/dbv/chaojubian/index.md:7 | — |
| `https://www.xxxx.xxx/en/` | .agents/skills/frontmatter-data-extractor/SKILL.md:73 | — |
| `https://www.xxxx.xxx/en/download/` | .agents/skills/frontmatter-data-extractor/SKILL.md:75 | — |
| `https://www.xxxx.xxx/zh/` | .agents/skills/frontmatter-data-extractor/SKILL.md:72 | — |
| `https://www.xxxx.xxx/zh/sig/sig-list/` | .agents/skills/frontmatter-data-extractor/SKILL.md:74 | — |

#### HTTP 412（2 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://it.10086.cn/indexc.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1382、app/.vitepress/src/data/showcase/showcase-zh.ts:1328、app/.vitepress/src-new/data/showcase/showcase-en.ts:1382、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1328、app/en/user-practice/carrier/yidong/index.md:7、app/zh/user-practice/carrier/yidong/index.md:7 | — |
| `https://space.bilibili.com/543286270/lists` | app/zh/news/2026-06-05/new.md:168 | — |

#### HTTP 418（8 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://dsapi.test.osinfra.cn/` | app/vite.config.ts:80 | — |
| `https://e-campaign.huawei.com` | app/.vitepress/src/data/url-config/index.ts:69 | — |
| `https://e-campaign.huawei.com/t/BbuQr2` | app/.vitepress/src/data/url-config/index.ts:48、app/.vitepress/src-new/data/url-config/index.ts:50 | — |
| `https://gitcode.com/opengauss/openGauss-server/issues/7052` | app/zh/news/2025-12-30-603/index.md:217 | — |
| `https://hw.vhallyun.com` | app/.vitepress/src/data/url-config/index.ts:51 | — |
| `https://magicapi.osinfra.cn/stat/sig/info?community=opengauss` | app/en/sig/[sig].paths.ts:9、app/zh/sig/[sig].paths.ts:9 | — |
| `https://magicapi.test.osinfra.cn/` | app/vite.config.ts:86 | — |
| `https://www.tjhq.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:996、app/.vitepress/src/data/showcase/showcase-en.ts:997、app/.vitepress/src/data/showcase/showcase-zh.ts:941、app/.vitepress/src/data/showcase/showcase-zh.ts:942、app/.vitepress/src-new/data/showcase/showcase-en.ts:996、app/.vitepress/src-new/data/showcase/showcase-en.ts:997、app/.vitepress/src-new/data/showcase/showcase-zh.ts:941、app/.vitepress/src-new/data/showcase/showcase-zh.ts:942 | — |

#### HTTP 502（2 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://gallery.vphotos.cn/vphotosgallery/index.html?vphotowechatid=444E09B1CAF21355786B2E31CCF6126A&authType=1&gallery_source_code=0&toHash=#/cover` | app/zh/events/2021-06-28/meetup.md:109 | — |
| `https://gallery.vphotos.cn/vphotosgallery/index.html?vphotowechatid=E803C2FDCB2DDE9A5EB7B42750D4A824&gallery_source_code=0&toHash=&authType=1#/gallery` | app/zh/events/2021-05-31/meetup.md:107 | — |

#### 网络错误（36 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `http://83958517.zhaozhaoqu.com/about.html` | app/.vitepress/src/data/showcase/showcase-en.ts:603、app/.vitepress/src/data/showcase/showcase-zh.ts:599、app/.vitepress/src-new/data/showcase/showcase-en.ts:603、app/.vitepress/src-new/data/showcase/showcase-zh.ts:599、app/en/user-practice/manufacture/zhaozhaoqu/index.md:7、app/zh/user-practice/manufacture/zhaozhaoqu/index.md:7 | ENOTFOUND |
| `http://97467211.007swz.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:715、app/.vitepress/src/data/showcase/showcase-zh.ts:670、app/.vitepress/src-new/data/showcase/showcase-en.ts:715、app/.vitepress/src-new/data/showcase/showcase-zh.ts:670、app/en/user-practice/others/007swz/index.md:7、app/zh/user-practice/others/007swz/index.md:7 | ECONNREFUSED |
| `http://huachuangark.com/about.aspx?ParentId=2&BaseInfoCateId=1&CateId=1` | app/.vitepress/src/data/showcase/showcase-en.ts:966、app/.vitepress/src/data/showcase/showcase-en.ts:967、app/.vitepress/src/data/showcase/showcase-zh.ts:911、app/.vitepress/src/data/showcase/showcase-zh.ts:912、app/.vitepress/src-new/data/showcase/showcase-en.ts:966、app/.vitepress/src-new/data/showcase/showcase-en.ts:967、app/.vitepress/src-new/data/showcase/showcase-zh.ts:911、app/.vitepress/src-new/data/showcase/showcase-zh.ts:912 | ENOTFOUND |
| `http://online.10086.cn/official/new/index/#/home/index` | app/.vitepress/src/data/migration/migration-en.ts:520、app/.vitepress/src/data/migration/migration-zh.ts:520、app/.vitepress/src/data/showcase/showcase-en.ts:1465、app/.vitepress/src/data/showcase/showcase-zh.ts:1410、app/.vitepress/src-new/data/showcase/showcase-en.ts:1465、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1410、app/en/user-practice/carrier/chinamobileonline/index.md:7、app/zh/user-practice/carrier/chinamobileonline/index.md:7 | ETIMEDOUT |
| `http://www.bpic.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:1110、app/.vitepress/src/data/showcase/showcase-zh.ts:1055、app/.vitepress/src-new/data/showcase/showcase-en.ts:1110、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1055、app/en/user-practice/finance/bohai/index.md:7、app/zh/user-practice/finance/bohai/index.md:7 | ECONNRESET |
| `http://www.chinaunicom.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:1443、app/.vitepress/src/data/showcase/showcase-zh.ts:1388、app/.vitepress/src-new/data/showcase/showcase-en.ts:1443、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1388、app/en/user-practice/carrier/zhongguoliantong/index.md:7、app/zh/user-practice/carrier/zhongguoliantong/index.md:7 | ECONNRESET |
| `http://www.julicloud.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:789、app/.vitepress/src/data/showcase/showcase-zh.ts:734、app/.vitepress/src-new/data/showcase/showcase-en.ts:789、app/.vitepress/src-new/data/showcase/showcase-zh.ts:734、app/en/user-practice/others/julichuangzhi/index.md:7、app/zh/user-practice/others/julichuangzhi/index.md:7 | ENOTFOUND |
| `http://zj.chinapost.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:897、app/.vitepress/src/data/showcase/showcase-zh.ts:842、app/.vitepress/src-new/data/showcase/showcase-en.ts:897、app/.vitepress/src-new/data/showcase/showcase-zh.ts:842、app/en/user-practice/others/zjpost/index.md:7、app/zh/user-practice/others/zjpost/index.md:7 | AbortError |
| `https://bigdata.10086.cn` | app/.vitepress/src/data/url-config/index.ts:66、app/.vitepress/src-new/data/url-config/index.ts:55 | ETIMEDOUT |
| `https://ecosystemdashboard.linaro.org/` | app/zh/news/2024-05-14/index.md:13 | ENOTFOUND |
| `https://enmoedu.com` | app/.vitepress/src/data/url-config/index.ts:7、app/.vitepress/src-new/data/url-config/index.ts:7 | AbortError |
| `https://openauss.org/` | app/vite.config.ts:94 | ENOTFOUND |
| `https://service.zj.10086.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:1423、app/.vitepress/src/data/showcase/showcase-zh.ts:1368、app/.vitepress/src-new/data/showcase/showcase-en.ts:1423、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1368、app/en/user-practice/carrier/zhejiangyidong/index.md:7、app/zh/user-practice/carrier/zhejiangyidong/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://tryme-opengauss.osinfra.cn` | app/.vitepress/src/data/url-config/index.ts:44、app/.vitepress/src-new/data/url-config/index.ts:46 | ENOTFOUND |
| `https://www.10086.cn/aboutus/culture/intro/province_culture_intro_detail/gd/index.html?id=1` | app/.vitepress/src/data/showcase/showcase-en.ts:1352、app/.vitepress/src/data/showcase/showcase-zh.ts:1298、app/.vitepress/src-new/data/showcase/showcase-en.ts:1352、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1298、app/en/user-practice/carrier/guangdongyidong/index.md:7、app/zh/user-practice/carrier/guangdongyidong/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.10086.cn/aboutus/culture/intro/province_culture_intro_detail/jx/index.html?id=1` | app/.vitepress/src/data/showcase/showcase-en.ts:1372、app/.vitepress/src/data/showcase/showcase-zh.ts:1318、app/.vitepress/src-new/data/showcase/showcase-en.ts:1372、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1318、app/en/user-practice/carrier/jiangxiyidong/index.md:7、app/zh/user-practice/carrier/jiangxiyidong/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.10086.cn/index/fj/index_591_591.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1476、app/.vitepress/src/data/showcase/showcase-zh.ts:1421、app/.vitepress/src-new/data/showcase/showcase-en.ts:1476、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1421、app/en/user-practice/carrier/fujianyidong/index.md:7、app/zh/user-practice/carrier/fujianyidong/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.10086.cn/index/js/index_250_250.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1487、app/.vitepress/src/data/showcase/showcase-zh.ts:1432、app/.vitepress/src-new/data/showcase/showcase-en.ts:1487、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1432、app/en/user-practice/carrier/jiangsuyidong/index.md:7、app/zh/user-practice/carrier/jiangsuyidong/index.md:7 | ETIMEDOUT |
| `https://www.10086.cn/index/nm/index_471_471.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1362、app/.vitepress/src/data/showcase/showcase-zh.ts:1308、app/.vitepress/src-new/data/showcase/showcase-en.ts:1362、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1308、app/en/user-practice/carrier/neimengguyidong/index.md:7、app/zh/user-practice/carrier/neimengguyidong/index.md:7 | ETIMEDOUT |
| `https://www.10086.cn/index/xj/index_991_991.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1498、app/.vitepress/src/data/showcase/showcase-zh.ts:1443、app/.vitepress/src-new/data/showcase/showcase-en.ts:1498、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1443、app/en/user-practice/carrier/xinjiangyidong/index.md:7、app/zh/user-practice/carrier/xinjiangyidong/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.dapchina.cn/sy` | app/.vitepress/src/data/showcase/showcase-en.ts:207、app/.vitepress/src/data/showcase/showcase-zh.ts:207、app/.vitepress/src-new/data/showcase/showcase-en.ts:207、app/.vitepress/src-new/data/showcase/showcase-zh.ts:207、app/en/user-practice/medical/depaisoft/index.md:7、app/zh/user-practice/medical/depaisoft/index.md:7 | ECONNREFUSED |
| `https://www.gx.csg.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:419、app/.vitepress/src/data/showcase/showcase-zh.ts:415、app/.vitepress/src-new/data/showcase/showcase-en.ts:419、app/.vitepress/src-new/data/showcase/showcase-zh.ts:415 | CERT_HAS_EXPIRED |
| `https://www.he.10086.cn/service/operate/` | app/.vitepress/src/data/showcase/showcase-en.ts:1413、app/.vitepress/src/data/showcase/showcase-zh.ts:1358、app/.vitepress/src-new/data/showcase/showcase-en.ts:1413、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1358、app/en/user-practice/carrier/hebeiyidong/index.md:7、app/zh/user-practice/carrier/hebeiyidong/index.md:7 | ETIMEDOUT |
| `https://www.hmccb.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:1320、app/.vitepress/src/data/showcase/showcase-zh.ts:1266、app/.vitepress/src-new/data/showcase/showcase-en.ts:1320、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1266、app/en/user-practice/finance/hmccb/index.md:7、app/zh/user-practice/finance/hmccb/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.hrbb.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:1160、app/.vitepress/src/data/showcase/showcase-zh.ts:1106、app/.vitepress/src-new/data/showcase/showcase-en.ts:1160、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1106、app/en/user-practice/finance/haerbing/index.md:7、app/zh/user-practice/finance/haerbing/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.hzsun.com/guest/index?G` | app/.vitepress/src/data/showcase/showcase-en.ts:842、app/.vitepress/src/data/showcase/showcase-zh.ts:787、app/.vitepress/src-new/data/showcase/showcase-en.ts:842、app/.vitepress/src-new/data/showcase/showcase-zh.ts:787、app/en/user-practice/others/zhejiangzhengyuanzhihui/index.md:7、app/zh/user-practice/others/zhejiangzhengyuanzhihui/index.md:7 | ECONNREFUSED |
| `https://www.jshbank.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:1309、app/.vitepress/src/data/showcase/showcase-zh.ts:1255、app/.vitepress/src-new/data/showcase/showcase-en.ts:1309、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1255、app/en/user-practice/finance/jshbank/index.md:7、app/zh/user-practice/finance/jshbank/index.md:7 | ETIMEDOUT |
| `https://www.sdent.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:186、app/.vitepress/src/data/showcase/showcase-zh.ts:186、app/.vitepress/src-new/data/showcase/showcase-en.ts:186、app/.vitepress/src-new/data/showcase/showcase-zh.ts:186、app/en/user-practice/medical/sdent/index.md:7、app/zh/user-practice/medical/sdent/index.md:7 | AbortError |
| `https://www.shingroup.cn/index.html` | app/.vitepress/src/data/showcase/showcase-en.ts:768、app/.vitepress/src/data/showcase/showcase-zh.ts:713、app/.vitepress/src-new/data/showcase/showcase-en.ts:768、app/.vitepress/src-new/data/showcase/showcase-zh.ts:713、app/en/user-practice/others/hexintech/index.md:7、app/zh/user-practice/others/hexintech/index.md:7 | AbortError |
| `https://www.sinoregal.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:936、app/.vitepress/src/data/showcase/showcase-en.ts:937、app/.vitepress/src/data/showcase/showcase-zh.ts:881、app/.vitepress/src/data/showcase/showcase-zh.ts:882、app/.vitepress/src-new/data/showcase/showcase-en.ts:936、app/.vitepress/src-new/data/showcase/showcase-en.ts:937、app/.vitepress/src-new/data/showcase/showcase-zh.ts:881、app/.vitepress/src-new/data/showcase/showcase-zh.ts:882 | CERT_HAS_EXPIRED |
| `https://www.slidestalk.com/m/337` | app/zh/events/2020-12-19/meetup.md:40 | ECONNREFUSED |
| `https://www.slidestalk.com/m/374` | app/en/events/2021-03-26/meetup.md:65、app/zh/events/2021-03-26/meetup.md:122 | ECONNREFUSED |
| `https://www.tf.cn/tfyh/index.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1120、app/.vitepress/src/data/showcase/showcase-zh.ts:1065、app/.vitepress/src-new/data/showcase/showcase-en.ts:1120、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1065、app/en/user-practice/finance/sichuantianfuyinhang/index.md:7、app/zh/user-practice/finance/sichuantianfuyinhang/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.unionlife.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:1191、app/.vitepress/src/data/showcase/showcase-zh.ts:1137、app/.vitepress/src-new/data/showcase/showcase-en.ts:1191、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1137、app/en/user-practice/finance/hezhong/index.md:7、app/zh/user-practice/finance/hezhong/index.md:7 | ETIMEDOUT |
| `https://zhaopin.sgcc.com.cn/sgcchr/static/unitInfo.html?obj_id=10522000` | app/.vitepress/src/data/showcase/showcase-en.ts:378、app/.vitepress/src/data/showcase/showcase-zh.ts:374、app/.vitepress/src-new/data/showcase/showcase-en.ts:378、app/.vitepress/src-new/data/showcase/showcase-zh.ts:374、app/en/user-practice/energy/guowanghenan/index.md:7、app/zh/user-practice/energy/guowanghenan/index.md:7 | ETIMEDOUT |
| `https://zwfw.shaanxi.gov.cn/sx/complement/about` | app/.vitepress/src/data/showcase/showcase-en.ts:644、app/.vitepress/src/data/showcase/showcase-zh.ts:640、app/.vitepress/src-new/data/showcase/showcase-en.ts:644、app/.vitepress/src-new/data/showcase/showcase-zh.ts:640、app/en/user-practice/others/xxzw/index.md:7、app/zh/user-practice/others/xxzw/index.md:7 | ETIMEDOUT |
