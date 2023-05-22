#!/usr/bin/env node

const options = require("minimist")(process.argv);

const date = new Date();
const year = options.y ? Number(options.y) : date.getFullYear();
const month = options.m ? Number(options.m) - 1 : date.getMonth();

const month_display = String(month + 1) + "月";
const year_display = String(year).replace(/,/, "");

console.log("      " + month_display + " " + year_display);
console.log("日 月 火 水 木 金 土");

const first_day = new Date(year, month, 1).getDay();
const last_date = new Date(year, month + 1, 0).getDate();
const days = new Array(first_day).fill("  ");
for (let i = 1; i <= last_date; i++) {
  const j = i.toString().padStart(2);
  days.push(j);
}

days.forEach(function (day, index) {
  if (index % 7 === 6) {
    process.stdout.write(day + "\n");
  } else {
    process.stdout.write(day + " ");
  }
});
process.stdout.write("\n");
