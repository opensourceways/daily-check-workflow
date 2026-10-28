# 失效链接检查完全版报告 · openEuler 官网（openEuler-portal）

- 检查时间：2026-10-28T12:22:17.637Z
- 运行模式：dry-run（未提 issue）

### 项目信息

- 项目：openEuler 官网（openEuler-portal）
- 数据源：`https://gitcode.com/openeuler/openEuler-portal`（master 分支，取 AtomGit 同名镜像）
- 站点域名：https://www.openeuler.org
- 相对路径前缀（urlPrefix）：`/zh`
- 结论：❌（失效 URL 644 个 / 1151 处引用）

### 扫描概况

| 扫描文件 | 链接引用 | 探测 URL（去重后） | 有效 | 失效 |
| --- | --- | --- | --- | --- |
| 2744 | 6892 | 3653 | 3009 | 644 |

### 失效链接明细（状态分布：`400`×1、`401`×7、`402`×1、`403`×132、`404`×279、`405`×1、`412`×60、`418`×7、`429`×4、`500`×3、`503`×1、`521`×16、`999`×1、`网络错误`×131）

#### HTTP 400（1 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://apig.osinfra.cn/cve-security-notice-server/securitynotice/getByCveId` | app/zh/blog/20260922-oed-cli/20260922-oed-cli.md:48、app/zh/blog/20260922-oed-cli/20260922-oed-cli.md:68 | — |

#### HTTP 401（7 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://gitee.com/open_euler/dashboard/members/cxl78320` | app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:149 | — |
| `https://gitee.com/open_euler/dashboard/members/georgecao` | app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:115、app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:119、app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:143、app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:147 | — |
| `https://gitee.com/open_euler/dashboard/members/liuqi469227928` | app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:115、app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:119、app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:143、app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:147 | — |
| `https://gitee.com/open_euler/dashboard/members/wangchong1995924` | app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:120、app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:148 | — |
| `https://gitee.com/open_euler/dashboard/members/zhengyaohui` | app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:114、app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:118、app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:144 | — |
| `https://gitee.com/open_euler/dashboard/projects/src-openeuler/ct-ng/pulls/2?tab=comments` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:323 | — |
| `https://gitee.com/profile/sshkeys` | app/zh/blog/luoyuzhe/000openEuler-community-development-process/index.md:55 | — |

#### HTTP 402（1 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://pkgs.org` | app/en/blog/phoebe/2023-09-26-Run-openEuler-RISC-V-On-Qemu.md:27 | — |

#### HTTP 403（132 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `http://openeuler-os-image.obs.cn-north-4.myhuaweicloud.com/openEuler-1.0-1205-aarch64-dvd.iso` | app/zh/news/2020hdc.md:55、app/zh/news/2020hdc.md:170 | — |
| `http://www.w3.org/2000/svg` | opendesign/checkbox/src/checkbox.tsx:65、opendesign/search/OSearch.vue:17、opendesign/tag/src/tag.tsx:34 | — |
| `http://www.w3.org/TR/REC-html40` | app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP2 技术白皮书.files/header.html:1、app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP2 技术白皮书.html:1、app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP3 技术白皮书.files/header.html:1、app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP3 技术白皮书.html:1、app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP4技术白皮书.files/header.html:1、app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP4技术白皮书.html:1、app/.vitepress/public/whitepaper/html/openEuler 25.03 技术白皮书.files/header.html:1、app/.vitepress/public/whitepaper/html/openEuler 25.03 技术白皮书.html:1、app/.vitepress/public/whitepaper/html/openEuler 25.09 技术白皮书.files/header.html:1、app/.vitepress/public/whitepaper/html/openEuler 25.09 技术白皮书.html:1、app/.vitepress/public/whitepaper/html/openEuler 26.09 技术白皮书.html:6 | — |
| `https://blog.huawei.com/wp-content/uploads/2020/06/581695-v2-3.mp4` | app/en/blog/bluesky1213/2020-06-30-The-Future-of-Cloud-in-a-COVID-19-Era.md:64 | — |
| `https://build.openeuler.org` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:76 | — |
| `https://build.openeuler.org/` | app/zh/blog/fuchangjie/2020-03-26-how-to-OBS.md:56、app/zh/blog/fuchangjie/2020-03-26-how-to-OBS.md:57、app/zh/blog/fuchangjie/2020-03-26-how-to-OBS.md:62、app/zh/blog/fuchangjie/2020-03-26-how-to-OBS.md:64、app/zh/blog/fuchangjie/2020-03-26-how-to-OBS.md:70 | — |
| `https://build.openeuler.org/package/show/openEuler:Mainline/isula-build` | app/en/blog/DCCooper/2020-09-15-isula-build-code-exploration.md:139、app/en/blog/DCCooper/2020-09-15-isula-build-code-exploration.md:149、app/zh/blog/DCCooper/2020-09-15-isula-build-code-exploration.md:141、app/zh/blog/DCCooper/2020-09-15-isula-build-code-exploration.md:151 | — |
| `https://build.openeuler.org/project/show/openEuler:20.03:LTS` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:98 | — |
| `https://build.openeuler.org/project/show/openEuler:Factory` | app/en/wiki/contribution/index.md:79、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:96、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:391、app/zh/wiki/contribution/index.md:79 | — |
| `https://build.openeuler.org/project/show/openEuler:Mainline` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:97 | — |
| `https://ceph2022.sched.com/` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:15、app/en/blog/rosinL/2022-3-31-Ceph Community News (2022-02-17 to 2022-03-13).md:15、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:16、app/zh/blog/rosinL/2022-3-31-Ceph Community News (2022-02-17 to 2022-03-13).md:16 | — |
| `https://ci.lighttpd.net/view/lighttpd1.4/job/lighttpd1.4/` | app/zh/blog/xiyuanwang/2020-04-14-Web-ARM64-Support.md:117 | — |
| `https://community.arm.com/developer/tools-software/oss-platforms/b/android-blog/posts/arm-neon-programming-quick-reference` | app/zh/blog/genedna/summer-2020-openeuler-tasks.md:180 | — |
| `https://develop.openfoam.com/Development/openfoam/-/merge_requests/601/diffs` | app/zh/news/20230602-yuebao/20230602-yuebao.md:273 | — |
| `https://developer.arm.com/architectures/learn-the-architecture/aarch64-virtualization/virtualization-host-extensions` | app/en/blog/yorifang/2020-10-24-arm-virtualization-overview.md:98、app/en/blog/yorifang/2020-10-24-arm-virtualization-overview.md:348、app/zh/blog/yorifang/2020-10-24-arm-virtualization-overview.md:106、app/zh/blog/yorifang/2020-10-24-arm-virtualization-overview.md:371 | — |
| `https://developer.arm.com/documentation/ddi0487/latest` | app/en/blog/yorifang/2020-10-24-arm-virtualization-overview.md:346、app/zh/blog/yorifang/2020-10-24-arm-virtualization-overview.md:369 | — |
| `https://developer.arm.com/documentation/ihi0070/latest` | app/en/blog/wxggg/2020-11-21-iommu-smmu-intro.md:339、app/zh/blog/wxggg/2020-11-21-iommu-smmu-intro.md:324 | — |
| `https://dl.acm.org/doi/10.1145/3651890.3672216` | app/en/news/20260418-openYuanrong-Edinburgh Joint Lab/20260418-openYuanrong-Edinburgh Joint Lab .md:49、app/zh/blog/20260525-openYuanrong_09/20260525-openYuanrong_09.md:117、app/zh/blog/20260803-openYuanrong-Agent/20260803-openYuanrong-Agent.md:146、app/zh/news/20260417-openYuanrong_2026 Spring Workshop/20260417-openYuanrong_2026 Spring Workshop.md:51 | — |
| `https://docs.openeuler.org/zh/docs/` | app/zh/blog/20231020-HPC/20231020-HPC.md:122 | — |
| `https://docs.openstack.org/diskimage-builder/latest/` | app/en/blog/20231020-HPC/20231020-HPC.md:106、app/zh/blog/20231020-HPC/20231020-HPC.md:114 | — |
| `https://docs.openstack.org/kolla-ansible/wallaby/user/quickstart.html` | app/en/blog/NestOS-OpenStack/index.md:378、app/zh/blog/NestOS-OpenStack/index.md:378 | — |
| `https://doi.org/10.1145/3715718` | app/zh/blog/20260603-PatchFlow Agent/20260603-PatchFlow Agent.md:146 | — |
| `https://downloads.mysql.com/archives/get/p/23/file/mysql-5.7.21-1.el7.x86_64.rpm-bundle.tar` | app/en/blog/20220726-banqian-mysql/banqian-mysql.md:61、app/en/blog/randy1568/MySQL 5-7-21-migrate-guide.md:66、app/zh/blog/20220726-banqian-mysql/banqian-mysql.md:58、app/zh/blog/randy1568/MySQL 5-7-21-migrate-guide.md:65 | — |
| `https://eulermaker.compass-ci.openeuler.openatom.cn` | app/zh/news/openEuler/20231009-23.09/20231009-23.09.md:109 | — |
| `https://eulermaker.compass-ci.openeuler.openatom.cn/` | app/en/news/20241130/openEuler Monthly Bulletin - November.md:105、app/en/news/20241230/openEuler Monthly Bulletin -  December.md:35、app/zh/news/20230512-yuebao/20230512-yuebao.md:191 | — |
| `https://ghfast.top/https://github.com/ggml-org/llama.cpp.git` | app/zh/blog/20260831-openEuler 24.03-llama.cpp/20260831-openEuler 24.03-llama.cpp .md:296 | — |
| `https://ghfast.top/https://github.com/sgl-project/sglang.git` | app/zh/blog/20260826-openEuler 24.03- SGLang/20260826-openEuler 24.03- SGLang.md:365 | — |
| `https://gitee.com/opensourceway/om-collections` | app/zh/blog/zhongjun2/2020-05-07-os-metrics-2.md:83 | — |
| `https://gitee.com/Vchanger/a-ops-tools#a-ops-tools` | app/en/blog/20230224-A-Ops/20230224-A-Ops.md:72、app/zh/blog/20230224-A-Ops/20230224-A-Ops.md:90 | — |
| `https://gitee.com/woodrabbit/git-basics.git` | app/zh/blog/2024-11-04-openEuler-community-experience-sharing/2024-11-04-openEuler-community-experience-sharing.md:124 | — |
| `https://join.slack.com/t/openeulerhq/shared_invite/zt-1z1kgmtw4-AiBozBdxi1IC8wf6Rgx1tQ` | app/en/news/202030721-Buzz/202030721-Buzz.md:242 | — |
| `https://mirrors.huaweicloud.com/repository/maven/` | app/en/blog/randy1568/Dubbo 2-6-8-porting-guide.md:180、app/en/blog/randy1568/Dubbo 2-7-5-porting-guide.md:180、app/zh/blog/randy1568/Dubbo 2-6-8-porting-guide.md:155、app/zh/blog/randy1568/Dubbo 2-7-5-porting-guide.md:155 | — |
| `https://obs-openeuler-easyeditor-prod.obs.cn-north-4.myhuaweicloud.com/Andrew` | app/.vitepress/src/views/summit/summit2024/data/agenda-data_zh.ts:24 | — |
| `https://obs-openeuler-easyeditor-prod.obs.cn-north-4.myhuaweicloud.com/Dr` | app/.vitepress/src/views/summit/summit2024/data/agenda-data_zh.ts:24 | — |
| `https://opendev.org/x/stackalytics` | app/zh/blog/zhongjun2/2020-05-07-os-metrics-2.md:28 | — |
| `https://opendev.org/x/stackalytics/src/branch/master/stackalytics/processor/schema.py` | app/zh/blog/zhongjun2/2020-05-07-os-metrics-2.md:45 | — |
| `https://openeuler-website.obs.ap-southeast-1.myhuaweicloud.com/excel/Visa.xlsx` | app/.vitepress/src/views/summit/summit2023/TheSummit.vue:408 | — |
| `https://opensource.org/` | app/en/blog/fred_li/2020-03-03-license-update.md:17 | — |
| `https://opensource.org/license` | app/en/community/contribution/detail.md:88 | — |
| `https://opensource.org/licenses/alphabetical` | app/zh/blog/myeuler/2020-5-13-openEuler-Travel.md:50、app/zh/community/contribution/detail.md:88 | — |
| `https://opensource.org/licenses/MulanPSL-2.0` | app/zh/blog/myeuler/2020-5-13-openEuler-Travel.md:52 | — |
| `https://osseu2024.sched.com/event/1iWLB` | app/zh/news/openEuler/20240914-osseu/20240914-osseu.md:18 | — |
| `https://rancher-mirror.oss-cn-beijing.aliyuncs.com/rke2/install.sh` | app/zh/blog/20230213-rancher/20230210-rancher.md:50 | — |
| `https://sched.co/w9Ec` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:40、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:41 | — |
| `https://sched.co/w9Ef` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:41、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:42 | — |
| `https://sched.co/w9Ei` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:32、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:33 | — |
| `https://sched.co/w9Eo` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:30、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:31 | — |
| `https://sched.co/w9ET` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:35、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:36 | — |
| `https://sched.co/w9Eu` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:49、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:50 | — |
| `https://sched.co/w9EW` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:25、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:26 | — |
| `https://sched.co/w9Ex` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:50、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:51 | — |
| `https://sched.co/w9EZ` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:29、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:30 | — |
| `https://sched.co/w9F0` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:27、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:28 | — |
| `https://sched.co/w9F3` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:48、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:49 | — |
| `https://sched.co/w9F6` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:61、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:62 | — |
| `https://sched.co/w9F9` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:36、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:37 | — |
| `https://sched.co/w9FC` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:54、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:55 | — |
| `https://sched.co/w9Fd` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:38、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:39 | — |
| `https://sched.co/w9FF` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:34、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:35 | — |
| `https://sched.co/w9Fg` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:42、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:43 | — |
| `https://sched.co/w9FI` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:33、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:34 | — |
| `https://sched.co/w9Fj` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:37、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:38 | — |
| `https://sched.co/w9FL` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:18、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:19 | — |
| `https://sched.co/w9Fm` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:19、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:20 | — |
| `https://sched.co/w9FO` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:31、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:32 | — |
| `https://sched.co/w9Fp` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:51、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:52 | — |
| `https://sched.co/w9FR` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:44、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:45 | — |
| `https://sched.co/w9Fs` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:23、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:24 | — |
| `https://sched.co/w9FU` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:58、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:59 | — |
| `https://sched.co/w9Fv` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:28、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:29 | — |
| `https://sched.co/w9FX` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:57、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:58 | — |
| `https://sched.co/w9Fy` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:53、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:54 | — |
| `https://sched.co/w9G1` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:60、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:61 | — |
| `https://sched.co/w9G4` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:45、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:46 | — |
| `https://sched.co/w9G7` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:52、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:53 | — |
| `https://sched.co/w9GA` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:63、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:64 | — |
| `https://sched.co/w9Gb` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:43、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:44 | — |
| `https://sched.co/w9GD` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:24、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:25 | — |
| `https://sched.co/w9Ge` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:55、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:56 | — |
| `https://sched.co/w9GG` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:46、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:47 | — |
| `https://sched.co/w9Gh` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:22、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:23 | — |
| `https://sched.co/w9GJ` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:20、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:21 | — |
| `https://sched.co/w9Gk` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:59、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:60 | — |
| `https://sched.co/w9GM` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:62、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:63 | — |
| `https://sched.co/w9Gn` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:56、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:57 | — |
| `https://sched.co/w9GP` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:26、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:27 | — |
| `https://sched.co/w9GS` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:47、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:48 | — |
| `https://sched.co/w9Gt` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:39、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:40 | — |
| `https://sched.co/w9GV` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:64、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:65 | — |
| `https://sched.co/w9GY` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:21、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:22 | — |
| `https://sourceforge.net/projects/tigervnc/files/stable/` | app/zh/blog/phoebe/2023-09-26-Run-openEuler-RISC-V-On-Qemu.md:279 | — |
| `https://stackoverflow.com/questions/14106477/how-do-non-temporal-instructions-work` | app/en/blog/wangshuo/Analysis of the VM Performance Deterioration When Running memcpy to Copy 1000 Bytes in the x86_64 Environment.md:181、app/zh/blog/wangshuo/Analysis of the VM Performance Deterioration When Running memcpy to Copy 1000 Bytes in the x86_64 Environment.md:181 | — |
| `https://stackoverflow.com/questions/46726216/kubelet-fails-to-get-cgroup-stats-for-docker-and-kubelet-services` | app/en/blog/haozi007/2020-09-09-isulad-benchmark.md:378、app/zh/blog/haozi007/2020-09-09-isulad-benchmark.md:431 | — |
| `https://summary.openeuler.org/` | app/.vitepress/src/components/AppYear.vue:15、app/zh/news/openEuler/20240112-yuebao/20240112-yuebao.md:48 | — |
| `https://tracker.ceph.com/issues/53062` | app/zh/blog/rosinL/2021-12-25-Ceph社区动态(2021-11-29~2021-12-12).md:19 | — |
| `https://tracker.ceph.com/issues/53926` | app/en/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:87、app/zh/blog/rosinL/2022-02-23-Ceph Community News (2021-01-17 to 2022-02-16).md:88 | — |
| `https://uefi.org/specifications` | app/en/blog/ras/edac-enhancement-for-control-ras-features.md:169 | — |
| `https://uefi.org/specs/ACPI/6.4/05_ACPI_Software_Programming_Model/ACPI_Software_Programming_Model.html#processor-properties-topology-table-pptt` | app/en/blog/2022-08-27/StratoVirt-vCPU.md:65、app/zh/blog/2022-08-27/StratoVirt-vCPU.md:65 | — |
| `https://uefi.org/specs/ACPI/6.5/05_ACPI_Software_Programming_Model.html#gicc-cpu-interface-flags` | app/zh/blog/20240628-aarch/20240628-aarch.md:73 | — |
| `https://www.canalys.com/newsroom/global-cloud-services-Q1-2022` | app/en/blog/20220705-01ziyuanliyonglv/openeuler-01ziyuanliyonglv.md:113 | — |
| `https://www.cnx-software.com/2023/10/21/sophgo-sg2380-16-core-sifive-p670-risc-v-processor-20-tops-ai-accelerator/` | app/en/news/20240628-openEuler 24.03 LTS- Pioneering Native RISC-V Support/index.md:58 | — |
| `https://www.huawei.com/` | app/zh/community/organization/index.md:48 | — |
| `https://www.huawei.com/cn/press-events/events/huaweiconnect2019` | app/zh/blog/openeuler/20191001.md:16、app/zh/blog/openeuler/2019huaweiconnect.md:19 | — |
| `https://www.huawei.com/cn/press-events/news/2019/9/atlas-series-products-cloud-services-all-scenario-ai-solutions` | app/zh/blog/openeuler/20191001.md:16 | — |
| `https://www.lexology.com/library/detail.aspx?g=24c6f397-64c0-4a88-832b-8936a75b59d6` | app/zh/blog/xing_zhu/20200214_some_problems_about_IP.md:56 | — |
| `https://www.linaro.org/blog/op-tee-open-source-security-mass-market/` | app/en/blog/luoyuzhe/TEE/OP-TEE_For_OpenEuler.md:69、app/zh/blog/luoyuzhe/TEE/OP-TEE_For_OpenEuler.md:71 | — |
| `https://www.linkedin.com/company/86315548` | app/en/news/202030721-Buzz/202030721-Buzz.md:237、app/zh/news/openEuler/2023-02-yuebao/20230227-yuebao.md:67 | — |
| `https://www.linkedin.com/company/86315548/` | app/zh/news/20230512-yuebao/20230512-yuebao.md:109 | — |
| `https://www.linkedin.com/company/86315548/admin/` | app/zh/news/20221125-10月月报-.md:108、app/zh/news/20221227-11月月报/月报.md:184、app/zh/news/20230213-yuebao/20230210-yuebao.md:65 | — |
| `https://www.linkedin.com/company/openeuler/posts/?feedView=all` | app/en/faq/index.md:72 | — |
| `https://www.linkedin.com/events/openeulerdeveloperday20257307929429014425600/` | app/en/news/20250228-report/openEuler Monthly Bulletin - January.md:35 | — |
| `https://www.linkedin.com/events/openeulertechdayep02-openeulerq7001482871555182592/comments/` | app/en/blog/openeuler-techday/openEuler TechDay Invitation.md:26 | — |
| `https://www.lustre.org/` | app/en/news/20240130/openEuler-Monthly-Bulletin-January.md:48、app/en/news/20241012-openEuler and Linaro Join Together for the openEuler Mini Summit During OSSummit EU 2024/index.md:22 | — |
| `https://www.mitre.org/` | app/en/blog/liujingang09/2020-6-24-announce-cna.md:44 | — |
| `https://www.phoronix.com/review/amd-znver4-gcc13-clang16/6` | app/zh/blog/openeuler/20240429-oerv/20240429-oerv.md:207 | — |
| `https://www.phoronix.com/review/clang-lto-kernel/4` | app/zh/blog/openeuler/20240429-oerv/20240429-oerv.md:211 | — |
| `https://www.raspberrypi.com/products/raspberry-pi-4-model-b/` | app/en/news/20240630/openEuler-Monthly-Bulletin–June.md:104 | — |
| `https://www.realvnc.com/en/connect/download/viewer/` | app/en/blog/phoebe/2023-09-26-Run-openEuler-RISC-V-On-Qemu.md:239、app/zh/blog/phoebe/2023-09-26-Run-openEuler-RISC-V-On-Qemu.md:279 | — |
| `https://www.reddit.com/r/openEuler/` | app/en/faq/index.md:74、app/en/news/202030721-Buzz/202030721-Buzz.md:244 | — |
| `https://www.reddit.com/user/openEuler` | app/zh/news/20221125-10月月报-.md:112、app/zh/news/20221227-11月月报/月报.md:187、app/zh/news/20230213-yuebao/20230210-yuebao.md:69、app/zh/news/20230512-yuebao/20230512-yuebao.md:113 | — |
| `https://www.rootusers.com/how-to-install-dnf-package-manager-in-centosrhel/` | app/en/blog/cascades/2021-8-14-Learning-About-libFuzzer.md:56、app/zh/blog/cascades/2021-8-14-Learning-About-libFuzzer.md:60 | — |
| `https://www.usenix.org/conference/fast25/presentation/liu-yubo` | app/zh/blog/20250619-TrIO/20250619-TrIO.md:56、app/zh/news/20250530-dyb/20250530-dyb.md:87、app/zh/news/20250704-yb/20250704-yb.md:83、app/zh/news/openEuler/20240429-ebpf/20240429-ebpf.md:64 | — |
| `https://www.usenix.org/conference/fast26/presentation/liu-yubo` | app/zh/news/20260422-openEuler eBPF/20260422-openEuler eBPF.md:43 | — |
| `https://www.zhihu.com/question/21682976/answer/79489643` | app/zh/blog/myeuler/2022-12-26-HowTosubmitPR.md:125 | — |
| `https://zhuanlan.zhihu.com/p/100546935` | app/en/blog/luoyuzhe/The_Communication_Of_Threads_In_openEuler/The_Communication_Of_Threads_In_openEuler.md:176、app/zh/blog/luoyuzhe/The_Communication_Of_Threads_In_openEuler/index.md:178 | — |
| `https://zhuanlan.zhihu.com/p/182553920` | README.md:63、README_EN.md:63 | — |
| `https://zhuanlan.zhihu.com/p/37230013` | app/en/blog/MrRlu/2020-12-04-cloud-native-network-dp-analysis.md:283、app/zh/blog/MrRlu/2020-12-04-cloud-native-network-dp-analysis.md:285 | — |
| `https://zhuanlan.zhihu.com/p/429214913` | README.md:32、README_EN.md:32 | — |
| `https://zhuanlan.zhihu.com/p/438277685` | app/en/blog/Nelson-He/2022-09-09-install.md:140、app/zh/blog/Nelson-He/2022-09-09-install.md:140 | — |
| `https://zhuanlan.zhihu.com/p/455263968` | app/en/blog/20220802-loop-interchange/20220802-loop-interchange.md:319、app/zh/blog/20220802-loop-interchange/20220802-loop-interchange.md:295 | — |
| `https://zhuanlan.zhihu.com/p/489828346` | app/en/blog/2022-10-12-HPC/HPC.md:15、app/zh/blog/2022-10-12-HPC/HPC.md:15 | — |
| `https://zhuanlan.zhihu.com/p/91071379` | app/zh/blog/xing_zhu/20200214_some_problems_about_IP.md:51 | — |

