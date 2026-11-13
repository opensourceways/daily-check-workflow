import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjects, filterProjects } from '../lib/config.mjs';
import { parseOwnerRepo, precheckExistingIssues, reconcileIssue, closeIssueCommentBody } from '../lib/atomgit.mjs';
import { writeStats, now } from '../lib/report.mjs';
import { cloneRepo, removeDir, findCodeFiles, extractLinksFromFile, filterExcludedUrls, probeLinks } from '../lib/link-scan.mjs';

// 失效链接（死链）维度：clone 各项目 AtomGit 镜像仓（projects.config.json 的 repo 为 gitcode 正源 URL，
// 实际从其 AtomGit 同名镜像 clone——gitcode 匿名 git 传输 401，见 lib/link-scan.mjs）
// → 扫描源码文件提取链接 → 唯一 URL 去重后并发 HTTP 探测 → 有失效链接时生成简短/完全两份 md 报告
// 并向该项目 AtomGit 仓库提 issue。
// 口径说明（2026-11 起）：报告口径 = 全部失效状态（401/403/404/418、网络错误等都写入 brief/full 报告）；
// 提单口径 = 仅 links.issueStatuses 内的状态（默认仅 404）才提/更新 issue，其余状态只记报告。
// brief/full 报告是检查产物，dry-run 也生成（dry-run 只跳过提单）——issue 正文（含 dry-run 打印的
// 预览正文）链接的完全版报告必须真实存在，否则正文里的报告链接指向 404。
// 提 issue 模式：扫描前先查重（标题前缀匹配），已有未关闭 issue 的项目仍照常扫描并归档
// brief/full 报告与 stats，但本轮不提单/不更新/不评论关闭（查重只拦"写回"，不拦"扫描"）；
// issue 正文用简短版并附指向本仓库完全版报告的链接。前缀变更会使旧 issue 查重失效。
// 强制执行模式（--force，手动 dispatch 勾选 force_check）：查重命中时恢复写回——
// 复检仍有问题 → 更新原 issue 标题与正文；问题已消除 → 在原 issue 评论 /close。
const ISSUE_TITLE_PREFIX = '[GEO Link Check]';
const startedAt = now();
const dateStr = startedAt.slice(0, 10);

const siteArg = process.argv.find((a) => a.startsWith('--site='));
const siteId = siteArg ? siteArg.split('=')[1] : null;
const concArg = process.argv.find((a) => a.startsWith('--conc='));
const maxArg = process.argv.find((a) => a.startsWith('--max='));
const submitIssues = process.argv.includes('--submit-issues');
const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const dir = resolve(ROOT, 'scheduled-reports', 'links', dateStr);
await mkdir(dir, { recursive: true });
const reportName = 'report.md';

// 探测参数集中在 scripts/config/check-rules.json 的 links 段（--conc 可临时覆盖并发数）
const rules = JSON.parse(await readFile(resolve(ROOT, 'scripts', 'config', 'check-rules.json'), 'utf8'));
const LINK_RULES = { workers: 5, timeoutSeconds: 15, delaySeconds: 0.5, ...(rules.links || {}) };
const workers = concArg ? Math.max(1, Number(concArg.split('=')[1]) || LINK_RULES.workers) : LINK_RULES.workers;
const maxLinks = maxArg ? Number(maxArg.split('=')[1]) : null; // 试跑截断：每项目最多探测的唯一 URL 数

// 提单口径：仅这些 HTTP 状态的失效链接会提/更新 issue（check-rules.json 的 links.issueStatuses，
// 默认仅 404；缺失或非法时回退 [404]）。报告口径不受影响——任何失效状态（401/403/418、网络错误等）
// 都会写入 brief/full 报告，保证原始报告始终留有全量非正常链接。
const ISSUE_STATUSES = (() => {
  const raw = Array.isArray(LINK_RULES.issueStatuses) ? LINK_RULES.issueStatuses.map(Number) : [];
  const list = raw.filter((n) => Number.isInteger(n) && n >= 100 && n <= 599);
  return list.length ? list : [404];
})();
const ISSUE_STATUS_LABEL = ISSUE_STATUSES.join('/');

