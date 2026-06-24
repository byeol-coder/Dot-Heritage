import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Real 3D scan of Cheomseongdae (National Treasure), decimated from the
// official Korea Heritage Service 3D-printing master to ~60k triangles.
// 출처: 국가유산청 (Korea Heritage Service).
const MODEL_URL = `${import.meta.env.BASE_URL}models/cheomseongdae.glb`;

function ScanMesh({ highlightPart }: { highlightPart?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  // Apply a consistent granite material to every mesh in the scan.
  const model = useMemo(() => {
    const stone = new THREE.MeshStandardMaterial({
      color: highlightPart ? '#C8A56A' : '#8B7355',
      roughness: 0.9,
      metalness: 0.05,
      emissive: highlightPart ? '#C8A56A' : '#000000',
      emissiveIntensity: highlightPart ? 0.12 : 0,
      flatShading: false,
    });
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.material = stone;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene, highlightPart]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

interface Props {
  highlightPart?: string;
  cameraView?: string;
}

export function CheomseongdaeScan3D({ highlightPart, cameraView }: Props) {
  // Model is ~6.5 units tall; keep enough distance for the full tower to fit.
  const camPos: [number, number, number] =
    cameraView === 'detail' ? [4, 0.5, 4.5] :
    cameraView === 'top' ? [0, 8, 3] :
    [0, 0.3, 9];

  return (
    <Canvas
      camera={{ position: camPos, fov: 45 }}
      shadows
      style={{ background: 'transparent' }}
      aria-label="3D scan of Cheomseongdae (Korea Heritage Service)"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow color="#FFF5E0" />
      <pointLight position={[-3, 2, -3]} intensity={0.4} color="#C8A56A" />
      <Suspense fallback={null}>
        <ScanMesh highlightPart={highlightPart} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
