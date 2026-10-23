import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText, isAbsoluteUrl } from '../lib/http.mjs';
import { extractAllLinks } from '../lib/html.mjs';
import { writeStats, now } from '../lib/report.mjs';

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);

const BAD_LINK_TEXT = ['点击这里', '点击这儿', '更多', '这里', '这儿', 'learn more', 'click here', 'read more', 'more', 'here'];

const results = [];

for (const project of targets) {
  const entry = { projectId: project.id, projectName: project.name, domain: project.domain, checks: {} };
  const { ok, status, text } = await fetchText(project.domain);
  entry.checks.accessible = ok;
  entry.checks.httpStatus = status;

  if (!ok) {
    entry.error = `页面不可访问 (${status})`;
    results.push(entry);
    continue;
  }

  const links = extractAllLinks(text);
  entry.checks.totalLinks = links.length;

  const badText = links.filter((l) => BAD_LINK_TEXT.includes(l.text.toLowerCase()));
  const jsHref = links.filter((l) => l.href && l.href.startsWith('javascript:'));
  const emptyHref = links.filter((l) => !l.href || l.href === '#' || l.href === '');
  const externalNoNoopener = links.filter(
    (l) => l.target === '_blank' && l.href && isAbsoluteUrl(l.href) && (!l.rel || !l.rel.includes('noopener'))
  );

  entry.checks.badLinkText = badText.length;
  entry.checks.javascriptHref = jsHref.length;
  entry.checks.emptyHref = emptyHref.length;
  entry.checks.externalNoNoopener = externalNoNoopener.length;
  entry.checks.sampleBadLinks = badText.slice(0, 10).map((l) => ({ text: l.text, href: l.href }));

  results.push(entry);
}

const report = { timestamp: now(), measure: 'a-tag-semantics', results };
const path = await writeStats('a-tag-stats', report);
console.log(`[a-tag] 检查完成，${results.length} 个项目，结果已写入 ${path}`);
console.log(JSON.stringify(results.map((r) => ({ id: r.projectId, total: r.checks?.totalLinks, bad: r.checks?.badLinkText, js: r.checks?.javascriptHref, empty: r.checks?.emptyHref })), null, 2));
