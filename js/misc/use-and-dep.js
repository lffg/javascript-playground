const warn = console.warn.bind(console);
const error = console.error.bind(console);

const USE_DECL = Symbol('use declaration');
const DEP_DECL = Symbol('dependency declaration');

const Use = (ident, fn) => ({ kind: USE_DECL, ident, fn });
const Dep = (ident) => ({ kind: DEP_DECL, ident });

function analyzeList(list) {
  const unusedIdents = new Set();
  const globalIdents = new Map();
  const deps = [];

  for (const item of list) {
    switch (item.kind) {
      case USE_DECL: {
        globalIdents.set(item.ident, item.fn);
        unusedIdents.add(item.ident);
        break;
      }
      case DEP_DECL: {
        deps.push(item.ident);
        break;
      }
      default: {
        throw new Error('Unreachable.');
      }
    }
  }

  for (const ident of deps) {
    if (!globalIdents.has(ident)) {
      error(`Reference error: Use of undeclared variable '${ident}'.`);
      continue;
    }
    if (unusedIdents.has(ident)) {
      unusedIdents.delete(ident);
    }
    globalIdents.get(ident)();
  }

  if (unusedIdents.size !== 0) {
    for (const ident of unusedIdents) {
      warn(`Unused declared variable '${ident}'.`);
    }
  }
}

const itemList = [
  Dep('b'),
  Use('a', () => console.log('a called!')),
  Dep('a'),
  Dep('b'),
  Use('c', () => console.log('c called!')),
  Use('b', () => console.log('b called!'))
];

analyzeList(itemList);
