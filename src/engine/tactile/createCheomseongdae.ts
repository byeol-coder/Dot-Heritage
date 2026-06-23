import type { DotMatrix } from '../../types/heritage';
import { createEmptyMatrix, drawThickHLine, drawHLine, drawVLine, drawRect, setCell } from '../dotpad/matrixUtils';

// Cheomseongdae: tapered tower, narrow top, wide base, small central window
// Grid: 60 wide × 40 tall

function towerWidth(row: number): number {
  // row 0 = top, row 39 = bottom
  // top ~10 wide, base ~28 wide, centered at x=30
  const minW = 10, maxW = 28;
  return Math.round(minW + (maxW - minW) * (row / 39));
}

export function createCheomseongdaeSilhouette(): DotMatrix {
  const m = createEmptyMatrix();
  // Draw tapered tower outline (rows 4–34)
  for (let row = 4; row <= 34; row++) {
    const w = towerWidth(row - 4);
    const x1 = 30 - Math.floor(w / 2);
    const x2 = 30 + Math.ceil(w / 2);
    // thick side walls (2px)
    for (let t = 0; t < 2; t++) {
      setCell(m, x1 + t, row, 2);
      setCell(m, x2 - t, row, 2);
    }
  }
  // top cap (rows 2-4)
  drawThickHLine(m, 2, 25, 35, 2, 2);
  // base platform (rows 35-38)
  drawThickHLine(m, 35, 16, 44, 2, 3);
  drawThickHLine(m, 37, 14, 46, 2, 2);
  // central window: row 18-20, center
  drawRect(m, 28, 18, 32, 21, 3);
  return m;
}

export function createCheomseongdaeWindow(): DotMatrix {
  const m = createEmptyMatrix();
  // Dim silhouette
  for (let row = 4; row <= 34; row++) {
    const w = towerWidth(row - 4);
    const x1 = 30 - Math.floor(w / 2);
    const x2 = 30 + Math.ceil(w / 2);
    setCell(m, x1, row, 1);
    setCell(m, x2, row, 1);
  }
  // Highlight window area with strong emphasis
  drawRect(m, 26, 16, 34, 23, 3);
  // Inner window
  drawRect(m, 28, 18, 32, 21, 2, true);
  // Arrows pointing to window
  drawHLine(m, 19, 20, 24, 3);
  drawHLine(m, 19, 36, 40, 3);
  return m;
}

export function createCheomseongdaeBase(): DotMatrix {
  const m = createEmptyMatrix();
  // Dim upper tower
  for (let row = 4; row <= 32; row++) {
    const w = towerWidth(row - 4);
    const x1 = 30 - Math.floor(w / 2);
    const x2 = 30 + Math.ceil(w / 2);
    setCell(m, x1, row, 1);
    setCell(m, x2, row, 1);
  }
  // Emphasize base
  drawThickHLine(m, 33, 18, 42, 2, 3);
  drawThickHLine(m, 35, 15, 45, 3, 3);
  drawThickHLine(m, 37, 12, 48, 2, 3);
  drawThickHLine(m, 39, 10, 50, 2, 2);
  return m;
}

export function createCheomseongdaeTop(): DotMatrix {
  const m = createEmptyMatrix();
  // Dim lower tower
  for (let row = 14; row <= 34; row++) {
    const w = towerWidth(row - 4);
    const x1 = 30 - Math.floor(w / 2);
    const x2 = 30 + Math.ceil(w / 2);
    setCell(m, x1, row, 1);
    setCell(m, x2, row, 1);
  }
  // Emphasize top
  drawThickHLine(m, 2, 24, 36, 2, 3);
  for (let row = 4; row <= 13; row++) {
    const w = towerWidth(row - 4);
    const x1 = 30 - Math.floor(w / 2);
    const x2 = 30 + Math.ceil(w / 2);
    for (let t = 0; t < 2; t++) {
      setCell(m, x1 + t, row, 3);
      setCell(m, x2 - t, row, 3);
    }
  }
  return m;
}

export function createCheomseongdaeQuiz(): DotMatrix {
  const m = createEmptyMatrix();
  // Tower silhouette dim
  for (let row = 4; row <= 34; row++) {
    const w = towerWidth(row - 4);
    const x1 = 30 - Math.floor(w / 2);
    const x2 = 30 + Math.ceil(w / 2);
    setCell(m, x1, row, 1);
    setCell(m, x2, row, 1);
  }
  // Three quiz zones: top (rows 4-12), middle (rows 13-24), bottom (rows 25-35)
  // Top zone label
  drawRect(m, 4, 4, 12, 12, 2);
  drawHLine(m, 8, 5, 11, 2);
  // Mid zone label (correct answer)
  drawRect(m, 4, 15, 12, 24, 3);
  drawHLine(m, 19, 5, 11, 3);
  drawVLine(m, 8, 16, 23, 3);
  // Bottom zone label
  drawRect(m, 4, 27, 12, 35, 2);
  drawHLine(m, 31, 5, 11, 2);
  return m;
}
