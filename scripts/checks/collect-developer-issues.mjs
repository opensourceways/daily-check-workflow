// 开发者 issue 闭环看板采集脚本：按 scripts/config/services.json 的服务/责任人/仓库清单，
// 拉取各仓库统计窗口内创建的全部 issue（open + closed），计算闭环率 / 首次响应 / 闭环时长
// 三项 SLA 指标，按责任人聚合，全量重生成 dashboard/developer-issues-dashboard.md。
//
// 与 collect-issues-dashboard.mjs（GEO issue 看板）相互独立：
//   - 那个只跟踪各项目仓 `[GEO *]` 前缀 issue 的整改状态；
//   - 本脚本面向开发者 issue 闭环考核，统计窗口内的全部 issue（PR 不计入）。
//
// 数据源与配置（均在 scripts/config/）：
//   services.json    服务清单（服务名 / 责任人 / 仓库，源自 项目信息.xlsx）
//   developers.json  责任人 → github / atomgit 平台账号映射（展示 + 首次响应归因）
//   issue-sla.json   统计窗口起始日（since）与 SLA 阈值
//   issue-routing.json  issue 关键词划归规则（不以仓库归属为准的 issue 按关键词划归责任人）
//
// 平台约定：
//   github.com 仓库走 GitHub API（GITHUB_TOKEN 可选，opensourceways 私有仓必须）；
//   gitcode / gitee / atomgit 仓库统一按 AtomGit API 同 owner/repo 镜像采集（ATOMGIT_TOKEN 可选，私有仓必须）。
//   Action 中以上两个环境变量分别经 repo secrets HSJ_GITHUB_TOKEN / HSJ_ATOMGIT_TOKEN 注入。
//
// 口径：
//   - 统计窗口：created_at ≥ since（北京时间当日 00:00）的 issue；PR 不计入；
//   - 闭环率 = 已闭环 / 窗口内总数，目标 ≥ closureRate（默认 80%）；
//   - 首次响应：该仓库责任人在对应平台的账号已配置时（归因模式）仅统计责任人账号的首条回复，
//     责任人自建 issue 的本人操作评论（如回复机器人 /accept）同样计为响应；
//     全部未配置时降级为任意「非创建者且非机器人」的首条评论；
//   - 响应达标 = 响应时长 ≤ firstResponseHours（默认 24h）；闭环达标 = 闭环时长 ≤ closureHours（默认 120h）；
//   - 超时未响应 = open 且无响应且龄期超 firstResponseHours；超时未闭环 = open 且龄期超 closureHours；
//   - 评论拉取失败的 issue：响应指标按「未知」处理，不参与达标率分母，详情表标 ⚠️；
//   - 多责任人服务（如 openMind 官网）计入每位责任人的指标（详情表在各自分区重复展示）。
//   - 关键词划归：标题/正文命中 issue-routing.json 规则的 issue 改计入规则 owner
//     （如 [GEO *] / 【GEO】 整改 issue 统一划归张峻玮），不再计入原仓库责任人；
//     首次响应亦按规则 owner 的平台账号归因；详情表以 🔄 标注划归去向。
//
// CLI：--since=YYYY-MM-DD（临时覆盖窗口起点） --developer=姓名（只采集其名下服务）
//      --service=<services.json 里的 id>（单服务调试）
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listIssues as atomgitListIssues, listIssueComments as atomgitListComments } from '../lib/atomgit.mjs';
import { listIssues as githubListIssues, listIssueComments as githubListComments } from '../lib/github.mjs';
import { writeStats, now } from '../lib/report.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const OUTPUT = resolve(ROOT, 'dashboard', 'developer-issues-dashboard.md');
const SERVICES_FILE = resolve(__dirname, '..', 'config', 'services.json');
const DEVELOPERS_FILE = resolve(__dirname, '..', 'config', 'developers.json');
const SLA_FILE = resolve(__dirname, '..', 'config', 'issue-sla.json');
const ROUTING_FILE = resolve(__dirname, '..', 'config', 'issue-routing.json');

const MAX_PAGES = 10; // 单仓库最多翻 10 页（1000 条），超出截断并在看板标注
const COMMENT_DELAY_MS = 500; // 评论拉取间隔节流（AtomGit 匿名限流较紧，约 120 次/分钟档）
const DEFAULT_SLA = { closureRate: 0.8, firstResponseHours: 24, closureHours: 120 };

// ---- 基础工具 ----