#### HTTP 404（279 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `http://dl-cdn.alpinelinux.org/alpine/latest-stable/releases/aarch64/alpine-minirootfs-3.12.0-aarch64.tar.gz` | app/en/blog/wangzhigang/howToUseStratoVirt.md:98、app/zh/blog/wangzhigang/howToUseStratoVirt.md:96、app/zh/blog/xinleguo/2020-11-02-如何安装并启动StratoVirt.md:94 | — |
| `http://dl-cdn.alpinelinux.org/alpine/latest-stable/releases/x86_64/alpine-minirootfs-3.12.0-x86_64.tar.gz` | app/zh/blog/xinleguo/2020-11-02-如何安装并启动StratoVirt.md:114 | — |
| `http://mirror.centos.org/centos/7/os/x86_64/Packages/iok-2.1.3-6.el7.x86_64.rpm` | app/en/blog/randy1568/Iok 2.1.3-porting-guide.md:39、app/zh/blog/randy1568/Iok 2.1.3-porting-guide.md:47 | — |
| `http://mirror.centos.org/centos/7/os/x86_64/Packages/python-tornado-4.2.1-5.el7.x86_64.rpm` | app/en/blog/randy1568/tornado 4-2-1-porting-guide.md:52、app/zh/blog/randy1568/tornado 4-2-1-porting-guide.md:53 | — |
| `http://repo.openeuler.org/openEuler-21.09/EPOL/main/x86_64/` | app/en/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:43、app/zh/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:42 | — |
| `http://repo.openeuler.org/openEuler-21.09/everything/x86_64/` | app/en/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:42、app/zh/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:41 | — |
| `http://repo.openeuler.org/openEuler-22.09/source/` | app/en/blog/zengchen1024/use-dnf-with-metalink.md:312、app/zh/blog/zengchen1024/use-dnf-with-metalink.md:313 | — |
| `http://repo.openeuler.org/openEuler-22.09/source/RPM-GPG-KEY-openEuler` | app/en/blog/zengchen1024/use-dnf-with-metalink.md:317、app/zh/blog/zengchen1024/use-dnf-with-metalink.md:318 | — |
| `http://rpmfind.net/linux/epel/7/x86_64/Packages/e/enca-1.19-1.el7.x86_64.rpm` | app/en/blog/randy1568/enca1-19-porting-guide.md:86、app/en/blog/randy1568/enca1-19-porting-guide.md:102、app/zh/blog/randy1568/enca1-19-porting-guide.md:91、app/zh/blog/randy1568/enca1-19-porting-guide.md:107 | — |
| `http://schemas.microsoft.com/office/2004/12/omml` | app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP2 技术白皮书.files/header.html:1、app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP3 技术白皮书.files/header.html:1、app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP4技术白皮书.files/header.html:1、app/.vitepress/public/whitepaper/html/openEuler 25.03 技术白皮书.files/header.html:1、app/.vitepress/public/whitepaper/html/openEuler 25.09 技术白皮书.files/header.html:1、app/.vitepress/public/whitepaper/html/openEuler 26.09 技术白皮书.html:5 | — |
| `http://wiki.creativecommons.org/Considerations_for_licensors_and_licensees#Considerations_for_licensees` | LICENSE.md:11 | — |
| `http://wiki.creativecommons.org/Considerations_for_licensors_and_licensees#Considerations_for_licensors` | LICENSE.md:9 | — |
| `https://artifacts.elastic.co/packages/7.x/yum` | app/en/blog/randy1568/pkgship 2-1-0-porting-guide.md:98、app/zh/blog/randy1568/pkgship 2-1-0-porting-guide.md:98 | — |
| `https://atomgit.com/openeuler/agentic` | app/zh/blog/20260805-Agent Infra/20260805-Agent Infra.md:17、app/zh/blog/20260805-Agent Infra/20260805-Agent Infra.md:131 | — |
| `https://atomgit.com/openeuler/docs-` | app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP3 技术白皮书.html:7799、app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP4技术白皮书.html:7051 | — |
| `https://atomgit.com/profile/emails` | app/zh/interaction/post-news/index.md:12 | — |
| `https://bugzilla.mozilla.org/show` | app/en/blog/20230113-RISC/RISC.md:45、app/zh/blog/20230113-RISC/RISC.md:61 | — |
| `https://bugzilla.mozilla.org/show\_bug.cgi?id=1800431` | app/en/blog/20230113-RISC/RISC.md:45 | — |
| `https://community.cncf.io/events/details/cncf-kcd-shanghai-presents-kcd-shanghai-2024/` | app/en/news/20240430/openEuler-Monthly-Bulletin–April.md:27 | — |
| `https://competition.atomgit.com/competitionInfo?id=1ea056d0418e11eeb9c0eb26c552c0c4` | app/en/news/20240230/openEuler-Monthly-Bulletin-February.md:32、app/zh/news/20230915-30w/20230915-30w.md:126、app/zh/news/20230928-xiaoyuanxing/20230928-xiaoyuanxing.md:87、app/zh/news/openEuler/20231110-yuebao/20231110-yuebao.md:372 | — |
| `https://competition.atomgit.com/competitionInfo?id=b8a66d5b43a96643b7a7a043585608fb` | app/zh/news/openEuler/20241204-20/20241204-20.md:98 | — |
| `https://competition.atomgit.com/competitionInfo?id=fae5e8d86a01fb6dfdd153a0e5e5e314` | app/zh/news/openEuler/20240306-yuebao/20240306-yuebao.md:70 | — |
| `https://confidentialcomputing.io/wp-content/uploads/sites/85/2022/01/CCC-A-Technical-Analysis-of-Confidential-Computing-v1.2.pdf` | app/en/blog/20230113-segear/secGear.md:167、app/zh/blog/20230113-segear/secGear.md:225 | — |
| `https://cutt.ly/JzcSBfB` | app/en/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:374、app/zh/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:288、app/zh/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:374 | — |
| `https://cutt.ly/NzcDUEd` | app/en/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:373、app/zh/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:287、app/zh/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:373 | — |
| `https://cutt.ly/QzcSy5G` | app/en/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:376、app/zh/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:290、app/zh/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:376 | — |
| `https://cutt.ly/TzcSjUX` | app/en/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:375、app/zh/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:289、app/zh/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:375 | — |
| `https://developer.aliyun.com/article/630682` | app/zh/blog/haozi007/2020-09-09-isulad-benchmark.md:432 | — |
| `https://docs.openeuler.org/en/docs/20.03_LTS_SP1/docs/Installation/Installation.html.(https://bbs.huaweicloud.com/forum/thread-116157-1-1.html#` | app/en/blog/randy1568/flask 1-1-2-porting-guide.md:43 | — |
| `https://docs.openeuler.org/en/docs/21.09/docs/Installation/installation.html` | app/.vitepress/src-new/data/download/download.ts:912 | — |
| `https://docs.openeuler.org/en/docs/22.03_LTS_SP3/docs/Installation/installation.html` | app/.vitepress/src-new/data/download/download.ts:711 | — |
| `https://docs.openeuler.org/en/docs/22.03_LTS_SP4/docs/Installation/Installation.html` | app/.vitepress/src-new/data/download/download.ts:673 | — |
| `https://docs.openeuler.org/en/docs/22.03_LTS/docs/Installation/installation.html` | app/.vitepress/src-new/data/download/download.ts:854 | — |
| `https://docs.openeuler.org/en/docs/22.09/docs/Installation/installation.html` | app/.vitepress/src-new/data/download/download.ts:830 | — |
| `https://docs.openeuler.org/zh/docs/20.03_LTS_SP1/docs/thirdparty_migration/x2openEuleruseguide.html` | app/zh/blog/20220628-x86/20220628.md:55、app/zh/blog/20220701-centos/20220701.md:79、app/zh/blog/20220726-banqian-mysql/banqian-mysql.md:245 | — |
| `https://docs.openeuler.org/zh/docs/22.03` | app/zh/news/openEuler/20240207-yuebao/20230207-yuebao.md:143 | — |
| `https://docs.openeuler.org/zh/docs/22.03_LTS/docs/Embedded/SDK` | app/zh/blog/2022-10-12Embedded SIG/Embedded SIG.md:79 | — |
| `https://docs.openeuler.org/zh/docs/23.09/docs/Container/kuasar.html` | app/en/blog/20231027-23.09/20231027-23.09.md:278 | — |
| `https://docs.openeuler.org/zh/docs/23.09/docs/Releasenotes/release` | app/zh/news/openEuler/20231110-yuebao/20231110-yuebao.md:234 | — |
| `https://docs.openeuler.org/zh/docs/24.03` | app/zh/news/openEuler/20240617-faq/20240617-faq.md:65、app/zh/news/openEuler/20240617-faq/20240617-faq.md:68、app/zh/news/openEuler/20240705-yuebao/20240705-yuebao.md:436 | — |
| `https://docs.openeuler.org/zh/docs/common/contribute/directory` | app/zh/news/20250530-dyb/20250530-dyb.md:246、app/zh/news/openEuler/20250410-odd4/20250410-odd4.md:78 | — |
| `https://docs.pagure.org/copr.copr/user_documentation.html#public-copr-instances` | app/zh/news/20230811-Fedora/20230811-Fedora.md:34 | — |
| `https://dora.dev/research/2025/dora` | app/zh/blog/20260805-Agent Infra/20260805-Agent Infra.md:155 | — |
| `https://easystack.io/product/29.html` | app/en/news/20240422-openEuler Shines Alongside Partners at FOSSASIA Summit 2024/index.md:48 | — |
| `https://en.wikipedia.org/wiki/Row-` | app/en/blog/20220802-loop-interchange/20220802-loop-interchange.md:333、app/zh/blog/20220802-loop-interchange/20220802-loop-interchange.md:309 | — |
| `https://eur.openeuler.openatom.cn/coprs/mywaaagh_admin/fish/repo/openeuler-20.03_LTS_SP3/mywaaagh_admin-fish-openeuler-20.03_LTS_SP3.repo` | app/en/blog/20230519-EUR/20230519-EUR.md:69、app/zh/blog/20230519-EUR/20230519-EUR.md:71 | — |
| `https://eur.openeuler.openatom.cn/coprs/mywaaagh_admin/fish/repo/openeuler-22.03_LTS_SP1/mywaaagh_admin-fish-openeuler-22.03_LTS_SP1.repo` | app/en/blog/20230519-EUR/20230519-EUR.md:71、app/zh/blog/20230519-EUR/20230519-EUR.md:73 | — |
| `https://example.com/en/` | tests/home-banner-ai-coding-assistants.test.ts:138 | — |
| `https://example.com/repos` | app/.vitepress/src-new/components/markdown/README.md:407 | — |
| `https://example.com/sitemap.xml` | .claude/skills/sitemap-meta-tags-batch-generator/SKILL.md:19、.claude/skills/sitemap-meta-tags-batch-generator/SKILL.md:304、.claude/skills/sitemap-meta-tags-batch-generator/scripts/generate-prompts.js:30、.claude/skills/sitemap-schema-batch-generator/SKILL.md:19、.claude/skills/sitemap-schema-batch-generator/SKILL.md:299、.claude/skills/sitemap-schema-batch-generator/scripts/generate-prompts.js:30 | — |
| `https://example.com/whitepaper` | app/.vitepress/src-new/components/markdown/README.md:124、app/.vitepress/src-new/components/markdown/README.md:401 | — |
| `https://example.com/zh/` | tests/home-banner-ai-coding-assistants.test.ts:137 | — |
| `https://example.com/zh/page1,https://example.com/en/page2` | AGENTS.md:166、docs/geo-implementation-summary.md:263 | — |
| `https://example.com/zh/sig/Kernel` | docs/geo-implementation-summary.md:285 | — |
| `https://example.com/zh/sig/Kernel,https://example.com/en/download` | AGENTS.md:169、docs/geo-implementation-summary.md:266 | — |
| `https://forum.openeuler.org/tag/sig-infratructure` | app/zh/news/20250630-dyb/20250630-dyb.md:139 | — |
| `https://ftp.agdsn.de/openeuler/` | app/zh/news/openEuler/2023-02-yuebao/20230227-yuebao.md:247 | — |
| `https://ftp.cc.uoc.gr/mirrors/linux/openeuler/` | app/zh/news/20230512-yuebao/20230512-yuebao.md:357 | — |
| `https://ftp.halifax.rwth-aachen.de/openeuler/` | app/en/news/20240130/openEuler-Monthly-Bulletin-January.md:66、app/zh/news/openEuler/20240207-yuebao/20230207-yuebao.md:208 | — |
| `https://gitee.com/dogsheng/perl-Text-ParseWords` | app/zh/blog/luoyuzhe/000openEuler-community-development-process/index.md:72 | — |
| `https://gitee.com/openeuler/broken_dream` | app/zh/blog/myeuler/2020-5-13-openEuler-Travel.md:458 | — |
| `https://gitee.com/openeuler/ceph` | app/zh/news/20221227-11月月报/月报.md:345、app/zh/news/20221227-11月月报/月报.md:348、app/zh/news/20221227-11月月报/月报.md:351 | — |
| `https://gitee.com/openeuler/chatig/blob/master/README.en.md` | app/en/news/20241230/openEuler Monthly Bulletin -  December.md:123 | — |
| `https://gitee.com/openeuler/community/blob/master/repository/openeuler.yaml` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:127 | — |
| `https://gitee.com/openeuler/community/blob/master/repository/src-openeuler.yaml` | app/zh/blog/myeuler/2020-5-13-openEuler-Travel.md:346、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:129 | — |
| `https://gitee.com/openeuler/community/blob/master/sig/sigs.yaml` | app/zh/blog/myeuler/2020-5-13-openEuler-Travel.md:344、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:125 | — |
| `https://gitee.com/openeuler/community/blob/master/zh/contributors/create-obs-package.md` | app/zh/blog/myeuler/2020-5-13-openEuler-Travel.md:384 | — |
| `https://gitee.com/openeuler/community/tree/master/sig/sig-RaspberryPi` | app/zh/blog/genedna/summer-2020-openeuler-tasks.md:104 | — |
| `https://gitee.com/openeuler/community/tree/master/sig/sigconfidential-computing` | app/zh/news/20221227-11月月报/月报.md:416 | — |
| `https://gitee.com/openeuler/docs-` | app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP2 技术白皮书.html:4887、app/.vitepress/public/whitepaper/html/openEuler 25.09 技术白皮书.html:5139 | — |
| `https://gitee.com/openeuler/docs/blob/stable2-20.03_LTS_SP1/docs/en/docs/thirdparty_migration/x2openEuleruseguide.md` | app/en/blog/randy1568/Iok 2.1.3-porting-guide.md:48 | — |
| `https://gitee.com/openeuler/docs/blob/stable2-20.03_LTS_SP1/docs/zh/docs/thirdparty_migration/x2openEuleruseguide.md` | app/en/blog/randy1568/Tengine 2.2.2-porting-guide.md:100 | — |
| `https://gitee.com/openeuler/docs/tree/master/docs/zh/docs/GMEM` | app/zh/news/openEuler/20231009-yuebao/20231009-yuebao.md:309 | — |
| `https://gitee.com/openeuler/docs/tree/master/docs/zh/docs/ShangMi` | app/zh/news/20221125-10月月报-.md:303 | — |
| `https://gitee.com/openeuler/euler-copilot-framework/blob/master/docs/zh/openEuler_intelligence/intelligent_assistant/quick_start/smart_web/deploy_guide/offline.md` | app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP2 技术白皮书.html:5082 | — |
| `https://gitee.com/openeuler/infrastructure/tree/master/ci/tools/patch2pr/repositories_branches_map.yaml` | app/en/blog/wanghaosq/patch2pr_guide.md:35、app/zh/blog/wanghaosq/patch2pr_guide.md:34 | — |
| `https://gitee.com/openeuler/iSulad/blob/master/docs/build_guide.md` | app/zh/blog/haozi007/2020-09-09-isulad-benchmark.md:68、app/zh/blog/haozi007/2020-09-09-isulad-benchmark.md:435 | — |
| `https://gitee.com/openeuler/llm` | app/zh/news/openEuler/20240421-jd/20240421-jd.md:138 | — |
| `https://gitee.com/openeuler/NestOS/blob/master/docs/use_sample/ignition/` | app/.vitepress/src-new/i18n/nestos/nestos-en.ts:82、app/.vitepress/src-new/i18n/nestos/nestos-zh.ts:82 | — |
| `https://gitee.com/openeuler/NestOSHAOC3` | app/zh/news/openEuler/20250423-odd1/20250423-odd1.md:27 | — |
| `https://gitee.com/openeuler/oepkgs-management` | app/zh/blog/liping/2022-11-10-oepkgs-introduction.md:84 | — |
| `https://gitee.com/openeuler/raspberrypi/blob/master/documents/changelog/changelog-20.09-release.md` | app/zh/blog/woqidaideshi/2020-05-25-raspberrypi-userguide.md:44 | — |
| `https://gitee.com/openeuler/rust` | app/zh/news/openEuler/0819-yb/0819-yb.md:403 | — |
| `https://gitee.com/openeuler/secGear.gitcd` | app/zh/blog/20250409-secGear/20250409-secGear.md:133 | — |
| `https://gitee.com/openeuler/security-committee/blob/master/docs/` | app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP2 技术白皮书.html:6560 | — |
| `https://gitee.com/openeuler/security-committee/blob/master/security-disclosure.md` | app/.vitepress/public/whitepaper/html/openEuler 25.03 技术白皮书.html:6192 | — |
| `https://gitee.com/openeuler/security-committee/blob/master/security-evaluation.md` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:182 | — |
| `https://gitee.com/openeuler/security-committee/blob/master/security-process.md` | app/.vitepress/public/whitepaper/html/openEuler 25.03 技术白皮书.html:6180、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:182、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:184 | — |
| `https://gitee.com/openeuler/sysHAX/blob/dev/docs/sysHAX_online_deployment_guide.md` | app/.vitepress/public/whitepaper/html/openEuler 24.03 LTS SP2 技术白皮书.html:4761、app/.vitepress/public/whitepaper/html/openEuler 25.09 技术白皮书.html:5013 | — |
| `https://gitee.com/openeuler/sysSentry/blob/master/sysSentry-1.0.2/README` | app/zh/news/openEuler/20240705-yuebao/20240705-yuebao.md:336 | — |
| `https://gitee.com/openeuler/TC/tree/master/oEEP/oEEP-0003` | app/zh/news/20230602-yuebao/20230602-yuebao.md:222 | — |
| `https://gitee.com/openeuler/tp-libvirt/tree/openEuler-20.03/libvirt/tests/cfg/virt_cmd/vmtop.cfg` | app/en/blog/zhuhuankai1/2021-01-30-virttest-avocado-vt-testcases.md:252、app/zh/blog/zhuhuankai1/2021-01-30-virttest-avocado-vt-testcases.md:253 | — |
| `https://gitee.com/openeuler/tp-libvirt/tree/openEuler-20.03/libvirt/tests/src/virt_cmd/vmtop.py` | app/en/blog/zhuhuankai1/2021-01-30-virttest-avocado-vt-testcases.md:251、app/zh/blog/zhuhuankai1/2021-01-30-virttest-avocado-vt-testcases.md:251 | — |
| `https://gitee.com/openeuler/UniProton/blob/master/doc/demoUsageGuide/riscv64` | app/zh/news/openEuler/20240306-riscv/20240306-riscv.md:75 | — |
| `https://gitee.com/openkylin/ioprocess.git` | app/zh/blog/fuchangjie/2020-03-26-OBS-with-Git.md:187、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:839 | — |
| `https://gitee.com/samuel_yuan/riscv-openeuler-visionfive&gt` | app/en/blog/RISC-V/index.md:58 | — |
| `https://gitee.com/src-openeuler/kernel/blob/openEuler-25.03/0005-haoc-kernel.patchopenEuler` | app/zh/news/openEuler/20250423-odd1/20250423-odd1.md:29 | — |
| `https://gitee.com/xxxx/xxxxx` | app/zh/news/2020hdc.md:126 | — |
| `https://gitee.com/zhenrong-wang/hpc-now/tree/master/Docs` | app/en/blog/20231020-HPC/20231020-HPC.md:110、app/zh/blog/20231020-HPC/20231020-HPC.md:118 | — |
| `https://github.com/apache/httpd/blob/trunk/.travis.yml` | app/zh/blog/xiyuanwang/2020-04-14-Web-ARM64-Support.md:115 | — |
| `https://github.com/apache/tomcat/blob/master/.travis.yml` | app/zh/blog/xiyuanwang/2020-04-14-Web-ARM64-Support.md:113 | — |
| `https://github.com/guidovranken/libfuzzer-gv` | app/en/blog/cascades/2021-8-14-Learning-About-libFuzzer.md:232、app/zh/blog/cascades/2021-8-14-Learning-About-libFuzzer.md:234 | — |
| `https://github.com/kvcache-ai/ktransformers.githttps://github.com/SJTU-IPADS/PowerInfer.git` | app/zh/news/openEuler/20250308-ddepin3/20250308-ddepin3.md:110 | — |
| `https://github.com/LMCache-Ascend/LMCache-Ascend` | app/zh/blog/20260528-Agentic Scaling Infra/20260528-Agentic Scaling Infra.md:123 | — |
| `https://github.com/memcached/memcached/blob/master/.travis.yml` | app/zh/blog/xiyuanwang/2020-04-14-Web-ARM64-Support.md:114 | — |
| `https://github.com/OpenChain-Project/Reference-Material/blob/master/Case-Studies/openEuler-Case-Study-ISO-18974-Conformance.pdf` | app/en/news/20240530/openEuler-Monthly-Bulletin–May.md:58 | — |
| `https://github.com/opensourceways/sbom-service` | app/zh/blog/robell/openEuler_SBOM_Practice.md:511 | — |
| `https://github.com/opensourceways/sbom-tools` | app/zh/blog/robell/openEuler_SBOM_Practice.md:510 | — |
| `https://github.com/opensourceways/sbom-website` | app/zh/blog/robell/openEuler_SBOM_Practice.md:511 | — |
| `https://github.com/opensourceways/uvp` | app/zh/blog/robell/openEuler_SBOM_Practice.md:513 | — |
| `https://github.com/pytorch/r` | app/zh/news/20230915-30w/20230915-30w.md:50 | — |
| `https://github.com/rv2036/rv2036-website/blob/main/README.en.md` | app/en/news/20240630/openEuler-Monthly-Bulletin–June.md:58 | — |
| `https://github.com/varnishcache/varnish-cache/blob/master/.travis.yml` | app/zh/blog/xiyuanwang/2020-04-14-Web-ARM64-Support.md:122 | — |
| `https://gitlab.com/qemu-project/qemu.git;cd` | app/en/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:403、app/zh/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:420 | — |
| `https://images.oerv.ac.cn/home` | app/zh/news/openEuler/20250423-yb/20250423-yb.md:108 | — |
| `https://isrc.iscas.ac.cn/summer2020` | app/zh/blog/genedna/summer-2020-openeuler-tasks.md:14、app/zh/blog/genedna/summer-2020-openeuler-tasks.md:16、app/zh/news/20200607.md:74 | — |
| `https://linkerd.io/2017/04/25/whats-a-service-mesh-and-why-do-i-need-one` | app/en/blog/202030721-Kmesh/202030721-Kmesh.md:133、app/zh/blog/202030721-Kmesh/202030721-Kmesh.md:187 | — |
| `https://live.bilibili.com/527064077` | app/zh/news/20200607.md:74 | — |
| `https://maas.io/docs/how-to-install-maas#heading--fresh-install-3-1-packages` | app/en/blog/2022-08-23/use-canonical-maas-deploy-openeuler-test.md:305、app/zh/blog/2022-08-23/use-canonical-maas-deploy-openeuler-test.md:305 | — |
| `https://maas.io/docs/how-to-manage-vm-hosts` | app/en/blog/2022-08-23/use-canonical-maas-deploy-openeuler-test.md:307、app/zh/blog/2022-08-23/use-canonical-maas-deploy-openeuler-test.md:307 | — |
| `https://mailweb.openeuler.org/hyperkitty/list/` | app/.vitepress/src/views/mailing/TheMailingList.vue:171 | — |
| `https://metr.org/blog/2025` | app/zh/blog/20260805-Agent Infra/20260805-Agent Infra.md:163 | — |
| `https://mirror.nevacloud.com/openeuler/` | app/zh/news/openEuler/20231009-yuebao/20231009-yuebao.md:417 | — |
| `https://mirror.siwoo.org//openeuler/` | app/zh/news/openEuler/20231009-yuebao/20231009-yuebao.md:415 | — |
| `https://mirror.zetup.net/openeuler/` | app/zh/news/20230512-yuebao/20230512-yuebao.md:360 | — |
| `https://mirrors.dotsrc.org/openeuler/` | app/zh/news/openEuler/2023-02-yuebao/20230227-yuebao.md:251 | — |
| `https://mirrors.huaweicloud.com/fedora/releases/30/Everything/aarch64/os/` | app/en/blog/randy1568/pkgship 2-1-0-porting-guide.md:92、app/zh/blog/randy1568/pkgship 2-1-0-porting-guide.md:92 | — |
| `https://muug.ca/mirror/openeuler/` | app/zh/news/20230602-yuebao/20230602-yuebao.md:361 | — |
| `https://openeuler.gitee.io/yocto-meta-openeuler/master/features/muslc.html` | app/en/blog/20230529-Musl/20230529-Musl.md:18、app/zh/blog/20230529-Musl/20230529-Musl.md:21、app/zh/news/20230602-yuebao/20230602-yuebao.md:210 | — |
| `https://openeuler.gitee.io/yocto-meta-openeuler/master/features/ros.html` | app/zh/news/20230512-yuebao/20230512-yuebao.md:303 | — |
| `https://opengemini.org/contact-us` | app/zh/news/20230320-DB/20230320-DB.md:154 | — |
| `https://pages.openeuler.openatom.cn/embedded/docs/build/html/master/features/embodied_ai/introduction/ib-robot_overview.html` | app/zh/blog/20260421-claw/20260421-claw.md:230、app/zh/blog/20260429-Action-Dispatcher/20260429-Action-Dispatcher.md:154、app/zh/blog/20260612-multi_model_scheduling/multi_model_scheduling.md:184 | — |
| `https://pan.baidu.com/share/init?surl=bu2LjLHxbDK2XQbz1Lv0yQ&pwd=1031` | app/zh/news/20231103-gz.md:50 | — |
| `https://qemu.readthedocs.io/en/latest/devel/fuzzing.html` | app/en/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:63、app/en/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:207、app/zh/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:66、app/zh/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:216 | — |
| `https://qemu.readthedocs.io/en/latest/devel/fuzzing.html#generating-coverage-reports` | app/en/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:120、app/zh/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:123 | — |
| `https://qemu.readthedocs.io/en/latest/devel/qtest.html` | app/en/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:159、app/zh/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:167 | — |
| `https://qemu.readthedocs.io/en/latest/devel/qtest.html?highlight=libqos` | app/en/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:198、app/zh/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:206 | — |
| `https://raw.githubusercontent.com/cnrancher/eulerpacker/refs/heads/main/scripts/others/install-docker.sh` | app/zh/news/20250929-opea-openeuler/20250929-opea-openeuler.md:56 | — |
| `https://repo.oepkgs.net/openEuler/rpm/openEuler-20.03-LTS-SP1/stable/contrib/x2openEuler/noarch/Packages/` | app/en/blog/20220628-x86/20220628.md:51、app/en/blog/20220701-centos/20220701.md:58、app/en/blog/20220726-banqian-mysql/banqian-mysql.md:55、app/en/blog/randy1568/x86-Hardware-Compatibility-Assessment-and-Porting-Guide.md:43、app/zh/blog/20220726-banqian-mysql/banqian-mysql.md:52、app/zh/blog/randy1568/x86-Hardware-Compatibility-Assessment-and-Porting-Guide.md:39 | — |
| `https://repo.oepkgs.net/openEuler/rpm/openEuler-20.03-LTS-SP1/stable/contrib/x2openEuler/noarch/Packages/x2openEuler-1.0-1.noarch.rpm` | app/en/blog/randy1568/Iok 2.1.3-porting-guide.md:45、app/en/blog/randy1568/MySQL 5-7-21-migrate-guide.md:78、app/en/blog/randy1568/Tengine 2.2.2-porting-guide.md:97、app/en/blog/randy1568/x86-Hardware-Compatibility-Assessment-and-Porting-Guide.md:49 | — |
| `https://repo.openeuler.org/24.03` | app/.vitepress/src-new/data/download/download.ts:28、app/.vitepress/src-new/data/download/download.ts:61、app/.vitepress/src-new/data/download/download.ts:96、app/.vitepress/src-new/data/download/download.ts:131、app/.vitepress/src-new/data/download/download.ts:528、app/.vitepress/src-new/data/download/download.ts:561、app/.vitepress/src-new/data/download/download.ts:596、app/.vitepress/src-new/data/download/download.ts:632 | — |
| `https://repo.openeuler.org/24.09/` | app/.vitepress/src-new/data/download/download.ts:148、app/.vitepress/src-new/data/download/download.ts:650 | — |
| `https://repo.openeuler.org/25.03/` | app/.vitepress/src-new/data/download/download.ts:113、app/.vitepress/src-new/data/download/download.ts:613 | — |
| `https://repo.openeuler.org/25.09/` | app/.vitepress/src-new/data/download/download.ts:78、app/.vitepress/src-new/data/download/download.ts:578 | — |
| `https://repo.openeuler.org/26.09/` | app/.vitepress/src-new/data/download/download.ts:10、app/.vitepress/src-new/data/download/download.ts:510 | — |
| `https://repo.openeuler.org/openEuler-20.09/ISO/` | app/zh/news/20200930.md:18 | — |
| `https://repo.openeuler.org/openEuler-20.09/ISO/aarch64/openEuler-20.09-aarch64-dvd.iso` | app/en/blog/small_leek/2020-10-26-Installation-manual-for-Virt-Install.md:21、app/zh/blog/small_leek/2020-10-26-Installation-manual-for-Virt-Install.md:20 | — |
| `https://repo.openeuler.org/openEuler-20.09/ISO/x86_64/openEuler-20.09-x86_64-dvd.iso` | app/en/blog/small_leek/2020-10-26-Installation-manual-for-Virt-Install.md:170、app/zh/blog/small_leek/2020-10-26-Installation-manual-for-Virt-Install.md:133 | — |
| `https://repo.openeuler.org/openEuler-20.09/raspi_img/aarch64/` | app/zh/news/20200930.md:20 | — |
| `https://repo.openeuler.org/openEuler-20.09/raspi_img/aarch64/openEuler-20.09-raspi-aarch64.img.xz` | app/zh/blog/woqidaideshi/2020-05-25-raspberrypi-userguide.md:40 | — |
| `https://repo.openeuler.org/openEuler-21.03/everything/x86_64/Packages/` | app/en/blog/Benshuai5D/2021-06-10-build-bishengJDK-rpm-package.md:161、app/zh/blog/Benshuai5D/2021-06-10-build-bishengJDK-rpm-package.md:159 | — |
| `https://repo.openeuler.org/openEuler-21.03/ISO/` | app/zh/news/20210330.md:18 | — |
| `https://repo.openeuler.org/openEuler-21.03/OS/aarch64/` | app/en/blog/yushi-Icy/2023-08-20-introduce-to-rpm.md:181、app/zh/blog/yushi-Icy/2023-08-20-introduce-to-rpm.md:171 | — |
| `https://repo.openeuler.org/openEuler-21.03/raspi_img/` | app/zh/news/20210330.md:20 | — |
| `https://repo.openeuler.org/openEuler-21.09/ISO/x86_64/openEuler-21.09-x86_64-dvd.iso` | app/en/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:20、app/zh/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:21 | — |
| `https://repo.openeuler.org/openEuler-21.09/ISO/x86_64/openEuler-21.09-x86_64-dvd.iso.sha256sum` | app/en/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:19、app/zh/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:20 | — |
| `https://repo.openeuler.org/openEuler-21.09/source/Packages/qemu-4.1.0-82.oe1.src.rpm` | app/en/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:101、app/zh/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:99 | — |
| `https://repo.openeuler.org/openEuler-22.09/edge_img/` | app/.vitepress/src-new/data/download/download.ts:333、app/.vitepress/src-new/data/download/download.ts:839 | — |
| `https://repo.openeuler.org/openEuler-22.09/embedded_img/` | app/.vitepress/src-new/data/download/download.ts:335、app/.vitepress/src-new/data/download/download.ts:841 | — |
| `https://repo.openeuler.org/openEuler-22.09/ISO/` | app/.vitepress/src-new/data/download/download.ts:327、app/.vitepress/src-new/data/download/download.ts:835 | — |
| `https://repo.openeuler.org/openEuler-22.09/virtual_machine_img/` | app/.vitepress/src-new/data/download/download.ts:332、app/.vitepress/src-new/data/download/download.ts:838 | — |
| `https://repo.openeuler.org/openEuler-preview/RISC-V/everything/` | app/en/blog/yang_yanchao/2021-3-12-start-a-containerd-on-riscv.md:84、app/zh/blog/yang_yanchao/2021-3-12-start-a-containerd-on-riscv.md:90 | — |
| `https://repo.openeuler.org/openEuler-preview/RISC-V/Image/` | app/en/blog/yang_yanchao/2021-3-12-start-a-containerd-on-riscv.md:36、app/zh/blog/yang_yanchao/2021-3-12-start-a-containerd-on-riscv.md:42 | — |
| `https://reviews.llvm.org/D1149167` | app/en/blog/20220802-loop-interchange/20220802-loop-interchange.md:213、app/zh/blog/20220802-loop-interchange/20220802-loop-interchange.md:209 | — |
| `https://riscv.org/event/risc-v-summit-europe-2024/` | app/en/news/20240630/openEuler-Monthly-Bulletin–June.md:33 | — |
| `https://static.sched.com/hosted` | app/zh/blog/20241211-isulad/20241211-isulad.md:214 | — |
| `https://summercoding-curve.app.codewave.163.com/apply` | app/zh/news/202030721-Curve/202030721-Curve.md:78、app/zh/news/202030721-Curve/202030721-Curve.md:183、app/zh/news/20230811-yuebao/20230811-yuebao.md:119 | — |
| `https://support.huaweicloud.com/intl/en-us/prtg-dubbo-kunpengwebs/kunpengdubbo268_02_0002.html` | app/en/blog/randy1568/Dubbo 2-6-8-porting-guide.md:33、app/en/blog/randy1568/Dubbo 2-6-8-porting-guide.md:46、app/en/blog/randy1568/Dubbo 2-7-5-porting-guide.md:33、app/en/blog/randy1568/Dubbo 2-7-5-porting-guide.md:46 | — |
| `https://support.huaweicloud.com/intl/en-us/prtg-kunpengwebs/kunpengmemcached_02_0006.html#kunpengmemcached_02_0006__table15821759181818` | app/en/blog/randy1568/Memcached 1-5-12-porting-guide.md:206 | — |
| `https://support.huaweicloud.com/intl/en-us/prtg-kunpengwebs/kunpengmemcached_02_0006.html#kunpengmemcached_02_0006__table1896316817714` | app/en/blog/randy1568/Memcached 1-5-12-porting-guide.md:183 | — |
| `https://support.huaweicloud.com/prtg-dubbo-kunpengwebs/kunpengdubbo268_02_0002.html#kunpengdubbo268_02_0002__d0e141` | app/zh/blog/randy1568/Dubbo 2-6-8-porting-guide.md:41、app/zh/blog/randy1568/Dubbo 2-7-5-porting-guide.md:41 | — |
| `https://support.huaweicloud.com/prtg-dubbo-kunpengwebs/kunpengdubbo268_02_0002.html#kunpengdubbo268_02_0002__d0e90` | app/zh/blog/randy1568/Dubbo 2-6-8-porting-guide.md:36、app/zh/blog/randy1568/Dubbo 2-7-5-porting-guide.md:36 | — |
| `https://support.huaweicloud.com/prtg-kunpenghpcs/openmind_kunpengqe_02_0001.html` | app/zh/blog/2022-10-12-HPC/HPC.md:46 | — |
| `https://support.huaweicloud.com/prtg-kunpengwebs/kunpenghaproxy_02_0011.html#kunpenghaproxy_02_0011__table177828478439` | app/en/blog/randy1568/HAProxy 1-9-0-porting-guide.md:127、app/zh/blog/randy1568/HAProxy 1-9-0-porting-guide.md:131 | — |
| `https://support.huaweicloud.com/prtg-kunpengwebs/kunpengmemcached_02_0006.html#kunpengmemcached_02_0006__table15821759181818` | app/zh/blog/randy1568/Memcached 1-5-12-porting-guide.md:201 | — |
| `https://support.huaweicloud.com/prtg-kunpengwebs/kunpengmemcached_02_0006.html#kunpengmemcached_02_0006__table1896316817714` | app/zh/blog/randy1568/Memcached 1-5-12-porting-guide.md:180 | — |
| `https://tboox.org/cn/2016/08/12/bits-operation/` | app/en/blog/zihao/TBOX Installation and Operation on openEuler.md:207 | — |
| `https://virt-manager.org/download/` | app/en/blog/phoebe/2023-09-26-Run-openEuler-RISC-V-On-Qemu.md:253 | — |
| `https://vllm-ascend.readthedocs.io/en/latest/tutorials` | app/zh/blog/20250916-openeuler-vllm-qwen3-next/20250916-openeuler-vllm-qwen3-next.md:137 | — |
| `https://www.gitclear.com/ai` | app/zh/blog/20260805-Agent Infra/20260805-Agent Infra.md:147 | — |
| `https://www.hikunpeng.com/developer/contests/kunpeng-competition2022?tab=2` | app/en/news/20220801-openueuler08.md:184、app/zh/news/20220801-openueuler08.md:216 | — |
| `https://www.hikunpeng.com/en/developer/devkit/compiler/bisheng` | app/en/blog/RabeLi/Autodockvina/AutoDockvina-1.2.3-migrate.md:41、app/en/blog/RabeLi/Autodockvina/AutoDockvina-1.2.3-migrate.md:125、app/en/blog/RabeLi/SeqKit2.2.0/SeqKit-2.2.0-migrate.md:43、app/en/blog/RabeLi/SeqKit2.2.0/SeqKit-2.2.0-migrate.md:128 | — |
| `https://www.hikunpeng.com/learn/micro-certification/detailad537279d82b4d38bcd96afbdb2181d3` | app/zh/news/20230407-bh/20230407-bh.md:63 | — |
| `https://www.huaweicloud.com/HDC.Cloud.html` | app/zh/news/2020010401.md:14 | — |
| `https://www.kernel.org/doc/html/latest/filesystems/fuse.html` | app/zh/blog/genedna/summer-2020-openeuler-tasks.md:149 | — |
| `https://www.lighttpd.net/download/` | app/zh/blog/xiyuanwang/2020-04-14-Web-ARM64-Support.md:117 | — |
| `https://www.mindspore.cn/federated/docs/zh-CN/master/secure` | app/en/blog/20230113-segear/secGear.md:176、app/zh/blog/20230113-segear/secGear.md:234 | — |
| `https://www.mindspore.cn/federated/docs/zh-CN/master/secure\_vertical\_federated\_learning\_with\_TEE.html` | app/en/blog/20230113-segear/secGear.md:176 | — |
| `https://www.mindspore.cn/federated/docs/zhCN/master/secure` | app/zh/news/20221227-11月月报/月报.md:424 | — |
| `https://www.modelscope.cn/models/unsloth/DeepSeek-R1-Distill-Llama-8B-GGUF/resolve/master/DeepSeek-R1-Distill-Llama-8B-Q4` | app/zh/blog/02-oeDeploy/DeepSeek1.md:95 | — |
| `https://www.modelscope.cn/models/unsloth/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/master/DeepSeek-R1-Distill-Qwen-1.5B-Q4` | app/zh/blog/02-oeDeploy/DeepSeek1.md:93 | — |
| `https://www.modelscope.cn/models/unsloth/DeepSeek-R1-Distill-Qwen-7B-GGUF/resolve/master/DeepSeek-R1-Distill-Qwen-7B-Q4` | app/zh/blog/02-oeDeploy/DeepSeek1.md:94 | — |
| `https://www.openatom.org/law/translate` | app/en/news/20241130/openEuler Monthly Bulletin - November.md:49 | — |
| `https://www.openatom.org/project/projectPjVzJsmXW3kG` | app/en/blog/20231020-HPC/20231020-HPC.md:98、app/zh/blog/20231020-HPC/20231020-HPC.md:106 | — |
| `https://www.openeuler.org/doc/events/2020hdc/iSula容器用户指南.docx` | app/zh/news/2020hdc.md:88、app/zh/news/2020hdc.md:174 | — |
| `https://www.openeuler.org/en/blog/zhangweiyu/2022-07-13-` | app/zh/news/20221227-11月月报/月报.md:495、app/zh/news/20221227-11月月报/月报.md:500 | — |
| `https://www.openeuler.org/en/blog/zhangweiyu/2022-07-13-openEuler-Mini-Video-Courses-Linux` | app/en/news/20220801-openueuler08.md:104 | — |
| `https://www.openeuler.org/en/blog/zhangweiyu/2022-11-14-` | app/zh/news/20221227-11月月报/月报.md:506、app/zh/news/20221227-11月月报/月报.md:512 | — |
| `https://www.openeuler.org/en/other/migration` | app/en/news/20220801-openueuler08.md:120 | — |
| `https://www.openeuler.org/en/other/migration/` | app/en/blog/20220726-banqian-mysql/banqian-mysql.md:73、app/en/blog/20220726-banqian-mysql/banqian-mysql.md:249 | — |
| `https://www.openeuler.org/en/security/safety-bulletin/detail.html?id=openEuler-SA-2021-1001` | app/en/blog/compile_success/2021-01-23-dnspooq.md:54 | — |
| `https://www.openeuler.org/en/security/safety-bulletin/detail.html?id=openEuler-SA-2021-1002` | app/en/blog/liujingang09/2021-01-29-sudo-cve-2021-3156.md:82 | — |
| `https://www.openeuler.org/en/sig/meeting-guide/` | app/en/wiki/contribution/index.md:187 | — |
| `https://www.openeuler.org/en/sig/sig-Backup` | app/en/news/20241130/openEuler Monthly Bulletin - November.md:128 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=ai` | app/en/news/20241030/openEuler-Monthly-Bulletin-October.md:95 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=bigdata` | app/en/news/20240130/openEuler-Monthly-Bulletin-January.md:51、app/en/news/20240730/openEuler-Monthly-Bulletin-July.md:65、app/en/news/20240730/openEuler-Monthly-Bulletin-July.md:153、app/en/news/20240830/openEuler-Monthly-Bulletin-August.md:46、app/en/news/20240930/openEuler-Monthly-Bulletin-September.md:104 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=Compiler` | app/en/news/20240330/openEuler-Monthly-Bulletin-March.md:71、app/en/news/20240630/openEuler-Monthly-Bulletin–June.md:58、app/en/news/20240730/openEuler-Monthly-Bulletin-July.md:165、app/en/news/20241030/openEuler-Monthly-Bulletin-October.md:63 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=DB` | app/en/news/20240330/openEuler-Monthly-Bulletin-March.md:83 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=Desktop` | app/en/news/20241030/openEuler-Monthly-Bulletin-October.md:57 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=doc` | app/en/blog/Dingziwei/dzw/DingZiwei.md:36、app/en/news/20240330/openEuler-Monthly-Bulletin-March.md:46 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=G11N` | app/en/news/20240330/openEuler-Monthly-Bulletin-March.md:46 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=Infrastructure` | app/en/news/20240130/openEuler-Monthly-Bulletin-January.md:63、app/en/news/20240830/openEuler-Monthly-Bulletin-August.md:23 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=security-committee` | app/en/news/20241030/openEuler-Monthly-Bulletin-October.md:45 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-AccLib` | app/en/news/20240730/openEuler-Monthly-Bulletin-July.md:126 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-Arm` | app/en/news/20240630/openEuler-Monthly-Bulletin–June.md:62 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-Backup` | app/en/news/20240730/openEuler-Monthly-Bulletin-July.md:43 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-CICD` | app/en/news/20240230/openEuler-Monthly-Bulletin-February.md:62 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-CloudNative` | app/en/news/20240730/openEuler-Monthly-Bulletin-July.md:108 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-Compatibility-Infra` | app/en/news/20240830/openEuler-Monthly-Bulletin-August.md:39、app/en/news/20240930/openEuler-Monthly-Bulletin-September.md:75 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-compliance` | app/en/blog/Dingziwei/dzw/DingZiwei.md:17 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-confidential-computing` | app/en/blog/20240111-sec/20240111-sec.md:162、app/en/blog/20240111-sec/20240111-sec.md:163、app/en/news/20240230/openEuler-Monthly-Bulletin-February.md:65 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-DPU` | app/en/news/20240930/openEuler-Monthly-Bulletin-September.md:59 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-embedded` | app/en/news/20240130/openEuler-Monthly-Bulletin-January.md:36、app/en/news/20240730/openEuler-Monthly-Bulletin-July.md:181、app/en/news/20240930/openEuler-Monthly-Bulletin-September.md:51、app/en/news/20241030/openEuler-Monthly-Bulletin-October.md:56 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-FangTian` | app/en/blog/20230728-FangTian/20230728-FangTian.md:59、app/en/blog/20230925-fangtian/20230925-fangtian.md:63 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-IDE` | app/en/news/20240730/openEuler-Monthly-Bulletin-July.md:76 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-Intel-Arch` | app/en/news/20240430/openEuler-Monthly-Bulletin–April.md:65 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-intelligence` | app/en/news/20240530/openEuler-Monthly-Bulletin–May.md:51、app/en/news/20240630/openEuler-Monthly-Bulletin–June.md:95 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-rfo` | app/en/blog/2023-1-6-Rancher/Rancher.md:17 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-RISC-V` | app/en/blog/20240320-risc-v/openEuler RISC-V-based Robot Car Debuted at the XuanTie Conference.md:51、app/en/news/20240230/openEuler-Monthly-Bulletin-February.md:59、app/en/news/20240330/openEuler-Monthly-Bulletin-March.md:36、app/en/news/20240628-openEuler 24.03 LTS- Pioneering Native RISC-V Support/index.md:14、app/en/news/20240630/openEuler-Monthly-Bulletin–June.md:58、app/en/news/20240830/openEuler-Monthly-Bulletin-August.md:28 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-ROS` | app/en/blog/20240320-risc-v/openEuler RISC-V-based Robot Car Debuted at the XuanTie Conference.md:53、app/en/news/20240130/openEuler-Monthly-Bulletin-January.md:60、app/en/news/20240230/openEuler-Monthly-Bulletin-February.md:68、app/en/news/20240630/openEuler-Monthly-Bulletin–June.md:58、app/en/news/20240730/openEuler-Monthly-Bulletin-July.md:177 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-SBC` | app/en/news/20240230/openEuler-Monthly-Bulletin-February.md:39 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-sbom` | app/en/news/20240530/openEuler-Monthly-Bulletin–May.md:49 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-SDS` | app/en/news/20240730/openEuler-Monthly-Bulletin-July.md:112、app/en/news/20241030/openEuler-Monthly-Bulletin-October.md:39、app/zh/news/20230811-yuebao/20230811-yuebao.md:284 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=sig-security-facility` | app/en/news/20240930/openEuler-Monthly-Bulletin-September.md:96、app/en/news/20241030/openEuler-Monthly-Bulletin-October.md:45、app/en/news/20241030/openEuler-Monthly-Bulletin-October.md:58 | — |
| `https://www.openeuler.org/en/sig/sig-detail/?name=Storage` | app/en/news/20241030/openEuler-Monthly-Bulletin-October.md:75 | — |
| `https://www.openeuler.org/whitepaper/openEuler` | app/zh/news/openEuler/20240930-report/2409-report.md:47 | — |
| `https://www.openeuler.org/whitepaper/openEuler操作系统（创新项目总览）.pdf` | app/zh/news/20230811-yuebao/20230811-yuebao.md:59 | — |
| `https://www.openeuler.org/zh/blog.html` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:192 | — |
| `https://www.openeuler.org/zh/blog/2020/03/26/2020-03-26-how-to-OBS.html` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:413 | — |
| `https://www.openeuler.org/zh/blog/2020/03/26/2020-03-26-OBS-with-Git.html` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:413 | — |
| `https://www.openeuler.org/zh/blog/2020/05/06/2020-05-06-os-metrics-1.html` | app/zh/blog/zhongjun2/2020-05-07-os-metrics-2.md:62 | — |
| `https://www.openeuler.org/zh/blog/2020/05/25/2020-05-25-raspberrypi-userguide.html` | app/zh/blog/genedna/summer-2020-openeuler-tasks.md:32 | — |
| `https://www.openeuler.org/zh/blog/2020/06/03/summer-2020-openeuler-tasks.html` | app/zh/news/20200607.md:17 | — |
| `https://www.openeuler.org/zh/cla.html` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:190 | — |
| `https://www.openeuler.org/zh/community/certification-services/search.html` | app/zh/news/openEuler/2024-11yuebao/2024-11yuebao.md:326 | — |
| `https://www.openeuler.org/zh/community/charter/v1` | app/zh/community/charter/index.md:599 | — |
| `https://www.openeuler.org/zh/compatibility/OSV` | app/zh/news/20260306-Jan–Feb Monthly Report/20260306- Jan–Feb Monthly Report.md:120、app/zh/news/20260407-March Monthly Report/20260407- March Monthly Report.md:163 | — |
| `https://www.openeuler.org/zh/developer.html` | app/zh/blog/myeuler/2020-5-13-openEuler-Travel.md:34、app/zh/blog/openeuler/20191001.md:31、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:194 | — |
| `https://www.openeuler.org/zh/guide/quick-start` | app/.vitepress/plugins/generateLLMsTxt/types.ts:40、app/.vitepress/plugins/generateLLMsTxtNew/full-DxGtIRWO.d.ts:39 | — |
| `https://www.openeuler.org/zh/migration/portal/` | app/zh/news/20221125-10月月报-.md:477 | — |
| `https://www.openeuler.org/zh/releases.html` | app/zh/blog/myeuler/2020-5-13-openEuler-Travel.md:28 | — |
| `https://www.openeuler.org/zh/security.html` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:182 | — |
| `https://www.openeuler.org/zh/security/safety-bulletin/detail.html?id=openEuler-SA-2021-1001` | app/zh/blog/compile_success/2021-01-23-dnspooq.md:50 | — |
| `https://www.openeuler.org/zh/security/safety-bulletin/detail.html?id=openEuler-SA-2021-1002` | app/zh/blog/liujingang09/2021-01-29-sudo-cve-2021-3156.md:65 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=bigdata` | app/zh/news/openEuler/2023-02-yuebao/20230227-yuebao.md:170 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=doc` | app/zh/blog/Dingziwei/dzw/dingziwei.md:26 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=Kernel` | app/zh/news/20230713-yuebao/20230713-yuebao.md:234 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-AccLib` | app/zh/news/20230410-yuebao/20230410-yuebao.md:220 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-Compatibility-Infra` | app/zh/news/20230113-12月月报/12月月报.md:208、app/zh/news/20230410-yuebao/20230410-yuebao.md:289 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-compliance` | app/zh/blog/Dingziwei/dzw/dingziwei.md:22 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-compliancehttps://gitee.com/openharmony/community/blob/master/sig/sig_compliance/sig_compliance_cn.md` | app/zh/news/20230630-hegui/20230630-hegui.md:111 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-confidential-computing` | app/zh/blog/20240111-sec/20240111-sec.md:162 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-DPU` | app/zh/news/20230117-dupmeetup.md:36 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-embedded` | app/en/blog/2022-10-12Embedded SIG/Embedded SIG.md:346、app/zh/blog/2022-10-12Embedded SIG/Embedded SIG.md:348、app/zh/news/20230908-yuebao/20230908-yuebao.md:287 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-FangTian` | app/zh/blog/20230728-FangTian/20230728-FangTian.md:70、app/zh/blog/20230925-fangtian/20230925-fangtian.md:66、app/zh/news/20230602-yuebao/20230602-yuebao.md:137、app/zh/news/20230811-yuebao/20230811-yuebao.md:257 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-IDE` | app/zh/news/openEuler/0819-yb/0819-yb.md:137 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-Intel-Arch` | app/zh/news/20230713-yuebao/20230713-yuebao.md:230 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-intelligence` | app/zh/news/openEuler/20240613-yuebao/20240613-yuebao.md:192 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-memsafety` | app/zh/news/20230713-yuebao/20230713-yuebao.md:373 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-rfo` | app/zh/blog/2023-1-6-Rancher/Rancher.md:17 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-ROS` | app/zh/news/openEuler/20240207-yuebao/20230207-yuebao.md:179 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-SDS` | app/zh/news/20230811-yuebao/20230811-yuebao.md:281 | — |
| `https://www.openeuler.org/zh/sig/sig-detail/?name=sig-security-facility` | app/en/news/20240430/openEuler-Monthly-Bulletin–April.md:78、app/zh/news/20221125-10月月报-.md:299 | — |
| `https://www.xxxx.xxx/en/` | .claude/skills/frontmatter-data-extractor/SKILL.md:73 | — |
| `https://www.xxxx.xxx/en/download/` | .claude/skills/frontmatter-data-extractor/SKILL.md:75 | — |
| `https://www.xxxx.xxx/zh/` | .claude/skills/frontmatter-data-extractor/SKILL.md:72 | — |
| `https://www.xxxx.xxx/zh/sig/sig-list/` | .claude/skills/frontmatter-data-extractor/SKILL.md:74 | — |
| `https://www.youtube.com/channel/UCPzSqXqCgmJmdIicbY7` | app/zh/news/20221227-11月月报/月报.md:189 | — |
| `https://zhengzhenyu.gitee.io/post/intro-eur/` | app/en/blog/20230811-waaagh/openEuler-DE-in-WSL.md:28、app/zh/blog/waaagh/openEuler-DE-in-WSL.md:28 | — |

