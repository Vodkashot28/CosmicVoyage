import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Text } from "@react-three/drei";
import * as THREE from "three";
import { toast } from "sonner";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { useAudio } from "@/lib/stores/useAudio";
import type { PlanetData } from "@/data/planets";
import { planetsData } from "@/data/planets";
import { PlanetMintModal } from "./PlanetMintModal";
import { OrbitalInfo } from "./OrbitalInfo";

interface CelestialObjectProps {
  data: PlanetData;
}

export function CelestialObject({ data }: CelestialObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const inclinationGroupRef = useRef<THREE.Group>(null);
  const axialTiltGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  
  const { 
    discoverPlanet, 
    isPlanetDiscovered, 
    canDiscoverPlanet,
    setSelectedPlanet,
    getOrbitalOffset,
    initializeOrbitalOffsets
  } = useSolarSystem();
  const { playSuccess, playHit } = useAudio();
  
  const discovered = isPlanetDiscovered(data.name);
  const canDiscover = canDiscoverPlanet(data.name);
  
  // Initialize orbital offsets on first render
  useMemo(() => {
    initializeOrbitalOffsets();
  }, [initializeOrbitalOffsets]);
  
  const orbitalTilt = data.orbitalInclination || 0;
  const axialTilt = data.axialTilt || 0;
  const isAsteroid = data.type === "asteroid";
  const orbitalOffset = getOrbitalOffset(data.name);
  
  useFrame((state) => {
    if (inclinationGroupRef.current) {
      inclinationGroupRef.current.rotation.x = orbitalTilt;
    }
    
    // Orbit group: handles the orbital motion around the sun (with random starting offset)
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y = orbitalOffset + data.orbitSpeed * 0.001 * state.clock.elapsedTime;
    }
    
    // Axial tilt group: applies the planet's rotation axis tilt
    if (axialTiltGroupRef.current) {
      axialTiltGroupRef.current.rotation.z = axialTilt;
    }
    
    if (meshRef.current) {
      // Enhanced rotation: faster when hovering
      const rotationSpeed = hovered && canDiscover ? data.rotationSpeed * 2 : data.rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed;
      
      if (hovered && !discovered && canDiscover) {
        meshRef.current.scale.setScalar(data.size * 1.3);
      } else {
        meshRef.current.scale.setScalar(data.size);
      }
    }
    
    // Pulsing glow effect
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
      glowRef.current.scale.setScalar(discovered ? (isAsteroid ? 1.3 : 1.4) * pulse : 1.3 * pulse);
    }
  });
  
  const handleClick = () => {
    if (!discovered && canDiscover) {
      // Mark planet as discovered (view it)
      discoverPlanet(data.name);
      playSuccess();
      
      // Open minting modal - user must confirm and mint to get rewards
      toast.info(`${data.name} discovered!`, {
        description: `Confirm minting to claim ${data.tokenReward} STAR tokens`,
      });
      setShowMintModal(true);
    } else if (discovered) {
      setSelectedPlanet(data.name);
    } else if (!canDiscover) {
      playHit();
      const objectIndex = planetsData.findIndex(p => p.name === data.name);
      const previousObject = objectIndex > 0 ? planetsData[objectIndex - 1] : null;
      if (previousObject) {
        toast.error(`Discover ${previousObject.name} first!`, {
          description: `Must unlock sequentially`,
        });
      }
    }
  };
  
  const orbitPoints = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    orbitPoints.push(
      new THREE.Vector3(
        Math.cos(angle) * data.orbitRadius,
        0,
        Math.sin(angle) * data.orbitRadius
      )
    );
  }
  
  const getEmissiveIntensity = () => {
    if (!canDiscover) return 0;
    if (discovered) return 0.4;
    return 0.7;
  };
  
  const getPlanetColor = () => {
    if (!canDiscover) return "#1a1a1a";
    return data.color;
  };
  
  const getRingColor = () => {
    const ringColors: Record<string, string> = {
      "Mercury": "#FFD700",
      "Venus": "#FFD700",
      "Earth": "#00D9FF",
      "Mars": "#FF8C00",
      "Jupiter": "#FFD700",
      "Saturn": "#FFD700",
      "Uranus": "#00D9FF",
      "Neptune": "#0099FF"
    };
    return ringColors[data.name] || data.color;
  };
  
  const shouldHaveRing = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"].includes(data.name);
  const isAsteroidLike = data.type === "asteroid" || data.type === "dwarfPlanet";
  
  return (
    <>
      <group ref={inclinationGroupRef}>
        <Line
          points={orbitPoints}
          color={canDiscover ? "#FFFFFF" : "#444444"}
          lineWidth={0.5}
          transparent
          opacity={isAsteroidLike ? 0.1 : 0.3}
        />
        
        <group ref={orbitGroupRef}>
          <group ref={axialTiltGroupRef} position={[data.orbitRadius, 0, 0]}>
            <mesh
              ref={meshRef}
              onClick={handleClick}
              onPointerOver={() => canDiscover && setHovered(true)}
              onPointerOut={() => setHovered(false)}
            >
            {isAsteroid ? (
              // Asteroid: box geometry for irregular shape
              <boxGeometry args={[1, 0.8, 0.6]} />
            ) : (
              // Planet/Dwarf: sphere
              <sphereGeometry args={[1, 32, 32]} />
            )}
            <meshStandardMaterial
              color={getPlanetColor()}
              emissive={discovered ? getRingColor() : "#000000"}
              emissiveIntensity={discovered ? 0.3 : 0}
              metalness={isAsteroid ? 0.6 : 0.3}
              roughness={isAsteroid ? 0.7 : 0.5}
              toneMapped={true}
            />
            </mesh>
            
            {/* Glowing halo ring for planets/dwarfs */}
            {!isAsteroid && (
              <mesh>
                <torusGeometry args={[data.size * 1.4, data.size * 0.15, 16, 100]} />
                <meshBasicMaterial
                  color={getRingColor()}
                  transparent
                  opacity={canDiscover ? 0.6 : 0.2}
                  wireframe={false}
                />
              </mesh>
            )}
            
            {/* Outer glow for discovered objects with pulsing animation */}
            {discovered && !isAsteroid && (
              <mesh ref={glowRef}>
                <sphereGeometry args={[data.size * 1.3, 32, 32]} />
                <meshBasicMaterial
                  color={getRingColor()}
                  transparent
                  opacity={0.25}
                  side={THREE.BackSide}
                />
              </mesh>
            )}

            {/* Asteroid discovered glow with pulsing */}
            {discovered && isAsteroid && (
              <mesh ref={glowRef}>
                <boxGeometry args={[1.2, 1.0, 0.8]} />
                <meshBasicMaterial
                  color={getRingColor()}
                  transparent
                  opacity={0.3}
                  side={THREE.BackSide}
                />
              </mesh>
            )}
          </group>
        </group>
      </group>
      
      {/* Orbital information on hover */}
      <OrbitalInfo data={data} hovered={hovered} />
      
      {/* Minting Modal - shown after discovery */}
      <PlanetMintModal
        planet={discovered ? data : null}
        isOpen={showMintModal}
        onClose={() => setShowMintModal(false)}
        onMintConfirm={() => {
          setShowMintModal(false);
        }}
      />
    </>
  );
}
