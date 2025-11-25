import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Text } from "@react-three/drei";
import * as THREE from "three";
import { toast } from "sonner";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { useAudio } from "@/lib/stores/useAudio";
import type { PlanetData } from "@/data/planets";
import { planetsData } from "@/data/planets";

interface PlanetProps {
  data: PlanetData;
}

export function Planet({ data }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const inclinationGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  const { 
    discoverPlanet, 
    isPlanetDiscovered, 
    canDiscoverPlanet,
    setSelectedPlanet 
  } = useSolarSystem();
  const { playSuccess, playHit } = useAudio();
  
  const discovered = isPlanetDiscovered(data.name);
  const canDiscover = canDiscoverPlanet(data.name);
  
  // Use orbital inclination to create varied orbital planes
  const orbitalTilt = data.orbitalInclination || 0;
  
  useFrame((state) => {
    // Inclination group: tilts the entire orbital plane
    if (inclinationGroupRef.current) {
      inclinationGroupRef.current.rotation.x = orbitalTilt;
    }
    
    // Orbit group: handles the orbital motion around the sun
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += data.orbitSpeed * 0.001;
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
      glowRef.current.scale.setScalar(discovered ? 1.4 * pulse : 1.3 * pulse);
    }
  });
  
  const handleClick = () => {
    if (!discovered && canDiscover) {
      discoverPlanet(data.name);
      playSuccess();
      toast.success(`Discovered ${data.name}!`, {
        description: `You earned ${data.tokenReward} StarTokens`,
      });
    } else if (discovered) {
      setSelectedPlanet(data.name);
    } else if (!canDiscover) {
      playHit();
      const planetIndex = planetsData.findIndex(p => p.name === data.name);
      const previousPlanet = planetIndex > 0 ? planetsData[planetIndex - 1] : null;
      if (previousPlanet) {
        toast.error(`Discover ${previousPlanet.name} first!`, {
          description: `Planets must be discovered in order`,
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
    // Assign ring colors based on planet
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
    return ringColors[data.name] || "#FFD700";
  };
  
  const shouldHaveRing = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"].includes(data.name);
  
  return (
    <>
      {/* Inclination group: tilts the entire orbital plane */}
      <group ref={inclinationGroupRef}>
        <Line
          points={orbitPoints}
          color={canDiscover ? "#FFFFFF" : "#444444"}
          lineWidth={0.5}
          transparent
          opacity={0.3}
        />
        
        {/* Orbit group: handles orbital motion */}
        <group ref={orbitGroupRef}>
          <mesh
            ref={meshRef}
            position={[data.orbitRadius, 0, 0]}
            onClick={handleClick}
            onPointerOver={() => canDiscover && setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color={getPlanetColor()}
              emissive={discovered ? "#FFD700" : "#000000"}
              emissiveIntensity={discovered ? 0.3 : 0}
              metalness={0.3}
              roughness={0.5}
              toneMapped={true}
            />
          </mesh>
          
          {/* Glowing halo ring */}
          <mesh position={[data.orbitRadius, 0, 0]}>
            <torusGeometry args={[data.size * 1.4, data.size * 0.15, 16, 100]} />
            <meshBasicMaterial
              color={getRingColor()}
              transparent
              opacity={canDiscover ? 0.6 : 0.2}
              wireframe={false}
            />
          </mesh>
          
          {/* Outer glow halo with pulsing animation */}
          {discovered && (
            <mesh ref={glowRef} position={[data.orbitRadius, 0, 0]}>
              <sphereGeometry args={[data.size * 1.3, 32, 32]} />
              <meshBasicMaterial
                color={getRingColor()}
                transparent
                opacity={0.25}
                side={THREE.BackSide}
              />
            </mesh>
          )}
        </group>
      </group>
    </>
  );
}
