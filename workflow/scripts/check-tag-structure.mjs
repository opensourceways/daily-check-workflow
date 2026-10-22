import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText } from '../lib/http.mjs';
import { countHeadings, extractSemanticTags } from '../lib/html.mjs';
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
    entry.error = `页面不可访问 (${status})`;
    results.push(entry);
    continue;
  }

  const headings = countHeadings(text);
  const semantic = extractSemanticTags(text);
  const divCount = (text.match(/<div[^>]*>/gi) || []).length;

  entry.checks.headings = headings;
  entry.checks.h1Count = headings.h1 || 0;
  entry.checks.h1Unique = (headings.h1 || 0) === 1;
  entry.checks.semanticTags = semantic;
  entry.checks.divCount = divCount;
  entry.checks.semanticRatio = divCount > 0
    ? Object.values(semantic).reduce((a, b) => a + b, 0) / (divCount + Object.values(semantic).reduce((a, b) => a + b, 0))
    : 0;

  results.push(entry);
}

const report = { timestamp: now(), measure: 'tag-structure-semantics', results };
const path = await writeStats('tag-structure-stats', report);
console.log(`[tag-structure] 检查完成，${results.length} 个项目，结果已写入 ${path}`);
console.log(JSON.stringify(results.map((r) => ({ id: r.projectId, h1: r.checks?.h1Count, h1ok: r.checks?.h1Unique, divs: r.checks?.divCount, ratio: r.checks?.semanticRatio?.toFixed(2) })), null, 2));
