import * as fs from "node:fs";

export class ReadWriteFile {
  constructor() {}

  static async jsonToObject() {
    try {
      const memos = new ReadWriteFile();
      const memos_json = fs.readFileSync("exclude/memos.json", {
        encoding: "utf8",
      });
      const minimum_length = 48;
      if (memos_json.length <= minimum_length) {
        memos.object = { dummy: { name: "仮メモ（内容無し）", value: "" } };
      } else {
        memos.object = await JSON.parse(memos_json);
      }
      return memos;
    } catch (e) {
      console.error(e.name + ": " + e.message);
      process.exitCode = 1;
    }
  }

  objectToMap() {
    return new Map(Object.entries(this.object));
  }

  save() {
    try {
      const memos_json = JSON.stringify(this.object, null, 2);
      fs.writeFileSync("exclude/memos.json", memos_json);
    } catch (e) {
      console.error(e.name + ": " + e.message);
      process.exitCode = 1;
    }
  }
}
