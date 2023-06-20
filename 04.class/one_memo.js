export default class OneMemo {
  constructor(lines) {
    this.name = lines[0];
    this.value = lines.join("\n");
    this.lines = lines;
  }
}
