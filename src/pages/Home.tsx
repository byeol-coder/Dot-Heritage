import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import styles from './Home.module.css';

interface Props {
  onStart: () => void;
  onMuseum: () => void;
  onSchool: () => void;
}

/* ─── Heritage data ─── */
interface HeritageEntry {
  korean: string;
  english: string;
  period: string;
  emoji: string;
  matrix: DotMatrix;
  braille: string[];
}

const HERITAGE_LIST: HeritageEntry[] = [
  {
    korean: '첨성대',
    english: 'Cheomseongdae Observatory',
    period: '신라 선덕여왕 · 7세기',
    emoji: '🏛',
    matrix: createCheomseongdaeSilhouette(),
    braille: ['첨성대 신라', '원형 석조탑'],
  },
  {
    korean: '백자 달항아리',
    english: 'White Porcelain Moon Jar',
    period: '조선 · 17–18세기',
    emoji: '🏺',
    matrix: createCheomseongdaeWindow(),
    braille: ['백자 달항아리', '조선 백색 원형'],
  },
  {
    korean: '신라 수막새',
    english: 'Silla Lotus Roof Tile',
    period: '신라 · 7–8세기',
    emoji: '🪷',
    matrix: createCheomseongdaeBase(),
    braille: ['신라 수막새', '연꽃 문양 기와'],
  },
  {
    korean: '조선 전통 전각',
    english: 'Joseon Palace Hall',
    period: '조선 · 14–19세기',
    emoji: '🏯',
    matrix: createKoreanPalaceSilhouette(),
    braille: ['조선 전통 전각', '목조 건축 기둥'],
  },
];

const CYCLE_INTERVAL = 3500;
const SCANNING_DURATION = 800;

/* ─── Mode cards data ─── */
interface ModeCard {
  icon: string;
  title: string;
  desc: string;
  tag: string;
  btnLabel: string;
  handler: 'museum' | 'school' | 'start';
  accent: 'gold' | 'jade' | 'stone';
}

const MODE_CARDS: ModeCard[] = [
  {
    icon: '🏛',
    title: 'Museum Experience',
    desc: 'Auto-guided, immersive tactile tour with narration and spotlight curation.',
    tag: 'GUIDED',
    btnLabel: 'Enter →',
    handler: 'museum',
    accent: 'gold',
  },
  {
    icon: '🎓',
    title: 'Classroom Learning',
    desc: 'Structured lessons with tactile exploration, audio narration, and quizzes.',
    tag: 'EDUCATIONAL',
    btnLabel: 'Start Lesson →',
    handler: 'school',
    accent: 'jade',
  },
  {
    icon: '⬡',
    title: 'Free Exploration',
    desc: 'Navigate freely through cultural heritage stories at your own pace.',
    tag: 'SELF-GUIDED',
    btnLabel: 'Explore →',
    handler: 'start',
    accent: 'stone',
  },
];

const FEATURES = [
  { icon: '⬡', label: 'IMMERSIVE 3D', desc: 'See heritage come to life in three dimensions' },
  { icon: '◈', label: 'TTS NARRATION', desc: 'Listen in Korean or English, hands-free' },
  { icon: '⋮⋮', label: 'DOT PAD', desc: 'Feel the shape of heritage through tactile graphics' },
];

