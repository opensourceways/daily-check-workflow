// 失效链接（死链）检测支撑库。
// 移植自 linkcheck 分支 packages/link-checker/src/link-scanner.js（其上游为 Python 版 scan_links.py）：
// clone 仓库 → 遍历源码文件 → 逐行提取 URL（markdown 链接 / href / src / 裸链接，含中英文终止符
// 清洗与动态变量链接过滤）→ 相对路径按 domain + urlPrefix 补全 → 排除域名/URL → 并发 HTTP 探测。
// 本仓适配：
//   - 探测改零依赖全局 fetch（HEAD 优先，状态 ≥400 或 HEAD 失败时 GET 复核，取到响应头即取消 body）
//   - 外部站点探测使用浏览器 UA（部分站点 WAF 拦截非常规 UA 造成 403 误报）
//   - findCodeFiles 内置 .git/ 与 node_modules/ 硬排除，防止配置遗漏拖慢扫描
// 使用方：scripts/checks/check-links.mjs（维度脚本，负责报告与提单）；探测参数见 config/check-rules.json 的 links 段。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';

const PROBE_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

// 图片链接不计入死链（源码中的图片资源普遍由构建/CDN 兜底，可达性检查噪声大）
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp', '.ico']);
// 静态资源扩展名：相对路径命中时直接以 domain 拼接，不加 urlPrefix
const STATIC_FILE_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp', '.ico',
  '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv',
  '.mp3', '.wav', '.ogg', '.flac',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.zip', '.rar', '.7z', '.tar', '.gz',
  '.txt', '.json', '.xml', '.csv', '.m4a',
]);
// 参与扫描的源码/文档文件扩展名
const SCAN_EXTENSIONS = new Set(['.js', '.html', '.css', '.ts', '.jsx', '.tsx', '.vue', '.md', '.txt']);

// URL 终止符：裸链接扫描遇到这些字符即截断（含中英文标点）
const URL_TERMINATORS = new Set([
  ..." \t\n\r\"'<>()[]{}|\\^`,.;:!?",
  ..."？，。；：！？（）【】「」『』《》、·～￥……——",
  ..."''「」『』﹃﹄〔〕—～‧°‧¡¿*%$@+~",
]);
// 终止符中允许出现在 URL 内部的字符（?/#& 等保留字）
const VALID_URL_CHARS = new Set('?#&=/-_.:%');

// 动态变量链接特征：模板占位（{{...}}、<%= %>）、JS 属性链（a.b.c）、$var、@alias 等，跳过不探测
const VARIABLE_PATTERNS = [
  /^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)+$/,
  /^\{\{[^}]+\}\}$/,
  /^<%=.*%>$/,
  /^\$[a-zA-Z_][a-zA-Z0-9_]*$/,
  /^@[a-zA-Z_][a-zA-Z0-9_]*$/,
];

// ── URL 校验与清洗 ──

export function isVariableLink(url) {
  if (/[{}%$@<>]/.test(url)) return true;
  return VARIABLE_PATTERNS.some((p) => p.test(url));
}

export function hasFileExtension(url) {
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

export function isImageLink(url) {
  try {
    const p = new URL(url, 'http://dummy.test').pathname.toLowerCase();
    return [...IMAGE_EXTENSIONS].some((ext) => p.endsWith(ext));
  } catch {
    return false;
  }
}

export function isStaticResource(url) {
  try {
    const p = new URL(url, 'http://dummy.test').pathname.toLowerCase();
    return [...STATIC_FILE_EXTENSIONS].some((ext) => p.endsWith(ext));
  } catch {
    return false;
  }
}

export function hasValidUrlStructure(url) {
  if (!url || url.length < 8) return false;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const parsed = new URL(url);
      if (!parsed.protocol || !parsed.host) return false;
      if (parsed.pathname) {
        const invalid = ['{', '}', '|', '\\', '^', '`', '<', '>'];
        if (invalid.some((c) => parsed.pathname.includes(c))) return false;
      }
      return true;
    } catch {
      return false;
    }
  }
  if (url.startsWith('/')) {
    const invalid = ['{', '}', '|', '\\', '^', '`', '<', '>'];
    return url.length > 1 && !invalid.some((c) => url.includes(c));
  }
  return false;
}