// 报告展示参数
const BRIEF_TOP_PER_GROUP = 5; // 简短版每个状态组最多列出的 URL 数
const OCC_DISPLAY_CAP = 20; // 完全版每个 URL 最多展示的引用位置数（超出注明"等 N 处"）

// ---- 单项目扫描（两种模式共用） ----

async function scanProject(project) {
  const ls = project.linkScan;
  const entry = {
    projectId: project.id,
    projectName: project.name,
    repo: project.repo,
    branch: ls.branch || 'main',
    urlPrefix: ls.urlPrefix || '',
    domain: String(project.domain || '').replace(/\/+$/, ''),
    checks: {},
    broken: [],
    scanError: null,
  };

  let baseDir;
  try {
    baseDir = cloneRepo(project.repo, entry.branch);
  } catch (err) {
    console.error(`[links] ${project.id}: ${err.message}`);
    entry.scanError = String(err.message);
    entry.verdict = '❌';
    return entry;
  }

  try {
    const files = findCodeFiles(baseDir, ls.excludeFiles || []);
    const occurrences = [];
    for (const f of files) {
      occurrences.push(...extractLinksFromFile(f, baseDir, entry.domain, { excludeDomains: ls.excludeDomains || [], urlPrefix: ls.urlPrefix || '' }));
    }
    const filtered = filterExcludedUrls(occurrences, ls.excludeUrls || []);

    entry.checks.scannedFiles = files.length;
    entry.checks.linkOccurrences = filtered.length;

    // 探测按唯一 URL 去重：同一 URL 多处引用只探测一次，结果映射回全部引用位置
    let uniqueUrls = [...new Set(filtered.map((o) => o.url))];
    if (maxLinks && uniqueUrls.length > maxLinks) {
      uniqueUrls = uniqueUrls.slice(0, maxLinks);
      entry.checks.truncated = true;
    }
    entry.checks.checkedUrls = uniqueUrls.length;

    const statusDist = {};
    const broken = [];
    if (uniqueUrls.length) {
      const probed = await probeLinks(uniqueUrls, {
        workers,
        timeout: LINK_RULES.timeoutSeconds * 1000,
        delay: LINK_RULES.delaySeconds * 1000,
      });
      const occByUrl = new Map();
      for (const o of filtered) {
        if (!occByUrl.has(o.url)) occByUrl.set(o.url, []);
        occByUrl.get(o.url).push(o);
      }
      for (const p of probed) {
        if (p.ok) continue;
        const key = p.status != null ? String(p.status) : 'ERR';
        statusDist[key] = (statusDist[key] || 0) + 1;
        broken.push({ url: p.url, status: p.status, error: p.error, occurrences: occByUrl.get(p.url) || [] });
      }
      broken.sort((a, b) => (a.status ?? 99999) - (b.status ?? 99999) || a.url.localeCompare(b.url));
      entry.checks.okUrls = probed.length - broken.length;
    } else {
      entry.checks.okUrls = 0;
    }
    entry.checks.brokenUrls = broken.length;
    entry.checks.brokenOccurrences = broken.reduce((n, b) => n + b.occurrences.length, 0);
    entry.checks.statusDist = statusDist;
    entry.broken = broken;
    entry.verdict = broken.length ? '❌' : '✅';
    return entry;
  } finally {
    removeDir(baseDir);
  }
}

// 报告口径（hasBrokenLinks）：配置了 linkScan 且本轮扫描有效（clone 成功）且存在任意状态的失效链接
// ——满足即写 brief/full 报告（401/403/404/418、网络错误等全部状态）。
// clone 失败（分支改名/仓库迁移等）属检查侧配置问题，只记报告与控制台，不向项目提单。
function hasBrokenLinks(r) {
  return !r.skipped && !r.notConfigured && !r.scanError && (r.checks?.brokenUrls || 0) > 0;
}

// 提单口径（issueBroken）：仅 issueStatuses（默认仅 404）状态的失效链接才提/更新/保持 issue；
// 其余状态只进报告。issue 标题、正文、关闭判定均基于此口径。
function issueBroken(r) {
  return (r.broken || []).filter((b) => ISSUE_STATUSES.includes(b.status));
}

