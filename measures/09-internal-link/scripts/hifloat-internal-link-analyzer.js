/*
 * HiFloat Portal — 站内内链分析器（Nuxt 4 适配版）
 *
 * 与 VitePress 版（openEuler-portal）的核心差异：
 *   1. 页面来源不同：Nuxt 文件路由 app/pages 下的 .vue（静态页）+ @nuxt/content 的
 *      app/content/{zh,en} 下的 .md（news/blogs/events 详情页，挂在 [...slug].vue 动态路由下）。
 *   2. 无线上列表 API：列表→详情的动态内链来自 CMS 导出 JSON（app/content/cms/export 下的
 *      news.json 等），由视图组件 import 后 v-for 渲染（item.link / item.link_zh 字段），本地静态可提取。
 *   3. 链接常量集中在 app/config/*.ts（CONFIG 对象 / LIVE 等），组件用 :href="CONFIG.X" 引用，
 *      需解析常量值并展开 ${locale} 模板。
 *   4. 全局布局组件由 app/layouts/default.vue 注入（AppHeader/AppFooter），单独归为全局导航，
 *      不注入每页出边。
 *   5. Nuxt 自动导入组件（app/components 下的 ContentWrapper/AppEmpty/AppHeaderSearch 等）
 *      不在 import 链上，需按模板标签名匹配组件注册表后补扫。
 *   6. /docs 是同域独立文档站（GEO 内链但非本仓页面），/pdf 是 public 静态资源，单独归类。
 *
 * 用法:  node scripts/internal-link-analyzer.js
 * 前置:  pnpm merge（拉取 app/content 内容，gitignore 产物）
 * 产物:  internal-link-report.html（仓库根目录，自包含，浏览器直接打开）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'app');
const PAGES_DIR = path.join(APP, 'pages');
const CONTENT_DIR = path.join(APP, 'content');
const COMPONENTS_DIR = path.join(APP, 'components');
const CONFIG_DIR = path.join(APP, 'config');

const LOCALES = ['zh', 'en'];
const INTERNAL_DOMAINS = ['hifloat.gccorg.com'];
const OUTPUT_HTML = path.join(ROOT, 'internal-link-report.html');

// 全局布局组件：由 app/layouts/default.vue 注入到所有页面（AppHeader/AppFooter）。
// 其链接单独归为「全局导航」，不注入每页出边（避免内链密度指标失真）。
// AppHeaderSearch 由 AppHeader 模板自动导入，脚本经组件注册表补扫。
const GLOBAL_LAYOUT_COMPONENTS = [
  path.join(COMPONENTS_DIR, 'AppHeader.vue'),
  path.join(COMPONENTS_DIR, 'AppFooter.vue'),
];

// 组件递归扫描深度上限
const MAX_COMPONENT_DEPTH = 6;

/* ------------------------------------------------------------------ */
/* 基础工具                                                             */
/* ------------------------------------------------------------------ */
function readText(p) {
  try {
    return fs.readFileSync(p, 'utf-8');
  } catch (_e) {
    return '';
  }
}

function walkDir(dir, filter, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.nuxt' || entry.name === '.output') continue;
      walkDir(full, filter, out);
    } else if (entry.isFile() && filter(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const isVue = (n) => n.toLowerCase().endsWith('.vue');
const isMd = (n) => n.toLowerCase().endsWith('.md');

/* ------------------------------------------------------------------ */
/* 1. 页面收集：Nuxt 文件路由 + @nuxt/content 内容页                     */
/* ------------------------------------------------------------------ */

// app/pages/**/*.vue → 路由路径
//   pages/zh/index.vue            → /zh
//   pages/zh/news/index.vue       → /zh/news
//   pages/zh/news/[...slug].vue   → 动态路由模板（记录，不作为页面）
//   pages/index.vue               → 根重定向（definePageMeta redirect，排除）
function vueFileToPagePath(absPath) {
  let rel = path.relative(PAGES_DIR, absPath).replace(/\\/g, '/');
  rel = rel.replace(/\.vue$/i, '');
  if (rel === 'index') return '/';
  // 动态段：[id] / [...slug] / [[slug]]
  rel = rel.replace(/\[\.\.\.[^\]]+\]/g, '*').replace(/\[[^\]]+\]/g, ':x');
  const isIndex = /\/index$/.test(rel);
  if (isIndex) rel = rel.replace(/\/index$/, '');
  let p = '/' + rel;
  if (p === '/') return p;
  // Nuxt generate 产物无尾斜杠（/zh/news 而非 /zh/news/），统一无尾斜杠、index 归一
  return p;
}

function isDynamicRouteTemplate(absPath) {
  const rel = path.relative(PAGES_DIR, absPath).replace(/\\/g, '/');
  return /\[[^\]]+\]/.test(rel);
}

// app/content/{locale}/**/*.md → /{locale}/{dir...}/{name}
//   content/zh/news/20260206.md → /zh/news/20260206
function mdFileToPagePath(absPath) {
  let rel = path.relative(CONTENT_DIR, absPath).replace(/\\/g, '/');
  rel = rel.replace(/\.md$/i, '');
  if (/(^|\/)index$/.test(rel)) rel = rel.replace(/(^|\/)index$/, '');
  let p = '/' + rel;
  if (!/^\/(zh|en)(\/|$)/.test(p)) p = '/zh' + (p === '/' ? '' : p); // 兜底：无 locale 前缀按 zh
  return p === '/zh/' ? '/zh' : p.replace(/\/$/, '');
}

/* ------------------------------------------------------------------ */
/* 2. 常量表：app/config/*.ts 的 CONFIG 对象 / 独立常量（LIVE 等）        */
/* ------------------------------------------------------------------ */

