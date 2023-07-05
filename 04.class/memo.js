#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import * as readline from "node:readline/promises";
import AllMemos from "./all_memos.js";
import FileOperation from "./file_operation.js";

function listMemoName(memoObjects) {
  memoObjects.forEach((oneMemo) => {
    console.log(oneMemo.getFirstLine());
  });
}

async function referMemoValue(memoObjects) {
  const displayItems = [];
  await memoObjects.forEach((oneMemo) => {
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

async function deleteMemo(memoObjects, allMemos, file) {
  const displayItems = [];
  await memoObjects.forEach((oneMemo, index) => {
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
  await memoObjects.splice(answers.note, 1);
  const memoJson = await allMemos.objectsToJson(memoObjects);
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

async function writeMemo(allMemos, file) {
  const newLines = await readTerminal();
  const memoObjects = await allMemos.add(newLines);
  const memoJson = await allMemos.objectsToJson(memoObjects);
  file.writeFile(memoJson);
}

program.option("-l", "list").option("-r", "refer").option("-d", "delete");
program.parse(process.argv);
const options = program.opts();

const file = new FileOperation("memofile.json");
await file.check();
const memoJson = await file.readFile();
const allMemos = new AllMemos();
const memoObjects = await allMemos.jsonToObjects(memoJson);

if (options.l) {
  memoObjects.length === 0
    ? console.log("メモ無し")
    : listMemoName(memoObjects);
} else if (options.r) {
  memoObjects.length === 0
    ? console.log("メモ無し")
    : referMemoValue(memoObjects);
} else if (options.d) {
  memoObjects.length === 0
    ? console.log("メモ無し")
    : deleteMemo(memoObjects, allMemos, file);
} else {
  writeMemo(allMemos, file);
}
