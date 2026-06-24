import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../components/brand/Logo';
import { HighContrastToggle } from '../components/ui/HighContrastToggle';
import { DotPadOutputPanel } from '../components/dotpad/DotPadOutputPanel';
import {
  createCheomseongdaeSilhouette,
  createCheomseongdaeWindow,
  createCheomseongdaeBase,
} from '../engine/tactile/createCheomseongdae';
import { createKoreanPalaceSilhouette } from '../engine/tactile/createKoreanPalace';
import type { DotMatrix } from '../types/heritage';
import { MuseumsSection } from '../components/home/MuseumsSection';
import { useI18n } from '../i18n/i18n';
import { LanguageToggle } from '../i18n/LanguageToggle';
import type { LocalizedText } from '../types/heritage';
import styles from './Home.module.css';

interface Props {
  onStart: () => void;
  onMuseum: () => void;
  onSchool: () => void;
}

/* ─── Heritage data ─── */
interface HeritageEntry {
  name: LocalizedText;
  english: string;
  period: LocalizedText;
  emoji: string;
  image?: string;
  matrix: DotMatrix;
  braille: string[];
}

const ASSET = import.meta.env.BASE_URL;

const HERITAGE_LIST: HeritageEntry[] = [
  {
    name: { ko: '첨성대', en: 'Cheomseongdae' },
    english: 'Cheomseongdae Observatory',
    period: { ko: '신라 선덕여왕 · 7세기', en: 'Silla, Queen Seondeok · 7th c.' },
    emoji: '🏛',
    image: `${ASSET}assets/heritage/cheomseongdae.jpg`,
    matrix: createCheomseongdaeSilhouette(),
    braille: ['첨성대 신라', '원형 석조탑'],
  },
  {
    name: { ko: '백자 달항아리', en: 'Moon Jar' },
    english: 'White Porcelain Moon Jar',
    period: { ko: '조선 · 17–18세기', en: 'Joseon · 17th–18th c.' },
    emoji: '🏺',
    image: `${ASSET}assets/heritage/moon-jar.jpg`,
    matrix: createCheomseongdaeWindow(),
    braille: ['백자 달항아리', '조선 백색 원형'],
  },
  {
    name: { ko: '신라 수막새', en: 'Silla Roof Tile' },
    english: 'Silla Lotus Roof Tile',
    period: { ko: '신라 · 7–8세기', en: 'Silla · 7th–8th c.' },
    emoji: '🪷',
    image: `${ASSET}assets/heritage/roof-tile.jpg`,
    matrix: createCheomseongdaeBase(),
    braille: ['신라 수막새', '연꽃 문양 기와'],
  },
  {
    name: { ko: '조선 전통 전각', en: 'Joseon Palace Hall' },
    english: 'Joseon Palace Hall',
    period: { ko: '조선 · 14–19세기', en: 'Joseon · 14th–19th c.' },
    emoji: '🏯',
    image: `${ASSET}assets/heritage/palace.jpg`,
    matrix: createKoreanPalaceSilhouette(),
    braille: ['조선 전통 전각', '목조 건축 기둥'],
  },
];

const CYCLE_INTERVAL = 3500;
const SCANNING_DURATION = 800;

/* ─── Mode cards data ─── */
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

const FEATURES = [
  { icon: '⬡', labelKey: 'home.feature.3d.label', descKey: 'home.feature.3d.desc' },
  { icon: '◈', labelKey: 'home.feature.tts.label', descKey: 'home.feature.tts.desc' },
  { icon: '⋮⋮', labelKey: 'home.feature.dotpad.label', descKey: 'home.feature.dotpad.desc' },
];

