import type { DotMatrix } from '../../types/heritage';

/*
  Encode a 60×40 DotMatrix into the Dot Pad graphic frame format.

  - 60 × 40 pins = 2,400 binary dots
  - 2 × 4 pin block = one eight-dot braille cell = 1 byte
  - 60 × 40 pins = 30 × 10 cells = 300 bytes = 600 uppercase hex chars

  Eight-dot braille bit order per 2×4 block (matches the official SDK / DTMS):
    bit 0: (col 0, row 0)   bit 3: (col 1, row 0)
    bit 1: (col 0, row 1)   bit 4: (col 1, row 1)
    bit 2: (col 0, row 2)   bit 5: (col 1, row 2)
    bit 6: (col 0, row 3)   bit 7: (col 1, row 3)
*/

const WIDTH = 60;
const HEIGHT = 40;
const CELLS_X = WIDTH / 2;  // 30
const CELLS_Y = HEIGHT / 4; // 10
export const EXPECTED_HEX_LENGTH = 600;

// dx, dy within a 2×4 cell for each of the 8 bits.
const BIT_ORDER: ReadonlyArray<{ dx: number; dy: number }> = [
  { dx: 0, dy: 0 }, // bit 0 → dot 1
  { dx: 0, dy: 1 }, // bit 1 → dot 2
  { dx: 0, dy: 2 }, // bit 2 → dot 3
  { dx: 1, dy: 0 }, // bit 3 → dot 4
  { dx: 1, dy: 1 }, // bit 4 → dot 5
  { dx: 1, dy: 2 }, // bit 5 → dot 6
  { dx: 0, dy: 3 }, // bit 6 → dot 7
  { dx: 1, dy: 3 }, // bit 7 → dot 8
];

/** Any non-zero DotCell (1/2/3 intensity) raises the physical pin. */
export function dotMatrixToHex(matrix: DotMatrix): string {
  const { cells } = matrix;
  if (!Array.isArray(cells) || cells.length !== HEIGHT) {
    throw new Error(`Dot Pad matrix must have ${HEIGHT} rows; received ${cells?.length}.`);
  }

  let hex = '';
  for (let cy = 0; cy < CELLS_Y; cy++) {
    for (let cx = 0; cx < CELLS_X; cx++) {
      let byte = 0;
      for (let bit = 0; bit < 8; bit++) {
        const { dx, dy } = BIT_ORDER[bit];
        const row = cells[cy * 4 + dy];
        if (row && row[cx * 2 + dx]) byte |= 1 << bit;
      }
      hex += byte.toString(16).padStart(2, '0');
    }
  }
  return hex.toUpperCase();
}

/** Count of raised pins — used for diagnostics in the device panel. */
export function countRaisedDots(matrix: DotMatrix): number {
  return matrix.cells.reduce<number>(
    (total, row) => total + row.reduce<number>((n, v) => n + (v ? 1 : 0), 0),
    0,
  );
}
