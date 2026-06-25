import type { DotMatrix } from '../../types/heritage';

const DOT_COLS = 60;
const DOT_ROWS = 40;

export interface ImageConvertOptions {
  threshold: number;   // 0–255; pixels darker than this → raised dot
  invert: boolean;     // flip: bright pixels become raised
  contain: boolean;    // letterbox-fit; if false, stretch to fill
}

/**
 * Draw `image` into a 60×40 canvas and produce a DotMatrix.
 * The canvas is reused across calls — pass the same element for efficiency.
 */
export function imageToMatrix(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  opts: ImageConvertOptions,
): DotMatrix {
  const { threshold, invert, contain } = opts;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, DOT_COLS, DOT_ROWS);

  let dw = DOT_COLS, dh = DOT_ROWS, dx = 0, dy = 0;
  if (contain) {
    const s = Math.min(DOT_COLS / image.naturalWidth, DOT_ROWS / image.naturalHeight);
    dw = image.naturalWidth * s;
    dh = image.naturalHeight * s;
    dx = (DOT_COLS - dw) / 2;
    dy = (DOT_ROWS - dh) / 2;
  }
  ctx.drawImage(image, dx, dy, dw, dh);

  const { data } = ctx.getImageData(0, 0, DOT_COLS, DOT_ROWS);
  const cells: (0 | 2)[][] = [];
  for (let y = 0; y < DOT_ROWS; y++) {
    const row: (0 | 2)[] = [];
    for (let x = 0; x < DOT_COLS; x++) {
      const i = (y * DOT_COLS + x) * 4;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const dark = data[i + 3] > 40 && lum < threshold;
      row.push((invert ? !dark : dark) ? 2 : 0);
    }
    cells.push(row);
  }
  return { width: DOT_COLS, height: DOT_ROWS, cells: cells as DotMatrix['cells'] };
}

/** Count raised-dot pixels in a matrix. */
export function countRaisedInMatrix(m: DotMatrix): number {
  return m.cells.reduce((s, row) => s + row.filter(c => c === 2).length, 0);
}
