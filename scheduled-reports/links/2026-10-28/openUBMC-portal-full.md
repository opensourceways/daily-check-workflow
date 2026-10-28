# 失效链接检查完全版报告 · openUBMC 官网（openUBMC-portal）

- 检查时间：2026-10-28T12:22:17.637Z
- 运行模式：dry-run（未提 issue）

### 项目信息

- 项目：openUBMC 官网（openUBMC-portal）
- 数据源：`https://gitcode.com/openUBMC/website`（main 分支，取 AtomGit 同名镜像）
- 站点域名：https://www.openubmc.cn
- 相对路径前缀（urlPrefix）：`/zh`
- 结论：❌（失效 URL 198 个 / 270 处引用）

### 扫描概况

| 扫描文件 | 链接引用 | 探测 URL（去重后） | 有效 | 失效 |
| --- | --- | --- | --- | --- |
| 703 | 1147 | 827 | 629 | 198 |

### 失效链接明细（状态分布：`403`×2、`404`×144、`418`×44、`521`×1、`网络错误`×7）

#### HTTP 403（2 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://summary.openubmc.cn` | packages/website/config/url-config/index.ts:7 | — |
| `https://www.openubmc.cn/docs/zh/` | .agents/skills/docs-update-news/SKILL.md:173 | — |

