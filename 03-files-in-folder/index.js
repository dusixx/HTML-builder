const fs = require('fs/promises');
const path = require('path');

const TARGET_DIR = 'secret-folder';
const targetPath = path.join(__dirname, TARGET_DIR);

const getDirents = async (path) => {
  try {
    return await fs.readdir(path, { withFileTypes: true });
  } catch {}
};

const listFiles = async () => {
  const dirents = await getDirents(targetPath);
  if (!dirents) {
    return;
  }
  for (const ent of dirents) {
    if (ent.isFile()) {
      const { name, parentPath } = ent;
      const fileStats = await fs.stat(path.resolve(parentPath, name));

      console.log(
        `${name} - ${path.extname(name).slice(1)} - ${(
          fileStats.size / 1024
        ).toFixed(2)}kb`,
      );
    }
  }
};

(async () => {
  try {
    await listFiles();
  } catch ({ message }) {
    console.error(message);
  }
})();