// 通用清洗：剥离尾部终止符、处理未闭合括号、剥离 HTML 实体
export function cleanUrlComprehensive(url) {
  if (!url) return null;
  let s = url;
  while (s.length > 0 && URL_TERMINATORS.has(s[s.length - 1])) {
    s = s.slice(0, -1);
  }
  if (s.includes('(') && s.includes(')')) {
    if ((s.match(/\(/g) || []).length > (s.match(/\)/g) || []).length) {
      s = s.slice(0, s.lastIndexOf('('));
    }
  }
  s = s.replace(/&[a-z]+;/g, '');
  return s.trim() || null;
}

// 规则清洗：静态资源路径按文件类终止符截断；普通 URL 遇中文字符或收尾标点截断
export function cleanUrlByRule(url) {
  if (!url) return null;

  if (hasFileExtension(url)) {
    const termChars = ' )）]】，.。;；:：!！?？-—–\t\n\r';
    let i = url.length - 1;
    while (i >= 0 && termChars.includes(url[i])) i--;
    const cleaned = i < url.length - 1 ? url.slice(0, i + 1) : url;
    if (hasValidUrlStructure(cleaned)) return cleaned;
    return hasValidUrlStructure(url) ? url : null;
  } else {
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

export function isValidUrlStrict(url) {
  if (!url) return null;
  const clean = cleanUrlByRule(url);
  if (!clean) return null;
  if (isVariableLink(clean)) return null;
  if (!hasValidUrlStructure(clean)) return null;
  return clean;
}

// ── URL 提取（逐行：markdown 链接 / href / src / 裸链接） ──

export function extractUrlsFromLine(line) {
  const urls = [];

  for (const m of line.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const cleaned = cleanUrlComprehensive(m[1]);
    if (cleaned) urls.push([cleaned, 'markdown']);
  }

  for (const m of line.matchAll(/href=["']([^"'\s>]+)["']/gi)) {
    const cleaned = cleanUrlComprehensive(m[1]);
    if (cleaned) urls.push([cleaned, 'href']);
  }

  for (const m of line.matchAll(/src=["']([^"'\s>]+)["']/gi)) {
    const cleaned = cleanUrlComprehensive(m[1]);
    if (cleaned) urls.push([cleaned, 'src']);
  }

  // 裸 https?:// 链接：按终止符逐字符扫描。
  // 与原版相比，字符类额外排除了常见中文标点（，。；：！？）等）——原版会把紧随其后的中文文本
  // 一并吞进 URL，再被中文保护逻辑整条判无效丢弃；排除后 URL 在标点处截断，可正常保留
  // （裸中文标点本就不可能合法出现在 URL 中，且含中文的路径原本也会被丢弃，故该改法只增检出不增误报）。
  for (const m of line.matchAll(/https?:\/\/[^\s<>"')\]}|\\^`，。；：！？）】」』《〉、]*/g)) {
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

// ── 文件遍历 ──

// API 目录/文件跳过（接口定义中的 URL 多为运行时拼接，直探必 404）
export function isApiFile(filePath) {
  const normalized = filePath.replace(/\\/g, '/').toLowerCase();
  return normalized.includes('/api/') || normalized.endsWith('/api');
}

// 遍历 baseDir 收集参与扫描的源码文件；excludePatterns 为相对路径子串匹配，
// 另内置硬排除 .git/ 与 node_modules/（配置遗漏时兜底，防止误扫依赖目录）
export function findCodeFiles(baseDir, excludePatterns = []) {
  const files = [];
  const hardExcludes = ['.git/', 'node_modules/'];
  const allExcludes = [...hardExcludes, ...excludePatterns];
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
        if (!SCAN_EXTENSIONS.has(ext)) continue;
        const rel = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        if (allExcludes.some((pat) => rel.includes(pat))) continue;
        files.push(fullPath);
      }
    }
  }
  walk(baseDir);
  return files;
}

// ── 链接提取（单文件） ──
// 返回引用记录数组：{ url, file, line, attrType }。url 为补全后的绝对地址。
// 相对路径补全规则：静态资源（含 src 属性）直接拼 domain；其余路径先加 urlPrefix（如 /zh）
// 再拼 domain；已是 /zh/ /en/ 开头或协议相对（//）的不再加前缀。
export function extractLinksFromFile(filePath, baseDir, domain, { excludeDomains = [], urlPrefix = '' } = {}) {
  if (isApiFile(filePath)) return [];

  let lines;
  try {
    lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  } catch {
    return [];
  }

  const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
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
        if (attrType === 'src' || isStaticResource(cleanUrl)) {
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

      try {
        const parsed = new URL(fullUrl);
        if (parsed.hostname) {
          const hostname = parsed.hostname.toLowerCase();
          if (excludeDomains.some((d) => {
            const dl = d.toLowerCase();
            return hostname === dl || hostname.endsWith('.' + dl);
          })) continue;
        }
      } catch {
        continue;
      }

      // 文件内去重（同文件同 URL 同行只记一次；跨文件/跨行保留，报告用）
      const linkKey = `${fullUrl}|${relativePath}|${lineNum + 1}`;
      if (seenInFile.has(linkKey)) continue;
      seenInFile.add(linkKey);

      links.push({ url: fullUrl, file: relativePath, line: lineNum + 1, attrType });
    }
  }

  return links;
}

// ── URL 排除（精确或子串匹配，用于运行时拼接的动态 URL 等已知误报） ──

function isUrlExcluded(url, excludeUrls) {
  if (!excludeUrls?.length) return false;
  for (const pattern of excludeUrls) {
    if (url === pattern || url.includes(pattern)) return true;
  }
  return false;
}

export function filterExcludedUrls(links, excludeUrls) {
  if (!excludeUrls?.length) return links;
  return links.filter((link) => !isUrlExcluded(link.url, excludeUrls));
}

// ── HTTP 探测 ──
// HEAD 优先（省流量）；HEAD 状态 ≥400（含不支持 HEAD 的 405/501）或网络失败时 GET 复核。
// GET 取到响应头即取消 body，不整页下载。跟随重定向（重定向到可达页面视为有效）。
// 返回 { status, error }：status 为 null 表示网络层失败（超时/DNS/TLS）。
export async function probeLink(url, { timeout = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const req = (method) =>
    fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': PROBE_UA, accept: '*/*' },
    });
  const closeBody = async (res) => {
    try {
      await res.body?.cancel();
    } catch {
      /* 忽略取消异常 */
    }
  };
  try {
    try {
      const res = await req('HEAD');
      if (res.status < 400) {
        await closeBody(res);
        return { status: res.status, error: null };
      }
    } catch {
      /* HEAD 网络失败，落到 GET 复核 */
    }
    const res2 = await req('GET');
    const status = res2.status;
    await closeBody(res2);
    return { status, error: null };
  } catch (err) {
    return { status: null, error: String(err?.cause?.code || err?.name || err?.message || err) };
  } finally {
    clearTimeout(timer);
  }
}

// 并发探测 URL 列表（建议传入去重后的唯一 URL）。
// workers 并发数；delayMs 为每任务随机抖动上限，缓解对同一目标站点的请求密度。
// 返回顺序与入参一致：[{ url, status, error, ok }]（ok = status != null && status < 400）。
export async function probeLinks(urls, { workers = 5, timeout = 15000, delay = 500 } = {}) {
  const results = [];
  const queue = urls.map((url) => ({ url }));

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      if (delay > 0) {
        await new Promise((r) => setTimeout(r, Math.random() * delay));
      }
      const { status, error } = await probeLink(item.url, { timeout });
      results.push({ url: item.url, status, error, ok: status != null && status < 400 });
    }
  }

  await Promise.all(Array.from({ length: Math.min(workers, urls.length) }, () => worker()));
  // 保持与入参一致的顺序（worker 并发完成顺序不定）
  const byUrl = new Map(results.map((r) => [r.url, r]));
  return urls.map((u) => byUrl.get(u));
}

