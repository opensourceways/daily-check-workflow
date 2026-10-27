// GEO issue 看板采集脚本：拉取各项目 AtomGit 仓库中标题以 "[GEO " 开头的**未关闭** issue，
// 把状态（含是否关联 PR）刷新到 dashboard/issues-dashboard.md。
// 口径说明：
//   - 只收集 open issue；看板每次全量重生成——上次记录里存在、本次未获取到的 issue（已被关闭/删除）自然从看板移除。
//   - 关联 PR 判定：扫本仓库 open/merged PR 的标题+正文里的 `#<编号>` 与 `/issues/<编号>` 引用，
//     命中未关闭 GEO issue 编号即视为该 issue 关联了该 PR。
//   - 某项目查询失败时该项目分区写"采集失败"；失败项目在上次记录里的 issue 行同样被移除（全量重生成口径）。
//   - 列表接口 per_page=100 单页，未翻页；单项目未关闭 [GEO] issue/PR 超过 100 会截断（现量级远未触及）。
// CLI：--site=ID（只采集单个项目，其余项目分区沿用上次看板内容）。
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjects, findProject } from '../lib/config.mjs';
import { parseOwnerRepo, listIssues, listPullRequests } from '../lib/atomgit.mjs';
import { writeStats, now } from '../lib/report.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const OUTPUT = resolve(ROOT, 'dashboard', 'issues-dashboard.md');

const PREFIX = '[GEO ';
const DIM_RE = /^\[GEO ([^\]]+)\]/;

function arg(name) {
  const p = process.argv.find((a) => a.startsWith(`--${name}=`));
  return p ? p.slice(name.length + 3) : '';
}

function esc(cell) {
  return String(cell ?? '').replace(/\|/g, '\\|');
}

function dateOnly(iso) {
  return iso ? String(iso).slice(0, 10) : '-';
}

function dimOf(title) {
  const m = DIM_RE.exec(title || '');
  return m ? m[1] : '?';
}

