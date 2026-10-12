import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText } from '../lib/http.mjs';
import { extractJsonLd } from '../lib/html.mjs';
import { writeStats, now } from '../lib/report.mjs';

const RULES_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'config', 'check-rules.json');
const rules = JSON.parse(await readFile(RULES_PATH, 'utf8'));
const SAMPLE_PAGES = rules.samplePages || ['/'];

const P0_TYPES = ['Organization', 'WebSite', 'BreadcrumbList'];

const REQUIRED_PROPS = {
  Organization: ['name', 'url'],
  WebSite: ['name', 'url'],
  WebPage: ['url', 'name'],
  BreadcrumbList: ['itemListElement'],
  Article: ['headline', 'image', 'datePublished', 'author'],
  TechArticle: ['headline', 'image', 'datePublished', 'author'],
  BlogPosting: ['headline', 'image', 'datePublished', 'author'],
  SoftwareApplication: ['name', 'operatingSystem', 'applicationCategory'],
  FAQPage: ['mainEntity'],
  Person: ['name'],
  Event: ['name', 'startDate', 'location'],
};

const ARTICLE_TYPES = new Set(['Article', 'TechArticle', 'BlogPosting']);
const PAGE_LEVEL_TYPES = new Set(['WebPage', 'WebSite', 'Article', 'TechArticle', 'BlogPosting']);
const PLACEHOLDER_RE = /(^|\b)(todo|fixme|tbd|placeholder|待填|占位)\b/i;
const CANONICAL_CONTEXT = 'https://schema.org';

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);

const results = [];

for (const project of targets) {
  const entry = { projectId: project.id, projectName: project.name, domain: project.domain, checks: {} };
  const types = new Set();
  const requiredMissing = [];
  const placeholderHits = [];
  const nestedIssues = [];
  const contextErrors = [];
  const pagesWithDuplicates = [];
  let jsonLdCount = 0;
  let invalidCount = 0;
  let duplicateBlockCount = 0;
  let nodeTotal = 0;
  let nodesWithId = 0;
  let usesGraph = false;
  let inLanguageMissing = 0;
  const pagesSampled = [];
  const perPage = [];

  const domainRoot = project.domain.replace(/\/+$/, '');
  const sampleUrls = new Map();
  sampleUrls.set('/', domainRoot);
  for (const p of SAMPLE_PAGES.filter((p) => p !== '/')) sampleUrls.set(p, domainRoot + p);

  for (const url of await llmsEntryPages(project, domainRoot)) {
    if (!sampleUrls.has(url)) sampleUrls.set(url, url);
  }

  let firstOk = false;
  let firstStatus = 0;

  for (const [label, url] of sampleUrls) {
    const { ok, status, text } = await fetchText(url, { timeout: 30000, maxBytes: 4 * 1024 * 1024 });
    if (label === '/') {
      firstOk = ok;
      firstStatus = status;
    }
    if (!ok) continue;
    const blocks = extractJsonLd(text);
    const pageTypes = new Set();
    if (blocks.length > 0) pagesSampled.push(label);

    // 重复块检测:同页内语义完全相同的 ld+json 块(常见于模板+插件双重注入)
    const seen = new Map();
    for (const b of blocks) {
      if (!b.valid) continue;
      const raw = JSON.stringify(b.data);
      const hits = seen.get(raw) || 0;
      if (hits > 0) {
        duplicateBlockCount++;
        if (!pagesWithDuplicates.includes(label)) pagesWithDuplicates.push(label);
      }
      seen.set(raw, hits + 1);
    }

    for (const b of blocks) {
      if (!b.valid) {
        invalidCount++;
        continue;
      }
      jsonLdCount++;

      // @context 校验:支持顶层对象与数组两种块形式
      if (!contextOk(b.data)) {
        contextErrors.push({ page: label, detail: contextDetail(b.data) });
      }

      const nodes = [];
      collectNodes(b.data, nodes);
      if (Array.isArray(b.data?.['@graph']) || (Array.isArray(b.data) && b.data.some((d) => Array.isArray(d?.['@graph'])))) {
        usesGraph = true;
      }
      for (const node of nodes) {
        nodeTotal++;
        if (node['@id']) nodesWithId++;
        validateNode(node, label, types, requiredMissing, nestedIssues);
        scanPlaceholders(node, node['@type'], placeholderHits);
        pageTypes.add(Array.isArray(node['@type']) ? node['@type'].join('/') : node['@type']);
      }
    }
    perPage.push({ page: label, jsonLdBlocks: blocks.length, types: [...pageTypes] });
  }

  entry.checks.accessible = firstOk;
  entry.checks.httpStatus = firstStatus;

  if (!firstOk) {
    entry.error = `首页不可访问 (${firstStatus})`;
    results.push(entry);
    continue;
  }

  entry.checks.pagesSampled = pagesSampled;
  entry.checks.perPage = perPage;
  entry.checks.jsonLdCount = jsonLdCount;
  entry.checks.invalidCount = invalidCount;
  entry.checks.schemaTypes = [...types];
  entry.checks.p0Missing = P0_TYPES.filter((t) => !types.has(t));
  entry.checks.requiredMissing = requiredMissing;
  entry.checks.requiredMissingCount = requiredMissing.length;
  entry.checks.nestedIssues = nestedIssues;
  entry.checks.placeholderHits = placeholderHits;
  entry.checks.placeholderCount = placeholderHits.length;
  entry.checks.contextErrorCount = contextErrors.length;
  entry.checks.contextErrors = contextErrors;
  entry.checks.duplicateBlockCount = duplicateBlockCount;
  entry.checks.pagesWithDuplicates = pagesWithDuplicates;
  entry.checks.idCoverage = nodeTotal === 0 ? null : +(nodesWithId / nodeTotal).toFixed(4);
  entry.checks.usesGraph = usesGraph;
  entry.checks.inLanguageMissing = inLanguageMissing || nestedIssues.filter((i) => i.issue?.includes('inLanguage')).length;

  results.push(entry);
}

