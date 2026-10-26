import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjects, filterProjects } from '../lib/config.mjs';
import { getText, mapLimit, collectUrls } from '../lib/crawl.mjs';
import { extractTitle, extractMeta } from '../lib/html.mjs';
import { createJsonLdAnalyzer, classifyJsonLd } from '../lib/jsonld.mjs';
import { writeStats, now } from '../lib/report.mjs';
import { parseOwnerRepo, precheckExistingIssues, reconcileIssue, closeIssueCommentBody } from '../lib/atomgit.mjs';

// TDK 重复 + JSON-LD 规范 合并全量检查（2026-10 重构）：
// 原 check-tdk-duplicate.mjs 与 check-jsonld.mjs 合一——按 sitemap 全量展开页面 URL，
// 每页只抓一次 HTML，两个维度分析器在同一份 HTML 上各自消费（TDK 提取 title/meta；JSON-LD 提取并校验 ld+json 块）。
// 两个维度的 issue 前缀、查重跳过、--force 写回、brief/full 双报告、stats JSON、scheduled-reports 目录全部保持各自独立；
// --dims=tdk / --dims=jsonld 可只跑单维度（另一维度的 stats/report 不动）。
// JSON-LD 分级调整：P0 三件套缺失、Google 必填属性缺失 由硬性错误降级为告警（告警不提单）；
// 提单触发仅剩：站点/sitemap 不可达、抓取全失败、整站无合法块、JSON 语法错误、@context 异常、占位符。
const TDK_PREFIX = '[GEO TDK Duplicate]';
const JSONLD_PREFIX = '[GEO JSON-LD]';
const FIELDS = ['title', 'description', 'keywords'];
// docs 大站（页面量级大且历史版本同页 TDK 同值属预期）两个维度共用同一默认跳过清单；--skip= 传空可强制全查
const DEFAULT_SKIP = ['openeuler-docs', 'opengauss-docs', 'mindspore-docs'];

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

const submitIssues = process.argv.includes('--submit-issues');
const dryRun = process.argv.includes('--dry-run');
// --force 仅在 --submit-issues 模式下生效：跳过"已有未关闭 issue 即跳过扫描"的查重拦截（两维度一致）
const force = process.argv.includes('--force');
const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;
const maxArg = process.argv.find((a) => a.startsWith('--max='));
const MAX_PAGES = maxArg ? Number(maxArg.split('=')[1]) : Infinity;
const concArg = process.argv.find((a) => a.startsWith('--conc='));
const CONCURRENCY = concArg ? Number(concArg.split('=')[1]) : 10;
const skipArg = process.argv.find((a) => a.startsWith('--skip='));
const SKIPS = skipArg ? skipArg.split('=')[1].split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : DEFAULT_SKIP;
const dimsArg = process.argv.find((a) => a.startsWith('--dims='));
const DIMS = (dimsArg ? dimsArg.split('=')[1] : 'tdk,jsonld').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const unknownDims = DIMS.filter((d) => d !== 'tdk' && d !== 'jsonld');
if (unknownDims.length) {
  console.error(`--dims 仅支持 tdk/jsonld，收到：${unknownDims.join('、')}`);
  process.exit(1);
}
if (!DIMS.includes('tdk') && !DIMS.includes('jsonld')) {
  console.error('--dims 不能为空');
  process.exit(1);
}
const DO_TDK = DIMS.includes('tdk');
const DO_JSONLD = DIMS.includes('jsonld');

const startedAt = now();
const dateStr = startedAt.slice(0, 10);
const DIRS = { tdk: resolve(ROOT, 'scheduled-reports', 'tdk', dateStr), jsonld: resolve(ROOT, 'scheduled-reports', 'jsonld', dateStr) };
const reportName = 'report.md';
if (DO_TDK) await mkdir(DIRS.tdk, { recursive: true });
if (DO_JSONLD) await mkdir(DIRS.jsonld, { recursive: true });

const modeStr = submitIssues ? `submit-issues${dryRun ? '-dry-run' : ''}${force ? '-force' : ''}` : 'scan';

function fullUrlOf(dimDir, fileName) {
  const ghRepo = process.env.GITHUB_REPOSITORY || 'opensourceways/daily-check-workflow';
  const refName = process.env.GITHUB_REF_NAME || 'archive';
  return `https://github.com/${ghRepo}/blob/${refName}/scheduled-reports/${dimDir}/${dateStr}/${fileName}`;
}

// ---- 共用抓取 + 双维度分析 ----

async function scanProject(project) {
  const { urls, notes } = await collectUrls(project, { maxPages: MAX_PAGES });
  notes.forEach((n) => console.log(`[tdk-jsonld] ${project.id}: ${n}`));
  if (urls.length) console.log(`[tdk-jsonld] ${project.id}: 共 ${urls.length} 个页面，开始抓取（并发 ${CONCURRENCY}，两维度共用）...`);
  const failed = [];
  const tdkPages = [];
  const tdkMissing = Object.fromEntries(FIELDS.map((f) => [f, { noElement: [], empty: [] }]));
  const jsonldAnalyzer = DO_JSONLD ? createJsonLdAnalyzer() : null;

  let done = 0;
  const okFlags = await mapLimit(urls, CONCURRENCY, async (url) => {
    const res = await getText(url);
    done++;
    if (done % 500 === 0 || done === urls.length) console.log(`[tdk-jsonld] ${project.id}: ${done}/${urls.length}`);
    if (!res.ok) {
      failed.push({ url, status: res.status ?? '请求失败' });
      return false;
    }
    if (DO_TDK) {
      const raw = {
        title: extractTitle(res.text),
        description: extractMeta(res.text, 'description'),
        keywords: extractMeta(res.text, 'keywords'),
      };
      for (const field of FIELDS) {
        const v = raw[field];
        if (v === null) tdkMissing[field].noElement.push(url);
        else if (v === '') tdkMissing[field].empty.push(url);
      }
      tdkPages.push({ url, title: raw.title ?? '', description: raw.description ?? '', keywords: raw.keywords ?? '' });
    }
    if (DO_JSONLD) jsonldAnalyzer.addPage(url, res.text);
    return true;
  });

  return { urls, notes, failed, tdkPages, tdkMissing, jsonldAnalyzer, fetched: okFlags.filter(Boolean).length };
}

