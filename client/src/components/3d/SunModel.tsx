import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/sun.glb');

export function SunModel() {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF('/models/sun.glb'); // suspends until loaded

  // Clone + normalise the scene declaratively — no imperative add/clear
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const diameter = Math.max(size.x, size.y, size.z);
    const desiredDiameter = 8;
    const scaleFactor = diameter > 0.01 ? desiredDiameter / diameter : 1;

    clone.scale.setScalar(scaleFactor);

    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center.multiplyScalar(scaleFactor));

    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissive = new THREE.Color('#FF6B00');
        mat.emissiveIntensity = 2.0;
        mat.toneMapped = false;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });

    return clone;
  }, [scene]);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.0005;
    if (glowRef.current) {
      glowRef.current.scale.setScalar(Math.sin(Date.now() * 0.001) * 0.3 + 1);
    }
  });

  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={3} color="#FDB813" castShadow />
      <pointLight position={[5, 5, 5]} intensity={1} color="#FF6B00" />

      {/* Declarative GLB render — ref always mounted */}
      <group ref={groupRef} position={[0, 0, 0]}>
        <primitive object={clonedScene} />
      </group>

      {/* Outer glow halo */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial color="#FFA500" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[6.0, 32, 32]} />
        <meshBasicMaterial color="#FF6B00" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
    </>
  );
}
