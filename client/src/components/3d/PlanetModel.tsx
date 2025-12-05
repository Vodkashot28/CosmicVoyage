import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetModelProps {
  name: string;
  modelPath: string;
  scale: number;
  rotationSpeed: number;
  position: [number, number, number];
  color?: string;
  // --- VISUAL ENHANCEMENT 1: AXIAL TILT ---
  tiltAngle?: number; 
}

const PLANET_COLORS: Record<string, number> = {
  Mercury: 0x8B7D6B,
  Venus: 0xFFC649,
  Earth: 0x3B82F6,
  Mars: 0xFF6B35,
  Jupiter: 0xC88B3A,
  Saturn: 0xE5D699,
  Uranus: 0x4FD0E7,
  Neptune: 0x4166F5,
  Pluto: 0xBBBBBB,
};

// Preload existing models
try {
  useGLTF.preload('/assets/models/mercury.glb');
  useGLTF.preload('/assets/models/venus.glb');
  useGLTF.preload('/assets/models/earth.glb');
} catch (e) {
  // Preload may fail - that's ok
}

export default function PlanetModel({
  name,
  modelPath,
  scale,
  rotationSpeed,
  position,
  color,
  tiltAngle = 0, // Default tilt to 0 if not provided
}: PlanetModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Always call useGLTF unconditionally
  let gltf: any = null;
  let loadError = false;

  try {
    console.log(`[PlanetModel] 🔄 Attempting to load ${name} from ${modelPath}`);
    gltf = useGLTF(modelPath);
    if (gltf?.scene) {
<<<<<<< HEAD
      // console.log(`[PlanetModel] ✅ Loaded ${name} successfully`);
    }
  } catch (err) {
    loadError = true;
    // console.log(`[PlanetModel] ⚠️ Failed to load ${name}, using fallback sphere`);
=======
      console.log(`[PlanetModel] ✅ Successfully loaded ${name} model`);
    } else {
      console.warn(`[PlanetModel] ⚠️ Model loaded but no scene found for ${name}`);
    }
  } catch (err) {
    loadError = true;
    console.error(`[PlanetModel] ❌ Failed to load ${name}:`, err);
>>>>>>> a1a131e (Restored to 'e3cfd37ca5cfda57e811b540d61d9c3a3c5a6f9b')
  }

  useEffect(() => {
    if (!groupRef.current || !gltf?.scene) return;

    try {
      const clonedScene = gltf.scene.clone();

      // Compute bounding box and auto-scale model to match expected size
      const box = new THREE.Box3().setFromObject(clonedScene);
      const size = new THREE.Vector3();
      box.getSize(size);
      const currentDiameter = Math.max(size.x, size.y, size.z);

      // Target diameter in scene units
      const desiredDiameter = 2;
      const scaleFactor = currentDiameter > 0.01 ? (desiredDiameter / currentDiameter) : 1;

      // Apply scale
      clonedScene.scale.setScalar(scaleFactor);

      // Center the model at origin
      const center = new THREE.Vector3();
      box.getCenter(center);
      clonedScene.position.sub(center.multiplyScalar(scaleFactor));

      clonedScene.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          // VISUAL ENHANCEMENT: Ensure shadows are enabled on the mesh
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
            child.material.side = THREE.FrontSide;
          }
        }
      });
      
      // Clear previous children and add the new, processed scene
      groupRef.current.clear();
      groupRef.current.add(clonedScene);
      
      // VISUAL ENHANCEMENT 1: Apply the fixed axial tilt to the group
      // The useFrame rotation will now spin the entire tilted group
      groupRef.current.rotation.x = tiltAngle; 

      setModelLoaded(true);
      // console.log(`✅ [Model] Loaded ${name} (scale: ${scaleFactor.toFixed(2)}x)`);
    } catch (err) {
      console.warn(`[Model] Failed to process ${name}:`, err);
      setModelLoaded(false);
    }
  }, [gltf?.scene, name, tiltAngle]); // Added tiltAngle dependency

  useFrame(() => {
    if (groupRef.current && rotationSpeed !== 0) {
      // Continuous rotation around the now-tilted Y-axis
      groupRef.current.rotation.y += rotationSpeed; 
    }
  });

  // If model loaded successfully, render it
  if (modelLoaded && gltf?.scene) {
    return (
      <group ref={groupRef} position={position} scale={scale}>
        {/* VISUAL ENHANCEMENT 2: Atmosphere Glow for Earth */}
        {name === 'Earth' && (
          <mesh scale={[1.05, 1.05, 1.05]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhongMaterial
              color={0x3B82F6} // A blue color matching the Earth's blue
              transparent={true}
              opacity={0.15} // Low opacity for a subtle glow
              side={THREE.BackSide} // Render from the inside out (halo effect)
              depthWrite={false} // Prevents rendering artifacts
            />
          </mesh>
        )}
      </group>
    );
  }

  // Fallback: colored sphere with planet-specific color (unchanged)
  const planetColor = color ? parseInt(color.replace('#', '0x')) : (PLANET_COLORS[name] || 0x4a9eff);

  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={planetColor}
        metalness={0.3}
        roughness={0.7}
        emissive={planetColor}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}
