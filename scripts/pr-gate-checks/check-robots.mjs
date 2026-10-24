// check-robots.mjs —— PR 门禁 robots.txt 合规检查：只读待检项目本地静态文件 ${repoInfo.publicDir}/robots.txt，
// 沿用定时检查 scripts/checks/check-robots.mjs 的字段核查口径（User-agent / allow∨disallow / 路径格式 /
// 禁整站 / Sitemap / Content-Signal / LLM-Policy），不做联网可达性探测——线上链接可达性由每日定时检查负责。
//
// PR 门禁接入方式：将本目录（pr-gate-checks/）连同 projects.config.json 复制到待检项目根目录，
// 门禁步骤执行 `node pr-gate-checks/check-robots.mjs`。脚本读待检项目根 package.json 的 name，
// 与 projects.config.json 各项目的 repoInfo.packageName 匹配以确定待检项目，再按 repoInfo 记录的
// 静态文件路径定位 robots.txt 进行检查。
//
// 用法：
//   node pr-gate-checks/check-robots.mjs [--root=<待检项目根>] [--config=<projects.config.json 路径>] [--project=<项目ID>]
//   --root 缺省为脚本目录的上级目录（即 pr-gate-checks/ 被复制到的项目根；无 package.json 时退回 cwd）；
//   --project 按项目 ID 直接指定，仅本地调试用，缺省走 packageName 匹配。
// 退出码：存在硬性错误 → 1（拦截 PR）；仅告警或全部通过 → 0；packageName 未登记（项目未接入）→ 0 跳过放行。
//
// 自包含设计：本目录会被复制出仓库独立运行，只可 import node 内置模块与 ./gate-utils.mjs（管道），
// 不能 import ../lib/*；下方解析函数与 scripts/lib/robots.mjs 保持一致，期望值与
// scripts/config/check-rules.json 的 robots.contentSignalExpected 保持一致——修改任一侧时须同步另一侧。
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fail, findProjectRoot, findConfigPath, identifyProject } from './gate-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TAG = '[pr-gate:robots]';

// 与 scripts/config/check-rules.json 的 robots.contentSignalExpected 同步
const EXPECTED_CS = { 'ai-train': 'yes', search: 'yes', 'ai-input': 'yes' };
const EXPECTED_CS_TEXT = Object.entries(EXPECTED_CS).map(([k, v]) => `${k}=${v}`).join(', ');

// ---- 与 scripts/lib/robots.mjs 同步的纯解析/核查函数 ----

