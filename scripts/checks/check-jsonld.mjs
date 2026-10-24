import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjects, filterProjects } from '../lib/config.mjs';
import { fetchText } from '../lib/http.mjs';
import { extractJsonLd } from '../lib/html.mjs';
import { parseOwnerRepo, precheckExistingIssues, reconcileIssue, closeIssueCommentBody } from '../lib/atomgit.mjs';
import { writeStats, now } from '../lib/report.mjs';

// 提 issue 模式：扫描每个项目前先查目标 AtomGit 仓库是否已有本维度未关闭 issue（标题前缀匹配），
// 有则跳过该项目整个"扫描+提单"流程；有硬性错误时生成简短/完全两份 md 报告，
// issue 正文用简短版并附指向本仓库完全版报告的链接。前缀变更会使旧 issue 查重失效。
// 强制执行模式（--force，手动 dispatch 勾选 force_check）：查重命中不再拦截扫描，
// 复检仍有问题 → 更新原 issue 标题与正文；问题已消除 → 在原 issue 评论 /close。
const ISSUE_TITLE_PREFIX = '[GEO JSON-LD]';
const startedAt = now();
const dateStr = startedAt.slice(0, 10);

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;
const submitIssues = process.argv.includes('--submit-issues');
const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const RULES_PATH = resolve(__dirname, '..', 'config', 'check-rules.json');
const rules = JSON.parse(await readFile(RULES_PATH, 'utf8'));
const SAMPLE_PAGES = rules.samplePages || ['/'];

const dir = resolve(ROOT, 'scheduled-reports', 'jsonld', dateStr);
await mkdir(dir, { recursive: true });
const reportName = 'report.md';

const P0_TYPES = ['Organization', 'WebSite', 'BreadcrumbList'];

const REQUIRED_PROPS = {
  Organization: ['name', 'url'],
  WebSite: ['name', 'url'],
  WebPage: ['url', 'name'],
  BreadcrumbList: ['itemListElement'],
  Article: ['headline', 'image', 'datePublished', 'author'],
  TechArticle: ['headline', 'image', 'datePublished', 'author'],
  BlogPosting: ['headline', 'image', 'datePublished', 'author'],
  SoftwareApplication: ['name', 'operatingSystem', 'applicationCategory'],
  FAQPage: ['mainEntity'],
  Person: ['name'],
  Event: ['name', 'startDate', 'location'],
};

const ARTICLE_TYPES = new Set(['Article', 'TechArticle', 'BlogPosting']);
const PAGE_LEVEL_TYPES = new Set(['WebPage', 'WebSite', 'Article', 'TechArticle', 'BlogPosting']);
const PLACEHOLDER_RE = /(^|\b)(todo|fixme|tbd|placeholder|待填|占位)\b/i;
const CANONICAL_CONTEXT = 'https://schema.org';

// ---- 单项目扫描（两种模式共用） ----

