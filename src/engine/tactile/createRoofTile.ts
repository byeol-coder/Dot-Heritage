import type { DotMatrix } from '../../types/heritage';
import { createEmptyMatrix, setCell } from '../dotpad/matrixUtils';

export function createRoofTileSilhouette(): DotMatrix {
  const m = createEmptyMatrix();
  const cx = 30, cy = 20, r = 16;
  // Draw thick circle outline
  for (let angle = 0; angle < 360; angle += 1) {
    const rad = (angle * Math.PI) / 180;
    for (let dr = 0; dr < 2; dr++) {
      const x = Math.round(cx + (r + dr) * Math.cos(rad));
      const y = Math.round(cy + (r + dr) * Math.sin(rad));
      setCell(m, x, y, 2);
    }
  }
  // Central lotus pattern: 8 petal radial lines
  for (let i = 0; i < 8; i++) {
    const rad = (i * 45 * Math.PI) / 180;
    for (let d = 3; d <= 10; d++) {
      setCell(m, Math.round(cx + d * Math.cos(rad)), Math.round(cy + d * Math.sin(rad)), 2);
    }
  }
  setCell(m, cx, cy, 3);
  return m;
}

export function createRoofTileCenter(): DotMatrix {
  const m = createEmptyMatrix();
  const cx = 30, cy = 20;
  // Outer ring dim
  for (let angle = 0; angle < 360; angle += 2) {
    const rad = (angle * Math.PI) / 180;
    setCell(m, Math.round(cx + 16 * Math.cos(rad)), Math.round(cy + 16 * Math.sin(rad)), 1);
  }
  // Inner circle strong
  for (let angle = 0; angle < 360; angle += 1) {
    const rad = (angle * Math.PI) / 180;
    setCell(m, Math.round(cx + 7 * Math.cos(rad)), Math.round(cy + 7 * Math.sin(rad)), 3);
  }
  setCell(m, cx, cy, 3);
  return m;
}
