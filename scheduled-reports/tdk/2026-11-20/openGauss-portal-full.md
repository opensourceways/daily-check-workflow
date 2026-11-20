# TDK 重复检查完全版报告 · openGauss 官网（openGauss-portal）

- 检查时间：2026-11-20T07:57:59.706Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML（与 JSON-LD 维度共用同一份抓取），对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）
- canonical 豁免：同值组内每一页都声明了 `<link rel="canonical">` 且统一指向同一个规范版本 URL 时，视为站点已主动指定规范版本，不计重复；此类组单列在"canonical 豁免组"章节供复核
- 分级说明（2026-11 起）：keywords 重复为告警级——重复组明细仍列于本报告与 stats 供整改参考，但不触发提单；提单触发条件 = title/description 重复（canonical 豁免后）或三字段任一缺失
- 白名单跳过：URL 命中项目配置的 `tdkWhitelist`（projects.config.json）或 `--tdk-whitelist` 参数（两者并集；以 `/` 开头的条目按 URL 路径前缀匹配，其余按正则匹配（完整 URL 与 pathname 任一命中））的页面整页不参与判重与缺失检查，明细见完全版报告"TDK 白名单跳过页面"章节；仅影响 TDK 维度，JSON-LD 维度不受影响


### openGauss 官网（openGauss-portal）

- sitemap：https://opengauss.org/sitemap.xml，收集页面 1343 个，成功抓取 362 个，失败 0 个
- ℹ️ TDK 白名单跳过 981/1343 个页面（命中 tdkWhitelist/--tdk-whitelist 的路径前缀或正则，不参与判重/缺失检查）

#### TDK 白名单跳过页面（共 981 页，不参与判重/缺失检查）

白名单规则（projects.config.json 的 tdkWhitelist 与 --tdk-whitelist 并集）：`^/(?:zh|en)/(?:news|blogs)/.+`