// ---- TDK 维度 ----

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

function buildTdkEntry(project, scan) {
  const entry = {
    projectId: project.id,
    projectName: project.name,
    sitemapUrl: project.sitemapUrl,
    repo: project.repo,
    urlCount: scan.urls.length,
    fetched: scan.fetched,
    failed: scan.failed,
    notes: scan.notes,
    duplicates: {},
    missing: scan.tdkMissing,
  };
  const missingCounts = FIELDS.map((f) => {
    const m = entry.missing[f];
    return `${f}=${m.noElement.length + m.empty.length}`;
  }).join(' ');
  console.log(`[tdk-dup] ${project.id}: 缺失情况 ${missingCounts}（元素缺失/内容为空分开统计）`);

  const maps = buildFieldMaps(scan.tdkPages);
  for (const field of FIELDS) {
    const duplicates = getDuplicates(maps.get(field));
    const dupPages = duplicates.reduce((n, [, us]) => n + us.length, 0);
    entry.duplicates[field] = {
      groups: duplicates.length,
      pages: dupPages,
      list: duplicates.map(([value, us]) => ({ value: value || '(缺失)', count: us.length, urls: us })),
    };
    if (duplicates.length) {
      console.log(`[tdk-dup] ${project.id} / ${field}：${duplicates.length} 组重复，涉及 ${dupPages} 页`);
      for (const [value, us] of duplicates.slice(0, 5)) console.log(`  [重复 ${us.length} 次] ${value || '(缺失)'}`);
      if (duplicates.length > 5) console.log(`  ... 其余 ${duplicates.length - 5} 组详见报告文件`);
    } else {
      console.log(`[tdk-dup] ${project.id} / ${field}：无重复`);
    }
  }
  if (entry.failed.length) console.log(`[tdk-dup] ${project.id}: ${entry.failed.length} 个页面抓取失败，未计入统计`);
  return entry;
}

function tdkZeroState() {
  return {
    duplicates: Object.fromEntries(FIELDS.map((f) => [f, { groups: 0, pages: 0, list: [] }])),
    missing: Object.fromEntries(FIELDS.map((f) => [f, { noElement: [], empty: [] }])),
  };
}

function makeTdkSkipped(project, notes) {
  return {
    projectId: project.id,
    projectName: project.name,
    sitemapUrl: project.sitemapUrl,
    repo: project.repo,
    skipped: true,
    urlCount: 0,
    fetched: 0,
    failed: [],
    notes: Array.isArray(notes) ? notes : [notes],
    ...tdkZeroState(),
  };
}

function missingTotal(r) {
  if (!r.missing) return 0;
  return FIELDS.reduce((n, f) => n + (r.missing[f]?.noElement.length ?? 0) + (r.missing[f]?.empty.length ?? 0), 0);
}

function hasAnyIssueTdk(r) {
  return !r.skipped && (FIELDS.some((f) => r.duplicates[f]?.groups > 0) || missingTotal(r) > 0);
}

