import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText, probeTotalSize } from '../lib/http.mjs';
import { parseRobots } from '../lib/robots.mjs';
import { writeStats, now } from '../lib/report.mjs';

const MAX_INDEX_CHARS = 100000;
const SAMPLE_LINKS = 3;
const DESC_COVERAGE_BASELINE = 0.8; // P1 基线:≥80% 链接带描述
const MAX_LINKS_PER_SECTION = 20; // 推荐值:每节 5–20 条
const LLMS_FULL_ANALYZE_BYTES = 2 * 1024 * 1024; // llms-full 结构分析只读前 2MB
const MAX_DESC_CHARS = 300; // 描述 300 字符截断约定

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);

const results = [];

for (const project of targets) {
  const entry = { projectId: project.id, projectName: project.name, llmsUrl: project.llmsUrl, checks: {} };
  if (!project.llmsUrl) {
    entry.error = 'llmsUrl 未配置';
    results.push(entry);
    continue;
  }

  const { ok, status, text, contentType, headers } = await fetchText(project.llmsUrl, {
    timeout: 30000,
    maxBytes: 12 * 1024 * 1024,
  });
  entry.checks.accessible = ok;
  entry.checks.httpStatus = status;
  entry.checks.contentType = contentType;

  if (!ok) {
    entry.error = `llms.txt 不可访问 (${status}${text === '' ? '' : ''})`;
    if (status === 0) entry.error = `llms.txt 请求失败 (${contentType || '网络错误'})`;
    results.push(entry);
    continue;
  }

  const lines = text.split('\n');
  const h1Lines = lines.filter((l) => /^#\s+\S/.test(l));
  const hasSummary = lines.some((l) => /^>\s?\S/.test(l));
  const linkItems = [...text.matchAll(/^\s*-\s*\[([^\]]*)\]\(([^)]+)\)(?:\s*:\s*(.*))?$/gm)];
  const siteOrigin = project.domain ? project.domain.replace(/\/+$/, '') : '';
  const resolveUrl = (u) => {
    if (/^https?:\/\//i.test(u)) return u;
    if (siteOrigin && u.startsWith('/')) return `${siteOrigin}${u}`;
    return null;
  };
  const absoluteLinks = linkItems.filter((m) => /^https?:\/\//i.test(m[2]));
  const rootRelativeLinks = linkItems.filter((m) => m[2].startsWith('/'));
  const brokenReferenceLinks = linkItems.filter((m) => !resolveUrl(m[2]));
  const describedLinks = linkItems.filter((m) => (m[3] || '').trim().length > 0);

  // ---- 基础结构 ----
  entry.checks.titlePresent = h1Lines.length > 0;
  entry.checks.h1Unique = h1Lines.length === 1;
  entry.checks.summaryPresent = hasSummary;
  entry.checks.linksPresent = linkItems.length > 0;
  entry.checks.linkCount = linkItems.length;
  entry.checks.absoluteLinkCount = absoluteLinks.length;
  entry.checks.rootRelativeLinkCount = rootRelativeLinks.length;
  entry.checks.linkUrlResolvable = brokenReferenceLinks.length === 0;
  entry.checks.contentLength = text.length;
  entry.checks.sizeWithinLimit = text.length <= MAX_INDEX_CHARS;
  entry.checks.contentTypeOk = /^text\/(plain|markdown)/i.test(contentType);

  // ---- 链接描述覆盖率(P1 基线 ≥80%) ----
  entry.checks.describedLinkCount = describedLinks.length;
  entry.checks.descCoverage = linkItems.length === 0 ? 0 : +(describedLinks.length / linkItems.length).toFixed(4);
  entry.checks.descCoverageOk = entry.checks.descCoverage >= DESC_COVERAGE_BASELINE;
  entry.checks.linksEmptyColon = linkItems.filter((m) => m[3] !== undefined && (m[3] || '').trim() === '').length;
  entry.checks.linksUntitled = linkItems.filter((m) => !m[1].trim()).length;
  entry.checks.descOver300Count = describedLinks.filter((m) => m[3].trim().length > MAX_DESC_CHARS).length;

  // ---- 分节与单节链接数(推荐每节 5–20 条) ----
  const sectionLinkDist = {};
  let current = '_头部';
  for (const l of lines) {
    if (/^##\s+\S/.test(l)) current = l.replace(/^##\s+/, '').trim();
    if (/^\s*-\s*\[/.test(l)) sectionLinkDist[current] = (sectionLinkDist[current] || 0) + 1;
  }
  entry.checks.sectionLinkDist = sectionLinkDist;
  entry.checks.sectionCount = Object.keys(sectionLinkDist).filter((k) => k !== '_头部').length;
  entry.checks.sectionsOverLimit = Object.entries(sectionLinkDist)
    .filter(([, n]) => n > MAX_LINKS_PER_SECTION)
    .map(([name, n]) => `${name}(${n})`);
  entry.checks.hasOptionalSection = Object.keys(sectionLinkDist).some((k) => /^optional$/i.test(k));

  // ---- HTTP 发现头 ----
  entry.checks.linkHeader = headers.link || null;
  entry.checks.linkHeaderDescribedBy = !!headers.link && /rel=["']?describedby/i.test(headers.link);
  entry.checks.xLlmsTxtHeader = headers['x-llms-txt'] || null;

  // ---- llms-full.txt:体积探测 + 截断抓取 + 结构分析 ----
  const llmsFullUrl = project.llmsUrl.replace(/llms\.txt$/i, 'llms-full.txt');
  entry.checks.llmsFullUrl = llmsFullUrl;
  entry.checks.llmsFullTotalBytes = await probeTotalSize(llmsFullUrl, { timeout: 20000 });
  const full = await fetchText(llmsFullUrl, { timeout: 45000, maxBytes: LLMS_FULL_ANALYZE_BYTES });
  entry.checks.llmsFullAccessible = full.ok;
  entry.checks.llmsFullStatus = full.status;
  entry.checks.llmsFullContentType = full.contentType || null;
  entry.checks.llmsFullAnalyzedChars = full.text.length;
  entry.checks.llmsFullTruncated = full.truncated;
  if (full.ok) {
    entry.checks.llmsFull = analyzeLlmsFull(full.text, h1Lines[0]?.replace(/^#\s+/, ''));
  }

  // ---- .well-known 别名(200 但返回 HTML 视为伪别名) ----
  if (project.domain) {
    const wellKnownUrl = `${project.domain.replace(/\/+$/, '')}/.well-known/llms.txt`;
    const wellKnown = await fetchText(wellKnownUrl, { timeout: 20000, maxBytes: 2048 });
    entry.checks.wellKnownUrl = wellKnownUrl;
    entry.checks.wellKnownStatus = wellKnown.status;
    entry.checks.wellKnownContentType = wellKnown.contentType || null;
    entry.checks.wellKnownAccessible = wellKnown.ok;
    entry.checks.wellKnownOk = wellKnown.ok && /^text\/(plain|markdown)/i.test(wellKnown.contentType || '');
    entry.checks.wellKnownBrokenAlias = wellKnown.ok && /text\/html/i.test(wellKnown.contentType || '');
  }

  // ---- robots.txt LLM-Policy 联动 ----
  if (project.robotsUrl) {
    const robots = await fetchText(project.robotsUrl, { timeout: 20000, maxBytes: 256 * 1024 });
    if (robots.ok) {
      const parsed = parseRobots(robots.text);
      entry.checks.robotsLlmPolicyPresent = !!parsed.llmPolicy && /llms\.txt/i.test(parsed.llmPolicy);
      entry.checks.robotsLlmPolicy = parsed.llmPolicy;
    } else {
      entry.checks.robotsLlmPolicyPresent = false;
    }
  }

  // ---- 抽样链接可达 ----
  const sampleTargets = linkItems
    .slice(0, SAMPLE_LINKS)
    .map((m) => ({ href: m[2], url: resolveUrl(m[2]) }))
    .filter((t) => t.url);
  const sampleResults = [];
  for (const t of sampleTargets) {
    const r = await fetchText(t.url, { timeout: 30000, maxBytes: 512 * 1024 });
    sampleResults.push({ url: t.url, ok: r.ok, status: r.status });
  }
  entry.checks.sampleLinksOk = sampleResults.length > 0 && sampleResults.every((r) => r.ok);
  entry.checks.sampleLinks = sampleResults;

  results.push(entry);
}

/**
 * llms-full.txt 结构分析(基于截断文本):
 * - 文件头:首个 `---` 分隔线之前应有 H1 + Summary blockquote
 * - 头部一致性:与 llms.txt 的 H1 对比
 * - Source URL 格式:source-line / bare-url / url-yaml(相对) / url-blockquote / none
 */
function analyzeLlmsFull(text, llmsH1) {
  const lines = text.split('\n');
  const firstSep = lines.findIndex((l) => /^-{3,}\s*$/.test(l));
  const headRegion = firstSep === -1 ? lines.slice(0, 30) : lines.slice(0, firstSep);
  const h1 = headRegion.find((l) => /^#\s+\S/.test(l))?.replace(/^#\s+/, '').trim() || null;
  const headSummary = headRegion.some((l) => /^>\s?\S/.test(l));

  const count = (re) => lines.filter((l) => re.test(l)).length;
  const formats = {
    'source-line': count(/^(Source|来源)\s*[:：]\s*https?:\/\//i),
    'bare-url': count(/^https?:\/\/\S+\s*$/),
    'url-yaml': count(/^url:\s*\S+/i),
    'url-blockquote': count(/^>\s*URL\s*[:：]/i),
  };
  const dominant = Object.entries(formats).sort((a, b) => b[1] - a[1])[0];
  const sourceFormat = dominant[1] > 0 ? dominant[0] : 'none';
  const absoluteFormats = new Set(['source-line', 'bare-url']);

  return {
    headOk: !!h1 && headSummary,
    h1,
    headSummary,
    headMatchesLlms:
      !!llmsH1 &&
      !!h1 &&
      (h1 === llmsH1 || llmsH1.startsWith(h1) || h1.startsWith(llmsH1)),
    separatorCount: lines.filter((l) => /^-{3,}\s*$/.test(l)).length,
    sourceFormat,
    sourceFormatCounts: formats,
    sourceUrlAbsolute: absoluteFormats.has(sourceFormat),
    approxPages: lines.filter((l) => /^-{3,}\s*$/.test(l)).length,
  };
}

const report = { timestamp: now(), measure: 'llms-txt', results };
const path = await writeStats('llms-txt-stats', report);
console.log(`[llms-txt] 检查完成，${results.length} 个项目，结果已写入 ${path}`);
console.log(
  JSON.stringify(
    results.map((r) => {
      const c = r.checks || {};
      return {
        id: r.projectId,
        ok: c.accessible,
        ct: c.contentTypeOk,
        h1: c.h1Unique,
        sum: c.summaryPresent,
        links: c.linkCount,
        desc: typeof c.descCoverage === 'number' ? `${(c.descCoverage * 100).toFixed(1)}%` : '-',
        descOk: c.descCoverageOk,
        size: c.sizeWithinLimit,
        sectionsOver: c.sectionsOverLimit?.length || 0,
        full: c.llmsFullAccessible,
        fullHead: c.llmsFull?.headOk,
        fullSrc: c.llmsFull?.sourceFormat,
        wellKnown: c.wellKnownOk === true ? 'ok' : c.wellKnownBrokenAlias ? 'broken(html)' : c.wellKnownStatus,
        linkHdr: c.linkHeaderDescribedBy,
        robots: c.robotsLlmPolicyPresent,
        sample: c.sampleLinksOk,
      };
    }),
    null,
    2
  )
);
