import { useState } from 'react';
import styles from './DotPadStatus.module.css';

type ConnectionState = 'connected' | 'demo' | 'disconnected';

export function DotPadStatus() {
  const [state] = useState<ConnectionState>('demo');
  const [showTooltip, setShowTooltip] = useState(false);

  const labels: Record<ConnectionState, string> = {
    connected: 'CONNECTED',
    demo: 'DEMO',
    disconnected: 'OFFLINE',
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.chip} ${styles[state]}`}
        onClick={() => setShowTooltip(v => !v)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onBlur={() => setShowTooltip(false)}
        aria-expanded={showTooltip}
        aria-label={`Dot Pad 연결 상태: ${labels[state]}`}
        type="button"
      >
        <span className={styles.dot} aria-hidden="true" />
        <span>{labels[state]}</span>
      </button>

      {showTooltip && (
        <div className={styles.tooltip} role="tooltip">
          <strong className={styles.tooltipTitle}>Dot Pad 60</strong>
          <p className={styles.tooltipDesc}>
            {state === 'demo'
              ? '현재 시뮬레이션 모드입니다. 실제 Dot Pad 기기를 연결하면 촉각그래픽이 물리적으로 출력됩니다.'
              : state === 'connected'
              ? 'Dot Pad가 연결되어 있습니다. 촉각그래픽이 실시간으로 출력됩니다.'
              : 'Dot Pad가 연결되어 있지 않습니다.'}
          </p>
          <a
            href="https://www.dotincorp.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.tooltipLink}
          >
            Dot Inc. 알아보기 →
          </a>
        </div>
      )}
    </div>
  );
}
