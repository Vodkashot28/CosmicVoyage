/**
 * SolarSystem — self-contained <Canvas> with Sun, planets, bloom, stars.
 */

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

import { Sun } from './Sun';
import { Planet } from './Planet';
import { CinematicCameraController } from './CinematicTour';
import { PLANETS } from './bodies';
import { useTourStore } from '@/lib/stores/useTourStore';

// Faint orbit ring
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

function SceneContents() {
  const { paused } = useTourStore();

  return (
    <>
      <color attach="background" args={['#000008']} />
      <Stars radius={400} depth={60} count={7000} factor={5} saturation={0.1} fade speed={0.4} />
      <ambientLight intensity={0.1} />

      {/* Sun (has its own internal Suspense) */}
      <Sun />

      {/* Planets — each gets its own Suspense via Planet component */}
      {PLANETS.map((body) => (
        <group key={body.id}>
          <OrbitRing radius={body.orbit} />
          <Planet body={body} />
        </group>
      ))}

      {/* Cinematic camera drives when tour is running */}
      <CinematicCameraController />

      {/* Free-look when paused */}
      <OrbitControls
        enabled={paused}
        enablePan
        enableZoom
        enableRotate
        minDistance={10}
        maxDistance={250}
        zoomSpeed={0.8}
        rotateSpeed={0.5}
        target={[0, 0, 0]}
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.4} intensity={1.3} mipmapBlur />
      </EffectComposer>
    </>
  );
}

export function SolarSystem() {
  return (
    <Canvas
      style={{ width: '100%', height: '100%', display: 'block' }}
      camera={{ position: [0, 55, 85], fov: 60, near: 0.1, far: 2000 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
    >
      <SceneContents />
    </Canvas>
  );
}
