import * as fs from "node:fs/promises";
import OneMemo from "./one_memo.js";

export default class AllMemos {
  constructor() {}

  static async read() {
    try {
      const memos = new AllMemos();
      const memos_json = await fs.readFile("exclude/memos.json", {
        encoding: "utf8",
      });
      const memosMap = new Map();
      const minimum_length = 20;
      if (memos_json.length <= minimum_length) {
        memosMap.set(0, new OneMemo(["仮メモ（内容無し）"]));
      } else {
        const memoFile = await JSON.parse(memos_json);
        const allLines = memoFile.allLines;
        allLines.forEach((lines, i) => {
          memosMap.set(i, new OneMemo(lines));
        });
      }
      memos.map = memosMap;
      return memos;
    } catch (e) {
      console.error(e.name + ": " + e.message);
      process.exitCode = 1;
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
      const memos_json = JSON.stringify(memoFile, null, 2);
      await fs.writeFile("exclude/memos.json", memos_json);
    } catch (e) {
      console.error(e.name + ": " + e.message);
      process.exitCode = 1;
    }
  }
}
