const warn = (msg) => console.warn(`warning: ${msg}`);
const error = (msg) =>
  console.error(`error: ${msg}`) || { ok: false, run: () => {} };

const LET_DECL = Symbol('let declaration');
const USE_DECL = Symbol('use declaration');

const Let = (ident, fn) => ({ kind: LET_DECL, ident, fn });
const Use = (ident) => ({ kind: USE_DECL, ident });

function analyzeList(list) {
  const unusedIdents = new Set();
  const idents = new Map();
  const uses = [];

  for (const item of list) {
    switch (item.kind) {
      case LET_DECL: {
        if (idents.has(item.ident)) {
          return error(`Identifier '${item.ident}' has already been declared.`);
        }
        idents.set(item.ident, item.fn);
        unusedIdents.add(item.ident);
        break;
      }
      case USE_DECL: {
        uses.push(item.ident);
        break;
      }
      default: {
        throw new Error('Unreachable.');
      }
    }
  }

  for (const ident of uses) {
    if (!idents.has(ident)) {
      return error(`Use of undeclared identifier '${ident}'.`);
    }
    if (unusedIdents.has(ident)) {
      unusedIdents.delete(ident);
    }
  }

  if (unusedIdents.size !== 0) {
    for (const ident of unusedIdents) {
      warn(`Unused identifier '${ident}'.`);
    }
  }

  return {
    ok: true,
    run() {
      for (const ident of uses) {
        idents.get(ident)();
      }
    }
  };
}

const itemList = [
  Use('b'),
  Let('a', () => console.log('a called!')),
  Use('a'),
  Use('b'),
  Let('c', () => console.log('c called!')),
  Let('b', () => console.log('b called!'))
];

analyzeList(itemList).run();
