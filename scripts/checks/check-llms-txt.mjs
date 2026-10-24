import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText, probeTotalSize } from '../lib/http.mjs';
import { parseRobots } from '../lib/robots.mjs';
import { parseOwnerRepo, precheckExistingIssues, reconcileIssue, closeIssueCommentBody } from '../lib/atomgit.mjs';
import { writeStats, now } from '../lib/report.mjs';

// 提 issue 模式：扫描每个项目前先查目标 AtomGit 仓库是否已有本维度未关闭 issue（标题前缀匹配），
// 有则跳过该项目整个"扫描+提单"流程；有硬性错误时生成简短/完全两份 md 报告，
// issue 正文用简短版并附指向本仓库完全版报告的链接。前缀变更会使旧 issue 查重失效。
// 强制执行模式（--force，手动 dispatch 勾选 force_check）：查重命中不再拦截扫描，
// 复检仍有问题 → 更新原 issue 标题与正文；问题已消除 → 在原 issue 评论 /close。
const ISSUE_TITLE_PREFIX = '[GEO llms.txt]';
const startedAt = now();
const dateStr = startedAt.slice(0, 10);

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;
const submitIssues = process.argv.includes('--submit-issues');
const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const dir = resolve(ROOT, 'scheduled-reports', 'llms', dateStr);
await mkdir(dir, { recursive: true });
const reportName = 'report.md';

const MAX_INDEX_CHARS = 100000;
const SAMPLE_LINKS = 3;
const DESC_COVERAGE_BASELINE = 0.8; // P1 基线:≥80% 链接带描述
const MAX_LINKS_PER_SECTION = 20; // 推荐值:每节 5–20 条
const LLMS_FULL_ANALYZE_BYTES = 2 * 1024 * 1024; // llms-full 结构分析只读前 2MB
const MAX_DESC_CHARS = 300; // 描述 300 字符截断约定

// ---- 单项目扫描（两种模式共用） ----

