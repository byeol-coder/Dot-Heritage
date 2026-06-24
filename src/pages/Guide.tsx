import { useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../components/brand/Logo';
import { HeritageSlidePlayer } from '../components/heritage/HeritageSlidePlayer';
import { HighContrastToggle } from '../components/ui/HighContrastToggle';
import { heritageList } from '../data/heritageData';
import type { AppMode } from '../types/heritage';
import styles from './Guide.module.css';

interface Props {
  heritageId: string;
  mode: AppMode;
  onBack: () => void;
}

const SCHOOL_STEPS = ['전체 형태', '중앙 창', '하단 기단', '상단 구조', '퀴즈'];

export function Guide({ heritageId, mode, onBack }: Props) {
  const heritage = heritageList.find(h => h.id === heritageId);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!heritage) return (
    <div className={styles.page}>
      <button onClick={onBack} className={styles.backBtn}>← Back</button>
      <p style={{ color: 'var(--stone)', padding: '48px' }}>Heritage not found.</p>
    </div>
  );

  const isMuseum = mode === 'museum';
  const isSchool = mode === 'school';

  return (
    <div className={`${styles.page} ${isMuseum ? styles.pageMuseum : ''} ${isSchool ? styles.pageSchool : ''}`}>
      {/* ─── Sticky header ──────────────────────────────────── */}
      <header className={`${styles.header} ${isMuseum ? styles.headerMuseum : ''}`}>
        <button onClick={onBack} className={styles.backBtn} aria-label="Back to collection">← Back</button>
        <Logo size="sm" variant="icon" />
        <div className={styles.headerInfo}>
          <span className={styles.heritageName}>
            {heritage.title.ko} <span className={styles.heritageEn}>{heritage.title.en}</span>
          </span>
          <span className={styles.heritagePeriod}>{heritage.period.ko}</span>
        </div>
        {isMuseum && <span className={`${styles.modeBadge} ${styles.modeBadgeMuseum}`}>🏛 Museum Mode</span>}
        {isSchool && <span className={`${styles.modeBadge} ${styles.modeBadgeSchool}`}>🎓 School Mode</span>}
        <div className={styles.keys} aria-label="Keyboard shortcuts hint">← → navigate · Space play</div>
        <HighContrastToggle />
      </header>

      {/* ─── School banner + progress steps ─────────────────── */}
      {isSchool && (
        <div className={styles.schoolBanner}>
          <strong>오늘의 학습:</strong> {heritage.title.ko}의 구조 이해하기 — 슬라이드를 넘기며 각 부위를 탐색해보세요.
        </div>
      )}
      {isSchool && (
        <div className={styles.schoolProgress} role="list" aria-label="학습 진도">
          {SCHOOL_STEPS.map((step, i) => {
            const done = currentSlide >= i;
            const passed = currentSlide > i;
            return (
              <div
                key={i}
                role="listitem"
                className={`${styles.step} ${done ? styles.stepDone : ''}`}
                aria-current={currentSlide === i ? 'step' : undefined}
              >
                <div className={styles.stepNum}>
                  {passed ? '✓' : i + 1}
                </div>
                <div className={styles.stepLabel}>{step}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Museum banner ───────────────────────────────────── */}
      {isMuseum && (
        <div className={styles.museumBanner}>
          전시 해설 &nbsp;·&nbsp; Dot Pad를 연결하면 각 슬라이드의 촉각 그래픽이 자동으로 출력됩니다.
        </div>
      )}

      {/* ─── Main content ────────────────────────────────────── */}
      <main className={styles.main}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <HeritageSlidePlayer
            heritage={heritage}
            mode={mode}
            onBack={onBack}
            onSlideChange={setCurrentSlide}
          />
        </motion.div>
      </main>

      {/* ─── Keyboard help bar ───────────────────────────────── */}
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