- https://opengauss.org/en/blogs/2022/A-Leap-of-openGauss-from-Standalone-System-to-Distributed-System.html 
- https://opengauss.org/en/blogs/2022/Automatic-Test-Framework-YAT.html 
- https://opengauss.org/en/blogs/2022/Basic-Principles-of-the-Patroni-for-openGauss-HA-Solution.html 
- https://opengauss.org/en/blogs/2022/Basic-Use-of-the-Fully-encrypted-Database.html 
- https://opengauss.org/en/blogs/2022/Compilation-Guide-for-openGauss-Under-Heterogeneous-Conditions.html 
- https://opengauss.org/en/blogs/2022/Core-Technologies-of-openGauss-Database-(I).html 
- https://opengauss.org/en/blogs/2022/Core-Technologies-of-openGauss-Database-(II).html 
- https://opengauss.org/en/blogs/2022/DB4AI-Enabling-Database-Native-AI-Computing-and-Facilitating-Service-Success-in-the-Data-Lake-Sce.html 
- https://opengauss.org/en/blogs/2022/Discussion-on-openGauss-Memory-Management.html 
- https://opengauss.org/en/blogs/2022/Dynamic-Data-Masking-of-openGauss.html 
- https://opengauss.org/en/blogs/2022/Everything-You-Want-to-Know-About-the-openGauss-Ledger-Database.html 
- https://opengauss.org/en/blogs/2022/Full-encryption-Upgrade-and-Unaware-Encryption-Decryption-Principle-Analysis.html 
- https://opengauss.org/en/blogs/2022/Guide-to-Adapting-HAProxy-to-openGauss.html 
- https://opengauss.org/en/blogs/2022/Internal-Mechanism-of-the-openGauss-DB4AI-Framework.html 
- https://opengauss.org/en/blogs/2022/Introduction-to-Multi-Core-Optimization-of-openGauss-on-Kunpeng-Servers.html 
- https://opengauss.org/en/blogs/2022/New-Feature-of-openGauss-3-0-0-Parallel-Decoding.html 
- https://opengauss.org/en/blogs/2022/Permission-Management-Model-of-the-openGauss-Database-(Continued).html 
- https://opengauss.org/en/blogs/2022/Permission-Management-Model-of-the-openGauss-Database.html 
- https://opengauss.org/en/blogs/2022/SQL-Engine-Source-Parsing.html 
- https://opengauss.org/en/blogs/2022/Segment-Page-Feature-of-openGauss-for-Solving-File-Storage-Problems.html 
- https://opengauss.org/en/blogs/2022/Setting-up-One-Primary-and-Two-Standby-openGauss-Databases-on-Kubernetes.html 
- https://opengauss.org/en/blogs/2022/The-Combination-of-openGauss-Database-and-AI.html 
- https://opengauss.org/en/blogs/2022/Transaction-Mechanism-Source-Code-Analysis.html 
- https://opengauss.org/en/blogs/2022/Using-DataChecker-to-Ensure-Data-Accuracy-After-Migration.html 
- https://opengauss.org/en/blogs/2022/Using-Ora2Pg-to-Migrate-Data-from-Oracle-to-openGauss.html 
- https://opengauss.org/en/blogs/2022/Using-pg_chameleon-to-Migrate-Data-from-MySQL-to-openGauss.html 
- https://opengauss.org/en/blogs/2022/Using-pgloader-to-Migrate-Data-from-MySQL-to-openGauss.html 
- https://opengauss.org/en/blogs/2022/Using-the-Python-Driver-psycopg2-of-openGauss.html 
- https://opengauss.org/en/blogs/2022/Ustore-Rebuilding-the-Soul-of-openGauss-Data-Storage.html 
- https://opengauss.org/en/blogs/2022/openGauss-AI-Capability-Upgrade-Building-a-New-AI-Native-Database.html 
- https://opengauss.org/en/blogs/2022/openGauss-AI4DB-and-DB4AI.html 
- https://opengauss.org/en/blogs/2022/openGauss-Database-Performance-Optimization.html 
- https://opengauss.org/en/blogs/2022/openGauss-Log-Consensus-Framework.html 
- https://opengauss.org/en/blogs/2022/openGauss-Supports-SM3-and-SM4-Algorithms.html 
- https://opengauss.org/en/blogs/RDMA/RDMA_Network_Guide.html 
- https://opengauss.org/en/blogs/guidance/ 
- https://opengauss.org/zh/blogs/guidance/ 
- https://opengauss.org/en/blogs/weak-modules/Modification_of_the_weak-modules_Script_for_OS_Compatibility.html 
- https://opengauss.org/en/news/2020-06-15/20200615.html 
- https://opengauss.org/en/news/2020-07-01/20200701.html 
- https://opengauss.org/zh/news/2020-07-01/20200701.html 
- https://opengauss.org/en/news/2020-10-12/20201012.html 
- https://opengauss.org/zh/news/2020-10-12/20201012.html 
- https://opengauss.org/en/news/2020-12-31/20201231.html 
- https://opengauss.org/zh/news/2020-12-31/20201231.html 
- https://opengauss.org/en/news/2021-01-07/cloudsbrain.html 
- https://opengauss.org/zh/news/2021-01-07/cloudsbrain.html 
- https://opengauss.org/en/news/2021-04-01/20210401.html 
- https://opengauss.org/zh/news/2021-04-01/20210401.html 
- https://opengauss.org/en/news/2021-09-30/20210930.html 
- https://opengauss.org/zh/news/2021-09-30/20210930.html 
- https://opengauss.org/zh/blogs/13J43QKKKAA/CentOS7-3%E5%AE%89%E8%A3%85openGauss1-0-1%E4%B8%BB%E5%A4%87.html 
- https://opengauss.org/zh/blogs/2022/CentOS-7-9-%E5%AE%89%E8%A3%85-openGauss-2-1-0-%E4%B9%8B%E5%89%A5%E8%8C%A7%E6%8A%BD%E4%B8%9D.html 
- https://opengauss.org/zh/blogs/2022/CentOs%E8%99%9A%E6%8B%9F%E6%9C%BA%E4%B8%8Bopengauss%E7%9A%84%E9%85%8D%E7%BD%AE%E4%BD%BF%E7%94%A8.html 
- https://opengauss.org/zh/blogs/2022/Go%E8%AF%AD%E8%A8%80%E8%BF%9E%E6%8E%A5openGauss%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA%E8%BF%87%E7%A8%8B%EF%BC%88%E5%90%ABOG%E5%AE%89%E8%A3%85%EF%BC%89.html 
- https://opengauss.org/zh/blogs/2022/MOGDB-openGauss%E6%95%B0%E6%8D%AE%E5%BA%93gs_dump%E5%A4%87%E4%BB%BD%E8%84%9A%E6%9C%AC%E5%8F%8A%E5%A4%87%E4%BB%BD%E6%B8%85%E7%90%86.html 
- https://opengauss.org/zh/blogs/2022/MOGDB-openGauss%E7%9A%84txid_snapshot-%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E5%92%8C%E7%9B%B8%E5%85%B3%E5%87%BD%E6%95%B0.html 
- https://opengauss.org/zh/blogs/2022/MogDB-openGauss-%E8%87%AA%E5%AE%9A%E4%B9%89snmptrapd%E5%91%8A%E8%AD%A6%E4%BF%A1%E6%81%AF.html 
- https://opengauss.org/zh/blogs/2022/MogDB-openGauss%E5%85%B3%E4%BA%8EPL-SQL%E5%8C%BF%E5%90%8D%E5%9D%97%E8%B0%83%E7%94%A8%E6%B5%8B%E8%AF%95.html 
- https://opengauss.org/zh/blogs/2022/MogDB-opengauss%E6%9B%B4%E6%94%B9%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9B%AE%E5%BD%95%E4%BD%8D%E7%BD%AE(%E5%BB%BA%E8%AE%AE%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83).html 
- https://opengauss.org/zh/blogs/2022/centos7-%E5%AE%89%E8%A3%85openGauss%E6%9E%81%E7%AE%80%E7%89%88%E6%9C%AC.html 
- https://opengauss.org/zh/blogs/2022/node_exporter-%E8%87%AA%E5%AE%9A%E4%B9%89%E7%9B%91%E6%8E%A7%E6%8C%87%E6%A0%87.html 
- https://opengauss.org/zh/blogs/2022/openGauss-MOT%E5%AD%98%E5%82%A8%E5%BC%95%E6%93%8E.html 
- https://opengauss.org/zh/blogs/2022/openGauss-MogDB-TPCH%E6%80%A7%E8%83%BD%E6%B5%8B%E8%AF%95%E6%AD%A5%E9%AA%A4.html 
- https://opengauss.org/zh/blogs/2022/openGauss-MogDB%E5%A4%A7%E5%AF%B9%E8%B1%A1LargeObject%E5%AD%98%E5%8F%96%E6%B5%8B%E8%AF%95.html 
- https://opengauss.org/zh/blogs/2022/openGauss-gsql-%E5%B8%B8%E7%94%A8%E5%85%83%E5%91%BD%E4%BB%A4-%E4%B8%80.html 
- https://opengauss.org/zh/blogs/2022/openGauss-gsql-%E5%B8%B8%E7%94%A8%E5%85%83%E5%91%BD%E4%BB%A4-%E4%BA%8C.html 
- https://opengauss.org/zh/blogs/2022/openGauss%E4%B8%AD%E7%9A%84SQL%E5%BC%95%E6%93%8E%E4%BB%8B%E7%BB%8D.html 
- https://opengauss.org/zh/blogs/2022/openGauss%E4%BA%8B%E5%8A%A1%E6%9C%BA%E5%88%B6%E4%B8%ADMVCC%E6%8A%80%E6%9C%AF%E7%9A%84%E5%AE%9E%E7%8E%B0%E5%88%86%E6%9E%90.html 
- https://opengauss.org/zh/blogs/2022/openGauss%E5%86%85%E6%A0%B8%E5%88%86%E6%9E%90%EF%BC%88%E4%B8%80%EF%BC%89-%E5%A4%9A%E7%BA%BF%E7%A8%8B%E6%9E%B6%E6%9E%84%E5%90%AF%E5%8A%A8%E8%BF%87%E7%A8%8B%E8%AF%A6%E8%A7%A3.html 
- https://opengauss.org/zh/blogs/2022/openGauss%E5%8D%95%E6%9C%BA%E9%83%A8%E7%BD%B2.html 
- https://opengauss.org/zh/blogs/2022/openGauss%E5%90%91%E9%87%8F%E5%8C%96%E5%BC%95%E6%93%8E--hash-join.html 
- https://opengauss.org/zh/blogs/2022/opengauss%E6%95%B0%E6%8D%AE%E5%BA%93-PITR%E6%81%A2%E5%A4%8D.html 
- https://opengauss.org/zh/blogs/2022/opengauss%E6%95%B0%E6%8D%AE%E5%BA%93-%E4%B8%BB%E4%BB%8E%E6%90%AD%E5%BB%BA.html 
- https://opengauss.org/zh/blogs/2022/opengauss%E6%95%B0%E6%8D%AE%E5%BA%93-%E5%8F%82%E6%95%B0%E4%BC%98%E5%8C%96.html 
- https://opengauss.org/zh/blogs/2022/opengauss%E6%95%B0%E6%8D%AE%E5%BA%93-%E5%9C%B0%E7%90%86%E5%9D%90%E6%A0%87gis%E5%AE%89%E8%A3%85.html 
- https://opengauss.org/zh/blogs/2022/opengauss%E6%95%B0%E6%8D%AE%E5%BA%93-%E9%AB%98%E5%8F%AF%E7%94%A8jdbc%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95.html 
- https://opengauss.org/zh/blogs/2022/opengauss%E6%95%B0%E6%8D%AE%E5%BA%93-%E9%AB%98%E5%8F%AF%E7%94%A8%E9%83%A8%E7%BD%B2mogha.html 
- https://opengauss.org/zh/blogs/2022/zabbix-%E7%9B%91%E6%8E%A7-MogDB-openGauss-%E4%B9%8B-%E9%87%87%E9%9B%86prometheus%E6%95%B0%E6%8D%AE.html 
- https://opengauss.org/zh/blogs/2022/%E5%8D%8E%E4%B8%BAopenGauss%E6%95%B0%E6%8D%AE%E5%BA%93%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8.html 
- https://opengauss.org/zh/blogs/2022/%E5%9B%BD%E4%BA%A7%E5%BC%80%E6%BA%90%E6%95%B0%E6%8D%AE%E5%BA%93openGauss%E7%9A%84%E5%AE%89%E8%A3%85%E8%BF%90%E8%A1%8C.html 
- https://opengauss.org/zh/blogs/2022/%E5%9F%BA%E4%BA%8EopenGauss%E5%AD%A6%E4%B9%A0Docker.html 
- https://opengauss.org/zh/blogs/2022/%E5%BB%BA%E8%AE%AE%E6%94%B6%E8%97%8F-%E5%9C%A8openGauss%E4%B8%8A%E9%81%87%E5%88%B0%E6%85%A2SQL%E8%AF%A5%E6%80%8E%E4%B9%88%E5%8A%9E.html 
- https://opengauss.org/zh/blogs/2022/%E5%BE%AA%E5%BA%8F%E6%B8%90%E8%BF%9B-openGauss-GUC-%E5%8F%82%E6%95%B0%E7%9A%84%E5%AE%9A%E4%B9%89-%E5%BC%95%E5%AF%BC%E5%92%8C%E5%88%97%E8%A1%A8.html 
- https://opengauss.org/zh/blogs/2022/%E9%85%8D%E7%BD%AEMogDB-openGauss%E7%9A%84grafana-%E7%9A%84dashboard.html 
- https://opengauss.org/zh/blogs/2026-06-03/blog.html 
- https://opengauss.org/zh/blogs/20260226_oGRAC/20260226_oGRAC.html 
- https://opengauss.org/zh/blogs/20260318_oG-Memory/20260318_oG-Memory.html 
- https://opengauss.org/zh/blogs/20260325_openGauss%20AI%20Pipeline/20260325_openGauss%20AI%20Pipeline.html 
- https://opengauss.org/zh/blogs/20260812-openGauss%20SIG%20Meeting%20Guide/openGauss-SIG%E4%BC%9A%E8%AE%AE%E6%8C%87%E5%8D%97.html 
- https://opengauss.org/zh/blogs/Apricity/2022-09-29-%E3%80%90%E6%88%91%E5%92%8CopenGauss%E7%9A%84%E6%95%85%E4%BA%8B%E3%80%91%E5%88%9D%E8%AF%86openGauss.html 
- https://opengauss.org/zh/blogs/ArsuKron/2022-11-21-openGauss%E6%95%B0%E6%8D%AE%E5%BA%93%E4%BD%BF%E7%94%A8%E5%88%86%E4%BA%AB-01.html 
- https://opengauss.org/zh/blogs/Carl/addr2line%E8%A7%A3%E6%9E%90openGauss%E6%97%A5%E5%BF%97.html 
- https://opengauss.org/zh/blogs/Carl/%E5%88%A4%E6%96%AD%E5%A4%87%E6%9C%BA%E6%98%AF%E5%90%A6%E9%9C%80%E8%A6%81%E9%87%8D%E5%BB%BA.html 
- https://opengauss.org/zh/blogs/Carl/%E8%B5%84%E6%BA%90%E6%B1%A0%E5%8C%96multipath%E5%A4%9A%E8%B7%AF%E5%BE%84%E5%86%97%E4%BD%99%E9%85%8D%E7%BD%AE.html 
- https://opengauss.org/zh/blogs/Carl/%E8%B5%84%E6%BA%90%E6%B1%A0%E5%8C%96%E5%9F%BA%E4%BA%8EDORADO%E5%8F%8C%E9%9B%86%E7%BE%A4%E6%90%AD%E5%BB%BA%E6%8C%87%E5%8D%97%EF%BC%88%E9%9D%9E%E6%97%A5%E5%BF%97%E5%90%88%E4%B8%80%EF%BC%89.html 
- https://opengauss.org/zh/blogs/DarkAthena/%E3%80%90openGauss%E3%80%91%E5%9C%A8WPS%E8%A1%A8%E6%A0%BC%E9%87%8C%E5%88%B6%E4%BD%9C%E8%BF%9E%E6%8E%A5%E5%88%B0openGauss%E7%9A%84%E5%AE%9E%E6%97%B6%E5%88%B7%E6%96%B0%E6%8A%A5%E8%A1%A8.html 
- https://opengauss.org/zh/blogs/DarkAthena/%E4%B8%80%E7%A7%8D%E5%8F%AF%E8%83%BD%E6%98%AF%E7%9B%AE%E5%89%8D%E6%9C%80%E5%BF%AB%E7%9A%84%E4%BB%8EORACLE%E5%90%8C%E6%AD%A5%E6%95%B0%E6%8D%AE%E5%88%B0MogDB(openGauss)%E7%9A%84%E6%96%B9%E5%BC%8F.html 
- https://opengauss.org/zh/blogs/DarkAthena/%E4%B8%A4%E7%A7%8D%E5%9C%A8openGauss%E4%B8%AD%E4%BD%BF%E7%94%A8%E5%AD%98%E5%82%A8%E8%BF%87%E7%A8%8B%E7%94%9F%E6%88%90%E6%96%87%E6%9C%AC%E6%96%87%E4%BB%B6%E7%9A%84%E6%96%B9%E5%BC%8F.html 
- https://opengauss.org/zh/blogs/DarkAthena/%E5%9C%A8windows%E4%B8%AD%E4%BD%BF%E7%94%A8%E5%AE%B9%E5%99%A8%E5%8C%96%E7%9A%84mogeaver.html 
- https://opengauss.org/zh/blogs/Frank/openGauss%203.0.0%20%E8%BD%BB%E9%87%8F%E7%89%88%E9%83%A8%E7%BD%B2.html 
- https://opengauss.org/zh/blogs/Frank/openGauss%20MogDB%20WDR%E6%8A%A5%E5%91%8A%E8%AF%A6%E8%A7%A3.html 
- https://opengauss.org/zh/blogs/Frank/openGauss%20MogDB%E8%84%9A%E6%9C%AC%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90%EF%BC%882%EF%BC%89%E2%80%94%E2%80%94%20gs_install_plugin%20gs_install_plugin_local.html 
- https://opengauss.org/zh/blogs/Frank/openGauss%20MogDB%E8%B0%83%E7%94%A8C%20FUNCTION.html 
- https://opengauss.org/zh/blogs/Frank/openGauss%E8%84%9A%E6%9C%AC%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90%EF%BC%881%EF%BC%89%E2%80%94%E2%80%94%20simpleInstall.html 
- https://opengauss.org/zh/blogs/Frank/openGauss%E8%B4%A6%E6%9C%AC%E6%95%B0%E6%8D%AE%E5%BA%93%EF%BC%8C%E4%BD%A0%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84%E9%82%A3%E4%BA%9B%E4%BA%8B%E5%84%BFopenGauss%E8%B4%A6%E6%9C%AC%E6%95%B0%E6%8D%AE%E5%BA%93%EF%BC%8C%E4%BD%A0%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84%E9%82%A3%E4%BA%9B%E4%BA%8B%E5%84%BF.html 
- https://opengauss.org/zh/blogs/Frank/%E6%B5%8B%E8%AF%84%E6%8A%A5%E5%91%8A%EF%BC%9A%E6%96%87%E4%BB%B6%E5%AF%BC%E5%85%A5%E5%93%AA%E5%AE%B6%E5%BC%BA%EF%BC%9F.html 
- https://opengauss.org/zh/blogs/IT%E7%83%A7%E9%BA%A6/python%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7%E8%BF%9E%E6%8E%A5openGauss%E6%95%B0%E6%8D%AE%E5%BA%93.html 
- https://opengauss.org/zh/blogs/July/JDBC%E9%A9%B1%E5%8A%A8%E8%BF%9E%E6%8E%A5MogDB-opengauss.html 
- https://opengauss.org/zh/blogs/July/MOGDB-openGauss%E7%B4%A2%E5%BC%95%E6%8E%A8%E8%8D%90%E5%8F%8A%E8%99%9A%E6%8B%9F%E7%B4%A2%E5%BC%95.html 
- https://opengauss.org/zh/blogs/July/MogDB-openGauss-%E5%BC%80%E6%9C%BA%E8%87%AA%E5%90%AF%E5%8A%A8.html 
- https://opengauss.org/zh/blogs/July/MogDB-openGauss%E5%B8%B8%E7%94%A8%E6%9F%A5%E8%AF%A2%E6%B1%87%E6%80%BB.html 
- https://opengauss.org/zh/blogs/July/ODBC%E9%A9%B1%E5%8A%A8%E8%BF%9E%E6%8E%A5MogDB-openGauss.html 
- https://opengauss.org/zh/blogs/July/VMware%E4%B8%8BCentOS7.6%E5%AE%89%E8%A3%85openGauss.html 
- https://opengauss.org/zh/blogs/July/openGauss-2-1-0-%E9%97%AA%E5%9B%9E%E7%89%B9%E6%80%A7.html 
- https://opengauss.org/zh/blogs/July/openGauss-B-tree%E7%B4%A2%E5%BC%95%E8%AF%BB%E5%86%99%E5%B9%B6%E5%8F%91%E5%8E%9F%E7%90%86.html 
- https://opengauss.org/zh/blogs/July/openGauss-B-tree%E7%B4%A2%E5%BC%95%E8%AF%BB%E5%86%99%E5%B9%B6%E5%8F%91%E5%AE%9E%E7%8E%B0.html 
- https://opengauss.org/zh/blogs/July/openGauss-Gin-%E7%B4%A2%E5%BC%95.html 
- https://opengauss.org/zh/blogs/July/openGauss-MogDB%E6%95%B0%E6%8D%AE%E5%BA%93%E5%AE%8C%E7%BE%8E%E9%80%82%E9%85%8DGrafana%E5%8F%8APrometheus.html 
- https://opengauss.org/zh/blogs/July/openGauss-MogDB%E6%95%B0%E6%8D%AE%E5%BA%93%E8%A7%A6%E5%8F%91%E5%99%A8%E5%88%86%E4%B8%A4%E6%AD%A5%E6%8B%86%E8%A7%A3%E5%88%9B%E5%BB%BA.html 
- https://opengauss.org/zh/blogs/July/openGauss-MogDB%E9%85%8D%E7%BD%AEIPv6.html 
- https://opengauss.org/zh/blogs/July/openGauss-MogDB%E9%9B%B6%E5%AD%97%E8%8A%82%E9%97%AE%E9%A2%98%E5%A4%84%E7%90%86.html 
- https://opengauss.org/zh/blogs/July/openGauss-SQL%E6%89%A7%E8%A1%8C%E5%99%A8.html 
- https://opengauss.org/zh/blogs/July/openGauss-gist-%E7%B4%A2%E5%BC%95.html 
- https://opengauss.org/zh/blogs/July/openGauss-%E5%88%97%E5%AD%98%E8%A1%A8PSort%E7%B4%A2%E5%BC%95.html 
- https://opengauss.org/zh/blogs/July/openGauss-%E5%B9%B6%E5%8F%91%E9%87%8D%E5%BB%BA%E7%B4%A2%E5%BC%95%E4%BB%A3%E7%A0%81%E5%AE%9E%E7%8E%B0.html 
- https://opengauss.org/zh/blogs/July/openGauss-%E9%94%81%E6%9C%BA%E5%88%B6%E5%AE%9E%E7%8E%B0%E6%B5%85%E6%9E%90.html 
- https://opengauss.org/zh/blogs/July/openGauss2-0-1%E7%9A%84%E5%AE%89%E8%A3%85%E6%AD%A5%E9%AA%A4.html 
- https://opengauss.org/zh/blogs/July/openGauss2-1-0%E5%9C%A8openEuler-20-03-LTS-SP2-%E5%AE%89%E8%A3%85%E5%90%8E-yum%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8%E7%9A%84%E9%97%AE%E9%A2%98%E8%A7%A3%E5%86%B3.html 
- https://opengauss.org/zh/blogs/July/openGauss2-1-0%E6%96%B0%E7%89%B9%E6%80%A7-%E8%B4%A6%E6%9C%AC%E6%95%B0%E6%8D%AE%E5%BA%93%E5%AE%9E%E9%AA%8C.html 
- https://opengauss.org/zh/blogs/July/openGauss%E4%B8%80%E4%B8%BB%E4%B8%80%E5%A4%87%E4%B8%80%E7%BA%A7%E5%AE%89%E8%A3%85.html 
- https://opengauss.org/zh/blogs/July/openGauss%E5%90%AF%E5%8A%A8-%E5%81%9C%E6%AD%A2-%E6%9F%A5%E7%9C%8B%E7%8A%B6%E6%80%81-%E5%88%87%E6%8D%A2%E4%B8%BB%E5%A4%87.html 
- https://opengauss.org/zh/blogs/July/openGauss%E5%A4%87%E4%BB%BD%E6%81%A2%E5%A4%8D.html 
- https://opengauss.org/zh/blogs/July/openGauss%E5%AE%89%E8%A3%85%E4%B8%8EJDBC%E8%BF%9E%E6%8E%A5%EF%BC%88%E4%BC%81%E4%B8%9A%E7%89%88%EF%BC%89.html 
- https://opengauss.org/zh/blogs/July/openGauss%E5%BB%BA%E7%AB%8B%E7%94%A8%E6%88%B7%E5%8F%8A%E5%AF%BC%E5%85%A5sql%E6%96%87%E6%9C%AC.html 
- https://opengauss.org/zh/blogs/July/openGauss%E6%95%B0%E6%8D%AE%E4%B8%8EPostgreSQL%E7%9A%84%E5%B7%AE%E5%BC%82%E5%AF%B9%E6%AF%94.html 
- https://opengauss.org/zh/blogs/July/openGauss%E6%95%B0%E6%8D%AE%E5%BA%93SQL%E6%A8%A1%E5%9D%97%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90.html 
- https://opengauss.org/zh/blogs/July/openGauss%E6%95%B0%E6%8D%AE%E5%BA%93log_hostname%E5%8F%82%E6%95%B0%E5%88%86%E6%9E%90.html 
- https://opengauss.org/zh/blogs/July/openGauss%E6%95%B0%E6%8D%AE%E5%BA%93xlog%E7%9B%AE%E5%BD%95%E6%BB%A1%E9%97%AE%E9%A2%98%E5%A4%84%E7%90%86.html 
- https://opengauss.org/zh/blogs/July/openGauss%E6%95%B0%E6%8D%AE%E5%BA%93%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE.html 
- https://opengauss.org/zh/blogs/July/openGauss%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E5%AE%89%E8%A3%85%E8%BF%90%E8%A1%8C.html 
- https://opengauss.org/zh/blogs/July/openGauss%E7%89%A9%E7%90%86%E5%A4%87%E4%BB%BD%E6%81%A2%E5%A4%8D%E4%B9%8Bgsbasebackup.html 
- https://opengauss.org/zh/blogs/July/openGauss%E7%9A%84WDR%E6%8A%A5%E5%91%8A%EF%BC%88%E7%B1%BB%E4%BC%BC%E4%BA%8EOracle%E7%9A%84awr%EF%BC%89.html 
- https://opengauss.org/zh/blogs/July/openGauss%E7%BE%A4%E9%9B%86%E5%A4%87%E8%8A%82%E7%82%B9%E7%8A%B6%E6%80%81%E4%BF%AE%E5%A4%8D.html 
- https://opengauss.org/zh/blogs/July/openGauss%E9%80%BB%E8%BE%91%E5%A4%87%E4%BB%BD%E5%8F%8A%E6%81%A2%E5%A4%8D.html 
- https://opengauss.org/zh/blogs/July/%E4%B8%80%E9%94%AE%E9%83%A8%E7%BD%B2openGauss2-0-1-CentOS-7-6.html 
- https://opengauss.org/zh/blogs/July/%E5%8D%B8%E8%BD%BDopenGauss.html 
- https://opengauss.org/zh/blogs/July/%E5%A6%82%E4%BD%95%E5%9C%A8openGauss-2-1-0%E4%B8%AD%E4%BD%BF%E7%94%A8Job.html 
- https://opengauss.org/zh/blogs/July/%E5%BE%AA%E5%BA%8F%E6%B8%90%E8%BF%9B-openGauss-%E5%88%9D%E5%A7%8B%E5%8C%96%E5%8F%82%E6%95%B0%E7%9A%84%E8%AE%BE%E7%BD%AE-%E6%9F%A5%E8%AF%A2%E5%92%8C%E4%BF%AE%E6%94%B9.html 
- https://opengauss.org/zh/blogs/July/%E6%A2%A6%E5%B9%BB%E8%81%94%E5%8A%A8-MogDB-openGauss%E4%B8%8EShardingSphere%E5%9C%A8tpcc%E4%B8%8A%E7%9A%84%E8%A1%A8%E7%8E%B0.html 
- https://opengauss.org/zh/blogs/July/%E7%BA%AFSQL%E7%94%9F%E6%88%90openGauss%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84html%E5%B7%A1%E6%A3%80%E6%8A%A5%E5%91%8A.html 
- https://opengauss.org/zh/blogs/July/%E9%80%9A%E7%94%A8%E6%90%9C%E7%B4%A2%E6%A0%91.html 
- https://opengauss.org/zh/blogs/PARKERljc/2021-12-4-CentOs%E8%99%9A%E6%8B%9F%E6%9C%BA%E4%B8%8Bopengauss%E7%9A%84%E9%85%8D%E7%BD%AE%E4%BD%BF%E7%94%A8.html 
- https://opengauss.org/zh/blogs/PARKERljc/2021-12-4-openGauss%E6%95%B0%E6%8D%AE%E5%BA%93%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0-%E6%8C%87%E6%A0%87%E9%87%87%E9%9B%86%E3%80%81%E9%A2%84%E6%B5%8B%E4%B8%8E%E5%BC%82%E5%B8%B8%E6%A3%80%E6%B5%8B.html 
- https://opengauss.org/zh/blogs/RDMA/RDMA.html 
- https://opengauss.org/zh/blogs/RDMA/RDMA%E7%BD%91%E7%BB%9C%E6%8C%87%E5%AF%BC_2024.html 
- https://opengauss.org/zh/blogs/Rentc1/openGauss%E6%95%B0%E6%8D%AE%E5%BA%93%E5%A4%87%E4%BB%BD%E6%81%A2%E5%A4%8D.html 
- https://opengauss.org/zh/blogs/Ricardo/support-python3.x-Version.html 
- https://opengauss.org/zh/blogs/ShawnYan/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8Gitee%E5%90%91openGauss%E7%A4%BE%E5%8C%BA%E6%8F%90%E4%BA%A4%E5%8D%9A%E5%AE%A2.html 
- https://opengauss.org/zh/blogs/U/gs-probackup%E5%9C%A8%E9%9B%86%E7%BE%A4%E4%B8%AD%E7%9A%84%E5%A4%87%E4%BB%BD%E4%B8%8E%E6%81%A2%E5%A4%8D.html 
- https://opengauss.org/zh/blogs/adadaadadade/openGauss%E7%9A%84%E9%94%81%E6%9C%BA%E5%88%B6%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90.html 
- https://opengauss.org/zh/blogs/adadaadadade/%E5%9B%BD%E4%BA%A7%E5%BC%80%E6%BA%90%E6%95%B0%E6%8D%AE%E5%BA%93OpenGauss%E7%9A%84%E5%AE%89%E8%A3%85%E8%BF%90%E8%A1%8C.html 
- https://opengauss.org/zh/blogs/andy_ln/openGauss%E6%A6%82%E8%BF%B0.html 
- https://opengauss.org/zh/blogs/angryart/%E3%80%90%E6%88%91%E4%B8%8EopenGauss%E7%9A%84%E6%95%85%E4%BA%8B%E3%80%91SSM-MySQL%E6%9B%BF%E6%8D%A2%E6%8E%A2%E7%B4%A2%20opengauss3%E5%AF%B9%E6%AF%94postgresql12.html 
- https://opengauss.org/zh/blogs/angryart/%E3%80%90%E6%88%91%E4%B8%8EopenGauss%E7%9A%84%E6%95%85%E4%BA%8B%E3%80%91%E5%B9%B2%E8%B4%A7%E8%BE%93%E5%87%BA%E3%80%90SpringBoot-OpenGauss3%E5%BC%80%E5%8F%91%E5%85%A5%E9%97%A8%E3%80%91.html 
- https://opengauss.org/zh/blogs/angryart/%E3%80%90%E6%88%91%E4%B8%8EopenGauss%E7%9A%84%E6%95%85%E4%BA%8B%E3%80%91%E5%B9%B2%E8%B4%A7%E8%BE%93%E5%87%BA%E3%80%90%E5%BC%80%E6%BA%90Mall4j%E5%95%86%E5%9F%8E%E7%B3%BB%E7%BB%9F-MySQL5.7%E6%95%B0%E6%8D%AE%E5%BA%93%E5%BA%95%E5%BA%A7%E6%9B%BF%E6%8D%A2%E6%8E%A2%E7%B4%A2%E5%AE%9E%E8%B7%B5%E3%80%91.html 
- https://opengauss.org/zh/blogs/augenstern-su/2023-08-07-%E4%B8%80%E6%96%87%E5%B8%AE%E4%BD%A0%E7%90%86%E8%A7%A3Openguass%E7%9A%84%E9%AB%98%E5%8F%AF%E7%94%A8%E6%96%B9%E6%A1%88.html 
- https://opengauss.org/zh/blogs/awei/Centos7.9%E5%AE%89%E8%A3%85%E4%B8%8E%E9%85%8D%E7%BD%AE.html 
- https://opengauss.org/zh/blogs/awei/openGauss%E5%AE%89%E8%A3%85-%E8%BF%9E%E6%8E%A5.html 
- https://opengauss.org/zh/blogs/awei/%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90%EF%BC%9A%E4%BA%8B%E5%8A%A1%E7%AE%A1%E7%90%86%E5%99%A8.html 
- https://opengauss.org/zh/blogs/baikaishui/Vmware15-CentOS7.9%E5%AE%89%E8%A3%85openGauss.html 
- https://opengauss.org/zh/blogs/baikaishui/openGauss%E6%95%B0%E6%8D%AE%E5%BA%93%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90%E2%80%94%E2%80%94%E6%85%A2SQL%E6%A3%80%E6%B5%8B.html 
- https://opengauss.org/zh/blogs/benjieming/openGauss%E5%88%9D%E5%AD%A6%E8%80%85%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8.html 
- https://opengauss.org/zh/blogs/blog_example/20220901-sample-post.html 
- https://opengauss.org/zh/blogs/bsb/openGauss-UniqueSQLMappingLock-%E5%BC%82%E5%B8%B8%E7%AD%89%E5%BE%85%E5%AF%BC%E8%87%B4CPU%E4%BD%BF%E7%94%A8%E7%8E%87%E7%99%BE%E5%88%86%E7%99%BE%E6%95%85%E9%9A%9C%E5%88%86%E6%9E%90.html 
- https://opengauss.org/zh/blogs/bububiubiu/%E4%BB%8EOracle%E8%BF%81%E7%A7%BB%E5%88%B0openGauss%E5%AE%9E%E6%88%98%E5%88%86%E4%BA%AB.html 
- https://opengauss.org/zh/blogs/buter/k8Sinit_guide.html 
- https://opengauss.org/zh/blogs/cchen676/oGRAC_%E5%AE%89%E8%A3%85%E5%9F%BA%E4%BA%8EDSS%E5%92%8C%E7%A3%81%E9%98%B5%E7%9A%84%E4%B8%A4%E8%8A%82%E7%82%B9%E9%9B%86%E7%BE%A4.html 
- https://opengauss.org/zh/blogs/cchen676/oGRAC_%E7%BC%96%E8%AF%91%E5%AE%89%E8%A3%85%E5%9F%BA%E4%BA%8E%E6%9C%AC%E5%9C%B0%E7%9B%98%E7%9A%84%E5%8D%95%E8%8A%82%E7%82%B9%E7%8E%AF%E5%A2%83.html 
- https://opengauss.org/zh/blogs/cchen676/openGauss_%E4%BD%BF%E7%94%A8gs_initdb%E6%97%B6%E4%BF%9D%E7%95%99%E6%97%A7%E9%85%8D%E7%BD%AE%20.html 
- https://opengauss.org/zh/blogs/cchen676/openGauss_%E4%BD%BF%E7%94%A8gs_initdb%E6%97%B6%E4%BF%9D%E7%95%99%E6%97%A7%E9%85%8D%E7%BD%AE.html 
- https://opengauss.org/zh/blogs/cchen676/openGauss_%E7%BC%96%E8%AF%91%E5%AE%89%E8%A3%85%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF.html 
- https://opengauss.org/zh/blogs/cchen676/openGauss_%E8%B5%84%E6%BA%90%E6%B1%A0%E5%8C%96%E5%BC%80%E5%8F%91%E8%80%85%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97(%E4%B8%80).html 
- https://opengauss.org/zh/blogs/cchen676/openGauss_%E8%B5%84%E6%BA%90%E6%B1%A0%E5%8C%96%E5%BC%80%E5%8F%91%E8%80%85%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97(%E4%BA%8C).html 
- https://opengauss.org/zh/blogs/cchen676/openGauss%E4%B8%AD%E4%BD%BF%E7%94%A8gs_initdb%E6%97%B6%E4%BF%9D%E7%95%99%E6%97%A7%E9%85%8D%E7%BD%AE.html 
- https://opengauss.org/zh/blogs/chendong/HowToRunSimpleinstall.html 
- https://opengauss.org/zh/blogs/chenguang/openGauss%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE%E8%84%B1%E6%95%8F.html 
- https://opengauss.org/zh/blogs/chenxiaobin/%E5%A6%82%E4%BD%95%E6%8F%92%E4%BB%B6%E5%8C%96%E5%9C%B0%E4%B8%BAopenGauss%E6%B7%BB%E5%8A%A0%E7%AE%97%E5%AD%90.html 
- https://opengauss.org/zh/blogs/chenxiaobin/%E5%B0%86PostgreSQL%E6%8F%92%E4%BB%B6%E7%A7%BB%E6%A4%8D%E5%88%B0openGauss%E6%8C%87%E5%AF%BC.html 
- https://opengauss.org/zh/blogs/chunyangxu/2024-05-20-%E4%BB%8E%E8%BF%90%E7%BB%B4%E8%A7%86%E8%A7%92%E6%9D%A5%E8%A7%A3%E6%9E%90vacuum%E6%9C%BA%E5%88%B6%E4%B8%8E%E7%9B%B8%E5%85%B3%E5%8F%82%E6%95%B0%EF%BC%881%EF%BC%89.html 
- https://opengauss.org/zh/blogs/chunyangxu/2024-05-23-%E4%BB%8E%E8%BF%90%E7%BB%B4%E8%A7%86%E8%A7%92%E6%9D%A5%E8%A7%A3%E6%9E%90vacuum%E6%9C%BA%E5%88%B6%E8%B7%9F%E7%9B%B8%E5%85%B3%E5%8F%82%E6%95%B0(2).html 
- https://opengauss.org/zh/blogs/chunyangxu/2024-06-19-opengauss%E5%86%85%E5%AD%98%E5%88%86%E9%85%8D%E8%B7%9F%E8%B8%AA.html 
- https://opengauss.org/zh/blogs/cym/OpenGauss%E4%B8%AD%E7%9A%84AI%E6%8A%80%E6%9C%AF%E2%80%94%E2%80%94%E6%85%A2SQL%E7%9A%84%E6%A3%80%E6%B5%8B.html 
- https://opengauss.org/zh/blogs/cym/OpenGauss%E6%95%B0%E6%8D%AE%E5%BA%93%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8.html 
- https://opengauss.org/zh/blogs/datarinpoche/2024-03-04-Oracle%E5%88%B0openGauss%E7%9A%84SQL%E8%AF%AD%E5%8F%A5%E7%BA%A7%E8%B0%83%E4%BC%98.html 
- https://opengauss.org/zh/blogs/desgin/content_posts.html 
- https://opengauss.org/zh/blogs/dongxiaojie/openGauss6.0%E5%8D%95%E7%82%B9%E4%BC%81%E4%B8%9A%E7%89%88%E9%83%A8%E7%BD%B2_Centos7_x86.html 
- https://opengauss.org/zh/blogs/douxin/JDBC_usage_compile.html 
- https://opengauss.org/zh/blogs/douxin/database-sync_for_openGauss.html 
- https://opengauss.org/zh/blogs/douxin/haproxy_for_opengauss.html 
- https://opengauss.org/zh/blogs/douxin/sm3_for_openGauss.html 
- https://opengauss.org/zh/blogs/duanguoqiang/DataKit%E6%95%B0%E6%8D%AE%E8%BF%81%E7%A7%BB-1%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.html 
- https://opengauss.org/zh/blogs/duanguoqiang/DataKit%E6%95%B0%E6%8D%AE%E8%BF%81%E7%A7%BB-2%E5%AE%9E%E4%BE%8B%E6%90%AD%E5%BB%BA%E6%AD%A5%E9%AA%A4.html 
- https://opengauss.org/zh/blogs/duanguoqiang/DataKit%E6%95%B0%E6%8D%AE%E8%BF%81%E7%A7%BB-3%E5%89%8D%E7%BD%AE%E6%A0%A1%E9%AA%8C%E5%A4%B1%E8%B4%A5%E7%9A%84%E5%A4%84%E7%90%86.html 
- https://opengauss.org/zh/blogs/duomibabi/Oracle%E6%95%B0%E6%8D%AE%E8%A1%A8%E6%90%AC%E8%BF%81%E5%88%B0openGauss.html 
- https://opengauss.org/zh/blogs/duomibabi/gs-probackup%E7%BB%86%E9%A1%B9%E4%BD%BF%E7%94%A8.html 
- https://opengauss.org/zh/blogs/duomibabi/openGauss1-0-1%E6%94%AF%E6%8C%81docker%E4%B8%BB%E5%A4%87%E6%90%AD%E5%BB%BA.html 
- https://opengauss.org/zh/blogs/duomibabi/openGauss1-0-1%E6%94%AF%E6%8C%81oracle-fdw%E5%92%8Cmysql-fdw.html 
- https://opengauss.org/zh/blogs/duomibabi/openGauss1-0-1%E9%83%A8%E5%88%86%E6%96%B0%E7%89%B9%E6%80%A7%E6%B5%8B%E8%AF%95.html 
- https://opengauss.org/zh/blogs/duomibabi/openGauss1-1-0%E6%94%AF%E6%8C%81%E4%BB%8E%E5%BA%93%E5%9F%BA%E5%87%86%E5%A4%87%E4%BB%BD.html 
- https://opengauss.org/zh/blogs/duomibabi/openGauss%E4%B8%8EPostgreSQL%E5%88%86%E5%8C%BA%E7%AD%96%E7%95%A5%E8%AF%AD%E6%B3%95%E6%B5%8B%E8%AF%95.html 
- https://opengauss.org/zh/blogs/duomibabi/openGauss%E4%B8%8EPostgreSQL%E5%AF%B9%E6%AF%94%E6%B5%8B%E8%AF%95SSL%E4%B9%8B%E8%87%AA%E7%AD%BE%E5%90%8DCA%E8%AF%81%E4%B9%A6%E5%8D%95%E5%90%91%E8%AE%A4%E8%AF%81%E6%B5%8B%E8%AF%95.html 
- https://opengauss.org/zh/blogs/duomibabi/openGauss%E4%B8%8EPostgreSQL%E5%AF%B9%E6%AF%94%E6%B5%8B%E8%AF%95SSL%E4%B9%8B%E8%87%AA%E7%AD%BE%E5%90%8DCA%E8%AF%81%E4%B9%A6%E5%8F%8C%E5%90%91%E8%AE%A4%E8%AF%81%E6%B5%8B%E8%AF%95.html 
- https://opengauss.org/zh/blogs/duomibabi/openGauss%E4%B8%8EPostgreSQL%E5%AF%B9%E6%AF%94%E6%B5%8B%E8%AF%95SSL%E4%B9%8B%E8%87%AA%E7%AD%BE%E5%90%8D%E7%A7%81%E6%9C%89%E8%AF%81%E4%B9%A6%E6%B5%8B%E8%AF%95.html 
- https://opengauss.org/zh/blogs/duomibabi/openGauss%E7%BC%96%E8%AF%91%E6%94%AF%E6%8C%81postgis.html 
- https://opengauss.org/zh/blogs/enmo/9%E4%B8%AAMogDB%E5%AD%98%E5%82%A8%E8%BF%87%E7%A8%8B%E7%A4%BA%E4%BE%8B.html 
- https://opengauss.org/zh/blogs/enmo/Copy%20%E8%BF%9B%E9%98%B6%E7%94%A8%E6%B3%95.html 
- https://opengauss.org/zh/blogs/enmo/DBEAVER%E8%BF%9E%E6%8E%A5MogDB.html 
- https://opengauss.org/zh/blogs/enmo/FATAL%20Connection%20to%20database%20failed%20SCRAM%20authentication%20requires%20libpq%20version%2010%20or%20above.html 
- https://opengauss.org/zh/blogs/enmo/Jmeter%E5%8E%8B%E6%B5%8BMogdb%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20-%20WDR%E6%8A%A5%E5%91%8A%E5%AF%BC%E8%87%B4%E7%9A%84%E5%9F%BA%E5%BA%93%E5%AE%B9%E9%87%8F%E8%BF%87%E5%A4%A7%E9%97%AE%E9%A2%98%E5%A4%84%E7%90%86.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20-%20%E5%A4%96%E9%94%AE%E7%BA%A6%E6%9D%9F%E7%AE%A1%E7%90%86%E5%88%A0%E9%99%A4%E5%A4%96%E9%94%AE%E5%85%B3%E8%81%94%E7%9A%84%E4%B8%BB%E8%A1%A8%E6%95%B0%E6%8D%AE%E6%AD%A5%E9%AA%A4.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%202.0.1%E8%A1%A5%E4%B8%81%E5%8D%87%E7%BA%A7%E6%96%B9%E6%A1%88.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%202.1.1%20%E5%88%9D%E5%A7%8B%E5%8C%96%E5%8F%82%E6%95%B0%E6%A6%82%E8%A6%81%E8%AF%B4%E6%98%8E.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%202.1.1%E6%89%8B%E5%B7%A5%E5%8D%87%E7%BA%A73.0.0%E5%AE%9E%E6%88%98%E5%88%86%E4%BA%AB.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%203.0%20%E6%96%B0%E7%89%B9%E6%80%A7.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20Query%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20SQLdiag%20%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20openGauss%20%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E4%B9%8B%E8%B6%8B%E5%8A%BF%E9%A2%84%E6%B5%8B.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20openGauss%20%E5%9D%8F%E5%9D%97%E6%B5%8B%E8%AF%95-%E5%AF%B9%E5%90%AF%E5%8A%A8%E7%9A%84%E5%BD%B1%E5%93%8D-%E6%B5%8B%E8%AF%95%E7%AC%94%E8%AE%B01.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20openGauss%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0-%E8%8E%B7%E5%8F%96%E5%AF%B9%E8%B1%A1DDL.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20%E4%BD%BF%E7%94%A8%E5%90%91%E9%87%8F%E5%8C%96%E6%89%A7%E8%A1%8C%E5%BC%95%E6%93%8E%E8%BF%9B%E8%A1%8C%E8%B0%83%E4%BC%98.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20%E4%BD%BF%E7%94%A8%E6%A0%B7%E6%9C%AC%E6%95%B0%E6%8D%AE%E9%9B%86Mogila.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20%E5%88%86%E5%8C%BA%E8%A1%A8%E5%85%A8%E6%93%8D%E4%BD%9C%E9%80%9F%E6%9F%A5%E4%BD%BF%E7%94%A8%E8%84%9A%E6%9C%AC%E5%AE%9E%E7%8E%B0RANGE%E5%88%86%E5%8C%BA%E5%AE%9A%E6%97%B6%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20%E5%88%86%E6%9E%90%E8%A1%A8.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20%E5%90%AF%E5%8A%A8%E8%B5%84%E6%BA%90%E8%B4%9F%E8%BD%BD%E7%AE%A1%E7%90%86%E5%8A%9F%E8%83%BD.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20%E5%B8%B8%E8%A7%81%E6%95%85%E9%9A%9C%E8%A7%A3%E5%86%B3%20%E9%87%8D%E5%BB%BA%E7%B4%A2%E5%BC%95%E5%A4%B1%E8%B4%A5.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96%E6%8C%87%E5%8D%97.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20%E6%97%A5%E5%B8%B8%E7%BB%B4%E6%8A%A4%E9%A1%B9%E7%9B%AE.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20%E7%B3%BB%E7%BB%9F%E8%A1%A8%E5%92%8C%E7%B3%BB%E7%BB%9F%E8%A7%86%E5%9B%BE%E6%A6%82%E8%BF%B0.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%20%E8%AE%BE%E7%BD%AE%E9%80%8F%E6%98%8E%E5%8A%A0%E5%AF%86.html 
- https://opengauss.org/zh/blogs/enmo/MogDB-BRM%E5%B7%A5%E5%85%B7%E5%A4%87%E4%BB%BD%E5%8F%8A%E5%BC%82%E6%9C%BA%E6%81%A2%E5%A4%8D%E6%B5%8B%E8%AF%95.html 
- https://opengauss.org/zh/blogs/enmo/MogDB2.1%E6%95%B0%E6%8D%AE%E5%BA%93%E6%96%B0%E7%89%B9%E6%80%A7%E4%B9%8B%EF%BC%9ACREATE%20PACKAGE.html 
- https://opengauss.org/zh/blogs/enmo/MogDBopenGauss%E5%85%B3%E4%BA%8EPLSQL%E5%8C%BF%E5%90%8D%E5%9D%97%E8%B0%83%E7%94%A8%E6%B5%8B%E8%AF%95.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%E5%8D%95%E5%AE%9E%E4%BE%8B%E5%AE%89%E8%A3%85%EF%BC%8C%E5%88%9D%E5%A7%8B%E5%8C%96%E8%84%9A%E6%9C%AC%E8%A7%A3%E6%9E%90xml%E6%96%87%E4%BB%B6%E6%8A%A5%E9%94%99.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%E5%A4%87%E6%9C%BA%E5%A4%84%E4%BA%8Estandby%20need-repair(WAL)%E7%8A%B6%E6%80%81.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%E5%AE%9E%E4%BE%8B%E7%9A%84%E5%88%A0%E9%99%A4.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%E6%8A%A5%E9%94%99%20-%20ERROR%20role%20cannot%20be%20dropped%20because%20some%20objects%20depend%20on%20it%20DETAIL%201%20object%20in%20database%E5%A4%84%E7%90%86.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%E6%95%B0%E6%8D%AE%E5%BA%93JDBC%E8%AF%BB%E5%86%99%E5%88%86%E7%A6%BB%E6%B5%8B%E8%AF%95.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%E6%95%B0%E6%8D%AE%E5%BA%93%E5%85%A5%E9%97%A8%E4%BD%BF%E7%94%A8%E5%B0%9D%E9%B2%9C.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%E6%95%B0%E6%8D%AE%E5%BA%93%E7%94%A8%E6%88%B7%E5%AF%86%E7%A0%81%E5%AE%89%E5%85%A8%E7%AD%96%E7%95%A5.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%E6%9F%A5%E8%AF%A2%E5%BD%93%E5%89%8D%E5%8E%86%E5%8F%B2%E6%89%A7%E8%A1%8C%E8%AE%A1%E5%88%92.html 
- https://opengauss.org/zh/blogs/enmo/MogDB%E7%9A%84%E7%BA%BF%E7%A8%8B%E7%90%86%E8%A7%A3.html 
- https://opengauss.org/zh/blogs/enmo/Mogdb%20-%20copy%E6%8A%A5%E9%94%99ERROR%20missing%20data%20for%20column.html 
- https://opengauss.org/zh/blogs/enmo/Mogdb%20-%20%E5%AE%89%E8%A3%85%E6%8A%A5%E9%94%99Failed%20to%20encrypt%20the%20password%20for%20databaseError.html 
- https://opengauss.org/zh/blogs/enmo/ODBC%E9%A9%B1%E5%8A%A8%E8%BF%9E%E6%8E%A5MogDB%20openGauss.html 
- https://opengauss.org/zh/blogs/enmo/OpenGauss%20MogDB%20TPCH%E6%80%A7%E8%83%BD%E6%B5%8B%E8%AF%95%E6%AD%A5%E9%AA%A4.html 
- https://opengauss.org/zh/blogs/enmo/PTK%20%E4%B8%80%E9%94%AE%E5%AE%89%E8%A3%85%20MogDB.html 
- https://opengauss.org/zh/blogs/enmo/Psycopg%E8%BF%9E%E6%8E%A5Mogdb%20openGauss.html 
- https://opengauss.org/zh/blogs/enmo/cm_server%E8%BF%9F%E8%BF%9F%E5%90%AF%E5%8A%A8%E4%B8%8D%E8%B5%B7%E6%9D%A5%E7%9A%84%E5%8E%9F%E5%9B%A0%E5%88%86%E6%9E%90.html 
- https://opengauss.org/zh/blogs/enmo/default_statistics_target%E5%8F%82%E6%95%B0%E5%AF%B9PG%E5%92%8CMogDB%E6%80%A7%E8%83%BD%E5%BD%B1%E5%93%8D%E6%B5%8B%E8%AF%95%E5%92%8C%E5%88%86%E6%9E%90.html 
- https://opengauss.org/zh/blogs/enmo/go%E8%AF%AD%E8%A8%80%E8%BF%9E%E6%8E%A5Mogdb.html 
- https://opengauss.org/zh/blogs/enmo/mogdb%E9%87%8Cxlog%E7%9B%B8%E5%85%B3%E7%9A%84%E5%87%A0%E4%B8%AA%E5%8F%82%E6%95%B0.html 
- https://opengauss.org/zh/blogs/enmo/openEuler20.03%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E4%B8%8A%E5%AE%89%E8%A3%85%E9%83%A8%E7%BD%B2MogDB2.1.1.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%203.0.0%20docker%20%E5%AE%89%E8%A3%85.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%20MogDB%20PostgreSQL%E6%95%B0%E6%8D%AE%E5%BA%93%E6%98%93%E7%8A%AF%E7%9A%84%E5%8D%81%E5%A4%A7%E9%94%99%E8%AF%AF.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%20MogDB%20WDR%E6%8A%A5%E5%91%8A%E8%AF%A6%E8%A7%A3.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%20MogDB3.0%E9%97%AA%E5%9B%9E%E6%81%A2%E5%A4%8D%E6%B5%8B%E8%AF%95.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%20MogDB%E5%B0%8F%E7%89%88%E6%9C%AC%E5%8D%87%E7%BA%A7%EF%BC%9A%E4%BB%8E2.0.0%20%E5%88%B02.0.1.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%20MogDB%E6%95%B0%E6%8D%AE%E5%BA%93%E6%9C%8D%E5%8A%A1%E5%90%AF%E5%8A%A8%E6%A8%A1%E5%BC%8F%E5%88%86%E6%9E%90.html 
- https://opengauss.org/zh/blogs/enmo/openGauss---MOT%E9%85%8D%E7%BD%AE.html 
- https://opengauss.org/zh/blogs/enmo/openGauss---Schema.html 
- https://opengauss.org/zh/blogs/enmo/openGauss--%E7%94%A8%E6%88%B7.html 
- https://opengauss.org/zh/blogs/enmo/openGauss-AI%E6%9C%AA%E6%9D%A5%E5%B7%B2%E6%9D%A5.html 
- https://opengauss.org/zh/blogs/enmo/openGauss-WDR%E6%8A%A5%E5%91%8A%E5%AE%9E%E8%B7%B5.html 
- https://opengauss.org/zh/blogs/enmo/openGauss-%E9%97%AA%E5%9B%9E%E6%81%A2%E5%A4%8D%E5%AE%9E%E8%B7%B5%E6%93%8D%E4%BD%9C.html 
- https://opengauss.org/zh/blogs/enmo/openGauss1.0.0%20%E7%94%A8%E6%88%B7%E8%A2%AB%E9%94%81.html 
- https://opengauss.org/zh/blogs/enmo/openGaussMogDB%20PG%E5%85%A8%E6%96%87%E6%A3%80%E7%B4%A2%E5%88%9D%E6%8E%A2.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E4%B9%8BPITR%E6%81%A2%E5%A4%8D.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E4%B9%8B%E4%B8%BB%E5%A4%87%E5%88%87%E6%8D%A2.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E4%B9%8B%E6%95%B0%E6%8D%AE%E5%BA%93%E5%AF%B9%E8%B1%A1%E7%AE%80%E5%8D%95%E7%AE%A1%E7%90%86.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E4%B9%8B%E7%89%A9%E7%90%86%E5%A4%87%E4%BB%BD%E4%B8%8E%E6%81%A2%E5%A4%8D%E5%AE%9E%E8%B7%B5%E6%93%8D%E4%BD%9C%EF%BC%88gs_probackup%EF%BC%89.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E4%BA%8B%E5%8A%A1%E9%94%81.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%95%B0%E6%8D%AE%E5%BA%93%E7%BB%B4%E6%8A%A4%E7%9B%B8%E5%85%B3%E5%91%BD%E4%BB%A4.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%E4%B9%8B%E5%AE%9A%E4%B9%89%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%E4%B9%8B%E5%AF%BC%E5%85%A5%E6%95%B0%E6%8D%AE.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%E4%B9%8B%E5%AF%BC%E5%87%BA%E6%95%B0%E6%8D%AE.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%E7%AC%AC%E4%B8%80%E5%A4%A9.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%E7%AC%AC%E4%B8%83%E5%A4%A9.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%E7%AC%AC%E4%B8%89%E5%A4%A9.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%E7%AC%AC%E4%BA%8C%E5%A4%A9.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%E7%AC%AC%E4%BA%94%E5%A4%A9.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%E7%AC%AC%E5%85%AD%E5%A4%A9.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%E7%AC%AC%E5%9B%9B%E5%A4%A9.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%EF%BC%88%E5%85%A8%E6%96%87%E6%A3%80%E7%B4%A2%EF%BC%89.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%EF%BC%88%E5%88%86%E5%8C%BA%E8%A1%A8%E7%B4%A2%E5%BC%95%EF%BC%89.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%EF%BC%88%E5%88%86%E5%8C%BA%E8%A1%A8%EF%BC%89.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%EF%BC%88%E5%AE%9A%E4%B9%89%E6%B8%B8%E6%A0%87%EF%BC%89.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%EF%BC%88%E6%94%B6%E9%9B%86%E7%BB%9F%E8%AE%A1%E4%BF%A1%E6%81%AF%E3%80%81%E6%89%93%E5%8D%B0%E6%89%A7%E8%A1%8C%E8%AE%A1%E5%88%92%E3%80%81%E5%9E%83%E5%9C%BE%E6%94%B6%E9%9B%86%E5%92%8Ccheckpoint%EF%BC%89.html 
- https://opengauss.org/zh/blogs/enmo/openGauss%E6%AF%8F%E6%97%A5%E4%B8%80%E7%BB%83%EF%BC%88%E6%99%AE%E9%80%9A%E8%A1%A8%E7%B4%A2%E5%BC%95%EF%BC%89.html 
- …其余 681 个见 stats JSON（tdk-duplicate-stats.json 的 whitelistSkipped.urls）

