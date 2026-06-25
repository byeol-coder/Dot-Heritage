import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../components/brand/Logo';
import { DotPadGrid } from '../components/dotpad/DotPadGrid';
import { DotPadStatus } from '../components/ui/DotPadStatus';
import { LanguageToggle } from '../i18n/LanguageToggle';
import { useDotPad } from '../engine/dotpad/useDotPad';
import { useI18n } from '../i18n/i18n';
import { imageToMatrix, countRaisedInMatrix } from '../engine/tactile/imageToMatrix';
import { createEmptyMatrix } from '../engine/dotpad/matrixUtils';
import type { DotMatrix } from '../types/heritage';
import styles from './TactileStudio.module.css';

const BASE = import.meta.env.BASE_URL;

interface Preset {
  id: string;
  ko: string;
  en: string;
  url: string;
  threshold: number;
  invert: boolean;
}

const PRESETS: Preset[] = [
  { id: 'cheomseongdae', ko: '첨성대',     en: 'Cheomseongdae',   url: `${BASE}assets/heritage/cheomseongdae.jpg`, threshold: 175, invert: false },
  { id: 'moon-jar',      ko: '달항아리',   en: 'Moon Jar',         url: `${BASE}assets/heritage/moon-jar.jpg`,      threshold: 130, invert: true  },
  { id: 'roof-tile',     ko: '수막새',     en: 'Roof Tile',        url: `${BASE}assets/heritage/roof-tile.jpg`,     threshold: 160, invert: false },
  { id: 'palace',        ko: '전통 전각',  en: 'Palace Hall',      url: `${BASE}assets/heritage/palace.jpg`,        threshold: 155, invert: false },
];

interface Props {
  onBack: () => void;
}

