import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Real 3D scan of a Silla roof-end tile (수막새), decimated from the official
// Korea Heritage Service master (FBX → glTF) to ~60k triangles.
// 출처: 국가유산청 (Korea Heritage Service).
const MODEL_URL = `${import.meta.env.BASE_URL}models/roof-tile.glb`;

function ScanMesh({ highlightPart }: { highlightPart?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const clay = new THREE.MeshStandardMaterial({
      color: highlightPart ? '#C8A56A' : '#9A8C7A',
      roughness: 0.92,
      metalness: 0.04,
      emissive: highlightPart ? '#C8A56A' : '#000000',
      emissiveIntensity: highlightPart ? 0.12 : 0,
    });
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.material = clay;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene, highlightPart]);

  // Spin around the camera axis so the decorative lotus face stays toward the
  // viewer (a Y spin would swing the long roof-tile tail across the frame).
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.z += delta * 0.15;
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

export function RoofTileScan3D({ highlightPart, cameraView }: Props) {
  // Look at the round face; the tail extends away from the camera.
  const camPos: [number, number, number] =
    cameraView === 'detail' ? [1.5, 1.2, 5] :
    cameraView === 'side' ? [6, 0, 0] :
    [0, 0.4, 6.2];

  return (
    <Canvas
      camera={{ position: camPos, fov: 45 }}
      shadows
      style={{ background: 'transparent' }}
      aria-label="3D scan of a Silla roof-end tile (Korea Heritage Service)"
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.15} castShadow color="#FFF5E0" />
      <pointLight position={[-3, 2, -3]} intensity={0.4} color="#C8A56A" />
      <Suspense fallback={null}>
        <ScanMesh highlightPart={highlightPart} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
