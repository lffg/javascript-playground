class Queue {
  #data = [];

  #cap = 0;
  #len = 0;

  #first = 0;
  #next = 0;

  // Initializes a new Queue with the provided capacity.
  constructor(cap) {
    this.#cap = cap;
  }

  // Inserts element at the end, O(1).
  insert(el) {
    if (this.#len == this.#cap) {
      throw new Error("Not enough capacity");
    }
    this.#len++;
    this.#data[this.#next] = el;
    this.#next = (this.#next + 1) % this.#cap;
  }

  // Removes the first element, O(1).
  remove() {
    if (!this.#len) {
      throw new Error("Already empty");
    }
    this.#len--;
    const old = this.#data[this.#first];
    this.#data[this.#first] = null; // This isn't needed.
    this.#first = (this.#first + 1) % this.#cap;
    return old;
  }

  // Applies `cb` for each element, O(n).
  forEach(cb) {
    for (let i = 0; i < this.#len; i++) {
      const pos = (this.#first + i) % this.#cap;
      cb(this.#data[pos]);
    }
  }

  // Returns shallow a copy of the internal buffer, O(n).
  // For debugging purposes.
  get $data() {
    return [...this.#data];
  }
}
