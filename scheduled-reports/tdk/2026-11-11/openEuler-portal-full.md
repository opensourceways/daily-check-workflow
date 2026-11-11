# TDK 重复检查完全版报告 · openEuler 官网（openEuler-portal）

- 检查时间：2026-11-11T11:45:08.147Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML（与 JSON-LD 维度共用同一份抓取），对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）
- canonical 豁免：同值组内每一页都声明了 `<link rel="canonical">` 且统一指向同一个规范版本 URL 时，视为站点已主动指定规范版本，不计重复；此类组单列在"canonical 豁免组"章节供复核
- 分级说明（2026-11 起）：keywords 重复为告警级——重复组明细仍列于本报告与 stats 供整改参考，但不触发提单；提单触发条件 = title/description 重复（canonical 豁免后）或三字段任一缺失
- 白名单跳过：URL 命中项目配置的 `tdkWhitelist`（projects.config.json）或 `--tdk-whitelist` 参数（两者并集；以 `/` 开头的条目按 URL 路径前缀匹配，其余按正则匹配（完整 URL 与 pathname 任一命中））的页面整页不参与判重与缺失检查，明细见完全版报告"TDK 白名单跳过页面"章节；仅影响 TDK 维度，JSON-LD 维度不受影响


### openEuler 官网（openEuler-portal）

- sitemap：https://www.openeuler.org/sitemap.xml，收集页面 2042 个，成功抓取 484 个，失败 0 个
- ℹ️ TDK 白名单跳过 1558/2042 个页面（命中 tdkWhitelist/--tdk-whitelist 的路径前缀或正则，不参与判重/缺失检查）

#### TDK 白名单跳过页面（共 1558 页，不参与判重/缺失检查）

白名单规则（projects.config.json 的 tdkWhitelist 与 --tdk-whitelist 并集）：`^/(?:zh|en)/sig/[^/]+$`、`^/(?:zh|en)/(?:blog|news)/(?:[^/]+/)*[^/]*$`