export function Home({ onStart, onMuseum, onSchool }: Props) {
  const { t, tl } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [hovering, setHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    setScanning(true);
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    scanTimerRef.current = setTimeout(() => setScanning(false), SCANNING_DURATION);
  }, []);

  const advance = useCallback(() => {
    setActiveIndex(prev => {
      const next = (prev + 1) % HERITAGE_LIST.length;
      setScanning(true);
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
      scanTimerRef.current = setTimeout(() => setScanning(false), SCANNING_DURATION);
      return next;
    });
  }, []);

  const prev = useCallback(() => {
    setActiveIndex(p => (p - 1 + HERITAGE_LIST.length) % HERITAGE_LIST.length);
    setScanning(true);
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    scanTimerRef.current = setTimeout(() => setScanning(false), SCANNING_DURATION);
  }, []);

  useEffect(() => {
    if (hovering) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(advance, CYCLE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hovering, advance]);

  useEffect(() => {
    return () => {
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const current = HERITAGE_LIST[activeIndex];

  const handleMode = (handler: ModeCard['handler']) => {
    if (handler === 'museum') onMuseum();
    else if (handler === 'school') onSchool();
    else onStart();
  };

  return (
    <div className={styles.page}>

      {/* ─── NAV ─── */}
      <header className={styles.nav}>
        <Logo size="md" variant="full" />
        <nav className={styles.navLinks} aria-label={t('home.nav.aria')}>
          {[
            { key: 'nav.collections' },
            { key: 'nav.experience' },
            { key: 'nav.education' },
          ].map(item => (
            <a key={item.key} href="#" className={styles.navLink}>{t(item.key)}</a>
          ))}
          <LanguageToggle />
          <HighContrastToggle />
        </nav>
      </header>

      {/* ─── HERO ─── */}
      <section
        className={styles.hero}
        aria-label={t('home.hero.aria')}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >

        {/* LEFT — Copy */}
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            {t('home.hero.eyebrow')}
          </p>

          <h1 className={styles.headline}>
            {t('home.hero.headlineLine1')}<br />{t('home.hero.headlineLine2')}
          </h1>

          <p className={styles.sub}>
            {t('home.hero.sub')}
          </p>

          <ul className={styles.features} aria-label={t('home.features.aria')}>
            {FEATURES.map(f => (
              <li key={f.labelKey} className={styles.feature}>
                <span className={styles.featureIcon} aria-hidden="true">{f.icon}</span>
                <div>
                  <div className={styles.featureLabel}>{t(f.labelKey)}</div>
                  <div className={styles.featureDesc}>{t(f.descKey)}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.cta}>
            <button className={styles.ctaPrimary} onClick={onStart} aria-label={t('home.cta.start')}>
              {t('home.cta.start')}
            </button>
            <button className={styles.ctaMuseum} onClick={onMuseum} aria-label={t('home.cta.museum')}>
              {t('home.cta.museum')}
            </button>
            <button className={styles.ctaSchool} onClick={onSchool} aria-label={t('home.cta.school')}>
              {t('home.cta.school')}
            </button>
          </div>

          <p className={styles.a11yNote}>
            <span aria-hidden="true">♿</span> {t('home.a11yNote')}
          </p>

          <div className={styles.tagList} aria-label={t('home.tags.aria')}>
            {['home.tag.guide', 'home.tag.tactile', 'home.tag.modes'].map(tagKey => (
              <span key={tagKey} className={styles.tag}>{t(tagKey)}</span>
            ))}
          </div>
        </div>

        {/* CENTER — Heritage Card Carousel */}
        <div
          className={styles.centerColumn}
          aria-label={t('home.carousel.aria')}
        >
          <div className={styles.carouselWrapper}>

            {/* Prev / Next arrows */}
            <button
              className={`${styles.arrowBtn} ${styles.arrowLeft}`}
              onClick={prev}
              aria-label={t('home.carousel.prev')}
            >
              ‹
            </button>
            <button
              className={`${styles.arrowBtn} ${styles.arrowRight}`}
              onClick={() => advance()}
              aria-label={t('home.carousel.next')}
            >
              ›
            </button>

            {/* Card — keyed motion (no AnimatePresence exit, which can stall
                under React 19 StrictMode and freeze the carousel). */}
            <motion.div
              key={activeIndex}
              className={styles.heritageCard}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              role="group"
              aria-label={`${t('home.carousel.itemAria')}: ${tl(current.name)}`}
            >
                {/* Museum display area */}
                <div className={styles.cardVisual} aria-hidden="true">
                  <div className={styles.spotlightRing} aria-hidden="true" />
                  {current.image ? (
                    <img
                      src={current.image}
                      alt=""
                      className={styles.cardImage}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className={styles.cardEmoji} style={{ fontSize: '4rem', lineHeight: 1 }}>{current.emoji}</span>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.cardKorean}>{tl(current.name)}</p>
                  <p className={styles.cardEnglish}>{current.english}</p>
                  <p className={styles.cardPeriod}>{tl(current.period)}</p>
                </div>
            </motion.div>
          </div>

          {/* Slide dots */}
          <div className={styles.dots} role="tablist" aria-label={t('home.carousel.slidesAria')}>
            {HERITAGE_LIST.map((h, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`${t('home.carousel.goTo')} ${tl(h.name)}`}
                className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — Dot Pad Live Preview */}
        <div
          className={styles.rightColumn}
          aria-label={t('home.dotpad.aria')}
        >
          <div className={styles.dotpadHeader}>
            <span className={styles.dotpadTitle}>{t('home.dotpad.title')}</span>
            <span className={styles.dotpadStatus}>
              <span className={styles.statusDot} aria-hidden="true">⬤</span> {t('home.dotpad.live')}
            </span>
          </div>

          <div className={styles.dotpadPanel}>
            <motion.div
              key={`dotpad-${activeIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <DotPadOutputPanel
                matrix={current.matrix}
                brailleText={current.braille}
                scanning={scanning}
              />
            </motion.div>
          </div>

          <p className={styles.dotpadFooter}>{t('home.dotpad.footer')}</p>
          <p className={styles.dotpadDesc}>
            {t('home.dotpad.desc')}
          </p>
        </div>

      </section>

      {/* ─── MUSEUMS ─── */}
      <MuseumsSection onStart={onStart} onMuseum={onMuseum} />

      {/* ─── MODE SELECTION ─── */}
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

      {/* ─── FOOTER ─── */}
      <footer className={styles.footer}>
        <span className={styles.footerTagline}>{t('home.footer.tagline')}</span>
        <span className={styles.footerCopy}>{t('home.footer.copy')}</span>
      </footer>

    </div>
  );
}
