/*
 * openUBMC Website — 站内内链分析器（Nuxt 版）
 *
 * 页面模型（与 scripts/generate-sitemap.mjs 的路由模型保持同步）：
 *   - pages/{zh,en} 下全部 .vue 静态路由（含 definePageMeta alias；鉴权目录 my/ 建 kind='auth' 节点但不参与孤岛/导航指标）
 *   - content/{zh,en} 下全部 .md 内容路由（经 [id].vue 动态页 + queryContent 渲染）
 *   - /{locale}/version/latest 特殊路由
 *   - SIG 详情页（SIG_INFO_API 清单枚举，可 SKIP_API=1 跳过）
 *
 * 链接提取七层（详见 .agents/skills/internal-link-analyzer/SKILL.md）：
 *   1. content md 正文 + frontmatter（header.link / header.reviewLink）
 *   2. pages 静态路由（definePageMeta alias）
 *   3. views/ + components/ 组件链（显式 import + Nuxt 自动导入标签，递归 5 层）
 *   4. .content/ YAML（#content/ 虚拟模块，含 docs target 双语义、AppFooter 字段作用域）
 *   5. locales/ i18n 富文本（按 t('ns.') 命名空间归属到页面）
 *   6. 全局布局组件（layouts/default.vue 注入的 Header/Footer/浮层）→ 全局导航，不注入每页出边
 *   7. SIG 清单 API → 详情页节点 + 列表→详情合成边
 *
 * 用法:  node packages/website/scripts/internal-link-analyzer.mjs
 * 产物:  internal-link-report.html（仓库根目录，自包含，浏览器直接打开）
 *
 * 环境变量:
 *   SKIP_API=1              跳过 SIG API 调用（离线模式，SIG 详情页不建节点）
 *   SIG_INFO_API=<url>      覆盖 SIG 清单 API 地址
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// packages/website/scripts → 仓库根
const ROOT = path.resolve(__dirname, '../../..');
const APP = path.join(ROOT, 'packages/website');
const PAGES_DIR = path.join(APP, 'pages');
const CONTENT_MD_DIR = path.join(APP, 'content');
const COMPONENTS_DIR = path.join(APP, 'components');
const LOCALES_DIR = path.join(APP, 'locales');
const NUXT_TYPES_DIR = path.join(APP, '.nuxt');
// 仓库根 .content/（OPlusYamlContentVitePlugin 的 root，#content/ 虚拟模块数据源）
const CONTENT_YAML_DIR = path.join(ROOT, '.content');

/* ------------------------------------------------------------------ */
/* 项目配置（结构变更时按下表核对，详见 SKILL.md「适配项目配置」）          */
/* ------------------------------------------------------------------ */

// 内链域名：仅门户本身；repo./discuss./mailweb./summary. 等子域均为独立服务，按外链统计
const INTERNAL_DOMAINS = ['www.openubmc.cn', 'openubmc.cn'];

// 全局布局组件：layouts/default.vue 注入到所有页面，单独归为「全局导航」。
// yamlScope: AppFooter 只消费 .content/home 的 footer_links/friend_links，
// 不限定字段作用域会把首页 banner 链接误算进全局导航。
const GLOBAL_LAYOUT_COMPONENTS = [
  { file: path.join(COMPONENTS_DIR, 'header', 'AppHeader2.vue') },
  { file: path.join(COMPONENTS_DIR, 'header', 'AppHeaderMobile2.vue') },
  { file: path.join(COMPONENTS_DIR, 'AppFooter.vue'), yamlScope: { home: ['footer_links', 'friend_links'] } },
  { file: path.join(COMPONENTS_DIR, 'FloatingButton.vue') },
  { file: path.join(COMPONENTS_DIR, 'FloatingLeft.vue') },
  { file: path.join(COMPONENTS_DIR, 'AppGuide.vue') },
];

// 内容路由映射：content/{locale}/<dir>/*.md → 路由 + 渲染视图。
// 与 generate-sitemap.mjs 的 CONTENT_ROUTE_MAP 同步维护。
// note: content/{l}/sig/sig-application-process.md 是嵌入型内容（TheSigApply 内嵌渲染），
//       content/{l}/download/lifecycle.md 由静态页渲染，均不在本表。
const CONTENT_ROUTE_MAP = [
  { dir: 'news', route: (l, slug) => `/${l}/news/${slug}`, template: 'news/[id]', zhOnly: false },
  { dir: 'blogs', route: (l, slug) => `/${l}/blogs/${slug}`, template: 'blogs/[id]', zhOnly: false },
  { dir: 'version', route: (l, slug) => `/${l}/version/${slug}`, template: 'version/[version]', zhOnly: false },
  { dir: 'events/detail', route: (l, slug) => `/${l}/events/detail/${slug}`, template: 'events/detail/[id]', zhOnly: false },
  { dir: 'usercase', route: (l, slug) => `/${l}/usercase/${slug}`, template: 'usercase/[id]', zhOnly: true },
];

// 嵌入型 content 说明（机制由 scanFile 的 extractEmbeddedContentPaths 通用实现）：
//   content/{l}/sig/sig-application-process.md 由 TheSigApply.vue 经
//   <ContentDocRenderSimple :path="/{l}/sig/sig-application-process"> 内嵌渲染，
//   其链接归属宿主页 /{l}/sig/apply，不建独立页面。

// 无对应文件的静态特殊路由（TheDetail 内部把 latest 解析为最新版本）
const EXTRA_STATIC_PAGES = [
  { page: '/zh/version/latest', template: 'version/[version]', title: { zh: '最新版本说明', en: 'Latest Release Notes' } },
  { page: '/en/version/latest', template: 'version/[version]', title: { zh: '最新版本说明', en: 'Latest Release Notes' } },
];

// 鉴权页面目录（routeRules prerender:false，generate-sitemap 同样排除）：
// 不进 sitemap，但内链分析中建 kind='auth' 节点（承接登录下拉等入口链接，不参与孤岛/导航指标）
const EXCLUDED_PAGE_SECTIONS = new Set(['my']);

// 内容列表 → 内容页的合成边（<NuxtLink :to="item._path"> 运行时数据，静态不可解析）
const SYNTHESIZED_LIST_EDGES = [
  { list: '/zh/news', contentDir: 'news', locale: 'zh' },
  { list: '/en/news', contentDir: 'news', locale: 'en' },
  { list: '/zh/blogs', contentDir: 'blogs', locale: 'zh' },
  { list: '/en/blogs', contentDir: 'blogs', locale: 'en' },
  { list: '/zh/events/list', contentDir: 'events/detail', locale: 'zh' },
  { list: '/en/events/list', contentDir: 'events/detail', locale: 'en' },
  { list: '/zh/usercase', contentDir: 'usercase', locale: 'zh' },
];

// SIG 清单 API（与 nuxt.config.ts nitro:config / generate-sitemap.mjs 保持一致）
const SIG_INFO_API = process.env.SIG_INFO_API || 'https://magicapi.osinfra.cn/stat/sig/info?community=openubmc';
const SKIP_API = process.env.SKIP_API === '1';

// .content/ YAML 中可能含 URL 的字段名（新增字段时检查并补充）
const URL_FIELDS =
  'href|link|link_en|url|video_url|json_url|vtt_url|content_url|btn_link|target|path|file|replay_link|review_link';

// 视图组件递归扫描深度上限
const MAX_COMPONENT_DEPTH = 5;
// 被超过该数量页面引用的组件视为「结构性组件」
const SHARED_COMPONENT_THRESHOLD = 8;

// 资源类后缀：直接判定为 asset 不参与内链
// 注意：不含 .html —— /docs/zh/xxx.html 是同域名文档中心应用的页面链接，需进入「跨应用链接」清单
const ASSET_EXT_RE = /\.(png|jpe?g|gif|svg|webp|ico|bmp|mp4|mp3|flv|pdf|zip|tar|gz|rar|7z|iso|rpm|deb|exe|msi|pkg|woff2?|ttf|otf|eot|css|js|mjs|json|yaml|yml|xml|txt|csv|docx?|xlsx?|pptx?)$/i;

const OUTPUT_HTML = path.join(ROOT, 'internal-link-report.html');

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

function walkDir(dir, out = [], filter = () => true) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.nuxt', 'dist', 'coverage', '__tests__', '.output'].includes(entry.name)) continue;
      walkDir(full, out, filter);
    } else if (entry.isFile() && filter(full)) {
      out.push(full);
    }
  }
  return out;
}

function relFromApp(absPath) {
  return path.relative(APP, absPath).replace(/\\/g, '/');
}

/* ------------------------------------------------------------------ */
/* 链接提取                                                             */
/* ------------------------------------------------------------------ */

// 清洗单条原始链接：去包裹引号/反引号、首尾空白与常见尾标点
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

// 剥离 Markdown 中的 fenced code block 与行内 code（代码内容不是页面链接，
// 如 docker 挂载参数 `/opt/ejbca-data:/mnt/persistent` 会被裸路径正则误提取）
function stripMdCode(content) {
  return content.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}

