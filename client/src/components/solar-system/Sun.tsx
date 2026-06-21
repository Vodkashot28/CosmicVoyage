import { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SUN } from './bodies';

// ── GLB Sun (suspends while loading) ─────────────────────────────────────────
function GLBSun() {
  const spinRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(SUN.glbUrl!);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    const box = new THREE.Box3().setFromObject(c);
    const sz  = new THREE.Vector3();
    box.getSize(sz);
    const d = Math.max(sz.x, sz.y, sz.z);
    const s = d > 0.01 ? (SUN.radius * 2) / d : 1;
    c.scale.setScalar(s);
    const center = new THREE.Vector3();
    box.getCenter(center);
    c.position.sub(center.multiplyScalar(s));

    c.traverse((child) => {
      const m = child as THREE.Mesh;
      if (m.isMesh && m.material) {
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.emissive          = new THREE.Color('#FF8800');
        mat.emissiveIntensity = 2.5;
        mat.toneMapped        = false;
        m.castShadow          = false;
        m.receiveShadow       = false;
      }
    });
    return c;
  }, [scene]);

  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += SUN.spinSpeed * delta;
  });

  return (
    <group ref={spinRef} rotation-z={SUN.tilt}>
      <primitive object={clone} />
    </group>
  );
}

// ── Sphere fallback ───────────────────────────────────────────────────────────
function SphereSun() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += SUN.spinSpeed * delta; });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[SUN.radius, 48, 48]} />
      <meshStandardMaterial color="#FFA500" emissive="#FF6600" emissiveIntensity={3} toneMapped={false} />
    </mesh>
  );
}

// ── Public component ─────────────────────────────────────────────────────────
export function Sun() {
  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={3.5} distance={450} color="#FDB813" />
      <pointLight position={[0, 0, 0]} intensity={1}   distance={80}  color="#FF8800" />

      {SUN.glbUrl ? (
        <Suspense fallback={<SphereSun />}>
          <GLBSun />
        </Suspense>
      ) : (
        <SphereSun />
      )}

      {/* Corona layers */}
      <mesh>
        <sphereGeometry args={[SUN.radius * 1.35, 32, 32]} />
        <meshBasicMaterial color="#FFA500" transparent opacity={0.13} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[SUN.radius * 1.75, 32, 32]} />
        <meshBasicMaterial color="#FF6600" transparent opacity={0.06} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </>
  );
}
