// gate-utils.mjs —— PR 门禁脚本公共管道：CLI 参数解析、待检项目根与 projects.config.json 定位、
// 按 packageName 确定待检项目。
//
// 自包含约束：pr-gate-checks/ 会被整体复制出本仓库到待检项目根独立运行，本目录内脚本
// 只能 import node 内置模块与 ./ 下的文件，不得引用 ../lib/*。
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

/** 解析 --name=value 形式的 CLI 参数；值内含 '=' 时只按第一个 '=' 切分 */
export function argOf(argv, name) {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
}

/** 门禁异常终止：打印 ❌ 并以退出码 1 拦截（调用处后续代码不会执行，仅作类型收窄用） */
export function fail(tag, msg) {
  console.error(`${tag} ❌ ${msg}`);
  process.exit(1);
}

export async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

/**
 * 待检项目根定位：--root 显式指定优先；否则取脚本目录的上级——pr-gate-checks/ 复制到项目根后
 * 上级即项目根（以存在 package.json 为判据）；都不满足时退回 cwd。
 */
export function findProjectRoot({ argv, scriptDir }) {
  const rootArg = argOf(argv, 'root');
  if (rootArg) return resolve(rootArg);
  const parent = resolve(scriptDir, '..');
  if (existsSync(join(parent, 'package.json'))) return parent;
  return process.cwd();
}

/**
 * projects.config.json 定位（按顺序取首个存在的候选）：
 * --config / 环境变量 PROJECTS_CONFIG → pr-gate-checks/ 目录内（随包复制）→
 * 待检项目根（CI 放根目录）→ 本仓库根（在本仓库原位调试时脚本向上两级）。
 */
export function findConfigPath({ argv, projectRoot, scriptDir }) {
  const candidates = [
    argOf(argv, 'config') || process.env.PROJECTS_CONFIG || null,
    join(scriptDir, 'projects.config.json'),
    join(projectRoot, 'projects.config.json'),
    resolve(scriptDir, '..', '..', 'projects.config.json'),
  ]
    .filter(Boolean)
    .map((c) => resolve(c));
  for (const c of candidates) if (existsSync(c)) return c;
  return fail('[pr-gate]', `未找到 projects.config.json，已尝试：${candidates.join('、')}`);
}

/**
 * 确定待检项目：--project=<项目ID> 直接按 ID 匹配（本地调试用）；否则读项目根 package.json 的
 * name，与 projects.config.json 各项目的 repoInfo.packageName 匹配（大小写不敏感）。
 * 返回 { project, pkgName, configPath, matchedBy, registered }；packageName 未登记时 project 为
 * null——语义是"该项目未接入门禁检查"，由调用方决定跳过放行（勿当异常拦截）。
 */
export async function identifyProject({ argv, projectRoot, configPath, tag }) {
  const projectIdArg = argOf(argv, 'project');
  let pkg;
  try {
    pkg = await readJson(join(projectRoot, 'package.json'));
  } catch {
    return fail(tag, `无法读取待检项目根的 package.json：${join(projectRoot, 'package.json')}`);
  }
  const pkgName = pkg?.name;
  if (!pkgName && !projectIdArg) return fail(tag, `${projectRoot} 的 package.json 缺少 name 字段，无法匹配待检项目`);

  const { projects } = await readJson(configPath);
  const registered = projects.filter((p) => p.repoInfo?.packageName).map((p) => p.repoInfo.packageName);
  const project =
    (projectIdArg && projects.find((p) => p.id === projectIdArg || p.id.toLowerCase() === projectIdArg.toLowerCase())) ||
    (!projectIdArg && projects.find((p) => p.repoInfo?.packageName?.toLowerCase() === String(pkgName).toLowerCase())) ||
    null;
  return { project, pkgName, configPath, matchedBy: projectIdArg ? '--project' : 'packageName', registered };
}
