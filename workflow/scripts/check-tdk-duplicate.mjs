import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjects, filterProjects } from '../lib/config.mjs';
import { parseSitemap } from '../lib/sitemap.mjs';
import { extractTitle, extractMeta } from '../lib/html.mjs';
import { writeStats, now } from '../lib/report.mjs';
import { hasToken, parseOwnerRepo, findIssuesByTitlePrefix, createIssue } from '../lib/atomgit.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

// 参考 seo-check/scripts/description-check.js：按字段把页面值分组，组内 >1 个页面即重复组。
// 区别：不遍历本地构建产物，而是按 sitemap 全量页面 URL 发请求获取 HTML。
const FIELDS = ['title', 'description', 'keywords'];
// 缺失成因：noElement=标签/元素根本不存在；empty=元素存在但内容为空
const MISSING_REASONS = ['noElement', 'empty'];

// 提 issue 模式：扫描每个项目前先查目标 AtomGit 仓库是否已有本维度未关闭 issue（标题前缀匹配），
// 有则整个"扫描+提 issue"流程跳过该项目；发现重复时生成简短/完全两份 md 报告，
// issue 正文用简短版并附指向本仓库完全版报告的链接。
const ISSUE_TITLE_PREFIX = '[GEO TDK Duplicate]';
const submitIssues = process.argv.includes('--submit-issues');
const dryRun = process.argv.includes('--dry-run');

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;
const maxArg = process.argv.find((a) => a.startsWith('--max='));
const MAX_PAGES = maxArg ? Number(maxArg.split('=')[1]) : Infinity;
const concArg = process.argv.find((a) => a.startsWith('--conc='));
const CONCURRENCY = concArg ? Number(concArg.split('=')[1]) : 10;
// docs 大站（openEuler-docs/openGauss-docs/MindSpore-docs）页面量级大且历史版本同页 TDK 同值属预期，默认跳过；--skip= 传空可强制全查
const DEFAULT_SKIP = ['openeuler-docs', 'opengauss-docs', 'mindspore-docs'];
const skipArg = process.argv.find((a) => a.startsWith('--skip='));
const SKIPS = skipArg ? skipArg.split('=')[1].split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : DEFAULT_SKIP;

async function getText(url, timeout = 20000, retries = 2) {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        redirect: 'follow',
        headers: { 'user-agent': 'geo-workflow-checker/1.0' },
      });
      const text = await res.text();
      if (res.ok || res.status < 500) return { ok: res.ok, status: res.status, text };
    } catch {
      // 网络错误/超时，重试
    } finally {
      clearTimeout(timer);
    }
  }
  return { ok: false, status: null, text: '' };
}

async function mapLimit(items, limit, fn) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

