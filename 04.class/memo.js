#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import * as readline from "node:readline";
import AllMemos from "./all_memos.js";

async function listMemoName() {
  const memos = await AllMemos.read();
  const memosMap = memos.map;
  let names = [];
  memosMap.forEach((body) => {
    names.push(body.name);
  });
  console.log(names.join("\n"));
}

async function referMemoValue() {
  const memos = await AllMemos.read();
  const memosMap = memos.map;
  let bodies = [];
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
      console.log("\n" + answers.note);
    });
}

async function deleteMemo() {
  const memos = await AllMemos.read();
  const memosMap = memos.map;
  let invertValues = [];
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

function readTerminal() {
  return new Promise((resolve) => {
    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    let lines = [];
    reader.on("line", function (line) {
      lines.push(line);
    });
    reader.on("close", function () {
      resolve(lines);
    });
  });
}

async function writeMemo() {
  const newLines = await readTerminal();
  const memos = await AllMemos.read();
  memos.write(newLines);
}

program.option("-l", "list").option("-r", "refer").option("-d", "delete");
program.parse(process.argv);
const options = program.opts();
if (options.l) {
  listMemoName();
} else if (options.r) {
  referMemoValue();
} else if (options.d) {
  deleteMemo();
} else {
  writeMemo();
}
