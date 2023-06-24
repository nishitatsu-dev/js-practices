import * as fs from "node:fs/promises";
import OneMemo from "./one_memo.js";

export default class AllMemos {
  async read() {
    try {
      const memoFileJson = await fs.readFile("memos.json", {
        encoding: "utf8",
      });
      const memosMap = new Map();
      const memoFile = JSON.parse(memoFileJson);
      const allLines = memoFile.allLines;
      allLines.forEach((lines, i) => {
        memosMap.set(i, new OneMemo(lines));
      });
      this.map = memosMap;
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

  async write(newLines = null) {
    try {
      const allLines = [];
      this.map.forEach((oneMemo) => {
        allLines.push(oneMemo.lines);
      });
      if (newLines !== null) {
        allLines.push(newLines);
      }
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
