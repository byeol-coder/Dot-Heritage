import { motion } from 'framer-motion';
import { Logo } from '../components/brand/Logo';
import { HeritageSlidePlayer } from '../components/heritage/HeritageSlidePlayer';
import { heritageList } from '../data/heritageData';
import type { AppMode } from '../types/heritage';
import styles from './Guide.module.css';

interface Props {
  heritageId: string;
  mode: AppMode;
  onBack: () => void;
}

export function Guide({ heritageId, mode, onBack }: Props) {
  const heritage = heritageList.find(h => h.id === heritageId);

  if (!heritage) return (
    <div className={styles.page}>
      <button onClick={onBack} className={styles.backBtn}>← Back</button>
      <p style={{ color: 'var(--stone)', padding: '48px' }}>Heritage not found.</p>
    </div>
  );

  const modeLabel = mode === 'museum' ? '🏛 Museum Mode' : mode === 'school' ? '🎓 School Mode' : null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={onBack} className={styles.backBtn} aria-label="Back to collection">← Back</button>
        <Logo size="sm" variant="icon" />
        <div className={styles.headerInfo}>
          <span className={styles.heritageName}>
            {heritage.title.ko} <span className={styles.heritageEn}>{heritage.title.en}</span>
          </span>
          <span className={styles.heritagePeriod}>{heritage.period.ko}</span>
        </div>
        {modeLabel && <span className={styles.modeBadge}>{modeLabel}</span>}
        <div className={styles.keys} aria-label="Keyboard shortcuts hint">← → navigate · Space play</div>
      </header>

      {mode === 'school' && (
        <div className={styles.schoolBanner}>
          <strong>오늘의 학습:</strong> {heritage.title.ko}의 구조 이해하기 — 슬라이드를 넘기며 각 부위를 탐색해보세요.
        </div>
      )}
      {mode === 'museum' && (
        <div className={styles.museumBanner}>
          전시 해설 | Dot Pad를 연결하면 각 슬라이드의 촉각 그래픽이 자동으로 출력됩니다.
        </div>
      )}

      <main className={styles.main}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <HeritageSlidePlayer heritage={heritage} mode={mode} />
        </motion.div>
      </main>

      <div className={styles.keyHelp} role="complementary" aria-label="Keyboard help">
        <span>F1 슬라이드 설명</span>
        <span>F2 촉각 설명</span>
        <span>Space TTS</span>
        <span>← → 이동</span>
        <span>Esc 뒤로</span>
      </div>
    </div>
  );
}
