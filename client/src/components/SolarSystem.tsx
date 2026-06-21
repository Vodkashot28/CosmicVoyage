import { Suspense } from "react";
import { OrbitControls, Stars, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CelestialObject } from "./CelestialObject";
import { SunModel } from "./3d/SunModel";
import { planetsData } from "@/data/planets";
import { useTourStore } from "@/lib/stores/useTourStore";
import { CinematicCameraController } from "./CinematicTour";
import * as THREE from "three";

const PLANETS = planetsData.filter((p) => p.type === "planet");

function OrbitRing({ radius }: { radius: number }) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  return (
    <Line points={points} color="#ffffff" lineWidth={0.4} transparent opacity={0.12} />
  );
}

export function SolarSystem() {
  const { paused } = useTourStore();

  return (
    <>
      {/* Background */}
      <color attach="background" args={["#000008"]} />
      <Stars radius={400} depth={60} count={7000} factor={5} saturation={0.1} fade speed={0.4} />

      {/* Lighting */}
      <ambientLight intensity={0.12} />
      <pointLight position={[0, 0, 0]} intensity={3} distance={400} color="#FDB813" />

      {/* Sun */}
      <Suspense
        fallback={
          <mesh>
            <sphereGeometry args={[4, 32, 32]} />
            <meshStandardMaterial color="#FFA500" emissive="#FF8800" emissiveIntensity={4} toneMapped={false} />
          </mesh>
        }
      >
        <SunModel />
      </Suspense>

      {/* Orbit rings + planets */}
      {PLANETS.map((p) => (
        <Suspense key={p.name} fallback={null}>
          <OrbitRing radius={p.orbitRadius} />
          <CelestialObject data={p} />
        </Suspense>
      ))}

      {/* Camera controller — active when tour is running */}
      <CinematicCameraController />

      {/* OrbitControls — only enabled when tour is paused */}
      <OrbitControls
        enabled={paused}
        enablePan
        enableZoom
        enableRotate
        minDistance={12}
        maxDistance={220}
        zoomSpeed={0.8}
        rotateSpeed={0.5}
        target={[0, 0, 0]}
      />

      {/* Post-processing bloom — makes the Sun glow */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.4} intensity={1.2} mipmapBlur />
      </EffectComposer>
    </>
  );
}
