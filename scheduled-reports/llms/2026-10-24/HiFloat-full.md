# llms.txt 检查完全版报告 · HiFloat（HiFloat）

- 检查时间：2026-10-24T09:16:35.573Z

### 项目信息

- 项目：HiFloat（HiFloat）
- llms.txt：https://hifloat.gccorg.com/llms.txt
- 结论：❌（硬性错误 1 项 / 告警 3 条）

### 问题清单（全部 1 项硬性不符合）

- ❌ H1 不唯一（应仅一行 `# 站点名`）

### 告警（全部 3 条）

- ⚠️ llms-full.txt 文件头缺 H1/Summary
- ⚠️ 链接描述覆盖率 30.8%，低于 80% 基线（P1）
- ⚠️ HTTP `Link: rel="describedby"` 发现头缺失（P1，可在托管/CDN 层配置）

### 检查项明细

| 检查项 | 结果 |
| --- | --- |
| HTTP 状态 | 200 ✅ |
| Content-Type | text/plain; charset=utf-8 ✅ |
| H1 | 不唯一 ❌ |
| Summary | ✅ |
| 链接 | 13 条（绝对 0 / 根相对 13 / 无法解析 0） ✅ |
| 描述覆盖率 | 30.8%（4/13，基线 ≥80%） ⚠️；空冒号 0、无标题 0、超300字符 0 |
| 分节 | 4 节 ✅；分布：`ZH Index`(2)、`EN Index`(2)、`Documents`(4)、`Table of Contents`(5) |
| 体积 | 2,101 字符（上限 100,000） ✅ |
| llms-full.txt | ✅（实测 370,047 字节，分析前 277,183 字符）；文件头：❌；Source 格式：bare-url |
| HTTP 发现头 | `Link: rel="describedby"` ❌；`X-Llms-Txt` （无） |
| .well-known 别名 | 404（P2 可选项）（https://hifloat.gccorg.com/.well-known/llms.txt） |
| robots LLM-Policy | ✅ https://hifloat.gccorg.com/llms.txt |
| 抽样链接 | ✅ https://hifloat.gccorg.com/zh(200)；✅ https://hifloat.gccorg.com/zh/activity(200)；✅ https://hifloat.gccorg.com/en(200) |
