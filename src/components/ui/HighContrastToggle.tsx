import { useState, useEffect } from 'react';
import styles from './HighContrastToggle.module.css';

export function HighContrastToggle() {
  const [on, setOn] = useState(() => localStorage.getItem('hc') === '1');

  useEffect(() => {
    document.body.classList.toggle('high-contrast', on);
    localStorage.setItem('hc', on ? '1' : '0');
  }, [on]);

  return (
    <button
      className={`${styles.btn} ${on ? styles.on : ''}`}
      onClick={() => setOn(v => !v)}
      aria-label={on ? 'Disable high contrast' : 'Enable high contrast'}
      aria-pressed={on}
      title="고대비 모드"
    >
      ◑
    </button>
  );
}