#### HTTP 404（144 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://atomgit.com/api/v5/repos/` | .agents/skills/release-note-sync/SKILL.md:31 | — |
| `https://example.com/a.zip` | packages/website/utils/__tests__/repo-meta.test.ts:10 | — |
| `https://repo.openubmc.cn/tools/openUBMC_qemu_default.cpio.gz` | packages/website/utils/__tests__/repo-meta.test.ts:18 | — |
| `https://www.openubmc.cn/docs/en/development/quick_start/prepare_environment/docker_env.html` | packages/website/content/en/blogs/start_openUBMC.md:18 | — |
| `https://www.openubmc.cn/docs/en/development/quick_start/prepare_environment/ubuntu_env.html` | packages/website/content/en/blogs/Migration_system.md:36、packages/website/content/en/blogs/Migration_system.md:50 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/account.html` | packages/website/config/news-hotspots.ts:465 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/bios.html` | packages/website/config/news-hotspots.ts:324、packages/website/config/news-hotspots.ts:388、packages/website/config/news-hotspots.ts:473 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/bmc_network.html` | packages/website/config/news-hotspots.ts:214、packages/website/config/news-hotspots.ts:315、packages/website/config/news-hotspots.ts:391 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/bmc_soc.html` | packages/website/config/news-hotspots.ts:213、packages/website/config/news-hotspots.ts:331、packages/website/config/news-hotspots.ts:397 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/bmc_upgrade.html` | packages/website/config/news-hotspots.ts:472 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/capability_proxy.html` | packages/website/config/news-hotspots.ts:419 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/certificate.html` | packages/website/config/news-hotspots.ts:417、packages/website/config/news-hotspots.ts:490 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/chassis.html` | packages/website/config/news-hotspots.ts:377、packages/website/config/news-hotspots.ts:463 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/compute.html` | packages/website/config/news-hotspots.ts:212、packages/website/config/news-hotspots.ts:386 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/event_policy.html` | packages/website/config/news-hotspots.ts:304、packages/website/config/news-hotspots.ts:413 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/event.html` | packages/website/config/news-hotspots.ts:314、packages/website/config/news-hotspots.ts:401 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/firmware_mgmt.html` | packages/website/config/news-hotspots.ts:330、packages/website/config/news-hotspots.ts:491 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/frudata.html` | packages/website/config/news-hotspots.ts:211 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/iam.html` | packages/website/config/news-hotspots.ts:462 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/ipmi_core.html` | packages/website/config/news-hotspots.ts:316 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/libmcpp.html` | packages/website/config/news-hotspots.ts:341 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/lsw.html` | packages/website/config/news-hotspots.ts:477 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/manufacture.html` | packages/website/config/news-hotspots.ts:483 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/nsm.html` | packages/website/config/news-hotspots.ts:305、packages/website/config/news-hotspots.ts:414 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/oms.html` | packages/website/config/news-hotspots.ts:415 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/pcie_device.html` | packages/website/config/news-hotspots.ts:325、packages/website/config/news-hotspots.ts:407 | — |
| `https://www.openubmc.cn/docs/zh/development/api/app_api/remote_console.html` | packages/website/config/news-hotspots.ts:416 | — |
| `https://www.openubmc.cn/docs/zh/development/coding_standards/cpp_coding_standards.html` | packages/website/config/news-hotspots.ts:454 | — |
| `https://www.openubmc.cn/docs/zh/development/coding_standards/general_coding_standards.html` | packages/website/config/news-hotspots.ts:455 | — |
| `https://www.openubmc.cn/docs/zh/development/coding_standards/secure_coding_standards.html` | packages/website/config/news-hotspots.ts:456 | — |
| `https://www.openubmc.cn/docs/zh/development/design_reference/architecture.html` | packages/website/components/home/HomeFeatureContent.vue:69 | — |
| `https://www.openubmc.cn/docs/zh/development/design_reference/key_feature/Busctl_command.html` | packages/website/config/news-hotspots.ts:129 | — |
| `https://www.openubmc.cn/docs/zh/development/design_reference/key_feature/busctl_smbus.html` | packages/website/config/news-hotspots.ts:152 | — |
| `https://www.openubmc.cn/docs/zh/development/design_reference/key_feature/debug_tools.html` | packages/website/config/news-hotspots.ts:146 | — |
| `https://www.openubmc.cn/docs/zh/development/design_reference/key_feature/mdbctl_call.html` | packages/website/config/news-hotspots.ts:173 | — |
| `https://www.openubmc.cn/docs/zh/development/design_reference/key_feature/mdbctl_dloglimit.html` | packages/website/config/news-hotspots.ts:148 | — |
| `https://www.openubmc.cn/docs/zh/development/design_reference/key_feature/mdbctl_dtrace.html` | packages/website/config/news-hotspots.ts:157 | — |
| `https://www.openubmc.cn/docs/zh/development/design_reference/key_feature/mdbctl_lsprop_getprop.html` | packages/website/config/news-hotspots.ts:143 | — |
| `https://www.openubmc.cn/docs/zh/development/design_reference/key_feature/mdbctl_setprop.html` | packages/website/config/news-hotspots.ts:127 | — |
| `https://www.openubmc.cn/docs/zh/development/design_reference/key_feature/mdbctl_snapshot.html` | packages/website/config/news-hotspots.ts:131 | — |
| `https://www.openubmc.cn/docs/zh/development/design_reference/key_feature/mdbctl_traceprop.html` | packages/website/config/news-hotspots.ts:202、packages/website/config/news-hotspots.ts:205 | — |
| `https://www.openubmc.cn/docs/zh/development/design_reference/key_feature/model_rules.html` | packages/website/config/news-hotspots.ts:137 | — |
| `https://www.openubmc.cn/docs/zh/development/design_reference/key_feature/SMC_SMBUS.html` | packages/website/config/news-hotspots.ts:158 | — |
| `https://www.openubmc.cn/docs/zh/development/develop_guide/app_development/obmc_migration_guide.html` | packages/website/config/news-hotspots.ts:312 | — |
| `https://www.openubmc.cn/docs/zh/development/develop_guide/feature_development/bmc_studio_usage_instructions.html` | packages/website/config/news-hotspots.ts:93 | — |
| `https://www.openubmc.cn/docs/zh/development/develop_guide/feature_development/GPU_DriverSpecification1.0_Guide.html` | packages/website/config/news-hotspots.ts:236 | — |
| `https://www.openubmc.cn/docs/zh/development/develop_guide/feature_development/ipmi_channel_disconnect_analysis.html` | packages/website/config/news-hotspots.ts:459 | — |
| `https://www.openubmc.cn/docs/zh/development/develop_guide/feature_development/ipmi_cmd_customization_guide.html` | packages/website/config/news-hotspots.ts:452 | — |
| `https://www.openubmc.cn/docs/zh/development/develop_guide/feature_development/time_management_handbook.html` | packages/website/config/news-hotspots.ts:82 | — |
| `https://www.openubmc.cn/docs/zh/development/develop_guide/feature_development/upgrade.html` | packages/website/config/news-hotspots.ts:104 | — |
| `https://www.openubmc.cn/docs/zh/development/develop_guide/introduction.html` | packages/website/config/news-hotspots.ts:60、packages/website/config/news-hotspots.ts:209 | — |
| `https://www.openubmc.cn/docs/zh/development/develop_guide/product_development/cooling_configuration.html` | packages/website/config/news-hotspots.ts:412 | — |
| `https://www.openubmc.cn/docs/zh/development/develop_guide/product_development/upgrade.html` | packages/website/config/news-hotspots.ts:453 | — |
| `https://www.openubmc.cn/docs/zh/development/faq/Firmware_upgrade_Board_Management.html` | packages/website/config/news-hotspots.ts:55 | — |
| `https://www.openubmc.cn/docs/zh/development/faq/general.html` | packages/website/config/news-hotspots.ts:273 | — |
| `https://www.openubmc.cn/docs/zh/development/faq/sensor_adaptation_FAQ.html` | packages/website/config/news-hotspots.ts:182 | — |
| `https://www.openubmc.cn/docs/zh/development/faq/signing_package_creation_FAQ.html` | packages/website/config/news-hotspots.ts:44 | — |
| `https://www.openubmc.cn/docs/zh/development/faq/tools/bmc_studio.html` | packages/website/config/news-hotspots.ts:43 | — |
| `https://www.openubmc.cn/docs/zh/development/faq/upgrade_Management_FAQ.html` | packages/website/config/news-hotspots.ts:185 | — |
| `https://www.openubmc.cn/docs/zh/development/quick_start/create_an_app.html` | .agents/skills/docs-update-news/SKILL.md:169、packages/website/config/news-hotspots.ts:208、packages/website/config/news-hotspots.ts:253、packages/website/config/news-hotspots.ts:478 | — |
| `https://www.openubmc.cn/docs/zh/development/quick_start/env_introduction.html` | packages/website/config/news-hotspots.ts:332、packages/website/config/news-hotspots.ts:433、packages/website/config/news-hotspots.ts:492 | — |
| `https://www.openubmc.cn/docs/zh/development/quick_start/ubuntu_env.html` | packages/website/config/news-hotspots.ts:38、packages/website/config/news-hotspots.ts:301、packages/website/content/zh/blogs/Migration_system.md:37、packages/website/content/zh/blogs/Migration_system.md:51 | — |
| `https://www.openubmc.cn/docs/zh/development/quick_start/upgrade_your_own_bmc.html` | packages/website/config/news-hotspots.ts:190 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/bmc_cli/bmc_cli_dict/ipmcset-activeport.html` | packages/website/config/news-hotspots.ts:445 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/coding_standards.html` | packages/website/config/news-hotspots.ts:307 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/event_unique_identifier.html` | packages/website/config/news-hotspots.ts:179 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/AbnormalFan.html` | packages/website/config/news-hotspots.ts:323 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/ActiveStandbyRemote.html` | packages/website/config/news-hotspots.ts:392 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/BaseOSBoot.html` | packages/website/config/news-hotspots.ts:344 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/Bios.html` | packages/website/config/news-hotspots.ts:294 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/BIOSIPMIChannelConfig.html` | packages/website/config/news-hotspots.ts:342 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/BusinessConnector.html` | packages/website/config/news-hotspots.ts:295 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/ChassisConfiguration.html` | packages/website/config/news-hotspots.ts:348 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/CollectRegisters.html` | packages/website/config/news-hotspots.ts:349 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/CoolingConfig.html` | packages/website/config/news-hotspots.ts:380 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/CoolingPolicy.html` | packages/website/config/news-hotspots.ts:239 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/CPU.html` | packages/website/config/news-hotspots.ts:296、packages/website/config/news-hotspots.ts:390 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/CpuBoard.html` | packages/website/config/news-hotspots.ts:203、packages/website/config/news-hotspots.ts:469 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/CPUConfig.html` | packages/website/config/news-hotspots.ts:345 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/CPUIPMIChannelConfig.html` | packages/website/config/news-hotspots.ts:346 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/CPUMetrics.html` | packages/website/config/news-hotspots.ts:393 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/CPUPortConfig.html` | packages/website/config/news-hotspots.ts:347 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/DataSync.html` | packages/website/config/news-hotspots.ts:398 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/DFT.html` | packages/website/config/news-hotspots.ts:306 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/DftCfgMgmt.html` | packages/website/config/news-hotspots.ts:350 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/DftMcu.html` | packages/website/config/news-hotspots.ts:351 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/DftPmu.html` | packages/website/config/news-hotspots.ts:352 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/DftSerialLoopback.html` | packages/website/config/news-hotspots.ts:399 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/DftSPI.html` | packages/website/config/news-hotspots.ts:353 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/EthDevice.html` | packages/website/config/news-hotspots.ts:343 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/ExpBoard.html` | packages/website/config/news-hotspots.ts:204 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/FileSync.html` | packages/website/config/news-hotspots.ts:402 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/Firewall.html` | packages/website/config/news-hotspots.ts:403 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/InterNodeCableConfiguration.html` | packages/website/config/news-hotspots.ts:354 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/IpmbEth.html` | packages/website/config/news-hotspots.ts:404 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/LogicFirmware.html` | packages/website/config/news-hotspots.ts:470 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/LswPhyInfo.html` | packages/website/config/news-hotspots.ts:355 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/LswPortInfo.html` | packages/website/config/news-hotspots.ts:356 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/LswSwitchInfo.html` | packages/website/config/news-hotspots.ts:357 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/MCUFirmware.html` | packages/website/config/news-hotspots.ts:485 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/Memory.html` | packages/website/config/news-hotspots.ts:394、packages/website/config/news-hotspots.ts:486 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/MemoryChannel.html` | packages/website/config/news-hotspots.ts:358 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/MemoryMetrics.html` | packages/website/config/news-hotspots.ts:395 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/MemorySilk.html` | packages/website/config/news-hotspots.ts:359 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/NodePortAddr.html` | packages/website/config/news-hotspots.ts:367 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/NPU.html` | packages/website/config/news-hotspots.ts:360 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/NPUBDFConfig.html` | packages/website/config/news-hotspots.ts:361 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/NPUCard.html` | packages/website/config/news-hotspots.ts:362 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/NPUCardPowerDevice.html` | packages/website/config/news-hotspots.ts:363 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/NPUConfig.html` | packages/website/config/news-hotspots.ts:364 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/NPUFirmware.html` | packages/website/config/news-hotspots.ts:365 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/NPUPort.html` | packages/website/config/news-hotspots.ts:366 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/OCPCard.html` | packages/website/config/news-hotspots.ts:370 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/PcieAddrInfo.html` | packages/website/config/news-hotspots.ts:298 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/PCIeCardDisplayCustom.html` | packages/website/config/news-hotspots.ts:371 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/PCIeCardFlashChecker.html` | packages/website/config/news-hotspots.ts:372 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/PCIeDevice.html` | packages/website/config/news-hotspots.ts:297 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/PCIeIPMIChannelConfig.html` | packages/website/config/news-hotspots.ts:373 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/Pmu.html` | packages/website/config/news-hotspots.ts:396 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/PowerPoint.html` | packages/website/config/news-hotspots.ts:379 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/PropertySync.html` | packages/website/config/news-hotspots.ts:405 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/RiserCard.html` | packages/website/config/news-hotspots.ts:487 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/Scanner.html` | packages/website/config/news-hotspots.ts:180 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/SPIChannel.html` | packages/website/config/news-hotspots.ts:374 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/SPIRate.html` | packages/website/config/news-hotspots.ts:375 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/SystemFirmwareProgress.html` | packages/website/config/news-hotspots.ts:376 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/csr_conf_dict/object/Time.html` | packages/website/config/news-hotspots.ts:406 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/redfish/appendix.html` | packages/website/config/news-hotspots.ts:484 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/redfish/details/Systems/EthernetInterfaces.html` | packages/website/config/news-hotspots.ts:400 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/redfish/Redfish-Resource.html` | packages/website/config/news-hotspots.ts:464 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/SDK.html` | packages/website/config/news-hotspots.ts:339 | — |
| `https://www.openubmc.cn/docs/zh/development/specifications/security/security_configuration_baseline.html` | packages/website/config/news-hotspots.ts:461 | — |
| `https://www.openubmc.cn/docs/zh/development/tool_guide/bmc_studio_installation.html` | packages/website/config/news-hotspots.ts:21、packages/website/config/news-hotspots.ts:50、packages/website/config/news-hotspots.ts:210、packages/website/config/news-hotspots.ts:254、packages/website/content/zh/blogs/2506-bmc-studio.md:22 | — |
| `https://www.openubmc.cn/docs/zh/development/tool_guide/bmc_studio_tool.html` | packages/website/config/news-hotspots.ts:51、packages/website/config/news-hotspots.ts:189、packages/website/config/news-hotspots.ts:268、packages/website/config/news-hotspots.ts:275、packages/website/config/news-hotspots.ts:489、packages/website/content/zh/blogs/2506-bmc-studio.md:26、packages/website/content/zh/news/community-operation report7.md:93、packages/website/content/zh/news/ubmc-studio-2.0.3.md:12、packages/website/content/zh/news/ubmc-studio-2.0.3.md:19、packages/website/content/zh/news/ubmc-studio.md:12、packages/website/content/zh/news/ubmc-studio.md:19 | — |
| `https://www.openubmc.cn/docs/zh/development/tool_guide/docker_env.html` | packages/website/config/news-hotspots.ts:25、packages/website/config/news-hotspots.ts:49、packages/website/config/news-hotspots.ts:59、packages/website/config/news-hotspots.ts:262、packages/website/config/news-hotspots.ts:302、packages/website/config/news-hotspots.ts:334、packages/website/config/news-hotspots.ts:474 | — |
| `https://www.openubmc.cn/docs/zh/development/tool_guide/http_interface_debug_guide.html` | packages/website/config/news-hotspots.ts:223 | — |
| `https://www.openubmc.cn/docs/zh/development/tool_guide/plugin_usage.html` | packages/website/config/news-hotspots.ts:53 | — |
| `https://www.openubmc.cn/docs/zh/development/tool_guide/qemu_device_management.html` | packages/website/config/news-hotspots.ts:52 | — |
| `https://www.openubmc.cn/docs/zh/development/tool_guide/windows_env.html` | packages/website/config/news-hotspots.ts:303、packages/website/config/news-hotspots.ts:418、packages/website/config/news-hotspots.ts:471 | — |
| `https://www.openubmc.cn/docs/zh/latest/feature_dev/create_an_app.html` | packages/website/config/news-hotspots.ts:567 | — |
| `https://www.xxxx.xxx/en/` | .agents/skills/frontmatter-data-extractor/SKILL.md:74 | — |
| `https://www.xxxx.xxx/en/download/` | .agents/skills/frontmatter-data-extractor/SKILL.md:76 | — |
| `https://www.xxxx.xxx/zh/` | .agents/skills/frontmatter-data-extractor/SKILL.md:73 | — |
| `https://www.xxxx.xxx/zh/sig/sig-list/` | .agents/skills/frontmatter-data-extractor/SKILL.md:75 | — |

