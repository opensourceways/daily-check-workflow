# JSON-LD 检查完全版报告 · HiFloat（HiFloat）

- 检查时间：2026-10-26T09:07:26.808Z

### 项目信息

- 项目：HiFloat（HiFloat）
- 采样入口：https://hifloat.gccorg.com ；sitemap 页面 50 个，成功抓取 50 个，失败 0 个
- 结论：❌（硬性错误 1 类 / 告警 2 条）

### 问题清单（全部 1 类硬性不符合）

- ❌ @context 异常块 1 个（应固定为 https://schema.org）

### @context 异常（全部 1 处）

- ❌ https://hifloat.gccorg.com/en/space ：@context 异常: 缺失

### 告警（全部 2 条，不触发提单，是否整改人工定夺）

- ⚠️ 结构与推荐项问题 3 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）
- ⚠️ @id 覆盖率 13%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）

### 结构与推荐项问题（全部 3 处）

- ⚠️ https://hifloat.gccorg.com/docs/  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://hifloat.gccorg.com/en  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
- ⚠️ https://hifloat.gccorg.com/zh  · Organization：缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)
