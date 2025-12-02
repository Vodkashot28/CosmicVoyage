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
      
      // Auto-scale model using bounding box (same as PlanetModel)
      const box = new THREE.Box3().setFromObject(cloned);
      const size = new THREE.Vector3();
      box.getSize(size);
      const currentDiameter = Math.max(size.x, size.y, size.z);
      const desiredDiameter = 4; // Sun should be larger
      const scaleFactor = currentDiameter > 0.01 ? (desiredDiameter / currentDiameter) : 1;
      
      cloned.scale.setScalar(scaleFactor);
      const center = new THREE.Vector3();
      box.getCenter(center);
      cloned.position.sub(center.multiplyScalar(scaleFactor));
      
      // Configure all meshes with enhanced materials
      cloned.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Enhance material with strong emissive glow
          if (child.material) {
            child.material.emissive = new THREE.Color('#FF6B00');
            child.material.emissiveIntensity = 1.5;
            child.material.toneMapped = false;
          }
        }
      });
      
      groupRef.current.add(cloned);
      setModelLoaded(true);
      console.log(`[SunModel] ✅ .glb Model loaded and added (scale: ${scaleFactor.toFixed(2)}x)`);
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
        <pointLight position={[0, 0, 0]} intensity={3.5} color="#FDB813" castShadow distance={150} decay={1.5} />
        <pointLight position={[3, 3, 3]} intensity={1.2} color="#FF6B00" distance={80} />
        <group ref={groupRef} position={[0, 0, 0]} />
        
        {/* Volumetric corona - inner */}
        <mesh ref={glowRef} position={[0, 0, 0]}>
          <sphereGeometry args={[5.2, 32, 32]} />
          <meshBasicMaterial 
            color="#FFB347" 
            transparent 
            opacity={0.18}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
        
        {/* Corona - middle layer */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[6.0, 32, 32]} />
          <meshBasicMaterial 
            color="#FF8C42" 
            transparent 
            opacity={0.12}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
        
        {/* Corona - outer layer */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[7.5, 32, 32]} />
          <meshBasicMaterial 
            color="#FFA500" 
            transparent 
            opacity={0.06}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      </>
    );
  }

  // Fallback: cinematic golden glowing sphere
  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={3.5} color="#FDB813" castShadow distance={150} decay={1.5} />
      <pointLight position={[3, 3, 3]} intensity={1.2} color="#FF6B00" distance={80} />
      
      {/* Main sun sphere with enhanced materials */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[4.2, 64, 64]} />
        <meshStandardMaterial
          color="#FFB347"
          emissive="#FF6B00"
          emissiveIntensity={2.2}
          toneMapped={false}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Volumetric corona - inner pulsing layer */}
      <mesh position={[0, 0, 0]} ref={glowRef}>
        <sphereGeometry args={[5.2, 32, 32]} />
        <meshBasicMaterial 
          color="#FFB347" 
          transparent 
          opacity={0.18}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Corona - middle layer */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[6.0, 32, 32]} />
        <meshBasicMaterial 
          color="#FF8C42" 
          transparent 
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Corona - outer atmospheric layer */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[7.5, 32, 32]} />
        <meshBasicMaterial 
          color="#FFA500" 
          transparent 
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
