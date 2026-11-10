import { cp, lstat, mkdir, rm } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');

// Copy only the public entry point and assets, never the repository root.
async function publicFiles(source) {
  const name = basename(source);
  if (name.startsWith('.') || ['Thumbs.db', 'desktop.ini'].includes(name)) return false;
  const stat = await lstat(source);
  if (stat.isSymbolicLink() || (!stat.isFile() && !stat.isDirectory())) {
    throw new Error(`Unsupported public input: ${source}`);
  }
  return true;
}

const index = join(root, 'index.html');
const assets = join(root, 'assets');
if (!(await lstat(index)).isFile() || !(await lstat(assets)).isDirectory()) {
  throw new Error('Expected index.html and an assets directory.');
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(index, join(output, 'index.html'), { filter: publicFiles });
await cp(assets, join(output, 'assets'), { recursive: true, filter: publicFiles });
console.log('Built dist/ from index.html and assets/ only.');
