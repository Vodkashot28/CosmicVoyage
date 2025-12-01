import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/sun.glb');

export function SunModel() {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF('/models/sun.glb');

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
      
      console.log(`✅ [Sun Model] Loaded`);
    }
  }, [gltf?.scene]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  if (gltf?.scene) {
    return (
      <group ref={groupRef} position={[0, 0, 0]} scale={1}>
        <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" castShadow />
      </group>
    );
  }

  // Fallback
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshStandardMaterial color="#FDB813" emissive="#FF6B00" emissiveIntensity={1.2} toneMapped={false} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
    </mesh>
  );
}
