import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText } from '../lib/http.mjs';
import { writeStats, now } from '../lib/report.mjs';

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

  const { ok, status, text } = await fetchText(project.llmsUrl);
  entry.checks.accessible = ok;
  entry.checks.httpStatus = status;

  if (!ok) {
    entry.error = `llms.txt 不可访问 (${status})`;
    results.push(entry);
    continue;
  }

  const lines = text.split('\n');
  const hasTitle = lines.some((l) => l.startsWith('# ') && l.trim().length > 2);
  const hasSummary = lines.some((l) => l.startsWith('>'));
  const hasLinks = lines.some((l) => /^\s*-\s*\[.+?\]\(https?:\/\//.test(l));

  entry.checks.titlePresent = hasTitle;
  entry.checks.summaryPresent = hasSummary;
  entry.checks.linksPresent = hasLinks;
  entry.checks.contentLength = text.length;

  results.push(entry);
}

const report = { timestamp: now(), measure: 'llms-txt', results };
const path = await writeStats('llms-txt-stats', report);
console.log(`[llms-txt] 检查完成，${results.length} 个项目，结果已写入 ${path}`);
console.log(JSON.stringify(results.map((r) => ({ id: r.projectId, ok: r.checks?.accessible, title: r.checks?.titlePresent, summary: r.checks?.summaryPresent })), null, 2));