#### HTTP 405（1 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://gitee.com/mirrors/LLVM.git` | app/en/blog/cascades/2021-8-14-Learning-About-libFuzzer.md:49、app/zh/blog/cascades/2021-8-14-Learning-About-libFuzzer.md:53 | — |

#### HTTP 412（60 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://space.bilibili.com/527064077/channel/collectiondetail?sid=1275271` | app/zh/news/20230417-hz/20230417-hz.md:97 | — |
| `https://space.bilibili.com/527064077/channel/collectiondetail?sid=1805628` | app/zh/news/openEuler/20231020-vrt/20231020-vrt.md:146 | — |
| `https://space.bilibili.com/527064077/channel/collectiondetail?sid=1903666` | app/zh/news/20231127-suz/20231127-suz.md:60 | — |
| `https://space.bilibili.com/527064077/channel/collectiondetail?sid=2557185` | app/zh/news/openEuler/20240330-openchain/20240330-openchain.md:63 | — |
| `https://space.bilibili.com/527064077/channel/collectiondetail?sid=2579411` | app/zh/news/openEuler/20240330-G11N/20240330-G11N.md:186 | — |
| `https://space.bilibili.com/527064077/channel/collectiondetail?sid=2644819` | app/zh/news/20240412-nanjing/20240412-nanjing.md:96 | — |
| `https://space.bilibili.com/527064077/channel/collectiondetail?sid=3287907` | app/zh/news/openEuler/20240628-Arm/20240628-Arm.md:125 | — |
| `https://space.bilibili.com/527064077/channel/collectiondetail?sid=719180` | app/zh/news/openEuler/2022-09-yuebao/20220927-yuebao.md:125 | — |
| `https://space.bilibili.com/527064077/channel/series` | app/zh/news/20220707.md:67 | — |
| `https://url.cy/kIhIZ3` | app/zh/news/openEuler/20240705-yuebao/20240705-yuebao.md:210 | — |
| `https://www.bilibili.com/video/BV11i4y1u7r9` | app/.vitepress/src/i18n/interaction/live/live.ts:254、app/.vitepress/src/i18n/interaction/live/live.ts:448 | — |
| `https://www.bilibili.com/video/BV12A411o7zY/?spm_id_from=333.337.search-card.all.click&vd_source=0aa547ea87e7a7505cf544eacc2236ac` | app/en/community/contribution/detail.md:62、app/zh/community/contribution/detail.md:62 | — |
| `https://www.bilibili.com/video/BV12PnezgEey/?vd_source=544d9ea25c0bc32570734b5b21104be` | app/.vitepress/src-new/views/summit/devday2025/data/data_zh.ts:47 | — |
| `https://www.bilibili.com/video/BV12y4y1C7Gr` | app/.vitepress/src/i18n/interaction/live/live.ts:184、app/.vitepress/src/i18n/interaction/live/live.ts:378 | — |
| `https://www.bilibili.com/video/BV13z4y1D7mq` | app/.vitepress/src/i18n/interaction/live/live.ts:233、app/.vitepress/src/i18n/interaction/live/live.ts:427、app/zh/news/20200707-openeluer-live.md:29 | — |
| `https://www.bilibili.com/video/BV14a411D7ob?spm_id_from=333.999.0.0&vd_source=544d9ea25c0bc3a2570734b5b21104be` | app/en/news/20220801-openueuler08.md:168、app/zh/news/20220801-openueuler08.md:194 | — |
| `https://www.bilibili.com/video/BV14G4y1o7ME/` | app/zh/news/20221227-11月月报/月报.md:383 | — |
| `https://www.bilibili.com/video/BV14r4y1F7Dp` | app/.vitepress/src/i18n/interaction/live/live.ts:156、app/.vitepress/src/i18n/interaction/live/live.ts:350 | — |
| `https://www.bilibili.com/video/BV17C4y187sM` | app/.vitepress/src/i18n/interaction/live/live.ts:261、app/.vitepress/src/i18n/interaction/live/live.ts:455 | — |
| `https://www.bilibili.com/video/BV17Q4y1T7FN/?vd_source=0aa547ea87e7a7505cf544eacc2236ac` | app/.vitepress/src/i18n/interaction/live/live.ts:283 | — |
| `https://www.bilibili.com/video/BV17z4y1y7ME` | app/.vitepress/src/i18n/interaction/live/live.ts:114、app/.vitepress/src/i18n/interaction/live/live.ts:308 | — |
| `https://www.bilibili.com/video/BV19d4y1w7Zb?spm_id_from=333.999.0.0` | app/zh/news/20220831.md:234 | — |
| `https://www.bilibili.com/video/BV1At4y1e7mq` | app/.vitepress/src/i18n/interaction/live/live.ts:149、app/.vitepress/src/i18n/interaction/live/live.ts:343 | — |
| `https://www.bilibili.com/video/BV1BP411j7B1/?vd_source=544d9ea25c0bc3a2570734b5b21104be` | app/zh/news/20220831.md:143 | — |
| `https://www.bilibili.com/video/BV1BU4y1z7Xo/?spm_id_from=333.337.search-card.all.click&vd_source=4acc4922073be11f2372c7c75a305c42` | app/zh/blog/2011-11-12-01/01.md:109 | — |
| `https://www.bilibili.com/video/BV1Ca4y177te` | app/.vitepress/src/i18n/interaction/live/live.ts:198、app/.vitepress/src/i18n/interaction/live/live.ts:392、app/zh/blog/DCCooper/2020-09-15-isula-build-code-exploration.md:14 | — |
| `https://www.bilibili.com/video/BV1D7KZzmEQH` | app/zh/news/20250703-bigdata-meetup/20250703-bigdata-meetup.md:18 | — |
| `https://www.bilibili.com/video/BV1dk4y1171e` | app/.vitepress/src/i18n/interaction/live/live.ts:268、app/.vitepress/src/i18n/interaction/live/live.ts:462 | — |
| `https://www.bilibili.com/video/BV1Ey4y1S7xv` | app/.vitepress/src/i18n/interaction/live/live.ts:107、app/.vitepress/src/i18n/interaction/live/live.ts:301 | — |
| `https://www.bilibili.com/video/BV1FY4y1j7eB/?spm_id_from=pageDriver` | app/zh/news/20220801-openueuler08.md:108 | — |
| `https://www.bilibili.com/video/BV1Gp4y1i7Rs` | app/.vitepress/src/i18n/interaction/live/live.ts:191、app/.vitepress/src/i18n/interaction/live/live.ts:385、app/zh/blog/DCCooper/2020-09-15-isula-build-code-exploration.md:14 | — |
| `https://www.bilibili.com/video/BV1gv411C7sK` | app/.vitepress/src/i18n/interaction/live/live.ts:142、app/.vitepress/src/i18n/interaction/live/live.ts:336 | — |
| `https://www.bilibili.com/video/BV1hC411t7ZU/?spm` | app/zh/blog/openeuler/20240428-security.md:20 | — |
| `https://www.bilibili.com/video/BV1hC411t7ZU/?spm_id_from=333.788&vd_source=544d9ea25c0bc3a2570734b5b21104be` | app/.vitepress/src/i18n/interaction/live/live.ts:69 | — |
| `https://www.bilibili.com/video/BV1it4y197KQ` | app/.vitepress/src/i18n/interaction/live/live.ts:219、app/.vitepress/src/i18n/interaction/live/live.ts:413、app/zh/news/20200707-openeluer-live.md:21 | — |
| `https://www.bilibili.com/video/BV1ja41197wz?spm_id_from=333.999.0.0&vd_source=544d9ea25c0bc3a2570734b5b21104be` | app/en/news/20220801-openueuler08.md:170、app/zh/news/20220801-openueuler08.md:196 | — |
| `https://www.bilibili.com/video/BV1jAgqzGE2o/` | app/zh/news/20250723-sig-arm-meetup/index.md:83 | — |
| `https://www.bilibili.com/video/BV1Ji4y177NC` | app/.vitepress/src/i18n/interaction/live/live.ts:135、app/.vitepress/src/i18n/interaction/live/live.ts:329 | — |
| `https://www.bilibili.com/video/BV1KPnez3EkX/` | app/.vitepress/src/views/summit/summit2024/data/data_zh.ts:17 | — |
| `https://www.bilibili.com/video/BV1Mf4y1q7Ek` | app/.vitepress/src/i18n/interaction/live/live.ts:177、app/.vitepress/src/i18n/interaction/live/live.ts:371 | — |
| `https://www.bilibili.com/video/BV1of4y1X7p1` | app/.vitepress/src/i18n/interaction/live/live.ts:205、app/.vitepress/src/i18n/interaction/live/live.ts:399、app/zh/news/20200707-openeluer-live.md:41 | — |
| `https://www.bilibili.com/video/BV1oP4y1o7LP?spm_id_from=333.999.section.playall&vd_source=544d9ea25c0bc3a2570734b5b21104be` | app/zh/news/20221020-qianyi.md:65 | — |
| `https://www.bilibili.com/video/BV1pK411J7R9` | app/.vitepress/src/i18n/interaction/live/live.ts:247、app/.vitepress/src/i18n/interaction/live/live.ts:441、app/zh/news/20200707-openeluer-live.md:37 | — |
| `https://www.bilibili.com/video/BV1pNnuzYEDz/` | app/.vitepress/src/views/summit/summit2024/data/data_zh.ts:21 | — |
| `https://www.bilibili.com/video/BV1Qv411L7zB/?vd_source=0aa547ea87e7a7505cf544eacc2236ac` | app/.vitepress/src/i18n/interaction/live/live.ts:85 | — |
| `https://www.bilibili.com/video/BV1s6exzDEhL` | app/zh/news/20250826-sig-long-review/20250826-sig-long-review.md:74 | — |
| `https://www.bilibili.com/video/BV1Ty4y1y7eK` | app/.vitepress/src/i18n/interaction/live/live.ts:275、app/.vitepress/src/i18n/interaction/live/live.ts:469 | — |
| `https://www.bilibili.com/video/BV1VF4m1T7NL/?spm_id_from=333.999.0.0&vd_source=544d9ea25c0bc3a2570734b5b21104be` | app/.vitepress/src/i18n/interaction/live/live.ts:61 | — |
| `https://www.bilibili.com/video/BV1vK4y1s7QG` | app/.vitepress/src/i18n/interaction/live/live.ts:226、app/.vitepress/src/i18n/interaction/live/live.ts:420、app/zh/news/20200707-openeluer-live.md:25 | — |
| `https://www.bilibili.com/video/BV1vy4y1s7Nr/?spm_id_from=333.999.0.0&vd_source=0aa547ea87e7a7505cf544eacc2236ac` | app/.vitepress/src/i18n/interaction/live/live.ts:93 | — |
| `https://www.bilibili.com/video/BV1vz421k7PL/?spm` | app/zh/blog/openeuler/20240428-security.md:28 | — |
| `https://www.bilibili.com/video/BV1vz421k7PL/?vd_source=544d9ea25c0bc3a2570734b5b21104be` | app/.vitepress/src/i18n/interaction/live/live.ts:53 | — |
| `https://www.bilibili.com/video/BV1Vz4y1r7fk` | app/.vitepress/src/i18n/interaction/live/live.ts:100、app/.vitepress/src/i18n/interaction/live/live.ts:294 | — |
| `https://www.bilibili.com/video/BV1xm4112746/?vd` | app/zh/blog/openeuler/20240428-security.md:32 | — |
| `https://www.bilibili.com/video/BV1xm4112746/?vd_source=544d9ea25c0bc3a2570734b5b21104be` | app/.vitepress/src/i18n/interaction/live/live.ts:45 | — |
| `https://www.bilibili.com/video/BV1XV411y73z` | app/.vitepress/src/i18n/interaction/live/live.ts:121、app/.vitepress/src/i18n/interaction/live/live.ts:315 | — |
| `https://www.bilibili.com/video/BV1YA411j7Ws` | app/.vitepress/src/i18n/interaction/live/live.ts:128、app/.vitepress/src/i18n/interaction/live/live.ts:322 | — |
| `https://www.bilibili.com/video/BV1Yd4y1D7e5?spm_id_from=333.999.0.0&vd_source=544d9ea25c0bc3a2570734b5b21104be` | app/en/news/20220801-openueuler08.md:166、app/zh/news/20220801-openueuler08.md:192 | — |
| `https://www.bilibili.com/video/BV1YK411H7E2` | app/.vitepress/src/i18n/interaction/live/live.ts:240、app/.vitepress/src/i18n/interaction/live/live.ts:434、app/zh/news/20200707-openeluer-live.md:33 | — |
| `https://www.bilibili.com/video/BV1zY4y117P9/?spm_id_from=333.337.search-card.all.click` | app/.vitepress/src/i18n/interaction/live/live.ts:77 | — |

