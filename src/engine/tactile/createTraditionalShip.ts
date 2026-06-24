import type { DotMatrix } from '../../types/heritage';
import { createEmptyMatrix, drawHLine, drawVLine, drawRect, setCell, drawThickHLine } from '../dotpad/matrixUtils';

// Traditional Korean Ship (전통 선박): flat-bottomed vessel, horizontal orientation
// Bow on right (x=55), stern on left (x=5). Waterline y=28.
// Hull extends y=18 to y=32. Grid: 60 wide × 40 tall.

/** Draw the stern curve: x=8,y=31 up to x=5,y=24 */
function drawSternCurve(m: DotMatrix, v: 0 | 1 | 2 | 3): void {
  // Gentle curve from bottom-left to stern
  const points: Array<[number, number]> = [
    [8, 31], [7, 30], [6, 28], [5, 26], [5, 24],
  ];
  for (const [x, y] of points) setCell(m, x, y, v);
}

/** Draw the bow curve: x=52,y=31 → x=55,y=22 → x=54,y=19 */
function drawBowCurve(m: DotMatrix, v: 0 | 1 | 2 | 3): void {
  // Sharper curve for bow (right side)
  const points: Array<[number, number]> = [
    [52, 31], [53, 30], [54, 28], [55, 26], [55, 24], [55, 22], [54, 20], [54, 19],
  ];
  for (const [x, y] of points) setCell(m, x, y, v);
}

/** Draw the top deck with a slight curve */
function drawDeckLine(m: DotMatrix, v: 0 | 1 | 2 | 3): void {
  // Slight curve: center slightly higher than ends
  drawHLine(m, 19, 10, 50, v);
  // Slight dip at center gives gentle curve perception
  for (let x = 22; x <= 42; x++) setCell(m, x, 18, v);
}

// ── 1. Silhouette ────────────────────────────────────────────────────────────
/** Overall ship shape: hull, deck, mast, sail */
export function createTraditionalShipSilhouette(): DotMatrix {
  const m = createEmptyMatrix();

  // Flat bottom hull line: y=31 from x=8 to x=52
  drawHLine(m, 31, 8, 52, 2);

  // Stern curve (left/west side)
  drawSternCurve(m, 2);

  // Bow curve (right/east side)
  drawBowCurve(m, 2);

  // Top deck line y=19 from x=10 to x=50
  drawDeckLine(m, 2);

  // Connect deck to stern at x=10, y=19-24
  drawVLine(m, 10, 19, 24, 2);

  // Corner emphasis
  setCell(m, 8, 31, 3);   // stern-bottom corner
  setCell(m, 52, 31, 3);  // bow-bottom corner
  setCell(m, 54, 19, 3);  // bow-deck peak

  // Mast: vertical line x=22, y=6 to y=19
  drawVLine(m, 22, 6, 19, 2);

  // Sail: rect x=18-26, y=8-18, outline
  drawRect(m, 18, 8, 26, 18, 2);

  return m;
}

// ── 2. Structure ─────────────────────────────────────────────────────────────
/** Flat-bottom structure + frame ribs */
export function createTraditionalShipStructure(): DotMatrix {
  const m = createEmptyMatrix();

  // Dim hull outline for context
  drawHLine(m, 31, 8, 52, 1);
  drawSternCurve(m, 1);
  drawBowCurve(m, 1);
  drawDeckLine(m, 1);
  drawVLine(m, 10, 19, 24, 1);

  // Flat bottom emphasized: thick line y=31-32
  drawThickHLine(m, 31, 8, 52, 2, 3);

  // Keel line y=32 (structural backbone)
  drawHLine(m, 32, 8, 52, 3);

  // 5 vertical frame ribs inside hull: x=15,20,25,35,45 from y=20 to y=31
  const ribXs = [15, 20, 25, 35, 45];
  for (const x of ribXs) {
    drawVLine(m, x, 20, 31, 2);
  }

  // Mast step at x=22, y=18-19 (strong)
  setCell(m, 21, 18, 3); setCell(m, 22, 18, 3); setCell(m, 23, 18, 3);
  setCell(m, 22, 19, 3);

  // Mast
  drawVLine(m, 22, 6, 18, 2);

  return m;
}

