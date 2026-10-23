import { loadProjects } from '../lib/config.mjs';
import { fetchRepoIssues, fetchRepoPRs } from '../lib/gitcode.mjs';
import { writeStats, now } from '../lib/report.mjs';

const projects = await loadProjects();
const results = [];

for (const project of projects) {
  const entry = { projectId: project.id, projectName: project.name, repo: project.repo, issues: [], prs: [] };
  if (!project.repo) {
    entry.error = 'repo 未配置';
    results.push(entry);
    continue;
  }

  try {
    const issues = await fetchRepoIssues(project.repo, { state: 'all', perPage: 50 });
    entry.issues = issues.map((i) => ({
      number: i.number,
      title: i.title,
      state: i.state,
      url: i.html_url,
      createdAt: i.created_at,
    }));
  } catch (err) {
    entry.issueError = err.message;
  }

  try {
    const prs = await fetchRepoPRs(project.repo, { state: 'all', perPage: 50 });
    entry.prs = prs.map((p) => ({
      number: p.number,
      title: p.title,
      state: p.state,
      url: p.html_url,
      createdAt: p.created_at,
    }));
  } catch (err) {
    entry.prError = err.message;
  }

  entry.issueCount = entry.issues.length;
  entry.prCount = entry.prs.length;
  results.push(entry);
}

const report = { timestamp: now(), results };
const path = await writeStats('pr-summary', report);
console.log(`[pr-summary] 汇总完成，结果写入 ${path}`);
console.log(JSON.stringify(results.map((r) => ({ id: r.projectId, issues: r.issueCount, prs: r.prCount })), null, 2));