// 返回 { 'CONFIG.HIGH_FLOAT_8_WHITE_PAPER': '/docs/${locale.value}/...', LIVE: 'https://...' }
function buildConstantsMap() {
  const map = new Map();
  const files = walkDir(CONFIG_DIR, (n) => /\.(ts|js)$/.test(n));
  for (const f of files) {
    const content = readText(f);
    // export const X = { KEY: 'value', ... } —— 提取对象成员
    const objRe = /(?:export\s+)?const\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\{/g;
    let m;
    while ((m = objRe.exec(content)) !== null) {
      const objName = m[1];
      const start = m.index + m[0].length;
      // 从 { 开始做括号配平截取对象体
      let depth = 1, i = start;
      while (i < content.length && depth > 0) {
        if (content[i] === '{') depth++;
        else if (content[i] === '}') depth--;
        i++;
      }
      const body = content.slice(start, i - 1);
      const propRe = /([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/g;
      let pm;
      while ((pm = propRe.exec(body)) !== null) {
        const val = pm[2] ?? pm[3] ?? pm[4] ?? '';
        if (val) map.set(`${objName}.${pm[1]}`, val);
      }
    }
    // export const X = 'value'（标量常量，如 LIVE）
    const scalarRe = /(?:export\s+)?const\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)\s*;?/g;
    while ((m = scalarRe.exec(content)) !== null) {
      const val = m[2] ?? m[3] ?? m[4] ?? '';
      if (val && !map.has(m[1])) map.set(m[1], val);
    }
  }
  return map;
}

/* ------------------------------------------------------------------ */
/* 3. Nuxt 组件注册表（自动导入兜底）                                    */
/* ------------------------------------------------------------------ */

// Nuxt 自动导入 app/components/** 下组件（默认 pathPrefix）。
// 返回 { 组件名: 文件绝对路径 }，组件名含 basename 与路径前缀两种形式。
function buildComponentRegistry() {
  const registry = new Map();
  const files = walkDir(COMPONENTS_DIR, isVue);
  for (const f of files) {
    const rel = path.relative(COMPONENTS_DIR, f).replace(/\\/g, '/').replace(/\.vue$/i, '');
    const parts = rel.split('/');
    const basename = parts[parts.length - 1];
    registry.set(basename, f);
    // pathPrefix 形式：content/ContentDocRender → ContentDocRender（与 basename 相同时去重）
    const prefixed = parts.map((s) => s.replace(/(^|-)([a-z])/g, (_x, _a, b) => b.toUpperCase())).join('');
    if (!registry.has(prefixed)) registry.set(prefixed, f);
  }
  return registry;
}

function kebabToPascal(s) {
  return s.replace(/(^|-)([a-z])/g, (_x, _a, b) => b.toUpperCase());
}

/* ------------------------------------------------------------------ */
/* 4. 链接提取                                                          */
/* ------------------------------------------------------------------ */

// 清洗单条原始链接：去包裹引号/反引号、残留反引号
function cleanRawLink(raw) {
  let s = String(raw).trim();
  if ((s.startsWith('`') && s.endsWith('`')) || (s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  s = s.replace(/`/g, '');
  s = s.replace(/>+$/, '');
  return s;
}

// 静态链接候选判定：只接受 URL 形态的值。
// 过滤动态表达式（item.path / doc.href / prev._path / bread.href || bread.value 等，
// 其真实值由 CMS JSON 提取 / 环绕链接合成 / 对象字面量提取覆盖）与常量中的正则等非 URL 值。
function isStaticLinkCandidate(raw) {
  const s = String(raw);
  return /^(\/|\/\/|https?:|mailto:|tel:|javascript:|#|\$\{)/i.test(s);
}

// 提取 .md / .vue / .ts 文本中的原始链接（含 CONFIG.X / 常量标识符引用）
// pageLocale: 所属页面语言（'zh'/'en'），用于过滤 CONFIG.X_ZH / CONFIG.X_EN 按语言命中的常量
function extractRawLinks(content, constantsMap, pageLocale) {
  const links = [];
  const push = (v) => {
    const s = cleanRawLink(v);
    if (s && isStaticLinkCandidate(s)) links.push(s);
  };
  let m;
  // 0. 剔除 SEO head 链接对象（rel: canonical/alternate + hreflang）：
  //    hreflang 交替链接是双语站的结构性 SEO 元数据，非内容内链，混入会使每页获得虚假跨语言边
  content = content.replace(/\{[^{}]*\brel\s*:\s*['"](?:canonical|alternate)['"][^{}]*\}/g, '{}');
  // 1. Markdown 链接 [text](url) —— 跳过图片 ![alt](url)
  const mdLinkRe = /(^|[^!])\[(?:[^\]]*)\]\(([^)]+)\)/g;
  while ((m = mdLinkRe.exec(content)) !== null) {
    push(m[2].split(/\s+/)[0]);
  }
  // 2. HTML/模板属性 href="..." / to="..."（含 :href 动态绑定，捕获值为表达式）
  const hrefRe = /(?:href|to)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  while ((m = hrefRe.exec(content)) !== null) {
    push(m[1] ?? m[2] ?? '');
  }
  // 3. TS 对象属性 href/path/link/url: '...'（面包屑 breads、导航数据等）
  //    \b 前缀防止大小写不敏感下 url 匹配到 backUrl 等复合键的局部
  const objPropRe = /\b(?:href|path|link|link_zh|link_en|url|url_zh|url_en|join_url|content_url|replay_link)\s*:\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/gi;
  while ((m = objPropRe.exec(content)) !== null) {
    push(m[1] ?? m[2] ?? m[3] ?? '');
  }
  // 4. 编程式导航：router.push/go/replace、navigateTo、window.open、location.href
  const navRe = /(?:\.push|\.replace|\.go|navigateTo|window\.open|location\.href)\s*[(=]?\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/gi;
  while ((m = navRe.exec(content)) !== null) {
    push(m[1] ?? m[2] ?? m[3] ?? '');
  }
  // 5. 箭头函数/computed 返回的模板字符串（subscribeHref 等）
  const arrowRe = /=>\s*`([^`]+)`/g;
  while ((m = arrowRe.exec(content)) !== null) {
    push(m[1]);
  }
  // 5b. return `...`（以 / https:// ${ 开头，过滤非 URL 值）
  const returnRe = /return\s+`((?:\/[^`]*|https?:\/\/[^`]*|\$\{[^}]*\}\/[^`]*))`/g;
  while ((m = returnRe.exec(content)) !== null) {
    push(m[1]);
  }
  // 6. 裸 URL（markdown 正文 https://...，含 <https://...> 自动链接去尾 >）
  const bareRe = /(?:^|[\s(<"'])(https?:\/\/[^\s)<"'`>，。、；！？）】]+)/g;
  while ((m = bareRe.exec(content)) !== null) {
    push(m[1].replace(/[.,;:!?）】]+$/, ''));
  }
  // 7. CONFIG.X 常量引用（:href="CONFIG.HIGH_FLOAT_8_WHITE_PAPER"）
  //    仅接受 URL 形态的常量值；_ZH/_EN 后缀常量按页面语言过滤
  const cfgRe = /\b(CONFIG\.[A-Z_][A-Z0-9_]*)\b/g;
  while ((m = cfgRe.exec(content)) !== null) {
    const key = m[1];
    const langSuffix = key.match(/_(ZH|EN)$/);
    if (pageLocale && langSuffix && langSuffix[1].toLowerCase() !== pageLocale) continue;
    const val = constantsMap.get(key);
    if (val && isStaticLinkCandidate(val)) links.push(val);
  }
  // 8. 标量常量标识符引用（:href="LIVE"）—— 只在链接位置匹配
  const identRe = /(?:href|to)\s*=\s*"([A-Z][A-Z0-9_]*)"/g;
  while ((m = identRe.exec(content)) !== null) {
    const val = constantsMap.get(m[1]);
    if (val && isStaticLinkCandidate(val)) links.push(val);
  }
  return links;
}

// 从 .md frontmatter 提取字段（title / href 等）
function extractFrontmatter(content) {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return {};
  const fm = {};
  const fmRe = /^([a-z_]+):\s*(.+)$/gm;
  let m;
  while ((m = fmRe.exec(fmMatch[1])) !== null) {
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    fm[m[1]] = v;
  }
  return fm;
}

// CMS JSON 链接字段提取：递归遍历 JSON 树，收集 link 类字段的字符串值
const JSON_LINK_KEYS = /^(link|link_zh|link_en|url|url_zh|url_en|href|join_url|content_url|replay_link|apply_link|code_link|paper_link|model_link)$/i;
function extractJsonLinks(obj, acc) {
  if (Array.isArray(obj)) {
    for (const it of obj) extractJsonLinks(it, acc);
    return;
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && JSON_LINK_KEYS.test(k) && v.trim() && v !== '#') {
        acc.push(v.trim());
      } else {
        extractJsonLinks(v, acc);
      }
    }
  }
}

