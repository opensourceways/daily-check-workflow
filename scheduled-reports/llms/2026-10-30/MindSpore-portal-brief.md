# llms.txt 检查简短报告 · MindSpore 官网（MindSpore-portal）

- 检查时间：2026-10-30T11:09:48.940Z
- llms.txt：https://www.mindspore.cn/llms.txt
- 结论：❌

### 问题清单（1 项硬性不符合）

- ❌ 体积 373,067 字符超 100,000 上限，应拆分 `/_llms/` 子索引

### 告警（4 条）

- ⚠️ llms-full.txt 文件头缺 H1/Summary
- ⚠️ 描述超 300 字符 6 条（应取第一段并截断）
- ⚠️ 单节链接超建议值 20 条：News(1021)、TechnologyBlogs(631)、Activities(614)、VersionUpdates(44)、MindSpore Docs llms.txt and llms-full.txt(22)
- ⚠️ HTTP `Link: rel="describedby"` 发现头缺失（P1，可在托管/CDN 层配置）
