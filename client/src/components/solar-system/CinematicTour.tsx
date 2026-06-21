/**
 * CinematicTour — solar-system edition
 *
 * Exports:
 *   CinematicCameraController  — mount inside <Canvas>
 *   TourHUD                    — mount outside <Canvas> as HTML overlay
 */

import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { damp3 } from 'maath/easing';
import { useTourStore } from '@/lib/stores/useTourStore';
import { BODIES } from './bodies';

const FLY   = 2;
const ARC   = 3;
const PULL  = 1;
const TOTAL = FLY + ARC + PULL;

// ── Camera controller (inside Canvas) ─────────────────────────────────────────
export function CinematicCameraController() {
  const { paused, currentIdx, advance } = useTourStore();
  const { camera } = useThree();

  const smoothLook = useRef(new THREE.Vector3());
  const phaseStart = useRef<number | null>(null);
  const prevIdx    = useRef(currentIdx);

  useEffect(() => {
    if (prevIdx.current !== currentIdx) {
      phaseStart.current = null;
      prevIdx.current    = currentIdx;
    }
  }, [currentIdx]);

  useFrame((state, delta) => {
    if (paused) return;

    const t = state.clock.elapsedTime;
    if (phaseStart.current === null) phaseStart.current = t;
    const elapsed = t - phaseStart.current;

    if (elapsed >= TOTAL) { advance(); return; }

    const body  = BODIES[currentIdx] ?? BODIES[0];
    const viewR = Math.max(body.radius * 8, 12);

    // Live orbital position
    const angle     = body.orbitSpeed * t + body.phase;
    const planetPos = new THREE.Vector3(
      Math.cos(angle) * body.orbit,
      0,
      Math.sin(angle) * body.orbit,
    );

    const desired = new THREE.Vector3();

    if (elapsed < FLY) {
      desired.set(planetPos.x + viewR * 0.8, viewR * 0.5, planetPos.z + viewR);
      damp3(camera.position as any, desired as any, 2.5, delta);
    } else if (elapsed < FLY + ARC) {
      const sweep = ((elapsed - FLY) / ARC) * Math.PI * 0.75;
      desired.set(
        planetPos.x + Math.cos(sweep) * viewR,
        viewR * 0.35,
        planetPos.z + Math.sin(sweep) * viewR,
      );
      damp3(camera.position as any, desired as any, 4, delta);
    } else {
      desired.set(planetPos.x + viewR * 1.7, viewR * 0.8, planetPos.z + viewR * 1.7);
      damp3(camera.position as any, desired as any, 2, delta);
    }

    damp3(smoothLook.current as any, planetPos as any, 4, delta);
    camera.lookAt(smoothLook.current);
  });

  return null;
}

// ── HUD overlay (HTML, outside Canvas) ────────────────────────────────────────
export function TourHUD() {
  const { paused, currentIdx, setPaused } = useTourStore();

  const [dispIdx, setDispIdx] = useState(currentIdx);
  const [vis, setVis]         = useState(true);

  useEffect(() => {
    setVis(false);
    const id = setTimeout(() => { setDispIdx(currentIdx); setVis(true); }, 240);
    return () => clearTimeout(id);
  }, [currentIdx]);

  const body = BODIES[dispIdx] ?? BODIES[0];

  return (
    <>
      {/* Planet info — bottom-left */}
      <div style={{
        position: 'fixed', bottom: '5.5rem', left: '1.25rem',
        maxWidth: '22rem', pointerEvents: 'none',
        opacity: vis ? 1 : 0, transition: 'opacity 0.28s ease', zIndex: 40,
      }}>
        <div style={{
          background: 'rgba(0,0,16,0.74)', border: '1px solid rgba(99,179,237,0.22)',
          borderRadius: '0.75rem', padding: '0.9rem 1.1rem', backdropFilter: 'blur(12px)',
        }}>
          <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#63b3ed', marginBottom: '0.2rem' }}>
            Now Viewing
          </p>
          <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
            {body.name}
          </h2>
          <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.68)' }}>
            {body.fact}
          </p>
          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.65rem', flexWrap: 'wrap' }}>
            {BODIES.map((_, i) => (
              <div key={i} style={{
                width: i === dispIdx ? '1.3rem' : '0.42rem',
                height: '0.42rem', borderRadius: '9999px',
                background: i === dispIdx ? '#63b3ed' : 'rgba(255,255,255,0.22)',
                transition: 'all 0.35s ease',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Pause / Resume — top-right */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50 }}>
        <button
          onClick={() => setPaused(!paused)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.42rem 0.9rem', borderRadius: '9999px',
            border: '1px solid rgba(99,179,237,0.32)', background: 'rgba(0,0,16,0.68)',
            color: '#e2e8f0', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer',
            backdropFilter: 'blur(8px)', letterSpacing: '0.02em',
          }}
        >
          {paused ? '▶\u2009Resume Tour' : '⏸\u2009Pause Tour'}
        </button>
      </div>
    </>
  );
}
