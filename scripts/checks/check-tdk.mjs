import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText } from '../lib/http.mjs';
import { extractTitle, extractMeta } from '../lib/html.mjs';
import { writeStats, now } from '../lib/report.mjs';

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);

const results = [];

for (const project of targets) {
  const entry = { projectId: project.id, projectName: project.name, domain: project.domain, checks: {} };
  const { ok, status, text } = await fetchText(project.domain);
  entry.checks.accessible = ok;
  entry.checks.httpStatus = status;

  if (!ok) {
    entry.error = `首页不可访问 (${status})`;
    results.push(entry);
    continue;
  }

  const title = extractTitle(text);
  const description = extractMeta(text, 'description');
  const keywords = extractMeta(text, 'keywords');

  entry.checks.title = title;
  entry.checks.titlePresent = !!title;
  entry.checks.description = description;
  entry.checks.descriptionPresent = !!description;
  entry.checks.keywords = keywords;
  entry.checks.keywordsPresent = !!keywords;

  results.push(entry);
}

const report = { timestamp: now(), measure: 'tdk', results };
const path = await writeStats('tdk-stats', report);
console.log(`[tdk] 检查完成，${results.length} 个项目，结果已写入 ${path}`);
console.log(JSON.stringify(results.map((r) => ({ id: r.projectId, title: r.checks?.titlePresent, desc: r.checks?.descriptionPresent, kw: r.checks?.keywordsPresent })), null, 2));
