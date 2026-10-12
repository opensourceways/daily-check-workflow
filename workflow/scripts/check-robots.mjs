import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText, isAbsoluteUrl } from '../lib/http.mjs';
import {
  parseRobots,
  isSitewideBlocked,
  pathFormatIssues,
  diffContentSignal,
} from '../lib/robots.mjs';
import { writeStats, now } from '../lib/report.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const RULES_PATH = resolve(ROOT, 'config', 'check-rules.json');
const rules = JSON.parse(await readFile(RULES_PATH, 'utf8'));
const ROBOTS_RULES = rules.robots || {};
const EXPECTED_CS = ROBOTS_RULES.contentSignalExpected || { 'ai-train': 'yes', search: 'yes', 'ai-input': 'yes' };
const EXPECTED_CS_TEXT = Object.entries(EXPECTED_CS).map(([k, v]) => `${k}=${v}`).join(', ');
const LINK_MAX_BYTES = 64 * 1024;

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);

async function checkLink(url, robotsHost) {
  const link = { url, absolute: isAbsoluteUrl(url) };
  if (!link.absolute) {
    link.accessible = false;
    link.error = '非绝对 URL';
    return link;
  }
  const { ok, status } = await fetchText(url, { maxBytes: LINK_MAX_BYTES });
  link.accessible = ok;
  link.status = status;
  if (robotsHost && new URL(url).host !== robotsHost) link.crossHost = true;
  return link;
}

async function checkOneRobots(url) {
  const entry = { robotsUrl: url };
  const { ok, status, text } = await fetchText(url);
  entry.accessible = ok;
  entry.httpStatus = status;
  if (!ok) {
    entry.error = `robots.txt 不可访问 (${status})`;
    return entry;
  }

  const parsed = parseRobots(text);
  const host = new URL(url).host;
  entry.userAgentPresent = parsed.userAgents.length > 0;
  entry.userAgents = parsed.userAgents;
  entry.allowValues = parsed.allow;
  entry.disallowValues = parsed.disallow;
  entry.hasAllowOrDisallow = parsed.allow.length > 0 || parsed.disallow.length > 0;
  entry.pathFormatIssues = pathFormatIssues(parsed);
  entry.sitewideBlocked = isSitewideBlocked(parsed);

  entry.sitemapPresent = parsed.sitemap.length > 0;
  entry.sitemapLinks = [];
  for (const s of parsed.sitemap) entry.sitemapLinks.push(await checkLink(s, host));

  entry.contentSignal = parsed.contentSignal;
  entry.contentSignalPresent = !!parsed.contentSignal;
  entry.contentSignalIssues = parsed.contentSignal ? diffContentSignal(parsed.contentSignal, EXPECTED_CS) : [];

  entry.llmPolicy = parsed.llmPolicy;
  entry.llmPolicyPresent = !!parsed.llmPolicy;
  if (parsed.llmPolicy) {
    entry.llmPolicyLinks = [await checkLink(parsed.llmPolicy, host)];
    const path = (() => {
      try {
        return new URL(parsed.llmPolicy).pathname;
      } catch {
        return '';
      }
    })();
    entry.llmPolicyPointsToLlmsTxt = /\/llms[^/]*$/i.test(path);
  } else {
    entry.llmPolicyLinks = [];
    entry.llmPolicyPointsToLlmsTxt = false;
  }

  entry.crossDomainRefs = [
    ...entry.sitemapLinks,
    ...entry.llmPolicyLinks,
  ].filter((l) => l.crossHost);

  entry.raw = parsed.raw;
  return entry;
}

