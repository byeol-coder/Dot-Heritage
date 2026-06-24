import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Logo } from '../brand/Logo';
import { HighContrastToggle } from '../ui/HighContrastToggle';
import { LanguageToggle } from '../../i18n/LanguageToggle';
import { heritagePoints } from './heritagePoints';
import styles from './HeritageGlobeHero.module.css';

interface Props {
  onStart: () => void;
  onMuseum: () => void;
  onSchool: () => void;
}

export function HeritageGlobeHero({ onStart, onMuseum, onSchool }: Props) {
  const [activeIndex, setActiveIndex] = useState(3);
  const active = useMemo(() => heritagePoints[activeIndex], [activeIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex(prev => (prev + 1) % heritagePoints.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="globe-hero-title">
      <div className={styles.spaceBackdrop} aria-hidden="true" />
      <div className={styles.earth} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.brandWrap}>
          <Logo size="md" variant="icon" />
          <div className={styles.brandText} aria-label="Heritage Archive">
            <span>Heritage</span>
            <span>Archive</span>
          </div>
        </div>
        <nav className={styles.nav} aria-label="Dot Heritage primary navigation">
          <button type="button" onClick={onStart}>Collection</button>
          <button type="button" onClick={onMuseum}>Museum Mode</button>
          <button type="button" onClick={onSchool}>Tactile Guide</button>
          <LanguageToggle />
          <HighContrastToggle />
        </nav>
      </header>

      <div className={styles.copyBlock}>
        <p className={styles.eyebrow}>Dot Heritage Global Archive</p>
        <h1 id="globe-hero-title">Heritage<br />Beyond Borders</h1>
        <span className={styles.copyLine} aria-hidden="true" />
        <p className={styles.subcopy}>시간과 공간을 넘어,<br />인류의 위대한 유산을 탐험하세요.</p>
      </div>

      <div className={styles.pinLayer} aria-label="세계 문화유산 지구본 인터랙션">
        {heritagePoints.map((point, index) => (
          <button
            key={point.id}
            type="button"
            className={`${styles.pinGroup} ${index === activeIndex ? styles.pinGroupActive : ''}`}
            style={{ '--x': `${point.x}%`, '--y': `${point.y}%` } as CSSProperties}
            aria-label={`${point.subtitle} 자세히 보기`}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            <span className={styles.pinLabel}>{point.subtitle}</span>
            <span className={styles.pinDot} aria-hidden="true" />
          </button>
        ))}
      </div>

      <article className={styles.infoCard} aria-live="polite" aria-label="현재 선택된 문화유산 정보">
        <span className={styles.cardPill}>{active.subtitle}</span>
        <div className={styles.cardMain}>
          <img src={active.image} alt={active.imageAlt} className={styles.cardImage} loading="eager" decoding="async" />
          <div className={styles.cardContent}>
            <h2>{active.country}<br />{active.title}</h2>
            <p className={styles.period}>{active.period}</p>
            <p>{active.description}</p>
            <button type="button" className={styles.detailButton} onClick={onMuseum}>View Details →</button>
          </div>
        </div>
      </article>
    </section>
  );
}
