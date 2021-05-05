import { readdir } from 'fs/promises';
import { join } from 'path';

interface Options {
  exclude?: Set<string>;
}

export async function walk(basePath: string, options: Options = {}) {
  options.exclude ||= new Set();

  const result: string[] = [];
  const queue = [basePath];

  while (queue.length) {
    const currentDirPath = queue.pop()!;

    // eslint-disable-next-line no-await-in-loop
    const dirents = await readdir(currentDirPath, { withFileTypes: true });

    for (const dirent of dirents) {
      if (options.exclude.has(dirent.name)) {
        continue;
      }
      const currentPath = join(currentDirPath, dirent.name);
      (dirent.isDirectory() ? queue : result).push(currentPath);
    }
  }

  return result;
}

walk('.', {
  exclude: new Set(['node_modules'])
})
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  })
  .catch(console.error);
