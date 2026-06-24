import { motion } from 'framer-motion';
import styles from './CompletionScreen.module.css';
import { useI18n } from '../../i18n/i18n';

interface Props {
  heritageTitle: string;
  mode: string;
  totalSlides: number;
  onRestart: () => void;
  onMore: () => void;
}

export function CompletionScreen({ heritageTitle, mode, totalSlides, onRestart, onMore }: Props) {
  const { t } = useI18n();
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
              {t('completion.museumHeading')}
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
            {t('completion.impactSentencePre')}{' '}
            <strong style={{ color: 'var(--ivory, #f4f0e8)' }}>{t('completion.impactSentenceVisitors')}</strong>{' '}
            {t('completion.impactSentenceMid')}{' '}
            <strong style={{ color: 'var(--aged-gold, #c8a56a)' }}>{heritageTitle}</strong>{' '}
            {t('completion.impactSentencePost')}
          </div>

          {/* Stats grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}>
            {[
              { label: t('completion.statSlides'), value: t('completion.statSlidesValue').replace('{count}', String(totalSlides)) },
              { label: t('completion.statDuration'), value: t('completion.statDurationValue').replace('{minutes}', String(totalSlides * 2)) },
              { label: t('completion.statLayers'), value: t('completion.statLayersValue') },
              { label: t('completion.statBraille'), value: t('completion.statBrailleValue').replace('{count}', String(totalSlides)) },
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
            {t('completion.impactStatement')}
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
            {t('completion.downloadReport')}
          </button>

          {/* Navigation actions */}
          <div className={styles.actions}>
            <button className={styles.btnPrimary} onClick={onMore}>
              {t('completion.moreHeritage')}
            </button>
            <button className={styles.btnSecondary} onClick={onRestart}>
              {t('completion.restart')}
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
          {isSchool ? t('completion.schoolTitle') : t('completion.standardTitle')}
        </h2>
        <p className={styles.sub}>
          {t('completion.subPre')}{heritageTitle}{t('completion.subMid')}<br />
          {t('completion.subPost').replace('{count}', String(totalSlides))}
        </p>
        {isSchool && (
          <div className={styles.checklist}>
            <div className={styles.checkItem}>{t('completion.checkOverallForm')}</div>
            <div className={styles.checkItem}>{t('completion.checkCenterWindow')}</div>
            <div className={styles.checkItem}>{t('completion.checkBase')}</div>
            <div className={styles.checkItem}>{t('completion.checkTopStructure')}</div>
            <div className={styles.checkItem}>{t('completion.checkQuiz')}</div>
          </div>
        )}
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onMore}>
            {t('completion.moreHeritage')}
          </button>
          <button className={styles.btnSecondary} onClick={onRestart}>
            {t('completion.restart')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
