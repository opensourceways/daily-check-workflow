// JSON-LD 页面级分析器与分级判定（自 check-jsonld.mjs 抽出，供合并脚本 check-tdk-jsonld.mjs 在共用抓取的 HTML 上消费）。
// 分级约定（2026-10 重构）：硬性错误=语法错误/@context 异常/整站无合法块/站点不可达；
// P0 三件套与 Google 必填属性已降级为告警（随全量扫描噪音大，不再触发提单）；
// 占位符检查停用中（英文业务文案含 todo/tbd 等词误伤，PLACEHOLDER_RE 待重新设计后再启用）。
import { extractJsonLd } from './html.mjs';

export const P0_TYPES = ['Organization', 'WebSite', 'BreadcrumbList'];

export const REQUIRED_PROPS = {
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

/** @context 允许:顶层字符串、数组块内逐元素、以及值为数组时包含规范值 */
export function contextOk(data) {
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

export function contextDetail(data) {
  const first = Array.isArray(data) ? data[0] : data;
  const ctx = first?.['@context'];
  return `@context 异常: ${ctx === undefined ? '缺失' : JSON.stringify(ctx)?.slice(0, 60)}`;
}

export function collectNodes(data, out) {
  if (!data || typeof data !== 'object') return;
  if (Array.isArray(data)) {
    data.forEach((d) => collectNodes(d, out));
    return;
  }
  if (data['@type']) out.push(data);
  if (Array.isArray(data['@graph'])) data['@graph'].forEach((d) => collectNodes(d, out));
}

export function validateNode(node, page, types, requiredMissing, nestedIssues) {
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

export function scanPlaceholders(value, label, hits, page, path = '') {
  if (typeof value === 'string') {
    if (PLACEHOLDER_RE.test(value)) hits.push({ page, prop: path || label, value: value.slice(0, 40) });
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('@')) continue;
      scanPlaceholders(v, label, hits, page, path ? `${path}.${k}` : k);
    }
  }
}

// 项目级累积器：addPage 消费每页 HTML，checks() 输出聚合结果（urlCount/fetched/failed 由调用方并入后再 classify）
export function createJsonLdAnalyzer() {
  const types = new Set();
  const requiredMissing = [];
  const placeholderHits = [];
  const nestedIssues = [];
  const contextErrors = [];
  const invalidPages = new Set();
  const pagesWithDuplicates = [];
  const pagesWithBlocks = [];
  const perPage = [];
  let jsonLdCount = 0;
  let invalidCount = 0;
  let duplicateBlockCount = 0;
  let nodeTotal = 0;
  let nodesWithId = 0;
  let usesGraph = false;

  return {
    addPage(page, html) {
      const blocks = extractJsonLd(html);
      const pageTypes = new Set();
      if (blocks.length > 0) pagesWithBlocks.push(page);

      // 重复块检测:同页内语义完全相同的 ld+json 块(常见于模板+插件双重注入)
      const seen = new Map();
      for (const b of blocks) {
        if (!b.valid) continue;
        const raw = JSON.stringify(b.data);
        const hits = seen.get(raw) || 0;
        if (hits > 0) {
          duplicateBlockCount++;
          if (!pagesWithDuplicates.includes(page)) pagesWithDuplicates.push(page);
        }
        seen.set(raw, hits + 1);
      }

      for (const b of blocks) {
        if (!b.valid) {
          invalidCount++;
          invalidPages.add(page);
          continue;
        }
        jsonLdCount++;
        if (!contextOk(b.data)) {
          contextErrors.push({ page, detail: contextDetail(b.data) });
        }
        const nodes = [];
        collectNodes(b.data, nodes);
        if (Array.isArray(b.data?.['@graph']) || (Array.isArray(b.data) && b.data.some((d) => Array.isArray(d?.['@graph'])))) {
          usesGraph = true;
        }
        for (const node of nodes) {
          nodeTotal++;
          if (node['@id']) nodesWithId++;
          validateNode(node, page, types, requiredMissing, nestedIssues);
          // 占位符检查停用（2026-10，误伤待重新设计）：placeholderHits 恒为空，恢复时取消注释即可
          // scanPlaceholders(node, node['@type'], placeholderHits, page);
          pageTypes.add(Array.isArray(node['@type']) ? node['@type'].join('/') : node['@type']);
        }
      }
      perPage.push({ page, jsonLdBlocks: blocks.length, types: [...pageTypes] });
    },
    checks() {
      return {
        jsonLdCount,
        invalidCount,
        invalidPages: [...invalidPages],
        contextErrors,
        contextErrorCount: contextErrors.length,
        duplicateBlockCount,
        pagesWithDuplicates,
        pagesWithBlocks,
        perPage,
        schemaTypes: [...types],
        p0Missing: P0_TYPES.filter((t) => !types.has(t)),
        requiredMissing,
        requiredMissingCount: requiredMissing.length,
        nestedIssues,
        placeholderHits,
        placeholderCount: placeholderHits.length,
        idCoverage: nodeTotal === 0 ? null : +(nodesWithId / nodeTotal).toFixed(4),
        usesGraph,
        inLanguageMissing: nestedIssues.filter((i) => i.issue?.includes('inLanguage')).length,
      };
    },
  };
}

// 错误/告警分级：硬性错误（提单触发）=站点不可达/无合法块/语法错误/@context 异常（占位符停用中）；
// 告警（不提单）=P0 三件套缺失、Google 必填属性缺失（2026-10 自 P0 降级）、重复块、结构推荐项、@id 覆盖率。
export function classifyJsonLd(c) {
  const errs = [];
  const warns = [];
  if (c.urlCount === 0) {
    errs.push('sitemap 未收集到任何页面（站点或 sitemapUrl 不可访问），无法检查 JSON-LD');
  } else if (c.fetched === 0) {
    errs.push(`sitemap 共 ${c.urlCount} 个页面全部抓取失败，无法检查 JSON-LD`);
  } else {
    if (c.jsonLdCount === 0) errs.push(`全站抓取到的 ${c.fetched} 个页面均未发现合法 JSON-LD 块`);
    if (c.invalidCount > 0) errs.push(`JSON 语法错误块 ${c.invalidCount} 个（涉及 ${c.invalidPages.length} 个页面，如 ${c.invalidPages.slice(0, 3).map((u) => `${u} `).join('、')}）`);
    if (c.contextErrorCount > 0) errs.push(`@context 异常块 ${c.contextErrorCount} 个（应固定为 https://schema.org）`);
    // 占位符检查停用（2026-10）：placeholderCount 恒为 0，恢复扫描后取消注释即可重新作为硬性错误
    // if (c.placeholderCount > 0) errs.push(`占位符取值 ${c.placeholderCount} 处（TODO/待填/占位等，禁止上线）`);
    if (c.p0Missing.length) warns.push(`P0 三件套缺失：${c.p0Missing.join(' / ')}（全站抓取页面未出现该类型；已降级为告警级，人工定夺，不触发提单）`);
    if (c.requiredMissingCount > 0) {
      const grouped = new Map();
      for (const m of c.requiredMissing) grouped.set(`${m.type}.${m.prop}`, (grouped.get(`${m.type}.${m.prop}`) || 0) + 1);
      const top = [...grouped.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, n]) => `${k}×${n}`).join('、');
      warns.push(`Google 必填属性缺失 ${c.requiredMissingCount} 处（主要：${top}${grouped.size > 3 ? ' 等' : ''}；已降级为告警级，人工定夺，不触发提单）`);
    }
    if (c.duplicateBlockCount > 0) warns.push(`同页语义重复块 ${c.duplicateBlockCount} 处（涉及 ${c.pagesWithDuplicates.length} 个页面，常见根因：模板+插件双重注入）`);
    if (c.nestedIssues.length > 0) warns.push(`结构与推荐项问题 ${c.nestedIssues.length} 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）`);
    if (c.jsonLdCount > 0 && c.idCoverage !== null && c.idCoverage < 1) warns.push(`@id 覆盖率 ${(c.idCoverage * 100).toFixed(0)}%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）`);
  }
  return { hardErrors: errs, warnings: warns, verdict: errs.length ? '❌' : warns.length ? '⚠️' : '✅' };
}
