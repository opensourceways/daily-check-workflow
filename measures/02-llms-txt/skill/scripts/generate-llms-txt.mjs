#!/usr/bin/env node
/**
 * generate-llms-txt.mjs — llms.txt / llms-full.txt 兜底生成器
 *
 * 零依赖（Node.js ≥ 18），遵循 llmstxt.org v2 规范与 Mintlify llms-full.txt 社区约定。
 * 适用：无法接入 vitepress-plugin-llms / nuxt-llms 的项目，或需要快速引导的场景。
 * 质量说明：dist 模式优先拼接页面 .md（真 Markdown），否则 HTML 近似提取；
 *           生态插件的输出质量始终优于本脚本，技术栈匹配时优先使用插件。
 *
 * 用法：
 *   node generate-llms-txt.mjs --source dist --dist .vitepress/dist \
 *     --domain https://docs.example.com --title "站点名" --description "一句话描述" [--full]
 *
 *   node generate-llms-txt.mjs --source sitemap --sitemap https://www.example.com/sitemap.xml \
 *     --domain https://www.example.com --title "站点名" --description "一句话描述" \
 *     --out ./public [--full]
 *
 * 参数：
 *   --source sitemap|dist   数据来源（必填）
 *   --domain <url>          站点域名，含协议（必填）
 *   --title <text>          站点名称，作为 H1（必填）
 *   --description <text>    一句话摘要，作为 blockquote（必填）
 *   --sitemap <url|file>    sitemap 地址或本地文件（source=sitemap 必填）
 *   --dist <dir>            构建产物目录（source=dist 必填）
 *   --base-path <path>      站点部署子路径，默认 /
 *   --out <dir>             输出目录，默认：dist 模式为 --dist 目录，sitemap 模式为 ./
 *   --full                  同时生成 llms-full.txt
 *   --keep-html-ext         URL 保留 .html 后缀（默认去除）
 *   --max-pages <n>         llms-full.txt 最多收录页面数，默认 500（仅截断 full，不截断索引）
 *   --timeout <ms>          网络请求超时，默认 15000
 */

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_INDEX_CHARS = 100_000;

const args = parseArgs(process.argv.slice(2));

if (args.help || args.h) {
  console.log(fileURLToPath(import.meta.url));
  console.log(
    '用法见文件头部注释。必需参数：--source --domain --title --description，' +
      '另需 --sitemap（sitemap 模式）或 --dist（dist 模式）'
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(`[llms-txt] 生成失败: ${err.message}`);
  process.exit(1);
});

async function main() {
  const domain = requireArg('domain', String(args.domain || '').startsWith('http'), '必须为 http(s):// 开头的绝对 URL').replace(/\/+$/, '');
  const title = requireArg('title', !!args.title);
  const description = requireArg('description', !!args.description);
  const source = requireArg('source', args.source === 'sitemap' || args.source === 'dist', '必须为 sitemap 或 dist');
  const basePath = normalizeBasePath(args['base-path'] || '/');
  const rootUrl = (domain + basePath).replace(/\/+$/, '');
  const keepExt = !!args['keep-html-ext'];
  const makeFull = !!args.full;
  const maxPages = Number(args['max-pages'] || 500);
  const timeout = Number(args.timeout || 15000);

  const pages =
    source === 'dist'
      ? await collectFromDist(String(args.dist), domain, basePath, keepExt)
      : await collectFromSitemap(String(args.sitemap), domain, timeout);

  if (!pages.length) {
    throw new Error('未收集到任何页面，请检查 --dist 目录或 --sitemap 内容');
  }

  const outDir = resolve(args.out ? String(args.out) : source === 'dist' ? String(args.dist) : '.');
  await mkdir(outDir, { recursive: true });
  const llmsTxt = renderLlmsTxt(title, description, rootUrl, pages, makeFull);
  await writeFile(join(outDir, 'llms.txt'), llmsTxt, 'utf8');
  console.log(`[llms-txt] 已生成 llms.txt（${pages.length} 个页面，${llmsTxt.length} 字符）→ ${join(outDir, 'llms.txt')}`);
  if (llmsTxt.length > MAX_INDEX_CHARS) {
    console.warn(
      `[llms-txt] 警告：llms.txt 超过 ${MAX_INDEX_CHARS} 字符（Mintlify 约定上限），` +
        '应按规范拆分为 /_llms/ 递归子索引，而非继续追加链接'
    );
  }

  if (makeFull) {
    const included = pages.slice(0, maxPages);
    if (pages.length > included.length) {
      console.warn(`[llms-txt] 警告：页面数 ${pages.length} 超过 --max-pages=${maxPages}，llms-full.txt 仅收录前 ${maxPages} 页`);
    }
    const contents = await resolveContents(source, included, String(args.dist || ''), timeout);
    const full = renderLlmsFull(title, description, included, contents);
    await writeFile(join(outDir, 'llms-full.txt'), full, 'utf8');
    console.log(`[llms-txt] 已生成 llms-full.txt（${included.length} 个页面，${full.length} 字符）→ ${join(outDir, 'llms-full.txt')}`);
  }
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
    console.error(`[llms-txt] 缺少必需参数 --${name}`);
    process.exit(1);
  }
  if (!ok) {
    console.error(`[llms-txt] 参数 --${name} 无效${detail ? `：${detail}` : ''}`);
    process.exit(1);
  }
  return String(args[name]);
}

