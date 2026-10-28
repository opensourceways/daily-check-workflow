/*
 * MindSpore Portal — 站内内链分析器（Nuxt 3 适配版）
 *
 * 扫描 packages/website/pages 下全部 .vue 页面（Nuxt 文件路由）与
 * packages/website/content 下全部 .md 文章（@nuxt/content），
 * 提取页面/视图组件/通用组件（递归 import 链）/.content YAML/#content JSON 数据
 * 中的静态链接，调用线上 SIG 列表接口实例化 /sig/[id] 动态路由，
 * 按 /activities/[id] 分类配置实例化活动分类页，并在本地枚举
 * 列表页→文章页 的动态内链（替代线上 API 抓取），
 * 按 www.mindspore.cn 域名与站内绝对路径判定为内链，
 * 构建有向链接图，输出自包含 HTML 看板：
 *   - 总览统计卡片 + 板块级聚合关系图（G6 力导向）
 *   - 页面列表（上下游内链上钻/下钻表格）
 *   - 页面级关系图（G6 fruchterman，按板块过滤 + 搜索高亮）
 *   - 孤岛页面 / 关键数据
 *
 * MindSpore 双语路由模型（与 VitePress 前缀式完全不同）：
 *   - 中文页无前缀：/install、/sig
 *   - 英文页追加 /en 段：/install/en、/sig/en（物理独立 .vue 文件）
 *   - content 文章：/{type}/{lang}/{slug}，如 /news/zh/1039、/news/en/2026-1-1
 *   - 模板字符串模式：`/courses${isZh ? '' : '/en'}` → zh='' / en='/en' 两份展开
 *
 * 用法:  node scripts/internal-link-analyzer.mjs   （在 packages/website 下）
 *        node packages/website/scripts/internal-link-analyzer.mjs   （仓库根）
 * 产物:  internal-link-report.html（仓库根目录，自包含，浏览器直接打开）
 *
 * 环境变量:
 *   SKIP_API=1  跳过 SIG 列表 API 调用（离线模式，改用 .content/sig 的 sig_info）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEBSITE = path.resolve(__dirname, '..'); // packages/website
const ROOT = path.resolve(WEBSITE, '../..'); // 仓库根
const PAGES_DIR = path.join(WEBSITE, 'pages');
const CONTENT_MD_DIR = path.join(WEBSITE, 'content'); // @nuxt/content
const CONTENT_YAML_DIR = path.join(ROOT, '.content'); // #content/ YAML

const INTERNAL_DOMAINS = ['www.mindspore.cn', 'mindspore.cn'];
const SIG_API = 'https://www.mindspore.cn/api-magicapi/stat/sig/info?community=mindspore';
const SKIP_API = process.env.SKIP_API === '1';

const OUTPUT_HTML = path.join(ROOT, 'internal-link-report.html');

// 全局布局组件：由 layouts/default.vue 注入到所有页面（HeaderTheMain + AppFloat + AppFooter），
// 不在任何 pages/*.vue 的 import 链上，需单独处理。
// TheMain → data/header/menu.ts → public/header.json + docs-menu.json + ms-version.json
// AppFooter → data/footer/index.ts → data/config/index.ts
const GLOBAL_LAYOUT_COMPONENTS = [
  path.join(WEBSITE, 'components', 'header', 'TheMain.vue'),
  path.join(WEBSITE, 'components', 'header', 'SearchHeader.vue'), // layouts/search.vue 使用
  path.join(WEBSITE, 'components', 'AppFloat.vue'),
  path.join(WEBSITE, 'components', 'AppFooter.vue'),
];

// @nuxt/content 文章 catch-all 入口页映射（type → { lang → 入口 .vue 相对 pages 的路径 }）
// 由 queryContent 运行时取数渲染，静态扫描时将入口页组件链注入每篇文章。
const CONTENT_ENTRY_MAP = {
  news: {
    zh: 'news/[...slug].vue',
    en: 'news/en/[...slug].vue',
  },
  'technology-blogs': {
    zh: 'technology-blogs/[...slug].vue',
    en: 'technology-blogs/en/[...slug].vue',
  },
  version_updates: {
    zh: 'version-updates/[...slug].vue',
    en: 'version-updates/en/[...slug].vue',
  },
  // activities 无 en 版 catch-all，zh/en 共用
  activities: {
    zh: 'activities/[...slug].vue',
    en: 'activities/[...slug].vue',
  },
};

// 列表页 → 文章页动态内链（getNews 通过 queryContent 运行时查询，
// jumpLink = frontmatter.href || _path），本地枚举 content/ 目录补充这些边
const LIST_PAGE_MAP = [
  { listPage: '/news', type: 'news', lang: 'zh' },
  { listPage: '/news/en', type: 'news', lang: 'en' },
  { listPage: '/technology-blogs', type: 'technology-blogs', lang: 'zh' },
  { listPage: '/technology-blogs/en', type: 'technology-blogs', lang: 'en' },
  { listPage: '/version-updates', type: 'version-updates', lang: 'zh' },
  { listPage: '/version-updates/en', type: 'version-updates', lang: 'en' },
  { listPage: '/activities', type: 'activities', lang: 'zh' },
];

// SIG 详情页动态路由实例化：
//   pages/sig/[id]/index.vue → /sig/:id（alias /sig/:id/en）
//   SigList.vue 的 sigPath = `/sig/${encodeURIComponent(name)}${isZh ? '' : '/en'}`
//   静态扫描无法展开 ${name}，由 SIG 列表（API 或 .content/sig）实例化节点并补列表→详情边
const SIG_LIST_PAGES = [
  { listPage: '/sig', detailPrefix: '/sig', withEn: true },
];

// 视图组件递归扫描深度上限（避免无限递归 + 控制耗时）
const MAX_COMPONENT_DEPTH = 6;
// 被超过该数量页面引用的组件视为「结构性组件」
const SHARED_COMPONENT_THRESHOLD = 8;

/* ------------------------------------------------------------------ */
/* 基础工具                                                             */
/* ------------------------------------------------------------------ */

