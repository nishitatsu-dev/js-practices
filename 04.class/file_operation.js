import * as fs from "node:fs/promises";
import OneMemo from "./one_memo.js";

export default class FileOperation {
  #fileName;

  constructor(fileName) {
    this.#fileName = fileName;
  }

  async setInitialFile() {
    try {
      await fs.access(this.#fileName, fs.constants.F_OK);
    } catch (e) {
      if (e.constructor === Error && e.code === "ENOENT") {
        const memoFile = { allLines: [] };
        const memoFileJson = JSON.stringify(memoFile, null, 2);
        await fs.writeFile(this.#fileName, memoFileJson);
        console.error("保存先ファイルを新規作成しました");
      } else {
        throw e;
      }
    }
  }

  async readFile() {
    const memoFileJson = await fs.readFile(this.#fileName, {
      encoding: "utf8",
    });
    const { allLines } = JSON.parse(memoFileJson);
    const memoObjects = allLines.map((lines) => new OneMemo(lines));
    return memoObjects;
  }

  async writeFile(allMemos) {
    const memoObjects = allMemos.getMemos();
    const allLines = memoObjects.map((oneMemo) => oneMemo.getLines());
    const linesObject = { allLines };
    const memoJson = JSON.stringify(linesObject, null, 2);
    await fs.writeFile(this.#fileName, memoJson);
  }
}
