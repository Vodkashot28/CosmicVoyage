import { OrbitControls, Stars } from "@react-three/drei";
import { CelestialObject } from "./CelestialObject";
import { SunModel } from "./3d/SunModel";
import { allCelestialObjects } from "@/data/planets";

export function SolarSystem() {
  return (
    <>
      <color attach="background" args={["#0a0e27"]} />

      <ambientLight intensity={0.15} />
      
      <directionalLight 
        position={[30, 20, 30]} 
        intensity={1.2} 
        castShadow 
      />

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

      {/* Render all celestial objects */}
      {allCelestialObjects.map((celestialObject) => (
        <CelestialObject key={celestialObject.name} data={celestialObject} />
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