function readText(p) {
  try {
    return fs.readFileSync(p, 'utf-8');
  } catch {
    return '';
  }
}

function walkFiles(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, exts, out);
    } else if (entry.isFile() && exts.some((e) => entry.name.toLowerCase().endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 页面集合构建                                                         */
/* ------------------------------------------------------------------ */

// packages/website/pages/**/*.vue → 路由路径
//   pages/index.vue → /
//   pages/news/index.vue → /news
//   pages/news/en/index.vue → /news/en
//   pages/sig/[id]/index.vue → 动态路由（不生成静态节点）
function vueFileToPagePath(absPath) {
  let rel = path.relative(PAGES_DIR, absPath).replace(/\\/g, '/');
  rel = rel.replace(/\.vue$/i, '');
  if (rel === 'index') return '/';
  if (rel.endsWith('/index')) rel = rel.slice(0, -'/index'.length);
  return '/' + rel;
}

// packages/website/content/**/*.md → 路由路径
//   content/news/zh/1039.md → /news/zh/1039
function mdFileToPagePath(absPath) {
  const rel = path.relative(CONTENT_MD_DIR, absPath).replace(/\\/g, '/');
  return '/' + rel.replace(/\.md$/i, '');
}

// 是否英文路由（/install/en、/news/en/xxx）
function isEnPage(p) {
  return /\/en$/.test(p) || /\/en\//.test(p);
}

// definePageMeta({ title: { zh: '新闻', en: 'News' } }) → 双语标题
function extractDefinePageMetaTitle(content) {
  const metaMatch = content.match(/definePageMeta\(\{([\s\S]*?)\}\)/);
  if (!metaMatch) return { zh: '', en: '' };
  const meta = metaMatch[1];
  const objMatch = meta.match(
    /title:\s*\{\s*zh:\s*['"`]([^'"`]*)['"`]\s*,\s*en:\s*['"`]([^'"`]*)['"`]/
  );
  if (objMatch) return { zh: objMatch[1], en: objMatch[2] };
  const strMatch = meta.match(/title:\s*['"`]([^'"`]*)['"`]/);
  if (strMatch) return { zh: strMatch[1], en: strMatch[1] };
  return { zh: '', en: '' };
}

// .md frontmatter → { title, href, type }
function parseMdFrontmatter(content) {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return {};
  try {
    const doc = yaml.load(fmMatch[1]);
    return doc && typeof doc === 'object' ? doc : {};
  } catch {
    return {};
  }
}

/* ------------------------------------------------------------------ */
/* 链接规范化与分类                                                      */
/* ------------------------------------------------------------------ */

// 候选链接规范化：去 hash/query、去 .html、去尾 index
function canonicalizeUrl(raw) {
  let u = raw.trim();
  u = u.split('#')[0];
  u = u.split('?')[0];
  u = u.replace(/\.html$/i, '');
  u = u.replace(/\/index$/i, '/');
  if (!u.startsWith('/')) u = '/' + u;
  if (u !== '/' && u.endsWith('/')) u = u.slice(0, -1);
  return u;
}

// 解析一条原始链接，返回 { type, target }
// type: 'internal' | 'external' | 'asset' | 'anchor' | 'other'
function classifyLink(raw, currentPagePath) {
  const url = raw.trim();
  if (!url) return { type: 'other', target: '' };

  if (url.startsWith('#')) return { type: 'anchor', target: url };
  if (/^(mailto:|tel:|javascript:|data:|blob:)/i.test(url)) return { type: 'other', target: url };
  if (url.startsWith('//')) return { type: 'external', target: url };

  const protoMatch = url.match(/^([a-z]+:)\/\//i);
  if (protoMatch) {
    const rest = url.slice(protoMatch[0].length);
    const slashIdx = rest.indexOf('/');
    const host = slashIdx === -1 ? rest : rest.slice(0, slashIdx);
    const pathPart = slashIdx === -1 ? '' : rest.slice(slashIdx);
    if (INTERNAL_DOMAINS.includes(host)) {
      return { type: 'internal', target: pathPart || '/' };
    }
    return { type: 'external', target: url };
  }

  // 站内绝对路径 /xx
  if (url.startsWith('/')) {
    // 资源类后缀判定为 asset
    if (/\.(png|jpe?g|gif|svg|webp|ico|bmp|mp4|mp3|pdf|zip|tar|gz|rar|7z|iso|rpm|deb|exe|msi|pkg|woff2?|ttf|otf|eot|css|js|json|yaml|yml|xml|txt|csv|docx?|xlsx?|pptx?|md)$/i.test(url)) {
      return { type: 'asset', target: url };
    }
    return { type: 'internal', target: url };
  }

  // 相对路径 ./xx ../xx xx
  if (url.startsWith('./') || url.startsWith('../') || !url.includes('://')) {
    const resolved = path.posix.normalize(
      path.posix.join(currentPagePath.replace(/\/[^/]*$/, '') + '/', url)
    );
    if (/\.(png|jpe?g|gif|svg|webp|ico|bmp|mp4|mp3|pdf|zip|css|js|woff2?|ttf|otf|eot)$/i.test(resolved)) {
      return { type: 'asset', target: resolved };
    }
    if (resolved.startsWith('/')) return { type: 'internal', target: resolved };
    return { type: 'other', target: resolved };
  }

  return { type: 'other', target: url };
}

// 清洗单条原始链接：去包裹引号/反引号、首尾空白
function cleanRawLink(raw) {
  let s = String(raw).trim();
  if (
    (s.startsWith('`') && s.endsWith('`')) ||
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  s = s.replace(/`/g, '');
  return s;
}

/* ------------------------------------------------------------------ */
/* 链接提取（vue / ts / js / md 文本）                                    */
/* ------------------------------------------------------------------ */

function extractRawLinks(content) {
  const links = [];
  let m;
  // 1. Markdown 链接 [text](url) —— 跳过图片 ![alt](url)
  const mdLinkRe = /(^|[^!])\[(?:[^\]]*)\]\(([^)]+)\)/g;
  while ((m = mdLinkRe.exec(content)) !== null) {
    let url = cleanRawLink(m[2]);
    url = url.split(/\s+/)[0];
    if (url) links.push(url);
  }
  // 2. HTML href="..." / href='...'
  const hrefRe = /href\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  while ((m = hrefRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1] ?? m[2] ?? '');
    if (url) links.push(url);
  }
  // 2b. TS/JS 对象属性 href: '...' / url: '...' / path: '...' / link: '...' / to: '...'
  const objPropRe = /(?:href|url|path|link|to)\s*:\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/gi;
  while ((m = objPropRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1] ?? m[2] ?? m[3] ?? '');
    if (url) links.push(url);
  }
  // 3. NuxtLink :to / router.push / router.go / navigateTo / window.open / location.href
  const toRe =
    /(?::to|\.push|\.go|navigateTo|window\.open|location\.href)\s*[(=]?\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/gi;
  while ((m = toRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1] ?? m[2] ?? m[3] ?? '');
    if (url) links.push(url);
  }
  // 3b. 三元表达式双值：isZh ? '/calendar' : '/calendar/en' —— 两个分支都收集（噪音由 classify 过滤）
  const ternaryRe =
    /\?\s*(['"`])((?:(?!\1)[\s\S])*)\1\s*:\s*(['"`])((?:(?!\3)[\s\S])*)\3/g;
  while ((m = ternaryRe.exec(content)) !== null) {
    const a = cleanRawLink(m[2]);
    const b = cleanRawLink(m[4]);
    if (a) links.push(a);
    if (b) links.push(b);
  }
  // 3c. return `...`（computed 返回值，仅匹配疑似路由的）
  const returnRe = /return\s+`((?:\/[^`]*|https?:\/\/[^`]*|\$\{[^}]*\}\/[^`]*))`/g;
  while ((m = returnRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1]);
    if (url) links.push(url);
  }
  // 4. 裸 URL（行内 https://...）
  const bareRe = /(?:^|[\s(])(https?:\/\/[^\s)<"'`，。、；！？）】]+)/g;
  while ((m = bareRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1]).replace(/[.,;:!?）】]+$/, '');
    if (url) links.push(url);
  }
  return links;
}

