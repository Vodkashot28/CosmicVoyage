import { OrbitControls, Stars } from "@react-three/drei";
import { CelestialObject } from "./CelestialObject";
import { SunModel } from "./3d/SunModel";
import { allCelestialObjects } from "@/data/planets";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { useEffect, useState } from "react";

export function SolarSystem() {
  const { ownedNFTs, discoveredPlanets } = useSolarSystem();
  const [activeMintsCount, setActiveMintsCount] = useState(0);

  // Debug logging on mount
  useEffect(() => {
    console.log('[SolarSystem] 🚀 Mounted', {
      ownedNFTs: ownedNFTs.length,
      discoveredPlanets: discoveredPlanets.length,
      allCelestialObjects: allCelestialObjects.length
    });
    return () => console.log('[SolarSystem] 🛑 Unmounting');
  }, []);

  // TEMPORARY: Show all celestial objects to test .glb models
  // Filter to show only planets and dwarf planets (exclude asteroids for now)
  const visiblePlanets = allCelestialObjects.filter(celestialObject => {
    return celestialObject.type === "planet" || celestialObject.type === "dwarfPlanet";
  });

  useEffect(() => {
    console.log('[SolarSystem] 🪐 Visible planets:', {
      count: visiblePlanets.length,
      names: visiblePlanets.map(p => p.name)
    });
  }, [visiblePlanets]);

  // Listen for mint events to trigger dynamic loading
  useEffect(() => {
    const handleMint = (event: Event) => {
      const customEvent = event as CustomEvent;
      const planetName = customEvent.detail?.planetName;
      if (planetName) {
        console.log(`🪐 Mint event received: ${planetName}`);
        setActiveMintsCount(prev => prev + 1);
      }
    };

    window.addEventListener('celestialMinted', handleMint as EventListener);
    return () => window.removeEventListener('celestialMinted', handleMint as EventListener);
  }, []);

  console.log('[SolarSystem] 🎨 Rendering with', { visiblePlanetsCount: visiblePlanets.length });

  return (
    <>
      <color attach="background" args={["#0a0e27"]} />

      {/* Essential lighting for visibility */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} distance={300} />
      <directionalLight position={[10, 10, 10]} intensity={0.5} />

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

      {/* Render all planets and dwarf planets with .glb models */}
      {visiblePlanets.map((celestialObject) => (
        <CelestialObject key={celestialObject.name} data={celestialObject} />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={200}
        zoomSpeed={0.8}
        rotateSpeed={0.5}
        target={[0, 0, 0]}
      />
    </>
  );
}