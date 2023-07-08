export default class AllMemos {
  #memos;
  constructor(memoObjects) {
    this.#memos = memoObjects;
  }

  getMemos() {
    return this.#memos;
  }

  delete(oneMemo) {
    const index = this.#memos.indexOf(oneMemo);
    this.#memos.splice(index, 1);
  }

  add(oneMemo) {
    const allMemos = this.#memos;
    allMemos.push(oneMemo);
    this.#memos = allMemos;
  }
}
