import { create } from 'zustand';
import { planetsData } from '@/data/planets';

export interface TourStop {
  name: string;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  heading: string;
  fact: string;
}

const PLANETS = planetsData.filter((p) => p.type === 'planet');

export const TOUR_STOPS: TourStop[] = [
  {
    name: 'Sun',
    orbitRadius: 0,
    orbitSpeed: 0,
    size: 4,
    heading: 'The Sun',
    fact: 'Our star contains 99.86% of the Solar System\'s total mass and generates energy through nuclear fusion at its core.',
  },
  ...PLANETS.map((p) => ({
    name: p.name,
    orbitRadius: p.orbitRadius,
    orbitSpeed: p.orbitSpeed,
    size: p.size,
    heading: p.name,
    fact: p.facts.description,
  })),
];

interface TourState {
  paused: boolean;
  currentIdx: number;
  setPaused: (v: boolean) => void;
  advance: () => void;
  reset: () => void;
}

export const useTourStore = create<TourState>((set, get) => ({
  paused: false,
  currentIdx: 0,
  setPaused: (v) => set({ paused: v }),
  advance: () =>
    set({ currentIdx: (get().currentIdx + 1) % TOUR_STOPS.length }),
  reset: () => set({ currentIdx: 0 }),
}));
