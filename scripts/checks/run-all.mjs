import { loadProjects } from '../lib/config.mjs';
import { writeStats, now } from '../lib/report.mjs';

// 重成本的全量抓取检查（TDK 重复 + JSON-LD 合并脚本 check-tdk-jsonld.mjs）不进 run-all，按需单独跑或走周一 Action
const scripts = [
  { name: 'robots-txt', file: 'check-robots.mjs' },
  { name: 'llms-txt', file: 'check-llms-txt.mjs' },
  { name: 'sitemap', file: 'check-sitemap.mjs' },
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
