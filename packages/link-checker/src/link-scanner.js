import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { log, fetchHead, fetchHttp } from '@geo-workflow/core';

// ── Constants (1:1 port from scan_links.py) ──

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp', '.ico']);
const STATIC_FILE_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp', '.ico',
  '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv',
  '.mp3', '.wav', '.ogg', '.flac',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.zip', '.rar', '.7z', '.tar', '.gz',
  '.txt', '.json', '.xml', '.csv', '.m4a',
]);
const SCAN_EXTENSIONS = new Set(['.js', '.html', '.css', '.ts', '.jsx', '.tsx', '.vue', '.md', '.txt']);

const URL_TERMINATORS = new Set([
  ..." \t\n\r\"'<>()[]{}|\\^`,.;:!?",
  ..."？，。；：！？（）【】「」『』《》、·～￥……——",
  ..."''「」『』﹃﹄〔〕—～‧°‧¡¿*%$@+~",
]);
const VALID_URL_CHARS = new Set('?#&=/-_.:%');

const VARIABLE_PATTERNS = [
  /^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)+$/,
  /^\{\{[^}]+\}\}$/,
  /^<%=.*%>$/,
  /^\$[a-zA-Z_][a-zA-Z0-9_]*$/,
  /^@[a-zA-Z_][a-zA-Z0-9_]*$/,
];

// ── URL validation & cleaning (1:1 port) ──

function isVariableLink(url) {
  if (/[{}%$@<>]/.test(url)) return true;
  return VARIABLE_PATTERNS.some(p => p.test(url));
}

function hasFileExtension(url) {
  try {
    const parsed = new URL(url, 'http://dummy.test');
    const urlPath = parsed.pathname;
    if (!urlPath || urlPath === '/') return false;
    const filename = path.basename(urlPath);
    if (filename.includes('.')) {
      const ext = '.' + filename.split('.').pop().toLowerCase();
      return STATIC_FILE_EXTENSIONS.has(ext);
    }
    return false;
  } catch {
    return false;
  }
}

function isImageLink(url) {
  try {
    const parsed = new URL(url, 'http://dummy.test');
    const p = parsed.pathname.toLowerCase();
    return [...IMAGE_EXTENSIONS].some(ext => p.endsWith(ext));
  } catch {
    return false;
  }
}

function isStaticResource(url) {
  try {
    const parsed = new URL(url, 'http://dummy.test');
    const p = parsed.pathname.toLowerCase();
    return [...STATIC_FILE_EXTENSIONS].some(ext => p.endsWith(ext));
  } catch {
    return false;
  }
}

function hasValidUrlStructure(url) {
  if (!url || url.length < 8) return false;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const parsed = new URL(url);
      if (!parsed.protocol || !parsed.host) return false;
      if (parsed.pathname) {
        const invalid = ['{', '}', '|', '\\', '^', '`', '<', '>'];
        if (invalid.some(c => parsed.pathname.includes(c))) return false;
      }
      return true;
    } catch {
      return false;
    }
  }
  if (url.startsWith('/')) {
    const invalid = ['{', '}', '|', '\\', '^', '`', '<', '>'];
    return url.length > 1 && !invalid.some(c => url.includes(c));
  }
  return false;
}

function cleanUrlComprehensive(url) {
  if (!url) return null;
  // Strip trailing terminators
  let s = url;
  while (s.length > 0 && URL_TERMINATORS.has(s[s.length - 1])) {
    s = s.slice(0, -1);
  }
  // Handle unmatched parens
  if (s.includes('(') && s.includes(')')) {
    if ((s.match(/\(/g) || []).length > (s.match(/\)/g) || []).length) {
      s = s.slice(0, s.lastIndexOf('('));
    }
  }
  // Strip HTML entities
  s = s.replace(/&[a-z]+;/g, '');
  return s.trim() || null;
}

function cleanUrlByRule(url) {
  if (!url) return null;

  if (hasFileExtension(url)) {
    const termChars = ' )）]】，.。;；:：!！?？-—–\t\n\r';
    let i = url.length - 1;
    while (i >= 0 && termChars.includes(url[i])) i--;
    const cleaned = i < url.length - 1 ? url.slice(0, i + 1) : url;
    if (hasValidUrlStructure(cleaned)) return cleaned;
    return hasValidUrlStructure(url) ? url : null;
  } else {
    // Match Chinese chars or closing punctuation
    const pattern = /[\u4e00-\u9fff]|[\)）\]】〉》」』】〕〗,，.。;；:：!！?？]/;
    const match = url.match(pattern);
    if (match) {
      let cleaned = url.slice(0, match.index);
      while (cleaned.length > 0 && ' )）]】，.。;；:：!！?？-—–\t\n\r'.includes(cleaned[cleaned.length - 1])) {
        cleaned = cleaned.slice(0, -1);
      }
      if (cleaned && hasValidUrlStructure(cleaned)) return cleaned;
    }
    if (!hasFileExtension(url) && /[\u4e00-\u9fff]/.test(url)) return null;
    return hasValidUrlStructure(url) ? url : null;
  }
}

