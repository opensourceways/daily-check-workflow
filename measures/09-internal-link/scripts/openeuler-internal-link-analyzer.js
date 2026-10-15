/*
 * openEuler Portal — 站内内链分析器
 *
 * 扫描 app/zh 与 app/en 下全部 .md 页面（VitePress 文件路由），
 * 提取页面正文链接 + 页面直接引用的 Vue 视图组件（递归）中的静态链接，
 * 并调用线上新闻/博客列表接口补充动态生成的文章内链（list→article / article→page），
 * 按 www.openeuler.org / www.openeuler.openatom.cn 域名与站内相对路径
 * 判定为内链，构建有向链接图，输出自包含 HTML 看板：
 *   - 总览统计卡片
 *   - 板块级聚合关系图（G6 力导向）
 *   - 页面级关系图（G6，按板块过滤 + 搜索高亮，节点显示标题）
 *   - 页面列表（上下游内链上钻/下钻表格，链接+标题）
 *   - 孤岛页面（无上下游内链）等关键数据
 *
 * 用法:  node scripts/internal-link-analyzer.js
 * 产物:  internal-link-report.html (仓库根目录，自包含，浏览器直接打开)
 *
 * 环境变量:
 *   SKIP_API=1  跳过 API 调用（离线模式，仅静态分析）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'app');
const SRC_NEW = path.join(APP, '.vitepress', 'src-new');
const SRC_OLD = path.join(APP, '.vitepress', 'src');

const INTERNAL_DOMAINS = [
  'www.openeuler.org',
  'www.openeuler.openatom.cn',
];

const API_BASE = 'https://www.openeuler.openatom.cn';
const API_PAGE_SIZE = 100;
const SKIP_API = process.env.SKIP_API === '1';

const OUTPUT_HTML = path.join(ROOT, 'internal-link-report.html');

// 全局布局组件：通过 VitePress 主题 Layout（@/App.vue）注入到所有页面，
// 不在任何 .md 的 <script setup> import 链上，需单独处理。
// 每个 .md 页面都会发出这些组件中包含的链接。
const GLOBAL_LAYOUT_COMPONENTS = [
  path.join(SRC_NEW, 'components', 'AppHeader.vue'),
  path.join(SRC_NEW, 'components', 'AppFooter.vue'),
  path.join(SRC_NEW, 'components', 'FloatingButton.vue'),
  path.join(SRC_NEW, 'components', 'FloatingButtonEn.vue'),
];

// 分类布局组件：由 App.vue 的 compMapping 按 frontmatter.category 动态注入到特定页面。
// 每个布局组件 import 了 content YAML（侧边栏导航），其链接归属于使用该 category 的页面。
// 映射关系来自 app/.vitepress/src/App.vue 的 compMapping
const CATEGORY_LAYOUT_COMPONENTS = {
  'about-us': path.join(SRC_OLD, 'layouts', 'LayoutAboutUs.vue'),
  'about-us-archived': path.join(SRC_OLD, 'layouts', 'LayoutAboutUsArchived.vue'),
  wiki: path.join(SRC_OLD, 'layouts', 'LayoutWiki.vue'),
  faq: path.join(SRC_OLD, 'layouts', 'LayoutFAQ.vue'),
  migration: path.join(SRC_OLD, 'layouts', 'LayoutMigration.vue'),
  security: path.join(SRC_OLD, 'layouts', 'LayoutSecurity.vue'),
  'white-paper': path.join(SRC_OLD, 'layouts', 'LayouWhitePaper.vue'),
};

// 视图组件递归扫描深度上限（避免无限递归 + 控制耗时）
const MAX_COMPONENT_DEPTH = 5;
// 被超过该数量页面引用的组件视为「结构性组件」（导航/页脚等），报告中可单独折叠
const SHARED_COMPONENT_THRESHOLD = 8;

function readText(p) {
  try {
    return fs.readFileSync(p, 'utf-8');
  } catch (_e) {
    return '';
  }
}

function isMarkdown(p) {
  return p.toLowerCase().endsWith('.md');
}

function walkDir(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.vitepress' || entry.name === 'dist') continue;
      walkDir(full, out);
    } else if (entry.isFile() && isMarkdown(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

// 将 .md 文件绝对路径转换为规范页面 URL 路径
function mdFileToPagePath(absPath) {
  let rel = path.relative(APP, absPath).replace(/\\/g, '/');
  rel = rel.replace(/\.md$/i, '');
  const isIndex = /\/index$/.test(rel) || rel === 'index';
  if (isIndex) {
    rel = rel.replace(/\/?index$/, '/');
    if (!rel.endsWith('/')) rel += '/';
  }
  let p = '/' + rel;
  if (p !== '/' && !p.endsWith('/') && !path.extname(p)) {
    // 命名路由，保持无尾斜杠
  }
  return p;
}

// 候选链接规范化：去 hash/query、去 .html、补全、匹配页面集
function canonicalizeUrl(raw) {
  let u = raw.trim();
  u = u.split('#')[0];
  u = u.split('?')[0];
  u = u.replace(/\.html$/i, '');
  u = u.replace(/\/index$/i, '/');
  if (u.endsWith('/index')) u = u.slice(0, -'index'.length);
  if (!u.startsWith('/')) u = '/' + u;
  if (u !== '/' && !u.endsWith('/') && !path.extname(u) && !u.includes('/index')) {
    // 可能是无尾斜杠的 index 路由，下方 findPage 会兜底
  }
  return u;
}

// 解析一条原始链接，返回 { type, target }
// type: 'internal' | 'external' | 'asset' | 'anchor' | 'other'
function classifyLink(raw, currentPagePath, _currentMdDir) {
  const url = raw.trim();
  if (!url) return { type: 'other', target: '' };

  // 锚点
  if (url.startsWith('#')) return { type: 'anchor', target: url };

  // mailto / tel / javascript / data
  if (/^(mailto:|tel:|javascript:|data:|blob:)/i.test(url)) return { type: 'other', target: url };

  let protocol = '';
  const protoMatch = url.match(/^([a-z]+:)?\/\//i);
  if (url.startsWith('//')) {
    return { type: 'external', target: url };
  }
  if (protoMatch) protocol = protoMatch[1] || '';

  if (protocol) {
    // 绝对 URL
    const rest = url.slice(protocol.length + 2); // 去掉 scheme://
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
    return { type: 'internal', target: url };
  }

  // 相对路径 ./xx 或 ../xx 或 xx
  if (url.startsWith('./') || url.startsWith('../') || !url.includes('://')) {
    // 解析相对文件
    const resolved = path.posix.normalize(
      path.posix.join(currentPagePath.replace(/\/$/, '') + '/', url)
    );
    // 资源类后缀直接判定为 asset
    if (/\.(png|jpg|jpeg|gif|svg|webp|ico|bmp|mp4|mp3|pdf|zip|tar|gz|rar|7z|iso|rpm|deb|exe|msi|pkg|woff2?|ttf|otf|eot|css|js|json|yaml|yml|xml|txt|csv|docx?|xlsx?|pptx?)$/i.test(resolved)) {
      return { type: 'asset', target: resolved };
    }
    // 若以已知资源目录开头也视为 asset
    if (/(^|\/)(image|images|img|assets|static|public|media|files)(\/|$)/i.test(resolved)) {
      return { type: 'asset', target: resolved };
    }
    // 其余相对路径若解析后指向站内路径形态
    if (resolved.startsWith('/zh/') || resolved.startsWith('/en/') || resolved === '/zh' || resolved === '/en' || resolved === '/') {
      return { type: 'internal', target: resolved };
    }
    // 形如 zh/... en/... （相对当前页解析后落在 zh/en 下）
    if (/^\/?(zh|en)\//.test(resolved)) {
      return { type: 'internal', target: resolved.startsWith('/') ? resolved : '/' + resolved };
    }
    return { type: 'other', target: resolved };
  }

  return { type: 'other', target: url };
}

// 清洗单条原始链接：去包裹引号/反引号、首尾空白与常见尾标点
function cleanRawLink(raw) {
  let s = String(raw).trim();
  // 去掉成对包裹的引号 / 反引号
  if ((s.startsWith('`') && s.endsWith('`')) || (s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  // 行内残留的单侧反引号（模板字符串被 href 捕获）
  s = s.replace(/`/g, '');
  return s;
}

// 提取 .md / .vue / .ts / .tsx / .js 文本中的全部原始链接
function extractRawLinks(content) {
  const links = [];
  // 1. Markdown 链接 [text](url)  —— 跳过图片 ![alt](url)
  const mdLinkRe = /(^|[^!])\[(?:[^\]]*)\]\(([^)]+)\)/g;
  let m;
  while ((m = mdLinkRe.exec(content)) !== null) {
    let url = cleanRawLink(m[2]);
    // 处理 [text]( <url> "title") 形式
    url = url.split(/\s+/)[0];
    if (url) links.push(url);
  }
  // 2. HTML href="..." / href='...'
  const hrefRe = /href\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  while ((m = hrefRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1] ?? m[2] ?? '');
    if (url) links.push(url);
  }
  // 2b. TS/JS 对象属性 href: '...' / path: '...' / link: '...' / url: '...'
  //     匹配 i18n 数据文件（header-zh.ts 等的 NAV_ROUTER）中的链接
  const objPropRe = /(?:href|path|link|url)\s*:\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/gi;
  while ((m = objPropRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1] ?? m[2] ?? m[3] ?? '');
    if (url) links.push(url);
  }
  // 3. router-link :to / to / .push / router.go / window.open / location.href
  const toRe = /(?:router-link[^>]*\bto|:to|\.push|\.go|window\.open|location\.href)\s*[(=]?\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/gi;
  while ((m = toRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1] ?? m[2] ?? m[3] ?? '');
    if (url) links.push(url);
  }
  // 3b. return `...` （computed 中的模板字符串返回值，仅匹配疑似路由的）
  // 过滤：必须以 /、https://、或 ${ 开头（排除 last-cell-0 等非 URL）
  const returnRe = /return\s+`((?:\/[^`]*|https?:\/\/[^`]*|\$\{[^}]*\}\/[^`]*))`/g;
  while ((m = returnRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1]);
    if (url) links.push(url);
  }
  // 4. 裸 URL（行内 https://...）
  const bareRe = /(?:^|[\s(])(https?:\/\/[^\s)<"'`，。、；！？）】]+)/g;
  while ((m = bareRe.exec(content)) !== null) {
    let url = cleanRawLink(m[1]).replace(/[.,;:!?）】]+$/, '');
    if (url) links.push(url);
  }
  return links;
}

// 从模板字符串中扩展 ${locale} / ${locale.value} → zh + en 两份
function expandTemplateLinks(rawLinks) {
  const out = [];
  for (let l of rawLinks) {
    // 替换 import.meta.env.VITE_MAIN_DOMAIN_URL → 空字符串（站内域名，去掉后是 /zh/... 站内路径）
    l = l.replace(/\$\{import\.meta\.env\.VITE_MAIN_DOMAIN_URL\}/g, '');
    // 替换其他 VITE_* 环境变量（非站内域名，跳过）
    if (/\$\{import\.meta\.env\./.test(l) && !/\/(zh|en)\//.test(l)) {
      continue; // 跳过含未解析 env 变量且无 locale 路径的链接
    }
    // 去掉残留的 import.meta.env.xxx（VITE_SERVICE_SOFTWARE_URL 等）
    l = l.replace(/\$\{import\.meta\.env\.[^}]+\}/g, '');
    l = l.trim();
    if (!l) continue;
    // locale/lang 模板展开（${locale}、${locale.value}、${lang}、${lang.value}）
    if (/\$\{[^}]*(?:locale|lang)[^}]*\}/i.test(l)) {
      out.push(l.replace(/\$\{[^}]*(?:locale|lang)[^}]*\}/gi, 'zh'));
      out.push(l.replace(/\$\{[^}]*(?:locale|lang)[^}]*\}/gi, 'en'));
    } else {
      out.push(l);
    }
  }
  return out;
}

// 从 YAML 文件中提取链接
// 匹配 href: / url: / path: / link: 属性值（单行，含引号或无引号）
// 以及数组项中的 /zh/ 或 /en/ 开头路径
// 对于不含 locale 前缀的站内路径（如 /projects/xxx），生成 zh + en 两个版本
//   （组件运行时用 `/${locale}${url}` 拼接，YAML 中存储的是去 locale 的相对路径）
// contentBasePath: 该 YAML 对应的内容模块在 .content/ 下的相对路径（如 'community'）
//   用于解析路径段式 link（如 link: charter → /{locale}/community/charter/）
function extractYamlLinks(content, contentBasePath) {
  const rawLinks = [];
  const segmentLinks = []; // 路径段式 link（需拼接 contentBasePath）
  // 1. 对象属性：所有可能含 URL 的字段名
  const URL_FIELDS = 'href|url|path|link|htmlPage|html_page|ppt_link|pptLink|video_link|videoLink|repo_link|repoLink|home_page|homePage|replay_link|replayLink|apply_link|applyLink|apply_event|applyEvent|contribution_detail_link|contributionDetailLink|bg_url|bgUrl';
  const propRe = new RegExp('^\\s*(?:' + URL_FIELDS + ')\\s*:\\s*(.+)$', 'gm');
  let m;
  while ((m = propRe.exec(content)) !== null) {
    let val = m[1].trim();
    // 去引号
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // 去 inline comment
    val = val.split(/\s+#/)[0].trim();
    if (!val) continue;
    // 判断是否是路径段（纯单词/斜杠组合，无 http/开头斜杠）
    if (/^[a-z][a-z0-9-]*(\/[a-z0-9-]+)*$/i.test(val) && !/^(https?|mailto|tel|javascript)/i.test(val)) {
      segmentLinks.push(val);
    } else {
      rawLinks.push(val);
    }
  }
  // 2. 数组项：- /zh/... 或 - /en/...
  const arrRe = /^\s*-\s+(\/(?:zh|en)\/[^\s]+)/gm;
  while ((m = arrRe.exec(content)) !== null) {
    rawLinks.push(m[1]);
  }
  // 3. 裸 URL（含 www.openeuler 域名）
  const bareRe = /(?:https?:\/\/www\.openeuler\.(?:org|openatom\.cn))([^\s'"`]+)/g;
  while ((m = bareRe.exec(content)) !== null) {
    rawLinks.push(m[0]);
  }

  // 后处理：补全 locale 前缀
  const links = [];
  for (let val of rawLinks) {
    // zh/xxx → /zh/xxx
    if (/^(zh|en)\//.test(val)) {
      val = '/' + val;
    }
    // /projects/xxx 等（不含 /zh/ 或 /en/ 前缀的站内路径）→ 生成 zh + en 两版
    if (val.startsWith('/') && !val.startsWith('/zh/') && !val.startsWith('/en/') && !val.startsWith('//') && !/^https?:/.test(val)) {
      // 排除资源文件路径（.png .jpg .svg 等）和 public 路径
      if (!/\.(png|jpg|jpeg|gif|svg|webp|ico|bmp|mp4|mp3|pdf|zip|css|js|woff2?|ttf|otf|eot)$/i.test(val)) {
        links.push('/zh' + val);
        links.push('/en' + val);
        continue;
      }
    }
    links.push(val);
  }

  // 路径段式 link：拼接 contentBasePath
  // 如 contentBasePath='community', segment='charter' → /{locale}/community/charter/
  // 如 contentBasePath='wiki', segment='about/quick-start' → /{locale}/wiki/about/quick-start/
  if (contentBasePath && segmentLinks.length > 0) {
    for (const seg of segmentLinks) {
      // 特殊情况：link 值 == contentBasePath（如 migration → /{locale}/migration/）
      const segPath = seg === contentBasePath ? '' : '/' + seg;
      links.push(`/zh/${contentBasePath}${segPath}/`);
      links.push(`/en/${contentBasePath}${segPath}/`);
    }
  }
  return links;
}

// 解析 .md <script setup> 中的 import 路径
// 返回：绝对文件路径数组（#content/ YAML 模块可能返回多个路径）
function parseMdImports(content, mdAbsPath) {
  const imports = [];
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  if (!scriptMatch) return imports;
  const script = scriptMatch[1];
  const importRe = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  let m;
  while ((m = importRe.exec(script)) !== null) {
    const spec = m[1];
    const resolved = resolveImport(spec, mdAbsPath);
    if (Array.isArray(resolved)) {
      imports.push(...resolved);
    } else if (resolved) {
      imports.push(resolved);
    }
  }
  return imports;
}

// 解析 import 说明符到绝对文件路径
// 返回：绝对文件路径（.vue/.ts/.js），或字符串数组（#content/ YAML 模块的特殊标记）
function resolveImport(spec, fromFile) {
  let base;
  if (spec.startsWith('~@/')) {
    base = SRC_NEW;
    return resolveFile(base, spec.slice(3));
  }
  if (spec.startsWith('@/')) {
    base = SRC_OLD;
    return resolveFile(base, spec.slice(2));
  }
  if (spec.startsWith('#content/')) {
    // .content/ 下的 YAML 内容模块：spec='#content/projects' → 目录 .content/projects/
    // 模块导出 { zh, en }，由 zh.yaml + en.yaml 合成
    const relPath = spec.slice('#content/'.length);
    const contentDir = path.join(ROOT, '.content', relPath);
    return resolveContentModule(contentDir, relPath);
  }
  if (spec.startsWith('#cms')) return null;
  if (spec.startsWith('.')) {
    base = path.dirname(fromFile);
    return resolveFile(base, spec);
  }
  // 包导入（跳过）
  return null;
}

function resolveFile(base, rel) {
  rel = rel.replace(/\\/g, '/');
  const candidates = [
    path.join(base, rel),
    path.join(base, rel + '.vue'),
    path.join(base, rel + '.ts'),
    path.join(base, rel + '.tsx'),
    path.join(base, rel + '.js'),
    path.join(base, rel + '.jsx'),
    path.join(base, rel, 'index.vue'),
    path.join(base, rel, 'index.ts'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

// #content/ YAML 模块解析
// spec='#content/projects' → 查找 .content/projects/zh.yaml + en.yaml（或 .content/projects.yaml）
// 返回：YAML 文件路径数组（供 scanComponent 逐个提取链接）
const CONTENT_DIR = path.join(ROOT, '.content');
function resolveContentModule(dir, relPath) {
  const files = [];
  // 情况1：relPath 指向目录，目录下有 zh.yaml / en.yaml
  const zhFile = path.join(dir, 'zh.yaml');
  const enFile = path.join(dir, 'en.yaml');
  if (fs.existsSync(zhFile)) files.push(zhFile);
  if (fs.existsSync(enFile)) files.push(enFile);
  // 情况2：relPath 直接是文件（不带语言后缀），如 #content/activity → .content/activity.yaml
  //        但 OPlusYamlContentVitePlugin 通常要求 zh/en 对，这里兼容单文件
  if (files.length === 0) {
    const directYaml = path.join(CONTENT_DIR, relPath + '.yaml');
    if (fs.existsSync(directYaml)) files.push(directYaml);
  }
  // 情况3：子模块，如 #content/showcase → .content/showcase/{zh,en}.yaml
  //        已被情况1覆盖
  return files.length > 0 ? files : null;
}

// i18n 目录：全局导航数据所在，链接由 GLOBAL_LAYOUT_COMPONENTS 单独处理。
// 在普通组件递归扫描时，跳过收集其链接（避免导航链接污染每页出边）。
const I18N_DIR = path.join(SRC_NEW, 'i18n');

function isInI18nDir(absPath) {
  return absPath.startsWith(I18N_DIR + path.sep) || absPath.startsWith(I18N_DIR + '/');
}

// 递归扫描组件文件，收集其静态链接 + 进一步的 import
// opts.skipI18n: 若为 true，遇到 i18n 目录文件时只递归 import、不收集链接
// 支持传入 YAML 文件路径（#content/ 模块），YAML 无 import 递归
function scanComponent(absPath, depth, visited, accLinks, opts) {
  if (!absPath || visited.has(absPath)) return;
  visited.add(absPath);
  // YAML 文件：直接提取链接，不递归 import
  if (absPath.endsWith('.yaml') || absPath.endsWith('.yml')) {
    const content = readText(absPath);
    if (content) {
      // 从 YAML 文件路径推断 contentBasePath
      // 如 .content/community/zh.yaml → contentBasePath='community'
      // 如 .content/migration/zh.yaml → contentBasePath='migration'
      const relToContent = path.relative(CONTENT_DIR, absPath).replace(/\\/g, '/');
      const contentBasePath = relToContent.split('/')[0];
      const raw = extractYamlLinks(content, contentBasePath);
      for (const r of raw) accLinks.push(r);
    }
    return;
  }
  const content = readText(absPath);
  if (!content) return;
  const skipLinks = opts?.skipI18n && isInI18nDir(absPath);
  if (!skipLinks) {
    const raw = extractRawLinks(content);
    for (const r of raw) accLinks.push(r);
  }
  if (depth >= MAX_COMPONENT_DEPTH) return;
  // 继续递归 import
  const importRe = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  let m;
  while ((m = importRe.exec(content)) !== null) {
    const child = resolveImport(m[1], absPath);
    if (Array.isArray(child)) {
      for (const c of child) scanComponent(c, depth + 1, visited, accLinks, opts);
    } else if (child) {
      scanComponent(child, depth + 1, visited, accLinks, opts);
    }
  }
}

// 提取板块（按 /{locale}/{section} 聚合）
function pageToSection(pagePath) {
  const parts = pagePath.split('/').filter(Boolean); // ['zh','faq','...']
  if (parts.length === 0) return '/';
  if (parts.length === 1) return '/' + parts[0] + '/';
  return '/' + parts.slice(0, 2).join('/') + '/';
}

// 从 .md frontmatter 提取 title
function extractFrontmatterTitle(content) {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return '';
  const fm = fmMatch[1];
  const titleMatch = fm.match(/^title:\s*(.+)$/m);
  if (!titleMatch) return '';
  let title = titleMatch[1].trim();
  if ((title.startsWith('"') && title.endsWith('"')) || (title.startsWith("'") && title.endsWith("'"))) {
    title = title.slice(1, -1);
  }
  return title;
}

// 调用线上新闻/博客列表接口，获取全部文章记录
// 返回: [{ path, title, textContent, category, lang, date, listPagePath }]
async function fetchApiArticles() {
  if (SKIP_API) {
    console.log('│ 跳过 API 调用（SKIP_API=1）');
    return [];
  }
  const endpoints = [
    { url: '/api-search/search/sort', category: 'news', listPageSuffix: 'interaction/news-list/' },
    { url: '/api-search/search/sort/blog', category: 'blog', listPageSuffix: 'interaction/blog-list/' },
    { url: '/api-search/search/sort/showcase', category: 'showcase', listPageSuffix: 'showcase/' },
  ];
  const locales = ['zh', 'en'];
  const allRecords = [];

  for (const ep of endpoints) {
    for (const lang of locales) {
      let page = 1;
      let count = Infinity;
      let fetched = 0;
      const label = `${lang}/${ep.category}`;
      while (fetched < count) {
        try {
          const res = await fetch(`${API_BASE}${ep.url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: ep.category, lang, page, pageSize: API_PAGE_SIZE }),
            signal: AbortSignal.timeout(30000),
          });
          if (!res.ok) {
            console.warn(`│ API ${label} page ${page}: HTTP ${res.status}`);
            break;
          }
          const data = await res.json();
          const obj = data?.obj;
          if (!obj || !Array.isArray(obj.records)) break;
          if (count === Infinity) count = obj.count || 0;
          for (const r of obj.records) {
            allRecords.push({
              path: r.path ? '/' + r.path : '',
              title: r.title || '',
              textContent: r.textContent || '',
              category: r.category || ep.category,
              lang: r.lang || lang,
              date: r.date || '',
              listPagePath: `/${lang}/${ep.listPageSuffix}`,
            });
          }
          fetched += obj.records.length;
          if (obj.records.length === 0) break;
          page++;
        } catch (e) {
          console.warn(`│ API ${label} page ${page}: ${e.message}`);
          break;
        }
      }
      console.log(`│ API ${label}: ${fetched}/${count} 条`);
    }
  }
  return allRecords;
}

async function main() {
  const t0 = Date.now();
  // 1. 收集页面
  const mdFiles = [];
  for (const localeDir of ['zh', 'en']) {
    const d = path.join(APP, localeDir);
    for (const f of walkDir(d)) mdFiles.push(f);
  }

  const pageSet = new Set();
  const dynamicRoutes = [];
  const pages = [];
  for (const f of mdFiles) {
    const pagePath = mdFileToPagePath(f);
    // 动态路由 [sig].md 等 —— 无法静态枚举
    if (/\[[^\]]+\]/.test(f)) {
      dynamicRoutes.push({ file: path.relative(ROOT, f), template: pagePath });
      continue;
    }
    pageSet.add(pagePath);
    pages.push({ file: f, pagePath });
  }

  // 页面查找：兼容无尾斜杠 / .html / index
  function findPage(candidate) {
    if (!candidate) return null;
    let c = canonicalizeUrl(candidate);
    if (pageSet.has(c)) return c;
    if (pageSet.has(c + '/')) return c + '/';
    if (c.endsWith('/') && pageSet.has(c.slice(0, -1))) return c.slice(0, -1);
    // 尝试 index 形式
    if (pageSet.has(c + 'index')) return c + 'index';
    return null;
  }

  // 2. 提取每页链接
  const downstream = new Map(); // pagePath -> Set(pagePath)
  const edgeMeta = new Map();    // key "from|to" -> Set(source file)
  const externalLinks = new Map(); // pagePath -> Set(host)
  const componentUsage = new Map(); // component absPath -> Set(pagePath)

  for (const { file, pagePath } of pages) {
    const content = readText(file);
    const mdDir = path.dirname(file);
    const rawMdLinks = extractRawLinks(content);

    // 组件链接
    const compLinks = [];
    const importedComponents = parseMdImports(content, file);
    for (const comp of importedComponents) {
      const usage = componentUsage.get(comp) || new Set();
      usage.add(pagePath);
      componentUsage.set(comp, usage);
      scanComponent(comp, 0, new Set(), compLinks, { skipI18n: true });
    }

    const allRaw = expandTemplateLinks([...rawMdLinks, ...compLinks]);
    const out = downstream.get(pagePath) || new Set();
    const ext = externalLinks.get(pagePath) || new Set();

    for (const raw of allRaw) {
      const cls = classifyLink(raw, pagePath, mdDir);
      if (cls.type === 'internal') {
        const target = findPage(cls.target);
        if (target && target !== pagePath) {
          out.add(target);
          const key = pagePath + '\u0001' + target;
          const meta = edgeMeta.get(key) || new Set();
          meta.add(path.relative(ROOT, file));
          edgeMeta.set(key, meta);
        }
      } else if (cls.type === 'external') {
        try {
          const u = new URL(raw.startsWith('//') ? 'https:' + raw : raw);
          ext.add(u.host);
        } catch (_e) {
          // ignore
        }
      }
    }
    if (out.size) downstream.set(pagePath, out);
    if (ext.size) externalLinks.set(pagePath, ext);
  }

  // 结构性组件判定
  const structuralComponents = new Set();
  for (const [comp, usage] of componentUsage) {
    if (usage.size > SHARED_COMPONENT_THRESHOLD) structuralComponents.add(comp);
  }

  // 2.4 全局布局组件（AppHeader/AppFooter，由主题 Layout 注入到所有页面）
  // 单独提取其链接，不注入到每页出边，而是作为全局链接单独统计
  const globalLinkTargets = new Set(); // 被全局导航指向的页面 pagePath
  const globalLinkSources = new Map();  // target -> [组件名]
  for (const comp of GLOBAL_LAYOUT_COMPONENTS) {
    if (!fs.existsSync(comp)) continue;
    const compLinks = [];
    scanComponent(comp, 0, new Set(), compLinks);
    const expandedLinks = expandTemplateLinks(compLinks);
    const compName = path.basename(comp);
    for (const raw of expandedLinks) {
      const cls = classifyLink(raw, '', '');
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

  // 2.4b 分类布局组件：按 frontmatter.category 注入到特定页面
  // 提取布局组件 import 的 content YAML 中的侧边栏链接，归属于同 category 的所有页面
  const pageCategories = new Map(); // pagePath -> category
  for (const { file, pagePath } of pages) {
    const content = readText(file);
    const catMatch = content.match(/^category:\s*(.+)$/m);
    if (catMatch) {
      const cat = catMatch[1].trim().replace(/['"]/g, '');
      pageCategories.set(pagePath, cat);
    }
  }
  for (const [category, layoutComp] of Object.entries(CATEGORY_LAYOUT_COMPONENTS)) {
    if (!fs.existsSync(layoutComp)) continue;
    const layoutLinks = [];
    scanComponent(layoutComp, 0, new Set(), layoutLinks);
    const expandedLayoutLinks = expandTemplateLinks(layoutLinks);
    // 找到使用该 category 的所有页面
    const categoryPages = pages.filter(({ pagePath }) => pageCategories.get(pagePath) === category);
    if (categoryPages.length === 0) continue;
    for (const { pagePath } of categoryPages) {
      const out = downstream.get(pagePath) || new Set();
      for (const raw of expandedLayoutLinks) {
        const cls = classifyLink(raw, pagePath, '');
        if (cls.type === 'internal') {
          const target = findPage(cls.target);
          if (target && target !== pagePath) {
            out.add(target);
            const key = pagePath + '\u0001' + target;
            const meta = edgeMeta.get(key) || new Set();
            meta.add('(Layout: ' + category + ')');
            edgeMeta.set(key, meta);
          }
        }
      }
      if (out.size) downstream.set(pagePath, out);
    }
  }

  // 2.5 提取标题（frontmatter + API）
  const titleMap = new Map(); // pagePath -> title
  for (const { file, pagePath } of pages) {
    const content = readText(file);
    const fmTitle = extractFrontmatterTitle(content);
    if (fmTitle) titleMap.set(pagePath, fmTitle);
  }

  // 2.6 调用线上 API 补充新闻/博客动态内链
  const apiRecords = await fetchApiArticles();
  for (const r of apiRecords) {
    if (!r.path) continue;
    const articlePage = findPage(r.path) || r.path;
    // 补充标题（API 标题优先于 frontmatter）
    if (r.title) titleMap.set(articlePage, r.title);
    // 确保 API 文章页也在 pageSet 中
    if (!pageSet.has(articlePage)) {
      pageSet.add(articlePage);
      pages.push({ file: '(API)', pagePath: articlePage });
    }
    // 列表页 → 文章页
    if (r.listPagePath && pageSet.has(r.listPagePath)) {
      const out = downstream.get(r.listPagePath) || new Set();
      if (articlePage !== r.listPagePath) {
        out.add(articlePage);
        downstream.set(r.listPagePath, out);
        const key = r.listPagePath + '\u0001' + articlePage;
        const meta = edgeMeta.get(key) || new Set();
        meta.add('(API: ' + r.listPagePath + ')');
        edgeMeta.set(key, meta);
      }
    }
    // 文章正文内链（textContent 中的裸 URL）
    if (r.textContent) {
      const textLinks = extractRawLinks(r.textContent);
      const out = downstream.get(articlePage) || new Set();
      for (const raw of textLinks) {
        const cls = classifyLink(raw, articlePage, '');
        if (cls.type === 'internal') {
          const target = findPage(cls.target);
          if (target && target !== articlePage) {
            out.add(target);
            const key = articlePage + '\u0001' + target;
            const meta = edgeMeta.get(key) || new Set();
            meta.add('(API textContent)');
            edgeMeta.set(key, meta);
          }
        } else if (cls.type === 'external') {
          try {
            const u = new URL(raw.startsWith('//') ? 'https:' + raw : raw);
            const ext = externalLinks.get(articlePage) || new Set();
            ext.add(u.host);
            externalLinks.set(articlePage, ext);
          } catch (_e) {
            // ignore
          }
        }
      }
      if (out.size) downstream.set(articlePage, out);
    }
  }

  // 3. 上游内链
  const upstream = new Map();
  for (const [from, outs] of downstream) {
    for (const to of outs) {
      const ins = upstream.get(to) || new Set();
      ins.add(from);
      upstream.set(to, ins);
    }
  }

  // 4. 统计
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
    // 孤岛：无内容上下游且不在导航中
    if (!hasOut && !hasIn && !inNav) stats.orphanPages.push(pagePath);
    // 仅靠导航存活：无内容上下游但在导航中
    if (!hasOut && !hasIn && inNav) stats.contentOrphanPages.push(pagePath);
    // 未进入全局导航
    if (!inNav) stats.pagesNotInNav.push(pagePath);
    // 内容有入链但导航无（内容质量好但入口弱）
    if (hasIn && !inNav) stats.contentInboundNoNav.push(pagePath);
    // 导航有但内容无入链（入口强但内链辐射弱）
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

  // 外链域名统计
  const hostCount = new Map();
  for (const hosts of externalLinks.values()) {
    for (const h of hosts) hostCount.set(h, (hostCount.get(h) || 0) + 1);
  }
  stats.externalHosts = [...hostCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([h, c]) => ({ host: h, count: c }));

  // 5. 板块统计
  const sectionMap = new Map(); // section -> { pages, inDeg, outDeg, internal }
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

  // 6. 构建序列化数据
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

  const payload = {
    generatedAt: new Date().toISOString(),
    elapsedMs: Date.now() - t0,
    stats,
    sections: stats.sectionStats,
    sectionEdges,
    pages: pageRecords,
    edges,
    dynamicRoutes,
    structuralComponents: [...structuralComponents].map((c) => path.relative(ROOT, c)),
    apiArticles: apiRecords.length,
    globalLinks: [...globalLinkTargets].sort().map((p) => ({
      page: p,
      title: titleMap.get(p) || '',
      sources: [...new Set(globalLinkSources.get(p) || [])],
    })),
  };

  // 7. 写出 HTML（数据内嵌）
  const html = buildHtml(payload);
  fs.writeFileSync(OUTPUT_HTML, html, 'utf-8');

  // 控制台摘要
  console.log('┌──────────────────────────────────────────────┐');
  console.log('│ 站内内链分析完成');
  console.log('├──────────────────────────────────────────────┤');
  console.log('│ 页面总数        :', String(stats.totalPages).padStart(8));
  console.log('│ 动态路由模板    :', String(stats.dynamicRouteTemplates).padStart(8));
  console.log('│ 内链边总数      :', String(stats.totalEdges).padStart(8));
  console.log('│ 有出链页面      :', String(stats.pagesWithOutbound).padStart(8));
  console.log('│ 有入链页面      :', String(stats.pagesWithInbound).padStart(8));
  console.log('│ 孤岛页面        :', String(stats.orphanPages.length).padStart(8));
  console.log('│ 无入链页面      :', String(stats.noInboundPages.length).padStart(8));
  console.log('│ 无出链页面      :', String(stats.noOutboundPages.length).padStart(8));
  console.log('│ 结构性组件(>页) :', String(payload.structuralComponents.length).padStart(8));
  console.log('│ API 文章补充     :', String(payload.apiArticles).padStart(8));
  console.log('├──────────────────────────────────────────────┤');
  console.log('│ 全局导航覆盖页   :', String(stats.globalLinkPages).padStart(8));
  console.log('│ 未进入导航页面   :', String(stats.pagesNotInNav.length).padStart(8));
  console.log('│ 孤岛(无内容无导航)  :', String(stats.orphanPages.length).padStart(4));
  console.log('│ 内容有入链但无导航 :', String(stats.contentInboundNoNav.length).padStart(4));
  console.log('├──────────────────────────────────────────────┤');
  console.log('│ 报告已生成:', OUTPUT_HTML);
  console.log('└──────────────────────────────────────────────┘');
}

/* ------------------------------------------------------------------ */
/* HTML 报告构建                                                        */
/* ------------------------------------------------------------------ */
function buildHtml(payload) {
  const json = JSON.stringify(payload);
  const sections = payload.sections;
  const sectionEdges = payload.sectionEdges;
  const stats = payload.stats;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const cards = [
    { label: '页面总数', value: stats.totalPages, sub: `动态路由模板 ${stats.dynamicRouteTemplates}` },
    { label: '内链边总数', value: stats.totalEdges, sub: `平均每页 ${(stats.totalEdges / Math.max(stats.totalPages, 1)).toFixed(2)} 条` },
    { label: '孤岛页面', value: stats.orphanPages.length, sub: '无内容链且未入导航', cls: 'danger' },
    { label: '未进入导航', value: stats.pagesNotInNav.length, sub: '全局导航未覆盖', cls: 'warn' },
    { label: '内容强·入口弱', value: stats.contentInboundNoNav.length, sub: '有内容入链·无导航', cls: 'warn' },
    { label: '导航覆盖页', value: stats.globalLinkPages, sub: '在全局导航中', cls: 'ok' },
  ];

  const sectionOptions = sections.map((s) => `<option value="${esc(s.section)}">${esc(s.section)} (${s.pages})</option>`).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>openEuler 站内内链看板</title>
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
    <h1>openEuler 站内内链看板</h1>
    <span class="muted">分析 <code>app/zh</code> + <code>app/en</code> 全部页面 · 内链域名 www.openeuler.org / www.openeuler.openatom.cn</span>
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
        <input id="pageSearch" placeholder="搜索标题或路径（如 /zh/sig/）" style="width:280px" />
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
      <h2>全局导航覆盖页面（在 AppHeader/AppFooter 的链接中）<span class="small"> · ${stats.globalLinkPages} 页</span></h2>
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
        <li>页面来源：<code>app/zh</code>、<code>app/en</code> 下的全部 <code>.md</code>（VitePress 文件路由）。</li>
        <li>动态路由模板（如 <code>[sig].md</code>）由 API 动态生成，无法静态枚举，仅列出不纳入图。</li>
        <li>链接提取：Markdown <code>[text](url)</code>、HTML <code>href</code>、<code>router-link :to</code>、裸 URL，以及页面 <code>&lt;script setup&gt;</code> 直接引用的 Vue 视图组件（递归 5 层）中的静态链接。</li>
        <li>全局导航：主题 Layout（<code>App.vue</code>）注入的 <code>AppHeader.vue</code> / <code>AppFooter.vue</code> 等全局布局组件中的链接单独归为「全局导航」，<b>不注入到每页出边</b>，避免指标失真。</li>
        <li>API 补充：调用线上新闻/博客列表接口（<code>/api-search/search/sort</code>、<code>/api-search/search/sort/blog</code>，zh/en 双语），补充列表页→文章、文章正文→站内页面的动态内链（共 ${payload.apiArticles} 篇文章）。可通过 <code>SKIP_API=1</code> 跳过。</li>
        <li>标题来源：.md frontmatter <code>title</code> 字段 + API 返回的 <code>title</code> 字段（API 优先）。</li>
        <li>内链判定：以 <code>www.openeuler.org</code> / <code>www.openeuler.openatom.cn</code> 开头，或站内绝对路径 <code>/zh/…</code>、<code>/en/…</code>。</li>
        <li>四类页面分类：<b>孤岛</b>=无内容链且未入导航；<b>内容强·入口弱</b>=有内容入链但不在导航（建议加导航/加链接）；<b>导航有·内容无</b>=在导航但无内容入链（建议补内容内链）；<b>仅导航</b>=无内容上下游但靠导航存活。</li>
        <li>仍有局限：SIG 详情页等完全由 API 驱动的动态路由未纳入；组件中 <code>v-for</code> 生成的链接（数据来自运行时 API）部分已通过 API 文章 textContent 补充，其余需结合线上 HTML 抓取复核。</li>
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

  // 标题查找：pagePath -> title
  function esc(s){ return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]}) }
  function titleFor(pg){ var p=pageIndex[pg]; return (p&&p.title)?p.title:'' }
  // 显示标签：标题（路径）—— 无标题时仅路径
  function labelFor(pg){
    var t=titleFor(pg);
    return t ? esc(t) + ' <span class="small" style="opacity:.6">'+pg+'</span>' : pg;
  }
  // 纯文本标签（用于 G6 节点等无法 HTML 的场景），截断
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
  var secMax = Math.max.apply(null, sections.map(function(s){return s.pages}));
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
  // 图例
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
    // 节点过多时强制限制为含边的节点 + 孤岛前 200，避免卡死
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
  // 全局导航列表（标题+路径+来源组件）
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