// 模板字符串展开：${locale}/${locale.value}/${lang}... → 所属页面语言的值；
// pageLocale 为空（全局布局组件）时展开 zh + en 两份（全局导航覆盖双语言页面）。
// 无法解析的 ${...}（运行时数据）→ 截断取前缀（v-for 动态链接交由 JSON 提取补充）。
function expandTemplateLinks(rawLinks, pageLocale) {
  const out = [];
  const LOCALE_RE = /\$\{[^}]*(?:locale|lang)[^}]*\}/gi;
  for (let l of rawLinks) {
    if (LOCALE_RE.test(l)) {
      LOCALE_RE.lastIndex = 0;
      const variants = pageLocale ? [pageLocale] : ['zh', 'en'];
      for (const v of variants) {
        const replaced = l.replace(LOCALE_RE, v);
        const idx = replaced.indexOf('${');
        if (idx >= 0) {
          const prefix = replaced.slice(0, idx);
          if (prefix && /[/?]/.test(prefix)) out.push(prefix);
        } else {
          out.push(replaced);
        }
      }
      continue;
    }
    // 残留运行时插值：截断到首个 ${ 之前（如 ?name=${addr...} → 保留前缀）
    const idx = l.indexOf('${');
    if (idx >= 0) {
      const prefix = l.slice(0, idx);
      if (prefix && /[/?]/.test(prefix)) out.push(prefix);
      continue;
    }
    out.push(l);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 5. import 解析 + 递归组件扫描                                         */
/* ------------------------------------------------------------------ */

function resolveImport(spec, fromFile) {
  if (spec.startsWith('~icons/') || spec.startsWith('virtual:')) return null;
  if (/^([a-z@][a-z0-9@/._-]*):/.test(spec) && !spec.startsWith('.')) return null; // 包内虚拟模块等
  let base = null;
  if (spec.startsWith('@/')) base = APP;
  else if (spec.startsWith('~/')) base = APP;
  else if (spec === '@' || spec === '~') base = APP;
  else if (spec.startsWith('.')) base = path.dirname(fromFile);
  else return null; // npm 包（vue/pinia/opendesign 等）
  const rel = spec.replace(/^(?:@|~)\//, '').replace(/\\/g, '/');
  const candidates = [
    path.join(base, rel),
    path.join(base, rel + '.vue'),
    path.join(base, rel + '.ts'),
    path.join(base, rel + '.tsx'),
    path.join(base, rel + '.js'),
    path.join(base, rel + '.mjs'),
    path.join(base, rel + '.json'),
    path.join(base, rel + '.svg'),
    path.join(base, rel, 'index.vue'),
    path.join(base, rel, 'index.ts'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

// 递归扫描组件/模块文件，收集静态链接 + 递归 import + 自动导入组件补扫
// ctx: { constantsMap, registry, pageLocale }（pageLocale 用于 CONFIG _ZH/_EN 过滤）
function scanFile(absPath, depth, visited, accLinks, ctx) {
  if (!absPath || visited.has(absPath)) return;
  visited.add(absPath);
  const { constantsMap, registry, pageLocale } = ctx;

  // JSON（CMS 导出数据）：提取 link 类字段，不递归
  if (absPath.endsWith('.json')) {
    try {
      const data = JSON.parse(readText(absPath));
      extractJsonLinks(data, accLinks);
    } catch (_e) { /* ignore */ }
    return;
  }
  // 图片/静态资源：无链接
  if (/\.(svg|png|jpg|jpeg|gif|webp|ico|scss|css|woff2?|ttf)$/i.test(absPath)) return;

  const content = readText(absPath);
  if (!content) return;

  // .md：正文链接 + frontmatter href（events 报名外链等）
  if (absPath.endsWith('.md')) {
    const fm = extractFrontmatter(content);
    if (fm.href && isStaticLinkCandidate(fm.href)) accLinks.push(cleanRawLink(fm.href));
    for (const raw of extractRawLinks(content, constantsMap, pageLocale)) accLinks.push(raw);
    return;
  }

  // .vue / .ts：静态链接
  for (const raw of extractRawLinks(content, constantsMap, pageLocale)) accLinks.push(raw);

  if (depth >= MAX_COMPONENT_DEPTH) return;

  // 递归显式 import
  const importRe = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  let m;
  while ((m = importRe.exec(content)) !== null) {
    const child = resolveImport(m[1], absPath);
    if (child) scanFile(child, depth + 1, visited, accLinks, ctx);
  }

  // Nuxt 自动导入组件兜底：模板中使用的 <PascalCase> / <kebab-case> 标签
  // 匹配 app/components 注册表，不在 import 链上的补扫（ContentWrapper/AppEmpty 等）
  if (absPath.endsWith('.vue')) {
    const tagRe = /<([A-Za-z][A-Za-z0-9-]*)\b/g;
    let t;
    while ((t = tagRe.exec(content)) !== null) {
      const name = /[A-Z]/.test(t[1][0]) ? t[1] : kebabToPascal(t[1]);
      const comp = registry.get(name);
      if (comp) scanFile(comp, depth + 1, visited, accLinks, ctx);
    }
  }
}

/* ------------------------------------------------------------------ */
/* 6. 链接分类与页面匹配                                                 */
/* ------------------------------------------------------------------ */

const ASSET_EXT_RE = /\.(png|jpg|jpeg|gif|svg|webp|ico|bmp|mp4|mp3|pdf|zip|tar|gz|rar|7z|iso|rpm|deb|exe|msi|pkg|woff2?|ttf|otf|eot|css|js|mjs|json|yaml|yml|xml|txt|csv|docx?|xlsx?|pptx?)$/i;

// 分类：internal（本仓页面）/ docs（同域 /docs 文档站）/ asset / external / anchor / other
function classifyLink(raw, currentPagePath) {
  let url = String(raw).trim();
  if (!url) return { type: 'other', target: '' };
  if (url.startsWith('#')) return { type: 'anchor', target: url };
  if (/^(mailto:|tel:|javascript:|data:|blob:)/i.test(url)) return { type: 'other', target: url };

  // 绝对 URL
  const protoMatch = url.match(/^https?:\/\//i);
  if (protoMatch || url.startsWith('//')) {
    const full = url.startsWith('//') ? 'https:' + url : url;
    try {
      const u = new URL(full);
      if (INTERNAL_DOMAINS.includes(u.host)) {
        const p = u.pathname;
        if (p.startsWith('/docs/')) return { type: 'docs', target: p };
        return { type: 'internal', target: p + u.search + u.hash };
      }
      return { type: 'external', target: url };
    } catch (_e) {
      return { type: 'other', target: url };
    }
  }

  // 站内绝对路径
  if (url.startsWith('/')) {
    if (url.startsWith('/docs/') || url === '/docs') return { type: 'docs', target: url.split('?')[0] };
    if (url.startsWith('/pdf/') || url.startsWith('/category/')) return { type: 'asset', target: url };
    if (ASSET_EXT_RE.test(url.split('?')[0])) return { type: 'asset', target: url };
    if (/^\/(zh|en)(\/|$)/.test(url) || url === '/') return { type: 'internal', target: url };
    // /news、/search 等无 locale 前缀路径：按当前页 locale 归一后仍算内链候选（死链检测用）
    return { type: 'internal', target: url };
  }

  // 相对路径：相对当前页解析
  const resolved = path.posix.normalize(path.posix.join(currentPagePath.replace(/\/[^/]*$/, '') + '/', url));
  if (ASSET_EXT_RE.test(resolved)) return { type: 'asset', target: resolved };
  if (/^\/(zh|en)(\/|$)/.test(resolved)) return { type: 'internal', target: resolved };
  return { type: 'other', target: resolved };
}

// 规范化：去 hash/query、去 .html / index、去尾斜杠
function canonicalizeUrl(raw) {
  let u = raw.trim().split('#')[0].split('?')[0];
  u = u.replace(/\.html$/i, '').replace(/\/index$/i, '/');
  if (!u.startsWith('/')) u = '/' + u;
  if (u !== '/' && u.endsWith('/')) u = u.slice(0, -1);
  return u;
}

/* ------------------------------------------------------------------ */
/* 7. 板块与标题                                                        */
/* ------------------------------------------------------------------ */

function pageToSection(pagePath) {
  if (pagePath === '/') return '/';
  const parts = pagePath.split('/').filter(Boolean); // ['zh','news','20260206']
  if (parts.length <= 1) return '/' + parts[0] + '/';
  return '/' + parts.slice(0, 2).join('/') + '/';
}

function extractVuePageTitle(content) {
  // definePageMeta({ title: 'xxx' }) 或 { title: { zh: 'xxx', en: 'xxx' } }
  const m = content.match(/definePageMeta\(\s*\{([\s\S]*?)\}\s*\)/);
  if (!m) return '';
  const body = m[1];
  const strT = body.match(/title\s*:\s*(?:"([^"]*)"|'([^']*)')/);
  if (strT) return strT[1] ?? strT[2] ?? '';
  const objT = body.match(/title\s*:\s*\{\s*zh\s*:\s*(?:"([^"]*)"|'([^']*)')/);
  if (objT) return objT[1] ?? objT[2] ?? '';
  return '';
}

/* ------------------------------------------------------------------ */
/* 主流程                                                               */
/* ------------------------------------------------------------------ */
async function main() {
  const t0 = Date.now();
  const constantsMap = buildConstantsMap();
  const registry = buildComponentRegistry();

  // ---- 1. 收集页面 ----
  const pageVueFiles = walkDir(PAGES_DIR, isVue);
  const pages = [];            // { file, pagePath, kind: 'vue'|'md', dynTemplate? }
  const dynamicRoutes = [];    // 动态路由模板（[...slug].vue）
  const redirects = [];        // definePageMeta redirect 页
  const pageSet = new Set();

  for (const f of pageVueFiles) {
    const content = readText(f);
    // 根重定向页（pages/index.vue redirect: '/zh'）排除出图
    const rd = content.match(/definePageMeta\(\s*\{[\s\S]*?redirect\s*:\s*['"]([^'"]+)['"]/);
    if (rd) {
      redirects.push({ file: path.relative(ROOT, f), from: vueFileToPagePath(f), to: rd[1] });
      continue;
    }
    if (isDynamicRouteTemplate(f)) {
      dynamicRoutes.push({ file: path.relative(ROOT, f), template: vueFileToPagePath(f) });
      // 动态路由模板同时登记为「所属内容页的布局提供者」，不作为独立页面
      continue;
    }
    const pagePath = vueFileToPagePath(f);
    if (!pageSet.has(pagePath)) {
      pageSet.add(pagePath);
      pages.push({ file: f, pagePath, kind: 'vue' });
    }
  }

  // @nuxt/content 内容页（news/blogs/events 详情）
  const enContentMissing = !fs.existsSync(path.join(CONTENT_DIR, 'en'));
  for (const locale of LOCALES) {
    const dir = path.join(CONTENT_DIR, locale);
    for (const f of walkDir(dir, isMd)) {
      const pagePath = mdFileToPagePath(f);
      if (pageSet.has(pagePath)) continue;
      pageSet.add(pagePath);
      pages.push({ file: f, pagePath, kind: 'md', locale });
    }
  }

  // 动态路由模板 → 归属内容页映射：/zh/news/* 模板承载 content/zh/news/** 的页面布局
  // key: sectionDir（如 pages/zh/news），value: 模板文件
  const dynTemplateByDir = new Map();
  for (const d of dynamicRoutes) {
    const rel = path.relative(PAGES_DIR, d.file).replace(/\\/g, '/');
    const dir = path.dirname(rel);
    if (!dynTemplateByDir.has(dir)) dynTemplateByDir.set(dir, path.join(PAGES_DIR, rel));
  }

  // 页面查找（尾斜杠 / .html / index 容差 + 重定向解析一跳）
  const redirectMap = new Map(redirects.map((r) => [canonicalizeUrl(r.from), canonicalizeUrl(r.to)]));
  function findPage(candidate) {
    if (!candidate) return null;
    let c = canonicalizeUrl(candidate);
    // 根路径等重定向页：解析到重定向目标（如 / → /zh）
    if (redirectMap.has(c)) c = redirectMap.get(c);
    if (pageSet.has(c)) return c;
    if (pageSet.has(c + '/')) return c + '/';
    if (c.endsWith('/') && pageSet.has(c.slice(0, -1))) return c.slice(0, -1);
    return null;
  }

  // ---- 2. 提取每页链接 ----
  const downstream = new Map();   // pagePath -> Set(target)
  const edgeMeta = new Map();     // "from\u0001to" -> Set(source)
  const externalLinks = new Map();// pagePath -> Set(host)
  const docsLinks = new Map();    // docsPath -> Set(fromPage)
  const brokenLinks = [];         // { from, raw, resolved }（内链指向不存在的页面）
  const titleMap = new Map();

  function addEdge(from, to, source) {
    if (from === to) return;
    const out = downstream.get(from) || new Set();
    out.add(to);
    downstream.set(from, out);
    const key = from + '\u0001' + to;
    const meta = edgeMeta.get(key) || new Set();
    meta.add(source);
    edgeMeta.set(key, meta);
  }

  for (const { file, pagePath, kind } of pages) {
    const rawLinks = [];
    const visited = new Set();
    // 页面语言上下文：/zh/... 页面只展开 zh 链接（组件仅渲染当前语言版本）
    const pageLocale = /^\/(zh|en)(\/|$)/.test(pagePath) ? pagePath.split('/')[1] : null;
    const ctx = { constantsMap, registry, pageLocale };

    if (kind === 'vue') {
      scanFile(file, 0, visited, rawLinks, ctx);
    } else {
      // 内容页：.md 正文 + 承载它的动态路由模板组件链（面包屑等布局链接）
      scanFile(file, 0, visited, rawLinks, ctx);
      const relToContent = path.relative(CONTENT_DIR, file).replace(/\\/g, '/');
      const dirRel = path.dirname(relToContent); // 如 zh/news
      const tpl = dynTemplateByDir.get(dirRel);
      if (tpl) scanFile(tpl, 0, visited, rawLinks, ctx);
      const fm = extractFrontmatter(readText(file));
      if (fm.title) titleMap.set(pagePath, fm.title);
    }
    if (kind === 'vue') {
      const t = extractVuePageTitle(readText(file));
      if (t) titleMap.set(pagePath, t);
    }

    const expanded = expandTemplateLinks(rawLinks, pageLocale);
    for (const raw of expanded) {
      const cls = classifyLink(raw, pagePath);
      if (cls.type === 'internal') {
        const target = findPage(cls.target);
        if (target) {
          addEdge(pagePath, target, path.relative(ROOT, file));
        } else {
          brokenLinks.push({ from: pagePath, raw: raw, resolved: cls.target });
        }
      } else if (cls.type === 'docs') {
        const set = docsLinks.get(cls.target) || new Set();
        set.add(pagePath);
        docsLinks.set(cls.target, set);
      } else if (cls.type === 'external') {
        try {
          const u = new URL(raw.startsWith('//') ? 'https:' + raw : raw);
          const ext = externalLinks.get(pagePath) || new Set();
          ext.add(u.host);
          externalLinks.set(pagePath, ext);
        } catch (_e) { /* ignore */ }
      }
    }
  }

  // CMS 标题补充：news/blogs JSON 的 link → title（列表数据即权威标题源）
  for (const jsonName of ['news.json', 'blogs.json', 'activity.json', 'lives.json']) {
    const p = path.join(CONTENT_DIR, 'cms', 'export', jsonName);
    if (!fs.existsSync(p)) continue;
    try {
      const data = JSON.parse(readText(p));
      for (const item of data.data || []) {
        const link = item.link || item.link_zh;
        if (!link) continue;
        const target = findPage(link);
        if (target && (item.title_zh || item.title)) {
          titleMap.set(target, item.title_zh || item.title);
        }
      }
    } catch (_e) { /* ignore */ }
  }

  // ---- 2.5 内容页环绕链接（prev/next）合成 ----
  // ContentRender.vue 运行时 queryContent().sort({date:-1}).findSurround() 生成上一篇/下一篇链接，
  // 属于内容板块的真实内链机制，静态按「同目录、date 降序」合成 prev/next 双向边。
  {
    const byDir = new Map(); // 'zh/news' -> [{pagePath, file, date}]
    for (const { file, pagePath, kind } of pages) {
      if (kind !== 'md') continue;
      const relToContent = path.relative(CONTENT_DIR, file).replace(/\\/g, '/');
      const dirRel = path.dirname(relToContent);
      const fm = extractFrontmatter(readText(file));
      const ts = fm.date ? new Date(String(fm.date).replace(/["']/g, '').replace(/\//g, '-')).getTime() || 0 : 0;
      (byDir.get(dirRel) || byDir.set(dirRel, []).get(dirRel)).push({ pagePath, ts, name: path.basename(file) });
    }
    for (const [, items] of byDir) {
      items.sort((a, b) => (b.ts - a.ts) || a.name.localeCompare(b.name)); // date 降序
      for (let i = 0; i < items.length; i++) {
        const prev = items[i - 1]; // 更新的一篇
        const next = items[i + 1]; // 更早的一篇
        for (const neighbor of [prev, next]) {
          if (neighbor && items[i].pagePath !== neighbor.pagePath) {
            addEdge(items[i].pagePath, neighbor.pagePath, '(content surround)');
          }
        }
      }
    }
  }

  // ---- 3. 全局布局组件（AppHeader/AppFooter，layouts/default.vue 注入所有页面）----
  const globalLinkTargets = new Set();
  const globalLinkSources = new Map();
  for (const comp of GLOBAL_LAYOUT_COMPONENTS) {
    if (!fs.existsSync(comp)) continue;
    const compLinks = [];
    scanFile(comp, 0, new Set(), compLinks, { constantsMap, registry, pageLocale: null });
    const compName = path.basename(comp);
    for (const raw of expandTemplateLinks(compLinks, null)) {
      const cls = classifyLink(raw, '');
      if (cls.type === 'internal') {
        const target = findPage(cls.target);
        if (target) {
          globalLinkTargets.add(target);
          const srcs = globalLinkSources.get(target) || [];
          srcs.push(compName);
          globalLinkSources.set(target, srcs);
        }
      }
    }
  }

  // ---- 4. 上游链接 ----
  const upstream = new Map();
  for (const [from, outs] of downstream) {
    for (const to of outs) {
      const ins = upstream.get(to) || new Set();
      ins.add(from);
      upstream.set(to, ins);
    }
  }

  // ---- 5. 统计 ----
  const stats = {
    totalPages: pages.length,
    dynamicRouteTemplates: dynamicRoutes.length,
    totalEdges: 0,
    pagesWithOutbound: downstream.size,
    pagesWithInbound: upstream.size,
    globalLinkPages: globalLinkTargets.size,
    pagesNotInNav: [],
    orphanPages: [],
    contentOrphanPages: [],
    contentInboundNoNav: [],
    navInboundNoContent: [],
    noInboundPages: [],
    noOutboundPages: [],
    topInbound: [],
    topOutbound: [],
    externalHosts: [],
  };

  for (const outs of downstream.values()) stats.totalEdges += outs.size;

  for (const { pagePath } of pages) {
    const hasOut = downstream.has(pagePath) && downstream.get(pagePath).size > 0;
    const hasIn = upstream.has(pagePath) && upstream.get(pagePath).size > 0;
    const inNav = globalLinkTargets.has(pagePath);
    if (!hasIn) stats.noInboundPages.push(pagePath);
    if (!hasOut) stats.noOutboundPages.push(pagePath);
    if (!hasOut && !hasIn && !inNav) stats.orphanPages.push(pagePath);
    if (!hasOut && !hasIn && inNav) stats.contentOrphanPages.push(pagePath);
    if (!inNav) stats.pagesNotInNav.push(pagePath);
    if (hasIn && !inNav) stats.contentInboundNoNav.push(pagePath);
    if (inNav && !hasIn) stats.navInboundNoContent.push(pagePath);
  }

  stats.topInbound = [...upstream.entries()].map(([p, s]) => ({ page: p, count: s.size })).sort((a, b) => b.count - a.count).slice(0, 20);
  stats.topOutbound = [...downstream.entries()].map(([p, s]) => ({ page: p, count: s.size })).sort((a, b) => b.count - a.count).slice(0, 20);

  const hostCount = new Map();
  for (const hosts of externalLinks.values()) {
    for (const h of hosts) hostCount.set(h, (hostCount.get(h) || 0) + 1);
  }
  stats.externalHosts = [...hostCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([h, c]) => ({ host: h, count: c }));

  // 板块统计
  const sectionMap = new Map();
  for (const { pagePath } of pages) {
    const sec = pageToSection(pagePath);
    const s = sectionMap.get(sec) || { section: sec, pages: 0, inDeg: 0, outDeg: 0, internal: 0, orphan: 0 };
    s.pages++;
    const hasOut = downstream.has(pagePath) && downstream.get(pagePath).size > 0;
    const hasIn = upstream.has(pagePath) && upstream.get(pagePath).size > 0;
    if (!hasOut && !hasIn) s.orphan++;
    sectionMap.set(sec, s);
  }
  for (const [from, outs] of downstream) {
    const fromSec = pageToSection(from);
    for (const to of outs) {
      const toSec = pageToSection(to);
      if (sectionMap.get(fromSec)) sectionMap.get(fromSec).outDeg++;
      if (sectionMap.get(toSec)) sectionMap.get(toSec).inDeg++;
      if (fromSec === toSec && sectionMap.get(fromSec)) sectionMap.get(fromSec).internal++;
    }
  }
  const sections = [...sectionMap.values()].sort((a, b) => b.pages - a.pages);

  // 板块级边
  const secEdgeMap = new Map();
  for (const [from, outs] of downstream) {
    const fromSec = pageToSection(from);
    for (const to of outs) {
      const k = fromSec + '\u0001' + pageToSection(to);
      secEdgeMap.set(k, (secEdgeMap.get(k) || 0) + 1);
    }
  }
  const sectionEdges = [...secEdgeMap.entries()].map(([k, w]) => {
    const [from, to] = k.split('\u0001');
    return { from, to, weight: w };
  });

  // ---- 6. 序列化 ----
  const edges = [];
  for (const [from, outs] of downstream) {
    for (const to of outs) {
      edges.push({ from, to, sources: [...(edgeMeta.get(from + '\u0001' + to) || [])] });
    }
  }

  const pageRecords = pages.map(({ pagePath }) => {
    const out = downstream.has(pagePath) ? [...downstream.get(pagePath)] : [];
    const ins = upstream.has(pagePath) ? [...upstream.get(pagePath)] : [];
    const inNav = globalLinkTargets.has(pagePath);
    return {
      page: pagePath,
      title: titleMap.get(pagePath) || '',
      section: pageToSection(pagePath),
      outbound: out,
      inbound: ins,
      outCount: out.length,
      inCount: ins.length,
      inGlobalNav: inNav,
      globalNavSources: inNav ? [...new Set(globalLinkSources.get(pagePath) || [])] : [],
      isOrphan: out.length === 0 && ins.length === 0 && !inNav,
      isContentOrphan: out.length === 0 && ins.length === 0,
      externalHosts: externalLinks.has(pagePath) ? [...externalLinks.get(pagePath)] : [],
    };
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    elapsedMs: Date.now() - t0,
    project: 'hifloat-portal',
    framework: 'Nuxt 4',
    enContentMissing,
    redirects,
    stats,
    sections,
    sectionEdges,
    pages: pageRecords,
    edges,
    dynamicRoutes,
    brokenLinks,
    docsLinks: [...docsLinks.entries()].map(([p, froms]) => ({ path: p, fromCount: froms.size, fromPages: [...froms] })).sort((a, b) => b.fromCount - a.fromCount),
    globalLinks: [...globalLinkTargets].sort().map((p) => ({
      page: p,
      title: titleMap.get(p) || '',
      sources: [...new Set(globalLinkSources.get(p) || [])],
    })),
  };

  // ---- 7. 输出 HTML ----
  fs.writeFileSync(OUTPUT_HTML, buildHtml(payload), 'utf-8');

  console.log('┌──────────────────────────────────────────────┐');
  console.log('│ HiFloat 站内内链分析完成');
  console.log('├──────────────────────────────────────────────┤');
  console.log('│ 页面总数        :', String(stats.totalPages).padStart(8));
  console.log('│ 动态路由模板    :', String(stats.dynamicRouteTemplates).padStart(8));
  console.log('│ 内链边总数      :', String(stats.totalEdges).padStart(8));
  console.log('│ 有出链页面      :', String(stats.pagesWithOutbound).padStart(8));
  console.log('│ 有入链页面      :', String(stats.pagesWithInbound).padStart(8));
  console.log('│ 孤岛页面        :', String(stats.orphanPages.length).padStart(8));
  console.log('│ 无入链页面      :', String(stats.noInboundPages.length).padStart(8));
  console.log('│ 死链(未匹配内链) :', String(brokenLinks.length).padStart(7));
  console.log('│ 同域docs链接    :', String(payload.docsLinks.length).padStart(8));
  console.log('├──────────────────────────────────────────────┤');
  console.log('│ 全局导航覆盖页   :', String(stats.globalLinkPages).padStart(8));
  console.log('│ 未进入导航页面   :', String(stats.pagesNotInNav.length).padStart(8));
  console.log('│ en 内容缺失      :', String(enContentMissing ? 'YES' : 'no').padStart(8));
  console.log('├──────────────────────────────────────────────┤');
  console.log('│ 报告已生成:', OUTPUT_HTML);
  console.log('└──────────────────────────────────────────────┘');
}

/* ------------------------------------------------------------------ */
/* HTML 看板（自包含，G6 CDN，离线时表格仍可用）                          */
/* ------------------------------------------------------------------ */
function buildHtml(payload) {
  // 安全嵌入：防 JSON 内容中的 </script>、反引号、${ 破坏外层模板/脚本
  const json = JSON.stringify(payload)
    .replace(/</g, '\\u003c')
    .replace(/`/g, '\\u0060')
    .replace(/\$\{/g, '\\u0024{');
  const stats = payload.stats;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const cards = [
    { label: '页面总数', value: stats.totalPages, sub: `动态路由模板 ${stats.dynamicRouteTemplates} · 重定向 ${payload.redirects.length}` },
    { label: '内链边总数', value: stats.totalEdges, sub: `平均每页 ${(stats.totalEdges / Math.max(stats.totalPages, 1)).toFixed(2)} 条` },
    { label: '孤岛页面', value: stats.orphanPages.length, sub: '无内容链且未入导航', cls: 'danger' },
    { label: '死链', value: payload.brokenLinks.length, sub: '内链指向不存在页面', cls: 'danger' },
    { label: '未进入导航', value: stats.pagesNotInNav.length, sub: '全局导航未覆盖', cls: 'warn' },
    { label: '内容强·入口弱', value: stats.contentInboundNoNav.length, sub: '有内容入链·无导航', cls: 'warn' },
    { label: '导航覆盖页', value: stats.globalLinkPages, sub: '在 AppHeader/Footer 中', cls: 'ok' },
    { label: '同域 docs 链接', value: payload.docsLinks.length, sub: '/docs 文档站入口', cls: 'ok' },
  ];

  const sectionOptions = payload.sections.map((s) => `<option value="${esc(s.section)}">${esc(s.section)} (${s.pages})</option>`).join('');

  const enBanner = payload.enContentMissing
    ? `<div class="panel" style="border-color:#f59e0b"><b style="color:var(--warn)">⚠️ EN 内容缺失</b><span class="small">：资源仓库（resources.git）暂无 en 目录，<code>/en/news|blogs|events/*</code> 详情页无内容（渲染 AppEmpty），仅 <code>/en</code> 静态路由存在。英文板块的内链密度指标因此整体偏低，补齐 en 内容是内链优化的前置项。</span></div>`
    : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>HiFloat 站内内链看板</title>
<style>
  :root{
    --bg:#0b1020; --panel:#121a30; --panel2:#0f1626; --border:#233056;
    --text:#e6ecff; --muted:#8a96c4; --accent:#4f8cff; --accent2:#22d3ee;
    --warn:#f59e0b; --danger:#ef4444; --ok:#22c55e; --violet:#a78bfa;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;font-size:14px}
  a{color:var(--accent);text-decoration:none}
  a:hover{text-decoration:underline}
  .wrap{max-width:1500px;margin:0 auto;padding:24px}
  header.top{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:18px}
  header.top h1{font-size:20px;margin:0;font-weight:700}
  header.top .muted{color:var(--muted);font-size:12px}
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:20px}
  .card{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px}
  .card .v{font-size:28px;font-weight:700;line-height:1.1}
  .card .l{color:var(--muted);font-size:12px;margin-top:6px}
  .card .s{font-size:11px;color:var(--muted);margin-top:4px}
  .card.warn .v{color:var(--warn)}
  .card.danger .v{color:var(--danger)}
  .card.ok .v{color:var(--ok)}
  .tabs{display:flex;gap:6px;border-bottom:1px solid var(--border);margin-bottom:16px;flex-wrap:wrap}
  .tab{padding:10px 16px;cursor:pointer;color:var(--muted);border-bottom:2px solid transparent;font-size:13px;font-weight:600}
  .tab.active{color:var(--text);border-bottom-color:var(--accent)}
  .panel{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:16px}
  .panel h2{margin:0 0 12px;font-size:15px}
  .toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px}
  input,select{background:var(--panel2);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:7px 10px;font-size:13px;outline:none}
  input:focus,select:focus{border-color:var(--accent)}
  button{background:var(--accent);color:#fff;border:none;border-radius:8px;padding:7px 14px;cursor:pointer;font-size:13px;font-weight:600}
  button.ghost{background:transparent;border:1px solid var(--border);color:var(--text)}
  button.ghost.active{border-color:var(--accent);background:rgba(79,140,255,.12)}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th,td{padding:8px 10px;text-align:left;border-bottom:1px solid var(--border);vertical-align:top}
  th{color:var(--muted);font-weight:600;font-size:12px;position:sticky;top:0;background:var(--panel)}
  tr.row{cursor:pointer}
  tr.row:hover{background:rgba(79,140,255,.07)}
  .badge{display:inline-block;padding:1px 8px;border-radius:999px;font-size:11px;font-weight:600}
  .b-orphan{background:rgba(239,68,68,.15);color:#fca5a5}
  .b-noIn{background:rgba(245,158,11,.15);color:#fcd34d}
  .b-ok{background:rgba(34,197,94,.15);color:#86efac}
  .b-danger{background:rgba(239,68,68,.25);color:#f87171}
  .b-navOnly{background:rgba(34,211,238,.15);color:#67e8f9}
  .pill{display:inline-block;padding:2px 8px;border-radius:6px;background:var(--panel2);border:1px solid var(--border);font-size:12px;margin:1px}
  .detail{display:none}
  .detail.open{display:table-row}
  .detail td{background:var(--panel2);padding:14px}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .linklist{max-height:260px;overflow:auto}
  .linklist a{display:block;padding:4px 0;border-bottom:1px dashed var(--border);font-size:12px;line-height:1.4}
  .linklist a .lt-title{font-weight:600;color:var(--text)}
  .linklist a:hover .lt-title{color:var(--accent2)}
  .small{font-size:12px;color:var(--muted)}
  #pageTableWrap{max-height:560px;overflow:auto;border:1px solid var(--border);border-radius:8px}
  .graph-box{position:relative;background:var(--panel2);border:1px solid var(--border);border-radius:12px;overflow:hidden}
  .graph-box canvas{display:block}
  .legend{position:absolute;right:12px;top:12px;background:rgba(11,16,32,.8);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-size:11px;color:var(--muted)}
  .legend i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px;vertical-align:middle}
  .hidden{display:none!important}
  .tip{position:absolute;left:12px;bottom:12px;font-size:11px;color:var(--muted);background:rgba(11,16,32,.8);padding:6px 10px;border-radius:8px;border:1px solid var(--border)}
  .two-col{display:grid;grid-template-columns:1.1fr .9fr;gap:16px}
  .bar{height:6px;border-radius:3px;background:var(--panel2);overflow:hidden;margin-top:3px}
  .bar > span{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2))}
  @media(max-width:980px){.grid2,.two-col{grid-template-columns:1fr}}
  .search-hl{outline:2px solid var(--accent2);outline-offset:2px}
  code{background:var(--panel2);border:1px solid var(--border);border-radius:4px;padding:0 4px;font-size:12px}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <h1>HiFloat 站内内链看板</h1>
    <span class="muted">Nuxt 4 · 页面 = app/pages/*.vue + app/content/{zh,en}/*.md · 内链域名 hifloat.gccorg.com</span>
    <span class="muted" id="genAt"></span>
  </header>

  ${enBanner}

  <div class="cards" id="cards"></div>

  <div class="tabs">
    <div class="tab active" data-tab="overview">总览 / 板块关系图</div>
    <div class="tab" data-tab="pages">页面列表（上下游钻取）</div>
    <div class="tab" data-tab="graph">页面级关系图</div>
    <div class="tab" data-tab="orphan">孤岛 / 关键数据</div>
  </div>

  <!-- 总览 -->
  <section id="tab-overview" class="tabc">
    <div class="grid2">
      <div class="panel">
        <h2>板块级内链密度图（节点=板块，边宽=链接数）</h2>
        <div class="graph-box" style="height:520px"><div id="sectionGraph" style="height:100%"></div>
          <div class="legend" id="secLegend"></div>
          <div class="tip">拖拽节点 · 滚轮缩放 · 节点大小=页面数</div>
        </div>
      </div>
      <div class="panel">
        <h2>板块内链统计</h2>
        <div style="max-height:520px;overflow:auto">
          <table id="sectionTable"></table>
        </div>
      </div>
    </div>
  </section>

  <!-- 页面列表 -->
  <section id="tab-pages" class="tabc hidden">
    <div class="panel">
      <div class="toolbar">
        <input id="pageSearch" placeholder="搜索标题或路径（如 /zh/news/）" style="width:280px" />
        <select id="pageSectionFilter"><option value="">全部板块</option>${sectionOptions}</select>
        <select id="pageStatusFilter">
          <option value="">全部状态</option>
          <option value="orphan">孤岛(无内容无导航)</option>
          <option value="contentOrphan">无内容上下游</option>
          <option value="noIn">仅无内容入链</option>
          <option value="noOut">仅无出链</option>
          <option value="notInNav">未进入导航</option>
          <option value="contentNoNav">内容有·导航无</option>
          <option value="navNoContent">导航有·内容无</option>
          <option value="both">有上下游</option>
        </select>
        <span class="small" id="pageCount"></span>
        <span class="small">（点击行展开上下游）</span>
      </div>
      <div id="pageTableWrap">
        <table id="pageTable"></table>
      </div>
    </div>
  </section>

  <!-- 页面级图 -->
  <section id="tab-graph" class="tabc hidden">
    <div class="panel">
      <div class="toolbar">
        <select id="graphSectionFilter"><option value="">全部板块（节点较多）</option>${sectionOptions}</select>
        <input id="graphSearch" placeholder="高亮：搜索标题或路径" style="width:280px" />
        <button class="ghost active" id="tgOrphan">含孤岛</button>
        <button class="ghost" id="btnRender">渲染图谱</button>
        <span class="small" id="graphInfo"></span>
      </div>
      <div class="graph-box" style="height:620px"><div id="pageGraph" style="height:100%"></div>
        <div class="tip">搜索高亮节点与邻居 · 双击节点定位上下游</div>
      </div>
    </div>
  </section>

  <!-- 孤岛 / 关键数据 -->
  <section id="tab-orphan" class="tabc hidden">
    <div class="panel">
      <h2>死链（内链指向不存在的页面）<span class="small"> · ${payload.brokenLinks.length} 条 · 多为缺 locale 前缀或目标页未创建</span></h2>
      <div style="max-height:240px;overflow:auto"><table id="brokenTable"></table></div>
    </div>
    <div class="two-col">
      <div class="panel">
        <h2>孤岛页面（无内容链且未入导航）<span class="small"> · ${stats.orphanPages.length} 页 · 最高优先级补链</span></h2>
        <div class="linklist" id="orphanList2"></div>
      </div>
      <div class="panel">
        <h2>未进入全局导航的页面<span class="small"> · ${stats.pagesNotInNav.length} 页</span></h2>
        <div class="linklist" id="notInNavList"></div>
      </div>
    </div>
    <div class="two-col" style="margin-top:16px">
      <div class="panel">
        <h2>内容强·入口弱（有内容入链但不在导航）<span class="small"> · ${stats.contentInboundNoNav.length} 页 · 建议加导航/补链接</span></h2>
        <div class="linklist" id="contentNoNavList"></div>
      </div>
      <div class="panel">
        <h2>导航有·内容无（在导航但无内容入链）<span class="small"> · ${stats.navInboundNoContent.length} 页 · 建议补内容内链</span></h2>
        <div class="linklist" id="navNoContentList"></div>
      </div>
    </div>
    <div class="two-col" style="margin-top:16px">
      <div class="panel">
        <h2>无内容上下游页面（仅靠导航存活）<span class="small"> · ${stats.contentOrphanPages.length} 页</span></h2>
        <div class="linklist" id="contentOrphanList"></div>
      </div>
      <div class="panel">
        <h2>无内容入链页面<span class="small"> · ${stats.noInboundPages.length} 页</span></h2>
        <div class="linklist" id="noInList"></div>
      </div>
    </div>
    <div class="panel" style="margin-top:16px">
      <h2>全局导航覆盖页面（在 AppHeader/AppFooter 的链接中）<span class="small"> · ${stats.globalLinkPages} 页</span></h2>
      <div class="linklist" id="globalNavList"></div>
    </div>
    <div class="panel" style="margin-top:16px">
      <h2>同域 docs 入口（/docs 文档站链接 · 引用页面数）<span class="small"> · ${payload.docsLinks.length} 个</span></h2>
      <div style="max-height:240px;overflow:auto"><table id="docsTable"></table></div>
    </div>
    <div class="grid2" style="margin-top:16px">
      <div class="panel">
        <h2>入链最多的页面（内链权重高）</h2>
        <div id="topIn"></div>
      </div>
      <div class="panel">
        <h2>出链最多的页面</h2>
        <div id="topOut"></div>
      </div>
    </div>
    <div class="panel" style="margin-top:16px">
      <h2>外链域名 Top</h2>
      <div id="extHosts"></div>
    </div>
    <div class="panel" style="margin-top:16px">
      <h2>说明与方法论</h2>
      <ul class="small">
        <li>页面来源：<code>app/pages/**/*.vue</code>（Nuxt 文件路由，zh/en 双语静态页）+ <code>app/content/{zh,en}/**/*.md</code>（@nuxt/content 的 news/blogs/events 详情页，挂在 <code>[...slug].vue</code> 动态路由下）。</li>
        <li>根路径 <code>/</code> 为 <code>definePageMeta redirect → /zh</code> 的重定向页，不计入图${payload.redirects.length ? `（重定向 ${payload.redirects.length} 条）` : ''}。</li>
        <li>动态路由模板（<code>[...slug].vue</code>，共 ${stats.dynamicRouteTemplates} 个）承载内容页布局，其组件链链接（面包屑等）已注入对应内容页出边。</li>
        <li>链接提取：页面组件递归 import 链（6 层）中的 <code>href</code>/<code>:to</code>/编程式导航/模板字符串（<code>\${locale}</code> 展开 zh+en）；Nuxt 自动导入组件（<code>app/components/**</code>）按模板标签名补扫；<code>app/config/*.ts</code> 常量（CONFIG/LIVE）按标识符解析注入。</li>
        <li>CMS 动态内链：列表→详情的链接来自 <code>app/content/cms/export/*.json</code>（news/blogs/lives/activity/space 等），由视图 <code>v-for</code> 渲染 <code>item.link</code>/<code>item.link_zh</code> 字段，随组件 import 链静态提取（无需线上 API）。</li>
        <li>全局导航：<code>app/layouts/default.vue</code> 注入的 <code>AppHeader.vue</code>/<code>AppFooter.vue</code> 链接单独归为「全局导航」，<b>不注入每页出边</b>，避免指标失真。</li>
        <li>SEO 头部链接（<code>rel: canonical/alternate</code> + <code>hreflang</code>）已剔除：双语站的结构性元数据非内容内链，混入会使每页产生虚假跨语言边。</li>
        <li>内容环绕链接（prev/next）：<code>ContentRender.vue</code> 运行时 <code>queryContent().sort({{'{'}}date:-1{{'}'}}).findSurround()</code> 生成上一篇/下一篇，按「同目录、date 降序」合成双向边（来源标记 content surround）。</li>
        <li>内链判定：站内路径 <code>/zh/…</code>、<code>/en/…</code>，或 <code>https://hifloat.gccorg.com</code> 域名 URL；<code>/docs/**</code> 为同域文档站（单列统计）；<code>/pdf/**</code>、图片等为资源不计内链。</li>
        <li>死链定义：被判定为站内路径、但未匹配到任何页面（常见原因：缺 <code>/{locale}</code> 前缀、目标内容未创建）。</li>
        <li>四类页面分类：<b>孤岛</b>=无内容链且未入导航；<b>内容强·入口弱</b>=有内容入链但不在导航；<b>导航有·内容无</b>=在导航但无内容入链；<b>仅导航</b>=无内容上下游但靠导航存活。</li>
        ${payload.enContentMissing ? '<li><b>EN 内容缺失</b>：资源仓库暂无 en 目录，en 详情页无内容。en 侧指标（孤岛/密度）需在补齐 en 内容后重跑复核。</li>' : ''}
        <li>运行时 API 交互（搜索、邮件订阅接口）不在静态内链范畴；邮件订阅入口链接经模板截断已纳入。</li>
      </ul>
    </div>
  </section>
</div>

<script src="https://unpkg.com/@antv/g6@4.8.24/dist/g6.min.js"></script>
<script>
window.__DATA__ = ${json};
(function(){
  var D = window.__DATA__;
  document.getElementById('genAt').textContent = '生成于 ' + new Date(D.generatedAt).toLocaleString() + ' · 耗时 ' + D.elapsedMs + 'ms';

  // ---- 卡片 ----
  var cardsHtml = '';
  ${JSON.stringify(cards)}.forEach(function(c){
    cardsHtml += '<div class="card ' + (c.cls||'') + '"><div class="v">' + c.value + '</div><div class="l">' + c.label + '</div><div class="s">' + (c.sub||'') + '</div></div>';
  });
  document.getElementById('cards').innerHTML = cardsHtml;

  var sections = ${JSON.stringify(payload.sections)};
  var sectionEdges = ${JSON.stringify(payload.sectionEdges)};
  var pages = D.pages;
  var pageIndex = {};
  pages.forEach(function(p){ pageIndex[p.page] = p; });

  function esc(s){ return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]}) }
  function titleFor(pg){ var p=pageIndex[pg]; return (p&&p.title)?p.title:'' }
  function labelFor(pg){
    var t=titleFor(pg);
    return t ? esc(t) + ' <span class="small" style="opacity:.6">'+pg+'</span>' : pg;
  }
  function shortLabel(pg){
    var t=titleFor(pg);
    var s=t||pg;
    if(s.length>24) s=s.slice(0,23)+'…';
    return s;
  }

  // ---- tabs ----
  document.querySelectorAll('.tab').forEach(function(t){
    t.addEventListener('click', function(){
      document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active')});
      t.classList.add('active');
      document.querySelectorAll('.tabc').forEach(function(c){c.classList.add('hidden')});
      document.getElementById('tab-'+t.dataset.tab).classList.remove('hidden');
      if(t.dataset.tab==='graph' && !graphRendered){ renderPageGraph(); graphRendered=true; }
    });
  });

  // ---- 板块表 ----
  var secTbl = '<thead><tr><th>板块</th><th>页面数</th><th>出链</th><th>入链</th><th>板块内链</th><th>孤岛</th></tr></thead><tbody>';
  sections.forEach(function(s){
    secTbl += '<tr><td>' + s.section + '</td><td>' + s.pages + '</td><td>' + s.outDeg + '</td><td>' + s.inDeg + '</td><td>' + s.internal + '</td><td>' + s.orphan + '</td></tr>';
  });
  secTbl += '</tbody>';
  document.getElementById('sectionTable').innerHTML = secTbl;

  // ---- 板块图（G6 力导向）----
  var secColorMap = {};
  var palette = ['#4f8cff','#22d3ee','#a78bfa','#f59e0b','#22c55e','#ef4444','#ec4899','#14b8a6','#eab308','#8b5cf6','#06b6d4','#f97316','#3b82f6','#10b981'];
  sections.forEach(function(s,i){ secColorMap[s.section] = palette[i%palette.length]; });
  var sgNodes = sections.map(function(s){
    return { id:s.section, label:s.section, size:10+Math.sqrt(s.pages)*6, style:{fill:secColorMap[s.section]}, sectionData:s };
  });
  var sgEdges = sectionEdges.map(function(e){
    return { source:e.from, target:e.to, weight:e.weight, style:{lineWidth:Math.min(1+Math.log(e.weight),8),stroke:'#4f8cff',strokeOpacity:0.5} };
  });
  var secGraph = null;
  if (typeof G6 === 'undefined') {
    document.getElementById('sectionGraph').innerHTML = '<div style="padding:24px;color:var(--muted)">G6 CDN 加载失败（可能离线），表格与钻取功能仍可使用，图谱不可用。</div>';
  } else {
  secGraph = new G6.Graph({
    container:'sectionGraph', width:document.getElementById('sectionGraph').clientWidth, height:520,
    modes:{default:['drag-canvas','zoom-canvas','drag-node']},
    layout:{ type:'force', preventOverlap:true, nodeStrength:-80, linkDistance:120, edgeStrength:0.7, collideStrength:0.9 },
    defaultNode:{ type:'circle', labelCfg:{style:{fill:'#e6ecff',fontSize:11}}, style:{stroke:'#233056'} },
    defaultEdge:{ type:'line', color:'#4f8cff', style:{endArrow:{path:G6.Arrow.triangle(8,8,0),fill:'#4f8cff'}} },
    nodeStateStyles:{ hover:{shadowBlur:20,shadowColor:'#4f8cff'} },
  });
  secGraph.data({nodes:sgNodes, edges:sgEdges});
  secGraph.render();
  secGraph.on('node:mouseenter', function(e){ secGraph.setItemState(e.item,'hover',true) });
  secGraph.on('node:mouseleave', function(e){ secGraph.setItemState(e.item,'hover',false) });
  var leg = sections.slice(0,12).map(function(s){ return '<div><i style="background:'+secColorMap[s.section]+'"></i>'+s.section+' ('+s.pages+')</div>' }).join('');
  document.getElementById('secLegend').innerHTML = leg;
  }

  // ---- 页面表 ----
  function renderPageTable(){
    var q = document.getElementById('pageSearch').value.trim().toLowerCase();
    var sec = document.getElementById('pageSectionFilter').value;
    var st = document.getElementById('pageStatusFilter').value;
    var rows = pages.filter(function(p){
      var hay = (p.page + ' ' + (p.title||'')).toLowerCase();
      if(q && hay.indexOf(q)===-1) return false;
      if(sec && p.section!==sec) return false;
      if(st==='orphan' && !p.isOrphan) return false;
      if(st==='contentOrphan' && !p.isContentOrphan) return false;
      if(st==='noIn' && p.inCount>0) return false;
      if(st==='noOut' && p.outCount>0) return false;
      if(st==='notInNav' && p.inGlobalNav) return false;
      if(st==='contentNoNav' && !(p.inCount>0 && !p.inGlobalNav)) return false;
      if(st==='navNoContent' && !(p.inGlobalNav && p.inCount===0)) return false;
      if(st==='both' && !(p.inCount>0 && p.outCount>0)) return false;
      return true;
    });
    rows.sort(function(a,b){ return (b.inCount+b.outCount)-(a.inCount+a.outCount) });
    document.getElementById('pageCount').textContent = '共 ' + rows.length + ' 页';
    var html = '<thead><tr><th>标题</th><th>路径</th><th>板块</th><th>出链</th><th>入链</th><th>导航</th><th>状态</th></tr></thead><tbody>';
    rows.forEach(function(p,idx){
      var badge;
      if(p.isOrphan){ badge = '<span class="badge b-danger">孤岛</span>' }
      else if(p.isContentOrphan){ badge = p.inGlobalNav ? '<span class="badge b-navOnly">仅导航</span>' : '<span class="badge b-orphan">内容孤岛</span>' }
      else if(p.inCount===0){ badge = p.inGlobalNav ? '<span class="badge b-navOnly">仅导航</span>' : '<span class="badge b-noIn">无入链</span>' }
      else { badge = '<span class="badge b-ok">已连通</span>' }
      var navBadge = p.inGlobalNav ? '<span class="badge b-ok">在导航</span>' : '<span class="badge b-noIn">未入导航</span>';
      var titleCell = p.title ? esc(p.title) : '<span class="small">（无标题）</span>';
      html += '<tr class="row" data-idx="'+idx+'" data-page="'+p.page.replace(/"/g,'&quot;')+'"><td>'+titleCell+'</td><td class="small">'+p.page+'</td><td>'+p.section+'</td><td>'+p.outCount+'</td><td>'+p.inCount+'</td><td>'+navBadge+'</td><td>'+badge+'</td></tr>';
      html += '<tr class="detail" id="det-'+idx+'"><td colspan="7"></td></tr>';
    });
    html += '</tbody>';
    document.getElementById('pageTable').innerHTML = html;
    document.querySelectorAll('#pageTable tr.row').forEach(function(r){
      r.addEventListener('click', function(){
        var id = r.getAttribute('data-idx');
        var det = document.getElementById('det-'+id);
        var open = det.classList.contains('open');
        document.querySelectorAll('#pageTable tr.detail').forEach(function(d){d.classList.remove('open')});
        if(open){ return }
        det.classList.add('open');
        var p = pageIndex[r.getAttribute('data-page')];
        det.querySelector('td').innerHTML = detailHtml(p);
      });
    });
  }
  function detailHtml(p){
    var ins = p.inbound.map(function(x){return '<a href="javascript:void(0)" data-go="'+x+'" class="pill">'+labelFor(x)+'</a>'}).join('') || '<span class="small">无上游内链</span>';
    var outs = p.outbound.map(function(x){return '<a href="javascript:void(0)" data-go="'+x+'" class="pill">'+labelFor(x)+'</a>'}).join('') || '<span class="small">无下游内链</span>';
    var ext = p.externalHosts.length ? p.externalHosts.map(function(h){return '<span class="pill">'+h+'</span>'}).join('') : '<span class="small">无</span>';
    var navInfo = p.inGlobalNav
      ? '<span class="badge b-ok">在全局导航中</span> <span class="small">来源：'+p.globalNavSources.join(', ')+'</span>'
      : '<span class="badge b-noIn">未进入全局导航</span>';
    var titleLine = p.title ? '<div style="margin-bottom:8px"><b>'+esc(p.title)+'</b> <span class="small">'+p.page+'</span></div>' : '<div style="margin-bottom:8px"><b>'+p.page+'</b></div>';
    return titleLine + '<div class="small" style="margin-bottom:8px">全局导航：'+navInfo+'</div><div class="grid2">'+
      '<div><div class="small" style="margin-bottom:6px;color:#fcd34d">▲ 上游内链（'+p.inbound.length+'）</div><div class="linklist">'+ins+'</div></div>'+
      '<div><div class="small" style="margin-bottom:6px;color:#86efac">▼ 下游内链（'+p.outbound.length+'）</div><div class="linklist">'+outs+'</div></div>'+
      '</div><div class="small" style="margin-top:10px">外链域名：'+ext+'</div>';
  }
  document.getElementById('pageSearch').addEventListener('input', renderPageTable);
  document.getElementById('pageSectionFilter').addEventListener('change', renderPageTable);
  document.getElementById('pageStatusFilter').addEventListener('change', renderPageTable);
  renderPageTable();

  // ---- 死链表 ----
  var bl = D.brokenLinks || [];
  var blHtml = '<thead><tr><th>来源页面</th><th>原始链接</th><th>解析目标</th></tr></thead><tbody>';
  bl.forEach(function(b){
    blHtml += '<tr><td class="small">'+b.from+'</td><td class="small"><code>'+esc(b.raw)+'</code></td><td class="small">'+esc(b.resolved||'')+'</td></tr>';
  });
  blHtml += '</tbody>';
  document.getElementById('brokenTable').innerHTML = blHtml;

  // ---- docs 表 ----
  var dl = D.docsLinks || [];
  var dlMax = dl.length ? dl[0].fromCount : 1;
  var dlHtml = '<thead><tr><th>docs 路径</th><th>引用页面数</th><th></th></tr></thead><tbody>';
  dl.forEach(function(d){
    dlHtml += '<tr><td class="small" style="word-break:break-all">'+esc(d.path)+'</td><td>'+d.fromCount+'</td><td><div class="bar" style="width:200px"><span style="width:'+(d.fromCount/dlMax*100)+'%"></span></div></td></tr>';
  });
  dlHtml += '</tbody>';
  document.getElementById('docsTable').innerHTML = dlHtml;

  // ---- 页面级图 ----
  var graphRendered = false;
  var pageGraph = null;
  var showOrphan = true;
  document.getElementById('tgOrphan').addEventListener('click', function(){
    showOrphan = !showOrphan;
    this.classList.toggle('active', showOrphan);
    this.textContent = showOrphan ? '含孤岛' : '仅连通';
    renderPageGraph();
  });
  document.getElementById('btnRender').addEventListener('click', renderPageGraph);

  function renderPageGraph(){
    var sec = document.getElementById('graphSectionFilter').value;
    var nodes = [], edges = [], nodeSet = {};
    var subset = pages.filter(function(p){
      if(sec && p.section!==sec) return false;
      if(!showOrphan && p.isOrphan) return false;
      return true;
    });
    var withEdge = subset.filter(function(p){return p.inCount>0||p.outCount>0});
    var orphans = subset.filter(function(p){return p.isOrphan});
    if(withEdge.length + orphans.length > 1400){
      orphans = orphans.slice(0,200);
    }
    var finalList = withEdge.concat(orphans);
    finalList.forEach(function(p){
      nodeSet[p.page]=true;
      nodes.push({ id:p.page, label:shortLabel(p.page), size:p.inCount>0?6+Math.min(Math.sqrt(p.inCount)*2.4,18):5, style:{fill:secColorMap[p.section]||'#4f8cff'}, pageData:p, isOrphan:p.isOrphan });
    });
    var nodeIds = {};
    nodes.forEach(function(n){nodeIds[n.id]=true});
    D.edges.forEach(function(e){
      if(nodeIds[e.from]&&nodeIds[e.to]){
        edges.push({ source:e.from, target:e.to });
      }
    });
    document.getElementById('graphInfo').textContent = '节点 '+nodes.length+' · 边 '+edges.length;
    if (typeof G6 === 'undefined') {
      document.getElementById('pageGraph').innerHTML = '<div style="padding:24px;color:var(--muted)">G6 未加载，无法渲染图谱。可查看「页面列表」与「孤岛/关键数据」页签。</div>';
      return;
    }
    if(pageGraph){ pageGraph.destroy() }
    var cw = document.getElementById('pageGraph').clientWidth;
    pageGraph = new G6.Graph({
      container:'pageGraph', width:cw, height:620,
      modes:{default:['drag-canvas','zoom-canvas','drag-node']},
      layout:{ type:'fruchterman', gravity:5, speed:5, clustering:true, nodeClustering:true, clusterGravity:8 },
      defaultNode:{ type:'circle', size:6, style:{stroke:'#233056'}, labelCfg:{position:'bottom',style:{fill:'#8a96c4',fontSize:9}} },
      defaultEdge:{ type:'line', color:'rgba(79,140,255,.35)', style:{endArrow:{path:G6.Arrow.triangle(5,5,0),fill:'rgba(79,140,255,.5)'}} },
      nodeStateStyles:{ highlight:{shadowBlur:24,shadowColor:'#22d3ee',lineWidth:2}, dim:{opacity:0.15} },
      edgeStateStyles:{ highlight:{stroke:'#22d3ee',strokeOpacity:0.9}, dim:{opacity:0.04} }
    });
    pageGraph.data({nodes:nodes,edges:edges});
    pageGraph.render();
    pageGraph.on('node:dblclick', function(e){
      var id = e.item.getModel().id;
      goToPage(id);
    });
  }

  // 高亮搜索
  document.getElementById('graphSearch').addEventListener('input', function(){
    if(!pageGraph) return;
    var q = this.value.trim().toLowerCase();
    pageGraph.getNodes().forEach(function(n){pageGraph.clearItemStates(n)});
    pageGraph.getEdges().forEach(function(e){pageGraph.clearItemStates(e)});
    if(!q){ return }
    var hit = pageGraph.getNodes().filter(function(n){ var m=n.getModel(); return (m.id.toLowerCase().indexOf(q)>-1) || (shortLabel(m.id).toLowerCase().indexOf(q)>-1) });
    hit.forEach(function(n){
      pageGraph.setItemState(n,'highlight',true);
      pageGraph.getEdges().forEach(function(e){
        var m=e.getModel(); if(m.source===n.getModel().id||m.target===n.getModel().id){ pageGraph.setItemState(e,'highlight',true) }
      });
    });
    pageGraph.getNodes().forEach(function(n){
      if(pageGraph.getItemState(n,'highlight'))return;
      pageGraph.setItemState(n,'dim',true);
    });
    pageGraph.getEdges().forEach(function(e){
      if(pageGraph.getItemState(e,'highlight'))return;
      pageGraph.setItemState(e,'dim',true);
    });
  });

  // ---- 跳转到页面 tab 并定位 ----
  function goToPage(page){
    document.querySelector('.tab[data-tab="pages"]').click();
    var s = document.getElementById('pageSearch'); s.value = page; renderPageTable();
    setTimeout(function(){
      var row = document.querySelector('#pageTable tr.row[data-page="'+page.replace(/"/g,'&quot;')+'"]');
      if(row){ row.scrollIntoView({block:'center'}); row.click(); row.classList.add('search-hl'); setTimeout(function(){row.classList.remove('search-hl')},1500) }
    }, 60);
  }
  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-go]');
    if(t){ goToPage(t.getAttribute('data-go')) }
  });

  // ---- 孤岛 / 无入链 / 全局导航 列表 ----
  function fillList(id, arr){
    var h = arr.map(function(p){return '<a href="javascript:void(0)" data-go="'+p+'"><span class="lt-title">'+esc(titleFor(p)||'(无标题)')+'</span> <span class="small">'+p+'</span></a>'}).join('') || '<span class="small">无</span>';
    document.getElementById(id).innerHTML = h;
  }
  fillList('orphanList2', D.stats.orphanPages);
  fillList('contentOrphanList', D.stats.contentOrphanPages);
  fillList('notInNavList', D.stats.pagesNotInNav);
  fillList('contentNoNavList', D.stats.contentInboundNoNav);
  fillList('navNoContentList', D.stats.navInboundNoContent);
  fillList('noInList', D.stats.noInboundPages);
  var glHtml = D.globalLinks.map(function(g){
    return '<a href="javascript:void(0)" data-go="'+g.page+'"><span class="lt-title">'+esc(g.title||'(无标题)')+'</span> <span class="small">'+g.page+' ['+g.sources.join(', ')+']</span></a>';
  }).join('') || '<span class="small">无</span>';
  document.getElementById('globalNavList').innerHTML = glHtml;

  // top 列表
  function topHtml(arr){
    var max = Math.max.apply(null, arr.map(function(x){return x.count}));
    var h = '<table><thead><tr><th>标题</th><th>路径</th><th>数量</th><th></th></tr></thead><tbody>';
    arr.forEach(function(x){
      var t = titleFor(x.page) || '(无标题)';
      h += '<tr><td><a href="javascript:void(0)" data-go="'+x.page+'">'+esc(t)+'</a></td><td class="small">'+x.page+'</td><td>'+x.count+'</td><td><div class="bar" style="width:120px"><span style="width:'+(max?x.count/max*100:0)+'%"></span></div></td></tr>';
    });
    h += '</tbody></table>';
    return h;
  }
  document.getElementById('topIn').innerHTML = topHtml(D.stats.topInbound);
  document.getElementById('topOut').innerHTML = topHtml(D.stats.topOutbound);

  // 外链域名
  var eh = D.stats.externalHosts;
  var eMax = eh.length?eh[0].count:1;
  var ehH = '<table><thead><tr><th>域名</th><th>页面数</th><th></th></tr></thead><tbody>';
  eh.forEach(function(x){ ehH += '<tr><td>'+x.host+'</td><td>'+x.count+'</td><td><div class="bar" style="width:200px"><span style="width:'+x.count/eMax*100+'%"></span></div></td></tr>' });
  ehH += '</tbody></table>';
  document.getElementById('extHosts').innerHTML = ehH;

  window.addEventListener('resize', function(){
    if(secGraph){ secGraph.changeSize(document.getElementById('sectionGraph').clientWidth, 520) }
    if(pageGraph){ pageGraph.changeSize(document.getElementById('pageGraph').clientWidth, 620) }
  });
})();
</script>
</body>
</html>`;
}

main();
