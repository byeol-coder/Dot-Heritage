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
  const [paused, setPaused] = useState(false);
  const active = useMemo(() => heritagePoints[activeIndex], [activeIndex]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reducedMotion) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex(prev => (prev + 1) % heritagePoints.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      className={styles.hero}
      aria-labelledby="globe-hero-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.spaceBackdrop} aria-hidden="true" />
      <div className={styles.orbitOne} aria-hidden="true" />
      <div className={styles.orbitTwo} aria-hidden="true" />
      <div className={styles.earth} aria-hidden="true" />
      <a className={styles.skipLink} href="#heritage-after-hero">Skip intro</a>

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
          <span aria-hidden="true">|</span>
          <button type="button" onClick={onMuseum}>Museum Mode</button>
          <span aria-hidden="true">|</span>
          <button type="button" onClick={onSchool}>Tactile Guide</button>
          <span aria-hidden="true">|</span>
          <LanguageToggle />
          <HighContrastToggle />
          <button type="button" className={styles.menuButton} aria-label="Open menu">
            <span />
            <span />
            <span />
          </button>
        </nav>
      </header>

      <div className={styles.copyBlock}>
        <p className={styles.eyebrow}>Dot Heritage Global Archive</p>
        <h1 id="globe-hero-title">Heritage<br />Beyond Borders</h1>
        <span className={styles.copyLine} aria-hidden="true" />
        <p className={styles.subcopy}>시간과 공간을 넘어,<br />인류의 위대한 유산을 탐험하세요.</p>

        <div className={styles.ctaGroup} aria-label="Dot Heritage entry points">
          <button type="button" className={styles.ctaCard} onClick={onStart}>
            <span className={styles.ctaIcon} aria-hidden="true">◎</span>
            <span>
              <strong>Explore Collection</strong>
              <small>컬렉션 탐색하기</small>
            </span>
          </button>
          <button type="button" className={styles.ctaCard} onClick={onMuseum}>
            <span className={styles.ctaIcon} aria-hidden="true">▥</span>
            <span>
              <strong>Start Museum Mode</strong>
              <small>박물관 모드 시작</small>
            </span>
          </button>
          <button type="button" className={styles.ctaCard} onClick={onSchool}>
            <span className={styles.ctaIcon} aria-hidden="true">☝</span>
            <span>
              <strong>Try Tactile Guide</strong>
              <small>촉각 가이드 체험하기</small>
            </span>
          </button>
        </div>
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
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <span className={styles.pinLabel}>{point.subtitle}</span>
            <span className={styles.pinStem} aria-hidden="true" />
            <span className={styles.pinDot} aria-hidden="true">
              <span className={styles.pinRing} />
              <span className={styles.pinRingDelay} />
            </span>
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
            <div className={styles.featureBadges} aria-label="지원 기능">
              {active.features.map(feature => <span key={feature}>{feature}</span>)}
            </div>
            <button type="button" className={styles.detailButton} onClick={onMuseum}>View Details →</button>
          </div>
        </div>
      </article>

      <div className={styles.bottomHud}>
        <a className={styles.scrollHint} href="#heritage-after-hero" aria-label="아래 콘텐츠로 이동">
          <span>SCROLL</span>
          <i aria-hidden="true" />
        </a>
        <div className={styles.rotateHint} aria-hidden="true">
          <span className={styles.handIcon}>☝</span>
          <span>
            <strong>Drag to rotate</strong>
            <small>드래그하여 지구를 회전하세요</small>
          </span>
        </div>
        <div className={styles.dots} role="tablist" aria-label="문화유산 포인트 선택">
          {heritagePoints.map((point, index) => (
            <button
              key={point.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${point.title} 선택`}
              className={index === activeIndex ? styles.dotActive : ''}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
