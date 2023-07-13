#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import * as readline from "node:readline/promises";
import AllMemos from "./all_memos.js";
import OneMemo from "./one_memo.js";
import FileOperation from "./file_operation.js";

function listMemoName(allMemos) {
  const memos = allMemos.getMemos();
  memos.forEach((item) => {
    console.log(item.getListItem());
  });
}

async function referMemoValue(allMemos) {
  const displayItems = [];
  const memos = allMemos.getMemos();
  memos.forEach((item) => {
    displayItems.push(item.getReferItem());
  });

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "memo",
      message: "Choose a memo you want to see:",
      choices: displayItems,
    },
  ]);
  console.log(answers.memo);
}

async function deleteMemo(allMemos, fileOperation) {
  const displayItems = [];
  const memos = allMemos.getMemos();
  memos.forEach((item) => {
    displayItems.push(item.getDeleteItem());
  });

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "memo",
      message: "Choose a memo you want to delete:",
      choices: displayItems,
    },
  ]);
  const trashMemo = answers.memo;

  allMemos.delete(trashMemo);
  await fileOperation.writeFile(allMemos);
}

async function readTerminal() {
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  const newLines = [];
  for await (const line of reader) {
    newLines.push(line);
  }
  const newMemo = new OneMemo(newLines);
  return newMemo;
}

async function writeMemo(allMemos, fileOperation) {
  const newMemo = await readTerminal();
  allMemos.add(newMemo);
  await fileOperation.writeFile(allMemos);
}

program.option("-l", "list").option("-r", "refer").option("-d", "delete");
program.parse(process.argv);
const options = program.opts();

const fileOperation = new FileOperation("memofile.json");
await fileOperation.check();
const memoMap = await fileOperation.readFile();

const allMemos = new AllMemos(memoMap);
const memos = allMemos.getMemos();

if (options.l) {
  memos.length === 0 ? console.log("メモ無し") : listMemoName(allMemos);
} else if (options.r) {
  memos.length === 0 ? console.log("メモ無し") : referMemoValue(allMemos);
} else if (options.d) {
  memos.length === 0
    ? console.log("メモ無し")
    : deleteMemo(allMemos, fileOperation);
} else {
  writeMemo(allMemos, fileOperation);
}
