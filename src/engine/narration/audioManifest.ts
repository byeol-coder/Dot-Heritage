import type { Lang } from './tts';

/**
 * Registry of pre-rendered narration audio (e.g. generated offline with
 * GPT-SoVITS for a natural voice). Files live at:
 *   public/assets/audio/<lang>/<key>.mp3
 *
 * Add the "<lang>/<key>" entry here once a file exists; until then the app
 * automatically falls back to the browser's Web Speech voice. This lets the
 * natural narration drop in line-by-line without any code changes.
 *
 * Keys (see NARRATION_MANIFEST.md for the full list + source text):
 *   - guide slides:    the slide id, e.g. "cs-01", "mj-03"
 *   - explore views:   "<sceneId>-<view>", e.g. "moon-jar-front"
 *   - explore hotspots:"<sceneId>-hotspot-<id>", e.g. "moon-jar-hotspot-mouth"
 */
export const AVAILABLE_AUDIO = new Set<string>([
  // 'ko/cs-01', 'en/cs-01', ...  ← add as files are produced
]);

const BASE = import.meta.env.BASE_URL;

export function audioUrl(key: string, lang: Lang): string {
  return `${BASE}assets/audio/${lang}/${key}.mp3`;
}

export function hasAudio(key: string | undefined, lang: Lang): boolean {
  if (!key) return false;
  return AVAILABLE_AUDIO.has(`${lang}/${key}`);
}
