# GEO Workflow

自动化检查脚本体系，对各社区 GEO 整改措施进行检测并输出统计。

## 快速开始

```bash
cd workflow
node scripts/run-all.mjs          # 一键检查全部措施
node scripts/check-sitemap.mjs    # 单独检查 sitemap
node scripts/check-sitemap.mjs --site=openEuler-portal  # 检查单个项目
```

## 脚本一览

| 脚本 | 措施 | 输出文件 |
|------|------|----------|
| check-robots.mjs | robots.txt | stats/robots-stats.json |
| check-llms-txt.mjs | llms.txt | stats/llms-txt-stats.json |
| check-sitemap.mjs | sitemap | stats/sitemap-stats.json |
| check-jsonld.mjs | JSON-LD | stats/jsonld-stats.json |
| check-tdk.mjs | TDK | stats/tdk-stats.json |
| check-a-tag.mjs | a 标签语义 | stats/a-tag-stats.json |
| check-tag-structure.mjs | 标签结构语义化 | stats/tag-structure-stats.json |
| check-image-alt.mjs | 图片 alt 语义 | stats/image-alt-stats.json |
| fetch-prs.mjs | 各仓库 issue/PR 汇总 | stats/pr-summary.json |
| run-all.mjs | 一键执行全部检查 | stats/run-all-summary.json |

## 目录结构

```
workflow/
├── package.json
├── config/          # workflow 配置
├── lib/             # 公共库
│   ├── config.mjs   # 读取 projects.config.json
│   ├── http.mjs     # fetch 封装
│   ├── sitemap.mjs  # sitemap XML 解析
│   ├── robots.mjs   # robots.txt 解析
│   ├── html.mjs     # HTML 解析工具
│   ├── gitee.mjs    # Gitee API（issue/PR）
│   └── report.mjs   # 统计输出
├── scripts/         # 检查脚本
├── stats/           # 输出目录（JSON）
├── pr-summary.md    # PR 汇总
└── README.md
```

## 配置

项目信息统一在 `../projects.config.json` 中维护，脚本自动读取。
新增项目只需修改该配置文件，无需改动脚本。

## 看板

```bash
node ../dashboard/generate-dashboard.mjs   # 从 stats 汇聚生成看板
```
