#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import * as readline from "node:readline/promises";
import AllMemos from "./all_memos.js";
import FileOperation from "./file_operation.js";

function listMemoName(allMemos) {
  allMemos.forEach((oneMemo) => {
    console.log(oneMemo.getFirstLine());
  });
}

async function referMemoValue(allMemos) {
  const displayItems = [];
  await allMemos.forEach((oneMemo) => {
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

async function deleteMemo(allMemos, memos, file) {
  const displayItems = [];
  await allMemos.forEach((oneMemo, index) => {
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
  await allMemos.splice(answers.note, 1);
  const memoJson = await memos.objectsToJson(allMemos);
  file.writeFile(memoJson);
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
  return newLines;
}

async function writeMemo(memos, file) {
  const newLines = await readTerminal();
  const allMemos = await memos.add(newLines);
  const memoJson = await memos.objectsToJson(allMemos);
  file.writeFile(memoJson);
}

program.option("-l", "list").option("-r", "refer").option("-d", "delete");
program.parse(process.argv);
const options = program.opts();

const file = new FileOperation("memos.json");
await file.check();
const memoJson = await file.readFile();
const memos = new AllMemos();
const allMemos = await memos.jsonToObjects(memoJson);

if (options.l) {
  allMemos.length === 0 ? console.log("メモ無し") : listMemoName(allMemos);
} else if (options.r) {
  allMemos.length === 0 ? console.log("メモ無し") : referMemoValue(allMemos);
} else if (options.d) {
  allMemos.length === 0
    ? console.log("メモ無し")
    : deleteMemo(allMemos, memos, file);
} else {
  writeMemo(memos, file);
}
