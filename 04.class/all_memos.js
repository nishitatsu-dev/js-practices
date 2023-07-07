import OneMemo from "./one_memo.js";

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

  add(newLines) {
    const newMemo = new OneMemo(newLines);
    const allMemos = this.#memos;
    allMemos.push(newMemo);
    this.#memos = allMemos;
  }
}
