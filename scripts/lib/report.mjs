import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATS_DIR = resolve(__dirname, '..', 'stats');

export async function writeStats(name, data) {
  await mkdir(STATS_DIR, { recursive: true });
  const filePath = resolve(STATS_DIR, `${name}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  return filePath;
}

export function now() {
  return new Date().toISOString();
}
