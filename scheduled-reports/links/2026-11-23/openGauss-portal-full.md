# 失效链接检查完全版报告 · openGauss 官网（openGauss-portal）

- 检查时间：2026-11-23T18:39:37.120Z
- 已有未关闭 issue：本轮只扫描归档，未提单/未写回（写回需 force_check 强制执行）

### 项目信息

- 项目：openGauss 官网（openGauss-portal）
- 数据源：`https://gitcode.com/opengauss/website`（v2 分支，取 AtomGit 同名镜像）
- 站点域名：https://opengauss.org
- 相对路径前缀（urlPrefix）：`/zh`
- 结论：❌（失效 URL 91 个 / 645 处引用）

### 扫描概况

| 扫描文件 | 链接引用 | 探测 URL（去重后） | 有效 | 失效 |
| --- | --- | --- | --- | --- |
| 1362 | 5184 | 3521 | 3430 | 91 |

### 失效链接明细（状态分布：`403`×12、`404`×25、`412`×5、`418`×7、`502`×2、`网络错误`×40）

#### HTTP 403（12 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `http://www.w3.org/2000/svg` | app/zh/migration/case/index.md:137、opendesign/checkbox/src/checkbox.tsx:65、opendesign/search/OSearch.vue:10、opendesign/select/OSelect.vue:63、opendesign/tag/src/tag.tsx:34 | — |
| `http://www.xugucn.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:72、app/.vitepress/src/data/showcase/showcase-zh.ts:82、app/.vitepress/src-new/data/showcase/showcase-en.ts:72、app/.vitepress/src-new/data/showcase/showcase-zh.ts:72、app/en/user-practice/dbv/xugucn/index.md:7、app/zh/user-practice/dbv/xugucn/index.md:7 | — |
| `https://e.huawei.com/cn/talent/#/cert/product-details?certifiedProductId=503&authenticationLevel=CTYPE_CARE_HCIA&technicalField=PSC&version=1.0` | app/zh/events/2022-10-28/Meetup.md:39 | — |
| `https://hwlive.263live.net` | app/.vitepress/src/data/url-config/index.ts:73 | — |
| `https://meetingvideo.obs.ap-southeast-1.myhuaweicloud.com` | app/.vitepress/src/data/url-config/index.ts:22、app/.vitepress/src-new/data/url-config/index.ts:24 | — |
| `https://obs-for-opengauss-summit.obs.cn-north-4.myhuaweicloud.com` | app/.vitepress/src/data/url-config/index.ts:14、app/.vitepress/src-new/data/url-config/index.ts:14 | — |
| `https://scjg.tj.gov.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:512、app/.vitepress/src/data/showcase/showcase-zh.ts:518、app/.vitepress/src-new/data/showcase/showcase-en.ts:512、app/.vitepress/src-new/data/showcase/showcase-zh.ts:508、app/en/user-practice/bigbusiness/tianjinshichangjianduwei/index.md:7、app/zh/user-practice/bigbusiness/tianjinshichangjianduwei/index.md:7 | — |
| `https://www.npmjs.com` | app/.vitepress/src-new/data/url-config/index.ts:72 | — |
| `https://www.thunisoft.cn/col82/index` | app/.vitepress/src/data/showcase/showcase-en.ts:104、app/.vitepress/src/data/showcase/showcase-zh.ts:114、app/.vitepress/src-new/data/showcase/showcase-en.ts:104、app/.vitepress/src-new/data/showcase/showcase-zh.ts:104、app/en/user-practice/dbv/huayuxinxi/index.md:7、app/zh/user-practice/dbv/huayuxinxi/index.md:7 | — |
| `https://www.zhihu.com/column/c_1358363246349635584` | app/zh/news/2026-06-05/new.md:170 | — |
| `https://zhuanlan.zhihu.com/p/182553920` | README.md:63、README_EN.md:63 | — |
| `https://zhuanlan.zhihu.com/p/429214913` | README.md:32、README_EN.md:32 | — |

