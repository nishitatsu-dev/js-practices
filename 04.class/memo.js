#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import * as readline from "node:readline/promises";
import AllMemos from "./all_memos.js";

async function listMemoName(memosMap) {
  memosMap.forEach((body) => {
    console.log(body.name);
  });
}

async function referMemoValue(memosMap) {
  const bodies = [];
  memosMap.forEach((body) => {
    bodies.push(body);
  });

  inquirer
    .prompt([
      {
        type: "list",
        name: "note",
        message: "Choose a note you want to see:",
        choices: bodies,
      },
    ])
    .then((answers) => {
      console.log(answers.note);
    });
}

async function deleteMemo(memosMap) {
  const invertValues = [];
  memosMap.forEach((memo, date) => {
    const invertValue = { name: memo.name, value: date };
    invertValues.push(invertValue);
  });

  inquirer
    .prompt([
      {
        type: "list",
        name: "note",
        message: "Choose a note you want to delete:",
        choices: invertValues,
      },
    ])
    .then((answers) => {
      memosMap.delete(answers.note);
      memos.map = memosMap;
      memos.write();
    });
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
  memos.write(newLines);
}

program.option("-l", "list").option("-r", "refer").option("-d", "delete");
program.parse(process.argv);
const options = program.opts();
const memos = await AllMemos.read();
const memosMap = memos.map;
if (options.l) {
  memosMap.size === 0 ? console.log("メモ無し") : listMemoName(memosMap);
} else if (options.r) {
  memosMap.size === 0 ? console.log("メモ無し") : referMemoValue(memosMap);
} else if (options.d) {
  memosMap.size === 0 ? console.log("メモ無し") : deleteMemo(memosMap);
} else {
  writeMemo(memos);
}
