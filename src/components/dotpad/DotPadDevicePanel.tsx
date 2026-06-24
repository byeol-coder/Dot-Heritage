import { useState, useCallback } from 'react';
import type { DotMatrix, TactileLayerType } from '../../types/heritage';
import { DotPadGrid } from './DotPadGrid';
import styles from './DotPadDevicePanel.module.css';

type SendState = 'idle' | 'sending' | 'sent';

interface Props {
  matrix: DotMatrix;
  brailleText?: string[];
  scanning?: boolean;
  currentLayer?: TactileLayerType;
  onLayerChange?: (layer: TactileLayerType) => void;
  heritageName?: string;
  slideLabel?: string;
  autoSync?: boolean;
  onAutoSyncChange?: (val: boolean) => void;
}

const LAYER_TABS: { key: TactileLayerType; label: string }[] = [
  { key: 'silhouette', label: 'OUTLINE' },
  { key: 'structure',  label: 'STRUCTURE' },
  { key: 'detail',     label: 'DETAIL' },
  { key: 'focus',      label: 'FOCUS' },
];

export function DotPadDevicePanel({
  matrix,
  brailleText = [],
  scanning = false,
  currentLayer = 'silhouette',
  onLayerChange,
  heritageName,
  slideLabel,
  autoSync = false,
  onAutoSyncChange,
}: Props) {
  const [connected, setConnected] = useState(false);
  const [sendState, setSendState] = useState<SendState>('idle');
  const [animating, setAnimating] = useState(false);
  const [internalAutoSync, setInternalAutoSync] = useState(autoSync);

  const handleLayerChange = useCallback((layer: TactileLayerType) => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 700);
    onLayerChange?.(layer);
  }, [onLayerChange]);

  const handleSend = useCallback(() => {
    if (!connected || sendState !== 'idle') return;
    setSendState('sending');
    setTimeout(() => {
      setSendState('sent');
      setTimeout(() => setSendState('idle'), 2200);
    }, 1400);
  }, [connected, sendState]);

  const handleAutoSyncToggle = useCallback(() => {
    const next = !internalAutoSync;
    setInternalAutoSync(next);
    onAutoSyncChange?.(next);
  }, [internalAutoSync, onAutoSyncChange]);

  const activeAutoSync = onAutoSyncChange !== undefined ? autoSync : internalAutoSync;

  const layerLabel = LAYER_TABS.find(t => t.key === currentLayer)?.label ?? 'OUTLINE';

  return (
    <div
      className={`${styles.panel} ${connected ? styles.panelConnected : ''}`}
      role="region"
      aria-label="Dot Pad Device Panel"
    >
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.deviceId}>
          <span className={styles.deviceIdLabel}>DOT PAD</span>
          <span className={styles.deviceIdModel}>Pro 24</span>
        </div>
        <button
          className={`${styles.connectionToggle} ${connected ? styles.connectionToggleOn : styles.connectionToggleOff}`}
          onClick={() => setConnected(v => !v)}
          aria-pressed={connected}
          aria-label={connected ? 'Disconnect from Dot Pad' : 'Connect to Dot Pad'}
        >
          <span className={styles.connectionIndicator} aria-hidden="true" />
          <span>{connected ? 'CONNECTED' : 'DISCONNECTED'}</span>
        </button>
      </div>

      {/* Now outputting bar */}
      <div className={`${styles.outputBar} ${connected ? styles.outputBarActive : ''}`}>
        <span className={styles.outputLabel}>NOW OUTPUTTING</span>
        {connected && (heritageName || slideLabel) ? (
          <span className={styles.outputValue}>
            {heritageName && <span className={styles.outputHeritage}>{heritageName}</span>}
            {heritageName && <span className={styles.outputSep}> — </span>}
            <span className={styles.outputLayer}>{layerLabel}</span>
          </span>
        ) : (
          <span className={styles.outputIdle}>—</span>
        )}
      </div>

      {/* Layer tabs */}
      <div className={styles.layerTabs} role="group" aria-label="Tactile layer selection">
        {LAYER_TABS.map(tab => (
          <button
            key={tab.key}
            className={`${styles.layerTab} ${currentLayer === tab.key ? styles.layerTabActive : ''}`}
            onClick={() => handleLayerChange(tab.key)}
            aria-pressed={currentLayer === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid display */}
      <div className={styles.displayFrame}>
        <div className={styles.displayInner}>
          <DotPadGrid matrix={matrix} animating={animating} scanning={scanning} />
        </div>
        <div className={styles.displayOverlay} aria-hidden="true">
          <span className={styles.displayCornerTL} />
          <span className={styles.displayCornerTR} />
          <span className={styles.displayCornerBL} />
          <span className={styles.displayCornerBR} />
        </div>
      </div>

      {/* Specs row */}
      <div className={styles.specsRow} aria-label="Display specifications">
        <span className={styles.specItem}>60 × 40</span>
        <span className={styles.specDot} aria-hidden="true">·</span>
        <span className={styles.specItem}>2,400 cells</span>
        <span className={styles.specDot} aria-hidden="true">·</span>
        <span className={styles.specItem}>8-pin Braille</span>
        {scanning && (
          <span className={styles.specScanning} aria-live="polite">SCANNING</span>
        )}
      </div>

      {/* Controls row */}
      <div className={styles.controlsRow}>
        {/* Send button */}
        <button
          className={`${styles.sendBtn} ${sendState === 'sending' ? styles.sendBtnSending : ''} ${sendState === 'sent' ? styles.sendBtnSent : ''} ${!connected ? styles.sendBtnDisabled : ''}`}
          onClick={handleSend}
          disabled={!connected || sendState !== 'idle'}
          aria-live="polite"
          aria-label={
            sendState === 'sending' ? 'Sending to Dot Pad' :
            sendState === 'sent'    ? 'Sent successfully' :
            'Send to Dot Pad'
          }
        >
          {sendState === 'idle'    && <><span className={styles.sendBtnIcon} aria-hidden="true">▶</span> SEND TO DOT PAD</>}
          {sendState === 'sending' && <><span className={styles.sendingSpinner} aria-hidden="true" /> SENDING...</>}
          {sendState === 'sent'    && <><span aria-hidden="true">✓</span> SENT</>}
        </button>

        {/* Auto sync toggle */}
        <div className={styles.autoSyncControl}>
          <span className={styles.autoSyncLabel}>AUTO SYNC</span>
          <button
            className={`${styles.toggleSwitch} ${activeAutoSync ? styles.toggleSwitchOn : ''}`}
            onClick={handleAutoSyncToggle}
            role="switch"
            aria-checked={activeAutoSync}
            aria-label="Auto sync toggle"
          >
            <span className={styles.toggleThumb} />
          </button>
        </div>
      </div>

      {/* Braille preview */}
      {brailleText.length > 0 && (
        <div className={styles.brailleSection} aria-label="Braille text preview">
          <div className={styles.brailleHeader}>
            <span className={styles.brailleIcon} aria-hidden="true">⠿</span>
            <span className={styles.brailleTitle}>BRAILLE LINE</span>
          </div>
          <div className={styles.brailleLines}>
            {brailleText.slice(0, 3).map((line, i) => (
              <div key={i} className={styles.brailleLine}>{line}</div>
            ))}
            {brailleText.length > 3 && (
              <div className={styles.brailleMore}>+{brailleText.length - 3} more lines</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