function tdkDetailLines(r) {
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

function tdkBriefLines(r) {
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

function tdkHeaderBlock(title) {
  return [
    `# ${title}`,
    '',
    `- 检查时间：${startedAt}`,
    '- 检查方式：按 sitemap 全量页面逐页请求 HTML（与 JSON-LD 维度共用同一份抓取），对 title（`<title>`）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`）按原文精确分组，同值 ≥2 页记为重复组；空值/缺失不参与判重，单独在"TDK 缺失检查"中列出（区分元素缺失/内容为空）',
    '',
  ];
}

function tdkIssueBodyFor(r, fullFileName) {
  const lines = [];
  lines.push(`本 issue 由 GEO 例行检查（TDK 重复性维度）自动生成。以下为 TDK（title/description/keywords）重复与缺失问题，按 sitemap 全量页面逐页抓取后判重/查缺得出（${dateStr}）。`);
  lines.push('');
  lines.push(`**项目**：${r.projectName}（${r.projectId}）`);
  lines.push('');
  lines.push(...tdkBriefLines(r));
  lines.push('');
  lines.push('### 完全版报告');
  lines.push('');
  lines.push('本简短报告仅列出部分重复组，完整重复组及全部涉及 URL 见检查仓库内的完全版报告：');
  lines.push('');
  lines.push(`> [${fullFileName}](${fullUrlOf('tdk', fullFileName)})`);
  lines.push('');
  lines.push('### 处理说明');
  lines.push('');
  lines.push('- 重复项：修复对应页面的 title / description / keywords，使各页面取值不再彼此相同');
  lines.push('- 缺失项：为"元素缺失"的页面补上 `<title>` / `<meta name="description">` / `<meta name="keywords">`，为"内容为空"的页面填入实际描述');
  lines.push('- 修复 PR 合并且 issue 关闭后，下一轮定时检查会重新扫描该项目；issue 未关闭期间不会重复创建，也不会重复提单（若同轮 JSON-LD 维度另有未关闭 issue，共用抓取仍会照常进行，但本维度不再产出结论）');
  lines.push('- 如需修复后立即复核：维护者可手动运行检查 workflow 并勾选 force_check（强制执行，跳过查重拦截）——仍有问题会直接更新本 issue 内容，问题已全部消除会自动在本 issue 评论 /close 关闭');
  lines.push('- 若认为某组重复属预期（如多语言/模板页），请在 issue 评论说明，维护者会关闭本 issue');
  lines.push('');
  lines.push(`> 当日全量检查汇总报告：[${reportName}](${fullUrlOf('tdk', reportName)})`);
  lines.push('');
  lines.push('<sub>由 daily-check-workflow TDK 重复检查（check-tdk-jsonld，dims=tdk）自动生成。</sub>');
  return lines.join('\n');
}

async function finalizeTdk(project, pre, entry) {
  if (pre.block) {
    return makeTdkSkipped(project, [...pre.notes, '（本次共用抓取已完成，本维度因已有未关闭 issue 不重复判定与提单）']);
  }
  const target = parseOwnerRepo(project.repo);
  if (hasAnyIssueTdk(entry)) {
    const fullFileName = `${entry.projectId}-full.md`;
    if (!dryRun) {
      await writeFile(resolve(DIRS.tdk, fullFileName), [...tdkHeaderBlock(`TDK 重复检查完全版报告 · ${entry.projectName}（${entry.projectId}）`), ...tdkDetailLines(entry)].join('\n') + '\n', 'utf8');
      await writeFile(resolve(DIRS.tdk, `${entry.projectId}-brief.md`), [...tdkHeaderBlock(`TDK 重复检查简短报告 · ${entry.projectName}（${entry.projectId}）`), ...tdkBriefLines(entry)].join('\n') + '\n', 'utf8');
      entry.reports = { full: `scheduled-reports/tdk/${dateStr}/${fullFileName}`, brief: `scheduled-reports/tdk/${dateStr}/${entry.projectId}-brief.md` };
    }
    const title = `${TDK_PREFIX} ${entry.projectName}（${entry.projectId}）：TDK title/description/keywords 存在重复或缺失`;
    const outcome = await reconcileIssue({ target, existing: pre.existing, canWrite: pre.canSubmit, hasIssue: true, title, body: tdkIssueBodyFor(entry, fullFileName), dryRun, logPrefix: `[tdk-dup] ${project.id}` });
    entry.issueAction = outcome.action;
    if (outcome.url) entry.issueUrl = outcome.url;
  } else if (pre.existing.length) {
    // 强制模式且查重命中：只有本次有效完成抓取（收集到页面且至少抓到一页）才能下"问题已消除"的结论并评论 /close
    const outcome = await reconcileIssue({
      target,
      existing: pre.existing,
      canWrite: pre.canSubmit,
      hasIssue: false,
      verifiedClean: entry.urlCount > 0 && entry.fetched > 0,
      closeBody: closeIssueCommentBody('TDK 重复/缺失检查', dateStr),
      dryRun,
      logPrefix: `[tdk-dup] ${project.id}`,
    });
    if (outcome.action !== 'none') entry.issueAction = outcome.action;
    if (outcome.url) entry.issueUrl = outcome.url;
  } else {
    console.log(`[tdk-dup] ${project.id}: 未发现重复与缺失，不提 issue`);
  }
  return entry;
}

// ---- JSON-LD 维度 ----

function buildJsonldEntry(project, scan) {
  // urlCount=0（sitemap 不可达）与 fetched=0（抓取全失败）同样走 classifyJsonLd，由其归为硬性错误"无法检查"
  const checks = { ...scan.jsonldAnalyzer.checks(), urlCount: scan.urls.length, fetched: scan.fetched, failedCount: scan.failed.length };
  const entry = { projectId: project.id, projectName: project.name, domain: project.domain, repo: project.repo, notes: scan.notes, checks, failed: scan.failed };
  const { hardErrors, warnings, verdict } = classifyJsonLd(checks);
  entry.hardErrors = hardErrors;
  entry.warnings = warnings;
  entry.verdict = verdict;
  if (checks.duplicateBlockCount > 0) console.log(`[jsonld] ${project.id}: ${checks.duplicateBlockCount} 处同页重复块（${checks.pagesWithDuplicates.length} 页）`);
  if (checks.requiredMissingCount > 0) console.log(`[jsonld] ${project.id}: Google 必填属性缺失 ${checks.requiredMissingCount} 处（告警级，不触发提单）`);
  return entry;
}

function jsonldSkippedEntry(project, notes) {
  return { projectId: project.id, projectName: project.name, domain: project.domain, repo: project.repo, skipped: true, checks: {}, hardErrors: [], warnings: [], notes: Array.isArray(notes) ? notes : [notes], verdict: '⏭️' };
}

function hasAnyIssueJsonld(r) {
  return !r.skipped && (r.hardErrors?.length || 0) > 0;
}

// 完全版明细列表统一截断上限：全量扫描后明细可达数千条，md 只展开前 N 条，其余注明省略（完整数据在 stats JSON）
const DETAIL_CAP = 300;

function pushCapped(lines, header, items, render) {
  lines.push('');
  lines.push(header);
  lines.push('');
  if (!items.length) {
    lines.push('无');
    return;
  }
  const shown = items.slice(0, DETAIL_CAP);
  for (const it of shown) lines.push(render(it));
  if (items.length > shown.length) lines.push(`- …其余 ${items.length - shown.length} 条未展示（完整数据见 scripts/stats/jsonld-stats.json）`);
}

function jsonldBriefLines(r) {
  const c = r.checks;
  const lines = [];
  lines.push('### 抓取概况');
  lines.push('');
  lines.push(`- sitemap 全量页面 ${c.urlCount ?? 0} 个，成功抓取 ${c.fetched ?? 0} 个（失败 ${c.failedCount ?? 0} 个不计入）；合法 JSON-LD 块 ${c.jsonLdCount ?? 0} 个（含块页面 ${c.pagesWithBlocks?.length ?? 0} 个）`);
  lines.push(`- 全站出现的 ` + '`@type`' + `：${(c.schemaTypes || []).slice(0, 15).join('、') || '(无)'}${(c.schemaTypes || []).length > 15 ? ` 等 ${c.schemaTypes.length} 种` : ''}`);
  lines.push(`- P0 三件套（告警级）：${c.p0Missing?.length ? `缺 ${c.p0Missing.join(' / ')}` : '✅ 全站齐备'}；Google 必填属性缺失（告警级）：${c.requiredMissingCount ?? 0} 处`);
  lines.push('');
  lines.push(r.hardErrors.length ? `### 问题清单（${r.hardErrors.length} 类硬性不符合）` : '### 问题清单（无硬性不符合）');
  lines.push('');
  for (const e of r.hardErrors) lines.push(`- ❌ ${e}`);
  const top = (r.warnings || []).slice(0, 5);
  if (top.length) {
    lines.push('');
    lines.push(`### 告警（${r.warnings.length} 条${r.warnings.length > top.length ? `，列前 ${top.length} 条，其余见完全版` : ''}）`);
    lines.push('');
    for (const w of top) lines.push(`- ⚠️ ${w}`);
  }
  return lines;
}

function jsonldDetailLines(r) {
  const c = r.checks;
  const lines = [];
  lines.push('### 项目信息');
  lines.push('');
  lines.push(`- 项目：${r.projectName}（${r.projectId}）`);
  lines.push(`- 采样入口：${r.domain}；sitemap 页面 ${c.urlCount} 个，成功抓取 ${c.fetched} 个，失败 ${c.failedCount} 个`);
  lines.push(`- 结论：${r.verdict}（硬性错误 ${r.hardErrors.length} 类 / 告警 ${r.warnings.length} 条）`);
  lines.push('');
  lines.push(r.hardErrors.length ? `### 问题清单（全部 ${r.hardErrors.length} 类硬性不符合）` : '### 问题清单（无硬性不符合）');
  lines.push('');
  for (const e of r.hardErrors) lines.push(`- ❌ ${e}`);
  if (r.warnings.length) {
    lines.push('');
    lines.push(`### 告警（全部 ${r.warnings.length} 条）`);
    lines.push('');
    for (const w of r.warnings) lines.push(`- ⚠️ ${w}`);
  }
  if (c.fetched > 0) {
    lines.push('');
    lines.push(`### 含合法块的页面（${c.pagesWithBlocks.length}/${c.fetched} 个抓取成功页面）`);
    lines.push('');
    const withBlocks = (c.perPage || []).filter((p) => p.jsonLdBlocks > 0);
    for (const p of withBlocks.slice(0, 100)) lines.push(`- ${p.page}：${p.jsonLdBlocks} 块（${(p.types || []).join('、') || '无带类型节点'}）`);
    if (withBlocks.length > 100) lines.push(`- …其余 ${withBlocks.length - 100} 页未展示（完整数据见 scripts/stats/jsonld-stats.json）`);
  }
  if ((c.requiredMissing || []).length) {
    const grouped = new Map();
    for (const m of c.requiredMissing) {
      const k = `${m.type}.${m.prop}`;
      if (!grouped.has(k)) grouped.set(k, []);
      grouped.get(k).push(m.page);
    }
    lines.push('');
    lines.push(`### Google 必填属性缺失（告警级，共 ${c.requiredMissingCount} 处）`);
    lines.push('');
    lines.push('| 缺失项（type.prop） | 处数 | 涉及页面（前 20 个） |');
    lines.push('| --- | --- | --- |');
    const sorted = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length);
    for (const [k, pages] of sorted) lines.push(`| ${k} | ${pages.length} | ${pages.slice(0, 20).map((p) => `<${p}>`).join(' ')}${pages.length > 20 ? ' 等' : ''} |`);
  }
  if (c.p0Missing.length) {
    lines.push('');
    lines.push(`### P0 三件套（告警级）：全站未出现 ${c.p0Missing.join(' / ')}；三件套为 Organization/WebSite/BreadcrumbList，建议在首页模板统一注入`);
  }
  pushCapped(lines, `### 结构与推荐项问题（全部 ${c.nestedIssues?.length ?? 0} 处）`, c.nestedIssues || [], (n) => `- ⚠️ ${n.page} · ${n.type}：${n.issue}`);
  pushCapped(lines, `### 占位符取值（全部 ${c.placeholderCount} 处，禁止上线）`, c.placeholderHits || [], (h) => `- ❌ ${h.page} · \`${h.prop}\`：${h.value}`);
  pushCapped(lines, `### @context 异常（全部 ${c.contextErrorCount} 处）`, c.contextErrors || [], (e) => `- ❌ ${e.page}：${e.detail}`);
  if (c.invalidCount > 0) pushCapped(lines, `### JSON 语法错误块所在页面（共 ${c.invalidPages?.length ?? 0} 页 ${c.invalidCount} 块）`, c.invalidPages || [], (p) => `- ❌ ${p}`);
  if (c.duplicateBlockCount > 0) pushCapped(lines, `### 同页语义重复块（${c.duplicateBlockCount} 处，涉及 ${c.pagesWithDuplicates.length} 页）`, c.pagesWithDuplicates || [], (p) => `- ⚠️ ${p}`);
  if (c.failedCount > 0) pushCapped(lines, `### 抓取失败页面（${c.failedCount} 个，不计入判定）`, c.failed || r.failed || [], (f) => `- ${f.url} → ${f.status}`);
  return lines;
}

function jsonldIssueBodyFor(r, fullFileName) {
  const lines = [];
  lines.push(`本 issue 由 GEO 例行检查（JSON-LD 维度）自动生成。以下问题按 measures/04-json-ld/规范.md 对 sitemap 全量页面（共 ${r.checks.urlCount} 个，成功抓取 ${r.checks.fetched} 个）静态 HTML 核查得出（${dateStr}）。`);
  lines.push('');
  lines.push(`**项目**：${r.projectName}（${r.projectId}）`);
  lines.push(`**采样入口**：${r.domain}`);
  lines.push('');
  lines.push('> 分级说明（2026-10 起）：仅"站点不可达 / 整站无合法块 / JSON 语法错误 / @context 异常 / 占位符"为 P0 硬性错误并触发本 issue；P0 三件套缺失与 Google 必填属性缺失已降级为告警，列于下方供参考，不因此提单。');
  lines.push('');
  lines.push(...jsonldBriefLines(r));
  lines.push('');
  lines.push('### 完全版报告');
  lines.push('');
  lines.push('全部告警与逐页明细见检查仓库内的完全版报告：');
  lines.push('');
  lines.push(`> [${fullFileName}](${fullUrlOf('jsonld', fullFileName)})`);
  lines.push('');
  lines.push('### 规范要点');
  lines.push('');
  lines.push('- `application/ld+json` 必须由 SSG/SSR 输出在最终 HTML 中，`JSON.parse` 可通过，`@context` 固定 `https://schema.org`');
  lines.push('- 取值只来自页面可见内容或真实事实，禁止编造，禁止占位符（TODO/待填/xxx）');
  lines.push('- 全站 P0 三件套（Organization/WebSite/BreadcrumbList）与各类型 Google 必填属性：现为告警级，建议按完全版清单逐步补全');
  lines.push('- 同一页面避免语义完全重复的块（模板+插件双重注入是常见根因）');
  lines.push('');
  lines.push('### 处理说明');
  lines.push('');
  lines.push('- 按问题清单修复 JSON-LD 注入（修语法/@context、移除占位符）后合并 PR 并关闭本 issue');
  lines.push('- 修复 PR 合并且 issue 关闭后，下一轮定时检查会重新扫描该项目；issue 未关闭期间不会重复创建，也不会重复提单（若同轮 TDK 维度另有未关闭 issue，共用抓取仍会照常进行，但本维度不再产出结论）');
  lines.push('- 如需修复后立即复核：维护者可手动运行检查 workflow 并勾选 force_check（强制执行，跳过查重拦截）——仍有问题会直接更新本 issue 内容，问题已全部消除会自动在本 issue 评论 /close 关闭');
  lines.push('- 若认为某条属预期（误报，如全站确实不适用某检查），请在 issue 评论说明，维护者会关闭本 issue');
  lines.push('');
  lines.push(`> 当日全量检查汇总报告：[${reportName}](${fullUrlOf('jsonld', reportName)})`);
  lines.push('');
  lines.push('<sub>由 daily-check-workflow JSON-LD 规范检查（check-tdk-jsonld，dims=jsonld）自动生成。</sub>');
  return lines.join('\n');
}

async function finalizeJsonld(project, pre, entry) {
  if (pre.block) {
    return jsonldSkippedEntry(project, [...pre.notes, '（本次共用抓取已完成，本维度因已有未关闭 issue 不重复判定与提单）']);
  }
  const target = parseOwnerRepo(project.repo);
  if (hasAnyIssueJsonld(entry)) {
    const fullFileName = `${entry.projectId}-full.md`;
    if (!dryRun) {
      await writeFile(resolve(DIRS.jsonld, fullFileName), `# JSON-LD 检查完全版报告 · ${entry.projectName}（${entry.projectId}）\n\n- 检查时间：${startedAt}\n\n` + jsonldDetailLines(entry).join('\n') + '\n', 'utf8');
      await writeFile(resolve(DIRS.jsonld, `${entry.projectId}-brief.md`), `# JSON-LD 检查简短报告 · ${entry.projectName}（${entry.projectId}）\n\n- 检查时间：${startedAt}\n- 采样入口：${entry.domain}\n- 结论：${entry.verdict}\n\n` + jsonldBriefLines(entry).join('\n') + '\n', 'utf8');
      entry.reports = { full: `scheduled-reports/jsonld/${dateStr}/${fullFileName}`, brief: `scheduled-reports/jsonld/${dateStr}/${entry.projectId}-brief.md` };
    }
    const title = `${JSONLD_PREFIX} ${entry.projectName}（${entry.projectId}）：JSON-LD 规范问题（${entry.hardErrors.length} 类）`;
    const outcome = await reconcileIssue({ target, existing: pre.existing, canWrite: pre.canSubmit, hasIssue: true, title, body: jsonldIssueBodyFor(entry, fullFileName), dryRun, logPrefix: `[jsonld] ${project.id}` });
    entry.issueAction = outcome.action;
    if (outcome.url) entry.issueUrl = outcome.url;
  } else if (pre.existing.length) {
    const outcome = await reconcileIssue({
      target,
      existing: pre.existing,
      canWrite: pre.canSubmit,
      hasIssue: false,
      verifiedClean: (entry.checks?.fetched ?? 0) > 0,
      closeBody: closeIssueCommentBody('JSON-LD 规范检查', dateStr),
      dryRun,
      logPrefix: `[jsonld] ${project.id}`,
    });
    if (outcome.action !== 'none') entry.issueAction = outcome.action;
    if (outcome.url) entry.issueUrl = outcome.url;
  } else {
    console.log(`[jsonld] ${project.id}: 无硬性错误，不提 issue${(entry.warnings || []).length ? `（有 ${entry.warnings.length} 条告警，见报告）` : ''}`);
  }
  return entry;
}

// ---- 主循环：逐项目查重 → 共用抓取 → 双维度写回 ----

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);
const tdkResults = [];
const jsonldResults = [];