// 从 PR 标题+正文提取其引用的 issue 编号集合
function referencedIssueNumbers(pr) {
  const text = `${pr.title || ''}\n${pr.body || ''}`;
  const nums = new Set();
  for (const m of text.matchAll(/#(\d+)/g)) nums.add(m[1]);
  for (const m of text.matchAll(/\/issues\/(\d+)(?![\d/])/g)) nums.add(m[1]);
  return nums;
}

async function collectProject(project) {
  const entry = { projectId: project.id, projectName: project.name, repo: project.repo || '', issues: [], error: '' };
  const target = parseOwnerRepo(project.repo);
  if (!target) {
    entry.error = `repo 无法解析 owner/repo：${project.repo || '未配置'}`;
    return entry;
  }
  let openIssues;
  try {
    openIssues = await listIssues({ ...target, state: 'open' });
  } catch (err) {
    entry.error = `查询未关闭 issue 失败：${err.message}`;
    return entry;
  }
  const geoOpen = openIssues.filter((i) => typeof i.title === 'string' && i.title.startsWith(PREFIX) && !i.pull_request);
  const numberSet = new Set(geoOpen.map((i) => String(i.number)));

  // 扫 open + merged PR，建立 issue 编号 -> 关联 PR 列表
  const linked = new Map();
  let prScanFailed = '';
  for (const state of ['open', 'merged']) {
    try {
      const pulls = await listPullRequests({ ...target, state });
      for (const pr of pulls) {
        for (const num of referencedIssueNumbers(pr)) {
          if (!numberSet.has(num)) continue;
          if (!linked.has(num)) linked.set(num, []);
          linked.get(num).push({ number: pr.number, url: pr.html_url || `https://atomgit.com/${target.owner}/${target.repo}/pulls/${pr.number}`, state });
        }
      }
    } catch (err) {
      prScanFailed = `查询 PR 列表失败（${state}）：${err.message}`;
    }
  }

  entry.issues = geoOpen.map((i) => {
    const prs = linked.get(String(i.number)) || [];
    return {
      number: i.number,
      title: i.title,
      dim: dimOf(i.title),
      url: i.html_url || `https://atomgit.com/${target.owner}/${target.repo}/issues/${i.number}`,
      createdAt: i.created_at,
      updatedAt: i.updated_at || i.created_at,
      prs,
    };
  });
  if (prScanFailed) entry.prError = prScanFailed;
  return entry;
}

function renderSection(r) {
  const lines = [];
  lines.push(`## ${r.projectName}（${r.projectId}）`);
  lines.push('');
  if (r.error) {
    lines.push(`> ⚠️ 本次采集失败：${r.error}（上次记录的问题行已随全量重生成移除，下次采集成功后恢复）`);
    lines.push('');
    return lines.join('\n');
  }
  if (!r.issues.length) {
    lines.push('_当前无未关闭的 `[GEO *]` issue。_');
    lines.push('');
    return lines.join('\n');
  }
  lines.push('| 维度 | Issue | 状态 | 关联 PR | 创建时间 | 最后更新 |');
  lines.push('|------|-------|------|---------|----------|----------|');
  const sorted = [...r.issues].sort((a, b) => String(a.dim).localeCompare(String(b.dim)) || a.number - b.number);
  for (const i of sorted) {
    const prCell = i.prs.length
      ? i.prs.map((p) => `[!${p.number}](${p.url})（${p.state === 'open' ? '进行中' : '已合并'}）`).join('<br>')
      : '—';
    lines.push(`| ${esc(i.dim)} | [#${i.number}](${i.url}) ${esc(i.title.replace(DIM_RE, '').trim()) || '(无标题)'} | open（未关闭） | ${prCell} | ${dateOnly(i.createdAt)} | ${dateOnly(i.updatedAt)} |`);
  }
  lines.push('');
  if (r.prError) lines.push(`> ⚠️ ${r.prError}，关联 PR 状态可能不完整。`, '');
  return lines.join('\n');
}

// 解析上次看板：总览数据行（key=项目单元格文本）与项目分区（key=## 标题文本），供 --site 单项目模式合并
function extractPrevious(mdText) {
  const overviewRows = new Map();
  const sections = [];
  const lines = mdText.split('\n');
  let i = 0;
  for (; i < lines.length; i++) {
    if (lines[i].startsWith('| ')) {
      const cells = lines[i].split('|').map((c) => c.trim());
      if (cells.length >= 5 && cells[1] && !cells[1].includes('项目') && !cells[1].startsWith('---')) overviewRows.set(cells[1], lines[i]);
    }
    if (lines[i].startsWith('## ') && !lines[i].startsWith('## 总览')) break;
  }
  while (i < lines.length) {
    if (!lines[i].startsWith('## ')) { i++; continue; }
    const key = lines[i].slice(3).trim();
    const start = i;
    i++;
    while (i < lines.length && !lines[i].startsWith('## ')) i++;
    sections.push({ key, text: lines.slice(start, i).join('\n').trimEnd() });
  }
  return { overviewRows, sections };
}

const projects = await loadProjects();
const siteId = arg('site');
let selected = projects;
if (siteId) {
  const p = findProject(projects, siteId);
  if (!p) {
    console.error(`[issues-dashboard] 未找到项目 ${siteId}，可选：${projects.map((x) => x.id).join(', ')}`);
    process.exit(1);
  }
  selected = [p];
}

console.log(`[issues-dashboard] 采集 ${selected.length} 个项目的未关闭 [GEO] issue...`);
const results = [];
for (const project of selected) {
  const r = await collectProject(project);
  results.push(r);
  console.log(`[issues-dashboard] ${project.id}: ${r.error ? '失败（' + r.error + '）' : `未关闭 GEO issue ${r.issues.length} 个（关联 PR ${r.issues.filter((i) => i.prs.length).length} 个）`}`);
}

const ranKeys = new Set(results.map((r) => `${r.projectName}（${r.projectId}）`));
let prevOverviewRows = new Map();
let prevSections = [];
if (siteId) {
  try {
    const prev = extractPrevious(await readFile(OUTPUT, 'utf8'));
    prevOverviewRows = new Map([...prev.overviewRows].filter(([k]) => !ranKeys.has(k)));
    prevSections = prev.sections.filter((s) => !ranKeys.has(s.key));
  } catch {
    console.log('[issues-dashboard] 无历史看板可合并（首次生成），仅写入本次采集项目');
  }
}

let md = `# GEO Issue 看板

> 本文件由 \`scripts/checks/collect-issues-dashboard.mjs\` 自动生成（GitHub Action 每日定时执行），请勿手动编辑。
> 生成时间：${now()}
> 口径：各项目 AtomGit 仓库中标题以 \`[GEO \` 开头的**未关闭** issue，每次全量重生成——已关闭/删除的 issue 不再出现在本表中。
> 关联 PR：以本仓库 open/merged PR 标题或正文引用 issue 编号（\`#N\` / \`/issues/N\`）判定。
${siteId ? `> 注：本次为单项目采集（--site=${siteId}），其余项目分区与总览行沿用上次记录。\n` : ''}
## 总览

| 项目 | 未关闭 GEO issue | 已关联 PR | 未关联 PR |
|------|------------------|-----------|-----------|
`;
for (const r of results) {
  const total = r.issues.length;
  const withPr = r.issues.filter((i) => i.prs.length).length;
  md += `| ${esc(r.projectName)}（${r.projectId}） | ${r.error ? '⚠️ 采集失败（原因见下方分区）' : total} | ${r.error ? '-' : withPr} | ${r.error ? '-' : total - withPr} |\n`;
}
for (const row of prevOverviewRows.values()) md += `${row}\n`;
md += '\n' + results.map((r) => renderSection(r).trimEnd()).join('\n\n');
if (prevSections.length) md += '\n\n' + prevSections.map((s) => s.text).join('\n\n');
md += '\n';

await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, md, 'utf8');
const statsPath = await writeStats('issues-dashboard', { timestamp: now(), siteFilter: siteId || null, results });
console.log(`[issues-dashboard] 看板已写入 ${OUTPUT}`);
console.log(`[issues-dashboard] stats 已写入 ${statsPath}`);
