import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../components/brand/Logo';
import { HeritageSlidePlayer } from '../components/heritage/HeritageSlidePlayer';
import { HighContrastToggle } from '../components/ui/HighContrastToggle';
import { heritageList } from '../data/heritageData';
import { getScene } from '../data/heritageScenes';
import type { AppMode } from '../types/heritage';
import styles from './Guide.module.css';

interface Props {
  heritageId: string;
  mode: AppMode;
  onBack: () => void;
  onExplore?: (id: string) => void;
}

const overlayBase: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(7,15,26,0.88)',
  backdropFilter: 'blur(10px)',
};

export function Guide({ heritageId, mode, onBack, onExplore }: Props) {
  const heritage = heritageList.find(h => h.id === heritageId);
  const hasSyncScene = getScene(heritageId) != null;
  const [currentSlide, setCurrentSlide] = useState(0);

  const isMuseum = mode === 'museum';
  const isSchool = mode === 'school';

  // Derive progress steps from the heritage's actual slides so each item shows
  // its own structure (not a hardcoded Cheomseongdae outline).
  const schoolSteps = (heritage?.slides ?? []).map(s => s.title.ko);

  const [showMuseumEntry, setShowMuseumEntry] = useState(isMuseum);
  const [showSchoolIntro, setShowSchoolIntro] = useState(isSchool);

  // Auto-dismiss museum entry overlay after 2500ms
  useEffect(() => {
    if (!isMuseum) return;
    const timer = setTimeout(() => setShowMuseumEntry(false), 2500);
    return () => clearTimeout(timer);
  }, [isMuseum]);

  if (!heritage) return (
    <div className={styles.page}>
      <button onClick={onBack} className={styles.backBtn}>← Back</button>
      <p style={{ color: 'var(--stone)', padding: '48px' }}>Heritage not found.</p>
    </div>
  );

  return (
    <div className={`${styles.page} ${isMuseum ? styles.pageMuseum : ''} ${isSchool ? styles.pageSchool : ''}`}>

      {/* ─── Museum Entry Overlay ────────────────────────────────────────── */}
      <AnimatePresence>
        {showMuseumEntry && (
          <motion.div
            style={overlayBase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              style={{
                background: 'var(--ink-navy, #0d1b2a)',
                border: '1px solid rgba(200,165,106,0.35)',
                borderRadius: '20px',
                padding: '44px 48px',
                maxWidth: '400px',
                width: '88%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                alignItems: 'center',
                boxShadow: '0 0 80px rgba(200,165,106,0.14)',
              }}
            >
              {/* Pulsing top badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                background: 'rgba(200,165,106,0.1)',
                border: '1px solid rgba(200,165,106,0.3)',
                borderRadius: '100px',
              }}>
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: 'var(--aged-gold, #c8a56a)',
                  boxShadow: '0 0 6px rgba(200,165,106,0.8)',
                  display: 'inline-block',
                }} />
                <span style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  color: 'var(--aged-gold, #c8a56a)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}>
                  EXHIBIT ENTRY DETECTED
                </span>
              </div>

              {/* Hex icon */}
              <div style={{ fontSize: '2.2rem', color: 'var(--aged-gold, #c8a56a)', lineHeight: 1 }}>⬡</div>

              {/* Exhibit ID */}
              <div>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 300,
                  color: 'var(--ivory, #f4f0e8)',
                  letterSpacing: '0.04em',
                }}>
                  ECH-001
                </div>
                <div style={{
                  fontSize: '0.82rem',
                  color: 'var(--stone-light, #9aa3ad)',
                  marginTop: '4px',
                  letterSpacing: '0.03em',
                }}>
                  {heritage.title.en}
                </div>
              </div>

              {/* Connection recommendation */}
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--stone-light, #9aa3ad)',
                padding: '10px 16px',
                background: 'rgba(111,175,159,0.07)',
                border: '1px solid rgba(111,175,159,0.2)',
                borderRadius: '8px',
                lineHeight: 1.5,
              }}>
                <span style={{ color: 'var(--jade, #6FAF9F)', fontWeight: 600 }}>Dot Pad 연결 권장</span>
                <br />
                Dot Pad 연결 시 촉각 그래픽 자동 출력
              </div>

              {/* Manual dismiss button */}
              <button
                onClick={() => setShowMuseumEntry(false)}
                style={{
                  marginTop: '4px',
                  padding: '10px 28px',
                  background: 'var(--aged-gold, #c8a56a)',
                  color: 'var(--deep-navy, #071522)',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
              >
                전시 시작 →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── School Learning Objectives Overlay ─────────────────────────── */}
      <AnimatePresence>
        {showSchoolIntro && (
          <motion.div
            style={overlayBase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              style={{
                background: 'var(--ink-navy, #0d1b2a)',
                border: '1px solid rgba(111,175,159,0.3)',
                borderRadius: '20px',
                padding: '44px 48px',
                maxWidth: '440px',
                width: '88%',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                boxShadow: '0 0 80px rgba(111,175,159,0.1)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem', color: 'var(--jade, #6FAF9F)' }}>⬡</span>
                <div>
                  <div style={{
                    fontSize: '0.62rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--jade, #6FAF9F)',
                    fontWeight: 600,
                    marginBottom: '3px',
                  }}>
                    School Mode
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    fontWeight: 300,
                    color: 'var(--ivory, #f4f0e8)',
                  }}>
                    오늘의 학습 목표
                  </div>
                </div>
              </div>

              {/* Heritage subtitle */}
              <div style={{
                fontSize: '0.82rem',
                color: 'var(--stone-light, #9aa3ad)',
                lineHeight: 1.5,
                borderLeft: '2px solid rgba(111,175,159,0.4)',
                paddingLeft: '12px',
              }}>
                학습 목표: <strong style={{ color: 'var(--ivory, #f4f0e8)' }}>{heritage.title.ko}</strong>의 구조를 촉각으로 이해합니다
              </div>

              {/* Objectives */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  `${heritage.title.ko}의 전체 형태를 촉각으로 탐색합니다`,
                  '주요 구조물의 위치를 Dot Pad로 확인합니다',
                  '퀴즈를 통해 학습 내용을 검증합니다',
                ].map((objective, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '0.85rem',
                      color: 'var(--stone-light, #9aa3ad)',
                      lineHeight: 1.55,
                    }}
                  >
                    <span style={{
                      color: 'var(--jade, #6FAF9F)',
                      fontSize: '0.75rem',
                      marginTop: '2px',
                      flexShrink: 0,
                      fontWeight: 700,
                    }}>✦</span>
                    <span>{objective}</span>
                  </div>
                ))}
              </div>

              {/* Start button */}
              <button
                onClick={() => setShowSchoolIntro(false)}
                style={{
                  marginTop: '4px',
                  padding: '12px 28px',
                  background: 'var(--jade, #6FAF9F)',
                  color: 'var(--deep-navy, #071522)',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  alignSelf: 'flex-end',
                  transition: 'opacity 0.2s',
                }}
              >
                학습 시작 →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Sticky header ──────────────────────────────────────────────── */}
      <header className={`${styles.header} ${isMuseum ? styles.headerMuseum : ''}`}>
        <button onClick={onBack} className={styles.backBtn} aria-label="Back to collection">← Back</button>
        <Logo size="sm" variant="icon" />
        <div className={styles.headerInfo}>
          <span className={styles.heritageName}>
            {heritage.title.ko} <span className={styles.heritageEn}>{heritage.title.en}</span>
          </span>
          <span className={styles.heritagePeriod}>{heritage.period.ko}</span>
        </div>
        {isMuseum && (
          <>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--aged-gold, #c8a56a)',
                background: 'rgba(200,165,106,0.1)',
                border: '1px solid rgba(200,165,106,0.35)',
                borderRadius: '4px',
                padding: '3px 9px',
                fontVariantNumeric: 'tabular-nums',
              }}
              aria-label="전시 번호"
            >
              ECH-001
            </span>
            <span className={`${styles.modeBadge} ${styles.modeBadgeMuseum}`}>🏛 Museum Mode</span>
          </>
        )}
        {isSchool && <span className={`${styles.modeBadge} ${styles.modeBadgeSchool}`}>🎓 School Mode</span>}
        {hasSyncScene && onExplore && (
          <button
            type="button"
            onClick={() => onExplore(heritageId)}
            className={styles.exploreBtn}
            aria-label="3D 촉각 동기 탐색 열기"
          >
            🔗 3D 촉각 탐색
          </button>
        )}
        <div className={styles.keys} aria-label="Keyboard shortcuts hint">← → navigate · Space play</div>
        <HighContrastToggle />
      </header>

      {/* ─── School banner + progress steps ────────────────────────────── */}
      {isSchool && (
        <div className={styles.schoolBanner}>
          <strong>오늘의 학습:</strong> {heritage.title.ko}의 구조 이해하기 — 슬라이드를 넘기며 각 부위를 탐색해보세요.
        </div>
      )}
      {isSchool && (
        <div className={styles.schoolProgress} role="list" aria-label="학습 진도">
          {schoolSteps.map((step, i) => {
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

      {/* ─── Museum banner ──────────────────────────────────────────────── */}
      {isMuseum && (
        <div className={styles.museumBanner}>
          <span style={{ marginRight: '6px', opacity: 0.7 }}>전시 번호 ECH-001</span>
          &nbsp;·&nbsp;
          전시 해설 &nbsp;·&nbsp; Dot Pad를 연결하면 각 슬라이드의 촉각 그래픽이 자동으로 출력됩니다.
        </div>
      )}

      {/* ─── Main content ───────────────────────────────────────────────── */}
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

      {/* ─── Keyboard help bar ──────────────────────────────────────────── */}
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
