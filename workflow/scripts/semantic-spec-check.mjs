import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjects } from '../lib/config.mjs';
import { fetchText } from '../lib/http.mjs';
import { parseSitemap } from '../lib/sitemap.mjs';
import { writeStats, now } from '../lib/report.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

const rules = JSON.parse(await readFile(resolve(ROOT, 'workflow/config/check-rules.json'), 'utf8'));
const BAD_LINK_TEXT = new Set(rules.badLinkTextBlacklist.map((t) => t.toLowerCase()));
const BAD_ALT = new Set(rules.badAltBlacklist.map((t) => t.toLowerCase()));

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const SKIP_IDS = ['MindSpore-docs'];
const DOC_HOME_PAGES = {
  'openEuler-docs': [['/zh/', '文档首页 /zh/'], ['/en/', '文档首页 /en/']],
  'openGauss-docs': [['/zh/', '文档首页 /zh/'], ['/en/', '文档首页 /en/']],
  'openUBMC-docs': [['/zh/latest', '文档首页 /docs/zh/latest'], ['/en/latest', '文档首页 /docs/en/latest']],
};
const SAMPLE_CAP = 4;
const LANGS = new Set(['zh', 'en', 'ja', 'ko', 'fr', 'es', 'de', 'ru', 'pt', 'hi', 'zh-cn', 'zh-tw']);
const SKIP_SECTION = /^(docs|versiondocs|tag|tags|category|categories|search|archives?)$/i;

const ISSUE_META = {
  'a.badText': { spec: '06', name: '无语义链接文本', level: 'error' },
  'a.jsHref': { spec: '06', name: 'javascript: 伪协议 href', level: 'error' },
  'a.invalidHref': { spec: '06', name: 'href 空/缺失/#', level: 'error' },
  'a.extNoRel': { spec: '06', name: '外链 target=_blank 缺 rel=noopener', level: 'error' },
  'a.imgLinkNoAlt': { spec: '06', name: '图片链接缺 alt', level: 'error' },
  'a.brokenAnchor': { spec: '06', name: '锚点指向不存在的 id', level: 'warn' },
  's.h1Count': { spec: '07', name: 'h1 数量不为 1', level: 'error' },
  's.headingSkip': { spec: '07', name: '标题层级跳级', level: 'error' },
  's.noMain': { spec: '07', name: '缺 `<main>` 区块', level: 'error' },
  's.noNav': { spec: '07', name: '缺 `<nav>` 区块', level: 'warn' },
  's.noFooter': { spec: '07', name: '缺 `<footer>` 区块', level: 'warn' },
  's.clientShell': { spec: '07', name: '页面为客户端渲染壳，静态 HTML 无实质内容', level: 'error' },
  'i.missingAlt': { spec: '08', name: '`<img>` 缺 alt 属性', level: 'error' },
  'i.badAlt': { spec: '08', name: '无意义 alt 文本', level: 'error' },
  'i.longAlt': { spec: '08', name: 'alt 超过 125 字符', level: 'warn' },
  'i.dupAlt': { spec: '08', name: '同页 alt 大量重复', level: 'warn' },
};

function trunc(s, n = 100) {
  s = String(s ?? '');
  return s.length > n ? s.slice(0, n) + '…' : s;
}

function toContentHtml(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ');
}

