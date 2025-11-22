import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
    
    if (lightRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 + 1;
      lightRef.current.intensity = 2 * pulse;
    }
  });
  
  return (
    <group>
      <pointLight ref={lightRef} position={[0, 0, 0]} intensity={2} color="#FDB813" castShadow />
      
      <mesh ref={sunRef} position={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FF6B00"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Inner glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3.3, 32, 32]} />
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Outer glow halo */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