#### HTTP 418（44 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://atomgit.com/openUBMC/account/issues/213` | packages/website/content/zh/version/26.09.md:108 | — |
| `https://atomgit.com/openUBMC/bios/issues/159` | packages/website/content/zh/version/26.09.md:94 | — |
| `https://atomgit.com/openUBMC/bios/issues/162` | packages/website/content/zh/version/26.09.md:94 | — |
| `https://atomgit.com/openUBMC/bios/issues/163` | packages/website/content/zh/version/26.09.md:94 | — |
| `https://atomgit.com/openUBMC/bios/issues/164` | packages/website/content/zh/version/26.09.md:94 | — |
| `https://atomgit.com/openUBMC/component_drivers/issues/175` | packages/website/content/zh/version/26.09.md:146 | — |
| `https://atomgit.com/openUBMC/fructrl/issues/72` | packages/website/content/zh/version/26.09.md:149 | — |
| `https://atomgit.com/openUBMC/fructrl/issues/76` | packages/website/content/zh/version/26.09.md:81 | — |
| `https://atomgit.com/openUBMC/frudata/issues/49` | packages/website/content/zh/version/26.09.md:153 | — |
| `https://atomgit.com/openUBMC/general_hardware/issues/320` | packages/website/content/zh/version/26.09.md:152 | — |
| `https://atomgit.com/openUBMC/libmcpp/issues/118` | packages/website/content/zh/version/26.09.md:150 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/29` | packages/website/content/zh/version/26.09.md:77 | — |
| `https://atomgit.com/openUBMC/libroute_mapper/issues/31` | packages/website/content/zh/version/26.09.md:77 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/388` | packages/website/content/zh/version/26.09.md:78 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/392` | packages/website/content/zh/version/26.09.md:84 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/393` | packages/website/content/zh/version/26.09.md:83 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/402` | packages/website/content/zh/version/26.09.md:80 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/405` | packages/website/content/zh/version/26.09.md:82 | — |
| `https://atomgit.com/openUBMC/mdb_interface/issues/408` | packages/website/content/zh/version/26.09.md:79 | — |
| `https://atomgit.com/openUBMC/network_adapter/issues/430` | packages/website/content/zh/version/26.09.md:142 | — |
| `https://atomgit.com/openUBMC/nsm/issues/6` | packages/website/content/zh/version/26.09.md:143 | — |
| `https://atomgit.com/openUBMC/pcie_device/issues/124` | packages/website/content/zh/version/26.09.md:147 | — |
| `https://atomgit.com/openUBMC/power_mgmt/issues/265` | packages/website/content/zh/version/26.09.md:92 | — |
| `https://atomgit.com/openUBMC/QA/issues/227` | packages/website/content/zh/version/26.09.md:106 | — |
| `https://atomgit.com/openUBMC/QA/issues/233` | packages/website/content/zh/version/26.09.md:106 | — |
| `https://atomgit.com/openUBMC/QA/issues/243` | packages/website/content/zh/version/26.09.md:107 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/799` | packages/website/content/zh/version/26.09.md:148 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/833` | packages/website/content/zh/version/26.09.md:151 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/911` | packages/website/content/zh/version/26.09.md:103 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/912` | packages/website/content/zh/version/26.09.md:100 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/913` | packages/website/content/zh/version/26.09.md:101 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/928` | packages/website/content/zh/version/26.09.md:89 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/929` | packages/website/content/zh/version/26.09.md:90 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/936` | packages/website/content/zh/version/26.09.md:84 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/938` | packages/website/content/zh/version/26.09.md:102 | — |
| `https://atomgit.com/openUBMC/rackmount/issues/999` | packages/website/content/zh/version/26.09.md:85 | — |
| `https://atomgit.com/openUBMC/rootfs_user/issues/14` | packages/website/content/zh/version/26.09.md:154 | — |
| `https://atomgit.com/openUBMC/thermal_mgmt/issues/191` | packages/website/content/zh/version/26.09.md:95 | — |
| `https://atomgit.com/openUBMC/vpd/issues/525` | packages/website/content/zh/version/26.09.md:144 | — |
| `https://atomgit.com/openUBMC/vpd/issues/631` | packages/website/content/zh/version/26.09.md:93 | — |
| `https://atomgit.com/openUBMC/webui/issues/422` | packages/website/content/zh/version/26.09.md:91 | — |
| `https://atomgit.com/openUBMC/webui/issues/423` | packages/website/content/zh/version/26.09.md:88 | — |
| `https://raw.gitcode.com/` | .agents/skills/release-note-sync/SKILL.md:38 | — |
| `https://raw.gitcode.com/openUBMC/release_management/raw/main/openUBMC-26.09/release-note.md` | .agents/skills/release-note-sync/SKILL.md:16 | — |

