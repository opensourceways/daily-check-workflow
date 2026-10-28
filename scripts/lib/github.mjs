// GitHub REST API 轻量客户端(基于全局 fetch,零依赖),供开发者 issue 闭环看板采集使用。
// 环境变量:
//   GITHUB_TOKEN     可选。公共仓库匿名可读(限额 60 次/小时);注入 token 提额至 5000 次/小时,
//                    且可读取 opensourceways 等组织的私有仓(token 所属账号须有读权限)。
//                    Action 中由 repo secret HSJ_GITHUB_TOKEN 注入。
//   GITHUB_API_BASE  可选,默认 https://api.github.com
const BASE = process.env.GITHUB_API_BASE || 'https://api.github.com';

function token() {
  return process.env.GITHUB_TOKEN || '';
}

export function hasToken() {
  return !!token();
}

function log(msg) {
  console.error(`[${new Date().toISOString().slice(11, 19)}] github ${msg}`);
}

async function request(path, { params } = {}) {
  const url = new URL(path, BASE);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'geo-workflow-checker/1.0',
  };
  const t = token();
  if (t) headers.Authorization = `Bearer ${t}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  let res;
  try {
    res = await fetch(url, { headers, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
  const text = await res.text();
  if (res.status >= 300) {
    // 404 兼容"仓库不存在"与"私有仓无权限"两种情况,由调用方按场景提示
    throw new Error(`github GET ${path} failed: ${res.status} ${text.slice(0, 200)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// GET /repos/{owner}/{repo}/issues —— state=all 时混有 PR(带 pull_request 字段),调用方须过滤;
// 列表按创建时间倒序返回(最新在前),调用方做窗口统计时可据此早停翻页。
export async function listIssues({ owner, repo, state = 'all', page = 1 }) {
  const data = await request(`/repos/${owner}/${repo}/issues`, {
    params: { state, per_page: 100, page },
  });
  return Array.isArray(data) ? data : [];
}

// GET /repos/{owner}/{repo}/issues/{number}/comments —— 返回顺序不保证,调用方按 created_at 自取最早。
// 供开发者 issue 闭环看板判定「首次响应」。
export async function listIssueComments({ owner, repo, issue_number }) {
  const data = await request(`/repos/${owner}/${repo}/issues/${issue_number}/comments`, {
    params: { per_page: 100 },
  });
  return Array.isArray(data) ? data : [];
}

export { log };