async function scanProject(project) {
  const entry = {
    projectId: project.id,
    projectName: project.name,
    llmsUrl: project.llmsUrl,
    repo: project.repo,
    checks: {},
    hardErrors: [],
    warnings: [],
  };
  if (!project.llmsUrl) {
    entry.error = 'llmsUrl 未配置';
    entry.hardErrors = ['llmsUrl 未配置'];
    entry.verdict = '❌';
    return entry;
  }

  const { ok, status, text, contentType, headers } = await fetchText(project.llmsUrl, {
    timeout: 30000,
    maxBytes: 12 * 1024 * 1024,
  });
  entry.checks.accessible = ok;
  entry.checks.httpStatus = status;
  entry.checks.contentType = contentType;
  if (!ok) {
    entry.error = status === 0 ? `llms.txt 请求失败 (${headers['content-type'] || '网络错误'})` : `llms.txt 不可访问 (${status})`;
    entry.hardErrors = [entry.error];
    entry.verdict = '❌';
    return entry;
  }

  const lines = text.split('\n');
  const h1Lines = lines.filter((l) => /^#\s+\S/.test(l));
  const hasSummary = lines.some((l) => /^>\s?\S/.test(l));
  const linkItems = [...text.matchAll(/^\s*-\s*\[([^\]]*)\]\(([^)]+)\)(?:\s*:\s*(.*))?$/gm)];
  const siteOrigin = project.domain ? project.domain.replace(/\/+$/, '') : '';
  const resolveUrl = (u) => {
    if (/^https?:\/\//i.test(u)) return u;
    if (siteOrigin && u.startsWith('/')) return `${siteOrigin}${u}`;
    return null;
  };
  const absoluteLinks = linkItems.filter((m) => /^https?:\/\//i.test(m[2]));
  const rootRelativeLinks = linkItems.filter((m) => m[2].startsWith('/'));
  const brokenReferenceLinks = linkItems.filter((m) => !resolveUrl(m[2]));
  const describedLinks = linkItems.filter((m) => (m[3] || '').trim().length > 0);

  // ---- 基础结构 ----
  entry.checks.titlePresent = h1Lines.length > 0;
  entry.checks.h1Unique = h1Lines.length === 1;
  entry.checks.summaryPresent = hasSummary;
  entry.checks.linksPresent = linkItems.length > 0;
  entry.checks.linkCount = linkItems.length;
  entry.checks.absoluteLinkCount = absoluteLinks.length;
  entry.checks.rootRelativeLinkCount = rootRelativeLinks.length;
  entry.checks.brokenReferenceLinks = brokenReferenceLinks.slice(0, 5).map((m) => m[2]);
  entry.checks.brokenReferenceLinkCount = brokenReferenceLinks.length;
  entry.checks.linkUrlResolvable = brokenReferenceLinks.length === 0;
  entry.checks.contentLength = text.length;
  entry.checks.sizeWithinLimit = text.length <= MAX_INDEX_CHARS;
  entry.checks.contentTypeOk = /^text\/(plain|markdown)/i.test(contentType);

  // ---- 链接描述覆盖率(P1 基线 ≥80%) ----
  entry.checks.describedLinkCount = describedLinks.length;
  entry.checks.descCoverage = linkItems.length === 0 ? 0 : +(describedLinks.length / linkItems.length).toFixed(4);
  entry.checks.descCoverageOk = entry.checks.descCoverage >= DESC_COVERAGE_BASELINE;
  entry.checks.linksEmptyColon = linkItems.filter((m) => m[3] !== undefined && (m[3] || '').trim() === '').length;
  entry.checks.linksUntitled = linkItems.filter((m) => !m[1].trim()).length;
  entry.checks.descOver300Count = describedLinks.filter((m) => m[3].trim().length > MAX_DESC_CHARS).length;

  // ---- 分节与单节链接数(推荐每节 5–20 条) ----
  const sectionLinkDist = {};
  let current = '_头部';
  for (const l of lines) {
    if (/^##\s+\S/.test(l)) current = l.replace(/^##\s+/, '').trim();
    if (/^\s*-\s*\[/.test(l)) sectionLinkDist[current] = (sectionLinkDist[current] || 0) + 1;
  }
  entry.checks.sectionLinkDist = sectionLinkDist;
  entry.checks.sectionCount = Object.keys(sectionLinkDist).filter((k) => k !== '_头部').length;
  entry.checks.sectionsOverLimit = Object.entries(sectionLinkDist)
    .filter(([, n]) => n > MAX_LINKS_PER_SECTION)
    .map(([name, n]) => `${name}(${n})`);
  entry.checks.hasOptionalSection = Object.keys(sectionLinkDist).some((k) => /^optional$/i.test(k));

  // ---- HTTP 发现头 ----
  entry.checks.linkHeader = headers.link || null;
  entry.checks.linkHeaderDescribedBy = !!headers.link && /rel=["']?describedby/i.test(headers.link);
  entry.checks.xLlmsTxtHeader = headers['x-llms-txt'] || null;

  // ---- llms-full.txt:体积探测 + 截断抓取 + 结构分析 ----
  const llmsFullUrl = project.llmsUrl.replace(/llms\.txt$/i, 'llms-full.txt');
  entry.checks.llmsFullUrl = llmsFullUrl;
  entry.checks.llmsFullTotalBytes = await probeTotalSize(llmsFullUrl, { timeout: 20000 });
  const full = await fetchText(llmsFullUrl, { timeout: 45000, maxBytes: LLMS_FULL_ANALYZE_BYTES });
  entry.checks.llmsFullAccessible = full.ok;
  entry.checks.llmsFullStatus = full.status;
  entry.checks.llmsFullContentType = full.contentType || null;
  entry.checks.llmsFullAnalyzedChars = full.text.length;
  entry.checks.llmsFullTruncated = full.truncated;
  if (full.ok) {
    entry.checks.llmsFull = analyzeLlmsFull(full.text, h1Lines[0]?.replace(/^#\s+/, ''));
  }

  // ---- .well-known 别名(200 但返回 HTML 视为伪别名) ----
  if (project.domain) {
    const wellKnownUrl = `${project.domain.replace(/\/+$/, '')}/.well-known/llms.txt`;
    const wellKnown = await fetchText(wellKnownUrl, { timeout: 20000, maxBytes: 2048 });
    entry.checks.wellKnownUrl = wellKnownUrl;
    entry.checks.wellKnownStatus = wellKnown.status;
    entry.checks.wellKnownContentType = wellKnown.contentType || null;
    entry.checks.wellKnownAccessible = wellKnown.ok;
    entry.checks.wellKnownOk = wellKnown.ok && /^text\/(plain|markdown)/i.test(wellKnown.contentType || '');
    entry.checks.wellKnownBrokenAlias = wellKnown.ok && /text\/html/i.test(wellKnown.contentType || '');
  }

  // ---- robots.txt LLM-Policy 联动 ----
  if (project.robotsUrl) {
    const robots = await fetchText(project.robotsUrl, { timeout: 20000, maxBytes: 256 * 1024 });
    entry.checks.robotsFetched = robots.ok;
    if (robots.ok) {
      const parsed = parseRobots(robots.text);
      entry.checks.robotsLlmPolicyPresent = !!parsed.llmPolicy && /llms\.txt/i.test(parsed.llmPolicy);
      entry.checks.robotsLlmPolicy = parsed.llmPolicy;
    } else {
      entry.checks.robotsLlmPolicyPresent = false;
    }
  }

  // ---- 抽样链接可达 ----
  const sampleTargets = linkItems
    .slice(0, SAMPLE_LINKS)
    .map((m) => ({ href: m[2], url: resolveUrl(m[2]) }))
    .filter((t) => t.url);
  const sampleResults = [];
  for (const t of sampleTargets) {
    const r = await fetchText(t.url, { timeout: 30000, maxBytes: 512 * 1024 });
    sampleResults.push({ url: t.url, ok: r.ok, status: r.status });
  }
  entry.checks.sampleLinksOk = sampleResults.length > 0 && sampleResults.every((r) => r.ok);
  entry.checks.sampleLinks = sampleResults;

  classify(entry, project);
  return entry;
}

// 错误/告警分级：P0 违规（含 100k 体积）计硬性错误并触发提单；
// P1 与质量项计告警（只入报告不提单）；P2（well-known/X-Llms-Txt 缺失）不记录，仅保留数据。
// robots LLM-Policy 联动虽为专项 P0，但提单归 01-robots-txt 维度负责，此处仅计告警，避免同一根因跨维度重复提单。
function classify(entry, project) {
  const c = entry.checks;
  const errs = [];
  const warns = [];
  if (!c.contentTypeOk) errs.push(`Content-Type 非 \`text/plain\` 或 \`text/markdown\`（实际：${c.contentType || '未知'}）`);
  if (!c.titlePresent) errs.push('缺少 H1 标题（全文件唯一必需字段）');
  else if (!c.h1Unique) errs.push('H1 不唯一（应仅一行 `# 站点名`）');
  if (!c.summaryPresent) errs.push('缺少 Summary blockquote（`> 摘要`）');
  if (!c.linksPresent) errs.push('无 `- [标题](URL)` 链接项');
  if (c.sectionCount === 0) errs.push('无 `##` 分节');
  if (!c.linkUrlResolvable) {
    errs.push(`存在无法解析的链接 URL ${c.brokenReferenceLinkCount} 条（非绝对且非根相对，样例：${c.brokenReferenceLinks.join('、')}）`);
  }
  if (!c.sizeWithinLimit) errs.push(`体积 ${c.contentLength.toLocaleString('en-US')} 字符超 100,000 上限，应拆分 \`/_llms/\` 子索引`);
  if (project.robotsUrl) {
    if (!c.robotsFetched) warns.push('robots.txt 不可访问，无法核对 LLM-Policy 联动');
    else if (!c.robotsLlmPolicyPresent) warns.push('robots.txt 缺少指向 llms.txt 的 `LLM-Policy`（提单由 robots.txt 维度负责）');
  }
  if (!c.llmsFullAccessible) warns.push(`llms-full.txt 不可访问 (${c.llmsFullStatus})（P1）`);
  else if (c.llmsFull) {
    const f = c.llmsFull;
    if (!f.headOk) warns.push('llms-full.txt 文件头缺 H1/Summary');
    else if (!f.headMatchesLlms) warns.push(`llms-full.txt 文件头 H1（${f.h1}）与 llms.txt 不一致`);
    if (f.sourceFormat === 'none') warns.push('llms-full.txt 页面缺少 Source URL');
    else if (!f.sourceUrlAbsolute) warns.push(`llms-full.txt Source URL 非绝对地址（格式：${f.sourceFormat}）`);
  }
  if (!c.descCoverageOk) warns.push(`链接描述覆盖率 ${(c.descCoverage * 100).toFixed(1)}%，低于 80% 基线（P1）`);
  if (c.linksEmptyColon) warns.push(`存在"有冒号但描述为空"的链接 ${c.linksEmptyColon} 条（应省略整个 \`: ...\`）`);
  if (c.linksUntitled) warns.push(`无标题链接 ${c.linksUntitled} 条（禁止用 URL 兜底充当标题）`);
  if (c.descOver300Count) warns.push(`描述超 300 字符 ${c.descOver300Count} 条（应取第一段并截断）`);
  if (c.sectionsOverLimit.length) warns.push(`单节链接超建议值 20 条：${c.sectionsOverLimit.join('、')}`);
  if (!c.linkHeaderDescribedBy) warns.push('HTTP `Link: rel="describedby"` 发现头缺失（P1，可在托管/CDN 层配置）');
  if (c.wellKnownBrokenAlias) warns.push('/.well-known/llms.txt 返回 HTML，伪别名易误导（SPA 兜底路由）');
  const badSample = (c.sampleLinks || []).filter((r) => !r.ok);
  if (badSample.length) warns.push(`抽样链接不可访问：${badSample.map((x) => `${x.url}(${x.status})`).join('、')}`);
  entry.hardErrors = errs;
  entry.warnings = warns;
  entry.verdict = errs.length ? '❌' : warns.length ? '⚠️' : '✅';
}

// 触发提单条件：配置了 llmsUrl 且存在 P0 级硬性错误（告警不提单；llmsUrl 未配置属内部约定，不提单）
function hasAnyIssue(r) {
  return !r.skipped && !!r.llmsUrl && (r.hardErrors?.length || 0) > 0;
}

// 扫描前查重与写回逻辑收敛在 lib/atomgit.mjs（precheckExistingIssues / reconcileIssue），各维度共用：
// 非强制模式查重命中即 block 跳过；--force 强制执行时不拦截，有问题更新原 issue，无问题评论 /close。

function fullUrlOf(fileName) {
  const ghRepo = process.env.GITHUB_REPOSITORY || 'opensourceways/daily-check-workflow';
  const refName = process.env.GITHUB_REF_NAME || 'archive';
  return `https://github.com/${ghRepo}/blob/${refName}/scheduled-reports/llms/${dateStr}/${fileName}`;
}

function issueTitleFor(r) {
  return `${ISSUE_TITLE_PREFIX} ${r.projectName}（${r.projectId}）：llms.txt 规范问题（${r.hardErrors.length} 项）`;
}

// 简短版正文：总览 + 全部错误 + top5 告警（超出注明见完全版）
function briefLines(r) {
  const c = r.checks;
  const lines = [];
  lines.push(r.hardErrors.length ? `### 问题清单（${r.hardErrors.length} 项硬性不符合）` : '### 问题清单（无 P0 级硬性不符合）');
  lines.push('');
  for (const e of r.hardErrors) lines.push(`- ❌ ${e}`);
  const top = r.warnings.slice(0, 5);
  if (top.length) {
    lines.push('');
    lines.push(`### 告警（${r.warnings.length} 条${r.warnings.length > top.length ? `，列前 ${top.length} 条，其余见完全版` : ''}）`);
    lines.push('');
    for (const w of top) lines.push(`- ⚠️ ${w}`);
  }
  return lines;
}

// 完全版明细：全部错误/告警 + 逐项检查数据
function detailLines(r) {
  const c = r.checks;
  const lines = [];
  lines.push('### 项目信息');
  lines.push('');
  lines.push(`- 项目：${r.projectName}（${r.projectId}）`);
  lines.push(`- llms.txt：${r.llmsUrl}`);
  lines.push(`- 结论：${r.verdict}（硬性错误 ${r.hardErrors.length} 项 / 告警 ${r.warnings.length} 条）`);
  lines.push('');
  lines.push(`### 问题清单（全部 ${r.hardErrors.length} 项硬性不符合）`);
  lines.push('');
  for (const e of r.hardErrors) lines.push(`- ❌ ${e}`);
  if (r.warnings.length) {
    lines.push('');
    lines.push(`### 告警（全部 ${r.warnings.length} 条）`);
    lines.push('');
    for (const w of r.warnings) lines.push(`- ⚠️ ${w}`);
  }
  if (c.accessible) {
    lines.push('');
    lines.push('### 检查项明细');
    lines.push('');
    lines.push('| 检查项 | 结果 |');
    lines.push('| --- | --- |');
    lines.push(`| HTTP 状态 | ${c.httpStatus} ${c.accessible ? '✅' : '❌'} |`);
    lines.push(`| Content-Type | ${c.contentType} ${c.contentTypeOk ? '✅' : '❌'} |`);
    lines.push(`| H1 | ${c.titlePresent ? (c.h1Unique ? '存在且唯一 ✅' : '不唯一 ❌') : '缺失 ❌'} |`);
    lines.push(`| Summary | ${c.summaryPresent ? '✅' : '❌'} |`);
    lines.push(
      `| 链接 | ${c.linkCount} 条（绝对 ${c.absoluteLinkCount} / 根相对 ${c.rootRelativeLinkCount} / 无法解析 ${c.brokenReferenceLinkCount}）${c.linkUrlResolvable ? ' ✅' : ' ❌'} |`
    );
    lines.push(
      `| 描述覆盖率 | ${(c.descCoverage * 100).toFixed(1)}%（${c.describedLinkCount}/${c.linkCount}，基线 ≥80%）${c.descCoverageOk ? ' ✅' : ' ⚠️'}；空冒号 ${c.linksEmptyColon}、无标题 ${c.linksUntitled}、超300字符 ${c.descOver300Count} |`
    );
    lines.push(
      `| 分节 | ${c.sectionCount} 节${c.sectionsOverLimit.length ? `，超限（>20 条）：${c.sectionsOverLimit.join('、')} ⚠️` : ' ✅'}；分布：${Object.entries(c.sectionLinkDist).map(([k, n]) => `\`${k}\`(${n})`).join('、')} |`
    );
    lines.push(`| 体积 | ${c.contentLength.toLocaleString('en-US')} 字符（上限 100,000）${c.sizeWithinLimit ? ' ✅' : ' ❌'} |`);
    lines.push(
      `| llms-full.txt | ${c.llmsFullAccessible ? `✅（实测 ${c.llmsFullTotalBytes != null ? c.llmsFullTotalBytes.toLocaleString('en-US') : '?'} 字节，分析前 ${c.llmsFullAnalyzedChars.toLocaleString('en-US')} 字符${c.llmsFullTruncated ? '，已截断' : ''}）` : `❌ (${c.llmsFullStatus})`}；文件头：${c.llmsFull ? (c.llmsFull.headOk ? (c.llmsFull.headMatchesLlms ? '✅' : 'H1 不一致 ⚠️') : '❌') : '-'}；Source 格式：${c.llmsFull ? c.llmsFull.sourceFormat : '-'} |`
    );
    lines.push(`| HTTP 发现头 | \`Link: rel="describedby"\` ${c.linkHeaderDescribedBy ? '✅' : '❌'}；\`X-Llms-Txt\` ${c.xLlmsTxtHeader || '（无）'} |`);
    if (c.wellKnownUrl) {
      lines.push(
        `| .well-known 别名 | ${c.wellKnownOk ? '✅ text/plain' : c.wellKnownBrokenAlias ? '❌ 返回 HTML（伪别名）' : `${c.wellKnownStatus}（P2 可选项）`}（${c.wellKnownUrl}） |`
      );
    }
    if (c.robotsLlmPolicyPresent !== undefined) {
      lines.push(`| robots LLM-Policy | ${c.robotsFetched ? (c.robotsLlmPolicyPresent ? `✅ ${c.robotsLlmPolicy}` : '❌ 缺失/未指向 llms.txt（提单归 robots.txt 维度）') : '⚠️ robots.txt 不可访问，无法核对'} |`);
    }
    lines.push(
      `| 抽样链接 | ${(c.sampleLinks || []).map((s) => `${s.ok ? '✅' : '❌'} ${s.url}(${s.status})`).join('；') || '（无可解析链接）'} |`
    );
  }
  return lines;
}

function issueBodyFor(r, fullFileName) {
  const lines = [];
  lines.push(`本 issue 由 GEO 例行检查（llms.txt 维度）自动生成。以下问题按 measures/02-llms-txt/规范.md 验收基线（P0）核查得出（${dateStr}）。`);
  lines.push('');
  lines.push(`**项目**：${r.projectName}（${r.projectId}）`);
  lines.push(`**llms.txt**：${r.llmsUrl}`);
  lines.push('');
  lines.push(...briefLines(r));
  lines.push('');
  lines.push('### 完全版报告');
  lines.push('');
  lines.push('全部错误/告警与逐项检查明细见检查仓库内的完全版报告：');
  lines.push('');
  lines.push(`> [${fullFileName}](${fullUrlOf(fullFileName)})`);
  lines.push('');
  lines.push('### 规范要点');
  lines.push('');
  lines.push('- `/llms.txt` 必须可访问（200），`Content-Type` 为 `text/plain` 或 `text/markdown`');
  lines.push('- H1 站点名为全文件唯一必需字段；紧随其后提供 Summary blockquote');
  lines.push('- 链接项 `- [标题](URL): 描述`：URL 用绝对地址（必须相对时用根相对 `/` 开头）；描述取页面 frontmatter `description` 第一段、≤300 字符，无描述省略整个 `: ...`');
  lines.push('- 单文件 ≤100,000 字符，超限拆分 `/_llms/*.txt` 子索引且不丢页面');
  lines.push('- 配套 `llms-full.txt`：文件头与 llms.txt 一致，每页含标题 + `Source: <绝对URL>` + 完整正文（P1）');
  lines.push('');
  lines.push('### 处理说明');
  lines.push('');
  lines.push('- 按问题清单修复 llms.txt（及 llms-full.txt）后合并 PR 并关闭本 issue');
  lines.push('- 修复 PR 合并且 issue 关闭后，下一轮定时检查会重新扫描该项目；issue 未关闭期间不会重复创建，也不会重复扫描');
  lines.push('- 如需修复后立即复核：维护者可手动运行检查 workflow 并勾选 force_check（强制执行，跳过查重拦截）——仍有问题会直接更新本 issue 内容，问题已全部消除会自动在本 issue 评论 /close 关闭');
  lines.push('- 若认为某条属预期（误报），请在 issue 评论说明，维护者会关闭本 issue');
  lines.push('');
  lines.push(`> 当日全量检查汇总报告：[${reportName}](${fullUrlOf(reportName)})`);
  lines.push('');
  lines.push('<sub>由 daily-check-workflow llms.txt 规范检查（check-llms-txt）自动生成。</sub>');
  return lines.join('\n');
}

// ---- 扫描 + 提 issue ----

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);
const results = [];

for (const project of targets) {
  if (!submitIssues) {
    console.log(`[llms] ===== ${project.id} =====`);
    results.push(await scanProject(project));
    continue;
  }
  if (!project.llmsUrl) {
    // 未配置 llmsUrl 不提单，无需查重，直接扫描记录
    results.push(await scanProject(project));
    continue;
  }
  // 查重：--force 时已有未关闭 issue 不拦截扫描，existing 带回供写回环节更新/关闭
  const pre = await precheckExistingIssues({ repoUrl: project.repo, prefix: ISSUE_TITLE_PREFIX, dimLabel: 'llms.txt 规范', force });
  pre.notes.forEach((n) => console.log(`[llms] ${project.id}: ${n}`));
  if (pre.block) {
    results.push({
      projectId: project.id,
      projectName: project.name,
      llmsUrl: project.llmsUrl,
      repo: project.repo,
      skipped: true,
      checks: {},
      hardErrors: [],
      warnings: [],
      notes: pre.notes,
      verdict: '⏭️',
    });
    continue;
  }
  console.log(`\n[llms] ===== ${project.id} =====`);
  const entry = await scanProject(project);
  const target = parseOwnerRepo(project.repo);
  if (hasAnyIssue(entry)) {
    const title = issueTitleFor(entry);
    const fullFileName = `${entry.projectId}-full.md`;
    const body = issueBodyFor(entry, fullFileName);
    if (!dryRun) {
      await writeFile(resolve(dir, fullFileName), `# llms.txt 检查完全版报告 · ${entry.projectName}（${entry.projectId}）\n\n- 检查时间：${startedAt}\n\n` + detailLines(entry).join('\n') + '\n', 'utf8');
      await writeFile(resolve(dir, `${entry.projectId}-brief.md`), `# llms.txt 检查简短报告 · ${entry.projectName}（${entry.projectId}）\n\n- 检查时间：${startedAt}\n- llms.txt：${entry.llmsUrl}\n- 结论：${entry.verdict}\n\n` + briefLines(entry).join('\n') + '\n', 'utf8');
      entry.reports = { full: `scheduled-reports/llms/${dateStr}/${fullFileName}`, brief: `scheduled-reports/llms/${dateStr}/${entry.projectId}-brief.md` };
    }
    // 强制模式下查重命中 → 更新原 issue；否则新建（分支在 reconcileIssue 内）
    const outcome = await reconcileIssue({ target, existing: pre.existing, canWrite: pre.canSubmit, hasIssue: true, title, body, dryRun, logPrefix: `[llms] ${project.id}` });
    entry.issueAction = outcome.action;
    if (outcome.url) entry.issueUrl = outcome.url;
  } else if (pre.existing.length) {
    // 无问题且已有未关闭 issue（仅强制模式会走到）：llms.txt 抓取成功才算有效复检，才评论 /close
    const outcome = await reconcileIssue({
      target,
      existing: pre.existing,
      canWrite: pre.canSubmit,
      hasIssue: false,
      verifiedClean: !!entry.checks?.accessible,
      closeBody: closeIssueCommentBody('llms.txt 规范检查', dateStr),
      dryRun,
      logPrefix: `[llms] ${project.id}`,
    });
    if (outcome.action !== 'none') entry.issueAction = outcome.action;
    if (outcome.url) entry.issueUrl = outcome.url;
  } else {
    console.log(`[llms] ${project.id}: 无 P0 硬性错误，不提 issue${entry.warnings.length ? `（有 ${entry.warnings.length} 条告警，见报告）` : ''}`);
  }
  results.push(entry);
}

// ---- stats + Markdown 报告 ----

const report = { timestamp: startedAt, measure: 'llms-txt', mode: submitIssues ? `submit-issues${dryRun ? '-dry-run' : ''}${force ? '-force' : ''}` : 'scan', results };
const statsPath = await writeStats('llms-txt-stats', report);

function overviewRow(r) {
  if (r.skipped) {
    return `| ${r.projectName}（${r.projectId}） | ${r.llmsUrl || '未配置'} | ⏭️ | - | - | - | - | - | - | - | - | ⏭️ 查重跳过 |`;
  }
  const c = r.checks;
  if (!c.accessible) {
    return `| ${r.projectName}（${r.projectId}） | ${r.llmsUrl || '未配置'} | ${r.llmsUrl ? `❌ (${c.httpStatus ?? '-'})` : '❌ 未配置'} | - | - | - | - | - | - | - | - | ${r.verdict}${r.issueUrl ? `，[issue](${r.issueUrl})` : ''} |`;
  }
  const tag = r.issueUrl ? `，[issue](${r.issueUrl})` : r.issueAction === 'dry-run' ? '（dry-run 未提交）' : r.issueAction === 'print-only' ? '（未提单：无 token 或查重降级）' : '';
  return `| ${r.projectName}（${r.projectId}） | ${r.llmsUrl} | ✅ (${c.httpStatus}) | ${c.contentTypeOk ? '✅' : `❌ ${c.contentType}`} | ${c.h1Unique && c.titlePresent ? '✅' : '❌'} | ${c.summaryPresent ? '✅' : '❌'} | ${c.linkCount} | ${(c.descCoverage * 100).toFixed(1)}% | ${c.sizeWithinLimit ? '✅' : '❌'} | ${c.llmsFullAccessible ? '✅' : '❌'} | ${c.robotsLlmPolicyPresent === undefined ? '-' : c.robotsLlmPolicyPresent ? '✅' : '⚠️'} | ${r.verdict}${tag} |`;
}

const lines = [];
lines.push('# llms.txt 规范检查报告');
lines.push('');
lines.push(`- 检查时间：${startedAt}`);
lines.push(`- 检查范围：projects.config.json 中 ${results.length} 个项目${results.some((r) => r.skipped) ? `（查重跳过：${results.filter((r) => r.skipped).map((r) => r.projectId).join('、')}）` : ''}`);
lines.push(`- 运行模式：${submitIssues ? `提 issue（--submit-issues${dryRun ? '，dry-run' : ''}${force ? '，--force 强制执行：已有未关闭 issue 时更新原 issue 或评论 /close' : ''}）` : '常规检查'}`);
if (siteId) lines.push(`- 指定项目：--site=${siteId}`);
lines.push('- 规范来源：measures/02-llms-txt/规范.md（验收基线 P0/P1/P2）');
lines.push('- 检查项：可访问性/Content-Type、H1 唯一、Summary、分节与链接结构（URL 可解析）、描述覆盖率（≥80%）与空冒号/无标题/超300、单节链接数（建议 5–20）、100k 体积、llms-full.txt（可达/文件头/Source 格式）、HTTP 发现头、.well-known 别名（含伪别名识别）、robots LLM-Policy 联动、抽样链接可达');
lines.push('- 特殊约定：提单触发 = P0 级硬性错误；P1/P2 与质量项仅计告警入报告；robots LLM-Policy 缺失在本维度计告警（提单由 01-robots-txt 维度负责，避免同一根因跨维度重复提单）；llmsUrl 未配置的项目记 ❌ 但不查重、不提单');
lines.push(`- 机器可读结果：scripts/stats/llms-txt-stats.json`);
lines.push('');
lines.push('## 总览');
lines.push('');
lines.push('| 项目 | llms.txt | 可访问 | Content-Type | H1 | Summary | 链接数 | 描述覆盖率 | ≤100k | llms-full | robots 联动 | 结论 |');
lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const r of results) lines.push(overviewRow(r));
lines.push('');
if (submitIssues) {
  lines.push('## 各项目明细');
  lines.push('');
  lines.push('（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 `<项目ID>-full.md`）');
  lines.push('');
  for (const r of results.filter(hasAnyIssue)) {
    lines.push(`- ${r.projectName}（${r.projectId}）：\`${r.reports ? r.reports.full : '（dry-run 未写文件）'}\`${r.issueUrl ? `，issue：${r.issueUrl}` : r.issueAction === 'dry-run' ? '，（dry-run 未提交）' : r.issueAction === 'print-only' ? '，（未提单：无 token 或查重降级）' : ''}`);
  }
} else {
  lines.push('## 各项目明细');
  for (const r of results) {
    lines.push('');
    lines.push(`### ${r.projectName}（${r.projectId}） — ${r.verdict}`);
    lines.push('');
    if (r.skipped) {
      for (const n of r.notes || []) lines.push(`- ${n}`);
      continue;
    }
    if (!r.checks.accessible) {
      lines.push(`- ${r.hardErrors.join('；')}`);
      continue;
    }
    lines.push(...detailLines(r).slice(4));
  }
}
lines.push('');
lines.push('## 结论与建议');
lines.push('');
const bad = results.filter((r) => !r.skipped && r.hardErrors.length);
const warn = results.filter((r) => !r.skipped && !r.hardErrors.length && r.warnings.length);
const skipped = results.filter((r) => r.skipped);
if (bad.length) lines.push(`- 硬性不符合：${bad.map((r) => `${r.projectId}（${r.hardErrors[0]}${r.hardErrors.length > 1 ? ` 等 ${r.hardErrors.length} 项` : ''}）`).join('；')}，需优先整改。`);
if (warn.length) lines.push(`- 存在告警：${warn.map((r) => r.projectId).join('、')}，多为 P1 基线（llms-full/描述覆盖率/发现头）与质量项，是否整改人工定夺。`);
if (skipped.length) lines.push(`- 查重跳过（已有未关闭 issue，未重复扫描）：${skipped.map((r) => r.projectId).join('、')}。`);
const reopened = results.filter((r) => r.issueAction === 'updated');
if (reopened.length) lines.push(`- 强制复检仍有问题，已更新原 issue：${reopened.map((r) => r.projectId).join('、')}。`);
const closedList = results.filter((r) => r.issueAction === 'close-commented' || r.issueAction === 'close-dry-run');
if (closedList.length) lines.push(`- 强制复检问题已消除，${dryRun ? '将' : '已'}评论 /close 关闭原 issue：${closedList.map((r) => r.projectId).join('、')}。`);
if (!bad.length && !warn.length && !skipped.length) lines.push('- 全部项目 llms.txt 符合规范。');
lines.push('');
lines.push(`> 注：本报告由 scripts/checks/check-llms-txt.mjs 自动生成（同批次数据见 scripts/stats/llms-txt-stats.json）。内容准确性（把 llms.txt 交给 agent 问答）与分组合理性仍需人工，见 measures/02-llms-txt/检测方式.md。${submitIssues && !dryRun ? '硬性不符合项目已按 --submit-issues 流程提 issue（告警与 llmsUrl 未配置不提单）。' : ''}`);

const reportPath = resolve(dir, reportName);
await writeFile(reportPath, lines.join('\n') + '\n', 'utf8');

/**
 * llms-full.txt 结构分析(基于截断文本):
 * - 文件头:首个 `---` 分隔线之前应有 H1 + Summary blockquote
 * - 头部一致性:与 llms.txt 的 H1 对比
 * - Source URL 格式:source-line / bare-url / url-yaml(相对) / url-blockquote / none
 */
function analyzeLlmsFull(text, llmsH1) {
  const lines = text.split('\n');
  const firstSep = lines.findIndex((l) => /^-{3,}\s*$/.test(l));
  const headRegion = firstSep === -1 ? lines.slice(0, 30) : lines.slice(0, firstSep);
  const h1 = headRegion.find((l) => /^#\s+\S/.test(l))?.replace(/^#\s+/, '').trim() || null;
  const headSummary = headRegion.some((l) => /^>\s?\S/.test(l));

  const count = (re) => lines.filter((l) => re.test(l)).length;
  const formats = {
    'source-line': count(/^(Source|来源)\s*[:：]\s*https?:\/\//i),
    'bare-url': count(/^https?:\/\/\S+\s*$/),
    'url-yaml': count(/^url:\s*\S+/i),
    'url-blockquote': count(/^>\s*URL\s*[:：]/i),
  };
  const dominant = Object.entries(formats).sort((a, b) => b[1] - a[1])[0];
  const sourceFormat = dominant[1] > 0 ? dominant[0] : 'none';
  const absoluteFormats = new Set(['source-line', 'bare-url']);

  return {
    headOk: !!h1 && headSummary,
    h1,
    headSummary,
    headMatchesLlms:
      !!llmsH1 &&
      !!h1 &&
      (h1 === llmsH1 || llmsH1.startsWith(h1) || h1.startsWith(llmsH1)),
    separatorCount: lines.filter((l) => /^-{3,}\s*$/.test(l)).length,
    sourceFormat,
    sourceFormatCounts: formats,
    sourceUrlAbsolute: absoluteFormats.has(sourceFormat),
    approxPages: lines.filter((l) => /^-{3,}\s*$/.test(l)).length,
  };
}

console.log(`[llms] 检查完成，${results.length} 个项目，结果已写入 ${statsPath}`);
console.log(`[llms] 规范检查报告 -> ${reportPath}`);
console.log(
  JSON.stringify(
    results.map((r) => {
      const c = r.checks || {};
      return {
        id: r.projectId,
        verdict: r.verdict,
        skipped: !!r.skipped,
        ok: c.accessible,
        ct: c.contentTypeOk,
        h1: c.h1Unique,
        sum: c.summaryPresent,
        links: c.linkCount,
        desc: typeof c.descCoverage === 'number' ? `${(c.descCoverage * 100).toFixed(1)}%` : '-',
        size: c.sizeWithinLimit,
        sectionsOver: c.sectionsOverLimit?.length || 0,
        full: c.llmsFullAccessible,
        fullHead: c.llmsFull?.headOk,
        fullSrc: c.llmsFull?.sourceFormat,
        wellKnown: c.wellKnownOk === true ? 'ok' : c.wellKnownBrokenAlias ? 'broken(html)' : c.wellKnownStatus,
        linkHdr: c.linkHeaderDescribedBy,
        robots: c.robotsLlmPolicyPresent,
        sample: c.sampleLinksOk,
        errors: r.hardErrors,
        warnings: r.warnings?.length,
        issueAction: r.issueAction,
        issueUrl: r.issueUrl,
      };
    }),
    null,
    2
  )
);