function arg(name) {
  const p = process.argv.find((a) => a.startsWith(`--${name}=`));
  return p ? p.slice(name.length + 3) : '';
}

async function loadJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function esc(cell) {
  return String(cell ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function dateOnly(iso) {
  return iso ? String(iso).slice(0, 10) : '-';
}

function fmtH(hours) {
  if (hours == null || !Number.isFinite(hours)) return '—';
  return hours < 48 ? `${hours.toFixed(1)}h` : `${(hours / 24).toFixed(1)}d`;
}

function pct(part, total) {
  return total ? `${Math.round((part / total) * 100)}%` : '—';
}

function mean(list) {
  return list.length ? list.reduce((a, b) => a + b, 0) / list.length : null;
}

const BOT_LOGIN_RE = /(\[bot\]|[-_]bot$|^bot[-_]|^bot$|[-_]robot$|^robot[-_]|^robot$|github-actions)/i;
function isBotLogin(login) {
  return !login || BOT_LOGIN_RE.test(login);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// AtomGit 匿名限流较紧（连续评论拉取易 429）：统一退避重试
async function rateLimited(fn, tries = 5) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt < tries && /\b429\b/.test(String(err?.message || err))) {
        await sleep(2000 * attempt);
        continue;
      }
      throw err;
    }
  }
}

// 原始报错 → 平台 + 状态码的简短提示（完整报错留在 stats JSON）
function briefError(err) {
  const msg = String(err?.message || err);
  const m = msg.match(/^(\w+) GET .*? failed: (\d{3})/);
  if (m) return `${m[1] === 'github' ? 'GitHub' : 'AtomGit'} ${m[2]}`;
  return msg.slice(0, 120);
}

// ---- issue 归一化（GitHub / AtomGit 两平台字段差异在此抹平）----

function normIssue(raw, platform, target) {
  const state = String(raw.state || '').toLowerCase();
  // AtomGit 闭环时间为 finished_at（无 closed_at）；progressing 等中间态视为未闭环
  const closedAt = raw.closed_at || raw.finished_at || null;
  const webBase = platform === 'github' ? 'https://github.com' : 'https://atomgit.com';
  return {
    number: String(raw.number ?? ''),
    title: typeof raw.title === 'string' && raw.title.trim() ? raw.title : '(无标题)',
    url: raw.html_url || `${webBase}/${target.owner}/${target.repo}/issues/${raw.number}`,
    closed: state === 'closed' || !!closedAt,
    createdAt: raw.created_at || '',
    updatedAt: raw.updated_at || raw.created_at || '',
    closedAt: closedAt || null,
    author: raw.user?.login || '',
    body: typeof raw.body === 'string' ? raw.body : '', // 关键词划归匹配用（标题 + 正文）
    commentsCount: Number(raw.comments || 0),
    firstResponse: null, // { author, at, mode: 'dev' | 'any' }
    commentError: '',
  };
}

function friendlyError(platform, err) {
  const code = (String(err?.message || err).match(/\b(4\d\d|5\d\d)\b/) || [])[1] || '';
  const label = platform === 'github' ? 'GitHub' : 'AtomGit';
  if (platform === 'github') {
    if (code === '404') return `GitHub 404：仓库不存在或为私有仓（需 repo secret HSJ_GITHUB_TOKEN——HSJ 账号且有 opensourceways 组织读权限的 PAT）`;
    if (code === '403') return `GitHub 403：匿名限额耗尽或私有仓无权限`;
    if (code === '429') return `GitHub 429：请求过于频繁（退避重试后仍失败）`;
  } else {
    if (code === '404') return `AtomGit 404：无此仓库（github / gitee 源仓库在 AtomGit 无同名镜像）`;
    if (code === '403') return `AtomGit 403：私有仓或无权限（需 repo secret HSJ_ATOMGIT_TOKEN）`;
    if (code === '429') return `AtomGit 429：请求过于频繁（退避重试后仍失败）`;
  }
  return `${label}${code ? ` ${code}` : ''}：${String(err?.message || err).slice(0, 120)}`;
}

// ---- issue 列表拉取（窗口早停：两平台列表均按创建时间倒序返回）----

