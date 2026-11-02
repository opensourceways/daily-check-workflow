# TDK 重复检查简短报告 · openUBMC 文档（openUBMC-docs）

- 检查时间：2026-11-02T11:31:46.644Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML（与 JSON-LD 维度共用同一份抓取），对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）

- 检查范围：sitemap 全量页面 4223 个，成功抓取 4221 个（失败 2 个不计入）

**title**：57 组重复，涉及 128 个页面
- [重复 5 次] `1.特性概述 | 文档中心 | openUBMC`
  - https://www.openubmc.cn/docs/zh/latest/release_designs/openUBMC%20%E5%8D%95BCU%E5%8F%8Chost%E7%89%B9%E6%80%A7%E8%AE%BE%E8%AE%A1%E8%AF%B4%E6%98%8E%E4%B9%A6.html 
  - https://www.openubmc.cn/docs/zh/latest/release_designs/openUBMC%20%E5%9C%A8%E7%BA%BF%E8%B0%83%E8%AF%95%E7%89%B9%E6%80%A7%E8%AE%BE%E8%AE%A1%E8%AF%B4%E6%98%8E%E4%B9%A6.html 
  - https://www.openubmc.cn/docs/zh/latest/release_designs/openUBMC%20libmcpp%E7%89%B9%E6%80%A7%E8%AE%BE%E8%AE%A1%E8%AF%B4%E6%98%8E%E4%B9%A6.html 
  - https://www.openubmc.cn/docs/zh/latest/release_designs/openUBMC%20PCIe%E8%B5%84%E6%BA%90%E6%94%AF%E6%8C%81multihost%E7%89%B9%E6%80%A7%E8%AE%BE%E8%AE%A1%E8%AF%B4%E6%98%8E%E4%B9%A6.html 
  - https://www.openubmc.cn/docs/zh/latest/release_designs/openUBMC%20Qemu%E7%89%B9%E6%80%A7%E8%AE%BE%E8%AE%A1%E8%AF%B4%E6%98%8E%E4%B9%A6.html 
- [重复 4 次] `概述 | 文档中心 | openUBMC`
  - https://www.openubmc.cn/docs/zh/latest/build_upgrade/build_overview.html 
  - https://www.openubmc.cn/docs/zh/latest/installation/install_overview.html 
  - https://www.openubmc.cn/docs/zh/latest/testing/test_overview.html 
  - https://www.openubmc.cn/docs/zh/latest/troubleshooting/troubleshooting_overview.html 
- [重复 4 次] `常见问题 | 文档中心 | openUBMC`
  - https://www.openubmc.cn/docs/zh/latest/general_faq/common_faq.html 
  - https://www.openubmc.cn/docs/zh/latest/installation/install_faq.html 
  - https://www.openubmc.cn/docs/zh/latest/integration/integration_faq.html 
  - https://www.openubmc.cn/docs/zh/latest/overview/overview_faq.html 
- …其余 54 组见完全版报告

**description**：1 组重复，涉及 4218 个页面
- [重复 4218 次] `openUBMC`
  - https://www.openubmc.cn/docs/en/latest/development/design_reference/architecture.html 
  - https://www.openubmc.cn/docs/en/latest/development/design_reference/key_feature/observability.html 
  - https://www.openubmc.cn/docs/en/latest/development/design_reference/key_feature/app_startup.html 
  - https://www.openubmc.cn/docs/en/latest/development/design_reference/key_feature/orm_obj_mgmt_guide.html 
  - https://www.openubmc.cn/docs/en/latest/development/design_reference/introduction.html 
  - …其余 4213 个见完全版报告

**TDK 缺失**：共 4221 页 —— keywords 4221 页（元素缺失 4221 / 内容为空 0）
- https://www.openubmc.cn/docs/en/latest/development/design_reference/architecture.html （keywords 元素缺失）
- https://www.openubmc.cn/docs/en/latest/development/design_reference/key_feature/observability.html （keywords 元素缺失）
- https://www.openubmc.cn/docs/en/latest/development/design_reference/key_feature/app_startup.html （keywords 元素缺失）
- https://www.openubmc.cn/docs/en/latest/development/design_reference/key_feature/orm_obj_mgmt_guide.html （keywords 元素缺失）
- https://www.openubmc.cn/docs/en/latest/development/design_reference/introduction.html （keywords 元素缺失）
- …其余 4216 条见完全版报告