// 提取 .md / .vue / .ts / .js / .yaml 文本中的全部原始链接
// opts.md: 输入是 Markdown 正文（剥离代码块/行内代码后再提取）
function extractRawLinks(content, opts) {
  if (opts?.md) content = stripMdCode(content);
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
  // 2b. TS/JS/YAML 对象属性 href: '...' / link: '...' / target: '...' 等
  const propRe = new RegExp(
    '(?:' + URL_FIELDS + ')\\s*:\\s*(?:"([^"]*)"|\'([^\']*)\'|`([^`]*)`)',
    'gi'
  );
  while ((m = propRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1] ?? m[2] ?? m[3] ?? '');
    if (url) links.push(url);
  }
  // 3. NuxtLink/OBreadcrumbItem :to、router.push/replace、redirect 封装、window.open
  const toRe =
    /(?:\bto|:to|\.push|\.replace|\.go|window\.open|location\.href|\$?redirect)\s*[(=]?\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/gi;
  while ((m = toRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1] ?? m[2] ?? m[3] ?? '');
    if (url) links.push(url);
  }
  // 3b. return `...`（computed 返回值，仅匹配疑似路由的：以 /、https://、${ 开头）
  const returnRe = /return\s+`((?:\/[^`]*|https?:\/\/[^`]*|\$\{[^}]*\}\/[^`]*))`/g;
  while ((m = returnRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1]);
    if (url) links.push(url);
  }
  // 3c. handleLocaleHref('/xxx') 字面量参数（AppFooter 等大量使用的 locale 补全封装）
  const localeHrefRe = /handleLocaleHref\(\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)\s*\)/g;
  while ((m = localeHrefRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1] ?? m[2] ?? m[3] ?? '');
    if (url) links.push(url);
  }
  // 4. 裸 URL（含站内域名）
  const bareRe = /(?:^|[\s(])(https?:\/\/[^\s)<"'`，。、；！？）】]+)/g;
  while ((m = bareRe.exec(content)) !== null) {
    const url = cleanRawLink(m[1]).replace(/[.,;:!?）】]+$/, '');
    if (url) links.push(url);
  }
  return links;
}

// 从模板字符串中扩展 locale 变量 → zh + en 两份；处理 __ENV 哨兵与 VITE_ 环境变量
function expandTemplateLinks(rawLinks) {
  const out = [];
  for (let l of rawLinks) {
    // __ENV:VAR__ 哨兵（运行时环境变量外链）→ 跳过
    if (/^__ENV:[\w.]+__$/.test(l)) continue;
    // JS 拼接表达式残留（:to="`/${locale}` + item.href" 捕获后含 " + "）→ 静态不可求值，跳过
    if (/\s\+|\+\s/.test(l)) continue;
    // 字符串方法字面量误提取（如 path.replace('/null', '')）→ 跳过
    if (l === '/null') continue;
    // ${import.meta.env.VITE_*} 环境变量：剥掉后若残留 /zh/ 或 /en/ 路径则保留，否则跳过
    l = l.replace(/\$\{import\.meta\.env\.[^}]+\}/g, '');
    l = l.trim();
    if (!l || l.includes('__ENV:')) continue;
    if (/\$\{import\.meta\.env\./.test(l) && !/\/(zh|en)\//.test(l)) continue;
    // locale/lang 模板展开（${locale}、${locale.value}、${currentLocale}、${lang} 等）
    if (/\$\{[^}]*(?:locale|lang)[^}]*\}/i.test(l)) {
      out.push(l.replace(/\$\{[^}]*(?:locale|lang)[^}]*\}/gi, 'zh'));
      out.push(l.replace(/\$\{[^}]*(?:locale|lang)[^}]*\}/gi, 'en'));
    } else if (/\$\{[^}]+\}/.test(l) && !l.startsWith('${')) {
      // 含其他插值（如 ${item.name}）且非以插值开头：保留静态前缀部分由调用方兜底
      out.push(l);
    } else if (!/\$\{[^}]+\}/.test(l)) {
      out.push(l);
    }
  }
  return out;
}

// 解析一条原始链接，返回 { type, target }
// type: 'internal' | 'external' | 'asset' | 'anchor' | 'other'
function classifyLink(raw) {
  const url = raw.trim();
  if (!url) return { type: 'other', target: '' };
  if (url.startsWith('#')) return { type: 'anchor', target: url };
  if (/^(mailto:|tel:|javascript:|data:|blob:)/i.test(url)) return { type: 'other', target: url };
  if (url.startsWith('//')) return { type: 'external', target: url };
  if (url.startsWith('./') || url.startsWith('../')) return { type: 'asset', target: url };

  const protoMatch = url.match(/^([a-z]+:)\/\//i);
  if (protoMatch) {
    const rest = url.slice(protoMatch[0].length);
    const slashIdx = rest.indexOf('/');
    const host = slashIdx === -1 ? rest : rest.slice(0, slashIdx);
    const pathPart = slashIdx === -1 ? '/' : rest.slice(slashIdx);
    if (INTERNAL_DOMAINS.includes(host)) {
      return { type: 'internal', target: pathPart || '/' };
    }
    return { type: 'external', target: url };
  }

  if (url.startsWith('/')) {
    // 资源后缀 / 资源目录 → asset
    if (ASSET_EXT_RE.test(url.split('?')[0])) return { type: 'asset', target: url };
    if (/(^|\/)(image|images|img|assets|static|media|files|category|_nuxt)(\/|$)/i.test(url)) {
      return { type: 'asset', target: url };
    }
    return { type: 'internal', target: url };
  }

  return { type: 'other', target: url };
}

// 去 locale 站内路径补全（复现 shared/common.ts 的 handleLocaleHref / AppFooter getItemUrl）：
//   /zh/... /en/... /docs/... → 原样；其余站内绝对路径按调用方语义展开：
//   - 已知页面 locale → 仅生成该 locale 一份（页面 SSR 时 handleLocaleHref 用当前路由 locale）
//   - 未知 locale（全局布局组件，zh/en 页面均渲染）→ /zh + /en 两份
function expandLocalePath(target, locale) {
  if (/^\/(zh|en)(\/|$)/.test(target)) return [target];
  if (target.startsWith('/docs/')) return [target];
  if (locale) return target === '/' ? ['/' + locale] : ['/' + locale + target];
  if (target === '/') return ['/zh', '/en'];
  return ['/zh' + target, '/en' + target];
}

// 候选链接规范化：去 hash/query、去 .html/index、URL 解码
function canonicalizeUrl(raw) {
  let u = raw.trim();
  u = u.split('#')[0];
  u = u.split('?')[0];
  try {
    u = decodeURIComponent(u);
  } catch {
    // 含非法转义序列时保持原样
  }
  u = u.replace(/\.html$/i, '');
  u = u.replace(/\/index$/i, '/');
  u = u.replace(/\/+$/, '') || '/';
  return u;
}

/* ------------------------------------------------------------------ */
/* .content/ YAML 链接提取                                              */
/* ------------------------------------------------------------------ */

// 切出 YAML 顶层字段区间（col 0 的 key），用于 AppFooter 的字段级作用域
function sliceYamlSections(content, sections) {
  const lines = content.split('\n');
  const bounds = [];
  const keyRe = /^([A-Za-z_][\w-]*):(?:\s|$)/;
  lines.forEach((line, i) => {
    const m = line.match(keyRe);
    if (m) bounds.push({ key: m[1], start: i });
  });
  if (bounds.length === 0) return content;
  const picked = [];
  bounds.forEach((b, i) => {
    const end = i + 1 < bounds.length ? bounds[i + 1].start : lines.length;
    if (sections.includes(b.key)) picked.push(lines.slice(b.start, end).join('\n'));
  });
  return picked.join('\n');
}

// .content/docs/*.yaml 的 target 双语义块解析：
//   is_master: true  → /{locale}{target}（站内路由）
//   其余           → /docs/{locale}{target}（跨应用文档链接）
function extractDocsYamlLinks(content) {
  const links = [];
  const blocks = content.split(/^(?=[A-Za-z_][\w-]*:(?:\s|$))/m);
  for (const block of blocks) {
    const targetM = block.match(/^\s*target:\s*(.+)$/m);
    if (!targetM) continue;
    let val = targetM[1].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    val = val.split(/\s+#/)[0].trim();
    if (!val || !val.startsWith('/') || val.startsWith('/docs')) continue;
    const isMaster = /^\s*is_master:\s*true\s*$/m.test(block);
    if (isMaster) {
      links.push(val);
    } else {
      links.push('/docs/zh' + val);
      links.push('/docs/en' + val);
    }
  }
  return links;
}

// 通用 YAML 链接提取：URL 字段 + 数组项 + 站内域名裸 URL
function extractYamlLinks(content, yamlFile) {
  // docs yaml 走专用双语义解析
  if (yamlFile.includes(`${path.sep}docs${path.sep}`) || /[/\\]\.content[/\\]docs[/\\]/.test(yamlFile)) {
    return extractDocsYamlLinks(content);
  }

  const rawLinks = [];
  const propRe = new RegExp('^\\s*(?:' + URL_FIELDS + ')\\s*:\\s*(.+)$', 'gm');
  let m;
  while ((m = propRe.exec(content)) !== null) {
    let val = m[1].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    val = val.split(/\s+#/)[0].trim();
    if (!val) continue;
    // 锚点 / 环境哨兵 / 相对资源 / 空值占位 → 跳过
    if (val.startsWith('#') || val.startsWith('__ENV:') || val.startsWith('./') || val.startsWith('../')) continue;
    if (val === "''" || val === '""') continue;
    rawLinks.push(val);
  }
  // 数组项：- /zh/... 或 - /en/...
  const arrRe = /^\s*-\s+(\/(?:zh|en)\/[^\s]+)/gm;
  while ((m = arrRe.exec(content)) !== null) {
    rawLinks.push(m[1]);
  }
  // 站内域名裸 URL
  const bareRe = new RegExp('https?://(?:' + INTERNAL_DOMAINS.join('|').replace(/\./g, '\\.') + ')([^\\s\'"`]+)', 'g');
  while ((m = bareRe.exec(content)) !== null) {
    rawLinks.push(m[0]);
  }
  return rawLinks;
}

/* ------------------------------------------------------------------ */
/* import 解析（显式 import + Nuxt 自动导入）                            */
/* ------------------------------------------------------------------ */

const SCAN_EXTS = ['.vue', '.ts', '.js', '.tsx', '.jsx', '.mjs', '.cjs'];

function resolveFile(base, rel) {
  rel = rel.replace(/\\/g, '/');
  const candidates = [path.join(base, rel)];
  if (!path.extname(rel)) {
    for (const ext of SCAN_EXTS) candidates.push(path.join(base, rel + ext));
    candidates.push(path.join(base, rel, 'index.ts'), path.join(base, rel, 'index.vue'));
  }
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) {
      // 资源/类型声明不进扫描链
      if (ASSET_EXT_RE.test(c) || c.endsWith('.d.ts')) return null;
      return c;
    }
  }
  return null;
}

// #content/ 虚拟模块 → .content/ 下的 YAML 文件（zh.yaml + en.yaml，或 index.yaml / 单文件）
function resolveContentModule(name) {
  const dir = path.join(CONTENT_YAML_DIR, name);
  const files = [];
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    for (const f of ['zh.yaml', 'en.yaml', 'common.yaml']) {
      const p = path.join(dir, f);
      if (fs.existsSync(p)) files.push(p);
    }
    // #content/news → .content/news/index.yaml（无 zh/en 对时的单文件形态）
    if (files.length === 0) {
      const idx = path.join(dir, 'index.yaml');
      if (fs.existsSync(idx)) files.push(idx);
    }
  } else if (fs.existsSync(dir + '.yaml')) {
    files.push(dir + '.yaml');
  }
  return files.length > 0 ? files : null;
}