for (const project of targets) {
  if (SKIPS.includes(project.id.toLowerCase())) {
    console.log(`[tdk-jsonld] 跳过 ${project.id}`);
    const skipNote = '默认跳过（docs 大站页面量级大，且历史版本/多语言同页 TDK 同值属预期；用 --skip= 传空可强制检查）';
    if (DO_TDK) tdkResults.push(makeTdkSkipped(project, skipNote));
    if (DO_JSONLD) jsonldResults.push(jsonldSkippedEntry(project, skipNote));
    continue;
  }

  let preTdk = null;
  let preJsonld = null;
  if (submitIssues) {
    if (DO_TDK) {
      preTdk = await precheckExistingIssues({ repoUrl: project.repo, prefix: TDK_PREFIX, dimLabel: 'TDK 重复', force });
      preTdk.notes.forEach((n) => console.log(`[tdk-dup] ${project.id}: ${n}`));
    }
    if (DO_JSONLD) {
      preJsonld = await precheckExistingIssues({ repoUrl: project.repo, prefix: JSONLD_PREFIX, dimLabel: 'JSON-LD 规范', force });
      preJsonld.notes.forEach((n) => console.log(`[jsonld] ${project.id}: ${n}`));
    }
    // 任一维度未被查重拦截就需要抓取（抓取共用，只为未被拦截的维度出结论与写回）
    const needScan = (DO_TDK && !preTdk.block) || (DO_JSONLD && !preJsonld.block);
    if (!needScan) {
      if (DO_TDK) tdkResults.push(makeTdkSkipped(project, preTdk.notes));
      if (DO_JSONLD) jsonldResults.push(jsonldSkippedEntry(project, preJsonld.notes));
      continue;
    }
  }

  console.log(`\n[tdk-jsonld] ===== ${project.id} =====`);
  const scan = await scanProject(project);

  if (DO_TDK) tdkResults.push(submitIssues ? await finalizeTdk(project, preTdk, buildTdkEntry(project, scan)) : buildTdkEntry(project, scan));
  if (DO_JSONLD) jsonldResults.push(submitIssues ? await finalizeJsonld(project, preJsonld, buildJsonldEntry(project, scan)) : buildJsonldEntry(project, scan));
}

