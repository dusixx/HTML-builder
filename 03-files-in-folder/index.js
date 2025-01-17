import fs from 'node:fs/promises';
import path from 'node:path';

const TARGET_DIR = 'secret-folder';
const targetPath = path.join(import.meta.dirname, TARGET_DIR);
const dirents = await fs.readdir(targetPath, { withFileTypes: true });

console.log(`\x1B[2J\nList of files in "${TARGET_DIR}":\n`);

dirents.forEach(async (ent) => {
  if (ent.isFile()) {
    const { name, parentPath } = ent;
    const fileStats = await fs.stat(path.resolve(parentPath, name));

    console.log(
      `${name} - ${path.extname(name).slice(1)} - ${(
        fileStats.size / 1024
      ).toFixed(2)}kb`,
    );
  }
});
