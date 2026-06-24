import type { DotMatrix } from '../../types/heritage';
import { createEmptyMatrix, drawHLine, setCell } from '../dotpad/matrixUtils';

// Additional Moon Jar tactile views for the rotation-synced experience.
// These deliberately FEEL different from the front silhouette so a finger can
// tell front / side / top / hotspot apart (spec §9).

const CX = 30;
const CY = 20;

/** Top view: looking down the mouth — concentric rings (rim, shoulder, body). */
export function createMoonJarTop(): DotMatrix {
  const m = createEmptyMatrix();
  // Three concentric circles: outer body, mid shoulder, inner mouth.
  const rings: Array<{ r: number; v: 1 | 2 | 3 }> = [
    { r: 16, v: 2 },
    { r: 10, v: 2 },
    { r: 4, v: 3 }, // mouth opening — strongest
  ];
  for (const { r, v } of rings) {
    for (let a = 0; a < 360; a += 4) {
      const rad = (a * Math.PI) / 180;
      const x = Math.round(CX + r * Math.cos(rad));
      const y = Math.round(CY + r * Math.sin(rad) * 0.62); // squash for grid aspect
      setCell(m, x, y, v);
    }
  }
  // Center dot marks the very middle of the opening.
  setCell(m, CX, CY, 3);
  return m;
}

/** Hotspot: widest body band — a bold horizontal emphasis at the equator. */
export function createMoonJarEquator(): DotMatrix {
  const m = createEmptyMatrix();
  // Dim round outline for context.
  for (let a = 0; a < 360; a += 5) {
    const rad = (a * Math.PI) / 180;
    const x = Math.round(CX + 17 * Math.cos(rad));
    const y = Math.round(CY + 14 * Math.sin(rad));
    setCell(m, x, y, 1);
  }
  // Bold band across the widest part (equator), value 3, thick.
  for (let y = CY - 1; y <= CY + 1; y++) drawHLine(m, y, CX - 17, CX + 17, 3);
  // End ticks to mark the maximum diameter.
  for (let y = CY - 3; y <= CY + 3; y++) {
    setCell(m, CX - 17, y, 3);
    setCell(m, CX + 17, y, 3);
  }
  return m;
}

/** Hotspot: foot — emphasize the small base ring at the bottom. */
export function createMoonJarFoot(): DotMatrix {
  const m = createEmptyMatrix();
  // Dim body outline (upper part) for context.
  for (let a = 200; a <= 340; a += 5) {
    const rad = (a * Math.PI) / 180;
    const x = Math.round(CX + 17 * Math.cos(rad));
    const y = Math.round(CY + 14 * Math.sin(rad));
    setCell(m, x, y, 1);
  }
  // Foot ring at bottom — bold.
  const footY = 32;
  drawHLine(m, footY, CX - 8, CX + 8, 3);
  drawHLine(m, footY + 3, CX - 6, CX + 6, 3);
  for (let y = footY; y <= footY + 3; y++) {
    setCell(m, CX - 8 + (y - footY), y, 3);
    setCell(m, CX + 8 - (y - footY), y, 3);
  }
  return m;
}
