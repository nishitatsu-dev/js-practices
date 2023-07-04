import OneMemo from "./one_memo.js";

export default class AllMemos {
  #memos;

  async jsonToObjects(memoJson) {
    const allLines = JSON.parse(memoJson).allLines;
    const allMemos = [];
    await allLines.forEach((lines) => {
      allMemos.push(new OneMemo(lines));
    });
    this.#memos = allMemos;
    return allMemos;
  }

  async add(newLines) {
    const newMemo = new OneMemo(newLines);
    const allMemos = this.#memos;
    await allMemos.push(newMemo);
    return allMemos;
  }

  async objectsToJson(allMemos) {
    const allLines = [];
    await allMemos.forEach((oneMemo) => {
      allLines.push(oneMemo.getLines());
    });
    const memoFile = { allLines: allLines };
    const memoJson = JSON.stringify(memoFile, null, 2);
    return memoJson;
  }
}
