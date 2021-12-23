function isUpper(char) {
  return /[A-Z]/.test(char);
}

function maybeReplace(i, char) {
  if (isUpper(char)) {
    const lowered = char.toLowerCase();
    return i === 0 ? lowered : `_${lowered}`;
  }
  return char;
}

function snakeCase(str) {
  let s = '';
  let i = 0;
  for (const char of str) {
    s += maybeReplace(i++, char);
  }
  return s;
}
