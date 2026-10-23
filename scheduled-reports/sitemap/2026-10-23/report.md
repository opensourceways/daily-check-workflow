# Sitemap 属性规范检查报告

- 检查时间：2026-10-23T09:28:19.970Z
- 检查范围：projects.config.json 中 9 个项目（跳过：MindSpore-docs）
- 运行模式：提 issue（--submit-issues）
- 规范来源：archive/SEO标准及覆盖情况.md（sitemaps.org），measures/03-sitemap/规范.md
- 检查项：loc（必选，绝对 URL、可访问）、lastmod（W3C 格式、非构建时间）、changefreq（有效枚举值、避免 never）、xhtml:link（多语言 alternate 完整性）
- 特殊约定：配置了 newVersions 的项目仅检查 index 中匹配 newVersions 的子 sitemap；domainAlias/sitemapAliasUrl 中的域名视为合法 loc 域名（openEuler 的 openatom.cn 不再计为主机不一致问题）
- xhtml:link 核实规则：仅当该页面按语言路径规则在 sitemap URL 全集中确实存在其他语言版本时，缺失/不完整才计为问题；规则——默认（zh-en-prefix）/zh/xxx ↔ /en/xxx、无前缀页 ↔ /zh、/en 两版本；MindSpore：/path ↔ /path/en，文章类（news/technology-blogs/activities/version-updates）/type/id ↔ /type/en/id
- 机器可读结果：workflow/stats/sitemap-spec-stats.json

## 总览

| 项目 | sitemap 地址 | 可访问 | 类型 | URL 数 | loc 问题 | lastmod 缺失 | changefreq 缺失 | xhtml:link 问题(核实后) | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| openEuler 官网（openEuler-portal） | https://www.openeuler.org/sitemap.xml | ✅ (200) | urlset | 2037 | 0 | 0 (0%) | 0 (0%) | 0/836 | ✅ 符合 |
| openEuler 文档（openEuler-docs） | https://docs.openeuler.org/sitemap_index.xml | ✅ (200) | index(26) | 6408 | 0 | 0 (0%) | 6408 (100%) | 8/5933 | ⚠️ 有告警，[issue](https://atomgit.com/openeuler/docs-website/issues/76) |
| openGauss 官网（openGauss-portal） | https://opengauss.org/sitemap.xml | ✅ (200) | urlset | 1339 | 0 | 0 (0%) | 0 (0%) | 0/272 | ✅ 符合 |
| openGauss 文档（openGauss-docs） | https://docs.opengauss.org/sitemap_index.xml | ✅ (200) | index(19) | 33533 | 0 | 0 (0%) | 33533 (100%) | 3/17580 | ⚠️ 有告警，[issue](https://atomgit.com/opengauss/docs-website/issues/35) |
| MindSpore 官网（MindSpore-portal） | https://www.mindspore.cn/sitemap.xml | ✅ (200) | urlset | 2424 | 0 | 17 (1%) | 0 (0%) | 1/60 | ⚠️ 有告警，[issue](https://atomgit.com/mindspore/mindspore-portal/issues/294) |
| MindSpore 文档（MindSpore-docs） | https://www.mindspore.cn/docs/sitemap.xml | ⏭️ | - | - | - | - | - | - | ⏭️ 跳过 |
| openUBMC 官网（openUBMC-portal） | https://www.openubmc.cn/sitemap.xml | ✅ (200) | urlset | 284 | 0 | 72 (25%) | 72 (25%) | 1/167 | ⚠️ 有告警，[issue](https://atomgit.com/openUBMC/website/issues/308) |
| openUBMC 文档（openUBMC-docs） | https://www.openubmc.cn/docs/sitemap.xml | ✅ (200) | urlset | 4218 | 0 | 0 (0%) | 0 (0%) | 0/0 | ✅ 符合 |
| UnifiedBus（UnifiedBus） | https://www.unifiedbus.com/sitemap.xml | ✅ (200) | urlset | 135 | 0 | 31 (23%) | 39 (29%) | 1/99 | ⚠️ 有告警，[issue](https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/109) |
| HiFloat（HiFloat） | https://hifloat.gccorg.com/sitemap.xml | ✅ (200) | index(2) | 50 | 0 | 27 (54%) | 27 (54%) | 1/17 | ⚠️ 有告警，[issue](https://atomgit.com/hifloat/hifloat-portal/issues/44) |

## 各项目明细

（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录 `<项目ID>-full.md`）
- openEuler 文档（openEuler-docs）：`openEuler-docs-full.md`，issue：https://atomgit.com/openeuler/docs-website/issues/76
- openGauss 文档（openGauss-docs）：`openGauss-docs-full.md`，issue：https://atomgit.com/opengauss/docs-website/issues/35
- MindSpore 官网（MindSpore-portal）：`MindSpore-portal-full.md`，issue：https://atomgit.com/mindspore/mindspore-portal/issues/294
- openUBMC 官网（openUBMC-portal）：`openUBMC-portal-full.md`，issue：https://atomgit.com/openUBMC/website/issues/308
- UnifiedBus（UnifiedBus）：`UnifiedBus-full.md`，issue：https://atomgit.com/unifiedbus/UnifiedBus-portal/issues/109
- HiFloat（HiFloat）：`HiFloat-full.md`，issue：https://atomgit.com/hifloat/hifloat-portal/issues/44

## 结论与建议

- 存在告警：openEuler-docs、openGauss-docs、MindSpore-portal、openUBMC-portal、UnifiedBus、HiFloat，主要是 lastmod 疑似构建时间、xhtml:link 缺失或 changefreq=never、loc 域名不一致等，按 measures/03-sitemap/规范.md 关键要求第 2/3/4 条评估整改。

> 注：xhtml:link 为条件性必选——仅当页面存在其他语言版本时必须声明（以 sitemap 全集核实）；lastmod "非构建时间"通过全量同值 + 与响应头 Last-Modified 对比启发式判断。各分类的完整/截断条目清单见明细文件或各项目完全版。