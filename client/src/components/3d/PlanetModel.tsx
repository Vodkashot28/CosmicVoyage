import { useRef, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetModelProps {
  name: string;
  modelPath: string;
  scale: number;
  rotationSpeed: number;
  position: [number, number, number];
  onLoaded?: () => void;
  onError?: (error: Error) => void;
}

function PlanetModelContent({
  name,
  modelPath,
  scale,
  rotationSpeed,
  position,
  onLoaded,
  onError,
}: PlanetModelProps) {
  const meshRef = useRef<THREE.Group>(null);

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

        console.log(`[Model] Loaded ${name} from ${modelPath}`);
        onLoaded?.();
      }
    }, [modelScene, name, modelPath, onLoaded]);

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
    console.error(`[Model] Failed to load ${name} from ${modelPath}:`, err);
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

export default function PlanetModel(props: PlanetModelProps) {
  return (
    <Suspense fallback={null}>
      <PlanetModelContent {...props} />
    </Suspense>
  );
}

// Preload a model for better performance
export function preloadModel(modelPath: string) {
  try {
    useGLTF.preload(modelPath);
    console.log(`[Preload] Queued ${modelPath}`);
  } catch (error) {
    console.warn(`[Preload] Failed for ${modelPath}:`, error);
  }
}