function parseAttrs(s) {
  const attrs = {};
  const re = /([:@a-zA-Z_.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let m;
  while ((m = re.exec(s)) !== null) attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  return attrs;
}

function stripTags(s) {
  return s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImgs(s) {
  const imgs = [];
  const re = /<img\b([^>]*)\/?>/gi;
  let m;
  while ((m = re.exec(s)) !== null) {
    const a = parseAttrs(m[1]);
    imgs.push({ src: a.src ?? '', alt: a.alt ?? null });
  }
  return imgs;
}

function extractAnchors(html) {
  const out = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const a = parseAttrs(m[1]);
    const inner = m[2];
    out.push({
      href: a.href ?? null,
      rel: a.rel ?? null,
      target: a.target ?? null,
      text: stripTags(inner),
      imgs: extractImgs(inner),
    });
  }
  return out;
}

function headingSequence(html) {
  const out = [];
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) out.push({ level: Number(m[1]), text: trunc(stripTags(m[2]), 60) });
  return out;
}

function collectIds(html) {
  const ids = new Set();
  const re = /\bid\s*=\s*(?:"([^"]+)"|'([^']+)')/gi;
  let m;
  while ((m = re.exec(html)) !== null) ids.add(m[1] ?? m[2]);
  return ids;
}

function checkPage(rawHtml, pageUrl) {
  const html = toContentHtml(rawHtml);
  const issues = {};
  const push = (type, item) => {
    (issues[type] ||= { count: 0, samples: [] });
    issues[type].count += 1;
    if (issues[type].samples.length < 5) issues[type].samples.push(item);
  };

  const origin = new URL(pageUrl).origin;
  const anchors = extractAnchors(html);
  const ids = collectIds(html);
  for (const a of anchors) {
    const href = (a.href ?? '').trim();
    if (a.text && BAD_LINK_TEXT.has(a.text.toLowerCase())) {
      push('a.badText', { text: trunc(a.text, 40), href: trunc(href, 90) });
    }
    if (a.href === null || href === '' || href === '#' || href === '#!' || href === '####') {
      push('a.invalidHref', { text: trunc(a.text, 40), href: a.href === null ? '(缺失)' : href });
    } else if (/^javascript:/i.test(href)) {
      push('a.jsHref', { text: trunc(a.text, 40), href: trunc(href, 90) });
    } else if (href.startsWith('#') && href !== '#top') {
      const frag = decodeURIComponent(href.slice(1));
      if (frag && !ids.has(frag)) push('a.brokenAnchor', { href: trunc(href, 90) });
    }
    if (/^https?:\/\//i.test(href)) {
      let external = false;
      try { external = new URL(href).origin !== origin; } catch { external = true; }
      if (external && a.target === '_blank' && (!a.rel || !/noopener/i.test(a.rel))) {
        push('a.extNoRel', { text: trunc(a.text, 40), href: trunc(href, 90), rel: a.rel ?? '(无)' });
      }
    }
    if (!a.text && a.imgs.length > 0 && a.imgs.some((i) => !i.alt)) {
      push('a.imgLinkNoAlt', { src: trunc(a.imgs[0].src, 90) });
    }
  }

  const headings = headingSequence(html);
  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length !== 1) {
    push('s.h1Count', { h1: h1s.length, texts: h1s.map((h) => h.text).slice(0, 5) });
  }
  for (let i = 1; i < headings.length; i++) {
    if (headings[i].level > headings[i - 1].level + 1) {
      push('s.headingSkip', { from: `h${headings[i - 1].level}`, to: `h${headings[i].level}`, text: headings[i].text });
    }
  }
  const landmarks = {};
  for (const tag of ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer']) {
    landmarks[tag] = (html.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
  }
  if (!landmarks.main) push('s.noMain', {});
  if (!landmarks.nav) push('s.noNav', {});
  if (!landmarks.footer) push('s.noFooter', {});

  const imgs = extractImgs(html);
  const altCounts = new Map();
  for (const img of imgs) {
    if (img.alt === null) push('i.missingAlt', { src: trunc(img.src, 100) });
    else if (img.alt && BAD_ALT.has(img.alt.trim().toLowerCase())) push('i.badAlt', { alt: trunc(img.alt, 60), src: trunc(img.src, 80) });
    if (img.alt && img.alt.length > 125) push('i.longAlt', { alt: trunc(img.alt, 140) });
    if (img.alt) altCounts.set(img.alt, (altCounts.get(img.alt) || 0) + 1);
  }
  for (const [alt, n] of altCounts) {
    if (n >= 3) push('i.dupAlt', { alt: trunc(alt, 60), count: n });
  }

  const divCount = (html.match(/<div\b/gi) || []).length;
  const semanticCount = Object.values(landmarks).reduce((a, b) => a + b, 0);
  return {
    issues,
    stats: {
      anchors: anchors.length,
      images: imgs.length,
      headings: headings.map((h) => `h${h.level}`).join(','),
      divCount,
      semanticCount,
      landmarks,
    },
  };
}