async function scanProject(project) {
  const entry = { projectId: project.id, projectName: project.name, domain: project.domain, repo: project.repo, checks: {} };
  const types = new Set();
  const requiredMissing = [];
  const placeholderHits = [];
  const nestedIssues = [];
  const contextErrors = [];
  const pagesWithDuplicates = [];
  let jsonLdCount = 0;
  let invalidCount = 0;
  let duplicateBlockCount = 0;
  let nodeTotal = 0;
  let nodesWithId = 0;
  let usesGraph = false;
  let inLanguageMissing = 0;
  const pagesSampled = [];
  const perPage = [];

  const domainRoot = project.domain.replace(/\/+$/, '');
  const sampleUrls = new Map();
  sampleUrls.set('/', domainRoot);
  for (const p of SAMPLE_PAGES.filter((p) => p !== '/')) sampleUrls.set(p, domainRoot + p);

  for (const url of await llmsEntryPages(project, domainRoot)) {
    if (!sampleUrls.has(url)) sampleUrls.set(url, url);
  }

  let firstOk = false;
  let firstStatus = 0;

  for (const [label, url] of sampleUrls) {
    const { ok, status, text } = await fetchText(url, { timeout: 30000, maxBytes: 4 * 1024 * 1024 });
    if (label === '/') {
      firstOk = ok;
      firstStatus = status;
    }
    if (!ok) continue;
    const blocks = extractJsonLd(text);
    const pageTypes = new Set();
    if (blocks.length > 0) pagesSampled.push(label);

    // 重复块检测:同页内语义完全相同的 ld+json 块(常见于模板+插件双重注入)
    const seen = new Map();
    for (const b of blocks) {
      if (!b.valid) continue;
      const raw = JSON.stringify(b.data);
      const hits = seen.get(raw) || 0;
      if (hits > 0) {
        duplicateBlockCount++;
        if (!pagesWithDuplicates.includes(label)) pagesWithDuplicates.push(label);
      }
      seen.set(raw, hits + 1);
    }

    for (const b of blocks) {
      if (!b.valid) {
        invalidCount++;
        continue;
      }
      jsonLdCount++;

      // @context 校验:支持顶层对象与数组两种块形式
      if (!contextOk(b.data)) {
        contextErrors.push({ page: label, detail: contextDetail(b.data) });
      }

      const nodes = [];
      collectNodes(b.data, nodes);
      if (Array.isArray(b.data?.['@graph']) || (Array.isArray(b.data) && b.data.some((d) => Array.isArray(d?.['@graph'])))) {
        usesGraph = true;
      }
      for (const node of nodes) {
        nodeTotal++;
        if (node['@id']) nodesWithId++;
        validateNode(node, label, types, requiredMissing, nestedIssues);
        scanPlaceholders(node, node['@type'], placeholderHits);
        pageTypes.add(Array.isArray(node['@type']) ? node['@type'].join('/') : node['@type']);
      }
    }
    perPage.push({ page: label, url: sampleUrls.get(label), jsonLdBlocks: blocks.length, types: [...pageTypes] });
  }

  entry.checks.pagesRequested = [...sampleUrls.keys()];
  entry.checks.accessible = firstOk;
  entry.checks.httpStatus = firstStatus;

  if (!firstOk) {
    entry.error = `首页不可访问 (${firstStatus})`;
    entry.hardErrors = [entry.error];
    entry.warnings = [];
    entry.verdict = '❌';
    return entry;
  }

  entry.checks.pagesSampled = pagesSampled;
  entry.checks.perPage = perPage;
  entry.checks.jsonLdCount = jsonLdCount;
  entry.checks.invalidCount = invalidCount;
  entry.checks.schemaTypes = [...types];
  entry.checks.p0Missing = P0_TYPES.filter((t) => !types.has(t));
  entry.checks.requiredMissing = requiredMissing;
  entry.checks.requiredMissingCount = requiredMissing.length;
  entry.checks.nestedIssues = nestedIssues;
  entry.checks.placeholderHits = placeholderHits;
  entry.checks.placeholderCount = placeholderHits.length;
  entry.checks.contextErrorCount = contextErrors.length;
  entry.checks.contextErrors = contextErrors;
  entry.checks.duplicateBlockCount = duplicateBlockCount;
  entry.checks.pagesWithDuplicates = pagesWithDuplicates;
  entry.checks.idCoverage = nodeTotal === 0 ? null : +(nodesWithId / nodeTotal).toFixed(4);
  entry.checks.usesGraph = usesGraph;
  entry.checks.inLanguageMissing = inLanguageMissing || nestedIssues.filter((i) => i.issue?.includes('inLanguage')).length;

  classify(entry);
  return entry;
}

