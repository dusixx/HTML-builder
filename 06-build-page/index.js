const fs = require('fs/promises');
const path = require('path');

const src = {
  STYLES: 'styles',
  COMPS: 'components',
  ASSETS: 'assets',
  TEMPLATE: 'template.html',
};

const dist = {
  DIR: 'project-dist',
  STYLES: 'style.css',
  MARKUP: 'index.html',
};

//
//------------------
// Helpers
//------------------
//

const replaceTemplateTags = (templateStr, tagName, content) => {
  const re = new RegExp(`\\{\\{${tagName}\\}\\}`, 'gi');
  return templateStr.replace(re, content);
};

const getDirents = async (dirPath) => {
  try {
    const dirents = await fs.readdir(dirPath, { withFileTypes: true });
    return dirents.length > 0 ? dirents : null;
  } catch {
    return null;
  }
};

const readFile = async (filePath, enc = 'utf-8') => {
  try {
    const buf = await fs.readFile(filePath);
    return {
      buf,
      str: buf.toString(enc),
    };
  } catch {
    return '';
  }
};

const createCSSBundle = async (stylesSrcPath, bundleName) => {
  // remove old bundle
  await fs.rm(bundleName, { force: true });

  const dirents = await getDirents(stylesSrcPath);
  if (!dirents) {
    console.log('(nothing to compile)');
    return;
  }
  for (const ent of dirents) {
    const { name, parentPath } = ent;
    // css files only
    if (ent.isFile() && /^\.css$/i.test(path.extname(name))) {
      console.log(`+ ${src.STYLES}/${name}`);
      // append styles
      const { buf } = await readFile(path.resolve(parentPath, name));
      await fs.writeFile(bundleName, buf, { flag: 'a' });
    }
  }
};

const createHTMLBundle = async (compsSrcPath, bundleName) => {
  // remove old bundle
  await fs.rm(bundleName, { force: true });

  const dirents = await getDirents(compsSrcPath);
  if (!dirents) {
    console.log('(nothing to compile)');
    return;
  }
  let { str: templateStr } = await readFile(src.TEMPLATE);
  if (!templateStr) {
    console.log(`(${src.TEMPLATE} not found)`);
    return;
  }
  for (const ent of dirents) {
    const { name, parentPath } = ent;
    // html files only
    if (ent.isFile() && /^\.html$/i.test(path.extname(name))) {
      console.log(`+ ${src.COMPS}/${name}`);

      const { str: compStr } = await readFile(path.resolve(parentPath, name));

      templateStr = replaceTemplateTags(
        templateStr,
        path.parse(name).name,
        compStr,
      );
    }
  }
  // create bundle
  await fs.writeFile(bundleName, templateStr);
};

const copyFolder = async (srcDir, dstDir) => {
  // remove old
  await fs.rm(dstDir, { recursive: true, force: true });

  const dirents = await getDirents(srcDir);
  if (!dirents) {
    console.log('(nothing to copy)');
    return;
  }
  // create new
  await fs.mkdir(dstDir, { recursive: true });

  for (const ent of dirents) {
    if (!ent.isFile() && !ent.isDirectory()) {
      continue;
    }
    const { name, parentPath } = ent;
    const src = path.join(parentPath, name);
    const dst = path.join(dstDir, name);

    if (ent.isFile()) {
      console.log(`+ ${dst}`);
      await fs.copyFile(src, dst);
    } else {
      await copyFolder(src, dst);
    }
  }
};

//
//------------------
// Main
//------------------
//

(async () => {
  try {
    // change current working dir
    process.chdir(__dirname);

    console.log(`\x1B[2JCreate ${dist.DIR}...`);
    await fs.rm(dist.DIR, { recursive: true, force: true });
    await fs.mkdir(dist.DIR, { recursive: true });

    console.log(`\nCompile ${dist.DIR}/${dist.STYLES}...`);
    await createCSSBundle(src.STYLES, path.resolve(dist.DIR, dist.STYLES));

    console.log(`\nCompile "${dist.DIR}/${dist.MARKUP}"...`);
    await createHTMLBundle(src.COMPS, path.resolve(dist.DIR, dist.MARKUP));

    console.log(`\nCreate ${dist.DIR}/${src.ASSETS}...`);
    await copyFolder(src.ASSETS, path.join(dist.DIR, src.ASSETS));
  } catch ({ message }) {
    console.error(message);
  }
})();