export function TactileStudio({ onBack }: Props) {
  const { t, lang } = useI18n();
  const { isConnected, sendMatrix } = useDotPad();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef  = useRef<HTMLImageElement | null>(null);
  const dropRef   = useRef<HTMLDivElement>(null);
  const lastSentRef = useRef<string | null>(null);

  const [matrix,    setMatrix]    = useState<DotMatrix>(createEmptyMatrix());
  const [scanning,  setScanning]  = useState(false);
  const [threshold, setThreshold] = useState(128);
  const [invert,    setInvert]    = useState(false);
  const [contain,   setContain]   = useState(true);
  const [autoSend,  setAutoSend]  = useState(true);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [dragOver,  setDragOver]  = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [fileName,  setFileName]  = useState<string | null>(null);

  // Re-render whenever controls change (image already loaded).
  const rerender = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const m = imageToMatrix(canvas, img, { threshold, invert, contain });
    setMatrix(m);

    // Trigger scanning animation
    setScanning(true);
    window.setTimeout(() => setScanning(false), 700);

    // Auto-send to DotPad (dedupe by dot count change — cheap enough proxy)
    if (autoSend && isConnected) {
      const key = `${threshold}:${invert}:${contain}:${m.cells.flat().join('')}`;
      if (key !== lastSentRef.current) {
        lastSentRef.current = key;
        sendMatrix(m);
      }
    }
  }, [threshold, invert, contain, autoSend, isConnected, sendMatrix]);

  useEffect(() => { rerender(); }, [rerender]);

  const loadImage = useCallback((src: string, name?: string) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => {
      imageRef.current = im;
      setPreviewSrc(src);
      setFileName(name ?? null);
      rerender();
    };
    im.src = src;
  }, [rerender]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setActivePreset(null);
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      imageRef.current = im;
      setPreviewSrc(url);
      setFileName(file.name);
      rerender();
    };
    im.src = url;
  }, [rerender]);

  const handlePreset = useCallback((p: Preset) => {
    setActivePreset(p.id);
    setThreshold(p.threshold);
    setInvert(p.invert);
    loadImage(p.url, lang === 'ko' ? p.ko : p.en);
  }, [loadImage, lang]);

  const handleSendNow = useCallback(() => {
    lastSentRef.current = null; // force resend
    sendMatrix(matrix);
    setScanning(true);
    window.setTimeout(() => setScanning(false), 700);
  }, [matrix, sendMatrix]);

  const raisedCount = countRaisedInMatrix(matrix);

  return (
    <div className={styles.page}>
      {/* Hidden 60×40 canvas used for pixel processing */}
      <canvas ref={canvasRef} width={60} height={40} style={{ display: 'none' }} />

      {/* Header */}
      <header className={styles.header}>
        <button onClick={onBack} className={styles.backBtn} aria-label={t('common.back')}>
          {t('common.back')}
        </button>
        <Logo size="sm" variant="icon" />
        <div className={styles.titleBlock}>
          <span className={styles.title}>{t('studio.title')}</span>
          <span className={styles.subtitle}>{t('studio.subtitle')}</span>
        </div>
        <span className={styles.badge}>{t('studio.badge')}</span>
        <LanguageToggle />
        <DotPadStatus />
      </header>

      <main className={styles.main}>
        {/* ── Left column: upload + presets + controls ── */}
        <section className={styles.inputCol}>

          {/* Heritage presets */}
          <div className={styles.presetBlock}>
            <p className={styles.sectionLabel}>{t('studio.presets')}</p>
            <div className={styles.presetGrid}>
              {PRESETS.map(p => (
                <button
                  key={p.id}
                  className={`${styles.presetBtn} ${activePreset === p.id ? styles.presetActive : ''}`}
                  onClick={() => handlePreset(p)}
                >
                  <img src={p.url} alt="" className={styles.presetThumb} />
                  <span className={styles.presetName}>{lang === 'ko' ? p.ko : p.en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          <div
            ref={dropRef}
            className={`${styles.dropZone} ${dragOver ? styles.dropZoneOver : ''}`}
            onClick={() => document.getElementById('studio-file')?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragEnter={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            role="button"
            tabIndex={0}
            aria-label={t('studio.dropLabel')}
            onKeyDown={e => e.key === 'Enter' && document.getElementById('studio-file')?.click()}
          >
            <span className={styles.dropIcon} aria-hidden="true">⬡</span>
            <span className={styles.dropText}>{t('studio.dropText')}</span>
            <span className={styles.dropHint}>{t('studio.dropHint')}</span>
            {fileName && <span className={styles.fileName}>{fileName}</span>}
          </div>
          <input
            id="studio-file"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />

          {/* Controls */}
          <div className={styles.controls}>
            <label className={styles.sliderLabel}>
              <span>{t('studio.threshold')} <strong>{threshold}</strong></span>
              <input
                type="range" min={0} max={255} value={threshold}
                className={styles.slider}
                onChange={e => setThreshold(+e.target.value)}
              />
            </label>

            <div className={styles.toggleRow}>
              <label className={styles.toggle}>
                <input type="checkbox" checked={invert} onChange={e => setInvert(e.target.checked)} />
                <span>{t('studio.invert')}</span>
              </label>
              <label className={styles.toggle}>
                <input type="checkbox" checked={contain} onChange={e => setContain(e.target.checked)} />
                <span>{t('studio.contain')}</span>
              </label>
              <label className={styles.toggle}>
                <input type="checkbox" checked={autoSend} onChange={e => setAutoSend(e.target.checked)} />
                <span>{t('studio.autoSend')}</span>
              </label>
            </div>
          </div>

          {/* Original image preview */}
          {previewSrc && (
            <div className={styles.srcPreview}>
              <p className={styles.sectionLabel}>{t('studio.original')}</p>
              <img src={previewSrc} alt="" className={styles.srcImg} />
            </div>
          )}
        </section>

        {/* ── Right column: tactile preview + dotpad ── */}
        <section className={styles.outputCol}>
          <div className={styles.gridCard}>
            <div className={styles.gridHeader}>
              <span className={styles.gridTitle}>{t('studio.tactilePreview')}</span>
              <span className={styles.dotCount}>
                {raisedCount.toLocaleString()} / 2,400 {t('studio.dots')}
              </span>
            </div>

            <motion.div
              key={raisedCount}
              className={styles.gridWrap}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <DotPadGrid matrix={matrix} scanning={scanning} animating={false} />
            </motion.div>

            <div className={styles.gridFooter}>
              <span>60 × 40 · 2,400 {t('studio.cells')}</span>
              {isConnected ? (
                <button className={styles.sendBtn} onClick={handleSendNow}>
                  ▶ {t('studio.sendNow')}
                </button>
              ) : (
                <span className={styles.demoNote}>{t('studio.demoNote')}</span>
              )}
            </div>
          </div>

          <div className={styles.infoCard}>
            <p className={styles.infoLine}>⬡ {t('studio.info1')}</p>
            <p className={styles.infoLine}>◈ {t('studio.info2')}</p>
            <p className={styles.infoLine}>⋮⋮ {t('studio.info3')}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
