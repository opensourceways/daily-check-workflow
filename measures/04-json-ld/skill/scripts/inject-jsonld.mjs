#!/usr/bin/env node
/**
 * inject-jsonld.mjs — 构建产物 JSON-LD 后处理注入器
 *
 * 零依赖（Node.js ≥ 18）。在 SSG 构建完成后扫描 dist HTML，注入符合
 * W3C JSON-LD 1.1 + schema.org + Google 规则的结构化数据：
 *   Organization + WebSite + WebPage + BreadcrumbList（基础）
 *   + TechArticle（--article，文档站）
 *
 * 适用：无法修改构建配置的项目（路径 C 兜底）。
 * 能注入的取值仅限 HTML/文件元数据中真实存在的（title/description/canonical/mtime），
 * 无法伪造 frontmatter 级数据（author 等）——需要更丰富取值请改用
 * VitePress transformPageData / nuxt-schema-org（见 SKILL.md 路径 A/B）。
 *
 * 用法：
 *   node inject-jsonld.mjs --dist .vitepress/dist \
 *     --site-url https://docs.example.com --site-name "站点名" \
 *     --org-name "组织名" --org-logo https://.../logo.png \
 *     [--description "站点描述"] [--lang zh-CN] \
 *     [--article --default-image https://.../og.png] \
 *     [--base-path /] [--keep-html-ext] [--force] [--dry-run]
 *
 * 参数：
 *   --dist <dir>            构建产物目录（必填）
 *   --site-url <url>        站点根 URL，含协议（必填）
 *   --site-name <text>      站点名称（必填）
 *   --org-name <text>       组织正式名称（必填）
 *   --org-logo <url>        组织 Logo 绝对 URL，≥112×112px（必填）
 *   --description <text>    站点描述，WebSite/WebPage 兜底（可选）
 *   --lang <tag>            站点语言，默认 zh-CN
 *   --article               文档/文章页追加 TechArticle 节点
 *   --default-image <url>   TechArticle.image 兜底图，宽 ≥1200px（--article 时必填）
 *   --base-path <path>      子路径部署前缀，默认 /
 *   --keep-html-ext         URL 保留 .html 后缀（默认去除）
 *   --force                 已含 ld+json 的页面也重新注入（默认跳过）
 *   --dry-run               只统计不写文件
 */

import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

const args = parseArgs(process.argv.slice(2));

if (args.help || args.h) {
  console.log('用法见文件头部注释。必需参数：--dist --site-url --site-name --org-name --org-logo');
  process.exit(0);
}

main().catch((err) => {
  console.error(`[jsonld] 注入失败: ${err.message}`);
  process.exit(1);
});

async function main() {
  const distDir = requireArg('dist', !!args.dist);
  const siteUrl = requireArg('site-url', String(args['site-url'] || '').startsWith('http'), '必须为 http(s):// 开头').replace(/\/+$/, '');
  const siteName = requireArg('site-name', !!args['site-name']);
  const orgName = requireArg('org-name', !!args['org-name']);
  const orgLogo = requireArg('org-logo', String(args['org-logo'] || '').startsWith('http'), '必须为绝对 URL');
  const description = args.description ? String(args.description) : null;
  const lang = String(args.lang || 'zh-CN');
  const withArticle = !!args.article;
  const defaultImage = withArticle ? requireArg('default-image', String(args['default-image'] || '').startsWith('http'), '--article 时必须提供（宽 ≥1200px）') : null;
  const basePath = normalizeBasePath(args['base-path'] || '/');
  const keepExt = !!args['keep-html-ext'];
  const force = !!args.force;
  const dryRun = !!args['dry-run'];

  const absDist = resolve(distDir);
  if (!existsSync(absDist)) throw new Error(`--dist 目录不存在: ${absDist}`);

  const files = await walkHtml(absDist, absDist);
  let injected = 0;
  let skipped = 0;

  for (const f of files) {
    const html = await readFile(f.abs, 'utf8');
    if (hasJsonLd(html) && !force) {
      skipped++;
      continue;
    }
    const pageUrl = siteUrl + relToUrlPath(f.rel, basePath, keepExt);
    const meta = extractMeta(html);
    const mtime = (await stat(f.abs)).mtime;
    const graph = buildGraph({ pageUrl, siteUrl, siteName, orgName, orgLogo, description, lang, meta, mtime, withArticle, defaultImage, rel: f.rel });
    const block = `<script type="application/ld+json">${safeJson(graph)}</script>`;
    const out = injectBefore(html, block);
    if (!dryRun) await writeFile(f.abs, out, 'utf8');
    injected++;
  }

  console.log(`[jsonld] 完成：注入 ${injected} 个页面，跳过 ${skipped} 个（已含 ld+json）${dryRun ? '（dry-run 未写入）' : ''}`);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith('--')) {
      out[key] = next;
      i++;
    } else {
      out[key] = true;
    }
  }
  return out;
}

function requireArg(name, ok, detail) {
  if (!args[name]) {
    console.error(`[jsonld] 缺少必需参数 --${name}`);
    process.exit(1);
  }
  if (!ok) {
    console.error(`[jsonld] 参数 --${name} 无效${detail ? `：${detail}` : ''}`);
    process.exit(1);
  }
  return String(args[name]);
}