// 扫描前查重与写回逻辑收敛在 lib/atomgit.mjs（precheckExistingIssues / reconcileIssue），各维度共用：
// 非强制模式查重命中即 block 跳过；--force 强制执行时不拦截，有问题更新原 issue，无问题评论 /close。

function fullUrlOf(fileName) {
  const ghRepo = process.env.GITHUB_REPOSITORY || 'opensourceways/daily-check-workflow';
  const refName = process.env.GITHUB_REF_NAME || 'main';
  return `https://github.com/${ghRepo}/blob/${refName}/scheduled-reports/links/${dateStr}/${fileName}`;
}

function issueTitleFor(r, issueList) {
  return `${ISSUE_TITLE_PREFIX} ${r.projectName}（${r.projectId}）：发现 ${issueList.length} 个失效链接（${ISSUE_STATUS_LABEL}）`;
}

// 状态分组键排序：HTTP 状态码升序，网络错误（ERR）最后
function groupKeys(dist) {
  return Object.keys(dist).sort((a, b) => {
    if (a === 'ERR') return 1;
    if (b === 'ERR') return -1;
    return Number(a) - Number(b);
  });
}

function statusLabel(status) {
  return status == null ? '网络错误' : `HTTP ${status}`;
}

function occText(b, cap) {
  const occ = b.occurrences.slice(0, cap).map((o) => `${o.file}:${o.line}`).join('、');
  return b.occurrences.length > cap ? `${occ} 等 ${b.occurrences.length} 处` : occ;
}

function distText(dist) {
  return groupKeys(dist)
    .map((k) => `\`${k === 'ERR' ? '网络错误' : k}\`×${dist[k]}`)
    .join('、');
}

// 简短版正文：状态分布 + 按状态分组、每组前 N 个失效 URL（超出注明见完全版）。
// list 缺省 = 全部失效链接（简短版报告文件用，报告口径）；issue 正文传提单口径过滤后的子集（默认仅 404）。
function briefLines(r, list = r.broken) {
  const dist = {};
  let occCount = 0;
  for (const b of list) {
    const key = b.status == null ? 'ERR' : String(b.status);
    dist[key] = (dist[key] || 0) + 1;
    occCount += b.occurrences.length;
  }
  const lines = [];
  lines.push(`### 问题清单（${list.length} 个失效 URL，共 ${occCount} 处引用）`);
  lines.push('');
  lines.push(`状态分布：${distText(dist)}`);
  for (const key of groupKeys(dist)) {
    const group = list.filter((b) => (b.status == null ? 'ERR' : String(b.status)) === key);
    lines.push('');
    lines.push(`#### ${statusLabel(group[0].status)}（${group.length} 个）`);
    lines.push('');
    lines.push('| URL | 引用位置 |');
    lines.push('| --- | --- |');
    for (const b of group.slice(0, BRIEF_TOP_PER_GROUP)) {
      lines.push(`| \`${b.url}\` | ${occText(b, 3)} |`);
    }
    if (group.length > BRIEF_TOP_PER_GROUP) {
      lines.push(`| （其余 ${group.length - BRIEF_TOP_PER_GROUP} 个见完全版） | - |`);
    }
  }
  return lines;
}

