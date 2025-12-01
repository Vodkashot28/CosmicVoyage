import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/sun.glb');

export function SunModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  let gltf: any = null;
  try {
    gltf = useGLTF('/models/sun.glb');
    console.log('[SunModel] useGLTF called, gltf:', gltf?.scene ? 'LOADED' : 'LOADING');
  } catch (err) {
    console.error('[SunModel] useGLTF error:', err);
  }

  useEffect(() => {
    console.log('[SunModel] useEffect - gltf?.scene:', gltf?.scene ? 'exists' : 'undefined');
    
    if (groupRef.current && gltf?.scene) {
      try {
        groupRef.current.clear();
        const cloned = gltf.scene.clone();
        groupRef.current.add(cloned);
        console.log('[SunModel] ✅ Model added to scene');
      } catch (err) {
        console.error('[SunModel] Error adding model:', err);
      }
    }
  }, [gltf?.scene]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  console.log('[SunModel] Rendering - gltf loaded:', !!gltf?.scene);

  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" castShadow />
      <group ref={groupRef} position={[0, 0, 0]} scale={1} />
    </>
  );
}