#### title 重复检查

共 5 组重复，涉及 10 个页面

##### [重复 2 次] 陕西省财政厅 | Success Stories | openGauss Community Website

- https://opengauss.org/en/user-practice/bigbusiness/caizhengting/ 
- https://opengauss.org/en/user-practice/others/caizhengting/ 

##### [重复 2 次] 四川省气象局 | Success Stories | openGauss Community Website

- https://opengauss.org/en/user-practice/bigbusiness/qixiangju/ 
- https://opengauss.org/en/user-practice/others/qixiangju/ 

##### [重复 2 次] 央广网 | Success Stories | openGauss Community Website

- https://opengauss.org/en/user-practice/bigbusiness/yangguangwang/ 
- https://opengauss.org/en/user-practice/others/yangguangwang/ 

##### [重复 2 次] 华为消费者云 | Success Stories | openGauss Community Website

- https://opengauss.org/en/user-practice/bigbusiness/xiaofeiyun/ 
- https://opengauss.org/en/user-practice/others/xiaofeiyun/ 

##### [重复 2 次] 中国联通 | 用户案例 | openGauss社区

- https://opengauss.org/zh/user-practice/carrier/zhongguoliantong/ 
- https://opengauss.org/zh/user-practice/carrier/liantong2/ 

#### description 重复检查

