// This must be a "paired" array.
// Each opening brace has to be in a even index. Its matching "closing" brace
// should be the next position.
const BRACES = ['(', ')', '[', ']', '{', '}'];

// EOF character
const EOF = Object.create(null);
EOF[Symbol.toPrimitive] = () => '<end of input>';

function memo1(fn) {
  const map = new Map();
  return (arg) => {
    const ref = map.get(arg);
    if (ref) {
      return ref;
    }
    const result = fn(arg);
    map.set(arg, result);
    return result;
  };
}

const getBraceIndex = memo1((brace) => {
  return BRACES.indexOf(brace);
});

function isValidBrace(brace) {
  return getBraceIndex(brace) !== -1;
}

function getMatchingBrace(brace) {
  const index = getBraceIndex(brace);
  if (index === -1) {
    throw new Error(`Invalid brace: "${brace}".`);
  }
  return BRACES[index + (index % 2 === 0 ? 1 : -1)];
}

function isClosingBrace(brace) {
  return getBraceIndex(brace) % 2 === 1;
}

function Ranged(value, start, end = start + 1) {
  const proto = {};
  return Object.assign(Object.create(proto), { value, start, end });
}

function isBalanced(str) {
  const reporter = Reporter(str);
  const stack = [];
  let i = 0;
  for (; i < str.length; i++) {
    const brace = str[i];
    const rangedBrace = Ranged(brace, i);

    if (!isValidBrace(brace)) {
      return reporter.invalid(rangedBrace).toString();
    }

    if (isClosingBrace(brace)) {
      if (stack.length === 0) {
        return reporter.unexpected(rangedBrace).expected(EOF).toString();
      }

      const expectedOpeningBrace = getMatchingBrace(brace);
      const popped = stack.pop();
      if (popped.value !== expectedOpeningBrace) {
        return reporter
          .unexpected(rangedBrace)
          .expected('any opening brace', false)
          .toString();
      }
      continue;
    }

    // else...
    stack.push(rangedBrace);
  }

  if (stack.length > 0) {
    return reporter
      .unexpected(Ranged(EOF, i))
      .expected(getMatchingBrace(stack.pop().value))
      .toString();
  }

  return true;
}

// Error reporter
function Reporter(source) {
  return {
    invalid: (invalidRangedChar) => ({
      toString: () => {
        const strReporter = new StringReportBuilder({
          errorMessage: 'Invalid character in stream',
          reportedRange: invalidRangedChar,
          source
        });
        return strReporter
          .line('This is not a valid brace.')
          .line(`Should be one of ${BRACES.join(', ')}.`)
          .generate();
      }
    }),
    unexpected: (unexpectedRangedChar) => ({
      expected: (expectedChar, shouldQuote = true) => ({
        toString: () => {
          const strReporter = new StringReportBuilder({
            errorMessage: 'Unexpected character in stream',
            reportedRange: unexpectedRangedChar,
            source
          });
          return strReporter
            .line(`Expected ${maybeQuote(expectedChar, shouldQuote)}.`)
            .line(`Instead found "${unexpectedRangedChar.value}".`)
            .generate();
        }
      })
    })
  };
}

class StringReportBuilder {
  constructor({ source, reportedRange, errorMessage }) {
    Object.assign(this, { source, reportedRange, errorMessage });
    const { start, end } = reportedRange;
    this.pad = ' '.repeat(start);
    this.lines = [
      `Error: ${errorMessage}.`,
      `  1 | ${source}`,
      `  . | ${this.pad + '^'.repeat(end - start)}`
    ];
  }

  line(message) {
    this.lines.push(`  . | ${this.pad}` + message);
    return this;
  }

  generate() {
    return this.lines.join('\n');
  }
}

function maybeQuote(str, shouldQuote = true) {
  if (shouldQuote) {
    return `"${str}"`;
  }
  return str;
}

// node.js
const str = process.argv[2];
console.log(`Checking "${str}"...\n`);
const res = isBalanced(str);
console.log(res === true ? 'ok.' : res);
console.log('');
