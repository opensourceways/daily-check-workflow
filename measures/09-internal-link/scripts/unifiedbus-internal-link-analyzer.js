/*
 * UnifiedBus（灵衢）Portal — 站内内链分析器（Nuxt 3 版）
 *
 * 扫描 packages/website/pages/ 下全部 .vue 页面（Nuxt 文件路由），
 * 递归提取页面视图组件（显式 import + Nuxt 自动导入组件/composable）中的静态链接，
 * 扫描 .content/ YAML 内容数据（nav/home/learning/software/simulation），
 * 并调用线上 API（规范文档 / 白皮书 / 会议）与本地 @nuxt/content 资讯 Markdown，
 * 枚举动态路由实例（docs / white-papers / news / meeting replay）补充运行时内链，
 * 按 www.unifiedbus.com 域名与 /zh、/en 站内路径判定内链，
 * 构建有向链接图，输出自包含 HTML 看板：
 *   - 总览统计卡片 + 板块级聚合关系图（G6 力导向）+ 动态路由模板表
 *   - 页面级关系图（G6，按板块过滤 + 搜索高亮）
 *   - 页面列表（上下游内链上钻/下钻表格，含管理页过滤开关）
 *   - 孤岛页面（无上下游内链且未入导航）等关键数据
 *
 * 用法:  node scripts/internal-link-analyzer.js
 * 前置:  建议 first 运行 `pnpm merge` 拉取资讯内容（缺失时自动跳过并提示）
 * 产物:  internal-link-report.html（仓库根目录，自包含，浏览器直接打开）
 *
 * 环境变量:
 *   SKIP_API=1       跳过 API 调用（离线模式，仅静态分析）
 *   SKIP_CONTENT=1   跳过 content/ 资讯 Markdown 扫描
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'packages', 'website');
const PAGES_DIR = path.join(APP, 'pages');
const CONTENT_DIR = path.join(ROOT, '.content'); // #content/ YAML 数据（OPlusYamlContentVitePlugin root）
const NEWS_CONTENT_DIR = path.join(APP, 'content'); // @nuxt/content 资讯（pnpm merge 产物）

const INTERNAL_DOMAINS = ['www.unifiedbus.com', 'unifiedbus.com'];

const API_BASE = 'https://www.unifiedbus.com';
const SKIP_API = process.env.SKIP_API === '1';
const SKIP_CONTENT = process.env.SKIP_CONTENT === '1';

const OUTPUT_HTML = path.join(ROOT, 'internal-link-report.html');

// 全局布局：layouts/default.vue 由 Nuxt 注入到所有页面，其引用链
// （AppHeader / AppHeaderMobile / AppFooter / CookieNotice → useNavs → useNavContent → #content/nav）
// 中的链接单独归为「全局导航」，不注入到每页出边，避免内链密度指标失真。
const GLOBAL_LAYOUT_COMPONENTS = [path.join(APP, 'layouts', 'default.vue')];

// 视图组件递归扫描深度上限（避免无限递归 + 控制耗时）
const MAX_COMPONENT_DEPTH = 6;

// 管理/登录态页面（GEO 视角通常无优化价值，看板提供过滤开关）
const AUTH_PAGE_RE = [
  /^\/(zh|en)\/my(\/|$)/,
  /^\/(zh|en)\/guid\/(vendor|device|module|class)\/(manage|new|edit|review|apply)(\/|$)/,
  /^\/(zh|en)\/guid\/vendor\/apply(\/|$)/,
  /^\/(zh|en)\/feedback\/(review|detail)(\/|$)/,
  /^\/(zh|en)\/meeting\/(create|edit)(\/|$)/,
  /^\/(zh|en)\/docs\/license-agree\//,
  /^\/(zh|en)\/docs\/mobile\//,
];

// 可扫描的文本文件扩展名（其余按二进制/资源跳过）
const SCANNABLE_EXT = new Set(['.vue', '.ts', '.js', '.json', '.yaml', '.yml', '.md']);

function readText(p) {
  try {
    return fs.readFileSync(p, 'utf-8');
  } catch (_e) {
    return '';
  }
}

function walkDir(dir, out = [], ext = '.vue') {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, out, ext);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(ext)) {
      out.push(full);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 路由转换：Nuxt pages 文件路由 → URL 路径                              */
/* ------------------------------------------------------------------ */
// pages/zh/index.vue                      → /zh
// pages/zh/conduct/index.vue              → /zh/conduct
// pages/zh/software/ub-os-component.vue   → /zh/software/ub-os-component
// pages/zh/docs/[name].vue                → /zh/docs/:name（动态模板）
// pages/zh/meeting/replay/[...slug].vue   → /zh/meeting/replay/*slug（catch-all 模板）
function vueFileToRoute(absPath) {
  let rel = path.relative(PAGES_DIR, absPath).replace(/\\/g, '/');
  rel = rel.replace(/\.vue$/i, '');
  const segments = rel.split('/').filter(Boolean);
  const isDynamic = segments.some((s) => /^\[/.test(s));
  const parts = segments.map((s) => {
    if (/^\[\.\.\..+\]$/.test(s)) return '*' + s.slice(4, -1); // [...slug] → *slug
    if (/^\[.+\]$/.test(s)) return ':' + s.slice(1, -1); // [name] → :name
    return s;
  });
  let route = '/' + parts.join('/');
  if (route.endsWith('/index')) route = route.slice(0, -'/index'.length);
  return { route, isDynamic };
}

// 动态路由模板 → 匹配正则（':name' → [^/]+，'*slug' → .+）
function templateToRegex(template) {
  const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, (c) => (c === '*' || c === ':' ? c : '\\' + c));
  const pattern = escaped.replace(/\*[\w]+/g, '[^/]+(?:/[^/]+)*').replace(/:[\w]+/g, '[^/]+');
  return new RegExp('^' + pattern + '$');
}

/* ------------------------------------------------------------------ */
/* 链接规范化与分类                                                      */
/* ------------------------------------------------------------------ */
// 候选链接规范化：去 hash/query、去尾斜杠（本站路由无尾斜杠）；
// `zh/privacy` 等无前导斜杠的相对链接（AppFooter 写法）补全为 /zh/privacy
function canonicalizeUrl(raw) {
  let u = raw.trim();
  u = u.split('#')[0];
  u = u.split('?')[0];
  while (u.length > 1 && u.endsWith('/')) u = u.slice(0, -1);
  if (/^(zh|en)(\/|$)/.test(u)) u = '/' + u;
  return u;
}

const ASSET_EXT_RE = /\.(png|jpe?g|gif|svg|webp|ico|bmp|mp4|mp3|pdf|zip|tar|gz|rar|7z|iso|rpm|deb|exe|msi|pkg|woff2?|ttf|otf|eot|css|map|json|yaml|yml|xml|txt|csv|docx?|xlsx?|pptx?|md)$/i;
const ASSET_PATH_RE = /^\/(_ipx|category|statement|nav|icons|_nuxt|assets|favicon\.ico|check-dark-mode\.js|llms|200\.html|404\.html|robots\.txt)/i;

