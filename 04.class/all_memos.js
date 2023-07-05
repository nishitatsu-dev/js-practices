import OneMemo from "./one_memo.js";

export default class AllMemos {
  #memos;

  getMemos() {
    return this.#memos;
  }

  async toObjects(memoJson) {
    const allLines = JSON.parse(memoJson).allLines;
    const allMemos = [];
    await allLines.forEach((lines) => {
      allMemos.push(new OneMemo(lines));
    });
    this.#memos = allMemos;
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

  async getJson() {
    const allMemos = this.#memos;
    const allLines = [];
    await allMemos.forEach((oneMemo) => {
      allLines.push(oneMemo.getLines());
    });
    const memoFile = { allLines: allLines };
    const memoJson = JSON.stringify(memoFile, null, 2);
    return memoJson;
  }
}
