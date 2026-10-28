# 失效链接检查简短报告 · MindSpore 官网（MindSpore-portal）

- 检查时间：2026-10-28T12:22:17.637Z
- 运行模式：dry-run（未提 issue）
- 数据源：https://gitcode.com/mindspore/mindspore-portal（master 分支）
- 结论：❌

### 问题清单（963 个失效 URL，共 2630 处引用）

状态分布：`400`×2、`401`×4、`403`×246、`404`×489、`405`×3、`412`×69、`418`×2、`429`×11、`500`×1、`503`×2、`520`×1、`521`×4、`网络错误`×129

#### HTTP 400（2 个）

| URL | 引用位置 |
| --- | --- |
| `http://www.facebook.com/Huawei` | packages/website/content/news/en/176.md:59 |
| `https://modelbest.feishu.cn/space/api/box/stream/download/asynccode/?code=YjkwYjgyYTkxZGVkZTczNGQyZWYxYjRlMTViNjNjZThfOFlhOGoyekFRSTA2c3paY0w0OVFTa1Z4bzJ1RVJ3RDlfVG9rZW46UHc5ZGJBSnNLb0dyVTV4dkE4SWNtazdJbjFmXzE3NDkxODAyNjQ6MTc0OTE4Mzg2NF9WNA` | packages/website/content/news/zh/3782.md:39 |

#### HTTP 401（4 个）

| URL | 引用位置 |
| --- | --- |
| `https://gitee.com/mindspore/mindformers/issues/new` | packages/website/content/news/zh/3782.md:140 |
| `https://huggingface.co/a-m-team/AM-DeepSeek-R1-0528-Distilled` | packages/website/content/news/zh/3802.md:159 |
| `https://huggingface.co/facebook/encodec` | packages/website/content/news/zh/3058.md:202 |
| `https://huggingface.co/TeleChat/TeleChat3-105B-A4.7B` | packages/website/content/technology-blogs/zh/2026-1-6.md:275 |

#### HTTP 403（246 个）

| URL | 引用位置 |
| --- | --- |
| `http://raspberrypi.com/software/` | packages/website/content/technology-blogs/zh/1045.md:28 |
| `http://www.huawei.com` | packages/website/content/news/zh/175.md:37 |
| `http://www.w3.org/1998/Math/MathML` | tests/website-docs-dompurify-config.test.ts:31 |
| `https://advanced.onlinelibrary.wiley.com/doi/10.1002/qute.202500067` | packages/website/content/news/zh/2026-5-27.md:509、packages/website/content/news/zh/2026-9-14.md:51 |
| `https://atomgit.com/gzbang/mindspore-portal/blob/stable/packages/website/data/data-sharing-with-third-parties/data-sharing-with-third-parties_en.md#third-party-partners` | packages/website/data/data-sharing-with-third-parties/data-sharing-with-third-parties_en.html:106 |
| （其余 241 个见完全版） | - |

#### HTTP 404（489 个）

| URL | 引用位置 |
| --- | --- |
| `http://ascend.gitee.io/playground` | packages/website/content/activities/zh/346.md:66 |
| `http://ascend.gitee.io/playground/` | packages/website/content/activities/zh/346.md:20、packages/website/content/activities/zh/346.md:48 |
| `http://caai.cn/index.php?s=/home/article/detail/id/1426.html` | packages/website/content/news/zh/703.md:37、packages/website/content/news/zh/703.md:39 |
| `http://caai.cn/index.php?s=/home/article/detail/id/1465.html` | packages/website/content/news/zh/758.md:39、packages/website/content/news/zh/758.md:43 |
| `http://caai.cn/index.php?s=/home/article/detail/id/998.html` | packages/website/content/news/zh/349.md:19 |
| （其余 484 个见完全版） | - |

#### HTTP 405（3 个）

| URL | 引用位置 |
| --- | --- |
| `https://gitee.com/mirrors/Fashion-MNIST` | packages/website/content/technology-blogs/zh/1050.md:32、packages/website/content/technology-blogs/zh/1050.md:34 |
| `https://gitee.com/mirrors/Fashion-MNIST.git` | packages/website/content/technology-blogs/zh/1050.md:39 |
| `https://gitee.com/signup` | packages/website/content/technology-blogs/zh/580.md:27 |

#### HTTP 412（69 个）