- https://www.openeuler.org/en/blog/004History-of-Linux-kernel-3/ 
- https://www.openeuler.org/en/blog/02-oeDeploy/DeepSeek1 
- https://www.openeuler.org/zh/blog/02-oeDeploy/DeepSeek1 
- https://www.openeuler.org/en/blog/03-DeepSeek2/2 
- https://www.openeuler.org/zh/blog/03-DeepSeek2/2 
- https://www.openeuler.org/en/blog/03-DeepSeek3/1 
- https://www.openeuler.org/zh/blog/03-DeepSeek3/1 
- https://www.openeuler.org/en/blog/2011-11-12-01/01 
- https://www.openeuler.org/zh/blog/2011-11-12-01/01 
- https://www.openeuler.org/en/blog/202030721-Kmesh/202030721-Kmesh 
- https://www.openeuler.org/zh/blog/202030721-Kmesh/202030721-Kmesh 
- https://www.openeuler.org/en/blog/2022-08-23/use-canonical-maas-deploy-openeuler-test 
- https://www.openeuler.org/zh/blog/2022-08-23/use-canonical-maas-deploy-openeuler-test 
- https://www.openeuler.org/en/blog/2022-08-27/StratoVirt-vCPU 
- https://www.openeuler.org/zh/blog/2022-08-27/StratoVirt-vCPU 
- https://www.openeuler.org/en/blog/2022-08-29/migration_Target 
- https://www.openeuler.org/en/blog/2022-10-12%20StratoVirt%20%20PCI/StratoVirt%20%20PCI 
- https://www.openeuler.org/zh/blog/2022-10-12%20StratoVirt%20%20PCI/StratoVirt%20%20PCI 
- https://www.openeuler.org/en/blog/2022-10-12%20ziyuan/ziyuan 
- https://www.openeuler.org/zh/blog/2022-10-12%20ziyuan/ziyuan 
- https://www.openeuler.org/en/blog/2022-10-12-HPC/HPC 
- https://www.openeuler.org/zh/blog/2022-10-12-HPC/HPC 
- https://www.openeuler.org/en/blog/2022-10-12Embedded%20SIG/Embedded%20SIG 
- https://www.openeuler.org/zh/blog/2022-10-12Embedded%20SIG/Embedded%20SIG 
- https://www.openeuler.org/en/blog/2022-10-20-NestOS/NestOS 
- https://www.openeuler.org/zh/blog/2022-10-20-NestOS/NestOS 
- https://www.openeuler.org/en/blog/2022-10-20-renwu/renwu 
- https://www.openeuler.org/zh/blog/2022-10-20-renwu/renwu 
- https://www.openeuler.org/en/blog/2022-11-12-02/02 
- https://www.openeuler.org/zh/blog/2022-11-12-02/02 
- https://www.openeuler.org/en/blog/2022-11-12-03/03 
- https://www.openeuler.org/zh/blog/2022-11-12-03/03 
- https://www.openeuler.org/en/blog/2022-11-12-04/04 
- https://www.openeuler.org/zh/blog/2022-11-12-04/04 
- https://www.openeuler.org/en/blog/2022-11-12-06/06 
- https://www.openeuler.org/zh/blog/2022-11-12-06/06 
- https://www.openeuler.org/en/blog/2022-11-12-RFO/RFO 
- https://www.openeuler.org/zh/blog/2022-11-12-RFO/RFO 
- https://www.openeuler.org/en/blog/2022-11-25-cla/CLA%E7%AD%BE%E7%BD%B2%E6%B5%81%E7%A8%8B 
- https://www.openeuler.org/zh/blog/2022-11-25-cla/CLA%E7%AD%BE%E7%BD%B2%E6%B5%81%E7%A8%8B 
- https://www.openeuler.org/en/blog/2022-12-16-CPDS/CPDS 
- https://www.openeuler.org/zh/blog/2022-12-16-CPDS/CPDS 
- https://www.openeuler.org/en/blog/2022-12-16-eBPF/ebpf 
- https://www.openeuler.org/zh/blog/2022-12-16-eBPF/ebpf 
- https://www.openeuler.org/en/blog/20220628-em-duoos/Embedded%20SIG%20-%20Multi-OS%20Hybrid%20Deployment%20%20Linux%20Server%20OS 
- https://www.openeuler.org/en/blog/20220628-x86/20220628 
- https://www.openeuler.org/zh/blog/20220628-x86/20220628 
- https://www.openeuler.org/en/blog/20220629-sig-qa/20220629 
- https://www.openeuler.org/zh/blog/20220629-sig-qa/20220629 
- https://www.openeuler.org/en/blog/20220701-centos/20220701 
- https://www.openeuler.org/zh/blog/20220701-centos/20220701 
- https://www.openeuler.org/en/blog/20220705-01ziyuanliyonglv/openeuler-01ziyuanliyonglv 
- https://www.openeuler.org/zh/blog/20220705-01ziyuanliyonglv/openeuler-01ziyuanliyonglv 
- https://www.openeuler.org/en/blog/20220706-bisheng-variable/20220706-variable 
- https://www.openeuler.org/zh/blog/20220706-bisheng-variable/20220706-variable 
- https://www.openeuler.org/en/blog/20220707-LibcarePlus-rebuding/20220707-LibcarePlus-rebuding 
- https://www.openeuler.org/zh/blog/20220707-LibcarePlus-rebuding/20220707-LibcarePlus-rebuding 
- https://www.openeuler.org/en/blog/20220722-embedded-fenbushi/fenbushi 
- https://www.openeuler.org/zh/blog/20220722-embedded-fenbushi/fenbushi 
- https://www.openeuler.org/en/blog/20220726-banqian-mysql/banqian-mysql 
- https://www.openeuler.org/zh/blog/20220726-banqian-mysql/banqian-mysql 
- https://www.openeuler.org/en/blog/20220802-loop-interchange/20220802-loop-interchange 
- https://www.openeuler.org/zh/blog/20220802-loop-interchange/20220802-loop-interchange 
- https://www.openeuler.org/en/blog/20220806-02ziyuanliyong/openEulerziyuanliyong 
- https://www.openeuler.org/zh/blog/20220806-02ziyuanliyong/openEulerziyuanliyong 
- https://www.openeuler.org/en/blog/20220809-startovirt-xiniwangka/stratovirt-xuniwangka 
- https://www.openeuler.org/zh/blog/20220809-startovirt-xiniwangka/stratovirt-xuniwangka 
- https://www.openeuler.org/en/blog/20220822-%E5%AF%84%E5%AD%98%E5%99%A8%E5%88%86%E9%85%8D/%E5%AF%84%E5%AD%98%E5%99%A8%E5%88%86%E9%85%8D 
- https://www.openeuler.org/zh/blog/20220822-%E5%AF%84%E5%AD%98%E5%99%A8%E5%88%86%E9%85%8D/%E5%AF%84%E5%AD%98%E5%99%A8%E5%88%86%E9%85%8D 
- https://www.openeuler.org/en/blog/2023-1-6-Rancher/Rancher 
- https://www.openeuler.org/zh/blog/2023-1-6-Rancher/Rancher 
- https://www.openeuler.org/en/blog/20230113-RISC/RISC 
- https://www.openeuler.org/zh/blog/20230113-RISC/RISC 
- https://www.openeuler.org/en/blog/20230113-segear/secGear 
- https://www.openeuler.org/zh/blog/20230113-segear/secGear 
- https://www.openeuler.org/en/blog/20230113-%E8%B5%84%E6%BA%90/ZIYUAN5 
- https://www.openeuler.org/zh/blog/20230113-%E8%B5%84%E6%BA%90/ZIYUAN5 
- https://www.openeuler.org/en/blog/20230118-liufushou/liufushou 
- https://www.openeuler.org/zh/blog/20230118-liufushou/liufushou 
- https://www.openeuler.org/en/blog/20230118-xiasenlin/xiasenlin 
- https://www.openeuler.org/zh/blog/20230118-xiasenlin/xiasenlin 
- https://www.openeuler.org/en/blog/20230118-ziyuan/ziyuan 
- https://www.openeuler.org/zh/blog/20230118-ziyuan/ziyuan 
- https://www.openeuler.org/en/blog/20230206-RocksDB-openEuler%E7%A7%BB%E6%A4%8D%E6%A1%88%E4%BE%8B/20230206-RocksDB-openEuler%E7%A7%BB%E6%A4%8D%E6%A1%88%E4%BE%8B/RocksDB%206.10.2%20%E5%AE%89%E8%A3%85%E6%8C%87%E5%8D%97(openEuler%2022.03%20LTS) 
- https://www.openeuler.org/en/blog/20230208-Etcd-openEuler-porting-guide/etcd-3.76%20Porting%20Guide%20(openEuler%2022.03%20LTS) 
- https://www.openeuler.org/en/blog/20230213-rancher/20230210-rancher 
- https://www.openeuler.org/zh/blog/20230213-rancher/20230210-rancher 
- https://www.openeuler.org/en/blog/20230224-A-Ops/20230224-A-Ops 
- https://www.openeuler.org/zh/blog/20230224-A-Ops/20230224-A-Ops 
- https://www.openeuler.org/en/blog/20230303-RISC-V/20230303-RISC-V 
- https://www.openeuler.org/zh/blog/20230303-RISC-V/20230303-RISC-V 
- https://www.openeuler.org/en/blog/20230303-kechongfu/20230303-kechongfu 
- https://www.openeuler.org/zh/blog/20230303-kechongfu/20230303-kechongfu 
- https://www.openeuler.org/en/blog/20230303-member/20230303-member 
- https://www.openeuler.org/zh/blog/20230303-member/20230303-member 
- https://www.openeuler.org/en/blog/20230320-Aops/20230320-Aops 
- https://www.openeuler.org/zh/blog/20230320-Aops/20230320-Aops 
- https://www.openeuler.org/en/blog/20230325-ZVM/20230325-ZVM 
- https://www.openeuler.org/zh/blog/20230325-ZVM/20230325-ZVM 
- https://www.openeuler.org/en/blog/20230428-K3s/20230428-K3s 
- https://www.openeuler.org/zh/blog/20230428-K3s/20230428-K3s 
- https://www.openeuler.org/en/blog/20230428-NFS/20230428-NFS 
- https://www.openeuler.org/zh/blog/20230428-NFS/20230428-NFS 
- https://www.openeuler.org/en/blog/20230428-isulad/20230428-isulad 
- https://www.openeuler.org/zh/blog/20230428-isulad/20230428-isulad 
- https://www.openeuler.org/en/blog/20230428-rust/20230428-rust 
- https://www.openeuler.org/zh/blog/20230428-rust/20230428-rust 
- https://www.openeuler.org/en/blog/20230428-syscare/20230428-syscare 
- https://www.openeuler.org/zh/blog/20230428-syscare/20230428-syscare 
- https://www.openeuler.org/en/blog/20230506-riscv/riscv 
- https://www.openeuler.org/en/blog/20230512-sysMaster/20230512-sysMaster 
- https://www.openeuler.org/zh/blog/20230512-sysMaster/20230512-sysMaster 
- https://www.openeuler.org/en/blog/20230519-EUR/20230519-EUR 
- https://www.openeuler.org/zh/blog/20230519-EUR/20230519-EUR 
- https://www.openeuler.org/en/blog/20230519-infrastructure/20230519-infrastructure 
- https://www.openeuler.org/zh/blog/20230519-infrastructure/20230519-infrastructure 
- https://www.openeuler.org/en/blog/20230529-Musl/20230529-Musl 
- https://www.openeuler.org/zh/blog/20230529-Musl/20230529-Musl 
- https://www.openeuler.org/en/blog/20230529-zhongyi/20230529-zhongyi 
- https://www.openeuler.org/zh/blog/20230529-zhongyi/20230529-zhongyi 
- https://www.openeuler.org/en/blog/20230530-OrbStack/Orbstack%E6%94%AF%E6%8C%81openEuler%E5%8F%91%E8%A1%8C%E7%89%88 
- https://www.openeuler.org/zh/blog/20230530-OrbStack/Orbstack%E6%94%AF%E6%8C%81openEuler%E5%8F%91%E8%A1%8C%E7%89%88 
- https://www.openeuler.org/en/blog/20230602-Arm/20230602-Arm 
- https://www.openeuler.org/zh/blog/20230602-Arm/20230602-Arm 
- https://www.openeuler.org/en/blog/20230630-RocketMQ/20230630-RocketMQ 
- https://www.openeuler.org/zh/blog/20230630-RocketMQ/20230630-RocketMQ 
- https://www.openeuler.org/en/blog/20230630-newcomer/0630-newcomer 
- https://www.openeuler.org/zh/blog/20230630-newcomer/0630-newcomer 
- https://www.openeuler.org/en/blog/20230728-FangTian/20230728-FangTian 
- https://www.openeuler.org/zh/blog/20230728-FangTian/20230728-FangTian 
- https://www.openeuler.org/en/blog/20230728-metalink/20230728-metalink 
- https://www.openeuler.org/zh/blog/20230728-metalink/20230728-metalink 
- https://www.openeuler.org/en/blog/20230731-container-problem-detection-system/Harden%20Your%20Container%20Clusters%20with%20the%20Container%20Problem%20Detection%20System 
- https://www.openeuler.org/en/blog/20230810-ros/Robot%20Operating%20System 
- https://www.openeuler.org/en/blog/20230811-NKD/20230811-NKD 
- https://www.openeuler.org/zh/blog/20230811-NKD/20230811-NKD 
- https://www.openeuler.org/en/blog/20230811-waaagh/openEuler-DE-in-WSL 
- https://www.openeuler.org/en/blog/20230811-yidong/20230811-yidong 
- https://www.openeuler.org/zh/blog/20230811-yidong/20230811-yidong 
- https://www.openeuler.org/en/blog/20230818-AMIs/AMIs 
- https://www.openeuler.org/en/blog/20230818-BLAS/20230818-BLAS 
- https://www.openeuler.org/zh/blog/20230818-BLAS/20230818-BLAS 
- https://www.openeuler.org/en/blog/20230818-gala-ops/Enable%20Full-Stack%20Performance%20Monitoring%20with%20gala-ops%20Flame%20Graph 
- https://www.openeuler.org/en/blog/20230818-secGear/Getting%20to%20Know%20Confidential%20Computing%20with%20secGear 
- https://www.openeuler.org/en/blog/20230908-EulerPublisher 
- https://www.openeuler.org/zh/blog/20230908-EulerPublisher 
- https://www.openeuler.org/en/blog/20230908-KubeOS/Schedule%20Container%20OS%20Upgrades%20Using%20KubeOS 
- https://www.openeuler.org/en/blog/20230908-WSL/Enable%20Full-Stack%20Performance%20Monitoring%20with%20gala-ops%20Flame%20Graph 
- https://www.openeuler.org/en/blog/20230908-omnidata/20230908-omnidata 
- https://www.openeuler.org/zh/blog/20230908-omnidata/20230908-omnidata 
- https://www.openeuler.org/en/blog/20230908-service-meshes/Service%20Meshes 
- https://www.openeuler.org/en/blog/20230908-user-repo/openEuler%20User%20Repo%20Is%20Released 
- https://www.openeuler.org/en/blog/20230915-Cantian/20230915-Cantian 
- https://www.openeuler.org/zh/blog/20230915-Cantian/20230915-Cantian 
- https://www.openeuler.org/en/blog/20230922-sysMaster/20230922-sysMaster 
- https://www.openeuler.org/zh/blog/20230922-sysMaster/20230922-sysMaster 
- https://www.openeuler.org/en/blog/20230925-fangtian/20230925-fangtian 
- https://www.openeuler.org/zh/blog/20230925-fangtian/20230925-fangtian 
- https://www.openeuler.org/en/blog/20231009-CANTIAN 
- https://www.openeuler.org/zh/blog/20231009-CANTIAN 
- https://www.openeuler.org/en/blog/20231019-NFS/Multipathing%20NFS%20for%20High%20Performance%20and%20Reliability 
- https://www.openeuler.org/en/blog/20231019-WSL-package/Exploring%20openEuler%20on%20Windows%20with%20the%20WSL%20Package 
- https://www.openeuler.org/en/blog/20231020-EulerPublisher/20231020-EulerPublisher 
- https://www.openeuler.org/zh/blog/20231020-EulerPublisher/20231020-EulerPublisher 
- https://www.openeuler.org/en/blog/20231020-HPC/20231020-HPC 
- https://www.openeuler.org/zh/blog/20231020-HPC/20231020-HPC 
- https://www.openeuler.org/en/blog/20231020-nestos/20231020-nestos 
- https://www.openeuler.org/zh/blog/20231020-nestos/20231020-nestos 
- https://www.openeuler.org/en/blog/20231027-23.09/20231027-23.09 
- https://www.openeuler.org/zh/blog/20231027-23.09/20231027-23.09 
- https://www.openeuler.org/en/blog/20231101-KconfigDetector/KconfigDetector%20Helps%20Check%20Value%20Errors%20in%20Kernel%20Configurations 
- https://www.openeuler.org/en/blog/20231103-dpu/20231103-dpu 
- https://www.openeuler.org/zh/blog/20231103-dpu/20231103-dpu 
- https://www.openeuler.org/en/blog/20231103-isulad/20231103-isulad 
- https://www.openeuler.org/zh/blog/20231103-isulad/20231103-isulad 
- https://www.openeuler.org/en/blog/20231120-agith/20231120-agith 
- https://www.openeuler.org/zh/blog/20231120-agith/20231120-agith 
- https://www.openeuler.org/en/blog/20231127-iSulad/20231127-iSulad 
- https://www.openeuler.org/zh/blog/20231127-iSulad/20231127-iSulad 
- https://www.openeuler.org/en/blog/20231205-ziyuan/20231205-ziyuan 
- https://www.openeuler.org/zh/blog/20231205-ziyuan/20231205-ziyuan 
- https://www.openeuler.org/en/blog/20231226-MICA/MICA%20Facilitates%20Mixed-Criticality%20Deployments 
- https://www.openeuler.org/en/blog/2024-10-15-boostYum/2024-10-15-boostYum 
- https://www.openeuler.org/zh/blog/2024-10-15-boostYum/2024-10-15-boostYum 
- https://www.openeuler.org/en/blog/2024.0411-ltf/LTF 
- https://www.openeuler.org/en/blog/20240111-blog1/20240111-blog1 
- https://www.openeuler.org/zh/blog/20240111-blog1/20240111-blog1 
- https://www.openeuler.org/en/blog/20240111-sec/20240111-sec 
- https://www.openeuler.org/zh/blog/20240111-sec/20240111-sec 
- https://www.openeuler.org/en/blog/20240122-gala/20240122-gala 
- https://www.openeuler.org/zh/blog/20240122-gala/20240122-gala 
- https://www.openeuler.org/en/blog/20240306-lkvs/20240306-lkvs 
- https://www.openeuler.org/zh/blog/20240306-lkvs/20240306-lkvs 
- https://www.openeuler.org/en/blog/20240306vmware/20240306vmware 
- https://www.openeuler.org/zh/blog/20240306vmware/20240306vmware 
- https://www.openeuler.org/en/blog/20240320-risc-v/openEuler%20RISC-V-based%20Robot%20Car%20Debuted%20at%20the%20XuanTie%20Conference 
- https://www.openeuler.org/en/blog/20240428-security/Secure!%20All%20openEuler%20Versions%20Are%20Not%20Affected%20by%20xz%20Backdoors 
- https://www.openeuler.org/en/blog/20241230-secgear/20241230-secgear 
- https://www.openeuler.org/zh/blog/20241230-secgear/20241230-secgear 
- https://www.openeuler.org/en/blog/20250107-sysarmor/20250107-sysarmor 
- https://www.openeuler.org/zh/blog/20250107-sysarmor/20250107-sysarmor 
- https://www.openeuler.org/en/blog/20250121-fastblock/20250121-fastblock 
- https://www.openeuler.org/zh/blog/20250121-fastblock/20250121-fastblock 
- https://www.openeuler.org/en/blog/20261015-Agentic%20Scaling%20with%20openEuler/20261015-Agentic%20Scaling%20with%20openEuler 
- https://www.openeuler.org/en/blog/Benshuai5D/2021-06-10-build-bishengJDK-rpm-package 
- https://www.openeuler.org/zh/blog/Benshuai5D/2021-06-10-build-bishengJDK-rpm-package 
- https://www.openeuler.org/en/blog/DCCooper/2020-09-15-isula-build-code-exploration 
- https://www.openeuler.org/zh/blog/DCCooper/2020-09-15-isula-build-code-exploration 
- https://www.openeuler.org/en/blog/Dingziwei/dzw/DingZiwei 
- https://www.openeuler.org/en/blog/G11N-SIG/20230527-Open%20the%20Door%20to%20openEuler/Open%20the%20Door%20to%20openEuler 
- https://www.openeuler.org/en/blog/G11N-SIG/20230527-openEuler%20in%20Edge-Cloud%20Synergy/openEuler%20in%20Edge-Cloud%20Synergy 
- https://www.openeuler.org/en/blog/G11N-SIG/20230605-Rancher%20and%20openEuler%20%E2%80%93%20Move%20into%20the%20Future%20with%20AWS%20AMIs/Rancher%20and%20openEuler%20%E2%80%93%20Move%20into%20the%20Future%20with%20AWS%20AMIs 
- https://www.openeuler.org/en/blog/G11N-SIG/20230605-openEuler%20Embedded%20for%20Multi-OS%20Hybrid%20Deployment/openEuler%20Embedded%20for%20Multi-OS%20Hybrid%20Deployment 
- https://www.openeuler.org/en/blog/G11N-SIG/20230615-StratoVirt/Why%20StratoVirt%20Instead%20of%20QEMU 
- https://www.openeuler.org/en/blog/G11N-SIG/20230615-embedded/openEuler%20Embedded%20--%20Towards%20Multi-Scenario%20Embedded%20Platforms 
- https://www.openeuler.org/en/blog/G11N-SIG/20230630-cpu-preemption/CPU%20Preemption%20in%20openEuler 
- https://www.openeuler.org/en/blog/G11N-SIG/20230630-memory-tiering/Memory%20Tiering%20in%20openEuler 
- https://www.openeuler.org/en/blog/G11N-SIG/20230721-BiSheng-JDK/Dynamic%20CDS%20of%20BiSheng%20JDK%208%20Enables%20Dynamic%20Archiving%20of%20Classes%20in%20openEuler 
- https://www.openeuler.org/en/blog/G11N-SIG/20230721-WasmEngine/openEuler%20Supports%20WasmEngine%20for%20Sandboxed%20Function%20Management 
- https://www.openeuler.org/en/blog/G11N-SIG/20230725-Bioconductor/Bridging%20the%20Gap%20Arm64%20Compatibility%20and%20BioConductor%20on%20openEuler 
- https://www.openeuler.org/en/blog/G11N-SIG/20231113-openGemini/openGemini%20Time%20Series%20Database 
- https://www.openeuler.org/en/blog/G11N-SIG/20231113-sysMaster/sysMaster%20Is%20openEuler%20New%20Implementation%20of%20PID%201 
- https://www.openeuler.org/en/blog/G11N-SIG/20240116-memory-management/20240116-memory-management 
- https://www.openeuler.org/en/blog/G11N-SIG/20240223-safeguard-your-os/Safeguard%20Your%20OS 
- https://www.openeuler.org/en/blog/G11N-SIG/20240312-CPU-isolation/CPU%20Isolation%20by%20openEuler 
- https://www.openeuler.org/en/blog/G11N-SIG/20240412-SysCare/SysCare%E2%80%94openEuler%20Secret%20Weapon%20for%20Live%20Patching 
- https://www.openeuler.org/en/blog/G11N-SIG/20240513-eulercopilot/Let%20EulerCopilot%20Ride%20Shotgun%20Along%20Your%20openEuler%20Journey 
- https://www.openeuler.org/en/blog/G11N-SIG/20240525-gcc/GCC%20for%20openEuler 
- https://www.openeuler.org/en/blog/MrRlu/2020-12-04-cloud-native-network-dp-analysis 
- https://www.openeuler.org/zh/blog/MrRlu/2020-12-04-cloud-native-network-dp-analysis 
- https://www.openeuler.org/en/blog/MrRlu/2021-01-04-openEuler-eBPF-introduce 
- https://www.openeuler.org/zh/blog/MrRlu/2021-01-04-openEuler-eBPF-introduce 
- https://www.openeuler.org/en/blog/Nelson-He/2022-09-09-install 
- https://www.openeuler.org/zh/blog/Nelson-He/2022-09-09-install 
- https://www.openeuler.org/en/blog/NestOS-OpenStack/ 
- https://www.openeuler.org/zh/blog/NestOS-OpenStack/ 
- https://www.openeuler.org/en/blog/RISC-V/ 
- https://www.openeuler.org/zh/blog/RISC-V/ 
- https://www.openeuler.org/en/blog/RabeLi/Autodockvina/AutoDockvina-1.2.3-migrate 
- https://www.openeuler.org/zh/blog/RabeLi/Autodockvina/AutoDockvina-1.2.3-migrate 
- https://www.openeuler.org/en/blog/RabeLi/SeqKit2.2.0/SeqKit-2.2.0-migrate 
- https://www.openeuler.org/zh/blog/RabeLi/SeqKit2.2.0/SeqKit-2.2.0-migrate 
- https://www.openeuler.org/en/blog/ZihaoChang/2020-11-29-qemu-qmp 
- https://www.openeuler.org/zh/blog/ZihaoChang/2020-11-29-qemu-qmp 
- https://www.openeuler.org/en/blog/bluesky1213/2020-06-30-The-Future-of-Cloud-in-a-COVID-19-Era 
- https://www.openeuler.org/en/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer 
- https://www.openeuler.org/zh/blog/cascades/2021-8-14-Learning-About-QEMU-Fuzzer 
- https://www.openeuler.org/en/blog/cascades/2021-8-14-Learning-About-libFuzzer 
- https://www.openeuler.org/zh/blog/cascades/2021-8-14-Learning-About-libFuzzer 
- https://www.openeuler.org/en/blog/compile_success/2021-01-23-dnspooq 
- https://www.openeuler.org/zh/blog/compile_success/2021-01-23-dnspooq 
- https://www.openeuler.org/en/blog/cve-3094 
- https://www.openeuler.org/zh/blog/cve-3094 
- https://www.openeuler.org/en/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38 
- https://www.openeuler.org/zh/blog/dwl301/2021-10-12-openEuler-21.09_Installing_GNOME3.38 
- https://www.openeuler.org/en/blog/fred_li/2020-03-03-license-update 
- https://www.openeuler.org/en/blog/fred_li/2020-03-25-apply-for-vm-from-pcl 
- https://www.openeuler.org/zh/blog/fred_li/2020-03-25-apply-for-vm-from-pcl 
- https://www.openeuler.org/en/blog/ftboy/20231221-SqlServerMigration 
- https://www.openeuler.org/zh/blog/ftboy/20231221-SqlServerMigration 
- https://www.openeuler.org/en/blog/gaohuatao/2021-04-09-isulad-shimv1-shimv2-diff 
- https://www.openeuler.org/zh/blog/gaohuatao/2021-04-09-isulad-shimv1-shimv2-diff 
- https://www.openeuler.org/en/blog/georgecao/QuickIssue 
- https://www.openeuler.org/zh/blog/georgecao/QuickIssue 
- https://www.openeuler.org/en/blog/georgecao/openEuler-sig-member-management 
- https://www.openeuler.org/zh/blog/georgecao/openEuler-sig-member-management 
- https://www.openeuler.org/en/blog/gitee-cmd/Guide-for-Uploading-a-Software-Package-to-the-openEuler-Community 
- https://www.openeuler.org/zh/blog/gitee-cmd/Guide-for-Uploading-a-Software-Package-to-the-openEuler-Community 
- https://www.openeuler.org/en/blog/haozi007/2020-09-09-isulad-benchmark 
- https://www.openeuler.org/zh/blog/haozi007/2020-09-09-isulad-benchmark 
- https://www.openeuler.org/en/blog/haozi007/2020-09-09-isulad-json-parse_Target 
- https://www.openeuler.org/en/blog/judithsq/2022-02-15-get-started-with-openEuler-community 
- https://www.openeuler.org/en/blog/jzy0/2020-08-20-run-qemu-in-nonroot-mode 
- https://www.openeuler.org/zh/blog/jzy0/2020-08-20-run-qemu-in-nonroot-mode 
- https://www.openeuler.org/en/blog/kezhiming/2021-01-20-virttest-avocado-vt 
- https://www.openeuler.org/zh/blog/kezhiming/2021-01-20-virttest-avocado-vt 
- https://www.openeuler.org/en/blog/leikeke/summit%202020/BPF/BPF 
- https://www.openeuler.org/zh/blog/leikeke/summit%202020/BPF/BPF 
- https://www.openeuler.org/en/blog/leofang94/2020-12-01-version-rec-auto-upgrade-of-openEuler-Advisor 
- https://www.openeuler.org/zh/blog/leofang94/2020-12-01-version-rec-auto-upgrade-of-openEuler-Advisor 
- https://www.openeuler.org/en/blog/lifeng2221dd1/2020-09-14-isulad-architecture 
- https://www.openeuler.org/zh/blog/lifeng2221dd1/2020-09-14-isulad-architecture 
- https://www.openeuler.org/en/blog/lijiajie128/2020-09-01-CVE-2020-14364-QEMU-USB-array-out-of-range 
- https://www.openeuler.org/zh/blog/lijiajie128/2020-09-01-CVE-2020-14364-QEMU-USB-array-out-of-range 
- https://www.openeuler.org/en/blog/lijiajie128/2020-11-03-ELF%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F%E8%A7%A3%E6%9E%90 
- https://www.openeuler.org/zh/blog/lijiajie128/2020-11-03-ELF%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F%E8%A7%A3%E6%9E%90 
- https://www.openeuler.org/en/blog/lijiajie128/2020-11-09-%E9%9D%99%E6%80%81%E9%93%BE%E6%8E%A5%E4%B8%8E%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5 
- https://www.openeuler.org/zh/blog/lijiajie128/2020-11-09-%E9%9D%99%E6%80%81%E9%93%BE%E6%8E%A5%E4%B8%8E%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5 
- https://www.openeuler.org/en/blog/lijiajie128/2020-11-10-%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5%E4%B8%AD%E7%9A%84PLT%E4%B8%8EGOT 
- https://www.openeuler.org/zh/blog/lijiajie128/2020-11-10-%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5%E4%B8%AD%E7%9A%84PLT%E4%B8%8EGOT 
- https://www.openeuler.org/en/blog/likejun/2020-11-30-1 
- https://www.openeuler.org/en/blog/likejun/2020-11-30 
- https://www.openeuler.org/en/blog/lingff/2021-04-18-Using%20-A-Tune-on-openEuler 
- https://www.openeuler.org/zh/blog/lingff/2021-04-18-Using%20-A-Tune-on-openEuler 
- https://www.openeuler.org/en/blog/liqunsheng/2020-11-26-swap 
- https://www.openeuler.org/zh/blog/liqunsheng/2020-11-26-swap 
- https://www.openeuler.org/en/blog/liujingang09/2020-6-24-announce-cna 
- https://www.openeuler.org/zh/blog/liujingang09/2020-6-24-announce-cna 
- https://www.openeuler.org/en/blog/liujingang09/2021-01-29-sudo-cve-2021-3156 
- https://www.openeuler.org/zh/blog/liujingang09/2021-01-29-sudo-cve-2021-3156 
- …其余 1258 个见 stats JSON（tdk-duplicate-stats.json 的 whitelistSkipped.urls）

