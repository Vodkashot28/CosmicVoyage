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

export default function PlanetModel({
  name,
  modelPath,
  scale,
  rotationSpeed,
  position,
}: PlanetModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load model - useGLTF handles caching automatically
  const gltf = useGLTF(modelPath, undefined, (error) => {
    console.warn(`[Model] ${name} using fallback - model load failed`);
  });

  useFrame(() => {
    if (groupRef.current && rotationSpeed !== 0) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  // If model loaded, render it
  if (gltf?.scene) {
    return <primitive ref={groupRef} object={gltf.scene.clone()} position={position} scale={scale} />;
  }

  // Fallback sphere
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={0x4a9eff} metalness={0.3} roughness={0.7} />
    </mesh>
  );
}