export function Home({ onStart, onMuseum, onSchool }: Props) {
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
        <nav className={styles.navLinks} aria-label="Main navigation">
          {['Collections', 'Experience', 'Education'].map(label => (
            <a key={label} href="#" className={styles.navLink}>{label}</a>
          ))}
          <HighContrastToggle />
        </nav>
      </header>

      {/* ─── HERO ─── */}
      <section
        className={styles.hero}
        aria-label="Hero introduction"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >

        {/* LEFT — Copy */}
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            Dot Heritage · 문화유산 촉각 플랫폼 ── ◈
          </p>

          <h1 className={styles.headline}>
            See, Hear,<br />and Touch Heritage
          </h1>

          <p className={styles.sub}>
            문화유산을 3D로 보고, 귀로 듣고, 손끝으로 느끼는 Dot Pad 촉각 해설 플랫폼. Designed for everyone.
          </p>

          <ul className={styles.features} aria-label="Platform features">
            {FEATURES.map(f => (
              <li key={f.label} className={styles.feature}>
                <span className={styles.featureIcon} aria-hidden="true">{f.icon}</span>
                <div>
                  <div className={styles.featureLabel}>{f.label}</div>
                  <div className={styles.featureDesc}>{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.cta}>
            <button className={styles.ctaPrimary} onClick={onStart} aria-label="Start journey">
              START TACTILE JOURNEY
            </button>
            <button className={styles.ctaMuseum} onClick={onMuseum} aria-label="Museum mode">
              MUSEUM MODE
            </button>
            <button className={styles.ctaSchool} onClick={onSchool} aria-label="School mode">
              SCHOOL MODE
            </button>
          </div>

          <p className={styles.a11yNote}>
            <span aria-hidden="true">♿</span> Built for accessibility — designed for everyone.
          </p>

          <div className={styles.tagList} aria-label="Platform features">
            {['3D Heritage Guide', 'Dot Pad Tactile Graphics', 'Museum & School'].map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>

        {/* CENTER — Heritage Card Carousel */}
        <div
          className={styles.centerColumn}
          aria-label="Heritage showcase carousel"
        >
          <div className={styles.carouselWrapper}>

            {/* Prev / Next arrows */}
            <button
              className={`${styles.arrowBtn} ${styles.arrowLeft}`}
              onClick={prev}
              aria-label="Previous heritage"
            >
              ‹
            </button>
            <button
              className={`${styles.arrowBtn} ${styles.arrowRight}`}
              onClick={() => advance()}
              aria-label="Next heritage"
            >
              ›
            </button>

            {/* Card */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                className={styles.heritageCard}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                role="group"
                aria-label={`Heritage: ${current.korean}`}
              >
                {/* Museum display area */}
                <div className={styles.cardVisual} aria-hidden="true">
                  <div className={styles.spotlightRing} aria-hidden="true" />
                  <span className={styles.cardEmoji} style={{ fontSize: '4rem', lineHeight: 1 }}>{current.emoji}</span>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.cardKorean}>{current.korean}</p>
                  <p className={styles.cardEnglish}>{current.english}</p>
                  <p className={styles.cardPeriod}>{current.period}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide dots */}
          <div className={styles.dots} role="tablist" aria-label="Heritage slides">
            {HERITAGE_LIST.map((h, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to ${h.korean}`}
                className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — Dot Pad Live Preview */}
        <div
          className={styles.rightColumn}
          aria-label="Dot Pad live preview"
        >
          <div className={styles.dotpadHeader}>
            <span className={styles.dotpadTitle}>DOT PAD · LIVE OUTPUT</span>
            <span className={styles.dotpadStatus}>
              <span className={styles.statusDot} aria-hidden="true">⬤</span> LIVE
            </span>
          </div>

          <div className={styles.dotpadPanel}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`dotpad-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DotPadOutputPanel
                  matrix={current.matrix}
                  brailleText={current.braille}
                  scanning={scanning}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <p className={styles.dotpadFooter}>60×40 Dot Pad Display</p>
          <p className={styles.dotpadDesc}>
            Heritage image → tactile dots
          </p>
        </div>

      </section>

      {/* ─── MUSEUMS ─── */}
      <MuseumsSection onStart={onStart} onMuseum={onMuseum} />

      {/* ─── MODE SELECTION ─── */}
      <section className={styles.modes} aria-label="Select your experience mode">
        <motion.h2
          className={styles.modesHeading}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Choose Your Experience
        </motion.h2>

        <div className={styles.modeGrid}>
          {MODE_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              className={`${styles.modeCard} ${styles[`modeCard--${card.accent}`]}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className={styles.modeCardInner}>
                <span className={styles.modeIcon} aria-hidden="true">{card.icon}</span>
                <span className={styles.modeTag}>{card.tag}</span>
                <h3 className={styles.modeTitle}>{card.title}</h3>
                <p className={styles.modeDesc}>{card.desc}</p>
                <button
                  className={`${styles.modeBtn} ${styles[`modeBtn--${card.accent}`]}`}
                  onClick={() => handleMode(card.handler)}
                  aria-label={card.title}
                >
                  {card.btnLabel}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className={styles.footer}>
        <span className={styles.footerTagline}>HERITAGE. ACCESSIBLE TO ALL.</span>
        <span className={styles.footerCopy}>© Dot Inc. · Dot Heritage Platform</span>
      </footer>

    </div>
  );
}