#### title 重复检查

共 1 组重复，涉及 2 个页面

##### [重复 2 次] openEuler | openEuler

- https://www.openeuler.org/en/sig/sig-guidance/ 
- https://www.openeuler.org/en/sig/sig-list/ 

#### description 重复检查

共 2 组重复，涉及 7 个页面

##### [重复 4 次] openEuler 是一个开源、免费的 Linux 发行版平台，将通过开放的社区形式与全球的开发者共同构建一个开放、多元和架构包容的软件生态体系。同时，openEuler 也是一个创新的平台，鼓励任何人在该平台上提出新想法、开拓新思路、实践新方案。

- https://www.openeuler.org/zh/sig/role-description/ 
- https://www.openeuler.org/zh/sig/sig-guidance/ 
- https://www.openeuler.org/zh/sig/sig-list/ 
- https://www.openeuler.org/zh/sig/meeting-guide/ 

##### [重复 3 次] openEuler is an open source, free Linux distribution platform. The platform provides an open community for global developers to build an open, diversified, and architecture-inclusive software ecosystem. openEuler is also an innovative platform that encourages everyone to propose new ideas, explore new approaches, and practice new solutions.

- https://www.openeuler.org/en/sig/role-description/ 
- https://www.openeuler.org/en/sig/sig-guidance/ 
- https://www.openeuler.org/en/sig/sig-list/ 

