import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText } from '../lib/http.mjs';
import { parseSitemap } from '../lib/sitemap.mjs';
import { writeStats, now } from '../lib/report.mjs';
import { hasToken, parseOwnerRepo, findIssuesByTitlePrefix, createIssue } from '../lib/atomgit.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

const rules = JSON.parse(await readFile(resolve(ROOT, 'scripts/config/check-rules.json'), 'utf8'));
const BAD_LINK_TEXT = new Set(rules.badLinkTextBlacklist.map((t) => t.toLowerCase()));
const BAD_ALT = new Set(rules.badAltBlacklist.map((t) => t.toLowerCase()));

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// 提 issue 模式：扫描每个项目前先查目标 AtomGit 仓库是否已有本维度未关闭 issue（标题前缀匹配），
// 有则跳过该项目整个"扫描+提单"流程；有发现时生成简短/完全两份 md 报告，
// issue 正文用简短版并附指向本仓库完全版报告的链接。前缀变更会使旧 issue 查重失效。
const ISSUE_TITLE_PREFIX = '[GEO HTML Semantic]';
const submitIssues = process.argv.includes('--submit-issues');
const dryRun = process.argv.includes('--dry-run');
const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;
// MindSpore-docs 按要求默认跳过；--skip= 传空可强制检查
const skipArg = process.argv.find((a) => a.startsWith('--skip='));
const SKIPS = skipArg ? skipArg.split('=')[1].split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : ['mindspore-docs'];

const DOC_HOME_PAGES = {
  'openEuler-docs': [['/zh/', '文档首页 /zh/'], ['/en/', '文档首页 /en/']],
  'openGauss-docs': [['/zh/', '文档首页 /zh/'], ['/en/', '文档首页 /en/']],
  'openUBMC-docs': [['/zh/latest', '文档首页 /docs/zh/latest'], ['/en/latest', '文档首页 /docs/en/latest']],
};
const SAMPLE_CAP = 4;
const LANGS = new Set(['zh', 'en', 'ja', 'ko', 'fr', 'es', 'de', 'ru', 'pt', 'hi', 'zh-cn', 'zh-tw']);
const SKIP_SECTION = /^(docs|versiondocs|tag|tags|category|categories|search|archives?)$/i;

const SECTIONING = ['article', 'aside', 'main', 'section'];

