import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText } from '../lib/http.mjs';
import { parseRobots } from '../lib/robots.mjs';
import { writeStats, now } from '../lib/report.mjs';

const MAX_INDEX_CHARS = 100000;
const SAMPLE_LINKS = 3;

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

  const { ok, status, text, contentType } = await fetchText(project.llmsUrl);
  entry.checks.accessible = ok;
  entry.checks.httpStatus = status;
  entry.checks.contentType = contentType;

  if (!ok) {
    entry.error = `llms.txt 不可访问 (${status})`;
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

  entry.checks.titlePresent = h1Lines.length > 0;
  entry.checks.h1Unique = h1Lines.length === 1;
  entry.checks.summaryPresent = hasSummary;
  entry.checks.linksPresent = linkItems.length > 0;
  entry.checks.linkCount = linkItems.length;
  entry.checks.absoluteLinkCount = absoluteLinks.length;
  entry.checks.rootRelativeLinkCount = rootRelativeLinks.length;
  entry.checks.linkUrlResolvable = brokenReferenceLinks.length === 0;
  entry.checks.describedLinkCount = linkItems.filter((m) => (m[3] || '').trim().length > 0).length;
  entry.checks.contentLength = text.length;
  entry.checks.sizeWithinLimit = text.length <= MAX_INDEX_CHARS;
  entry.checks.contentTypeOk = /^text\/(plain|markdown)/i.test(contentType);

  const llmsFullUrl = project.llmsUrl.replace(/llms\.txt$/i, 'llms-full.txt');
  entry.checks.llmsFullUrl = llmsFullUrl;
  const full = await fetchText(llmsFullUrl);
  entry.checks.llmsFullAccessible = full.ok;

  if (project.domain) {
    const wellKnownUrl = `${project.domain.replace(/\/+$/, '')}/.well-known/llms.txt`;
    const wellKnown = await fetchText(wellKnownUrl);
    entry.checks.wellKnownUrl = wellKnownUrl;
    entry.checks.wellKnownAccessible = wellKnown.ok;
  }

  if (project.robotsUrl) {
    const robots = await fetchText(project.robotsUrl);
    if (robots.ok) {
      const parsed = parseRobots(robots.text);
      entry.checks.robotsLlmPolicyPresent = !!parsed.llmPolicy && /llms\.txt/i.test(parsed.llmPolicy);
      entry.checks.robotsLlmPolicy = parsed.llmPolicy;
    } else {
      entry.checks.robotsLlmPolicyPresent = false;
    }
  }

  const sampleTargets = linkItems
    .slice(0, SAMPLE_LINKS)
    .map((m) => ({ href: m[2], url: resolveUrl(m[2]) }))
    .filter((t) => t.url);
  const sampleResults = [];
  for (const t of sampleTargets) {
    const r = await fetchText(t.url);
    sampleResults.push({ url: t.url, ok: r.ok, status: r.status });
  }
  entry.checks.sampleLinksOk = sampleResults.length > 0 && sampleResults.every((r) => r.ok);
  entry.checks.sampleLinks = sampleResults;

  results.push(entry);
}

const report = { timestamp: now(), measure: 'llms-txt', results };
const path = await writeStats('llms-txt-stats', report);
console.log(`[llms-txt] 检查完成，${results.length} 个项目，结果已写入 ${path}`);
console.log(
  JSON.stringify(
    results.map((r) => ({
      id: r.projectId,
      ok: r.checks?.accessible,
      ct: r.checks?.contentTypeOk,
      title: r.checks?.titlePresent,
      h1: r.checks?.h1Unique,
      summary: r.checks?.summaryPresent,
      links: r.checks?.linksPresent,
      resolvable: r.checks?.linkUrlResolvable,
      size: r.checks?.sizeWithinLimit,
      full: r.checks?.llmsFullAccessible,
      robots: r.checks?.robotsLlmPolicyPresent,
      sample: r.checks?.sampleLinksOk,
    })),
    null,
    2
  )
);
