import { useState, useEffect, useCallback } from 'react';
import type { LocalizedText } from '../../types/heritage';
import { playNarration, cancelNarration } from '../../engine/narration/narrationPlayer';
import { useI18n } from '../../i18n/i18n';
import styles from './TTSNarrationPanel.module.css';

interface Props {
  text: LocalizedText;
  /** Narration key for pre-rendered audio (e.g. the slide id). */
  audioKey?: string;
  autoPlay?: boolean;
}

export function TTSNarrationPanel({ text, audioKey, autoPlay = false }: Props) {
  const { lang, tl, t } = useI18n();
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [playing, setPlaying] = useState(false);
  const [bars] = useState(() => Array.from({ length: 20 }, (_, i) => i));

  const currentText = tl(text);

  const handlePlay = useCallback(() => {
    if (playing) {
      cancelNarration();
      setPlaying(false);
    } else {
      setPlaying(true);
      playNarration({ key: audioKey, text: currentText, lang, onEnd: () => setPlaying(false) });
    }
  }, [playing, currentText, lang, audioKey]);

  // Stop any active narration when the slide text or language changes.
  useEffect(() => {
    cancelNarration();
    setPlaying(false);
    if (autoPlay) {
      const timer = setTimeout(() => {
        setPlaying(true);
        playNarration({ key: audioKey, text: currentText, lang, onEnd: () => setPlaying(false) });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [text, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => { cancelNarration(); };
  }, []);

  return (
    <div className={styles.panel} role="region" aria-label={t('dotpad.preview')}>
      <div className={styles.header}>
        <span className={styles.icon}>◈</span>
        <span className={styles.title}>TTS NARRATION</span>
      </div>
      <p className={styles.text}>{currentText}</p>
      <div className={styles.controls}>
        {!ttsSupported && (
          <p style={{ fontSize: '0.75rem', color: 'var(--stone)', fontStyle: 'italic' }}>
            {t('tts.unsupported')}
          </p>
        )}
        {ttsSupported && (
        <button
          className={`${styles.playBtn} ${playing ? styles.playing : ''}`}
          onClick={handlePlay}
          aria-label={playing ? 'Pause narration' : 'Play narration'}
        >
          {playing ? '⏸' : '▶'}
        </button>
        )}
        <div className={styles.waveform} aria-hidden="true">
          {bars.map(i => (
            <div
              key={i}
              className={`${styles.bar} ${playing ? styles.animated : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
