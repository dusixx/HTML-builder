const fs = require('fs/promises');
const path = require('path');

const TARGET_DIR = 'secret-folder';
const targetPath = path.join(__dirname, TARGET_DIR);

console.log(`\x1B[2J\nList of files in "${TARGET_DIR}":\n`);

(async () => {
  const dirents = await fs.readdir(targetPath, { withFileTypes: true });

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
})();
