import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const MEASURES_DIR = resolve(ROOT, 'measures');
const STATS_DIR = resolve(ROOT, 'workflow', 'stats');
const OUTPUT = resolve(__dirname, 'dashboard.md');

const MEASURES = [
  { id: '01-robots-txt', name: 'robots.txt', statsFile: 'robots-stats.json', script: 'check-robots.mjs' },
  { id: '02-llms-txt', name: 'llms.txt', statsFile: 'llms-txt-stats.json', script: 'check-llms-txt.mjs' },
  { id: '03-sitemap', name: 'sitemap', statsFile: 'sitemap-stats.json', script: 'check-sitemap.mjs' },
  { id: '04-json-ld', name: 'JSON-LD', statsFile: 'jsonld-stats.json', script: 'check-jsonld.mjs' },
  { id: '05-tdk', name: 'TDK', statsFile: 'tdk-stats.json', script: 'check-tdk.mjs' },
  { id: '06-a-tag-semantics', name: 'a标签语义', statsFile: 'a-tag-stats.json', script: 'check-a-tag.mjs' },
  { id: '07-tag-structure-semantics', name: '标签结构', statsFile: 'tag-structure-stats.json', script: 'check-tag-structure.mjs' },
  { id: '08-image-alt', name: '图片alt', statsFile: 'image-alt-stats.json', script: 'check-image-alt.mjs' },
];

const EMOJI_MAP = {
  '✅': '✅',
  '🟡': '🟡',
  '⚠️': '⚠️',
  '❌': '❌',
};

async function loadJson(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function parseProgressMd(measureId) {
  const filePath = resolve(MEASURES_DIR, measureId, '进展.md');
  let text;
  try {
    text = await readFile(filePath, 'utf8');
  } catch {
    return {};
  }
  const map = {};
  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || trimmed.includes('---') || trimmed.includes('状态')) continue;
    if (trimmed.includes('项目')) continue;
    const cells = trimmed.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length < 2) continue;
    const projectName = cells[0];
    const statusCell = cells[1];
    for (const [emoji] of Object.entries(EMOJI_MAP)) {
      if (statusCell.startsWith(emoji)) {
        map[projectName] = emoji;
        break;
      }
    }
    if (!map[projectName]) {
      if (statusCell.includes('已完成')) map[projectName] = '✅';
      else if (statusCell.includes('部分')) map[projectName] = '🟡';
      else if (statusCell.includes('问题')) map[projectName] = '⚠️';
      else if (statusCell.includes('未开始')) map[projectName] = '❌';
    }
  }
  return map;
}

function findResult(stats, projectId) {
  if (!stats || !stats.results) return null;
  return stats.results.find((r) => r.projectId === projectId) || null;
}

function assessMeasure(measureId, result) {
  if (!result || result.error) return null;
  const c = result.checks;
  if (!c) return null;
  switch (measureId) {
    case '01-robots-txt':
      // 新版脚本输出 verdict（含跨域/一致性告警与硬性错误）时以其为准
      if (result.verdict) return result.verdict;
      return c.accessible && c.userAgentPresent && c.contentSignalPresent && c.llmPolicyPresent ? '✅' : c.accessible ? '🟡' : '❌';
    case '02-llms-txt':
      // ✅ 需同时满足:P0 基线(可访问/结构/体积/robots 联动)+ P1 基线(描述覆盖率 ≥80%、llms-full 可访问且有文件头)
      return c.accessible && c.titlePresent && c.h1Unique && c.summaryPresent && c.linksPresent && c.linkUrlResolvable && c.contentTypeOk && c.sizeWithinLimit && c.robotsLlmPolicyPresent && c.descCoverageOk && c.llmsFullAccessible && c.llmsFull?.headOk
        ? '✅'
        : c.accessible
          ? '🟡'
          : '❌';
    case '03-sitemap':
      return c.accessible && (c.locNonAbsolute || 0) === 0 && (c.lastmodMissing || 0) === 0 ? '✅' : c.accessible ? '🟡' : '❌';
    case '04-json-ld':
      // ✅ 需同时满足:有块、P0 三件套齐全、必填属性完整、@context 合法、无重复注入
      return c.jsonLdCount > 0 && c.p0Missing.length === 0 && (c.requiredMissingCount || 0) === 0 && (c.contextErrorCount || 0) === 0 && (c.duplicateBlockCount || 0) === 0
        ? '✅'
        : c.jsonLdCount > 0
          ? '🟡'
          : '❌';
    case '05-tdk':
      return c.titlePresent && c.descriptionPresent ? '✅' : c.titlePresent ? '🟡' : '❌';
    case '06-a-tag-semantics':
      return c.badLinkText === 0 && c.javascriptHref === 0 && c.emptyHref === 0 ? '✅' : '🟡';
    case '07-tag-structure-semantics':
      return c.h1Unique ? '✅' : '🟡';
    case '08-image-alt':
      return c.altMissing === 0 ? '✅' : c.altMissingRate < 0.3 ? '🟡' : '❌';
    default:
      return null;
  }
}

