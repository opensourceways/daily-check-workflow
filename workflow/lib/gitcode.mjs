import { fetchJson } from './http.mjs';

const GITCODE_API = 'https://gitcode.com/api/v5';

export async function fetchRepoIssues(repoUrl, { state = 'open', perPage = 100 } = {}) {
  const ownerRepo = extractOwnerRepo(repoUrl);
  if (!ownerRepo) return [];
  const [owner, repo] = ownerRepo;
  const url = `${GITCODE_API}/repos/${owner}/${repo}/issues?state=${state}&per_page=${perPage}`;
  const { json } = await fetchJson(url);
  return Array.isArray(json) ? json : [];
}

export async function fetchRepoPRs(repoUrl, { state = 'open', perPage = 100 } = {}) {
  const ownerRepo = extractOwnerRepo(repoUrl);
  if (!ownerRepo) return [];
  const [owner, repo] = ownerRepo;
  const url = `${GITCODE_API}/repos/${owner}/${repo}/pulls?state=${state}&per_page=${perPage}`;
  const { json } = await fetchJson(url);
  return Array.isArray(json) ? json : [];
}

function extractOwnerRepo(repoUrl) {
  const m = /gitcode\.com\/([^/]+)\/([^/]+)/.exec(repoUrl);
  if (!m) return null;
  return [m[1], m[2].replace(/\.git$/, '').replace(/\/$/, '')];
}
