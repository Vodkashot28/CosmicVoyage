import sunGlb from "@/assets/solar/sun.glb.asset.json";
import mercuryGlb from "@/assets/solar/mercury.glb.asset.json";

export type Body = {
  id: string;
  name: string;
  /** Visual radius in scene units */
  radius: number;
  /** Orbit radius from sun, 0 for sun itself */
  orbit: number;
  /** Radians per second around the sun */
  orbitSpeed: number;
  /** Radians per second on own axis */
  spinSpeed: number;
  /** Axial tilt in radians */
  tilt: number;
  /** Short fact for HUD */
  fact: string;
  /** Initial orbital angle in radians */
  phase: number;
  /** Fallback color if no GLB yet */
  color: string;
  /** Optional GLB url (set once assets uploaded) */
  glbUrl?: string;
};

export const BODIES: Body[] = [
  {
    id: "sun", name: "Sun", radius: 4, orbit: 0, orbitSpeed: 0, spinSpeed: 0.05,
    tilt: 0.12, phase: 0, color: "#ffb347", glbUrl: sunGlb.url,
    fact: "Our G-type main-sequence star — 99.86% of the system's mass.",
  },
  {
    id: "mercury", name: "Mercury", radius: 0.45, orbit: 7, orbitSpeed: 0.42, spinSpeed: 0.02,
    tilt: 0.03, phase: 0.3, color: "#a8a29e", glbUrl: mercuryGlb.url,
    fact: "Smallest planet. A year lasts just 88 Earth days.",
  },
  {
    id: "venus", name: "Venus", radius: 0.75, orbit: 9.5, orbitSpeed: 0.32, spinSpeed: -0.005,
    tilt: 3.09, phase: 1.1, color: "#e0c097",
    fact: "Rotates backwards. Surface hot enough to melt lead.",
  },
  {
    id: "earth", name: "Earth", radius: 0.8, orbit: 12.5, orbitSpeed: 0.26, spinSpeed: 0.5,
    tilt: 0.41, phase: 2.0, color: "#5b9bd5",
    fact: "The only world known to harbor life.",
  },
  {
    id: "mars", name: "Mars", radius: 0.55, orbit: 15.5, orbitSpeed: 0.21, spinSpeed: 0.48,
    tilt: 0.44, phase: 2.8, color: "#c1440e",
    fact: "Home to Olympus Mons — the tallest volcano in the solar system.",
  },
  {
    id: "jupiter", name: "Jupiter", radius: 2.2, orbit: 21, orbitSpeed: 0.13, spinSpeed: 1.1,
    tilt: 0.05, phase: 3.7, color: "#d2a679",
    fact: "A failed star. More massive than all other planets combined.",
  },
  {
    id: "saturn", name: "Saturn", radius: 1.9, orbit: 27, orbitSpeed: 0.097, spinSpeed: 1.0,
    tilt: 0.47, phase: 4.5, color: "#e8d8a0",
    fact: "Famous rings span 280,000 km but are only ~10 m thick.",
  },
  {
    id: "uranus", name: "Uranus", radius: 1.3, orbit: 32, orbitSpeed: 0.068, spinSpeed: 0.7,
    tilt: 1.71, phase: 5.3, color: "#9fd9e6",
    fact: "Tilted on its side — its poles face the sun.",
  },
  {
    id: "neptune", name: "Neptune", radius: 1.25, orbit: 37, orbitSpeed: 0.054, spinSpeed: 0.72,
    tilt: 0.49, phase: 0.8, color: "#3a6dd1",
    fact: "Supersonic winds reach 2,100 km/h — fastest in the system.",
  },
];

export const SUN     = BODIES[0];
export const PLANETS = BODIES.slice(1);
