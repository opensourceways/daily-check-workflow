export function extractTitle(html) {
  const m = /<title[^>]*>([^<]*)<\/title>/i.exec(html);
  return m ? m[1].trim() : null;
}

export function extractMeta(html, name) {
  const key = String(name).toLowerCase();
  const tagRe = /<meta\b[^>]*>/gi;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    const tag = m[0];
    const metaKey = extractAttr(tag, 'name') || extractAttr(tag, 'property');
    if (!metaKey || metaKey.toLowerCase() !== key) continue;
    const content = extractAttr(tag, 'content');
    if (content !== null) return content;
  }
  return null;
}

export function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    try {
      const parsed = JSON.parse(raw);
      blocks.push({ valid: true, data: parsed });
    } catch {
      blocks.push({ valid: false, data: raw });
    }
  }
  return blocks;
}

export function extractAllLinks(html) {
  const links = [];
  const re = /<a\s+([^>]*)>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const text = stripTags(m[2]).trim();
    const href = extractAttr(attrs, 'href');
    const rel = extractAttr(attrs, 'rel');
    const target = extractAttr(attrs, 'target');
    links.push({ href, rel, target, text });
  }
  return links;
}

export function extractAllImages(html) {
  const imgs = [];
  const re = /<img\s+([^>]*)\/?>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const alt = extractAttr(attrs, 'alt');
    const src = extractAttr(attrs, 'src');
    imgs.push({ src, alt, hasAlt: alt !== null });
  }
  return imgs;
}

export function countHeadings(html) {
  const counts = {};
  for (let i = 1; i <= 6; i++) {
    const re = new RegExp(`<h${i}[^>]*>`, 'gi');
    counts[`h${i}`] = (html.match(re) || []).length;
  }
  return counts;
}

export function extractSemanticTags(html) {
  const tags = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer'];
  const counts = {};
  for (const tag of tags) {
    const re = new RegExp(`<${tag}[^>]*>`, 'gi');
    counts[tag] = (html.match(re) || []).length;
  }
  return counts;
}

function extractAttr(attrString, attrName) {
  const re = new RegExp(`(?<![\\w:-])${attrName}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i');
  const m = re.exec(attrString);
  if (!m) return null;
  return (m[1] ?? m[2]).trim();
}

function stripTags(html) {
  return html.replace(/<[^>]*>/g, '').trim();
}
