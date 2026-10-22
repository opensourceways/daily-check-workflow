import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjects, filterProjects } from '../lib/config.mjs';
import { writeStats, now } from '../lib/report.mjs';
import { hasToken, parseOwnerRepo, findIssuesByTitlePrefix, createIssue } from '../lib/atomgit.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

const CHANGEFREQ_VALID = new Set(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']);
const W3C_DATETIME_RE = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/;
const MAX_CHILD_SITEMAPS = 50;
const LOC_SAMPLE_SIZE = 8;
const CAP = { hard: 3000, missing: 2000, mismatch: 1000 };

// 提 issue 模式：扫描每个项目前先查目标 AtomGit 仓库是否已有本维度未关闭 issue（标题前缀匹配），
// 有则整个"扫描+提 issue"流程跳过该项目；发现问题时生成简短/完全两份 md 报告，
// issue 正文用简短版并附指向本仓库完全版报告的链接。前缀变更会使旧 issue 查重失效造成重复提单。
const ISSUE_TITLE_PREFIX = '[GEO Sitemap]';
const submitIssues = process.argv.includes('--submit-issues');
const dryRun = process.argv.includes('--dry-run');

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;
// MindSpore-docs 配置的 sitemapUrl 当前 404（robots.txt 声明的是 sitemap-docs-index.xml，地址待修正），默认跳过；--skip= 传空可覆盖
const DEFAULT_SKIP = ['mindspore-docs'];
const skipArg = process.argv.find((a) => a.startsWith('--skip='));
const SKIPS = skipArg ? skipArg.split('=')[1].split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : DEFAULT_SKIP;

async function getText(url, timeout = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'geo-workflow-checker/1.0' },
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text, lastModified: res.headers.get('last-modified') };
  } catch (e) {
    return { ok: false, status: null, text: '', error: e.message };
  } finally {
    clearTimeout(timer);
  }
}

function extractTag(block, tag) {
  const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i').exec(block);
  return m ? m[1].trim() : null;
}

function parseXml(text) {
  const isIndex = /<sitemapindex[\s>]/i.test(text);
  const urls = [];
  const sitemaps = [];
  let m;
  const urlRe = /<url[\s>][\s\S]*?<\/url>/gi;
  while ((m = urlRe.exec(text)) !== null) {
    const block = m[0];
    const links = [];
    const linkRe = /<xhtml:link([^>]*?)\/?>/gi;
    let lm;
    while ((lm = linkRe.exec(block)) !== null) {
      const attrs = {};
      const attrRe = /([\w:-]+)\s*=\s*["']([^"']*)["']/g;
      let am;
      while ((am = attrRe.exec(lm[1])) !== null) attrs[am[1].toLowerCase()] = am[2];
      links.push(attrs);
    }
    urls.push({
      loc: extractTag(block, 'loc'),
      lastmod: extractTag(block, 'lastmod'),
      changefreq: extractTag(block, 'changefreq'),
      xhtmlLinks: links,
    });
  }
  const smRe = /<sitemap[\s>][\s\S]*?<\/sitemap>/gi;
  while ((m = smRe.exec(text)) !== null) {
    sitemaps.push({ loc: extractTag(m[0], 'loc'), lastmod: extractTag(m[0], 'lastmod') });
  }
  return { isIndex, urls, sitemaps };
}

async function mapLimit(items, limit, fn) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

function sampleArray(arr, n) {
  if (arr.length <= n) return [...arr];
  const out = [];
  const step = arr.length / n;
  for (let i = 0; i < n; i++) out.push(arr[Math.floor(i * step)]);
  return out;
}

function makeCat(cap) {
  return { count: 0, items: [], cap };
}

function addCat(cat, loc, note) {
  cat.count++;
  if (cat.items.length < cat.cap) {
    cat.items.push({ loc: loc ? String(loc).slice(0, 200) : '(无 loc)', note: note || '' });
  }
}

const MINDSPORE_ARTICLE_TYPES = ['news', 'technology-blogs', 'activities', 'version-updates'];

function normPath(loc) {
  try {
    const n = new URL(loc).pathname.replace(/\/+$/, '');
    return n || '/';
  } catch {
    return null;
  }
}

function langAlternates(loc, mode) {
  const p = normPath(loc);
  if (!p) return [];
  if (mode === 'mindspore') {
    const segs = p.split('/').filter(Boolean);
    const first = segs[0];
    if (MINDSPORE_ARTICLE_TYPES.includes(first)) {
      const rest = segs.slice(1);
      if (rest.length === 0) return [`/${first}/en`];
      if (rest[0] === 'en') return [rest.length > 1 ? `/${first}/${rest.slice(1).join('/')}` : `/${first}`];
      return [`/${first}/en/${rest.join('/')}`];
    }
    if (segs.length && segs[segs.length - 1] === 'en') return ['/' + segs.slice(0, -1).join('/')];
    return [p === '/' ? '/en' : `${p}/en`];
  }
  const segs = p.split('/').filter(Boolean);
  if (segs[0] === 'zh') return ['/' + ['en', ...segs.slice(1)].join('/')];
  if (segs[0] === 'en') return ['/' + ['zh', ...segs.slice(1)].join('/')];
  return [`/zh${p === '/' ? '' : p}`, `/en${p === '/' ? '' : p}`];
}