async function llmsEntryPages(project, domainRoot) {
  if (!project.llmsUrl) return [];
  const { ok, text } = await fetchText(project.llmsUrl, { timeout: 30000, maxBytes: 12 * 1024 * 1024 });
  if (!ok) return [];
  const links = [...text.matchAll(/^\s*-\s*\[[^\]]*\]\(([^)]+)\)/gm)].map((m) => m[1]);
  return links
    .filter((u) => !/llms-full\.txt|sitemap/i.test(u))
    .map((u) => (/^https?:\/\//i.test(u) ? u : domainRoot + u))
    .map((u) => u.replace(/\.md$/i, '.html'))
    .slice(0, 2);
}

/** @context 允许:顶层字符串、数组块内逐元素、以及值为数组时包含规范值 */
function contextOk(data) {
  const check = (d) => {
    if (!d || typeof d !== 'object') return false;
    const ctx = d['@context'];
    if (ctx === CANONICAL_CONTEXT) return true;
    if (Array.isArray(ctx) && ctx.includes(CANONICAL_CONTEXT)) return true;
    return false;
  };
  if (Array.isArray(data)) return data.every((d) => d === null || check(d));
  return check(data);
}

function contextDetail(data) {
  const first = Array.isArray(data) ? data[0] : data;
  const ctx = first?.['@context'];
  return `@context 异常: ${ctx === undefined ? '缺失' : JSON.stringify(ctx)?.slice(0, 60)}`;
}

function collectNodes(data, out) {
  if (!data || typeof data !== 'object') return;
  if (Array.isArray(data)) {
    data.forEach((d) => collectNodes(d, out));
    return;
  }
  if (data['@type']) out.push(data);
  if (Array.isArray(data['@graph'])) data['@graph'].forEach((d) => collectNodes(d, out));
}

function validateNode(node, page, types, requiredMissing, nestedIssues) {
  const t = node['@type'];
  const typeList = Array.isArray(t) ? t : [t];
  typeList.forEach((x) => types.add(x));
  for (const type of typeList) {
    for (const prop of REQUIRED_PROPS[type] || []) {
      const v = node[prop];
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
        requiredMissing.push({ page, type, prop });
      }
    }
  }
  if (typeList.includes('BreadcrumbList')) {
    const items = node.itemListElement;
    if (Array.isArray(items)) {
      items.forEach((it, i) => {
        if (!it || !it.name) nestedIssues.push({ page, type: 'BreadcrumbList', issue: `第 ${i + 1} 项缺少 name` });
        if (it && it.position === undefined) nestedIssues.push({ page, type: 'BreadcrumbList', issue: `第 ${i + 1} 项缺少 position` });
      });
    }
  }
  if (typeList.some((x) => ARTICLE_TYPES.has(x))) {
    const headline = node.headline;
    if (typeof headline === 'string' && headline.length > 110) {
      nestedIssues.push({ page, type: 'TechArticle', issue: `headline ${headline.length} 字符超上限 110` });
    }
    const publisher = node.publisher;
    if (publisher && typeof publisher === 'object' && !publisher['@id'] && !publisher.logo) {
      nestedIssues.push({ page, type: 'TechArticle', issue: 'publisher 缺少 logo' });
    }
  }
  if (typeList.includes('FAQPage')) {
    const qs = node.mainEntity;
    if (Array.isArray(qs)) {
      qs.forEach((q, i) => {
        if (!q || !q.acceptedAnswer || !q.acceptedAnswer.text) {
          nestedIssues.push({ page, type: 'FAQPage', issue: `第 ${i + 1} 个问题缺少 acceptedAnswer.text` });
        }
      });
    }
  }
  if (typeList.includes('Organization')) {
    const logo = node.logo;
    if (!logo) {
      nestedIssues.push({ page, type: 'Organization', issue: '缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)' });
    } else if (typeof logo === 'string') {
      nestedIssues.push({ page, type: 'Organization', issue: 'logo 为裸字符串,推荐 {"@type":"ImageObject","url":...} 形式' });
    } else if (logo['@type'] === 'ImageObject' && typeof logo.url === 'string' && !/^https?:\/\//i.test(logo.url)) {
      nestedIssues.push({ page, type: 'Organization', issue: 'logo.url 非绝对 URL' });
    }
  }
  if (typeList.some((x) => PAGE_LEVEL_TYPES.has(x)) && !node.inLanguage) {
    nestedIssues.push({ page, type: typeList[0], issue: '缺少 inLanguage(中文站应为 zh-CN)' });
  }
}

