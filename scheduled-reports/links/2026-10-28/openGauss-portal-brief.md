# 失效链接检查简短报告 · openGauss 官网（openGauss-portal）

- 检查时间：2026-10-28T12:22:17.637Z
- 运行模式：dry-run（未提 issue）
- 数据源：https://gitcode.com/opengauss/website（v2 分支）
- 结论：❌

### 问题清单（100 个失效 URL，共 348 处引用）

状态分布：`403`×13、`404`×24、`412`×5、`418`×15、`502`×2、`网络错误`×41

#### HTTP 403（13 个）

| URL | 引用位置 |
| --- | --- |
| `http://www.w3.org/2000/svg` | app/zh/migration/case/index.md:137、opendesign/checkbox/src/checkbox.tsx:65、opendesign/search/OSearch.vue:10 等 5 处 |
| `http://www.xugucn.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:60、app/.vitepress/src/data/showcase/showcase-zh.ts:60、app/.vitepress/src-new/data/showcase/showcase-en.ts:60 等 6 处 |
| `https://e.huawei.com/cn/talent/#/cert/product-details?certifiedProductId=503&authenticationLevel=CTYPE_CARE_HCIA&technicalField=PSC&version=1.0` | app/zh/events/2022-10-28/Meetup.md:39 |
| `https://hwlive.263live.net` | app/.vitepress/src/data/url-config/index.ts:61 |
| `https://meetingvideo.obs.ap-southeast-1.myhuaweicloud.com` | app/.vitepress/src/data/url-config/index.ts:10、app/.vitepress/src-new/data/url-config/index.ts:12 |
| （其余 8 个见完全版） | - |

#### HTTP 404（24 个）

| URL | 引用位置 |
| --- | --- |
| `http://pgconf2020.postgres.cn/schedule.html` | app/.vitepress/src/data/events/events-en.ts:34、app/.vitepress/src/data/events/events-zh.ts:795、app/en/events/2021-01-15/2021-01-15-PostgreSQL.md:10 等 4 处 |
| `http://www.gzsubzero.cn/index.html` | app/.vitepress/src/data/showcase/showcase-en.ts:746、app/.vitepress/src/data/showcase/showcase-zh.ts:691、app/.vitepress/src-new/data/showcase/showcase-en.ts:746 等 6 处 |
| `http://www.vastdata.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:7、app/.vitepress/src/data/showcase/showcase-zh.ts:7、app/.vitepress/src-new/data/showcase/showcase-en.ts:7 等 6 处 |
| `https://gitcode.com/opengauss/openGauss-server/issues/6422` | app/zh/news/2026-08-30/index.md:111 |
| `https://gitcode.com/opengauss/openGauss-server/issues/6736` | app/zh/news/2025-12-30-603/index.md:128 |
| （其余 19 个见完全版） | - |

#### HTTP 412（5 个）

| URL | 引用位置 |
| --- | --- |
| `https://bigdata.10086.cn` | app/.vitepress/src/data/url-config/index.ts:66、app/.vitepress/src-new/data/url-config/index.ts:55 |
| `https://it.10086.cn/indexc.html` | app/.vitepress/src/data/showcase/showcase-en.ts:1382、app/.vitepress/src/data/showcase/showcase-zh.ts:1328、app/.vitepress/src-new/data/showcase/showcase-en.ts:1382 等 6 处 |
| `https://space.bilibili.com/543286270/lists` | app/zh/news/2026-06-05/new.md:168 |
| `https://www.he.10086.cn/service/operate/` | app/.vitepress/src/data/showcase/showcase-en.ts:1413、app/.vitepress/src/data/showcase/showcase-zh.ts:1358、app/.vitepress/src-new/data/showcase/showcase-en.ts:1413 等 6 处 |
| `https://zhaopin.sgcc.com.cn/sgcchr/static/unitInfo.html?obj_id=10522000` | app/.vitepress/src/data/showcase/showcase-en.ts:378、app/.vitepress/src/data/showcase/showcase-zh.ts:374、app/.vitepress/src-new/data/showcase/showcase-en.ts:378 等 6 处 |

#### HTTP 418（15 个）

| URL | 引用位置 |
| --- | --- |
| `https://dsapi.test.osinfra.cn/` | app/vite.config.ts:80 |
| `https://e-campaign.huawei.com` | app/.vitepress/src/data/url-config/index.ts:69 |
| `https://e-campaign.huawei.com/t/BbuQr2` | app/.vitepress/src/data/url-config/index.ts:48、app/.vitepress/src-new/data/url-config/index.ts:50 |
| `https://gitcode.com/opengauss/openGauss-server/issues/7400` | app/zh/news/2025-12-30-603/index.md:373 |
| `https://gitcode.com/opengauss/openGauss-server/issues/7516` | app/zh/news/2025-12-30-603/index.md:201 |
| （其余 10 个见完全版） | - |

#### HTTP 502（2 个）

| URL | 引用位置 |
| --- | --- |
| `https://gallery.vphotos.cn/vphotosgallery/index.html?vphotowechatid=444E09B1CAF21355786B2E31CCF6126A&authType=1&gallery_source_code=0&toHash=#/cover` | app/zh/events/2021-06-28/meetup.md:109 |
| `https://gallery.vphotos.cn/vphotosgallery/index.html?vphotowechatid=E803C2FDCB2DDE9A5EB7B42750D4A824&gallery_source_code=0&toHash=&authType=1#/gallery` | app/zh/events/2021-05-31/meetup.md:107 |

#### 网络错误（41 个）

| URL | 引用位置 |
| --- | --- |
| `http://83958517.zhaozhaoqu.com/about.html` | app/.vitepress/src/data/showcase/showcase-en.ts:603、app/.vitepress/src/data/showcase/showcase-zh.ts:599、app/.vitepress/src-new/data/showcase/showcase-en.ts:603 等 6 处 |
| `http://97467211.007swz.com/` | app/.vitepress/src/data/showcase/showcase-en.ts:715、app/.vitepress/src/data/showcase/showcase-zh.ts:670、app/.vitepress/src-new/data/showcase/showcase-en.ts:715 等 6 处 |
| `http://huachuangark.com/about.aspx?ParentId=2&BaseInfoCateId=1&CateId=1` | app/.vitepress/src/data/showcase/showcase-en.ts:966、app/.vitepress/src/data/showcase/showcase-en.ts:967、app/.vitepress/src/data/showcase/showcase-zh.ts:911 等 8 处 |
| `http://online.10086.cn/official/new/index/#/home/index` | app/.vitepress/src/data/migration/migration-en.ts:520、app/.vitepress/src/data/migration/migration-zh.ts:520、app/.vitepress/src/data/showcase/showcase-en.ts:1465 等 8 处 |
| `http://www.bpic.com.cn/` | app/.vitepress/src/data/showcase/showcase-en.ts:1110、app/.vitepress/src/data/showcase/showcase-zh.ts:1055、app/.vitepress/src-new/data/showcase/showcase-en.ts:1110 等 6 处 |
| （其余 36 个见完全版） | - |
