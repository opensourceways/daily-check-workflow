// AtomGit API v5 轻量客户端(基于全局 fetch,零依赖)。
// 与重构前 main 分支旧 scripts/lib/atomgit-api.js 等价的读/写子集,供 TDK 重复提单流程使用。
// 环境变量:
//   ATOMGIT_TOKEN    写操作(建 issue)必需;私有仓列 issue 也必需
//   ATOMGIT_API_BASE 可选,默认 https://api.atomgit.com
const BASE = process.env.ATOMGIT_API_BASE || 'https://api.atomgit.com';
const API_PREFIX = '/api/v5';

function token() {
  return process.env.ATOMGIT_TOKEN || '';
}

export function hasToken() {
  return !!token();
}

function log(msg) {
  console.error(`[${new Date().toISOString().slice(11, 19)}] atomgit ${msg}`);
}

// 从 gitcode/atomgit 仓库地址解析 owner/repo;config 里 repo 形如 https://gitcode.com/<owner>/<repo>(.git)
export function parseOwnerRepo(repoUrl) {
  if (!repoUrl) return null;
  try {
    const u = new URL(repoUrl);
    const segs = u.pathname.replace(/\.git$/i, '').split('/').filter(Boolean);
    if (segs.length < 2) return null;
    return { owner: segs[segs.length - 2], repo: segs[segs.length - 1] };
  } catch {
    return null;
  }
}

