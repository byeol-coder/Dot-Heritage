import { useEffect, useRef, useState, useCallback } from 'react';
import type { DotMatrix } from '../types/heritage';
import type { TactilePattern } from '../types/tactileSync';
import { getPatternMatrix } from '../data/tactilePatterns';
import { useDotPad } from '../engine/dotpad/useDotPad';

interface SyncInput {
  patternId: string;
  brailleText: string;
  description: string;
  /** Spoken when the active pattern changes (hotspot narration / view desc). */
  narration?: string;
  /** Skip the debounce — true for hotspot/key actions (send immediately). */
  immediate?: boolean;
  /** ms to wait after the last change before pushing (rotation debounce). */
  debounceMs?: number;
  speak?: boolean;
}

/**
 * Resolves the active patternId to a 60×40 frame, debounces rotation-driven
 * changes, dedupes by patternId, pushes to the connected Dot Pad (or stays
 * preview-only in demo mode), and speaks the narration on change.
 */
export function useTactileSync({
  patternId,
  brailleText,
  description,
  narration,
  immediate = false,
  debounceMs = 350,
  speak = true,
}: SyncInput) {
  const { isConnected, sendMatrix } = useDotPad();
  const [pattern, setPattern] = useState<TactilePattern>(() => ({
    patternId,
    matrix: getPatternMatrix(patternId),
    brailleText,
  }));
  const [lastSentAt, setLastSentAt] = useState('');

  const sentIdRef = useRef<string | null>(null); // dedupe by patternId
  const inFlightRef = useRef(false);              // prevent overlapping sends
  const timerRef = useRef<number | null>(null);

  const pushNow = useCallback(
    (id: string, braille: string, narrate?: string) => {
      if (id === sentIdRef.current) return; // dedupe
      if (inFlightRef.current) return;       // already sending
      const matrix: DotMatrix = getPatternMatrix(id);
      setPattern({ patternId: id, matrix, brailleText: braille });
      sentIdRef.current = id;

      if (isConnected) {
        inFlightRef.current = true;
        try {
          sendMatrix(matrix);
          setLastSentAt(new Date().toISOString());
        } finally {
          inFlightRef.current = false;
        }
      }
      if (speak && narrate && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(narrate);
        u.lang = 'ko-KR';
        window.speechSynthesis.speak(u);
      }
    },
    [isConnected, sendMatrix, speak],
  );

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    const narrate = narration ?? description;
    if (immediate) {
      pushNow(patternId, brailleText, narrate);
      return;
    }
    timerRef.current = window.setTimeout(
      () => pushNow(patternId, brailleText, narrate),
      debounceMs,
    );
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [patternId, brailleText, description, narration, immediate, debounceMs, pushNow]);

  /** Manual re-send of the current frame (panning "resend" key). */
  const resend = useCallback(() => {
    sentIdRef.current = null; // force past the dedupe
    pushNow(pattern.patternId, pattern.brailleText, undefined);
  }, [pattern, pushNow]);

  /** Re-speak the current description (panning "reread" key). */
  const reread = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ko-KR';
      window.speechSynthesis.speak(u);
    },
    [],
  );

  return { pattern, isConnected, lastSentAt, resend, reread };
}