async function checkProject(project) {
  const r = {
    id: project.id,
    name: project.name,
    sitemapUrl: project.sitemapUrl,
    repo: project.repo,
    accessible: false,
    status: null,
    isIndex: false,
    childCount: 0,
    childErrors: [],
    urlCount: 0,
    errors: [],
    warns: [],
    infos: [],
    stats: null,
    locSamples: [],
    cats: {},
  };
  const C = (key) => {
    if (!r.cats[key]) r.cats[key] = makeCat(CAP[CAT_TITLES[key][1]]);
    return r.cats[key];
  };
  if (!project.sitemapUrl) {
    r.errors.push({ type: 'sitemap', msg: 'sitemapUrl 未配置' });
    return r;
  }

  const legalHosts = new Set();
  for (const u of [project.sitemapUrl, project.sitemapAliasUrl, project.domain, project.domainAlias]) {
    if (!u) continue;
    try {
      legalHosts.add(new URL(u).host);
    } catch {}
  }
  r.legalHosts = [...legalHosts];
  r.newVersions = Array.isArray(project.newVersions) && project.newVersions.length ? project.newVersions : null;
  const root = await getText(project.sitemapUrl);
  r.status = root.status;
  if (!root.ok) {
    r.errors.push({ type: 'sitemap', msg: root.status ? `sitemap 不可访问（HTTP ${root.status}）` : `sitemap 请求失败：${root.error}` });
    return r;
  }
  r.accessible = true;

  const parsed = parseXml(root.text);
  r.isIndex = parsed.isIndex;
  parsed.urls.forEach((x) => (x.src = project.sitemapUrl));
  let allUrls = parsed.urls;

  if (parsed.isIndex) {
    r.childCount = parsed.sitemaps.length;
    let childList = parsed.sitemaps;
    if (Array.isArray(project.newVersions) && project.newVersions.length) {
      const expected = new Set(project.newVersions.map((v) => (v === '/' || v === '' ? '/sitemap.xml' : `${v.replace(/\/+$/, '')}/sitemap.xml`)));
      childList = parsed.sitemaps.filter((s) => {
        try {
          return expected.has(new URL(s.loc).pathname);
        } catch {
          return false;
        }
      });
      const found = new Set(childList.map((s) => new URL(s.loc).pathname));
      const missing = [...expected].filter((p) => !found.has(p));
      if (missing.length) r.warns.push({ type: 'sitemap', msg: `newVersions 声明的版本在 index 中未找到对应子 sitemap：${missing.join('、')}`, dedup: 'sitemap|newver-missing' });
      r.infos.push({ type: 'sitemap', msg: `按 newVersions 仅检查 ${childList.length}/${parsed.sitemaps.length} 个子 sitemap，其余历史版本不在本轮检查范围`, dedup: 'sitemap|newver-filtered' });
    }
    if (childList.length > MAX_CHILD_SITEMAPS) {
      r.infos.push({ type: 'sitemap', msg: `子 sitemap 共 ${childList.length} 个，仅检查前 ${MAX_CHILD_SITEMAPS} 个` });
    }
    const children = childList.slice(0, MAX_CHILD_SITEMAPS);
    const childResults = await mapLimit(children, 5, async (s) => {
      if (!s.loc || !/^https?:\/\//i.test(s.loc)) return { s, kind: 'bad-loc' };
      const res = await getText(s.loc);
      if (!res.ok) return { s, kind: 'unreachable', status: res.status ?? res.error };
      return { s, kind: 'ok', text: res.text };
    });
    for (const cr of childResults) {
      if (cr.kind === 'bad-loc') r.childErrors.push(`子 sitemap loc 非绝对 URL：${cr.s.loc}`);
      else if (cr.kind === 'unreachable') r.childErrors.push(`子 sitemap 不可访问（${cr.status}）：${cr.s.loc}`);
      else {
        const child = parseXml(cr.text);
        child.urls.forEach((x) => (x.src = cr.s.loc));
        allUrls = allUrls.concat(child.urls);
      }
    }
    const childHosts = new Map();
    for (const s of childList) {
      if (!s.loc || !/^https?:\/\//i.test(s.loc)) continue;
      try {
        const h = new URL(s.loc).host;
        if (!legalHosts.has(h)) childHosts.set(h, (childHosts.get(h) || 0) + 1);
      } catch {}
    }
    if (childHosts.size) {
      r.warns.push({
        type: 'sitemap',
        msg: `index 中 ${[...childHosts.entries()].map(([h, n]) => `${n} 个子 sitemap 位于 ${h}`).join('、')}，不在项目合法域名清单（${[...legalHosts].join(', ')}）内，需核实`,
        dedup: 'sitemap|childhost',
      });
    }
    if (r.childErrors.length) r.errors.push({ type: 'sitemap', msg: r.childErrors.join('；') });
  }

  r.urlCount = allUrls.length;
  if (!allUrls.length) {
    r.errors.push({ type: 'sitemap', msg: '未解析到任何 <url> 条目' });
    return r;
  }

  const lastmodSet = new Set();
  const changefreqValues = new Set();
  const hreflangSet = new Set();
  const mismatchHosts = new Map();
  let xhtmlMissing = 0;
  let multilingualPages = 0;
  let xhtmlOk = 0;
  let singleLangPages = 0;
  const langMode = project.langMode || (/mindspore/i.test(project.id) ? 'mindspore' : 'zh-en-prefix');
  r.langMode = langMode;
  const allPaths = new Set(allUrls.map((x) => normPath(x.loc)).filter(Boolean));

  for (const u of allUrls) {
    const loc = u.loc;
    let host = null;
    if (!loc) {
      addCat(C('locMissing'), loc, 'loc 缺失（必选属性）');
      r.errors.push({ type: 'loc', msg: '存在 loc 缺失的 url 条目', dedup: 'loc|missing' });
    } else if (!/^https?:\/\//i.test(loc)) {
      addCat(C('locNonAbsolute'), loc, `非绝对 URL，值：${loc}`);
      r.errors.push({ type: 'loc', msg: `loc 非绝对 URL（示例：${String(loc).slice(0, 120)}）`, dedup: 'loc|nonabsolute' });
    } else {
      try {
        host = new URL(loc).host;
        if (!legalHosts.has(host)) {
          if (!mismatchHosts.has(host)) mismatchHosts.set(host, 0);
          mismatchHosts.set(host, mismatchHosts.get(host) + 1);
          addCat(C('locHostMismatch'), loc, `loc 主机 ${host} 不在合法域名清单（${[...legalHosts].join(', ')}）内`);
        }
      } catch {
        addCat(C('locNonAbsolute'), loc, `无法解析为 URL，值：${loc}`);
        r.errors.push({ type: 'loc', msg: `loc 无法解析（示例：${String(loc).slice(0, 120)}）`, dedup: 'loc|unparse' });
      }
    }

    if (u.lastmod) {
      lastmodSet.add(u.lastmod);
      if (!W3C_DATETIME_RE.test(u.lastmod)) {
        addCat(C('lastmodBadFormat'), loc, `非 W3C 日期时间格式，值：${u.lastmod}`);
        r.errors.push({ type: 'lastmod', msg: `lastmod 非 W3C 格式（示例：${u.lastmod}）`, dedup: 'lastmod|format' });
      } else {
        const d = new Date(u.lastmod.includes('T') ? u.lastmod : u.lastmod);
        if (!Number.isNaN(d.getTime()) && d.getTime() > Date.now() + 24 * 3600 * 1000) {
          addCat(C('lastmodFuture'), loc, `未来时间，值：${u.lastmod}`);
          r.errors.push({ type: 'lastmod', msg: `lastmod 为未来时间（示例：${u.lastmod}）`, dedup: 'lastmod|future' });
        }
      }
    } else {
      addCat(C('lastmodMissing'), loc, 'lastmod 缺失');
    }

    if (u.changefreq) {
      const cf = u.changefreq.toLowerCase();
      changefreqValues.add(u.changefreq);
      if (!CHANGEFREQ_VALID.has(cf)) {
        addCat(C('changefreqInvalid'), loc, `非法值：${u.changefreq}`);
        r.errors.push({ type: 'changefreq', msg: `changefreq 非法值（示例：${u.changefreq}）`, dedup: 'changefreq|invalid' });
      }
      if (cf === 'never') {
        addCat(C('changefreqNever'), loc, 'changefreq=never');
        r.warns.push({ type: 'changefreq', msg: '存在 changefreq=never（仅归档 URL 应使用）', dedup: 'changefreq|never' });
      }
    } else {
      addCat(C('changefreqMissing'), loc, 'changefreq 缺失');
    }

    const alternates = u.xhtmlLinks.filter((a) => a.rel === 'alternate' && a.hreflang && a.href);
    const badLinks = u.xhtmlLinks.filter((a) => !(a.rel === 'alternate' && a.hreflang && a.href));
    if (badLinks.length) {
      addCat(C('xhtmlBadAttr'), loc, `xhtml:link 属性不完整（缺 rel/hreflang/href），共 ${badLinks.length} 个`);
      r.errors.push({ type: 'xhtml:link', msg: `xhtml:link 属性不完整（示例 loc：${String(loc).slice(0, 120)}）`, dedup: 'xhtml|attr' });
    }
    for (const a of alternates) hreflangSet.add(a.hreflang);
    const selfPath = normPath(loc);
    const existingAlts = selfPath ? langAlternates(loc, langMode).filter((a) => allPaths.has(a)) : [];
    if (!existingAlts.length) {
      singleLangPages++;
    } else {
      multilingualPages++;
      const have = new Set(alternates.map((a) => normPath(a.href)).filter(Boolean));
      const missing = [selfPath, ...existingAlts].filter((x) => x && !have.has(x));
      if (missing.length) {
        xhtmlMissing++;
        const srcNote = r.isIndex && u.src ? `（来源：${u.src}）` : '';
        addCat(
          C('xhtmlLinkMissing'),
          loc,
          (have.size
            ? `已声明部分 alternate，缺少语言版本路径：${missing.join('、')}`
            : `按 ${langMode} 规则在页面全集中存在其他语言版本（${existingAlts.join('、')}），但未声明任何 xhtml:link alternate`) + srcNote
        );
      } else {
        xhtmlOk++;
      }
    }
  }

  const lastmodAllSame = lastmodSet.size === 1 && allUrls.length > 1 ? [...lastmodSet][0] : null;
  r.stats = {
    locMissing: r.cats.locMissing?.count || 0,
    locNonAbsolute: r.cats.locNonAbsolute?.count || 0,
    locHostMismatch: r.cats.locHostMismatch?.count || 0,
    lastmodMissing: r.cats.lastmodMissing?.count || 0,
    lastmodDistinct: lastmodSet.size,
    lastmodAllSame,
    changefreqMissing: r.cats.changefreqMissing?.count || 0,
    changefreqValues: [...changefreqValues],
    xhtmlMissing,
    multilingualPages,
    xhtmlOk,
    singleLangPages,
    langMode,
    hreflangs: [...hreflangSet],
    mismatchHosts: [...mismatchHosts.entries()],
  };

  if (lastmodAllSame) {
    let msg = `所有页面 lastmod 相同（${lastmodAllSame}），疑似构建时间而非页面真实更新时间`;
    if (root.lastModified) {
      const hm = new Date(root.lastModified);
      const om = new Date(lastmodAllSame);
      if (!Number.isNaN(hm.getTime()) && !Number.isNaN(om.getTime()) && hm.toDateString() === om.toDateString()) {
        msg += `，且与 sitemap 响应头 Last-Modified（${root.lastModified}）同日`;
      }
    }
    r.warns.push({ type: 'lastmod', msg, dedup: 'lastmod|allsame' });
  }
  if (r.cats.locHostMismatch?.count) {
    const ratio = r.cats.locHostMismatch.count / allUrls.length;
    r.warns.push({
      type: 'loc',
      msg: `${r.cats.locHostMismatch.count}/${allUrls.length}（${Math.round(ratio * 100)}%）条 loc 主机不在合法域名清单内：${r.stats.mismatchHosts.map(([h, n]) => `${h}(${n})`).join('、')}${ratio > 0.9 ? '，疑似 921 事故类域名配置错误，需优先核实' : ''}`,
      dedup: 'loc|hostmismatch',
    });
  }
  if (xhtmlMissing > 0) {
    r.warns.push({ type: 'xhtml:link', msg: `经页面全集核实：${xhtmlMissing}/${multilingualPages} 个页面确实存在其他语言版本，但 xhtml:link alternate 缺失或不完整`, dedup: 'xhtml|partial' });
  }
  r.infos.push({ type: 'xhtml:link', msg: `语言规则（${langMode}）+ sitemap 全集核实：多语言页面 ${multilingualPages} 个（声明完整 ${xhtmlOk} 个），未发现其他语言版本的单语言页面 ${singleLangPages} 个（其 xhtml:link 缺失不计为问题）`, dedup: 'xhtml|verified' });

  const sampleUrls = sampleArray(allUrls.filter((u) => u.loc && /^https?:\/\//i.test(u.loc)), LOC_SAMPLE_SIZE);
  r.locSamples = await mapLimit(sampleUrls, 4, async (u) => {
    const res = await getText(u.loc, 20000);
    return { loc: u.loc, status: res.status ?? res.error, ok: res.ok };
  });
  const bad = r.locSamples.filter((s) => !s.ok);
  if (bad.length) {
    r.warns.push({ type: 'loc', msg: `抽样 ${r.locSamples.length} 个 loc，${bad.length} 个不可访问：${bad.map((s) => `${s.loc}(${s.status})`).join('；')}`, dedup: 'loc|sample-bad' });
  }

  return r;
}

function dedupe(list) {
  const seen = new Map();
  for (const item of list) {
    const key = item.dedup || item.msg;
    if (!seen.has(key)) seen.set(key, item);
  }
  return [...seen.values()];
}

function verdict(r) {
  if (r.skipped) return '⏭️ 跳过';
  if (!r.accessible) return '❌ 不可访问';
  if (r.errors.length) return '❌ 不符合';
  if (r.warns.length) return '⚠️ 有告警';
  return '✅ 符合';
}

const CAT_TITLES = {
  locMissing: ['loc 缺失（必选属性，错误）', 'hard'],
  locNonAbsolute: ['loc 非绝对 URL / 无法解析（错误）', 'hard'],
  locHostMismatch: ['loc 主机不在项目合法域名清单内（告警）', 'mismatch'],
  lastmodMissing: ['lastmod 缺失（可选属性，缺失清单）', 'missing'],
  lastmodBadFormat: ['lastmod 非 W3C 日期时间格式（错误）', 'hard'],
  lastmodFuture: ['lastmod 为未来时间（错误）', 'hard'],
  changefreqMissing: ['changefreq 缺失（可选属性，缺失清单）', 'missing'],
  changefreqInvalid: ['changefreq 非法值（不在 always/hourly/daily/weekly/monthly/yearly/never 内，错误）', 'hard'],
  changefreqNever: ['changefreq=never（告警，仅归档 URL 应使用）', 'missing'],
  xhtmlLinkMissing: ['xhtml:link 缺失/不完整（经页面全集核实确实存在其他语言版本）', 'missing'],
  xhtmlBadAttr: ['xhtml:link 属性不完整（缺 rel/hreflang/href，错误）', 'hard'],
};

function renderCatTable(key, cat) {
  const lines = [];
  lines.push(`**${CAT_TITLES[key][0]}** — 共 ${cat.count} 条${cat.count > cat.items.length ? `（下表仅列前 ${cat.items.length} 条，超出上限 ${cat.cap}）` : ''}`);
  lines.push('');
  lines.push('| # | loc | 说明 |');
  lines.push('| --- | --- | --- |');
  cat.items.forEach((it, i) => {
    lines.push(`| ${i + 1} | ${it.loc} | ${it.note} |`);
  });
  lines.push('');
  return lines;
}

// 单项目在明细/完全版中的段落（含全部分类表格）
function projectDetailLines(r) {
  const lines = [];
  if (r.skipped) {
    lines.push('- 本轮跳过，不检查');
    return lines;
  }
  if (!r.accessible) {
    lines.push(`- ${dedupe(r.errors).map((e) => e.msg).join('；') || '不可访问'}`);
    return lines;
  }
  lines.push(`- sitemap：${r.sitemapUrl}，URL 总数 ${r.urlCount}`);
  const catEntries = Object.entries(r.cats || {});
  if (!catEntries.length) {
    lines.push('- 无任何缺失/不符合条目');
    return lines;
  }
  lines.push(`- 问题分类统计：`);
  lines.push('');
  lines.push('| 分类 | 条数 | 占全部 URL 比例 |');
  lines.push('| --- | --- | --- |');
  for (const [key, cat] of catEntries) lines.push(`| ${CAT_TITLES[key][0]} | ${cat.count} | ${Math.round((cat.count / r.urlCount) * 100)}% |`);
  lines.push('');
  for (const [key, cat] of catEntries) lines.push(...renderCatTable(key, cat));
  return lines;
}

// 提 issue / 触发扫描结论的条件：存在硬性错误（含不可访问）或告警；仅可选属性"缺失"不触发
function hasAnyIssue(r) {
  if (r.skipped) return false;
  return dedupe(r.errors).length > 0 || dedupe(r.warns).length > 0;
}

// 简短版：单项目总览 + 错误/告警要点 + 每类最多 5 个示例条目
function briefLines(r) {
  const lines = [];
  lines.push(`- sitemap：${r.sitemapUrl}`);
  lines.push(`- 可访问：${r.accessible ? `是（HTTP ${r.status}），类型：${r.isIndex ? 'sitemap index' : 'urlset'}，解析到 ${r.urlCount} 个 <url>${r.isIndex ? `（子 sitemap ${r.childCount} 个${r.childErrors.length ? `，${r.childErrors.length} 个异常` : '，全部可访问'}）` : ''}` : `否（${r.status ?? '-'}）`}`);
  if (r.legalHosts?.length > 1) lines.push(`- 合法域名清单：${r.legalHosts.join('、')}`);
  if (r.newVersions) lines.push(`- newVersions（仅检查匹配版本的子 sitemap）：${r.newVersions.join('、')}`);
  if (r.locSamples?.length) {
    const ok = r.locSamples.filter((x) => x.ok).length;
    lines.push(`- loc 抽样访问：${ok}/${r.locSamples.length} 可访问${ok < r.locSamples.length ? `；失败：${r.locSamples.filter((x) => !x.ok).map((x) => `${x.loc} → ${x.status}`).join('；')}` : ''}`);
  }
  lines.push('');
  for (const e of dedupe(r.errors)) lines.push(`- ❌ [${e.type}] ${e.msg}`);
  for (const w of dedupe(r.warns)) lines.push(`- ⚠️ [${w.type}] ${w.msg}`);
  const catEntries = Object.entries(r.cats || {});
  if (catEntries.length) {
    lines.push('');
    lines.push('**分类条目数**：');
    lines.push('');
    for (const [key, cat] of catEntries) {
      lines.push(`- ${CAT_TITLES[key][0]}：${cat.count} 条（${Math.round((cat.count / r.urlCount) * 100)}%）`);
      for (const it of sampleArray(cat.items, 5)) lines.push(`  - ${it.loc}${it.note ? ` —— ${it.note}` : ''}`);
      if (cat.count > 5) lines.push(`  - …其余 ${cat.count - 5} 条见完全版报告`);
    }
  }
  return lines;
}

function issueTitleFor(r) {
  const e = dedupe(r.errors).length;
  const w = dedupe(r.warns).length;
  return `${ISSUE_TITLE_PREFIX} ${r.name}（${r.id}）：sitemap 属性规范问题（错误 ${e} 类 / 告警 ${w} 类）`;
}

function issueBodyFor(r, fullFileName, startedAt) {
  const ghRepo = process.env.GITHUB_REPOSITORY || 'opensourceways/daily-check-workflow';
  const refName = process.env.GITHUB_REF_NAME || 'archive';
  const fullUrl = `https://github.com/${ghRepo}/blob/${refName}/scheduled-reports/sitemap/${startedAt.slice(0, 10)}/${fullFileName}`;
  const lines = [];
  lines.push(`本 issue 由 GEO 例行检查（sitemap 属性规范维度）自动生成。以下为对项目 sitemap（含 index 递归子 sitemap）按 sitemaps.org 规范核查 loc / lastmod / changefreq / xhtml:link 得出的问题（${startedAt.slice(0, 10)}）。`);
  lines.push('');
  lines.push(`**项目**：${r.name}（${r.id}）`);
  lines.push('');
  lines.push(...briefLines(r));
  lines.push('');
  lines.push('### 完全版报告');
  lines.push('');
  lines.push('简短版每类仅列最多 5 个示例，全部条目见检查仓库内的完全版报告：');
  lines.push('');
  lines.push(`> [${fullFileName}](${fullUrl})`);
  lines.push('');
  lines.push('### 处理说明');
  lines.push('');
  lines.push('- loc 类：修正 sitemap 生成配置，使全部 loc 为本项目合法域名的绝对 URL（index 中的子 sitemap 地址同样要求）');
  lines.push('- lastmod 类：lastmod 应为页面真实最后修改时间而非构建时间；无法准确获取时建议省略该属性（可选）');
  lines.push('- changefreq 类：取值须在 `always/hourly/daily/weekly/monthly/yearly/never` 枚举内；`never` 仅用于已归档页面');
  lines.push('- xhtml:link 类：存在其他语言版本的页面需用 `<xhtml:link rel="alternate" hreflang="" href=""/>` 列出每个语言版本（包括自身）；单语言页面无需声明');
  lines.push('- 修复 PR 合并且 issue 关闭后，下一轮定时检查会重新扫描该项目；issue 未关闭期间不会重复创建，也不会重复扫描');
  lines.push('- 若认为某条属预期（误报），请在 issue 评论说明，维护者会关闭本 issue');
  lines.push('');
  lines.push('<sub>由 daily-check-workflow sitemap 规范检查（sitemap-spec-check）自动生成。</sub>');
  return lines.join('\n');
}

// 扫描前查重：目标 AtomGit 仓库已有本维度未关闭 issue 则跳过整个"扫描+提 issue"流程。
// 查询失败时：有 token（生产环境）为防重复提单直接跳过扫描；无 token（本地试跑）继续扫描但跳过提单。
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
    return { block: true, canSubmit: false, notes: [`已存在未关闭的 sitemap 规范 issue（#${existing[0].number}：${urls}），跳过本次扫描与提单`] };
  }
  if (!hasToken()) {
    return { block: false, canSubmit: false, notes: ['未设置 ATOMGIT_TOKEN，本次查重通过但不提单'] };
  }
  return { block: false, canSubmit: true, notes: [] };
}

function skippedEntry(project, notes) {
  return {
    id: project.id,
    name: project.name,
    sitemapUrl: project.sitemapUrl,
    repo: project.repo,
    skipped: true,
    accessible: false,
    errors: [],
    warns: [],
    infos: notes.map((n) => ({ type: 'sitemap', msg: n, dedup: n })),
    cats: {},
  };
}

async function checkProjectSafe(project) {
  console.log(`[sitemap-spec] 检查 ${project.id} ...`);
  try {
    return await checkProject(project);
  } catch (e) {
    return { id: project.id, name: project.name, sitemapUrl: project.sitemapUrl, repo: project.repo, accessible: false, errors: [{ type: 'sitemap', msg: `检查异常：${e.message}` }], warns: [], infos: [], cats: {} };
  }
}

async function main() {
  const projects = await loadProjects();
  const targets = filterProjects(projects, siteId);
  const startedAt = now();
  const dateStr = startedAt.slice(0, 10);
  const reportName = 'report.md';
  const detailName = 'detail.md';
  const dir = resolve(ROOT, 'scheduled-reports', 'sitemap', dateStr);
  await mkdir(dir, { recursive: true });

  const results = [];
  for (const project of targets) {
    if (SKIPS.includes(project.id.toLowerCase())) {
      console.log(`[sitemap-spec] 跳过 ${project.id}`);
      results.push(skippedEntry(project, ['默认跳过（MindSpore-docs 配置的 sitemapUrl 当前 404，真实地址待修正；用 --skip= 传空可强制检查）']));
      continue;
    }
    if (!submitIssues) {
      results.push(await checkProjectSafe(project));
      continue;
    }
    const pre = await precheckExistingIssue(project);
    pre.notes.forEach((n) => console.log(`[sitemap-spec] ${project.id}: ${n}`));
    if (pre.block) {
      results.push(skippedEntry(project, pre.notes));
      continue;
    }
    console.log(`\n[sitemap-spec] ===== ${project.id} =====`);
    const entry = await checkProjectSafe(project);
    if (hasAnyIssue(entry)) {
      const fullFileName = `${entry.id}-full.md`;
      const briefFileName = `${entry.id}-brief.md`;
      if (!dryRun) {
        const header = [`# Sitemap 属性规范完全版报告 · ${entry.name}（${entry.id}）`, '', `- 检查时间：${startedAt}`, `- 检查项：loc / lastmod / changefreq / xhtml:link（规范来源：sitemaps.org，见 measures/03-sitemap/规范.md）`, ''];
        await writeFile(resolve(dir, fullFileName), header.concat(projectDetailLines(entry)).join('\n') + '\n', 'utf8');
        const bheader = [`# Sitemap 属性规范简短报告 · ${entry.name}（${entry.id}）`, '', `- 检查时间：${startedAt}`, ''];
        await writeFile(resolve(dir, briefFileName), bheader.concat(briefLines(entry)).join('\n') + '\n', 'utf8');
        entry.reports = { full: `scheduled-reports/sitemap/${dateStr}/${fullFileName}`, brief: `scheduled-reports/sitemap/${dateStr}/${briefFileName}` };
      }
      const body = issueBodyFor(entry, fullFileName, startedAt);
      const title = issueTitleFor(entry);
      const target = parseOwnerRepo(project.repo);
      if (dryRun || !target || !pre.canSubmit) {
        console.log(`\n[sitemap-spec] ${project.id} ${dryRun ? '[dry-run] ' : ''}将提交 issue：${title}`);
        console.log(body);
        entry.issueAction = 'dry-run';
      } else {
        const created = await createIssue({ ...target, title, body });
        const url = created?.html_url || `https://atomgit.com/${target.owner}/${target.repo}/issues/${created?.number}`;
        console.log(`[sitemap-spec] ${project.id}: ✨ 已创建 issue：${url}`);
        entry.issueAction = 'created';
        entry.issueUrl = url;
      }
    } else {
      console.log(`[sitemap-spec] ${project.id}: 未发现错误/告警，不提 issue`);
    }
    results.push(entry);
  }

  const statsPath = await writeStats('sitemap-spec-stats', { timestamp: startedAt, measure: 'sitemap-spec', results });

  // ---- 汇总报告 ----
  const lines = [];
  lines.push('# Sitemap 属性规范检查报告');
  lines.push('');
  lines.push(`- 检查时间：${startedAt}`);
  lines.push(`- 检查范围：projects.config.json 中 ${targets.length - results.filter((r) => r.skipped).length} 个项目（跳过：${results.filter((r) => r.skipped).map((r) => r.id).join(', ') || '无'}）`);
  lines.push(`- 运行模式：${submitIssues ? `提 issue（--submit-issues${dryRun ? '，dry-run' : ''}）` : '常规检查'}`);
  lines.push(`- 规范来源：archive/SEO标准及覆盖情况.md（sitemaps.org），measures/03-sitemap/规范.md`);
  lines.push(`- 检查项：loc（必选，绝对 URL、可访问）、lastmod（W3C 格式、非构建时间）、changefreq（有效枚举值、避免 never）、xhtml:link（多语言 alternate 完整性）`);
  lines.push(`- 特殊约定：配置了 newVersions 的项目仅检查 index 中匹配 newVersions 的子 sitemap；domainAlias/sitemapAliasUrl 中的域名视为合法 loc 域名（openEuler 的 openatom.cn 不再计为主机不一致问题）`);
  lines.push(`- xhtml:link 核实规则：仅当该页面按语言路径规则在 sitemap URL 全集中确实存在其他语言版本时，缺失/不完整才计为问题；规则——默认（zh-en-prefix）/zh/xxx ↔ /en/xxx、无前缀页 ↔ /zh、/en 两版本；MindSpore：/path ↔ /path/en，文章类（news/technology-blogs/activities/version-updates）/type/id ↔ /type/en/id`);
  lines.push(`- 机器可读结果：workflow/stats/sitemap-spec-stats.json`);
  if (!submitIssues) lines.push(`- 完整缺失/不符合条目清单见：[${detailName}](./${detailName})`);
  lines.push('');
  lines.push('## 总览');
  lines.push('');
  lines.push('| 项目 | sitemap 地址 | 可访问 | 类型 | URL 数 | loc 问题 | lastmod 缺失 | changefreq 缺失 | xhtml:link 问题(核实后) | 结论 |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const r of results) {
    if (r.skipped) {
      lines.push(`| ${r.name}（${r.id}） | ${r.sitemapUrl || '-'} | ⏭️ | - | - | - | - | - | - | ⏭️ 跳过 |`);
      continue;
    }
    const s = r.stats;
    const errLoc = s ? s.locMissing + s.locNonAbsolute + s.locHostMismatch : '-';
    lines.push(
      `| ${r.name}（${r.id}） | ${r.sitemapUrl || '-'} | ${r.accessible ? `✅ (${r.status})` : `❌ (${r.status ?? '-'})`} | ${r.isIndex ? `index(${r.childCount})` : 'urlset'} | ${r.urlCount} | ${s ? errLoc : '-'} | ${s ? `${s.lastmodMissing} (${Math.round((s.lastmodMissing / r.urlCount) * 100)}%)` : '-'} | ${s ? `${s.changefreqMissing} (${Math.round((s.changefreqMissing / r.urlCount) * 100)}%)` : '-'} | ${s ? `${s.xhtmlMissing}/${s.multilingualPages}` : '-'} | ${verdict(r)}${r.issueUrl ? `，[issue](${r.issueUrl})` : ''} |`
    );
  }
  lines.push('');
  lines.push('## 各项目明细');
  if (submitIssues) {
    lines.push('');
    lines.push(`（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录 \`<项目ID>-full.md\`）`);
    for (const r of results.filter((x) => hasAnyIssue(x))) {
      lines.push(`- ${r.name}（${r.id}）：\`${r.id}-full.md\`${r.issueUrl ? `，issue：${r.issueUrl}` : r.issueAction === 'dry-run' ? '，（dry-run 未提交）' : ''}`);
    }
  } else {
    for (const r of results) {
      lines.push('');
      lines.push(`### ${r.name}（${r.id}） — ${verdict(r)}`);
      lines.push('');
      if (r.skipped) {
        for (const i of r.infos || []) lines.push(`- ${i.msg}`);
        continue;
      }
      lines.push(`- sitemap：${r.sitemapUrl || '未配置'}`);
      if (r.legalHosts?.length > 1) lines.push(`- 合法域名清单（domain/domainAlias/sitemapUrl/sitemapAliasUrl）：${r.legalHosts.join('、')}`);
      if (r.newVersions) lines.push(`- newVersions（本轮仅检查匹配这些版本的子 sitemap）：${r.newVersions.join('、')}`);
      if (r.accessible) {
        lines.push(`- 可访问：是（HTTP ${r.status}），类型：${r.isIndex ? 'sitemap index' : 'urlset'}，解析到 ${r.urlCount} 个 <url>${r.isIndex ? `（子 sitemap ${r.childCount} 个${r.childErrors.length ? `，其中不可访问/异常 ${r.childErrors.length} 个` : '，全部可访问'}）` : ''}`);
      }
      const errors = dedupe(r.errors);
      const warns = dedupe(r.warns);
      const infos = dedupe(r.infos || []);
      if (r.stats) {
        lines.push(`- lastmod：缺失 ${r.stats.lastmodMissing}/${r.urlCount}；去重值 ${r.stats.lastmodDistinct} 个${r.stats.lastmodAllSame ? `；**所有页面同一个值：${r.stats.lastmodAllSame}**` : ''}`);
        lines.push(`- changefreq：缺失 ${r.stats.changefreqMissing}/${r.urlCount}；出现的值：${r.stats.changefreqValues.join(', ') || '(无)'}`);
        lines.push(`- xhtml:link：核实规则 ${r.stats.langMode}${r.stats.hreflangs.length ? `（已声明 hreflang：${r.stats.hreflangs.join(', ')}）` : ''}：多语言页面 ${r.stats.multilingualPages} 个，其中缺失/不完整 ${r.stats.xhtmlMissing} 个、声明完整 ${r.stats.xhtmlOk} 个；单语言页面 ${r.stats.singleLangPages} 个（不计为问题）`);
      }
      if (r.locSamples?.length) {
        const ok = r.locSamples.filter((x) => x.ok).length;
        lines.push(`- loc 抽样访问：${ok}/${r.locSamples.length} 可访问${ok < r.locSamples.length ? `；失败：${r.locSamples.filter((x) => !x.ok).map((x) => `${x.loc} → ${x.status}`).join('；')}` : ''}`);
      }
      if (errors.length) {
        lines.push(`- ❌ 错误：`);
        for (const e of errors) lines.push(`  - [${e.type}] ${e.msg}`);
      }
      if (warns.length) {
        lines.push(`- ⚠️ 告警：`);
        for (const w of warns) lines.push(`  - [${w.type}] ${w.msg}`);
      }
      if (infos.length) {
        lines.push(`- ℹ️ 说明：`);
        for (const i of infos) lines.push(`  - [${i.type}] ${i.msg}`);
      }
      const cats = Object.entries(r.cats || {});
      if (cats.length) {
        lines.push(`- 条目清单（完整见 [${detailName}](./${detailName})）：`);
        for (const [key, cat] of cats) {
          lines.push(`  - ${CAT_TITLES[key][0]}：${cat.count} 条`);
        }
      }
    }
  }
  lines.push('');
  lines.push('## 结论与建议');
  lines.push('');
  const bad = results.filter((r) => !r.skipped && (!r.accessible || r.errors.length));
  const warn = results.filter((r) => !r.skipped && r.accessible && !r.errors.length && r.warns.length);
  if (bad.length) lines.push(`- 不符合规范/不可访问：${bad.map((r) => r.id).join('、')}，需优先处理。`);
  if (warn.length) lines.push(`- 存在告警：${warn.map((r) => r.id).join('、')}，主要是 lastmod 疑似构建时间、xhtml:link 缺失或 changefreq=never、loc 域名不一致等，按 measures/03-sitemap/规范.md 关键要求第 2/3/4 条评估整改。`);
  if (!bad.length && !warn.length) lines.push('- 全部项目 sitemap 属性符合规范。');
  lines.push('');
  lines.push('> 注：xhtml:link 为条件性必选——仅当页面存在其他语言版本时必须声明（以 sitemap 全集核实）；lastmod "非构建时间"通过全量同值 + 与响应头 Last-Modified 对比启发式判断。各分类的完整/截断条目清单见明细文件或各项目完全版。');

  await writeFile(resolve(dir, reportName), lines.join('\n'), 'utf8');

  // ---- 明细文件（仅常规模式；提 issue 模式按去重规则不重复输出明细） ----
  if (!submitIssues) {
    const d = [];
    d.push(`# Sitemap 缺失/不符合规范条目明细`);
    d.push('');
    d.push(`- 配套汇总报告：[${reportName}](./${reportName})`);
    d.push(`- 规范来源：archive/SEO标准及覆盖情况.md（sitemaps.org）`);
    d.push(`- 说明：lastmod/changefreq/xhtml:link 为 sitemaps.org 可选属性，其"缺失"不代表硬性违规，是否整改按 measures/03-sitemap/规范.md 关键要求评估；loc 缺失/非绝对 URL、lastmod 格式错误、changefreq 非法值等为硬性不符合。单类清单超过上限时按表内标注截断。`);
    for (const r of results) {
      d.push('');
      d.push(`## ${r.name}（${r.id}） — ${verdict(r)}`);
      d.push('');
      d.push(...projectDetailLines(r));
    }
    await writeFile(resolve(dir, detailName), d.join('\n'), 'utf8');
  }

  console.log(`[sitemap-spec] 检查完成：stats -> ${statsPath}`);
  console.log(`[sitemap-spec] 汇总报告 -> ${resolve(dir, reportName)}`);
  if (!submitIssues) console.log(`[sitemap-spec] 明细 -> ${resolve(dir, detailName)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
