// Não faça isso. :))

const countLetters = (str) =>
  Array.prototype.reduce.call(
    str,
    (acc, curr) =>
      Object.assign(acc, {
        [curr]: (acc[curr] || 0) + 1,
      }),
    {}
  );
