export default class OneMemo {
  #lines;

  constructor(lines) {
    this.#lines = lines;
  }

  getFirstLine() {
    return this.#lines[0];
  }

  getFullText() {
    return this.#lines.join("\n");
  }

  getLines() {
    return this.#lines;
  }
}
