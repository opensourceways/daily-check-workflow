import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

export async function loadProjects() {
  const raw = await readFile(resolve(ROOT, 'projects.config.json'), 'utf8');
  const config = JSON.parse(raw);
  return config.projects;
}

export function findProject(projects, siteId) {
  return projects.find((p) => p.id === siteId || p.id.toLowerCase() === siteId.toLowerCase());
}

export function filterProjects(projects, siteId) {
  if (!siteId) return projects;
  const filtered = projects.filter(
    (p) => p.id === siteId || p.id.toLowerCase() === siteId.toLowerCase()
  );
  return filtered.length ? filtered : projects;
}
