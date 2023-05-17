#!/usr/bin/env node

const options = require("minimist")(process.argv);

const date = new Date();
let year = options.y ? Number(options.y) : date.getFullYear();
let month = options.m ? Number(options.m) - 1 : date.getMonth();

const month_display = String(month + 1) + "月";
const year_display = String(year).replace(/,/, "");

console.log("      " + month_display + " " + year_display);
console.log("日 月 火 水 木 金 土");

const first_day = new Date(year, month, 1).getDay();
const last_date = new Date(year, month + 1, 0).getDate();
let days = new Array(first_day).fill("  ");
for (let i = 1; i <= last_date; i++) {
  let j = i <= 9 ? i.toString().padStart(2) : i.toString();
  days.push(j);
}

days.forEach(function (element, index, array) {
  if (index % 7 === 6 || index === array.length - 1) {
    process.stdout.write(element + "\n");
  } else {
    process.stdout.write(element + " ");
  }
});