// ---- stats + Markdown 汇总报告（各维度独立输出，未跑的维度产物不动） ----

if (DO_TDK) {
  const statsPath = await writeStats('tdk-duplicate-stats', { timestamp: startedAt, measure: 'tdk-duplicate', dims: DIMS.join(','), mode: modeStr, results: tdkResults });
  const lines = [];
  lines.push('# TDK 重复性检查报告');
  lines.push('');
  lines.push(`- 检查时间：${startedAt}`);
  lines.push('- 检查方式：按 sitemap 全量页面逐页请求 HTML 分组判重（title/description/keywords），数据与 JSON-LD 维度共用同一份抓取（脚本已合并为 check-tdk-jsonld.mjs）');
  lines.push('- 判重字段：title（`<title>` 文本）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`），按去空格后的原文精确分组，同值对应 ≥2 个页面即记为重复组；空值/缺失不参与判重，单独计入"TDK 缺失检查"（区分元素缺失/内容为空）');
  lines.push(`- 运行模式：${submitIssues ? `提 issue（--submit-issues${dryRun ? '，dry-run' : ''}${force ? '，--force 强制执行：已有未关闭 issue 时更新原 issue 或评论 /close' : ''}）` : '常规检查'}；本次维度：${DIMS.join('、')}`);
  if (siteId) lines.push(`- 指定项目：--site=${siteId}`);
  lines.push('- 特殊约定：默认跳过 openEuler-docs、openGauss-docs、MindSpore-docs 三个 docs 项目（与 JSON-LD 维度共用同一跳过清单）；如需检查可用 --skip= 传空覆盖；配置 newVersions 的 docs 项目仅收集匹配版本的子 sitemap 页面');
  lines.push('- 完整重复组与缺失数据见：scripts/stats/tdk-duplicate-stats.json');
  lines.push('');
  lines.push('## 总览');
  lines.push('');
  lines.push('| 项目 | sitemap 页面数 | 成功抓取 | 抓取失败 | title 重复组/页 | description 重复组/页 | keywords 重复组/页 | 缺失页 t/d/k | 结论 |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const r of tdkResults) {
    if (r.skipped) {
      lines.push(`| ${r.projectName}（${r.projectId}） | - | - | - | - | - | - | - | ⏭️ 跳过 |`);
      continue;
    }
    const d = r.duplicates;
    const fmt = (f) => (d && d[f] ? `${d[f].groups}/${d[f].pages}` : '-');
    const fmtM = r.missing ? FIELDS.map((f) => (r.missing[f]?.noElement.length ?? 0) + (r.missing[f]?.empty.length ?? 0)).join('/') : '-';
    const hasDup = d && FIELDS.some((f) => d[f] && d[f].groups > 0);
    const hasMissing = missingTotal(r) > 0;
    const tag = r.issueUrl ? `，[issue](${r.issueUrl})` : '';
    const verdict = r.urlCount === 0 ? `❌ 无法检查${tag}` : hasDup ? (hasMissing ? `⚠️ 存在重复+缺失${tag}` : `⚠️ 存在重复${tag}`) : hasMissing ? `⚠️ 存在缺失${tag}` : `✅ 正常${tag}`;
    lines.push(`| ${r.projectName}（${r.projectId}） | ${r.urlCount} | ${r.fetched} | ${r.failed.length} | ${fmt('title')} | ${fmt('description')} | ${fmt('keywords')} | ${fmtM} | ${verdict} |`);
  }
  lines.push('');
  lines.push('## 各项目明细');
  if (submitIssues) {
    lines.push('');
    lines.push('（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录 `<项目ID>-full.md`）');
    const withIssue = tdkResults.filter((r) => !r.skipped && r.urlCount > 0 && hasAnyIssueTdk(r));
    for (const r of withIssue) lines.push(`- ${r.projectName}（${r.projectId}）：\`${r.projectId}-full.md\`${r.issueUrl ? `，issue：${r.issueUrl}（${r.issueAction === 'updated' ? '强制复检仍有问题，已更新原 issue' : '已提单'}）` : ''}`);
    for (const r of tdkResults.filter((x) => x.issueAction === 'close-commented' || x.issueAction === 'close-dry-run')) {
      lines.push(`- ${r.projectName}（${r.projectId}）：强制复检未再发现问题，${r.issueAction === 'close-commented' ? '已评论 /close 关闭原 issue' : '将评论 /close 关闭原 issue（dry-run/未写回）'}${r.issueUrl ? `：${r.issueUrl}` : ''}`);
    }
  } else {
    for (const r of tdkResults) lines.push(...tdkDetailLines(r));
  }
  await writeFile(resolve(DIRS.tdk, reportName), lines.join('\n') + '\n', 'utf8');
  console.log(`[tdk-dup] 检查完成：stats -> scripts/stats/tdk-duplicate-stats.json；报告 -> ${resolve(DIRS.tdk, reportName)}`);
}

