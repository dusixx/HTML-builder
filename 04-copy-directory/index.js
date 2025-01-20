const fs = require('fs/promises');
const path = require('path');

const SRC_DIR = 'files';
const DST_DIR = 'files-copy';

const srcPath = path.join(__dirname, SRC_DIR);
const dstPath = path.join(__dirname, DST_DIR);

const getDirents = async (path) => {
  try {
    return await fs.readdir(path, { withFileTypes: true });
  } catch {}
};

const copyFiles = async () => {
  await fs.rm(dstPath, { recursive: true, force: true });

  const dirents = await getDirents(srcPath);
  if (!dirents) {
    console.log('(nothing to copy)');
    return;
  }
  await fs.mkdir(dstPath, { recursive: true });

  for (const ent of dirents) {
    if (ent.isFile()) {
      const { name, parentPath } = ent;
      const src = path.resolve(parentPath, name);
      const dst = path.resolve(dstPath, name);

      console.log(`${SRC_DIR}/${name} -> ${DST_DIR}/${name}`);
      await fs.copyFile(src, dst);
    }
  }
};

(async () => {
  try {
    await copyFiles();
  } catch ({ message }) {
    console.error(message);
  }
})();
