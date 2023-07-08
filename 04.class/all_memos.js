export default class AllMemos {
  #memos;
  constructor(memoObjects) {
    this.#memos = memoObjects;
  }

  getMemos() {
    return this.#memos;
  }

  delete(index) {
    this.#memos.splice(index, 1);
  }

  add(newMemo) {
    const allMemos = this.#memos;
    allMemos.push(newMemo);
    this.#memos = allMemos;
  }
}