async function fetchWindowIssues(platform, target, sinceMs, state = 'all') {
  const listIssues = platform === 'github' ? githubListIssues : atomgitListIssues;
  const issues = [];
  let truncated = false;
  for (let page = 1; page <= MAX_PAGES; page++) {
    const batch = await rateLimited(() => listIssues({ owner: target.owner, repo: target.repo, state, page }));
    if (!Array.isArray(batch)) break;
    for (const raw of batch) {
      if (platform === 'github' && raw.pull_request) continue; // GitHub issues 列表混有 PR
      const issue = normIssue(raw, platform, target);
      if (Date.parse(issue.createdAt) >= sinceMs) issues.push(issue);
    }
    if (batch.length < 100) break;
    // 批内最后一条为当前批最旧，早于窗口起点即可早停（后续页只会更旧）
    if (Date.parse(batch[batch.length - 1]?.created_at || 0) < sinceMs) break;
    if (page === MAX_PAGES) truncated = true;
  }
  return { issues, truncated };
}

async function fetchIssuesResilient(platform, target, sinceMs) {
  try {
    return await fetchWindowIssues(platform, target, sinceMs, 'all');
  } catch (err) {
    if (platform !== 'atomgit') throw err;
    // 防御：AtomGit 某些版本不支持 state=all 时，退回 open / closed 分别翻页合并
    const openRes = await fetchWindowIssues(platform, target, sinceMs, 'open');
    const closedRes = await fetchWindowIssues(platform, target, sinceMs, 'closed');
    const seen = new Set(openRes.issues.map((i) => i.number));
    const issues = [...openRes.issues, ...closedRes.issues.filter((i) => !seen.has(i.number))];
    return { issues, truncated: openRes.truncated || closedRes.truncated };
  }
}

// ---- 首次响应判定 ----

function devLoginsFor(owners, platform, developersByName) {
  const set = new Set();
  for (const name of owners) {
    const id = developersByName.get(name)?.[platform];
    if (id && String(id).trim()) set.add(String(id).trim().toLowerCase());
  }
  return set;
}

// ---- 关键词划归（scripts/config/issue-routing.json）----

// 命中规则的 issue 改按规则 owner 统计与归因；未命中走仓库归属（services.json 的 owners）
function matchRoutingRule(issue, rules) {
  if (!rules.length) return null;
  const text = `${issue.title || ''}\n${issue.body || ''}`;
  for (const rule of rules) {
    if (rule.keyword && text.includes(rule.keyword)) return rule;
  }
  return null;
}

async function fetchFirstResponse(platform, target, issue, devLogins) {
  if (!issue.commentsCount) return null; // 两平台均有 comments 计数，为 0 免拉评论
  const listComments = platform === 'github' ? githubListComments : atomgitListComments;
  const rawComments = await rateLimited(() =>
    listComments({ owner: target.owner, repo: target.repo, issue_number: issue.number })
  );
  const comments = (Array.isArray(rawComments) ? rawComments : [])
    .map((c) => ({ author: c?.user?.login || '', at: c?.created_at || '' }))
    .filter((c) => c.at)
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at)); // AtomGit 评论倒序返回，必须自排序取最早
  // 归因模式：责任人平台 ID 已配置 → 只认责任人账号的首条回复；责任人自建 issue（作者=责任人）时，
  // 其本人的操作评论（如回复机器人 /accept）同样计为响应，不因「非创建者」被排除
  if (devLogins.size) {
    const byDev = comments.find((c) => c.author && !isBotLogin(c.author) && devLogins.has(c.author.toLowerCase()));
    return byDev ? { author: byDev.author, at: byDev.at, mode: 'dev' } : null;
  }
  // 降级口径：任意「非创建者且非机器人」的首条评论
  const eligible = comments.find((c) => c.author && c.author !== issue.author && !isBotLogin(c.author));
  return eligible ? { author: eligible.author, at: eligible.at, mode: 'any' } : null;
}

// ---- 指标 ----

function metricsFor(issue, sla, nowMs) {
  const createdMs = Date.parse(issue.createdAt) || 0;
  const respMs = issue.firstResponse ? Date.parse(issue.firstResponse.at) : null;
  const closedMs = issue.closedAt ? Date.parse(issue.closedAt) : null;
  const respH = respMs != null ? (respMs - createdMs) / 3.6e6 : null;
  const closeH = closedMs != null ? (closedMs - createdMs) / 3.6e6 : null;
  const ageH = (nowMs - createdMs) / 3.6e6;
  const flags = [];
  if (!issue.commentError) {
    if (respH != null && respH > sla.firstResponseHours) flags.push(`响应超${sla.firstResponseHours}h`);
    if (!issue.closed && respH == null && ageH > sla.firstResponseHours) flags.push(`超${sla.firstResponseHours}h未响应`);
  }
  if (closeH != null && closeH > sla.closureHours) flags.push(`闭环超${sla.closureHours}h`);
  if (!issue.closed && ageH > sla.closureHours) flags.push(`超${sla.closureHours}h未闭环`);
  return { respH, closeH, ageH, flags };
}

