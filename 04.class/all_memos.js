import FileOperation from "./file_operation.js";
import OneMemo from "./one_memo.js";

export default class AllMemos {
  #file;
  #memos;

  async setFile(fileName) {
    const file = new FileOperation(fileName);
    this.#file = file;
    await file.check();
  }

  async readAllMemos() {
    const memoFileJson = await this.#file.readFile();
    const memoFile = JSON.parse(memoFileJson);
    const allLines = memoFile.allLines;
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
    allMemos.push(newMemo);
    return allMemos;
  }

  async write(allMemos) {
    const allLines = [];
    await allMemos.forEach((oneMemo) => {
      allLines.push(oneMemo.getLines());
    });
    const memoFile = { allLines: allLines };
    const memoFileJson = JSON.stringify(memoFile, null, 2);
    await this.#file.writeFile(memoFileJson);
  }
}