#### HTTP 521（1 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `https://beian.miit.gov.cn/#/Integrated/index` | packages/website/config/url-config/index.ts:1 | — |

#### 网络错误（7 个）

| URL | 引用位置 | 错误 |
| --- | --- | --- |
| `http://192.168.xxx.xxx:7890` | packages/website/content/en/blogs/pki-cert-service-guide.md:56、packages/website/content/en/blogs/pki-cert-service-guide.md:57、packages/website/content/en/blogs/pki-cert-service-guide.md:80、packages/website/content/en/blogs/pki-cert-service-guide.md:81、packages/website/content/zh/blogs/pki-cert-service-guide.md:56、packages/website/content/zh/blogs/pki-cert-service-guide.md:57、packages/website/content/zh/blogs/pki-cert-service-guide.md:80、packages/website/content/zh/blogs/pki-cert-service-guide.md:81 | AbortError |
| `http://license.coscl.org.cn/MulanPSL2` | packages/website/content/en/version/25.03.md:9、packages/website/content/en/version/25.06.md:9、packages/website/content/en/version/25.09.md:10、packages/website/content/zh/version/25-12-LTS-SP2.md:11、packages/website/content/zh/version/25-12-LTS-SP3.md:11、packages/website/content/zh/version/25.03.md:10、packages/website/content/zh/version/25.06.md:10、packages/website/content/zh/version/25.09.md:11、packages/website/content/zh/version/25.12.md:11、packages/website/content/zh/version/26.03.md:11、packages/website/content/zh/version/26.06.md:10、packages/website/content/zh/version/26.09.md:11 | AbortError |
| `https://.../blob/main/openUBMC-26.09/open-source-software-notice.md` | .agents/skills/release-note-sync/SKILL.md:113 | ENOTFOUND |
| `https://192.168.xxx.xxx/ejbca/ra/` | packages/website/content/en/blogs/pki-cert-service-guide.md:601、packages/website/content/zh/blogs/pki-cert-service-guide.md:622 | ERR_SSL_SSLV3_ALERT_HANDSHAKE_FAILURE |
| `https://etherpad.openUBMC.org/` | packages/website/locales/sig/sig-en.ts:50、packages/website/locales/sig/sig-zh.ts:49 | ENOTFOUND |
| `https://myejbca.test.local:443/ejbca/ra/enrollwithusername.xhtml?username=superadmin` | packages/website/content/en/blogs/pki-cert-service-guide.md:161、packages/website/content/zh/blogs/pki-cert-service-guide.md:161 | EAI_AGAIN |
| `https://myejbca.test.local/ejbca/adminweb` | packages/website/content/en/blogs/pki-cert-service-guide.md:170、packages/website/content/zh/blogs/pki-cert-service-guide.md:171 | EAI_AGAIN |