async function collectService(svc, ctx) {
  const { sinceMs, sla, developersByName, routingRules } = ctx;
  const target = { owner: svc.repo.owner, repo: svc.repo.repo };
  const platform = svc.repo.platform;
  const entry = {
    id: svc.id,
    name: svc.name,
    owners: svc.owners,
    platform,
    repoUrl: svc.repo.url,
    error: '',
    truncated: false,
    attribution: 'any',
    issues: [],
  };
  let res;
  try {
    res = await fetchIssuesResilient(platform, target, sinceMs);
  } catch (err) {
    entry.error = friendlyError(platform, err);
    entry.rawError = String(err?.message || err).slice(0, 400);
    return entry;
  }
  entry.truncated = res.truncated;
  const devLogins = devLoginsFor(svc.owners, platform, developersByName);
  entry.attribution = devLogins.size ? 'dev' : 'any';
  const nowMs = Date.now();
  for (const issue of res.issues) {
    // 关键词划归：命中规则的 issue 有效归属改为规则 owner（首次响应也按其平台账号归因）
    const rule = matchRoutingRule(issue, routingRules);
    issue.routedTo = rule ? rule.owner : '';
    issue.routedBy = rule ? rule.keyword : '';
    issue.owners = rule ? [rule.owner] : svc.owners;
    const issueDevLogins = rule ? devLoginsFor(issue.owners, platform, developersByName) : devLogins;
    if (issue.commentsCount) {
      try {
        issue.firstResponse = await fetchFirstResponse(platform, target, issue, issueDevLogins);
        await sleep(COMMENT_DELAY_MS); // AtomGit 匿名限流较紧，评论拉取间隔节流
      } catch (err) {
        issue.commentError = briefError(err);
      }
    }
    issue.metrics = metricsFor(issue, sla, nowMs);
    entry.issues.push(issue);
  }
  return entry;
}

// ---- 责任人聚合 ----

function aggregateDeveloper(devName, ids, serviceResults, sla) {
  const mine = serviceResults.filter((r) => r.owners.includes(devName));
  const failed = mine.filter((r) => r.error);
  // 指标口径：有效归属（issue.owners）含本人 —— 名下未被划走的 issue + 任何仓库按关键词划归给本人的 issue
  const issues = serviceResults
    .filter((r) => !r.error)
    .flatMap((r) => r.issues.filter((i) => (i.owners || []).includes(devName)));
  // 详情展示：非名下仓库中含划归给本人 issue 的服务（分区只展示划归 issue）
  const routedFrom = serviceResults.filter(
    (r) => !r.error && !r.owners.includes(devName) && r.issues.some((i) => i.routedTo === devName)
  );
  const closed = issues.filter((i) => i.closed);
  const responded = issues.filter((i) => i.firstResponse);
  const respOnTime = responded.filter((i) => i.metrics.respH <= sla.firstResponseHours);
  const respOverdue = issues.filter((i) => !i.closed && !i.firstResponse && !i.commentError && i.metrics.ageH > sla.firstResponseHours);
  const closedOnTime = closed.filter((i) => i.metrics.closeH <= sla.closureHours);
  const closeOverdue = issues.filter((i) => !i.closed && i.metrics.ageH > sla.closureHours);
  const closureRate = issues.length ? closed.length / issues.length : null;
  let overall = '—';
  if (issues.length) {
    if (closureRate < sla.closureRate) overall = '❌';
    else if (respOverdue.length || closeOverdue.length) overall = '🟡';
    else overall = '✅';
  } else if (failed.length) {
    overall = '⚠️';
  }
  return {
    name: devName,
    ids,
    services: mine,
    routedFrom,
    failedServices: failed,
    total: issues.length,
    open: issues.length - closed.length,
    closed: closed.length,
    closureRate,
    responded: responded.length,
    respOnTime: respOnTime.length,
    respOnTimeRate: responded.length ? respOnTime.length / responded.length : null,
    avgRespH: mean(responded.map((i) => i.metrics.respH)),
    respOverdue: respOverdue.length,
    closedOnTime: closedOnTime.length,
    closedOnTimeRate: closed.length ? closedOnTime.length / closed.length : null,
    avgCloseH: mean(closed.map((i) => i.metrics.closeH)),
    closeOverdue: closeOverdue.length,
    unknownResp: issues.filter((i) => i.commentError).length,
    overall,
  };
}

