import Item from "./item.js";

export default class AllMemos {
  #memos;

  constructor(memos) {
    this.#memos = memos;
  }

  getMemos() {
    return this.#memos;
  }

  delete(oneMemo) {
    this.#memos.delete(oneMemo);
  }

  add(oneMemo) {
    this.#memos.set(oneMemo, new Item(oneMemo));
  }
}