// 解析 import 说明符到绝对文件路径；#content/ 返回 YAML 路径数组
function resolveImport(spec, fromFile) {
  // Vite import query（?raw / ?url / ?inline / ?worker 等）：剥离后解析真实文件
  // （config/markdown、config/org 等大量 `import x from 'xx.md?raw'`，不剥离则全部漏扫）
  spec = spec.split('?')[0];
  if (spec.startsWith('~/') || spec.startsWith('@/')) return resolveFile(APP, spec.slice(2));
  if (spec.startsWith('~~/') || spec.startsWith('@@/')) return resolveFile(APP, spec.slice(3));
  if (spec.startsWith('#content/')) return resolveContentModule(spec.slice('#content/'.length));
  if (spec.startsWith('#') || spec.startsWith('~icons/') || spec.startsWith('virtual:')) return null;
  if (spec.startsWith('.')) return resolveFile(path.dirname(fromFile), spec);
  // 无斜杠的包导入（vue、@opensig/opendesign 等）→ 跳过；
  // 少数以 assets/ config/ 等项目内目录开头的裸路径尝试解析
  if (!spec.startsWith('/') && spec.includes('/') && /^[a-zA-Z]/.test(spec)) {
    return resolveFile(APP, spec);
  }
  return null;
}

// Nuxt 自动导入组件索引：首选 .nuxt/components.d.ts（权威映射），降级扫描 components/ 目录
function buildAutoImportIndex() {
  const index = new Map(); // PascalName → absPath
  const dts = path.join(NUXT_TYPES_DIR, 'components.d.ts');
  if (fs.existsSync(dts)) {
    const content = readText(dts);
    const re = /^export const (\w+): typeof import\("([^"]+)"\)/gm;
    let m;
    while ((m = re.exec(content)) !== null) {
      const name = m[1].replace(/^Lazy/, '');
      const file = path.resolve(NUXT_TYPES_DIR, m[2]);
      // node_modules 库组件（@nuxt/content 的 ContentRenderer 等）不进站点追踪链
      if (file.includes(`${path.sep}node_modules${path.sep}`)) continue;
      if (fs.existsSync(file)) index.set(name, file);
    }
    if (index.size > 0) return { index, source: '.nuxt/components.d.ts' };
  }
  // 降级：components/**/*.vue 按目录段 + 文件名生成候选名（连续同名段去重）
  const files = walkDir(COMPONENTS_DIR, [], (f) => f.endsWith('.vue'));
  for (const f of files) {
    const rel = path.relative(COMPONENTS_DIR, f).replace(/\\/g, '/');
    const parts = rel.replace(/\.vue$/, '').split('/');
    const pascal = (s) =>
      s
        .split(/[-_]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join('');
    const name = pascal(parts[parts.length - 1]);
    index.set(name, f);
    // 目录前缀形式（去重）：home/HomeBanner → HomeBanner（重复段折叠）、header/Foo → HeaderFoo
    const prefixed = parts.map(pascal).join('');
    const deduped = prefixed.replace(/(\w+)\1/, '$1');
    if (deduped !== name) index.set(deduped, f);
    if (prefixed !== name && prefixed !== deduped) index.set(prefixed, f);
  }
  return { index, source: 'components/ scan' };
}

const kebabToPascal = (s) =>
  s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

// 提取 .vue 模板中实际使用的组件标签（自动导入解析只跟随用到的组件）
function extractTemplateTags(content) {
  const tags = new Set();
  const tplMatch = content.match(/<template>([\s\S]*)<\/template>\s*$/);
  const tpl = tplMatch ? tplMatch[1] : content;
  const tagRe = /<([A-Za-z][A-Za-z0-9_.-]*)(?=[\s/>])/g;
  let m;
  while ((m = tagRe.exec(tpl)) !== null) {
    let tag = m[1];
    if (tag.includes('.')) continue; // <过渡.xxx> 等动态形式跳过
    tags.add(kebabToPascal(tag));
  }
  return tags;
}

// 提取文件中使用的 i18n 命名空间（t('sig.xxx') / safeT.value('header.xxx') / te(...) / $t(...)）
function extractI18nNamespaces(content) {
  const ns = new Set();
  const re = /(?:safeT|\$t|\bte|\btf|\bt)(?:\.value)?\(\s*['"]([a-zA-Z][\w-]*)\./g;
  let m;
  while ((m = re.exec(content)) !== null) ns.add(m[1]);
  return ns;
}

// 提取 ContentDocRender(Simple) 显式 :path 内嵌的 content md 路径（模板展开后）
function extractEmbeddedContentPaths(content) {
  const paths = [];
  const re = /ContentDocRender\w*[^>]*:path="([^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    for (const p of expandTemplateLinks([m[1]])) paths.push(p);
  }
  return paths;
}

// 检测 ContentDocRender 无 :path 的用法：渲染 route.path 对应的 content md
// （如 /zh/download/lifecycle 渲染 content/zh/download/lifecycle.md）
function detectRouteDocRender(content) {
  const re = /<ContentDocRender(?![^>]*:path)/g;
  return re.test(content);
}

// 解析 .vue/.ts 中的 import 语句
function parseImports(content, fromFile) {
  const imports = [];
  const re = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const resolved = resolveImport(m[1], fromFile);
    if (Array.isArray(resolved)) imports.push(...resolved);
    else if (resolved) imports.push(resolved);
  }
  return imports;
}

/* ------------------------------------------------------------------ */
/* 组件链扫描（带缓存）                                                  */
/* ------------------------------------------------------------------ */

const scanCache = new Map(); // key: absPath + '|' + scopeKey → { rawLinks, i18nNs, embedded, usesRouteDoc, files }
const inProgress = new Set();
const AUTO_IMPORT_INDEX = buildAutoImportIndex();
const I18N_SKIP_DIRS = [LOCALES_DIR, path.join(APP, 'utils', 'i18n-instance.ts')];

function isInSkipList(absPath) {
  return I18N_SKIP_DIRS.some((d) => absPath === d || absPath.startsWith(d + path.sep));
}