function normalizeBasePath(p) {
  if (!p.startsWith('/')) p = `/${p}`;
  if (!p.endsWith('/')) p += '/';
  return p;
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

function extractTitle(html, fallback) {
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (t) {
    const full = decodeEntities(t[1]).replace(/\s+/g, ' ').trim();
    const stripped = full.split(/\s+[|·—–]\s+/)[0].trim();
    return stripped || full;
  }
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return decodeEntities(h1[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
  return fallback;
}

function extractDescription(html) {
  const patterns = [
    /<meta\s[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i,
    /<meta\s[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i,
    /<meta\s[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m && m[1].trim()) return decodeEntities(m[1]).replace(/\s+/g, ' ').trim();
  }
  return null;
}

function extractHtmlBody(html) {
  let s = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|svg|noscript|iframe|nav|header|footer|aside|form)\b[\s\S]*?<\/\1>/gi, '');
  const container =
    s.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
    s.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
    s.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (container) s = container[1];
  s = s.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, lvl, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    return `\n${'#'.repeat(Number(lvl) + 1)} ${text}\n`;
  });
  s = s.replace(/<li[^>]*>/gi, '\n- ').replace(/<\/(p|div|section|li|tr|blockquote)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n');
  s = decodeEntities(s.replace(/<[^>]+>/g, ' '));
  return s
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

function stripFrontmatter(md) {
  return md.replace(/^---\n[\s\S]*?\n---\n?/, '');
}

async function collectFromDist(distDir, domain, basePath, keepExt) {
  const absDist = resolve(distDir);
  if (!existsSync(absDist)) throw new Error(`--dist 目录不存在: ${absDist}`);
  const files = await walkHtml(absDist, absDist);
  const pages = [];
  for (const f of files) {
    const html = await readFile(f.abs, 'utf8');
    const url = domain + relToUrlPath(f.rel, basePath, keepExt);
    pages.push({
      url,
      title: extractTitle(html, f.rel) || url,
      description: extractDescription(html),
      html,
      absPath: f.abs,
    });
  }
  return sortByImportance(pages);
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

async function collectFromSitemap(sitemapRef, domain, timeout) {
  let xml;
  if (/^https?:\/\//i.test(sitemapRef)) {
    xml = (await fetchWithTimeout(sitemapRef, timeout)).text;
  } else {
    xml = await readFile(resolve(sitemapRef), 'utf8');
  }
  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => m[1].trim());
  if (!locs.length) throw new Error('sitemap 中未解析到任何 <loc>');
  const domainOrigin = safeOrigin(domain);
  const pages = locs
    .filter((u) => /^https?:\/\//i.test(u) && safeOrigin(u) === domainOrigin)
    .map((url) => ({
      url,
      title: urlToTitle(url),
      description: null,
      html: null,
      absPath: null,
    }));
  return sortByImportance(pages);
}

function safeOrigin(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

function urlToTitle(url) {
  try {
    const u = new URL(url);
    const seg = decodeURIComponent(u.pathname.replace(/\/+$/, '').split('/').pop() || u.hostname);
    return seg.replace(/\.(html?|md)$/i, '').replace(/[-_]+/g, ' ').trim() || u.hostname;
  } catch {
    return url;
  }
}

function sortByImportance(pages) {
  return pages.sort((a, b) => {
    const da = depthOf(a.url);
    const db = depthOf(b.url);
    if (da !== db) return da - db;
    return a.url.localeCompare(b.url);
  });
}

function depthOf(url) {
  try {
    return new URL(url).pathname.replace(/\/+$/, '').split('/').filter(Boolean).length;
  } catch {
    return 99;
  }
}

async function resolveContents(source, pages, distDir, timeout) {
  const contents = new Array(pages.length);
  if (source === 'dist') {
    for (let i = 0; i < pages.length; i++) {
      contents[i] = await distPageContent(pages[i]);
    }
  } else {
    const CONCURRENCY = 5;
    let cursor = 0;
    async function worker() {
      while (cursor < pages.length) {
        const i = cursor++;
        try {
          const { text } = await fetchWithTimeout(pages[i].url, timeout);
          contents[i] = extractHtmlBody(text);
        } catch (err) {
          contents[i] = `（页面抓取失败：${err.message}）`;
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, pages.length) }, worker));
  }
  return contents;
}

async function distPageContent(page) {
  const htmlPath = page.absPath;
  const candidates = [
    htmlPath.replace(/\.html?$/i, '.md'),
    htmlPath.replace(/(\.html?)$/i, '$1.md'),
  ];
  for (const c of candidates) {
    if (existsSync(c) && /\.md$/i.test(c)) {
      const md = await readFile(c, 'utf8');
      return shiftMarkdownHeadings(stripFrontmatter(md).trim());
    }
  }
  return extractHtmlBody(page.html || '');
}

function shiftMarkdownHeadings(md) {
  return md.replace(/^(#{1,5})\s/gm, '#$1 ');
}

function renderLlmsTxt(title, description, domain, pages, makeFull) {
  const lines = [];
  lines.push(`# ${title}`, '', `> ${description}`, '');
  lines.push('本文件由 generate-llms-txt.mjs 自动生成，遵循 llmstxt.org v2 规范。', '');
  lines.push(`- 页面数量：${pages.length}`);
  if (makeFull) lines.push(`- 全量内容：[llms-full.txt](${domain}/llms-full.txt)：全部页面合并为单文件，可一次拉取`);
  lines.push('', '## Pages', '');
  for (const p of pages) {
    lines.push(linkLine(p));
  }
  lines.push('', '## Optional', '', `- [站点地图](${domain}/sitemap.xml)：完整页面清单，供搜索引擎使用`, '');
  return lines.join('\n');
}

function linkLine(p) {
  const desc = p.description ? `: ${truncate(p.description, 300)}` : '';
  return `- [${p.title}](${p.url})${desc}`;
}

function renderLlmsFull(title, description, pages, contents) {
  const parts = [`# ${title} — Full Documentation`, '', `> ${description}`, ''];
  parts.push('本文件由 generate-llms-txt.mjs 自动生成，为全部页面的单文件合并版本。', '');
  pages.forEach((p, i) => {
    parts.push('---', '', `## ${p.title}`, '', `Source: ${p.url}`, '');
    if (p.description) parts.push(`> ${truncate(p.description, 300)}`, '');
    parts.push(dedupeLeadingHeading(contents[i] || '（无内容）', p.title), '');
  });
  return parts.join('\n');
}

function dedupeLeadingHeading(content, title) {
  const m = content.match(/^(#{1,6})\s+(.+)\n?/);
  if (m && m[2].replace(/\s+/g, ' ').trim().toLowerCase() === title.replace(/\s+/g, ' ').trim().toLowerCase()) {
    return content.slice(m[0].length).replace(/^\n+/, '');
  }
  return content;
}

function truncate(s, n) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

async function fetchWithTimeout(url, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'geo-llms-txt-generator/1.0' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { text: await res.text() };
  } finally {
    clearTimeout(timer);
  }
}
