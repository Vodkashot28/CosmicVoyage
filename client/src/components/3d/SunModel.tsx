import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/sun.glb');

export function SunModel() {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const gltf = useGLTF('/models/sun.glb');

  useEffect(() => {
    if (groupRef.current && gltf?.scene) {
      groupRef.current.clear();
      const cloned = gltf.scene.clone();
      
      // Auto-scale model using bounding box
      const box = new THREE.Box3().setFromObject(cloned);
      const size = new THREE.Vector3();
      box.getSize(size);
      const currentDiameter = Math.max(size.x, size.y, size.z);
      const desiredDiameter = 8; // Sun should be larger (increased from 4)
      const scaleFactor = currentDiameter > 0.01 ? (desiredDiameter / currentDiameter) : 1;
      
      cloned.scale.setScalar(scaleFactor);
      
      // Center the model at origin
      const center = new THREE.Vector3();
      box.getCenter(center);
      cloned.position.sub(center.multiplyScalar(scaleFactor));
      
      // Configure all meshes with enhanced materials
      cloned.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = false; // Sun doesn't need shadows
          child.receiveShadow = false;
          
          // Enhance material with strong emissive glow
          if (child.material) {
            child.material.emissive = new THREE.Color('#FF6B00');
            child.material.emissiveIntensity = 2.0;
            child.material.toneMapped = false;
          }
        }
      });
      
      groupRef.current.add(cloned);
      setModelLoaded(true);
      console.log(`[SunModel] ✅ .glb Model loaded and added (scale: ${scaleFactor.toFixed(2)}x, diameter: ${desiredDiameter})`);
    }
  }, [gltf?.scene]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
    
    // Pulsing glow effect
    if (glowRef.current) {
      const pulse = Math.sin(Date.now() * 0.001) * 0.3 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  // If model loaded, render it with enhanced lighting
  if (modelLoaded && gltf?.scene) {
    return (
      <>
        <pointLight position={[0, 0, 0]} intensity={3} color="#FDB813" castShadow />
        <pointLight position={[5, 5, 5]} intensity={1} color="#FF6B00" />
        <group ref={groupRef} position={[0, 0, 0]} />
        
        {/* Glow halo */}
        <mesh ref={glowRef} position={[0, 0, 0]}>
          <sphereGeometry args={[4.5, 32, 32]} />
          <meshBasicMaterial 
            color="#FFA500" 
            transparent 
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      </>
    );
  }

  // Fallback: gorgeous golden glowing sphere
  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={3} color="#FDB813" castShadow />
      <pointLight position={[5, 5, 5]} intensity={1} color="#FF6B00" />
      
      {/* Main sun sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial
          color="#FFA500"
          emissive="#FF6B00"
          emissiveIntensity={2.0}
          toneMapped={false}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Glow layer 1 */}
      <mesh position={[0, 0, 0]} ref={glowRef}>
        <sphereGeometry args={[4.8, 32, 32]} />
        <meshBasicMaterial 
          color="#FFA500" 
          transparent 
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Glow layer 2 - outer halo */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[6.0, 32, 32]} />
        <meshBasicMaterial 
          color="#FF6B00" 
          transparent 
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}
