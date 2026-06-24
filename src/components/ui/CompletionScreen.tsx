import { motion } from 'framer-motion';
import styles from './CompletionScreen.module.css';

interface Props {
  heritageTitle: string;
  mode: string;
  totalSlides: number;
  onRestart: () => void;
  onMore: () => void;
}

export function CompletionScreen({ heritageTitle, mode, totalSlides, onRestart, onMore }: Props) {
  const isSchool = mode === 'school';
  const isMuseum = mode === 'museum';

  if (isMuseum) {
    return (
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{
            background: 'var(--ink-navy, #0d1b2a)',
            border: '1px solid rgba(200,165,106,0.3)',
            borderRadius: '24px',
            padding: '44px 40px',
            maxWidth: '480px',
            width: '92%',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
            boxShadow: '0 0 60px rgba(200,165,106,0.12)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: 'var(--aged-gold, #c8a56a)', marginBottom: '10px' }}>⬡</div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.55rem',
              fontWeight: 300,
              color: 'var(--ivory, #f4f0e8)',
              letterSpacing: '0.02em',
            }}>
              탐색 완료 — 접근성 영향 요약
            </h2>
          </div>

          {/* Impact statement */}
          <div style={{
            background: 'rgba(200,165,106,0.07)',
            border: '1px solid rgba(200,165,106,0.18)',
            borderRadius: '12px',
            padding: '16px 18px',
            fontSize: '0.88rem',
            color: 'var(--stone-light, #9aa3ad)',
            lineHeight: 1.6,
            textAlign: 'center',
          }}>
            <strong style={{ color: 'var(--ivory, #f4f0e8)' }}>1명</strong>의 시각장애 관람객이{' '}
            <strong style={{ color: 'var(--aged-gold, #c8a56a)' }}>{heritageTitle}</strong>을(를){' '}
            촉각으로 체험했습니다
          </div>

          {/* Stats grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}>
            {[
              { label: '탐색 슬라이드', value: `${totalSlides}개` },
              { label: '소요 시간', value: `약 ${totalSlides * 2}분` },
              { label: '촉각 레이어', value: '4개' },
              { label: '브레일 출력', value: `${totalSlides}행` },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(200,165,106,0.12)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}
              >
                <span style={{
                  fontSize: '0.62rem',
                  color: 'var(--stone, #6b7684)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.3rem',
                  fontWeight: 300,
                  color: 'var(--aged-gold, #c8a56a)',
                  letterSpacing: '0.04em',
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Accessibility impact statement */}
          <p style={{
            fontSize: '0.78rem',
            color: 'var(--stone-light, #9aa3ad)',
            lineHeight: 1.65,
            textAlign: 'center',
            borderTop: '1px solid rgba(200,165,106,0.1)',
            paddingTop: '16px',
          }}>
            Dot Pad 촉각 해설로 시각장애 관람객의 문화유산 접근성을 높였습니다.
          </p>

          {/* PDF download (visual only) */}
          <button
            style={{
              width: '100%',
              padding: '11px',
              border: '1px solid rgba(200,165,106,0.35)',
              borderRadius: '9px',
              background: 'transparent',
              color: 'var(--aged-gold, #c8a56a)',
              fontSize: '0.82rem',
              fontWeight: 500,
              letterSpacing: '0.03em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onClick={() => {/* visual only — no download implemented */}}
          >
            <span style={{ opacity: 0.8 }}>↓</span>
            기관 보고서 다운로드 (PDF)
          </button>

          {/* Navigation actions */}
          <div className={styles.actions}>
            <button className={styles.btnPrimary} onClick={onMore}>
              다른 유산 보기 →
            </button>
            <button className={styles.btnSecondary} onClick={onRestart}>
              처음부터 다시
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ─── Standard / School mode ──────────────────────────────────────────────
  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.card}>
        <div className={styles.icon}>⬡</div>
        <h2 className={styles.title}>
          {isSchool ? '학습 완료!' : '감상 완료'}
        </h2>
        <p className={styles.sub}>
          {heritageTitle}의 핵심 형태와 구조를<br />
          {totalSlides}개 슬라이드로 탐색했습니다.
        </p>
        {isSchool && (
          <div className={styles.checklist}>
            <div className={styles.checkItem}>✓ 전체 형태 탐색</div>
            <div className={styles.checkItem}>✓ 중앙 창 위치 확인</div>
            <div className={styles.checkItem}>✓ 하단 기단부 이해</div>
            <div className={styles.checkItem}>✓ 상단 구조 비교</div>
            <div className={styles.checkItem}>✓ 창 위치 퀴즈 완료</div>
          </div>
        )}
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onMore}>
            다른 유산 보기 →
          </button>
          <button className={styles.btnSecondary} onClick={onRestart}>
            처음부터 다시
          </button>
        </div>
      </div>
    </motion.div>
  );
}