function collectErrors(c) {
  const errs = [];
  if (!c.userAgentPresent) errs.push('缺 User-agent');
  if (!c.hasAllowOrDisallow) errs.push('allow/disallow 均缺失');
  if (!c.sitemapPresent) errs.push('缺 sitemap 声明');
  if (!c.contentSignalPresent) errs.push('缺 Content-Signal');
  else if (c.contentSignalIssues.length) errs.push(`Content-Signal 取值不符：${c.contentSignalIssues.join('; ')}`);
  if (!c.llmPolicyPresent) errs.push('缺 LLM-Policy');
  else if (!c.llmPolicyPointsToLlmsTxt) errs.push('LLM-Policy 未指向 llms.txt');
  if (c.sitewideBlocked) errs.push('禁止整站');
  if (c.pathFormatIssues.length) errs.push(`路径不以 / 开头：${c.pathFormatIssues.join(', ')}`);
  const broken = [...c.sitemapLinks, ...c.llmPolicyLinks].filter((l) => !l.accessible);
  if (broken.length) errs.push(`引用链接不可访问：${broken.map((l) => `${l.url}(${l.status ?? l.error})`).join(', ')}`);
  return errs;
}

const results = [];

for (const project of targets) {
  const entry = { projectId: project.id, projectName: project.name, robotsUrl: project.robotsUrl, checks: {} };
  if (!project.robotsUrl) {
    entry.error = 'robotsUrl 未配置';
    entry.verdict = '❌';
    entry.hardErrors = ['robotsUrl 未配置'];
    entry.warnings = [];
    results.push(entry);
    continue;
  }

  const main = await checkOneRobots(project.robotsUrl);
  entry.checks = main;
  if (main.error) {
    entry.error = main.error;
    entry.verdict = '❌';
    entry.hardErrors = [main.error];
    entry.warnings = [];
    results.push(entry);
    continue;
  }

  if (project.robotsAliasUrl) {
    const alias = await checkOneRobots(project.robotsAliasUrl);
    entry.alias = alias;
    if (!alias.accessible) {
      entry.aliasConsistent = false;
    } else {
      entry.aliasConsistent = main.raw.join('\n') === alias.raw.join('\n');
    }
  } else {
    entry.alias = null;
    entry.aliasConsistent = null;
  }

  const hardErrors = collectErrors(main);
  if (entry.alias && !entry.alias.accessible) hardErrors.push(`alias robots.txt 不可访问 (${entry.alias.httpStatus})`);
  if (entry.alias && entry.alias.accessible) hardErrors.push(...collectErrors(entry.alias).map((m) => `alias 域：${m}`));

  const warnings = [];
  if (entry.alias && entry.aliasConsistent === false) warnings.push('主域与 alias 域 robots.txt 内容不一致');
  if (main.crossDomainRefs.length) warnings.push(`主域跨域引用：${main.crossDomainRefs.map((l) => l.url).join(', ')}`);
  entry.hardErrors = hardErrors;
  entry.warnings = warnings;
  entry.verdict = hardErrors.length ? '❌' : warnings.length ? '⚠️' : '✅';
  results.push(entry);
}

const report = { timestamp: now(), measure: 'robots-txt', results };
const statsPath = await writeStats('robots-stats', report);

// ---- Markdown 报告 ----

function fmtLink(l) {
  const state = l.accessible ? `✅ (${l.status})` : `❌ (${l.status ?? l.error})`;
  return `${l.url} → ${state}${l.crossHost ? '（跨域引用）' : ''}`;
}
function fmtLinkCell(links) {
  if (!links.length) return '-';
  const ok = links.filter((l) => l.accessible).length;
  const cross = links.filter((l) => l.crossHost).length;
  return `${ok}/${links.length} 可访问${cross ? `，${cross} 条跨域` : ''}`;
}

const dateStr = new Date().toISOString().slice(0, 10);
const reportName = `${dateStr}-robots-规范检查报告.md`;