共 60 组重复，涉及 125 个页面

##### [重复 3 次] 为预算管理一体化核心业务系统打造企业级分布式数据库平台

- https://opengauss.org/en/user-practice/bigbusiness/caizhengting/ 
- https://opengauss.org/zh/user-practice/bigbusiness/caizhengting/ 
- https://opengauss.org/en/user-practice/others/caizhengting/ 

##### [重复 3 次] 为四川气象提供稳定气象服务保障，提升气象精度

- https://opengauss.org/en/user-practice/bigbusiness/qixiangju/ 
- https://opengauss.org/zh/user-practice/bigbusiness/qixiangju/ 
- https://opengauss.org/en/user-practice/others/qixiangju/ 

##### [重复 3 次] 支撑消费者云数据库分布式云化改造

- https://opengauss.org/zh/user-practice/bigbusiness/xiaofeiyun/ 
- https://opengauss.org/en/user-practice/bigbusiness/xiaofeiyun/ 
- https://opengauss.org/en/user-practice/others/xiaofeiyun/ 

##### [重复 3 次] 国产数据库快速平滑迁移，综合性能提升30%

- https://opengauss.org/en/user-practice/bigbusiness/yangguangwang/ 
- https://opengauss.org/zh/user-practice/bigbusiness/yangguangwang/ 
- https://opengauss.org/en/user-practice/others/yangguangwang/ 

