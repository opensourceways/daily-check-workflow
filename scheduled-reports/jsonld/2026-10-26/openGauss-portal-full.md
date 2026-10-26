# JSON-LD 检查完全版报告 · openGauss 官网（openGauss-portal）

- 检查时间：2026-10-26T08:29:58.834Z

### 项目信息

- 项目：openGauss 官网（openGauss-portal）
- 采样入口：https://opengauss.org ；sitemap 页面 1339 个，成功抓取 1339 个，失败 0 个
- 结论：❌（硬性错误 1 类 / 告警 3 条）

### 问题清单（全部 1 类硬性不符合）

- ❌ JSON 语法错误块 56 个（涉及 56 个页面，如 https://opengauss.org/zh/download/life-cycle/ 、https://opengauss.org/zh/honor/ 、https://opengauss.org/zh/summit/summit2024/ ）

### JSON 语法错误块所在页面（共 56 页 56 块）

- ❌ https://opengauss.org/zh/download/life-cycle/ 
- ❌ https://opengauss.org/zh/honor/ 
- ❌ https://opengauss.org/zh/summit/summit2024/ 
- ❌ https://opengauss.org/zh/summit/summit2025/ 
- ❌ https://opengauss.org/en/sig/RISC-V.html 
- ❌ https://opengauss.org/zh/sig/RISC-V.html 
- ❌ https://opengauss.org/zh/sig/StorageEngine.html 
- ❌ https://opengauss.org/en/sig/StorageEngine.html 
- ❌ https://opengauss.org/en/sig/oGRAC.html 
- ❌ https://opengauss.org/zh/sig/oGRAC.html 
- ❌ https://opengauss.org/en/sig/SecurityTechnology.html 
- ❌ https://opengauss.org/zh/sig/SecurityTechnology.html 
- ❌ https://opengauss.org/en/sig/GIS.html 
- ❌ https://opengauss.org/zh/sig/GIS.html 
- ❌ https://opengauss.org/en/sig/Plugin.html 
- ❌ https://opengauss.org/zh/sig/Plugin.html 
- ❌ https://opengauss.org/en/sig/Tools.html 
- ❌ https://opengauss.org/zh/sig/Tools.html 
- ❌ https://opengauss.org/en/sig/Embedded.html 
- ❌ https://opengauss.org/zh/sig/Embedded.html 
- ❌ https://opengauss.org/en/sig/CM.html 
- ❌ https://opengauss.org/zh/sig/CM.html 
- ❌ https://opengauss.org/en/sig/Connectors.html 
- ❌ https://opengauss.org/zh/sig/Connectors.html 
- ❌ https://opengauss.org/en/sig/ReleaseManagement.html 
- ❌ https://opengauss.org/zh/sig/ReleaseManagement.html 
- ❌ https://opengauss.org/zh/sig/AI.html 
- ❌ https://opengauss.org/en/sig/AI.html 
- ❌ https://opengauss.org/en/sig/IoT.html 
- ❌ https://opengauss.org/zh/sig/IoT.html 
- ❌ https://opengauss.org/en/sig/QA.html 
- ❌ https://opengauss.org/zh/sig/QA.html 
- ❌ https://opengauss.org/en/sig/Docs.html 
- ❌ https://opengauss.org/zh/sig/Docs.html 
- ❌ https://opengauss.org/en/sig/Infra.html 
- ❌ https://opengauss.org/zh/sig/Infra.html 
- ❌ https://opengauss.org/en/sig/DCF.html 
- ❌ https://opengauss.org/en/sig/KnowledgeGraph.html 
- ❌ https://opengauss.org/zh/sig/DCF.html 
- ❌ https://opengauss.org/zh/sig/KnowledgeGraph.html 
- ❌ https://opengauss.org/en/sig/OPS.html 
- ❌ https://opengauss.org/zh/sig/OPS.html 
- ❌ https://opengauss.org/en/sig/CloudNative.html 
- ❌ https://opengauss.org/zh/sig/CloudNative.html 
- ❌ https://opengauss.org/en/sig/Graph.html 
- ❌ https://opengauss.org/zh/sig/Graph.html 
- ❌ https://opengauss.org/en/sig/Blockchain.html 
- ❌ https://opengauss.org/en/sig/SQLEngine.html 
- ❌ https://opengauss.org/zh/sig/Blockchain.html 
- ❌ https://opengauss.org/en/sig/Certification.html 
- ❌ https://opengauss.org/zh/sig/SQLEngine.html 
- ❌ https://opengauss.org/zh/sig/Certification.html 
- ❌ https://opengauss.org/en/sig/Security.html 
- ❌ https://opengauss.org/zh/sig/Security.html 
- ❌ https://opengauss.org/en/sig/OM.html 
- ❌ https://opengauss.org/zh/sig/OM.html 

