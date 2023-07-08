#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import * as readline from "node:readline/promises";
import AllMemos from "./all_memos.js";
import OneMemo from "./one_memo.js";
import FileOperation from "./file_operation.js";

function listMemoName(allMemos) {
  const memos = allMemos.getMemos();
  memos.forEach((oneMemo) => {
    console.log(oneMemo.getFirstLine());
  });
}

async function referMemoValue(allMemos) {
  const displayItems = [];
  const memos = allMemos.getMemos();
  await memos.forEach((oneMemo) => {
    const item = { name: oneMemo.getFirstLine(), value: oneMemo.getFullText() };
    displayItems.push(item);
  });

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "note",
      message: "Choose a note you want to see:",
      choices: displayItems,
    },
  ]);
  console.log(answers.note);
}

async function deleteMemo(allMemos, file) {
  const displayItems = [];
  const memos = allMemos.getMemos();
  await memos.forEach((oneMemo, index) => {
    const Item = { name: oneMemo.getFirstLine(), value: index };
    displayItems.push(Item);
  });

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "note",
      message: "Choose a note you want to delete:",
      choices: displayItems,
    },
  ]);
  const index = answers.note;

  allMemos.delete(index);
  await file.writeFile(allMemos);
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

async function writeMemo(allMemos, file) {
  const newMemo = await readTerminal();
  allMemos.add(newMemo);
  await file.writeFile(allMemos);
}

program.option("-l", "list").option("-r", "refer").option("-d", "delete");
program.parse(process.argv);
const options = program.opts();

const file = new FileOperation("memofile.json");
await file.check();
const memoObjects = await file.readFile();

const allMemos = new AllMemos(memoObjects);
const memos = allMemos.getMemos();

if (options.l) {
  memos.length === 0 ? console.log("メモ無し") : listMemoName(allMemos);
} else if (options.r) {
  memos.length === 0 ? console.log("メモ無し") : referMemoValue(allMemos);
} else if (options.d) {
  memos.length === 0 ? console.log("メモ無し") : deleteMemo(allMemos, file);
} else {
  writeMemo(allMemos, file);
}