// 错误/告警分级：P0（语法/@context/三件套/Google 必填属性/占位符）计硬性错误并触发提单；
// P1 与结构建议（重复块、面包屑层级项、headline 超长、logo 形态、inLanguage、@id 覆盖率）计告警。
function classify(entry) {
  const c = entry.checks;
  const errs = [];
  const warns = [];
  if (c.jsonLdCount === 0) errs.push('采样页面未发现任何合法 JSON-LD 块');
  if (c.invalidCount > 0) errs.push(`JSON 语法错误块 ${c.invalidCount} 个（含语法错误的块无法解析，请检查采样页面的 \`application/ld+json\` 内容）`);
  if (c.contextErrorCount > 0) errs.push(`@context 异常块 ${c.contextErrorCount} 个（应固定为 https://schema.org）`);
  if (c.p0Missing.length) errs.push(`P0 三件套缺失：${c.p0Missing.join(' / ')}（采样页未出现该类型）`);
  if (c.requiredMissingCount > 0) {
    const grouped = new Map();
    for (const m of c.requiredMissing) grouped.set(`${m.type}.${m.prop}`, (grouped.get(`${m.type}.${m.prop}`) || 0) + 1);
    const top = [...grouped.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, n]) => `${k}×${n}`).join('、');
    errs.push(`Google 必填属性缺失 ${c.requiredMissingCount} 处（主要：${top}${grouped.size > 3 ? ' 等' : ''}）`);
  }
  if (c.placeholderCount > 0) errs.push(`占位符取值 ${c.placeholderCount} 处（TODO/待填/占位等，禁止上线）`);
  if (c.duplicateBlockCount > 0) warns.push(`同页语义重复块 ${c.duplicateBlockCount} 处（页面：${c.pagesWithDuplicates.join('、')}，常见根因：模板+插件双重注入）`);
  if (c.nestedIssues.length > 0) warns.push(`结构与推荐项问题 ${c.nestedIssues.length} 处（面包屑项/headline 长度/logo/inLanguage 等，逐条见完全版）`);
  if (c.jsonLdCount > 0 && c.idCoverage !== null && c.idCoverage < 1) warns.push(`@id 覆盖率 ${(c.idCoverage * 100).toFixed(0)}%（P1 实体关联：WebPage.isPartOf → WebSite → Organization 引用链）`);
  entry.hardErrors = errs;
  entry.warnings = warns;
  entry.verdict = errs.length ? '❌' : warns.length ? '⚠️' : '✅';
}

// 触发提单条件：存在 P0 级硬性错误（告警不提单）
function hasAnyIssue(r) {
  return !r.skipped && (r.hardErrors?.length || 0) > 0;
}

// 扫描前查重与写回逻辑收敛在 lib/atomgit.mjs（precheckExistingIssues / reconcileIssue），各维度共用：
// 非强制模式查重命中即 block 跳过；--force 强制执行时不拦截，有问题更新原 issue，无问题评论 /close。

function fullUrlOf(fileName) {
  const ghRepo = process.env.GITHUB_REPOSITORY || 'opensourceways/daily-check-workflow';
  const refName = process.env.GITHUB_REF_NAME || 'archive';
  return `https://github.com/${ghRepo}/blob/${refName}/scheduled-reports/jsonld/${dateStr}/${fileName}`;
}

function issueTitleFor(r) {
  return `${ISSUE_TITLE_PREFIX} ${r.projectName}（${r.projectId}）：JSON-LD 规范问题（${r.hardErrors.length} 类）`;
}

// 简短版正文：采样概况 + 全部错误 + top5 告警（超出注明见完全版）
function briefLines(r) {
  const c = r.checks;
  const lines = [];
  lines.push('### 采样概况');
  lines.push('');
  lines.push(
    `- 采样页面：${(c.pagesRequested || []).join('、') || '-'}；发现合法块 ${c.jsonLdCount ?? 0} 个；类型：${(c.schemaTypes || []).join('、') || '(无)'}`
  );
  lines.push('');
  lines.push(r.hardErrors.length ? `### 问题清单（${r.hardErrors.length} 类硬性不符合）` : '### 问题清单（无 P0 级硬性不符合）');
  lines.push('');
  for (const e of r.hardErrors) lines.push(`- ❌ ${e}`);
  const top = (r.warnings || []).slice(0, 5);
  if (top.length) {
    lines.push('');
    lines.push(`### 告警（${r.warnings.length} 条${r.warnings.length > top.length ? `，列前 ${top.length} 条，其余见完全版` : ''}）`);
    lines.push('');
    for (const w of top) lines.push(`- ⚠️ ${w}`);
  }
  return lines;
}

