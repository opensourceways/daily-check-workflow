// check-new-page-tdk.mjs —— PR 门禁新增页面 TDK / JSON-LD 配置检查。
//
// 逻辑：
//  1) 取待检项目最新一次 git commit 的全部改动文件（普通/合并提交统一按"与第一父提交 HEAD^1 对比"，
//     初始提交无父则直接 show），只保留状态为 A（新增）且整路径匹配 repoInfo.pageEntryPattern（JS 正则）
//     的文件，记为新增页面；无新增页面直接通过。
//  2) 每个新增页面按 **TDK** 与 **JSON-LD** 两个维度分别判定：
//     - TDK 细化到 title / description 两个字段：字段级"并集"判定——某字段只要归档文件或页面源码
//       任一处非空配置即视为覆盖（与 portal config.ts setTdk"归档覆盖 + frontmatter 兜底"的渲染
//       行为一致）；title、description 未全覆盖 → 报缺哪些字段。
//       归档侧：读 ${repoInfo.tdkArchiveDir}/<页面路径>/index.json（toPageKey 推导规则见下），
//       解析 JSON 并检查 title / description 是否非空字符串；文件缺失/解析失败按"字段缺失"处理并在
//       报错里说明原因。
//       源码侧（按 project.stack）：vitepress → md frontmatter 顶层非空 title / description；
//       nuxt → useSeoMeta / useHead 调用实参（跨调用并集）内的 title: / description: 配置键。
//     - JSON-LD 维度维持整条判定：归档 ${repoInfo.jsonldArchiveDir}/<页面路径>/index.json 存在，
//       或源码内出现 application/ld+json 声明（vitepress 看 frontmatter 的 script[type=...]，
//       nuxt 看两个 composable 调用实参）。
//     - 其他 stack 或文件类型与 stack 不符：无源码级检查，仅依赖归档。
//   维度不满足 → 该维度一条硬性错误（一页最多两条）。
//
// 退出码：存在硬性错误 → 1（拦截 PR）；全部通过 / 无新增页面 / packageName 未登记 → 0。
// 自包含设计：同 check-robots.mjs——复制出仓库后只能 import node 内置模块与 ./gate-utils.mjs。
//
// 用法：
//   node pr-gate-checks/check-new-page-tdk.mjs [--root=<待检项目根>] [--config=<projects.config.json 路径>] [--project=<项目ID>]
// CI 注意：门禁检出需 fetch-depth ≥ 2（需要 HEAD 与第一父提交的对象才能算出本次改动）。
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fail, findProjectRoot, findConfigPath, identifyProject } from './gate-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TAG = '[pr-gate:tdk]';
const DIMENSIONS = ['TDK', 'JSON-LD'];
// TDK 细化到字段粒度：归档 JSON 与源码都按这两个键判定"是否配置"
const TDK_FIELDS = ['title', 'description'];
// 报错文案里对源码渠道的称呼（按 stack）
const SRC_LABEL = { vitepress: 'frontmatter', nuxt: 'useSeoMeta/useHead' };

// ---- 输入解析：项目根 / 配置文件 / 项目匹配（公共管道见 gate-utils.mjs） ----

const projectRoot = findProjectRoot({ argv: process.argv, scriptDir: __dirname });
const configPath = findConfigPath({ argv: process.argv, projectRoot, scriptDir: __dirname });
const { project, pkgName, matchedBy, registered } = await identifyProject({ argv: process.argv, projectRoot, configPath, tag: TAG });

if (!project) {
  // 未登记 packageName：该项目未接入门禁检查，跳过放行（与 check-robots.mjs 行为一致）
  console.log(`${TAG} ⏭️ package.json name "${pkgName}" 未匹配到任何 repoInfo.packageName（已登记：${registered.join('、') || '无'}），该项目未接入门禁检查，跳过`);
  process.exit(0);
}

const repoInfo = project.repoInfo || {};

// pageEntryPattern 为 JS 正则源串，建议自带 ^ $ 锚点做全路径匹配（git 输出路径分隔符恒为 /）
if (!repoInfo.pageEntryPattern) fail(TAG, `项目 ${project.id} 的 repoInfo.pageEntryPattern 未配置，无法识别页面文件`);
let pageRe;
try {
  pageRe = new RegExp(repoInfo.pageEntryPattern);
} catch (e) {
  fail(TAG, `repoInfo.pageEntryPattern 不是合法正则：${repoInfo.pageEntryPattern}（${e.message}）`);
}

// 维度 → 归档目录配置键；两渠道都不可用时错误文案引用此键名提示补配置
const ARCHIVE_DIR_OF = { TDK: repoInfo.tdkArchiveDir, 'JSON-LD': repoInfo.jsonldArchiveDir };

// ---- 步骤 1：最新一次 commit 的新增页面 ----