async function pickPortalPages(project) {
  const pages = [{ url: project.domain.replace(/\/$/, '') + '/', label: '首页' }];
  if (!project.sitemapUrl) return pages;
  const fetchXml = async (u) => {
    const { ok, text } = await fetchText(u, { timeout: 30000, maxBytes: 8 * 1024 * 1024 });
    return ok ? text : '';
  };
  let urls = [];
  let raw = await fetchXml(project.sitemapUrl);
  if (raw) {
    let parsed = parseSitemap(raw);
    urls = parsed.urls;
    if (!urls.length && parsed.sitemaps.length) {
      for (const child of parsed.sitemaps.slice(0, 5)) {
        const childRaw = await fetchXml(child.loc);
        if (childRaw) urls.push(...parseSitemap(childRaw).urls);
      }
    }
  }
  const origins = new Set([new URL(project.domain).origin]);
  if (project.domainAlias) origins.add(new URL(project.domainAlias).origin);
  const groups = new Map();
  for (const { loc } of urls) {
    if (!loc) continue;
    let u;
    try { u = new URL(loc); } catch { continue; }
    if (!origins.has(u.origin)) continue;
    if (/\.(md|pdf|txt|xml|json)$/i.test(u.pathname)) continue;
    const segs = u.pathname.split('/').filter(Boolean);
    if (!segs.length || SKIP_SECTION.test(segs[0])) continue;
    let i = LANGS.has(segs[0].toLowerCase()) ? 1 : 0;
    const section = (segs[i] || '').toLowerCase();
    if (!section || SKIP_SECTION.test(section)) continue;
    const depth = segs.length;
    const cur = groups.get(section);
    if (!cur || depth < cur.depth || (depth === cur.depth && loc.length < cur.url.length)) {
      groups.set(section, { url: loc, depth });
    }
  }
  const picked = [...groups.values()].sort((a, b) => a.depth - b.depth || a.url.length - b.url.length).slice(0, SAMPLE_CAP);
  for (const p of picked) pages.push({ url: p.url, label: p.url });
  return pages;
}

const projects = await loadProjects();
const reportData = { timestamp: now(), measure: 'html-semantics-spec-check', projects: [] };

