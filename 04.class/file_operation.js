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
    const memoFileJson = await fs.readFile(this.#fileName, {
      encoding: "utf8",
    });
    return memoFileJson;
  }

  async writeFile(memoFileJson) {
    await fs.writeFile(this.#fileName, memoFileJson);
  }
}
