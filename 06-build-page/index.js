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

const mkdir = async (path) => {
  await fs.rm(path, { recursive: true, force: true });
  await fs.mkdir(path, { recursive: true });
};

const replaceTemplateTags = (templateStr, tagName, content) => {
  const re = new RegExp(`\\{\\{${tagName}\\}\\}`, 'gi');
  return templateStr.replace(re, content);
};

const createCSSBundle = async (stylesSrcPath, bundleName) => {
  // remove old bundle
  await fs.rm(bundleName, { force: true });

  for (const ent of await fs.readdir(stylesSrcPath, { withFileTypes: true })) {
    const { name, parentPath } = ent;
    // css files only
    if (ent.isFile() && /\.css$/i.test(name)) {
      console.log(`+ ${src.STYLES}/${name}`);
      // append styles
      const buf = await fs.readFile(path.resolve(parentPath, name));
      await fs.writeFile(bundleName, buf, { flag: 'a' });
    }
  }
};

const createHTMLBundle = async (compsSrcPath, bundleName) => {
  // remove old bundle
  await fs.rm(bundleName, { force: true });

  const templateBuf = await fs.readFile(path.resolve(src.TEMPLATE));
  let templateStr = templateBuf.toString('utf-8');

  for (const ent of await fs.readdir(compsSrcPath, { withFileTypes: true })) {
    const { name, parentPath } = ent;
    // html files only
    if (ent.isFile() && /\.html$/i.test(name)) {
      console.log(`+ ${src.COMPS}/${name}`);

      const compBuf = await fs.readFile(path.resolve(parentPath, name));

      templateStr = replaceTemplateTags(
        templateStr,
        path.parse(name).name,
        compBuf.toString('utf-8'),
      );
    }
  }
  // create html bundle
  await fs.writeFile(bundleName, templateStr);
};

const copyFolder = async (srcDir, dstDir) => {
  await mkdir(path.resolve(dstDir));

  for (const ent of await fs.readdir(srcDir, { withFileTypes: true })) {
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
  // change current working dir
  process.chdir(__dirname);

  console.log(`\x1B[2JCreate ${dist.DIR}...`);
  await mkdir(dist.DIR);

  console.log(`\nCompile ${dist.DIR}/${dist.STYLES}...`);
  await createCSSBundle(src.STYLES, path.resolve(dist.DIR, dist.STYLES));

  console.log(`\nCompile "${dist.DIR}/${dist.MARKUP}"...`);
  await createHTMLBundle(src.COMPS, path.resolve(dist.DIR, dist.MARKUP));

  console.log(`\nCreate ${dist.DIR}/${src.ASSETS}...`);
  await copyFolder(src.ASSETS, path.join(dist.DIR, src.ASSETS));
})();
