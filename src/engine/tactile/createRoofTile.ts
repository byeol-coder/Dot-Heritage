import type { DotMatrix } from '../../types/heritage';
import { createEmptyMatrix, drawHLine, drawVLine, drawRect, setCell } from '../dotpad/matrixUtils';

// Silla Roof-end Tile (신라 수막새): circular tile with lotus design
// Grid: 60 wide × 40 tall, center cx=30 cy=20
// Outer radius=18, petal zone radius=14, center boss radius=4

const CX = 30;
const CY = 20;
const OUTER_R = 18;
const PETAL_R_OUTER = 13;
const PETAL_R_INNER = 5;
const BOSS_HALF = 2; // 5×5 block: cx-2 to cx+2

/** Draw a circle outline of given radius (2-pixel thick option) */
function drawCircleOutline(m: DotMatrix, cx: number, cy: number, r: number, v: 0 | 1 | 2 | 3, thick = 1): void {
  for (let angle = 0; angle < 360; angle += 1) {
    const rad = (angle * Math.PI) / 180;
    for (let dr = 0; dr < thick; dr++) {
      const x = Math.round(cx + (r + dr) * Math.cos(rad));
      const y = Math.round(cy + (r + dr) * Math.sin(rad));
      setCell(m, x, y, v);
    }
  }
}

/** Draw a radial spoke from radius r1 to r2 at given angle (degrees) */
function drawSpoke(m: DotMatrix, cx: number, cy: number, r1: number, r2: number, angleDeg: number, v: 0 | 1 | 2 | 3): void {
  const rad = (angleDeg * Math.PI) / 180;
  for (let d = r1; d <= r2; d++) {
    setCell(m, Math.round(cx + d * Math.cos(rad)), Math.round(cy + d * Math.sin(rad)), v);
  }
}

/**
 * Draw a petal as a filled oval at a given angle.
 * Petals extend from PETAL_R_INNER to PETAL_R_OUTER along the spoke axis.
 */
function drawPetal(m: DotMatrix, cx: number, cy: number, angleDeg: number, outlineV: 0 | 1 | 2 | 3, tipV: 0 | 1 | 2 | 3): void {
  const rad = (angleDeg * Math.PI) / 180;
  const petalLen = PETAL_R_OUTER - PETAL_R_INNER; // 8 cells
  const petalHalfW = 2; // half-width of petal at widest

  // Draw petal as an ellipse centered midway along the spoke
  // Perpendicular direction for petal width
  const perpRad = rad + Math.PI / 2;

  // Fill petal body
  for (let li = 0; li <= petalLen; li++) {
    const t = li / petalLen; // 0 to 1
    // Width tapers at tips (ellipse cross-section)
    const hw = Math.round(petalHalfW * Math.sin(t * Math.PI));
    const r = PETAL_R_INNER + li;
    const px = cx + r * Math.cos(rad);
    const py = cy + r * Math.sin(rad);
    for (let w = -hw; w <= hw; w++) {
      const wx = Math.round(px + w * Math.cos(perpRad));
      const wy = Math.round(py + w * Math.sin(perpRad));
      setCell(m, wx, wy, w === -hw || w === hw ? outlineV : outlineV);
    }
  }

  // Tip (outermost 2 cells): stronger value
  for (let li = petalLen - 1; li <= petalLen; li++) {
    const r = PETAL_R_INNER + li;
    const px = Math.round(cx + r * Math.cos(rad));
    const py = Math.round(cy + r * Math.sin(rad));
    setCell(m, px, py, tipV);
    setCell(m, Math.round(px + Math.cos(perpRad)), Math.round(py + Math.sin(perpRad)), tipV);
    setCell(m, Math.round(px - Math.cos(perpRad)), Math.round(py - Math.sin(perpRad)), tipV);
  }
}

// ── 1. Silhouette ────────────────────────────────────────────────────────────
/** Circle outline of the tile, 2px thick, with mounting peg at bottom */
export function createRoofTileSilhouette(): DotMatrix {
  const m = createEmptyMatrix();

  // Thick circle outline (2px)
  drawCircleOutline(m, CX, CY, OUTER_R, 2, 2);

  // Mounting peg at bottom (rows 37-39, x=29-31)
  for (let y = 37; y <= 39; y++) drawHLine(m, y, 29, 31, 3);

  return m;
}

// ── 2. Structure ─────────────────────────────────────────────────────────────
/** 8 lotus petals radiating from center + center boss + thin spokes */
export function createRoofTileStructure(): DotMatrix {
  const m = createEmptyMatrix();

  // Thin circle outline
  drawCircleOutline(m, CX, CY, OUTER_R, 1, 1);

  // 8 petals at 0,45,90,135,180,225,270,315 degrees
  const petalAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  for (const angle of petalAngles) {
    drawPetal(m, CX, CY, angle, 2, 3);
  }

  // Thin spokes between petals (at 22.5, 67.5, 112.5 ... degrees)
  const spokeAngles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
  for (const angle of spokeAngles) {
    drawSpoke(m, CX, CY, PETAL_R_INNER + 1, PETAL_R_OUTER - 1, angle, 1);
  }

  // Center boss: filled 5×5 square (cx-2 to cx+2)
  drawRect(m, CX - BOSS_HALF, CY - BOSS_HALF, CX + BOSS_HALF, CY + BOSS_HALF, 3, true);

  return m;
}

