function createReplacer(nameFn) {
  const seen = new WeakSet();
  return function replacer(key, val) {
    if (typeof val === "object" && !!val) {
      if (seen.has(val)) {
        return nameFn(val);
      }
      seen.add(val);
    }
    return val;
  };
}

function stringifyCyclic(startNode, space, nameFn) {
  if (typeof nameFn !== "function") {
    nameFn = (obj) => `[cycle: ${Object.prototype.toString.call(obj)}]`;
  }

  const replacer = createReplacer(nameFn);
  return JSON.stringify(startNode, replacer, space);
}
