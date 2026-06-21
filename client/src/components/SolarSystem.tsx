import { Suspense } from "react";
import { OrbitControls, Stars, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CelestialObject } from "./CelestialObject";
import { SunModel } from "./3d/SunModel";
import { planetsData } from "@/data/planets";
import * as THREE from "three";

// Only the 8 main planets
const PLANETS = planetsData.filter((p) => p.type === "planet");

// Faint orbit ring — thin white circle at low opacity
function OrbitRing({ radius }: { radius: number }) {
  const points: THREE.Vector3[] = [];
  const SEG = 128;
  for (let i = 0; i <= SEG; i++) {
    const a = (i / SEG) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  return (
    <Line
      points={points}
      color="#ffffff"
      lineWidth={0.4}
      transparent
      opacity={0.12}
    />
  );
}

export function SolarSystem() {
  return (
    <>
      {/* ── Background ───────────────────────────────── */}
      <color attach="background" args={["#000008"]} />
      <Stars
        radius={400}
        depth={60}
        count={7000}
        factor={5}
        saturation={0.1}
        fade
        speed={0.4}
      />

      {/* ── Lighting ─────────────────────────────────── */}
      {/* Low ambient so dark-side of planets is visible but dim */}
      <ambientLight intensity={0.12} />
      {/* Sun's warm light reaching all planets */}
      <pointLight
        position={[0, 0, 0]}
        intensity={3}
        distance={400}
        color="#FDB813"
      />

      {/* ── Sun (GLB + bloom glow) ────────────────────── */}
      <Suspense
        fallback={
          <mesh>
            <sphereGeometry args={[4, 32, 32]} />
            <meshStandardMaterial
              color="#FFA500"
              emissive="#FF8800"
              emissiveIntensity={4}
              toneMapped={false}
            />
          </mesh>
        }
      >
        <SunModel />
      </Suspense>

      {/* ── Planets: orbit ring + planet (handles own orbit motion) ── */}
      {PLANETS.map((p) => (
        <Suspense key={p.name} fallback={null}>
          <OrbitRing radius={p.orbitRadius} />
          <CelestialObject data={p} />
        </Suspense>
      ))}

      {/* ── Camera ───────────────────────────────────── */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={12}
        maxDistance={220}
        zoomSpeed={0.8}
        rotateSpeed={0.5}
        target={[0, 0, 0]}
      />

      {/* ── Post-processing ──────────────────────────── */}
      {/* Bloom picks up any mesh with toneMapped=false + bright emissive (the Sun) */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.4}
          intensity={1.2}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}
