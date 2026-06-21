import { Suspense, useEffect } from "react";
import { OrbitControls, Stars } from "@react-three/drei";
import { CelestialObject } from "./CelestialObject";
import { SunModel } from "./3d/SunModel";
import { allCelestialObjects } from "@/data/planets";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";

// Fallback sun shown while sun.glb loads
function SunFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[4, 32, 32]} />
      <meshStandardMaterial color="#FFA500" emissive="#FF6B00" emissiveIntensity={2} toneMapped={false} />
    </mesh>
  );
}

export function SolarSystem() {
  const { ownedNFTs, discoveredPlanets } = useSolarSystem();

  useEffect(() => {
    console.log('[SolarSystem] Mounted —', allCelestialObjects.length, 'objects');
  }, []);

  return (
    <>
      <color attach="background" args={["#0a0e27"]} />

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} distance={300} />
      <directionalLight position={[10, 10, 10]} intensity={0.5} />

      <Stars radius={500} depth={80} count={8000} factor={8} saturation={0.15} fade speed={0.3} />

      {/* Sun — own Suspense so planets aren't blocked by its load */}
      <Suspense fallback={<SunFallback />}>
        <SunModel />
      </Suspense>

      {/* Each planet/object in its own Suspense so one slow/missing model
          doesn't block the others from appearing */}
      {allCelestialObjects.map((obj) => (
        <Suspense key={obj.name} fallback={null}>
          <CelestialObject data={obj} />
        </Suspense>
      ))}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={10}
        maxDistance={200}
        zoomSpeed={0.8}
        rotateSpeed={0.5}
        target={[0, 0, 0]}
      />
    </>
  );
}
