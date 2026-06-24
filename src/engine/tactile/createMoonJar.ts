import type { DotMatrix } from '../../types/heritage';
import { createEmptyMatrix, drawHLine, drawVLine, setCell } from '../dotpad/matrixUtils';

// Moon Jar (백자 달항아리): nearly circular white porcelain
// Grid: 60 wide × 40 tall, center x=30
// Neck: y=2-6 (x=26-34), Body: y=5-33 (max width x=12-48 at y=18), Foot: y=33-37 (x=24-36)

const CX = 30;
const BODY_CENTER_Y = 18;
const BODY_TOP = 5;
const BODY_BOTTOM = 33;
const MAX_HALF_WIDTH = 18; // x=12 to x=48

/** Compute half-width of the jar body at a given row using ellipse equation */
function bodyHalfWidth(y: number): number {
  // Ellipse: half-width = maxHW * sin(angle), angle goes 0→π from top to bottom of body
  const span = BODY_BOTTOM - BODY_TOP;
  const t = (y - BODY_TOP) / span; // 0 to 1
  const angle = t * Math.PI;
  return Math.round(MAX_HALF_WIDTH * Math.sin(angle));
}

/** Draw the jar body outline for a given row */
function drawBodyRow(m: DotMatrix, y: number, v: 1 | 2 | 3, thick = 1): void {
  const hw = bodyHalfWidth(y);
  if (hw <= 0) return;
  const x1 = CX - hw;
  const x2 = CX + hw;
  for (let t = 0; t < thick; t++) {
    setCell(m, x1 + t, y, v);
    setCell(m, x2 - t, y, v);
  }
}

// ── 1. Silhouette ────────────────────────────────────────────────────────────
/** Full outline of the Moon Jar: neck, bulging round body, foot */
export function createMoonJarSilhouette(): DotMatrix {
  const m = createEmptyMatrix();

  // Neck top cap: y=2
  drawHLine(m, 2, 27, 33, 2);

  // Neck sides: y=2-5
  for (let y = 2; y <= 5; y++) {
    const spread = Math.round((y - 2) * 1.5); // widens slightly toward body
    setCell(m, 26 - spread, y, 2);
    setCell(m, 34 + spread, y, 2);
  }

  // Body: ellipse outline, thicker at equator
  for (let y = BODY_TOP; y <= BODY_BOTTOM; y++) {
    const distFromEquator = Math.abs(y - BODY_CENTER_Y);
    const v: 2 | 3 = distFromEquator <= 4 ? 3 : 2;
    const thick = distFromEquator <= 4 ? 2 : 1;
    drawBodyRow(m, y, v, thick);
  }

  // Foot: y=33-37, narrows from body to small base
  for (let y = 33; y <= 37; y++) {
    const hw = 6 + Math.round((37 - y) * 1.5); // hw: ~9 at y=33, ~6 at y=37
    setCell(m, CX - hw, y, 2);
    setCell(m, CX + hw, y, 2);
  }
  // Foot base line
  drawHLine(m, 37, 24, 36, 2);

  return m;
}

// ── 2. Structure ─────────────────────────────────────────────────────────────
/** Shows 3 zones: neck, body, foot with zone fills and dividers */
export function createMoonJarStructure(): DotMatrix {
  const m = createEmptyMatrix();

  // Dim overall body outline
  for (let y = BODY_TOP; y <= BODY_BOTTOM; y++) {
    drawBodyRow(m, y, 1, 1);
  }

  // Neck region fill (rows 2-7): horizontal lines
  for (let y = 2; y <= 7; y++) {
    drawHLine(m, y, 26, 34, 2);
  }

  // Body zone boundary only (rows 7-32): outline
  for (let y = 7; y <= 32; y++) {
    drawBodyRow(m, y, 2, 1);
  }

  // Foot zone fill (rows 33-37): strong fill
  for (let y = 33; y <= 37; y++) {
    const hw = 6 + Math.round((37 - y) * 1.5);
    drawHLine(m, y, CX - hw, CX + hw, 3);
  }

  // Divider lines between zones (value=3)
  // Neck / Body divider at y=7
  const hw7 = bodyHalfWidth(7);
  drawHLine(m, 7, CX - hw7, CX + hw7, 3);

  // Body / Foot divider at y=33
  const hw33 = bodyHalfWidth(33);
  drawHLine(m, 33, CX - hw33, CX + hw33, 3);

  return m;
}

