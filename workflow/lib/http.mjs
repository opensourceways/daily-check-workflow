export async function fetchText(url, { timeout = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'geo-workflow-checker/1.0' },
    });
    const ok = res.ok;
    const status = res.status;
    const text = await res.text();
    const contentType = res.headers.get('content-type') || '';
    return { ok, status, text, url: res.url, contentType };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchJson(url, { timeout = 15000 } = {}) {
  const { ok, status, text } = await fetchText(url, { timeout });
  try {
    return { ok, status, json: JSON.parse(text) };
  } catch {
    return { ok, status, json: null };
  }
}

export function isAbsoluteUrl(url) {
  return /^https?:\/\//i.test(url);
}
