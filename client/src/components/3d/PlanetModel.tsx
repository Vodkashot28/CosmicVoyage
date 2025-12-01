import { useEffect, useRef } from 'react';
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
  const gltf = useGLTF(modelPath);

  useEffect(() => {
    if (groupRef.current && gltf?.scene) {
      // Clone the scene to avoid reference issues
      const clonedScene = gltf.scene.clone();
      
      // Setup shadows and material for all meshes
      clonedScene.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Ensure materials are visible
          if (child.material) {
            child.material.side = THREE.FrontSide;
          }
        }
      });

      // Clear previous and add new
      groupRef.current.clear();
      groupRef.current.add(clonedScene);
      
      console.log(`✅ [Model] Loaded and rendered ${name}`);
    }
  }, [gltf?.scene, name]);

  useFrame(() => {
    if (groupRef.current && rotationSpeed !== 0) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  // If model loaded, render it
  if (gltf?.scene) {
    return (
      <group ref={groupRef} position={position} scale={scale} />
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
