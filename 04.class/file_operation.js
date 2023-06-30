import * as fs from "node:fs/promises";

export default class FileOperation {
  #fileName;
  constructor(fileName) {
    this.#fileName = fileName;
  }

  async check() {
    try {
      await fs.stat(this.#fileName);
    } catch (e) {
      if (e.code === "ENOENT") {
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
    try {
      const memoFileJson = await fs.readFile(this.#fileName, {
        encoding: "utf8",
      });
      return memoFileJson;
    } catch (e) {
      if (e.code === "EPERM" || e.code === "EBUSY") {
        console.error(e.name + ": " + e.message);
        process.exitCode = 1;
      } else {
        throw e;
      }
    }
  }

  async writeFile(memoFileJson) {
    try {
      await fs.writeFile(this.#fileName, memoFileJson);
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
