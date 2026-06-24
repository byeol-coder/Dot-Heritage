import { motion } from 'framer-motion';
import { HeritageGlobeHero } from '../components/HeritageGlobeHero/HeritageGlobeHero';
import { MuseumsSection } from '../components/home/MuseumsSection';
import { useI18n } from '../i18n/i18n';
import styles from './Home.module.css';

interface Props {
  onStart: () => void;
  onMuseum: () => void;
  onSchool: () => void;
}

interface ModeCard {
  icon: string;
  titleKey: string;
  descKey: string;
  tagKey: string;
  btnLabelKey: string;
  handler: 'museum' | 'school' | 'start';
  accent: 'gold' | 'jade' | 'stone';
}

const MODE_CARDS: ModeCard[] = [
  {
    icon: '🏛',
    titleKey: 'home.mode.museum.title',
    descKey: 'home.mode.museum.desc',
    tagKey: 'home.mode.museum.tag',
    btnLabelKey: 'home.mode.museum.btn',
    handler: 'museum',
    accent: 'gold',
  },
  {
    icon: '🎓',
    titleKey: 'home.mode.school.title',
    descKey: 'home.mode.school.desc',
    tagKey: 'home.mode.school.tag',
    btnLabelKey: 'home.mode.school.btn',
    handler: 'school',
    accent: 'jade',
  },
  {
    icon: '⬡',
    titleKey: 'home.mode.free.title',
    descKey: 'home.mode.free.desc',
    tagKey: 'home.mode.free.tag',
    btnLabelKey: 'home.mode.free.btn',
    handler: 'start',
    accent: 'stone',
  },
];

export function Home({ onStart, onMuseum, onSchool }: Props) {
  const { t } = useI18n();

  const handleMode = (handler: ModeCard['handler']) => {
    if (handler === 'museum') onMuseum();
    else if (handler === 'school') onSchool();
    else onStart();
  };

  return (
    <div className={styles.page}>
      <HeritageGlobeHero onStart={onStart} onMuseum={onMuseum} onSchool={onSchool} />

      <main id="heritage-after-hero">
        <MuseumsSection onStart={onStart} onMuseum={onMuseum} />

        <section className={styles.modes} aria-label={t('home.modes.aria')}>
          <motion.h2
            className={styles.modesHeading}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('home.modes.heading')}
          </motion.h2>

          <div className={styles.modeGrid}>
            {MODE_CARDS.map((card, i) => (
              <motion.div
                key={card.titleKey}
                className={`${styles.modeCard} ${styles[`modeCard--${card.accent}`]}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className={styles.modeCardInner}>
                  <span className={styles.modeIcon} aria-hidden="true">{card.icon}</span>
                  <span className={styles.modeTag}>{t(card.tagKey)}</span>
                  <h3 className={styles.modeTitle}>{t(card.titleKey)}</h3>
                  <p className={styles.modeDesc}>{t(card.descKey)}</p>
                  <button
                    className={`${styles.modeBtn} ${styles[`modeBtn--${card.accent}`]}`}
                    onClick={() => handleMode(card.handler)}
                    aria-label={t(card.titleKey)}
                  >
                    {t(card.btnLabelKey)}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span className={styles.footerTagline}>{t('home.footer.tagline')}</span>
        <span className={styles.footerCopy}>{t('home.footer.copy')}</span>
      </footer>
    </div>
  );
}
