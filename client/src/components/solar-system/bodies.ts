// Canonical config for every body rendered in the solar system.
// `glbPath` is resolved from the asset JSON: cdn URL takes priority over local path.
// To swap to a CDN, update the corresponding src/assets/solar/*.glb.asset.json file.

export interface BodyConfig {
  name: string;
  slug: string;
  /** Visual scale applied after auto-normalisation (scene units) */
  radius: number;
  /** Distance from the Sun (scene units) */
  orbitRadius: number;
  /** Orbit angular speed (radians per second) */
  orbitSpeed: number;
  /** Axial spin speed (radians per second) */
  rotationSpeed: number;
  /** Axial tilt (radians) */
  axialTilt: number;
  /** Hex fallback colour used when the GLB hasn't loaded yet */
  color: string;
  /** Resolved GLB path — prefer CDN when set, fall back to local public/ file */
  glbPath: string;
  /** One-sentence fact shown in the HUD */
  fact: string;
}

// ── Asset resolution ─────────────────────────────────────────────────────────
// Each JSON file carries { glb: "/models/…", cdn: null | "https://…" }.
// We import them statically so Vite can tree-shake unused assets.
import sunJson      from '@/assets/solar/sun.glb.asset.json';
import mercuryJson  from '@/assets/solar/mercury.glb.asset.json';
import venusJson    from '@/assets/solar/venus.glb.asset.json';
import earthJson    from '@/assets/solar/earth.glb.asset.json';
import marsJson     from '@/assets/solar/mars.glb.asset.json';
import jupiterJson  from '@/assets/solar/jupiter.glb.asset.json';
import saturnJson   from '@/assets/solar/saturn.glb.asset.json';
import uranusJson   from '@/assets/solar/uranus.glb.asset.json';
import neptuneJson  from '@/assets/solar/neptune.glb.asset.json';

const r = (j: { glb: string; cdn: string | null }) => j.cdn ?? j.glb;

// ── Sun ──────────────────────────────────────────────────────────────────────
export const SUN: BodyConfig = {
  name:          'Sun',
  slug:          'sun',
  radius:        4,
  orbitRadius:   0,
  orbitSpeed:    0,
  rotationSpeed: 0.05,
  axialTilt:     0.126,  // ~7.25°
  color:         '#FFA500',
  glbPath:       r(sunJson),
  fact:          'Our star accounts for 99.86 % of the Solar System\'s total mass and fuses 600 million tonnes of hydrogen every second.',
};

// ── 8 main planets ───────────────────────────────────────────────────────────
export const PLANETS: BodyConfig[] = [
  {
    name: 'Mercury', slug: 'mercury',
    radius: 0.4,  orbitRadius: 8,  orbitSpeed: 0.14, rotationSpeed: 0.01,
    axialTilt: 0.034, color: '#8B7D6B', glbPath: r(mercuryJson),
    fact: 'Mercury is the smallest planet and has almost no atmosphere, so temperatures swing from −180 °C to 430 °C.',
  },
  {
    name: 'Venus',   slug: 'venus',
    radius: 0.95, orbitRadius: 12, orbitSpeed: 0.09, rotationSpeed: 0.008,
    axialTilt: 2.64,  color: '#FFC649', glbPath: r(venusJson),
    fact: 'A day on Venus (243 Earth days) is longer than its year (225 days) — and it rotates backwards.',
  },
  {
    name: 'Earth',   slug: 'earth',
    radius: 1.0,  orbitRadius: 16, orbitSpeed: 0.05, rotationSpeed: 0.02,
    axialTilt: 0.41,  color: '#3B82F6', glbPath: r(earthJson),
    fact: 'Earth is the only known planet harbouring life, with liquid water covering 71 % of its surface.',
  },
  {
    name: 'Mars',    slug: 'mars',
    radius: 0.53, orbitRadius: 21, orbitSpeed: 0.035, rotationSpeed: 0.018,
    axialTilt: 0.44,  color: '#E27B58', glbPath: r(marsJson),
    fact: 'Mars hosts Olympus Mons, the tallest volcano in the Solar System at ~22 km above the surrounding plains.',
  },
  {
    name: 'Jupiter', slug: 'jupiter',
    radius: 2.5,  orbitRadius: 30, orbitSpeed: 0.015, rotationSpeed: 0.04,
    axialTilt: 0.055, color: '#C88B3A', glbPath: r(jupiterJson),
    fact: 'Jupiter\'s Great Red Spot is a storm wider than Earth that has raged for over 350 years.',
  },
  {
    name: 'Saturn',  slug: 'saturn',
    radius: 2.2,  orbitRadius: 39, orbitSpeed: 0.01, rotationSpeed: 0.038,
    axialTilt: 0.47,  color: '#FAD5A5', glbPath: r(saturnJson),
    fact: 'Saturn\'s rings span up to 282,000 km but are only about 10 m thick on average.',
  },
  {
    name: 'Uranus',  slug: 'uranus',
    radius: 1.8,  orbitRadius: 47, orbitSpeed: 0.007, rotationSpeed: 0.03,
    axialTilt: 1.745, color: '#4FD0E7', glbPath: r(uranusJson),
    fact: 'Uranus is tilted 98° and effectively orbits the Sun on its side, giving each pole 42 years of continuous sunlight.',
  },
  {
    name: 'Neptune', slug: 'neptune',
    radius: 1.7,  orbitRadius: 54, orbitSpeed: 0.005, rotationSpeed: 0.032,
    axialTilt: 0.495, color: '#4166F5', glbPath: r(neptuneJson),
    fact: 'Neptune has the strongest winds in the Solar System, reaching 2,100 km/h — faster than sound on Earth.',
  },
];

export const BODIES: BodyConfig[] = [SUN, ...PLANETS];
