import type { HeritageScene, HeritageViewType } from '../../types/tactileSync';
import { useI18n } from '../../i18n/i18n';
import styles from './HeritageViewControls.module.css';

interface Props {
  scene: HeritageScene;
  view: HeritageViewType;
  selectedHotspot: string | null;
  onView: (v: 'front' | 'side' | 'detail') => void;
  onSelectHotspot: (id: string | null) => void;
  onPrevHotspot: () => void;
  onNextHotspot: () => void;
  onReread: () => void;
  onResend: () => void;
  onPrevHeritage: () => void;
  onNextHeritage: () => void;
}

export function HeritageViewControls({
  scene, view, selectedHotspot,
  onView, onSelectHotspot, onPrevHotspot, onNextHotspot,
  onReread, onResend, onPrevHeritage, onNextHeritage,
}: Props) {
  const { t, tl } = useI18n();
  return (
    <div className={styles.panel} role="group" aria-label={t('explore.syncMode')}>
      <div className={styles.row}>
        <span className={styles.groupLabel}>{t('controls.view')}</span>
        {(['front', 'side', 'detail'] as const).map((v) => (
          <button
            key={v}
            className={`${styles.btn} ${view === v && !selectedHotspot ? styles.active : ''}`}
            onClick={() => onView(v)}
            aria-pressed={view === v && !selectedHotspot}
          >
            {t(`view.${v}`)}
          </button>
        ))}
        <span className={styles.currentView} aria-live="polite">
          {t('controls.current')}: {selectedHotspot ? t('view.focus') : t(`view.${view}`)}
        </span>
      </div>

      <div className={styles.row}>
        <span className={styles.groupLabel}>{t('controls.point')}</span>
        <button className={styles.btn} onClick={onPrevHotspot} aria-label={t('controls.prev')}>{t('controls.prev')}</button>
        <button className={styles.btn} onClick={onNextHotspot} aria-label={t('controls.next')}>{t('controls.next')}</button>
        {scene.hotspots.map((h) => (
          <button
            key={h.id}
            className={`${styles.chip} ${selectedHotspot === h.id ? styles.active : ''}`}
            onClick={() => onSelectHotspot(selectedHotspot === h.id ? null : h.id)}
            aria-pressed={selectedHotspot === h.id}
          >
            {tl(h.label)}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <button className={styles.btn} onClick={onReread}>{t('controls.reread')}</button>
        <button className={styles.btn} onClick={onResend}>{t('controls.resend')}</button>
        <span className={styles.spacer} />
        <button className={styles.btn} onClick={onPrevHeritage}>{t('controls.prevHeritage')}</button>
        <button className={styles.btn} onClick={onNextHeritage}>{t('controls.nextHeritage')}</button>
      </div>

      <div className={styles.keyhint}>{t('controls.keyhint')}</div>
    </div>
  );
}