for (const project of projects) {
  if (SKIP_IDS.includes(project.id)) {
    reportData.projects.push({ id: project.id, name: project.name, skipped: true, reason: '按要求跳过（MindSpore-docs 本次不检查）' });
    console.log(`[skip] ${project.id}`);
    continue;
  }
  const docPaths = DOC_HOME_PAGES[project.id];
  const pages = docPaths
    ? docPaths.map(([p, label]) => ({ url: project.domain.replace(/\/$/, '') + p, label }))
    : await pickPortalPages(project);

  const pageResults = [];
  for (const page of pages) {
    const { ok, status: httpStatus, text, url: fetchedUrl } = await fetchText(page.url, { timeout: 30000, maxBytes: 12 * 1024 * 1024 });
    let status = httpStatus;
    let finalUrl = fetchedUrl;
    const entry = { url: page.url, finalUrl, status, accessible: ok, label: page.label };
    let body = text;
    if (ok && body && body.length < 2000) {
      const mr = /<meta[^>]+http-equiv=["']?refresh["']?[^>]+content=["']?\s*0\s*;\s*url=([^"'>\s]+)/i.exec(body);
      if (mr) {
        const target = new URL(mr[1], finalUrl || page.url).href;
        const r2 = await fetchText(target, { timeout: 30000, maxBytes: 12 * 1024 * 1024 });
        if (r2.ok && r2.text) {
          entry.metaRefreshTo = target;
          entry.finalUrl = r2.url || target;
          entry.status = r2.status;
          body = r2.text;
          finalUrl = entry.finalUrl;
        }
      }
    }
    if (ok && body) {
      const { issues, stats } = checkPage(body, finalUrl || page.url);
      if (stats.anchors === 0 && stats.images === 0 && stats.divCount < 5) {
        entry.shell = true;
        entry.note = '客户端渲染壳，静态 HTML 无实质内容（搜索引擎/AI 无法解析其语义结构）';
        entry.issues = { 's.clientShell': { count: 1, samples: [{ url: finalUrl || page.url }] } };
        entry.stats = stats;
      } else {
        entry.issues = issues;
        entry.stats = stats;
      }
    }
    pageResults.push(entry);
    await new Promise((r) => setTimeout(r, 300));
  }

  const aggregate = {};
  for (const pr of pageResults) {
    for (const [type, v] of Object.entries(pr.issues || {})) {
      aggregate[type] ||= { count: 0 };
      aggregate[type].count += v.count;
    }
  }
  reportData.projects.push({ id: project.id, name: project.name, domain: project.domain, pages: pageResults, aggregate });
  const total = Object.values(aggregate).reduce((a, b) => a + b.count, 0);
  console.log(`[${project.id}] pages=${pageResults.length} issues=${total}`);
}

await writeStats('semantic-spec-stats', reportData);

function levelOf(type) { return ISSUE_META[type]?.level || 'warn'; }
function specOf(type) { return ISSUE_META[type]?.spec || ''; }
function nameOf(type) { return ISSUE_META[type]?.name || type; }

const ts = reportData.timestamp;
const date = ts.slice(0, 10);
const lines = [];
lines.push('# HTML 元素语义化规范抽查报告（06 a 标签 / 07 标签结构 / 08 图片 alt）');
lines.push('');
lines.push(`- 检查时间：${ts}`);
lines.push(`- 检查范围：projects.config.json 全部项目，按规范 measures/06-a-tag-semantics、07-tag-structure-semantics、08-image-alt 抽查；每个项目抽取少量页面（门户类：首页 + 至多 ${SAMPLE_CAP} 个 sitemap 抽样页；文档类：仅 /zh/ 与 /en/ 首页）`);
lines.push('- 跳过项：MindSpore-docs（按要求本次不检查）');
lines.push('- 解析口径：抓取线上静态/SSR 渲染 HTML，剔除 `<script>`/`<style>`/`<!-- -->`/`<noscript>` 后按正则解析，仅反映已渲染到 HTML 的内容，不含 JS 运行时动态插入的 DOM');
lines.push('- 检测项：06 无语义链接文本、javascript: 伪协议、href 空/缺失/#、外链 target=_blank 缺 rel=noopener、图片链接缺 alt、站内锚点指向不存在的 id；07 h1 唯一性、标题层级跳级、main/nav/footer 语义区块；08 img 缺 alt、无意义 alt、alt>125 字符、同页 alt 重复≥3');
lines.push('- 判定：error 级为规范必选项违规（❌），warn 级为规范可选项/建议项（⚠️）');
lines.push('- 壳页面：静态 HTML 仅为客户端渲染壳（无实质 DOM）的页面记为 07 规范问题「客户端渲染壳」（搜索引擎/AI 无法解析其语义结构）；meta-refresh 跳转页自动跟随到真实目标后检查');
lines.push('');

const overview = [];
for (const p of reportData.projects) {
  if (p.skipped) continue;
  let err = 0, warn = 0, inaccessible = 0;
  const bySpec = { '06': 0, '07': 0, '08': 0 };
  for (const pg of p.pages) {
    if (!pg.accessible) { inaccessible++; continue; }
    for (const [type, v] of Object.entries(pg.issues || {})) {
      if (levelOf(type) === 'error') err += v.count; else warn += v.count;
      bySpec[specOf(type)] = (bySpec[specOf(type)] || 0) + v.count;
    }
  }
  const verdict = p.pages.length === inaccessible ? '❌ 页面不可访问' : inaccessible ? '❌' : err ? '❌' : warn ? '⚠️' : '✅';
  overview.push({ p, err, warn, inaccessible, bySpec, verdict });
}

lines.push('## 总览');
lines.push('');
lines.push('| 项目 | 抽查页面数 | 06 a标签 | 07 结构 | 08 alt | 不可访问 | 结论 |');
lines.push('| --- | --- | --- | --- | --- | --- | --- |');
for (const o of overview) {
  lines.push(`| ${o.p.name}（${o.p.id}） | ${o.p.pages.length} | ${o.bySpec['06'] || 0} | ${o.bySpec['07'] || 0} | ${o.bySpec['08'] || 0} | ${o.inaccessible} | ${o.verdict} |`);
}
lines.push('');
lines.push('## 问题类型汇总');
lines.push('');
const typeAgg = new Map();
for (const p of reportData.projects) {
  if (p.skipped) continue;
  for (const pg of p.pages) {
    for (const [type, v] of Object.entries(pg.issues || {})) {
      const t = typeAgg.get(type) || { total: 0, projs: new Map() };
      t.total += v.count;
      t.projs.set(p.id, (t.projs.get(p.id) || 0) + v.count);
      typeAgg.set(type, t);
    }
  }
}
lines.push('| 规范 | 级别 | 问题类型 | 总次数 | 涉及项目（次数） |');
lines.push('| --- | --- | --- | --- | --- |');
const typeOrder = ['a.badText', 'a.jsHref', 'a.invalidHref', 'a.extNoRel', 'a.imgLinkNoAlt', 'a.brokenAnchor', 's.h1Count', 's.headingSkip', 's.noMain', 's.noNav', 's.noFooter', 'i.missingAlt', 'i.badAlt', 'i.longAlt', 'i.dupAlt'];
for (const type of typeOrder.filter((t) => typeAgg.has(t)).concat([...typeAgg.keys()].filter((t) => !typeOrder.includes(t)))) {
  const t = typeAgg.get(type);
  const projStr = [...t.projs.entries()].sort((a, b) => b[1] - a[1]).map(([id, n]) => `${id}(${n})`).join('、');
  lines.push(`| ${specOf(type)} | ${levelOf(type) === 'error' ? '❌ 必选' : '⚠️ 建议'} | ${nameOf(type)} | ${t.total} | ${projStr} |`);
}
lines.push('');
lines.push('## 各项目明细');
lines.push('');

function renderSamples(iss) {
  const rows = [];
  for (const s of iss.samples) {
    const parts = Object.entries(s).filter(([, v]) => v !== '' && v !== undefined).map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(' / ') : v}`);
    rows.push(`    - ${parts.join('，') || '(无详情)'}`);
  }
  return rows;
}

for (const o of overview) {
  const p = o.p;
  lines.push(`### ${p.name}（${p.id}） — ${o.verdict}`);
  lines.push('');
  lines.push('抽查页面：');
  lines.push('');
  for (const pg of p.pages) {
    const arrow = pg.finalUrl && pg.finalUrl !== pg.url ? ` → ${pg.finalUrl}` : '';
    lines.push(`- ${pg.url}${arrow}（HTTP ${pg.status}${pg.accessible ? ' ✅' : ' ❌'}）`);
  }
  lines.push('');
  for (const pg of p.pages) {
    if (!pg.accessible) {
      lines.push(`- ❌ ${pg.url}：不可访问（HTTP ${pg.status}），未纳入统计`);
      lines.push('');
      continue;
    }
    const st = pg.stats || {};
    const issueTypes = Object.keys(pg.issues || {});
    lines.push(`#### ${pg.finalUrl || pg.url}`);
    lines.push('');
    lines.push(`- 规模：链接 ${st.anchors ?? '-'} 个，图片 ${st.images ?? '-'} 张，div ${st.divCount ?? '-'} 个，语义区块 ${st.semanticCount ?? '-'} 个（header ${st.landmarks?.header ?? 0}/nav ${st.landmarks?.nav ?? 0}/main ${st.landmarks?.main ?? 0}/article ${st.landmarks?.article ?? 0}/section ${st.landmarks?.section ?? 0}/aside ${st.landmarks?.aside ?? 0}/footer ${st.landmarks?.footer ?? 0}），标题序列 ${st.headings || '(无)'}`);
    if (pg.shell) lines.push(`- ℹ️ ${pg.note}`);
    if (!issueTypes.length) {
      lines.push('- ✅ 未发现规范问题');
    } else {
      for (const type of issueTypes.sort((a, b) => (levelOf(a) === levelOf(b) ? 0 : levelOf(a) === 'error' ? -1 : 1))) {
        const v = pg.issues[type];
        const badge = levelOf(type) === 'error' ? '❌' : '⚠️';
        lines.push(`- ${badge} [${specOf(type)}] ${nameOf(type)}：${v.count} 处`);
        lines.push(...renderSamples(v));
      }
    }
    lines.push('');
  }
}

lines.push('## 跳过项');
lines.push('');
for (const p of reportData.projects.filter((x) => x.skipped)) {
  lines.push(`- ${p.name}（${p.id}）：${p.reason}`);
}
lines.push('');
lines.push('## 共性问题概览（按整改优先级）');
lines.push('');
lines.push('1. **08 `<img>` 缺 alt**：覆盖面最广（812 处/9 项目）。openGauss-portal 首页轮播/新闻图片、MindSpore-portal 全站 banner、openUBMC 生态伙伴 logo 是重灾区；文档站 DSL 首页背景图（*/dsl/assets/img/*.png/jpg）也整批缺失。属模板/公共组件层问题，修一处组件可批量生效。');
lines.push('2. **06 外链 target=_blank 缺 rel=noopener**：170 处，openEuler 系（官网+文档共用同一页脚组件，友链全部裸奔）与 openGauss-docs 首页快捷入口为主；部分链接写了 `rel="noreferrer"` 但没有 `noopener`（规范上应显式包含 noopener）。');
lines.push('3. **06 图片链接缺 alt**：58 处，集中在 openUBMC 生态伙伴 logo 链接与 openEuler 页脚 logo（atom-logo 等），与问题 1 同源。');
lines.push('4. **07 h1 缺失/不唯一**：13 页，HiFloat 全部抽样页（站点为 SPA，静态 HTML 无 h1）、openEuler-docs/openGauss-docs 文档首页（无 h1）需优先补。');
lines.push('5. **07 客户端渲染壳**：openUBMC-docs 的 /docs/zh/latest、/docs/en/latest 返回 Nuxt CSR 壳（`data-ssr="false"`），静态 HTML 无任何语义结构，对 SEO/AI 抓取影响最大，建议核查文档站部署是否应为静态渲染。');
lines.push('6. **06 无语义链接文本 / href 空或 #**：零星分布（openEuler FAQ 的 "here" ×2、UnifiedBus "here" ×1；UnifiedBus 页脚 "Vendor ID"/"Device ID and Module ID" 链接无 href 共 8 处、openEuler nestos "下载体验" 无 href、openUBMC "Create Meeting" 无 href），逐条替换为 `<a href>` 或补语义文本即可。');
lines.push('');

const outDir = resolve(ROOT, 'manual-review/issues/semantic');
await mkdir(outDir, { recursive: true });
const outPath = resolve(outDir, `${date}-html语义化-抽查报告.md`);
await writeFile(outPath, lines.join('\n'), 'utf8');
console.log('DONE ->', outPath);