#### keywords 重复检查（告警级，不触发提单）

共 32 组重复，涉及 83 个页面

##### [重复 6 次] OS migration, Linux os, open source, centos

- https://www.openeuler.org/en/migration/advantage/ 
- https://www.openeuler.org/en/migration/background/ 
- https://www.openeuler.org/en/migration/contact/ 
- https://www.openeuler.org/en/migration/download/ 
- https://www.openeuler.org/en/migration/guidance/ 
- https://www.openeuler.org/en/migration/ 

##### [重复 6 次] openEuler,北京,meetup,社区活动,Meetup,开源社区

- https://www.openeuler.org/zh/interaction/event-list/openEuler-ai-os-innovation-meetup-beijing 
- https://www.openeuler.org/zh/interaction/event-list/openEuler-cloud-native-middleware-meetup 
- https://www.openeuler.org/zh/interaction/event-list/openEuler-compiler-sig-meetup-beijing 
- https://www.openeuler.org/zh/interaction/event-list/openEuler-diverse-computing-meetup-beijing 
- https://www.openeuler.org/zh/interaction/event-list/openEuler-sig-long-heterogeneous-computing-meetup-beijing 
- https://www.openeuler.org/zh/interaction/event-list/openEuler-on-risc-v-deepin-meetup-beijing 

