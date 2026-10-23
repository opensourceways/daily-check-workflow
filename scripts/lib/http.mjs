const DEFAULT_UA = 'geo-workflow-checker/1.0';

/**
 * 抓取 URL 文本内容。
 * - 网络/超时异常不再抛出,统一返回 { ok:false, status:0, error }
 * - maxBytes:字节上限,超出截断(truncated=true),用于大文件结构分析而不必全量下载
 * - 返回 headers:content-type / content-length / link / x-llms-txt
 */
export async function fetchText(url, { timeout = 15000, maxBytes = Infinity, maxBytesWarn = false } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': DEFAULT_UA },
    });
    const ok = res.ok;
    const status = res.status;
    let text = '';
    let truncated = false;
    if (res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      const parts = [];
      let received = 0;
      while (received < maxBytes) {
        const { done, value } = await reader.read();
        if (done) break;
        const remaining = maxBytes - received;
        if (value.length > remaining) {
          parts.push(value.subarray(0, remaining));
          truncated = true;
          try { await reader.cancel(); } catch { /* 忽略取消异常 */ }
          break;
        }
        parts.push(value);
        received += value.length;
      }
      let merged;
      if (parts.length === 1) merged = parts[0];
      else {
        merged = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
        let off = 0;
        for (const p of parts) { merged.set(p, off); off += p.length; }
      }
      text = decoder.decode(merged);
    }
    const contentType = res.headers.get('content-type') || '';
    return {
      ok,
      status,
      text,
      url: res.url,
      contentType,
      truncated,
      headers: {
        'content-type': contentType,
        'content-length': res.headers.get('content-length'),
        link: res.headers.get('link'),
        'x-llms-txt': res.headers.get('x-llms-txt'),
      },
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      text: '',
      url,
      contentType: '',
      truncated: false,
      headers: {},
      error: String(err?.cause?.code || err?.name || err?.message || err),
    };
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

/**
 * Range 请求探测资源真实总大小(字节),避免全量下载大文件。
 * 返回 null 表示服务端不支持 Range 或请求失败。
 */
export async function probeTotalSize(url, { timeout = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': DEFAULT_UA, range: 'bytes=0-0' },
    });
    clearTimeout(timer);
    const contentRange = res.headers.get('content-range'); // 形如 bytes 0-0/12345
    if (contentRange) {
      const total = Number(contentRange.split('/')[1]);
      if (Number.isFinite(total)) return total;
    }
    if (res.status === 200) {
      // 服务端忽略 Range,回退 content-length(即全量长度)
      const len = Number(res.headers.get('content-length'));
      if (Number.isFinite(len)) return len;
    }
    return null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

export function isAbsoluteUrl(url) {
  return /^https?:\/\//i.test(url);
}