const lines = [];
lines.push('# robots.txt 规范检查报告');
lines.push('');
lines.push(`- 检查时间：${new Date().toISOString()}`);
lines.push(`- 检查范围：projects.config.json 中 ${results.length} 个项目；配置了 robotsAliasUrl 的项目额外检查主域/alias 一致性（当前：${results.filter((r) => r.alias).map((r) => r.projectId).join('、') || '无'}）`);
lines.push('- 规范来源：archive/SEO标准及覆盖情况.md（robots.txt 字段表），measures/01-robots-txt/规范.md');
lines.push(`- 检查项：User-agent（必选）、allow/disallow（至少其一、路径以 / 开头）、sitemap（必选，含链接可访问性）、Content-Signal（必选，规范值 ${EXPECTED_CS_TEXT}，期望值配置于 workflow/config/check-rules.json）、LLM-Policy（必选，指向 llms.txt 且可访问）、禁整站判定、主域/alias 内容一致性、跨域引用告警`);
lines.push('- 特殊约定：Sitemap/LLM-Policy 的 host 与 robots.txt 所在 host 不一致时计告警（跨主机 Sitemap 声明可能不被搜索引擎识别），不计硬性错误；"引用目录须以 / 结尾"的目录语义判定不在脚本范围，见 measures/01-robots-txt/检测方式.md');
lines.push('');
lines.push('## 总览');
lines.push('');
lines.push('| 项目 | robots 地址（主域） | 主域可访问 | alias 可访问 | 主/alias 一致 | User-agent | allow∨disallow | 路径格式 | 禁整站 | Sitemap 链接 | Content-Signal | LLM-Policy 链接 | 结论 |');
lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const r of results) {
  const c = r.checks;
  if (!c.accessible) {
    lines.push(
      `| ${r.projectName}（${r.projectId}） | ${r.robotsUrl || '未配置'} | ${r.robotsUrl ? `❌ (${c.httpStatus ?? '-'})` : '⏭️ 无独立 robots.txt'} | - | - | - | - | - | - | - | - | - | ${r.verdict} |`
    );
    continue;
  }
  const aliasOk = r.alias ? (r.alias.accessible ? `✅ (${r.alias.httpStatus})` : `❌ (${r.alias.httpStatus})`) : '-';
  const consistent = r.aliasConsistent === null ? '-' : r.aliasConsistent ? '✅' : '⚠️';
  const cs = c.contentSignalPresent ? (c.contentSignalIssues.length ? `❌ ${c.contentSignalIssues.join('; ')}` : '✅') : '❌ 缺失';
  lines.push(
    `| ${r.projectName}（${r.projectId}） | ${r.robotsUrl} | ✅ (${c.httpStatus}) | ${aliasOk} | ${consistent} | ${c.userAgentPresent ? '✅' : '❌'} | ${c.hasAllowOrDisallow ? '✅' : '❌'} | ${c.pathFormatIssues.length ? `❌ ${c.pathFormatIssues.join(', ')}` : '✅'} | ${c.sitewideBlocked ? '❌' : '✅ 否'} | ${fmtLinkCell(c.sitemapLinks)} | ${cs} | ${c.llmPolicy ? fmtLinkCell(c.llmPolicyLinks) : '❌ 缺失'} | ${r.verdict} |`
  );
}
lines.push('');
lines.push('## 各项目明细');
for (const r of results) {
  lines.push('');
  lines.push(`### ${r.projectName}（${r.projectId}） — ${r.verdict}`);
  lines.push('');
  if (!r.checks.accessible) {
    lines.push(`- ${r.hardErrors.join('；')}`);
    continue;
  }
  const c = r.checks;
  lines.push(`- robots（主域）：${r.robotsUrl}（HTTP ${c.httpStatus} ✅）`);
  if (r.alias) lines.push(`- robots（alias）：${r.alias.robotsUrl}（HTTP ${r.alias.httpStatus}${r.alias.accessible ? ' ✅' : ` ❌ (${r.alias.error || '不可访问'})`}）`);
  else lines.push('- robots（alias）：未配置 robotsAliasUrl，不检查');
  if (r.alias) lines.push(`- 主域/alias 内容一致性：${r.aliasConsistent ? '一致 ✅' : '不一致 ⚠️'}`);
  lines.push(`- User-agent：${c.userAgents.join('、') || '(无)'}`);
  lines.push(`- allow：${c.allowValues.length ? c.allowValues.join('、') : '(无)'}；disallow：${c.disallowValues.length ? c.disallowValues.join('、') : '(无)'}`);
  lines.push(`- 路径格式：${c.pathFormatIssues.length ? `❌ 存在不以 / 开头的值：${c.pathFormatIssues.join('、')}` : '✅ 均以 / 开头'}；禁整站：${c.sitewideBlocked ? '❌ 是' : '✅ 否'}`);
  lines.push(`- Sitemap 声明 ${c.sitemapLinks.length} 条：`);
  for (const l of c.sitemapLinks) lines.push(`  - ${fmtLink(l)}`);
  lines.push(`- Content-Signal：${c.contentSignal ?? '(无)'}；取值：${c.contentSignalPresent ? (c.contentSignalIssues.length ? `❌ ${c.contentSignalIssues.join('; ')}` : `✅ 符合规范值（${EXPECTED_CS_TEXT}）`) : '❌ 字段缺失'}`);
  if (c.llmPolicy) {
    lines.push(`- LLM-Policy：${c.llmPolicy}，指向 llms.txt：${c.llmPolicyPointsToLlmsTxt ? '✅' : '❌'}；访问结果：`);
    for (const l of c.llmPolicyLinks) lines.push(`  - ${fmtLink(l)}`);
  } else {
    lines.push('- LLM-Policy：❌ 字段缺失');
  }
  if (r.hardErrors.length) {
    lines.push('- ❌ 错误：');
    for (const e of r.hardErrors) lines.push(`  - ${e}`);
  }
  if (r.warnings.length) {
    lines.push('- ⚠️ 告警：');
    for (const w of r.warnings) lines.push(`  - ${w}`);
  }
  lines.push('- robots 原文（主域）：');
  lines.push('');
  lines.push('  ```');
  for (const l of c.raw) lines.push(`  ${l}`);
  lines.push('  ```');
}
lines.push('');
lines.push('## 结论与建议');
lines.push('');
const bad = results.filter((r) => r.hardErrors.length);
const warn = results.filter((r) => !r.hardErrors.length && r.warnings.length);
if (bad.length) lines.push(`- 硬性不符合：${bad.map((r) => `${r.projectId}（${r.hardErrors[0]}${r.hardErrors.length > 1 ? ` 等 ${r.hardErrors.length} 项` : ''}）`).join('；')}，需优先整改。`);
if (warn.length) lines.push(`- 存在告警：${warn.map((r) => r.projectId).join('、')}，主要是主域/alias 不一致或主域跨域引用 Sitemap/LLM-Policy，是否整改人工定夺。`);
if (!bad.length && !warn.length) lines.push('- 全部项目 robots.txt 符合规范。');
lines.push('');
lines.push(`> 注：本报告由 workflow/scripts/check-robots.mjs 自动生成（同批次数据见 workflow/stats/robots-stats.json）。Content-Signal 期望值取自 workflow/config/check-rules.json；"引用目录须以 / 结尾"、disallow 误伤等业务判断仍需人工，见 measures/01-robots-txt/检测方式.md。`);

const dir = resolve(ROOT, '..', 'manual-review', 'issues', 'robotstxt');
await mkdir(dir, { recursive: true });
const reportPath = resolve(dir, reportName);
await writeFile(reportPath, lines.join('\n') + '\n', 'utf8');

console.log(`[robots] 检查完成，${results.length} 个项目，结果已写入 ${statsPath}`);
console.log(`[robots] 规范检查报告 -> ${reportPath}`);
console.log(
  JSON.stringify(
    results.map((r) => ({
      id: r.projectId,
      verdict: r.verdict,
      mainOk: r.checks?.accessible,
      aliasOk: r.alias ? r.alias.accessible : null,
      aliasConsistent: r.aliasConsistent,
      errors: r.hardErrors,
      warnings: r.warnings,
    })),
    null,
    2
  )
);