// ---- 渲染 ----

function platformIdCell(agg) {
  const gh = agg.ids?.github ? `[@${agg.ids.github}](https://github.com/${agg.ids.github})` : 'gh:未配置';
  const ag = agg.ids?.atomgit ? `[@${agg.ids.atomgit}](https://atomgit.com/${agg.ids.atomgit})` : 'ag:未配置';
  return `${esc(agg.name)}<br>${gh} · ${ag}`;
}

function renderOverview(aggs, sla) {
  const lines = [];
  lines.push(`| 责任人 | 仓库 | 窗口内 issue | 未关闭 | 已闭环 | 闭环率（≥${Math.round(sla.closureRate * 100)}%） | 响应≤${sla.firstResponseHours}h² | 平均响应 | 超时未响应 | 闭环≤${sla.closureHours}h³ | 平均闭环 | 超时未闭环 | 综合 |`);
  lines.push('|------|------|------|------|------|------|------|------|------|------|------|------|------|');
  for (const a of aggs) {
    const repoCell =
      a.services.length +
      (a.failedServices.length ? `（⚠️${a.failedServices.length} 失败）` : '') +
      (a.routedFrom.length ? `（🔄${a.routedFrom.length}）` : '');
    const closureCell = a.total ? `${pct(a.closed, a.total)}（${a.closed}/${a.total}）${a.closureRate >= sla.closureRate ? '✅' : '❌'}` : '—';
    const respCell = a.responded ? `${pct(a.respOnTime, a.responded)}（${a.respOnTime}/${a.responded}）` : '—';
    const closeRateCell = a.closed ? `${pct(a.closedOnTime, a.closed)}（${a.closedOnTime}/${a.closed}）` : '—';
    lines.push(
      `| ${platformIdCell(a)} | ${repoCell} | ${a.total} | ${a.open} | ${a.closed} | ${closureCell} | ${respCell} | ${fmtH(a.avgRespH)} | ${a.respOverdue} | ${closeRateCell} | ${fmtH(a.avgCloseH)} | ${a.closeOverdue} | ${a.overall} |`
    );
  }
  return lines.join('\n');
}

function renderServiceSection(r, sla, opts = {}) {
  const lines = [];
  const target = `${r.owners.length > 1 ? `${r.owners.join('、')} · ` : ''}${r.repoUrl}`;
  lines.push(`### ${esc(r.name)}（${r.id.slice(r.id.indexOf('/') + 1)} · ${r.platform}）`);
  lines.push('');
  if (r.error) {
    lines.push(`> ⚠️ 采集失败：${esc(r.error)}`);
    lines.push('');
    return lines.join('\n');
  }
  // opts.owner：非名下仓库的「划归视角」——只展示按关键词划归给该责任人的 issue
  const shown = opts.owner ? r.issues.filter((i) => i.routedTo === opts.owner) : r.issues;
  const routedCount = r.issues.filter((i) => i.routedTo).length;
  const attrText = r.attribution === 'dev'
    ? '责任人账号首条回复（归因模式，其自建 issue 的本人操作评论如 /accept 也计为响应；ID 见 scripts/config/developers.json）'
    : '任意非创建者首条评论（责任人平台 ID 未配置，降级口径）';
  const bits = [`首次响应口径：${attrText}`];
  if (r.truncated) bits.push(`⚠️ issue 超过 ${MAX_PAGES * 100} 条被截断，指标为部分统计`);
  if (opts.owner) bits.push(`🔄 非本责任人名下仓库，仅展示关键词划归 issue（规则：scripts/config/issue-routing.json）`);
  else if (routedCount) bits.push(`🔄 ${routedCount} 条 issue 已按关键词划归他人（🔄→ 责任人），不计入本仓责任人指标`);
  lines.push(`> ${bits.join(' ｜ ')}`);
  lines.push('');
  if (!shown.length) {
    lines.push('_统计窗口内无 issue。_');
    lines.push('');
    return lines.join('\n');
  }
  lines.push('| Issue | 状态 | 创建时间 | 首次响应 | 响应人 | 响应时长 | 闭环时长 / 龄期 | SLA |');
  lines.push('|------|------|----------|----------|--------|----------|----------------|-----|');
  const sorted = [...shown].sort((a, b) => Number(a.closed) - Number(b.closed) || String(a.createdAt).localeCompare(String(b.createdAt)));
  for (const i of sorted) {
    const stateCell = i.closed ? '已闭环' : '未关闭';
    let respAtCell = '—（未响应）';
    if (i.commentError) respAtCell = `⚠️ 拉取失败（${esc(i.commentError)}）`;
    else if (i.firstResponse) respAtCell = dateOnly(i.firstResponse.at);
    const respAuthor = i.firstResponse ? `@${esc(i.firstResponse.author)}` : '—';
    const durationCell = i.closed ? fmtH(i.metrics.closeH) : `开启 ${fmtH(i.metrics.ageH)}`;
    const slaCell = i.metrics.flags.length ? `🔴 ${i.metrics.flags.join('；')}` : i.closed ? '✅' : '🟢';
    const routedTag = i.routedTo ? ` 🔄→${esc(i.routedTo)}` : '';
    lines.push(
      `| [#${i.number}](${i.url}) ${esc(i.title)}${routedTag} | ${stateCell} | ${dateOnly(i.createdAt)} | ${respAtCell} | ${respAuthor} | ${fmtH(i.metrics.respH)} | ${durationCell} | ${slaCell} |`
    );
  }
  lines.push('');
  return lines.join('\n');
}

