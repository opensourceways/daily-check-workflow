# TDK 重复检查简短报告 · openEuler 官网（openEuler-portal）

- 检查时间：2026-11-11T07:05:08.041Z
- 检查方式：按 sitemap 全量页面逐页请求 HTML（与 JSON-LD 维度共用同一份抓取），对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）
- canonical 豁免：同值组内每一页都声明了 `<link rel="canonical">` 且统一指向同一个规范版本 URL 时，视为站点已主动指定规范版本，不计重复；此类组单列在"canonical 豁免组"章节供复核

- 检查范围：sitemap 全量页面 2042 个，成功抓取 2040 个（失败 2 个不计入）

**title**：17 组重复，涉及 34 个页面
- [重复 2 次] `Getting to Know Confidential Computing with secGear | openEuler`
  - https://www.openeuler.org/en/blog/20230113-segear/secGear 
  - https://www.openeuler.org/en/blog/20230818-secGear/Getting%20to%20Know%20Confidential%20Computing%20with%20secGear 
- [重复 2 次] `openEuler社区参与之旅 | openEuler社区官网`
  - https://www.openeuler.org/zh/blog/20230630-newcomer/0630-newcomer 
  - https://www.openeuler.org/zh/blog/myeuler/2020-5-13-openEuler-Travel 
- [重复 2 次] `openEuler secGear远程证明统一框架 | openEuler社区官网`
  - https://www.openeuler.org/zh/blog/20241230-secgear/20241230-secgear 
  - https://www.openeuler.org/zh/blog/20250409-secGear/20250409-secGear 
- …其余 14 组见完全版报告

**description**：115 组重复，涉及 237 个页面
- [重复 5 次] `openEuler 是一个开源、免费的 Linux 发行版平台，将通过开放的社区形式与全球的开发者共同构建一个开放、多元和架构包容的软件生态体系。同时，open…`
  - https://www.openeuler.org/zh/sig/role-description/ 
  - https://www.openeuler.org/zh/sig/sig-guidance/ 
  - https://www.openeuler.org/zh/sig/sig-list/ 
  - https://www.openeuler.org/zh/sig/meeting-guide/ 
  - https://www.openeuler.org/zh/sig/sig-minzuchess 
- [重复 4 次] `openEuler is an open source, free Linux distribution platform. The platform prov…`
  - https://www.openeuler.org/en/sig/role-description/ 
  - https://www.openeuler.org/en/sig/sig-guidance/ 
  - https://www.openeuler.org/en/sig/sig-list/ 
  - https://www.openeuler.org/en/sig/sig-minzuchess 
- [重复 4 次] `.`
  - https://www.openeuler.org/en/sig/Desktop 
  - https://www.openeuler.org/zh/sig/Desktop 
  - https://www.openeuler.org/en/sig/sig-OS-Builder 
  - https://www.openeuler.org/zh/sig/sig-OS-Builder 
- …其余 112 组见完全版报告

**keywords**：52 组重复，涉及 721 个页面
- [重复 468 次] `openEuler`
  - https://www.openeuler.org/en/news/202030721-Buzz/202030721-Buzz 
  - https://www.openeuler.org/en/news/20230911-OSSUMMIT-en/20230911-OSSUMMIT-en 
  - https://www.openeuler.org/en/news/20231213-risc-v%20-%20en/Untitled-1 
  - https://www.openeuler.org/en/news/20240307-openEuler%20Global%20Ecosystem%20Collaboration%20Workshop/ 
  - https://www.openeuler.org/en/news/20240329-OpenChain%20Workshop%202024%20Wrap-up/ 
  - …其余 463 个见完全版报告
- [重复 42 次] `openEuler, 社区运作报告`
  - https://www.openeuler.org/zh/news/20221125-10%E6%9C%88%E6%9C%88%E6%8A%A5- 
  - https://www.openeuler.org/zh/news/20221227-11%E6%9C%88%E6%9C%88%E6%8A%A5/%E6%9C%88%E6%8A%A5 
  - https://www.openeuler.org/zh/news/2022%E5%B9%B4%E5%BA%A6%E6%8A%A5%E5%91%8A/%E5%B9%B4%E5%BA%A6%E6%8A%A5%E5%91%8A 
  - https://www.openeuler.org/zh/news/20230113-12%E6%9C%88%E6%9C%88%E6%8A%A5/12%E6%9C%88%E6%9C%88%E6%8A%A5 
  - https://www.openeuler.org/zh/news/20230213-yuebao/20230210-yuebao 
  - …其余 37 个见完全版报告
- [重复 34 次] `Summit`
  - https://www.openeuler.org/zh/news/2022-12-02-%E7%94%9F%E6%80%81%E5%A4%A7%E4%BC%9A 
  - https://www.openeuler.org/zh/news/2022-12-16-100w 
  - https://www.openeuler.org/zh/news/20221125-summit 
  - https://www.openeuler.org/zh/news/20221125-%E4%BA%92%E8%81%94%E7%BD%91 
  - https://www.openeuler.org/zh/news/20221125-%E5%85%A8%E8%81%94%E6%8E%A5 
  - …其余 29 个见完全版报告
- …其余 49 组见完全版报告

**TDK 缺失**：共 663 页 —— description 7 页（元素缺失 3 / 内容为空 4）；keywords 656 页（元素缺失 656 / 内容为空 0）
- https://www.openeuler.org/zh/blog/20220722-embedded-fenbushi/fenbushi （description 元素缺失）
- https://www.openeuler.org/en/blog/rubik/ （description 元素缺失）
- https://www.openeuler.org/zh/blog/rubik/ （description 元素缺失）
- https://www.openeuler.org/zh/news/0621-x/0621-x （description 内容为空）
- https://www.openeuler.org/zh/news/20230303-zhongyi/20230303-zhongyi （description 内容为空）
- …其余 658 条见完全版报告