const ISSUE_META = {
  's.header.missing': { spec: '10', group: 'header/footer', name: '缺顶层 `<header>`（banner）', level: 'error' },
  's.header.duplicate': { spec: '10', group: 'header/footer', name: '多个同时可见的顶层 `<header>`', level: 'error' },
  's.footer.missing': { spec: '10', group: 'header/footer', name: '缺顶层 `<footer>`（contentinfo）', level: 'error' },
  's.footer.duplicate': { spec: '10', group: 'header/footer', name: '多个同时可见的顶层 `<footer>`', level: 'error' },
  's.hf.nesting': { spec: '10', group: 'header/footer', name: '`<header>`/`<footer>` 互为祖先/后代（自嵌套）', level: 'error' },
  's.main.missing': { spec: '10', group: 'main', name: '缺 `<main>`', level: 'error' },
  's.main.duplicate': { spec: '10', group: 'main', name: '多个同时可见的 `<main>`', level: 'error' },
  's.main.nesting': { spec: '10', group: 'main', name: '`<main>` 嵌套 `<main>`（自嵌套）', level: 'error' },
  's.h1.missing': { spec: '10', group: 'h1~h6', name: '缺 `<h1>` 或 `<h1>` 内无可见文本', level: 'error' },
  's.h1.duplicate': { spec: '10', group: 'h1~h6', name: '多个 `<h1>`', level: 'error' },
  's.heading.skip': { spec: '10', group: 'h1~h6', name: '标题层级跳级', level: 'error' },
  's.heading.nesting': { spec: '10', group: 'h1~h6', name: '标题标签嵌套标题标签（自嵌套）', level: 'error' },
  'i.noAlt': { spec: '10', group: 'img', name: '`<img>` 不存在 alt 属性', level: 'error' },
  'a.noHref': { spec: '10', group: 'a', name: '`<a>` 不存在 href 属性', level: 'error' },
  'a.noText': { spec: '10', group: 'a', name: '`<a>` 内无可见文本（或仅含无 alt 的 `<img>`）', level: 'error' },
  'a.jsHref': { spec: '10', group: 'a', name: 'href 使用 `javascript:` 协议', level: 'error' },
  'a.badHref': { spec: '10', group: 'a', name: 'href 为空，非合法 URL', level: 'error' },
  'a.badText': { spec: '06', group: '附加', name: '无语义链接文本', level: 'error' },
  'a.placeholder': { spec: '06', group: '附加', name: 'href 为 `#` 占位', level: 'error' },
  'a.extNoRel': { spec: '06', group: '附加', name: '外链 target=_blank 缺 rel=noopener', level: 'error' },
  'a.brokenAnchor': { spec: '06', group: '附加', name: '锚点指向不存在的 id', level: 'warn' },
  's.noNav': { spec: '07', group: '附加', name: '缺 `<nav>` 区块', level: 'warn' },
  's.clientShell': { spec: '07', group: '附加', name: '页面为客户端渲染壳，静态 HTML 无实质内容', level: 'error' },
  'i.badAlt': { spec: '08', group: '附加', name: '无意义 alt 文本', level: 'error' },
  'i.longAlt': { spec: '08', group: '附加', name: 'alt 超过 125 字符', level: 'warn' },
  'i.dupAlt': { spec: '08', group: '附加', name: '同页 alt 大量重复', level: 'warn' },
};
const GROUP_ORDER = ['header/footer', 'main', 'h1~h6', 'img', 'a', '附加'];

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const BLOCK_CLOSES_P = new Set(['address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul']);
const AFTER_RULES = {
  li: new Set(['li']),
  dd: new Set(['dd', 'dt']),
  dt: new Set(['dd', 'dt']),
  td: new Set(['td', 'th']),
  th: new Set(['td', 'th']),
  tr: new Set(['tr', 'tbody', 'tfoot', 'thead']),
  tbody: new Set(['tbody', 'tfoot']),
  tfoot: new Set(['tbody']),
  option: new Set(['option', 'optgroup']),
  optgroup: new Set(['optgroup']),
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

function parseTree(html) {
  const root = { tag: '#root', attrs: {}, children: [], parent: null, contentStart: 0, end: html.length };
  const stack = [root];
  const nodes = [];
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9:._-]*)((?:"[^"]*"|'[^']*'|[^>])*)>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const closing = m[1] === '/';
    const tag = m[2].toLowerCase();
    if (tag === 'html' || tag === 'head' || tag === 'body') continue;
    if (closing) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) {
          for (let k = stack.length - 1; k >= i; k--) stack[k].end = m.index;
          stack.length = i;
          break;
        }
      }
      continue;
    }
    let top = stack[stack.length - 1];
    if (top.tag === 'p' && BLOCK_CLOSES_P.has(tag)) { top.end = m.index; stack.pop(); top = stack[stack.length - 1]; }
    const rule = AFTER_RULES[tag];
    if (rule && rule.has(top.tag)) { top.end = m.index; stack.pop(); top = stack[stack.length - 1]; }
    const selfClose = VOID_TAGS.has(tag) || /\/\s*$/.test(m[3]);
    const node = { tag, attrs: parseAttrs(m[3]), children: [], parent: top, contentStart: m.index + m[0].length, end: html.length };
    top.children.push(node);
    nodes.push(node);
    if (!selfClose) stack.push(node);
  }
  return nodes;
}

function collectIds(html) {
  const ids = new Set();
  const re = /\bid\s*=\s*(?:"([^"]+)"|'([^']+)')/gi;
  let m;
  while ((m = re.exec(html)) !== null) ids.add(m[1] ?? m[2]);
  return ids;
}

function isDescendantOf(node, tags) {
  let p = node.parent;
  while (p) {
    if (tags.includes(p.tag)) return true;
    p = p.parent;
  }
  return false;
}

function isVisible(node) {
  let n = node;
  while (n && n.tag !== '#root') {
    const a = n.attrs;
    const ah = a['aria-hidden'];
    if (ah !== undefined && String(ah).toLowerCase() !== 'false') return false;
    if ('hidden' in a) return false;
    if (/display\s*:\s*none/i.test(a.style || '')) return false;
    n = n.parent;
  }
  return true;
}

function descendantsOf(node, tag) {
  const out = [];
  const stack = [...node.children];
  while (stack.length) {
    const n = stack.pop();
    if (n.tag === tag) out.push(n);
    stack.push(...n.children);
  }
  return out;
}