// 完全版明细：项目信息 + 扫描概况 + 按状态分组的全部失效 URL 与引用位置
function detailLines(r) {
  const c = r.checks;
  const lines = [];
  lines.push('### 项目信息');
  lines.push('');
  lines.push(`- 项目：${r.projectName}（${r.projectId}）`);
  lines.push(`- 数据源：\`${r.repo}\`（${r.branch} 分支，取 AtomGit 同名镜像）`);
  lines.push(`- 站点域名：${r.domain}`);
  lines.push(`- 相对路径前缀（urlPrefix）：\`${r.urlPrefix || '（无）'}\``);
  lines.push(`- 结论：${r.verdict}（失效 URL ${c.brokenUrls} 个 / ${c.brokenOccurrences} 处引用）`);
  lines.push('');
  lines.push('### 扫描概况');
  lines.push('');
  lines.push('| 扫描文件 | 链接引用 | 探测 URL（去重后） | 有效 | 失效 |');
  lines.push('| --- | --- | --- | --- | --- |');
  lines.push(`| ${c.scannedFiles} | ${c.linkOccurrences} | ${c.checkedUrls}${c.truncated ? '（--max 截断）' : ''} | ${c.okUrls} | ${c.brokenUrls} |`);
  lines.push('');
  lines.push(`### 失效链接明细（状态分布：${distText(c.statusDist)}）`);
  for (const key of groupKeys(c.statusDist)) {
    const group = r.broken.filter((b) => (b.status == null ? 'ERR' : String(b.status)) === key);
    lines.push('');
    lines.push(`#### ${statusLabel(group[0].status)}（${group.length} 个）`);
    lines.push('');
    lines.push('| URL | 引用位置 | 错误 |');
    lines.push('| --- | --- | --- |');
    for (const b of group) {
      const error = b.error ? (b.error.length > 60 ? `${b.error.slice(0, 57)}...` : b.error) : '—';
      lines.push(`| \`${b.url}\` | ${occText(b, OCC_DISPLAY_CAP)} | ${error} |`);
    }
  }
  return lines;
}

function issueBodyFor(r, fullFileName, issueList) {
  const c = r.checks;
  const lines = [];
  lines.push(`本 issue 由 GEO 例行检查（失效链接维度）自动生成。扫描 \`${r.repo}\`（${r.branch} 分支，取 AtomGit 同名镜像）共 ${c.scannedFiles} 个源码文件，提取 ${c.linkOccurrences} 处链接（去重后 ${c.checkedUrls} 个 URL）并逐个探测，共发现 ${c.brokenUrls} 个失效链接，其中 ${issueList.length} 个为 ${ISSUE_STATUS_LABEL}（${dateStr}）。本 issue 仅跟踪 ${ISSUE_STATUS_LABEL} 状态的失效链接。`);
  const otherCount = c.brokenUrls - issueList.length;
  if (otherCount > 0) {
    lines.push('');
    lines.push(`其余 ${otherCount} 个未列入提单口径的失效链接不进入本 issue，已记录在完全版报告中。`);
  }
  lines.push('');
  lines.push(`**项目**：${r.projectName}（${r.projectId}）`);
  lines.push('');
  lines.push(...briefLines(r, issueList));
  lines.push('');
  lines.push('### 完全版报告');
  lines.push('');
  lines.push('全部失效链接与逐个引用位置见检查仓库内的完全版报告：');
  lines.push('');
  lines.push(`> [${fullFileName}](${fullUrlOf(fullFileName)})`);
  lines.push('');
  lines.push('### 规范要点');
  lines.push('');
  lines.push('- 站内相对路径应能通过站点实际路由访问（检查侧按项目 `linkScan.urlPrefix` 规则补全后探测）');
  lines.push('- 外部链接需返回 HTTP < 400（跟随重定向）；已迁移/删除的外链应更新指向或移除');
  lines.push('- 探测口径：HEAD 优先、GET 复核；图片链接不检查；超时/DNS 失败等网络错误也计失效——若为目标站点临时故障，可在评论说明');
  lines.push(`- 提单口径：仅 ${ISSUE_STATUS_LABEL} 状态的失效链接会开 issue，其余失效状态只记录在检查报告中（口径清单见 check-rules.json 的 links.issueStatuses）`);
  lines.push('');
  lines.push('### 处理说明');
  lines.push('');
  lines.push('- 按问题清单修复链接后合并 PR 并关闭本 issue');
  lines.push('- 修复 PR 合并且 issue 关闭后，下一轮定时检查会重新扫描该项目；issue 未关闭期间每轮检查仍会扫描并归档最新报告，但不会重复创建 issue、也不会更新本 issue');
  lines.push('- 如需修复后立即复核：维护者可手动运行检查 workflow 并勾选 force_check（强制执行，恢复对已有 issue 的写回）——仍有问题会直接更新本 issue 内容，问题已全部消除会自动在本 issue 评论 /close 关闭');
  lines.push('- 若认为某条属预期（误报），请在 issue 评论说明，维护者会关闭本 issue');
  lines.push('');
  lines.push(`> 当日全量检查汇总报告：[${reportName}](${fullUrlOf(reportName)})`);
  lines.push('');
  lines.push('<sub>由 daily-check-workflow 失效链接检查（check-links）自动生成。</sub>');
  return lines.join('\n');
}