#### HTTP 404（25 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `http://pgconf2020.postgres.cn/schedule.html` | app/.vitepress/src/data/events/events-en.ts:46、app/.vitepress/src/data/events/events-zh.ts:807、app/en/events/2021-01-15/2021-01-15-PostgreSQL.md:10、app/zh/events/2021-01-15/2021-01-15-PostgreSQL.md:11 | — |
| `http://www.gzsubzero.cn/index.html` | app/.vitepress/src/data/showcase/showcase-en.ts:758、app/.vitepress/src/data/showcase/showcase-zh.ts:713、app/.vitepress/src-new/data/showcase/showcase-en.ts:758、app/.vitepress/src-new/data/showcase/showcase-zh.ts:703、app/en/user-practice/others/gzsubzero/index.md:7、app/zh/user-practice/others/gzsubzero/index.md:7 | — |
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
| `https://magicstack.github.io` | app/.vitepress/src/data/url-config/index.ts:39、app/.vitepress/src-new/data/url-config/index.ts:41 | — |
| `https://opengauss.org/en/download.html` | app/en/news/2020-10-12/20201012.md:31、app/en/news/2020-12-31/20201231.md:104 | — |
| `https://opengauss.org/zh/docs/latest/docs/BriefTutorial/BriefTutorial.html` | app/zh/events/2021-08-17/findBug.md:34 | — |
| `https://opengauss.org/zh/download.html` | app/zh/news/2020-10-12/20201012.md:22、app/zh/news/2020-12-31/20201231.md:99、app/zh/news/2022-10-08/20221008.md:52 | — |
| `https://opengauss.org/zh/file/public-key/openGauss_0x912AD1B8_public` | app/en/vulnerability-management/index.md:55 | — |
| `https://opengauss.org/zh/interaction/event-list/meetup-feedback/` | app/zh/call-for-meetup/collect/index.md:81 | — |
| `https://schema.org/EventEnded` | app/.vitepress/scripts/generate-tdk-schema-for-articles.ts:99 | — |
| `https://www.shengjian.net/` | app/.vitepress/src/data/showcase/showcase-en.ts:1256、app/.vitepress/src/data/showcase/showcase-zh.ts:1212、app/.vitepress/src-new/data/showcase/showcase-en.ts:1256、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1202、app/en/user-practice/finance/shengjianwangluo/index.md:7、app/zh/user-practice/finance/shengjianwangluo/index.md:7 | — |
| `https://www.xfusion.com/cn/product/database-solution/fusiondb` | app/.vitepress/src/data/showcase/showcase-en.ts:83、app/.vitepress/src/data/showcase/showcase-zh.ts:93、app/.vitepress/src-new/data/showcase/showcase-en.ts:83、app/.vitepress/src-new/data/showcase/showcase-zh.ts:83、app/en/user-practice/dbv/chaojubian/index.md:7、app/zh/user-practice/dbv/chaojubian/index.md:7 | — |
| `https://www.xxxx.xxx/en/` | .agents/skills/frontmatter-data-extractor/SKILL.md:73 | — |
| `https://www.xxxx.xxx/en/download/` | .agents/skills/frontmatter-data-extractor/SKILL.md:75 | — |
| `https://www.xxxx.xxx/zh/` | .agents/skills/frontmatter-data-extractor/SKILL.md:72 | — |
| `https://www.xxxx.xxx/zh/sig/sig-list/` | .agents/skills/frontmatter-data-extractor/SKILL.md:74 | — |

#### HTTP 412（5 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://bigdata.10086.cn` | app/.vitepress/src/data/url-config/index.ts:78、app/.vitepress/src-new/data/url-config/index.ts:67 | — |
| `https://it.10086.cn/indexc.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1394、app/.vitepress/src/data/showcase/showcase-zh.ts:1350、app/.vitepress/src-new/data/showcase/showcase-en.ts:1394、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1340、app/en/user-practice/carrier/yidong/index.md:7、app/zh/user-practice/carrier/yidong/index.md:7 | — |
| `https://space.bilibili.com/543286270/lists` | app/zh/news/2026-06-05/new.md:168 | — |
| `https://www.guilinbank.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:1152、app/.vitepress/src/data/showcase/showcase-zh.ts:1108、app/.vitepress/src-new/data/showcase/showcase-en.ts:1152、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1098、app/en/user-practice/finance/guilinbank/index.md:7、app/zh/user-practice/finance/guilinbank/index.md:7 | — |
| `https://www.he.10086.cn/service/operate/` | app/.vitepress/src/data/showcase/showcase-en.ts:1425、app/.vitepress/src/data/showcase/showcase-zh.ts:1380、app/.vitepress/src-new/data/showcase/showcase-en.ts:1425、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1370、app/en/user-practice/carrier/hebeiyidong/index.md:7、app/zh/user-practice/carrier/hebeiyidong/index.md:7 | — |

