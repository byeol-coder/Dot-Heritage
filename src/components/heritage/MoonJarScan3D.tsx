import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Real 3D scan of the White Porcelain Moon Jar, decimated from the official
// Korea Heritage Service master to ~34k triangles.
// 출처: 국가유산청 (Korea Heritage Service).
const MODEL_URL = `${import.meta.env.BASE_URL}models/moon-jar.glb`;

function ScanMesh({ highlightPart }: { highlightPart?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const porcelain = new THREE.MeshStandardMaterial({
      color: highlightPart ? '#C8A56A' : '#EAE6DC',
      roughness: 0.45,
      metalness: 0.05,
      emissive: highlightPart ? '#C8A56A' : '#000000',
      emissiveIntensity: highlightPart ? 0.12 : 0,
    });
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.material = porcelain;
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

export function MoonJarScan3D({ highlightPart, cameraView }: Props) {
  const camPos: [number, number, number] =
    cameraView === 'top' ? [0, 6, 1.5] :
    cameraView === 'side' ? [6, 0, 0] :
    [0, 0, 6.5];

  return (
    <Canvas
      camera={{ position: camPos, fov: 45 }}
      shadows
      style={{ background: 'transparent' }}
      aria-label="3D scan of the Moon Jar (Korea Heritage Service)"
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.1} castShadow color="#FFF5E0" />
      <pointLight position={[-3, 2, -3]} intensity={0.4} color="#C8A56A" />
      <Suspense fallback={null}>
        <ScanMesh highlightPart={highlightPart} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
