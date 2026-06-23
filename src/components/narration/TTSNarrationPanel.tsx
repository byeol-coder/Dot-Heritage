import { useState, useEffect, useCallback } from 'react';
import type { LocalizedText } from '../../types/heritage';
import { speak, cancel } from '../../engine/narration/tts';
import styles from './TTSNarrationPanel.module.css';

// Re-export Lang from types so tts.ts and components share it
// (tts.ts declares its own - we use that directly here)
type LangChoice = 'ko' | 'en';

interface Props {
  text: LocalizedText;
  autoPlay?: boolean;
}

export function TTSNarrationPanel({ text, autoPlay = false }: Props) {
  const [lang, setLang] = useState<LangChoice>('ko');
  const [playing, setPlaying] = useState(false);
  const [bars] = useState(() => Array.from({ length: 20 }, (_, i) => i));

  const currentText = lang === 'ko' ? text.ko : text.en;

  const handlePlay = useCallback(() => {
    if (playing) {
      cancel();
      setPlaying(false);
    } else {
      setPlaying(true);
      speak(currentText, lang, () => setPlaying(false));
    }
  }, [playing, currentText, lang]);

  useEffect(() => {
    cancel();
    setPlaying(false);
    if (autoPlay) {
      const t = setTimeout(() => {
        setPlaying(true);
        speak(currentText, lang, () => setPlaying(false));
      }, 600);
      return () => clearTimeout(t);
    }
  }, [text]);

  useEffect(() => {
    return () => { cancel(); };
  }, []);

  return (
    <div className={styles.panel} role="region" aria-label="TTS Narration">
      <div className={styles.header}>
        <span className={styles.icon}>◈</span>
        <span className={styles.title}>TTS NARRATION</span>
        <div className={styles.langToggle} role="group" aria-label="Language">
          {(['ko', 'en'] as LangChoice[]).map(l => (
            <button
              key={l}
              className={`${styles.langBtn} ${lang === l ? styles.active : ''}`}
              onClick={() => { cancel(); setPlaying(false); setLang(l); }}
              aria-pressed={lang === l}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <p className={styles.text}>{currentText}</p>
      <div className={styles.controls}>
        <button
          className={`${styles.playBtn} ${playing ? styles.playing : ''}`}
          onClick={handlePlay}
          aria-label={playing ? 'Pause narration' : 'Play narration'}
        >
          {playing ? '⏸' : '▶'}
        </button>
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