##### [重复 4 次] openEuler,能源,国家电网,电力

- https://www.openeuler.org/zh/showcase/energy/006e41a2-9e5f-621a3b40396e/ 
- https://www.openeuler.org/zh/showcase/energy/009e4e30-a3e5-ecc4bdfd977b/ 
- https://www.openeuler.org/zh/showcase/energy/guangfu/ 
- https://www.openeuler.org/zh/showcase/energy/guojiadianw/ 

##### [重复 4 次] openEuler,运营商,中国移动,运营商案例

- https://www.openeuler.org/zh/showcase/provider/005p41c5-a0b2-e850f4211aa0/ 
- https://www.openeuler.org/zh/showcase/provider/BCLinux/ 
- https://www.openeuler.org/zh/showcase/provider/yidongyun/ 
- https://www.openeuler.org/zh/showcase/provider/zhongyizaixian/ 

##### [重复 3 次] openEuler下载,openEuler镜像下载,openEuler ISO镜像,openEuler社区官网,openEuler镜像,开源Linux系统,开源社区

- https://www.openeuler.org/zh/download/archive/ 
- https://www.openeuler.org/zh/download/commercial-release/ 
- https://www.openeuler.org/zh/download/ 

##### [重复 3 次] openEuler,Energy,State Grid Corporation of China,power grid

