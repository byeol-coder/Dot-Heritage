import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function TowerMesh({ highlightPart }: { highlightPart?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const stoneMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8B7355',
    roughness: 0.85,
    metalness: 0.05,
  }), []);

  const highlightMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C8A56A',
    roughness: 0.5,
    metalness: 0.2,
    emissive: '#C8A56A',
    emissiveIntensity: 0.3,
  }), []);

  // Tower: tapered cylinder stack (10 segments from base to top)
  const segments = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const t = i / 9;
      const radius = 1.4 - t * 0.7; // base 1.4, top 0.7
      const y = i * 0.6 - 2.5;
      return { radius, y, i };
    });
  }, []);

  const isBaseHighlight = highlightPart === 'base';
  const isTopHighlight = highlightPart === 'top';

  return (
    <group ref={groupRef}>
      {/* Base platform */}
      <mesh
        position={[0, -3.2, 0]}
        material={isBaseHighlight ? highlightMat : stoneMat}
        receiveShadow
      >
        <cylinderGeometry args={[1.8, 2.0, 0.4, 8]} />
      </mesh>
      <mesh
        position={[0, -3.5, 0]}
        material={isBaseHighlight ? highlightMat : stoneMat}
        receiveShadow
      >
        <cylinderGeometry args={[2.2, 2.4, 0.3, 8]} />
      </mesh>

      {/* Tower body */}
      {segments.map(({ radius, y, i }) => {
        const isTop = i >= 8;
        const isBase = i <= 1;
        const mat = (isTopHighlight && isTop) || (isBaseHighlight && isBase)
          ? highlightMat : stoneMat;
        return (
          <mesh key={i} position={[0, y, 0]} material={mat} castShadow>
            <cylinderGeometry args={[radius - 0.04, radius, 0.55, 12, 1]} />
          </mesh>
        );
      })}

      {/* Top cap */}
      <mesh position={[0, 2.8, 0]} material={isTopHighlight ? highlightMat : stoneMat} castShadow>
        <boxGeometry args={[1.4, 0.25, 1.4]} />
      </mesh>

      {/* Central window */}
      <mesh
        position={[1.01, 0.1, 0]}
        material={highlightPart === 'window' ? highlightMat : new THREE.MeshStandardMaterial({
          color: '#1a1a1a',
          roughness: 1,
        })}
      >
        <boxGeometry args={[0.05, 0.45, 0.45]} />
      </mesh>
    </group>
  );
}

interface Props {
  highlightPart?: string;
  cameraView?: string;
}

export function Cheomseongdae3D({ highlightPart, cameraView }: Props) {
  const camPos: [number, number, number] =
    cameraView === 'detail' ? [2.5, 0.2, 2.5] :
    cameraView === 'top' ? [0, 6, 2] :
    [0, 0, 6];

  return (
    <Canvas
      camera={{ position: camPos, fov: 45 }}
      shadows
      style={{ background: 'transparent' }}
      aria-label="3D model of Cheomseongdae"
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow color="#FFF5E0" />
      <pointLight position={[-3, 2, -3]} intensity={0.4} color="#C8A56A" />
      <TowerMesh highlightPart={highlightPart} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}
