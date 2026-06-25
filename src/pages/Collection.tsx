import { motion } from 'framer-motion';
import { Logo } from '../components/brand/Logo';
import { heritageList } from '../data/heritageData';
import { useI18n } from '../i18n/i18n';
import { LanguageToggle } from '../i18n/LanguageToggle';
import styles from './Collection.module.css';
import cardStyles from '../components/heritage/HeritageCard.module.css';

interface Props {
  onSelect: (id: string) => void;
  onBack: () => void;
  onStudio?: () => void;
}

const difficultyColors: Record<string, string> = { Easy: '#6FAF9F', Medium: '#C8A56A', Hard: '#E07070' };
const difficultyKeys: Record<string, string> = {
  Easy: 'collection.difficulty.easy',
  Medium: 'collection.difficulty.medium',
  Hard: 'collection.difficulty.hard',
};
const tagKeys: Record<string, string> = {
  School: 'collection.tag.school',
  Museum: 'collection.tag.museum',
  Workshop: 'collection.tag.workshop',
  'Intro Demo': 'collection.tag.introDemo',
};

export function Collection({ onSelect, onBack, onStudio }: Props) {
  const { t, tl } = useI18n();
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={onBack} className={styles.backBtn} aria-label={t('collection.backAria')}>← {t('common.back')}</button>
        <Logo size="sm" variant="full" />
        <LanguageToggle />
        {onStudio && (
          <button onClick={onStudio} className={styles.studioBtn}>
            {t('studio.openBtn')}
          </button>
        )}
      </header>
      <main className={styles.main}>
        <motion.div className={styles.intro} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className={styles.eyebrow}>{t('nav.collections')}</p>
          <h1 className={styles.title}>{t('collection.title')}</h1>
          <p className={styles.sub}>{t('collection.sub')}</p>
        </motion.div>
        <motion.div className={styles.grid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {heritageList.map((h, i) => (
            <motion.div key={h.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.3 }}>
              <article className={cardStyles.card} onClick={() => onSelect(h.id)} tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onSelect(h.id)}
                role="button" aria-label={t('collection.cardAria').replace('{title}', tl(h.title))}>
                <div className={cardStyles.visual} aria-hidden="true">
                  <div className={cardStyles.placeholder}>
                    <span>⬡</span>
                  </div>
                  <span className={cardStyles.type}>{tl(h.type)}</span>
                </div>
                <div className={cardStyles.info}>
                  <h3 className={cardStyles.title}>{tl(h.title)}</h3>
                  <p className={cardStyles.period}>{tl(h.period)}</p>
                  <p className={cardStyles.subtitle}>{tl(h.description)}</p>
                  <div className={cardStyles.meta}>
                    <span className={cardStyles.difficulty} style={{ color: difficultyColors[h.tactileDifficulty] }}>
                      ◉ {t(difficultyKeys[h.tactileDifficulty])}
                    </span>
                    <div className={cardStyles.tags}>
                      {h.recommendedFor.map(tag => (
                        <span key={tag} className={cardStyles.tag}>{tagKeys[tag] ? t(tagKeys[tag]) : tag}</span>
                      ))}
                    </div>
                  </div>
                  <button className={cardStyles.btn} onClick={e => { e.stopPropagation(); onSelect(h.id); }}>
                    {t('collection.startGuide')} →
                  </button>
                </div>
              </article>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
