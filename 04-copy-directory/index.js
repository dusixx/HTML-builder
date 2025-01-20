const fs = require('fs/promises');
const path = require('path');

const SRC_DIR = 'files';
const DST_DIR = 'files-copy';

const srcPath = path.join(__dirname, SRC_DIR);
const dstPath = path.join(__dirname, DST_DIR);

console.log('\x1B[2J');

(async () => {
  await fs.rm(dstPath, { recursive: true, force: true });
  await fs.mkdir(dstPath, { recursive: true });

  for (const ent of await fs.readdir(srcPath, { withFileTypes: true })) {
    if (ent.isFile()) {
      const { name, parentPath } = ent;
      const src = path.resolve(parentPath, name);
      const dst = path.resolve(dstPath, name);

      console.log(`${SRC_DIR}/${name} -> ${DST_DIR}/${name}`);
      await fs.copyFile(src, dst);
    }
  }
})();
