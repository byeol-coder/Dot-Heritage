import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { Guide } from './pages/Guide';
import type { AppMode } from './types/heritage';

type Screen = 'home' | 'collection' | 'guide';

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
  transition: { duration: 0.3 },
};

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const urlHeritage = params.get('heritage');
  const urlMode = (params.get('mode') as AppMode) ?? 'museum';

  const [screen, setScreen] = useState<Screen>(urlHeritage ? 'guide' : 'home');
  const [selectedId, setSelectedId] = useState<string>(urlHeritage ?? 'cheomseongdae');
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (screen === 'guide') setScreen('collection');
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

  const screenLabel = screen === 'home' ? '홈 화면' : screen === 'collection' ? '컬렉션 화면' : '해설 가이드 화면';

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">{screenLabel}</div>
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div key="home" {...pageTransition}>
            <Home
              onStart={() => startExperience('standard')}
              onMuseum={() => startExperience('museum')}
              onSchool={() => startExperience('school')}
            />
          </motion.div>
        )}
        {screen === 'collection' && (
          <motion.div key="collection" {...pageTransition}>
            <Collection onSelect={selectHeritage} onBack={goHome} />
          </motion.div>
        )}
        {screen === 'guide' && (
          <motion.div key="guide" {...pageTransition}>
            <Guide heritageId={selectedId} mode={mode} onBack={goCollection} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
