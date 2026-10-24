# llms.txt 检查完全版报告 · openGauss 文档（openGauss-docs）

- 检查时间：2026-10-24T09:16:35.573Z

### 项目信息

- 项目：openGauss 文档（openGauss-docs）
- llms.txt：https://docs.opengauss.org/llms.txt
- 结论：❌（硬性错误 1 项 / 告警 5 条）

### 问题清单（全部 1 项硬性不符合）

- ❌ 缺少 Summary blockquote（`> 摘要`）

### 告警（全部 5 条）

- ⚠️ llms-full.txt 文件头缺 H1/Summary
- ⚠️ llms-full.txt Source URL 非绝对地址（格式：url-yaml）
- ⚠️ 链接描述覆盖率 0.0%，低于 80% 基线（P1）
- ⚠️ HTTP `Link: rel="describedby"` 发现头缺失（P1，可在托管/CDN 层配置）
- ⚠️ /.well-known/llms.txt 返回 HTML，伪别名易误导（SPA 兜底路由）

### 检查项明细

| 检查项 | 结果 |
| --- | --- |
| HTTP 状态 | 200 ✅ |
| Content-Type | text/plain; charset=utf-8 ✅ |
| H1 | 存在且唯一 ✅ |
| Summary | ❌ |
| 链接 | 21 条（绝对 6 / 根相对 15 / 无法解析 0） ✅ |
| 描述覆盖率 | 0.0%（0/21，基线 ≥80%） ⚠️；空冒号 0、无标题 0、超300字符 0 |
| 分节 | 2 节 ✅；分布：`Table of Contents`(15)、`llms.txt and llms-full.txt of docs`(6) |
| 体积 | 1,463 字符（上限 100,000） ✅ |
| llms-full.txt | ✅（实测 143,573 字节，分析前 95,706 字符）；文件头：❌；Source 格式：url-yaml |
| HTTP 发现头 | `Link: rel="describedby"` ❌；`X-Llms-Txt` （无） |
| .well-known 别名 | ❌ 返回 HTML（伪别名）（https://docs.opengauss.org/.well-known/llms.txt） |
| robots LLM-Policy | ✅ https://docs.opengauss.org/llms.txt |
| 抽样链接 | ✅ https://docs.opengauss.org/zh/docs/common/faq/core.md(200)；✅ https://docs.opengauss.org/en.md(200)；✅ https://docs.opengauss.org/en/docs/common/contribute/documentation_writing_specifications.md(200) |