function isValidUrlStrict(url) {
  if (!url) return null;
  const clean = cleanUrlByRule(url);
  if (!clean) return null;
  if (isVariableLink(clean)) return null;
  if (!hasValidUrlStructure(clean)) return null;
  return clean;
}

// ── URL extraction (1:1 port of _extract_urls_from_line) ──

function extractUrlsFromLine(line) {
  const urls = [];

  // Markdown links: [text](url)
  for (const m of line.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const cleaned = cleanUrlComprehensive(m[1]);
    if (cleaned) urls.push([cleaned, 'markdown']);
  }

  // href="url"
  for (const m of line.matchAll(/href=["']([^"'\s>]+)["']/gi)) {
    const cleaned = cleanUrlComprehensive(m[1]);
    if (cleaned) urls.push([cleaned, 'href']);
  }

  // src="url"
  for (const m of line.matchAll(/src=["']([^"'\s>]+)["']/gi)) {
    const cleaned = cleanUrlComprehensive(m[1]);
    if (cleaned) urls.push([cleaned, 'src']);
  }

  // Bare https?:// URLs — scan char by char for terminators
  for (const m of line.matchAll(/https?:\/\/[^\s<>"')\]}|\\^`]*/g)) {
    let current = m[0];
    let endPos = m.index + m[0].length;
    while (endPos < line.length) {
      const c = line[endPos];
      if (c === ',' || c === '，') break;
      if (URL_TERMINATORS.has(c) && !VALID_URL_CHARS.has(c)) break;
      if (VALID_URL_CHARS.has(c) || /[a-zA-Z0-9]/.test(c)) {
        current += c;
        endPos++;
        continue;
      }
      break;
    }
    const cleaned = cleanUrlComprehensive(current);
    if (cleaned) urls.push([cleaned, 'text']);
  }

  return urls;
}

// ── File utilities (1:1 port) ──

function isApiFile(filePath) {
  const normalized = filePath.replace(/\\/g, '/').toLowerCase();
  return normalized.includes('/api/') || normalized.endsWith('/api');
}

function findCodeFiles(baseDir, excludeFiles) {
  const files = [];
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (SCAN_EXTENSIONS.has(ext)) {
          const rel = path.relative(baseDir, fullPath).replace(/\\/g, '/');
          if (excludeFiles.some(pat => rel.includes(pat))) continue;
          files.push(fullPath);
        }
      }
    }
  }
  walk(baseDir);
  return files;
}

// ── Link extraction from file (1:1 port of extract_links_from_file) ──

function extractLinksFromFile(filePath, baseDir, domain, excludeFiles, excludeDomains, urlPrefix = '') {
  if (isApiFile(filePath)) return [];

  let lines;
  try {
    lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  } catch (e) {
    log(`WARNING: Cannot read ${filePath}: ${e.message}`);
    return [];
  }

  const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
  const isMarkdown = filePath.toLowerCase().endsWith('.md');
  const seenInFile = new Set();
  const links = [];

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    for (const [url, attrType] of extractUrlsFromLine(line)) {
      if (isVariableLink(url)) continue;

      const cleanUrl = isValidUrlStrict(url);
      if (!cleanUrl) continue;

      let fullUrl;
      if (cleanUrl.startsWith('/')) {
        if (attrType === 'src' || (isMarkdown && isStaticResource(cleanUrl)) || isStaticResource(cleanUrl)) {
          fullUrl = `${domain}${cleanUrl}`;
        } else {
          let processed = cleanUrl;
          if (urlPrefix && !processed.startsWith('//') && !processed.startsWith('/zh/') && !processed.startsWith('/en/')) {
            processed = `${urlPrefix}${processed}`;
          }
          fullUrl = `${domain}${processed}`;
        }
      } else {
        fullUrl = cleanUrl;
      }

      if (isImageLink(fullUrl)) continue;

      // Check exclude_domains
      try {
        const parsed = new URL(fullUrl);
        if (parsed.hostname) {
          const hostname = parsed.hostname.toLowerCase();
          if (excludeDomains.some(d => {
            const dl = d.toLowerCase();
            return hostname === dl || hostname.endsWith('.' + dl);
          })) continue;
        }
      } catch {}

      // Dedup per file
      const linkKey = `${fullUrl}|${relativePath}|${lineNum + 1}`;
      if (seenInFile.has(linkKey)) continue;
      seenInFile.add(linkKey);

      links.push({
        url: fullUrl,
        file_path: relativePath,
        line_number: lineNum + 1,
        original_url: url,
        cleaned_url: cleanUrl !== url ? cleanUrl : null,
        attr_type: attrType,
      });
    }
  }

  return links;
}

