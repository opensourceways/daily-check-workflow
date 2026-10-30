# llms.txt 检查完全版报告 · MindSpore 官网（MindSpore-portal）

- 检查时间：2026-10-30T11:09:48.940Z

### 项目信息

- 项目：MindSpore 官网（MindSpore-portal）
- llms.txt：https://www.mindspore.cn/llms.txt
- 结论：❌（硬性错误 1 项 / 告警 4 条）

### 问题清单（全部 1 项硬性不符合）

- ❌ 体积 373,067 字符超 100,000 上限，应拆分 `/_llms/` 子索引

### 告警（全部 4 条）

- ⚠️ llms-full.txt 文件头缺 H1/Summary
- ⚠️ 描述超 300 字符 6 条（应取第一段并截断）
- ⚠️ 单节链接超建议值 20 条：News(1021)、TechnologyBlogs(631)、Activities(614)、VersionUpdates(44)、MindSpore Docs llms.txt and llms-full.txt(22)
- ⚠️ HTTP `Link: rel="describedby"` 发现头缺失（P1，可在托管/CDN 层配置）

### 检查项明细

| 检查项 | 结果 |
| --- | --- |
| HTTP 状态 | 200 ✅ |
| Content-Type | text/plain; charset=utf-8 ✅ |
| H1 | 存在且唯一 ✅ |
| Summary | ✅ |
| 链接 | 2319 条（绝对 2319 / 根相对 0 / 无法解析 0） ✅ |
| 描述覆盖率 | 97.9%（2270/2319，基线 ≥80%） ✅；空冒号 0、无标题 0、超300字符 6 |
| 分节 | 10 节，超限（>20 条）：News(1021)、TechnologyBlogs(631)、Activities(614)、VersionUpdates(44)、MindSpore Docs llms.txt and llms-full.txt(22) ⚠️；分布：`安装`(1)、`学习`(5)、`资源`(5)、`社区`(9)、`动态`(6)、`News`(1021)、`TechnologyBlogs`(631)、`Activities`(614)、`VersionUpdates`(44)、`MindSpore Docs llms.txt and llms-full.txt`(22) |
| 体积 | 373,067 字符（上限 100,000） ❌ |
| llms-full.txt | ✅（实测 6,941,227 字节，分析前 1,325,842 字符）；文件头：❌；Source 格式：bare-url |
| HTTP 发现头 | `Link: rel="describedby"` ❌；`X-Llms-Txt` （无） |
| .well-known 别名 | 404（P2 可选项）（https://www.mindspore.cn/.well-known/llms.txt） |
| robots LLM-Policy | ✅ https://www.mindspore.cn/llms.txt |
| 抽样链接 | ✅ https://www.mindspore.cn/install(200)；✅ https://www.mindspore.cn/knowledge-map(200)；✅ https://www.mindspore.cn/tutorials/zh-CN/master/index.html(200) |
