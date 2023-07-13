import * as fs from "node:fs/promises";
import OneMemo from "./one_memo.js";
import Item from "./item.js";

export default class FileOperation {
  #fileName;

  constructor(fileName) {
    this.#fileName = fileName;
  }

  async check() {
    try {
      await fs.stat(this.#fileName);
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
    const memoMap = new Map();
    allLines.forEach((lines) => {
      const oneMemo = new OneMemo(lines);
      memoMap.set(oneMemo, new Item(oneMemo));
    });
    return memoMap;
  }

  async writeFile(allMemos) {
    const memos = allMemos.getMemos();
    const allLines = [];
    for (const key of memos.keys()) {
      allLines.push(key.getLines());
    }
    const linesObject = { allLines };
    const memoJson = JSON.stringify(linesObject, null, 2);
    await fs.writeFile(this.#fileName, memoJson);
  }
}
