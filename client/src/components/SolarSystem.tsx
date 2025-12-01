import { OrbitControls, Stars } from "@react-three/drei";
import { CelestialObject } from "./CelestialObject";
import { SunModel } from "./3d/SunModel";
import { allCelestialObjects } from "@/data/planets";

export function SolarSystem() {
  // Only render first 3 planets (Mercury, Venus, Earth) for MVP
  const firstThreePlanets = allCelestialObjects.slice(0, 3);

  return (
    <>
      <color attach="background" args={["#0a0e27"]} />

      <ambientLight intensity={0.15} />

      <Stars
        radius={500}
        depth={80}
        count={8000}
        factor={8}
        saturation={0.15}
        fade
        speed={0.3}
      />

      <SunModel />

      {firstThreePlanets.map((objectData) => (
        <CelestialObject key={objectData.name} data={objectData} />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={100}
        zoomSpeed={0.8}
        rotateSpeed={0.5}
        target={[0, 0, 0]}
      />
    </>
  );
}