function normalizeBasePath(p) {
  if (!p.startsWith('/')) p = `/${p}`;
  if (!p.endsWith('/')) p += '/';
  return p;
}

function safeJson(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

function hasJsonLd(html) {
  return /<script[^>]*type=["']application\/ld\+json["']/i.test(html);
}

function injectBefore(html, block) {
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${block}</head>`);
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${block}</body>`);
  return html + block;
}

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&(?:#39|apos);/gi, "'");
}

function stripTitleSuffix(t) {
  return t.split(/\s+[|·—–]\s+/)[0].trim() || t;
}

function extractMeta(html) {
  const titleM = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const fullTitle = titleM ? decodeEntities(titleM[1]).replace(/\s+/g, ' ').trim() : null;
  const descPatterns = [
    /<meta\s[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i,
    /<meta\s[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i,
  ];
  let description = null;
  for (const p of descPatterns) {
    const m = html.match(p);
    if (m && m[1].trim()) {
      description = decodeEntities(m[1]).replace(/\s+/g, ' ').trim();
      break;
    }
  }
  const canonicalM = html.match(/<link\s[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) || html.match(/<link\s[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  const canonical = canonicalM ? canonicalM[1].trim() : null;
  return { title: fullTitle, shortTitle: fullTitle ? stripTitleSuffix(fullTitle) : null, description, canonical };
}

async function walkHtml(dir, root) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'assets') continue;
      out.push(...(await walkHtml(p, root)));
    } else if (e.isFile() && /\.html?$/i.test(e.name)) {
      const rel = relative(root, p).split('\\').join('/');
      if (/(^|\/)\d{3}\.html?$/i.test(rel)) continue;
      out.push({ abs: p, rel });
    }
  }
  return out;
}

function relToUrlPath(rel, basePath, keepExt) {
  let p = rel.replace(/\\/g, '/').replace(/(^|\/)index\.html?$/i, '/');
  if (!keepExt) p = p.replace(/\.html?$/i, '');
  if (p.startsWith('/') && p !== '/') p = p.slice(1);
  else if (p === '/') p = '';
  return basePath + p;
}

function buildGraph(ctx) {
  const { pageUrl, siteUrl, siteName, orgName, orgLogo, description, lang, meta, mtime, withArticle, defaultImage, rel } = ctx;
  const canonicalUrl = meta.canonical || pageUrl;
  const isRoot = (() => {
    try {
      return new URL(pageUrl).pathname.replace(/\/+$/, '') === '';
    } catch {
      return false;
    }
  })();
  const orgId = `${siteUrl}/#organization`;
  const siteId = `${siteUrl}/#website`;
  const pageId = `${canonicalUrl}#webpage`;
  const org = {
    '@type': 'Organization',
    '@id': orgId,
    name: orgName,
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: orgLogo },
  };
  const website = {
    '@type': 'WebSite',
    '@id': siteId,
    name: siteName,
    url: siteUrl,
    inLanguage: lang,
    publisher: { '@id': orgId },
  };
  if (description) website.description = description;

  const crumbs = breadcrumbItems(pageUrl, siteUrl, meta.shortTitle || rel, lang);
  const hasBreadcrumb = crumbs.length >= 2;
  const breadcrumb = hasBreadcrumb
    ? { '@type': 'BreadcrumbList', '@id': `${canonicalUrl}#breadcrumb`, itemListElement: crumbs }
    : null;

  const pageName = meta.shortTitle || siteName;
  const webpage = {
    '@type': 'WebPage',
    '@id': pageId,
    url: canonicalUrl,
    name: pageName,
    isPartOf: { '@id': siteId },
    inLanguage: lang,
  };
  if (meta.description || description) webpage.description = meta.description || description;
  if (hasBreadcrumb) webpage.breadcrumb = { '@id': `${canonicalUrl}#breadcrumb` };

  const graph = [org, website, webpage];
  if (breadcrumb) graph.push(breadcrumb);

  if (withArticle && !isRoot) {
    const date = mtime.toISOString();
    const article = {
      '@type': 'TechArticle',
      '@id': `${canonicalUrl}#article`,
      headline: (meta.shortTitle || pageName).slice(0, 110),
      image: defaultImage,
      datePublished: date.slice(0, 10),
      dateModified: date,
      author: { '@id': orgId },
      publisher: { '@id': orgId },
      mainEntityOfPage: canonicalUrl,
      inLanguage: lang,
      isPartOf: { '@id': siteId },
    };
    if (meta.description || description) article.description = meta.description || description;
    graph.push(article);
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function breadcrumbItems(pageUrl, siteUrl, pageTitle, lang) {
  let path;
  try {
    path = new URL(pageUrl).pathname.replace(/\/+$/, '');
  } catch {
    return [];
  }
  const segments = path.split('/').filter(Boolean);
  const items = [{ name: '首页', item: `${siteUrl}/` }];
  let acc = '';
  for (const s of segments) {
    acc += `/${decodeURIComponent(s)}`;
    items.push({ name: decodeURIComponent(s), item: `${siteUrl}${acc}` });
  }
  if (items.length > 1) items[items.length - 1] = { name: pageTitle };
  return items.map((it, i) => {
    const li = { '@type': 'ListItem', position: i + 1, name: it.name };
    if (it.item) li.item = it.item;
    return li;
  });
}
