export function randomFromRange(min: number, max: number) {
  return ~~(Math.random() * (max - min + 1) + min);
}

export function randomColor(colors: string[]) {
  return colors[~~(Math.random() * colors.length)];
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;
  return Math.sqrt(xDist ** 2 + yDist ** 2);
}
