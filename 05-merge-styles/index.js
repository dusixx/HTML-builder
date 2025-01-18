import fs from 'node:fs/promises';
import path from 'node:path';

const BUNDLE_NAME = 'bundle.css';
const STYLES_DIR = 'styles';
const PROJECT_DIR = 'project-dist';

const srcPath = path.join(import.meta.dirname, STYLES_DIR);

const bundle = {
  name: BUNDLE_NAME,
  path: path.join(import.meta.dirname, PROJECT_DIR, BUNDLE_NAME),
  relPath: path.join(PROJECT_DIR, BUNDLE_NAME),
};
// remove old bundle
await fs.rm(bundle.path, { force: true });

for (const ent of await fs.readdir(srcPath, { withFileTypes: true })) {
  const { name, parentPath } = ent;
  // css files only
  if (ent.isFile() && /\.css$/i.test(name)) {
    // append styles
    const buf = await fs.readFile(path.resolve(parentPath, name));
    await fs.writeFile(bundle.path, buf, { flag: 'a' });
  }
}
// show stats
const stats = await fs.stat(bundle.path);
console.log(
  `\x1B[2JSuccessfully created!\nPath: .\\${bundle.relPath}\nSize: ${(
    stats.size / 1024
  ).toFixed(2)}kb`,
);
