function getMapSet(map, key) {
  const arr = map.get(key);
  if (arr) {
    return arr;
  }
  const ref = new Set();
  map.set(key, ref);
  return ref;
}

function On(emap) {
  return function onEvent(eventKey, handler) {
    getMapSet(emap, eventKey).add(handler);
    return true;
  }
}

function Dispatch(emap) {
  return async function dispatch(eventKey, eventArgsArr) {
    for (const event of getMapSet(emap, eventKey)) {
      // todo: Promise.all here.
      await event.apply(null, eventArgsArr);
    }
  }
}

function EventHandler() {
  /** @type {Map<string, Array<(...args: any[]) => Promise<void> | void>> */
  const emap = new Map();

  return {
    on: On(emap),
    dispatch: Dispatch(emap)
  };
}

const evh = EventHandler();

evh.on('request', (data) => {
  console.log(data);
});

setInterval(() => {
  evh.dispatch('request', [{
    now: Date.now()
  }]);
}, 500);