// 模板字符串链接展开（MindSpore 双语模式）
//   `/courses${isZh ? '' : '/en'}`        → /courses + /courses/en
//   `/developers${isEn ? '/en' : ''}`      → /developers + /developers/en
//   `${locale.value === 'zh' ? '' : '/en'}` → 同上
//   `/online-showroom/detail?category=${item.type}` → 路径静态，丢弃含运行时变量的 query
// 路径部分含其它运行时变量（${item.path} 等）的模板无法静态展开，跳过
function expandTemplateLinks(rawLinks) {
  const out = [];
  for (let l of rawLinks) {
    // 站内主域名环境变量 → 空串（剩余为站内路径）
    l = l.replace(/\$\{import\.meta\.env\.VITE_MINDSPORE_URL\}/g, '');
    if (/\$\{import\.meta\.env\./.test(l)) continue; // 其它 env 变量（外链系统），跳过
    // 拆分 query/hash：路径部分静态展开，query 含运行时变量则仅取路径
    const qIdx = l.search(/[?#]/);
    const pathPart = qIdx > -1 ? l.slice(0, qIdx) : l;
    if (!pathPart.includes('${')) {
      out.push(pathPart);
      continue;
    }
    // locale 相关模板变量（isZh/isEn/locale/lang 三元）
    const localeVarRe = /\$\{[^}]*(?:isZh|isEn|locale|lang)[^}]*\}/gi;
    if (localeVarRe.test(pathPart)) {
      const rest = pathPart.replace(localeVarRe, '');
      if (rest.includes('${')) continue; // 路径还混有其它运行时变量
      out.push(pathPart.replace(localeVarRe, ''));
      out.push(pathPart.replace(localeVarRe, '/en'));
      continue;
    }
    // 路径含其它模板变量（${item.path} 等运行时数据）→ 跳过
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* YAML / JSON 数据链接提取                                              */
/* ------------------------------------------------------------------ */

// .content/ YAML 中可能含 URL 的字段名（实测 mindspore-portal 全量盘点 + 通用补充）
const URL_FIELD_RE =
  /^(href|url|link|link1|path|_path|btn_link|code_link|file_link|live_url|html_url|video_url|videoUrl|sig_repo|repo|etherpad|replay_link|replayLink|apply_link|applyLink|apply_event|applyEvent|home_page|homePage|htmlPage|html_page|ppt_link|pptLink|contribution_detail_link|contributionDetailLink|customHref|shortcut|jump_link|jumpLink)$/;

function isUrlLikeValue(v) {
  return typeof v === 'string' && /^(https?:\/\/|\/|mailto:)/i.test(v.trim()) && v.trim().length > 1;
}

// 递归遍历 YAML/JSON 树，收集 URL 字段值（支持 {zh, en} 双语对象）
function collectLinksFromTree(node, acc) {
  if (Array.isArray(node)) {
    for (const item of node) collectLinksFromTree(item, acc);
    return;
  }
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (URL_FIELD_RE.test(key)) {
        if (typeof value === 'string') {
          if (isUrlLikeValue(value)) acc.push(value.trim());
        } else if (value && typeof value === 'object') {
          // { zh: '/install', en: '/install/en' }
          for (const v of Object.values(value)) {
            if (typeof v === 'string' && isUrlLikeValue(v)) acc.push(v.trim());
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        collectLinksFromTree(value, acc);
      } else if (typeof value === 'string' && /<a\s+href=/i.test(value)) {
        // 富文本字段（detail/desc 等）内嵌 HTML 链接
        const hrefRe = /href\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
        let m;
        while ((m = hrefRe.exec(value)) !== null) {
          const url = cleanRawLink(m[1] ?? m[2] ?? '');
          if (url) acc.push(url);
        }
      }
    }
  }
}

function extractYamlLinks(file) {
  const content = readText(file);
  if (!content) return [];
  try {
    const doc = yaml.load(content);
    const acc = [];
    collectLinksFromTree(doc, acc);
    return acc;
  } catch {
    return [];
  }
}

function extractJsonLinks(file) {
  const content = readText(file);
  if (!content) return [];
  try {
    const doc = JSON.parse(content);
    const acc = [];
    collectLinksFromTree(doc, acc);
    return acc;
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* import 解析与组件递归扫描                                              */
/* ------------------------------------------------------------------ */

function resolveFile(base, rel) {
  rel = rel.replace(/\\/g, '/');
  if (/\.(png|jpe?g|gif|svg|webp|ico|bmp|mp4|mp3|css|scss|less|woff2?|ttf|otf|eot)$/i.test(rel)) {
    return null; // 静态资源
  }
  const candidates = [
    path.join(base, rel),
    path.join(base, rel + '.vue'),
    path.join(base, rel + '.ts'),
    path.join(base, rel + '.js'),
    path.join(base, rel + '.mjs'),
    path.join(base, rel + '.json'),
    path.join(base, rel + '.md'),
    path.join(base, rel + '.yaml'),
    path.join(base, rel, 'index.vue'),
    path.join(base, rel, 'index.ts'),
    path.join(base, rel, 'index.js'),
  ];
  for (const c of candidates) {
    try {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
    } catch {
      // ignore
    }
  }
  return null;
}

// 解析 import 说明符到文件路径 / YAML 文件路径数组（#content/ 目录聚合）
function resolveImport(spec, fromFile) {
  spec = spec.split('?')[0].trim(); // 去掉 ?raw / ?url 等后缀
  if (!spec) return null;
  if (spec.startsWith('~icons/') || spec.startsWith('unplugin-icons')) return null;
  if (spec.startsWith('/')) return null; // public/ 静态资源

  // #content/xxx → .content/xxx/ 目录下全部 yaml（OPlusYamlContentVitePlugin 按文件名聚合）
  if (spec.startsWith('#content/')) {
    const rel = spec.slice('#content/'.length);
    const dir = path.join(CONTENT_YAML_DIR, rel);
    try {
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        const files = fs
          .readdirSync(dir)
          .filter((f) => /\.ya?ml$/.test(f))
          .sort()
          .map((f) => path.join(dir, f));
        return files.length > 0 ? files : null;
      }
    } catch {
      // ignore
    }
    const direct = resolveFile(CONTENT_YAML_DIR, rel);
    return direct;
  }

  // @/ ~/ → packages/website；~~/ @@/ → 仓库根
  if (spec.startsWith('@/')) return resolveFile(WEBSITE, spec.slice(2));
  if (spec.startsWith('~/')) return resolveFile(WEBSITE, spec.slice(2));
  if (spec.startsWith('~~/')) return resolveFile(ROOT, spec.slice(3));
  if (spec.startsWith('@@/')) return resolveFile(ROOT, spec.slice(3));

  // shared/xxx → packages/shared/xxx
  if (spec.startsWith('shared/')) return resolveFile(path.join(ROOT, 'packages'), spec);

  if (spec.startsWith('.')) return resolveFile(path.dirname(fromFile), spec);

  // 裸包导入（跳过）
  return null;
}

function parseImports(content) {
  const specs = [];
  // import ... from '...' / import '...'
  const importRe = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  let m;
  while ((m = importRe.exec(content)) !== null) specs.push(m[1]);
  // export ... from '...'（re-export，如 data/header/index.ts 的 export * from './menu'）
  const exportRe = /export\s+(?:\*(?:\s+as\s+[\w$]+)?|(?:[\w$]+(?:\s*,\s*[\w$]+)*|{[^}]*}))\s+from\s*['"]([^'"]+)['"]/g;
  while ((m = exportRe.exec(content)) !== null) specs.push(m[1]);
  // 动态 import('...')
  const dynamicRe = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((m = dynamicRe.exec(content)) !== null) specs.push(m[1]);
  return specs;
}

// 递归扫描组件/数据文件，收集静态链接 + import 的组件使用统计
// 入口结果缓存（content 文章共享 catch-all 入口组件链）
const componentScanCache = new Map(); // entryFile -> { links: string[] }
const componentUsage = new Map(); // component absPath -> Set(entryFile) 引用该组件的入口集合

function scanComponentEntry(entryFile) {
  if (componentScanCache.has(entryFile)) return componentScanCache.get(entryFile);
  const links = [];
  const visited = new Set();
  scanComponent(entryFile, 0, visited, links);
  // 记录组件被哪些入口引用（结构性组件判定用）
  for (const comp of visited) {
    if (comp === entryFile) continue;
    const usage = componentUsage.get(comp) || new Set();
    usage.add(entryFile);
    componentUsage.set(comp, usage);
  }
  componentScanCache.set(entryFile, { links });
  return { links };
}

// Nuxt 组件自动导入：components/ 目录下组件在模板中直接使用（无 import 语句），
// 必须建立 标签名 → 文件 映射，否则会漏掉绝大多数组件内链。
// 命名规则（Nuxt 默认 pathPrefix: true）：
//   components/home/Banner.vue           → <HomeBanner>
//   components/header/TheMain.vue        → <HeaderTheMain>
//   components/home/calendar/HomeCalendar.vue → <HomeCalendar>（文件名已含目录前缀时去重）
let autoImportComponentIndex = null;

function pascalCase(s) {
  return s
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join('');
}

function buildAutoImportComponentIndex() {
  const index = new Map(); // PascalCase 标签名 -> 文件
  const bareFiles = new Map(); // 裸文件名 -> Set(文件)，用于歧义检测
  const compRoot = path.join(WEBSITE, 'components');
  for (const f of walkFiles(compRoot, ['.vue'])) {
    const rel = path.relative(compRoot, f).replace(/\\/g, '/');
    const segments = rel.replace(/\.vue$/i, '').split('/');
    let fileName = segments.pop();
    if (fileName.toLowerCase() === 'index' && segments.length > 0) {
      fileName = segments.pop(); // components/home/Zone/index.vue → HomeZone
    }
    const prefix = segments.map(pascalCase).join('');
    const name = pascalCase(fileName);
    const prefixed =
      prefix && !name.toLowerCase().startsWith(prefix.toLowerCase()) ? prefix + name : name;
    if (!index.has(prefixed)) index.set(prefixed, f);
    if (!bareFiles.has(name)) bareFiles.set(name, new Set());
    bareFiles.get(name).add(f);
  }
  // 裸名（无目录前缀的文件名）仅在全库唯一且未与前缀名冲突时注册
  for (const [name, files] of bareFiles) {
    if (files.size === 1 && !index.has(name)) index.set(name, [...files][0]);
  }
  return index;
}

function getAutoImportComponentIndex() {
  if (!autoImportComponentIndex) autoImportComponentIndex = buildAutoImportComponentIndex();
  return autoImportComponentIndex;
}

// 提取 .vue 模板中使用的组件标签（PascalCase + kebab-case），解析自动导入组件
function extractTemplateComponentTags(content) {
  const tags = new Set();
  const tagRe = /<\/?([A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*-[a-z0-9-]+)/g;
  let m;
  while ((m = tagRe.exec(content)) !== null) {
    tags.add(pascalCase(m[1]));
  }
  return tags;
}

function scanComponent(absPath, depth, visited, accLinks) {
  if (!absPath || visited.has(absPath)) return;
  visited.add(absPath);

  if (absPath.endsWith('.yaml') || absPath.endsWith('.yml')) {
    for (const l of extractYamlLinks(absPath)) accLinks.push(l);
    return;
  }
  if (absPath.endsWith('.json')) {
    for (const l of extractJsonLinks(absPath)) accLinks.push(l);
    return;
  }

  const content = readText(absPath);
  if (!content) return;

  if (absPath.endsWith('.md')) {
    // .md?raw 数据文件（如 sig-meeting-guide.md）
    for (const l of extractRawLinks(content)) accLinks.push(l);
    return;
  }

  // .vue / .ts / .js / .mjs
  for (const l of extractRawLinks(content)) accLinks.push(l);
  if (depth >= MAX_COMPONENT_DEPTH) return;
  for (const spec of parseImports(content)) {
    const child = resolveImport(spec, absPath);
    if (Array.isArray(child)) {
      for (const c of child) scanComponent(c, depth + 1, visited, accLinks);
    } else if (child) {
      scanComponent(child, depth + 1, visited, accLinks);
    }
  }
  // Nuxt 组件自动导入：模板标签 → components/ 文件
  if (absPath.endsWith('.vue')) {
    const idx = getAutoImportComponentIndex();
    for (const tag of extractTemplateComponentTags(content)) {
      const child = idx.get(tag);
      if (child) scanComponent(child, depth + 1, visited, accLinks);
    }
  }
}

/* ------------------------------------------------------------------ */
/* 板块与统计                                                            */
/* ------------------------------------------------------------------ */

// 页面 → 板块（路径第一段；/ 为首页）
//   /news/zh/1039 → /news/；/install/en → /install/；/ → /
function pageToSection(pagePath) {
  const parts = pagePath.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  return '/' + parts[0] + '/';
}

/* ------------------------------------------------------------------ */
/* SIG 列表获取（API 优先，SKIP_API 时用 .content/sig）                    */
/* ------------------------------------------------------------------ */

async function fetchSigNames() {
  if (SKIP_API) {
    console.log('│ 跳过 SIG API 调用（SKIP_API=1），使用 .content/sig 的 sig_info');
    try {
      const doc = yaml.load(readText(path.join(CONTENT_YAML_DIR, 'sig', 'zh.yaml')));
      const names = (doc?.sig_info || []).map((s) => s?.name).filter(Boolean);
      return names;
    } catch {
      return [];
    }
  }
  try {
    const res = await fetch(SIG_API, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (Array.isArray(json?.data)) {
      return json.data.map((s) => s?.name).filter(Boolean);
    }
    return [];
  } catch (e) {
    console.warn(`│ SIG API 调用失败：${e.message}，回退 .content/sig`);
    try {
      const doc = yaml.load(readText(path.join(CONTENT_YAML_DIR, 'sig', 'zh.yaml')));
      return (doc?.sig_info || []).map((s) => s?.name).filter(Boolean);
    } catch {
      return [];
    }
  }
}

/* ------------------------------------------------------------------ */
/* 主流程                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  const t0 = Date.now();

  /* ---------- 1. 收集页面 ---------- */
  const pages = []; // { entryFiles: string[], pagePath, source, mdFile? }
  const pageSet = new Set();
  const dynamicRoutes = [];

  function addPage(pagePath, entryFiles, source, mdFile) {
    if (pageSet.has(pagePath)) return;
    pageSet.add(pagePath);
    pages.push({ pagePath, entryFiles, source, mdFile });
  }

  // 1a. 静态路由 pages/**/*.vue
  for (const f of walkFiles(PAGES_DIR, ['.vue'])) {
    const pagePath = vueFileToPagePath(f);
    if (/\[[^\]]+\]/.test(pagePath)) {
      dynamicRoutes.push({ file: path.relative(ROOT, f), template: pagePath });
      continue;
    }
    addPage(pagePath, [f], 'vue');
  }

  // 1b. @nuxt/content 文章 content/**/*.md
  for (const f of walkFiles(CONTENT_MD_DIR, ['.md'])) {
    const pagePath = mdFileToPagePath(f);
    // /news/zh/1039 → 入口 news/[...slug].vue
    const parts = pagePath.split('/').filter(Boolean); // [news, zh, 1039]
    const type = parts[0];
    const lang = parts[1] === 'en' ? 'en' : 'zh';
    const entryRel = CONTENT_ENTRY_MAP[type]?.[lang] || CONTENT_ENTRY_MAP[type]?.zh;
    const entryFile = entryRel ? path.join(PAGES_DIR, entryRel) : null;
    const entryFiles = [];
    if (entryFile && fs.existsSync(entryFile)) entryFiles.push(entryFile);
    addPage(pagePath, entryFiles, 'content', f);
  }

  // 1c. SIG 详情动态路由实例化
  const sigNames = await fetchSigNames();
  const sigEntryZh = path.join(PAGES_DIR, 'sig', '[id]', 'index.vue');
  const sigEntryEn = path.join(PAGES_DIR, 'sig', '[id]', 'en', 'index.vue');
  for (const name of sigNames) {
    const slug = encodeURIComponent(name);
    if (fs.existsSync(sigEntryZh)) addPage(`/sig/${slug}`, [sigEntryZh], 'sig');
    if (fs.existsSync(sigEntryEn)) addPage(`/sig/${slug}/en`, [sigEntryEn], 'sig');
  }

  // 1d. 活动分类页 /activities/[id] ← .content/activities event_series
  try {
    const actDoc = yaml.load(readText(path.join(CONTENT_YAML_DIR, 'activities', 'zh.yaml')));
    const seriesIds = (actDoc?.event_series || []).map((s) => s?.id).filter(Boolean);
    const catEntry = path.join(PAGES_DIR, 'activities', '[id].vue');
    for (const id of seriesIds) {
      if (fs.existsSync(catEntry)) addPage(`/activities/${id}`, [catEntry], 'activity-cat');
    }
  } catch {
    console.warn('│ 活动分类页实例化失败（.content/activities/zh.yaml 解析异常）');
  }

  // 页面查找：兼容尾斜杠 / .html / index
  function findPage(candidate) {
    if (!candidate) return null;
    const c = canonicalizeUrl(candidate);
    if (pageSet.has(c)) return c;
    if (pageSet.has(c + '/')) return c + '/';
    return null;
  }

  /* ---------- 2. 提取每页链接 ---------- */
  const downstream = new Map(); // pagePath -> Set(pagePath)
  const edgeMeta = new Map(); // "from→to" -> Set(source)
  const externalLinks = new Map(); // pagePath -> Set(host)

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

  function addExternal(pagePath, raw) {
    try {
      const u = new URL(raw.startsWith('//') ? 'https:' + raw : raw);
      const ext = externalLinks.get(pagePath) || new Set();
      ext.add(u.host);
      externalLinks.set(pagePath, ext);
    } catch {
      // ignore
    }
  }

  // 处理单页的原始链接集（分类 + 建边 + 外链记录）
  function processRawLinks(pagePath, rawLinks, sourceLabel) {
    for (const raw of expandTemplateLinks(rawLinks)) {
      const cls = classifyLink(raw, pagePath);
      if (cls.type === 'internal') {
        const target = findPage(cls.target);
        if (target) addEdge(pagePath, target, sourceLabel);
      } else if (cls.type === 'external') {
        addExternal(pagePath, raw);
      }
    }
  }

  for (const { pagePath, entryFiles, source, mdFile } of pages) {
    // 入口组件链（pages vue / catch-all / 动态路由实例），memo 化
    for (const entry of entryFiles) {
      const { links } = scanComponentEntry(entry);
      processRawLinks(pagePath, links, path.relative(ROOT, entry));
    }
    // content 文章：正文 + frontmatter
    if (source === 'content' && mdFile) {
      const content = readText(mdFile);
      const raw = extractRawLinks(content);
      const fm = parseMdFrontmatter(content);
      if (typeof fm.href === 'string' && fm.href) raw.push(fm.href); // activities 跳转链接
      processRawLinks(pagePath, raw, path.relative(ROOT, mdFile));
    }
  }

  /* ---------- 2.5 全局布局组件（全局导航，不注入每页出边） ---------- */
  const globalLinkTargets = new Set();
  const globalLinkSources = new Map();
  for (const comp of GLOBAL_LAYOUT_COMPONENTS) {
    if (!fs.existsSync(comp)) continue;
    const { links } = scanComponentEntry(comp);
    const compName = path.basename(comp);
    for (const raw of expandTemplateLinks(links)) {
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

  /* ---------- 2.6 列表页 → 文章页动态内链（本地枚举） ---------- */
  for (const { listPage, type, lang } of LIST_PAGE_MAP) {
    if (!pageSet.has(listPage)) continue;
    const dir = path.join(CONTENT_MD_DIR, type, lang);
    for (const f of walkFiles(dir, ['.md'])) {
      const articlePage = mdFileToPagePath(f);
      const content = readText(f);
      const fm = parseMdFrontmatter(content);
      // jumpLink = frontmatter.href || _path
      let target = articlePage;
      if (typeof fm.href === 'string' && fm.href && /^(https?:\/\/www\.mindspore\.cn|\/)/.test(fm.href)) {
        const cls = classifyLink(fm.href, articlePage);
        if (cls.type === 'internal') {
          const found = findPage(cls.target);
          if (found) target = found;
          else continue; // href 指向站外/非页面（如部署挂载的文档路径），列表不链接到文章页本身
        } else {
          continue; // 纯外链活动
        }
      }
      addEdge(listPage, target, '(queryContent: ' + type + '/' + lang + ')');
    }
  }

  /* ---------- 2.7 SIG 列表页 → SIG 详情页 ---------- */
  for (const { listPage, withEn } of SIG_LIST_PAGES) {
    if (!pageSet.has(listPage)) continue;
    for (const name of sigNames) {
      const slug = encodeURIComponent(name);
      if (pageSet.has(`/sig/${slug}`)) {
        addEdge(listPage, `/sig/${slug}`, '(SIG API)');
      }
      if (withEn && pageSet.has(`/sig/${slug}/en`)) {
        addEdge(`${listPage}/en`, `/sig/${slug}/en`, '(SIG API)');
      }
    }
  }

  /* ---------- 2.8 标题 ---------- */
  const titleMap = new Map();
  for (const { pagePath, entryFiles, source, mdFile } of pages) {
    if (source === 'content' && mdFile) {
      const fm = parseMdFrontmatter(readText(mdFile));
      if (fm.title) titleMap.set(pagePath, String(fm.title));
    } else if (source === 'sig') {
      const raw = decodeURIComponent(pagePath.replace(/^\/sig\//, '').replace(/\/en$/, ''));
      titleMap.set(pagePath, `SIG：${raw}`);
    } else {
      const content = entryFiles[0] ? readText(entryFiles[0]) : '';
      const titles = extractDefinePageMetaTitle(content);
      const t = isEnPage(pagePath) ? titles.en : titles.zh;
      if (t) titleMap.set(pagePath, t);
    }
  }

  /* ---------- 3. 上游内链 ---------- */
  const upstream = new Map();
  for (const [from, outs] of downstream) {
    for (const to of outs) {
      const ins = upstream.get(to) || new Set();
      ins.add(from);
      upstream.set(to, ins);
    }
  }

  /* ---------- 4. 统计 ---------- */
  const stats = {
    totalPages: pages.length,
    dynamicRouteTemplates: dynamicRoutes.length,
    pagesWithOutbound: downstream.size,
    pagesWithInbound: upstream.size,
    totalEdges: 0,
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
    externalHosts: {},
    sectionStats: {},
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

  stats.topInbound = [...upstream.entries()]
    .map(([p, s]) => ({ page: p, count: s.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  stats.topOutbound = [...downstream.entries()]
    .map(([p, s]) => ({ page: p, count: s.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const hostCount = new Map();
  for (const hosts of externalLinks.values()) {
    for (const h of hosts) hostCount.set(h, (hostCount.get(h) || 0) + 1);
  }
  stats.externalHosts = [...hostCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([h, c]) => ({ host: h, count: c }));

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
      const fromStat = sectionMap.get(fromSec);
      const toStat = sectionMap.get(toSec);
      if (fromStat) fromStat.outDeg++;
      if (toStat) toStat.inDeg++;
      if (fromSec === toSec && fromStat) fromStat.internal++;
    }
  }
  stats.sectionStats = [...sectionMap.values()].sort((a, b) => b.pages - a.pages);

  /* ---------- 5. 序列化 ---------- */
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

  const sectionEdges = [];
  const secEdgeMap = new Map();
  for (const [from, outs] of downstream) {
    const fromSec = pageToSection(from);
    for (const to of outs) {
      const toSec = pageToSection(to);
      const k = fromSec + '\u0001' + toSec;
      secEdgeMap.set(k, (secEdgeMap.get(k) || 0) + 1);
    }
  }
  for (const [k, w] of secEdgeMap) {
    const [from, to] = k.split('\u0001');
    sectionEdges.push({ from, to, weight: w });
  }

  // 结构性组件判定（被超过 SHARED_COMPONENT_THRESHOLD 个入口引用的组件）
  const structuralComponents = [...componentUsage.entries()]
    .filter(([, entries]) => entries.size > SHARED_COMPONENT_THRESHOLD)
    .map(([c]) => path.relative(ROOT, c))
    .sort();

  const payload = {
    generatedAt: new Date().toISOString(),
    elapsedMs: Date.now() - t0,
    stats,
    sections: stats.sectionStats,
    sectionEdges,
    pages: pageRecords,
    edges,
    dynamicRoutes,
    structuralComponents,
    sigPages: sigNames.length * 2,
    globalLinks: [...globalLinkTargets].sort().map((p) => ({
      page: p,
      title: titleMap.get(p) || '',
      sources: [...new Set(globalLinkSources.get(p) || [])],
    })),
  };

  /* ---------- 6. 写出 HTML ---------- */
  const html = buildHtml(payload);
  fs.writeFileSync(OUTPUT_HTML, html, 'utf-8');

  // 控制台摘要
  console.log('┌──────────────────────────────────────────────────┐');
  console.log('│ MindSpore 站内内链分析完成');
  console.log('├──────────────────────────────────────────────────┤');
  console.log('│ 页面总数          :', String(stats.totalPages).padStart(8));
  console.log('│   - vue 静态路由   :', String(pages.filter((p) => p.source === 'vue').length).padStart(8));
  console.log('│   - content 文章   :', String(pages.filter((p) => p.source === 'content').length).padStart(8));
  console.log('│   - SIG 详情页     :', String(pages.filter((p) => p.source === 'sig').length).padStart(8));
  console.log('│   - 活动分类页     :', String(pages.filter((p) => p.source === 'activity-cat').length).padStart(8));
  console.log('│ 动态路由模板       :', String(stats.dynamicRouteTemplates).padStart(8));
  console.log('│ 内链边总数         :', String(stats.totalEdges).padStart(8));
  console.log('│ 有出链页面         :', String(stats.pagesWithOutbound).padStart(8));
  console.log('│ 有入链页面         :', String(stats.pagesWithInbound).padStart(8));
  console.log('├──────────────────────────────────────────────────┤');
  console.log('│ 孤岛页面           :', String(stats.orphanPages.length).padStart(8));
  console.log('│ 仅导航页面         :', String(stats.contentOrphanPages.length).padStart(8));
  console.log('│ 内容强·入口弱      :', String(stats.contentInboundNoNav.length).padStart(8));
  console.log('│ 导航有·内容无      :', String(stats.navInboundNoContent.length).padStart(8));
  console.log('│ 全局导航覆盖页     :', String(stats.globalLinkPages).padStart(8));
  console.log('├──────────────────────────────────────────────────┤');
  console.log('│ 报告已生成:', OUTPUT_HTML);
  console.log('└──────────────────────────────────────────────────┘');
}

/* ------------------------------------------------------------------ */
/* HTML 报告构建                                                        */
/* ------------------------------------------------------------------ */
function buildHtml(payload) {
  const json = JSON.stringify(payload);
  const sections = payload.sections;
  const sectionEdges = payload.sectionEdges;
  const stats = payload.stats;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );

  const cards = [
    { label: '页面总数', value: stats.totalPages, sub: `动态路由模板 ${stats.dynamicRouteTemplates}` },
    {
      label: '内链边总数',
      value: stats.totalEdges,
      sub: `平均每页 ${(stats.totalEdges / Math.max(stats.totalPages, 1)).toFixed(2)} 条`,
    },
    { label: '孤岛页面', value: stats.orphanPages.length, sub: '无内容链且未入导航', cls: 'danger' },
    { label: '未进入导航', value: stats.pagesNotInNav.length, sub: '全局导航未覆盖', cls: 'warn' },
    { label: '内容强·入口弱', value: stats.contentInboundNoNav.length, sub: '有内容入链·无导航', cls: 'warn' },
    { label: '导航覆盖页', value: stats.globalLinkPages, sub: '在全局导航中', cls: 'ok' },
  ];

  const sectionOptions = sections
    .map((s) => `<option value="${esc(s.section)}">${esc(s.section)} (${s.pages})</option>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>MindSpore 站内内链看板</title>
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
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:20px}
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
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <h1>MindSpore 站内内链看板</h1>
    <span class="muted">分析 <code>packages/website/pages</code> + <code>packages/website/content</code> 全部页面 · 内链域名 www.mindspore.cn</span>
    <span class="muted" id="genAt"></span>
  </header>

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
        <input id="pageSearch" placeholder="搜索标题或路径（如 /news/）" style="width:280px" />
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
        <div class="tip">搜索高亮节点与其邻居 · 双击节点定位上下游</div>
      </div>
    </div>
  </section>

  <!-- 孤岛 / 关键数据 -->
  <section id="tab-orphan" class="tabc hidden">
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
      <h2>全局导航覆盖页面（在 TheMain/AppFooter/AppFloat/SearchHeader 的链接中）<span class="small"> · ${stats.globalLinkPages} 页</span></h2>
      <div class="linklist" id="globalNavList"></div>
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
      <h2>动态路由模板（未纳入图）</h2>
      <div class="linklist" id="dynRoutes"></div>
    </div>
    <div class="panel" style="margin-top:16px">
      <h2>说明与方法论</h2>
      <ul class="small">
        <li>页面来源：<code>packages/website/pages</code> 全部 <code>.vue</code>（Nuxt 文件路由，中英文物理双份文件，英文路由为 <code>/xxx/en</code> 后缀式）、<code>packages/website/content</code> 全部 <code>.md</code>（@nuxt/content 文章，路由形如 <code>/news/zh/1039</code>）、SIG 详情页（线上 SIG API 实例化 <code>/sig/{name}</code> 与 <code>/sig/{name}/en</code>）、活动分类页（<code>.content/activities</code> event_series 实例化 <code>/activities/{id}</code>）。</li>
        <li>链接提取：Markdown <code>[text](url)</code>、HTML <code>href</code>、<code>NuxtLink :to</code>、<code>router.push</code>、<code>navigateTo</code>、三元双值（<code>isZh ? '/a' : '/a/en'</code>）、裸 URL，以及页面 → views → components import 链（递归 6 层）中引用的 <code>.content/</code> YAML（<code>#content/</code> 虚拟模块）与 JSON 数据（<code>public/header.json</code>、<code>docs-menu.json</code>、<code>ms-version.json</code>）。</li>
        <li>双语模板展开：<code>/courses\${isZh ? '' : '/en'}</code> 一类模板按 zh（空）与 en（<code>/en</code>）展开为两条链接；含 <code>\${item.path}</code> 等运行时变量的模板跳过，由动态枚举逻辑补充。</li>
        <li>列表页 → 文章页：<code>getNews</code> 通过 <code>queryContent</code> 本地查询，分析器直接枚举 <code>content/{type}/{lang}/</code> 生成 列表页→文章 边（<code>jumpLink = frontmatter.href || _path</code>，外链活动不计文章页）。</li>
        <li>全局导航：<code>layouts/default.vue</code> 注入的 <code>HeaderTheMain</code> / <code>AppFooter</code> / <code>AppFloat</code>（及 search 布局的 <code>SearchHeader</code>）中的链接单独归为「全局导航」，<b>不注入到每页出边</b>，避免指标失真。</li>
        <li>内链判定：<code>www.mindspore.cn</code> 域名（含 <code>mindspore.cn</code>），或站内绝对路径 <code>/…</code>。<code>/tutorials</code>、<code>/docs</code>、<code>/mindformers</code> 等为部署期挂载的文档路径（非 Nuxt 路由），不计入页面集合。</li>
        <li>四类页面分类：<b>孤岛</b>=无内容链且未入导航；<b>内容强·入口弱</b>=有内容入链但不在导航（建议加导航/加链接）；<b>导航有·内容无</b>=在导航但无内容入链（建议补内容内链）；<b>仅导航</b>=无内容上下游但靠导航存活。</li>
        <li>标题来源：页面 <code>definePageMeta({ title: { zh, en } })</code>（按路由语言取值）、content 文章 frontmatter <code>title</code>、SIG 名称。</li>
        <li>仍有局限：<code>/video/[...slug]</code>（query 驱动回放页）、<code>/news/detail?id=</code>（旧版 JSON 详情）、<code>/courses/detail?id=</code>、<code>/calendar/detail?date=</code>、<code>/online-showroom/detail?id=</code> 等 query 参数页面未实例化；组件中 <code>v-for</code> 生成的运行时链接（API 数据驱动）仅覆盖已枚举的 SIG/文章两类。</li>
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

  var sections = ${JSON.stringify(sections)};
  var sectionEdges = ${JSON.stringify(sectionEdges)};
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

  // ---- 列表填充 ----
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

  // 动态路由模板
  var drHtml = D.dynamicRoutes.map(function(d){
    return '<a href="javascript:void(0)"><span class="lt-title">'+esc(d.file)+'</span> <span class="small">'+esc(d.template)+'</span></a>';
  }).join('') || '<span class="small">无</span>';
  document.getElementById('dynRoutes').innerHTML = drHtml;

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
