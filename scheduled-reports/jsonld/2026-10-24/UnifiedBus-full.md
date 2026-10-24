# JSON-LD 检查完全版报告 · UnifiedBus（UnifiedBus）

- 检查时间：2026-10-24T10:14:27.082Z

### 项目信息

- 项目：UnifiedBus（UnifiedBus）
- 采样域名：https://www.unifiedbus.com
- 结论：❌（硬性错误 1 类 / 告警 1 条）

### 采样页面

| 页面 | JSON-LD 块数 | 类型 |
| --- | --- | --- |
| / | 0 | - |
| /docs | 0 | - |
| /zh/docs | 0 | - |
| https://www.unifiedbus.com/zh | 1 | WebSite、Organization |
| https://www.unifiedbus.com/en | 1 | Organization、WebSite |

### 问题清单（全部 1 类硬性不符合）

- ❌ P0 三件套缺失：BreadcrumbList（采样页未出现该类型）

### 告警（全部 1 条）

- ⚠️ 结构与推荐项问题 2 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）

### 结构与推荐项问题（全部 2 处）

- ⚠️ https://www.unifiedbus.com/zh · Organization：logo 为裸字符串,推荐 {"@type":"ImageObject","url":...} 形式
- ⚠️ https://www.unifiedbus.com/en · Organization：logo 为裸字符串,推荐 {"@type":"ImageObject","url":...} 形式
