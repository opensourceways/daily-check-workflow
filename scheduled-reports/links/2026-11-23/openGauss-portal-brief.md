# 失效链接检查简短报告 · openGauss 官网（openGauss-portal）

- 检查时间：2026-11-23T18:39:37.120Z
- 已有未关闭 issue：本轮只扫描归档，未提单/未写回（写回需 force_check 强制执行）
- 数据源：https://gitcode.com/opengauss/website（v2 分支）
- 结论：❌

### 问题清单（91 个失效 URL，共 645 处引用）

状态分布：`403`×12、`404`×25、`412`×5、`418`×7、`502`×2、`网络错误`×40

#### HTTP 403（12 个）

| URL | 引用位置 |
| --- | --- |
| `http://www.w3.org/2000/svg` | app/zh/migration/case/index.md:137、opendesign/checkbox/src/checkbox.tsx:65、opendesign/search/OSearch.vue:10 等 5 处 |
| `http://www.xugucn.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:72、app/.vitepress/src/data/showcase/showcase-zh.ts:82、app/.vitepress/src-new/data/showcase/showcase-en.ts:72 等 6 处 |
| `https://e.huawei.com/cn/talent/#/cert/product-details?certifiedProductId=503&authenticationLevel=CTYPE_CARE_HCIA&technicalField=PSC&version=1.0` | app/zh/events/2022-10-28/Meetup.md:39 |
| `https://hwlive.263live.net` | app/.vitepress/src/data/url-config/index.ts:73 |
| `https://meetingvideo.obs.ap-southeast-1.myhuaweicloud.com` | app/.vitepress/src/data/url-config/index.ts:22、app/.vitepress/src-new/data/url-config/index.ts:24 |
| （其余 7 个见完全版） | - |

#### HTTP 404（25 个）

| URL | 引用位置 |
| --- | --- |
| `http://pgconf2020.postgres.cn/schedule.html` | app/.vitepress/src/data/events/events-en.ts:46、app/.vitepress/src/data/events/events-zh.ts:807、app/en/events/2021-01-15/2021-01-15-PostgreSQL.md:10 等 4 处 |
| `http://www.gzsubzero.cn/index.html` | app/.vitepress/src/data/showcase/showcase-en.ts:758、app/.vitepress/src/data/showcase/showcase-zh.ts:713、app/.vitepress/src-new/data/showcase/showcase-en.ts:758 等 6 处 |
| `https://docs-opengauss.osinfra.cn/zh/docs/latest/docs/ReleaseNotes/Releasenotes.html` | app/zh/news/2024-03-30/index.md:20 |
| `https://gitcode.com/opengauss/openGauss-server/issues/6422` | app/zh/news/2026-08-30/index.md:111 |
| `https://gitcode.com/opengauss/openGauss-server/issues/6736` | app/zh/news/2025-12-30-603/index.md:128 |
| （其余 20 个见完全版） | - |

#### HTTP 412（5 个）

| URL | 引用位置 |
| --- | --- |
| `https://bigdata.10086.cn` | app/.vitepress/src/data/url-config/index.ts:78、app/.vitepress/src-new/data/url-config/index.ts:67 |
| `https://it.10086.cn/indexc.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1394、app/.vitepress/src/data/showcase/showcase-zh.ts:1350、app/.vitepress/src-new/data/showcase/showcase-en.ts:1394 等 6 处 |
| `https://space.bilibili.com/543286270/lists` | app/zh/news/2026-06-05/new.md:168 |
| `https://www.guilinbank.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:1152、app/.vitepress/src/data/showcase/showcase-zh.ts:1108、app/.vitepress/src-new/data/showcase/showcase-en.ts:1152 等 6 处 |
| `https://www.he.10086.cn/service/operate/` | app/.vitepress/src/data/showcase/showcase-en.ts:1425、app/.vitepress/src/data/showcase/showcase-zh.ts:1380、app/.vitepress/src-new/data/showcase/showcase-en.ts:1425 等 6 处 |

#### HTTP 418（7 个）

| URL | 引用位置 |
| --- | --- |
| `https://dsapi.test.osinfra.cn/` | app/vite.config.ts:92 |
| `https://e-campaign.huawei.com` | app/.vitepress/src/data/url-config/index.ts:81 |
| `https://e-campaign.huawei.com/t/BbuQr2` | app/.vitepress/src/data/url-config/index.ts:60、app/.vitepress/src-new/data/url-config/index.ts:62 |
| `https://hw.vhallyun.com` | app/.vitepress/src/data/url-config/index.ts:63 |
| `https://magicapi.osinfra.cn/stat/sig/info?community=opengauss` | app/en/sig/[sig].paths.ts:21、app/zh/sig/[sig].paths.ts:21 |
| （其余 2 个见完全版） | - |

#### HTTP 502（2 个）

| URL | 引用位置 |
| --- | --- |
| `https://gallery.vphotos.cn/vphotosgallery/index.html?vphotowechatid=444E09B1CAF21355786B2E31CCF6126A&authType=1&gallery_source_code=0&toHash=#/cover` | app/zh/events/2021-06-28/meetup.md:109 |
| `https://gallery.vphotos.cn/vphotosgallery/index.html?vphotowechatid=E803C2FDCB2DDE9A5EB7B42750D4A824&gallery_source_code=0&toHash=&authType=1#/gallery` | app/zh/events/2021-05-31/meetup.md:107 |

#### 网络错误（40 个）

| URL | 引用位置 |
| --- | --- |
| `http://83958517.zhaozhaoqu.com/about.html` | app/.vitepress/src/data/showcase/showcase-en.ts:615、app/.vitepress/src/data/showcase/showcase-zh.ts:621、app/.vitepress/src-new/data/showcase/showcase-en.ts:615 等 6 处 |
| `http://huachuangark.com/about.aspx?ParentId=2&BaseInfoCateId=1&CateId=1` | app/.vitepress/src/data/showcase/showcase-en.ts:978、app/.vitepress/src/data/showcase/showcase-en.ts:979、app/.vitepress/src/data/showcase/showcase-zh.ts:933 等 8 处 |
| `http://license.coscl.org.cn/MulanPSL2` | app/.vitepress/config.ts:6、app/.vitepress/public/check-dark-mode-v2.js:6、app/.vitepress/scripts/filter-empty-practice.ts:6 等 313 处 |
| `http://online.10086.cn/official/new/index/#/home/index` | app/.vitepress/src/data/migration/migration-en.ts:532、app/.vitepress/src/data/migration/migration-zh.ts:532、app/.vitepress/src/data/showcase/showcase-en.ts:1477 等 8 处 |
| `http://www.bpic.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:1122、app/.vitepress/src/data/showcase/showcase-zh.ts:1077、app/.vitepress/src-new/data/showcase/showcase-en.ts:1122 等 6 处 |
| （其余 35 个见完全版） | - |
