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

// GET /repos/{owner}/{repo}/issues?state=...  列表为 repo-scoped 路径
export async function listIssues({ owner, repo, state = 'open' }) {
  const data = await request(`/repos/${owner}/${repo}/issues`, { params: { state, per_page: 100 } });
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

export async function addIssueComment({ owner, repo, issue_number, body }) {
  return request(`/repos/${owner}/${repo}/issues/${issue_number}/comments`, { method: 'POST', body: { body } });
}

export { log };
