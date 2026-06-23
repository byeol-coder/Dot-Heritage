import styles from './HeritageCard.module.css';
import type { Heritage } from '../../types/heritage';

interface Props {
  heritage: Heritage;
  lang?: 'ko' | 'en';
  onSelect: (id: string) => void;
}

const difficultyColors = { Easy: '#6FAF9F', Medium: '#C8A56A', Hard: '#E07070' };

export function HeritageCard({ heritage, lang = 'ko', onSelect }: Props) {
  return (
    <article className={styles.card} onClick={() => onSelect(heritage.id)} tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(heritage.id)}
      role="button" aria-label={`Start guide for ${lang === 'ko' ? heritage.title.ko : heritage.title.en}`}>
      <div className={styles.visual} aria-hidden="true">
        <div className={styles.placeholder}>
          <span>⬡</span>
        </div>
        <span className={styles.type}>{lang === 'ko' ? heritage.type.ko : heritage.type.en}</span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{lang === 'ko' ? heritage.title.ko : heritage.title.en}</h3>
        <p className={styles.subtitle}>{lang === 'ko' ? heritage.title.en : heritage.title.ko}</p>
        <p className={styles.period}>{lang === 'ko' ? heritage.period.ko : heritage.period.en}</p>
        <div className={styles.meta}>
          <span className={styles.difficulty} style={{ color: difficultyColors[heritage.tactileDifficulty] }}>
            ◉ {heritage.tactileDifficulty}
          </span>
          <div className={styles.tags}>
            {heritage.recommendedFor.map(t => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        </div>
        <button className={styles.btn} onClick={e => { e.stopPropagation(); onSelect(heritage.id); }}>
          {lang === 'ko' ? '해설 시작' : 'Start Guide'} →
        </button>
      </div>
    </article>
  );
}
