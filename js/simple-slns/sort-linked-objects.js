//
// HELPERS
//

const eq = (a) => (b) => a === b;
const isNull = eq(null);

const prop = (key) => (o) => o[key];

const pipe = (...fns) => (initArg) =>
  fns.reduce((arg, currFn) => currFn(arg), initArg);

const ref = (initial, tag) =>
  Object.assign(Object.create(null), { tag, current: initial });

//
// ACTUAL IMPLEMENTATION
//

const isNullRef = pipe(prop('current'), isNull);
const makeIsBy = (key) => pipe(prop(key), isNull);
const isFirst = makeIsBy('prev');
const isLast = makeIsBy('next');

function updateRef(ref, newVal) {
  if (isNullRef(ref)) {
    return void (ref.current = newVal);
  }
  throw new Error(`Couldn't update not null ref (at this point) "${ref.tag}".`);
}

function sortPositions(positions) {
  const start = ref(null, 'start ref'); // invalid data check, get starting point
  const end = ref(null, 'end ref'); // invalid data check (only)
  const map = new Map();

  // First, create a map (and select the first and last positions):
  for (const position of positions) {
    if (isFirst(position)) updateRef(start, position);
    if (isLast(position)) updateRef(end, position);
    map.set(position.id, position);
  }

  // Then create a new (ordered, this time) map:
  const items = new Map();
  let curr = start.current;
  while (curr) {
    if (items.has(curr.id)) {
      throw new Error('Cycle detected.');
    }
    items.set(curr.id, curr);
    curr = map.get(curr.next);
  }

  // Then return the map values.
  // Per spec this shall return the values in their insertion order.
  return [...items.values()];
}

console.log(
  sortPositions([
    { name: 'Segundo', id: 2, prev: 1, next: 3 },
    { name: 'Quarto', id: 4, prev: 3, next: null },
    { name: 'Primeiro', id: 1, prev: null, next: 2 },
    { name: 'Terceiro', id: 3, prev: 2, next: 4 }
  ])
);