// 完全版明细：全部错误/告警 + 必填缺失逐条 + 结构问题逐条 + 占位符/context/重复块清单
function detailLines(r) {
  const c = r.checks;
  const lines = [];
  lines.push('### 项目信息');
  lines.push('');
  lines.push(`- 项目：${r.projectName}（${r.projectId}）`);
  lines.push(`- 采样域名：${r.domain}`);
  lines.push(`- 结论：${r.verdict}（硬性错误 ${r.hardErrors.length} 类 / 告警 ${(r.warnings || []).length} 条）`);
  lines.push('');
  lines.push('### 采样页面');
  lines.push('');
  lines.push('| 页面 | JSON-LD 块数 | 类型 |');
  lines.push('| --- | --- | --- |');
  for (const p of c.perPage || []) lines.push(`| ${p.page} | ${p.jsonLdBlocks} | ${(p.types || []).join('、') || '-'} |`);
  lines.push('');
  lines.push(r.hardErrors.length ? `### 问题清单（全部 ${r.hardErrors.length} 类硬性不符合）` : '### 问题清单（无 P0 级硬性不符合）');
  lines.push('');
  for (const e of r.hardErrors) lines.push(`- ❌ ${e}`);
  if ((r.warnings || []).length) {
    lines.push('');
    lines.push(`### 告警（全部 ${r.warnings.length} 条）`);
    lines.push('');
    for (const w of r.warnings) lines.push(`- ⚠️ ${w}`);
  }
  if ((c.requiredMissing || []).length) {
    lines.push('');
    lines.push(`### Google 必填属性缺失（全部 ${c.requiredMissing.length} 处）`);
    lines.push('');
    lines.push('| 页面 | 类型 | 缺失属性 |');
    lines.push('| --- | --- | --- |');
    for (const m of c.requiredMissing) lines.push(`| ${m.page} | ${m.type} | ${m.prop} |`);
  }
  if ((c.nestedIssues || []).length) {
    lines.push('');
    lines.push(`### 结构与推荐项问题（全部 ${c.nestedIssues.length} 处）`);
    lines.push('');
    for (const n of c.nestedIssues) lines.push(`- ⚠️ ${n.page} · ${n.type}：${n.issue}`);
  }
  if ((c.placeholderHits || []).length) {
    lines.push('');
    lines.push(`### 占位符取值（全部 ${c.placeholderHits.length} 处）`);
    lines.push('');
    for (const h of c.placeholderHits) lines.push(`- ❌ \`${h.prop}\`：${h.value}`);
  }
  if ((c.contextErrors || []).length) {
    lines.push('');
    lines.push(`### @context 异常（全部 ${c.contextErrors.length} 处）`);
    lines.push('');
    for (const e of c.contextErrors) lines.push(`- ❌ ${e.page}：${e.detail}`);
  }
  return lines;
}