### 告警（全部 3 条，不触发提单，是否整改人工定夺）

- ⚠️ Google 必填属性缺失 266 处（主要：TechArticle.image×126、TechArticle.datePublished×126、WebPage.url×5 等；已降级为告警级，人工定夺，不触发提单）
- ⚠️ 结构与推荐项问题 169 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）
- ⚠️ @id 覆盖率 26%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）

### Google 必填属性缺失（告警级，共 266 处）

| 缺失项（type.prop） | 处数 | 涉及页面（前 20 个） |
| --- | --- | --- |
| TechArticle.image | 126 | https://opengauss.org/en/download/life-cycle/ https://opengauss.org/en/user-practice/bigbusiness/caizhengting/ https://opengauss.org/zh/user-practice/bigbusiness/caizhengting/ https://opengauss.org/en/user-practice/bigbusiness/qixiangju/ https://opengauss.org/zh/user-practice/bigbusiness/qixiangju/ https://opengauss.org/en/user-practice/bigbusiness/tianjinshichangjianduwei/ https://opengauss.org/zh/user-practice/bigbusiness/tianjinshichangjianduwei/ https://opengauss.org/en/user-practice/bigbusiness/xiaofeiyun/ https://opengauss.org/zh/user-practice/bigbusiness/xiaofeiyun/ https://opengauss.org/en/user-practice/bigbusiness/yangguangwang/ https://opengauss.org/zh/user-practice/bigbusiness/yangguangwang/ https://opengauss.org/en/user-practice/carrier/chinatower/ https://opengauss.org/zh/user-practice/carrier/chinatower/ https://opengauss.org/en/user-practice/carrier/chinaunicom/ https://opengauss.org/zh/user-practice/carrier/chinaunicom/ https://opengauss.org/en/user-practice/carrier/fujianyidong/ https://opengauss.org/zh/user-practice/carrier/fujianyidong/ https://opengauss.org/en/user-practice/carrier/guangdongyidong/ https://opengauss.org/zh/user-practice/carrier/guangdongyidong/ https://opengauss.org/en/user-practice/carrier/hebeiyidong/  等 |
| TechArticle.datePublished | 126 | https://opengauss.org/en/download/life-cycle/ https://opengauss.org/en/user-practice/bigbusiness/caizhengting/ https://opengauss.org/zh/user-practice/bigbusiness/caizhengting/ https://opengauss.org/en/user-practice/bigbusiness/qixiangju/ https://opengauss.org/zh/user-practice/bigbusiness/qixiangju/ https://opengauss.org/en/user-practice/bigbusiness/tianjinshichangjianduwei/ https://opengauss.org/zh/user-practice/bigbusiness/tianjinshichangjianduwei/ https://opengauss.org/en/user-practice/bigbusiness/xiaofeiyun/ https://opengauss.org/zh/user-practice/bigbusiness/xiaofeiyun/ https://opengauss.org/en/user-practice/bigbusiness/yangguangwang/ https://opengauss.org/zh/user-practice/bigbusiness/yangguangwang/ https://opengauss.org/en/user-practice/carrier/chinatower/ https://opengauss.org/zh/user-practice/carrier/chinatower/ https://opengauss.org/en/user-practice/carrier/chinaunicom/ https://opengauss.org/zh/user-practice/carrier/chinaunicom/ https://opengauss.org/en/user-practice/carrier/fujianyidong/ https://opengauss.org/zh/user-practice/carrier/fujianyidong/ https://opengauss.org/en/user-practice/carrier/guangdongyidong/ https://opengauss.org/zh/user-practice/carrier/guangdongyidong/ https://opengauss.org/en/user-practice/carrier/hebeiyidong/  等 |
| WebPage.url | 5 | https://opengauss.org/zh/certification/ https://opengauss.org/zh/download/archive/ https://opengauss.org/zh/compatibility/ https://opengauss.org/zh/team-up/form/ https://opengauss.org/zh/team-up/  |
| Event.location | 4 | https://opengauss.org/zh/events/2021-08-16/meetup.html https://opengauss.org/zh/summit/devday2022/ https://opengauss.org/zh/summit/summit2022/ https://opengauss.org/zh/summit/summit2023/  |
| SoftwareApplication.operatingSystem | 3 | https://opengauss.org/zh/about-us/ https://opengauss.org/zh/download/ https://opengauss.org/zh/  |
| Article.image | 1 | https://opengauss.org/en/vulnerability-management/  |
| Article.datePublished | 1 | https://opengauss.org/en/vulnerability-management/  |

