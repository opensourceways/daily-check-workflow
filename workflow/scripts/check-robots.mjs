import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText } from '../lib/http.mjs';
import { parseRobots } from '../lib/robots.mjs';
import { writeStats, now } from '../lib/report.mjs';

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);

const results = [];

for (const project of targets) {
  const entry = { projectId: project.id, projectName: project.name, robotsUrl: project.robotsUrl, checks: {} };
  if (!project.robotsUrl) {
    entry.error = 'robotsUrl 未配置';
    results.push(entry);
    continue;
  }

  const { ok, status, text } = await fetchText(project.robotsUrl);
  entry.checks.accessible = ok;
  entry.checks.httpStatus = status;

  if (!ok) {
    entry.error = `robots.txt 不可访问 (${status})`;
    results.push(entry);
    continue;
  }

  const parsed = parseRobots(text);
  entry.checks.userAgentPresent = parsed.userAgents.length > 0;
  entry.checks.hasAllowOrDisallow = parsed.allow.length > 0 || parsed.disallow.length > 0;
  entry.checks.sitemapPresent = parsed.sitemap.length > 0;
  entry.checks.contentSignal = parsed.contentSignal;
  entry.checks.contentSignalPresent = !!parsed.contentSignal;
  entry.checks.llmPolicy = parsed.llmPolicy;
  entry.checks.llmPolicyPresent = !!parsed.llmPolicy;
  entry.checks.raw = parsed.raw;

  results.push(entry);
}

const report = { timestamp: now(), measure: 'robots-txt', results };
const path = await writeStats('robots-stats', report);
console.log(`[robots] 检查完成，${results.length} 个项目，结果已写入 ${path}`);
console.log(JSON.stringify(results.map((r) => ({ id: r.projectId, ok: r.checks?.accessible, cs: r.checks?.contentSignalPresent, llm: r.checks?.llmPolicyPresent })), null, 2));
