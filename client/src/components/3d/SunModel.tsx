import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/sun.glb');

export function SunModel() {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF('/models/sun.glb');

  useEffect(() => {
    if (groupRef.current && gltf?.scene) {
      groupRef.current.clear();
      const cloned = gltf.scene.clone();
      
      // Traverse and configure all meshes
      cloned.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      groupRef.current.add(cloned);
      console.log('[SunModel] ✅ .glb Model loaded and added');
    }
  }, [gltf?.scene]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  // If model loaded, render it
  if (gltf?.scene) {
    return (
      <>
        <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" castShadow />
        <group ref={groupRef} position={[0, 0, 0]} scale={1} />
      </>
    );
  }

  // Fallback: golden sphere if model fails
  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" castShadow />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FF6B00"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3.3, 32, 32]} />
        <meshBasicMaterial color="#FFA500" transparent opacity={0.4} side={THREE.BackSide} />
      </mesh>
    </>
  );
}