##### [重复 3 次] 主题：把企业级的数据库能力带给用户，共筑计算新生态共赢数字新时代

- https://opengauss.org/zh/events/2022-08-25/Meetup.html 
- https://opengauss.org/zh/events/2022-09-10/meetup.html 
- https://opengauss.org/zh/events/2022-10-13/meetup.html 

##### [重复 2 次] openGauss将参加第十届PostgreSQL中国技术大会，分享Keynote、Session。

- https://opengauss.org/en/events/2021-01-15/2021-01-15-PostgreSQL.html 
- https://opengauss.org/zh/events/2021-01-15/2021-01-15-PostgreSQL.html 

##### [重复 2 次] 天津市场监督管理业务系统国产化改造

- https://opengauss.org/en/user-practice/bigbusiness/tianjinshichangjianduwei/ 
- https://opengauss.org/zh/user-practice/bigbusiness/tianjinshichangjianduwei/ 

##### [重复 2 次] IT系统数据库自主创新实践，高性能高并发处理应对多样化场景。

- https://opengauss.org/en/user-practice/carrier/chinatower/ 
- https://opengauss.org/zh/user-practice/carrier/chinatower/ 

##### [重复 2 次] 福建移动根据集团试点工作要求，同时结合省内自主创新改造工作的规划，目前已有12套数据库计划选型磐维数据库，其中计费日志库bosslog采用磐维2.0一主一备共享存储架构，该架构解决传统HA部署下存储容量较单机部署翻倍的问题，减少了存储容量，备机支持实时一致性读，充分发挥主备多节点算力。

