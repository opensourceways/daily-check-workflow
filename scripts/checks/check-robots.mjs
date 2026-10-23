// check-robots.mjs —— robots.txt 维度例行检查：抓取各项目（含 alias 域）robots.txt 并按
// archive/SEO标准及覆盖情况.md + measures/01-robots-txt/规范.md 核查，输出 stats JSON 与
// scheduled-reports/robotstxt/<日期>/report.md；--submit-issues 模式向各项目 AtomGit 仓库提 issue。
//
// 用法（详见 measures/01-robots-txt/工具与脚本.md 的参数表与执行流程图）：
//   node scripts/checks/check-robots.mjs [--site=<项目ID>] [--submit-issues] [--dry-run]
// 环境变量：ATOMGIT_TOKEN（缺省时只扫描不提单）、GITHUB_REPOSITORY/GITHUB_REF_NAME（正文链接）。
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
import { hasToken, parseOwnerRepo, findIssuesByTitlePrefix, createIssue } from '../lib/atomgit.mjs';
import { writeStats, now } from '../lib/report.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
// ROOT 为 scripts/ 目录
const ROOT = resolve(__dirname, '..');
// 期望值（如 Content-Signal 规范口径）放配置文件，调口径只改 check-rules.json 不改代码
const RULES_PATH = resolve(ROOT, 'config', 'check-rules.json');
const rules = JSON.parse(await readFile(RULES_PATH, 'utf8'));
const ROBOTS_RULES = rules.robots || {};
const EXPECTED_CS = ROBOTS_RULES.contentSignalExpected || { 'ai-train': 'yes', search: 'yes', 'ai-input': 'yes' };
const EXPECTED_CS_TEXT = Object.entries(EXPECTED_CS).map(([k, v]) => `${k}=${v}`).join(', ');
// 引用链接可达性探测只需确认可访问，截断 64KB 避免下载大 sitemap/llms 全文
const LINK_MAX_BYTES = 64 * 1024;

// issue 前缀常量：变更会使旧 issue 查重失效造成重复提单，勿随意改动
const ISSUE_TITLE_PREFIX = '[GEO Robots.txt]';
// 单次运行的统一时间戳：决定日期目录名与报告内所有日期展示
const startedAt = now();
const dateStr = startedAt.slice(0, 10);

// CLI 参数（process.argv 手工解析，零依赖）
const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;
const submitIssues = process.argv.includes('--submit-issues');
const dryRun = process.argv.includes('--dry-run');

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);

// 当日产物目录：scheduled-reports/robotstxt/<YYYY-MM-DD>/，同一天重跑覆盖（ROOT 上一级为仓库根）
const dir = resolve(ROOT, '..', 'scheduled-reports', 'robotstxt', dateStr);
await mkdir(dir, { recursive: true });
const reportName = 'report.md';

/**
 * 检查一条 robots.txt 内引用的链接（Sitemap / LLM-Policy 值）：
 * 非绝对 URL 直接判不可访问；否则 GET 探测状态码；
 * host 与 robots.txt 所在 host 不同 → 标记 crossHost（跨域引用，上层计告警而非错误）。
 */
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

/**
 * 抓取并解析单个 robots.txt URL（主域或 alias 域共用），产出该文件的全部字段级检查结果。
 * 抓取失败时仅 accessible/httpStatus/error 有效，上层据此提前返回。
 */
