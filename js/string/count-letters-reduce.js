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

//
// Example usage:
//

countLetters('AAABBC'); //-> { 'A': 3, 'B': 2, 'C': 1 }
