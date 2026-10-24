# llms.txt 检查简短报告 · openEuler 官网（openEuler-portal）

- 检查时间：2026-10-24T09:16:35.573Z
- llms.txt：https://www.openeuler.org/llms.txt
- 结论：❌

### 问题清单（1 项硬性不符合）

- ❌ 体积 262,231 字符超 100,000 上限，应拆分 `/_llms/` 子索引

### 告警（3 条）

- ⚠️ 描述超 300 字符 7 条（应取第一段并截断）
- ⚠️ 单节链接超建议值 20 条：Table of Contents(1068)、English contents(327)
- ⚠️ HTTP `Link: rel="describedby"` 发现头缺失（P1，可在托管/CDN 层配置）
