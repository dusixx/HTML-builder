import fs from 'node:fs/promises';
import path from 'node:path';

const SRC_DIR = 'files';
const DST_DIR = 'files-copy';

const srcPath = path.join(import.meta.dirname, SRC_DIR);
const dstPath = path.join(import.meta.dirname, DST_DIR);

await fs.rm(dstPath, { recursive: true, force: true });
await fs.mkdir(dstPath, { recursive: true });

const dirents = await fs.readdir(srcPath, { withFileTypes: true });

console.log(`\x1B[2J`);

dirents.forEach(async (ent) => {
  if (ent.isFile()) {
    const { name, parentPath } = ent;
    const src = path.resolve(parentPath, name);
    const dst = path.resolve(dstPath, name);

    console.log(`${SRC_DIR}/${name} -> ${DST_DIR}/${name}`);
    await fs.copyFile(src, dst);
  }
});
