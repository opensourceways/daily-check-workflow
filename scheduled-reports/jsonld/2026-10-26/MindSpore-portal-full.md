# JSON-LD 检查完全版报告 · MindSpore 官网（MindSpore-portal）

- 检查时间：2026-10-26T09:07:26.808Z

### 项目信息

- 项目：MindSpore 官网（MindSpore-portal）
- 采样入口：https://www.mindspore.cn ；sitemap 页面 2424 个，成功抓取 2420 个，失败 4 个
- 结论：❌（硬性错误 2 类 / 告警 3 条）

### 问题清单（全部 2 类硬性不符合）

- ❌ JSON 语法错误块 2 个（涉及 2 个页面，如 https://www.mindspore.cn/sig/en 、https://www.mindspore.cn/sig ）
- ❌ @context 异常块 5 个（应固定为 https://schema.org）

### JSON 语法错误块所在页面（共 2 页 2 块）

- ❌ https://www.mindspore.cn/sig/en 
- ❌ https://www.mindspore.cn/sig 

### @context 异常（全部 5 处）

- ❌ https://www.mindspore.cn/activities ：@context 异常: "https://schema.org"
- ❌ https://www.mindspore.cn/cases ：@context 异常: "https://schema.org"
- ❌ https://www.mindspore.cn/developers/lists ：@context 异常: "https://schema.org"
- ❌ https://www.mindspore.cn/internship ：@context 异常: "https://schema.org"
- ❌ https://www.mindspore.cn/lite ：@context 异常: "https://schema.org"

### 告警（全部 3 条，不触发提单，是否整改人工定夺）

- ⚠️ Google 必填属性缺失 23 处（主要：Event.location×12、WebPage.url×5、WebPage.name×2 等；已降级为告警级，人工定夺，不触发提单）
- ⚠️ 结构与推荐项问题 20 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）
- ⚠️ @id 覆盖率 3%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）

### Google 必填属性缺失（告警级，共 23 处）

| 缺失项（type.prop） | 处数 | 涉及页面（前 20 个） |
| --- | --- | --- |
| Event.location | 12 | https://www.mindspore.cn/activities/zh/2025-12-12 https://www.mindspore.cn/activities/zh/2025-12-5 https://www.mindspore.cn/activities/zh/2026-4-28-2 https://www.mindspore.cn/activities/zh/2026-5-11 https://www.mindspore.cn/activities/zh/2026-5-12 https://www.mindspore.cn/activities/zh/2026-5-18-2 https://www.mindspore.cn/activities/zh/2026-5-19 https://www.mindspore.cn/activities/zh/2026-5-19-2 https://www.mindspore.cn/activities/zh/2026-5-20-2 https://www.mindspore.cn/activities/zh/saudi-china-opensource-exchange-2025 https://www.mindspore.cn/summit/devday2025 https://www.mindspore.cn/summit/summit2024/achievement  |
| WebPage.url | 5 | https://www.mindspore.cn/activities https://www.mindspore.cn/cases https://www.mindspore.cn/developers/lists https://www.mindspore.cn/internship https://www.mindspore.cn/lite  |
| WebPage.name | 2 | https://www.mindspore.cn/internship https://www.mindspore.cn/lite  |
| Event.startDate | 2 | https://www.mindspore.cn/summit/devday2025 https://www.mindspore.cn/summit/summit2024/achievement  |
| Article.image | 1 | https://www.mindspore.cn/sig/meeting-guide/en  |
| Article.datePublished | 1 | https://www.mindspore.cn/sig/meeting-guide/en  |

### 结构与推荐项问题（全部 20 处）

- ⚠️ https://www.mindspore.cn/developers/lists  · Organization：logo 为裸字符串,推荐 {"@type":"ImageObject","url":...} 形式
- ⚠️ https://www.mindspore.cn/governance/en  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/governance  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/lite  · Organization：logo 为裸字符串,推荐 {"@type":"ImageObject","url":...} 形式
- ⚠️ https://www.mindspore.cn/msg  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/program  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/sig/AKG  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/sig/LLM Inference Serving  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/sig/MindSpore Core  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/sig/MindSpore Lite  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/sig/MindSpore Quantum  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/sig/MindSpore Science  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/sig/MindSpore Technical Committee  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/sig/MindSpore Transformers  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/sig/MindSpore Usability  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/sig/Parallel Training System  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://www.mindspore.cn/sig/meeting-guide/en  · TechArticle：publisher 缺少 logo
- ⚠️ https://www.mindspore.cn/sig/role-description/en  · Organization：logo 为裸字符串,推荐 {"@type":"ImageObject","url":...} 形式
- ⚠️ https://www.mindspore.cn/sig/meeting-guide  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)

### 抓取失败页面（4 个，不计入判定）

- https://www.mindspore.cn/news/detail → 404
- https://www.mindspore.cn/news/detail/undefined/en → 404
- https://www.mindspore.cn/news/detail/en → 404
- https://www.mindspore.cn/sig/Security %26 Trusted AI → 404
