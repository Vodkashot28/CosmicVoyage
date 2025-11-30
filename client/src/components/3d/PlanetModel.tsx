import { useRef, useEffect } from 'react';
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
  const meshRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(modelPath);

  useEffect(() => {
    if (meshRef.current && gltf?.scene) {
      const clonedScene = gltf.scene.clone();
      
      clonedScene.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      meshRef.current.clear();
      meshRef.current.add(clonedScene);
      console.log(`✅ [Model] Loaded ${name}`);
    }
  }, [gltf, name]);

  useFrame(() => {
    if (meshRef.current && rotationSpeed !== 0) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  // Render loaded model or fallback sphere
  return gltf?.scene ? (
    <group ref={meshRef} position={position} scale={scale} />
  ) : (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={0x4a9eff} metalness={0.3} roughness={0.7} />
    </mesh>
  );
}
