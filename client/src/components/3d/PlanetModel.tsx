import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface PlanetModelProps {
  name: string;
  modelPath: string;
  scale: number;
  rotationSpeed: number;
  position: [number, number, number];
  color?: string;
  tiltAngle?: number;
}

const PLANET_COLORS: Record<string, number> = {
  Mercury: 0x8B7D6B,
  Venus:   0xFFC649,
  Earth:   0x3B82F6,
  Mars:    0xFF6B35,
  Jupiter: 0xC88B3A,
  Saturn:  0xE5D699,
  Uranus:  0x4FD0E7,
  Neptune: 0x4166F5,
  Pluto:   0xBBBBBB,
};

// The 9 .glb files that actually exist on disk
const AVAILABLE_MODELS = new Set([
  '/models/mercury.glb',
  '/models/venus.glb',
  '/models/earth.glb',
  '/models/mars.glb',
  '/models/jupiter.glb',
  '/models/saturn.glb',
  '/models/uranus.glb',
  '/models/neptune.glb',
  '/models/sun.glb',
]);

// Eagerly preload available models so they're ready when components mount
AVAILABLE_MODELS.forEach((path) => useGLTF.preload(path));

// ─── Inner component — only rendered when a .glb exists ──────────────────────
function GLBPlanet({
  name,
  modelPath,
  scale,
  rotationSpeed,
  position,
  tiltAngle = 0,
}: PlanetModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath); // suspends until loaded

  // Clone + normalise the scene — recalculated only when the raw scene changes
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Normalise to a diameter of 2 scene-units so planetModels.ts `scale` works correctly
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const diameter = Math.max(size.x, size.y, size.z);
    const factor = diameter > 0.01 ? 2 / diameter : 1;
    clone.scale.setScalar(factor);

    // Centre at origin
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center.multiplyScalar(factor));

    // Enable shadows on every mesh
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  // Spin the group every frame
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      rotation-x={tiltAngle}
    >
      {/* Declarative GLTF render — R3F owns the lifecycle */}
      <primitive object={clonedScene} />

      {/* Subtle atmosphere halo for Earth */}
      {name === 'Earth' && (
        <mesh scale={[1.05, 1.05, 1.05]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhongMaterial
            color={0x3b82f6}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

// ─── Fallback sphere — used when no .glb is available ────────────────────────
function SpherePlanet({
  name,
  scale,
  rotationSpeed,
  position,
  color,
}: PlanetModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const planetColor =
    color
      ? parseInt(color.replace('#', ''), 16)
      : (PLANET_COLORS[name] ?? 0x4a9eff);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={planetColor}
        metalness={0.3}
        roughness={0.7}
        emissive={planetColor}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

// ─── Public export — picks GLB or sphere based on file availability ───────────
export default function PlanetModel(props: PlanetModelProps) {
  if (AVAILABLE_MODELS.has(props.modelPath)) {
    // GLBPlanet calls useGLTF which suspends; the <Suspense> in App.tsx catches it
    return <GLBPlanet {...props} />;
  }
  return <SpherePlanet {...props} />;
}
