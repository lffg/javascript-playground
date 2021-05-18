function createReplacer(nameFn) {
  const seen = new WeakSet();
  return function replacer(key, val) {
    if (typeof val === 'object' && !!val) {
      if (seen.has(val)) {
        return nameFn(val);
      }
      seen.add(val);
    }
    return val;
  };
}

function stringifyCyclic(startNode, space, nameFn) {
  if (typeof nameFn !== 'function') {
    nameFn = (obj) => `[cycle: ${Object.prototype.toString.call(obj)}]`;
  }

  const replacer = createReplacer(nameFn);
  return JSON.stringify(startNode, replacer, space);
}

//
// Example usage:
//

const nodeC = { value: 'c', next: null };
const nodeB = { value: 'b', next: nodeC };
const nodeA = { value: 'a', next: nodeB };
nodeC.next = nodeA;

console.log(stringifyCyclic(nodeA, 2, (o) => `[cycle: node(${o.value})]`));
