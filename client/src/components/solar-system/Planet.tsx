import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { BodyConfig } from './bodies';
import { PLANETS } from './bodies';

// Eagerly preload all planet GLBs so they're ready when the scene mounts
PLANETS.forEach((p) => useGLTF.preload(p.glbPath));

// ── GLB planet (suspends while loading) ──────────────────────────────────────
function GLBPlanet({ body, initialAngle }: { body: BodyConfig; initialAngle: number }) {
  const orbitRef = useRef<THREE.Group>(null);
  const spinRef  = useRef<THREE.Group>(null);
  const { scene } = useGLTF(body.glbPath);

  // Clone + normalise once per loaded scene
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
    c.traverse((child) => {
      const m = child as THREE.Mesh;
      if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; }
    });
    return c;
  }, [scene, body.radius]);

  useFrame((_, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.y += body.orbitSpeed * delta;
    if (spinRef.current)  spinRef.current.rotation.y  += body.rotationSpeed * delta;
  });

  return (
    // orbit group — rotates around Y (sun at origin)
    <group ref={orbitRef} rotation-y={initialAngle}>
      {/* offset to orbital radius */}
      <group position={[body.orbitRadius, 0, 0]}>
        {/* axial tilt: tilt the spin axis */}
        <group rotation-z={body.axialTilt}>
          {/* spin around the tilted axis */}
          <group ref={spinRef}>
            <primitive object={clone} />
          </group>
        </group>
      </group>
    </group>
  );
}

// ── Sphere fallback (used when no GLB or as loading placeholder) ──────────────
function SpherePlanet({ body, initialAngle }: { body: BodyConfig; initialAngle: number }) {
  const orbitRef = useRef<THREE.Group>(null);
  const spinRef  = useRef<THREE.Mesh>(null);
  const color    = useMemo(() => new THREE.Color(body.color), [body.color]);

  useFrame((_, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.y += body.orbitSpeed * delta;
    if (spinRef.current)  spinRef.current.rotation.y  += body.rotationSpeed * delta;
  });

  return (
    <group ref={orbitRef} rotation-y={initialAngle}>
      <group position={[body.orbitRadius, 0, 0]}>
        <group rotation-z={body.axialTilt}>
          <mesh ref={spinRef}>
            <sphereGeometry args={[body.radius, 32, 32]} />
            <meshStandardMaterial color={color} metalness={0.2} roughness={0.8} emissive={color} emissiveIntensity={0.1} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────
// Each planet is wrapped in its own error boundary by the caller (SolarSystem).
// Pass `initialAngle` to stagger starting positions around the sun.
export function Planet({
  body,
  initialAngle = 0,
}: {
  body: BodyConfig;
  initialAngle?: number;
}) {
  // GLBPlanet suspends — the <Suspense> in SolarSystem shows SpherePlanet meanwhile
  return <GLBPlanet body={body} initialAngle={initialAngle} />;
}

// The sphere version is exported so SolarSystem can use it as a Suspense fallback
export function PlanetFallback({ body, initialAngle = 0 }: { body: BodyConfig; initialAngle?: number }) {
  return <SpherePlanet body={body} initialAngle={initialAngle} />;
}
