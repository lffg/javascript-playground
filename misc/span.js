class Span {
  constructor(lo, hi) {
    Object.assign(this, { lo, hi });
  }

  to({ lo, hi }) {
    const minLo = Math.min(this.lo, lo);
    const maxHi = Math.max(this.hi, hi);
    return new Span(minLo, maxHi);
  }

  intersection({ lo, hi }) {
    const maxLo = Math.max(this.lo, lo);
    const minHi = Math.min(this.hi, hi);
    if (maxLo >= minHi) {
      return null;
    }
    return new Span(maxLo, minHi);
  }

  intersects(otherSpan) {
    return this.intersection(otherSpan) !== null;
  }
}
