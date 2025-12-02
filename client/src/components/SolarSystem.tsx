import { OrbitControls, Stars } from "@react-three/drei";
import { CelestialObject } from "./CelestialObject";
import { SunModel } from "./3d/SunModel";
import { allCelestialObjects } from "@/data/planets";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { useEffect, useState } from "react";

export function SolarSystem() {
  const { ownedNFTs, discoveredPlanets } = useSolarSystem();
  const [activeMintsCount, setActiveMintsCount] = useState(0);
  
  // Filter to show only minted planets + discovered planets that can be interacted with
  const visiblePlanets = allCelestialObjects.filter(celestialObject => {
    // Always show if minted as NFT
    if (ownedNFTs.includes(celestialObject.name)) return true;
    // Also show discovered planets for interaction
    if (discoveredPlanets.some(d => d.planetName === celestialObject.name)) return true;
    // Show first planet (Mercury) to start discovery
    if (celestialObject.name === "Mercury" && discoveredPlanets.length === 0) return true;
    return false;
  });

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

      {/* Render only minted planets (with .glb models) + discovered planets for interaction */}
      {visiblePlanets.map((celestialObject) => (
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
