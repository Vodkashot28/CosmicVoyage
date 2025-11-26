import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitLineProps {
  radius: number;
  discovered: boolean;
  isOwned: boolean;
  segments?: number;
  color?: string;
}

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
    float pulse = sin(time * 2.0) * 0.5 + 0.5;
    float intensity = 1.0;
    
    if (!discovered) {
      intensity = 0.2 + pulse * 0.1;
    } else if (isOwned) {
      intensity = 0.8 + pulse * 0.3;
    } else {
      intensity = 0.5 + pulse * 0.2;
    }
    
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
  const geometry = useMemo(() => {
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
    
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints(orbitPoints);
    return geo;
  }, [radius, segments]);

  const baseColor = useMemo(() => new THREE.Color(color), [color]);

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
    });
  }, [baseColor, discovered, isOwned]);

  // Update uniforms each frame
  useFrame((state) => {
    material.uniforms.time.value = state.clock.elapsedTime;
    material.uniforms.discovered.value = discovered;
    material.uniforms.isOwned.value = isOwned;
  });

  return <line geometry={geometry} material={material} />;
}
