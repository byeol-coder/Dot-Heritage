import { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { HeritageScene, HeritageViewType } from '../../types/tactileSync';
import { detectViewType } from '../../hooks/useHeritageViewDetection';
import { useI18n } from '../../i18n/i18n';
import styles from './HeritageSyncViewer.module.css';

const BASE_DISTANCE = 7;

const MATERIAL_BY_SCENE: Record<string, { color: string; rough: number }> = {
  'moon-jar': { color: '#EAE6DC', rough: 0.45 },
  cheomseongdae: { color: '#8B7355', rough: 0.9 },
};

function Model({ url, sceneId }: { url: string; sceneId: string }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const cfg = MATERIAL_BY_SCENE[sceneId] ?? { color: '#9a8c7a', rough: 0.8 };
    const mat = new THREE.MeshStandardMaterial({ color: cfg.color, roughness: cfg.rough, metalness: 0.05 });
    const clone = scene.clone(true);
    clone.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const mesh = o as THREE.Mesh;
        mesh.material = mat;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene, sceneId]);
  return <primitive object={model} />;
}

function Hotspots({
  scene,
  selected,
  labels,
  onSelect,
}: {
  scene: HeritageScene;
  selected: string | null;
  labels: Record<string, string>;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {scene.hotspots.map((h) => {
        const active = h.id === selected;
        return (
          <group key={h.id} position={h.position}>
            <mesh
              onClick={(e) => { e.stopPropagation(); onSelect(h.id); }}
              onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
              onPointerOut={() => { document.body.style.cursor = 'auto'; }}
            >
              <sphereGeometry args={[active ? 0.22 : 0.16, 16, 16]} />
              <meshStandardMaterial
                color={active ? '#C8A56A' : '#6FAF9F'}
                emissive={active ? '#C8A56A' : '#3a5f57'}
                emissiveIntensity={active ? 0.9 : 0.4}
              />
            </mesh>
            {active && (
              <Html distanceFactor={8} center>
                <div className={styles.hotspotLabel}>{labels[h.id]}</div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

function CameraReporter({
  controlsRef,
  selectedHotspot,
  onViewType,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  selectedHotspot: string | null;
  onViewType: (v: HeritageViewType) => void;
}) {
  const lastEmitted = useRef<HeritageViewType | null>(null);
  const pending = useRef<HeritageViewType | null>(null);
  const timer = useRef<number | null>(null);

  useFrame(() => {
    if (selectedHotspot) return; // parent drives 'focus' immediately
    const c = controlsRef.current;
    if (!c) return;
    const vt = detectViewType(
      {
        azimuthDeg: THREE.MathUtils.radToDeg(c.getAzimuthalAngle()),
        polarDeg: THREE.MathUtils.radToDeg(c.getPolarAngle()),
        distance: c.getDistance(),
        baseDistance: BASE_DISTANCE,
      },
      null,
    );
    if (vt === lastEmitted.current || vt === pending.current) return;
    // Debounce: only emit once the view stays in a new segment briefly.
    pending.current = vt;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      lastEmitted.current = vt;
      pending.current = null;
      onViewType(vt);
    }, 350);
  });

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  return null;
}

interface Props {
  scene: HeritageScene;
  selectedHotspot: string | null;
  onSelectHotspot: (id: string) => void;
  onViewTypeChange: (v: HeritageViewType) => void;
}

export function HeritageSyncViewer({ scene, selectedHotspot, onSelectHotspot, onViewTypeChange }: Props) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { tl } = useI18n();

  // Resolve hotspot labels outside the Canvas (R3F doesn't bridge outer context).
  const labels = useMemo(
    () => Object.fromEntries(scene.hotspots.map((h) => [h.id, tl(h.label)])),
    [scene, tl],
  );

  return (
    <Canvas
      camera={{ position: [0, 0.4, BASE_DISTANCE], fov: 45 }}
      shadows
      style={{ background: 'transparent' }}
      aria-label={`${tl(scene.name)} 3D interactive viewer`}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow color="#FFF5E0" />
      <pointLight position={[-3, 2, -3]} intensity={0.4} color="#C8A56A" />
      <Suspense fallback={null}>
        <Model url={scene.modelUrl} sceneId={scene.id} />
        <Hotspots scene={scene} selected={selectedHotspot} labels={labels} onSelect={onSelectHotspot} />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        enableZoom
        enablePan={false}
        autoRotate={!selectedHotspot}
        autoRotateSpeed={0.8}
        minDistance={3.5}
        maxDistance={9}
      />
      <CameraReporter
        controlsRef={controlsRef}
        selectedHotspot={selectedHotspot}
        onViewType={onViewTypeChange}
      />
    </Canvas>
  );
}

// Preload both scene models.
useGLTF.preload(`${import.meta.env.BASE_URL}models/moon-jar.glb`);