- https://opengauss.org/zh/user-practice/carrier/fujianyidong/ 
- https://opengauss.org/en/user-practice/carrier/fujianyidong/ 

##### [重复 2 次] 中国移动广东公司新一代核心系统集中式数据库创新实践，日均90亿条计费话单的采集分拣和结算处理，以及日均2000万条账单的累账出账等生产工作。

- https://opengauss.org/en/user-practice/carrier/guangdongyidong/ 
- https://opengauss.org/zh/user-practice/carrier/guangdongyidong/ 

##### [重复 2 次] openGauss助力河北移动核心应用系统升级

- https://opengauss.org/en/user-practice/carrier/hebeiyidong/ 
- https://opengauss.org/zh/user-practice/carrier/hebeiyidong/ 

##### [重复 2 次] 为满足全栈自主创新的建设需求，PanWeiDB 数据库助力适配应用开发商进行业务系统架构适配及应用兼容性改造，从传统国外开源数据库 MySQL 转型适配自主创新数据库 PanWeiDB 。 PanWeiDB 在 openGauss 开源软件强大内核基础上增强了高可用性、分布式能力、MySQL 兼容性、配套工具等功能，满足了零售系统系统快速完成适配改造，实现业务快速上线运行。

- https://opengauss.org/en/user-practice/carrier/jiangsuyidong/ 
- https://opengauss.org/zh/user-practice/carrier/jiangsuyidong/ 

