import { useState, useCallback, useMemo } from 'react';
import { Logo } from '../components/brand/Logo';
import { DotPadStatus } from '../components/ui/DotPadStatus';
import { DotPadOutputPanel } from '../components/dotpad/DotPadOutputPanel';
import { HeritageSyncViewer } from '../components/heritage/HeritageSyncViewer';
import { HeritageViewControls } from '../components/heritage/HeritageViewControls';
import { useTactileSync } from '../hooks/useTactileSync';
import { useHotspotNavigation } from '../hooks/useHotspotNavigation';
import { heritageScenes } from '../data/heritageScenes';
import type { HeritageViewType } from '../types/tactileSync';
import styles from './Explore.module.css';

interface Props {
  initialSceneId?: string;
  onBack: () => void;
}

type StaticView = Exclude<HeritageViewType, 'focus'>;

export function Explore({ initialSceneId = 'moon-jar', onBack }: Props) {
  const startIdx = Math.max(0, heritageScenes.findIndex((s) => s.id === initialSceneId));
  const [sceneIdx, setSceneIdx] = useState(startIdx === -1 ? 0 : startIdx);
  const [view, setView] = useState<HeritageViewType>('front');
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  const scene = heritageScenes[sceneIdx];

  // Resolve the active tactile definition: hotspot wins, else the view mapping.
  const active = useMemo(() => {
    if (selectedHotspot) {
      const h = scene.hotspots.find((x) => x.id === selectedHotspot);
      if (h) {
        return { patternId: h.patternId, brailleText: h.brailleText, description: h.narration, narration: h.narration };
      }
    }
    const key: StaticView = (view === 'focus' ? 'front' : view) as StaticView;
    const def = scene.tactileViews[key] ?? scene.tactileViews.front!;
    return { patternId: def.patternId, brailleText: def.brailleText, description: def.description, narration: def.description };
  }, [scene, view, selectedHotspot]);

  const { pattern, isConnected, resend, reread } = useTactileSync({
    patternId: active.patternId,
    brailleText: active.brailleText,
    description: active.description,
    narration: active.narration,
    immediate: !!selectedHotspot, // hotspot selection sends instantly
  });

  const goScene = useCallback((dir: 1 | -1) => {
    setSceneIdx((i) => (i + dir + heritageScenes.length) % heritageScenes.length);
    setSelectedHotspot(null);
    setView('front');
  }, []);

  const handleViewTypeChange = useCallback((v: HeritageViewType) => {
    if (v !== 'focus') setView(v); // rotation-driven; hotspot focus is explicit
  }, []);

  const onPrevHeritage = useCallback(() => goScene(-1), [goScene]);
  const onNextHeritage = useCallback(() => goScene(1), [goScene]);

  useHotspotNavigation({
    scene,
    selectedHotspot,
    setSelectedHotspot,
    setView: (v) => { setSelectedHotspot(null); setView(v); },
    onResend: resend,
    onReread: () => reread(active.description),
    onPrevHeritage,
    onNextHeritage,
  });

  const viewLabel = selectedHotspot
    ? scene.hotspots.find((h) => h.id === selectedHotspot)?.label ?? '핵심 포인트'
    : ({ front: '정면', side: '측면', top: '윗면', detail: '디테일', focus: '핵심 포인트' }[view]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={onBack} className={styles.backBtn} aria-label="뒤로">← Back</button>
        <Logo size="sm" variant="icon" />
        <div className={styles.titleBlock}>
          <span className={styles.title}>{scene.name}</span>
          <span className={styles.subtitle}>3D 촉각 동기 탐색 · See · Hear · Touch</span>
        </div>
        <span className={styles.modeBadge}>🔗 SYNC MODE</span>
        <DotPadStatus />
      </header>

      <main className={styles.main}>
        <section className={styles.viewerCol}>
          <div className={styles.viewerFrame}>
            <HeritageSyncViewer
              scene={scene}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={(id) => setSelectedHotspot(id)}
              onViewTypeChange={handleViewTypeChange}
            />
            <div className={styles.viewBadge} aria-live="polite">{viewLabel}</div>
            <div className={styles.dataCredit}>3D 데이터 출처 · 국가유산청 · 공공누리</div>
          </div>

          <HeritageViewControls
            scene={scene}
            view={view}
            selectedHotspot={selectedHotspot}
            onView={(v) => { setSelectedHotspot(null); setView(v); }}
            onSelectHotspot={setSelectedHotspot}
            onPrevHotspot={() => {
              const list = scene.hotspots;
              const idx = list.findIndex((h) => h.id === selectedHotspot);
              const next = idx === -1 ? list.length - 1 : (idx - 1 + list.length) % list.length;
              setSelectedHotspot(list[next].id);
            }}
            onNextHotspot={() => {
              const list = scene.hotspots;
              const idx = list.findIndex((h) => h.id === selectedHotspot);
              const next = idx === -1 ? 0 : (idx + 1) % list.length;
              setSelectedHotspot(list[next].id);
            }}
            onReread={() => reread(active.description)}
            onResend={resend}
            onPrevHeritage={onPrevHeritage}
            onNextHeritage={onNextHeritage}
          />

          <p className={styles.description} aria-live="polite">{active.description}</p>
        </section>

        <aside className={styles.dotpadCol}>
          <DotPadOutputPanel
            matrix={pattern.matrix}
            brailleText={[active.brailleText]}
            heritageName={scene.name}
            slideLabel={viewLabel}
          />
          <div className={styles.syncNote}>
            {isConnected
              ? '● 실기기 연결됨 — 화면 전환 시 Dot Pad로 자동 전송됩니다.'
              : '○ Demo 모드 — 상단 상태칩을 눌러 실제 Dot Pad를 연결하세요.'}
          </div>
        </aside>
      </main>
    </div>
  );
}