// 收集项目全量页面 URL；配置 newVersions 的 docs 站仅取匹配版本的子 sitemap（与 sitemap-spec-check 约定一致，避免历史版本同页 title 跨版本误报）
async function collectUrls(project) {
  if (!project.sitemapUrl) return { urls: [], notes: ['sitemapUrl 未配置'] };
  const notes = [];
  const root = await getText(project.sitemapUrl);
  if (!root.ok) return { urls: [], notes: [`sitemap 不可访问（${root.status ?? '请求失败'}）：${project.sitemapUrl}`] };
  const parsed = parseSitemap(root.text);
  let urls = parsed.urls.map((u) => u.loc).filter(Boolean);

  if (parsed.sitemaps.length) {
    let children = parsed.sitemaps;
    if (Array.isArray(project.newVersions) && project.newVersions.length) {
      const expected = new Set(
        project.newVersions.map((v) => (v === '/' || v === '' ? '/sitemap.xml' : `${v.replace(/\/+$/, '')}/sitemap.xml`))
      );
      children = parsed.sitemaps.filter((s) => {
        try {
          return expected.has(new URL(s.loc).pathname);
        } catch {
          return false;
        }
      });
      const missing = [...expected].filter((p) => !children.some((s) => new URL(s.loc).pathname === p));
      if (missing.length) notes.push(`newVersions 声明的版本在 index 中未找到子 sitemap：${missing.join('、')}`);
      notes.push(`按 newVersions 仅收集 ${children.length}/${parsed.sitemaps.length} 个子 sitemap 的页面`);
    } else {
      notes.push(`index 共 ${parsed.sitemaps.length} 个子 sitemap，全部收集`);
    }
    const childResults = await mapLimit(children, 5, async (s) => {
      if (!s.loc || !/^https?:\/\//i.test(s.loc)) return null;
      const res = await getText(s.loc);
      if (!res.ok) {
        notes.push(`子 sitemap 不可访问（${res.status ?? '失败'}）：${s.loc}`);
        return null;
      }
      return parseSitemap(res.text).urls.map((u) => u.loc).filter(Boolean);
    });
    for (const list of childResults) if (list) urls = urls.concat(list);
  }

  urls = [...new Set(urls.filter((u) => /^https?:\/\//i.test(u)))];
  if (urls.length > MAX_PAGES) {
    notes.push(`页面总数 ${urls.length}，按 --max=${MAX_PAGES} 截断检查前 ${MAX_PAGES} 个`);
    urls = urls.slice(0, MAX_PAGES);
  }
  return { urls, notes };
}

// 判重只看有非空取值的页面；空值/缺失元素由独立的"缺失检查"统计，不重复计入判重
function buildFieldMaps(pages) {
  const maps = new Map(FIELDS.map((f) => [f, new Map()]));
  for (const page of pages) {
    for (const field of FIELDS) {
      const value = page[field] ?? '';
      if (!value) continue;
      const map = maps.get(field);
      if (!map.has(value)) map.set(value, []);
      map.get(value).push(page.url);
    }
  }
  return maps;
}

function getDuplicates(map) {
  return [...map.entries()]
    .filter(([, urls]) => urls.length > 1)
    .sort((a, b) => b[1].length - a[1].length);
}

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);
const results = [];

const startedAt = now();
const dateStr = startedAt.slice(0, 10);
const dir = resolve(ROOT, 'manual-review', 'issues', 'tdk');
await mkdir(dir, { recursive: true });
const reportPath = resolve(dir, `tdk-duplicate-report-${dateStr}.md`);

async function checkProject(project) {
  const entry = {
    projectId: project.id,
    projectName: project.name,
    sitemapUrl: project.sitemapUrl,
    repo: project.repo,
    urlCount: 0,
    fetched: 0,
    failed: [],
    notes: [],
    duplicates: {},
    missing: Object.fromEntries(FIELDS.map((f) => [f, { noElement: [], empty: [] }])),
  };

  const { urls, notes } = await collectUrls(project);
  entry.notes = notes;
  notes.forEach((n) => console.log(`[tdk-dup] ${project.id}: ${n}`));
  entry.urlCount = urls.length;
  if (!urls.length) {
    console.log(`[tdk-dup] ${project.id}: 未收集到页面 URL，跳过`);
    return entry;
  }
  console.log(`[tdk-dup] ${project.id}: 共 ${urls.length} 个页面，开始抓取（并发 ${CONCURRENCY}）...`);

  let done = 0;
  const pages = await mapLimit(urls, CONCURRENCY, async (url) => {
    const res = await getText(url);
    done++;
    if (done % 500 === 0 || done === urls.length) console.log(`[tdk-dup] ${project.id}: ${done}/${urls.length}`);
    if (!res.ok) {
      entry.failed.push({ url, status: res.status ?? '请求失败' });
      return null;
    }
    const raw = {
      title: extractTitle(res.text),
      description: extractMeta(res.text, 'description'),
      keywords: extractMeta(res.text, 'keywords'),
    };
    return {
      url,
      title: raw.title ?? '',
      description: raw.description ?? '',
      keywords: raw.keywords ?? '',
      raw,
    };
  });
  const okPages = pages.filter(Boolean);
  entry.fetched = okPages.length;
  for (const p of okPages) {
    for (const field of FIELDS) {
      const v = p.raw[field];
      if (v === null) entry.missing[field].noElement.push(p.url);
      else if (v === '') entry.missing[field].empty.push(p.url);
    }
  }
  const missingCounts = FIELDS.map((f) => {
    const m = entry.missing[f];
    return `${f}=${m.noElement.length + m.empty.length}`;
  }).join(' ');
  console.log(`[tdk-dup] ${project.id}: 缺失情况 ${missingCounts}（元素缺失/内容为空分开统计）`);

  const maps = buildFieldMaps(okPages);
  for (const field of FIELDS) {
    const duplicates = getDuplicates(maps.get(field));
    const dupPages = duplicates.reduce((n, [, us]) => n + us.length, 0);
    entry.duplicates[field] = {
      groups: duplicates.length,
      pages: dupPages,
      list: duplicates.map(([value, us]) => ({ value: value || '(缺失)', count: us.length, urls: us })),
    };

    console.log(`\n===== ${project.id} / ${field} =====`);
    if (!duplicates.length) {
      console.log('无重复');
      continue;
    }
    for (const [value, us] of duplicates.slice(0, 20)) {
      console.log(`\n[重复 ${us.length} 次] ${field}: ${value || '(缺失)'}`);
      for (const u of us.slice(0, 10)) console.log(`  - ${u}`);
      if (us.length > 10) console.log(`  ... 其余 ${us.length - 10} 项已省略（详见报告文件）`);
    }
    if (duplicates.length > 20) console.log(`\n... 其余 ${duplicates.length - 20} 组详见报告文件`);
  }
  if (entry.failed.length) {
    console.log(`\n[tdk-dup] ${project.id}: ${entry.failed.length} 个页面抓取失败，未计入重复统计`);
  }
  return entry;
}

// 单个项目的明细 Markdown 段落
function detailLines(r) {
  const lines = [];
  lines.push('');
  lines.push(`### ${r.projectName}（${r.projectId}）`);
  lines.push('');
  if (r.skipped) {
    for (const n of r.notes) lines.push(`- ⏭️ ${n}`);
    return lines;
  }
  lines.push(`- sitemap：${r.sitemapUrl || '未配置'}，收集页面 ${r.urlCount} 个，成功抓取 ${r.fetched} 个，失败 ${r.failed.length} 个`);
  for (const n of r.notes) lines.push(`- ℹ️ ${n}`);
  if (r.failed.length) {
    const shown = r.failed.slice(0, 20);
    lines.push(`- 抓取失败清单（前 ${shown.length} 个）：`);
    for (const f of shown) lines.push(`  - ${f.url} → ${f.status}`);
    if (r.failed.length > shown.length) lines.push(`  - ... 其余 ${r.failed.length - shown.length} 个见 stats JSON`);
  }
  for (const field of FIELDS) {
    const d = r.duplicates[field];
    if (!d) continue;
    lines.push('');
    lines.push(`#### ${field} 重复检查`);
    lines.push('');
    lines.push(`共 ${d.groups} 组重复，涉及 ${d.pages} 个页面`);
    if (!d.groups) continue;
    for (const g of d.list) {
      lines.push('');
      lines.push(`##### [重复 ${g.count} 次] ${g.value}`);
      lines.push('');
      for (const u of g.urls) lines.push(`- ${u}`);
    }
  }
  const m = r.missing;
  if (m) {
    lines.push('');
    lines.push('#### TDK 缺失检查');
    lines.push('');
    const total = missingTotal(r);
    if (!total) {
      lines.push('无缺失');
      return lines;
    }
    lines.push(`共 ${total} 个页面存在 TDK 缺失`);
    for (const field of FIELDS) {
      const fm = m[field];
      if (!fm) continue;
      const count = fm.noElement.length + fm.empty.length;
      if (!count) continue;
      lines.push('');
      lines.push(`##### ${field} 缺失（${count} 页）`);
      lines.push('');
      for (const u of fm.noElement) lines.push(`- ${u}（元素缺失）`);
      for (const u of fm.empty) lines.push(`- ${u}（元素存在但内容为空）`);
    }
  }
  return lines;
}

function missingTotal(r) {
  if (!r.missing) return 0;
  return FIELDS.reduce((n, f) => n + (r.missing[f]?.noElement.length ?? 0) + (r.missing[f]?.empty.length ?? 0), 0);
}

// ---- 提 issue 模式：报告与正文 ----
function hasAnyDup(r) {
  return FIELDS.some((f) => r.duplicates[f]?.groups > 0);
}

// 提 issue / 列入明细指针的触发条件：有重复或有缺失
function hasAnyIssue(r) {
  return hasAnyDup(r) || missingTotal(r) > 0;
}

// 简短版：单项目总览 + 每字段最多 3 组、每组最多 5 个 URL
function briefLines(r) {
  const lines = [];
  lines.push(`- 检查范围：sitemap 全量页面 ${r.urlCount} 个，成功抓取 ${r.fetched} 个（失败 ${r.failed.length} 个不计入）`);
  for (const field of FIELDS) {
    const d = r.duplicates[field];
    if (!d || !d.groups) continue;
    lines.push('');
    lines.push(`**${field}**：${d.groups} 组重复，涉及 ${d.pages} 个页面`);
    for (const g of d.list.slice(0, 3)) {
      const value = g.value.length > 80 ? `${g.value.slice(0, 80)}…` : g.value;
      lines.push(`- [重复 ${g.count} 次] \`${value}\``);
      for (const u of g.urls.slice(0, 5)) lines.push(`  - ${u}`);
      if (g.urls.length > 5) lines.push(`  - …其余 ${g.urls.length - 5} 个见完全版报告`);
    }
    if (d.list.length > 3) lines.push(`- …其余 ${d.list.length - 3} 组见完全版报告`);
  }
  const m = r.missing;
  if (m && missingTotal(r) > 0) {
    lines.push('');
    const parts = FIELDS.map((f) => {
      const c = (m[f]?.noElement.length ?? 0) + (m[f]?.empty.length ?? 0);
      if (!c) return null;
      return `${f} ${c} 页（元素缺失 ${m[f].noElement.length} / 内容为空 ${m[f].empty.length}）`;
    }).filter(Boolean);
    lines.push(`**TDK 缺失**：共 ${missingTotal(r)} 页 —— ${parts.join('；')}`);
    const items = [];
    for (const f of FIELDS) {
      for (const u of m[f].noElement) items.push(`- ${u}（${f} 元素缺失）`);
      for (const u of m[f].empty) items.push(`- ${u}（${f} 内容为空）`);
    }
    lines.push(...items.slice(0, 5));
    if (items.length > 5) lines.push(`- …其余 ${items.length - 5} 条见完全版报告`);
  }
  return lines;
}

function headerBlock(title) {
  return [
    `# ${title}`,
    '',
    `- 检查时间：${startedAt}`,
    '- 检查方式：按 sitemap 全量页面逐页请求 HTML，对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）',
    '',
  ];
}

function fullReportFor(r) {
  return [...headerBlock(`TDK 重复检查完全版报告 · ${r.projectName}（${r.projectId}）`), ...detailLines(r)].join('\n') + '\n';
}

function briefReportFor(r) {
  return [...headerBlock(`TDK 重复检查简短报告 · ${r.projectName}（${r.projectId}）`), ...briefLines(r)].join('\n') + '\n';
}

function issueBodyFor(r, fullFileName) {
  const ghRepo = process.env.GITHUB_REPOSITORY || 'opensourceways/daily-check-workflow';
  const refName = process.env.GITHUB_REF_NAME || 'archive';
  const fullUrl = `https://github.com/${ghRepo}/blob/${refName}/manual-review/issues/tdk/${fullFileName}`;
  const lines = [];
  lines.push(`本 issue 由 GEO 例行检查（TDK 重复性维度）自动生成。以下为 TDK（title/description/keywords）重复与缺失问题，按 sitemap 全量页面逐页抓取后判重/查缺得出（${startedAt.slice(0, 10)}）。`);
  lines.push('');
  lines.push(`**项目**：${r.projectName}（${r.projectId}）`);
  lines.push('');
  lines.push(...briefLines(r));
  lines.push('');
  lines.push('### 完全版报告');
  lines.push('');
  lines.push(`本简短报告仅列出部分重复组，完整重复组及全部涉及 URL 见检查仓库内的完全版报告：`);
  lines.push('');
  lines.push(`> [${fullFileName}](${fullUrl})`);
  lines.push('');
  lines.push('### 处理说明');
  lines.push('');
  lines.push('- 重复项：修复对应页面的 title / description / keywords，使各页面取值不再彼此相同');
  lines.push('- 缺失项：为"元素缺失"的页面补上 `<title>` / `<meta name="description">` / `<meta name="keywords">`，为"内容为空"的页面填入实际描述');
  lines.push('- 修复 PR 合并且 issue 关闭后，下一轮定时检查会重新扫描该项目；issue 未关闭期间不会重复创建，也不会重复扫描');
  lines.push('- 若认为某组重复属预期（如多语言/模板页），请在 issue 评论说明，维护者会关闭本 issue');
  lines.push('');
  lines.push('<sub>由 daily-check-workflow TDK 重复检查自动生成。</sub>');
  return lines.join('\n');
}

// 扫描前查重：目标 AtomGit 仓库已有本维度未关闭 issue 则跳过整个"扫描+提 issue"流程。
// 查询失败时：有 token（生产环境）为防重复提单直接跳过扫描；无 token（本地试跑）继续扫描但跳过提单。
async function precheckExistingIssue(project) {
  const parsed = parseOwnerRepo(project.repo);
  if (!parsed) {
    return { block: false, canSubmit: false, notes: [`repo 无法解析 owner/repo，无法查重与提单：${project.repo || '未配置'}`] };
  }
  let existing;
  try {
    existing = await findIssuesByTitlePrefix({ ...parsed, prefix: ISSUE_TITLE_PREFIX, state: 'open' });
  } catch (err) {
    if (hasToken()) {
      return { block: true, canSubmit: false, notes: [`查询已提 issue 失败，为避免重复提单本次跳过扫描：${err.message}`] };
    }
    return { block: false, canSubmit: false, notes: [`无 ATOMGIT_TOKEN 且查询已提 issue 失败（${err.message}），本次仅扫描不提单`] };
  }
  if (existing.length) {
    const urls = existing.map((i) => i.html_url || `${parsed.owner}/${parsed.repo}#${i.number}`).join('、');
    return { block: true, canSubmit: false, notes: [`已存在未关闭的 TDK 重复 issue（#${existing[0].number}：${urls}），跳过本次扫描与提单`] };
  }
  if (!hasToken()) {
    return { block: false, canSubmit: false, notes: ['未设置 ATOMGIT_TOKEN，本次查重通过但不提单'] };
  }
  return { block: false, canSubmit: true, notes: [] };
}

for (const project of targets) {
  let entry;
  if (SKIPS.includes(project.id.toLowerCase())) {
    console.log(`[tdk-dup] 跳过 ${project.id}`);
    entry = {
      projectId: project.id,
      projectName: project.name,
      sitemapUrl: project.sitemapUrl,
      repo: project.repo,
      skipped: true,
      urlCount: 0,
      fetched: 0,
      failed: [],
      notes: ['默认跳过（docs 大站页面量级大，且历史版本/多语言同页 TDK 同值属预期；用 --skip= 传空可强制检查）'],
      duplicates: Object.fromEntries(FIELDS.map((f) => [f, { groups: 0, pages: 0, list: [] }])), missing: Object.fromEntries(FIELDS.map((f) => [f, { noElement: [], empty: [] }])),
    };
  } else if (submitIssues) {
    const pre = await precheckExistingIssue(project);
    pre.notes.forEach((n) => console.log(`[tdk-dup] ${project.id}: ${n}`));
    if (pre.block) {
      results.push({
        projectId: project.id,
        projectName: project.name,
        sitemapUrl: project.sitemapUrl,
        repo: project.repo,
        skipped: true,
        urlCount: 0,
        fetched: 0,
        failed: [],
        notes: pre.notes,
        duplicates: Object.fromEntries(FIELDS.map((f) => [f, { groups: 0, pages: 0, list: [] }])), missing: Object.fromEntries(FIELDS.map((f) => [f, { noElement: [], empty: [] }])),
      });
      continue;
    }
    console.log(`\n[tdk-dup] ===== ${project.id} =====`);
    entry = await checkProject(project);
    if (hasAnyIssue(entry)) {
      const fullFileName = `tdk-duplicate-${entry.projectId}-${dateStr}-full.md`;
      const briefFileName = `tdk-duplicate-${entry.projectId}-${dateStr}-brief.md`;
      if (!dryRun) {
        await writeFile(resolve(dir, fullFileName), fullReportFor(entry), 'utf8');
        await writeFile(resolve(dir, briefFileName), briefReportFor(entry), 'utf8');
        entry.reports = { full: `manual-review/issues/tdk/${fullFileName}`, brief: `manual-review/issues/tdk/${briefFileName}` };
      }
      const body = issueBodyFor(entry, fullFileName);
      const title = `${ISSUE_TITLE_PREFIX} ${entry.projectName}（${entry.projectId}）：TDK title/description/keywords 存在重复或缺失`;
      const target = parseOwnerRepo(project.repo);
      if (dryRun || !target || !pre.canSubmit) {
        console.log(`\n[tdk-dup] ${project.id} ${dryRun ? '[dry-run] ' : ''}将提交 issue：${title}`);
        console.log(body);
        entry.issueAction = 'dry-run';
      } else {
        const created = await createIssue({ ...target, title, body });
        const url = created?.html_url || `https://atomgit.com/${target.owner}/${target.repo}/issues/${created?.number}`;
        console.log(`[tdk-dup] ${project.id}: ✨ 已创建 issue：${url}`);
        entry.issueAction = 'created';
        entry.issueUrl = url;
      }
    } else {
      console.log(`[tdk-dup] ${project.id}: 未发现重复与缺失，不提 issue`);
    }
  } else {
    console.log(`\n[tdk-dup] ===== ${project.id} =====`);
    entry = await checkProject(project);
  }
  results.push(entry);
}

// ---- Markdown 报告：全部项目检查完成后一次性写入 ----
const statsPath = await writeStats('tdk-duplicate-stats', { timestamp: startedAt, measure: 'tdk-duplicate', results });
const lines = [];
lines.push('# TDK 重复性检查报告');
lines.push('');
lines.push(`- 检查时间：${startedAt}`);
lines.push(`- 检查方式：参照 seo-check/scripts/description-check.js 的分组判重逻辑，数据源改为各项目 sitemap 全量页面 URL 逐页请求 HTML（非本地构建产物遍历）`);
lines.push('- 判重字段：title（`<title>` 文本）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`），按去空格后的原文精确分组，同值对应 ≥2 个页面即记为重复组；空值/缺失不参与判重，单独计入"TDK 缺失检查"（区分元素缺失/内容为空）');
lines.push(`- 特殊约定：默认跳过 openEuler-docs、openGauss-docs、MindSpore-docs 三个 docs 项目（页面量级大，且多语言/历史版本同页 TDK 同值属预期）；如需检查可用 --skip= 传空覆盖；配置 newVersions 的 docs 项目仅收集匹配版本的子 sitemap 页面`);
lines.push(`- 完整重复组与缺失数据见：workflow/stats/tdk-duplicate-stats.json`);
lines.push('');
lines.push('## 总览');
lines.push('');
lines.push('| 项目 | sitemap 页面数 | 成功抓取 | 抓取失败 | title 重复组/页 | description 重复组/页 | keywords 重复组/页 | 缺失页 t/d/k | 结论 |');
lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const r of results) {
  if (r.skipped) {
    lines.push(`| ${r.projectName}（${r.projectId}） | - | - | - | - | - | - | - | ⏭️ 跳过 |`);
    continue;
  }
  const d = r.duplicates;
  const fmt = (f) => (d && d[f] ? `${d[f].groups}/${d[f].pages}` : '-');
  const fmtM = r.missing ? FIELDS.map((f) => (r.missing[f]?.noElement.length ?? 0) + (r.missing[f]?.empty.length ?? 0)).join('/') : '-';
  const hasDup = d && FIELDS.some((f) => d[f] && d[f].groups > 0);
  const hasMissing = missingTotal(r) > 0;
  const verdict = r.urlCount === 0 ? '❌ 无法检查' : hasDup ? (hasMissing ? '⚠️ 存在重复+缺失' : '⚠️ 存在重复') : hasMissing ? '⚠️ 存在缺失' : '✅ 正常';
  lines.push(`| ${r.projectName}（${r.projectId}） | ${r.urlCount} | ${r.fetched} | ${r.failed.length} | ${fmt('title')} | ${fmt('description')} | ${fmt('keywords')} | ${fmtM} | ${verdict} |`);
}
lines.push('');
lines.push('## 各项目明细');
if (submitIssues) {
  lines.push('');
  lines.push('（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见同目录 `tdk-duplicate-<项目ID>-' + dateStr + '-full.md`）');
  const withIssue = results.filter((r) => !r.skipped && r.urlCount > 0 && hasAnyIssue(r));
  for (const r of withIssue) lines.push(`- ${r.projectName}（${r.projectId}）：\`tdk-duplicate-${r.projectId}-${dateStr}-full.md\`${r.issueUrl ? `，issue：${r.issueUrl}` : ''}`);
} else {
  for (const r of results) lines.push(...detailLines(r));
}

await writeFile(reportPath, lines.join('\n') + '\n', 'utf8');
console.log(`\n[tdk-dup] 检查完成：stats -> ${statsPath}`);
console.log(`[tdk-dup] 报告 -> ${reportPath}`);