// ── 3. Detail ────────────────────────────────────────────────────────────────
/** Latitude lines showing surface curvature + neck rim detail */
export function createMoonJarDetail(): DotMatrix {
  const m = createEmptyMatrix();

  // Dim body outline for context
  for (let y = BODY_TOP; y <= BODY_BOTTOM; y++) {
    drawBodyRow(m, y, 1, 1);
  }

  // Neck outline
  drawHLine(m, 2, 27, 33, 3);
  drawHLine(m, 3, 26, 34, 3);
  drawVLine(m, 26, 2, 5, 2);
  drawVLine(m, 34, 2, 5, 2);

  // Latitude lines across interior (rows 10, 14, 18, 22, 26)
  // Values: center line (y=18) strongest, outer lines lighter
  const latitudes: Array<[number, 1 | 2 | 3]> = [
    [10, 1],
    [14, 2],
    [18, 3], // equator
    [22, 2],
    [26, 1],
  ];

  for (const [y, v] of latitudes) {
    const hw = bodyHalfWidth(y);
    if (hw > 2) {
      // Interior line (inside the outline, so shrink by 2)
      drawHLine(m, y, CX - hw + 2, CX + hw - 2, v);
    }
  }

  return m;
}

// ── 4. Focus ─────────────────────────────────────────────────────────────────
/** Asymmetry focus: off-center neck opening characteristic of Korean moon jars */
export function createMoonJarFocus(): DotMatrix {
  const m = createEmptyMatrix();

  // Dim body outline
  for (let y = BODY_TOP; y <= BODY_BOTTOM; y++) {
    drawBodyRow(m, y, 1, 1);
  }

  // Highlight neck/opening area (rows 1-8) strongly
  // The opening is slightly left of center (Korean moon jar asymmetry)
  const openingCenterX = 29; // one cell left of center

  // Neck opening top edge
  drawHLine(m, 1, 25, 33, 3);
  // Neck inner walls emphasized
  drawVLine(m, 25, 1, 7, 3);
  drawVLine(m, 33, 1, 7, 3);
  drawHLine(m, 7, 25, 33, 3);

  // Mark off-center opening with strong dot at left side
  setCell(m, openingCenterX, 1, 3);
  setCell(m, openingCenterX - 1, 1, 3);

  // Arrow pointing left-of-center from above (rows 0-1 around x=28-29)
  setCell(m, openingCenterX, 0, 3);
  setCell(m, openingCenterX - 1, 0, 2);
  setCell(m, openingCenterX + 1, 0, 2);

  // Asymmetric width ticks on body at equator
  // Left side: double tick (wider)
  const hwEq = bodyHalfWidth(BODY_CENTER_Y);
  setCell(m, CX - hwEq, BODY_CENTER_Y, 3);
  setCell(m, CX - hwEq, BODY_CENTER_Y - 1, 2);
  setCell(m, CX - hwEq, BODY_CENTER_Y + 1, 2);
  // Right side: single tick (symmetric reference)
  setCell(m, CX + hwEq, BODY_CENTER_Y, 3);
  setCell(m, CX + hwEq, BODY_CENTER_Y - 1, 1);
  setCell(m, CX + hwEq, BODY_CENTER_Y + 1, 1);

  // Horizontal measurement bars at equator
  drawHLine(m, BODY_CENTER_Y - 2, CX - hwEq + 1, CX - 2, 1);
  drawHLine(m, BODY_CENTER_Y - 2, CX + 2, CX + hwEq - 1, 1);

  return m;
}

// ── 5. Quiz ───────────────────────────────────────────────────────────────────
/** Clean silhouette for quiz: outline only + question markers at 3 zones */
export function createMoonJarQuiz(): DotMatrix {
  const m = createEmptyMatrix();

  // Outline only (no fill) - same ellipse as silhouette
  drawHLine(m, 2, 27, 33, 2); // neck top

  for (let y = 2; y <= 5; y++) {
    const spread = Math.round((y - 2) * 1.5);
    setCell(m, 26 - spread, y, 2);
    setCell(m, 34 + spread, y, 2);
  }

  for (let y = BODY_TOP; y <= BODY_BOTTOM; y++) {
    drawBodyRow(m, y, 2, 1);
  }

  for (let y = 33; y <= 37; y++) {
    const hw = 6 + Math.round((37 - y) * 1.5);
    setCell(m, CX - hw, y, 2);
    setCell(m, CX + hw, y, 2);
  }
  drawHLine(m, 37, 24, 36, 2);

  // Question mark indicators at top zone (y=4, near neck)
  setCell(m, CX, 4, 1);
  setCell(m, CX - 1, 4, 1);
  setCell(m, CX + 1, 4, 1);

  // Question mark at middle zone (body center, interior)
  setCell(m, CX, BODY_CENTER_Y, 1);
  setCell(m, CX - 1, BODY_CENTER_Y, 1);
  setCell(m, CX + 1, BODY_CENTER_Y, 1);
  setCell(m, CX, BODY_CENTER_Y - 1, 1);

  // Question mark at bottom zone (foot center)
  setCell(m, CX, 35, 1);
  setCell(m, CX - 1, 35, 1);
  setCell(m, CX + 1, 35, 1);

  return m;
}
