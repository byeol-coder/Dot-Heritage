import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function JarMesh({ highlightPart }: { highlightPart?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const porcelainMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#EAE6DC',
    roughness: 0.4,
    metalness: 0.05,
    side: THREE.DoubleSide,
  }), []);

  const highlightMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C8A56A',
    roughness: 0.5,
    metalness: 0.2,
    emissive: '#C8A56A',
    emissiveIntensity: 0.3,
  }), []);

  // 2D profile (bottom to top) revolved around Y axis to form the jar body.
  const profile = useMemo(() => [
    new THREE.Vector2(0.0, -2.2),
    new THREE.Vector2(0.45, -2.2),
    new THREE.Vector2(0.5, -2.0),
    new THREE.Vector2(0.9, -1.6),
    new THREE.Vector2(1.5, -0.9),
    new THREE.Vector2(1.85, 0.0), // widest at equator
    new THREE.Vector2(1.5, 0.9),
    new THREE.Vector2(0.9, 1.6),
    new THREE.Vector2(0.55, 1.9),
    new THREE.Vector2(0.5, 2.1),
    new THREE.Vector2(0.52, 2.15), // small lip
  ], []);

  const isNeckHighlight = highlightPart === 'neck' || highlightPart === 'opening';

  return (
    // Slight squash for the famous moon jar asymmetry.
    <group ref={groupRef} scale={[1.0, 1.0, 0.97]}>
      <mesh material={porcelainMat} castShadow receiveShadow>
        <latheGeometry args={[profile, 48]} />
      </mesh>

      {/* Subtle gold emissive ring at the neck when highlighted */}
      {isNeckHighlight && (
        <mesh position={[0, 2.1, 0]} material={highlightMat}>
          <torusGeometry args={[0.53, 0.06, 16, 48]} />
        </mesh>
      )}
    </group>
  );
}

interface Props {
  highlightPart?: string;
  cameraView?: string;
}

export function MoonJar3D({ highlightPart, cameraView }: Props) {
  const camPos: [number, number, number] =
    cameraView === 'top' ? [0, 5, 2.5] :
    cameraView === 'side' ? [4, 0, 0] :
    [0, 0, 6];

  return (
    <Canvas
      camera={{ position: camPos, fov: 45 }}
      shadows
      style={{ background: 'transparent' }}
      aria-label="3D model of Moon Jar"
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow color="#FFF5E0" />
      <pointLight position={[-3, 2, -3]} intensity={0.4} color="#C8A56A" />
      <JarMesh highlightPart={highlightPart} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}
