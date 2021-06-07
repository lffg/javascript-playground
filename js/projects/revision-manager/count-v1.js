function ObjectReduce(fn, acc) {
  return function objectReduce(targetObject) {
    return Object.entries(targetObject).reduce(
      (acc, entry) => fn(acc, entry),
      acc
    );
  };
}

function ObjectMap(fn) {
  return function objectMap(targetObject) {
    return ObjectReduce((acc, entry) => {
      const [key, val] = fn(entry);
      acc[key] = val;
      return acc;
    }, {})(targetObject);
  };
}

function pickSessionCountMap(totalSubjectCountMap, sessionCount) {
  const total = ObjectReduce(
    (total, [, val]) => total + val,
    0
  )(totalSubjectCountMap);
  const k = sessionCount / total;
  return ObjectMap(([key, val]) => [key, val * k])(totalSubjectCountMap);
}
