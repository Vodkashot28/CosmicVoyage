import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetModelProps {
  modelPath: string;
  scale?: number;
  rotationSpeed?: number;
  position?: [number, number, number];
  onLoaded?: () => void;
  onError?: (error: Error) => void;
}

export function PlanetModel({
  modelPath,
  scale = 1,
  rotationSpeed = 0,
  position = [0, 0, 0],
  onLoaded,
  onError,
}: PlanetModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  try {
    const { scene: modelScene } = useGLTF(modelPath);

    useEffect(() => {
      if (meshRef.current && modelScene) {
        // Clone the loaded scene to avoid reference issues
        const clonedScene = modelScene.clone();
        
        // Setup shadows for all meshes
        clonedScene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Clear previous children and add cloned model
        meshRef.current.clear();
        meshRef.current.add(clonedScene);

        onLoaded?.();
      }
    }, [modelScene]);

    useFrame(() => {
      if (meshRef.current && rotationSpeed !== 0) {
        meshRef.current.rotation.y += rotationSpeed;
      }
    });

    return (
      <group ref={meshRef} position={position} scale={scale} />
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`Failed to load planet model from ${modelPath}:`, err);
    onError?.(err);

    // Fallback: render a simple sphere
    return (
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={0x888888}
          emissive={0x444444}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
    );
  }
}

// Preload a model for better performance
export function preloadModel(modelPath: string) {
  try {
    useGLTF.preload(modelPath);
  } catch (error) {
    console.warn(`Failed to preload model ${modelPath}:`, error);
  }
}