// 解析一条原始链接，返回 { type, target }
// type: 'internal' | 'external' | 'asset' | 'api' | 'anchor' | 'other'
function classifyLink(raw) {
  const url = raw.trim();
  if (!url) return { type: 'other', target: '' };

  if (url.startsWith('#')) return { type: 'anchor', target: url };
  if (/^(mailto:|tel:|javascript:|data:|blob:)/i.test(url)) return { type: 'other', target: url };

  // 绝对 URL
  const protoMatch = url.match(/^([a-z]+:)\/\//i);
  if (protoMatch || url.startsWith('//')) {
    const rest = url.replace(/^([a-z]+:)?\/\//i, '');
    const slashIdx = rest.indexOf('/');
    const host = slashIdx === -1 ? rest : rest.slice(0, slashIdx);
    const pathPart = slashIdx === -1 ? '/' : rest.slice(slashIdx);
    if (INTERNAL_DOMAINS.includes(host)) return { type: 'internal', target: pathPart || '/' };
    return { type: 'external', target: url };
  }

  // API 端点（下载直链等，非页面）
  if (/^\/api-/i.test(url)) return { type: 'api', target: url };

  // 资源
  if (ASSET_EXT_RE.test(url) || ASSET_PATH_RE.test(url)) return { type: 'asset', target: url };

  // 站内页面路径（含动态段 :param，交由 findPage 匹配模板）
  if (/^\/(zh|en)(\/|$)/.test(url)) return { type: 'internal', target: url };
  if (/^\/(zh|en)$/.test(url)) return { type: 'internal', target: url };
  // 动态段开头（如模板展开后的 :param/xxx）——无静态前缀，无法判定归属
  if (/^:/.test(url)) return { type: 'other', target: url };

  if (url.startsWith('/')) return { type: 'internal', target: url };
  return { type: 'other', target: url };
}

// 清洗单条原始链接：去包裹引号/反引号、首尾空白
function cleanRawLink(raw) {
  let s = String(raw).trim();
  if ((s.startsWith('`') && s.endsWith('`')) || (s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  s = s.replace(/`/g, '');
  return s;
}

// 取匹配位置所在行（用于引号路径的上下文过滤）
function lineAt(content, idx) {
  const start = content.lastIndexOf('\n', idx) + 1;
  const end = content.indexOf('\n', idx);
  return content.slice(start, end === -1 ? content.length : end);
}
// 引号路径的误报源：locale 判断 / 数组切分 / 守卫前缀等字符串比较场景
const PATH_LITERAL_EXCLUDE_LINE_RE = /startsWith|endsWith|includes\s*\(|LOGIN_GUARD_LIST|\.split\(|\.slice\(|\.indexOf\(|\.match\(|\.test\(|PLATFORM_ADMIN_ROUTES|LOCALE_RESOURCES_MAP/;

/* ------------------------------------------------------------------ */
/* 链接提取：.vue / .ts / .js 文本                                       */
/* ------------------------------------------------------------------ */
function extractRawLinks(content, { isMarkdown = false } = {}) {
  const links = [];
  let m;

  if (isMarkdown) {
    // Markdown 链接 [text](url) —— 跳过图片 ![alt](url)
    const mdLinkRe = /(^|[^!])\[(?:[^\]]*)\]\(([^)]+)\)/g;
    while ((m = mdLinkRe.exec(content)) !== null) {
      const url = cleanRawLink(m[2]).split(/\s+/)[0];
      if (url) links.push(url);
    }
  }

  // 1. HTML 属性 href="..." / href='...'（含 :href 静态值；反引号模板串由引号捕获后交展开）
  const hrefRe = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  while ((m = hrefRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1] ?? m[2] ?? '');
    if (url) links.push(url);
  }

  // 2. TS/JS 对象属性 href: '...' / url: '...' / path: '...' / link: '...' / software_link: '...'
  //    backUrl 为 definePageMeta 配置，由 AppHeaderMobile 返回按钮消费（移动端出链）；
  //    同语义的 back: 全仓无消费方（死配置），不计
  const objPropRe = /\b(?:href|url|path|link|software_link|replay_url|join_url|backUrl)\s*:\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/gi;
  while ((m = objPropRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1] ?? m[2] ?? m[3] ?? '');
    if (url) links.push(url);
  }

  // 3. 编程式导航 / 跳转工具：NuxtLink :to / navigateTo / router.push / router.replace / .go / redirect / handleUrl / window.open / location.href =
  //    注意 .replace 限定 router.replace：字符串变换 route.fullPath.replace('/docs/', '/docs/mobile/')
  //    的第一参是被替换模式而非目标 URL，误提取会产生假链接/假实例
  const navRe = /(?::to|navigateTo|\.push|router\.replace|\.go|redirect|handleUrl|handleDownloadUrl|window\.open|location\.href)\s*[(=]?\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/g;
  while ((m = navRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1] ?? m[2] ?? m[3] ?? '');
    if (url) links.push(url);
  }

  // 4. 模板字符串（以 /、${、https:// 开头，过滤非 URL 的类名/样式拼接）
  if (!isMarkdown) {
    const tplRe = /`((?:\/[\w${}.?=&/-]*|\$\{[^}]*\}[^`]*|https?:\/\/[^`]*))`/g;
    while ((m = tplRe.exec(content)) !== null) {
      const url = cleanRawLink(m[1]);
      if (url) links.push(url);
    }
  }

  // 5. 引号内的站内路径字面量（'...' / "..." 以 /zh/ 或 /en/ 开头），带行级上下文过滤
  const quotedPathRe = /['"](\/(?:zh|en)\/[^'"\s]*)['"]/g;
  while ((m = quotedPathRe.exec(content)) !== null) {
    const line = lineAt(content, m.index);
    if (PATH_LITERAL_EXCLUDE_LINE_RE.test(line)) continue;
    links.push(m[1]);
  }

  // 6. 裸 URL
  const bareRe = /(?:^|[\s(=('"])(https?:\/\/[^\s)<"'`，。、；！？）】]+)/g;
  while ((m = bareRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1]).replace(/[.,;:!?）】]+$/, '');
    if (url) links.push(url);
  }
  return links;
}

// 模板字符串展开：locale 变量 → zh + en；env 变量 → 外链跳过；剩余 ${...} → :param 动态段
function expandTemplateLinks(rawLinks, { expandLocaleless = false } = {}) {
  const out = [];
  for (let l of rawLinks) {
    l = String(l).trim();
    if (!l) continue;
    // import.meta.env.VITE_*（CDN/登录域等）与 __ENV: 哨兵 → 无法静态解析，跳过
    if (/\$\{import\.meta\.env\.|__ENV:/.test(l)) continue;
    // 移动端分流三元 → 取 PC 形态
    l = l.replace(/\$\{[^}]*isPhone[^}]*\}/g, '');
    if (!l) continue;

    // locale 展开（currentLocale / locale / lang / anotherLang，含 .value）
    if (/\$\{[^}]*(?:locale|lang)[^}]*\}/i.test(l)) {
      out.push(l.replace(/\$\{[^}]*(?:locale|lang)[^}]*\}/gi, 'zh'));
      out.push(l.replace(/\$\{[^}]*(?:locale|lang)[^}]*\}/gi, 'en'));
      continue;
    }

    // 无 locale 前缀的站内路径（如 /my/profile、/software/ub-os-component、backUrl 的裸 /）：
    // 运行时由 `/${locale}${url}` 拼接 → 生成 zh + en 两版
    if (expandLocaleless && /^\/(?!zh(?:\/|$)|en(?:\/|$)|api-|category\/|_ipx\/|statement\/)(?:[^/].*)?$/.test(l) && !ASSET_EXT_RE.test(l) && !l.startsWith('//')) {
      out.push('/zh' + l);
      out.push('/en' + l);
      continue;
    }
    if (expandLocaleless && /^(zh|en)\//.test(l)) {
      out.push('/' + l);
      continue;
    }
    out.push(l);
  }
  // 剩余动态段统一替换为 :param（交由模板匹配）
  return out.map((l) => l.replace(/\$\{[^}]*\}/g, ':param'));
}

/* ------------------------------------------------------------------ */
/* 链接提取：.content/ YAML                                              */
/* ------------------------------------------------------------------ */
// 本项目 YAML 的 URL 字段（新增字段时在此补充）
const YAML_URL_FIELDS = 'href|url|path|link|material|repo_link|repo|project_link|name_link|replay_link|apply_link|replay_url|join_url|htmlPage';

// 提取 YAML 链接。module 为 .content/ 下目录名（如 'nav'、'home'），
// locale 为该 YAML 的语言（zh.yaml / en.yaml）。
// home 模块的 banner id（UB-* 文档标识）映射为对应语言的 /{locale}/docs/{id} 预览路由。
function extractYamlLinks(content, module, locale) {
  const links = [];
  const propRe = new RegExp('^\\s*(?:' + YAML_URL_FIELDS + ')\\s*:\\s*(.+)$', 'gm');
  let m;
  while ((m = propRe.exec(content)) !== null) {
    let val = m[1].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    val = val.split(/\s+#/)[0].trim();
    if (!val) continue;
    if (val.startsWith('./') || val.startsWith('../')) continue; // Vite 资源
    if (val.startsWith('__ENV:')) continue; // 环境哨兵（CDN 等）
    links.push(val);
  }
  // home 模块：文档类 banner 的 id（UB-xxx）→ 本语言的 docs 预览路由（HomeBanner getDocViewUrl）
  if (module === 'home' && locale) {
    const idRe = /^\s*-?\s*id:\s*(UB-[\w.-]+)\s*$/gm;
    while ((m = idRe.exec(content)) !== null) {
      links.push(`/${locale}/docs/` + m[1]);
    }
  }
  // 内链域名绝对 URL
  const bareRe = new RegExp('https?://(?:' + INTERNAL_DOMAINS.join('|').replace(/\./g, '\\.') + ')([^\\s\'"`]+)', 'g');
  while ((m = bareRe.exec(content)) !== null) {
    links.push(m[1] || '/');
  }
  return links;
}

/* ------------------------------------------------------------------ */
/* import 解析（显式 import + Nuxt 自动导入）                            */
/* ------------------------------------------------------------------ */
function resolveFile(base, rel) {
  rel = rel.replace(/\\/g, '/');
  const candidates = [
    path.join(base, rel),
    path.join(base, rel + '.vue'),
    path.join(base, rel + '.ts'),
    path.join(base, rel + '.js'),
    path.join(base, rel + '.json'),
    path.join(base, rel, 'index.vue'),
    path.join(base, rel, 'index.ts'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) {
      // 仅接受可扫描的文本文件（排除图片/样式等资源）
      if (SCANNABLE_EXT.has(path.extname(c).toLowerCase()) || c.endsWith('.vue')) return c;
      return null;
    }
  }
  return null;
}

// import 说明符 → 绝对路径（#content/ 返回 YAML 文件数组）
function resolveImport(spec, fromFile) {
  if (spec.startsWith('~/') || spec.startsWith('@/')) return resolveFile(APP, spec.slice(2));
  if (spec.startsWith('~~/') || spec.startsWith('@@/')) return resolveFile(APP, spec.slice(3));
  if (spec.startsWith('#content/')) {
    const relPath = spec.slice('#content/'.length);
    const dir = path.join(CONTENT_DIR, relPath);
    const files = [];
    for (const l of ['zh.yaml', 'en.yaml']) {
      if (fs.existsSync(path.join(dir, l))) files.push(path.join(dir, l));
    }
    if (files.length === 0 && fs.existsSync(path.join(CONTENT_DIR, relPath + '.yaml'))) {
      files.push(path.join(CONTENT_DIR, relPath + '.yaml'));
    }
    return files.length > 0 ? files : null;
  }
  if (spec.startsWith('~icons/') || spec.startsWith('#')) return null; // 图标 / 虚拟模块
  if (spec.startsWith('.')) return resolveFile(path.dirname(fromFile), spec);
  return null; // 包导入
}

// Nuxt 自动导入组件索引：优先解析 .nuxt/components.d.ts（权威注册表），
// 缺失时回退为 components/ 与 views/ 下按文件名索引。
function buildAutoImportIndex() {
  const index = new Map(); // 组件名 → 绝对路径
  const dtsPath = path.join(APP, '.nuxt', 'components.d.ts');
  if (fs.existsSync(dtsPath)) {
    const dts = readText(dtsPath);
    const re = /export const (\w+): typeof import\("([^"]+)"\)/g;
    let m;
    while ((m = re.exec(dts)) !== null) {
      const resolved = path.resolve(path.join(APP, '.nuxt'), m[2]);
      if (resolved.includes('node_modules')) continue;
      if (fs.existsSync(resolved)) index.set(m[1], resolved);
    }
    if (index.size > 0) return index;
  }
  // 回退：文件名 → 路径（仅收录唯一名）
  const byName = new Map();
  const count = new Map();
  for (const dir of [path.join(APP, 'components'), path.join(APP, 'views')]) {
    for (const f of walkDir(dir, [], '.vue')) {
      const name = path.basename(f, '.vue');
      count.set(name, (count.get(name) || 0) + 1);
      byName.set(name, f);
    }
  }
  for (const [name, c] of count) {
    if (c === 1) index.set(name, byName.get(name));
  }
  return index;
}

