// sitemap 全量页面抓取公共库（自 check-tdk-duplicate.mjs 抽出，供合并脚本 check-tdk-jsonld.mjs 共用）。
// 约定不变：每页只发一次请求，各维度分析器在同一份 HTML 上各自消费，不重复抓取。
import { parseSitemap } from './sitemap.mjs';

export async function getText(url, timeout = 20000, retries = 2) {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        redirect: 'follow',
        headers: { 'user-agent': 'geo-workflow-checker/1.0' },
      });
      const text = await res.text();
      if (res.ok || res.status < 500) return { ok: res.ok, status: res.status, text };
    } catch {
      // 网络错误/超时，重试
    } finally {
      clearTimeout(timer);
    }
  }
  return { ok: false, status: null, text: '' };
}

export async function mapLimit(items, limit, fn) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

// 收集项目全量页面 URL；配置 newVersions 的 docs 站仅取匹配版本的子 sitemap（与 sitemap-spec-check 约定一致，避免历史版本内容跨版本误报）
export async function collectUrls(project, { maxPages = Infinity } = {}) {
  if (!project.sitemapUrl) return { urls: [], notes: ['sitemapUrl 未配置'] };
  const notes = [];
  const root = await getText(project.sitemapUrl);
  if (!root.ok) return { urls: [], notes: [`sitemap 不可访问（${root.status ?? '请求失败'}）：${project.sitemapUrl}`] };
  const parsed = parseSitemap(root.text);
  let urls = parsed.urls.map((u) => u.loc).filter(Boolean);

  if (parsed.sitemaps.length) {
    let children = parsed.sitemaps;
    if (Array.isArray(project.newVersions) && project.newVersions.length) {
      const expected = new Set(
        project.newVersions.map((v) => (v === '/' || v === '' ? '/sitemap.xml' : `${v.replace(/\/+$/, '')}/sitemap.xml`))
      );
      children = parsed.sitemaps.filter((s) => {
        try {
          return expected.has(new URL(s.loc).pathname);
        } catch {
          return false;
        }
      });
      const missing = [...expected].filter((p) => !children.some((s) => new URL(s.loc).pathname === p));
      if (missing.length) notes.push(`newVersions 声明的版本在 index 中未找到子 sitemap：${missing.join('、')}`);
      notes.push(`按 newVersions 仅收集 ${children.length}/${parsed.sitemaps.length} 个子 sitemap 的页面`);
    } else {
      notes.push(`index 共 ${parsed.sitemaps.length} 个子 sitemap，全部收集`);
    }
    const childResults = await mapLimit(children, 5, async (s) => {
      if (!s.loc || !/^https?:\/\//i.test(s.loc)) return null;
      const res = await getText(s.loc);
      if (!res.ok) {
        notes.push(`子 sitemap 不可访问（${res.status ?? '失败'}）：${s.loc}`);
        return null;
      }
      return parseSitemap(res.text).urls.map((u) => u.loc).filter(Boolean);
    });
    for (const list of childResults) if (list) urls = urls.concat(list);
  }

  urls = [...new Set(urls.filter((u) => /^https?:\/\//i.test(u)))];
  if (urls.length > maxPages) {
    notes.push(`页面总数 ${urls.length}，按 --max=${maxPages} 截断检查前 ${maxPages} 个`);
    urls = urls.slice(0, maxPages);
  }
  return { urls, notes };
}
