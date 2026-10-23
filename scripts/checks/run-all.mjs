import { loadProjects } from '../lib/config.mjs';
import { writeStats, now } from '../lib/report.mjs';

const scripts = [
  { name: 'robots-txt', file: 'check-robots.mjs' },
  { name: 'llms-txt', file: 'check-llms-txt.mjs' },
  { name: 'sitemap', file: 'check-sitemap.mjs' },
  { name: 'json-ld', file: 'check-jsonld.mjs' },
  { name: 'tdk', file: 'check-tdk.mjs' },
  { name: 'a-tag-semantics', file: 'check-a-tag.mjs' },
  { name: 'tag-structure-semantics', file: 'check-tag-structure.mjs' },
  { name: 'image-alt', file: 'check-image-alt.mjs' },
];

const summary = { timestamp: now(), measures: [], totalProjects: 0 };

const projects = await loadProjects();
summary.totalProjects = projects.length;

for (const script of scripts) {
  process.stdout.write(`\n>>> 执行 ${script.name} ...\n`);
  try {
    await import(`./${script.file}`);
    summary.measures.push({ name: script.name, status: 'ok' });
  } catch (err) {
    summary.measures.push({ name: script.name, status: 'error', error: err.message });
    console.error(`[run-all] ${script.name} 执行失败:`, err.message);
  }
}

const path = await writeStats('run-all-summary', summary);
console.log(`\n=== 全部检查完成，汇总写入 ${path} ===`);
console.log(JSON.stringify(summary.measures, null, 2));