function scanPlaceholders(value, label, hits, path = '') {
  if (typeof value === 'string') {
    if (PLACEHOLDER_RE.test(value)) hits.push({ prop: path || label, value: value.slice(0, 40) });
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('@')) continue;
      scanPlaceholders(v, label, hits, path ? `${path}.${k}` : k);
    }
  }
}

const report = { timestamp: now(), measure: 'json-ld', samplePages: SAMPLE_PAGES, results };
const path = await writeStats('jsonld-stats', report);
console.log(`[json-ld] 检查完成，${results.length} 个项目，结果已写入 ${path}`);
console.log(
  JSON.stringify(
    results.map((r) => ({
      id: r.projectId,
      blocks: r.checks?.jsonLdCount,
      invalid: r.checks?.invalidCount,
      ctxErr: r.checks?.contextErrorCount,
      dup: r.checks?.duplicateBlockCount,
      p0Missing: r.checks?.p0Missing,
      reqMissing: r.checks?.requiredMissingCount,
      nested: r.checks?.nestedIssues?.length,
      idCov: r.checks?.idCoverage,
      graph: r.checks?.usesGraph,
      inLangMiss: r.checks?.inLanguageMissing,
      placeholder: r.checks?.placeholderCount,
      types: r.checks?.schemaTypes,
    })),
    null,
    2
  )
);