export function parseRobots(text) {
  const result = {
    userAgents: [],
    disallow: [],
    allow: [],
    sitemap: [],
    contentSignal: null,
    llmPolicy: null,
    groups: [],
    raw: text.split('\n').map((l) => l.trim()).filter(Boolean),
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
function isSitewideBlocked(parsed) {
  return parsed.groups.some((g) => g.disallow.includes('/') && !g.allow.includes('/'));
}

/** allow/disallow 路径值是否以 / 开头（空值视为放行，不算违规） */
function pathFormatIssues(parsed) {
  return [...parsed.allow, ...parsed.disallow].filter((v) => v !== '' && !v.startsWith('/'));
}

/** 解析 Content-Signal 值为键值对（大小写/空格不敏感） */
function normalizeContentSignal(raw) {
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
function diffContentSignal(raw, expected) {
  const map = normalizeContentSignal(raw);
  const issues = [];
  if (!map) return ['(缺失)'];
  for (const [k, v] of Object.entries(expected)) {
    if (map[k] === undefined) issues.push(`${k} 缺失`);
    else if (map[k] !== v) issues.push(`${k}=${map[k]}（期望 ${v}）`);
  }
  return issues;
}

// ---- 输入解析：项目根 / 配置文件 / 项目匹配 / robots.txt 定位（公共管道见 gate-utils.mjs） ----

const projectRoot = findProjectRoot({ argv: process.argv, scriptDir: __dirname });
const configPath = findConfigPath({ argv: process.argv, projectRoot, scriptDir: __dirname });
const { project, pkgName, matchedBy, registered } = await identifyProject({ argv: process.argv, projectRoot, configPath, tag: TAG });

if (!project) {
  // 未登记 packageName：视为该项目未接入门禁检查，正常退出放行（门禁步骤不应拦截未接入项目）
  console.log(`${TAG} ⏭️ package.json name "${pkgName}" 未匹配到任何 repoInfo.packageName（已登记：${registered.join('、') || '无'}），该项目未接入门禁检查，跳过`);
  console.log(JSON.stringify({ projectId: null, verdict: '⏭️', skipped: true, errors: [], warnings: [] }, null, 2));
  process.exit(0);
}

const repoInfo = project.repoInfo || {};
if (!repoInfo.publicDir) fail(TAG, `项目 ${project.id} 的 repoInfo.publicDir 未配置，无法定位 robots.txt`);
const robotsPath = join(projectRoot, repoInfo.publicDir, 'robots.txt');
let robotsText;
try {
  robotsText = await readFile(robotsPath, 'utf8');
} catch {
  fail(TAG, `robots.txt 不存在：${robotsPath}（repoInfo.publicDir/robots.txt）`);
}

// ---- 检查：robots.txt 字段合规 ----

const parsed = parseRobots(robotsText);
const errors = [];
const warnings = [];

// 硬性错误清单与定时检查 collectErrors() 对齐（联网可达性探测项除外）
if (!parsed.userAgents.length) errors.push('缺 User-agent');
if (!parsed.allow.length && !parsed.disallow.length) errors.push('allow/disallow 均缺失');
const badPaths = pathFormatIssues(parsed);
if (badPaths.length) errors.push(`路径值须以 / 开头：${badPaths.join('、')}`);
if (isSitewideBlocked(parsed)) errors.push('禁止整站（Disallow: /）');

// 本站 host 集合（domain/domainAlias）：声明链接 host 不在其中计告警（跨域引用），与定时检查口径一致
const ownHosts = [project.domain, project.domainAlias]
  .filter(Boolean)
  .map((u) => {
    try {
      return new URL(u).host;
    } catch {
      return null;
    }
  })
  .filter(Boolean);

/** Sitemap / LLM-Policy 值须为绝对 URL；host 与本站不一致计告警。返回 URL 对象供上层继续判定 */
function checkRefUrl(label, url) {
  let abs;
  try {
    abs = new URL(url);
  } catch {
    errors.push(`${label} 须为绝对 URL：${url}`);
    return null;
  }
  if (ownHosts.length && !ownHosts.includes(abs.host)) warnings.push(`${label} 跨域引用（host ${abs.host}）：${url}`);
  return abs;
}

if (!parsed.sitemap.length) errors.push('缺 sitemap 声明');
for (const s of parsed.sitemap) checkRefUrl('Sitemap', s);

if (!parsed.contentSignal) errors.push('缺 Content-Signal');
else {
  const csIssues = diffContentSignal(parsed.contentSignal, EXPECTED_CS);
  if (csIssues.length) errors.push(`Content-Signal 取值不符：${csIssues.join('; ')}（规范值 ${EXPECTED_CS_TEXT}）`);
}

if (!parsed.llmPolicy) errors.push('缺 LLM-Policy');
else {
  const abs = checkRefUrl('LLM-Policy', parsed.llmPolicy);
  // 指向 llms.txt 的判定：路径末段以 llms 开头（兼容 llms-full.txt），与定时检查一致
  if (abs && !/\/llms[^/]*$/i.test(abs.pathname)) errors.push(`LLM-Policy 未指向 llms.txt：${parsed.llmPolicy}`);
}

// ---- 输出 ----

const verdict = errors.length ? '❌' : warnings.length ? '⚠️' : '✅';
console.log(`${TAG} 待检项目：${project.name}（${project.id}），匹配方式：${matchedBy}（${configPath}）`);
console.log(`${TAG} robots.txt：${robotsPath}`);
if (!errors.length && !warnings.length) console.log(`${TAG} ✅ robots.txt 字段检查通过`);
for (const e of errors) console.log(`${TAG} ❌ ${e}`);
for (const w of warnings) console.log(`${TAG} ⚠️ ${w}`);
console.log(JSON.stringify({ projectId: project.id, robotsPath, verdict, errors, warnings }, null, 2));
process.exit(errors.length ? 1 : 0);
