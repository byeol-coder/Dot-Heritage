import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { Guide } from './pages/Guide';
import { Explore } from './pages/Explore';
import { useI18n } from './i18n/i18n';
import type { AppMode } from './types/heritage';

type Screen = 'home' | 'collection' | 'guide' | 'explore';

const VALID_MODES: AppMode[] = ['standard', 'museum', 'school'];

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
  const rawMode = params.get('mode') as AppMode;
  const urlMode: AppMode = VALID_MODES.includes(rawMode) ? rawMode : 'museum';

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

  // Sync screen state back to URL so refresh and deep-links always work.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (screen === 'home') {
      url.searchParams.delete('heritage');
      url.searchParams.delete('explore');
      url.searchParams.delete('mode');
    } else if (screen === 'guide') {
      url.searchParams.set('heritage', selectedId);
      url.searchParams.set('mode', mode);
      url.searchParams.delete('explore');
    } else if (screen === 'explore') {
      url.searchParams.set('explore', selectedId);
      url.searchParams.delete('heritage');
      url.searchParams.delete('mode');
    } else {
      url.searchParams.delete('heritage');
      url.searchParams.delete('explore');
      url.searchParams.delete('mode');
    }
    window.history.replaceState({}, '', url.toString());
  }, [screen, selectedId, mode]);

  const [helpText, setHelpText] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (helpText) { setHelpText(null); return; }
        if (screen === 'guide') setScreen('collection');
        else if (screen === 'explore') setScreen('guide');
        else if (screen === 'collection') setScreen('home');
      }
      if (e.key === 'F1' && screen === 'guide') {
        e.preventDefault();
        setHelpText(t('guide.help.f1'));
      }
      if (e.key === 'F2' && screen === 'guide') {
        e.preventDefault();
        setHelpText(t('guide.help.f2'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, helpText, t]);

  const screenLabel = t(`screen.${screen}`);

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">{screenLabel}</div>

      {/* F1/F2 help — non-blocking inline toast replacing alert() */}
      {helpText && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={t('guide.keyHelp.aria')}
          style={{
            position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999, maxWidth: 480, width: 'calc(100% - 32px)',
            background: 'var(--surface-card, #0d1b2a)',
            border: '1px solid var(--aged-gold, #C8A56A)',
            borderRadius: 12, padding: '16px 20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}
        >
          <p style={{ flex: 1, margin: 0, fontSize: '0.875rem', color: 'var(--ivory, #f0ede8)', lineHeight: 1.5 }}>
            {helpText}
          </p>
          <button
            onClick={() => setHelpText(null)}
            aria-label={t('common.close')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--stone, #8b8178)', fontSize: '1.1rem', lineHeight: 1, padding: 0,
            }}
          >✕</button>
        </div>
      )}
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