| URL | 引用位置 |
| --- | --- |
| `http://www.caict.ac.cn/english/research/whitepapers/202203/t20220322_398369.html` | packages/website/content/technology-blogs/en/1769.md:174 |
| `https://space.bilibili.com` | packages/website/data/config/index.ts:42、packages/website-docs/src/config/url.ts:43、packages/website-docs/src/data/config/index.ts:41 |
| `https://space.bilibili.com/15220601/` | packages/website/content/news/zh/1403.md:56 |
| `https://space.bilibili.com/517221395?spm` | packages/website/content/news/zh/756.md:25 |
| `https://space.bilibili.com/526894060?from=search&seid=3675452334887615774` | packages/website/content/activities/zh/408.md:58 |
| （其余 64 个见完全版） | - |

#### HTTP 418（2 个）

| URL | 引用位置 |
| --- | --- |
| `https://hw.vhallyun.com` | packages/website/data/config/index.ts:121、packages/website-docs/src/config/url.ts:122、packages/website-docs/src/data/config/index.ts:120 |
| `https://mindspore-website.test.osinfra.cn/` | packages/website-docs/README.md:62、packages/website-docs/vite.config.ts:19 |

#### HTTP 429（11 个）

| URL | 引用位置 |
| --- | --- |
| `https://biorxiv.org/cgi/content/short/2023.11.18.567666v1` | packages/website/content/news/zh/2895.md:41 |
| `https://github.com/GoogleCloudPlatform/ml-design-patterns/blob/master/02_data_representation/embeddings.ipynb` | packages/website/content/technology-blogs/en/1529.md:190 |
| `https://github.com/mindspore-courses/applications/blob/master/pwc` | packages/website/content/technology-blogs/zh/3699.md:34 |
| `https://github.com/mindspore-lab/minddiffusion/blob/main/vision/wukong-huahua/run` | packages/website/content/technology-blogs/en/2948.md:57、packages/website/content/technology-blogs/zh/2882.md:58 |
| `https://github.com/mindspore-lab/mindnlp/blob/master/llm/inference/bark/inference.py` | packages/website/content/technology-blogs/zh/3824.md:224 |
| （其余 6 个见完全版） | - |

#### HTTP 500（1 个）

| URL | 引用位置 |
| --- | --- |
| `https://ubuntu.com/blog/open-source-mlops-ai-framework` | packages/website/content/news/zh/1957.md:123 |

#### HTTP 503（2 个）

| URL | 引用位置 |
| --- | --- |
| `https://s-085841-internlmcamp-t2-fission.openxlab.space/dist/index.html` | packages/website/content/news/zh/3032.md:78、packages/website/content/news/zh/3046.md:75 |
| `https://www.cameo3d.org/cameong_servers/` | packages/website/content/news/en/1488.md:29 |

#### HTTP 520（1 个）

| URL | 引用位置 |
| --- | --- |
| `http://www.twitter.com/Huawei` | packages/website/content/news/en/176.md:57 |

#### HTTP 521（4 个）

| URL | 引用位置 |
| --- | --- |
| `https://beian.miit.gov.cn/#/Integrated/index` | packages/website/data/config/index.ts:75、packages/website-docs/src/config/url.ts:76、packages/website-docs/src/data/config/index.ts:74 |
| `https://blog.csdn.net/chaipp0607/article/details/99671483` | packages/website/content/technology-blogs/zh/1674.md:576 |
| `https://blog.csdn.net/kaierlong/article/details/125537647?spm=1001.2014.3001.5502` | packages/website/content/technology-blogs/en/1741.md:16 |
| `https://blog.csdn.net/m0_37799466/article/details/106054111` | packages/website/content/technology-blogs/zh/1674.md:566 |

#### 网络错误（129 个）

| URL | 引用位置 |
| --- | --- |
| `http://58.48.42.237` | packages/website/data/config/index.ts:21、packages/website-docs/src/config/url.ts:22、packages/website-docs/src/data/config/index.ts:20 |
| `http://58.48.42.237/luojiaNet` | packages/website/content/news/en/1576.md:51、packages/website/content/news/zh/1525.md:71 |
| `http://58.48.42.237/luojiaSet` | packages/website/content/news/en/1576.md:47、packages/website/content/news/zh/1525.md:67 |
| `http://cylinder` | packages/website/content/technology-blogs/en/1897.md:30、packages/website/content/technology-blogs/en/1897.md:32、packages/website/content/technology-blogs/en/1897.md:34 |
| `http://dynamic` | packages/website/content/technology-blogs/zh/2214.md:240 |
| （其余 124 个见完全版） | - |