function issueBodyFor(r, fullFileName) {
  const lines = [];
  lines.push(`本 issue 由 GEO 例行检查（JSON-LD 维度）自动生成。以下问题按 measures/04-json-ld/规范.md 验收基线（P0）对采样页面（${(r.checks.pagesRequested || []).length} 个）静态 HTML 核查得出（${dateStr}）。`);
  lines.push('');
  lines.push(`**项目**：${r.projectName}（${r.projectId}）`);
  lines.push(`**采样入口**：${r.domain}`);
  lines.push('');
  lines.push(...briefLines(r));
  lines.push('');
  lines.push('### 完全版报告');
  lines.push('');
  lines.push('逐页类型、必填属性缺失逐条清单与结构问题明细见检查仓库内的完全版报告：');
  lines.push('');
  lines.push(`> [${fullFileName}](${fullUrlOf(fullFileName)})`);
  lines.push('');
  lines.push('### 规范要点');
  lines.push('');
  lines.push('- `application/ld+json` 必须由 SSG/SSR 输出在最终 HTML 中，`JSON.parse` 可通过，`@context` 固定 `https://schema.org`');
  lines.push('- 全站 P0 三件套：Organization（name+url）、WebSite（name+url）、BreadcrumbList（itemListElement 各项含 position+name）');
  lines.push('- 各类型 Google 必填属性齐全且非空（如 TechArticle：headline ≤110 字符 / image / datePublished / author / publisher）');
  lines.push('- 取值只来自页面可见内容或真实事实，禁止编造，禁止占位符（TODO/待填/xxx）');
  lines.push('- 同一页面避免语义完全重复的块（模板+插件双重注入是常见根因）');
  lines.push('');
  lines.push('### 处理说明');
  lines.push('');
  lines.push('- 按问题清单修复 JSON-LD 注入（补全必填属性、去重块、移除占位符）后合并 PR 并关闭本 issue');
  lines.push('- 修复 PR 合并且 issue 关闭后，下一轮定时检查会重新扫描该项目；issue 未关闭期间不会重复创建，也不会重复扫描');
  lines.push('- 如需修复后立即复核：维护者可手动运行检查 workflow 并勾选 force_check（强制执行，跳过查重拦截）——仍有问题会直接更新本 issue 内容，问题已全部消除会自动在本 issue 评论 /close 关闭');
  lines.push('- 若认为某条属预期（误报，如采样页确实不适用某类型），请在 issue 评论说明，维护者会关闭本 issue');
  lines.push('');
  lines.push(`> 当日全量检查汇总报告：[${reportName}](${fullUrlOf(reportName)})`);
  lines.push('');
  lines.push('<sub>由 daily-check-workflow JSON-LD 规范检查（check-jsonld）自动生成。</sub>');
  return lines.join('\n');
}

// ---- 扫描 + 提 issue ----

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);
const results = [];

