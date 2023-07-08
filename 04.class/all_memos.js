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

  add(newMemo) {
    const allMemos = this.#memos;
    allMemos.push(newMemo);
    this.#memos = allMemos;
  }
}
