export default class Item {
  #memo;

  constructor(oneMemo) {
    this.#memo = oneMemo;
  }

  getListItem() {
    return this.#memo.getFirstLine();
  }

  getReferItem() {
    return {
      name: this.#memo.getFirstLine(),
      value: this.#memo.getFullText(),
    };
  }

  getDeleteItem() {
    return {
      name: this.#memo.getFirstLine(),
      value: this.#memo,
    };
  }
}
