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
      {/* Deep space gradient background */}
      <color attach="background" args={["#050815"]} />
      
      {/* Cinematic lighting setup */}
      <ambientLight intensity={0.08} color="#4a5a8a" />
      
      {/* Main sun light - warm golden */}
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#FDB813" distance={200} decay={1.5} />
      
      {/* Key light - soft fill from top */}
      <directionalLight 
        position={[50, 40, 30]} 
        intensity={0.6}
        color="#ffffff"
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Rim light - purple/blue accent */}
      <directionalLight 
        position={[-30, 10, -30]} 
        intensity={0.4}
        color="#8b5cf6"
      />
      
      {/* Volumetric back light - nebula glow */}
      <pointLight position={[0, 50, -100]} intensity={1.2} color="#6366f1" distance={300} />

      {/* Enhanced starfield with depth */}
      <Stars
        radius={400}
        depth={100}
        count={12000}
        factor={6}
        saturation={0.2}
        fade
        speed={0.2}
      />

      {/* Sun with enhanced glow */}
      <SunModel />

      {/* Render visible celestial objects */}
      {visiblePlanets.length > 0 ? (
        visiblePlanets.map((celestialObject) => (
          <CelestialObject key={celestialObject.name} data={celestialObject} />
        ))
      ) : (
        <mesh position={[16, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color="#8B7D6B"
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
      )}

      {/* Smooth camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={120}
        zoomSpeed={0.6}
        rotateSpeed={0.4}
        panSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
        target={[0, 0, 0]}
      />
    </>
  );
}
