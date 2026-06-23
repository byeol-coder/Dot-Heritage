import { useState, useEffect, useRef } from 'react';
import type { DotMatrix } from '../../types/heritage';
import { DotPadGrid } from './DotPadGrid';
import { DotPadStatus } from '../ui/DotPadStatus';
import styles from './DotPadOutputPanel.module.css';

interface Props {
  matrix: DotMatrix;

  brailleText?: string[];
}

export function DotPadOutputPanel({ matrix, brailleText }: Props) {
  const [animating, setAnimating] = useState(false);
  const prevMatrix = useRef<DotMatrix | null>(null);

  useEffect(() => {
    if (prevMatrix.current !== null) {
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 1200);
      return () => clearTimeout(t);
    }
    prevMatrix.current = matrix;
  }, [matrix]);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.dot}>⬡</span>
        <span className={styles.headerText}>DOT PAD OUTPUT PREVIEW</span>
        <DotPadStatus />
      </div>
      <DotPadGrid matrix={matrix} animating={animating} />
      {brailleText && brailleText.length > 0 && (
        <div className={styles.braille} aria-label="Braille summary">
          <div className={styles.brailleLabel}>BRAILLE SUMMARY</div>
          {brailleText.map((line, i) => (
            <div key={i} className={styles.brailleLine}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
