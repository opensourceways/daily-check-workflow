export function parseRobots(text) {
  const lines = text.split('\n');
  const result = {
    userAgents: [],
    disallow: [],
    allow: [],
    sitemap: [],
    contentSignal: null,
    llmPolicy: null,
    groups: [],
    raw: lines.map((l) => l.trim()).filter(Boolean),
  };

  let current = null;
  for (const line of result.raw) {
    const [key, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    const lowerKey = key.trim().toLowerCase();

    if (lowerKey === 'user-agent') {
      result.userAgents.push(value);
      if (!current || current.allow.length > 0 || current.disallow.length > 0) {
        current = { userAgents: [], allow: [], disallow: [] };
        result.groups.push(current);
      }
      current.userAgents.push(value);
    } else if (lowerKey === 'disallow') {
      result.disallow.push(value);
      if (!current) {
        current = { userAgents: [], allow: [], disallow: [] };
        result.groups.push(current);
      }
      current.disallow.push(value);
    } else if (lowerKey === 'allow') {
      result.allow.push(value);
      if (!current) {
        current = { userAgents: [], allow: [], disallow: [] };
        result.groups.push(current);
      }
      current.allow.push(value);
    } else if (lowerKey === 'sitemap') result.sitemap.push(value);
    else if (lowerKey === 'content-signal') result.contentSignal = value;
    else if (lowerKey === 'llm-policy') result.llmPolicy = value;
  }

  return result;
}

/** 组内是否禁止整站：存在精确 Disallow: / 且同组没有 Allow: / 抵消 */
export function isSitewideBlocked(parsed) {
  return parsed.groups.some(
    (g) => g.disallow.includes('/') && !g.allow.includes('/')
  );
}

/** allow/disallow 路径值是否以 / 开头（空值视为放行，不算违规） */
export function pathFormatIssues(parsed) {
  return [...parsed.allow, ...parsed.disallow].filter(
    (v) => v !== '' && !v.startsWith('/')
  );
}

/** 解析 Content-Signal 值为键值对（大小写/空格不敏感） */
export function normalizeContentSignal(raw) {
  if (!raw) return null;
  const map = {};
  for (const part of raw.split(',')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    const k = part.slice(0, idx).trim().toLowerCase();
    const v = part.slice(idx + 1).trim().toLowerCase();
    if (k) map[k] = v;
  }
  return map;
}

/** 与期望值逐键比对，返回不符项（全部相符返回空数组） */
export function diffContentSignal(raw, expected) {
  const map = normalizeContentSignal(raw);
  const issues = [];
  if (!map) return ['(缺失)'];
  for (const [k, v] of Object.entries(expected)) {
    if (map[k] === undefined) issues.push(`${k} 缺失`);
    else if (map[k] !== v) issues.push(`${k}=${map[k]}（期望 ${v}）`);
  }
  return issues;
}
