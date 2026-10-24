# llms.txt 检查完全版报告 · openUBMC 文档（openUBMC-docs）

- 检查时间：2026-10-24T09:16:35.573Z

### 项目信息

- 项目：openUBMC 文档（openUBMC-docs）
- llms.txt：https://www.openubmc.cn/docs/llms.txt
- 结论：❌（硬性错误 1 项 / 告警 4 条）

### 问题清单（全部 1 项硬性不符合）

- ❌ 体积 635,708 字符超 100,000 上限，应拆分 `/_llms/` 子索引

### 告警（全部 4 条）

- ⚠️ llms-full.txt Source URL 非绝对地址（格式：url-blockquote）
- ⚠️ 链接描述覆盖率 0.1%，低于 80% 基线（P1）
- ⚠️ 单节链接超建议值 20 条：Development Guide / 开发指南(63)、Specifications / 技术规范(1395)、General Reference / 综合参考(49)、component_interface_spec(58)、feature_dev(77)、component_adapt(29)、csr_ref(400)、system_adapt(23)、interface_custom(1696)、architecture(34)、troubleshooting_cases(208)
- ⚠️ HTTP `Link: rel="describedby"` 发现头缺失（P1，可在托管/CDN 层配置）

### 检查项明细

| 检查项 | 结果 |
| --- | --- |
| HTTP 状态 | 200 ✅ |
| Content-Type | text/plain; charset=utf-8 ✅ |
| H1 | 存在且唯一 ✅ |
| Summary | ✅ |
| 链接 | 4214 条（绝对 4214 / 根相对 0 / 无法解析 0） ✅ |
| 描述覆盖率 | 0.1%（2/4214，基线 ≥80%） ⚠️；空冒号 0、无标题 0、超300字符 0 |
| 分节 | 48 节，超限（>20 条）：Development Guide / 开发指南(63)、Specifications / 技术规范(1395)、General Reference / 综合参考(49)、component_interface_spec(58)、feature_dev(77)、component_adapt(29)、csr_ref(400)、system_adapt(23)、interface_custom(1696)、architecture(34)、troubleshooting_cases(208) ⚠️；分布：`Quick Start / 快速入门`(13)、`Architecture & Design / 架构与设计`(14)、`Development Guide / 开发指南`(63)、`Tool Guide / 工具指南`(9)、`Specifications / 技术规范`(1395)、`FAQ / 常见问题`(11)、`General Reference / 综合参考`(49)、`build`(15)、`upgrade`(8)、`bingo`(1)、`bmc_studio`(9)、`qemu`(2)、`concept_principle`(3)、`fan_power_adapt`(1)、`general_guide`(3)、`hdd_adapt`(1)、`nic_adapt`(3)、`xpu_adapt`(2)、`code_submission`(4)、`doc_submission`(6)、`asan_tool`(2)、`busctl_cmds`(2)、`http_debug_tool`(3)、`mdbctl_cmds`(9)、`smc_smbus_cmds`(1)、`component_dev_basics`(10)、`component_interface_spec`(58)、`concept_intro`(7)、`feature_dev`(77)、`alarm_event_config`(2)、`component_adapt`(29)、`csr_debounce`(2)、`csr_ref`(400)、`fru_mgmt`(2)、`principle_intro`(8)、`sensor_adapt`(4)、`system_adapt`(23)、`env_build`(2)、`system_config`(4)、`system_custom`(11)、`interface_custom`(1696)、`app_migration`(1)、`architecture`(34)、`test_case_design`(3)、`diagnosis_guide`(2)、`log_system`(5)、`troubleshooting_cases`(208)、`images`(1) |
| 体积 | 635,708 字符（上限 100,000） ❌ |
| llms-full.txt | ✅（实测 24,105,577 字节，分析前 1,415,872 字符）；文件头：✅；Source 格式：url-blockquote |
| HTTP 发现头 | `Link: rel="describedby"` ❌；`X-Llms-Txt` （无） |
| .well-known 别名 | 404（P2 可选项）（https://www.openubmc.cn/docs/.well-known/llms.txt） |
| 抽样链接 | ✅ https://openubmc.cn/docs/zh/latest/feature_dev/quick_start/create_an_app.html(200)；✅ https://openubmc.cn/docs/zh/latest/getting_started/quick_start/build_your_own_bmc.html(200)；✅ https://openubmc.cn/docs/zh/latest/getting_started/quick_start/env_introduction.html(200) |
