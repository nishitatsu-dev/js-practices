#!/usr/bin/env node

let options = process.argv.slice(2);

let date = new Date();
let year = date.getFullYear();
if (options.includes("-y")) {
  let index_y = options.indexOf("-y");
  year = Number(options[index_y + 1]);
}
let month = date.getMonth();
if (options.includes("-m")) {
  let index_m = options.indexOf("-m");
  month = Number(options[index_m + 1]) - 1;
}

let month_display =
  (month + 1).toLocaleString({ timeZone: "Asia/Tokyo" }) + "月";
let year_display = year
  .toLocaleString({ timeZone: "Asia/Tokyo" })
  .replace(/,/, "");

console.log("      " + month_display + " " + year_display);
console.log("日 月 火 水 木 金 土");

let first_day = new Date(year, month, 1).getDay();
let last_date = new Date(year, month + 1, 0).getDate();
let dummy_days = new Array(first_day).fill("  ");
let days = [];
for (let i = 1; i <= last_date; i++) {
  let j = (" " + i.toString()).slice(-2);
  days.push(j);
}

let days_display = dummy_days.concat(days);
for (; 0 < days_display.length; ) {
  let seven_days = days_display.splice(0, 7);
  console.log(seven_days.join(" "));
}