function renderDeveloperSection(a, sla) {
  const lines = [];
  lines.push(`## ${esc(a.name)}`);
  lines.push('');
  const gh = a.ids?.github ? `GitHub [@${a.ids.github}](https://github.com/${a.ids.github})` : 'GitHub 未配置';
  const ag = a.ids?.atomgit ? `AtomGit [@${a.ids.atomgit}](https://atomgit.com/${a.ids.atomgit})` : 'AtomGit 未配置';
  lines.push(`> 平台账号：${gh} · ${ag}（ID 在 scripts/config/developers.json 维护，未配置时首次响应按降级口径）`);
  if (a.failedServices.length) {
    const failedList = a.failedServices.map((s) => `${s.name}（${esc(s.error.slice(0, 120))}）`).join('、');
    lines.push(`> ⚠️ ${a.failedServices.length} 个仓库本次采集失败，其 issue 未计入指标：${failedList}`);
  }
  lines.push('');
  for (const svc of a.services) {
    lines.push(renderServiceSection(svc, sla));
  }
  for (const svc of a.routedFrom || []) {
    lines.push(renderServiceSection(svc, sla, { owner: a.name }));
  }
  return lines.join('\n').trimEnd();
}

// ---- 主流程 ----

const servicesConfig = await loadJson(SERVICES_FILE);
if (!servicesConfig?.services?.length) {
  console.error('[developer-issues] scripts/config/services.json 缺失或为空，无法采集');
  process.exit(1);
}
const services = servicesConfig.services;

const developersConfig = await loadJson(DEVELOPERS_FILE);
if (!developersConfig?.developers?.length) {
  console.log('[developer-issues] scripts/config/developers.json 缺失或为空：首次响应全部按降级口径（任意非创建者评论）');
}
const developersByName = new Map((developersConfig?.developers || []).map((d) => [d.name, d]));

const slaConfig = (await loadJson(SLA_FILE)) || {};
const sla = { ...DEFAULT_SLA, ...(slaConfig.sla || {}) };

// 关键词划归规则（issue-routing.json）：不以仓库归属为准的 issue 按规则划归
const routingConfig = (await loadJson(ROUTING_FILE)) || {};
const routingRules = (Array.isArray(routingConfig.rules) ? routingConfig.rules : [])
  .filter((r) => r && typeof r.keyword === 'string' && r.keyword && typeof r.owner === 'string' && r.owner);
if (Array.isArray(routingConfig.rules) && routingConfig.rules.length !== routingRules.length) {
  console.log('[developer-issues] ⚠️ issue-routing.json 存在非法规则（缺 keyword/owner），已忽略');
}
if (routingRules.length) {
  const ruleText = routingRules.map((r) => `“${r.keyword}”→${r.owner}`).join('、');
  console.log(`[developer-issues] 划归规则 ${routingRules.length} 条：${ruleText}`);
}