##### [重复 2 次] 江西移动省公司智慧网格数据库自主创新迁移项目，在运营商领域的核心业务系统中发挥关键作用。

- https://opengauss.org/en/user-practice/carrier/jiangxiyidong/ 
- https://opengauss.org/zh/user-practice/carrier/jiangxiyidong/ 

##### [重复 2 次] 内蒙古移动BOSS数据库升级改造项目，磐维数据库助力BOSS系统计费帐处，实现全生命周期智化支撑。

- https://opengauss.org/en/user-practice/carrier/neimengguyidong/ 
- https://opengauss.org/zh/user-practice/carrier/neimengguyidong/ 

##### [重复 2 次] 新疆移动业务周期管理平台为新疆公司B域、M域各业务系统提供海量业务数据的低成本存储与低时延的查询能力。而面向结构化数据存储需求，新疆移动业务数据周期管理平台在原有mysql数据库存储基础上，率先引入集团分布式磐维数据库，实现自主创新能力背景下历史数据高效、可靠、低成本、高性价比存储能力实现。

- https://opengauss.org/en/user-practice/carrier/xinjiangyidong/ 
- https://opengauss.org/zh/user-practice/carrier/xinjiangyidong/ 

##### [重复 2 次] 基于磐维数据库的生态研发和创新实践，为行业应用提供高兼容、高可靠、高性能、无开源传染风险的OLTP数据库及配套工具。

- https://opengauss.org/en/user-practice/carrier/yidong/ 
- https://opengauss.org/zh/user-practice/carrier/yidong/ 

##### [重复 2 次] 中移金科磐维数据库实践，解决了公司内部的自主创新难题，包含改造成本、高可用、平滑割接、稳定性等问题。

- https://opengauss.org/en/user-practice/carrier/yidong2/ 
- https://opengauss.org/zh/user-practice/carrier/yidong2/ 

##### [重复 2 次] openGauss助力浙江移动CRM系统升级

- https://opengauss.org/en/user-practice/carrier/zhejiangyidong/ 
- https://opengauss.org/zh/user-practice/carrier/zhejiangyidong/ 

##### [重复 2 次] 支撑运营商基础设施数智化升级

- https://opengauss.org/en/user-practice/carrier/zhongguoliantong/ 
- https://opengauss.org/zh/user-practice/carrier/zhongguoliantong/ 

##### [重复 2 次] 云和恩墨基于openGauss内核进行增强提升，推出的商业发行版MogDB，MogDB是一款安稳易用的企业级关系型数据库，广泛应用于银行、保险、政府、能源和电信领域生产场景中。部署openGauss服务器节点数为50个以上。

- https://opengauss.org/en/user-practice/dbv/enmotech/ 
- https://opengauss.org/zh/user-practice/dbv/enmotech/ 

##### [重复 2 次] 神通公司基于openGauss发行商业版神通数据库V7.0.21版本，广泛应用在了信息创新领域的系统中！部署openGauss服务器节点数为50个以上。

- https://opengauss.org/en/user-practice/dbv/shentongdata/ 
- https://opengauss.org/zh/user-practice/dbv/shentongdata/ 

##### [重复 2 次] 使用openGauss做海量数据库Vastbase商业发行版，部署openGauss服务器节点数为50个以上。

- https://opengauss.org/en/user-practice/dbv/vastdata/ 
- https://opengauss.org/zh/user-practice/dbv/vastdata/ 

##### [重复 2 次] Vastbase提供良好的地理信息数据处理能力支持

- https://opengauss.org/en/user-practice/education/beidayanjiushengyuan/ 
- https://opengauss.org/zh/user-practice/education/beidayanjiushengyuan/ 

##### [重复 2 次] 满足生产系统数据库高可用要求，降低监控成本和投入

- https://opengauss.org/zh/user-practice/energy/guojiadianwang/ 
- https://opengauss.org/en/user-practice/energy/guojiadianwang/ 

##### [重复 2 次] 基于国能磐石关系型数据库创新实践，承载用户规模30万人，业务满意度高。

- https://opengauss.org/en/user-practice/energy/guojianengyuan/ 
- https://opengauss.org/zh/user-practice/energy/guojianengyuan/ 

##### [重复 2 次] 国网河南省电力公司信息通信分公司国产数据库适配改造项目，满足了在多个关键业务系统（企业门户、短信平台、指标中心系统、检修专区管理系统以及精益化运营平台等）的多个典型场景的系统需求。

- https://opengauss.org/zh/user-practice/energy/guowanghenan/ 
- https://opengauss.org/en/user-practice/energy/guowanghenan/ 

##### [重复 2 次] 智能一体化管理系统升级实践，覆盖多个核心业务系统（非常规业务支持系统SuperModel企业绩效管理系统、油化事业部实验数据采集应用系统、油化EPS作业管理系统、气电城燃系统、终端外输智能一体化平台）。

- https://opengauss.org/en/user-practice/energy/szzhonghaiyou/ 
- https://opengauss.org/zh/user-practice/energy/szzhonghaiyou/ 

##### [重复 2 次] 数据合规，为企业持续经营保驾护航

- https://opengauss.org/en/user-practice/finance/bohai/ 
- https://opengauss.org/zh/user-practice/finance/bohai/ 

##### [重复 2 次] GBASE助力长城华西银行身份核查系统

- https://opengauss.org/en/user-practice/finance/changchenghuaxiyinhang/ 
- https://opengauss.org/zh/user-practice/finance/changchenghuaxiyinhang/ 

##### [重复 2 次] 数据库采用基于用 openGauss 的发行版海量数据 Vastbase，在基础环境方面全面采用国内标准构建，摒弃了以美国科技公司为代表的的 IBM 小型机、AIX 操作系统、WebSphere 中间件、等软硬件，形成了以海光超融合服务器、中标麒麟操作系统、海量数据库、东方通中间件为基础的软硬件环境，实现自主创新。

- https://opengauss.org/en/user-practice/finance/chengdebank/ 
- https://opengauss.org/zh/user-practice/finance/chengdebank/ 

##### [重复 2 次] 交易级总账系统创新升级实践，2023年至今首批部署30套，解决交易级总账系统等核心系统GCH转型中的数据库迁移问题。

- https://opengauss.org/en/user-practice/finance/chengdebank2/ 
- https://opengauss.org/zh/user-practice/finance/chengdebank2/ 

##### [重复 2 次] MogDB 助力银行保障数据安全，应对业务新挑战

- https://opengauss.org/en/user-practice/finance/haerbing/ 
- https://opengauss.org/zh/user-practice/finance/haerbing/ 

##### [重复 2 次] MogDB 全方位护航公司合规工作管理平台和风险管理系统

- https://opengauss.org/en/user-practice/finance/hezhong/ 
- https://opengauss.org/zh/user-practice/finance/hezhong/ 

##### [重复 2 次] 哈密市商业银行的基于 openGauss 商业发行版 — MogDB 数据库改造项目主要涉及新建 A 类超级柜台系统的应用，以及积分、党建、云课堂、人才招聘、农户经济档案、人力资源等 B 类和 C 类系统的迁移。最终非常顺利地完成数据库画像、兼容性评估、整体迁移、数据比对、应用适配等重要环节，让异构数据库之间改造适配难度降低 30%，并减少了 20% 的应用软件代码改造成本。

- https://opengauss.org/en/user-practice/finance/hmccb/ 
- https://opengauss.org/zh/user-practice/finance/hmccb/ 

##### [重复 2 次] 华安证券以安徽为总部业务网络辐射全国二十多个省份，拥有151家证券分支机构，13家期货分支机构。华安证券具有统一的数据中心基础设施管理平台。伴随业务发展，平台原有系统逐渐浮现并发瓶颈，系统响应也有所延迟。2023年底，采用openGauss商业发行版—GBase 8c分布式数据库解决方案替换原有数据库，来提升系统的并发能力和及时响应能力。

- https://opengauss.org/en/user-practice/finance/huaanzhengquan/ 
- https://opengauss.org/zh/user-practice/finance/huaanzhengquan/ 

##### [重复 2 次] 华宝基金选择了云和恩墨MogDB开启自研系统的数据库替换工作。MogDB配套的自动部署工具PTK、兼容性分析工具SCA、数据库迁移工具MTK确保了数据库从Oracle、PostgreSQL、MySQL向MogDB的平稳迁移。主、备、级联同步备库、异步备库的结合部署，辅以MogHA高可用管理组件，满足了华宝基金数据库容灾要求，搭建起坚固的数据承载平台。

- https://opengauss.org/en/user-practice/finance/huabaojijin/ 
- https://opengauss.org/zh/user-practice/finance/huabaojijin/ 

##### [重复 2 次] 晋商银行根据上线业务系统的重要程度，采用一主一备或一主多备等架构部署 openGauss 商业发行版 — MogDB 数据库，并采用两地双中心的高可用方案，实现异地数据异步传输、异地级联复制、异地演练和异地切换等功能，确保数据库系统具备高可用性和业务连续性，避免业务非计划中断的风险，提高系统的可靠性。

- https://opengauss.org/en/user-practice/finance/jshbank/ 
- https://opengauss.org/zh/user-practice/finance/jshbank/ 