// ---- 扫描 + 提 issue ----

const projects = await loadProjects();
const targets = filterProjects(projects, siteId);
const results = [];

for (const project of targets) {
  if (!project.linkScan) {
    // 未配置 linkScan 的项目（docs 站等）只记录不扫描、不查重、不提单
    results.push({ projectId: project.id, projectName: project.name, notConfigured: true, checks: {}, broken: [], verdict: '➖' });
    continue;
  }
  if (!submitIssues) {
    console.log(`[links] ===== ${project.id} =====`);
    results.push(await scanProject(project));
    continue;
  }
  // 查重：非强制模式命中已有未关闭 issue 时不再跳过项目（scanOnly=true）——照常扫描并归档
  // brief/full 报告与 stats，只拦 issue 写回；--force 时 existing 带回供写回环节更新/关闭。
  // 仍会 block 的只剩"有 token 但查重查询失败"的异常场景（宁漏勿重）。
  const pre = await precheckExistingIssues({ repoUrl: project.repo, prefix: ISSUE_TITLE_PREFIX, dimLabel: `失效链接（${ISSUE_STATUS_LABEL}）`, force, scanOnExisting: true });
  pre.notes.forEach((n) => console.log(`[links] ${project.id}: ${n}`));
  if (pre.block) {
    results.push({
      projectId: project.id,
      projectName: project.name,
      repo: project.repo,
      skipped: true,
      checks: {},
      broken: [],
      notes: pre.notes,
      verdict: '⏭️',
    });
    continue;
  }
  console.log(`\n[links] ===== ${project.id} =====`);
  const entry = await scanProject(project);
  const target = parseOwnerRepo(project.repo);
  // 报告与提单口径解耦：报告口径 = 任意失效状态（401/403/404/418、网络错误等）都写 brief/full；
  // 提单口径 = 仅 issueStatuses（默认仅 404）才提/更新 issue。
  const issueList = issueBroken(entry);
  const fullFileName = `${entry.projectId}-full.md`;
  if (hasBrokenLinks(entry)) {
    // brief/full 报告是检查产物，dry-run 同样写（dry-run 只跳过提单）：
    // issue 正文（dry-run 时为控制台打印的预览正文）里链接的完全版报告必须真实存在，否则指向 404。
    const modeNote = (dryRun ? '\n- 运行模式：dry-run（未提 issue）' : '') + (pre.scanOnly ? '\n- 已有未关闭 issue：本轮只扫描归档，未提单/未写回（写回需 force_check 强制执行）' : '');
    await writeFile(
      resolve(dir, fullFileName),
      `# 失效链接检查完全版报告 · ${entry.projectName}（${entry.projectId}）\n\n- 检查时间：${startedAt}${modeNote}\n\n` + detailLines(entry).join('\n') + '\n',
      'utf8'
    );
    await writeFile(
      resolve(dir, `${entry.projectId}-brief.md`),
      `# 失效链接检查简短报告 · ${entry.projectName}（${entry.projectId}）\n\n- 检查时间：${startedAt}${modeNote}\n- 数据源：${entry.repo}（${entry.branch} 分支）\n- 结论：${entry.verdict}\n\n` + briefLines(entry).join('\n') + '\n',
      'utf8'
    );
    entry.reports = { full: `scheduled-reports/links/${dateStr}/${fullFileName}`, brief: `scheduled-reports/links/${dateStr}/${entry.projectId}-brief.md` };
    if (!issueList.length && !pre.scanOnly) {
      console.log(`[links] ${project.id}: 失效链接均不在提单口径内（非 ${ISSUE_STATUS_LABEL}），只记报告不提 issue`);
    }
  }
  if (pre.scanOnly) {
    // 查重命中且非强制：扫描与归档已完成，本轮不做任何 issue 写回——
    // 不新建（防重复提单）、不更新、不评论 /close（写回一律留给 --force 强制执行）
    entry.issueAction = 'existing-open';
    entry.existingIssueUrl = pre.existing[0]?.html_url || null;
    console.log(`[links] ${project.id}: 已有未关闭 issue，本轮只扫描归档，未提单/未写回`);
  } else if (issueList.length) {
    const title = issueTitleFor(entry, issueList);
    const body = issueBodyFor(entry, fullFileName, issueList);
    // 强制模式下查重命中 → 更新原 issue；否则新建（分支在 reconcileIssue 内）
    const outcome = await reconcileIssue({ target, existing: pre.existing, canWrite: pre.canSubmit, hasIssue: true, title, body, dryRun, logPrefix: `[links] ${project.id}` });
    entry.issueAction = outcome.action;
    if (outcome.url) entry.issueUrl = outcome.url;
  } else if (pre.existing.length) {
    // 提单口径内无问题且已有未关闭 issue（仅强制模式会走到）：clone 成功且确实探测了链接才算有效复检，
    // 才评论 /close。口径说明：issue 只跟踪 issueStatuses（默认 404），其余失效状态仍存续时不阻碍关闭。
    const outcome = await reconcileIssue({
      target,
      existing: pre.existing,
      canWrite: pre.canSubmit,
      hasIssue: false,
      verifiedClean: (entry.checks.checkedUrls || 0) > 0,
      closeBody: closeIssueCommentBody(`失效链接检查（${ISSUE_STATUS_LABEL}）`, dateStr),
      dryRun,
      logPrefix: `[links] ${project.id}`,
    });
    if (outcome.action !== 'none') entry.issueAction = outcome.action;
    if (outcome.url) entry.issueUrl = outcome.url;
  } else if (!hasBrokenLinks(entry)) {
    console.log(`[links] ${project.id}: 未发现失效链接，不提 issue`);
  }
  results.push(entry);
}

