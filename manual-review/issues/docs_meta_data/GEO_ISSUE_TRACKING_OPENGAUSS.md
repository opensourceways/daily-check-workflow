# GEO 优化 issue 跟踪清单（openGauss）

向 openGauss 各文档仓提交的 GEO 优化 issue（frontmatter 元数据 + 图片 alt 属性）跟踪表。

- 提交日期：2026-10-14
- 提交人：persimmonzzz
- 模板：[GEO_ISSUE_TEMPLATE.md](./GEO_ISSUE_TEMPLATE.md)、[GEO_IMAGE_ALT_ISSUE_TEMPLATE.md](./GEO_IMAGE_ALT_ISSUE_TEMPLATE.md)
- 仓库清单依据：docs 仓各分支 `_toc.yaml` 的 `upstream` 引用 + common 分支 `.doctools/config.json` 登记仓（两途径交叉验证一致，共 6 仓）

## 一、主文档仓（opengauss/docs）

| 仓库 | 文档目录 | 元数据 issue | 图片 alt issue | 状态 |
| --- | --- | --- | --- | --- |
| opengauss/docs | docs/zh/、docs/en/（企业版）与 docs-lite/zh/、docs-lite/en/（轻量版） | [#7325](https://atomgit.com/opengauss/docs/issues/7325) | [#7326](https://atomgit.com/opengauss/docs/issues/7326) | 已提交 · 待响应 |

## 二、SIG 下沉仓 — atomgit.com/opengauss

| 仓库 | 文档目录 | 元数据 issue | 图片 alt issue | 状态 |
| --- | --- | --- | --- | --- |
| opengauss/openGauss-server | docs/zh/、docs/en/、docs-lite/zh/、docs-lite/en/，以及 src/gausskernel/storage/access/datavec/ 下的 docs/zh/、docs/en/、docs-lite/zh/、docs-lite/en/ | [#8577](https://atomgit.com/opengauss/openGauss-server/issues/8577) | [#8578](https://atomgit.com/opengauss/openGauss-server/issues/8578) | 已提交 · 待响应 |
| opengauss/Plugin | docs/zh/extension_reference/、docs/en/extension_reference/（含 docs-lite/zh/extension_reference/） | [#1644](https://atomgit.com/opengauss/Plugin/issues/1644) | [#1645](https://atomgit.com/opengauss/Plugin/issues/1645) | 已提交 · 待响应 |
| opengauss/openGauss-third_party | docs/zh/extension_reference/、docs/en/extension_reference/ | [#368](https://atomgit.com/opengauss/openGauss-third_party/issues/368) | [#369](https://atomgit.com/opengauss/openGauss-third_party/issues/369) | 已提交 · 待响应 |
| opengauss/oGRAC-docs | docs/zh/、docs/en/ | [#17](https://atomgit.com/opengauss/oGRAC-docs/issues/17) | [#18](https://atomgit.com/opengauss/oGRAC-docs/issues/18) | 已提交 · 待响应 |
| opengauss/openGauss-workbench | docs/zh/、docs/en/ | [#1416](https://atomgit.com/opengauss/openGauss-workbench/issues/1416) | [#1417](https://atomgit.com/opengauss/openGauss-workbench/issues/1417) | 已提交 · 待响应 |
