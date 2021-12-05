function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const result = [];
    let remainingPromises = 0;

    function handlePromise(promise, currentIndex) {
      remainingPromises++;
      promise
        .then((resolvedValue) => {
          result[currentIndex] = resolvedValue;

          if (--remainingPromises === 0) {
            resolve(result);
          }
        })
        .catch(reject);
    }

    let currentIndex = 0;
    for (const element of iterable) {
      handlePromise(Promise.resolve(element), currentIndex++);
    }

    if (currentIndex === 0) {
      resolve(result);
    }
  });
}
