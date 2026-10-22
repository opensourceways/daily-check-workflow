#!/usr/bin/env node
/**
 * validate-jsonld.mjs — JSON-LD 本地/线上校验器（CI 友好，零依赖，Node ≥18）
 *
 * 依据 04-json-ld 规范校验：
 *   1. JSON 语法合法
 *   2. @context 为 https://schema.org
 *   3. 各 schema 类型 Google 必填属性齐全且非空
 *   4. BreadcrumbList / FAQPage 嵌套结构正确
 *   5. 无占位符取值（TODO / FIXME / xxx / 待填 / example.com）
 *
 * 用法：
 *   node validate-jsonld.mjs --dist .vitepress/dist          # 校验本地构建产物
 *   node validate-jsonld.mjs --url https://www.example.com   # 校验线上页面
 *   # 可加 --max-pages 200 限制 dist 模式校验页数
 *
 * 退出码：发现 error 时非 0，可用于 CI 门禁。
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

const REQUIRED_PROPS = {
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
const PLACEHOLDER_RE = /(^|\b)(todo|fixme|tbd|placeholder|待填|占位)\b/i;

const args = parseArgs(process.argv.slice(2));

if (args.help || args.h || (!args.dist && !args.url)) {
  console.log('用法：node validate-jsonld.mjs --dist <目录> | --url <页面URL> [--max-pages 200]');
  process.exit(args.help || args.h ? 0 : 1);
}

main().catch((err) => {
  console.error(`[jsonld-validate] 失败: ${err.message}`);
  process.exit(1);
});

async function main() {
  const pages = [];
  if (args.url) {
    pages.push({ label: String(args.url), html: await fetchHtml(String(args.url)) });
  } else {
    const distDir = resolve(String(args.dist));
    if (!existsSync(distDir)) throw new Error(`--dist 目录不存在: ${distDir}`);
    const maxPages = Number(args['max-pages'] || 200);
    const files = (await walkHtml(distDir, distDir)).slice(0, maxPages);
    for (const f of files) {
      pages.push({ label: f.rel, html: await readFile(f.abs, 'utf8') });
    }
  }

  let errorCount = 0;
  let warnCount = 0;
  let withJsonLd = 0;

  for (const p of pages) {
    const blocks = extractJsonLd(p.html);
    if (blocks.length === 0) continue;
    withJsonLd++;
    const nodes = [];
    const problems = [];

    blocks.forEach((b, bi) => {
      if (!b.valid) {
        problems.push({ level: 'error', msg: `第 ${bi + 1} 块 JSON 语法错误` });
        return;
      }
      if (b.data && typeof b.data === 'object' && !Array.isArray(b.data)) {
        if (b.data['@context'] && b.data['@context'] !== 'https://schema.org') {
          problems.push({ level: 'error', msg: `第 ${bi + 1} 块 @context 非法: ${String(b.data['@context'])}` });
        }
      }
      collectNodes(b.data, nodes);
    });

    for (const node of nodes) {
      problems.push(...validateNode(node));
    }

    const errors = problems.filter((x) => x.level === 'error');
    const warns = problems.filter((x) => x.level === 'warn');
    errorCount += errors.length;
    warnCount += warns.length;
    if (problems.length) {
      console.log(`\n${p.label}`);
      for (const e of errors) console.log(`  ✗ ${e.msg}`);
      for (const w of warns) console.log(`  ⚠ ${w.msg}`);
    }
  }

  console.log(`\n[jsonld-validate] 校验 ${pages.length} 个页面，${withJsonLd} 个含 JSON-LD：${errorCount} 错误，${warnCount} 警告`);
  if (errorCount > 0) process.exit(1);
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

async function fetchHtml(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: 'follow', headers: { 'user-agent': 'geo-jsonld-validator/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
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
      out.push({ abs: p, rel: relative(root, p).split('\\').join('/') });
    }
  }
  return out;
}

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    try {
      blocks.push({ valid: true, data: JSON.parse(raw) });
    } catch {
      blocks.push({ valid: false, data: raw });
    }
  }
  return blocks;
}

function collectNodes(data, out) {
  if (!data || typeof data !== 'object') return;
  if (Array.isArray(data)) {
    data.forEach((d) => collectNodes(d, out));
    return;
  }
  if (data['@type']) out.push(data);
  if (Array.isArray(data['@graph'])) data['@graph'].forEach((d) => collectNodes(d, out));
}

function typesOf(node) {
  const t = node['@type'];
  return Array.isArray(t) ? t : [t];
}

function validateNode(node) {
  const problems = [];
  const types = typesOf(node);
  const label = types.join('/');

  for (const t of types) {
    const required = REQUIRED_PROPS[t];
    if (!required) continue;
    for (const prop of required) {
      const v = node[prop];
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
        problems.push({ level: 'error', msg: `${label} 缺少必填属性 ${prop}` });
      }
    }
  }

  if (types.includes('BreadcrumbList')) {
    const items = node.itemListElement;
    if (Array.isArray(items)) {
      items.forEach((it, i) => {
        const n = it && typeof it === 'object' ? it : {};
        if (!n.name) problems.push({ level: 'error', msg: `BreadcrumbList 第 ${i + 1} 项缺少 name` });
        if (n.position === undefined) problems.push({ level: 'warn', msg: `BreadcrumbList 第 ${i + 1} 项缺少 position` });
      });
      if (items.length === 1) problems.push({ level: 'warn', msg: 'BreadcrumbList 仅 1 项（首页不需要面包屑）' });
    }
  }

  if (types.includes('FAQPage')) {
    const qs = node.mainEntity;
    if (Array.isArray(qs)) {
      if (qs.length < 2) problems.push({ level: 'warn', msg: 'FAQPage 少于 2 对 Q&A（Google 建议 ≥2）' });
      qs.forEach((q, i) => {
        if (!q || !q.name) problems.push({ level: 'error', msg: `FAQPage 第 ${i + 1} 个问题缺少 name` });
        if (!q.acceptedAnswer || !q.acceptedAnswer.text) {
          problems.push({ level: 'error', msg: `FAQPage 第 ${i + 1} 个问题缺少 acceptedAnswer.text` });
        }
      });
    }
  }

  if (types.some((t) => ARTICLE_TYPES.has(t))) {
    const headline = node.headline;
    if (typeof headline === 'string' && headline.length > 110) {
      problems.push({ level: 'error', msg: `${label} headline ${headline.length} 字符（上限 110）` });
    }
    const author = node.author;
    const authorIsRef = author && typeof author === 'object' && !Array.isArray(author) && author['@id'];
    if (!authorIsRef) {
      const authorName = Array.isArray(author) ? author[0]?.name : author?.name || (typeof author === 'string' ? author : null);
      if (!authorName) problems.push({ level: 'warn', msg: `${label} author 缺少 name` });
    }
  }

  if (types.includes('SoftwareApplication') && !node.offers && !node.aggregateRating) {
    problems.push({ level: 'warn', msg: 'SoftwareApplication 缺少 offers 或 aggregateRating（无富媒体资格）' });
  }

  scanPlaceholders(node, label, problems);
  return problems;
}

function scanPlaceholders(value, label, problems, path = '') {
  if (typeof value === 'string') {
    const at = path ? `${label}.${path}` : label;
    if (PLACEHOLDER_RE.test(value)) {
      problems.push({ level: 'error', msg: `${at} 含占位符: "${value.slice(0, 40)}"` });
    } else if (/example\.com/i.test(value) && /^(url|logo|image|item|@id)$/i.test(path.split('.').pop() || '')) {
      problems.push({ level: 'warn', msg: `${at} 疑似占位域名 example.com` });
    }
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('@')) continue;
      scanPlaceholders(v, label, problems, path ? `${path}.${k}` : k);
    }
  }
}
