// Trivial implementation. Not tested for all possibilities.
function eq(a, b, cmp = (x, y) => x === y) {
  const keys = new Set([...Reflect.ownKeys(a), ...Reflect.ownKeys(b)]);
  for (const key of keys) {
    const cmpFn =
      typeof a[key] === 'object' && a[key] !== null
        ? (x, y) => eq(x, y, cmp)
        : cmp;

    if (!cmpFn(a[key], b[key])) {
      return false;
    }
  }
  return true;
}
