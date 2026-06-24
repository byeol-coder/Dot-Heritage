import { useState } from 'react';
import { useDotPad } from '../../engine/dotpad/useDotPad';
import styles from './DotPadStatus.module.css';

/**
 * Live Dot Pad connection chip. Click to connect / disconnect a real device
 * over Web Bluetooth; falls back to a "DEMO" label when no device is attached.
 */
export function DotPadStatus() {
  const { status, deviceName, lastError, isConnected, isBusy, supported, toggle } = useDotPad();
  const [showTooltip, setShowTooltip] = useState(false);

  // Map adapter status → chip appearance. Disconnected shows DEMO (preview still works).
  const visual =
    isConnected ? 'connected'
    : isBusy ? 'connecting'
    : !supported ? 'disconnected'
    : 'demo';

  const label =
    isConnected ? 'CONNECTED'
    : status === 'searching' ? 'SEARCHING…'
    : status === 'connecting' ? 'CONNECTING…'
    : !supported ? 'OFFLINE'
    : 'DEMO';

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.chip} ${styles[visual] ?? styles.demo}`}
        onClick={toggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label={
          isConnected
            ? `Dot Pad 연결됨${deviceName ? ` (${deviceName})` : ''}. 클릭하면 연결 해제`
            : 'Dot Pad 연결하기'
        }
        disabled={isBusy}
        type="button"
      >
        <span className={styles.dot} aria-hidden="true" />
        <span>{label}</span>
      </button>

      {showTooltip && (
        <div className={styles.tooltip} role="tooltip">
          <strong className={styles.tooltipTitle}>Dot Pad 60</strong>
          <p className={styles.tooltipDesc}>
            {!supported
              ? 'Web Bluetooth를 지원하지 않는 환경입니다. 데스크톱 Chrome 또는 Edge(HTTPS)에서 실기기를 연결할 수 있습니다.'
              : isConnected
              ? `Dot Pad가 연결되어 있습니다${deviceName ? ` · ${deviceName}` : ''}. 촉각그래픽이 실시간으로 출력됩니다. 클릭하면 연결을 해제합니다.`
              : isBusy
              ? 'Dot Pad를 검색·연결하는 중입니다…'
              : '미리보기(시뮬레이션) 모드입니다. 클릭하여 실제 Dot Pad 기기를 연결하면 촉각그래픽이 물리적으로 출력됩니다.'}
          </p>
          {lastError && <p className={styles.tooltipError}>{lastError}</p>}
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
