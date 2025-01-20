const fs = require('fs/promises');
const path = require('path');

const BUNDLE_NAME = 'bundle.css';
const STYLES_DIR = 'styles';
const PROJECT_DIR = 'project-dist';

const srcPath = path.join(__dirname, STYLES_DIR);

const bundle = {
  name: BUNDLE_NAME,
  path: path.join(__dirname, PROJECT_DIR, BUNDLE_NAME),
  relPath: path.join(PROJECT_DIR, BUNDLE_NAME),
};

const getDirents = async (path) => {
  try {
    return await fs.readdir(path, { withFileTypes: true });
  } catch {}
};

const createCSSBundle = async () => {
  // remove old bundle
  await fs.rm(bundle.path, { force: true });

  const dirents = await getDirents(srcPath);
  if (!dirents) {
    console.log('(nothing to compile)');
    return false;
  }
  for (const ent of dirents) {
    const { name, parentPath } = ent;
    // css files only
    if (ent.isFile() && /^\.css$/i.test(path.extname(name))) {
      // append styles
      const buf = await fs.readFile(path.resolve(parentPath, name));
      await fs.writeFile(bundle.path, buf, { flag: 'a' });
    }
  }
  return true;
};

const showStats = async () => {
  const stats = await fs.stat(bundle.path);
  console.log(
    `\x1B[2JSuccessfully created!\nPath: .\\${bundle.relPath}\nSize: ${(
      stats.size / 1024
    ).toFixed(2)}kb`,
  );
};

(async () => {
  try {
    if (await createCSSBundle()) {
      return await showStats();
    }
  } catch ({ message }) {
    console.error(message);
  }
})();