if (DO_JSONLD) {
  const statsPath = await writeStats('jsonld-stats', { timestamp: startedAt, measure: 'json-ld', dims: DIMS.join(','), scope: 'sitemap-full', mode: modeStr, results: jsonldResults });
  const lines = [];
  lines.push('# JSON-LD 规范检查报告');
  lines.push('');
  lines.push(`- 检查时间：${startedAt}`);
  lines.push(`- 检查范围：projects.config.json 中 ${jsonldResults.length} 个项目${jsonldResults.some((r) => r.skipped) ? `（跳过：${jsonldResults.filter((r) => r.skipped).map((r) => r.projectId).join('、')}）` : ''}`);
  lines.push(`- 运行模式：${submitIssues ? `提 issue（--submit-issues${dryRun ? '，dry-run' : ''}${force ? '，--force 强制执行：已有未关闭 issue 时更新原 issue 或评论 /close' : ''}）` : '常规检查'}；本次维度：${DIMS.join('、')}`);
  if (siteId) lines.push(`- 指定项目：--site=${siteId}`);
  lines.push('- 检查策略（2026-10 起）：不再采样——按各项目 sitemap 全量展开页面 URL 逐页抓取（与 TDK 重复维度共用同一份 HTML 抓取，脚本 check-tdk-jsonld.mjs）；默认跳过 docs 大站（--skip= 传空覆盖）；抓取失败页面单列不计入判定');
  lines.push('- 规范来源：measures/04-json-ld/规范.md');
  lines.push('- 检查项：硬性=JSON 语法、`@context`、占位符、整站无合法块、站点/sitemap 不可达；告警=P0 三件套覆盖（Organization/WebSite/BreadcrumbList，已降级）、各类型 Google 必填属性（已降级）、同页重复块、面包屑项完整性、headline ≤110、publisher/Organization logo 形态、inLanguage、`@id` 覆盖率');
  lines.push('- 特殊约定：提单触发仅上述硬性项（P0 三件套与 Google 必填属性缺失自 2026-10 起仅计告警）；每维度独立查重（前缀 `[GEO JSON-LD]`），未关闭 issue 期间不重复扫描提单');
  lines.push('- 机器可读结果：scripts/stats/jsonld-stats.json');
  lines.push('');
  lines.push('## 总览');
  lines.push('');
  lines.push('| 项目 | sitemap 页面/抓取 | 合法块 | 语法错误 | @context 异常 | 占位符 | P0 三件套（告警） | 必填缺失（告警） | 其他告警 | 结论 |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const r of jsonldResults) {
    if (r.skipped) {
      lines.push(`| ${r.projectName}（${r.projectId}） | - | - | - | - | - | - | - | - | ⏭️ 跳过 |`);
      continue;
    }
    const c = r.checks;
    const tag = r.issueUrl ? `，[issue](${r.issueUrl})` : '';
    if (!c.urlCount || c.fetched === 0) {
      lines.push(`| ${r.projectName}（${r.projectId}） | ${c.urlCount ?? 0}/${c.fetched ?? 0}（失败 ${c.failedCount ?? 0}） | - | - | - | - | - | - | - | ${r.verdict}${tag} |`);
      continue;
    }
    const otherWarn = Math.max(0, r.warnings.length - (c.p0Missing.length ? 1 : 0) - (c.requiredMissingCount ? 1 : 0));
    lines.push(`| ${r.projectName}（${r.projectId}） | ${c.urlCount}/${c.fetched}（失败 ${c.failedCount}） | ${c.jsonLdCount} | ${c.invalidCount} | ${c.contextErrorCount} | ${c.placeholderCount} | ${c.p0Missing.length ? `⚠️ 缺 ${c.p0Missing.join('/')}` : '✅'} | ${c.requiredMissingCount} | ${otherWarn} | ${r.verdict}${tag} |`);
  }
  lines.push('');
  lines.push('## 各项目明细');
  if (submitIssues) {
    lines.push('');
    lines.push('（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 `<项目ID>-full.md`）');
    lines.push('');
    for (const r of jsonldResults.filter(hasAnyIssueJsonld)) {
      lines.push(`- ${r.projectName}（${r.projectId}）：\`${r.reports ? r.reports.full : '（dry-run 未写文件）'}\`${r.issueUrl ? `，issue：${r.issueUrl}` : r.issueAction === 'dry-run' ? '，（dry-run 未提交）' : r.issueAction === 'print-only' ? '，（未提单：无 token 或查重降级）' : ''}`);
    }
    for (const r of jsonldResults.filter((x) => x.issueAction === 'close-commented' || x.issueAction === 'close-dry-run')) {
      lines.push(`- ${r.projectName}（${r.projectId}）：强制复检未再发现硬性错误，${r.issueAction === 'close-commented' ? '已评论 /close 关闭原 issue' : '将评论 /close 关闭原 issue（dry-run/未写回）'}${r.issueUrl ? `：${r.issueUrl}` : ''}`);
    }
  } else {
    for (const r of jsonldResults) {
      lines.push('');
      lines.push(`### ${r.projectName}（${r.projectId}） — ${r.verdict}`);
      lines.push('');
      if (r.skipped) {
        for (const n of r.notes || []) lines.push(`- ${n}`);
        continue;
      }
      if (!r.checks.urlCount || r.checks.fetched === 0) {
        lines.push(`- ${r.hardErrors.join('；')}`);
        continue;
      }
      lines.push(...jsonldDetailLines(r));
    }
  }
  lines.push('');
  lines.push('## 结论与建议');
  lines.push('');
  const bad = jsonldResults.filter((r) => !r.skipped && r.hardErrors.length);
  const warn = jsonldResults.filter((r) => !r.skipped && !r.hardErrors.length && (r.warnings || []).length);
  const skipped = jsonldResults.filter((r) => r.skipped);
  if (bad.length) lines.push(`- 硬性不符合：${bad.map((r) => `${r.projectId}（${r.hardErrors[0]}${r.hardErrors.length > 1 ? ` 等 ${r.hardErrors.length} 类` : ''}）`).join('；')}，需优先整改。`);
  if (warn.length) lines.push(`- 存在告警：${warn.map((r) => `${r.projectId}（${r.warnings.length} 条，含 P0 三件套/必填属性等降级项）`).join('；')}，不触发提单，是否整改人工定夺。`);
  if (skipped.length) lines.push(`- 跳过（默认跳过清单或已有未关闭 issue 查重）：${skipped.map((r) => r.projectId).join('、')}。`);
  const updated = jsonldResults.filter((r) => r.issueAction === 'updated');
  if (updated.length) lines.push(`- 强制复检仍有问题，已更新原 issue：${updated.map((r) => r.projectId).join('、')}。`);
  const closedList = jsonldResults.filter((r) => r.issueAction === 'close-commented' || r.issueAction === 'close-dry-run');
  if (closedList.length) lines.push(`- 强制复检硬性错误已消除，${dryRun ? '将' : '已'}评论 /close 关闭原 issue：${closedList.map((r) => r.projectId).join('、')}。`);
  if (!bad.length && !warn.length && !skipped.length) lines.push('- 全部项目全量页面 JSON-LD 无硬性错误且无告警。');
  lines.push('');
  lines.push(`> 注：本报告由 scripts/checks/check-tdk-jsonld.mjs（--dims 含 jsonld）自动生成，与 TDK 重复维度共用抓取（同批次数据见 scripts/stats/jsonld-stats.json）。取值真实性（与页面可见内容一致、无编造）与富媒体资格（Rich Results Test）仍需人工抽查，见 measures/04-json-ld/检测方式.md。${submitIssues && !dryRun ? '硬性不符合项目已按 --submit-issues 流程提 issue（告警不提单）。' : ''}`);
  await writeFile(resolve(DIRS.jsonld, reportName), lines.join('\n') + '\n', 'utf8');
  console.log(`[jsonld] 检查完成：stats -> ${statsPath}；报告 -> ${resolve(DIRS.jsonld, reportName)}`);
}

const compactTdk = (r) =>
  r.skipped
    ? { dim: 'tdk', id: r.projectId, verdict: '⏭️', issueAction: r.issueAction }
    : { dim: 'tdk', id: r.projectId, urlCount: r.urlCount, fetched: r.fetched, failed: r.failed.length, dupGroups: FIELDS.map((f) => r.duplicates[f]?.groups ?? 0).join('/'), missingPages: missingTotal(r), issueAction: r.issueAction, issueUrl: r.issueUrl };
const compactJsonld = (r) => ({ dim: 'jsonld', id: r.projectId, verdict: r.skipped ? '⏭️' : r.verdict, errors: r.hardErrors, warnings: (r.warnings || []).length, issueAction: r.issueAction, issueUrl: r.issueUrl });
console.log(JSON.stringify([...tdkResults.map(compactTdk), ...jsonldResults.map(compactJsonld)], null, 2));