async function request(path, { method = 'GET', body, params } = {}) {
  const url = new URL(API_PREFIX + path, BASE);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  const headers = { Accept: 'application/json', 'User-Agent': 'geo-workflow-checker/1.0' };
  const t = token();
  if (t) headers.Authorization = `Bearer ${t}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
  const text = await res.text();
  if (res.status >= 300) {
    throw new Error(`atomgit ${method} ${path} failed: ${res.status} ${text.slice(0, 300)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// GET /repos/{owner}/{repo}/issues?state=...  列表为 repo-scoped 路径。
// page 从 1 起(默认首页,兼容既有调用方)；列表按创建时间倒序返回(最新在前)，
// 调用方做统计窗口口径时可据此早停翻页。number 字段为字符串。
export async function listIssues({ owner, repo, state = 'open', page = 1 }) {
  const data = await request(`/repos/${owner}/${repo}/issues`, { params: { state, per_page: 100, page } });
  return Array.isArray(data) ? data : [];
}

// GET /repos/{owner}/{repo}/issues/{number}/comments  issue 评论列表(实测倒序返回,调用方按 created_at 自取最早)。
// 供开发者 issue 闭环看板判定「首次响应」。
export async function listIssueComments({ owner, repo, issue_number }) {
  const data = await request(`/repos/${owner}/${repo}/issues/${issue_number}/comments`, { params: { per_page: 100 } });
  return Array.isArray(data) ? data : [];
}

// GET /repos/{owner}/{repo}/pulls?state=...  PR 列表（同为 repo-scoped），供 issue 看板判断"是否关联 PR"
export async function listPullRequests({ owner, repo, state = 'open' }) {
  const data = await request(`/repos/${owner}/${repo}/pulls`, { params: { state, per_page: 100 } });
  return Array.isArray(data) ? data : [];
}

// 按标题前缀查找(用于查重);返回匹配 issue 数组
export async function findIssuesByTitlePrefix({ owner, repo, prefix, state = 'open' }) {
  const list = await listIssues({ owner, repo, state });
  return list.filter((i) => typeof i.title === 'string' && i.title.startsWith(prefix));
}

// POST /repos/{owner}/issues  create 为 owner-scoped,repo 放 body
export async function createIssue({ owner, repo, title, body, labels }) {
  const payload = { repo, title, body };
  if (labels && labels.length) payload.labels = Array.isArray(labels) ? labels.join(',') : labels;
  return request(`/repos/${owner}/issues`, { method: 'POST', body: payload });
}

// PATCH /repos/{owner}/{repo}/issues/{number}  更新 issue（仅传需要改的字段）。
// 用于 --force 强制执行模式：项目已有本维度未关闭 issue 且复检仍有问题时，就地刷新标题/正文为最新检查结果。
export async function updateIssue({ owner, repo, issue_number, title, body, state }) {
  const payload = {};
  if (title !== undefined) payload.title = title;
  if (body !== undefined) payload.body = body;
  if (state !== undefined) payload.state = state;
  return request(`/repos/${owner}/${repo}/issues/${issue_number}`, { method: 'PATCH', body: payload });
}

export async function addIssueComment({ owner, repo, issue_number, body }) {
  return request(`/repos/${owner}/${repo}/issues/${issue_number}/comments`, { method: 'POST', body: { body } });
}

// --force 强制执行复检通过（问题已消除）时用于关闭原 issue 的评论正文。
// 斜杠命令 /close 必须独占一行才会被解析为关闭指令，故说明文字与命令之间空一行。
export function closeIssueCommentBody(dimLabel, dateStr) {
  return `${dateStr} 强制执行复检：${dimLabel}未再发现问题，按已修复处理，自动关闭本 issue。\n\n/close`;
}

// ---- 以下两个函数为 6 个维度脚本 --submit-issues 提单流程的公共实现 ----

/**
 * 扫描前查重（各维度脚本共用）：查目标 AtomGit 仓库标题以 prefix 开头的未关闭 issue。
 * - 默认（force=false）：命中则 block=true，调用方跳过该项目整个"扫描+提单"（宁漏勿重）。
 * - 强制执行（force=true，手动 workflow_dispatch 勾选 force_check / CLI --force）：
 *   命中不拦截，照常扫描，并把已有 issue 通过 existing 带回——
 *   由后续 reconcileIssue 决定：复检仍有问题 → 更新原 issue 标题与正文；问题已消除 → 评论 /close。
 * 查询失败时：有 token（生产环境）无论是否强制都 block（无法定位更新目标，宁漏勿重）；
 * 无 token（本地试跑）→ 继续扫描但 canSubmit=false，不做任何写回。
 */
export async function precheckExistingIssues({ repoUrl, prefix, dimLabel, force = false }) {
  const parsed = parseOwnerRepo(repoUrl);
  if (!parsed) {
    return { block: false, canSubmit: false, existing: [], notes: [`repo 无法解析 owner/repo，无法查重与提单：${repoUrl || '未配置'}`] };
  }
  let existing;
  try {
    existing = await findIssuesByTitlePrefix({ ...parsed, prefix, state: 'open' });
  } catch (err) {
    if (hasToken()) {
      return { block: true, canSubmit: false, existing: [], notes: [`查询已提 issue 失败，为避免重复提单本次跳过扫描：${err.message}`] };
    }
    return { block: false, canSubmit: false, existing: [], notes: [`无 ATOMGIT_TOKEN 且查询已提 issue 失败（${err.message}），本次仅扫描不提单`] };
  }
  if (existing.length) {
    const urls = existing.map((i) => i.html_url || `${parsed.owner}/${parsed.repo}#${i.number}`).join('、');
    if (force) {
      return {
        block: false,
        canSubmit: hasToken(),
        existing,
        notes: [`已存在未关闭的 ${dimLabel} issue（#${existing[0].number}：${urls}），强制执行模式照常扫描${hasToken() ? '：仍有问题将更新该 issue，已无问题将评论 /close' : '（无 ATOMGIT_TOKEN，本次不写回 issue）'}`],
      };
    }
    return { block: true, canSubmit: false, existing, notes: [`已存在未关闭的 ${dimLabel} issue（#${existing[0].number}：${urls}），跳过本次扫描与提单`] };
  }
  if (!hasToken()) {
    return { block: false, canSubmit: false, existing: [], notes: ['未设置 ATOMGIT_TOKEN，本次查重通过但不提单'] };
  }
  return { block: false, canSubmit: true, existing: [], notes: [] };
}

/**
 * 提单/写回环节（各维度脚本共用）。入参：
 *   target        parseOwnerRepo 结果（null 时只打印不写回）
 *   existing      查重带回的未关闭 issue 列表（precheck 的 pre.existing）
 *   canWrite      precheck 的 pre.canSubmit（有 token 才 true）
 *   hasIssue      本次检查是否存在该维度问题（决定"新建/更新"还是"关闭"）
 *   verifiedClean  hasIssue=false 时是否"确实完成了有效扫描"（如页面/文件可访问）；
 *                  检查本身没跑成（抓不到数据）时不能下"问题已消除"的结论，绝不评论 /close，防止误关
 *   title/body    hasIssue=true 时的 issue 标题与正文
 *   closeBody     无问题时的 /close 评论正文（closeIssueCommentBody 生成）
 *   dryRun        true 时绝不写回，只打印将要执行的动作
 *   logPrefix     控制台前缀，如 "[tdk-dup] openEuler"
 * 行为：
 *   hasIssue=true ：已有未关闭 issue（仅强制模式会走到）→ PATCH 更新第一个的标题/正文（action=updated，
 *                   同前缀多个时只更新第一个并提示）；没有 → POST 新建（action=created）。
 *   hasIssue=false：已有未关闭 issue 且 verifiedClean → 对每个 issue POST /close 评论（action=close-commented）。
 *   不可写回（dry-run/无 token/解析失败）→ 仅打印（action=dry-run 或 close-dry-run）。
 */
export async function reconcileIssue({ target, existing = [], canWrite = false, hasIssue, verifiedClean = true, title = '', body = '', closeBody = '', dryRun = false, logPrefix = '[issue]' }) {
  const log = (m) => console.log(`${logPrefix}: ${m}`);
  const open = existing[0] || null;
  const writable = !dryRun && !!target && canWrite;
  if (hasIssue) {
    if (!writable) {
      console.log(`\n${logPrefix} ${dryRun ? '[dry-run] ' : ''}将${open ? `更新 issue #${open.number}` : '提交 issue'}：${title}`);
      console.log(body);
      // 保留各维度脚本原有语义：dry-run 与"无 token/解析失败的仅打印"分开标记
      return { action: dryRun ? 'dry-run' : 'print-only' };
    }
    if (open) {
      // 强制执行且查重命中：就地更新原 issue（不新建）；多个同前缀 open issue 只更新第一个并提示
      await updateIssue({ ...target, issue_number: open.number, title, body });
      const url = open.html_url || `https://atomgit.com/${target.owner}/${target.repo}/issues/${open.number}`;
      if (existing.length > 1) log(`⚠️ 同前缀未关闭 issue 共 ${existing.length} 个，仅更新 #${open.number}`);
      log(`🔄 已更新 issue：${url}`);
      return { action: 'updated', url };
    }
    const created = await createIssue({ ...target, title, body });
    const url = created?.html_url || `https://atomgit.com/${target.owner}/${target.repo}/issues/${created?.number}`;
    log(`✨ 已创建 issue：${url}`);
    return { action: 'created', url };
  }
  if (!open) return { action: 'none' };
  if (!verifiedClean) {
    log(`本次未能得出可靠的"无问题"结论（检查对象不可达或未扫描），不评论 /close`);
    return { action: 'none' };
  }
  if (!writable) {
    console.log(`\n${logPrefix} ${dryRun ? '[dry-run] ' : ''}将评论 /close 关闭 issue #${open.number}（本次不写回）`);
    return { action: 'close-dry-run', url: open.html_url };
  }
  for (const issue of existing) await addIssueComment({ ...target, issue_number: issue.number, body: closeBody });
  log(`✅ 复检问题已消除，已评论 /close 关闭 ${existing.length} 个 issue`);
  return { action: 'close-commented', url: open.html_url };
}

export { log };