- https://www.openeuler.org/en/showcase/energy/006e41a2-9e5f-621a3b40396e/ 
- https://www.openeuler.org/en/showcase/energy/008e41fd-9185-f62d7485475e/ 
- https://www.openeuler.org/en/showcase/energy/009e4e30-a3e5-ecc4bdfd977b/ 

##### [重复 3 次] openEuler,运营商,中国联通,运营商案例

- https://www.openeuler.org/zh/showcase/provider/004p4b57-9e02-e2a6aa4f6a8b/ 
- https://www.openeuler.org/zh/showcase/others/liantongyiliao/ 
- https://www.openeuler.org/zh/showcase/provider/liantong/ 

##### [重复 3 次] openEuler,运营商,天翼云科技有限公司,运营商案例

- https://www.openeuler.org/zh/showcase/provider/tianyiyun0330/ 
- https://www.openeuler.org/zh/showcase/provider/tianyiyu0911n/ 
- https://www.openeuler.org/zh/showcase/provider/tianyiyun/ 

##### [重复 3 次] openEuler,金融,某银行,金融案例

- https://www.openeuler.org/zh/showcase/finance/19mou/19mou 
- https://www.openeuler.org/zh/showcase/finance/20mou/20mou 
- https://www.openeuler.org/zh/showcase/finance/21mou/21mou 