#### HTTP 418（7 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://dsapi.test.osinfra.cn/` | app/vite.config.ts:92 | — |
| `https://e-campaign.huawei.com` | app/.vitepress/src/data/url-config/index.ts:81 | — |
| `https://e-campaign.huawei.com/t/BbuQr2` | app/.vitepress/src/data/url-config/index.ts:60、app/.vitepress/src-new/data/url-config/index.ts:62 | — |
| `https://hw.vhallyun.com` | app/.vitepress/src/data/url-config/index.ts:63 | — |
| `https://magicapi.osinfra.cn/stat/sig/info?community=opengauss` | app/en/sig/[sig].paths.ts:21、app/zh/sig/[sig].paths.ts:21 | — |
| `https://magicapi.test.osinfra.cn/` | app/vite.config.ts:98 | — |
| `https://www.tjhq.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:1008、app/.vitepress/src/data/showcase/showcase-en.ts:1009、app/.vitepress/src/data/showcase/showcase-zh.ts:963、app/.vitepress/src/data/showcase/showcase-zh.ts:964、app/.vitepress/src-new/data/showcase/showcase-en.ts:1008、app/.vitepress/src-new/data/showcase/showcase-en.ts:1009、app/.vitepress/src-new/data/showcase/showcase-zh.ts:953、app/.vitepress/src-new/data/showcase/showcase-zh.ts:954 | — |

#### HTTP 502（2 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://gallery.vphotos.cn/vphotosgallery/index.html?vphotowechatid=444E09B1CAF21355786B2E31CCF6126A&authType=1&gallery_source_code=0&toHash=#/cover` | app/zh/events/2021-06-28/meetup.md:109 | — |
| `https://gallery.vphotos.cn/vphotosgallery/index.html?vphotowechatid=E803C2FDCB2DDE9A5EB7B42750D4A824&gallery_source_code=0&toHash=&authType=1#/gallery` | app/zh/events/2021-05-31/meetup.md:107 | — |