// ---- stats + Markdown 报告 ----

const report = { timestamp: startedAt, measure: 'link-check', mode: submitIssues ? `submit-issues${dryRun ? '-dry-run' : ''}${force ? '-force' : ''}` : 'scan', results };
const statsPath = await writeStats('link-stats', report);

function overviewRow(r) {
  const name = `${r.projectName}（${r.projectId}）`;
  if (r.notConfigured) return `| ${name} | 未配置 linkScan | - | - | - | ➖ |`;
  if (r.skipped) return `| ${name} | ${r.repo} | - | - | - | ⏭️ 查重查询失败跳过 |`;
  const c = r.checks;
  if (r.scanError) return `| ${name} | \`${r.repo}\`（${r.branch}） | - | - | - | ❌ clone 失败：${r.scanError} |`;
  const tag = r.issueUrl
    ? `，[issue](${r.issueUrl})`
    : r.issueAction === 'dry-run'
      ? '（dry-run 未提交）'
      : r.issueAction === 'print-only'
        ? '（未提单：无 token 或查重降级）'
        : r.issueAction === 'existing-open'
          ? `（${r.existingIssueUrl ? `[已有未关闭 issue](${r.existingIssueUrl})，` : '已有未关闭 issue，'}本轮只扫描归档未提单）`
          : submitIssues && (c.brokenUrls || 0) > 0 && !issueBroken(r).length
            ? `（仅非 ${ISSUE_STATUS_LABEL} 状态，未提单）`
            : '';
  return `| ${name} | \`${r.repo}\`（${r.branch}） | ${c.scannedFiles} | ${c.linkOccurrences} / ${c.checkedUrls} | ${c.brokenUrls} / ${c.brokenOccurrences} | ${r.verdict}${tag} |`;
}