async function checkOneRobots(url) {
  const entry = { robotsUrl: url };
  const { ok, status, text } = await fetchText(url);
  entry.accessible = ok;
  entry.httpStatus = status;
  if (!ok) {
    entry.error = `robots.txt 不可访问 (${status})`;
    return entry;
  }

  // 按行解析为 user-agent 组 + 全局字段；raw 已过滤空行、逐行 trim（用于域名一致性比对）
  const parsed = parseRobots(text);
  const host = new URL(url).host;
  entry.userAgentPresent = parsed.userAgents.length > 0;
  entry.userAgents = parsed.userAgents;
  entry.allowValues = parsed.allow;
  entry.disallowValues = parsed.disallow;
  // 规范要求 allow/disallow "至少其一"，两者皆无才是不合规
  entry.hasAllowOrDisallow = parsed.allow.length > 0 || parsed.disallow.length > 0;
  entry.pathFormatIssues = pathFormatIssues(parsed);
  entry.sitewideBlocked = isSitewideBlocked(parsed);

  entry.sitemapPresent = parsed.sitemap.length > 0;
  // 逐条 Sitemap 声明检查可达性（单文件维度数量少，串行即可）
  entry.sitemapLinks = [];
  for (const s of parsed.sitemap) entry.sitemapLinks.push(await checkLink(s, host));

  entry.contentSignal = parsed.contentSignal;
  entry.contentSignalPresent = !!parsed.contentSignal;
  // 与期望键值表逐键比对（顺序/空格不敏感），缺失字段单独走 contentSignalPresent 判定
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
    // 指向 llms.txt 的判定：路径末段以 llms 开头（兼容 llms.txt / llms-full.txt）
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

/**
 * 汇总单个检查结果（主域或 alias 域）的硬性错误清单——verdict ❌ 与提单触发条件都以此为准；
 * 告警（跨域引用等）不在此列，由 scanProject 单独归入 warnings。
 */
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

/**
 * 扫描单个项目（常规/提单两种模式共用）：主域必查；配置了 robotsAliasUrl 时 alias 域
 * 执行同套检查（错误加"alias 域："前缀），并将两域非空行逐行比对记入 aliasConsistent。
 */
async function scanProject(project) {
  const entry = { projectId: project.id, projectName: project.name, robotsUrl: project.robotsUrl, repo: project.repo, checks: {} };
  // 未配置 robotsUrl（docs 子目录型项目）：仅记录 ❌，不查重、不提单
  if (!project.robotsUrl) {
    entry.error = 'robotsUrl 未配置';
    entry.verdict = '❌';
    entry.hardErrors = ['robotsUrl 未配置'];
    entry.warnings = [];
    return entry;
  }

  const main = await checkOneRobots(project.robotsUrl);
  entry.checks = main;
  // 主域都抓不到时后续检查无意义，单条错误直接返回
  if (main.error) {
    entry.error = main.error;
    entry.verdict = '❌';
    entry.hardErrors = [main.error];
    entry.warnings = [];
    return entry;
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
  // 跨域引用在本仓库口径里只计告警（domainAlias 视为合法域名），是否整改人工定夺
  if (main.crossDomainRefs.length) warnings.push(`主域跨域引用：${main.crossDomainRefs.map((l) => l.url).join(', ')}`);
  entry.hardErrors = hardErrors;
  entry.warnings = warnings;
  entry.verdict = hardErrors.length ? '❌' : warnings.length ? '⚠️' : '✅';
  return entry;
}

/** 提单模式下因"已有未关闭同前缀 issue / 查重失败(有token)"被跳过的占位条目 */
function skippedEntry(project, notes) {
  return {
    projectId: project.id,
    projectName: project.name,
    robotsUrl: project.robotsUrl,
    repo: project.repo,
    skipped: true,
    checks: {},
    alias: null,
    hardErrors: [],
    warnings: [],
    notes,
    verdict: '⏭️',
  };
}

// 提单触发条件：配置了 robotsUrl 且存在硬性错误（告警不提单；robotsUrl 未配置属内部约定，不提单）
function hasAnyIssue(r) {
  return !r.skipped && !!r.robotsUrl && (r.hardErrors?.length || 0) > 0;
}

// 扫描前查重：目标 AtomGit 仓库已有本维度未关闭 issue 则跳过整个"扫描+提 issue"流程。
// 查询失败时：有 token（生产环境）为防重复提单直接跳过扫描；无 token（本地试跑）继续扫描但跳过提单。
async function precheckExistingIssue(project) {
  const parsed = parseOwnerRepo(project.repo);
  if (!parsed) {
    return { block: false, canSubmit: false, notes: [`repo 无法解析 owner/repo，无法查重与提单：${project.repo || '未配置'}`] };
  }
  let existing;
  try {
    existing = await findIssuesByTitlePrefix({ ...parsed, prefix: ISSUE_TITLE_PREFIX, state: 'open' });
  } catch (err) {
    if (hasToken()) {
      return { block: true, canSubmit: false, notes: [`查询已提 issue 失败，为避免重复提单本次跳过扫描：${err.message}`] };
    }
    return { block: false, canSubmit: false, notes: [`无 ATOMGIT_TOKEN 且查询已提 issue 失败（${err.message}），本次仅扫描不提单`] };
  }
  if (existing.length) {
    const urls = existing.map((i) => i.html_url || `${parsed.owner}/${parsed.repo}#${i.number}`).join('、');
    return { block: true, canSubmit: false, notes: [`已存在未关闭的 robots.txt 规范 issue（#${existing[0].number}：${urls}），跳过本次扫描与提单`] };
  }
  if (!hasToken()) {
    return { block: false, canSubmit: false, notes: ['未设置 ATOMGIT_TOKEN，本次查重通过但不提单'] };
  }
  return { block: false, canSubmit: true, notes: [] };
}

/** 当日汇总报告在 GitHub 上的 blob 链接（issue 正文尾部引用），分支跟随 Actions 运行时 */
function summaryUrl() {
  const ghRepo = process.env.GITHUB_REPOSITORY || 'opensourceways/daily-check-workflow';
  const refName = process.env.GITHUB_REF_NAME || 'archive';
  return `https://github.com/${ghRepo}/blob/${refName}/scheduled-reports/robotstxt/${dateStr}/${reportName}`;
}

function issueTitleFor(r) {
  return `${ISSUE_TITLE_PREFIX} ${r.projectName}（${r.projectId}）：robots.txt 规范问题（${r.hardErrors.length} 项）`;
}

/**
 * issue 正文 = 单一版完整明细（本维度单项目明细很短，不受 body 长度限制影响，
 * 不做 brief/full 双报告拆分，也不写每项目产物文件）：
 * 问题清单 → robots 现状原文 → 规范要点 → 固定处理说明 → 当日汇总报告链接。
 */
function issueBodyFor(r) {
  const c = r.checks;
  const lines = [];
  lines.push(`本 issue 由 GEO 例行检查（robots.txt 维度）自动生成。以下问题按 archive/SEO标准及覆盖情况.md 的 robots.txt 字段规范核查得出（${dateStr}）。`);
  lines.push('');
  lines.push(`**项目**：${r.projectName}（${r.projectId}）`);
  lines.push(`**robots.txt**：${r.robotsUrl}`);
  lines.push('');
  lines.push('### 问题清单');
  lines.push('');
  for (const e of r.hardErrors) lines.push(`- ❌ ${e}`);
  for (const w of r.warnings) lines.push(`- ⚠️ ${w}`);
  lines.push('');
  if (c.accessible) {
    lines.push('### robots.txt 当前内容');
    lines.push('');
    lines.push('```');
    for (const l of c.raw) lines.push(l);
    lines.push('```');
    lines.push('');
  } else {
    lines.push(`（当前无法抓取到 robots.txt 内容：${r.error || '不可访问'}）`);
    lines.push('');
  }
  lines.push('### 规范要点');
  lines.push('');
  lines.push('- `User-agent` 必选；`allow`/`disallow` 至少其一，路径值须以 `/` 开头，引用目录时以 `/` 结尾');
  lines.push('- 不得通过 `Disallow: /` 禁止整站抓取');
  lines.push(`- \`Sitemap\` 必选，声明本站可访问的站点地图地址（建议与 robots.txt 同主机声明）`);
  lines.push(`- \`Content-Signal\` 必选，规范值：${EXPECTED_CS_TEXT}`);
  lines.push('- `LLM-Policy` 必选，指向本站可访问的 llms.txt');
  lines.push('');
  lines.push('### 处理说明');
  lines.push('');
  lines.push('- 按问题清单修复 robots.txt（缺失字段补全、取值改到规范值、不可访问链接改为有效地址）');
  lines.push('- 修复 PR 合并且 issue 关闭后，下一轮定时检查会重新扫描该项目；issue 未关闭期间不会重复创建，也不会重复扫描');
  lines.push('- 若认为某条属预期（误报），请在 issue 评论说明，维护者会关闭本 issue');
  lines.push('');
  lines.push(`> 当日全量检查汇总报告：[${reportName}](${summaryUrl()})`);
  lines.push('');
  lines.push('<sub>由 daily-check-workflow robots.txt 规范检查（check-robots）自动生成。</sub>');
  return lines.join('\n');
}

// ---- 扫描 + 提 issue ----

const results = [];
for (const project of targets) {
  // 常规模式：只扫描记录，不接触 AtomGit
  if (!submitIssues) {
    console.log(`[robots] ===== ${project.id} =====`);
    results.push(await scanProject(project));
    continue;
  }
  if (!project.robotsUrl) {
    // 未配置 robotsUrl 不提单，无需查重，直接扫描记录
    results.push(await scanProject(project));
    continue;
  }
  const pre = await precheckExistingIssue(project);
  pre.notes.forEach((n) => console.log(`[robots] ${project.id}: ${n}`));
  if (pre.block) {
    results.push(skippedEntry(project, pre.notes));
    continue;
  }
  console.log(`\n[robots] ===== ${project.id} =====`);
  const entry = await scanProject(project);
  if (hasAnyIssue(entry)) {
    const title = issueTitleFor(entry);
    const body = issueBodyFor(entry);
    const target = parseOwnerRepo(project.repo);
    // dry-run / 无 token / owner:repo 解析失败 → 仅打印正文，行为等同
    if (dryRun || !target || !pre.canSubmit) {
      console.log(`\n[robots] ${project.id} ${dryRun ? '[dry-run] ' : ''}将提交 issue：${title}`);
      console.log(body);
      entry.issueAction = 'dry-run';
    } else {
      const created = await createIssue({ ...target, title, body });
      const url = created?.html_url || `https://atomgit.com/${target.owner}/${target.repo}/issues/${created?.number}`;
      console.log(`[robots] ${project.id}: ✨ 已创建 issue：${url}`);
      entry.issueAction = 'created';
      entry.issueUrl = url;
    }
  } else {
    console.log(`[robots] ${project.id}: 无硬性错误，不提 issue${entry.warnings.length ? `（有 ${entry.warnings.length} 条告警，见报告）` : ''}`);
  }
  results.push(entry);
}

// ---- stats + Markdown 报告 ----

const report = { timestamp: startedAt, measure: 'robots-txt', results };
const statsPath = await writeStats('robots-stats', report);

// 链接结果渲染成报告行 / 表格单元格
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

/** 汇总报告中单项目的完整明细小节（### 标题 + 检查结果 + 错误/告警 + robots 原文） */
function detailLines(r) {
  const lines = [];
  lines.push(`### ${r.projectName}（${r.projectId}） — ${r.verdict}${r.issueUrl ? `，[issue](${r.issueUrl})` : r.issueAction === 'dry-run' ? '（dry-run 未提交）' : ''}`);
  lines.push('');
  if (r.skipped) {
    for (const n of r.notes || []) lines.push(`- ${n}`);
    return lines;
  }
  // 跳过/未配置的兜底行也必须是列表行，且总览表内该行仍是表格行（勿在此处混入表格）
  if (!r.checks.accessible) {
    lines.push(`- ${r.robotsUrl ? r.hardErrors.join('；') : 'robotsUrl 未配置，项目无独立 robots.txt（属主站子目录），详见 measures/01-robots-txt/各项目差异点.md'}`);
    return lines;
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
  return lines;
}

// 汇总报告：两种模式都含全量明细（issue 正文与明细同源且本维度体量小，不适用双报告维度的"仅总览"去重规则）
const lines = [];
lines.push('# robots.txt 规范检查报告');
lines.push('');
lines.push(`- 检查时间：${startedAt}`);
lines.push(`- 检查范围：projects.config.json 中 ${results.length} 个项目${results.some((r) => r.skipped) ? `（查重跳过：${results.filter((r) => r.skipped).map((r) => r.projectId).join('、')}）` : ''}；配置了 robotsAliasUrl 的项目额外检查主域/alias 一致性（当前：${results.filter((r) => r.alias).map((r) => r.projectId).join('、') || '无'}）`);
lines.push(`- 运行模式：${submitIssues ? `提 issue（--submit-issues${dryRun ? '，dry-run' : ''}）` : '常规检查'}`);
lines.push('- 规范来源：archive/SEO标准及覆盖情况.md（robots.txt 字段表），measures/01-robots-txt/规范.md');
lines.push(`- 检查项：User-agent（必选）、allow/disallow（至少其一、路径以 / 开头）、sitemap（必选，含链接可访问性）、Content-Signal（必选，规范值 ${EXPECTED_CS_TEXT}，期望值配置于 scripts/config/check-rules.json）、LLM-Policy（必选，指向 llms.txt 且可访问）、禁整站判定、主域/alias 内容一致性、跨域引用告警`);
lines.push('- 特殊约定：Sitemap/LLM-Policy 的 host 与 robots.txt 所在 host 不一致时计告警（跨主机 Sitemap 声明可能不被搜索引擎识别），不计硬性错误；"引用目录须以 / 结尾"的目录语义判定不在脚本范围，见 measures/01-robots-txt/检测方式.md');
lines.push('- 机器可读结果：scripts/stats/robots-stats.json');
lines.push('');
lines.push('## 总览');
lines.push('');
lines.push('| 项目 | robots 地址（主域） | 主域可访问 | alias 可访问 | 主/alias 一致 | User-agent | allow∨disallow | 路径格式 | 禁整站 | Sitemap 链接 | Content-Signal | LLM-Policy 链接 | 结论 |');
lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
// 总览每一行（含跳过/未配置分支）都必须输出与表头等列数（13）的表格行，混入非表格行会导致表格断裂
for (const r of results) {
  if (r.skipped) {
    lines.push(`| ${r.projectName}（${r.projectId}） | ${r.robotsUrl || '未配置'} | ⏭️ | - | - | - | - | - | - | - | - | - | ⏭️ 查重跳过 |`);
    continue;
  }
  const c = r.checks;
  if (!c.accessible) {
    lines.push(
      `| ${r.projectName}（${r.projectId}） | ${r.robotsUrl || '未配置'} | ${r.robotsUrl ? `❌ (${c.httpStatus ?? '-'})` : '⏭️ 无独立 robots.txt'} | - | - | - | - | - | - | - | - | - | ${r.verdict}${r.issueUrl ? `，[issue](${r.issueUrl})` : ''} |`
    );
    continue;
  }
  const aliasOk = r.alias ? (r.alias.accessible ? `✅ (${r.alias.httpStatus})` : `❌ (${r.alias.httpStatus})`) : '-';
  const consistent = r.aliasConsistent === null ? '-' : r.aliasConsistent ? '✅' : '⚠️';
  const cs = c.contentSignalPresent ? (c.contentSignalIssues.length ? `❌ ${c.contentSignalIssues.join('; ')}` : '✅') : '❌ 缺失';
  lines.push(
    `| ${r.projectName}（${r.projectId}） | ${r.robotsUrl} | ✅ (${c.httpStatus}) | ${aliasOk} | ${consistent} | ${c.userAgentPresent ? '✅' : '❌'} | ${c.hasAllowOrDisallow ? '✅' : '❌'} | ${c.pathFormatIssues.length ? `❌ ${c.pathFormatIssues.join(', ')}` : '✅'} | ${c.sitewideBlocked ? '❌' : '✅ 否'} | ${fmtLinkCell(c.sitemapLinks)} | ${cs} | ${c.llmPolicy ? fmtLinkCell(c.llmPolicyLinks) : '❌ 缺失'} | ${r.verdict}${r.issueUrl ? `，[issue](${r.issueUrl})` : ''} |`
  );
}
lines.push('');
lines.push('## 各项目明细');
for (const r of results) {
  lines.push('');
  lines.push(...detailLines(r));
}
lines.push('');
lines.push('## 结论与建议');
lines.push('');
const bad = results.filter((r) => !r.skipped && r.hardErrors.length);
const warn = results.filter((r) => !r.skipped && !r.hardErrors.length && r.warnings.length);
const skipped = results.filter((r) => r.skipped);
if (bad.length) lines.push(`- 硬性不符合：${bad.map((r) => `${r.projectId}（${r.hardErrors[0]}${r.hardErrors.length > 1 ? ` 等 ${r.hardErrors.length} 项` : ''}）`).join('；')}，需优先整改。`);
if (warn.length) lines.push(`- 存在告警：${warn.map((r) => r.projectId).join('、')}，主要是主域/alias 不一致或主域跨域引用 Sitemap/LLM-Policy，是否整改人工定夺。`);
if (skipped.length) lines.push(`- 查重跳过（已有未关闭 issue，未重复扫描）：${skipped.map((r) => r.projectId).join('、')}。`);
if (!bad.length && !warn.length && !skipped.length) lines.push('- 全部项目 robots.txt 符合规范。');
lines.push('');
lines.push(`> 注：本报告由 scripts/checks/check-robots.mjs 自动生成（同批次数据见 scripts/stats/robots-stats.json）。Content-Signal 期望值取自 scripts/config/check-rules.json；"引用目录须以 / 结尾"、disallow 误伤等业务判断仍需人工，见 measures/01-robots-txt/检测方式.md。${submitIssues && !dryRun ? '硬性不符合项目已按 --submit-issues 流程提 issue（告警与 robotsUrl 未配置不提单）。' : ''}`);

const reportPath = resolve(dir, reportName);
await writeFile(reportPath, lines.join('\n') + '\n', 'utf8');

// ---- 控制台输出：人读摘要 + 机读结果（CI 场景可截取末尾 JSON）----
console.log(`[robots] 检查完成，${results.length} 个项目，结果已写入 ${statsPath}`);
console.log(`[robots] 规范检查报告 -> ${reportPath}`);
console.log(
  JSON.stringify(
    results.map((r) => ({
      id: r.projectId,
      verdict: r.verdict,
      skipped: !!r.skipped,
      mainOk: r.checks?.accessible,
      aliasOk: r.alias ? r.alias.accessible : null,
      aliasConsistent: r.aliasConsistent,
      errors: r.hardErrors,
      warnings: r.warnings,
      issueAction: r.issueAction,
      issueUrl: r.issueUrl,
    })),
    null,
    2
  )
);
