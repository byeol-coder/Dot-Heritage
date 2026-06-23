import { useEffect, useRef } from 'react';
import type { DotMatrix } from '../../types/heritage';
import styles from './DotPadGrid.module.css';

interface DotPadGridProps {
  matrix: DotMatrix;
  animating?: boolean;

}

export function DotPadGrid({ matrix, animating = false }: DotPadGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 60, H = 40;
    const cellW = canvas.width / W;
    const cellH = canvas.height / H;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < H; row++) {
      for (let col = 0; col < W; col++) {
        const v = matrix.cells[row]?.[col] ?? 0;
        if (v === 0) continue;
        const x = col * cellW + cellW / 2;
        const y = row * cellH + cellH / 2;
        const r = v === 3 ? cellW * 0.38 : v === 2 ? cellW * 0.3 : cellW * 0.2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        if (v === 3) {
          ctx.fillStyle = '#E6C987';
        } else if (v === 2) {
          ctx.fillStyle = '#C8A56A';
        } else {
          ctx.fillStyle = 'rgba(200,165,106,0.35)';
        }
        ctx.fill();
      }
    }
  }, [matrix]);

  return (
    <div className={`${styles.wrapper} ${animating ? styles.animating : ''}`}>
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className={styles.canvas}
        aria-label="Dot Pad tactile graphic preview, 60 by 40 grid"
        role="img"
      />
      <div className={styles.label}>60 × 40 DOT PAD</div>
    </div>
  );
}
