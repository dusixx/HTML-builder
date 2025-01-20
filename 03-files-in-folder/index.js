const fs = require('fs/promises');
const path = require('path');

const TARGET_DIR = 'secret-folder';
const targetPath = path.join(__dirname, TARGET_DIR);

const getDirents = async (path) => {
  try {
    return await fs.readdir(path, { withFileTypes: true });
  } catch {}
};

const listFiles = async (srcPath) => {
  const dirents = await getDirents(srcPath);
  if (!dirents) {
    console.log('(nothing to list)');
    return;
  }
  for (const ent of dirents) {
    if (ent.isFile()) {
      const { name, parentPath } = ent;
      const fileStats = await fs.stat(path.resolve(parentPath, name));
      const ext = path.extname(name).slice(1) || '(no-ext)';

      console.log(`${name} - ${ext} - ${(fileStats.size / 1024).toFixed(2)}kb`);
    }
  }
};

(async () => {
  try {
    await listFiles(targetPath);
  } catch ({ message }) {
    console.error(message);
  }
})();