const projects = (await loadJson(resolve(ROOT, 'projects.config.json')))?.projects || [];

const measureProgress = {};
const measureStats = {};
for (const measure of MEASURES) {
  measureProgress[measure.id] = await parseProgressMd(measure.id);
  measureStats[measure.id] = await loadJson(resolve(STATS_DIR, measure.statsFile));
}
const prSummary = await loadJson(resolve(STATS_DIR, 'pr-summary.json'));

let md = `# GEO 整改看板

> 由 \`generate-dashboard.mjs\` 自动生成，请勿手动编辑。
> 生成时间：${new Date().toISOString()}
>
> 矩阵状态优先取自各措施的 \`进展.md\`（人工维护），自动化检测结果作为补充标注。

## 措施 × 项目合规矩阵

| 项目 |`;
for (const m of MEASURES) md += ` ${m.name} |`;
md += ` 综合 |
|------|`;
for (const m of MEASURES) md += '------|';
md += '------|\n';

for (const project of projects) {
  md += `| ${project.name} |`;
  let okCount = 0;
  for (const m of MEASURES) {
    const progressStatus = measureProgress[m.id]?.[project.name];
    const scriptStatus = assessMeasure(m.id, findResult(measureStats[m.id], project.id));
    let cell = progressStatus || '⏳';
    if (scriptStatus && scriptStatus !== progressStatus && progressStatus) {
      cell = `${progressStatus}⚡${scriptStatus}`;
    } else if (!progressStatus && scriptStatus) {
      cell = `${scriptStatus}`;
    } else if (!progressStatus && !scriptStatus) {
      cell = '⏳';
    }
    if (cell.startsWith('✅')) okCount++;
    md += ` ${cell} |`;
  }
  const total = MEASURES.length;
  const overall = okCount === total ? '✅' : okCount >= total / 2 ? '🟡' : okCount > 0 ? '⚠️' : '❌';
  md += ` ${overall} (${okCount}/${total}) |\n`;
}

md += `
## 状态说明

| 标记 | 含义 |
|------|------|
| ✅ | 已完成：完全符合规范 |
| 🟡 | 部分完成：部分符合，有遗留问题 |
| ⚠️ | 有问题：已实施但存在缺陷 |
| ❌ | 未开始：尚未实施 |
| ⏳ | 待排查：尚未建立基线 |
| ✅⚡🟡 | 进展标记已完成，但自动化检测发现问题 |
| 🟡⚡✅ | 进展标记部分完成，自动化检测通过 |

## Issue / PR 统计

| 项目 | Issue 数 | PR 数 |
|------|----------|-------|
`;
if (prSummary && prSummary.results) {
  for (const r of prSummary.results) {
    md += `| ${r.projectName} | ${r.issueCount || 0} | ${r.prCount || 0} |\n`;
  }
} else {
  md += '| _尚未运行 fetch-prs.mjs，执行 `node workflow/scripts/fetch-prs.mjs` 生成_ | - | - |\n';
}

md += `
## 自动化检测状态

| 措施 | 检测脚本 | stats 文件 | 上次运行 |
|------|----------|------------|----------|
`;
for (const m of MEASURES) {
  const stats = measureStats[m.id];
  md += `| ${m.name} | \`${m.script}\` | ${m.statsFile} | ${stats?.timestamp ? '✅ ' + stats.timestamp : '⏳ 未运行'} |\n`;
}

md += `
## 各措施详情

| 措施 | 规范 | 进展 | 差异点 | 检测方式 |
|------|------|------|--------|----------|
`;
const BASE = '../measures';
for (const m of MEASURES) {
  md += `| ${m.name} | [规范](${BASE}/${m.id}/规范.md) | [进展](${BASE}/${m.id}/进展.md) | [差异点](${BASE}/${m.id}/各项目差异点.md) | [检测](${BASE}/${m.id}/检测方式.md) |\n`;
}

md += `
## 相关入口

- [总索引](../index.md)
- [项目配置](../projects.config.json)
- [定时检查自动报告](../scheduled-reports/)
- [人工检查问题](../manual-review/issues/)
- [复盘记录](../manual-review/retrospectives/)
- [归档文档](../archive/)
- [Workflow 说明](../workflow/README.md)

## 更新方式

\`\`\`bash
# 1. 运行自动化检查（生成 stats JSON）
cd workflow && node scripts/run-all.mjs

# 2. 生成/更新看板
cd .. && node dashboard/generate-dashboard.mjs
\`\`\`
`;

await writeFile(OUTPUT, md, 'utf8');
console.log(`看板已生成：${OUTPUT}`);
