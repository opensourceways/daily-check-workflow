# llms.txt 检查完全版报告 · openEuler 文档（openEuler-docs）

- 检查时间：2026-10-24T09:16:35.573Z

### 项目信息

- 项目：openEuler 文档（openEuler-docs）
- llms.txt：https://docs.openeuler.org/llms.txt
- 结论：❌（硬性错误 1 项 / 告警 5 条）

### 问题清单（全部 1 项硬性不符合）

- ❌ 体积 649,563 字符超 100,000 上限，应拆分 `/_llms/` 子索引

### 告警（全部 5 条）

- ⚠️ llms-full.txt 文件头缺 H1/Summary
- ⚠️ llms-full.txt Source URL 非绝对地址（格式：url-yaml）
- ⚠️ 链接描述覆盖率 4.6%，低于 80% 基线（P1）
- ⚠️ 单节链接超建议值 20 条：Table of Contents(105)、26.09 documents(804)、24.03_LTS_SP4 documents(884)、24.03_LTS_SP3 documents(912)、25.09 documents(785)、24.03_LTS_SP2 documents(818)、25.03 documents(776)、24.03_LTS_SP1 documents(693)、22.03_LTS_SP4 documents(620)
- ⚠️ HTTP `Link: rel="describedby"` 发现头缺失（P1，可在托管/CDN 层配置）

### 检查项明细

| 检查项 | 结果 |
| --- | --- |
| HTTP 状态 | 200 ✅ |
| Content-Type | text/plain; charset=utf-8 ✅ |
| H1 | 存在且唯一 ✅ |
| Summary | ✅ |
| 链接 | 6397 条（绝对 0 / 根相对 6397 / 无法解析 0） ✅ |
| 描述覆盖率 | 4.6%（294/6397，基线 ≥80%） ⚠️；空冒号 0、无标题 0、超300字符 0 |
| 分节 | 9 节，超限（>20 条）：Table of Contents(105)、26.09 documents(804)、24.03_LTS_SP4 documents(884)、24.03_LTS_SP3 documents(912)、25.09 documents(785)、24.03_LTS_SP2 documents(818)、25.03 documents(776)、24.03_LTS_SP1 documents(693)、22.03_LTS_SP4 documents(620) ⚠️；分布：`Table of Contents`(105)、`26.09 documents`(804)、`24.03_LTS_SP4 documents`(884)、`24.03_LTS_SP3 documents`(912)、`25.09 documents`(785)、`24.03_LTS_SP2 documents`(818)、`25.03 documents`(776)、`24.03_LTS_SP1 documents`(693)、`22.03_LTS_SP4 documents`(620) |
| 体积 | 649,563 字符（上限 100,000） ❌ |
| llms-full.txt | ✅（实测 61,439,749 字节，分析前 1,797,633 字符）；文件头：❌；Source 格式：url-yaml |
| HTTP 发现头 | `Link: rel="describedby"` ❌；`X-Llms-Txt` （无） |
| .well-known 别名 | 404（P2 可选项）（https://docs.openeuler.org/.well-known/llms.txt） |
| robots LLM-Policy | ✅ https://docs.openeuler.org/llms.txt |
| 抽样链接 | ✅ https://docs.openeuler.org/en/docs/common/faq/caselibrary/pvs_vgs.md(200)；✅ https://docs.openeuler.org/en/docs/common/faq/caselibrary/mountsysroot.md(200)；✅ https://docs.openeuler.org/zh/docs/common/faq/caselibrary/zabbix.md(200) |
