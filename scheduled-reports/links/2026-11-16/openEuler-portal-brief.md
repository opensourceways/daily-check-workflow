# 失效链接检查简短报告 · openEuler 官网（openEuler-portal）

- 检查时间：2026-11-16T16:18:48.625Z
- 已有未关闭 issue：本轮只扫描归档，未提单/未写回（写回需 force_check 强制执行）
- 数据源：https://gitcode.com/openeuler/openEuler-portal（master 分支）
- 结论：❌

### 问题清单（651 个失效 URL，共 1161 处引用）

状态分布：`400`×1、`401`×8、`402`×1、`403`×135、`404`×278、`405`×1、`410`×1、`412`×63、`418`×7、`429`×8、`500`×2、`503`×1、`521`×16、`999`×1、`网络错误`×128

#### HTTP 400（1 个）

| URL | 引用位置 |
| --- | --- |
| `https://apig.osinfra.cn/cve-security-notice-server/securitynotice/getByCveId` | app/zh/blog/20260922-oed-cli/20260922-oed-cli.md:48、app/zh/blog/20260922-oed-cli/20260922-oed-cli.md:68 |

#### HTTP 401（8 个）

| URL | 引用位置 |
| --- | --- |
| `https://firmianay.gitbooks.io/ctf-all-in-one/content/doc/4.14_glibc_tcache.html` | app/en/blog/wangshuo/Glibc_Malloc_Source_Code_Analysis_(1).md:454、app/en/blog/wangshuo/Glibc_Malloc_Source_Code_Analysis_(3).md:687、app/zh/blog/wangshuo/Glibc_Malloc_Source_Code_Analysis_(1).md:455 等 5 处 |
| `https://gitee.com/open_euler/dashboard/members/cxl78320` | app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:149 |
| `https://gitee.com/open_euler/dashboard/members/georgecao` | app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:115、app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:119、app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:143 等 4 处 |
| `https://gitee.com/open_euler/dashboard/members/liuqi469227928` | app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:115、app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:119、app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:143 等 4 处 |
| `https://gitee.com/open_euler/dashboard/members/wangchong1995924` | app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:120、app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:148 |
| （其余 3 个见完全版） | - |

#### HTTP 402（1 个）

| URL | 引用位置 |
| --- | --- |
| `https://pkgs.org` | app/en/blog/phoebe/2023-09-26-Run-openEuler-RISC-V-On-Qemu.md:27 |

#### HTTP 403（135 个）

| URL | 引用位置 |
| --- | --- |
| `http://openeuler-os-image.obs.cn-north-4.myhuaweicloud.com/openEuler-1.0-1205-aarch64-dvd.iso` | app/zh/news/2020hdc.md:55、app/zh/news/2020hdc.md:170 |
| `http://www.w3.org/2000/svg` | opendesign/checkbox/src/checkbox.tsx:65、opendesign/search/OSearch.vue:17、opendesign/tag/src/tag.tsx:34 |
| `http://www.w3.org/TR/REC-html40` | app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP2 技术白皮书.files/header.html:1、app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP2 技术白皮书.html:1、app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP3 技术白皮书.files/header.html:1 等 11 处 |
| `https://build.openeuler.org` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:76 |
| `https://build.openeuler.org/` | app/zh/blog/fuchangjie/2020-03-26-how-to-OBS.md:56、app/zh/blog/fuchangjie/2020-03-26-how-to-OBS.md:57、app/zh/blog/fuchangjie/2020-03-26-how-to-OBS.md:62 等 5 处 |
| （其余 130 个见完全版） | - |

#### HTTP 404（278 个）

