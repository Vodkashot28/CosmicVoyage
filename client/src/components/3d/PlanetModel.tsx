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

// Only preload existing models
const AVAILABLE_MODELS = ['sun.glb', 'mercury.glb', 'venus.glb', 'earth.glb'];
AVAILABLE_MODELS.forEach(model => {
  try {
    useGLTF.preload(`/models/${model}`);
  } catch (e) {
    // Preload may fail silently - that's ok
  }
});

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
  const [loadError, setLoadError] = useState(false);

  let gltf: any = null;
  try {
    gltf = useGLTF(modelPath, undefined, (error) => {
      console.warn(`[Model] Failed to load ${name} from ${modelPath}`, error);
      setLoadError(true);
    });
  } catch (err) {
    console.warn(`[Model] Error loading ${name}:`, err);
    setLoadError(true);
  }

  useEffect(() => {
    if (groupRef.current && gltf?.scene) {
      const clonedScene = gltf.scene.clone();
      
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
      console.log(`✅ [Model] Loaded ${name}`);
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

  // Fallback: colored sphere with planet-specific color
  const planetColor = color ? parseInt(color.replace('#', '0x')) : (PLANET_COLORS[name] || 0x4a9eff);
  
  return (
    <mesh position={position} scale={scale}>
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
