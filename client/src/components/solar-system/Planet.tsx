import { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { Body } from './bodies';
import { PLANETS } from './bodies';

// Preload GLBs for planets that already have a CDN URL
PLANETS.forEach((p) => { if (p.glbUrl) useGLTF.preload(p.glbUrl); });

// ── GLB planet (suspends while loading) ──────────────────────────────────────
function GLBPlanet({ body }: { body: Body }) {
  const orbitRef = useRef<THREE.Group>(null);
  const spinRef  = useRef<THREE.Group>(null);
  const { scene } = useGLTF(body.glbUrl!);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    const box = new THREE.Box3().setFromObject(c);
    const sz  = new THREE.Vector3();
    box.getSize(sz);
    const d = Math.max(sz.x, sz.y, sz.z);
    const s = d > 0.01 ? (body.radius * 2) / d : 1;
    c.scale.setScalar(s);
    const center = new THREE.Vector3();
    box.getCenter(center);
    c.position.sub(center.multiplyScalar(s));
    c.traverse((ch) => {
      const m = ch as THREE.Mesh;
      if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; }
    });
    return c;
  }, [scene, body.radius]);

  useFrame((_, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.y += body.orbitSpeed * delta;
    if (spinRef.current)  spinRef.current.rotation.y  += body.spinSpeed  * delta;
  });

  return (
    <group ref={orbitRef} rotation-y={body.phase}>
      <group position={[body.orbit, 0, 0]}>
        <group rotation-z={body.tilt}>
          <group ref={spinRef}>
            <primitive object={clone} />
          </group>
        </group>
      </group>
    </group>
  );
}

// ── Sphere fallback ───────────────────────────────────────────────────────────
export function SpherePlanet({ body }: { body: Body }) {
  const orbitRef = useRef<THREE.Group>(null);
  const spinRef  = useRef<THREE.Mesh>(null);
  const color    = useMemo(() => new THREE.Color(body.color), [body.color]);

  useFrame((_, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.y += body.orbitSpeed * delta;
    if (spinRef.current)  spinRef.current.rotation.y  += body.spinSpeed  * delta;
  });

  return (
    <group ref={orbitRef} rotation-y={body.phase}>
      <group position={[body.orbit, 0, 0]}>
        <group rotation-z={body.tilt}>
          <mesh ref={spinRef}>
            <sphereGeometry args={[body.radius, 32, 32]} />
            <meshStandardMaterial color={color} metalness={0.2} roughness={0.8} emissive={color} emissiveIntensity={0.08} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────
export function Planet({ body }: { body: Body }) {
  if (!body.glbUrl) return <SpherePlanet body={body} />;

  return (
    <Suspense fallback={<SpherePlanet body={body} />}>
      <GLBPlanet body={body} />
    </Suspense>
  );
}
