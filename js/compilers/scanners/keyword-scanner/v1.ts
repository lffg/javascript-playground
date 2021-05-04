interface KwTree {
  children: Map<string, KwTree>;
  final: string | null;
}

type ScannerResult<T> =
  | { type: 'ok'; data: T; rest: string }
  | { type: 'err'; error: any };

function KwTree(kwSet: Set<string>): KwTree {
  const root: KwTree = {
    children: new Map(),
    final: null
  };

  for (const keyword of kwSet) {
    let ref: KwTree = root;
    for (const char of keyword) {
      const current = ref.children.get(char);
      if (!current) {
        const newRef = {
          children: new Map(),
          final: null
        };
        ref.children.set(char, newRef);
        ref = newRef;
      } else {
        ref = current;
      }
    }
    ref.final = keyword;
  }

  return root;
}

function KwScanner(kwSet: Set<string>) {
  const kwTree = KwTree(kwSet);

  return function (input: string): ScannerResult<string> {
    let prevValidKw: { kw: string; i: number } | null = null;
    let currKwSubstr = '';
    let currBranch = kwTree;

    for (let i = 0; i < input.length; i++) {
      const currChar = input[i];
      currKwSubstr += currChar;

      const targetBranch = currBranch.children.get(currChar);
      if (!targetBranch) {
        if (prevValidKw) {
          return ok({
            data: prevValidKw.kw,
            rest: input.slice(prevValidKw.i + 1)
          });
        }
        return err(`Unexpected '${currChar}' in segment '${currKwSubstr}'.`);
      }
      if (targetBranch.final) {
        prevValidKw = {
          kw: targetBranch.final,
          i
        };
      }
      currBranch = targetBranch;
    }

    if (!prevValidKw) {
      return err(`Unexpected '${currKwSubstr}'.`);
    }

    return ok({
      data: prevValidKw.kw,
      rest: input.slice(prevValidKw.i + 1)
    });
  };
}

function err<E>(error: E) {
  return { type: 'err', error } as const;
}

function ok<T>(data: T) {
  return { type: 'ok', ...data } as const;
}

////////////////////////////////////////////////////////////////////////////////
//
// TESTS...
//
////////////////////////////////////////////////////////////////////////////////

const keywords = new Set([
  'do',
  'defun',
  'define',
  'with',
  'while',
  'for',
  'foreach'
]);

console.clear();

const scanner = KwScanner(keywords);
Object.assign(globalThis as any, {
  KwScanner,
  KwTree,
  scanner
});

['defunnn', 'withime', 'w ith', 'dostuf', 'd2o'].forEach((str) => {
  console.log(`Scanning "${str}"... Result:`, scanner(str));
});
