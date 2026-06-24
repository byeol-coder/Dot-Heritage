import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function ShipMesh({ highlightPart }: { highlightPart?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const woodMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#6B4F3A',
    roughness: 0.8,
    metalness: 0.05,
  }), []);

  const darkWoodMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4A3526',
    roughness: 0.85,
    metalness: 0.05,
  }), []);

  const sailMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D8CFC0',
    roughness: 0.7,
    metalness: 0.0,
    side: THREE.DoubleSide,
  }), []);

  const highlightMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C8A56A',
    roughness: 0.5,
    metalness: 0.2,
    emissive: '#C8A56A',
    emissiveIntensity: 0.3,
  }), []);

  // A few thin deck planks across the top.
  const deckPlanks = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const x = -1.6 + i * 0.8;
      return { x, i };
    });
  }, []);

  const isBottomHighlight = highlightPart === 'bottom';

  return (
    <group ref={groupRef}>
      {/* Flat bottom */}
      <mesh
        position={[0, -0.6, 0]}
        material={isBottomHighlight ? highlightMat : woodMat}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[4.0, 0.25, 1.6]} />
      </mesh>

      {/* Side walls (port / starboard) tilted slightly outward */}
      <mesh position={[0, -0.1, 0.85]} rotation={[0.18, 0, 0]} material={woodMat} castShadow>
        <boxGeometry args={[4.0, 0.9, 0.15]} />
      </mesh>
      <mesh position={[0, -0.1, -0.85]} rotation={[-0.18, 0, 0]} material={woodMat} castShadow>
        <boxGeometry args={[4.0, 0.9, 0.15]} />
      </mesh>

      {/* Bow (front, +x): tapered wedge angled up */}
      <mesh position={[2.1, 0.0, 0]} rotation={[0, 0, 0.4]} scale={[1.0, 1.0, 0.6]} material={woodMat} castShadow>
        <boxGeometry args={[0.5, 0.9, 1.6]} />
      </mesh>

      {/* Stern (back, -x): flat transom */}
      <mesh position={[-2.1, 0.0, 0]} material={darkWoodMat} castShadow>
        <boxGeometry args={[0.2, 0.95, 1.7]} />
      </mesh>

      {/* Deck planks */}
      {deckPlanks.map(({ x, i }) => (
        <mesh key={i} position={[x, 0.32, 0]} material={darkWoodMat} castShadow>
          <boxGeometry args={[0.55, 0.08, 1.5]} />
        </mesh>
      ))}

      {/* Mast */}
      <mesh position={[0, 0.9, 0]} material={darkWoodMat} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 2.2, 8]} />
      </mesh>

      {/* Sail */}
      <mesh position={[-0.1, 1.0, 0]} material={sailMat} castShadow>
        <boxGeometry args={[0.05, 1.3, 1.4]} />
      </mesh>
    </group>
  );
}

interface Props {
  highlightPart?: string;
  cameraView?: string;
}

export function TraditionalShip3D({ highlightPart, cameraView }: Props) {
  const camPos: [number, number, number] =
    cameraView === 'section' ? [0, 1, 5] :
    cameraView === 'top' ? [0, 5, 1] :
    cameraView === 'side' ? [5, 0.5, 0] :
    [3.5, 1.5, 3.5];

  return (
    <Canvas
      camera={{ position: camPos, fov: 45 }}
      shadows
      style={{ background: 'transparent' }}
      aria-label="3D model of Traditional Korean Ship"
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow color="#FFF5E0" />
      <pointLight position={[-3, 2, -3]} intensity={0.4} color="#C8A56A" />
      <ShipMesh highlightPart={highlightPart} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}
