# llms.txt 检查简短报告 · openUBMC 文档（openUBMC-docs）

- 检查时间：2026-10-24T09:16:35.573Z
- llms.txt：https://www.openubmc.cn/docs/llms.txt
- 结论：❌

### 问题清单（1 项硬性不符合）

- ❌ 体积 635,708 字符超 100,000 上限，应拆分 `/_llms/` 子索引

### 告警（4 条）

- ⚠️ llms-full.txt Source URL 非绝对地址（格式：url-blockquote）
- ⚠️ 链接描述覆盖率 0.1%，低于 80% 基线（P1）
- ⚠️ 单节链接超建议值 20 条：Development Guide / 开发指南(63)、Specifications / 技术规范(1395)、General Reference / 综合参考(49)、component_interface_spec(58)、feature_dev(77)、component_adapt(29)、csr_ref(400)、system_adapt(23)、interface_custom(1696)、architecture(34)、troubleshooting_cases(208)
- ⚠️ HTTP `Link: rel="describedby"` 发现头缺失（P1，可在托管/CDN 层配置）