| URL | 引用位置 |
| --- | --- |
| `http://dl-cdn.alpinelinux.org/alpine/latest-stable/releases/aarch64/alpine-minirootfs-3.12.0-aarch64.tar.gz` | app/en/blog/wangzhigang/howToUseStratoVirt.md:98、app/zh/blog/wangzhigang/howToUseStratoVirt.md:96 |
| `http://mirror.centos.org/centos/7/os/x86_64/Packages/iok-2.1.3-6.el7.x86_64.rpm` | app/en/blog/randy1568/Iok 2.1.3-porting-guide.md:39、app/zh/blog/randy1568/Iok 2.1.3-porting-guide.md:47 |
| `http://mirror.centos.org/centos/7/os/x86_64/Packages/python-tornado-4.2.1-5.el7.x86_64.rpm` | app/en/blog/randy1568/tornado 4-2-1-porting-guide.md:52、app/zh/blog/randy1568/tornado 4-2-1-porting-guide.md:53 |
| `http://repo.openeuler.org/openEuler-21.09/EPOL/main/x86_64/` | app/en/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:43、app/zh/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:42 |
| `http://repo.openeuler.org/openEuler-21.09/everything/x86_64/` | app/en/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:42、app/zh/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:41 |
| （其余 273 个见完全版） | - |

#### HTTP 405（1 个）

| URL | 引用位置 |
| --- | --- |
| `https://gitee.com/mirrors/LLVM.git` | app/en/blog/cascades/2021-8-14-Learning-About-libFuzzer.md:49、app/zh/blog/cascades/2021-8-14-Learning-About-libFuzzer.md:53 |

#### HTTP 410（1 个）

| URL | 引用位置 |
| --- | --- |
| `https://www.virtualbox.org/wiki/Downloads` | app/en/blog/traffic_millions/2020-03-27-VirtualBox.md:28、app/en/wiki/install/virtualization/index.md:24、app/zh/blog/2024-11-26-使用虚拟机镜像文件导入部署openEuler+openGauss实验指导/2024-11-26-使用虚拟机镜像文件导入部署openEuler+openGauss实验指导.md:57 等 5 处 |

#### HTTP 412（63 个）

| URL | 引用位置 |
| --- | --- |
| `https://space.bilibili.com/527064077/channel/collectiondetail?sid=1275271` | app/zh/news/20230417-hz/20230417-hz.md:97 |
| `https://space.bilibili.com/527064077/channel/collectiondetail?sid=1805628` | app/zh/news/openEuler/20231020-vrt/20231020-vrt.md:146 |
| `https://space.bilibili.com/527064077/channel/collectiondetail?sid=1903666` | app/zh/news/20231127-suz/20231127-suz.md:60 |
| `https://space.bilibili.com/527064077/channel/collectiondetail?sid=2557185` | app/zh/news/openEuler/20240330-openchain/20240330-openchain.md:63 |
| `https://space.bilibili.com/527064077/channel/collectiondetail?sid=2579411` | app/zh/news/openEuler/20240330-G11N/20240330-G11N.md:186 |
| （其余 58 个见完全版） | - |

#### HTTP 418（7 个）

| URL | 引用位置 |
| --- | --- |
| `https://e-campaign.huawei.com/events3/UniversalForm/register/200908020/register.html?site=cn&formId=6155&way=onsite` | app/.vitepress/src/views/summit/summit2023/data/data_en.ts:12 |
| `https://e-campaign.huawei.com/m/N7V3Eb` | app/.vitepress/src/views/summit/devday2023/components/SummitBanner.vue:30、app/.vitepress/src/views/summit/devday2023/components/SummitBanner.vue:45 |
| `https://hw.vhallyun.com` | app/.vitepress/src/views/summit/summit2023/components/SummitLive.vue:60、app/.vitepress/src/views/summit/summit2024/components/SummitLive.vue:58、app/.vitepress/src-new/shared/config/index.ts:5 等 4 处 |
| `https://jenkins.osinfra.cn/view/openEuler/job/luweijun/job/eulerpublisher/` | app/zh/news/20230908-yuebao/20230908-yuebao.md:192 |
| `https://jenkins.osinfra.cn/view/openEuler/job/luweijun/job/eulerpublisher/3` | app/en/blog/20230908-EulerPublisher.md:29、app/zh/blog/20230908-EulerPublisher.md:32 |
| （其余 2 个见完全版） | - |

