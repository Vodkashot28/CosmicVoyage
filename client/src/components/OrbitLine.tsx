import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitLineProps {
  radius: number;
  discovered: boolean;
  isOwned: boolean; // NFT minted/owned
  segments?: number;
  color?: string;
}

// Shader for energy trail effect
const energyTrailVertexShader = `
  uniform float time;
  varying float vDistance;
  
  void main() {
    vDistance = distance(vec3(position.x, position.y, 0.0), vec3(0.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const energyTrailFragmentShader = `
  uniform float time;
  uniform vec3 baseColor;
  uniform bool discovered;
  uniform bool isOwned;
  varying float vDistance;
  
  void main() {
    // Pulsating glow effect
    float pulse = sin(time * 2.0) * 0.5 + 0.5;
    
    // Create gradient fade along orbit
    float intensity = 1.0;
    if (!discovered) {
      // Undiscovered: faint, broken appearance
      intensity = 0.2 + pulse * 0.1;
    } else if (isOwned) {
      // Owned: vibrant, energized glow
      intensity = 0.8 + pulse * 0.3;
    } else {
      // Discovered but not owned: moderate glow
      intensity = 0.5 + pulse * 0.2;
    }
    
    // Add shimmer effect
    float shimmer = sin(time * 3.0 + vDistance * 5.0) * 0.3 + 0.7;
    
    vec3 finalColor = baseColor * intensity * shimmer;
    float alpha = intensity;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function OrbitLine({
  radius,
  discovered,
  isOwned,
  segments = 256,
  color = '#00D9FF',
}: OrbitLineProps) {
  const lineRef = useRef<THREE.Line>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate orbit points
  const points = useMemo(() => {
    const orbitPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      orbitPoints.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        )
      );
    }
    return orbitPoints;
  }, [radius, segments]);

  // Convert hex color to THREE.Color
  const hexToRGB = (hex: string): THREE.Color => {
    return new THREE.Color(hex);
  };

  const baseColor = hexToRGB(color);

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: baseColor },
        discovered: { value: discovered },
        isOwned: { value: isOwned },
      },
      vertexShader: energyTrailVertexShader,
      fragmentShader: energyTrailFragmentShader,
      transparent: true,
      linewidth: 5,
    });
  }, [baseColor, discovered, isOwned]);

  // Update shader uniforms each frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.discovered.value = discovered;
      materialRef.current.uniforms.isOwned.value = isOwned;
    }
  });

  // Create geometry from points
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <line ref={lineRef} material={material}>
      <bufferGeometry attach="geometry" args={[]} onUpdate={(self) => self.setFromPoints(points)} />
    </line>
  );
}
