export default class AllMemos {
  #memos;

  constructor(memos) {
    this.#memos = memos;
  }

  getMemos() {
    return this.#memos;
  }

  delete(oneMemo) {
    const index = this.#memos.indexOf(oneMemo);
    this.#memos.splice(index, 1);
  }

  add(oneMemo) {
    this.#memos.push(oneMemo);
  }
}