/** 在待检项目根执行 git，-c core.quotepath=off 保证非 ASCII 路径不被转义成八进制串 */
function git(args) {
  const r = spawnSync('git', ['-C', projectRoot, '-c', 'core.quotepath=off', ...args], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  if (r.error) fail(TAG, `git 命令无法执行：${r.error.message}`);
  return { code: r.status, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

/**
 * 取最新 commit 的改动清单，筛出状态 A（新增）的路径。
 * 判定父提交用 rev-list --parents：无父 = 初始提交，git show 会把全部文件列为 A，正好符合"全为新增"；
 * 有父（含合并提交）统一与第一父 HEAD^1 对比——合并提交把分支带来的新文件同样计为 A，浅克隆（depth=1）
 * 缺父对象时退回 git show，仍失败则给出 fetch-depth 提示。
 */
function listAddedFiles() {
  const head = git(['rev-parse', '--verify', 'HEAD']);
  if (head.code !== 0) fail(TAG, `无法读取 git HEAD（${projectRoot} 不是 git 仓库或尚无提交）`);
  const parents = git(['rev-list', '--parents', '-n', '1', 'HEAD']).out.split(/\s+/).slice(1);
  let res;
  if (parents.length === 0) {
    res = git(['show', '--no-color', '--format=', '--name-status', 'HEAD']);
  } else {
    res = git(['diff', '--no-color', '--name-status', 'HEAD^1', 'HEAD']);
    if (res.code !== 0) res = git(['show', '--no-color', '--format=', '--name-status', 'HEAD']);
  }
  if (res.code !== 0) fail(TAG, `读取最新提交改动失败：${res.err}（CI 检出需 fetch-depth ≥ 2）`);
  const added = [];
  for (const line of res.out.split('\n')) {
    if (!line.trim()) continue;
    // name-status 行格式：<状态>\t<路径>（R/C 状态为 <状态>\t<旧路径>\t<新路径>）；只取新增，无二义
    const [status, file] = line.split('\t');
    if (status[0] === 'A' && file) added.push(file);
  }
  return { sha: head.out, added };
}

const { sha, added } = listAddedFiles();
const newPages = added.filter((f) => pageRe.test(f));

// ---- 步骤 2：逐页面、逐维度核查 ----

/**
 * 页面文件路径（相对项目根，/ 分隔）→ 归档查找键：去 repoInfo.srcDir 前缀 → index.md / index.vue
 * 取其上级目录（整文件名即 index.* 时为空串，对应归档根）→ 其余去扩展名。
 * 与 portal 侧 config.ts 的 lookupKey 规则等价（如 app/zh/foo/bar.md → zh/foo/bar）。
 */
function toPageKey(file) {
  let k = file;
  const srcDir = repoInfo.srcDir;
  if (srcDir) {
    const prefix = srcDir.endsWith('/') ? srcDir : `${srcDir}/`;
    if (k.startsWith(prefix)) k = k.slice(prefix.length);
  }
  // 分组捕获 "目录/" 前缀（含斜杠，去尾斜杠后即目录路径）；(.*\/)? 空组则整文件名必须为 index.*
  const idx = k.match(/^(.*\/)?index\.[^/]+$/);
  if (idx) k = (idx[1] || '').replace(/\/$/, '');
  else k = k.replace(/\.[^/.]+$/, '');
  return k;
}

/** 归档目标：目录未配置返回 null（该维度归档渠道 N/A）；否则 {rel 期望相对路径, exists 是否存在} */
function archiveTarget(archiveDir, key) {
  if (!archiveDir) return null;
  const rel = posix.join(archiveDir, key, 'index.json');
  return { rel, exists: existsSync(resolve(projectRoot, rel)) };
}

/**
 * TDK 归档内容核查（字段粒度）：文件存在时读并解析 index.json，title / description 按
 * "非空字符串"判配置；不存在/解析失败/目录未配置分别对应：fields 全 false + note 说明原因 / 整体 null。
 * 返回 null（无归档渠道）或 { rel, fields: {title, description}, note 附加原因（正常读到时为空串） }。
 */
async function tdkArchiveFields(target) {
  if (!target) return null;
  const fields = { title: false, description: false };
  if (!target.exists) return { rel: target.rel, fields, note: `归档 ${target.rel} 不存在` };
  let data;
  try {
    data = JSON.parse(await readFile(resolve(projectRoot, target.rel), 'utf8'));
  } catch (e) {
    return { rel: target.rel, fields, note: `归档 ${target.rel} 解析失败（${e.message}）` };
  }
  for (const f of TDK_FIELDS) fields[f] = typeof data?.[f] === 'string' && data[f].trim() !== '';
  return { rel: target.rel, fields, note: '' };
}

/** 提取文件顶部 frontmatter 块文本（--- 包裹）；不存在返回 null */
function frontmatterBlock(text) {
  const m = text.match(/^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(\r?\n|$)/);
  return m ? m[1] : null;
}

/**
 * vitepress TDK（字段级）：frontmatter 顶层 title / description（仅认顶格键，嵌套同名不算；
 * 值去引号后非空才算配置）。返回 { fields, note }——note 仅在前置条件不成立时给整体原因。
 */
function fmTdkFields(block) {
  const fields = { title: false, description: false };
  if (!block) return { fields, note: 'frontmatter 缺失（文件未以 --- 开头）' };
  for (const f of TDK_FIELDS) {
    for (const line of block.split(/\r?\n/)) {
      if (!line.startsWith(`${f}:`)) continue;
      let value = line.slice(f.length + 1).trim();
      const quoted = value.match(/^(["'])([\s\S]*)\1$/);
      if (quoted) value = quoted[2].trim();
      if (value) {
        fields[f] = true;
        break;
      }
    }
  }
  return { fields, note: '' };
}

/**
 * vitepress JSON-LD：frontmatter 块内是否出现 application/ld+json MIME 串
 * （对应 head: 里声明的 script[type="application/ld+json"]；portal 常规做法是 .geo/jsonld 归档，
 * 此处覆盖"直接在 frontmatter 内联声明"的场景）。返回 '' 或原因。
 */
function fmJsonldWhy(block) {
  if (!block) return 'frontmatter 缺失（文件未以 --- 开头）';
  return /application\/ld\+json/.test(block) ? '' : 'frontmatter 未声明 script[type="application/ld+json"]';
}

/** 从 openIdx 处 '(' 起做括号配平抽取调用实参文本；跳过引号内容与 // 行注释，失败返回 null */
function extractCallArgs(text, openIdx) {
  let depth = 0;
  let quote = null;
  for (let i = openIdx; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '/' && text[i + 1] === '/') {
      const nl = text.indexOf('\n', i);
      i = nl < 0 ? text.length : nl;
      continue;
    }
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return text.slice(openIdx + 1, i);
    }
  }
  return null;
}

/** nuxt：收集所有 useSeoMeta(...) / useHead(...) 调用的实参文本数组（无调用时为空数组） */
function nuxtCallArgs(text) {
  const callRe = /\b(useSeoMeta|useHead)\s*\(/g;
  const out = [];
  let m;
  while ((m = callRe.exec(text))) {
    const args = extractCallArgs(text, m.index + m[0].length - 1);
    if (args !== null) out.push(args);
  }
  return out;
}

/**
 * nuxt TDK（字段级）：各调用实参并集内按字段测 title: / description: 配置键
 * （跨调用分散写法也认；ogTitle:/titleTemplate: 之类不会被误判为字段）。返回 { fields, note }。
 */
function nuxtTdkFields(argsAll) {
  const fields = { title: false, description: false };
  if (!argsAll.length) return { fields, note: '未发现 useSeoMeta / useHead 调用' };
  const joined = argsAll.join('\n');
  for (const f of TDK_FIELDS) fields[f] = new RegExp(`["']?${f}["']?\\s*:`).test(joined);
  return { fields, note: '' };
}

/** nuxt JSON-LD：调用实参并集内是否涉及 application/ld+json（script 声明）。'' 或原因 */
function nuxtJsonldWhy(argsAll) {
  if (!argsAll.length) return '未发现 useSeoMeta / useHead 调用';
  return /application\/ld\+json/.test(argsAll.join('\n')) ? '' : 'useSeoMeta/useHead 调用未涉及 script[type="application/ld+json"]';
}

/** 源码检查通过时的说明文案（按 stack × 维度） */
const SOURCE_OK_NOTE = {
  vitepress: { TDK: 'frontmatter title/description 已配置', 'JSON-LD': 'frontmatter 声明了 application/ld+json 脚本' },
  nuxt: { TDK: 'useSeoMeta/useHead 已配置 title/description', 'JSON-LD': 'useSeoMeta/useHead 涉及 application/ld+json 脚本' },
};

/**
 * 按 stack 与文件类型分派源码检查，返回 { tdk: {fields, note}, jsonld: ''|原因 }；
 * stack 未知或文件类型与 stack 不符时返回 null（该页面无源码级检查，仅依赖归档）。
 */
async function sourceChecks(file) {
  const ext = posix.extname(file);
  const isVitepressMd = project.stack === 'vitepress' && ext === '.md';
  const isNuxtVue = project.stack === 'nuxt' && ext === '.vue';
  if (!isVitepressMd && !isNuxtVue) return null;
  let text;
  try {
    text = await readFile(resolve(projectRoot, file), 'utf8');
  } catch (e) {
    fail(TAG, `无法读取新增页面 ${file}（git 状态为 A 但工作区缺失？门禁应在检出后运行）：${e.message}`);
  }
  if (isVitepressMd) {
    const block = frontmatterBlock(text);
    return { tdk: fmTdkFields(block), jsonld: fmJsonldWhy(block) };
  }
  const argsAll = nuxtCallArgs(text);
  return { tdk: nuxtTdkFields(argsAll), jsonld: nuxtJsonldWhy(argsAll) };
}

const errors = [];
const warnings = [];
const passed = [];

for (const file of newPages) {
  const key = toPageKey(file);
  const ext = posix.extname(file) || '(无扩展名)';
  const targets = {};
  for (const dim of DIMENSIONS) targets[dim] = archiveTarget(ARCHIVE_DIR_OF[dim], key);
  const src = await sourceChecks(file);

  // ---- TDK：字段级并集（归档字段 ∪ 源码字段），title / description 各自判定 ----
  const tdkArc = await tdkArchiveFields(targets.TDK);
  const tdkCovered = (f) => Boolean(tdkArc?.fields[f] || src?.tdk.fields[f]);
  const tdkMissing = TDK_FIELDS.filter((f) => !tdkCovered(f));
  if (!tdkMissing.length) {
    // 通过来源说明：归档全齐 / 源码全齐 / 两边合并覆盖
    const via =
      TDK_FIELDS.every((f) => tdkArc?.fields[f])
        ? `归档 ${tdkArc.rel}`
        : TDK_FIELDS.every((f) => src?.tdk.fields[f])
          ? `${SRC_LABEL[project.stack] ?? '源码'} title/description 已配置`
          : `归档 ${tdkArc?.rel} + ${SRC_LABEL[project.stack] ?? '源码'} 合并覆盖`;
    passed.push({ file, dimension: 'TDK', via });
  } else if (!tdkArc && !src) {
    errors.push(`${file}：无法检查 TDK——repoInfo.tdkArchiveDir 未配置，且 stack "${project.stack || '(未配置)'}"（或文件类型 ${ext}）不支持源码级检查，请补配置或在页面内配置`);
  } else {
    const m = tdkMissing.join('、');
    const parts = [];
    if (tdkArc) parts.push(tdkArc.note || `归档 ${tdkArc.rel} 无 ${m}`);
    else parts.push('未配置 tdkArchiveDir');
    if (src) parts.push(src.tdk.note || `${SRC_LABEL[project.stack]} 无 ${TDK_FIELDS.filter((f) => !src.tdk.fields[f]).join('、')}`);
    else parts.push(`stack "${project.stack || '未配置'}" 对 ${ext} 文件不做 TDK 源码检查`);
    errors.push(`${file}：新增页面 TDK 缺 ${m}（${parts.join('，且 ')}）`);
  }

  // ---- JSON-LD：整条判定（归档文件存在 ∪ 源码出现 ld+json 声明） ----
  const arcLd = targets['JSON-LD'];
  if (arcLd && arcLd.exists) {
    passed.push({ file, dimension: 'JSON-LD', via: `归档 ${arcLd.rel}` });
  } else if (src && src.jsonld === '') {
    passed.push({ file, dimension: 'JSON-LD', via: SOURCE_OK_NOTE[project.stack]['JSON-LD'] });
  } else if (!arcLd && !src) {
    errors.push(`${file}：无法检查 JSON-LD——repoInfo.jsonldArchiveDir 未配置，且 stack "${project.stack || '(未配置)'}"（或文件类型 ${ext}）不支持源码级检查，请补配置或在页面内配置`);
  } else {
    const parts = [];
    parts.push(arcLd ? `归档 ${arcLd.rel} 不存在` : '未配置 jsonldArchiveDir');
    parts.push(src ? src.jsonld : `stack "${project.stack || '未配置'}" 对 ${ext} 文件不做 JSON-LD 源码检查`);
    errors.push(`${file}：新增页面缺 JSON-LD（${parts.join('，且 ')}）`);
  }
}

// ---- 输出 ----

console.log(`${TAG} 待检项目：${project.name}（${project.id}），匹配方式：${matchedBy}（${configPath}）`);
console.log(`${TAG} 最新提交：${sha.slice(0, 7)}（改动中新增文件 ${added.length} 个，匹配 pageEntryPattern ${newPages.length} 个${newPages.length ? `：${newPages.join('、')}` : ''}）`);
if (!newPages.length) console.log(`${TAG} ✅ 无新增页面，跳过 TDK / JSON-LD 核查`);
for (const p of passed) console.log(`${TAG} ✅ [${p.dimension}] ${p.file}（${p.via}）`);
for (const w of warnings) console.log(`${TAG} ⚠️ ${w}`);
for (const e of errors) console.log(`${TAG} ❌ ${e}`);
process.exit(errors.length ? 1 : 0);
