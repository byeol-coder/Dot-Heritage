import type { HeritageScene, HeritageViewType } from '../../types/tactileSync';
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

const VIEW_LABELS: Record<string, string> = {
  front: '정면', side: '측면', top: '윗면', detail: '디테일', focus: '핵심 포인트',
};

export function HeritageViewControls({
  scene, view, selectedHotspot,
  onView, onSelectHotspot, onPrevHotspot, onNextHotspot,
  onReread, onResend, onPrevHeritage, onNextHeritage,
}: Props) {
  return (
    <div className={styles.panel} role="group" aria-label="3D 탐색 조작">
      <div className={styles.row}>
        <span className={styles.groupLabel}>VIEW</span>
        {(['front', 'side', 'detail'] as const).map((v) => (
          <button
            key={v}
            className={`${styles.btn} ${view === v && !selectedHotspot ? styles.active : ''}`}
            onClick={() => onView(v)}
            aria-pressed={view === v && !selectedHotspot}
          >
            {VIEW_LABELS[v]}
          </button>
        ))}
        <span className={styles.currentView} aria-live="polite">
          현재: {selectedHotspot ? '핵심 포인트' : VIEW_LABELS[view]}
        </span>
      </div>

      <div className={styles.row}>
        <span className={styles.groupLabel}>POINT</span>
        <button className={styles.btn} onClick={onPrevHotspot} aria-label="이전 핵심 포인트">‹ 이전</button>
        <button className={styles.btn} onClick={onNextHotspot} aria-label="다음 핵심 포인트">다음 ›</button>
        {scene.hotspots.map((h) => (
          <button
            key={h.id}
            className={`${styles.chip} ${selectedHotspot === h.id ? styles.active : ''}`}
            onClick={() => onSelectHotspot(selectedHotspot === h.id ? null : h.id)}
            aria-pressed={selectedHotspot === h.id}
          >
            {h.label}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <button className={styles.btn} onClick={onReread} aria-label="현재 설명 다시 읽기">🔊 다시 읽기</button>
        <button className={styles.btn} onClick={onResend} aria-label="Dot Pad에 다시 전송">▶ 다시 전송</button>
        <span className={styles.spacer} />
        <button className={styles.btn} onClick={onPrevHeritage} aria-label="이전 문화유산">‹ 이전 유산</button>
        <button className={styles.btn} onClick={onNextHeritage} aria-label="다음 문화유산">다음 유산 ›</button>
      </div>

      <div className={styles.keyhint}>
        키보드 · 1 정면 2 측면 3 디테일 · [ ] 포인트 이동 · \ 해제 · R 다시 읽기 · S 재전송 · , . 유산 이동
      </div>
    </div>
  );
}
