import type { DotMatrix } from '../types/heritage';
import type { TactilePatternFn } from '../types/tactileSync';
import {
  createMoonJarSilhouette,
  createMoonJarStructure,
  createMoonJarDetail,
  createMoonJarFocus,
} from '../engine/tactile/createMoonJar';
import {
  createMoonJarTop,
  createMoonJarEquator,
  createMoonJarFoot,
} from '../engine/tactile/createMoonJarViews';
import {
  createCheomseongdaeWindow,
  createCheomseongdaeBase,
  createCheomseongdaeTop,
} from '../engine/tactile/createCheomseongdae';
import { createCheomseongdaeOfficial } from '../engine/tactile/createCheomseongdaeOfficial';

/**
 * Central registry: patternId → 60×40 matrix generator.
 * Heritage scenes reference patterns by id so views and hotspots can be
 * remapped without touching geometry code.
 */
export const tactilePatterns: Record<string, TactilePatternFn> = {
  // Moon Jar
  'moon-jar-front': createMoonJarSilhouette,
  'moon-jar-side': createMoonJarStructure,
  'moon-jar-top': createMoonJarTop,
  'moon-jar-detail': createMoonJarDetail,
  'moon-jar-hotspot-mouth': createMoonJarFocus,
  'moon-jar-hotspot-equator': createMoonJarEquator,
  'moon-jar-hotspot-foot': createMoonJarFoot,
  // Cheomseongdae — official tactile graphic from SVG/DTMS
  'cheomseongdae-front': createCheomseongdaeOfficial,
  'cheomseongdae-side': createCheomseongdaeOfficial,
  'cheomseongdae-top': createCheomseongdaeTop,
  'cheomseongdae-detail': createCheomseongdaeBase,
  'cheomseongdae-hotspot-window': createCheomseongdaeWindow,
  'cheomseongdae-hotspot-base': createCheomseongdaeBase,
  'cheomseongdae-hotspot-top': createCheomseongdaeTop,
};

const EMPTY: DotMatrix = {
  width: 60,
  height: 40,
  cells: Array.from({ length: 40 }, () => Array(60).fill(0)) as DotMatrix['cells'],
};

/** Resolve a patternId to a fresh matrix; returns an empty frame if unknown. */
export function getPatternMatrix(patternId: string | null | undefined): DotMatrix {
  if (!patternId) return EMPTY;
  const fn = tactilePatterns[patternId];
  return fn ? fn() : EMPTY;
}