#### HTTP 418（7 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://e-campaign.huawei.com/events3/UniversalForm/register/200908020/register.html?site=cn&formId=6155&way=onsite` | app/.vitepress/src/views/summit/summit2023/data/data_en.ts:12 | — |
| `https://e-campaign.huawei.com/m/N7V3Eb` | app/.vitepress/src/views/summit/devday2023/components/SummitBanner.vue:30、app/.vitepress/src/views/summit/devday2023/components/SummitBanner.vue:45 | — |
| `https://hw.vhallyun.com` | app/.vitepress/src/views/summit/summit2023/components/SummitLive.vue:60、app/.vitepress/src/views/summit/summit2024/components/SummitLive.vue:58、app/.vitepress/src-new/shared/config/index.ts:5、app/.vitepress/src-new/views/summit/devday2025/components/MinisiteLive.vue:57 | — |
| `https://jenkins.osinfra.cn/view/openEuler/job/luweijun/job/eulerpublisher/` | app/zh/news/20230908-yuebao/20230908-yuebao.md:192 | — |
| `https://jenkins.osinfra.cn/view/openEuler/job/luweijun/job/eulerpublisher/3` | app/en/blog/20230908-EulerPublisher.md:29、app/zh/blog/20230908-EulerPublisher.md:32 | — |
| `https://magicapi.osinfra.cn/stat/sig/info?community=openeuler` | app/en/sig/[sig].paths.ts:5、app/zh/sig/[sig].paths.ts:5 | — |
| `https://openeuler.test.osinfra.cn/zh/internship/` | app/zh/news/20221227-11月月报/月报.md:607 | — |