// ── HTTP check (1:1 port of check_link with HEAD → GET fallback) ──

async function httpCheck(url, method, timeout) {
  if (method === 'HEAD') {
    const res = await fetchHead(url, { timeout: timeout * 1000 });
    return res.status;
  } else {
    // GET fallback
    const res = await fetchHttp(url, { timeout: timeout * 1000 });
    return res.status;
  }
}

async function checkLink(urlInfo, timeout = 10) {
  let url = urlInfo.url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  try {
    // Try HEAD first
    try {
      const statusCode = await httpCheck(url, 'HEAD', timeout);
      if (statusCode < 400) {
        return { ...urlInfo, status_code: statusCode, result: 'ok', error: null };
      }
    } catch (e) {
      // HEAD failed, will try GET
    }

    // GET fallback
    const statusCode = await httpCheck(url, 'GET', timeout);
    return {
      ...urlInfo,
      status_code: statusCode,
      result: statusCode < 400 ? 'ok' : 'broken',
      error: null,
    };
  } catch (e) {
    // Both HEAD and GET failed — try to extract status code
    const statusCode = e.response?.status || null;
    return {
      ...urlInfo,
      status_code: statusCode,
      result: 'broken',
      error: e.message,
    };
  }
}

async function checkWithDelay(urlInfo, timeout, delay) {
  if (delay > 0) {
    const sleep = Math.random() * delay * 1000;
    await new Promise(r => setTimeout(r, sleep));
  }
  return checkLink(urlInfo, timeout);
}

async function scanConcurrently(links, maxWorkers = 5, timeout = 10, delay = 0.5) {
  const results = [];
  const queue = [...links];

  async function worker() {
    while (queue.length > 0) {
      const urlInfo = queue.shift();
      if (!urlInfo) break;
      try {
        results.push(await checkWithDelay(urlInfo, timeout, delay));
      } catch (e) {
        results.push({ ...urlInfo, status_code: null, result: 'broken', error: e.message });
      }
    }
  }

  const workers = Array.from({ length: Math.min(maxWorkers, links.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// ── URL exclusion (1:1 port) ──

function isUrlExcluded(url, excludeUrls) {
  if (!excludeUrls?.length) return false;
  for (const pattern of excludeUrls) {
    if (url === pattern || url.includes(pattern)) return true;
  }
  return false;
}

function filterExcludedUrls(links, excludeUrls) {
  if (!excludeUrls?.length) return links;
  return links.filter(link => !isUrlExcluded(link.url, excludeUrls));
}

// ── Clone repo (1:1 port) ──

function cloneRepo(repoUrl, branch = 'main') {
  const tempDir = path.join(os.tmpdir(), `link_checker_${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  let authUrl = repoUrl;
  if (repoUrl.includes('gitcode.com')) {
    const token = process.env.ATOMGIT_TOKEN || process.env.GITCODE_TOKEN || '';
    if (token) {
      authUrl = repoUrl.replace(/^https:\/\//, `https://oauth2:${token}@`);
    }
  }

  const branchFlag = branch ? ` --branch ${branch}` : '';
  try {
    execSync(`git clone --depth=100${branchFlag} "${authUrl}" "${tempDir}"`, {
      stdio: ['ignore', 'inherit', 'inherit'],
    });
  } catch (e) {
    throw new Error(`Clone failed: ${e.message}`);
  }
  return tempDir;
}

export {
  IMAGE_EXTENSIONS,
  STATIC_FILE_EXTENSIONS,
  SCAN_EXTENSIONS,
  isVariableLink,
  hasFileExtension,
  isImageLink,
  isStaticResource,
  hasValidUrlStructure,
  cleanUrlComprehensive,
  cleanUrlByRule,
  isValidUrlStrict,
  extractUrlsFromLine,
  isApiFile,
  findCodeFiles,
  extractLinksFromFile,
  checkLink,
  scanConcurrently,
  isUrlExcluded,
  filterExcludedUrls,
  cloneRepo,
};