#### HTTP 429（8 个）

| URL | 引用位置 |
| --- | --- |
| `https://cutt.ly/8zcDyPi` | app/en/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:380、app/zh/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:293、app/zh/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:380 |
| `https://cutt.ly/TzcSjUX` | app/en/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:375、app/zh/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:289、app/zh/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:375 |
| `https://en.oceanbase.com/` | app/en/news/20240730/openEuler-Monthly-Bulletin-July.md:92 |
| `https://github.com/apache/httpd/blob/2.4.x/CHANGES#L17-L20` | app/zh/blog/xiyuanwang/2020-04-14-Web-ARM64-Support.md:115 |
| `https://github.com/riscv-non-isa/riscv-server-platform/blob/main/server_platform_requirements.adoc` | app/zh/blog/20260326-RISC-V/0326-RISC-V.md:127 |
| （其余 3 个见完全版） | - |

#### HTTP 500（2 个）

| URL | 引用位置 |
| --- | --- |
| `http://114.116.250.98/` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:77 |
| `http://bjos.oschina.net/juesaihuojiaingddanzhengshif-n121.html#cons` | app/zh/news/20230529-riscv.md:56 |

#### HTTP 503（1 个）

| URL | 引用位置 |
| --- | --- |
| `https://www.element14.com/community/servlet/JiveServlet/previewBody/41836-102-1-229511/ARM.Reference_Manual.pdf` | app/zh/blog/genedna/summer-2020-openeuler-tasks.md:183 |

#### HTTP 521（16 个）

| URL | 引用位置 |
| --- | --- |
| `https://blog.csdn.net/a555809067/article/details/144157583` | app/zh/blog/20250708-iSulad-brief-tutorial/20250708-iSulad-brief-tutorial.md:13 |
| `https://blog.csdn.net/bingshiwuyu/article/details/107333259` | app/zh/blog/haozi007/2020-09-09-isulad-benchmark.md:433 |
| `https://blog.csdn.net/Darlingqiang/article/details/118913291` | app/en/blog/20220802-loop-interchange/20220802-loop-interchange.md:331、app/zh/blog/20220802-loop-interchange/20220802-loop-interchange.md:307 |
| `https://blog.csdn.net/gengshenghong/article/details/7225775` | app/en/blog/20220802-loop-interchange/20220802-loop-interchange.md:323、app/zh/blog/20220802-loop-interchange/20220802-loop-interchange.md:299 |
| `https://blog.csdn.net/jianwen_hi/article/details/53398141` | app/zh/blog/luoyuzhe/005Linux-kernel-source-structure-1/index.md:70 |
| （其余 11 个见完全版） | - |

#### HTTP 999（1 个）

| URL | 引用位置 |
| --- | --- |
| `https://www.linkedin.com/in/mikerumph/` | app/zh/blog/xiyuanwang/2020-04-14-Web-ARM64-Support.md:13 |

#### 网络错误（128 个）

| URL | 引用位置 |
| --- | --- |
| `http://*HAProxy` | app/en/blog/randy1568/HAProxy 1-9-0-porting-guide.md:173 |
| `http://119.3.219.20:82/openEuler:/21.03/standard_aarch64/` | app/en/blog/randy1568/pkgship 2-1-0-porting-guide.md:85、app/zh/blog/randy1568/pkgship 2-1-0-porting-guide.md:85 |
| `http://119.3.219.20:82/openEuler:/Mainline/standard_x86_64/x86_64/gnome-boxes-3.38.2-3.oe1.x86_64.rpm` | app/en/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:96、app/zh/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:94 |
| `http://192.168.1.1:8080` | app/zh/blog/liuyanglinux/2024-09-09-开源镜像站部署.md:268 |
| `http://192.168.122.1/ks/openEuler-ks.cfg` | app/zh/blog/20250613-kickstart/20250613-kickstart.md:233 |
| （其余 123 个见完全版） | - |