for (const project of targets) {
  if (!submitIssues) {
    console.log(`[json-ld] ===== ${project.id} =====`);
    results.push(await scanProject(project));
    continue;
  }
  // 查重：--force 时已有未关闭 issue 不拦截扫描，existing 带回供写回环节更新/关闭
  const pre = await precheckExistingIssues({ repoUrl: project.repo, prefix: ISSUE_TITLE_PREFIX, dimLabel: 'JSON-LD 规范', force });
  pre.notes.forEach((n) => console.log(`[json-ld] ${project.id}: ${n}`));
  if (pre.block) {
    results.push({
      projectId: project.id,
      projectName: project.name,
      domain: project.domain,
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
  console.log(`\n[json-ld] ===== ${project.id} =====`);
  const entry = await scanProject(project);
  const target = parseOwnerRepo(project.repo);
  if (hasAnyIssue(entry)) {
    const title = issueTitleFor(entry);
    const fullFileName = `${entry.projectId}-full.md`;
    const body = issueBodyFor(entry, fullFileName);
    if (!dryRun) {
      await writeFile(resolve(dir, fullFileName), `# JSON-LD 检查完全版报告 · ${entry.projectName}（${entry.projectId}）\n\n- 检查时间：${startedAt}\n\n` + detailLines(entry).join('\n') + '\n', 'utf8');
      await writeFile(resolve(dir, `${entry.projectId}-brief.md`), `# JSON-LD 检查简短报告 · ${entry.projectName}（${entry.projectId}）\n\n- 检查时间：${startedAt}\n- 采样入口：${entry.domain}\n- 结论：${entry.verdict}\n\n` + briefLines(entry).join('\n') + '\n', 'utf8');
      entry.reports = { full: `scheduled-reports/jsonld/${dateStr}/${fullFileName}`, brief: `scheduled-reports/jsonld/${dateStr}/${entry.projectId}-brief.md` };
    }
    // 强制模式下查重命中 → 更新原 issue；否则新建（分支在 reconcileIssue 内）
    const outcome = await reconcileIssue({ target, existing: pre.existing, canWrite: pre.canSubmit, hasIssue: true, title, body, dryRun, logPrefix: `[json-ld] ${project.id}` });
    entry.issueAction = outcome.action;
    if (outcome.url) entry.issueUrl = outcome.url;
  } else if (pre.existing.length) {
    // 无问题且已有未关闭 issue（仅强制模式会走到）：采样首页抓取成功才算有效复检，才评论 /close
    const outcome = await reconcileIssue({
      target,
      existing: pre.existing,
      canWrite: pre.canSubmit,
      hasIssue: false,
      verifiedClean: !!entry.checks?.accessible,
      closeBody: closeIssueCommentBody('JSON-LD 规范检查', dateStr),
      dryRun,
      logPrefix: `[json-ld] ${project.id}`,
    });
    if (outcome.action !== 'none') entry.issueAction = outcome.action;
    if (outcome.url) entry.issueUrl = outcome.url;
  } else {
    console.log(`[json-ld] ${project.id}: 无 P0 硬性错误，不提 issue${(entry.warnings || []).length ? `（有 ${entry.warnings.length} 条告警，见报告）` : ''}`);
  }
  results.push(entry);
}

// ---- stats + Markdown 报告 ----

const report = { timestamp: startedAt, measure: 'json-ld', samplePages: SAMPLE_PAGES, mode: submitIssues ? `submit-issues${dryRun ? '-dry-run' : ''}${force ? '-force' : ''}` : 'scan', results };
const statsPath = await writeStats('jsonld-stats', report);

function overviewRow(r) {
  if (r.skipped) {
    return `| ${r.projectName}（${r.projectId}） | ⏭️ | - | - | - | - | - | - | - | ⏭️ 查重跳过 |`;
  }
  const c = r.checks;
  const tag = r.issueUrl ? `，[issue](${r.issueUrl})` : r.issueAction === 'dry-run' ? '（dry-run 未提交）' : r.issueAction === 'print-only' ? '（未提单：无 token 或查重降级）' : '';
  if (!c.accessible) {
    return `| ${r.projectName}（${r.projectId}） | ❌ (${c.httpStatus}) | - | - | - | - | - | - | - | ${r.verdict}${tag} |`;
  }
  return `| ${r.projectName}（${r.projectId}） | ✅ | ${c.jsonLdCount} | ${c.invalidCount} | ${c.contextErrorCount} | ${c.p0Missing.length ? `❌ ${c.p0Missing.join('/')}` : '✅'} | ${c.requiredMissingCount} | ${c.placeholderCount} | ${(r.warnings || []).length} | ${r.verdict}${tag} |`;
}

const lines = [];
lines.push('# JSON-LD 规范检查报告');
lines.push('');
lines.push(`- 检查时间：${startedAt}`);
lines.push(`- 检查范围：projects.config.json 中 ${results.length} 个项目${results.some((r) => r.skipped) ? `（查重跳过：${results.filter((r) => r.skipped).map((r) => r.projectId).join('、')}）` : ''}`);
lines.push(`- 运行模式：${submitIssues ? `提 issue（--submit-issues${dryRun ? '，dry-run' : ''}${force ? '，--force 强制执行：已有未关闭 issue 时更新原 issue 或评论 /close' : ''}）` : '常规检查'}`);
if (siteId) lines.push(`- 指定项目：--site=${siteId}`);
lines.push(`- 采样策略：首页 + \`check-rules.json\` 的 \`samplePages\`（${SAMPLE_PAGES.join('、')}）+ 各项目 llms.txt 前 2 条真实内容页链接，仅统计返回 200 的页面`);
lines.push('- 规范来源：measures/04-json-ld/规范.md（验收基线 P0–P2）');
lines.push('- 检查项：JSON 语法、`@context`、P0 三件套覆盖（Organization/WebSite/BreadcrumbList）、各类型 Google 必填属性、占位符；告警级：重复块、面包屑项完整性、headline ≤110、publisher/Organization logo 形态、inLanguage、`@id` 覆盖率');
lines.push('- 特殊约定：提单触发 = P0 级硬性错误（语法错误/@context 异常/三件套缺失/必填属性缺失/占位符/首页不可访问）；P1 结构项仅计告警入报告');
lines.push('- 机器可读结果：scripts/stats/jsonld-stats.json');
lines.push('');
lines.push('## 总览');
lines.push('');
lines.push('| 项目 | 首页可访问 | 合法块 | 语法错误 | @context 异常 | P0 三件套 | 必填缺失 | 占位符 | 告警 | 结论 |');
lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
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
const warn = results.filter((r) => !r.skipped && !r.hardErrors.length && (r.warnings || []).length);
const skipped = results.filter((r) => r.skipped);
if (bad.length) lines.push(`- 硬性不符合：${bad.map((r) => `${r.projectId}（${r.hardErrors[0]}${r.hardErrors.length > 1 ? ` 等 ${r.hardErrors.length} 类` : ''}）`).join('；')}，需优先整改。`);
if (warn.length) lines.push(`- 存在告警：${warn.map((r) => r.projectId).join('、')}，多为 P1 结构/推荐项（重复块、inLanguage、@id 覆盖率等），是否整改人工定夺。`);
if (skipped.length) lines.push(`- 查重跳过（已有未关闭 issue，未重复扫描）：${skipped.map((r) => r.projectId).join('、')}。`);
const reopened = results.filter((r) => r.issueAction === 'updated');
if (reopened.length) lines.push(`- 强制复检仍有问题，已更新原 issue：${reopened.map((r) => r.projectId).join('、')}。`);
const closedList = results.filter((r) => r.issueAction === 'close-commented' || r.issueAction === 'close-dry-run');
if (closedList.length) lines.push(`- 强制复检问题已消除，${dryRun ? '将' : '已'}评论 /close 关闭原 issue：${closedList.map((r) => r.projectId).join('、')}。`);
if (!bad.length && !warn.length && !skipped.length) lines.push('- 全部项目采样页面 JSON-LD 符合 P0 基线。');
lines.push('');
lines.push(`> 注：本报告由 scripts/checks/check-jsonld.mjs 自动生成（同批次数据见 scripts/stats/jsonld-stats.json）。取值真实性（与页面可见内容一致、无编造）与富媒体资格（Rich Results Test）仍需人工抽查，见 measures/04-json-ld/检测方式.md。${submitIssues && !dryRun ? '硬性不符合项目已按 --submit-issues 流程提 issue（告警不提单）。' : ''}`);

const reportPath = resolve(dir, reportName);
await writeFile(reportPath, lines.join('\n') + '\n', 'utf8');

async function llmsEntryPages(project, domainRoot) {
  if (!project.llmsUrl) return [];
  const { ok, text } = await fetchText(project.llmsUrl, { timeout: 30000, maxBytes: 12 * 1024 * 1024 });
  if (!ok) return [];
  const links = [...text.matchAll(/^\s*-\s*\[[^\]]*\]\(([^)]+)\)/gm)].map((m) => m[1]);
  return links
    .filter((u) => !/llms-full\.txt|sitemap/i.test(u))
    .map((u) => (/^https?:\/\//i.test(u) ? u : domainRoot + u))
    .map((u) => u.replace(/\.md$/i, '.html'))
    .slice(0, 2);
}

/** @context 允许:顶层字符串、数组块内逐元素、以及值为数组时包含规范值 */
function contextOk(data) {
  const check = (d) => {
    if (!d || typeof d !== 'object') return false;
    const ctx = d['@context'];
    if (ctx === CANONICAL_CONTEXT) return true;
    if (Array.isArray(ctx) && ctx.includes(CANONICAL_CONTEXT)) return true;
    return false;
  };
  if (Array.isArray(data)) return data.every((d) => d === null || check(d));
  return check(data);
}

function contextDetail(data) {
  const first = Array.isArray(data) ? data[0] : data;
  const ctx = first?.['@context'];
  return `@context 异常: ${ctx === undefined ? '缺失' : JSON.stringify(ctx)?.slice(0, 60)}`;
}

function collectNodes(data, out) {
  if (!data || typeof data !== 'object') return;
  if (Array.isArray(data)) {
    data.forEach((d) => collectNodes(d, out));
    return;
  }
  if (data['@type']) out.push(data);
  if (Array.isArray(data['@graph'])) data['@graph'].forEach((d) => collectNodes(d, out));
}

function validateNode(node, page, types, requiredMissing, nestedIssues) {
  const t = node['@type'];
  const typeList = Array.isArray(t) ? t : [t];
  typeList.forEach((x) => types.add(x));
  for (const type of typeList) {
    for (const prop of REQUIRED_PROPS[type] || []) {
      const v = node[prop];
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
        requiredMissing.push({ page, type, prop });
      }
    }
  }
  if (typeList.includes('BreadcrumbList')) {
    const items = node.itemListElement;
    if (Array.isArray(items)) {
      items.forEach((it, i) => {
        if (!it || !it.name) nestedIssues.push({ page, type: 'BreadcrumbList', issue: `第 ${i + 1} 项缺少 name` });
        if (it && it.position === undefined) nestedIssues.push({ page, type: 'BreadcrumbList', issue: `第 ${i + 1} 项缺少 position` });
      });
    }
  }
  if (typeList.some((x) => ARTICLE_TYPES.has(x))) {
    const headline = node.headline;
    if (typeof headline === 'string' && headline.length > 110) {
      nestedIssues.push({ page, type: 'TechArticle', issue: `headline ${headline.length} 字符超上限 110` });
    }
    const publisher = node.publisher;
    if (publisher && typeof publisher === 'object' && !publisher['@id'] && !publisher.logo) {
      nestedIssues.push({ page, type: 'TechArticle', issue: 'publisher 缺少 logo' });
    }
  }
  if (typeList.includes('FAQPage')) {
    const qs = node.mainEntity;
    if (Array.isArray(qs)) {
      qs.forEach((q, i) => {
        if (!q || !q.acceptedAnswer || !q.acceptedAnswer.text) {
          nestedIssues.push({ page, type: 'FAQPage', issue: `第 ${i + 1} 个问题缺少 acceptedAnswer.text` });
        }
      });
    }
  }
  if (typeList.includes('Organization')) {
    const logo = node.logo;
    if (!logo) {
      nestedIssues.push({ page, type: 'Organization', issue: '缺少 logo(推荐 ≥112px、ImageObject、绝对 URL)' });
    } else if (typeof logo === 'string') {
      nestedIssues.push({ page, type: 'Organization', issue: 'logo 为裸字符串,推荐 {"@type":"ImageObject","url":...} 形式' });
    } else if (logo['@type'] === 'ImageObject' && typeof logo.url === 'string' && !/^https?:\/\//i.test(logo.url)) {
      nestedIssues.push({ page, type: 'Organization', issue: 'logo.url 非绝对 URL' });
    }
  }
  if (typeList.some((x) => PAGE_LEVEL_TYPES.has(x)) && !node.inLanguage) {
    nestedIssues.push({ page, type: typeList[0], issue: '缺少 inLanguage(中文站应为 zh-CN)' });
  }
}

function scanPlaceholders(value, label, hits, path = '') {
  if (typeof value === 'string') {
    if (PLACEHOLDER_RE.test(value)) hits.push({ prop: path || label, value: value.slice(0, 40) });
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('@')) continue;
      scanPlaceholders(v, label, hits, path ? `${path}.${k}` : k);
    }
  }
}

console.log(`[json-ld] 检查完成，${results.length} 个项目，结果已写入 ${statsPath}`);
console.log(`[json-ld] 规范检查报告 -> ${reportPath}`);
console.log(
  JSON.stringify(
    results.map((r) => ({
      id: r.projectId,
      verdict: r.verdict,
      skipped: !!r.skipped,
      blocks: r.checks?.jsonLdCount,
      invalid: r.checks?.invalidCount,
      ctxErr: r.checks?.contextErrorCount,
      dup: r.checks?.duplicateBlockCount,
      p0Missing: r.checks?.p0Missing,
      reqMissing: r.checks?.requiredMissingCount,
      nested: r.checks?.nestedIssues?.length,
      idCov: r.checks?.idCoverage,
      graph: r.checks?.usesGraph,
      inLangMiss: r.checks?.inLanguageMissing,
      placeholder: r.checks?.placeholderCount,
      types: r.checks?.schemaTypes,
      errors: r.hardErrors,
      warnings: r.warnings?.length,
      issueAction: r.issueAction,
      issueUrl: r.issueUrl,
    })),
    null,
    2
  )
);
