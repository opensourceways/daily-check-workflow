# llms.txt 检查简短报告 · openGauss 文档（openGauss-docs）

- 检查时间：2026-10-24T09:16:35.573Z
- llms.txt：https://docs.opengauss.org/llms.txt
- 结论：❌

### 问题清单（1 项硬性不符合）

- ❌ 缺少 Summary blockquote（`> 摘要`）

### 告警（5 条）

- ⚠️ llms-full.txt 文件头缺 H1/Summary
- ⚠️ llms-full.txt Source URL 非绝对地址（格式：url-yaml）
- ⚠️ 链接描述覆盖率 0.0%，低于 80% 基线（P1）
- ⚠️ HTTP `Link: rel="describedby"` 发现头缺失（P1，可在托管/CDN 层配置）
- ⚠️ /.well-known/llms.txt 返回 HTML，伪别名易误导（SPA 兜底路由）
