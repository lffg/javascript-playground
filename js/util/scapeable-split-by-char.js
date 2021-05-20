// Please note:
//
// This can also be solved by using a regex with a negative lookbehind
// I've implemented this just for fun. :-)

function scapeableSplitByChar(controlChar, str) {
  const substrs = [''];
  for (const [currentChar, prevChar] of withPrev(str)) {
    if (currentChar === controlChar && prevChar !== '\\') {
      substrs.push('');
      continue;
    }
    substrs[substrs.length - 1] += currentChar;
  }
  return substrs;
}

function* withPrev(iterable) {
  let prev = null;
  for (const el of iterable) {
    yield [el, prev];
    prev = el;
  }
}

//
// Example usage:
//

scapeableSplitByChar(',', 'Foo\\,Bar,Baz\\,Qux\\,Quxx');
//                                  ↑
// -> ['Foo\\,Bar', 'Baz\\,Qux\\,Quxx']
