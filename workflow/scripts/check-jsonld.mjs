import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText } from '../lib/http.mjs';
import { extractJsonLd } from '../lib/html.mjs';
import { writeStats, now } from '../lib/report.mjs';

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);

const P0_TYPES = ['Organization', 'BreadcrumbList', 'WebSite'];

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

  const blocks = extractJsonLd(text);
  entry.checks.jsonLdCount = blocks.length;
  entry.checks.invalidCount = blocks.filter((b) => !b.valid).length;

  const types = new Set();
  for (const b of blocks) {
    if (!b.valid) continue;
    const data = b.data;
    if (Array.isArray(data)) {
      data.forEach((d) => collectTypes(d, types));
    } else {
      collectTypes(data, types);
    }
  }
  entry.checks.schemaTypes = [...types];
  entry.checks.p0Missing = P0_TYPES.filter((t) => !types.has(t));

  results.push(entry);
}

function collectTypes(data, set) {
  if (!data || typeof data !== 'object') return;
  if (data['@type']) {
    if (Array.isArray(data['@type'])) data['@type'].forEach((t) => set.add(t));
    else set.add(data['@type']);
  }
  if (data['@graph'] && Array.isArray(data['@graph'])) {
    data['@graph'].forEach((d) => collectTypes(d, set));
  }
}

const report = { timestamp: now(), measure: 'json-ld', results };
const path = await writeStats('jsonld-stats', report);
console.log(`[json-ld] 检查完成，${results.length} 个项目，结果已写入 ${path}`);
console.log(JSON.stringify(results.map((r) => ({ id: r.projectId, count: r.checks?.jsonLdCount, p0Missing: r.checks?.p0Missing })), null, 2));
