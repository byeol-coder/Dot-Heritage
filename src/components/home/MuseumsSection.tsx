/* ========================================
   MuseumsSection — For Museums & Heritage Institutions
   B2B acquisition section on Dot Heritage home page
   ======================================== */

import styles from './MuseumsSection.module.css';

/* ─── Icons (inline SVG) ─── */

function TactileProhibitionIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left hand silhouette */}
      <path
        d="M16 34 L16 20 C16 18.9 16.9 18 18 18 C19.1 18 20 18.9 20 20 L20 28"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 26 L20 19 C20 17.9 20.9 17 22 17 C23.1 17 24 17.9 24 19 L24 27"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 26 L24 20 C24 18.9 24.9 18 26 18 C27.1 18 28 18.9 28 20 L28 28"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 34 C16 38 19 41 23 41 L28 41 C31 41 34 39 35 36 L28 28"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Prohibition circle */}
      <circle
        cx="40"
        cy="16"
        r="10"
        stroke="#C85A4A"
        strokeWidth="1.8"
        fill="rgba(200,90,74,0.1)"
      />
      <line
        x1="33"
        y1="9"
        x2="47"
        y2="23"
        stroke="#C85A4A"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TransformIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 3D cube left */}
      <path
        d="M6 14 L12 10 L18 14 L18 22 L12 26 L6 22 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="12" y1="10" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="18" x2="18" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 1.5" />
      <line x1="12" y1="18" x2="6" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 1.5" />
      {/* Arrow */}
      <path
        d="M20 20 L26 20 M24 17 L27 20 L24 23"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tactile dots grid right */}
      {[0, 1, 2].map(row =>
        [0, 1, 2].map(col => (
          <circle
            key={`${row}-${col}`}
            cx={29 + col * 3.5}
            cy={14 + row * 3.5}
            r="1"
            fill="currentColor"
            opacity={row === 1 && col === 1 ? 1 : 0.5}
          />
        ))
      )}
    </svg>
  );
}

function AnywhereIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Building */}
      <rect x="5" y="16" width="10" height="14" stroke="currentColor" strokeWidth="1.5" rx="1" />
      <rect x="7" y="18" width="2" height="2" fill="currentColor" opacity="0.6" />
      <rect x="11" y="18" width="2" height="2" fill="currentColor" opacity="0.6" />
      <rect x="7" y="22" width="2" height="2" fill="currentColor" opacity="0.6" />
      <rect x="11" y="22" width="2" height="2" fill="currentColor" opacity="0.6" />
      <line x1="5" y1="16" x2="10" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="16" x2="10" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* School */}
      <rect x="19" y="18" width="9" height="12" stroke="currentColor" strokeWidth="1.4" rx="1" />
      <path d="M19 18 L23.5 14 L28 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="21" y="24" width="5" height="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Mobile device */}
      <rect x="31" y="14" width="6" height="10" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <line x1="33" y1="22.5" x2="35" y2="22.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Connecting dots */}
      <circle cx="15" cy="10" r="1.2" fill="currentColor" opacity="0.4" />
      <circle cx="20" cy="8" r="1.2" fill="currentColor" opacity="0.4" />
      <circle cx="25" cy="10" r="1.2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function InclusiveIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Central figure */}
      <circle cx="20" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 22 L20 17 L26 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="20" y1="17" x2="20" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="22" x2="26" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="27" x2="16" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="27" x2="24" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Inclusive orbit rings */}
      <ellipse cx="20" cy="20" rx="16" ry="7" stroke="currentColor" strokeWidth="1" strokeDasharray="2.5 2" opacity="0.4" />
      <ellipse cx="20" cy="20" rx="9" ry="15" stroke="currentColor" strokeWidth="1" strokeDasharray="2.5 2" opacity="0.3" />
    </svg>
  );
}

function MuseumDisplayIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Pedestal */}
      <rect x="13" y="26" width="10" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <line x1="11" y1="30" x2="25" y2="30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="24" x2="20" y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Artifact (stylized jar) */}
      <path
        d="M13 24 C10 21 10 12 14 10 L22 10 C26 12 26 21 23 24 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="14" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Spotlight */}
      <path
        d="M11 4 L18 10 L25 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <circle cx="11" cy="4" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="25" cy="4" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function EducationRoomIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Whiteboard */}
      <rect x="5" y="6" width="26" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      {/* Content on board (tactile pattern) */}
      {[0, 1, 2, 3].map(col => (
        <circle key={col} cx={10 + col * 5} cy="14" r="1.2" fill="currentColor" opacity={0.5 + col * 0.15} />
      ))}
      <line x1="9" y1="11" x2="27" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      {/* Stand */}
      <line x1="18" y1="22" x2="18" y2="26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="12" y1="26" x2="24" y2="26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* Student figures */}
      <circle cx="9" cy="30" r="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="18" cy="30" r="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="27" cy="30" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function MobileDocentIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Person walking */}
      <circle cx="14" cy="7" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 14 L14 11 L18 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="14" y1="11" x2="14" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="10" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="14" y1="21" x2="11" y2="27" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="14" y1="21" x2="17" y2="27" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Dot Pad device in hand */}
      <rect x="18" y="13" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      {[0, 1].map(row =>
        [0, 1, 2].map(col => (
          <circle key={`${row}-${col}`} cx={20 + col * 2.5} cy={15.5 + row * 2.5} r="0.7" fill="currentColor" opacity="0.7" />
        ))
      )}
      {/* Motion lines */}
      <line x1="4" y1="18" x2="8" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <line x1="5" y1="21" x2="8" y2="21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

/* ─── Data ─── */

const SOLUTION_COLUMNS = [
  {
    icon: <TransformIcon />,
    heading: '3D → Tactile',
    body: '국가유산 3D/도면 데이터를 Dot Pad 촉각 콘텐츠로 변환합니다. 원본 훼손 없이 디지털 데이터에서 직접 생성.',
    accent: 'gold' as const,
  },
  {
    icon: <AnywhereIcon />,
    heading: '어디서나',
    body: '전시실, 교육실, 이동형 도슨트 프로그램 어디서나 동일한 고품질 촉각 경험을 제공합니다.',
    accent: 'jade' as const,
  },
  {
    icon: <InclusiveIcon />,
    heading: '모두를 위해',
    body: '시각장애·저시력·어린이·고령자·비장애인 모두를 위한 공감각 학습. 접근성과 참여가 함께.',
    accent: 'stone' as const,
  },
];

interface UseCase {
  icon: React.ReactNode;
  label: string;
  title: string;
  desc: string;
  badge: string;
  badgeAccent: 'gold' | 'jade' | 'stone';
}

const USE_CASES: UseCase[] = [
  {
    icon: <MuseumDisplayIcon />,
    label: 'Museum Display',
    title: '전시실 설치형',
    desc: '상설 전시 공간에 Dot Pad를 설치하여 관람객이 언제든 촉각으로 유물을 탐색할 수 있습니다. 자동 안내 음성 병행.',
    badge: 'PERMANENT',
    badgeAccent: 'gold',
  },
  {
    icon: <EducationRoomIcon />,
    label: 'Education Room',
    title: '교육실 프로그램형',
    desc: '체험 학습실에서 단체 프로그램을 운영합니다. 커리큘럼과 연계된 유물 촉각 탐구, 교사 제어 대시보드 제공.',
    badge: 'EDUCATIONAL',
    badgeAccent: 'jade',
  },
  {
    icon: <MobileDocentIcon />,
    label: 'Mobile Docent',
    title: '이동형 도슨트',
    desc: '큐레이터나 도슨트가 Dot Pad를 들고 이동하며 설명합니다. 소그룹 투어 및 VIP 해설에 최적화.',
    badge: 'FLEXIBLE',
    badgeAccent: 'stone',
  },
];

const IMPACT_METRICS = [
  {
    value: '100%',
    label: 'Accessibility Compliance',
    subLabel: '법적 접근성 기준 충족',
    accent: 'gold' as const,
  },
  {
    value: '60×40',
    label: 'Dot Pad Resolution',
    subLabel: '2,400 촉각 핀 디스플레이',
    accent: 'jade' as const,
  },
  {
    value: '5개+',
    label: 'Heritage Items / Session',
    subLabel: '세션당 유물 콘텐츠 수',
    accent: 'gold' as const,
  },
  {
    value: '4개',
    label: 'Tactile Layers / Heritage',
    subLabel: '유물당 촉각 레이어 수',
    accent: 'jade' as const,
  },
];

