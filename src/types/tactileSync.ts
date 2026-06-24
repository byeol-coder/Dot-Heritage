import type { DotMatrix, LocalizedText } from './heritage';

/** Discrete tactile views derived from the live 3D camera + interaction. */
export type HeritageViewType = 'front' | 'side' | 'top' | 'detail' | 'focus';

/** A camera sample read from OrbitControls each frame. */
export interface ViewSample {
  azimuthDeg: number; // 0 = front, increases CCW
  polarDeg: number;   // 0 = straight down (top), 90 = level
  distance: number;   // current camera distance
  baseDistance: number; // default/rest distance (for zoom ratio)
}

/** Per-view tactile mapping for a heritage scene. */
export interface TactileViewDef {
  patternId: string;
  brailleText: LocalizedText;   // short status for the 20-cell braille line
  description: LocalizedText;   // on-screen / TTS description
}

/** A selectable key point on the 3D model. */
export interface HeritageHotspot {
  id: string;
  label: LocalizedText;
  position: [number, number, number];
  patternId: string;
  brailleText: LocalizedText;
  narration: LocalizedText;
}

/** A heritage item as an interactive sync scene. */
export interface HeritageScene {
  id: string;
  name: LocalizedText;
  modelUrl: string;
  /** front/side/top/detail mappings (focus comes from hotspots). */
  tactileViews: Partial<Record<Exclude<HeritageViewType, 'focus'>, TactileViewDef>>;
  hotspots: HeritageHotspot[];
}

export type TactilePatternFn = () => DotMatrix;

/** Resolved tactile frame pushed to the Dot Pad. */
export interface TactilePattern {
  patternId: string;
  matrix: DotMatrix;
  brailleText: string;
}
