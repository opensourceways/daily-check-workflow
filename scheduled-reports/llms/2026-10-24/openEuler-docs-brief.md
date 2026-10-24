# llms.txt 检查简短报告 · openEuler 文档（openEuler-docs）

- 检查时间：2026-10-24T09:16:35.573Z
- llms.txt：https://docs.openeuler.org/llms.txt
- 结论：❌

### 问题清单（1 项硬性不符合）

- ❌ 体积 649,563 字符超 100,000 上限，应拆分 `/_llms/` 子索引

### 告警（5 条）

- ⚠️ llms-full.txt 文件头缺 H1/Summary
- ⚠️ llms-full.txt Source URL 非绝对地址（格式：url-yaml）
- ⚠️ 链接描述覆盖率 4.6%，低于 80% 基线（P1）
- ⚠️ 单节链接超建议值 20 条：Table of Contents(105)、26.09 documents(804)、24.03_LTS_SP4 documents(884)、24.03_LTS_SP3 documents(912)、25.09 documents(785)、24.03_LTS_SP2 documents(818)、25.03 documents(776)、24.03_LTS_SP1 documents(693)、22.03_LTS_SP4 documents(620)
- ⚠️ HTTP `Link: rel="describedby"` 发现头缺失（P1，可在托管/CDN 层配置）
