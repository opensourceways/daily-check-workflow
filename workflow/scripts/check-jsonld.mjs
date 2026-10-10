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
const PLACEHOLDER_RE = /(^|\b)(todo|fixme|tbd|placeholder|待填|占位)\b/i;

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
  let jsonLdCount = 0;
  let invalidCount = 0;
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
    const { ok, status, text } = await fetchText(url);
    if (label === '/') {
      firstOk = ok;
      firstStatus = status;
    }
    if (!ok) continue;
    const blocks = extractJsonLd(text);
    const pageTypes = new Set();
    if (blocks.length > 0) pagesSampled.push(label);
    for (const b of blocks) {
      if (!b.valid) {
        invalidCount++;
        continue;
      }
      jsonLdCount++;
      const nodes = [];
      collectNodes(b.data, nodes);
      for (const node of nodes) {
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

  results.push(entry);
}

async function llmsEntryPages(project, domainRoot) {
  if (!project.llmsUrl) return [];
  try {
    const { ok, text } = await fetchText(project.llmsUrl);
    if (!ok) return [];
    const links = [...text.matchAll(/^\s*-\s*\[[^\]]*\]\(([^)]+)\)/gm)].map((m) => m[1]);
    return links
      .filter((u) => !/llms-full\.txt|sitemap/i.test(u))
      .map((u) => (/^https?:\/\//i.test(u) ? u : domainRoot + u))
      .map((u) => u.replace(/\.md$/i, '.html'))
      .slice(0, 2);
  } catch {
    return [];
  }
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
      p0Missing: r.checks?.p0Missing,
      reqMissing: r.checks?.requiredMissingCount,
      nested: r.checks?.nestedIssues?.length,
      placeholder: r.checks?.placeholderCount,
      types: r.checks?.schemaTypes,
    })),
    null,
    2
  )
);