// ── 仓库 clone / 清理 ──

// 数据源说明：gitcode 对匿名 git 传输返回 401（login-gated），不可用于 CI；
// 各项目在 AtomGit 上有同名镜像（本仓库提 issue 的目标仓库，openEuler master 实测与
// gitcode 源仓保持小时级同步），匿名可读公开仓；受限仓在 CI 里用 ATOMGIT_TOKEN 认证可读。
// 故扫描一律 clone AtomGit 镜像（repo 配置仍写 gitcode 正源 URL，此处按 owner/repo 改写）。
function atomGitMirrorUrl(repoUrl, { auth } = {}) {
  const parsed = parseOwnerRepoOnly(repoUrl);
  const base = parsed ? `https://atomgit.com/${parsed.owner}/${parsed.repo}` : repoUrl.replace(/\.git$/, '');
  return auth ? `${base.replace(/^https:\/\//, `https://${auth}@`)}` : base;
}

function parseOwnerRepoOnly(repoUrl) {
  try {
    const u = new URL(repoUrl);
    const segs = u.pathname.replace(/\.git$/i, '').split('/').filter(Boolean);
    if (segs.length < 2) return null;
    return { owner: segs[segs.length - 2], repo: segs[segs.length - 1] };
  } catch {
    return null;
  }
}