function classesOf(node) {
  const c = String(node.attrs.class || '').trim();
  return c ? trunc(c.split(/\s+/).slice(0, 3).join('.'), 60) : '(无class)';
}

function checkPage(rawHtml, pageUrl) {
  const html = toContentHtml(rawHtml);
  const nodes = parseTree(html);
  const textOf = (n) => stripTags(html.slice(n.contentStart, n.end));
  const issues = {};
  const push = (type, item) => {
    (issues[type] ||= { count: 0, samples: [] });
    issues[type].count += 1;
    if (issues[type].samples.length < 10) issues[type].samples.push(item);
  };

  const origin = new URL(pageUrl).origin;

  for (const t of ['header', 'footer']) {
    const key = t === 'header' ? 's.header' : 's.footer';
    const els = nodes.filter((n) => n.tag === t);
    const topEls = els.filter((n) => !isDescendantOf(n, [...SECTIONING, 'nav']));
    if (topEls.length === 0) {
      push(`${key}.missing`, { existing: els.length, note: els.length ? '现有元素均为 Sectioning Content/nav 的后代' : '' });
    }
    const vis = topEls.filter(isVisible);
    if (vis.length > 1) {
      push(`${key}.duplicate`, { visible: vis.length, classes: vis.slice(0, 5).map(classesOf).join(' / ') });
    }
  }
  for (const n of nodes.filter((x) => x.tag === 'header' || x.tag === 'footer')) {
    let p = n.parent;
    while (p && p.tag !== '#root') {
      if (p.tag === 'header' || p.tag === 'footer') {
        push('s.hf.nesting', { outer: p.tag, inner: n.tag, cls: classesOf(n) });
        break;
      }
      p = p.parent;
    }
  }

  const mains = nodes.filter((n) => n.tag === 'main');
  const visMains = mains.filter(isVisible);
  if (visMains.length === 0) push('s.main.missing', { existing: mains.length });
  else if (visMains.length > 1) push('s.main.duplicate', { visible: visMains.length, classes: visMains.slice(0, 5).map(classesOf).join(' / ') });
  for (const n of mains) {
    if (isDescendantOf(n, ['main'])) push('s.main.nesting', { cls: classesOf(n) });
  }

  const heads = nodes.filter((n) => /^h[1-6]$/.test(n.tag));
  const h1s = heads.filter((n) => n.tag === 'h1' && isVisible(n));
  if (h1s.length === 0) {
    push('s.h1.missing', { existingH1: heads.filter((n) => n.tag === 'h1').length, note: '静态 HTML 无可见的 <h1>' });
  } else if (h1s.every((n) => textOf(n) === '')) {
    push('s.h1.missing', { h1: h1s.length, note: '<h1> 存在但内无可见文本' });
  }
  if (h1s.length > 1) push('s.h1.duplicate', { h1: h1s.length, texts: h1s.slice(0, 5).map((n) => trunc(textOf(n), 60)) });
  for (let i = 1; i < heads.length; i++) {
    const prev = Number(heads[i - 1].tag[1]);
    const cur = Number(heads[i].tag[1]);
    if (cur > prev + 1) push('s.heading.skip', { from: `h${prev}`, to: `h${cur}`, text: trunc(textOf(heads[i]), 60) });
  }
  for (const n of heads) {
    if (isDescendantOf(n, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])) {
      push('s.heading.nesting', { inner: n.tag, text: trunc(textOf(n), 60) });
    }
  }

  const imgs = nodes.filter((n) => n.tag === 'img');
  const altCounts = new Map();
  for (const img of imgs) {
    const alt = img.attrs.alt;
    if (alt === undefined) push('i.noAlt', { src: trunc(img.attrs.src || '(无src)', 100) });
    else {
      if (alt !== '' && BAD_ALT.has(String(alt).trim().toLowerCase())) push('i.badAlt', { alt: trunc(alt, 60), src: trunc(img.attrs.src || '', 80) });
      if (String(alt).length > 125) push('i.longAlt', { alt: trunc(alt, 140) });
      if (alt) altCounts.set(alt, (altCounts.get(alt) || 0) + 1);
    }
  }
  for (const [alt, n] of altCounts) {
    if (n >= 3) push('i.dupAlt', { alt: trunc(alt, 60), count: n });
  }

  const anchors = nodes.filter((n) => n.tag === 'a');
  const ids = collectIds(html);
  for (const a of anchors) {
    const hrefRaw = a.attrs.href;
    const href = hrefRaw === undefined ? '' : String(hrefRaw).trim();
    const text = textOf(a);
    if (hrefRaw === undefined) {
      push('a.noHref', { text: trunc(text, 40), cls: classesOf(a) });
    } else {
      if (text && BAD_LINK_TEXT.has(text.toLowerCase())) push('a.badText', { text: trunc(text, 40), href: trunc(href, 90) });
      if (href === '') push('a.badHref', { text: trunc(text, 40) });
      else if (/^javascript:/i.test(href)) push('a.jsHref', { text: trunc(text, 40), href: trunc(href, 90) });
      else if (href === '#' || href === '#!' || href === '####') push('a.placeholder', { text: trunc(text, 40), cls: classesOf(a) });
      else if (href.startsWith('#') && href !== '#top') {
        const frag = decodeURIComponent(href.slice(1));
        if (frag && !ids.has(frag)) push('a.brokenAnchor', { href: trunc(href, 90) });
      }
      if (/^https?:\/\//i.test(href)) {
        let external = false;
        try { external = new URL(href).origin !== origin; } catch { external = true; }
        if (external && a.attrs.target === '_blank' && !/noopener/i.test(String(a.attrs.rel || ''))) {
          push('a.extNoRel', { text: trunc(text, 40), href: trunc(href, 90), rel: a.attrs.rel || '(无)' });
        }
      }
    }
    if (text === '') {
      const innerImgs = descendantsOf(a, 'img');
      if (innerImgs.length === 0 || innerImgs.some((im) => im.attrs.alt === undefined)) {
        push('a.noText', { href: trunc(hrefRaw === undefined ? '(无href)' : href, 90), cls: classesOf(a) });
      }
    }
  }

  const landmarks = {};
  for (const tag of ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer']) {
    landmarks[tag] = nodes.filter((n) => n.tag === tag).length;
  }
  if (!landmarks.nav) push('s.noNav', {});

  const divCount = nodes.filter((n) => n.tag === 'div').length;
  const semanticCount = Object.values(landmarks).reduce((a, b) => a + b, 0);
  return {
    issues,
    stats: {
      anchors: anchors.length,
      images: imgs.length,
      headings: heads.map((h) => h.tag).join(','),
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
  const raw = await fetchXml(project.sitemapUrl);
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
    const i = LANGS.has(segs[0].toLowerCase()) ? 1 : 0;
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

// ---- 报告渲染 ----
function levelOf(type) { return ISSUE_META[type]?.level || 'warn'; }
function specOf(type) { return ISSUE_META[type]?.spec || '10'; }
function groupOf(type) { return ISSUE_META[type]?.group || '附加'; }
function nameOf(type) { return ISSUE_META[type]?.name || type; }
function isCore(type) { return specOf(type) === '10'; }
function esc(s) {
  return String(s ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function renderSamples(iss, cap = 10) {
  const rows = [];
  for (const s of iss.samples.slice(0, cap)) {
    const parts = Object.entries(s)
      .filter(([, v]) => v !== '' && v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${esc(Array.isArray(v) ? v.join(' / ') : v)}`);
    rows.push(`    - ${parts.join('，') || '(无详情)'}`);
  }
  return rows;
}

function sortTypes(types) {
  return types.sort((a, b) => {
    const ga = GROUP_ORDER.indexOf(groupOf(a));
    const gb = GROUP_ORDER.indexOf(groupOf(b));
    if (ga !== gb) return ga - gb;
    if (levelOf(a) !== levelOf(b)) return levelOf(a) === 'error' ? -1 : 1;
    return a.localeCompare(b);
  });
}

const COMMON_HEADER = [
  '- 规范来源：**measures/10-HTML-semantic-check/规范.md「检查细节」**（header/footer/main/h1~h6/img alt/a 的缺失·重复·层级结构判定）；06/07/08 未覆盖项（黑名单文本、外链 noopener、失效锚点、alt 质量等）为附加项',
  `检查抽样范围：门户类 = 首页（meta-refresh 跟随）+ 至多 ${SAMPLE_CAP} 个 sitemap 栏目页；文档类 = /zh/、/en/ 文档首页`,
  '- 解析口径：线上静态/SSR HTML 剔除 `<script>`/`<style>`/注释/`<noscript>` 后构建元素树；不含 JS 运行时插入的 DOM',
  '- 可见性判定：仅能静态识别 `aria-hidden`（值非 false）、`hidden`、行内 `style="display:none"`；class/媒体查询控制的显隐无法判定，「多个同时可见」存在误报可能，请打开页面复核',
  '- 顶层判定：`<header>`/`<footer>` 非 Sectioning Content（article/aside/main/section）或 `<nav>` 的后代即顶层候选',
];

function pageDetailLines(pg) {
  const out = [];
  if (!pg.accessible) {
    out.push(`- ❌ ${pg.url}：不可访问（HTTP ${pg.status}），未纳入统计`);
    out.push('');
    return out;
  }
  const st = pg.stats || {};
  out.push(`#### ${pg.finalUrl || pg.url}`);
  out.push('');
  out.push(`- 规模：链接 ${st.anchors ?? '-'} 个，图片 ${st.images ?? '-'} 张，div ${st.divCount ?? '-'} 个，语义区块 ${st.semanticCount ?? '-'} 个（header ${st.landmarks?.header ?? 0}/nav ${st.landmarks?.nav ?? 0}/main ${st.landmarks?.main ?? 0}/article ${st.landmarks?.article ?? 0}/section ${st.landmarks?.section ?? 0}/aside ${st.landmarks?.aside ?? 0}/footer ${st.landmarks?.footer ?? 0}），标题序列 ${esc(st.headings || '(无)')}`);
  if (pg.shell) out.push(`- ℹ️ ${pg.note}`);
  const issueTypes = sortTypes(Object.keys(pg.issues || {}));
  if (!issueTypes.length) {
    out.push('- ✅ 未发现规范问题');
  } else {
    for (const type of issueTypes) {
      const v = pg.issues[type];
      const badge = levelOf(type) === 'error' ? '❌' : '⚠️';
      out.push(`- ${badge} [${specOf(type)}·${groupOf(type)}] ${nameOf(type)}：${v.count} 处`);
      out.push(...renderSamples(v));
    }
  }
  out.push('');
  return out;
}

function summarize(p) {
  let coreErr = 0, extraErr = 0, warn = 0, inaccessible = 0;
  for (const pg of p.pages) {
    if (!pg.accessible) { inaccessible++; continue; }
    for (const [type, v] of Object.entries(pg.issues || {})) {
      if (levelOf(type) === 'warn') warn += v.count;
      else if (isCore(type)) coreErr += v.count;
      else extraErr += v.count;
    }
  }
  const verdict = p.pages.length === inaccessible ? '❌ 页面不可访问' : inaccessible ? '❌' : coreErr || extraErr ? '❌' : warn ? '⚠️' : '✅';
  return { coreErr, extraErr, warn, inaccessible, verdict };
}

function overviewTable(p, s) {
  return [
    `### ${p.name}（${p.id}） — ${s.verdict}`,
    '',
    '| 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 |',
    '| --- | --- | --- | --- | --- |',
    `| ${p.pages.length} | ${s.coreErr} | ${s.extraErr} | ${s.warn} | ${s.inaccessible} |`,
  ];
}

function perTypeLines(p) {
  const agg = new Map();
  for (const pg of p.pages) {
    for (const [type, v] of Object.entries(pg.issues || {})) {
      const t = agg.get(type) || { count: 0, pages: new Set() };
      t.count += v.count;
      t.pages.add(pg.finalUrl || pg.url);
      agg.set(type, t);
    }
  }
  const out = [];
  for (const type of sortTypes([...agg.keys()])) {
    const t = agg.get(type);
    out.push('');
    out.push(`**${nameOf(type)}**（[${specOf(type)}·${groupOf(type)}] ${levelOf(type) === 'error' ? '❌' : '⚠️'}）：${t.count} 处，涉及 ${t.pages.size} 个页面`);
    for (const u of [...t.pages].slice(0, 5)) out.push(`- ${u}`);
    if (t.pages.size > 5) out.push(`- …其余 ${t.pages.size - 5} 个页面见完全版报告`);
  }
  return out;
}

function fullReportFor(p, s, startedAt) {
  const out = [];
  out.push(`# HTML 语义化检查完全版报告 · ${p.name}（${p.id}）`);
  out.push('');
  out.push(`- 检查时间：${startedAt}`);
  out.push(...COMMON_HEADER);
  out.push('');
  out.push(...overviewTable(p, s));
  out.push('');
  out.push('## 抽查页面');
  out.push('');
  for (const pg of p.pages) {
    const arrow = pg.finalUrl && pg.finalUrl !== pg.url ? ` → ${pg.finalUrl}` : '';
    out.push(`- ${pg.url}${arrow}（HTTP ${pg.status}${pg.accessible ? ' ✅' : ' ❌'}）`);
  }
  out.push('');
  out.push('## 逐页明细');
  out.push('');
  for (const pg of p.pages) out.push(...pageDetailLines(pg));
  return out.join('\n') + '\n';
}

function briefReportFor(p, s, startedAt) {
  const out = [];
  out.push(`# HTML 语义化检查简短报告 · ${p.name}（${p.id}）`);
  out.push('');
  out.push(`- 检查时间：${startedAt}`);
  out.push(...COMMON_HEADER);
  out.push('');
  out.push(...overviewTable(p, s));
  out.push('');
  out.push('## 问题分类摘要（每类最多列 5 个页面）');
  out.push('');
  out.push(...perTypeLines(p));
  out.push('');
  return out.join('\n') + '\n';
}

function issueBodyFor(p, s, fullFileName, startedAt) {
  const ghRepo = process.env.GITHUB_REPOSITORY || 'opensourceways/daily-check-workflow';
  const refName = process.env.GITHUB_REF_NAME || 'archive';
  const fullUrl = `https://github.com/${ghRepo}/blob/${refName}/scheduled-reports/semantic/${dateStr}/${fullFileName}`;
  const lines = [];
  lines.push(`本 issue 由 GEO 例行检查（HTML 元素语义化维度）自动生成。按 measures/10-HTML-semantic-check/规范.md「检查细节」对项目抽样页面（${p.pages.length} 个）的静态/SSR HTML 检查，发现以下问题（${startedAt.slice(0, 10)}）：`);
  lines.push('');
  lines.push(`**项目**：${p.name}（${p.id}）`);
  lines.push('');
  lines.push(`**规模**：检查细节(10) 问题 ${s.coreErr} 处；附加项(06/07/08) 问题 ${s.extraErr} 处；建议项 ${s.warn} 处`);
  lines.push('');
  lines.push('## 问题分类摘要');
  lines.push('');
  lines.push(...perTypeLines(p));
  lines.push('');
  lines.push('## 抽查页面');
  lines.push('');
  for (const pg of p.pages) {
    const arrow = pg.finalUrl && pg.finalUrl !== pg.url ? ` → ${pg.finalUrl}` : '';
    lines.push(`- ${pg.url}${arrow}（HTTP ${pg.status}${pg.accessible ? ' ✅' : ' ❌'}）`);
  }
  lines.push('');
  lines.push('### 完全版报告');
  lines.push('');
  lines.push('每页逐项问题与样例（含 src/href/class 定位信息）见检查仓库内的完全版报告：');
  lines.push('');
  lines.push(`> [${fullFileName}](${fullUrl})`);
  lines.push('');
  lines.push('### 检查口径说明');
  lines.push('');
  lines.push(...COMMON_HEADER.map((l) => l.replace('检查抽样范围：', '抽样范围：')));
  lines.push('');
  lines.push('### 处理说明');
  lines.push('');
  lines.push('- 修复后（补齐 alt/href/h1、消除自嵌套与多份可见的 header/footer/main、标题不跳级等）合并 PR 并关闭本 issue');
  lines.push('- issue 未关闭期间不会重复扫描该项目，也不会重复提单；关闭后下一轮定时检查会重新扫描');
  lines.push('- 「多个同时可见的顶层 header/footer/main」由桌面/移动双份 DOM 触发的属已知误报场景（class/媒体查询控制的显隐无法静态判定），请在 issue 评论说明后由维护者关闭，或在双份元素上补 `aria-hidden`（隐藏份）/保持单份');
  lines.push('- 其余误报（如 SPA 首屏壳属预期设计）同样请评论说明后关闭');
  lines.push('');
  lines.push('<sub>由 daily-check-workflow HTML 语义化检查（scripts/checks/semantic-spec-check.mjs）自动生成。</sub>');
  return lines.join('\n');
}

// 扫描前查重：已有本维度未关闭 issue 则跳过整个"扫描+提单"；
// 查询失败时有 token（生产）直接跳过（宁漏勿重），无 token（本地）只扫描不提单。
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
    return { block: true, canSubmit: false, notes: [`已存在未关闭的 HTML 语义化 issue（#${existing[0].number}：${urls}），跳过本次扫描与提单`] };
  }
  if (!hasToken()) {
    return { block: false, canSubmit: false, notes: ['未设置 ATOMGIT_TOKEN，本次查重通过但不提单'] };
  }
  return { block: false, canSubmit: true, notes: [] };
}

const startedAt = now();
const dateStr = startedAt.slice(0, 10);
const OUT_DIR = resolve(ROOT, 'scheduled-reports/semantic', dateStr);
await mkdir(OUT_DIR, { recursive: true });

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);
const reportData = {
  timestamp: startedAt,
  measure: 'html-semantics-spec-check',
  spec: 'measures/10-HTML-semantic-check/规范.md（检查细节）+ 06/07/08 附加项',
  mode: submitIssues ? (dryRun ? 'submit-issues-dry-run' : 'submit-issues') : 'scan',
  projects: [],
};

for (const project of targets) {
  if (SKIPS.includes(project.id.toLowerCase())) {
    reportData.projects.push({ id: project.id, name: project.name, skipped: true, reason: '默认跳过（MindSpore-docs 本次不检查；用 --skip= 传空可强制检查）' });
    console.log(`[skip] ${project.id}`);
    continue;
  }
  let pre;
  if (submitIssues) {
    pre = await precheckExistingIssue(project);
    pre.notes.forEach((n) => console.log(`[semantic] ${project.id}: ${n}`));
    if (pre.block) {
      reportData.projects.push({ id: project.id, name: project.name, domain: project.domain, repo: project.repo, blocked: true, notes: pre.notes, pages: [] });
      continue;
    }
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
  const pEntry = { id: project.id, name: project.name, domain: project.domain, repo: project.repo, pages: pageResults, aggregate };
  reportData.projects.push(pEntry);

  if (submitIssues) {
    const s = summarize(pEntry);
    const errorTotal = s.coreErr + s.extraErr;
    if (errorTotal > 0) {
      const fullFileName = `${project.id}-full.md`;
      const briefFileName = `${project.id}-brief.md`;
      if (!dryRun) {
        await writeFile(resolve(OUT_DIR, fullFileName), fullReportFor(pEntry, s, startedAt), 'utf8');
        await writeFile(resolve(OUT_DIR, briefFileName), briefReportFor(pEntry, s, startedAt), 'utf8');
        pEntry.reports = { full: `scheduled-reports/semantic/${dateStr}/${fullFileName}`, brief: `scheduled-reports/semantic/${dateStr}/${briefFileName}` };
      }
      const title = `${ISSUE_TITLE_PREFIX} ${project.name}（${project.id}）：抽样页面 HTML 语义化检查发现 ${errorTotal} 处规范问题`;
      const bodyText = issueBodyFor(pEntry, s, fullFileName, startedAt);
      const target = parseOwnerRepo(project.repo);
      if (dryRun || !target || !pre.canSubmit) {
        console.log(`\n[semantic] ${project.id} ${dryRun ? '[dry-run] ' : ''}将提交 issue：${title}`);
        console.log(bodyText);
        pEntry.issueAction = dryRun ? 'dry-run' : 'print-only';
      } else {
        const created = await createIssue({ ...target, title, body: bodyText });
        const url = created?.html_url || `https://atomgit.com/${target.owner}/${target.repo}/issues/${created?.number}`;
        console.log(`[semantic] ${project.id}: ✨ 已创建 issue：${url}`);
        pEntry.issueAction = 'created';
        pEntry.issueUrl = url;
      }
    } else {
      console.log(`[semantic] ${project.id}: 未发现必选级问题，不提 issue`);
    }
  }
  const total = Object.values(aggregate).reduce((a, b) => a + b.count, 0);
  console.log(`[${project.id}] pages=${pageResults.length} issues=${total}`);
}

await writeStats('semantic-spec-stats', reportData);

// ---- 汇总报告 ----
const lines = [];
lines.push('# HTML 元素语义化规范抽查报告');
lines.push('');
lines.push(`- 检查时间：${startedAt}`);
lines.push(`- 运行模式：${submitIssues ? `提 issue（--submit-issues${dryRun ? '，dry-run' : ''}）` : '常规检查'}`);
if (siteId) lines.push(`- 指定项目：--site=${siteId}`);
lines.push(...COMMON_HEADER);
lines.push('- 判定：error 级为规范/附加必选项违规（❌），warn 级为建议项（⚠️）；客户端渲染壳页面记附加项，不做元素级检查；有 error 级问题即触发提 issue');
lines.push('');

const overviews = [];
for (const p of reportData.projects) {
  if (p.skipped || p.blocked) continue;
  const s = summarize(p);
  overviews.push({ p, ...s });
}

lines.push('## 总览');
lines.push('');
lines.push('| 项目 | 抽查页面数 | 检查细节(10) | 附加项(06/07/08) | 其中 warn | 不可访问 | 结论 |');
lines.push('| --- | --- | --- | --- | --- | --- | --- |');
for (const o of overviews) {
  const tag = o.p.issueUrl ? `，[issue](${o.p.issueUrl})` : o.p.issueAction === 'dry-run' ? '（dry-run 未提交）' : o.p.issueAction === 'print-only' ? '（未提单：无 token 或查重降级）' : '';
  lines.push(`| ${o.p.name}（${o.p.id}） | ${o.p.pages.length} | ${o.coreErr} | ${o.extraErr} | ${o.warn} | ${o.inaccessible} | ${o.verdict}${tag} |`);
}
for (const p of reportData.projects.filter((x) => x.blocked)) {
  lines.push(`| ${p.name}（${p.id}） | - | - | - | - | - | ⏭️ 已有未关闭 issue，跳过 |`);
}
lines.push('');
lines.push('## 问题类型汇总');
lines.push('');
const typeAgg = new Map();
for (const o of overviews) {
  for (const pg of o.p.pages) {
    for (const [type, v] of Object.entries(pg.issues || {})) {
      const t = typeAgg.get(type) || { total: 0, projs: new Map() };
      t.total += v.count;
      t.projs.set(o.p.id, (t.projs.get(o.p.id) || 0) + v.count);
      typeAgg.set(type, t);
    }
  }
}
lines.push('| 组 | 来源 | 级别 | 问题类型 | 总次数 | 涉及项目（次数） |');
lines.push('| --- | --- | --- | --- | --- | --- |');
for (const type of sortTypes([...typeAgg.keys()])) {
  const t = typeAgg.get(type);
  const projStr = [...t.projs.entries()].sort((a, b) => b[1] - a[1]).map(([id, n]) => `${id}(${n})`).join('、');
  lines.push(`| ${groupOf(type)} | ${specOf(type)}${isCore(type) ? ' 检查细节' : ' 附加'} | ${levelOf(type) === 'error' ? '❌' : '⚠️'} | ${nameOf(type)} | ${t.total} | ${projStr} |`);
}
lines.push('');
lines.push('## 各项目明细');
if (submitIssues) {
  lines.push('');
  lines.push(`（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 \`<项目ID>-full.md\`）`);
  for (const o of overviews) {
    if (!o.p.reports && !o.p.issueAction) continue;
    lines.push(`- ${o.p.name}（${o.p.id}）：\`${o.p.reports ? o.p.reports.full : '（dry-run 未写文件）'}\`${o.p.issueUrl ? `，issue：${o.p.issueUrl}` : o.p.issueAction === 'dry-run' ? '，（dry-run 未提交）' : o.p.issueAction === 'print-only' ? '，（未提单：无 token 或查重降级）' : ''}`);
  }
} else {
  lines.push('');
  for (const o of overviews) {
    lines.push(`### ${o.p.name}（${o.p.id}） — ${o.verdict}`);
    lines.push('');
    lines.push('抽查页面：');
    lines.push('');
    for (const pg of o.p.pages) {
      const arrow = pg.finalUrl && pg.finalUrl !== pg.url ? ` → ${pg.finalUrl}` : '';
      lines.push(`- ${pg.url}${arrow}（HTTP ${pg.status}${pg.accessible ? ' ✅' : ' ❌'}）`);
    }
    lines.push('');
    for (const pg of o.p.pages) lines.push(...pageDetailLines(pg));
  }
}

lines.push('');
lines.push('## 跳过/查重拦截');
lines.push('');
const skipLike = reportData.projects.filter((x) => x.skipped || x.blocked);
if (!skipLike.length) lines.push('- 无');
for (const p of skipLike) {
  lines.push(`- ${p.name}（${p.id}）：${p.skipped ? p.reason : (p.notes || []).join('；')}`);
}
lines.push('');

const outPath = resolve(OUT_DIR, 'report.md');
await writeFile(outPath, lines.join('\n'), 'utf8');
console.log('DONE ->', outPath);
