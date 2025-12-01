import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetModelProps {
  name: string;
  modelPath: string;
  scale: number;
  rotationSpeed: number;
  position: [number, number, number];
}

useGLTF.preload('/models/mercury.glb');
useGLTF.preload('/models/venus.glb');
useGLTF.preload('/models/earth.glb');

export default function PlanetModel({
  name,
  modelPath,
  scale,
  rotationSpeed,
  position,
}: PlanetModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  let gltf: any = null;
  try {
    gltf = useGLTF(modelPath);
  } catch {
    // Silently fail - will render fallback
  }

  useFrame(() => {
    if (groupRef.current && rotationSpeed !== 0) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  // If model loaded successfully, render cloned scene
  if (gltf?.scene) {
    return (
      <group ref={groupRef} position={position} scale={scale}>
        <primitive object={gltf.scene} />
      </group>
    );
  }

  // Fallback: blue sphere
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={0x4a9eff} metalness={0.3} roughness={0.7} />
    </mesh>
  );
}
