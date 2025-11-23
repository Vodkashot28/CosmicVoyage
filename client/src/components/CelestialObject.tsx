import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Text } from "@react-three/drei";
import * as THREE from "three";
import { toast } from "sonner";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { useAudio } from "@/lib/stores/useAudio";
import type { PlanetData } from "@/data/planets";
import { planetsData } from "@/data/planets";

interface CelestialObjectProps {
  data: PlanetData;
}

export function CelestialObject({ data }: CelestialObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
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
  const orbitalTilt = data.orbitalInclination || 0;
  const isAsteroid = data.type === "asteroid";
  
  useFrame((state) => {
    if (inclinationGroupRef.current) {
      inclinationGroupRef.current.rotation.x = orbitalTilt;
    }
    
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += data.orbitSpeed * 0.001;
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.y += data.rotationSpeed;
      
      if (hovered && !discovered && canDiscover) {
        meshRef.current.scale.setScalar(data.size * 1.2);
      } else {
        meshRef.current.scale.setScalar(data.size);
      }
    }
  });
  
  const handleClick = () => {
    if (!discovered && canDiscover) {
      discoverPlanet(data.name);
      playSuccess();
      toast.success(`Discovered ${data.name}!`, {
        description: `You earned ${data.tokenReward} STAR tokens`,
      });
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
          <mesh
            ref={meshRef}
            position={[data.orbitRadius, 0, 0]}
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
            <mesh position={[data.orbitRadius, 0, 0]}>
              <torusGeometry args={[data.size * 1.4, data.size * 0.15, 16, 100]} />
              <meshBasicMaterial
                color={getRingColor()}
                transparent
                opacity={canDiscover ? 0.6 : 0.2}
                wireframe={false}
              />
            </mesh>
          )}
          
          {/* Outer glow for discovered objects */}
          {discovered && !isAsteroid && (
            <mesh position={[data.orbitRadius, 0, 0]}>
              <sphereGeometry args={[data.size * 1.3, 32, 32]} />
              <meshBasicMaterial
                color={getRingColor()}
                transparent
                opacity={0.15}
                side={THREE.BackSide}
              />
            </mesh>
          )}

          {/* Asteroid discovered glow */}
          {discovered && isAsteroid && (
            <mesh position={[data.orbitRadius, 0, 0]}>
              <boxGeometry args={[1.2, 1.0, 0.8]} />
              <meshBasicMaterial
                color={getRingColor()}
                transparent
                opacity={0.2}
                side={THREE.BackSide}
              />
            </mesh>
          )}
        </group>
      </group>
    </>
  );
}