#### HTTP 429（4 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://cutt.ly/8zcDyPi` | app/en/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:380、app/zh/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:293、app/zh/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:380 | — |
| `https://cutt.ly/wxoH9OG` | app/en/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:383、app/zh/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:383 | — |
| `https://en.oceanbase.com/` | app/en/news/20240730/openEuler-Monthly-Bulletin-July.md:92 | — |
| `https://mirrors.huaweicloud.com/repository/pypi/simple` | app/en/blog/03-DeepSeek2/2.md:77、app/en/blog/03-DeepSeek2/2.md:171、app/en/blog/03-DeepSeek2/2.md:185、app/en/blog/03-DeepSeek2/2.md:186、app/zh/blog/03-DeepSeek2/2.md:68、app/zh/blog/03-DeepSeek2/2.md:185、app/zh/blog/03-DeepSeek2/2.md:201、app/zh/blog/03-DeepSeek2/2.md:202、app/zh/blog/03-DeepSeek3/1.md:92、app/zh/blog/03-DeepSeek3/1.md:97、app/zh/blog/20250429-oedeploy-03/2025-07-29-oeDeploy-Special-Topic-3-Improving-Software-Deployment-Efficiency-Based-on-MCP.md:46、app/zh/blog/20260820-openEuler 24.03- vLLM-Benchmark/20260820-openEuler 24.03- vLLM-Benchmark.md:186、app/zh/blog/20260820-openEuler 24.03- vLLM-Benchmark/20260820-openEuler 24.03- vLLM-Benchmark.md:296、app/zh/blog/20260820-openEuler 24.03- vLLM-Benchmark/20260820-openEuler 24.03- vLLM-Benchmark.md:299、app/zh/blog/20260820-openEuler 24.03- vLLM-Benchmark/20260820-openEuler 24.03- vLLM-Benchmark.md:307、app/zh/blog/20260820-openEuler 24.03- vLLM-Benchmark/20260820-openEuler 24.03- vLLM-Benchmark.md:310、app/zh/blog/20260820-openEuler 24.03- vLLM-Benchmark/20260820-openEuler 24.03- vLLM-Benchmark.md:319、app/zh/blog/20260820-openEuler 24.03- vLLM-Benchmark/20260820-openEuler 24.03- vLLM-Benchmark.md:353、app/zh/blog/20260820-openEuler 24.03- vLLM-Benchmark/20260820-openEuler 24.03- vLLM-Benchmark.md:569、app/zh/blog/20260826-openEuler 24.03- SGLang/20260826-openEuler 24.03- SGLang.md:195 等 26 处 | — |