// clone 到临时目录（--depth=1 浅克隆；openEuler-portal 全量工作区达 5.7GB，浅克隆实测 ~2 分钟/2.2GB）。
// 一律设 GIT_LFS_SKIP_SMUDGE=1 跳过 LFS 对象下载（见 run 处注释），防镜像仓 LFS 对象缺失拖垮 clone。
// AtomGit 大包传输偶发 curl 18（连接中断）等瞬时错误：匿名克隆内置最多 3 次重试（2s 退避）；
// 匿名仍失败且配置了 token（受限仓需认证）时，按「token 作用户名」「oauth2:token」两种凭证再试
// （AtomGit 为 Gitea 系服务端，token 凭证格式未定死，两种都试；报错信息中会脱敏 token）。
export function cloneRepo(repoUrl, branch = 'main') {
  const tempDir = path.join(os.tmpdir(), `link-scan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const branchFlag = branch ? ` --branch ${branch}` : '';
  const run = (url) =>
    execSync(`git clone --depth=1 --single-branch${branchFlag} "${url}" "${tempDir}"`, {
      stdio: ['ignore', 'ignore', 'pipe'],
      // GIT_LFS_SKIP_SMUDGE：部分镜像仓以 filter=lfs 跟踪媒体文件（openEuler-portal 的
      // .gitattributes 含 png/jpg/mov），其 LFS 对象在 AtomGit 上拉不到——匿名 LFS API 401、
      // 带 token 404 not found，checkout 阶段 smudge 失败会让整个 clone 以
      // "error: external filter 'git-lfs filter-process' failed" 告终。
      // 链接扫描只读文本源码（图片本就跳过、mov 也不在扫描扩展名内），跳过 LFS 下载、
      // 工作区留 LFS 指针文件即可，clone 不再受 LFS 服务端牵连。
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_LFS_SKIP_SMUDGE: '1' },
    });
  const cleanup = () => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      /* 忽略 */
    }
  };
  const sleep = (ms) => execSync(`sleep ${ms / 1000}`);
  const attempt = (url) => {
    try {
      run(url);
      return null;
    } catch (err) {
      return err;
    }
  };
  const fatal = (err) =>
    /branch.*not found|Remote branch|does not appear to be a git repository|repository not found|not found/i.test(
      String(err.message)
    );
  const describe = (err, url) =>
    `Clone failed (${url}): ${String(err.message).replace(/:[^@]+@/g, ':***@').slice(0, 400)}`;

  const anonUrl = atomGitMirrorUrl(repoUrl);
  let lastErr = null;
  for (let i = 0; i < 3; i++) {
    if (i > 0) sleep(2000);
    cleanup();
    const err = attempt(anonUrl);
    if (!err) return tempDir;
    lastErr = err;
    if (fatal(err)) throw new Error(describe(err, anonUrl)); // 分支/仓库不存在，重试无意义
  }

  const token = process.env.ATOMGIT_TOKEN || process.env.GITCODE_TOKEN || '';
  if (!token) throw new Error(describe(lastErr, anonUrl));
  for (const auth of [token, `oauth2:${token}`]) {
    cleanup();
    const err = attempt(atomGitMirrorUrl(repoUrl, { auth }));
    if (!err) return tempDir;
    lastErr = err;
    if (fatal(err)) break; // 配置问题，无需再试另一种凭证
  }
  cleanup();
  throw new Error(describe(lastErr, anonUrl));
}

export function removeDir(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    /* 忽略 */
  }
}