const sinceStr = arg('since') || slaConfig.since || '';
if (!/^\d{4}-\d{2}-\d{2}$/.test(sinceStr)) {
  console.error(`[developer-issues] 统计窗口起始日非法：“${sinceStr}”（issue-sla.json 的 since 或 --since=YYYY-MM-DD）`);
  process.exit(1);
}
// since 解释为北京时间当日 00:00
const sinceMs = Date.parse(`${sinceStr}T00:00:00+08:00`);

let selected = services;
const developerFilter = arg('developer');
if (developerFilter) {
  selected = services.filter((s) => s.owners.includes(developerFilter));
  if (!selected.length) {
    console.error(`[developer-issues] 责任人 ${developerFilter} 名下无服务，可选：${[...new Set(services.flatMap((s) => s.owners))].join(', ')}`);
    process.exit(1);
  }
  console.log('[developer-issues] 提示：--developer 只采集名下服务，非名下仓库的关键词划归 issue 需全量运行才会计入');
}
const serviceFilter = arg('service');
if (serviceFilter) {
  const svc = services.find((s) => s.id === serviceFilter);
  if (!svc) {
    console.error(`[developer-issues] 未找到服务 ${serviceFilter}，可选：${services.map((s) => s.id).join(', ')}`);
    process.exit(1);
  }
  selected = [svc];
}

// 责任人清单：配置登记的 + services 里出现但未登记的 + 划归规则指定的（均看板标注提醒补录）
const devNames = [];
for (const d of developersConfig?.developers || []) if (!devNames.includes(d.name)) devNames.push(d.name);
for (const s of selected) for (const o of s.owners) if (!devNames.includes(o)) devNames.push(o);
for (const rule of routingRules) if (rule.owner && !devNames.includes(rule.owner)) devNames.push(rule.owner);
const unregistered = devNames.filter((n) => !developersByName.has(n));

console.log(`[developer-issues] 窗口起点 ${sinceStr}（北京时间），采集 ${selected.length} 个服务 / ${devNames.length} 位责任人...`);
const ctx = { sinceMs, sla, developersByName, routingRules };
const results = [];
for (const svc of selected) {
  const r = await collectService(svc, ctx);
  results.push(r);
  console.log(
    `[developer-issues] ${svc.id}: ${r.error ? `失败（${r.error.slice(0, 120)}）` : `窗口内 issue ${r.issues.length} 个（已闭环 ${r.issues.filter((i) => i.closed).length}，有响应 ${r.issues.filter((i) => i.firstResponse).length}${r.truncated ? '，⚠️截断' : ''}）`}`
  );
}

const aggregates = devNames
  .map((name) => aggregateDeveloper(name, developersByName.get(name) || {}, results, sla))
  .sort((a, b) => {
    const rank = { '❌': 0, '🟡': 1, '✅': 2, '⚠️': 3, '—': 4 };
    return (rank[a.overall] ?? 5) - (rank[b.overall] ?? 5) || a.name.localeCompare(b.name, 'zh');
  });

