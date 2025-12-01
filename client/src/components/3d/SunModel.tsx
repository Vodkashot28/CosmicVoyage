import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/sun.glb');

export function SunModel() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  
  const gltf = useGLTF('/models/sun.glb');

  useEffect(() => {
    if (groupRef.current && gltf?.scene) {
      groupRef.current.clear();
      const cloned = gltf.scene.clone();
      groupRef.current.add(cloned);
      console.log('[SunModel] ✅ Model added to scene');
    }
  }, [gltf?.scene]);

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.0005;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" castShadow />
      
      {/* Fallback visible sphere - always rendered */}
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FF6B00"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3.3, 32, 32]} />
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Try to load model - will be on top of sphere if successful */}
      <group ref={groupRef} position={[0, 0, 0]} scale={1} />
    </>
  );
}
