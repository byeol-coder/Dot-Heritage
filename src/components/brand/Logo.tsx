import styles from './Logo.module.css';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

export function Logo({ size = 'md', variant = 'full' }: LogoProps) {
  const px = size === 'sm' ? 32 : size === 'lg' ? 64 : 44;
  return (
    <div className={`${styles.logo} ${styles[size]}`} aria-label="Dot Heritage">
      <svg width={px} height={px} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Arch frame */}
        <path d="M12 70 L12 38 Q12 14 40 14 Q68 14 68 38 L68 70 Z" stroke="#C8A56A" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
        {/* Roof line */}
        <path d="M20 38 Q40 26 60 38" stroke="#C8A56A" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <line x1="40" y1="26" x2="40" y2="36" stroke="#C8A56A" strokeWidth="2" strokeLinecap="round"/>
        {/* Dots grid 3x3 */}
        {[0,1,2].map(row => [0,1,2].map(col => (
          <circle key={`${row}-${col}`}
            cx={32 + col * 8} cy={46 + row * 6}
            r={col === 2 && row === 0 ? 3.5 : 2.5}
            fill={col === 2 && row === 0 ? '#6FAF9F' : '#C8A56A'}
          />
        )))}
        {/* Wave pattern bottom */}
        <path d="M14 66 Q20 62 26 66 Q32 70 38 66 Q44 62 50 66 Q56 70 62 66 Q68 62 66 66" stroke="#C8A56A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
      {variant === 'full' && (
        <div className={styles.text}>
          <span className={styles.name}>Dot Heritage</span>
          <span className={styles.tagline}>HERITAGE. ACCESSIBLE TO ALL.</span>
        </div>
      )}
    </div>
  );
}