/* ─── Props ─── */

interface Props {
  onStart: () => void;
  onMuseum: () => void;
}

/* ─── Component ─── */

export function MuseumsSection({ onStart, onMuseum }: Props) {
  return (
    <section className={styles.section} aria-labelledby="museums-heading">

      {/* ── Texture overlay ── */}
      <div className={styles.texture} aria-hidden="true" />

      {/* ── Section Header ── */}
      <div className={styles.headerGroup}>
        <p className={styles.eyebrow} id="museums-heading">
          FOR MUSEUMS &amp; HERITAGE INSTITUTIONS
        </p>
        <p className={styles.eyebrowKr}>기관 담당자를 위한 솔루션</p>
        <div className={styles.headerRule} aria-hidden="true" />
      </div>

      {/* ── Problem Statement Card ── */}
      <div className={styles.problemCard} role="region" aria-label="The Challenge">
        <div className={styles.problemIcon} aria-hidden="true">
          <TactileProhibitionIcon />
        </div>
        <div className={styles.problemBody}>
          <p className={styles.problemLabel}>THE CHALLENGE</p>
          <h2 className={styles.problemHeadline}>원본 유물은 만질 수 없습니다</h2>
          <p className={styles.problemSubline}>Visitors cannot touch original artifacts</p>
          <div className={styles.problemStat}>
            <span className={styles.problemStatNum}>15%+</span>
            <span className={styles.problemStatText}>
              전 세계 박물관 관람객의 15% 이상이 시각장애 또는 저시력
            </span>
          </div>
        </div>
      </div>

      {/* ── Solution Grid ── */}
      <div className={styles.solutionGroup} role="region" aria-label="How Dot Heritage solves this">
        <p className={styles.solutionLabel}>HOW DOT HERITAGE + DOT PAD SOLVES THIS</p>
        <div className={styles.solutionGrid}>
          {SOLUTION_COLUMNS.map((col) => (
            <div
              key={col.heading}
              className={`${styles.solutionCol} ${styles[`solutionCol--${col.accent}`]}`}
            >
              <div className={styles.solutionIconWrap} aria-hidden="true">
                {col.icon}
              </div>
              <h3 className={styles.solutionHeading}>{col.heading}</h3>
              <p className={styles.solutionBody}>{col.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Use Cases ── */}
      <div className={styles.useCasesGroup} role="region" aria-label="Use cases">
        <p className={styles.useCasesLabel}>DEPLOYMENT SCENARIOS</p>
        <div className={styles.useCasesRow}>
          {USE_CASES.map((uc) => (
            <div
              key={uc.title}
              className={`${styles.useCaseCard} ${styles[`useCaseCard--${uc.badgeAccent}`]}`}
              aria-label={`${uc.label}: ${uc.title}`}
            >
              <div className={styles.useCaseIconWrap} aria-hidden="true">
                {uc.icon}
              </div>
              <div className={styles.useCaseContent}>
                <div className={styles.useCaseTop}>
                  <span className={`${styles.useCaseBadge} ${styles[`useCaseBadge--${uc.badgeAccent}`]}`}>
                    {uc.badge}
                  </span>
                </div>
                <p className={styles.useCaseTitle}>{uc.title}</p>
                <p className={styles.useCaseSubtitle}>{uc.label}</p>
                <p className={styles.useCaseDesc}>{uc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Impact Metrics ── */}
      <div className={styles.metricsGroup} role="region" aria-label="Impact metrics">
        <div className={styles.metricsRow}>
          {IMPACT_METRICS.map((m) => (
            <div
              key={m.value}
              className={`${styles.metricItem} ${styles[`metricItem--${m.accent}`]}`}
            >
              <span className={styles.metricValue}>{m.value}</span>
              <span className={styles.metricLabel}>{m.label}</span>
              <span className={styles.metricSub}>{m.subLabel}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className={styles.ctaGroup}>
        <button
          className={styles.ctaPrimary}
          onClick={onMuseum}
          aria-label="기관 도입 문의"
        >
          기관 도입 문의
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          className={styles.ctaSecondary}
          onClick={onStart}
          aria-label="체험 시작하기"
        >
          체험 시작하기
        </button>
      </div>

    </section>
  );
}
