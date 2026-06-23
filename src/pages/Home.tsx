import { motion } from 'framer-motion';
import { Logo } from '../components/brand/Logo';
import { DotPadOutputPanel } from '../components/dotpad/DotPadOutputPanel';
import { TTSNarrationPanel } from '../components/narration/TTSNarrationPanel';
import { HighContrastToggle } from '../components/ui/HighContrastToggle';
import { createCheomseongdaeSilhouette } from '../engine/tactile/createCheomseongdae';
import { Cheomseongdae3D } from '../components/heritage/Cheomseongdae3D';
import styles from './Home.module.css';

interface Props {
  onStart: () => void;
  onMuseum: () => void;
  onSchool: () => void;
}

const demoMatrix = createCheomseongdaeSilhouette();
const demoTts = {
  ko: '이것은 첨성대입니다. 동아시아에서 가장 오래된 천문 관측대로, 신라 시대에 지어졌습니다.',
  en: 'This is Cheomseongdae, the oldest surviving astronomical observatory in Asia, built during the Silla Dynasty.',
};

const features = [
  { icon: '⬡', label: 'IMMERSIVE 3D', desc: 'See heritage come to life.' },
  { icon: '◈', label: 'TTS NARRATION', desc: 'Listen in real-time, in your language.' },
  { icon: '⋮⋮', label: 'DOT PAD', desc: 'Feel the shape of heritage.' },
];

export function Home({ onStart, onMuseum, onSchool }: Props) {
  return (
    <div className={styles.page}>
      {/* Nav */}
      <header className={styles.nav}>
        <Logo size="md" variant="full" />
        <nav className={styles.navLinks} aria-label="Main navigation">
          {['About', 'Collections', 'Experience', 'Education'].map(l => (
            <a key={l} href="#" className={styles.navLink}>{l}</a>
          ))}
          <span className={styles.langChip}>EN ▾</span>
          <HighContrastToggle />
        </nav>
      </header>

      {/* Hero */}
      <section className={styles.hero} aria-label="Hero">
        {/* Left copy */}
        <div className={styles.copy}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            유산을 모두의 이야기로 ━━━ ⬙
          </motion.p>
          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          >
            Touch the Shape<br />of Heritage
          </motion.h1>
          <motion.p
            className={styles.sub}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          >
            Explore Korea's timeless cultural legacy through immersive 3D visuals,
            TTS narration, and Dot Pad tactile graphics—designed for everyone.
          </motion.p>

          <motion.div
            className={styles.features}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          >
            {features.map(f => (
              <div key={f.label} className={styles.feature}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <div>
                  <div className={styles.featureLabel}>{f.label}</div>
                  <div className={styles.featureDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            className={styles.cta}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          >
            <button className={styles.ctaPrimary} onClick={onStart} aria-label="Start Experience">
              START EXPERIENCE →
            </button>
            <button className={styles.ctaSecondary} onClick={onMuseum} aria-label="Museum Mode">
              🏛 MUSEUM MODE
            </button>
            <button className={styles.ctaSecondary} onClick={onSchool} aria-label="School Mode">
              🎓 SCHOOL MODE
            </button>
          </motion.div>

          <p className={styles.a11yNote}>
            <span aria-hidden="true">♿</span> Built for accessibility. Designed for everyone.
          </p>
        </div>

        {/* Center 3D */}
        <motion.div
          className={styles.centerFrame}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.7 }}
          aria-hidden="true"
        >
          <div className={styles.archFrame}>
            <Cheomseongdae3D cameraView="front" />
          </div>
          <div className={styles.carouselDots} aria-hidden="true">
            {[0,1,2,3,4,5].map(i => (
              <span key={i} className={`${styles.cdot} ${i === 0 ? styles.cdotActive : ''}`} />
            ))}
          </div>
        </motion.div>

        {/* Right cards */}
        <motion.div
          className={styles.rightCards}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
        >
          <DotPadOutputPanel
            matrix={demoMatrix}
            brailleText={['첨성대 전체', '아래 넓고 위 좁음']}
          />
          <TTSNarrationPanel text={demoTts} />
          <div className={styles.infoCard}>
            <div className={styles.infoThumb} aria-hidden="true">⬡</div>
            <div>
              <div className={styles.infoTitle}>CHEOMSEONGDAE</div>
              <div className={styles.infoSub}>Gyeongju, Silla Dynasty</div>
              <div className={styles.infoSub}>7th Century</div>
              <button className={styles.viewBtn} onClick={onStart}>VIEW DETAILS →</button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>HERITAGE. ACCESSIBLE TO ALL.</span>
        <span>BRIDGING PAST AND FUTURE.</span>
        <span>SCROLL TO DISCOVER ↓</span>
      </footer>
    </div>
  );
}
