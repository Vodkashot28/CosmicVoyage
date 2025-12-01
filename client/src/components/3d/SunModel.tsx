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
      groupRef.current.add(cloned);
      console.log('[SunModel] ✅ Model loaded and added to scene');
    }
  }, [gltf?.scene]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" castShadow />
      <group ref={groupRef} position={[0, 0, 0]} scale={1} />
    </>
  );
}
