import { readdir } from 'fs/promises';
import { join } from 'path';

interface Options {
  exclude?: Set<string>;
  recursive?: boolean;
}

export async function* lisdir(basePath: string, options: Options = {}) {
  options.recursive ??= false;
  options.exclude ??= new Set();

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
      const path = join(currentDirPath, dirent.name);
      const isDirectory = dirent.isDirectory();

      if (isDirectory && options.recursive) {
        queue.push(path);
      }

      yield {
        name: dirent.name,
        path,
        isDirectory
      };
    }
  }

  return result;
}

(async () => {
  const contentsIt = lisdir('.', {
    exclude: new Set(['node_modules']),
    recursive: true
  });

  for await (const entry of contentsIt) {
    console.log((entry.isDirectory ? '(dir) ' : '') + entry.path);
  }
})();