#### 网络错误（40 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `http://83958517.zhaozhaoqu.com/about.html` | app/.vitepress/src/data/showcase/showcase-en.ts:615、app/.vitepress/src/data/showcase/showcase-zh.ts:621、app/.vitepress/src-new/data/showcase/showcase-en.ts:615、app/.vitepress/src-new/data/showcase/showcase-zh.ts:611、app/en/user-practice/manufacture/zhaozhaoqu/index.md:7、app/zh/user-practice/manufacture/zhaozhaoqu/index.md:7 | ENOTFOUND |
| `http://huachuangark.com/about.aspx?ParentId=2&BaseInfoCateId=1&CateId=1` | app/.vitepress/src/data/showcase/showcase-en.ts:978、app/.vitepress/src/data/showcase/showcase-en.ts:979、app/.vitepress/src/data/showcase/showcase-zh.ts:933、app/.vitepress/src/data/showcase/showcase-zh.ts:934、app/.vitepress/src-new/data/showcase/showcase-en.ts:978、app/.vitepress/src-new/data/showcase/showcase-en.ts:979、app/.vitepress/src-new/data/showcase/showcase-zh.ts:923、app/.vitepress/src-new/data/showcase/showcase-zh.ts:924 | ENOTFOUND |
| `http://license.coscl.org.cn/MulanPSL2` | app/.vitepress/config.ts:6、app/.vitepress/public/check-dark-mode-v2.js:6、app/.vitepress/scripts/filter-empty-practice.ts:6、app/.vitepress/scripts/generate-tdk-schema-for-articles.ts:6、app/.vitepress/scripts/sanitize-md.ts:6、app/.vitepress/sitemap-priority.ts:6、app/.vitepress/src/components/hooks/useClickOutside.ts:6、app/.vitepress/src/components/hooks/useClipboard.ts:6、app/.vitepress/src/components/hooks/useWindowResize.ts:6、app/.vitepress/src/components/hooks/useWindowScroll.ts:6、app/.vitepress/src/data/bigshot/2021.ts:6、app/.vitepress/src/data/bigshot/2022.ts:6、app/.vitepress/src/data/bigshot/2023.ts:6、app/.vitepress/src/data/bigshot/2024.ts:6、app/.vitepress/src/data/bigshot/index.ts:6、app/.vitepress/src/data/blogs/index.ts:6、app/.vitepress/src/data/brand/index.ts:6、app/.vitepress/src/data/download/download-finance/download-finance-zh.ts:6、app/.vitepress/src/data/download/download-finance/index.ts:6、app/.vitepress/src/data/download/download1.0.0.ts:6 等 313 处 | AbortError |
| `http://online.10086.cn/official/new/index/#/home/index` | app/.vitepress/src/data/migration/migration-en.ts:532、app/.vitepress/src/data/migration/migration-zh.ts:532、app/.vitepress/src/data/showcase/showcase-en.ts:1477、app/.vitepress/src/data/showcase/showcase-zh.ts:1432、app/.vitepress/src-new/data/showcase/showcase-en.ts:1477、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1422、app/en/user-practice/carrier/chinamobileonline/index.md:7、app/zh/user-practice/carrier/chinamobileonline/index.md:7 | ETIMEDOUT |
| `http://www.bpic.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:1122、app/.vitepress/src/data/showcase/showcase-zh.ts:1077、app/.vitepress/src-new/data/showcase/showcase-en.ts:1122、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1067、app/en/user-practice/finance/bohai/index.md:7、app/zh/user-practice/finance/bohai/index.md:7 | ECONNRESET |
| `http://www.cic.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:1080、app/.vitepress/src/data/showcase/showcase-zh.ts:1035、app/.vitepress/src-new/data/showcase/showcase-en.ts:1080、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1025、app/en/user-practice/finance/zhonghua/index.md:7、app/zh/user-practice/finance/zhonghua/index.md:7 | ETIMEDOUT |
| `http://www.julicloud.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:801、app/.vitepress/src/data/showcase/showcase-zh.ts:756、app/.vitepress/src-new/data/showcase/showcase-en.ts:801、app/.vitepress/src-new/data/showcase/showcase-zh.ts:746、app/en/user-practice/others/julichuangzhi/index.md:7、app/zh/user-practice/others/julichuangzhi/index.md:7 | ENOTFOUND |
| `http://www.murongtech.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:1223、app/.vitepress/src/data/showcase/showcase-zh.ts:1179、app/.vitepress/src-new/data/showcase/showcase-en.ts:1223、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1169、app/en/user-practice/finance/murongtech/index.md:7、app/zh/user-practice/finance/murongtech/index.md:7 | AbortError |
| `http://www.vastdata.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:19、app/.vitepress/src/data/showcase/showcase-zh.ts:29、app/.vitepress/src-new/data/showcase/showcase-en.ts:19、app/.vitepress/src-new/data/showcase/showcase-zh.ts:19、app/en/user-practice/dbv/vastdata/index.md:7、app/zh/user-practice/dbv/vastdata/index.md:7 | AbortError |
| `http://zj.chinapost.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:909、app/.vitepress/src/data/showcase/showcase-zh.ts:864、app/.vitepress/src-new/data/showcase/showcase-en.ts:909、app/.vitepress/src-new/data/showcase/showcase-zh.ts:854、app/en/user-practice/others/zjpost/index.md:7、app/zh/user-practice/others/zjpost/index.md:7 | AbortError |
| `https://ecosystemdashboard.linaro.org/` | app/zh/news/2024-05-14/index.md:13 | ENOTFOUND |
| `https://enmoedu.com` | app/.vitepress/src/data/url-config/index.ts:19、app/.vitepress/src-new/data/url-config/index.ts:19 | AbortError |
| `https://grs.pku.edu.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:441、app/.vitepress/src/data/showcase/showcase-zh.ts:447、app/.vitepress/src-new/data/showcase/showcase-en.ts:441、app/.vitepress/src-new/data/showcase/showcase-zh.ts:437、app/en/user-practice/education/beidayanjiushengyuan/index.md:7、app/zh/user-practice/education/beidayanjiushengyuan/index.md:7 | ETIMEDOUT |
| `https://ncre-bm.neea.cn/` | app/zh/news/2023-02-25/index.md:82 | AbortError |
| `https://openauss.org/` | app/vite.config.ts:106 | ENOTFOUND |
| `https://service.zj.10086.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:1435、app/.vitepress/src/data/showcase/showcase-zh.ts:1390、app/.vitepress/src-new/data/showcase/showcase-en.ts:1435、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1380、app/en/user-practice/carrier/zhejiangyidong/index.md:7、app/zh/user-practice/carrier/zhejiangyidong/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://tryme-opengauss.osinfra.cn` | app/.vitepress/src/data/url-config/index.ts:56、app/.vitepress/src-new/data/url-config/index.ts:58 | ENOTFOUND |
| `https://www.10086.cn/aboutus/culture/intro/province_culture_intro_detail/gd/index.html?id=1` | app/.vitepress/src/data/showcase/showcase-en.ts:1364、app/.vitepress/src/data/showcase/showcase-zh.ts:1320、app/.vitepress/src-new/data/showcase/showcase-en.ts:1364、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1310、app/en/user-practice/carrier/guangdongyidong/index.md:7、app/zh/user-practice/carrier/guangdongyidong/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.10086.cn/aboutus/culture/intro/province_culture_intro_detail/jx/index.html?id=1` | app/.vitepress/src/data/showcase/showcase-en.ts:1384、app/.vitepress/src/data/showcase/showcase-zh.ts:1340、app/.vitepress/src-new/data/showcase/showcase-en.ts:1384、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1330、app/en/user-practice/carrier/jiangxiyidong/index.md:7、app/zh/user-practice/carrier/jiangxiyidong/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.10086.cn/index/fj/index_591_591.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1488、app/.vitepress/src/data/showcase/showcase-zh.ts:1443、app/.vitepress/src-new/data/showcase/showcase-en.ts:1488、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1433、app/en/user-practice/carrier/fujianyidong/index.md:7、app/zh/user-practice/carrier/fujianyidong/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.10086.cn/index/js/index_250_250.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1499、app/.vitepress/src/data/showcase/showcase-zh.ts:1454、app/.vitepress/src-new/data/showcase/showcase-en.ts:1499、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1444、app/en/user-practice/carrier/jiangsuyidong/index.md:7、app/zh/user-practice/carrier/jiangsuyidong/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.10086.cn/index/nm/index_471_471.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1374、app/.vitepress/src/data/showcase/showcase-zh.ts:1330、app/.vitepress/src-new/data/showcase/showcase-en.ts:1374、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1320、app/en/user-practice/carrier/neimengguyidong/index.md:7、app/zh/user-practice/carrier/neimengguyidong/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.10086.cn/index/xj/index_991_991.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1510、app/.vitepress/src/data/showcase/showcase-zh.ts:1465、app/.vitepress/src-new/data/showcase/showcase-en.ts:1510、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1455、app/en/user-practice/carrier/xinjiangyidong/index.md:7、app/zh/user-practice/carrier/xinjiangyidong/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.dapchina.cn/sy` | app/.vitepress/src/data/showcase/showcase-en.ts:219、app/.vitepress/src/data/showcase/showcase-zh.ts:229、app/.vitepress/src-new/data/showcase/showcase-en.ts:219、app/.vitepress/src-new/data/showcase/showcase-zh.ts:219、app/en/user-practice/medical/depaisoft/index.md:7、app/zh/user-practice/medical/depaisoft/index.md:7 | ECONNREFUSED |
| `https://www.fudan.edu.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:451、app/.vitepress/src/data/showcase/showcase-zh.ts:457、app/.vitepress/src-new/data/showcase/showcase-en.ts:451、app/.vitepress/src-new/data/showcase/showcase-zh.ts:447、app/en/user-practice/education/fudan/index.md:7、app/zh/user-practice/education/fudan/index.md:7 | ETIMEDOUT |
| `https://www.gx.csg.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:431、app/.vitepress/src/data/showcase/showcase-zh.ts:437、app/.vitepress/src-new/data/showcase/showcase-en.ts:431、app/.vitepress/src-new/data/showcase/showcase-zh.ts:427 | CERT_HAS_EXPIRED |
| `https://www.hmccb.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:1332、app/.vitepress/src/data/showcase/showcase-zh.ts:1288、app/.vitepress/src-new/data/showcase/showcase-en.ts:1332、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1278、app/en/user-practice/finance/hmccb/index.md:7、app/zh/user-practice/finance/hmccb/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.hrbb.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:1172、app/.vitepress/src/data/showcase/showcase-zh.ts:1128、app/.vitepress/src-new/data/showcase/showcase-en.ts:1172、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1118、app/en/user-practice/finance/haerbing/index.md:7、app/zh/user-practice/finance/haerbing/index.md:7 | ETIMEDOUT |
| `https://www.hzsun.com/guest/index?G` | app/.vitepress/src/data/showcase/showcase-en.ts:854、app/.vitepress/src/data/showcase/showcase-zh.ts:809、app/.vitepress/src-new/data/showcase/showcase-en.ts:854、app/.vitepress/src-new/data/showcase/showcase-zh.ts:799、app/en/user-practice/others/zhejiangzhengyuanzhihui/index.md:7、app/zh/user-practice/others/zhejiangzhengyuanzhihui/index.md:7 | ECONNREFUSED |
| `https://www.jshbank.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:1321、app/.vitepress/src/data/showcase/showcase-zh.ts:1277、app/.vitepress/src-new/data/showcase/showcase-en.ts:1321、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1267、app/en/user-practice/finance/jshbank/index.md:7、app/zh/user-practice/finance/jshbank/index.md:7 | ETIMEDOUT |
| `https://www.sdent.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:198、app/.vitepress/src/data/showcase/showcase-zh.ts:208、app/.vitepress/src-new/data/showcase/showcase-en.ts:198、app/.vitepress/src-new/data/showcase/showcase-zh.ts:198、app/en/user-practice/medical/sdent/index.md:7、app/zh/user-practice/medical/sdent/index.md:7 | AbortError |
| `https://www.shingroup.cn/index.html` | app/.vitepress/src/data/showcase/showcase-en.ts:780、app/.vitepress/src/data/showcase/showcase-zh.ts:735、app/.vitepress/src-new/data/showcase/showcase-en.ts:780、app/.vitepress/src-new/data/showcase/showcase-zh.ts:725、app/en/user-practice/others/hexintech/index.md:7、app/zh/user-practice/others/hexintech/index.md:7 | AbortError |
| `https://www.sinoregal.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:948、app/.vitepress/src/data/showcase/showcase-en.ts:949、app/.vitepress/src/data/showcase/showcase-zh.ts:903、app/.vitepress/src/data/showcase/showcase-zh.ts:904、app/.vitepress/src-new/data/showcase/showcase-en.ts:948、app/.vitepress/src-new/data/showcase/showcase-en.ts:949、app/.vitepress/src-new/data/showcase/showcase-zh.ts:893、app/.vitepress/src-new/data/showcase/showcase-zh.ts:894 | CERT_HAS_EXPIRED |
| `https://www.slidestalk.com/m/337` | app/zh/events/2020-12-19/meetup.md:40 | ECONNREFUSED |
| `https://www.slidestalk.com/m/374` | app/en/events/2021-03-26/meetup.md:65、app/zh/events/2021-03-26/meetup.md:122 | ECONNREFUSED |
| `https://www.tf.cn/tfyh/index.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1132、app/.vitepress/src/data/showcase/showcase-zh.ts:1087、app/.vitepress/src-new/data/showcase/showcase-en.ts:1132、app/.vitepress/src-new/data/showcase/showcase-zh.ts:1077、app/en/user-practice/finance/sichuantianfuyinhang/index.md:7、app/zh/user-practice/finance/sichuantianfuyinhang/index.md:7 | ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED |
| `https://www.uyun.com/#/home` | app/.vitepress/src/data/showcase/showcase-en.ts:958、app/.vitepress/src/data/showcase/showcase-en.ts:959、app/.vitepress/src/data/showcase/showcase-zh.ts:913、app/.vitepress/src/data/showcase/showcase-zh.ts:914、app/.vitepress/src-new/data/showcase/showcase-en.ts:958、app/.vitepress/src-new/data/showcase/showcase-en.ts:959、app/.vitepress/src-new/data/showcase/showcase-zh.ts:903、app/.vitepress/src-new/data/showcase/showcase-zh.ts:904 | AbortError |
| `https://yukon.supermap.io` | app/.vitepress/src/data/url-config/index.ts:47、app/.vitepress/src-new/data/url-config/index.ts:49 | AbortError |
| `https://zhaopin.sgcc.com.cn/sgcchr/static/unitInfo.html?obj_id=10522000` | app/.vitepress/src/data/showcase/showcase-en.ts:390、app/.vitepress/src/data/showcase/showcase-zh.ts:396、app/.vitepress/src-new/data/showcase/showcase-en.ts:390、app/.vitepress/src-new/data/showcase/showcase-zh.ts:386、app/en/user-practice/energy/guowanghenan/index.md:7、app/zh/user-practice/energy/guowanghenan/index.md:7 | ETIMEDOUT |
| `https://zwfw.shaanxi.gov.cn/sx/complement/about` | app/.vitepress/src/data/showcase/showcase-en.ts:656、app/.vitepress/src/data/showcase/showcase-zh.ts:662、app/.vitepress/src-new/data/showcase/showcase-en.ts:656、app/.vitepress/src-new/data/showcase/showcase-zh.ts:652、app/en/user-practice/others/xxzw/index.md:7、app/zh/user-practice/others/xxzw/index.md:7 | AbortError |
