import { useCallback, useEffect } from 'react';
import type { HeritageScene, HeritageViewType } from '../types/tactileSync';
import type { PanningKey } from '../adapters/DotPadAdapter';

interface NavInput {
  scene: HeritageScene;
  selectedHotspot: string | null;
  setSelectedHotspot: (id: string | null) => void;
  setView: (v: HeritageViewType) => void;
  onResend: () => void;
  onReread: () => void;
  onPrevHeritage: () => void;
  onNextHeritage: () => void;
}

/**
 * Keyboard / panning-key navigation for the sync viewer.
 *
 * Key map (also reachable from the on-screen controls and a Dot Pad's
 * function/panning keys via emitKey):
 *   1 / F1 → front     2 / F2 → side      3 / F3 → detail
 *   [ → prev hotspot   ] → next hotspot   \ → clear hotspot
 *   r → re-read        s → resend frame
 *   , → prev heritage  . → next heritage
 */
export function useHotspotNavigation({
  scene,
  selectedHotspot,
  setSelectedHotspot,
  setView,
  onResend,
  onReread,
  onPrevHeritage,
  onNextHeritage,
}: NavInput) {
  const cycleHotspot = useCallback(
    (dir: 1 | -1) => {
      const list = scene.hotspots;
      if (list.length === 0) return;
      const idx = list.findIndex((h) => h.id === selectedHotspot);
      const next = idx === -1
        ? (dir === 1 ? 0 : list.length - 1)
        : (idx + dir + list.length) % list.length;
      setSelectedHotspot(list[next].id);
    },
    [scene.hotspots, selectedHotspot, setSelectedHotspot],
  );

  const handleKey = useCallback(
    (key: PanningKey) => {
      switch (key) {
        case 'front': setSelectedHotspot(null); setView('front'); break;
        case 'side': setSelectedHotspot(null); setView('side'); break;
        case 'detail': setSelectedHotspot(null); setView('detail'); break;
        case 'prevHotspot': cycleHotspot(-1); break;
        case 'nextHotspot': cycleHotspot(1); break;
        case 'reread': onReread(); break;
        case 'resend': onResend(); break;
        case 'prevHeritage': onPrevHeritage(); break;
        case 'nextHeritage': onNextHeritage(); break;
      }
    },
    [setSelectedHotspot, setView, cycleHotspot, onReread, onResend, onPrevHeritage, onNextHeritage],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const map: Record<string, PanningKey> = {
        '1': 'front', F1: 'front',
        '2': 'side', F2: 'side',
        '3': 'detail', F3: 'detail',
        '[': 'prevHotspot', ']': 'nextHotspot',
        r: 'reread', R: 'reread',
        s: 'resend', S: 'resend',
        ',': 'prevHeritage', '.': 'nextHeritage',
      };
      if (e.key === '\\') { e.preventDefault(); setSelectedHotspot(null); setView('front'); return; }
      const action = map[e.key];
      if (action) {
        e.preventDefault();
        handleKey(action);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey, setSelectedHotspot, setView]);

  return { handleKey, cycleHotspot };
}
