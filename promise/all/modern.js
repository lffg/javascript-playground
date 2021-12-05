function* enumerate(iterable) {
  let i = 0;
  for (const el of iterable) {
    yield [i++, el];
  }
}

async function all(iterable) {
  const res = [];
  for (const [i, promise] of enumerate(iterable)) {
    // eslint-disable-next-line no-await-in-loop
    res[i] = await promise;
  }
  return res;
}