const lines = [];
lines.push('# 失效链接检查报告');
lines.push('');
lines.push(`- 检查时间：${startedAt}`);
lines.push(`- 检查范围：projects.config.json 中配置了 linkScan 的 ${results.filter((r) => !r.notConfigured).length} 个项目（共 ${results.length} 个，未配置的记 ➖ 不扫描）${results.some((r) => r.skipped) ? `（查重查询失败未扫描：${results.filter((r) => r.skipped).map((r) => r.projectId).join('、')}）` : ''}`);
lines.push(`- 运行模式：${submitIssues ? `提 issue（--submit-issues${dryRun ? '，dry-run' : ''}${force ? '，--force 强制执行：已有未关闭 issue 时更新原 issue 或评论 /close' : '，已有未关闭 issue 的项目只扫描归档不写回'}）` : '常规检查'}${maxLinks ? `，--max=${maxLinks} 试跑截断` : ''}`);
lines.push(`- 探测参数：并发 ${workers}、超时 ${LINK_RULES.timeoutSeconds}s、抖动 ${LINK_RULES.delaySeconds}s（scripts/config/check-rules.json 的 links 段）`);
if (siteId) lines.push(`- 指定项目：--site=${siteId}`);
lines.push('- 数据源与判定：clone 各项目源码仓（repo 的 AtomGit 同名镜像 + linkScan.branch 分支，浅克隆 depth=1）→ 扫描 .js/.ts/.jsx/.tsx/.vue/.html/.css/.md/.txt 文件提取 URL（变量拼接链接、图片、API 目录跳过）→ 唯一 URL 去重后 HEAD/GET 探测（<400 为有效，跟随重定向，网络错误计失效）');
lines.push('- 特殊约定：仅探测唯一 URL、引用位置映射回报告；clone 失败只记报告不提单（检查侧配置问题）；未配置 linkScan 的项目不扫描、不查重、不提单');
lines.push(`- 口径说明：报告记录全部失效状态（401/403/418、网络错误等），提单仅限 ${ISSUE_STATUS_LABEL} 状态（check-rules.json 的 links.issueStatuses，可调）；未列入提单口径的失效链接只进报告不提 issue`);
lines.push(`- 机器可读结果：scripts/stats/link-stats.json`);
lines.push('');
lines.push('## 总览');
lines.push('');
lines.push('| 项目 | 数据源 | 扫描文件 | 链接（引用/URL） | 失效（URL/引用） | 结论 |');
lines.push('| --- | --- | --- | --- | --- | --- |');
for (const r of results) lines.push(overviewRow(r));
lines.push('');
if (submitIssues) {
  lines.push('## 各项目明细');
  lines.push('');
  lines.push('（提 issue 模式下本汇总报告仅保留总览，各项目完整明细见本目录下 `<项目ID>-full.md`）');
  lines.push('');
  for (const r of results.filter(hasBrokenLinks)) {
    const extra = r.issueUrl
      ? `，issue：${r.issueUrl}`
      : r.issueAction === 'dry-run'
        ? '，（dry-run 未提交）'
        : r.issueAction === 'print-only'
          ? '，（未提单：无 token 或查重降级）'
          : r.issueAction === 'existing-open'
            ? `，（已有未关闭 issue${r.existingIssueUrl ? `：${r.existingIssueUrl}` : ''}，本轮只扫描归档未提单）`
            : !issueBroken(r).length
              ? `，（仅非 ${ISSUE_STATUS_LABEL} 状态，未提单）`
              : '';
    lines.push(`- ${r.projectName}（${r.projectId}）：\`${r.reports.full}\`${extra}`);
  }
} else {
  lines.push('## 各项目明细');
  for (const r of results) {
    lines.push('');
    lines.push(`### ${r.projectName}（${r.projectId}） — ${r.verdict}`);
    lines.push('');
    if (r.notConfigured) {
      lines.push('- 未配置 linkScan，不扫描');
      continue;
    }
    if (r.scanError) {
      lines.push(`- ❌ clone 失败：${r.scanError}`);
      continue;
    }
    lines.push(...detailLines(r).slice(4));
  }
}
lines.push('');
lines.push('## 结论与建议');
lines.push('');
const bad = results.filter((r) => hasBrokenLinks(r));
const reportOnly = results.filter((r) => hasBrokenLinks(r) && !issueBroken(r).length && r.issueAction !== 'existing-open');
const skipped = results.filter((r) => r.skipped);
const failed = results.filter((r) => r.scanError);
const clean = results.filter((r) => !r.skipped && !r.notConfigured && !r.scanError && !(r.checks?.brokenUrls || 0));
const dupHeld = results.filter((r) => r.issueAction === 'existing-open');
const dupHeldClean = dupHeld.filter((r) => !r.scanError && !(r.checks.brokenUrls || 0));
if (bad.length) lines.push(`- 存在失效链接：${bad.map((r) => `${r.projectId}（${r.checks.brokenUrls} 个）`).join('、')}，需按完全版报告修复。`);
if (reportOnly.length) lines.push(`- 其中失效链接均不在提单口径内（非 ${ISSUE_STATUS_LABEL}），只记报告未提 issue：${reportOnly.map((r) => `${r.projectId}（${r.checks.brokenUrls} 个）`).join('、')}。`);
if (clean.length) lines.push(`- 未发现失效链接：${clean.map((r) => r.projectId).join('、')}。`);
if (failed.length) lines.push(`- clone 失败（检查侧配置问题，不提单）：${failed.map((r) => `${r.projectId}（${r.scanError}）`).join('、')}，请核对 repo/branch 配置。`);
if (skipped.length) lines.push(`- 查重查询失败，为避免重复提单本次未扫描：${skipped.map((r) => r.projectId).join('、')}。`);
if (dupHeld.length) lines.push(`- 已有未关闭 issue，本轮照常扫描归档但未提单/未写回：${dupHeld.map((r) => `${r.projectId}（${r.scanError ? 'clone 失败' : `${r.checks.brokenUrls || 0} 个失效链接`}）`).join('、')}。需更新或关闭原 issue 请手动运行 workflow 并勾选 force_check。`);
if (dupHeldClean.length) lines.push(`- 其中复检已未再发现失效链接（可 force_check 强制复核，通过后会在原 issue 评论 /close 关闭）：${dupHeldClean.map((r) => r.projectId).join('、')}。`);
const reopened = results.filter((r) => r.issueAction === 'updated');
if (reopened.length) lines.push(`- 强制复检仍有问题，已更新原 issue：${reopened.map((r) => r.projectId).join('、')}。`);
const closedList = results.filter((r) => r.issueAction === 'close-commented' || r.issueAction === 'close-dry-run');
if (closedList.length) lines.push(`- 强制复检问题已消除，${dryRun ? '将' : '已'}评论 /close 关闭原 issue：${closedList.map((r) => r.projectId).join('、')}。`);
lines.push('');
lines.push(`> 注：本报告由 scripts/checks/check-links.mjs 自动生成（同批次数据见 scripts/stats/link-stats.json）。网络错误可能来自临时故障或目标站点对探测的拦截，修复建议仍需人工复核，见 measures/11-broken-link/检测方式.md。${submitIssues && !dryRun ? `存在 ${ISSUE_STATUS_LABEL} 失效链接的项目已按 --submit-issues 流程提 issue（clone 失败、未配置与已有未关闭 issue 的项目不提单；非 ${ISSUE_STATUS_LABEL} 状态的失效链接只记报告不提单）。` : ''}`);

const reportPath = resolve(dir, reportName);
await writeFile(reportPath, lines.join('\n') + '\n', 'utf8');

console.log(`[links] 检查完成，${results.length} 个项目（配置 linkScan：${results.filter((r) => !r.notConfigured).length}），结果已写入 ${statsPath}`);
console.log(`[links] 检查报告 -> ${reportPath}`);
console.log(
  JSON.stringify(
    results.map((r) => {
      const c = r.checks || {};
      return {
        id: r.projectId,
        verdict: r.verdict,
        skipped: !!r.skipped,
        notConfigured: !!r.notConfigured,
        scanError: r.scanError || null,
        files: c.scannedFiles,
        occurrences: c.linkOccurrences,
        checkedUrls: c.checkedUrls,
        brokenUrls: c.brokenUrls,
        issueBrokenUrls: issueBroken(r).length,
        brokenOccurrences: c.brokenOccurrences,
        statusDist: c.statusDist,
        issueAction: r.issueAction,
        issueUrl: r.issueUrl,
        existingIssueUrl: r.existingIssueUrl || null,
      };
    }),
    null,
    2
  )
);
