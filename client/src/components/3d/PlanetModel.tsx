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

// Preload existing models
try {
  useGLTF.preload('/models/mercury.glb');
  useGLTF.preload('/models/venus.glb');
  useGLTF.preload('/models/earth.glb');
} catch (e) {
  // Preload may fail - that's ok
}

export default function PlanetModel({
  name,
  modelPath,
  scale,
  rotationSpeed,
  position,
  color,
}: PlanetModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Log model loading
  console.log(`[PlanetModel] Loading ${name} from ${modelPath}`);

  // Always call useGLTF unconditionally to follow Rules of Hooks
  let gltf: any = null;
  try {
    gltf = useGLTF(modelPath);
    if (gltf?.scene) {
      console.log(`[PlanetModel] ✅ Loaded ${name} successfully`);
    }
  } catch (err) {
    // Silently fail - will use fallback
    console.log(`[PlanetModel] ⚠️ Failed to load ${name}, using fallback sphere`);
  }

  useEffect(() => {
    if (!groupRef.current || !gltf?.scene) return;

    try {
      const clonedScene = gltf.scene.clone();

      // Compute bounding box and auto-scale model to match expected size
      const box = new THREE.Box3().setFromObject(clonedScene);
      const size = new THREE.Vector3();
      box.getSize(size);
      const currentDiameter = Math.max(size.x, size.y, size.z);

      // Target diameter in scene units (2 = default size for most planets)
      const desiredDiameter = 2;
      const scaleFactor = currentDiameter > 0.01 ? (desiredDiameter / currentDiameter) : 1;

      // Apply scale
      clonedScene.scale.setScalar(scaleFactor);

      // Center the model at origin
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

      groupRef.current.clear();
      groupRef.current.add(clonedScene);
      setModelLoaded(true);
      console.log(`✅ [Model] Loaded ${name} (scale: ${scaleFactor.toFixed(2)}x)`);
    } catch (err) {
      console.warn(`[Model] Failed to load ${name}:`, err);
      setModelLoaded(false);
    }
  }, [gltf?.scene, name]);

  useFrame(() => {
    if (groupRef.current && rotationSpeed !== 0) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  // If model loaded successfully, render it
  if (modelLoaded && gltf?.scene) {
    return (
      <group ref={groupRef} position={position} scale={scale} />
    );
  }

  // Fallback: colored sphere with planet-specific color and enhanced PBR
  const planetColor = color ? parseInt(color.replace('#', '0x')) : (PLANET_COLORS[name] || 0x4a9eff);

  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[1, 48, 48]} />
      <meshStandardMaterial
        color={planetColor}
        metalness={0.2}
        roughness={0.65}
        emissive={planetColor}
        emissiveIntensity={0.15}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}