##### [重复 3 次] openEuler,金融,浙商银行,金融案例

- https://www.openeuler.org/zh/showcase/finance/zhejiang/ 
- https://www.openeuler.org/zh/showcase/finance/zhes12/zhes12 
- https://www.openeuler.org/zh/showcase/finance/zheshang/ 

##### [重复 3 次] openEuler,西安,meetup,社区活动,Meetup,开源社区

- https://www.openeuler.org/zh/interaction/event-list/openEuler-cloud-native-middleware-meetup-xian 
- https://www.openeuler.org/zh/interaction/event-list/openEuler-embedded-agiros-embodied-intelligence-meetup-xian 
- https://www.openeuler.org/zh/interaction/event-list/openEuler-meetup-x-opengauss-meetup-xian 

##### [重复 2 次] openEuler开源贡献,openEuler社区贡献,贡献攻略,开源成长,开源学习,openEuler社区官网

- https://www.openeuler.org/zh/community/contribution/detail 
- https://www.openeuler.org/zh/community/contribution/ 

##### [重复 2 次] openEuler兼容性列表,openEuler兼容性测评,openEuler社区官网

- https://www.openeuler.org/zh/compatibility/hardware/ 
- https://www.openeuler.org/zh/compatibility/ 

##### [重复 2 次] open source event, developer event, open source conference, open source summit, meetup

