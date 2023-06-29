import * as fs from "node:fs/promises";
import OneMemo from "./one_memo.js";

export default class AllMemos {
  async read() {
    try {
      const memoFileJson = await fs.readFile("memos.json", {
        encoding: "utf8",
      });
      const memoFile = JSON.parse(memoFileJson);
      const allLines = memoFile.allLines;
      const allMemos = [];
      await allLines.forEach((lines) => {
        allMemos.push(new OneMemo(lines));
      });
      this.memos = allMemos;
      return allMemos;
    } catch (e) {
      if (e.code === "ENOENT") {
        console.error(e.name + ": " + e.message);
        const memoFile = { allLines: [] };
        const memoFileJson = JSON.stringify(memoFile, null, 2);
        await fs.writeFile("memos.json", memoFileJson);
        console.error("memos.jsonファイルを作りました。リトライしてください");
        process.exitCode = 1;
      } else if (e.code === "EPERM" || e.code === "EBUSY") {
        console.error(e.name + ": " + e.message);
        process.exitCode = 1;
      } else {
        throw e;
      }
    }
  }

  async add(newLines) {
    const newMemo = new OneMemo(newLines);
    const allMemos = this.memos;
    allMemos.push(newMemo);
    return allMemos;
  }

  async write(allMemos) {
    try {
      const allLines = [];
      allMemos.forEach((oneMemo) => {
        allLines.push(oneMemo.lines);
      });
      const memoFile = { allLines: allLines };
      const memoFileJson = JSON.stringify(memoFile, null, 2);
      await fs.writeFile("memos.json", memoFileJson);
    } catch (e) {
      if (e.code === "ENOENT") {
        console.error(e.name + ": " + e.message);
        process.exitCode = 1;
      } else {
        throw e;
      }
    }
  }
}