#### HTTP 500（3 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `http://114.116.250.98/` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:77 | — |
| `http://bjos.oschina.net/juesaihuojiaingddanzhengshif-n121.html#cons` | app/zh/news/20230529-riscv.md:56 | — |
| `https://cn.ubuntu.com/blog/use-canonical-maas-deploy-openeuler-test` | app/en/blog/2022-08-23/use-canonical-maas-deploy-openeuler-test.md:315、app/zh/blog/2022-08-23/use-canonical-maas-deploy-openeuler-test.md:315 | — |

#### HTTP 503（1 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://www.element14.com/community/servlet/JiveServlet/previewBody/41836-102-1-229511/ARM.Reference_Manual.pdf` | app/zh/blog/genedna/summer-2020-openeuler-tasks.md:183 | — |

#### HTTP 521（16 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://blog.csdn.net/a555809067/article/details/144157583` | app/zh/blog/20250708-iSulad-brief-tutorial/20250708-iSulad-brief-tutorial.md:13 | — |
| `https://blog.csdn.net/bingshiwuyu/article/details/107333259` | app/zh/blog/haozi007/2020-09-09-isulad-benchmark.md:433 | — |
| `https://blog.csdn.net/Darlingqiang/article/details/118913291` | app/en/blog/20220802-loop-interchange/20220802-loop-interchange.md:331、app/zh/blog/20220802-loop-interchange/20220802-loop-interchange.md:307 | — |
| `https://blog.csdn.net/gengshenghong/article/details/7225775` | app/en/blog/20220802-loop-interchange/20220802-loop-interchange.md:323、app/zh/blog/20220802-loop-interchange/20220802-loop-interchange.md:299 | — |
| `https://blog.csdn.net/jianwen_hi/article/details/53398141` | app/zh/blog/luoyuzhe/005Linux-kernel-source-structure-1/index.md:70 | — |
| `https://blog.csdn.net/PCb4jR/article/details/85241114` | app/en/blog/20220802-loop-interchange/20220802-loop-interchange.md:329、app/zh/blog/20220802-loop-interchange/20220802-loop-interchange.md:305 | — |
| `https://blog.csdn.net/pwl999/article/details/107569603` | app/en/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:368、app/zh/blog/wangshuo/glibc_Bugs_Fault_Analysis_of_malloc_Call_Stack.md:368 | — |
| `https://blog.csdn.net/qq_35451572/article/details/79516563` | app/zh/blog/luoyuzhe/001Auto-build-vm-enviroment/index.md:218 | — |
| `https://blog.csdn.net/qq_40323844/article/details/103191029` | app/zh/blog/cascades/2021-8-14-Learning-About-libFuzzer.md:50 | — |
| `https://blog.csdn.net/qq_44866828/article/details/148617642` | app/zh/blog/20250731-openeuler-install-mysql/20250731-openeuler-install-mysql.md:14 | — |
| `https://blog.csdn.net/u012218309/article/details/81912074` | app/zh/blog/luoyuzhe/006Linux-kernel-source-structure-2/index.md:52 | — |
| `https://blog.csdn.net/ustc_dylan/article/details/5385691` | app/zh/blog/luoyuzhe/001Auto-build-vm-enviroment/index.md:216 | — |
| `https://blog.csdn.net/wangyachao0803/article/details/81380882` | app/zh/blog/luoyuzhe/005Linux-kernel-source-structure-1/index.md:68 | — |
| `https://blog.csdn.net/xiaoxiao133/article/details/83049959` | app/en/blog/004History-of-Linux-kernel-3/index.md:65、app/zh/blog/luoyuzhe/004History-of-Linux-kernel-3/index.md:64 | — |
| `https://blog.csdn.net/xiebingsuccess/article/details/91861871` | app/zh/blog/luoyuzhe/002History-of-Linux-kernel-1/index.md:143 | — |
| `https://blog.csdn.net/yiyueming/article/details/72897362` | app/en/blog/luoyuzhe/TEE/OP-TEE_For_OpenEuler.md:71、app/zh/blog/luoyuzhe/TEE/OP-TEE_For_OpenEuler.md:73 | — |

