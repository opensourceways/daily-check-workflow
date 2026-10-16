import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjects, filterProjects } from '../lib/config.mjs';
import { parseSitemap } from '../lib/sitemap.mjs';
import { extractTitle, extractMeta } from '../lib/html.mjs';
import { writeStats, now } from '../lib/report.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

// 参考 seo-check/scripts/description-check.js：按字段把页面值分组，组内 >1 个页面即重复组。
// 区别：不遍历本地构建产物，而是按 sitemap 全量页面 URL 发请求获取 HTML。
const FIELDS = ['title', 'description', 'keywords'];

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

function buildFieldMaps(pages) {
  const maps = new Map(FIELDS.map((f) => [f, new Map()]));
  for (const page of pages) {
    for (const field of FIELDS) {
      const value = page[field] ?? '';
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
const dateStr = dateStrOf(startedAt);
const dir = resolve(ROOT, 'manual-review', 'issues', 'tdk');
await mkdir(dir, { recursive: true });
const reportPath = resolve(dir, `tdk-duplicate-report-${dateStr}.md`);

async function checkProject(project) {
  const entry = {
    projectId: project.id,
    projectName: project.name,
    sitemapUrl: project.sitemapUrl,
    urlCount: 0,
    fetched: 0,
    failed: [],
    notes: [],
    duplicates: {},
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
    return {
      url,
      title: extractTitle(res.text) ?? '',
      description: extractMeta(res.text, 'description') ?? '',
      keywords: extractMeta(res.text, 'keywords') ?? '',
    };
  });
  const okPages = pages.filter(Boolean);
  entry.fetched = okPages.length;

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
  return lines;
}

for (const project of targets) {
  let entry;
  if (SKIPS.includes(project.id.toLowerCase())) {
    console.log(`[tdk-dup] 跳过 ${project.id}`);
    entry = {
      projectId: project.id,
      projectName: project.name,
      sitemapUrl: project.sitemapUrl,
      skipped: true,
      urlCount: 0,
      fetched: 0,
      failed: [],
      notes: ['默认跳过（docs 大站页面量级大，且历史版本/多语言同页 TDK 同值属预期；用 --skip= 传空可强制检查）'],
      duplicates: Object.fromEntries(FIELDS.map((f) => [f, { groups: 0, pages: 0, list: [] }])),
    };
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
lines.push('- 判重字段：title（`<title>` 文本）、description（`<meta name="description">`）、keywords（`<meta name="keywords">`），按去空格后的原文精确分组，同值对应 ≥2 个页面即记为重复组；空值归入"(缺失)"组');
lines.push(`- 特殊约定：默认跳过 openEuler-docs、openGauss-docs、MindSpore-docs 三个 docs 项目（页面量级大，且多语言/历史版本同页 TDK 同值属预期）；如需检查可用 --skip= 传空覆盖；配置 newVersions 的 docs 项目仅收集匹配版本的子 sitemap 页面`);
lines.push(`- 完整重复组数据见：workflow/stats/tdk-duplicate-stats.json`);
lines.push('');
lines.push('## 总览');
lines.push('');
lines.push('| 项目 | sitemap 页面数 | 成功抓取 | 抓取失败 | title 重复组/页 | description 重复组/页 | keywords 重复组/页 | 结论 |');
lines.push('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const r of results) {
  if (r.skipped) {
    lines.push(`| ${r.projectName}（${r.projectId}） | - | - | - | - | - | - | ⏭️ 跳过 |`);
    continue;
  }
  const d = r.duplicates;
  const fmt = (f) => (d && d[f] ? `${d[f].groups}/${d[f].pages}` : '-');
  const hasDup = d && FIELDS.some((f) => d[f] && d[f].groups > 0);
  const verdict = r.urlCount === 0 ? '❌ 无法检查' : hasDup ? '⚠️ 存在重复' : '✅ 无重复';
  lines.push(`| ${r.projectName}（${r.projectId}） | ${r.urlCount} | ${r.fetched} | ${r.failed.length} | ${fmt('title')} | ${fmt('description')} | ${fmt('keywords')} | ${verdict} |`);
}
lines.push('');
lines.push('## 各项目明细');
for (const r of results) lines.push(...detailLines(r));

await writeFile(reportPath, lines.join('\n') + '\n', 'utf8');
console.log(`\n[tdk-dup] 检查完成：stats -> ${statsPath}`);
console.log(`[tdk-dup] 报告 -> ${reportPath}`);

function dateStrOf(iso) {
  return iso.slice(0, 10);
}
