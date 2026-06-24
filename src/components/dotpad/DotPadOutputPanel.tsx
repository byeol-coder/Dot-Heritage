import { useState, useEffect, useRef } from 'react';
import type { DotMatrix } from '../../types/heritage';
import { DotPadGrid } from './DotPadGrid';
import { DotPadStatus } from '../ui/DotPadStatus';
import { useDotPad } from '../../engine/dotpad/useDotPad';
import { dotMatrixToHex } from '../../engine/dotpad/dotMatrixToHex';
import { useI18n } from '../../i18n/i18n';
import styles from './DotPadOutputPanel.module.css';

export type TactileLayerType = 'silhouette' | 'structure' | 'detail' | 'focus';

const LAYER_LABELS: Record<TactileLayerType, { ko: string; en: string; desc: string }> = {
  silhouette: { ko: '전체 윤곽', en: 'Silhouette', desc: '유물의 전체 외곽 형태' },
  structure:  { ko: '구조',     en: 'Structure',  desc: '주요 구조와 부분 구분' },
  detail:     { ko: '문양',     en: 'Detail',     desc: '세부 문양과 장식' },
  focus:      { ko: '핵심',     en: 'Focus',      desc: '해설 핵심 포인트' },
};

interface Props {
  matrix: DotMatrix;
  brailleText?: string[];
  scanning?: boolean;
  currentLayer?: TactileLayerType;
  onLayerChange?: (layer: TactileLayerType) => void;
  showLayerControls?: boolean;
  heritageName?: string;
  slideLabel?: string;
}

export function DotPadOutputPanel({
  matrix,
  brailleText = [],
  scanning = false,
  currentLayer = 'silhouette',
  onLayerChange,
  showLayerControls = false,
  heritageName,
  slideLabel,
}: Props) {
  const [animating, setAnimating] = useState(false);
  const { isConnected, sendMatrix } = useDotPad();
  const { t } = useI18n();
  const lastSentHexRef = useRef<string | null>(null);

  // Auto-push the current frame to a connected device when content changes.
  // Dedupe by hex content so identical matrices (different object refs) don't
  // trigger redundant sends on every parent re-render.
  useEffect(() => {
    if (!isConnected) return;
    const hex = dotMatrixToHex(matrix);
    if (hex === lastSentHexRef.current) return;
    lastSentHexRef.current = hex;
    sendMatrix(matrix);
  }, [isConnected, matrix, sendMatrix]);

  const handleLayerChange = (layer: TactileLayerType) => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 800);
    onLayerChange?.(layer);
  };

  const layerInfo = LAYER_LABELS[currentLayer];

  return (
    <div className={styles.panel} role="region" aria-label={t('dotpad.preview')}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.deviceIcon} aria-hidden="true">⋮⋮</span>
          <span className={styles.title}>{t('dotpad.preview')}</span>
        </div>
        <DotPadStatus />
      </div>

      {/* Heritage label */}
      {(heritageName || slideLabel) && (
        <div className={styles.heritageLabel}>
          {heritageName && <span className={styles.heritageName}>{heritageName}</span>}
          {slideLabel && <span className={styles.slideLabel}>{slideLabel}</span>}
        </div>
      )}

      {/* Layer controls */}
      {showLayerControls && (
        <div className={styles.layerControls} role="group" aria-label="촉각 레이어 선택">
          {(Object.keys(LAYER_LABELS) as TactileLayerType[]).map((layer) => (
            <button
              key={layer}
              className={`${styles.layerBtn} ${currentLayer === layer ? styles.layerBtnActive : ''}`}
              onClick={() => handleLayerChange(layer)}
              aria-pressed={currentLayer === layer}
              title={LAYER_LABELS[layer].desc}
            >
              {LAYER_LABELS[layer].en}
            </button>
          ))}
        </div>
      )}

      {/* Dot grid */}
      <div className={styles.gridWrapper}>
        <DotPadGrid matrix={matrix} animating={animating} scanning={scanning} />

        {/* Layer label overlay */}
        <div className={styles.layerOverlay} aria-live="polite">
          <span className={styles.layerName}>{layerInfo.en.toUpperCase()}</span>
          <span className={styles.layerDesc}>{layerInfo.ko}</span>
        </div>
      </div>

      {/* Grid specs */}
      <div className={styles.specs}>
        <span className={styles.spec}>60 × 40</span>
        <span className={styles.specDot}>·</span>
        <span className={styles.spec}>{t('dotpad.cells')}</span>
        {scanning && <span className={styles.specScanning} aria-live="polite">{t('dotpad.scanning')}</span>}
        {isConnected && (
          <button
            type="button"
            className={styles.sendBtn}
            onClick={() => sendMatrix(matrix)}
            aria-label={t('dotpad.send')}
          >
            {t('dotpad.send')}
          </button>
        )}
      </div>

      {/* Braille section */}
      {brailleText.length > 0 && (
        <div className={styles.brailleSection} aria-label={t('dotpad.braille')}>
          <div className={styles.brailleHeader}>
            <span className={styles.brailleIcon} aria-hidden="true">⠿</span>
            <span className={styles.brailleTitle}>{t('dotpad.braille')}</span>
          </div>
          <div className={styles.brailleLines}>
            {brailleText.map((line, i) => (
              <div key={i} className={styles.brailleLine}>{line}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