// 递归扫描一个文件（.vue/.ts/.js/.yaml）：
//   - 收集静态原始链接（rawLinks）
//   - 收集使用的 i18n 命名空间（i18nNs）
//   - 收集 ContentDocRender :path 内嵌内容路径（embedded）
//   - usesRouteDoc: 是否存在按 route.path 渲染 content 的 ContentDocRender
//   - files: 本次扫描触达的全部文件（供结构性组件判定）
// opts.yamlScope: { home: ['footer_links', ...] } —— 指定 yaml 模块只提取部分顶层字段
// opts.locale: 'zh' | 'en' —— #content/xxx 解析出的 zh.yaml/en.yaml 只保留该语言
//              （页面 SSR 时仅渲染本语言数据；common.yaml/index.yaml 双语言页面共用）
function scanFile(absPath, depth, opts) {
  if (!absPath) return null;
  const scopeKey = opts?.yamlScope && absPath.includes(`${path.sep}home${path.sep}`) ? 'scoped' : 'full';
  const cacheKey = absPath + '|' + scopeKey + '|' + (opts?.locale || '');
  if (scanCache.has(cacheKey)) return scanCache.get(cacheKey);
  if (inProgress.has(cacheKey)) return { rawLinks: [], i18nNs: new Set(), embedded: [], usesRouteDoc: false, files: [] };
  inProgress.add(cacheKey);

  const result = { rawLinks: [], i18nNs: new Set(), embedded: [], usesRouteDoc: false, files: [absPath] };

  // YAML：提取链接，不递归 import
  if (absPath.endsWith('.yaml') || absPath.endsWith('.yml')) {
    let content = readText(absPath);
    if (!content) {
      inProgress.delete(cacheKey);
      scanCache.set(cacheKey, result);
      return result;
    }
    if (scopeKey === 'scoped' && opts.yamlScope.home) {
      content = sliceYamlSections(content, opts.yamlScope.home);
    }
    result.rawLinks = extractYamlLinks(content, absPath);
    inProgress.delete(cacheKey);
    scanCache.set(cacheKey, result);
    return result;
  }

  const content = readText(absPath);
  if (content) {
    // i18n 目录/i18n 实例文件：链接由「命名空间归属层」单独处理，不在组件链收集
    if (!isInSkipList(absPath)) {
      // .md（?raw 导入的政策/协议文档）：按 Markdown 语义提取（剥代码块），不递归 import
      const isMd = absPath.endsWith('.md') || absPath.endsWith('.markdown');
      result.rawLinks = isMd ? extractRawLinks(content, { md: true }) : extractRawLinks(content);
      if (!isMd) {
        result.i18nNs = extractI18nNamespaces(content);
        result.embedded = extractEmbeddedContentPaths(content);
        result.usesRouteDoc = absPath.endsWith('.vue') && detectRouteDocRender(content);
      }
    }
  }

  const isMdFile = absPath.endsWith('.md') || absPath.endsWith('.markdown');
  if (!isMdFile && depth < MAX_COMPONENT_DEPTH) {
    // 1. 显式 import（#content/ 的 zh.yaml/en.yaml 按 opts.locale 过滤）
    for (const child of parseImports(content, absPath)) {
      if (isInSkipList(child)) continue;
      if (opts?.locale && /\.(ya?ml)$/i.test(child)) {
        const base = path.basename(child);
        if ((base === 'zh.yaml' || base === 'zh.yml') && opts.locale !== 'zh') continue;
        if ((base === 'en.yaml' || base === 'en.yml') && opts.locale !== 'en') continue;
      }
      const sub = scanFile(child, depth + 1, opts);
      mergeScan(result, sub);
    }
    // 2. Nuxt 自动导入：模板中实际使用的标签
    if (absPath.endsWith('.vue')) {
      for (const tag of extractTemplateTags(content)) {
        const comp = AUTO_IMPORT_INDEX.index.get(tag);
        if (comp && !isInSkipList(comp)) {
          const sub = scanFile(comp, depth + 1, opts);
          mergeScan(result, sub);
        }
      }
    }
  }

  inProgress.delete(cacheKey);
  scanCache.set(cacheKey, result);
  return result;
}

function mergeScan(target, sub) {
  if (!sub) return;
  for (const l of sub.rawLinks) target.rawLinks.push(l);
  for (const ns of sub.i18nNs) target.i18nNs.add(ns);
  for (const e of sub.embedded) target.embedded.push(e);
  if (sub.usesRouteDoc) target.usesRouteDoc = true;
  for (const f of sub.files) target.files.push(f);
}

/* ------------------------------------------------------------------ */
/* 页面枚举                                                             */
/* ------------------------------------------------------------------ */

// pages/{locale}/ 下的 .vue → 路由路径（去尾斜杠规范：/zh、/zh/news、/zh/news/xxx）
function vueFileToRoute(locale, absPath) {
  let rel = path.relative(path.join(PAGES_DIR, locale), absPath).replace(/\\/g, '/');
  rel = rel.replace(/\.vue$/i, '');
  if (rel === 'index') return `/${locale}`;
  if (rel.endsWith('/index')) rel = rel.slice(0, -'/index'.length);
  return `/${locale}/${rel}`;
}

// 解析 definePageMeta 的 alias 数组
function parsePageMetaAliases(content) {
  const aliases = [];
  const m = content.match(/alias\s*:\s*\[([^\]]*)\]/s);
  if (m) {
    for (const item of m[1].matchAll(/['"]([^'"]+)['"]/g)) aliases.push(item[1]);
  }
  return aliases;
}