// ── 3. Detail ────────────────────────────────────────────────────────────────
/** Petal texture: midrib lines, edge curves, center seed pod, groove lines */
export function createRoofTileDetail(): DotMatrix {
  const m = createEmptyMatrix();

  // Dim circle outline
  drawCircleOutline(m, CX, CY, OUTER_R, 1, 1);

  // Petal midrib lines (central spine of each petal, value=3)
  const petalAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  for (const angle of petalAngles) {
    drawSpoke(m, CX, CY, PETAL_R_INNER, PETAL_R_OUTER, angle, 3);
  }

  // Petal edge curves on each side (value=2)
  for (const angle of petalAngles) {
    const rad = (angle * Math.PI) / 180;
    const perpRad = rad + Math.PI / 2;
    for (let r = PETAL_R_INNER + 1; r <= PETAL_R_OUTER - 1; r++) {
      const t = (r - PETAL_R_INNER) / (PETAL_R_OUTER - PETAL_R_INNER);
      const hw = Math.round(2 * Math.sin(t * Math.PI));
      const px = cx_at(CX, r, rad);
      const py = cy_at(CY, r, rad);
      if (hw >= 1) {
        setCell(m, Math.round(px + hw * Math.cos(perpRad)), Math.round(py + hw * Math.sin(perpRad)), 2);
        setCell(m, Math.round(px - hw * Math.cos(perpRad)), Math.round(py - hw * Math.sin(perpRad)), 2);
      }
    }
  }

  // Groove lines between petals
  const grooveAngles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
  for (const angle of grooveAngles) {
    drawSpoke(m, CX, CY, PETAL_R_INNER, PETAL_R_OUTER, angle, 1);
  }

  // Center boss: detailed 3×3 seed pod dots (value=3)
  const seedOffsets = [[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]];
  for (const [dx, dy] of seedOffsets) {
    setCell(m, CX + dx, CY + dy, 3);
  }

  return m;
}

function cx_at(cx: number, r: number, rad: number): number {
  return cx + r * Math.cos(rad);
}
function cy_at(cy: number, r: number, rad: number): number {
  return cy + r * Math.sin(rad);
}

// ── 4. Focus ─────────────────────────────────────────────────────────────────
/** Center boss focus: dim everything, highlight center, draw 8 spokes, arrows */
export function createRoofTileFocus(): DotMatrix {
  const m = createEmptyMatrix();

  // Dim circle outline and faint petal spokes
  drawCircleOutline(m, CX, CY, OUTER_R, 1, 1);
  for (let angle = 0; angle < 360; angle += 45) {
    drawSpoke(m, CX, CY, PETAL_R_INNER, PETAL_R_OUTER, angle, 1);
  }

  // 8 spoke lines from center outward (value=2)
  for (let angle = 0; angle < 360; angle += 45) {
    drawSpoke(m, CX, CY, 1, OUTER_R - 1, angle, 2);
  }

  // Glow ring around boss (boss radius + 2, value=2)
  drawCircleOutline(m, CX, CY, BOSS_HALF + 2, 2, 1);

  // Strongly highlight center boss (5×5 block)
  drawRect(m, CX - BOSS_HALF, CY - BOSS_HALF, CX + BOSS_HALF, CY + BOSS_HALF, 3, true);

  // Arrow indicators pointing to center from 4 cardinal directions
  // From top (y=CY-8 → CY-3)
  for (let y = CY - 8; y <= CY - BOSS_HALF - 2; y++) setCell(m, CX, y, 2);
  setCell(m, CX - 1, CY - BOSS_HALF - 2, 2); setCell(m, CX + 1, CY - BOSS_HALF - 2, 2);
  // From bottom
  for (let y = CY + BOSS_HALF + 2; y <= CY + 8; y++) setCell(m, CX, y, 2);
  setCell(m, CX - 1, CY + BOSS_HALF + 2, 2); setCell(m, CX + 1, CY + BOSS_HALF + 2, 2);

  return m;
}

// ── 5. Quiz ───────────────────────────────────────────────────────────────────
/** Find the center: circle + dim petals + cross at center */
export function createRoofTileQuiz(): DotMatrix {
  const m = createEmptyMatrix();

  // Circle outline
  drawCircleOutline(m, CX, CY, OUTER_R, 2, 1);

  // 8 petals dim
  for (let angle = 0; angle < 360; angle += 45) {
    drawSpoke(m, CX, CY, PETAL_R_INNER, PETAL_R_OUTER, angle, 1);
  }

  // Cross pattern at center (question indicator, value=3)
  drawHLine(m, CY, CX - 3, CX + 3, 3);
  drawVLine(m, CX, CY - 3, CY + 3, 3);
  // Center dot
  setCell(m, CX, CY, 3);

  return m;
}