// 自动导入 composable 索引：composables/*.ts 的 use* 导出
function buildComposableIndex() {
  const index = new Map();
  const dir = path.join(APP, 'composables');
  for (const f of walkDir(dir, [], '.ts')) {
    const content = readText(f);
    const re = /export (?:const|function) (use[A-Z]\w*)/g;
    let m;
    while ((m = re.exec(content)) !== null) index.set(m[1], f);
  }
  return index;
}

const AUTO_IMPORT_COMPONENTS = buildAutoImportIndex();
const AUTO_IMPORT_COMPOSABLES = buildComposableIndex();

function isScannable(p) {
  return p && SCANNABLE_EXT.has(path.extname(p).toLowerCase());
}

// 递归扫描文件：提取静态链接 + 继续解析 import 链 / 自动导入组件 / 自动导入 composable
// opts.skipLinksFrom: Set<绝对路径> —— 命中文件只递归 import、不收集其链接
// （用于全局导航扫描排除 config/common.ts 等「链路上顺带引入但非导航」的数据文件）
function scanFile(absPath, depth, visited, accLinks, opts = {}) {
  if (!absPath || visited.has(absPath) || !isScannable(absPath)) return;
  visited.add(absPath);
  const content = readText(absPath);
  if (!content) return;

  // YAML：#content/ 内容数据
  if (absPath.endsWith('.yaml') || absPath.endsWith('.yml')) {
    const relToContent = path.relative(CONTENT_DIR, absPath).replace(/\\/g, '/');
    const module = relToContent.split('/')[0];
    const baseName = path.basename(absPath, path.extname(absPath));
    const locale = baseName === 'zh' || baseName === 'en' ? baseName : '';
    if (!opts.skipLinksFrom || !opts.skipLinksFrom.has(absPath)) {
      accLinks.push(...extractYamlLinks(content, module, locale));
    }
    return;
  }

  const isMd = absPath.endsWith('.md');
  if (!opts.skipLinksFrom || !opts.skipLinksFrom.has(absPath)) {
    accLinks.push(...extractRawLinks(content, { isMarkdown: isMd }));
  }
  if (depth >= MAX_COMPONENT_DEPTH) return;

  // 显式 import 链
  const importRe = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  let m;
  while ((m = importRe.exec(content)) !== null) {
    const child = resolveImport(m[1], absPath);
    if (Array.isArray(child)) {
      for (const c of child) scanFile(c, depth + 1, visited, accLinks, opts);
    } else {
      scanFile(child, depth + 1, visited, accLinks, opts);
    }
  }

  // 自动导入组件（模板中的 PascalCase 标签）
  if (absPath.endsWith('.vue')) {
    const tagRe = /<([A-Z][A-Za-z0-9_]*)[\s/>]/g;
    while ((m = tagRe.exec(content)) !== null) {
      const comp = AUTO_IMPORT_COMPONENTS.get(m[1]);
      if (comp) scanFile(comp, depth + 1, visited, accLinks, opts);
    }
  }
  // 自动导入 composable（useXxx 调用）
  const composableRe = /\b(use[A-Z]\w*)\s*\(/g;
  while ((m = composableRe.exec(content)) !== null) {
    const comp = AUTO_IMPORT_COMPOSABLES.get(m[1]);
    if (comp) scanFile(comp, depth + 1, visited, accLinks, opts);
  }
}

/* ------------------------------------------------------------------ */
/* 板块聚合 / 标题                                                       */
/* ------------------------------------------------------------------ */
// /zh/guid/vendor/list → /zh/guid/；/zh → /zh/
function pageToSection(pagePath) {
  const parts = pagePath.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  if (parts.length === 1) return '/' + parts[0] + '/';
  return '/' + parts.slice(0, 2).join('/') + '/';
}

function extractFrontmatterTitle(content) {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return '';
  const titleMatch = fmMatch[1].match(/^title:\s*(.+)$/m);
  if (!titleMatch) return '';
  let title = titleMatch[1].trim();
  if ((title.startsWith('"') && title.endsWith('"')) || (title.startsWith("'") && title.endsWith("'"))) {
    title = title.slice(1, -1);
  }
  return title;
}

function isAuthPage(pagePath) {
  return AUTH_PAGE_RE.some((re) => re.test(pagePath));
}

/* ------------------------------------------------------------------ */
/* 线上 API：枚举动态路由实例（docs / white-paper / meeting）             */
/* ------------------------------------------------------------------ */
async function fetchJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchApiData() {
  const result = { docs: [], whitepapers: [], meetings: [], errors: [] };
  if (SKIP_API) return result;

  // 1. 规范文档：docsver 取最新版本，docs?language&version 取 base(2.0.0) + latest 两个版本
  try {
    const latestByLocale = {};
    for (const locale of ['zh', 'en']) {
      try {
        const ver = await fetchJson(`${API_BASE}/api-server/web/v1/docsver?language=${locale}`);
        latestByLocale[locale] = ver?.data?.version || '';
      } catch (e) {
        result.errors.push(`docsver(${locale}): ${e.message}`);
      }
      const versions = ['2.0.0', latestByLocale[locale]].filter(Boolean);
      const seen = new Set();
      for (const version of [...new Set(versions)]) {
        const data = await fetchJson(`${API_BASE}/api-server/web/v1/docs?language=${locale}&version=${encodeURIComponent(version)}`);
        for (const file of data?.data?.files || []) {
          if (!file.file_name || file.file_name === 'coming-soon.pdf' || seen.has(file.file_name)) continue;
          seen.add(file.file_name);
          result.docs.push({
            locale,
            name: file.file_name.replace(/\.pdf$/i, ''),
            title: file.title || '',
            type_name: file.type_name || '',
            version,
          });
        }
      }
    }
  } catch (e) {
    result.errors.push(`docs: ${e.message}`);
  }

  // 2. 白皮书
  for (const locale of ['zh', 'en']) {
    try {
      const data = await fetchJson(`${API_BASE}/api-server/web/v1/white-paper?language=${locale}`);
      for (const file of data?.data?.files || []) {
        if (!file.file_name || file.file_name === 'coming-soon.pdf') continue;
        result.whitepapers.push({ locale, name: file.file_name.replace(/\.pdf$/i, ''), title: file.title || '' });
      }
    } catch (e) {
      result.errors.push(`white-paper(${locale}): ${e.message}`);
    }
  }

  // 3. 会议（回放页路由 /{locale}/meeting/replay/{group_name}/{mid}/{date}）
  try {
    const data = await fetchJson(`${API_BASE}/api-meeting/meeting/?date=&group_name=`);
    const today = new Date().toISOString().slice(0, 10);
    for (const mt of data?.data || []) {
      if (!mt.group_name || !mt.mid || !mt.date) continue;
      if (String(mt.date) > today) continue; // 未开始的会议无回放
      result.meetings.push({
        topic: mt.topic || '',
        group: String(mt.group_name),
        mid: String(mt.mid),
        date: String(mt.date),
      });
    }
  } catch (e) {
    result.errors.push(`meeting: ${e.message}`);
  }
  return result;
}

/* ------------------------------------------------------------------ */
/* 主流程                                                               */
/* ------------------------------------------------------------------ */
async function main() {
  const t0 = Date.now();

  /* ---------- 1. 收集页面 ---------- */
  const pages = []; // { file, pagePath, type, title, isTemplate }
  const pageSet = new Set();
  const dynamicRoutes = []; // { file, template }
  const templateMatchers = []; // { template, re }

  const addPage = (pagePath, file, type, title = '', extra = {}) => {
    if (pageSet.has(pagePath)) {
      // 已存在时补标题（API/内容标题优先）
      const existing = pages.find((p) => p.pagePath === pagePath);
      if (existing && title && !existing.title) existing.title = title;
      return;
    }
    pageSet.add(pagePath);
    pages.push({ file, pagePath, type, title, isTemplate: false, ...extra });
  };

  // 1a. pages/**/*.vue（跳过根 index.vue —— 纯 SPA 重定向页）
  for (const f of walkDir(PAGES_DIR, [], '.vue')) {
    const rel = path.relative(PAGES_DIR, f).replace(/\\/g, '/');
    if (rel === 'index.vue') continue;
    const { route, isDynamic } = vueFileToRoute(f);
    if (isDynamic) {
      dynamicRoutes.push({ file: 'packages/website/pages/' + rel, template: route });
      templateMatchers.push({ template: route, re: templateToRegex(route) });
      addPage(route, 'packages/website/pages/' + rel, 'template', '(动态路由模板)', { isTemplate: true });
    } else {
      addPage(route, 'packages/website/pages/' + rel, 'file');
    }
  }

  // 页面查找：精确命中 → 兼容尾斜杠 → 动态路由模板匹配
  // 具体链接（无 :param 动态段）命中模板时注册为实例页（如 video-collection/list/specDecoded）；
  // 含 :param 的动态链接归到模板节点（代表全部实例）
  function findPage(candidate) {
    if (!candidate) return null;
    const c = canonicalizeUrl(candidate);
    if (pageSet.has(c)) return c;
    if (c.length > 1 && c.endsWith('/') && pageSet.has(c.slice(0, -1))) return c.slice(0, -1);
    if (pageSet.has(c + '/')) return c + '/';
    for (const { template, re } of templateMatchers) {
      if (re.test(c)) {
        if (!c.includes(':')) {
          addPage(c, '(静态链接实例)', 'instance');
          return c;
        }
        return template;
      }
    }
    return null;
  }

  // 1a-2. 重定向跳板页识别：definePageMeta({ redirect }) 或「空模板 + onMounted navigateTo」。
  // 这类页面无自身内容（进入即跳转，如 /guid、/legal、/software），跳转目标边保留，
  // 但页面本身不参与孤岛/无入链等优化统计（对 GEO 无补链价值）。
  const redirectPages = new Set();
  for (const page of pages.filter((p) => p.type === 'file')) {
    const content = readText(path.join(ROOT, page.file));
    if (!content) continue;
    if (/definePageMeta\s*\(\s*\{[^}]*\bredirect\s*:/.test(content)) {
      redirectPages.add(page.pagePath);
      continue;
    }
    const body = content.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').trim();
    if (/^<template>\s*<div[^>]*>\s*<\/div>\s*<\/template>$/.test(body) && /onMounted[\s\S]*?navigateTo\s*\(/.test(content)) {
      redirectPages.add(page.pagePath);
    }
  }

  /* ---------- 1b. API 枚举动态实例页（先建页面，再做静态扫描以精确命中） ---------- */
  const api = await fetchApiData();
  for (const doc of api.docs) {
    addPage(`/${doc.locale}/docs/${doc.name}`, '(API: docs)', 'docs', doc.title);
  }
  for (const locale of ['zh', 'en']) {
    const types = [...new Set(api.docs.filter((d) => d.locale === locale && d.type_name).map((d) => d.type_name))];
    for (const type of types) {
      addPage(`/${locale}/docs/version/${type}`, '(API: docs type_name)', 'docs', `全部版本 · ${type}`);
    }
  }
  for (const wp of api.whitepapers) {
    addPage(`/${wp.locale}/white-papers/${wp.name}`, '(API: white-paper)', 'white-paper', wp.title);
  }
  for (const locale of ['zh', 'en']) {
    for (const mt of api.meetings) {
      addPage(
        `/${locale}/meeting/replay/${encodeURIComponent(mt.group)}/${mt.mid}/${mt.date}`,
        '(API: meeting)',
        'meeting',
        mt.topic
      );
    }
  }

  /* ---------- 2. 提取每页静态链接（页面 → 视图组件递归链） ---------- */
  const downstream = new Map(); // pagePath -> Set(pagePath)
  const edgeMeta = new Map(); // "from\u0001to" -> Set(来源)
  const externalLinks = new Map(); // pagePath -> Set(host)

  function addEdge(from, to, source) {
    if (!from || !to || from === to) return;
    // 跨语言边过滤：${currentLocale} 模板展开会同时产生 zh/en 两份链接，
    // 但页面（pages/zh/**）运行时只渲染本语言版本；语言切换属 UI 功能，不计入内容内链
    const fromLocale = from.match(/^\/(zh|en)(\/|$)/)?.[1];
    const toLocale = to.match(/^\/(zh|en)(\/|$)/)?.[1];
    if (fromLocale && toLocale && fromLocale !== toLocale) return;
    const out = downstream.get(from) || new Set();
    out.add(to);
    downstream.set(from, out);
    const key = from + '\u0001' + to;
    const meta = edgeMeta.get(key) || new Set();
    meta.add(source);
    edgeMeta.set(key, meta);
  }

  for (const page of pages.filter((p) => p.type === 'file')) {
    const fileAbs = path.join(ROOT, page.file);
    const content = readText(fileAbs);
    if (!content) continue;
    const accLinks = [];
    scanFile(fileAbs, 0, new Set(), accLinks);
    const fmTitle = content.match(/title:\s*\{?\s*zh:\s*['"]([^'"]+)['"]/);
    if (fmTitle && !page.title) page.title = fmTitle[1];

    const expanded = expandTemplateLinks(accLinks, { expandLocaleless: true });
    for (const raw of expanded) {
      const cls = classifyLink(raw);
      if (cls.type === 'internal') {
        const target = findPage(cls.target);
        if (target) addEdge(page.pagePath, target, path.relative(ROOT, fileAbs));
      } else if (cls.type === 'external') {
        try {
          const u = new URL(raw.startsWith('//') ? 'https:' + raw : raw);
          const ext = externalLinks.get(page.pagePath) || new Set();
          ext.add(u.host);
          externalLinks.set(page.pagePath, ext);
        } catch (_e) {
          /* ignore */
        }
      }
    }
  }

  /* ---------- 2b. 声明内容（config/statement Markdown，TheStatement 渲染） ---------- */
  // TheStatement 按 category 静态绑定从 config/statement/{locale}/{category}.md 取 raw 渲染，
  // md 内的 Markdown 链接（如 privacy.md → 个人信息收集清单/第三方共享清单/cookies）归属到声明页面。
  // SpecLicenseAgreeContent 弹窗动态拼接 category 渲染同一份 md，但其独立路由页已按静态
  // category 覆盖（如 specification-license-agreement-v1/v2 页面），不重复归属。
  const statementDir = path.join(APP, 'config', 'statement');
  const statementCategoryPages = new Map(); // category -> Set(pagePath)
  if (fs.existsSync(statementDir)) {
    for (const f of walkDir(PAGES_DIR, [], '.vue')) {
      const content = readText(f);
      if (!content || !content.includes('TheStatement')) continue;
      const catRe = /<TheStatement[^>]*\bcategory\s*=\s*"([^"]+)"/g;
      let catMatch;
      while ((catMatch = catRe.exec(content)) !== null) {
        const { route } = vueFileToRoute(f);
        const set = statementCategoryPages.get(catMatch[1]) || new Set();
        set.add(route);
        statementCategoryPages.set(catMatch[1], set);
      }
    }
    for (const locale of ['zh', 'en']) {
      const dir = path.join(statementDir, locale);
      if (!fs.existsSync(dir)) continue;
      for (const f of walkDir(dir, [], '.md')) {
        const category = path.basename(f, '.md');
        const hostPages = [...(statementCategoryPages.get(category) || [])].filter(
          (p) => p === `/${locale}` || p.startsWith(`/${locale}/`)
        );
        const content = readText(f);
        if (!hostPages.length || !content) continue;
        const accLinks = extractRawLinks(content, { isMarkdown: true });
        for (const raw of expandTemplateLinks(accLinks)) {
          const cls = classifyLink(raw);
          if (cls.type === 'internal') {
            const target = findPage(cls.target);
            if (target) {
              for (const host of hostPages) addEdge(host, target, path.relative(ROOT, f));
            }
          } else if (cls.type === 'external') {
            try {
              const u = new URL(raw.startsWith('//') ? 'https:' + raw : raw);
              for (const host of hostPages) {
                const ext = externalLinks.get(host) || new Set();
                ext.add(u.host);
                externalLinks.set(host, ext);
              }
            } catch (_e) {
              /* ignore */
            }
          }
        }
      }
    }
  }

  /* ---------- 3. 全局导航（layouts/default.vue 引用链，不注入每页出边） ---------- */
  // 排除链路上「顺带 import 但非导航」的数据文件：config/common.ts 仅被 CookieNotice
  // 引入取 cookie key，其 MY_MENUS / LOGIN_GUARD_LIST 链接属 my 侧边栏，不得计入全局导航
  const GLOBAL_NAV_SKIP_FILES = new Set([path.join(APP, 'config', 'common.ts')]);
  const globalLinkTargets = new Set();
  const globalLinkSources = new Map();
  for (const comp of GLOBAL_LAYOUT_COMPONENTS) {
    if (!fs.existsSync(comp)) continue;
    const accLinks = [];
    scanFile(comp, 0, new Set(), accLinks, { skipLinksFrom: GLOBAL_NAV_SKIP_FILES });
    const compName = path.basename(comp);
    for (const raw of expandTemplateLinks(accLinks, { expandLocaleless: true })) {
      const cls = classifyLink(raw);
      if (cls.type !== 'internal') continue;
      const target = findPage(cls.target);
      if (target) {
        globalLinkTargets.add(target);
        const srcs = globalLinkSources.get(target) || [];
        srcs.push(compName);
        globalLinkSources.set(target, srcs);
      }
    }
  }

  /* ---------- 4. 资讯内容（@nuxt/content，pnpm merge 产物） ---------- */
  let newsCount = 0;
  const newsContentMissing = !fs.existsSync(path.join(NEWS_CONTENT_DIR, 'zh', 'news'));
  if (!SKIP_CONTENT && !newsContentMissing) {
    for (const locale of ['zh', 'en']) {
      const newsDir = path.join(NEWS_CONTENT_DIR, locale, 'news');
      const mdFiles = walkDir(newsDir, [], '.md');
      const articles = [];
      // 第一遍：先注册全部文章页（保证文章互链可命中）
      for (const f of mdFiles) {
        const content = readText(f);
        const slug = path.basename(f, '.md');
        const pagePath = `/${locale}/news/${slug}`;
        addPage(pagePath, path.relative(ROOT, f), 'news', extractFrontmatterTitle(content));
        newsCount++;
        articles.push({ file: f, pagePath, content, date: (content.match(/^date:\s*['"]?([^'"\n]+)/m) || [])[1] || '' });
      }
      // 第二遍：提取文章正文链接
      for (const a of articles) {
        const accLinks = [];
        scanFile(a.file, 0, new Set(), accLinks);
        for (const raw of expandTemplateLinks(accLinks, { expandLocaleless: true })) {
          const cls = classifyLink(raw);
          if (cls.type === 'internal') {
            const target = findPage(cls.target);
            if (target) addEdge(a.pagePath, target, path.relative(ROOT, a.file));
          } else if (cls.type === 'external') {
            try {
              const u = new URL(raw.startsWith('//') ? 'https:' + raw : raw);
              const ext = externalLinks.get(a.pagePath) || new Set();
              ext.add(u.host);
              externalLinks.set(a.pagePath, ext);
            } catch (_e) {
              /* ignore */
            }
          }
        }
      }
      // 列表页 → 文章（TheNews queryContent find）
      const listPage = findPage(`/${locale}/news`);
      for (const a of articles) {
        if (listPage) addEdge(listPage, a.pagePath, '(content 资讯列表 queryContent)');
      }
      // 首页 → 最新 6 篇（TheHome queryContent limit(6) sort date desc）
      const homePage = findPage(`/${locale}`);
      const latest = [...articles].sort((x, y) => (x.date < y.date ? 1 : -1)).slice(0, 6);
      for (const a of latest) {
        if (homePage) addEdge(homePage, a.pagePath, '(首页最新资讯 queryContent)');
      }
    }
  }

  /* ---------- 4b. 动态模板页壳出链（面包屑 / 返回按钮等公共 UI） ---------- */
  // 模板 .vue 的出链（如 news/[...slug] → TheNewsDetail 面包屑 → /zh/news、
  // meeting/replay/[...slug] → TheReplay 面包屑 → /zh）在每个实例页上都渲染。
  // 此前仅扫静态页面（type='file'），模板节点与实例页的这部分出链全部丢失。
  // 现归属到模板节点 + 全部匹配实例页（面包屑属实例公共 UI，source 标注模板页壳）。
  for (const { template, re } of templateMatchers) {
    const dr = dynamicRoutes.find((d) => d.template === template);
    if (!dr) continue;
    const fileAbs = path.join(ROOT, dr.file);
    if (!readText(fileAbs)) continue;
    const accLinks = [];
    // 排除 config/common.ts：视图组件常 import 其 LOCALE_RESOURCES_MAP 等工具，
    // 会顺带把同文件 MY_MENUS（my 侧边栏）链接带入非 my 页面（如 docs 预览壳）。
    // my 静态页面（type='file'）的侧边栏边不受影响（section 2 未排除）
    scanFile(fileAbs, 0, new Set(), accLinks, { skipLinksFrom: GLOBAL_NAV_SKIP_FILES });
    if (!accLinks.length) continue;
    const hosts = [template, ...pages.filter((p) => !p.isTemplate && re.test(p.pagePath)).map((p) => p.pagePath)];
    const srcLabel = '(模板页壳 ' + path.relative(ROOT, fileAbs).replace(/\\/g, '/') + ')';
    for (const raw of expandTemplateLinks(accLinks, { expandLocaleless: true })) {
      const cls = classifyLink(raw);
      if (cls.type !== 'internal') continue;
      const target = findPage(cls.target);
      if (!target) continue;
      for (const host of hosts) addEdge(host, target, srcLabel);
    }
  }

  /* ---------- 5. API 补充边（动态实例页已在 1b 注册，此处补充运行时边） ---------- */
  // 首页 → 规范文档预览页（HomeDownload/HomeBanner 下载与预览按钮）
  for (const doc of api.docs) {
    const home = findPage(`/${doc.locale}`);
    if (home) addEdge(home, `/${doc.locale}/docs/${doc.name}`, '(首页文档区/轮播 API: docs)');
  }
  // 首页 → 全部版本页；版本页 → 同类型各文档预览页（DocsVersionsTable）
  for (const locale of ['zh', 'en']) {
    const home = findPage(`/${locale}`);
    const types = [...new Set(api.docs.filter((d) => d.locale === locale && d.type_name).map((d) => d.type_name))];
    for (const type of types) {
      const versionPage = `/${locale}/docs/version/${type}`;
      if (home) addEdge(home, versionPage, '(DownloadButton 全部版本 API)');
      for (const doc of api.docs.filter((d) => d.locale === locale && d.type_name === type)) {
        addEdge(versionPage, `/${locale}/docs/${doc.name}`, '(版本列表 DocsVersionsTable)');
      }
    }
  }
  // 首页 → 白皮书预览页（HomeDownload 白皮书区）
  for (const wp of api.whitepapers) {
    const home = findPage(`/${wp.locale}`);
    if (home) addEdge(home, `/${wp.locale}/white-papers/${wp.name}`, '(首页白皮书区 API: white-paper)');
  }
  // 首页 → 会议回放页（HomeCalendar 开发者日历，仅历史会议有回放）
  for (const locale of ['zh', 'en']) {
    const home = findPage(`/${locale}`);
    for (const mt of api.meetings) {
      if (home) addEdge(home, `/${locale}/meeting/replay/${encodeURIComponent(mt.group)}/${mt.mid}/${mt.date}`, '(首页开发者日历 API: meeting)');
    }
  }

  /* ---------- 5b. 模板实例计数 ---------- */
  // 有实例的模板节点（如 news/*slug、meeting/replay/*slug）不再计为孤岛/无入链：
  // 模板只是实例的聚合代表，实例本身已在图中并各自有入链。
  const templateInstanceCount = new Map();
  for (const { template, re } of templateMatchers) {
    let n = 0;
    for (const p of pages) {
      if (p.isTemplate) continue;
      if (re.test(p.pagePath)) n++;
    }
    templateInstanceCount.set(template, n);
  }
  const templateHasInstances = (pagePath) => (templateInstanceCount.get(pagePath) || 0) > 0;

  /* ---------- 6. 上游内链 + 统计 ---------- */
  const upstream = new Map();
  for (const [from, outs] of downstream) {
    for (const to of outs) {
      const ins = upstream.get(to) || new Set();
      ins.add(from);
      upstream.set(to, ins);
    }
  }

  const stats = {
    totalPages: pages.length,
    staticPages: pages.filter((p) => p.type === 'file').length,
    templatePages: dynamicRoutes.length,
    dynamicInstancePages: pages.filter((p) => ['news', 'docs', 'white-paper', 'meeting', 'instance'].includes(p.type)).length,
    authPages: pages.filter((p) => isAuthPage(p.pagePath)).length,
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
    redirectPages: [...redirectPages],
    topInbound: [],
    topOutbound: [],
    externalHosts: {},
    sectionStats: [],
  };
  for (const outs of downstream.values()) stats.totalEdges += outs.size;

  for (const page of pages) {
    const p = page.pagePath;
    const hasOut = downstream.has(p) && downstream.get(p).size > 0;
    const hasIn = upstream.has(p) && upstream.get(p).size > 0;
    const inNav = globalLinkTargets.has(p);
    // 有实例的模板节点豁免孤岛/无入链判定（实例已各自计入）
    const instanced = page.isTemplate && templateHasInstances(p);
    // 重定向跳板页豁免：进入即跳转，无自身内容，无补链价值
    const isRedirect = redirectPages.has(p);
    if (!hasIn && !instanced && !isRedirect) stats.noInboundPages.push(p);
    if (!hasOut && !instanced && !isRedirect) stats.noOutboundPages.push(p);
    if (!hasOut && !hasIn && !inNav && !instanced && !isRedirect) stats.orphanPages.push(p);
    if (!hasOut && !hasIn && inNav && !instanced && !isRedirect) stats.contentOrphanPages.push(p);
    if (!inNav) stats.pagesNotInNav.push(p);
    if (hasIn && !inNav) stats.contentInboundNoNav.push(p);
    if (inNav && !hasIn) stats.navInboundNoContent.push(p);
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
  for (const page of pages) {
    const sec = pageToSection(page.pagePath);
    const s = sectionMap.get(sec) || { section: sec, pages: 0, inDeg: 0, outDeg: 0, internal: 0, orphan: 0 };
    s.pages++;
    const hasOut = downstream.has(page.pagePath) && downstream.get(page.pagePath).size > 0;
    const hasIn = upstream.has(page.pagePath) && upstream.get(page.pagePath).size > 0;
    const instanced = page.isTemplate && templateHasInstances(page.pagePath);
    if (!hasOut && !hasIn && !instanced && !redirectPages.has(page.pagePath)) s.orphan++;
    sectionMap.set(sec, s);
  }
  for (const [from, outs] of downstream) {
    const fromSec = pageToSection(from);
    for (const to of outs) {
      const toSec = pageToSection(to);
      if (sectionMap.has(fromSec)) sectionMap.get(fromSec).outDeg++;
      if (sectionMap.has(toSec)) sectionMap.get(toSec).inDeg++;
      if (fromSec === toSec && sectionMap.has(fromSec)) sectionMap.get(fromSec).internal++;
    }
  }
  stats.sectionStats = [...sectionMap.values()].sort((a, b) => b.pages - a.pages);

  /* ---------- 7. 序列化 ---------- */
  const edges = [];
  for (const [from, outs] of downstream) {
    for (const to of outs) {
      edges.push({ from, to, sources: [...(edgeMeta.get(from + '\u0001' + to) || [])] });
    }
  }

  const pageRecords = pages.map((page) => {
    const p = page.pagePath;
    const out = downstream.has(p) ? [...downstream.get(p)] : [];
    const ins = upstream.has(p) ? [...upstream.get(p)] : [];
    const inNav = globalLinkTargets.has(p);
    const instanced = page.isTemplate && templateHasInstances(p);
    return {
      page: p,
      title: page.title || '',
      section: pageToSection(p),
      type: page.type,
      isTemplate: page.isTemplate,
      instanceCount: page.isTemplate ? templateInstanceCount.get(p) || 0 : undefined,
      isAuth: isAuthPage(p),
      isRedirect: redirectPages.has(p),
      outbound: out,
      inbound: ins,
      outCount: out.length,
      inCount: ins.length,
      inGlobalNav: inNav,
      globalNavSources: inNav ? [...new Set(globalLinkSources.get(p) || [])] : [],
      isOrphan: out.length === 0 && ins.length === 0 && !inNav && !instanced && !redirectPages.has(p),
      isContentOrphan: out.length === 0 && ins.length === 0 && !instanced && !redirectPages.has(p),
      externalHosts: externalLinks.has(p) ? [...externalLinks.get(p)] : [],
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

  const payload = {
    generatedAt: new Date().toISOString(),
    elapsedMs: Date.now() - t0,
    stats,
    sections: stats.sectionStats,
    sectionEdges,
    pages: pageRecords,
    edges,
    dynamicRoutes,
    globalLinks: [...globalLinkTargets].sort().map((p) => ({
      page: p,
      title: pageRecords.find((r) => r.page === p)?.title || '',
      sources: [...new Set(globalLinkSources.get(p) || [])],
    })),
    dataSources: {
      staticPages: stats.staticPages,
      templatePages: stats.templatePages,
      newsPages: newsCount,
      docsPages: pageRecords.filter((p) => p.type === 'docs' && !p.page.includes('/version/')).length,
      versionPages: pageRecords.filter((p) => p.type === 'docs' && p.page.includes('/version/')).length,
      whitepaperPages: pageRecords.filter((p) => p.type === 'white-paper').length,
      meetingPages: pageRecords.filter((p) => p.type === 'meeting').length,
      apiDocsFiles: api.docs.length,
      apiWhitepapers: api.whitepapers.length,
      apiMeetings: api.meetings.length,
      apiErrors: api.errors,
      newsContentMissing,
      skipApi: SKIP_API,
    },
  };

  /* ---------- 8. 写出 HTML ---------- */
  fs.writeFileSync(OUTPUT_HTML, buildHtml(payload), 'utf-8');

  console.log('┌──────────────────────────────────────────────────┐');
  console.log('│ 灵衢 UnifiedBus 站内内链分析完成');
  console.log('├──────────────────────────────────────────────────┤');
  console.log('│ 页面总数          :', String(stats.totalPages).padStart(8));
  console.log('│ ├ 静态页面(pages/) :', String(stats.staticPages).padStart(8));
  console.log('│ ├ 动态路由模板     :', String(stats.templatePages).padStart(8));
  console.log('│ └ 动态实例页       :', String(stats.dynamicInstancePages).padStart(8));
  console.log('│   (资讯/规范/白皮书/会议回放)');
  console.log('│ 管理/登录态页面    :', String(stats.authPages).padStart(8));
  console.log('│ 重定向跳板页      :', String(redirectPages.size).padStart(8));
  console.log('│ 内链边总数        :', String(stats.totalEdges).padStart(8));
  console.log('│ 有出链页面        :', String(stats.pagesWithOutbound).padStart(8));
  console.log('│ 有入链页面        :', String(stats.pagesWithInbound).padStart(8));
  console.log('│ 孤岛页面          :', String(stats.orphanPages.length).padStart(8));
  console.log('│ 无入链页面        :', String(stats.noInboundPages.length).padStart(8));
  console.log('├──────────────────────────────────────────────────┤');
  console.log('│ 全局导航覆盖页     :', String(stats.globalLinkPages).padStart(8));
  console.log('│ 未进入导航页面     :', String(stats.pagesNotInNav.length).padStart(8));
  console.log('│ 内容有入链但无导航 :', String(stats.contentInboundNoNav.length).padStart(8));
  if (api.errors.length) console.log('│ API 警告          :', api.errors.join(' ; ').slice(0, 80));
  console.log('├──────────────────────────────────────────────────┤');
  console.log('│ 报告已生成:', OUTPUT_HTML);
  console.log('└──────────────────────────────────────────────────┘');
}

/* ------------------------------------------------------------------ */
/* HTML 报告构建                                                        */
/* ------------------------------------------------------------------ */
function buildHtml(payload) {
  const json = JSON.stringify(payload);
  const stats = payload.stats;
  const ds = payload.dataSources;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const sectionOptions = payload.sections.map((s) => `<option value="${esc(s.section)}">${esc(s.section)} (${s.pages})</option>`).join('');
  const dynRows = payload.dynamicRoutes
    .map(
      (d) =>
        `<tr><td class="small">${esc(d.template)}</td><td class="small">${esc(d.file)}</td></tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>灵衢 UnifiedBus 站内内链看板</title>
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
  .b-type{background:rgba(167,139,250,.14);color:#c4b5fd}
  .b-auth{background:rgba(245,158,11,.12);color:#fbbf24}
  .b-redirect{background:rgba(100,116,139,.25);color:#cbd5e1}
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
    <h1>灵衢 UnifiedBus 站内内链看板</h1>
    <span class="muted">分析 <code>packages/website/pages/</code> 全部页面 + <code>.content/</code> YAML + 线上 API（规范/白皮书/会议）+ <code>content/</code> 资讯</span>
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
    <div class="grid2">
      <div class="panel">
        <h2>动态路由模板<span class="small"> · ${payload.dynamicRoutes.length} 个 · 实例由 API/内容枚举，模板节点代表全部实例</span></h2>
        <div style="max-height:280px;overflow:auto">
          <table><thead><tr><th>路由模板</th><th>页面文件</th></tr></thead><tbody>${dynRows}</tbody></table>
        </div>
      </div>
      <div class="panel">
        <h2>数据来源</h2>
        <table>
          <thead><tr><th>来源</th><th>页面数</th><th>说明</th></tr></thead>
          <tbody>
            <tr><td>pages/ 静态页面</td><td>${ds.staticPages}</td><td class="small">Nuxt 文件路由（.vue）</td></tr>
            <tr><td>动态路由模板</td><td>${ds.templatePages}</td><td class="small">[param] / [...slug] 模板节点</td></tr>
            <tr><td>资讯文章</td><td>${ds.newsPages}</td><td class="small">content/{zh,en}/news（@nuxt/content）${ds.newsContentMissing ? ' · <b style="color:#f87171">缺失，请先 pnpm merge</b>' : ''}</td></tr>
            <tr><td>规范文档预览页</td><td>${ds.docsPages}</td><td class="small">/docs/{file_name}（API: docs，${ds.apiDocsFiles} 个文件）</td></tr>
            <tr><td>全部版本页</td><td>${ds.versionPages}</td><td class="small">/docs/version/{type}（API type_name）</td></tr>
            <tr><td>白皮书预览页</td><td>${ds.whitepaperPages}</td><td class="small">/white-papers/{file_name}（API，${ds.apiWhitepapers} 个文件）</td></tr>
            <tr><td>会议回放页</td><td>${ds.meetingPages}</td><td class="small">/meeting/replay/{group}/{mid}/{date}（API，${ds.apiMeetings} 条会议）</td></tr>
            <tr><td>管理/登录态页面</td><td>${stats.authPages}</td><td class="small">my/审核/管理类，看板可一键过滤</td></tr>
          </tbody>
        </table>
        ${ds.skipApi ? '<p class="small" style="color:#fbbf24">⚠ SKIP_API=1：本次为离线静态分析，未补充 API 动态实例。</p>' : ''}
        ${ds.apiErrors && ds.apiErrors.length ? `<p class="small" style="color:#fbbf24">⚠ API 警告：${esc(ds.apiErrors.join(' ; '))}</p>` : ''}
      </div>
    </div>
  </section>

  <!-- 页面列表 -->
  <section id="tab-pages" class="tabc hidden">
    <div class="panel">
      <div class="toolbar">
        <input id="pageSearch" placeholder="搜索标题或路径（如 /zh/docs/）" style="width:280px" />
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
        <button class="ghost active" id="btnHideAuth">显示管理/登录页</button>
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
        <button class="ghost" id="btnHideAuthGraph">隐藏管理/登录页</button>
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
    <div class="toolbar">
      <button class="ghost active" id="btnHideAuthOrphan">显示管理/登录页</button>
      <span class="small">管理/登录态页面（my/审核/管理类）对 GEO 无优化价值，可过滤后聚焦公开页面</span>
    </div>
    <div class="two-col">
      <div class="panel">
        <h2>孤岛页面（无内容链且未入导航）<span class="small"> · <span id="cntOrphan"></span> 页 · 最高优先级补链</span></h2>
        <div class="linklist" id="orphanList"></div>
      </div>
      <div class="panel">
        <h2>未进入全局导航的页面<span class="small"> · <span id="cntNotNav"></span> 页</span></h2>
        <div class="linklist" id="notInNavList"></div>
      </div>
    </div>
    <div class="two-col" style="margin-top:16px">
      <div class="panel">
        <h2>内容强·入口弱（有内容入链但不在导航）<span class="small"> · <span id="cntContentNoNav"></span> 页 · 建议加导航/补链接</span></h2>
        <div class="linklist" id="contentNoNavList"></div>
      </div>
      <div class="panel">
        <h2>导航有·内容无（在导航但无内容入链）<span class="small"> · <span id="cntNavNoContent"></span> 页 · 建议补内容内链</span></h2>
        <div class="linklist" id="navNoContentList"></div>
      </div>
    </div>
    <div class="two-col" style="margin-top:16px">
      <div class="panel">
        <h2>无内容上下游页面（仅靠导航存活）<span class="small"> · <span id="cntContentOrphan"></span> 页</span></h2>
        <div class="linklist" id="contentOrphanList"></div>
      </div>
      <div class="panel">
        <h2>无内容入链页面<span class="small"> · <span id="cntNoIn"></span> 页</span></h2>
        <div class="linklist" id="noInList"></div>
      </div>
    </div>
    <div class="panel" style="margin-top:16px">
      <h2>重定向跳板页（definePageMeta redirect / onMounted 跳转，不参与统计）<span class="small"> · <span id="cntRedirect"></span> 页</span></h2>
      <div class="linklist" id="redirectList"></div>
    </div>
    <div class="panel" style="margin-top:16px">
      <h2>全局导航覆盖页面（AppHeader/AppFooter 导航链）<span class="small"> · <span id="cntGlobalNav"></span> 页</span></h2>
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
      <h2>说明与方法论</h2>
      <ul class="small">
        <li>页面来源：<code>packages/website/pages/</code> 全部 .vue（Nuxt 文件路由，跳过根 index.vue 重定向页）+ <code>content/{zh,en}/news</code> 资讯 Markdown + API 枚举的动态实例（规范 /docs/、白皮书 /white-papers/、会议回放 /meeting/replay/）。</li>
        <li>链接提取：模板 <code>href/:href/:to</code>、TS 对象属性（href/url/path/link/software_link/backUrl）、编程式导航（<code>navigateTo/router.push/router.replace/redirect/window.open</code>）、模板字符串（locale 变量展开为 zh+en）、引号站内路径字面量；页面 import 链递归 6 层（含 Nuxt 自动导入组件与 composable）。<code>backUrl</code>（definePageMeta）由 AppHeaderMobile 返回按钮消费；字符串变换 <code>str.replace('/docs/', …)</code> 第一参非目标 URL，不提取。</li>
        <li><b>动态模板页壳出链</b>：模板 .vue（如 <code>news/[...slug].vue</code> → TheNewsDetail 面包屑 → <code>/{locale}/news</code>）的出链是每个实例页都渲染的公共 UI（面包屑/返回按钮），同时归属到模板节点与全部实例页（来源标注「模板页壳」）。</li>
        <li><code>.content/</code> YAML（nav/home/learning/software/simulation）经 <code>#content/</code> 虚拟模块接入：nav 链接归全局导航；home banner 的 <code>href</code>（资讯）与 <code>id: UB-*</code>（规范预览）归首页出边。</li>
        <li><code>config/statement/{zh,en}/*.md</code> 声明 Markdown：TheStatement 组件按 <code>category</code> 静态绑定渲染到隐私/Cookie/使用条款等声明页，其中的 Markdown 链接（如 privacy → 个人信息收集清单/第三方共享清单/cookies）归入对应声明页出边。</li>
        <li>全局导航：<code>layouts/default.vue</code> 引用链（AppHeader/AppHeaderMobile/AppFooter/CookieNotice → <code>.content/nav</code>）中的链接单独归为「全局导航」，<b>不注入到每页出边</b>，避免指标失真。</li>
        <li>API 补充：<code>/api-server/web/v1/docs</code>（规范，base 2.0.0 + 最新版）、<code>/api-server/web/v1/white-paper</code>（白皮书）、<code>/api-meeting/meeting/</code>（会议回放，仅历史会议），补充首页→文档/白皮书/回放、版本页→各文档的动态内链。可通过 <code>SKIP_API=1</code> 跳过。</li>
        <li>内链判定：<code>www.unifiedbus.com</code> 域名，或 <code>/zh/…</code>、<code>/en/…</code> 站内路径（无 locale 前缀的路径按 <code>handleUrl</code> 约定展开为 zh+en 两版）；<code>/api-*</code> 为接口、<code>/category|/statement|/_ipx|/nav</code> 等为资源，不计入。</li>
        <li>动态链接（含 <code>\${…}</code> 运行时变量）按位置匹配动态路由模板，边指向模板节点（代表全部实例）；guid/feedback 详情页等 id 驱动页面因此以模板节点出现。</li>
        <li>四类页面分类：<b>孤岛</b>=无内容链且未入导航；<b>内容强·入口弱</b>=有内容入链但不在导航；<b>导航有·内容无</b>=在导航但无内容入链；<b>仅导航</b>=无内容上下游但靠导航存活。</li>
        <li>管理/登录态页面（<code>my/*</code>、guid 管理/审核、feedback 审核/详情、meeting 创建/编辑、docs/license-agree、docs/mobile）可一键过滤，聚焦公开内容页的 GEO 内链优化。<code>LOGIN_GUARD_LIST</code> 为软守卫（await 登录不拦截），docs/guid/feedback 首页仍属公开内容页。</li>
        <li>重定向跳板页（<code>definePageMeta redirect</code> 或空模板 + onMounted 跳转，如 <code>/guid</code>、<code>/legal</code>、<code>/software</code>）无自身内容，跳转目标边保留，页面不计入孤岛/无入链统计。</li>
        <li>标题来源：资讯 frontmatter <code>title</code>、API <code>title</code>、页面 <code>definePageMeta title.zh</code>；其余显示路径。</li>
        <li>局限：error.vue 错误页、<code>nuxt.config.ts</code> llms/sitemap 链接未计入；活动（activity）API 当前无 href 字段未纳入；会议回放 URL 按当前会议数据快照枚举。</li>
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

  var pages = D.pages;
  var pageIndex = {};
  pages.forEach(function(p){ pageIndex[p.page] = p; });
  var hideAuth = false;

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
  var TYPE_LABEL = {file:'静态', template:'模板', news:'资讯', docs:'规范', 'white-paper':'白皮书', meeting:'会议', instance:'实例'};
  function typeBadge(p){
    return p.isAuth ? '<span class="badge b-auth">管理</span> ' : '';
  }

  // ---- 卡片（随管理页过滤联动） ----
  function renderCards(){
    var vis = pages.filter(function(p){ return !hideAuth || !p.isAuth });
    var cnt = {
      total: vis.length,
      edges: D.edges.filter(function(e){ var f=pageIndex[e.from],t=pageIndex[e.to]; return (!hideAuth||!f||!f.isAuth)&&(!hideAuth||!t||!t.isAuth) }).length,
      orphan: vis.filter(function(p){return p.isOrphan}).length,
      notNav: vis.filter(function(p){return !p.inGlobalNav}).length,
      contentNoNav: vis.filter(function(p){return p.inCount>0 && !p.inGlobalNav}).length,
      navPages: vis.filter(function(p){return p.inGlobalNav}).length,
      redirect: vis.filter(function(p){return p.isRedirect}).length,
      auth: pages.filter(function(p){return p.isAuth}).length
    };
    var cards = [
      { label:'页面总数', value:cnt.total, sub:'静态/模板/动态实例（API+内容）' },
      { label:'内链边总数', value:cnt.edges, sub:'平均每页 '+(cnt.edges/Math.max(cnt.total,1)).toFixed(2)+' 条' },
      { label:'孤岛页面', value:cnt.orphan, sub:'无内容链且未入导航', cls:'danger' },
      { label:'未进入导航', value:cnt.notNav, sub:'全局导航未覆盖', cls:'warn' },
      { label:'内容强·入口弱', value:cnt.contentNoNav, sub:'有内容入链·无导航', cls:'warn' },
      { label:'导航覆盖页', value:cnt.navPages, sub:'在全局导航中', cls:'ok' },
      { label:'重定向跳板页', value:cnt.redirect, sub:'进入即跳转·不参与统计' },
      { label:'管理/登录态页', value:cnt.auth, sub:'my/审核/管理类（可过滤）' }
    ];
    var h = '';
    cards.forEach(function(c){
      h += '<div class="card ' + (c.cls||'') + '"><div class="v">' + c.value + '</div><div class="l">' + c.label + '</div><div class="s">' + (c.sub||'') + '</div></div>';
    });
    document.getElementById('cards').innerHTML = h;
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
  function renderSectionTable(){
    var sections = D.sections.map(function(s){
      var vis = pages.filter(function(p){ return p.section===s.section && (!hideAuth||!p.isAuth) });
      var orphan = vis.filter(function(p){return p.isContentOrphan && !p.inGlobalNav}).length;
      return { section:s.section, pages:vis.length, orphan:orphan };
    }).filter(function(s){return s.pages>0});
    var secMax = Math.max.apply(null, sections.map(function(s){return s.pages}));
    var tbl = '<thead><tr><th>板块</th><th>页面数</th><th>孤岛</th></tr></thead><tbody>';
    sections.forEach(function(s){
      tbl += '<tr><td>' + s.section + '</td><td>' + s.pages + '</td><td>' + (s.orphan ? '<span class="badge b-danger">'+s.orphan+'</span>' : 0) + '</td></tr>';
    });
    tbl += '</tbody>';
    document.getElementById('sectionTable').innerHTML = tbl;
    return sections;
  }

  // ---- 板块图（G6 力导向） ----
  var secColorMap = {};
  var palette = ['#4f8cff','#22d3ee','#a78bfa','#f59e0b','#22c55e','#ef4444','#ec4899','#14b8a6','#eab308','#8b5cf6','#06b6d4','#f97316','#3b82f6','#10b981'];
  var secGraph = null;
  function renderSectionGraph(){
    var sections = renderSectionTable();
    sections.forEach(function(s,i){ secColorMap[s.section] = palette[i%palette.length]; });
    var sgNodes = sections.map(function(s){
      return { id:s.section, label:s.section, size:10+Math.sqrt(s.pages)*6, style:{fill:secColorMap[s.section]} };
    });
    var nodeIds = {}; sgNodes.forEach(function(n){nodeIds[n.id]=true});
    var sgEdges = D.sectionEdges.filter(function(e){ return nodeIds[e.from]&&nodeIds[e.to] }).map(function(e){
      return { source:e.from, target:e.to, style:{lineWidth:Math.min(1+Math.log(e.weight),8),stroke:'#4f8cff',strokeOpacity:0.5} };
    });
    if (typeof G6 === 'undefined') {
      document.getElementById('sectionGraph').innerHTML = '<div style="padding:24px;color:var(--muted)">G6 CDN 加载失败（可能离线），表格与钻取功能仍可用。</div>';
      return;
    }
    if (secGraph){ secGraph.destroy() }
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
      if (hideAuth && p.isAuth) return false;
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
      else if(p.isRedirect){ badge = '<span class="badge b-redirect">重定向</span>' }
      else if(p.isContentOrphan){ badge = p.inGlobalNav ? '<span class="badge b-navOnly">仅导航</span>' : '<span class="badge b-orphan">内容孤岛</span>' }
      else if(p.inCount===0){ badge = p.inGlobalNav ? '<span class="badge b-navOnly">仅导航</span>' : '<span class="badge b-noIn">无入链</span>' }
      else { badge = '<span class="badge b-ok">已连通</span>' }
      var navBadge = p.inGlobalNav ? '<span class="badge b-ok">在导航</span>' : '<span class="badge b-noIn">未入导航</span>';
      var typeTag = '<span class="badge b-type" title="页面类型">' + (TYPE_LABEL[p.type]||p.type) + '</span> ' + typeBadge(p);
      var titleCell = p.title ? typeTag + esc(p.title) : typeTag + '<span class="small">（无标题）</span>';
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

  // ---- 页面级图 ----
  var graphRendered = false;
  var pageGraph = null;
  function renderPageGraph(){
    var sec = document.getElementById('graphSectionFilter').value;
    var subset = pages.filter(function(p){
      if(sec && p.section!==sec) return false;
      if(hideAuth && p.isAuth) return false;
      return true;
    });
    var nodes = [], edges = [];
    var withEdge = subset.filter(function(p){return p.inCount>0||p.outCount>0});
    var orphans = subset.filter(function(p){return p.isOrphan});
    if(withEdge.length + orphans.length > 1400){
      orphans = orphans.slice(0,200);
    }
    var finalList = withEdge.concat(orphans);
    finalList.forEach(function(p){
      nodes.push({ id:p.page, label:shortLabel(p.page), size:p.inCount>0?6+Math.min(Math.sqrt(p.inCount)*2.4,18):5, style:{fill:p.isOrphan?'#ef4444':(secColorMap[p.section]||'#4f8cff')}, pageData:p, isOrphan:p.isOrphan });
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
    var h = arr.map(function(p){
      var rec = pageIndex[p]||{};
      return '<a href="javascript:void(0)" data-go="'+p+'"><span class="lt-title">'+esc(titleFor(p)||p)+'</span> <span class="small">'+p+' '+(rec.isAuth?'[管理页]':'')+(rec.isRedirect?'[重定向]':'')+'</span></a>';
    }).join('') || '<span class="small">无</span>';
    document.getElementById(id).innerHTML = h;
    return arr.length;
  }
  function renderOrphanLists(){
    var vis = function(list){ return list.filter(function(p){ var r=pageIndex[p]; return !hideAuth || !r || !r.isAuth }) };
    document.getElementById('cntOrphan').textContent = vis(D.stats.orphanPages).length;
    document.getElementById('cntNotNav').textContent = vis(D.stats.pagesNotInNav).length;
    document.getElementById('cntContentNoNav').textContent = vis(D.stats.contentInboundNoNav).length;
    document.getElementById('cntNavNoContent').textContent = vis(D.stats.navInboundNoContent).length;
    document.getElementById('cntContentOrphan').textContent = vis(D.stats.contentOrphanPages).length;
    document.getElementById('cntNoIn').textContent = vis(D.stats.noInboundPages).length;
    document.getElementById('cntGlobalNav').textContent = D.stats.globalLinkPages;
    fillList('orphanList', vis(D.stats.orphanPages));
    fillList('contentOrphanList', vis(D.stats.contentOrphanPages));
    fillList('notInNavList', vis(D.stats.pagesNotInNav));
    fillList('contentNoNavList', vis(D.stats.contentInboundNoNav));
    fillList('navNoContentList', vis(D.stats.navInboundNoContent));
    fillList('noInList', vis(D.stats.noInboundPages));
    fillList('redirectList', D.stats.redirectPages || []);
    document.getElementById('cntRedirect').textContent = (D.stats.redirectPages || []).length;
    var glHtml = D.globalLinks.map(function(g){
      return '<a href="javascript:void(0)" data-go="'+g.page+'"><span class="lt-title">'+esc(g.title||'(无标题)')+'</span> <span class="small">'+g.page+' ['+g.sources.join(', ')+']</span></a>';
    }).join('') || '<span class="small">无</span>';
    document.getElementById('globalNavList').innerHTML = glHtml;
  }

  // ---- 管理页过滤开关 ----
  function bindAuthToggle(btnId, labelOn, labelOff, after){
    var btn = document.getElementById(btnId);
    btn.addEventListener('click', function(){
      hideAuth = !hideAuth;
      btn.classList.toggle('active', !hideAuth);
      btn.textContent = hideAuth ? labelOff : labelOn;
      renderCards(); renderSectionGraph(); renderPageTable(); renderOrphanLists();
      if(pageGraph){ renderPageGraph() }
      if(after) after();
    });
  }
  bindAuthToggle('btnHideAuth', '显示管理/登录页', '已隐藏管理/登录页');
  bindAuthToggle('btnHideAuthGraph', '显示管理/登录页', '已隐藏管理/登录页');
  bindAuthToggle('btnHideAuthOrphan', '显示管理/登录页', '已隐藏管理/登录页');
  document.getElementById('btnRender').addEventListener('click', renderPageGraph);

  // ---- top 列表 ----
  function topHtml(arr){
    var max = Math.max.apply(null, arr.map(function(x){return x.count}));
    var h = '<table><thead><tr><th>标题</th><th>路径</th><th>数量</th><th></th></tr></thead><tbody>';
    arr.forEach(function(x){
      var t = titleFor(x.page) || x.page;
      h += '<tr><td><a href="javascript:void(0)" data-go="'+x.page+'">'+esc(t)+'</a></td><td class="small">'+x.page+'</td><td>'+x.count+'</td><td><div class="bar" style="width:120px"><span style="width:'+(max?x.count/max*100:0)+'%"></span></div></td></tr>';
    });
    h += '</tbody></table>';
    return h;
  }
  document.getElementById('topIn').innerHTML = topHtml(D.stats.topInbound);
  document.getElementById('topOut').innerHTML = topHtml(D.stats.topOutbound);

  // ---- 外链域名 ----
  var eh = D.stats.externalHosts;
  var eMax = eh.length?eh[0].count:1;
  var ehH = '<table><thead><tr><th>域名</th><th>页面数</th><th></th></tr></thead><tbody>';
  eh.forEach(function(x){ ehH += '<tr><td>'+x.host+'</td><td>'+x.count+'</td><td><div class="bar" style="width:200px"><span style="width:'+x.count/eMax*100+'%"></span></div></td></tr>' });
  ehH += '</tbody></table>';
  document.getElementById('extHosts').innerHTML = ehH;

  // ---- 初始化 ----
  renderCards();
  renderSectionGraph();
  renderPageTable();
  renderOrphanLists();

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