##### [重复 2 次] 中国民生银行数据库规模化自主创新实践，支持全行各类系统模块200+，系统客户基数超过7000万。

- https://opengauss.org/en/user-practice/finance/minshengbank/ 
- https://opengauss.org/zh/user-practice/finance/minshengbank/ 

##### [重复 2 次] 神通数据库为金融关键数据安全及数据审计等保驾护航。

- https://opengauss.org/en/user-practice/finance/moukaifayinhang/ 
- https://opengauss.org/zh/user-practice/finance/moukaifayinhang/ 

##### [重复 2 次] MogDB容器化创新应用，实现数据库集群持久化全栈部署管理新模式

- https://opengauss.org/en/user-practice/finance/sichuantianfuyinhang/ 
- https://opengauss.org/zh/user-practice/finance/sichuantianfuyinhang/ 

##### [重复 2 次] 支撑跨境支付清算和统一积分项目的openGauss数据库管理平台，成功支持行内百余套业务系统，系统客户基数超过5000万。

- https://opengauss.org/en/user-practice/finance/xingyebank/ 
- https://opengauss.org/zh/user-practice/finance/xingyebank/ 

##### [重复 2 次] 基于鲲鹏全栈构筑新核心系统率先上线，加速数字银行建设

- https://opengauss.org/en/user-practice/finance/youzheng/ 
- https://opengauss.org/zh/user-practice/finance/youzheng/ 

##### [重复 2 次] 核心系统向鲲鹏全栈迁移，性能300%提升

- https://opengauss.org/en/user-practice/finance/zhonghua/ 
- https://opengauss.org/zh/user-practice/finance/zhonghua/ 

##### [重复 2 次] 钉钉专属AI助理，openGauss+DataVec一体化，简化部署运维。

- https://opengauss.org/en/user-practice/internet/dingding/ 
- https://opengauss.org/zh/user-practice/internet/dingding/ 

##### [重复 2 次] 制造核心数据库，性能整体提升50%

- https://opengauss.org/en/user-practice/manufacture/biyadi/ 
- https://opengauss.org/zh/user-practice/manufacture/biyadi/ 

##### [重复 2 次] 基于国创灵梭数据库（IntarkDB）的智能装备应用实践，基于openGauss创新系统架构，优化运维成本，支持多模态数据库。

- https://opengauss.org/zh/user-practice/manufacture/chuangwei/ 
- https://opengauss.org/en/user-practice/manufacture/chuangwei/ 

##### [重复 2 次] 数智化管理创新实践，承载30万用户规模。

- https://opengauss.org/en/user-practice/manufacture/dfmc/ 
- https://opengauss.org/zh/user-practice/manufacture/dfmc/ 

##### [重复 2 次] 核心数据库应用，助力国产芯片稳健智造

- https://opengauss.org/zh/user-practice/manufacture/xinpian/ 
- https://opengauss.org/en/user-practice/manufacture/xinpian/ 

##### [重复 2 次] Vastbase助力医疗行业信息化升级

- https://opengauss.org/en/user-practice/medical/nanjingweijianwei/ 
- https://opengauss.org/zh/user-practice/medical/nanjingweijianwei/ 

##### [重复 2 次] 数据库自主创新实践，电子病历系统项目，实现了住院管理业务应用在高可靠、高性能、高安全的国产自主数据库平台上的平稳运行。

- https://opengauss.org/en/user-practice/medical/sdent/ 
- https://opengauss.org/zh/user-practice/medical/sdent/ 

##### [重复 2 次] 应急管理系统八大业务模块采用统一部署，分级应用的建设模式，根据各层级部门的角色和工作职能，分派相关使用用户。在数据服务层，选择 VastbaseG100 作为基础数据库对上层应用进行支撑。

- https://opengauss.org/zh/user-practice/others/liaoningjiaotong/ 
- https://opengauss.org/en/user-practice/others/liaoningjiaotong/ 

##### [重复 2 次] SmartX 携手 openGauss 社区发布联合方案评测与性能最佳实践

- https://opengauss.org/zh/user-practice/others/smartx/ 
- https://opengauss.org/en/user-practice/others/smartx/ 

##### [重复 2 次] 2024年度西咸政务云升级改造，覆盖了14个厅局单位的三十多个业务系统，满足多领域政务服务需求。

- https://opengauss.org/en/user-practice/others/xxzw/ 
- https://opengauss.org/zh/user-practice/others/xxzw/ 

##### [重复 2 次] Zabbix与openGauss的深度融合

- https://opengauss.org/en/user-practice/others/zabbix/ 
- https://opengauss.org/zh/user-practice/others/zabbix/ 

##### [重复 2 次] 数据高效处理，安全可信，打造领先的数字化政务云平台

- https://opengauss.org/en/user-practice/others/zhengwuyun/ 
- https://opengauss.org/zh/user-practice/others/zhengwuyun/ 

##### [重复 2 次] 浙江邮政已经成功上线干线运输系统、全流程分环节损益系统、采购评审专家及代理机构管理系统、邮件理赔集中管控系统等4个系统。它们均采用了openGauss的主备集群部署方式，并使用了读写分离特性。这种方式既有效应对了高并发访问，降低了维护成本，可靠性提升100%，又充分发挥了主备双机硬件资源处理能力，使资源利用率提升了50%以上。

- https://opengauss.org/zh/user-practice/others/zjpost/ 
- https://opengauss.org/en/user-practice/others/zjpost/ 

##### [重复 2 次] 参与openGauss资料捉虫活动，发现或解决资料中的待改进点，提交有效的问题（Issue）或修改方法（PR,Pull Request），即可赢取华为平板、手表、手环等多重礼品。

- https://opengauss.org/zh/events/2021-08-17/findBug.html 
- https://opengauss.org/zh/events/2022-09-05/findBug.html 

##### [重复 2 次] 主题：打造最具创新力开源数据库社区 把企业级的数据库能力带给用户

- https://opengauss.org/zh/events/2022-04-23/meetup.html 
- https://opengauss.org/zh/events/2022-06-15/meetup.html 

##### [重复 2 次] Aims to deliver a high-performance, highly reliable, and future-proof database storage foundation with openGauss.

- https://opengauss.org/en/sig/StorageEngine.html 
- https://opengauss.org/en/sig/SQLEngine.html 

##### [重复 2 次] 致力于随openGauss一起，打造高性能、高可靠、面向未来的数据库存储底座。

- https://opengauss.org/zh/sig/StorageEngine.html 
- https://opengauss.org/zh/sig/SQLEngine.html 

#### keywords 重复检查（告警级，不触发提单）

共 6 组重复，涉及 63 个页面

##### [重复 53 次] openGauss,开源数据库,openGauss社区官网,开源社区

- https://opengauss.org/en/notifications/ 
- https://opengauss.org/en/sig/RISC-V.html 
- https://opengauss.org/zh/sig/RISC-V.html 
- https://opengauss.org/en/sig/StorageEngine.html 
- https://opengauss.org/zh/sig/StorageEngine.html 
- https://opengauss.org/en/sig/oGRAC.html 
- https://opengauss.org/en/sig/SecurityTechnology.html 
- https://opengauss.org/zh/sig/oGRAC.html 
- https://opengauss.org/en/sig/GIS.html 
- https://opengauss.org/zh/sig/SecurityTechnology.html 
- https://opengauss.org/zh/sig/GIS.html 
- https://opengauss.org/en/sig/Plugin.html 
- https://opengauss.org/zh/sig/Plugin.html 
- https://opengauss.org/zh/sig/Tools.html 
- https://opengauss.org/en/sig/Tools.html 
- https://opengauss.org/en/sig/Embedded.html 
- https://opengauss.org/zh/sig/Embedded.html 
- https://opengauss.org/en/sig/CM.html 
- https://opengauss.org/zh/sig/CM.html 
- https://opengauss.org/en/sig/Connectors.html 
- https://opengauss.org/zh/sig/Connectors.html 
- https://opengauss.org/en/sig/ReleaseManagement.html 
- https://opengauss.org/zh/sig/ReleaseManagement.html 
- https://opengauss.org/en/sig/AI.html 
- https://opengauss.org/zh/sig/AI.html 
- https://opengauss.org/en/sig/IoT.html 
- https://opengauss.org/zh/sig/IoT.html 
- https://opengauss.org/en/sig/QA.html 
- https://opengauss.org/zh/sig/QA.html 
- https://opengauss.org/en/sig/Docs.html 
- https://opengauss.org/zh/sig/Docs.html 
- https://opengauss.org/zh/sig/Infra.html 
- https://opengauss.org/en/sig/Infra.html 
- https://opengauss.org/en/sig/DCF.html 
- https://opengauss.org/zh/sig/DCF.html 
- https://opengauss.org/en/sig/KnowledgeGraph.html 
- https://opengauss.org/zh/sig/KnowledgeGraph.html 
- https://opengauss.org/en/sig/OPS.html 
- https://opengauss.org/en/sig/CloudNative.html 
- https://opengauss.org/zh/sig/OPS.html 
- https://opengauss.org/zh/sig/CloudNative.html 
- https://opengauss.org/zh/sig/Graph.html 
- https://opengauss.org/en/sig/Graph.html 
- https://opengauss.org/zh/sig/Blockchain.html 
- https://opengauss.org/en/sig/Blockchain.html 
- https://opengauss.org/en/sig/SQLEngine.html 
- https://opengauss.org/zh/sig/SQLEngine.html 
- https://opengauss.org/en/sig/Certification.html 
- https://opengauss.org/zh/sig/Certification.html 
- https://opengauss.org/en/sig/Security.html 
- https://opengauss.org/zh/sig/Security.html 
- https://opengauss.org/zh/sig/OM.html 
- https://opengauss.org/en/sig/OM.html 

##### [重复 2 次] openGauss, open source database, user practice, case study, 陕西省财政厅

- https://opengauss.org/en/user-practice/bigbusiness/caizhengting/ 
- https://opengauss.org/en/user-practice/others/caizhengting/ 

##### [重复 2 次] openGauss, open source database, user practice, case study, 四川省气象局

- https://opengauss.org/en/user-practice/bigbusiness/qixiangju/ 
- https://opengauss.org/en/user-practice/others/qixiangju/ 

##### [重复 2 次] openGauss, open source database, user practice, case study, 央广网

- https://opengauss.org/en/user-practice/bigbusiness/yangguangwang/ 
- https://opengauss.org/en/user-practice/others/yangguangwang/ 

##### [重复 2 次] openGauss, open source database, user practice, case study, 华为消费者云

- https://opengauss.org/en/user-practice/bigbusiness/xiaofeiyun/ 
- https://opengauss.org/en/user-practice/others/xiaofeiyun/ 

##### [重复 2 次] openGauss, 开源数据库, 用户实践, 案例分享, 中国联通

- https://opengauss.org/zh/user-practice/carrier/zhongguoliantong/ 
- https://opengauss.org/zh/user-practice/carrier/liantong2/ 

#### TDK 缺失检查

无缺失