let md = `# 开发者 Issue 闭环看板

> 本文件由 \`scripts/checks/collect-developer-issues.mjs\` 自动生成（GitHub Action 定时执行，默认每 3 小时：北京时间 07 / 10 / 13 / 16 / 19 / 22 点），请勿手动编辑。
> 生成时间：${now()}${developerFilter || serviceFilter ? '（本次为过滤采集：' + [developerFilter && `--developer=${developerFilter}`, serviceFilter && `--service=${serviceFilter}`].filter(Boolean).join(' ') + '）' : ''}
> 统计窗口：**${sinceStr}**（北京时间当日 00:00）起创建的 issue；窗口起点与 SLA 阈值在 \`scripts/config/issue-sla.json\` 配置。
> 仓库范围：\`scripts/config/services.json\`（源自 项目信息.xlsx）；github.com 仓库走 GitHub API，gitcode / gitee / atomgit 仓库按 AtomGit 同名镜像采集。
> 关键词划归：标题/正文命中 \`scripts/config/issue-routing.json\` 规则的 issue（如 [GEO *] / 【GEO】）计入规则指定的责任人，不再计入原仓库责任人。
> 与 [GEO Issue 看板](issues-dashboard.md) 相互独立：本看板面向**全部 issue** 的开发者闭环考核，而非 \`[GEO *]\` 整改 issue。

## 责任人总览

${renderOverview(aggregates, sla)}

> ² 响应达标率 = 首次响应 ≤ ${sla.firstResponseHours}h 的 issue / 已响应 issue（分母不含评论拉取失败者；目标 100%）。
> ³ 闭环达标率 = 闭环时长 ≤ ${sla.closureHours}h 的 issue / 已闭环 issue（目标 100%）。
> 仓库列（🔄n）= 另有 n 个非名下仓库的 issue 按关键词划归计入本行指标（规则：scripts/config/issue-routing.json）。
> 综合标记：❌ 闭环率 < ${Math.round(sla.closureRate * 100)}% ｜ 🟡 闭环率达标但存在超时未响应 / 超时未闭环 ｜ ✅ 全部达标 ｜ ⚠️ 名下仓库全部采集失败 ｜ — 窗口内无 issue。

${aggregates.map((a) => renderDeveloperSection(a, sla)).join('\n\n')}

## 状态与口径说明

- **闭环率**：已闭环 / 窗口内 issue 总数，目标 ≥ ${Math.round(sla.closureRate * 100)}%；**首次响应**：机器人账号排除后，责任人平台 ID 已配置时仅统计责任人账号的首条回复（其自建 issue 上的本人操作评论如 /accept 也计为响应），未配置时降级为任意非创建者首条评论；**闭环时长**：创建 → 闭环（AtomGit 的 finished_at / GitHub 的 closed_at）。
- **超时未响应**：未关闭、无响应、龄期 > ${sla.firstResponseHours}h；**超时未闭环**：未关闭、龄期 > ${sla.closureHours}h。评论拉取失败的 issue 响应指标按「未知」处理（详情表 ⚠️），不计入超时。
- 多责任人服务（如 openMind 官网）计入每位责任人的指标，详情表在各自分区重复展示；PR 不计入。
- **关键词划归**：标题/正文命中 \`scripts/config/issue-routing.json\` 规则的 issue 计入规则指定的责任人（如 [GEO *] / 【GEO】 GEO 整改 issue），不再计入原仓库责任人；首次响应按规则责任人的平台账号归因，详情表以 🔄 标注划归去向。
- 采集失败常见原因：GitHub 私有仓（需 repo secret \`HSJ_GITHUB_TOKEN\`——HSJ 账号且有 opensourceways 组织读权限的 PAT）；AtomGit 私有仓（需 repo secret \`HSJ_ATOMGIT_TOKEN\`）；AtomGit 404 = github / gitee 源仓库无同名镜像。
- 单仓库 issue 超过 ${MAX_PAGES * 100} 条时截断并在服务分区标注（现量级不会触及）。

## 相关入口

- [服务清单](../scripts/config/services.json)（服务名 / 责任人 / 仓库）· [责任人平台 ID 映射](../scripts/config/developers.json) · [SLA 配置](../scripts/config/issue-sla.json) · [关键词划归规则](../scripts/config/issue-routing.json)
- [采集脚本](../scripts/checks/collect-developer-issues.mjs) · [定时 workflow](../.github/workflows/developer-issues-dashboard.yml)
- [GEO Issue 看板](issues-dashboard.md) · [GEO 整改看板](dashboard.md) · [总索引](../index.md)

## 更新方式

\`\`\`bash
# 全量采集并生成看板（本地无 token 时私有仓会标采集失败）
node scripts/checks/collect-developer-issues.mjs

# 临时覆盖统计窗口起点
node scripts/checks/collect-developer-issues.mjs --since=2026-11-01

# 只采集某责任人名下服务 / 单个服务（调试）
node scripts/checks/collect-developer-issues.mjs --developer=刘勇
node scripts/checks/collect-developer-issues.mjs --service=atomgit/openeuler/openEuler-portal
\`\`\`
`;

if (unregistered.length) {
  md = md.replace(
    '## 状态与口径说明',
    `## ⚠️ 待补录\n\n以下责任人出现在 scripts/config/services.json 但未在 scripts/config/developers.json 登记平台 ID（指标仍按仓库归属聚合，首次响应按降级口径）：${unregistered.join('、')}。\n\n## 状态与口径说明`
  );
}

await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, md, 'utf8');
const statsPath = await writeStats('developer-issues', {
  timestamp: now(),
  since: sinceStr,
  sla,
  filters: { developer: developerFilter || null, service: serviceFilter || null },
  results,
});
console.log(`[developer-issues] 看板已写入 ${OUTPUT}`);
console.log(`[developer-issues] stats 已写入 ${statsPath}`);
