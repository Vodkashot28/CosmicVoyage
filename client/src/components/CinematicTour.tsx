import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { damp3 } from 'maath/easing';
import { useTourStore, TOUR_STOPS } from '@/lib/stores/useTourStore';
import { useSolarSystem } from '@/lib/stores/useSolarSystem';

// Phase durations in seconds
const FLY_DUR  = 2;   // camera flies to framing position
const ARC_DUR  = 3;   // slow orbit arc around planet
const PULL_DUR = 1;   // pull back before next stop
const TOTAL    = FLY_DUR + ARC_DUR + PULL_DUR; // 6 s per stop

// ─── In-Canvas camera controller ─────────────────────────────────────────────
// Mount this inside <Canvas>; it drives the camera each frame via useFrame.
export function CinematicCameraController() {
  const { paused, currentIdx, advance } = useTourStore();
  const { getOrbitalOffset, initializeOrbitalOffsets } = useSolarSystem();
  const { camera } = useThree();

  // Smoothed look-at point (we damp3 this before calling camera.lookAt)
  const smoothLook = useRef(new THREE.Vector3(0, 0, 0));
  // Phase start timestamp (clock.elapsedTime when this stop began)
  const phaseStart = useRef<number | null>(null);
  // Prev idx so we detect changes
  const prevIdx = useRef(currentIdx);

  // Ensure orbital offsets exist
  useEffect(() => { initializeOrbitalOffsets(); }, []);

  // Reset phase timer whenever the active stop changes
  useEffect(() => {
    if (prevIdx.current !== currentIdx) {
      phaseStart.current = null;
      prevIdx.current = currentIdx;
    }
  }, [currentIdx]);

  useFrame((state, delta) => {
    if (paused) return;

    const t = state.clock.elapsedTime;

    // Initialise phase start on first frame of a stop
    if (phaseStart.current === null) phaseStart.current = t;

    const elapsed = t - phaseStart.current;

    // Move to the next stop when time is up
    if (elapsed >= TOTAL) {
      advance();
      return;
    }

    const stop = TOUR_STOPS[currentIdx];

    // ------- Compute planet's current world position -------------------------
    const planetPos = new THREE.Vector3(0, 0, 0);
    if (stop.orbitRadius > 0) {
      const off   = getOrbitalOffset(stop.name);
      const angle = off + stop.orbitSpeed * 0.1 * t;
      planetPos.set(
        Math.cos(angle) * stop.orbitRadius,
        0,
        Math.sin(angle) * stop.orbitRadius,
      );
    }

    // View radius: keep the planet nicely in-frame regardless of size
    const viewR = Math.max(stop.size * 7, 14);

    // ------- Desired camera position by phase --------------------------------
    const desired = new THREE.Vector3();

    if (elapsed < FLY_DUR) {
      // Phase 0 — fly in to a framing position (diagonal offset above planet)
      desired.set(
        planetPos.x + viewR * 0.8,
        planetPos.y + viewR * 0.5,
        planetPos.z + viewR,
      );
      damp3(camera.position as any, desired as any, 2.5, delta);

    } else if (elapsed < FLY_DUR + ARC_DUR) {
      // Phase 1 — slow arc 135° around the planet
      const arcT  = (elapsed - FLY_DUR) / ARC_DUR;          // 0 → 1
      const angle = arcT * Math.PI * 0.75;                   // 0 → ~135°
      desired.set(
        planetPos.x + Math.cos(angle) * viewR,
        planetPos.y + viewR * 0.35,
        planetPos.z + Math.sin(angle) * viewR,
      );
      damp3(camera.position as any, desired as any, 4, delta);

    } else {
      // Phase 2 — pull back before handing off to next stop
      desired.set(
        planetPos.x + viewR * 1.7,
        planetPos.y + viewR * 0.8,
        planetPos.z + viewR * 1.7,
      );
      damp3(camera.position as any, desired as any, 2, delta);
    }

    // ------- Smooth look-at --------------------------------------------------
    damp3(smoothLook.current as any, planetPos as any, 4, delta);
    camera.lookAt(smoothLook.current);
  });

  return null;
}

// ─── HTML overlay ────────────────────────────────────────────────────────────
// Mount this OUTSIDE <Canvas> (plain React).
export function TourHUD() {
  const { paused, currentIdx, setPaused } = useTourStore();
  const stop = TOUR_STOPS[currentIdx];

  // Remount HUD text on each planet change to replay the fade-in
  const [displayIdx, setDisplayIdx] = useState(currentIdx);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Brief fade-out → swap content → fade-in
    setVisible(false);
    const t = setTimeout(() => {
      setDisplayIdx(currentIdx);
      setVisible(true);
    }, 250);
    return () => clearTimeout(t);
  }, [currentIdx]);

  const displayStop = TOUR_STOPS[displayIdx];

  return (
    <>
      {/* ── Planet info — bottom-left ─────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          bottom: '6rem',   // above the tab bar
          left: '1.25rem',
          maxWidth: '22rem',
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
          opacity: visible ? 1 : 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,12,0.72)',
            border: '1px solid rgba(99,179,237,0.25)',
            borderRadius: '0.75rem',
            padding: '0.9rem 1.1rem',
            backdropFilter: 'blur(10px)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#63b3ed',
              marginBottom: '0.25rem',
            }}
          >
            Now Viewing
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '0.4rem',
            }}
          >
            {displayStop.heading}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '0.8rem',
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            {displayStop.fact}
          </p>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.7rem' }}>
            {TOUR_STOPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === displayIdx ? '1.4rem' : '0.45rem',
                  height: '0.45rem',
                  borderRadius: '9999px',
                  background: i === displayIdx ? '#63b3ed' : 'rgba(255,255,255,0.25)',
                  transition: 'all 0.4s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Pause / Resume — top-right ────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: paused ? '1rem' : '3.5rem', // avoid collapsing-menu button
          zIndex: 50,
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        <button
          onClick={() => setPaused(!paused)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '9999px',
            border: '1px solid rgba(99,179,237,0.35)',
            background: 'rgba(0,0,12,0.65)',
            color: '#e2e8f0',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            letterSpacing: '0.03em',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.background = 'rgba(30,30,80,0.8)')
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.background = 'rgba(0,0,12,0.65)')
          }
        >
          {paused ? '▶\u2009Resume Tour' : '⏸\u2009Pause Tour'}
        </button>
      </div>
    </>
  );
}
