import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { Guide } from './pages/Guide';
import { Explore } from './pages/Explore';
import { useI18n } from './i18n/i18n';
import type { AppMode } from './types/heritage';

type Screen = 'home' | 'collection' | 'guide' | 'explore';

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
  transition: { duration: 0.3 },
};

export default function App() {
  const { t } = useI18n();
  const params = new URLSearchParams(window.location.search);
  const urlHeritage = params.get('heritage');
  const urlExplore = params.get('explore');
  const urlMode = (params.get('mode') as AppMode) ?? 'museum';

  const initialScreen: Screen = urlExplore ? 'explore' : urlHeritage ? 'guide' : 'home';
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [selectedId, setSelectedId] = useState<string>(urlExplore ?? urlHeritage ?? 'cheomseongdae');
  const [mode, setMode] = useState<AppMode>(urlHeritage ? urlMode : 'standard');

  const goHome = useCallback(() => setScreen('home'), []);
  const goCollection = useCallback(() => setScreen('collection'), []);

  const startExperience = useCallback((m: AppMode = 'standard') => {
    setMode(m);
    setScreen('collection');
  }, []);

  const selectHeritage = useCallback((id: string) => {
    setSelectedId(id);
    setScreen('guide');
  }, []);

  const goExplore = useCallback((id: string) => {
    setSelectedId(id);
    setScreen('explore');
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (screen === 'guide') setScreen('collection');
        else if (screen === 'explore') setScreen('guide');
        else if (screen === 'collection') setScreen('home');
      }
      if (e.key === 'F1' && screen === 'guide') {
        e.preventDefault();
        alert('현재 슬라이드: 화살표 키로 이전/다음 슬라이드로 이동하세요.');
      }
      if (e.key === 'F2' && screen === 'guide') {
        e.preventDefault();
        alert('현재 닷패드 촉각 그래픽: Space 키로 TTS를 재생하세요.');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen]);

  const screenLabel = t(`screen.${screen}`);

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">{screenLabel}</div>
      {/* Keyed enter-fade, NO AnimatePresence/exit. The Home screen contains
          nested AnimatePresence carousels on a setInterval; if Home were the
          exiting child of a screen-level AnimatePresence, those still-cycling
          presences deadlock its exit and the next screen never mounts. Keying
          a plain motion.div by `screen` unmounts the old screen immediately and
          fades the new one in — reliable navigation, no stale/stacked pages. */}
      <motion.div
        key={screen}
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        transition={pageTransition.transition}
      >
        {screen === 'home' && (
          <Home
            onStart={() => startExperience('standard')}
            onMuseum={() => startExperience('museum')}
            onSchool={() => startExperience('school')}
          />
        )}
        {screen === 'collection' && (
          <Collection onSelect={selectHeritage} onBack={goHome} />
        )}
        {screen === 'guide' && (
          <Guide heritageId={selectedId} mode={mode} onBack={goCollection} onExplore={goExplore} />
        )}
        {screen === 'explore' && (
          <Explore initialSceneId={selectedId} onBack={() => setScreen('guide')} />
        )}
      </motion.div>
    </>
  );
}
