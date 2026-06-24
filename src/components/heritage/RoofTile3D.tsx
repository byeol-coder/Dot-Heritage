import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function TileMesh({ highlightPart }: { highlightPart?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  // Spin around the camera axis (z) so the lotus face always points at the
  // viewer — a flat tile rotated around y would otherwise show its thin edge.
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.15;
    }
  });

  const tileMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#9A8C7A',
    roughness: 0.9,
    metalness: 0.05,
  }), []);

  const rimMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#6E6354',
    roughness: 0.9,
    metalness: 0.05,
  }), []);

  const highlightMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C8A56A',
    roughness: 0.5,
    metalness: 0.2,
    emissive: '#C8A56A',
    emissiveIntensity: 0.3,
  }), []);

  // 8 lotus petals radiating from the center on the front face.
  const petals = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i * Math.PI * 2) / 8;
      const radius = 1.0;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return { x, y, angle, i };
    });
  }, []);

  const isCenterHighlight = highlightPart === 'center';

  return (
    <group ref={groupRef}>
      {/* Main disc: circular face pointing toward camera */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={tileMat} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.0, 0.35, 48]} />
      </mesh>

      {/* Rim at the outer edge */}
      <mesh position={[0, 0, 0.05]} material={rimMat}>
        <torusGeometry args={[2.0, 0.12, 16, 48]} />
      </mesh>

      {/* Center boss: raised half-sphere protruding toward camera */}
      <mesh
        position={[0, 0, 0.18]}
        rotation={[Math.PI / 2, 0, 0]}
        material={isCenterHighlight ? highlightMat : tileMat}
        castShadow
      >
        <sphereGeometry args={[0.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* 8 lotus petals */}
      {petals.map(({ x, y, angle, i }) => (
        <mesh
          key={i}
          position={[x, y, 0.22]}
          rotation={[0, 0, angle]}
          scale={[0.5, 0.25, 0.9]}
          material={tileMat}
          castShadow
        >
          <sphereGeometry args={[0.45, 16, 12]} />
        </mesh>
      ))}
    </group>
  );
}

interface Props {
  highlightPart?: string;
  cameraView?: string;
}

export function RoofTile3D({ highlightPart, cameraView }: Props) {
  // A slightly raised camera gives a 3/4 view that reveals the depth of the
  // boss and petals while the face stays toward the viewer.
  const camPos: [number, number, number] =
    cameraView === 'detail' ? [1.5, 1.2, 3] :
    cameraView === 'top' ? [0, 5, 1] :
    [0, 1.6, 5.2];

  return (
    <Canvas
      camera={{ position: camPos, fov: 45 }}
      shadows
      style={{ background: 'transparent' }}
      aria-label="3D model of Lotus Roof Tile"
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow color="#FFF5E0" />
      <pointLight position={[-3, 2, -3]} intensity={0.4} color="#C8A56A" />
      <TileMesh highlightPart={highlightPart} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}