- https://www.openeuler.org/en/interaction/event-list/ 
- https://www.openeuler.org/en/interaction/summit-list/sig-gathering-2024/ 

##### [重复 2 次] OS, openEuler, open source, summit, AI

- https://www.openeuler.org/en/interaction/summit-list/summit2023/ 
- https://www.openeuler.org/en/interaction/summit-list/summit2024/ 

##### [重复 2 次] openEuler, China Zheshang Bank, Finance, case study, openEuler showcase

- https://www.openeuler.org/en/showcase/finance/China-Zheshang-Bank-12/ 
- https://www.openeuler.org/en/showcase/finance/China-Zheshang-Bank-13/ 

##### [重复 2 次] openEuler, Industrial Bank, Finance, case study, openEuler showcase

- https://www.openeuler.org/en/showcase/finance/Industrial-Bank-09/ 
- https://www.openeuler.org/en/showcase/finance/industrial-bank-08/ 

##### [重复 2 次] openEuler,金融,恒生电子,金融案例

- https://www.openeuler.org/zh/showcase/finance/hengsheng/ 
- https://www.openeuler.org/zh/showcase/finance/18hengsheng/18hengsheng 

##### [重复 2 次] openEuler, China Mobile Zhejiang, Provider, case study, openEuler showcase

- https://www.openeuler.org/en/showcase/provider/China-Mobile-Zhejiang-23/ 
- https://www.openeuler.org/en/showcase/provider/China-Mobile-Zhejiang-26/ 

##### [重复 2 次] openEuler, China Unicom, Provider, case study, openEuler showcase

- https://www.openeuler.org/en/showcase/provider/China-Unicom-24/ 
- https://www.openeuler.org/en/showcase/provider/China-Unicom-25/ 

##### [重复 2 次] openEuler, 用户组, 社区活动

- https://www.openeuler.org/zh/community/user-group/detail/ 
- https://www.openeuler.org/zh/community/user-group/ 

##### [重复 2 次] openEuler,云计算,天翼云科技有限公司,云平台

- https://www.openeuler.org/zh/showcase/cloud-computing/CTyunOS/ 
- https://www.openeuler.org/zh/showcase/cloud-computing/tianyiyun/ 

##### [重复 2 次] openEuler,金融,兴业银行,金融案例

- https://www.openeuler.org/zh/showcase/finance/002f4aba-b77a-8b7003668b01/ 
- https://www.openeuler.org/zh/showcase/finance/xingye/ 

##### [重复 2 次] openEuler,金融,平安银行,金融案例

- https://www.openeuler.org/zh/showcase/finance/7pingan 
- https://www.openeuler.org/zh/showcase/finance/8pingan/8pingan 

##### [重复 2 次] openEuler,金融,中国工商银行,金融案例

- https://www.openeuler.org/zh/showcase/finance/gongshang/ 
- https://www.openeuler.org/zh/showcase/finance/gs/gs 

##### [重复 2 次] openEuler,金融,中国银行,金融案例

- https://www.openeuler.org/zh/showcase/finance/zgyh12/zgyh12 
- https://www.openeuler.org/zh/showcase/finance/zhongguoyinhang/zhongguoyinhang 

##### [重复 2 次] openEuler,其他行业,轩田科技

- https://www.openeuler.org/zh/showcase/others/20/20 
- https://www.openeuler.org/zh/showcase/others/9/9 

##### [重复 2 次] openEuler,其他行业,科来网络技术股份有限公司

- https://www.openeuler.org/zh/showcase/others/kelai1/ 
- https://www.openeuler.org/zh/showcase/others/kelai2/ 

##### [重复 2 次] openEuler,其他行业,四川中电启明星技术有限公司

- https://www.openeuler.org/zh/showcase/others/starvcenter/ 
- https://www.openeuler.org/zh/showcase/others/zhongdian/ 

##### [重复 2 次] openEuler,成都,meetup,社区活动,Meetup,开源社区

- https://www.openeuler.org/zh/interaction/event-list/openEuler-sbom-intelligence-sig-meetup-chengdu 
- https://www.openeuler.org/zh/interaction/event-list/openEuler-deepin-meetup-chengdu 

##### [重复 2 次] openEuler,香港,meetup,社区活动,Meetup,开源社区

- https://www.openeuler.org/zh/interaction/event-list/openEuler-intelligence-meetup-hong-kong 
- https://www.openeuler.org/zh/interaction/event-list/openEuler-meetup-hong-kong 

##### [重复 2 次] openEuler,线上,meetup,社区活动,Meetup,开源社区

- https://www.openeuler.org/zh/interaction/event-list/openEuler-sds-meetup-online 
- https://www.openeuler.org/zh/interaction/event-list/openEuler-intelligence-meetup-online 

#### TDK 缺失检查

共 7 个页面存在 TDK 缺失

##### keywords 缺失（7 页）

- https://www.openeuler.org/en/sig/role-description/ （元素缺失）
- https://www.openeuler.org/zh/sig/role-description/ （元素缺失）
- https://www.openeuler.org/en/sig/sig-guidance/ （元素缺失）
- https://www.openeuler.org/zh/sig/sig-guidance/ （元素缺失）
- https://www.openeuler.org/en/sig/sig-list/ （元素缺失）
- https://www.openeuler.org/zh/sig/sig-list/ （元素缺失）
- https://www.openeuler.org/zh/sig/meeting-guide/ （元素缺失）
