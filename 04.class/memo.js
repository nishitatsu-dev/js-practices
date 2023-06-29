#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import * as readline from "node:readline/promises";
import AllMemos from "./all_memos.js";

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

async function deleteMemo(allMemos) {
  const invertValues = [];
  await allMemos.forEach((oneMemo, index) => {
    const invertValue = { name: oneMemo.getFirstLine(), value: index };
    invertValues.push(invertValue);
  });

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "note",
      message: "Choose a note you want to delete:",
      choices: invertValues,
    },
  ]);
  await allMemos.splice(answers.note, 1);
  await memos.write(allMemos);
}

async function readTerminal() {
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  const lines = [];
  for await (const line of reader) {
    lines.push(line);
  }
  return lines;
}

async function writeMemo(memos) {
  const newLines = await readTerminal();
  const allMemos = await memos.add(newLines);
  memos.write(allMemos);
}

program.option("-l", "list").option("-r", "refer").option("-d", "delete");
program.parse(process.argv);
const options = program.opts();

const memos = new AllMemos();
const allMemos = await memos.read();

if (options.l) {
  allMemos.length === 0 ? console.log("メモ無し") : listMemoName(allMemos);
} else if (options.r) {
  allMemos.length === 0 ? console.log("メモ無し") : referMemoValue(allMemos);
} else if (options.d) {
  allMemos.length === 0 ? console.log("メモ無し") : deleteMemo(allMemos);
} else {
  writeMemo(memos);
}