### 结构与推荐项问题（全部 169 处）

- ⚠️ https://opengauss.org/en/about-us/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/en/about-us/  · WebPage：缺少 inLanguage(中文站应为 zh-CN)
- ⚠️ https://opengauss.org/zh/brand/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/en/contribution/detail.html  · WebPage：缺少 inLanguage(中文站应为 zh-CN)
- ⚠️ https://opengauss.org/en/contribution/detail.html  · WebSite：缺少 inLanguage(中文站应为 zh-CN)
- ⚠️ https://opengauss.org/en/contribution/detail.html  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/en/cve/detail/  · BreadcrumbList：第 1 项缺少 name
- ⚠️ https://opengauss.org/en/cve/detail/  · BreadcrumbList：第 2 项缺少 name
- ⚠️ https://opengauss.org/en/cve/detail/  · BreadcrumbList：第 3 项缺少 name
- ⚠️ https://opengauss.org/zh/cve/detail/  · BreadcrumbList：第 1 项缺少 name
- ⚠️ https://opengauss.org/zh/cve/detail/  · BreadcrumbList：第 2 项缺少 name
- ⚠️ https://opengauss.org/zh/cve/detail/  · BreadcrumbList：第 3 项缺少 name
- ⚠️ https://opengauss.org/en/download/life-cycle/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/member/detail/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/member/detail/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/member/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/en/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/  · WebSite：缺少 inLanguage(中文站应为 zh-CN)
- ⚠️ https://opengauss.org/en/online-communication/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/online-communication/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/en/security-advisories/detail/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/en/security-advisories/detail/  · BreadcrumbList：第 1 项缺少 name
- ⚠️ https://opengauss.org/en/security-advisories/detail/  · BreadcrumbList：第 2 项缺少 name
- ⚠️ https://opengauss.org/zh/tools/  · WebPage：缺少 inLanguage(中文站应为 zh-CN)
- ⚠️ https://opengauss.org/en/user-practice/bigbusiness/caizhengting/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/bigbusiness/caizhengting/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/bigbusiness/qixiangju/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/bigbusiness/qixiangju/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/bigbusiness/tianjinshichangjianduwei/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/bigbusiness/tianjinshichangjianduwei/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/bigbusiness/xiaofeiyun/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/bigbusiness/xiaofeiyun/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/bigbusiness/yangguangwang/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/bigbusiness/yangguangwang/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/carrier/chinatower/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/carrier/chinatower/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/carrier/chinaunicom/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/carrier/chinaunicom/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/carrier/fujianyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/carrier/fujianyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/carrier/guangdongyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/carrier/guangdongyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/carrier/hebeiyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/carrier/hebeiyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/carrier/jiangsuyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/carrier/jiangsuyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/carrier/jiangxiyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/carrier/jiangxiyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/carrier/neimengguyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/carrier/neimengguyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/carrier/xinjiangyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/carrier/xinjiangyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/carrier/yidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/carrier/yidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/carrier/yidong2/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/carrier/yidong2/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/carrier/zhejiangyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/carrier/zhejiangyidong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/carrier/zhongguoliantong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/dbv/enmotech/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/carrier/zhongguoliantong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/dbv/enmotech/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/dbv/shentongdata/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/dbv/shentongdata/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/dbv/vastdata/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/dbv/vastdata/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/education/beidayanjiushengyuan/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/education/beidayanjiushengyuan/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/education/fudan/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/energy/guojiadianwang/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/education/fudan/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/energy/guojiadianwang/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/energy/guojianengyuan/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/energy/guojianengyuan/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/energy/guowanghenan/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/energy/guowanghenan/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/energy/szzhonghaiyou/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/energy/szzhonghaiyou/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/bohai/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/bohai/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/changchenghuaxiyinhang/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/changchenghuaxiyinhang/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/chengdebank/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/chengdebank/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/chengdebank2/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/chengdebank2/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/guilinbank/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/guilinbank/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/haerbing/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/haerbing/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/hezhong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/hezhong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/hmccb/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/hmccb/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/huaanzhengquan/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/huaanzhengquan/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/huabaojijin/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/huabaojijin/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/jshbank/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/jshbank/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/minshengbank/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/minshengbank/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/moukaifayinhang/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/moukaifayinhang/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/sichuantianfuyinhang/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/sichuantianfuyinhang/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/xingyebank/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/xingyebank/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/xingyecollectionsystem/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/xingyecollectionsystem/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/xingyepaymentsystem/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/xingyepaymentsystem/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/xingyemanagesystem/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/xingyemanagesystem/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/youzheng/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/youzheng/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/finance/zhonghua/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/finance/zhonghua/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/internet/dingding/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/internet/dingding/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/manufacture/biyadi/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/manufacture/biyadi/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/manufacture/chuangwei/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/manufacture/chuangwei/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/manufacture/dfmc/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/manufacture/dfmc/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/manufacture/xinpian/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/manufacture/xinpian/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/medical/nanjingweijianwei/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/medical/nanjingweijianwei/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/medical/sdent/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/medical/sdent/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/others/caizhengting/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/others/liaoningjiaotong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/others/liaoningjiaotong/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/others/qixiangju/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/others/smartx/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/others/smartx/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/others/xxzw/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/others/xiaofeiyun/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/others/xxzw/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/others/yangguangwang/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/others/zabbix/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/others/zabbix/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/others/zhengwuyun/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/others/zhengwuyun/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/en/user-practice/others/zjpost/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/user-practice/others/zjpost/  · TechArticle：publisher 缺少 logo
- ⚠️ https://opengauss.org/zh/vulnerability-management/  · WebPage：缺少 inLanguage(中文站应为 zh-CN)
- ⚠️ https://opengauss.org/zh/bigshot-voice/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/migration/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/  · Organization：logo 为裸字符串,推荐 {"@type":"ImageObject","url":...} 形式
- ⚠️ https://opengauss.org/zh/training/signup/ogca/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogca/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogca/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogca/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogca/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogce/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogce/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogce/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogce/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogce/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogcp/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogcp/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogcp/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogcp/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/training/signup/ogcp/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://opengauss.org/zh/user-practice/finance/shanghaiqihuojiaoyi/  · TechArticle：publisher 缺少 logo
