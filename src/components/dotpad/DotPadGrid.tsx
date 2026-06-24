import { useRef, useEffect, useState, useCallback } from 'react';
import type { DotMatrix } from '../../types/heritage';
import styles from './DotPadGrid.module.css';

interface Props {
  matrix: DotMatrix;
  animating?: boolean;
  scanning?: boolean;         // NEW: triggers scan-in animation
  highlightRegion?: {         // NEW: highlights a rectangular region
    x1: number; y1: number;
    x2: number; y2: number;
  };
}

export function DotPadGrid({ matrix, animating, scanning, highlightRegion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealedRows, setRevealedRows] = useState<number>(40);
  const animFrameRef = useRef<number | null>(null);

  const drawMatrix = useCallback((maxRow: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 60, H = 40;
    const cellW = canvas.width / W;
    const cellH = canvas.height / H;
    const dotR = Math.min(cellW, cellH) * 0.33;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#050F1A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    for (let r = 0; r <= H; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellH);
      ctx.lineTo(canvas.width, r * cellH);
      ctx.stroke();
    }

    for (let row = 0; row < Math.min(maxRow, H); row++) {
      for (let col = 0; col < W; col++) {
        const cell = matrix.cells[row]?.[col] ?? 0;
        if (cell === 0) {
          // Draw empty dot position as very subtle
          const x = col * cellW + cellW / 2;
          const y = row * cellH + cellH / 2;
          ctx.fillStyle = 'rgba(255,255,255,0.025)';
          ctx.beginPath();
          ctx.arc(x, y, dotR * 0.5, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        const x = col * cellW + cellW / 2;
        const y = row * cellH + cellH / 2;

        // Check if in highlight region
        const isHighlighted = highlightRegion
          ? col >= highlightRegion.x1 && col <= highlightRegion.x2
            && row >= highlightRegion.y1 && row <= highlightRegion.y2
          : false;

        let alpha = 1;
        if (scanning && maxRow < H) {
          // Fade in effect for newly revealed row
          const rowAge = maxRow - row;
          alpha = Math.min(1, rowAge * 0.15 + 0.4);
        }

        // Base color
        if (cell === 1) {
          ctx.fillStyle = isHighlighted
            ? `rgba(111,175,159,${0.5 * alpha})`
            : `rgba(200,165,106,${0.28 * alpha})`;
        } else if (cell === 2) {
          ctx.fillStyle = isHighlighted
            ? `rgba(111,175,159,${0.85 * alpha})`
            : `rgba(200,165,106,${0.68 * alpha})`;
        } else {
          ctx.fillStyle = isHighlighted
            ? `rgba(111,175,159,${alpha})`
            : `rgba(200,165,106,${alpha})`;
        }

        const r = isHighlighted ? dotR * 1.15 : dotR;

        // Outer glow for strong dots
        if (cell === 3) {
          ctx.shadowColor = isHighlighted ? 'rgba(111,175,159,0.6)' : 'rgba(200,165,106,0.5)';
          ctx.shadowBlur = 3;
        }

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }, [matrix, highlightRegion, scanning]);

  // Scan animation
  useEffect(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (scanning) {
      setRevealedRows(0);
      let row = 0;
      const totalRows = 40;
      const rowDelay = 14; // ms per row
      let lastTime = 0;

      const step = (time: number) => {
        if (time - lastTime > rowDelay) {
          row = Math.min(row + 1, totalRows);
          setRevealedRows(row);
          lastTime = time;
        }
        if (row < totalRows) {
          animFrameRef.current = requestAnimationFrame(step);
        }
      };
      animFrameRef.current = requestAnimationFrame(step);
    } else {
      setRevealedRows(40);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [scanning, matrix]);

  useEffect(() => {
    drawMatrix(revealedRows);
  }, [drawMatrix, revealedRows]);

  return (
    <div className={`${styles.wrapper} ${animating ? styles.animating : ''}`}>
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className={styles.canvas}
        aria-label="Dot Pad 60x40 tactile graphic display"
        role="img"
      />
      {scanning && revealedRows < 40 && (
        <div className={styles.scanLine} style={{ top: `${(revealedRows / 40) * 100}%` }} aria-hidden="true" />
      )}
    </div>
  );
}