#### HTTP 999（1 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://www.linkedin.com/in/mikerumph/` | app/zh/blog/xiyuanwang/2020-04-14-Web-ARM64-Support.md:13 | — |

#### 网络错误（131 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `http://*HAProxy` | app/en/blog/randy1568/HAProxy 1-9-0-porting-guide.md:173 | ENOTFOUND |
| `http://119.3.219.20:82/openEuler:/21.03/standard_aarch64/` | app/en/blog/randy1568/pkgship 2-1-0-porting-guide.md:85、app/zh/blog/randy1568/pkgship 2-1-0-porting-guide.md:85 | AbortError |
| `http://119.3.219.20:82/openEuler:/Mainline/standard_x86_64/x86_64/gnome-boxes-3.38.2-3.oe1.x86_64.rpm` | app/en/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:96、app/zh/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38.md:94 | AbortError |
| `http://192.168.1.1:8080` | app/zh/blog/liuyanglinux/2024-09-09-开源镜像站部署.md:268 | AbortError |
| `http://192.168.122.1/ks/openEuler-ks.cfg` | app/zh/blog/20250613-kickstart/20250613-kickstart.md:233 | AbortError |
| `http://192.168.122.1/openEuler/` | app/zh/blog/20250613-kickstart/20250613-kickstart.md:193 | AbortError |
| `http://192.168.122.12:5240/maas/` | app/en/blog/2022-08-23/use-canonical-maas-deploy-openeuler-test.md:123、app/zh/blog/2022-08-23/use-canonical-maas-deploy-openeuler-test.md:123 | AbortError |
| `http://blog.memsql.com/bpf-linux-performance` | app/zh/blog/genedna/summer-2020-openeuler-tasks.md:230 | ENOTFOUND |
| `http://build.squid-cache.org/` | app/zh/blog/xiyuanwang/2020-04-14-Web-ARM64-Support.md:121 | ENOTFOUND |
| `http://build.squid-cache.org/computer/arm64-rpi/` | app/zh/blog/xiyuanwang/2020-04-14-Web-ARM64-Support.md:121 | ENOTFOUND |
| `http://git.mydoc.io/?t=153749` | app/en/interaction/post-blog/index.md:50、app/en/interaction/post-blog/index.md:102、app/en/interaction/post-news/index.md:47、app/en/interaction/post-news/index.md:102、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:278、app/zh/interaction/post-blog/index.md:59、app/zh/interaction/post-blog/index.md:114、app/zh/interaction/post-news/index.md:47、app/zh/interaction/post-news/index.md:102 | AbortError |
| `http://git.mydoc.io/?t=179267` | app/en/interaction/post-blog/index.md:10、app/en/interaction/post-news/index.md:10、app/zh/interaction/post-blog/index.md:10、app/zh/interaction/post-news/index.md:10 | AbortError |
| `http://git.mydoc.io/?t=180692` | app/en/interaction/post-blog/index.md:16 | AbortError |
| `http://IP:80` | app/zh/blog/randy1568/HAProxy 1-9-0-porting-guide.md:175 | EAI_AGAIN |
| `http://license.coscl.org.cn/` | app/zh/blog/20230113-segear/secGear.md:228 | AbortError |
| `http://license.coscl.org.cn/MulanPSL2` | app/en/blog/20230113-segear/secGear.md:170、app/en/blog/Benshuai5D/2021-06-10-build-bishengJDK-rpm-package.md:210、app/en/blog/zengchen1024/use-dnf-with-metalink.md:192、app/en/blog/zengchen1024/use-dnf-with-metalink.md:268、app/en/blog/zengchen1024/use-dnf-with-metalink.md:333、app/en/blog/zengchen1024/use-dnf-with-metalink.md:407、app/en/blog/zengchen1024/use-dnf-with-metalink.md:472、app/en/blog/zengchen1024/use-dnf-with-metalink.md:549、app/en/blog/zengchen1024/use-dnf-with-metalink.md:625、app/zh/blog/20260826-openEuler 24.03- SGLang/20260826-openEuler 24.03- SGLang.md:47、app/zh/blog/20260831-openEuler 24.03-llama.cpp/20260831-openEuler 24.03-llama.cpp .md:47、app/zh/blog/Benshuai5D/2021-06-10-build-bishengJDK-rpm-package.md:208、app/zh/blog/phoebe/2023-09-26-Run-openEuler-RISC-V-On-Qemu.md:318、app/zh/blog/zengchen1024/use-dnf-with-metalink.md:193、app/zh/blog/zengchen1024/use-dnf-with-metalink.md:269、app/zh/blog/zengchen1024/use-dnf-with-metalink.md:334、app/zh/blog/zengchen1024/use-dnf-with-metalink.md:408、app/zh/blog/zengchen1024/use-dnf-with-metalink.md:473、app/zh/blog/zengchen1024/use-dnf-with-metalink.md:550、app/zh/blog/zengchen1024/use-dnf-with-metalink.md:626 | AbortError |
| `http://news.zhichanli.cn/article/8087.html` | app/zh/blog/xing_zhu/20200214_some_problems_about_IP.md:55 | ECONNREFUSED |
| `http://openeuler-build.huawei.com/` | app/zh/blog/fuchangjie/2020-03-26-OBS-with-Git.md:19、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:458、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:460、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:466、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:468、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:473 | ENOTFOUND |
| `http://openeuler-build.huawei.com/package/show/home:changjie_fu/hi` | app/zh/blog/fuchangjie/2020-03-26-OBS-with-Git.md:170、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:822 | ENOTFOUND |
| `http://openeuler-build.huawei.com/project/show/oVirt-SIG` | app/zh/blog/fuchangjie/2020-03-26-OBS-with-Git.md:174、app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:826 | ENOTFOUND |
| `http://openeuler-build.huawei.com/trigger/webhook?id=` | app/zh/blog/overweight/2020-06-10-my-traval-of-openeuler.md:886 | ENOTFOUND |
| `http://Proxy` | app/en/blog/randy1568/Nginx 1-14-2-porting-guide.md:131 | EAI_AGAIN |
| `http://www.360doc.com/content/15/1105/08/14513665_510854234.shtml` | app/en/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:276、app/zh/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:276 | AbortError |
| `http://www.ecconsortium.org/Lists/show/id/515.html` | app/en/blog/zihao/Brief Introduction to Edge Computing.md:63 | AbortError |
| `http://www.gnu.org/software/libc/bugs.html` | app/en/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:130、app/en/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:181、app/zh/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:130、app/zh/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:181 | AbortError |
| `https://117.78.1.88/` | app/en/blog/gitee-cmd/Guide-for-Uploading-a-Software-Package-to-the-openEuler-Community.md:191、app/zh/blog/gitee-cmd/Guide-for-Uploading-a-Software-Package-to-the-openEuler-Community.md:188 | AbortError |
| `https://a` | tests/home-partner-validity.test.ts:250、tests/home-partner-validity.test.ts:262 | EAI_AGAIN |
| `https://ask.opencurve.io/` | app/zh/news/202030721-Curve/202030721-Curve.md:215 | ERR_TLS_CERT_ALTNAME_INVALID |
| `https://ask.opencurve.io/t/topic/161` | app/zh/news/202030721-Curve/202030721-Curve.md:66、app/zh/news/202030721-Curve/202030721-Curve.md:185 | ERR_TLS_CERT_ALTNAME_INVALID |
| `https://atomgit` | app/zh/blog/20260601-Witty RAG Core/20260612-Witty RAG Core.md:217、app/zh/blog/20260821-openEuler Witty-xlite/20260821-openEuler Witty-xlite.md:57 | EAI_AGAIN |
| `https://atomgit/` | app/en/interaction/post-blog/index.md:48、app/en/interaction/post-blog/index.md:55 | EAI_AGAIN |
| `https://atomgit/openeuler/openEuler-portal` | app/en/interaction/post-blog/index.md:50 | EAI_AGAIN |
| `https://b` | tests/home-partner-validity.test.ts:251 | EAI_AGAIN |
| `https://bugzilla.openeuler.org/` | app/zh/blog/georgecao/QuickIssue.md:38 | ENOTFOUND |
| `https://build.tarsier-infra.com` | app/zh/news/openEuler/20240914-RISCV2/20240914-RISCV2.md:183 | AbortError |
| `https://build.tarsier-infra.isrc.ac.cn/` | app/zh/blog/openeuler/20240429-oerv/20240429-oerv.md:229、app/zh/news/20250718-oerv-2025-riscv-china-summit/index.md:89、app/zh/news/20250718-openeuler-for-rva23/20250718-openeuler-for-rva23.md:70 | AbortError |
| `https://cascadeschen.cn` | app/en/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:415、app/en/blog/cascades/2021-8-14-Learning-About-libFuzzer.md:261、app/zh/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:432、app/zh/blog/cascades/2021-8-14-Learning-About-libFuzzer.md:266 | AbortError |
| `https://cirrus-ci.com/github/haproxy/haproxy` | app/zh/blog/xiyuanwang/2020-04-14-Web-ARM64-Support.md:119 | ECONNRESET |
| `https://compass-ci.openeuler.org/` | app/.vitepress/src/i18n/common/common-en.ts:238、app/.vitepress/src/i18n/common/common-zh.ts:299、app/en/community/contribution/detail.md:49 | ENOTFOUND |
| `https://compliance3.openeuler.org/sca` | app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:64、app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:125 | ENOTFOUND |
| `https://coolshell.cn/articles/8239.html` | app/zh/blog/genedna/summer-2020-openeuler-tasks.md:206 | AbortError |
| `https://coolshell.cn/articles/9606.html` | app/zh/blog/genedna/summer-2020-openeuler-tasks.md:204 | AbortError |
| `https://coolshell.cn/articles/9703.html` | app/zh/blog/genedna/summer-2020-openeuler-tasks.md:205 | AbortError |
| `https://criu.org/Main` | app/zh/blog/20241227-yg/20241227-yg.md:76 | AbortError |
| `https://criu.org/What_cannot_be_checkpointed` | app/en/faq/system-management/index.md:269 | AbortError |
| `https://cutt.ly/5zjXoOr` | app/en/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:282、app/zh/blog/wangshuo/Using glibc Locales/Using_glibc_Locales.md:282 | ETIMEDOUT |
| `https://cve.openeuler.org/#/infoDetails/openEuler-SA-2020-1038` | app/zh/blog/t_feng/2020-07-31-boothole.md:45 | ENOTFOUND |
| `https://cve.openeuler.org/#/infoDetails/openEuler-SA-2020-1061` | app/en/blog/lijiajie128/2020-09-01-CVE-2020-14364-QEMU-USB-array-out-of-range.md:146、app/zh/blog/lijiajie128/2020-09-01-CVE-2020-14364-QEMU-USB-array-out-of-range.md:145 | ENOTFOUND |
| `https://docs-bug.openeuler.sh/` | app/en/wiki/contribution/index.md:171、app/zh/blog/2022-10-20-zhuochong/zhuochong.md:110、app/zh/wiki/contribution/index.md:171 | ENOTFOUND |
| `https://dw.pcl.ac.cn/` | app/en/blog/fred_li/2020-03-25-apply-for-vm-from-pcl.md:19、app/zh/blog/fred_li/2020-03-25-apply-for-vm-from-pcl.md:18 | AbortError |
| `https://dw.pcl.ac.cn/cloud/` | app/en/blog/fred_li/2020-03-25-apply-for-vm-from-pcl.md:108、app/zh/blog/fred_li/2020-03-25-apply-for-vm-from-pcl.md:107 | AbortError |
| `https://dw.pcl.ac.cn/cloud/login` | app/en/blog/fred_li/2020-03-25-apply-for-vm-from-pcl.md:40、app/en/blog/fred_li/2020-03-25-apply-for-vm-from-pcl.md:70、app/zh/blog/fred_li/2020-03-25-apply-for-vm-from-pcl.md:69、app/zh/news/2020hdc.md:176、app/zh/news/2020hdc.md:180 | AbortError |
| `https://easyeditor.openeuler.org` | app/zh/blog/20230506-EasyEditor/20230506-EasyEditor.md:14、app/zh/blog/20230506-EasyEditor/20230506-EasyEditor.md:19 | ENOTFOUND |
| `https://easyeditor.openeuler.org/` | app/zh/news/20230410-yuebao/20230410-yuebao.md:443、app/zh/news/20230602-yuebao/20230602-yuebao.md:322 | ENOTFOUND |
| `https://ecosystemdashboard.linaro.org/?_gl=1*x5caxw*_ga*OTA3NjQ5MTIzLjE2OTMxNzc4Nzk.*_ga_E12E6FXFVK*MTcyNzg3NzExNy4zMTkuMS4xNzI3ODc3MTI2LjAuMC4w` | app/en/news/20241012-openEuler and Linaro Join Together for the openEuler Mini Summit During OSSummit EU 2024/index.md:26 | ENOTFOUND |
| `https://explainshell.openeuler.sh/` | app/zh/news/openEuler/2022-09-yuebao/20220927-yuebao.md:258 | ENOTFOUND |
| `https://gitee.com/openeuler/community.git` | app/en/blog/georgecao/openEuler-sig-member-management.md:142、app/zh/blog/georgecao/openEuler-sig-member-management.md:142 | AbortError |
| `https://gitee.com/openeuler/docs/blob/stable2-20.03_LTS_SP1/docs/en/docs/thirdparty_migration/x2openEuleruserguide.md` | app/en/blog/randy1568/enca1-19-porting-guide.md:52、app/en/blog/randy1568/flask 1-1-2-porting-guide.md:59 | UND_ERR_CONNECT_TIMEOUT |
| `https://gitee.com/openeuler/ifm_nettle/issues/I711WO?from=project-issue` | app/zh/blog/20230519-AccLib/20230519-AccLib.md:103 | AbortError |
| `https://gitee.com/openeuler/kconfigDetector.git` | app/en/blog/20231101-KconfigDetector/KconfigDetector Helps Check Value Errors in Kernel Configurations.md:50 | AbortError |
| `https://gitee.com/openeuler/NestOS/tree/master/docs/use_sample` | app/zh/blog/2022-10-20-NestOS/NestOS.md:45 | UND_ERR_CONNECT_TIMEOUT |
| `https://gitee.com/openeuler/openeuler-jenkins/blob/master/src/ac/acl/package_license/config/Licenses.yaml` | app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:56、app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:54 | UND_ERR_CONNECT_TIMEOUT |
| `https://gitee.com/openeuler/secGear/blob/master/service/attestation/attestation-service/as` | app/zh/blog/20250409-secGear/20250409-secGear.md:112 | UND_ERR_CONNECT_TIMEOUT |
| `https://gitee.com/openeuler/security-committee/blob/master/guide/SecureRelease_en.md` | app/en/security/management/index.md:145 | UND_ERR_CONNECT_TIMEOUT |
| `https://gitee.com/openeuler/website-v2/blob/master/web-ui/docs/en/interaction/post-news/index.md` | app/en/interaction/post-news/index.md:21 | UND_ERR_CONNECT_TIMEOUT |
| `https://github/com/ceph/ceph/pull/46571` | app/zh/blog/rosinL/2022-7-16-Ceph社区动态(2022-6-1~2022-6-30).md:50 | EAI_AGAIN |
| `https://goproxy.cn,direct` | app/zh/blog/haozi007/2020-09-09-isulad-benchmark.md:146 | ENOTFOUND |
| `https://hub.docker.com/repository/docker/cascadessjtu/qemu_fuzz` | app/en/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:104、app/zh/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer.md:107 | TypeError |
| `https://isrc.iscas.ac.cn/riscv-raios/docs/software/dsoftbus/index.html` | app/zh/news/20230901-RISC-V2/20230901-RISC-V2.md:64、app/zh/news/20230901-embedded/20230901-embedded.md:38 | EAI_AGAIN |
| `https://kernel.taobao.org/2020/06/ARM-SMMU-and-IOMMU/` | app/en/blog/wxggg/2020-11-21-iommu-smmu-intro.md:340、app/zh/blog/wxggg/2020-11-21-iommu-smmu-intro.md:325 | ERR_TLS_CERT_ALTNAME_INVALID |
| `https://kernelgo.org/mmio.html` | app/zh/blog/yorifang/virtio-spec-overview.md:357 | ENOTFOUND |
| `https://kernelgo.org/vfio-insight.html` | app/en/blog/wxggg/2020-11-29-vfio-passthrough-2.md:323、app/zh/blog/wxggg/2020-11-29-vfio-passthrough-2.md:322 | ENOTFOUND |
| `https://kernelgo.org/vfio-introduction.html` | app/en/blog/wxggg/2020-11-29-vfio-passthrough-1.md:292、app/zh/blog/wxggg/2020-11-29-vfio-passthrough-1.md:291 | ENOTFOUND |
| `https://license.coscl.org.cn/MulanPSL/index.html` | app/en/blog/fred_li/2020-03-03-license-update.md:13、app/en/blog/fred_li/2020-03-03-license-update.md:40 | AbortError |
| `https://license.coscl.org.cn/MulanPSL2/index.html` | app/en/blog/fred_li/2020-03-03-license-update.md:17、app/en/blog/fred_li/2020-03-03-license-update.md:38 | AbortError |
| `https://login.openeuler.org` | tests/utils.test.ts:207、tests/utils.test.ts:232 | ENOTFOUND |
| `https://majun.osinfra.cn:8384/api/openlibing/codecheck` | app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:106、app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:125 | ENOTFOUND |
| `https://majun.osinfra.cn/antipoisoning/poisoningdetail` | app/zh/news/openEuler/2022-09-yuebao/20220927-yuebao.md:262 | ENOTFOUND |
| `https://man.openeuler.org` | app/.vitepress/src/i18n/common/common-zh.ts:157 | ENOTFOUND |
| `https://man.openeuler.org/` | app/zh/news/openEuler/20231009-yuebao/20231009-yuebao.md:407 | ENOTFOUND |
| `https://markmail.org/message/ajm3eouaqfhm22ox` | app/zh/blog/xiyuanwang/2020-04-14-Web-ARM64-Support.md:115 | AbortError |
| `https://mirror.anigil.com/openeuler/` | app/zh/news/openEuler/2023-02-yuebao/20230227-yuebao.md:255 | ENOTFOUND |
| `https://mirror.nyist.edu.cn/openeuler/` | app/zh/news/20230713-yuebao/20230713-yuebao.md:409 | ETIMEDOUT |
| `https://mirrorlists.kylinsec.com.cn/iso/V3.5.2/` | tests/commercial-release-kylinsec.test.ts:91、tests/commercial-release-kylinsec.test.ts:96 | AbortError |
| `https://mirrorlists.kylinsec.com.cn/iso/V6-SP1/` | tests/commercial-release-kylinsec.test.ts:121、tests/commercial-release-kylinsec.test.ts:134 | AbortError |
| `https://mirrors.jxust.edu.cn/openeuler/` | app/en/blog/2024-10-15-boostYum/2024-10-15-boostYum.md:60、app/en/news/20240130/openEuler-Monthly-Bulletin-January.md:66、app/zh/blog/2024-10-15-boostYum/2024-10-15-boostYum.md:60、app/zh/news/openEuler/20240207-yuebao/20230207-yuebao.md:200 | ENOTFOUND |
| `https://mirrors.jxust.edu.cn/openeuler/openEuler-22.09/source/` | app/en/blog/2024-10-15-boostYum/2024-10-15-boostYum.md:95、app/zh/blog/2024-10-15-boostYum/2024-10-15-boostYum.md:95 | ENOTFOUND |
| `https://mirrors.jxust.edu.cn/openeuler/openEuler-22.09/source/RPM-GPG-KEY-openEuler` | app/en/blog/2024-10-15-boostYum/2024-10-15-boostYum.md:98、app/zh/blog/2024-10-15-boostYum/2024-10-15-boostYum.md:98 | ENOTFOUND |
| `https://mirrors.pku.edu.cn/openeuler/` | app/zh/news/20221227-11月月报/月报.md:539 | ETIMEDOUT |
| `https://mirrors.tuna.tsinghua.edu.cn/openeuler/openEuler-20.03-LTS-SP3/ISO/x86_64/openEuler-20.03-LTS-SP3-everything-debug-x86_64-dvd.iso` | app/en/blog/zihao/TBOX Installation and Operation on openEuler.md:146 | ETIMEDOUT |
| `https://mirrors.ustc.edu.cn/openeuler/` | app/en/blog/2024-10-15-boostYum/2024-10-15-boostYum.md:48、app/zh/blog/2024-10-15-boostYum/2024-10-15-boostYum.md:48 | ETIMEDOUT |
| `https://modelers.cn/models/IPADS/DeepSeek-R1-A16W4` | app/zh/news/openEuler/20240421-jd/20240421-jd.md:124 | ETIMEDOUT |
| `https://moocstudio.openeuler.org/en` | app/zh/news/openEuler/2022-09-yuebao/20220927-yuebao.md:223 | ENOTFOUND |
| `https://moocstudio.openeuler.org/zh` | app/zh/news/20230407-bh/20230407-bh.md:81、app/zh/news/20230928-xiaoyuanxing/20230928-xiaoyuanxing.md:69、app/zh/news/openEuler/2022-09-yuebao/20220927-yuebao.md:223 | ENOTFOUND |
| `https://moocstudio.openeuler.sh/#/course/playground` | app/en/news/20220801-openueuler08.md:146、app/zh/news/20220801-openueuler08.md:170 | ENOTFOUND |
| `https://new.openeuler.org/zh/showcase/` | app/en/news/20220801-openueuler08.md:122、app/zh/news/20220801-openueuler08.md:144 | ENOTFOUND |
| `https://opencurve.io/` | app/zh/news/202030721-Curve/202030721-Curve.md:213 | ERR_TLS_CERT_ALTNAME_INVALID |
| `https://openeuler.cn/zh/download` | app/zh/news/openEuler/20240110-yuebao/20240110-yuebao.md:323 | ENOTFOUND |
| `https://openeulerjenkins.osinfra.cn/job/Infra/job/community_check_v2/` | app/zh/blog/liuqi/2022-03-22-community-ci-share.md:25 | ENOTFOUND |
| `https://osinfra.cn/faq/mailinglist.html` | app/en/blog/liuqi/2021-10-14-unsubscribe-mailing-list.md:42、app/zh/blog/liuqi/2021-10-14-unsubscribe-mailing-list.md:66 | ENOTFOUND |
| `https://our.openeuler.openatom.cn/` | app/zh/blog/20230519-EUR/20230519-EUR.md:106、app/zh/news/openEuler/2023-02-yuebao/20230227-yuebao.md:26、app/zh/news/openEuler/2023-02-yuebao/20230227-yuebao.md:30 | CERT_HAS_EXPIRED |
| `https://paste.osinfra.cn/` | app/en/news/20220801-openueuler08.md:152、app/zh/news/20220801-openueuler08.md:178 | ENOTFOUND |
| `https://portrait.gitee.com/openeuler/oebuild/blob/master/README.en.md` | app/en/news/20240830/openEuler-Monthly-Bulletin-August.md:54 | ENOTFOUND |
| `https://pypi.tuna.tsinghua.edu.cn/simple` | app/en/blog/kezhiming/2021-01-20-virttest-avocado-vt.md:45、app/zh/blog/kezhiming/2021-01-20-virttest-avocado-vt.md:45 | ETIMEDOUT |
| `https://radiatest.openeuler.org` | app/.vitepress/src/i18n/common/common-en.ts:233、app/.vitepress/src/i18n/common/common-zh.ts:289 | ENOTFOUND |
| `https://radiatest.openeuler.org/` | app/zh/news/20220831.md:171、app/zh/news/20230407-2203/20230407-22-03.md:110 | ENOTFOUND |
| `https://radiatest.openeuler.org/login/` | app/zh/blog/yushi-Icy/2023-08-21-mugen-to-test.md:19 | ENOTFOUND |
| `https://repo.tarsier-infra.com/eulaceura` | app/zh/news/20221125-10月月报-.md:418 | AbortError |
| `https://sbom-service.osinfra.cn` | app/zh/blog/robell/openEuler_SBOM_Practice.md:511 | ENOTFOUND |
| `https://sca-beta.osinafra.cn` | app/en/blog/zhengyaohui/2022-03-21-ci_guild.md:106、app/zh/blog/zhengyaohui/2022-03-21-ci_guild.md:125 | ENOTFOUND |
| `https://slack.summer-ospp.ac.cn` | app/zh/news/20230630-summer/20230630-summer.md:84、app/zh/news/20231120-summer/20231120-summer.md:93 | CERT_HAS_EXPIRED |
| `https://somepkg.org/` | app/en/wiki/contribution/index.md:73、app/zh/wiki/contribution/index.md:73 | ENOTFOUND |
| `https://static.docs.arm.com/dai0492/b/GICv3_Software_Overview_Official_Release_B.pdf` | app/en/blog/yorifang/2020-10-24-arm-virtualization-overview.md:238、app/en/blog/yorifang/2020-10-24-arm-virtualization-overview.md:352、app/zh/blog/yorifang/2020-10-24-arm-virtualization-overview.md:260、app/zh/blog/yorifang/2020-10-24-arm-virtualization-overview.md:375 | ENOTFOUND |
| `https://static.docs.arm.com/ddi0487/a/DDI0487A_j_armv8_arm.pdf` | app/zh/blog/genedna/summer-2020-openeuler-tasks.md:182 | ENOTFOUND |
| `https://static.docs.arm.com/ihi0070/b/SMMUv3_architecture_specification_IHI0070B.pdf` | app/en/blog/yorifang/2020-10-24-arm-virtualization-overview.md:135、app/en/blog/yorifang/2020-10-24-arm-virtualization-overview.md:191、app/en/blog/yorifang/2020-10-24-arm-virtualization-overview.md:351、app/zh/blog/yorifang/2020-10-24-arm-virtualization-overview.md:152、app/zh/blog/yorifang/2020-10-24-arm-virtualization-overview.md:207、app/zh/blog/yorifang/2020-10-24-arm-virtualization-overview.md:374 | ENOTFOUND |
| `https://talent-assessment.openeuler.org/` | app/.vitepress/src/i18n/common/common-en.ts:355、app/zh/news/openEuler/20231110-yuebao/20231110-yuebao.md:384 | ENOTFOUND |
| `https://talent-assessment.openeuler.org/#/` | app/zh/news/20230811-yuebao/20230811-yuebao.md:498、app/zh/news/20230908-yuebao/20230908-yuebao.md:458、app/zh/news/openEuler/2022-09-yuebao/20220927-yuebao.md:182 | ENOTFOUND |
| `https://test.openeuler.org` | tests/canonical-tdk.test.ts:106、tests/geo-config.test.ts:467、tests/geo-missing-pages.test.ts:918、tests/jsonld-cleanup.test.ts:355、tests/setjsonld-dedup.test.ts:132、tests/setjsonld-dedup.test.ts:135、tests/setjsonld-dedup.test.ts:140、tests/setjsonld-dedup.test.ts:141、tests/setjsonld-dedup.test.ts:143、tests/showcase-sig-geo.test.ts:511 | ENOTFOUND |
| `https://training-assessment.osinfra.cn/portal/1519850993951571970?sxz-lang=zh_CN` | app/zh/news/20230407-bh/20230407-bh.md:73 | ENOTFOUND |
| `https://www.chinainternetwatch.com/22936/public-cloud-market-share-h1-2017/` | app/en/blog/bluesky1213/2020-06-30-The-Future-of-Cloud-in-a-COVID-19-Era.md:20 | ERR_TLS_CERT_ALTNAME_INVALID |
| `https://www.cnii.com.cn/gxxww/rmydb/202303/t20230324_457148.html` | app/zh/news/20230331-dd.md:14 | ETIMEDOUT |
| `https://www.cnii.com.cn/rmydb/202304/t20230425_466024.html` | app/zh/news/20230428-renmin/20230428-renmin.md:89 | UNABLE_TO_VERIFY_LEAF_SIGNATURE |
| `https://www.data-infrastructure.eu/GAIAX/Navigation/EN/Home/home.html` | app/en/blog/bluesky1213/2020-06-30-The-Future-of-Cloud-in-a-COVID-19-Era.md:70、app/en/blog/bluesky1213/2020-06-30-The-Future-of-Cloud-in-a-COVID-19-Era.md:74 | ENOTFOUND |
| `https://www.linux-mtd.infradead.org/doc/ubifs.html` | app/zh/blog/20250212-fsck/20250212-fsck.md:44 | ERR_TLS_CERT_ALTNAME_INVALID |
| `https://www.openeuler.org/zh/interaction/summit-list/devday2022/` | app/en/blog/rosinL/2022-4-26-Ceph Community News_(2022-3-15_to_2022-4-15).md:18、app/zh/blog/rosinL/2022-4-26-Ceph Community News_(2022-3-15_to_2022-4-15).md:19 | ENOTFOUND |
| `https://www.secpulse.com/archives/71898.html` | app/zh/blog/cascades/2021-8-14-Learning-About-libFuzzer.md:110 | CERT_HAS_EXPIRED |
| `https://www.st.com/content/st_com/en.html` | app/en/news/20250228-report/openEuler Monthly Bulletin - January.md:54 | AbortError |
| `https://www.st.com/en/microcontrollers-microprocessors/stm32mp257.html` | app/en/news/20250228-report/openEuler Monthly Bulletin - January.md:54 | AbortError |
| `https://www.tensorflow.org/install/source` | app/zh/news/20230614-CCF/20230614-CCF.md:73 | TypeError |
| `https://www.xsky.com` | app/zh/blog/genedna/xsky-ceph-sig.md:28 | AbortError |
| `https://www.zhihedongfang.com/8919.html` | app/zh/blog/xing_zhu/20200214_some_problems_about_IP.md:52 | ERR_TLS_CERT_ALTNAME_INVALID |
