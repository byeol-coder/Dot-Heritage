import type { DotMatrix, DotCell } from '../../types/heritage';

export function createEmptyMatrix(): DotMatrix {
  return {
    width: 60,
    height: 40,
    cells: Array.from({ length: 40 }, () => Array(60).fill(0) as DotCell[]),
  };
}

export function setCell(m: DotMatrix, x: number, y: number, v: DotCell): void {
  if (x >= 0 && x < 60 && y >= 0 && y < 40) m.cells[y][x] = v;
}

export function drawHLine(m: DotMatrix, y: number, x1: number, x2: number, v: DotCell = 2): void {
  for (let x = x1; x <= x2; x++) setCell(m, x, y, v);
}

export function drawVLine(m: DotMatrix, x: number, y1: number, y2: number, v: DotCell = 2): void {
  for (let y = y1; y <= y2; y++) setCell(m, x, y, v);
}

export function drawRect(m: DotMatrix, x1: number, y1: number, x2: number, y2: number, v: DotCell = 2, fill = false): void {
  if (fill) {
    for (let y = y1; y <= y2; y++) drawHLine(m, y, x1, x2, v);
  } else {
    drawHLine(m, y1, x1, x2, v);
    drawHLine(m, y2, x1, x2, v);
    drawVLine(m, x1, y1, y2, v);
    drawVLine(m, x2, y1, y2, v);
  }
}

export function drawThickHLine(m: DotMatrix, y: number, x1: number, x2: number, thickness = 2, v: DotCell = 2): void {
  for (let t = 0; t < thickness; t++) drawHLine(m, y + t, x1, x2, v);
}

export function drawThickVLine(m: DotMatrix, x: number, y1: number, y2: number, thickness = 2, v: DotCell = 2): void {
  for (let t = 0; t < thickness; t++) drawVLine(m, x + t, y1, y2, v);
}
