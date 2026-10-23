export function parseSitemap(xml) {
  const urls = [];
  const urlRegex = /<url>([\s\S]*?)<\/url>/gi;
  let match;
  while ((match = urlRegex.exec(xml)) !== null) {
    const block = match[1];
    const loc = extractTag(block, 'loc');
    const lastmod = extractTag(block, 'lastmod');
    const changefreq = extractTag(block, 'changefreq');
    const xhtmlLinks = extractAllXhtmlLinks(block);
    urls.push({ loc, lastmod, changefreq, xhtmlLinks });
  }

  const sitemaps = [];
  const sitemapRegex = /<sitemap>([\s\S]*?)<\/sitemap>/gi;
  while ((match = sitemapRegex.exec(xml)) !== null) {
    const block = match[1];
    sitemaps.push({ loc: extractTag(block, 'loc'), lastmod: extractTag(block, 'lastmod') });
  }

  return { urls, sitemaps };
}

function extractTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, 'i');
  const m = re.exec(block);
  return m ? m[1].trim() : null;
}

function extractAllXhtmlLinks(block) {
  const links = [];
  const re = /<xhtml:link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(block)) !== null) {
    links.push({ hreflang: m[1], href: m[2] });
  }
  return links;
}
