import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText, isAbsoluteUrl } from '../lib/http.mjs';
import { parseSitemap } from '../lib/sitemap.mjs';
import { writeStats, now } from '../lib/report.mjs';

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);

const results = [];

for (const project of targets) {
  const entry = { projectId: project.id, projectName: project.name, sitemapUrl: project.sitemapUrl, checks: {} };
  if (!project.sitemapUrl) {
    entry.error = 'sitemapUrl 未配置';
    results.push(entry);
    continue;
  }

  const { ok, status, text } = await fetchText(project.sitemapUrl);
  entry.checks.accessible = ok;
  entry.checks.httpStatus = status;

  if (!ok) {
    entry.error = `sitemap 不可访问 (${status})`;
    results.push(entry);
    continue;
  }

  const { urls, sitemaps } = parseSitemap(text);
  entry.checks.urlCount = urls.length;
  entry.checks.sitemapIndexCount = sitemaps.length;

  const issues = [];
  let noLastmod = 0;
  let noChangefreq = 0;
  let noXhtmlLink = 0;
  let nonAbsoluteLoc = 0;
  const lastmodValues = new Set();

  for (const u of urls) {
    if (!u.loc || !isAbsoluteUrl(u.loc)) {
      nonAbsoluteLoc++;
      issues.push({ loc: u.loc, issue: 'loc 非绝对 URL' });
    }
    if (!u.lastmod) noLastmod++;
    else lastmodValues.add(u.lastmod);
    if (!u.changefreq) noChangefreq++;
    else if (u.changefreq === 'never') issues.push({ loc: u.loc, issue: 'changefreq=never' });
    if (!u.xhtmlLinks.length) noXhtmlLink++;
  }

  entry.checks.locNonAbsolute = nonAbsoluteLoc;
  entry.checks.lastmodMissing = noLastmod;
  entry.checks.changefreqMissing = noChangefreq;
  entry.checks.xhtmlLinkMissing = noXhtmlLink;
  entry.checks.lastmodAllSame = lastmodValues.size === 1 && urls.length > 1;
  entry.checks.sampleIssues = issues.slice(0, 20);

  results.push(entry);
}

const report = { timestamp: now(), measure: 'sitemap', results };
const path = await writeStats('sitemap-stats', report);
console.log(`[sitemap] 检查完成，${results.length} 个项目，结果已写入 ${path}`);
console.log(JSON.stringify(results.map((r) => ({ id: r.projectId, ok: r.checks?.accessible, urls: r.checks?.urlCount, issues: r.error || (r.checks?.sampleIssues?.length || 0) })), null, 2));