// ── 3. Detail ────────────────────────────────────────────────────────────────
/** Oar positions + deck planks + rudder + bow ornament */
export function createTraditionalShipDetail(): DotMatrix {
  const m = createEmptyMatrix();

  // Hull outline (dim)
  drawHLine(m, 31, 8, 52, 1);
  drawSternCurve(m, 1);
  drawBowCurve(m, 1);
  drawDeckLine(m, 1);
  drawVLine(m, 10, 19, 24, 1);

  // Deck planks: horizontal lines y=20,22,24 across hull width
  drawHLine(m, 20, 11, 51, 1);
  drawHLine(m, 22, 11, 51, 1);
  drawHLine(m, 24, 11, 51, 1);

  // Oar positions: marks on both sides at x=12,18,30,40,48, y=32-35
  const oarXs = [12, 18, 30, 40, 48];
  for (const x of oarXs) {
    drawVLine(m, x, 32, 35, 2);
    // Oar blade: short horizontal at tip
    setCell(m, x - 1, 35, 2);
    setCell(m, x + 1, 35, 2);
  }

  // Rudder at stern: x=5-8, y=26-30
  drawRect(m, 5, 26, 8, 30, 3);

  // Bow ornament: x=54-56, y=20-23
  drawRect(m, 54, 20, 56, 23, 3);
  setCell(m, 55, 20, 3);
  setCell(m, 56, 21, 3);

  // Mast and sail
  drawVLine(m, 22, 6, 19, 1);
  drawRect(m, 18, 8, 26, 18, 1);

  return m;
}

// ── 4. Focus ─────────────────────────────────────────────────────────────────
/** Flat bottom vs curved hull comparison */
export function createTraditionalShipFocus(): DotMatrix {
  const m = createEmptyMatrix();

  // Dim overall hull outline
  drawHLine(m, 31, 8, 52, 1);
  drawSternCurve(m, 1);
  drawBowCurve(m, 1);
  drawDeckLine(m, 1);
  drawVLine(m, 10, 19, 24, 1);

  // Strongly highlight flat bottom zone: y=30-32, full hull width
  drawThickHLine(m, 30, 8, 52, 3, 3);

  // Depth arrows at x=15 and x=45 pointing from deck top down to bottom
  // Arrow shaft
  drawVLine(m, 15, 19, 31, 2);
  // Arrowhead at bottom (y=31)
  setCell(m, 14, 30, 2); setCell(m, 16, 30, 2); // arrowhead wings
  // Top bar (deck level marker)
  setCell(m, 13, 19, 2); setCell(m, 14, 19, 2); setCell(m, 16, 19, 2); setCell(m, 17, 19, 2);

  drawVLine(m, 45, 19, 31, 2);
  setCell(m, 44, 30, 2); setCell(m, 46, 30, 2);
  setCell(m, 43, 19, 2); setCell(m, 44, 19, 2); setCell(m, 46, 19, 2); setCell(m, 47, 19, 2);

  // Zone marker bars: top-of-hull (y=19) and bottom (y=32)
  drawHLine(m, 19, 11, 50, 2);
  drawHLine(m, 32, 8, 52, 2);

  return m;
}

// ── 5. Quiz ───────────────────────────────────────────────────────────────────
/** Find bow vs stern: outline + bow marks (right) + stern marks (left) */
export function createTraditionalShipQuiz(): DotMatrix {
  const m = createEmptyMatrix();

  // Clean hull outline
  drawHLine(m, 31, 8, 52, 2);
  drawSternCurve(m, 2);
  drawBowCurve(m, 2);
  drawDeckLine(m, 2);
  drawVLine(m, 10, 19, 24, 2);

  // Bow (right side): 3 vertical lines marking the bow zone
  drawVLine(m, 50, 19, 31, 3);
  drawVLine(m, 52, 19, 31, 3);
  drawVLine(m, 54, 19, 29, 3);

  // Stern (left side): horizontal lines marking the stern zone
  drawHLine(m, 22, 5, 12, 3);
  drawHLine(m, 25, 5, 12, 3);
  drawHLine(m, 28, 5, 12, 3);

  // Dim middle section
  for (let x = 14; x <= 48; x++) {
    setCell(m, x, 20, 1);
    setCell(m, x, 25, 1);
    setCell(m, x, 30, 1);
  }

  return m;
}
