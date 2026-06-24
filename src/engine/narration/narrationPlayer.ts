import { speak as webSpeak, cancel as webCancel, type Lang } from './tts';
import { hasAudio, audioUrl } from './audioManifest';

/**
 * Plays narration with a natural pre-rendered audio file when one exists for
 * the (key, lang) pair, otherwise falls back to the browser's Web Speech voice.
 * A single active source is tracked so cancel() always stops both paths.
 */
let currentAudio: HTMLAudioElement | null = null;

export function playNarration(opts: {
  key?: string;
  text: string;
  lang: Lang;
  onEnd?: () => void;
}): void {
  cancelNarration();
  const { key, text, lang, onEnd } = opts;

  if (hasAudio(key, lang)) {
    const audio = new Audio(audioUrl(key!, lang));
    currentAudio = audio;
    const fallback = () => {
      currentAudio = null;
      webSpeak(text, lang, onEnd);
    };
    audio.onended = () => { currentAudio = null; onEnd?.(); };
    audio.onerror = fallback;
    audio.play().catch(fallback);
    return;
  }

  webSpeak(text, lang, onEnd);
}

export function cancelNarration(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  webCancel();
}
