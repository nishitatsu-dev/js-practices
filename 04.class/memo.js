#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import * as readline from "node:readline";
import { ReadWriteFile } from "./read_write_file.js";

async function listMemoName() {
  const memos = await ReadWriteFile.jsonToObject();
  const memos_map = memos.objectToMap();
  let names = [];
  memos_map.forEach((body) => {
    names.push(body.name);
  });
  console.log(names.join("\n"));
}

async function referMemoValue() {
  const memos = await ReadWriteFile.jsonToObject();
  const memos_map = memos.objectToMap();
  let names = [];
  memos_map.forEach((body) => {
    names.push(body);
  });

  inquirer
    .prompt([
      {
        type: "list",
        name: "note",
        message: "Choose a note you want to see:",
        choices: names,
      },
    ])
    .then((answers) => {
      console.log("\n" + answers.note);
    });
}

async function deleteMemo() {
  const memos = await ReadWriteFile.jsonToObject();
  const memos_map = memos.objectToMap();
  let invert_values = [];
  memos_map.forEach((memo, date) => {
    const invert_value = { name: memo.name, value: date };
    invert_values.push(invert_value);
  });

  inquirer
    .prompt([
      {
        type: "list",
        name: "note",
        message: "Choose a note you want to delete:",
        choices: invert_values,
      },
    ])
    .then((answers) => {
      memos_map.delete(answers.note);
      memos.object = Object.fromEntries(memos_map);
      memos.save();
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
  const lines = await readTerminal();
  const new_memo = { [Date()]: { name: lines[0], value: lines.join("\n") } };
  const memos = await ReadWriteFile.jsonToObject();
  memos.object = await Object.assign(memos.object, new_memo);
  memos.save();
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
