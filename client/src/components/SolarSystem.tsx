import { OrbitControls, Stars } from "@react-three/drei";
import { Sun } from "./Sun";
import { CelestialObject } from "./CelestialObject";
import { allCelestialObjects } from "@/data/planets";

export function SolarSystem() {
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

      <Sun />

      {allCelestialObjects.map((objectData) => (
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