// 解析 definePageMeta 的 title（{ zh, en } 对象或字符串）
function parsePageMetaTitle(content) {
  const m = content.match(/title\s*:\s*\{\s*zh\s*:\s*['"]([^'"]*)['"]\s*,\s*en\s*:\s*['"]([^'"]*)['"]/s);
  if (m) return { zh: m[1], en: m[2] };
  const m2 = content.match(/title\s*:\s*['"]([^'"]+)['"]/);
  if (m2) return { zh: m2[1], en: m2[1] };
  return null;
}

// Nuxt 路由名推导（layouts/simple.vue 的 TDK 规则）：/zh → index，/zh/version/* → version
function routeNameFor(pagePath) {
  if (pagePath === '/zh' || pagePath === '/en') return 'index';
  const parts = pagePath.split('/').filter(Boolean).slice(1); // 去 locale 段
  let name = parts.join('-');
  if (name.startsWith('version-')) name = 'version';
  return name;
}

// locales/route/route-{zh,en}.ts → { routeName: title }
function loadRouteTitles() {
  const titles = { zh: new Map(), en: new Map() };
  for (const locale of ['zh', 'en']) {
    const file = path.join(LOCALES_DIR, 'route', `route-${locale}.ts`);
    const content = readText(file);
    if (!content) continue;
    const re = /^\s*'?([\w-]+)'?\s*:\s*['"]([^'"]+)['"]/gm;
    let m;
    while ((m = re.exec(content)) !== null) {
      titles[locale].set(m[1], m[2]);
    }
  }
  return titles;
}

// locales/*/*-{zh,en}.ts 富文本中的内链 → { module: { zh: [...], en: [...] } }
function loadLocaleModuleLinks() {
  const modules = new Map();
  const files = walkDir(LOCALES_DIR, [], (f) => /-(zh|en)\.ts$/.test(f));
  for (const f of files) {
    const rel = path.relative(LOCALES_DIR, f).replace(/\\/g, '/');
    const parts = rel.split('/');
    if (parts.length < 2) continue;
    const module = parts[0];
    const localeM = f.match(/-(zh|en)\.ts$/);
    if (!localeM) continue;
    const locale = localeM[1];
    if (!modules.has(module)) modules.set(module, { zh: [], en: [] });
    const content = readText(f);
    if (!content) continue;
    for (const raw of extractRawLinks(content)) {
      modules.get(module)[locale].push(raw);
    }
  }
  return modules;
}

/* ------------------------------------------------------------------ */
/* SIG 清单 API                                                         */
/* ------------------------------------------------------------------ */

async function fetchSigNames() {
  if (SKIP_API) {
    console.log('│ 跳过 SIG API 调用（SKIP_API=1）');
    return [];
  }
  try {
    let res;
    for (let attempt = 1; attempt <= 3 && !res; attempt++) {
      try {
        res = await fetch(SIG_INFO_API, { signal: AbortSignal.timeout(30000) });
      } catch (err) {
        if (attempt === 3) throw err;
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
    const data = await res.json();
    const names = [
      ...new Set(
        (data.data ?? [])
          .map((item) => (typeof item?.name === 'string' ? item.name.trim() : ''))
          .filter((name) => name && /^[\w.-]+$/.test(name))
      ),
    ].sort();
    console.log(`│ SIG 清单 API: ${names.length} 个 SIG`);
    return names;
  } catch (e) {
    console.warn(`│ SIG 清单 API 拉取失败（SIG 详情页不建节点）: ${e.message}`);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* 主流程                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  const t0 = Date.now();
  const routeTitles = loadRouteTitles();
  const localeModuleLinks = loadLocaleModuleLinks();

  // ---------- 1. 页面集 ----------
  const pages = []; // { pagePath, file, kind, locale, template, title }
  const pageSet = new Set();
  const dynamicTemplates = []; // { pagePath, file, template, viewScan }

  function addPage(rec) {
    if (pageSet.has(rec.pagePath)) return;
    pageSet.add(rec.pagePath);
    pages.push(rec);
  }

  for (const locale of ['zh', 'en']) {
    const localePagesDir = path.join(PAGES_DIR, locale);
    for (const f of walkDir(localePagesDir, [], (p) => p.endsWith('.vue'))) {
      const rel = path.relative(localePagesDir, f).replace(/\\/g, '/');
      // 鉴权页（my/**）：generate-sitemap 排除它们，但页面真实存在（登录后可达），
      // 需建节点承接指向它们的链接，避免大量「疑似断链」误报；kind='auth' 不参与孤岛/导航指标
      const isAuth = rel.split('/').some((seg) => EXCLUDED_PAGE_SECTIONS.has(seg));
      // 动态段：[id].vue / [...slug].vue → 模板，单独扫描
      if (/\[[^\]]+\]/.test(rel)) {
        dynamicTemplates.push({ file: f, template: rel.replace(/\.vue$/, ''), locale, isAuth });
        continue;
      }
      const pagePath = vueFileToRoute(locale, f);
      const content = readText(f);
      const metaTitle = parsePageMetaTitle(content);
      addPage({ pagePath, file: f, kind: isAuth ? 'auth' : 'static', locale, title: metaTitle?.[locale] || '' });
      // definePageMeta alias（charter 页的三个 tab alias）
      for (const alias of parsePageMetaAliases(content)) {
        addPage({ pagePath: alias, file: f, kind: isAuth ? 'auth' : 'alias', locale, title: metaTitle?.[locale] || '' });
      }
    }
  }

  // 特殊静态页（/{l}/version/latest）
  for (const extra of EXTRA_STATIC_PAGES) {
    addPage({
      pagePath: extra.page,
      file: '(special)',
      kind: 'static',
      locale: extra.page.startsWith('/en') ? 'en' : 'zh',
      template: extra.template,
      title: extra.title?.[extra.page.startsWith('/en') ? 'en' : 'zh'] || '',
    });
  }

  // 内容页：content/{locale}/<dir>/*.md
  // 注：content/{l}/sig/sig-application-process.md 是嵌入型内容（TheSigApply 经
  //     ContentDocRenderSimple :path 内嵌渲染），不在本表、不建独立页面；
  //     content/{l}/download/lifecycle.md 由静态页 lifecycle.vue 经 route.path 渲染。
  for (const locale of ['zh', 'en']) {
    for (const entry of CONTENT_ROUTE_MAP) {
      if (entry.zhOnly && locale !== 'zh') continue;
      const dir = path.join(CONTENT_MD_DIR, locale, ...entry.dir.split('/'));
      if (!fs.existsSync(dir)) continue;
      for (const md of fs.readdirSync(dir)) {
        if (!md.endsWith('.md')) continue;
        const slug = md.replace(/\.md$/, '');
        const pagePath = entry.route(locale, slug);
        addPage({
          pagePath,
          file: path.join(dir, md),
          kind: 'content',
          locale,
          template: entry.template,
          title: '',
        });
      }
    }
  }

  // 动态模板视图链接（每个模板扫一次，注入匹配的内容/SIG 页面；auth 模板无内容注入，跳过）
  const templateScans = new Map(); // template(带locale) → scan result
  for (const t of dynamicTemplates) {
    if (t.isAuth) continue;
    const scan = scanFile(t.file, 0, { locale: t.locale });
    templateScans.set(`${t.locale}:${t.template}`, scan);
  }
  // version/[version] 等模板在 EXTRA_STATIC_PAGES 中按 template 引用
  for (const p of pages) {
    if (p.template && !templateScans.has(`${p.locale}:${p.template}`)) {
      const t = dynamicTemplates.find((dt) => dt.template === p.template && dt.locale === p.locale);
      if (t) templateScans.set(`${p.locale}:${p.template}`, scanFile(t.file, 0, { locale: t.locale }));
    }
  }

  // ---------- 2. SIG API 页面 ----------
  const sigNames = await fetchSigNames();
  const sigPages = [];
  for (const name of sigNames) {
    for (const locale of ['zh', 'en']) {
      const pagePath = `/${locale}/sig/${name}`;
      addPage({ pagePath, file: '(API)', kind: 'api', locale, template: 'sig/[id]', title: name });
      sigPages.push({ pagePath, name, locale });
    }
  }

  // ---------- 3. 页面查找（兼容尾斜杠 / .html / 解码） ----------
  function findPage(candidate) {
    if (!candidate) return null;
    const c = canonicalizeUrl(candidate);
    if (pageSet.has(c)) return c;
    if (pageSet.has(c + '/')) return c + '/';
    if (c.endsWith('/') && pageSet.has(c.slice(0, -1))) return c.slice(0, -1);
    return null;
  }

  // 动态路由前缀（客户端渲染板块）：未匹配内链若命中这些前缀 → 标记「动态路由」而非「疑似断链」
  // 排除「枚举型」模板（news/[id]、sig/[id] 等已有 content/API 枚举页面）：
  //   SSG 预渲染下 slug 不在枚举集 = 404，命中其前缀的未匹配链接应标「疑似断链」
  const enumeratedTemplates = new Set(
    pages.filter((p) => p.kind === 'content' || p.kind === 'api').map((p) => `${p.locale}:${p.template}`)
  );
  const dynamicPrefixes = dynamicTemplates
    .filter((t) => !enumeratedTemplates.has(`${t.locale}:${t.template}`))
    .map((t) => `/${t.locale}/` + t.template.replace(/\/\[[^\]]+\]$/, ''));
  function isDynamicRoutePath(p) {
    return dynamicPrefixes.some((prefix) => p === prefix || p.startsWith(prefix + '/'));
  }

  // 非枚举动态模板（marketplace/[...slug] 等，运行时 API 驱动）的视图链链接目标：
  // 详情页真实存在并渲染这些链接（用户可达），但无静态页面节点承载出边。
  // 记为「动态路由入口」：不算内容入链（SEO 视角该板块自身难被索引），但孤岛判定豁免。
  const dynamicEntryPages = new Map(); // pagePath -> Set(板块模板描述)
  for (const t of dynamicTemplates) {
    if (t.isAuth || enumeratedTemplates.has(`${t.locale}:${t.template}`)) continue;
    const scan = templateScans.get(`${t.locale}:${t.template}`);
    if (!scan) continue;
    const label = `/${t.locale}/${t.template}`;
    for (const raw of expandTemplateLinks(scan.rawLinks)) {
      if (!raw || /\$\{/.test(raw)) continue;
      const cls = classifyLink(raw);
      if (cls.type !== 'internal') continue;
      for (const cand of expandLocalePath(cls.target, t.locale)) {
        const target = findPage(cand);
        if (target) {
          const srcs = dynamicEntryPages.get(target) || new Set();
          srcs.add(label);
          dynamicEntryPages.set(target, srcs);
        }
      }
    }
  }

  // alias 页面的宿主页映射（definePageMeta alias 与宿主页同文件、同组件内 tab/hash 切换可达）
  const aliasHost = new Map(); // aliasPagePath -> hostPagePath（kind='static' 的主路由）
  {
    const fileHost = new Map();
    for (const p of pages) {
      if (p.kind === 'static' && p.file && p.file !== '(special)' && !fileHost.has(p.file)) {
        fileHost.set(p.file, p.pagePath);
      }
    }
    for (const p of pages) {
      if (p.kind === 'alias' && p.file && fileHost.has(p.file)) aliasHost.set(p.pagePath, fileHost.get(p.file));
    }
  }

  // ---------- 4. 每页链接提取 ----------
  const downstream = new Map(); // pagePath -> Set(pagePath)
  const edgeMeta = new Map(); // "from|to" -> Set(source label)
  const externalLinks = new Map(); // pagePath -> Set(host)
  const unmatchedLinks = new Map(); // pagePath -> Set(raw link)
  const pageNamespaces = new Map(); // pagePath -> Set(ns)
  const componentUsage = new Map(); // component absPath -> Set(pagePath)
  const pageSourceKinds = new Map(); // pagePath -> Map(kind -> count)

  function addEdge(from, to, sourceLabel) {
    if (from === to) return;
    const out = downstream.get(from) || new Set();
    out.add(to);
    downstream.set(from, out);
    const key = from + '\u0001' + to;
    const meta = edgeMeta.get(key) || new Set();
    meta.add(sourceLabel);
    edgeMeta.set(key, meta);
    const kinds = pageSourceKinds.get(from) || new Map();
    kinds.set(sourceLabel, (kinds.get(sourceLabel) || 0) + 1);
    pageSourceKinds.set(from, kinds);
  }

  function addUnmatched(pagePath, rawLink) {
    const set = unmatchedLinks.get(pagePath) || new Set();
    set.add(rawLink);
    unmatchedLinks.set(pagePath, set);
  }

  // 处理一条原始链接：分类 + locale 展开 + 页面匹配
  function ingestRawLinks(pagePath, rawLinks, sourceLabel) {
    const pageLocale = pagePath === '/zh' || pagePath.startsWith('/zh/') ? 'zh' : 'en';
    for (const raw of expandTemplateLinks(rawLinks)) {
      if (!raw) continue;
      // 残留 ${xxx} 数据插值的链接（如 /zh/sig/${item.name}）静态不可解析：
      // queryContent 驱动的由内容路由枚举合成，API 驱动的由 SIG 层合成，此处跳过
      if (/\$\{/.test(raw)) continue;
      const cls = classifyLink(raw);
      if (cls.type === 'internal') {
        let matched = false;
        for (const cand of expandLocalePath(cls.target, pageLocale)) {
          const target = findPage(cand);
          if (target) {
            addEdge(pagePath, target, sourceLabel);
            matched = true;
          }
        }
        if (!matched) {
          // docs 跨应用链接 / 动态路由 / 疑似断链
          // 记录按页面 locale 展开后的目标（而非原始值），便于定位与动态路由前缀匹配
          for (const cand of expandLocalePath(cls.target, pageLocale)) addUnmatched(pagePath, cand);
        }
      } else if (cls.type === 'external') {
        try {
          const u = new URL(raw.startsWith('//') ? 'https:' + raw : raw);
          const ext = externalLinks.get(pagePath) || new Set();
          ext.add(u.host);
          externalLinks.set(pagePath, ext);
        } catch {
          // ignore
        }
      }
    }
  }

  // content md frontmatter 中的链接字段（header.link / header.reviewLink 等）
  function extractFrontmatter(content) {
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    return fmMatch ? fmMatch[1] : '';
  }

  for (const page of pages) {
    const { pagePath, kind, locale, file } = page;

    if (kind === 'content') {
      // 内容页：md 正文 + frontmatter 链接 + 动态模板视图链（面包屑等）+ 嵌入内容
      const content = readText(file);
      ingestRawLinks(pagePath, extractRawLinks(content, { md: true }), 'md 正文');
      const fm = extractFrontmatter(content);
      if (fm) ingestRawLinks(pagePath, extractRawLinks(fm), 'md frontmatter');
      // frontmatter 中 YAML 形态的 header.link/reviewLink（extractRawLinks 的对象属性正则已覆盖）
      const tplKey = `${locale}:${page.template}`;
      const tplScan = templateScans.get(tplKey);
      if (tplScan) {
        ingestRawLinks(pagePath, tplScan.rawLinks, '详情视图');
        for (const ns of tplScan.i18nNs) {
          const set = pageNamespaces.get(pagePath) || new Set();
          set.add(ns);
          pageNamespaces.set(pagePath, set);
        }
        for (const cf of tplScan.files) {
          const usage = componentUsage.get(cf) || new Set();
          usage.add(pagePath);
          componentUsage.set(cf, usage);
        }
      }
    } else if (kind === 'api') {
      // SIG 详情页：动态模板视图链
      const tplScan = templateScans.get(`${locale}:sig/[id]`);
      if (tplScan) {
        ingestRawLinks(pagePath, tplScan.rawLinks, '详情视图');
        for (const ns of tplScan.i18nNs) {
          const set = pageNamespaces.get(pagePath) || new Set();
          set.add(ns);
          pageNamespaces.set(pagePath, set);
        }
        for (const cf of tplScan.files) {
          const usage = componentUsage.get(cf) || new Set();
          usage.add(pagePath);
          componentUsage.set(cf, usage);
        }
      }
    } else {
      // 静态页 / alias 页：扫描页面 .vue 文件链（显式 import + 自动导入组件）
      if (file !== '(special)') {
        const scan = scanFile(file, 0, { locale });
        ingestRawLinks(pagePath, scan.rawLinks, '页面/视图组件');
        for (const ns of scan.i18nNs) {
          const set = pageNamespaces.get(pagePath) || new Set();
          set.add(ns);
          pageNamespaces.set(pagePath, set);
        }
        for (const cf of scan.files) {
          const usage = componentUsage.get(cf) || new Set();
          usage.add(pagePath);
          componentUsage.set(cf, usage);
        }
        // 嵌入型 content md（ContentDocRender 显式 :path）→ 链接归属宿主页
        for (const embPath of scan.embedded) {
          const embMd = CONTENT_MD_DIR + embPath + '.md';
          if (fs.existsSync(embMd)) {
            const embContent = readText(embMd);
            ingestRawLinks(pagePath, extractRawLinks(embContent, { md: true }), '嵌入 content md');
          }
        }
        // route.path 渲染型 content（如 /zh/download/lifecycle 渲染 content/zh/download/lifecycle.md）
        if (scan.usesRouteDoc) {
          const routeMd = CONTENT_MD_DIR + pagePath + '.md';
          if (fs.existsSync(routeMd)) {
            ingestRawLinks(pagePath, extractRawLinks(readText(routeMd), { md: true }), 'route content md');
          }
        }
      } else if (page.template) {
        // 特殊静态页（/{l}/version/latest）：注入模板视图链
        const tplScan = templateScans.get(`${locale}:${page.template}`);
        if (tplScan) ingestRawLinks(pagePath, tplScan.rawLinks, '详情视图');
      }
    }
  }

  // ---------- 5. i18n 命名空间链接归属 ----------
  for (const [pagePath, namespaces] of pageNamespaces) {
    const page = pages.find((p) => p.pagePath === pagePath);
    const locale = page?.locale || (pagePath.startsWith('/en') ? 'en' : 'zh');
    for (const ns of namespaces) {
      const mod = localeModuleLinks.get(ns);
      if (mod && mod[locale].length > 0) {
        ingestRawLinks(pagePath, mod[locale], `i18n: ${ns}`);
      }
    }
  }

  // ---------- 6. 内容列表 → 内容页 合成边 ----------
  for (const syn of SYNTHESIZED_LIST_EDGES) {
    if (!pageSet.has(syn.list)) continue;
    const prefix = `/${syn.locale}/${syn.contentDir}/`;
    for (const page of pages) {
      if (page.kind !== 'content' || page.locale !== syn.locale) continue;
      if (page.pagePath.startsWith(prefix)) {
        addEdge(syn.list, page.pagePath, '内容列表合成');
      }
    }
  }

  // ---------- 7. SIG 列表 → SIG 详情 合成边 ----------
  for (const sp of sigPages) {
    addEdge(`/${sp.locale}/sig`, sp.pagePath, 'SIG API 合成');
  }

  // ---------- 8. 全局布局组件 → 全局导航 ----------
  // 鉴权页（my/**）：仅登录下拉等入口可达，不参与孤岛/导航等「问题指标」
  const authPageSet = new Set(pages.filter((p) => p.kind === 'auth').map((p) => p.pagePath));
  const authSections = new Set([...authPageSet].map((p) => pageToSection(p)));
  const globalLinkTargets = new Set();
  const globalLinkSources = new Map();
  for (const g of GLOBAL_LAYOUT_COMPONENTS) {
    if (!fs.existsSync(g.file)) continue;
    const scan = scanFile(g.file, 0, { yamlScope: g.yamlScope });
    const compName = path.basename(g.file);
    for (const raw of expandTemplateLinks(scan.rawLinks)) {
      if (!raw || /\$\{/.test(raw)) continue;
      const cls = classifyLink(raw);
      if (cls.type !== 'internal') continue;
      for (const cand of expandLocalePath(cls.target)) {
        const target = findPage(cand);
        if (target && !authPageSet.has(target)) {
          // 鉴权页（my/**）不视为「全局导航覆盖」——登录下拉是条件渲染入口，非公共导航
          globalLinkTargets.add(target);
          const srcs = globalLinkSources.get(target) || [];
          srcs.push(compName);
          globalLinkSources.set(target, srcs);
        }
      }
    }
  }

  // ---------- 9. 补充标题 ----------
  const titleMap = new Map();
  for (const page of pages) {
    if (page.kind === 'content') {
      const content = readText(page.file);
      const fmTitle = extractFrontmatter(content).match(/^title:\s*(.+)$/m);
      if (fmTitle) {
        let t = fmTitle[1].trim();
        if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) t = t.slice(1, -1);
        titleMap.set(page.pagePath, t);
      }
      continue;
    }
    if (page.title) {
      titleMap.set(page.pagePath, page.title);
      continue;
    }
    const rn = routeNameFor(page.pagePath);
    const rt = routeTitles[page.locale].get(rn);
    if (rt) titleMap.set(page.pagePath, rt);
    else if (rn === 'index') titleMap.set(page.pagePath, page.locale === 'zh' ? '首页' : 'Home');
  }

  // ---------- 10. 上游 / 统计 ----------
  const upstream = new Map();
  for (const [from, outs] of downstream) {
    for (const to of outs) {
      const ins = upstream.get(to) || new Set();
      ins.add(from);
      upstream.set(to, ins);
    }
  }

  // 鉴权页集合已在「---------- 8」处定义（全局导航扫描需要）

  const stats = {
    totalPages: pages.length,
    staticPages: pages.filter((p) => p.kind === 'static' || p.kind === 'alias').length,
    contentPages: pages.filter((p) => p.kind === 'content').length,
    apiPages: pages.filter((p) => p.kind === 'api').length,
    authPages: authPageSet.size,
    dynamicRouteTemplates: dynamicTemplates.length,
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
    unmatchedInternal: 0,
  };

  for (const outs of downstream.values()) stats.totalEdges += outs.size;

  for (const { pagePath, kind } of pages) {
    if (authPageSet.has(pagePath)) continue; // 鉴权页不进问题指标
    const hasOut = downstream.has(pagePath) && downstream.get(pagePath).size > 0;
    const hasIn = upstream.has(pagePath) && upstream.get(pagePath).size > 0;
    const inNav = globalLinkTargets.has(pagePath);
    // 动态路由入口（marketplace 详情页等链接可达）与 alias tab 切换（宿主页可达）豁免孤岛
    const dynEntry = dynamicEntryPages.has(pagePath);
    const tabReachable =
      kind === 'alias' &&
      (() => {
        const host = aliasHost.get(pagePath);
        return !!host && ((upstream.has(host) && upstream.get(host).size > 0) || globalLinkTargets.has(host));
      })();
    if (!hasIn) stats.noInboundPages.push(pagePath);
    if (!hasOut) stats.noOutboundPages.push(pagePath);
    if (!hasOut && !hasIn && !inNav && !dynEntry && !tabReachable) stats.orphanPages.push(pagePath);
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

  // 未匹配内链分类统计
  let unmatchedDocs = 0;
  let unmatchedDynamic = 0;
  let unmatchedBroken = 0;
  for (const links of unmatchedLinks.values()) {
    for (const l of links) {
      stats.unmatchedInternal++;
      if (l.startsWith('/docs/')) unmatchedDocs++;
      else if (isDynamicRoutePath(l)) unmatchedDynamic++;
      else unmatchedBroken++;
    }
  }
  stats.unmatchedDocs = unmatchedDocs;
  stats.unmatchedDynamic = unmatchedDynamic;
  stats.unmatchedBroken = unmatchedBroken;

  // 外链域名统计
  const hostCount = new Map();
  for (const hosts of externalLinks.values()) {
    for (const h of hosts) hostCount.set(h, (hostCount.get(h) || 0) + 1);
  }
  stats.externalHosts = [...hostCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([h, c]) => ({ host: h, count: c }));

  // 板块统计（鉴权板块 /zh/my/ 等不参与）
  const sectionMap = new Map();
  for (const { pagePath } of pages) {
    if (authPageSet.has(pagePath)) continue;
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

  // ---------- 11. 序列化 ----------
  const edges = [];
  for (const [from, outs] of downstream) {
    for (const to of outs) {
      edges.push({ from, to, sources: [...(edgeMeta.get(from + '\u0001' + to) || [])] });
    }
  }

  const pageRecords = pages.map((pageRec) => {
    const pagePath = pageRec.pagePath;
    const isAuth = pageRec.kind === 'auth';
    const out = downstream.has(pagePath) ? [...downstream.get(pagePath)] : [];
    const ins = upstream.has(pagePath) ? [...upstream.get(pagePath)] : [];
    const inNav = globalLinkTargets.has(pagePath);
    const dynEntry = dynamicEntryPages.has(pagePath);
    const tabReachable =
      pageRec.kind === 'alias' &&
      (() => {
        const host = aliasHost.get(pagePath);
        return !!host && ((upstream.has(host) && upstream.get(host).size > 0) || globalLinkTargets.has(host));
      })();
    return {
      page: pagePath,
      title: titleMap.get(pagePath) || '',
      section: pageToSection(pagePath),
      kind: pageRec.kind || 'static',
      outbound: out,
      inbound: ins,
      outCount: out.length,
      inCount: ins.length,
      inGlobalNav: inNav,
      globalNavSources: inNav ? [...new Set(globalLinkSources.get(pagePath) || [])] : [],
      dynamicEntrySources: dynEntry ? [...dynamicEntryPages.get(pagePath)] : [],
      tabReachable,
      // 鉴权页由登录下拉进入；动态路由入口仅运行时可达；alias 经宿主页 tab 切换可达
      isOrphan: isAuth || dynEntry || tabReachable ? false : out.length === 0 && ins.length === 0 && !inNav,
      isContentOrphan: isAuth ? false : out.length === 0 && ins.length === 0,
      externalHosts: externalLinks.has(pagePath) ? [...externalLinks.get(pagePath)] : [],
      sourceKinds: pageSourceKinds.has(pagePath)
        ? [...pageSourceKinds.get(pagePath).entries()].map(([k, v]) => `${k}×${v}`)
        : [],
    };
  });

  const sectionEdges = [];
  const secEdgeMap = new Map();
  for (const [from, outs] of downstream) {
    if (authPageSet.has(from)) continue; // 鉴权页出边不进板块关系图
    const fromSec = pageToSection(from);
    for (const to of outs) {
      if (authSections.has(pageToSection(to))) continue;
      const toSec = pageToSection(to);
      const k = fromSec + '\u0001' + toSec;
      secEdgeMap.set(k, (secEdgeMap.get(k) || 0) + 1);
    }
  }
  for (const [k, w] of secEdgeMap) {
    const [from, to] = k.split('\u0001');
    sectionEdges.push({ from, to, weight: w });
  }

  // 未匹配内链清单（含分类）
  const unmatchedRecords = [];
  for (const [pagePath, links] of unmatchedLinks) {
    for (const l of links) {
      unmatchedRecords.push({
        from: pagePath,
        link: l,
        category: l.startsWith('/docs/') ? 'docs' : isDynamicRoutePath(l) ? 'dynamic' : 'broken',
      });
    }
  }
  unmatchedRecords.sort((a, b) => a.category.localeCompare(b.category) || a.from.localeCompare(b.from));

  const structuralComponents = new Set();
  for (const [comp, usage] of componentUsage) {
    if (usage.size <= SHARED_COMPONENT_THRESHOLD) continue;
    // node_modules 库组件与 pages/ 页面文件不是站点结构组件
    if (comp.includes(`${path.sep}node_modules${path.sep}`)) continue;
    if (comp.startsWith(PAGES_DIR + path.sep)) continue;
    structuralComponents.add(comp);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    elapsedMs: Date.now() - t0,
    autoImportSource: AUTO_IMPORT_INDEX.source,
    stats,
    sections: stats.sectionStats,
    sectionEdges,
    pages: pageRecords,
    edges,
    unmatched: unmatchedRecords,
    dynamicRoutes: dynamicTemplates.map((t) => ({ template: t.template, locale: t.locale, file: relFromApp(t.file) })),
    structuralComponents: [...structuralComponents].map((c) => relFromApp(c)),
    apiArticles: sigPages.length,
    globalLinks: [...globalLinkTargets].sort().map((p) => ({
      page: p,
      title: titleMap.get(p) || '',
      sources: [...new Set(globalLinkSources.get(p) || [])],
    })),
  };

  // ---------- 12. 输出 ----------
  const html = buildHtml(payload);
  fs.writeFileSync(OUTPUT_HTML, html, 'utf-8');

  console.log('┌──────────────────────────────────────────────────┐');
  console.log('│ openUBMC 站内内链分析完成（Nuxt 版）');
  console.log('├──────────────────────────────────────────────────┤');
  console.log('│ 页面总数          :', String(stats.totalPages).padStart(8), `（静态 ${stats.staticPages} · 内容 ${stats.contentPages} · API ${stats.apiPages} · 鉴权 ${stats.authPages}）`);
  console.log('│ 动态路由模板      :', String(stats.dynamicRouteTemplates).padStart(8));
  console.log('│ 内链边总数        :', String(stats.totalEdges).padStart(8));
  console.log('│ 有出链页面        :', String(stats.pagesWithOutbound).padStart(8));
  console.log('│ 有入链页面        :', String(stats.pagesWithInbound).padStart(8));
  console.log('│ 孤岛页面          :', String(stats.orphanPages.length).padStart(8));
  console.log('│ 无入链页面        :', String(stats.noInboundPages.length).padStart(8));
  console.log('│ 未匹配内链        :', String(stats.unmatchedInternal).padStart(8), `（docs ${unmatchedDocs} · 动态 ${unmatchedDynamic} · 疑似断链 ${unmatchedBroken}）`);
  console.log('├──────────────────────────────────────────────────┤');
  console.log('│ 全局导航覆盖页    :', String(stats.globalLinkPages).padStart(8));
  console.log('│ 未进入导航页面    :', String(stats.pagesNotInNav.length).padStart(8));
  console.log('│ 内容强·入口弱     :', String(stats.contentInboundNoNav.length).padStart(8));
  console.log('│ 导航有·内容无     :', String(stats.navInboundNoContent.length).padStart(8));
  console.log('├──────────────────────────────────────────────────┤');
  console.log('│ 报告已生成:', OUTPUT_HTML);
  console.log('└──────────────────────────────────────────────────┘');
}

function pageToSection(pagePath) {
  const parts = pagePath.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  if (parts.length === 1) return '/' + parts[0] + '/';
  return '/' + parts.slice(0, 2).join('/') + '/';
}

/* ------------------------------------------------------------------ */
/* HTML 报告构建（跨项目看板规格一致，详见 SKILL.md）                      */
/* ------------------------------------------------------------------ */
function buildHtml(payload) {
  const json = JSON.stringify(payload);
  const sections = payload.sections;
  const sectionEdges = payload.sectionEdges;
  const stats = payload.stats;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const cards = [
    {
      label: '页面总数',
      value: stats.totalPages,
      sub: `静态 ${stats.staticPages} · 内容 ${stats.contentPages} · API ${stats.apiPages} · 鉴权 ${stats.authPages}`,
    },
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
<title>openUBMC 站内内链看板</title>
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
  .b-docs{background:rgba(167,139,250,.15);color:#c4b5fd}
  .b-dyn{background:rgba(34,211,238,.15);color:#67e8f9}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <h1>openUBMC 站内内链看板</h1>
    <span class="muted">分析 <code>pages/{zh,en}</code> + <code>content/{zh,en}</code> + <code>.content/</code> YAML + SIG API · 内链域名 www.openubmc.cn</span>
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
      <h2>疑似断链 / 跨应用链接<span class="small"> · 共 ${stats.unmatchedInternal} 条 · docs ${stats.unmatchedDocs} · 动态路由 ${stats.unmatchedDynamic} · 疑似断链 ${stats.unmatchedBroken}</span></h2>
      <div class="toolbar">
        <select id="unmatchedFilter">
          <option value="">全部</option>
          <option value="broken">疑似断链</option>
          <option value="docs">docs 跨应用</option>
          <option value="dynamic">动态路由</option>
        </select>
        <span class="small">docs = 同域名文档中心应用（正常）；动态路由 = 客户端渲染板块（/cve /video /marketplace 等）</span>
      </div>
      <div style="max-height:320px;overflow:auto">
        <table id="unmatchedTable"></table>
      </div>
    </div>
    <div class="panel" style="margin-top:16px">
      <h2>全局导航覆盖页面（在 AppHeader2/AppFooter 等全局组件的链接中）<span class="small"> · ${stats.globalLinkPages} 页</span></h2>
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
        <li>页面来源：<code>pages/{zh,en}</code> 静态路由（含 definePageMeta alias，排除鉴权目录 <code>my/</code>）、<code>content/{zh,en}</code> 内容路由（经 <code>[id].vue</code> 动态页 + queryContent 渲染）、<code>/{l}/version/latest</code> 特殊路由、SIG 清单 API（${payload.apiArticles} 个详情页）。</li>
        <li>动态路由模板（cve/security-advisories/video/marketplace/edit-meeting，共 ${stats.dynamicRouteTemplates} 个）由运行时 API 驱动且 prerender:false，不纳入图。</li>
        <li>链接提取：md 正文/frontmatter、HTML <code>href</code>、<code>NuxtLink :to</code>、<code>router.push/replace</code>、YAML URL 字段（<code>.content/</code> 经 <code>#content/</code> 虚拟模块）、视图组件链（显式 import + Nuxt 自动导入，递归 5 层，组件索引来源：${esc(payload.autoImportSource)}）。</li>
        <li>locale 补全：复现 <code>handleLocaleHref</code> 语义 —— 去 locale 路径（如 <code>/news</code>）同时生成 <code>/zh</code>+<code>/en</code> 两份与页面集匹配。</li>
        <li>i18n 富文本：<code>locales/</code> 模块中 <code>&lt;a href&gt;</code> 按 <code>t('ns.')</code> 命名空间归属到使用该命名空间的页面。</li>
        <li>全局导航：<code>layouts/default.vue</code> 注入的 AppHeader2/AppHeaderMobile2/AppFooter/FloatingButton/FloatingLeft/AppGuide 中的链接单独归为「全局导航」，<b>不注入到每页出边</b>，避免指标失真（AppFooter 仅消费 home yaml 的 footer_links/friend_links 字段）。</li>
        <li>合成边：内容列表页 → 内容页（<code>item._path</code> 运行时数据按内容路由枚举合成）、SIG 列表 → SIG 详情（API 清单合成）。</li>
        <li>标题来源：content md frontmatter <code>title</code>、<code>definePageMeta title</code>、<code>locales/route</code>（按 Nuxt 路由名推导）、SIG 名。</li>
        <li>内链判定：以 <code>www.openubmc.cn</code> / <code>openubmc.cn</code> 域名，或 <code>/zh/…</code>、<code>/en/…</code> 站内路径（去 locale 路径双语言展开后匹配）。</li>
        <li>四类页面分类：<b>孤岛</b>=无内容链且未入导航；<b>内容强·入口弱</b>=有内容入链但不在导航（建议加导航/加链接）；<b>导航有·内容无</b>=在导航但无内容入链（建议补内容内链）；<b>仅导航</b>=无内容上下游但靠导航存活。</li>
        <li>局限：语言切换器（HeaderLang 的 zh/en 路径互换）、ProseImg docs-update 热区、版本切换器（OSelect 无 &lt;a&gt;）不计入；cve/security-advisories 等表格内的 API 动态链接未合成，需结合线上 HTML 抓取复核。</li>
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
  var kindLabel = { static:'静态', alias:'alias', content:'内容', api:'API', auth:'鉴权' };

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
    var html = '<thead><tr><th>标题</th><th>路径</th><th>板块</th><th>类型</th><th>出链</th><th>入链</th><th>导航</th><th>状态</th></tr></thead><tbody>';
    rows.forEach(function(p,idx){
      var badge;
      if(p.kind==='auth'){ badge = '<span class="badge b-navOnly">鉴权页</span>' }
      else if(p.isOrphan){ badge = '<span class="badge b-danger">孤岛</span>' }
      else if(p.dynamicEntrySources && p.dynamicEntrySources.length){ badge = '<span class="badge b-orphan">动态入口</span>' }
      else if(p.tabReachable){ badge = '<span class="badge b-navOnly">tab 可达</span>' }
      else if(p.isContentOrphan){ badge = p.inGlobalNav ? '<span class="badge b-navOnly">仅导航</span>' : '<span class="badge b-orphan">内容孤岛</span>' }
      else if(p.inCount===0){ badge = p.inGlobalNav ? '<span class="badge b-navOnly">仅导航</span>' : '<span class="badge b-noIn">无入链</span>' }
      else { badge = '<span class="badge b-ok">已连通</span>' }
      var navBadge = p.kind==='auth' ? '<span class="badge b-navOnly">登录入口</span>' : (p.inGlobalNav ? '<span class="badge b-ok">在导航</span>' : '<span class="badge b-noIn">未入导航</span>');
      var titleCell = p.title ? esc(p.title) : '<span class="small">（无标题）</span>';
      html += '<tr class="row" data-idx="'+idx+'" data-page="'+p.page.replace(/"/g,'&quot;')+'"><td>'+titleCell+'</td><td class="small">'+p.page+'</td><td>'+p.section+'</td><td>'+(kindLabel[p.kind]||p.kind)+'</td><td>'+p.outCount+'</td><td>'+p.inCount+'</td><td>'+navBadge+'</td><td>'+badge+'</td></tr>';
      html += '<tr class="detail" id="det-'+idx+'"><td colspan="8"></td></tr>';
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
    var reachInfo = '';
    if(p.dynamicEntrySources && p.dynamicEntrySources.length){
      reachInfo += '<div class="small" style="margin-bottom:8px"><span class="badge b-orphan">动态路由入口</span> <span class="small">由运行时板块链接：'+p.dynamicEntrySources.join(', ')+'（用户可达，无静态入链）</span></div>';
    }
    if(p.tabReachable){
      reachInfo += '<div class="small" style="margin-bottom:8px"><span class="badge b-navOnly">tab 切换可达</span> <span class="small">与宿主页同组件，经 tab/hash 切换到达（无独立 &lt;a&gt; 入链）</span></div>';
    }
    var srcInfo = p.sourceKinds.length ? '<div class="small" style="margin-bottom:8px">链接来源：'+p.sourceKinds.map(esc).join(' · ')+'</div>' : '';
    var titleLine = p.title ? '<div style="margin-bottom:8px"><b>'+esc(p.title)+'</b> <span class="small">'+p.page+'</span></div>' : '<div style="margin-bottom:8px"><b>'+p.page+'</b></div>';
    return titleLine + '<div class="small" style="margin-bottom:8px">全局导航：'+navInfo+'</div>' + reachInfo + srcInfo + '<div class="grid2">'+
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

  // ---- 疑似断链 / 跨应用链接 ----
  function renderUnmatched(){
    var cat = document.getElementById('unmatchedFilter').value;
    var rows = D.unmatched.filter(function(u){ return !cat || u.category===cat });
    var catBadge = { broken:'<span class="badge b-danger">疑似断链</span>', docs:'<span class="badge b-docs">docs 跨应用</span>', dynamic:'<span class="badge b-dyn">动态路由</span>' };
    var h = '<thead><tr><th>来源页面</th><th>链接</th><th>分类</th></tr></thead><tbody>';
    rows.slice(0,500).forEach(function(u){
      h += '<tr><td><a href="javascript:void(0)" data-go="'+u.from+'">'+esc(titleFor(u.from)||u.from)+'</a><div class="small">'+u.from+'</div></td><td class="small">'+esc(u.link)+'</td><td>'+(catBadge[u.category]||u.category)+'</td></tr>';
    });
    h += '</tbody>';
    if(rows.length>500){ h += '<tfoot><tr><td colspan="3" class="small">仅显示前 500 条，共 '+rows.length+' 条</td></tr></tfoot>'; }
    document.getElementById('unmatchedTable').innerHTML = h || '<tbody><tr><td class="small">无</td></tr></tbody>';
  }
  document.getElementById('unmatchedFilter').addEventListener('change', renderUnmatched);
  renderUnmatched();

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
