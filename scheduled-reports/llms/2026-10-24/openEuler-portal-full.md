# llms.txt 检查完全版报告 · openEuler 官网（openEuler-portal）

- 检查时间：2026-10-24T09:16:35.573Z

### 项目信息

- 项目：openEuler 官网（openEuler-portal）
- llms.txt：https://www.openeuler.org/llms.txt
- 结论：❌（硬性错误 1 项 / 告警 3 条）

### 问题清单（全部 1 项硬性不符合）

- ❌ 体积 262,231 字符超 100,000 上限，应拆分 `/_llms/` 子索引

### 告警（全部 3 条）

- ⚠️ 描述超 300 字符 7 条（应取第一段并截断）
- ⚠️ 单节链接超建议值 20 条：Table of Contents(1068)、English contents(327)
- ⚠️ HTTP `Link: rel="describedby"` 发现头缺失（P1，可在托管/CDN 层配置）

### 检查项明细

| 检查项 | 结果 |
| --- | --- |
| HTTP 状态 | 200 ✅ |
| Content-Type | text/plain; charset=utf-8 ✅ |
| H1 | 存在且唯一 ✅ |
| Summary | ✅ |
| 链接 | 1394 条（绝对 1394 / 根相对 0 / 无法解析 0） ✅ |
| 描述覆盖率 | 100.0%（1394/1394，基线 ≥80%） ✅；空冒号 0、无标题 0、超300字符 7 |
| 分节 | 2 节，超限（>20 条）：Table of Contents(1068)、English contents(327) ⚠️；分布：`Table of Contents`(1068)、`English contents`(327) |
| 体积 | 262,231 字符（上限 100,000） ❌ |
| llms-full.txt | ✅（实测 1,396,061 字节，分析前 867,555 字符）；文件头：✅；Source 格式：bare-url |
| HTTP 发现头 | `Link: rel="describedby"` ❌；`X-Llms-Txt` （无） |
| .well-known 别名 | 404（P2 可选项）（https://www.openeuler.org/.well-known/llms.txt） |
| robots LLM-Policy | ✅ https://www.openeuler.org/llms.txt |
| 抽样链接 | ✅ https://www.openeuler.org/zh/annual-report/openEuler-annual-report-2024(200)；✅ https://www.openeuler.org/zh/annual-report/openEuler-annual-report-2025(200)；✅ https://www.openeuler.org/zh/approve/approve-info(200) |
