import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
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
  Venus: 0xFFC649,
  Earth: 0x3B82F6,
  Mars: 0xFF6B35,
  Jupiter: 0xC88B3A,
  Saturn: 0xE5D699,
  Uranus: 0x4FD0E7,
  Neptune: 0x4166F5,
  Pluto: 0xBBBBBB,
};

// Preload the 9 models that actually exist on disk
const AVAILABLE_MODELS = [
  '/models/mercury.glb',
  '/models/venus.glb',
  '/models/earth.glb',
  '/models/mars.glb',
  '/models/jupiter.glb',
  '/models/saturn.glb',
  '/models/uranus.glb',
  '/models/neptune.glb',
  '/models/sun.glb',
];
AVAILABLE_MODELS.forEach((path) => {
  try { useGLTF.preload(path); } catch (_) {}
});

function PlanetModelInner({
  name,
  modelPath,
  scale,
  rotationSpeed,
  position,
  color,
  tiltAngle = 0,
}: PlanetModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  const gltf = useGLTF(modelPath);

  useEffect(() => {
    // groupRef is ALWAYS mounted now, so this runs correctly
    if (!groupRef.current || !gltf?.scene) return;

    try {
      const clonedScene = gltf.scene.clone(true);

      // Auto-scale to a normalised diameter of 2 scene-units
      const box = new THREE.Box3().setFromObject(clonedScene);
      const size = new THREE.Vector3();
      box.getSize(size);
      const currentDiameter = Math.max(size.x, size.y, size.z);
      const scaleFactor = currentDiameter > 0.01 ? 2 / currentDiameter : 1;
      clonedScene.scale.setScalar(scaleFactor);

      // Centre the model at the group origin
      const center = new THREE.Vector3();
      box.getCenter(center);
      clonedScene.position.sub(center.multiplyScalar(scaleFactor));

      clonedScene.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.FrontSide;
          }
        }
      });

      // Clear old children, add freshly processed scene
      groupRef.current.clear();
      groupRef.current.add(clonedScene);

      // Apply axial tilt to the whole group
      groupRef.current.rotation.x = tiltAngle;

      setModelLoaded(true);
      console.log(`[PlanetModel] ✅ ${name} model applied (scaleFactor=${scaleFactor.toFixed(2)})`);
    } catch (err) {
      console.warn(`[PlanetModel] ❌ Failed to process ${name}:`, err);
      setModelLoaded(false);
    }
  }, [gltf?.scene, name, tiltAngle]);

  useFrame(() => {
    if (groupRef.current && rotationSpeed !== 0) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  const planetColor =
    color
      ? parseInt(color.replace('#', ''), 16)
      : PLANET_COLORS[name] ?? 0x4a9eff;

  return (
    // The group is ALWAYS rendered so groupRef.current is always set
    <group ref={groupRef} position={position} scale={scale}>
      {/* Fallback sphere — shown while model loads */}
      {!modelLoaded && (
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color={planetColor}
            metalness={0.3}
            roughness={0.7}
            emissive={planetColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      )}

      {/* Atmosphere halo for Earth (visible once model is loaded) */}
      {name === 'Earth' && modelLoaded && (
        <mesh scale={[1.05, 1.05, 1.05]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhongMaterial
            color={0x3B82F6}
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

// Wrapper that shows the fallback sphere if the .glb doesn't exist or errors
export default function PlanetModel(props: PlanetModelProps) {
  const hasModel = AVAILABLE_MODELS.includes(props.modelPath);

  if (!hasModel) {
    // No .glb on disk — render the coloured sphere directly
    const planetColor =
      props.color
        ? parseInt(props.color.replace('#', ''), 16)
        : PLANET_COLORS[props.name] ?? 0x4a9eff;

    return (
      <mesh position={props.position} scale={props.scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={planetColor}
          metalness={0.3}
          roughness={0.7}
          emissive={planetColor}
          emissiveIntensity={0.2}
        />
      </mesh>
    );
  }

  return <PlanetModelInner {...props} />;
}
