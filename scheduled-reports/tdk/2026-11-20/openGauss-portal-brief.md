# TDK 重复检查简短报告 · openGauss 官网（openGauss-portal）

- 检查时间：2026-11-20T07:57:59.706Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML（与 JSON-LD 维度共用同一份抓取），对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）
- canonical 豁免：同值组内每一页都声明了 `<link rel="canonical">` 且统一指向同一个规范版本 URL 时，视为站点已主动指定规范版本，不计重复；此类组单列在"canonical 豁免组"章节供复核
- 分级说明（2026-11 起）：keywords 重复为告警级——重复组明细仍列于本报告与 stats 供整改参考，但不触发提单；提单触发条件 = title/description 重复（canonical 豁免后）或三字段任一缺失
- 白名单跳过：URL 命中项目配置的 `tdkWhitelist`（projects.config.json）或 `--tdk-whitelist` 参数（两者并集；以 `/` 开头的条目按 URL 路径前缀匹配，其余按正则匹配（完整 URL 与 pathname 任一命中））的页面整页不参与判重与缺失检查，明细见完全版报告"TDK 白名单跳过页面"章节；仅影响 TDK 维度，JSON-LD 维度不受影响

- 检查范围：sitemap 全量页面 1343 个，成功抓取 362 个（失败 0 个不计入）
- TDK 白名单跳过 981 个页面（命中路径前缀或正则，不参与判重/缺失检查；明细见完全版报告）

**title**：5 组重复，涉及 10 个页面
- [重复 2 次] `陕西省财政厅 | Success Stories | openGauss Community Website`
  - https://opengauss.org/en/user-practice/bigbusiness/caizhengting/ 
  - https://opengauss.org/en/user-practice/others/caizhengting/ 
- [重复 2 次] `四川省气象局 | Success Stories | openGauss Community Website`
  - https://opengauss.org/en/user-practice/bigbusiness/qixiangju/ 
  - https://opengauss.org/en/user-practice/others/qixiangju/ 
- [重复 2 次] `央广网 | Success Stories | openGauss Community Website`
  - https://opengauss.org/en/user-practice/bigbusiness/yangguangwang/ 
  - https://opengauss.org/en/user-practice/others/yangguangwang/ 
- …其余 2 组见完全版报告

**description**：60 组重复，涉及 125 个页面
- [重复 3 次] `为预算管理一体化核心业务系统打造企业级分布式数据库平台`
  - https://opengauss.org/en/user-practice/bigbusiness/caizhengting/ 
  - https://opengauss.org/zh/user-practice/bigbusiness/caizhengting/ 
  - https://opengauss.org/en/user-practice/others/caizhengting/ 
- [重复 3 次] `为四川气象提供稳定气象服务保障，提升气象精度`
  - https://opengauss.org/en/user-practice/bigbusiness/qixiangju/ 
  - https://opengauss.org/zh/user-practice/bigbusiness/qixiangju/ 
  - https://opengauss.org/en/user-practice/others/qixiangju/ 
- [重复 3 次] `支撑消费者云数据库分布式云化改造`
  - https://opengauss.org/zh/user-practice/bigbusiness/xiaofeiyun/ 
  - https://opengauss.org/en/user-practice/bigbusiness/xiaofeiyun/ 
  - https://opengauss.org/en/user-practice/others/xiaofeiyun/ 
- …其余 57 组见完全版报告

**keywords**（告警级，不触发提单）：6 组重复，涉及 63 个页面
- [重复 53 次] `openGauss,开源数据库,openGauss社区官网,开源社区`
  - https://opengauss.org/en/notifications/ 
  - https://opengauss.org/en/sig/RISC-V.html 
  - https://opengauss.org/zh/sig/RISC-V.html 
  - https://opengauss.org/en/sig/StorageEngine.html 
  - https://opengauss.org/zh/sig/StorageEngine.html 
  - …其余 48 个见完全版报告
- [重复 2 次] `openGauss, open source database, user practice, case study, 陕西省财政厅`
  - https://opengauss.org/en/user-practice/bigbusiness/caizhengting/ 
  - https://opengauss.org/en/user-practice/others/caizhengting/ 
- [重复 2 次] `openGauss, open source database, user practice, case study, 四川省气象局`
  - https://opengauss.org/en/user-practice/bigbusiness/qixiangju/ 
  - https://opengauss.org/en/user-practice/others/qixiangju/ 
- …其余 3 组见完全版报告
