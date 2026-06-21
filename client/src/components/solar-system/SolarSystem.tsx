/**
 * SolarSystem — <Canvas> setup
 *
 * Responsibilities:
 *   - Three.js canvas, camera, renderer settings
 *   - Ambient + sun point light
 *   - Procedural starfield
 *   - Sun GLB
 *   - 8 planet GLBs (each in its own Suspense, sphere shown while loading)
 *   - Faint orbit ring lines
 *   - UnrealBloom post-processing
 *   - CinematicCameraController (drives camera when tour is running)
 *   - OrbitControls (enabled only when tour is paused)
 */

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

import { Sun } from './Sun';
import { Planet, PlanetFallback } from './Planet';
import { CinematicCameraController } from './CinematicTour';
import { PLANETS } from './bodies';
import { useTourStore } from '@/lib/stores/useTourStore';

// ── Faint orbit ring ──────────────────────────────────────────────────────────
function OrbitRing({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);

  return <Line points={points} color="#ffffff" lineWidth={0.35} transparent opacity={0.1} />;
}

// ── Scene contents (everything inside the Canvas) ────────────────────────────
function SceneContents() {
  const { paused } = useTourStore();

  // Stagger planet starting positions so they don't all start at the same angle
  const initialAngles = useMemo(
    () => PLANETS.map((_, i) => (i / PLANETS.length) * Math.PI * 2),
    [],
  );

  return (
    <>
      {/* Background */}
      <color attach="background" args={['#000008']} />
      <Stars radius={400} depth={60} count={7000} factor={5} saturation={0.1} fade speed={0.4} />

      {/* Lighting */}
      <ambientLight intensity={0.1} />

      {/* Sun */}
      <Suspense fallback={null}>
        <Sun />
      </Suspense>

      {/* Planets — each gets its own Suspense so they appear independently */}
      {PLANETS.map((body, i) => (
        <group key={body.slug}>
          <OrbitRing radius={body.orbitRadius} />
          <Suspense fallback={<PlanetFallback body={body} initialAngle={initialAngles[i]} />}>
            <Planet body={body} initialAngle={initialAngles[i]} />
          </Suspense>
        </group>
      ))}

      {/* Cinematic tour camera driver */}
      <CinematicCameraController />

      {/* Free-look controls — only when tour is paused */}
      <OrbitControls
        enabled={paused}
        enablePan
        enableZoom
        enableRotate
        minDistance={12}
        maxDistance={250}
        zoomSpeed={0.8}
        rotateSpeed={0.5}
        target={[0, 0, 0]}
      />

      {/* Post-processing — bloom on any toneMapped=false emissive (the Sun) */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.55}
          luminanceSmoothing={0.4}
          intensity={1.3}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────
export function SolarSystem() {
  return (
    <Canvas
      style={{ width: '100%', height: '100%', display: 'block' }}
      camera={{ position: [0, 75, 110], fov: 65, near: 0.1, far: 2000 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
    >
      <SceneContents />
    </Canvas>
  );
}
