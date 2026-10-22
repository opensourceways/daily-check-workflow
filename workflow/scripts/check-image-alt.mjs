import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText } from '../lib/http.mjs';
import { extractAllImages } from '../lib/html.mjs';
import { writeStats, now } from '../lib/report.mjs';

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);

const BAD_ALT = ['图片', 'image', 'photo', 'img', '截图', 'screenshot', '未命名', 'untitled'];

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

  const imgs = extractAllImages(text);
  entry.checks.totalImages = imgs.length;
  entry.checks.altMissing = imgs.filter((i) => !i.hasAlt).length;
  entry.checks.altEmpty = imgs.filter((i) => i.hasAlt && i.alt === '').length;
  entry.checks.badAlt = imgs.filter((i) => i.hasAlt && i.alt && BAD_ALT.includes(i.alt.toLowerCase())).length;
  entry.checks.altMissingRate = imgs.length > 0 ? entry.checks.altMissing / imgs.length : 0;
  entry.checks.sampleMissingAlt = imgs.filter((i) => !i.hasAlt).slice(0, 10).map((i) => i.src);

  results.push(entry);
}

const report = { timestamp: now(), measure: 'image-alt', results };
const path = await writeStats('image-alt-stats', report);
console.log(`[image-alt] 检查完成，${results.length} 个项目，结果已写入 ${path}`);
console.log(JSON.stringify(results.map((r) => ({ id: r.projectId, total: r.checks?.totalImages, missing: r.checks?.altMissing, rate: (r.checks?.altMissingRate * 100).toFixed(0) + '%' })), null, 2));
