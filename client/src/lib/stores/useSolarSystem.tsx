import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { typedPlanetsData } from '$lib/data/typedPlanetsData';
import type { Discovery, SolarSystemState, PlanetDataWithOrder } from '$lib/types';

function validateDiscoveries(discoveries: Discovery[]): Discovery[] {
  if (!Array.isArray(discoveries)) {
    console.warn("Invalid discoveries data, resetting to empty array");
    return [];
  }

  const discoveryMap = new Map<string, Discovery>();
  for (const discovery of discoveries) {
    if (discovery.planetName && !discoveryMap.has(discovery.planetName)) {
      discoveryMap.set(discovery.planetName, discovery);
    }
  }

  const validDiscoveries: Discovery[] = [];

  for (const planet of typedPlanetsData) {
    const discovery = discoveryMap.get(planet.name);
    if (!discovery) break;

    validDiscoveries.push({
      ...discovery,
      tokensEarned: planet.tokenReward
    });
  }

  if (validDiscoveries.length !== discoveries.length) {
    console.warn(`Validated ${validDiscoveries.length} of ${discoveries.length} discoveries in correct order`);
  }

  return validDiscoveries;
}

function calculateTotalTokens(discoveries: Discovery[]): number {
  return discoveries.reduce((sum, d) => {
    const planet = typedPlanetsData.find(p => p.name === d.planetName);
    return sum + (planet?.tokenReward || 0);
  }, 0);
}

export const useSolarSystem = create<SolarSystemState>()(
  persist(
    (set, get) => ({
      discoveredPlanets: [],
      totalTokens: 0,
      bonusTokens: 0,
      walletAddress: null,
      selectedPlanet: null,
      completedChallenges: [],
      claimedRewards: false,
      mintedNFTCount: 0,
      ownedNFTs: [],
      lastPassiveTokenUpdate: Date.now(),
      passiveTokensGenerated: 0,
      lastDailyLoginTime: 0,
      dailyLoginStreak: 0,
      totalDailyLoginsEarned: 0,
      refinementLevels: {},
      immortalStatus: false,
      immortalityScore: 0,
      totalStarBurned: 0,
      orbitalOffsets: {},

      isPlanetDiscovered: (planetName: string) =>
        get().discoveredPlanets.some(d => d.planetName === planetName),

      canDiscoverPlanet: (planetName: string) => {
        const planet = typedPlanetsData.find(p => p.name === planetName);
        if (!planet) return false;
        return get().discoveredPlanets.length === planet.discoveryOrder - 1;
      },

      discoverPlanet: async (planetName: string) => {
        const state = get();
        const planet = typedPlanetsData.find(p => p.name === planetName) as PlanetDataWithOrder | undefined;

        if (!planet || state.isPlanetDiscovered(planetName)) return;
        if (!state.canDiscoverPlanet(planetName)) {
          console.warn(`Cannot discover ${planetName} yet`);
          return;
        }

        const discovery: Discovery = {
          planetName,
          timestamp: Date.now(),
          tokensEarned: planet.tokenReward,
          nftMinted: false
        };

        if (state.walletAddress) {
          try {
            await fetch('/api/discovery/record', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                walletAddress: state.walletAddress,
                planetName,
                discoveryOrder: planet.discoveryOrder,
                tokensEarned: planet.tokenReward,
              }),
            });
          } catch (error) {
            console.error('Failed to sync discovery with backend:', error);
          }
        }

        set(state => ({
          discoveredPlanets: [...state.discoveredPlanets, discovery]
        }));

        console.log(`Discovered ${planetName}! Must mint NFT to claim ${planet.tokenReward} STAR tokens`);
      },

      claimDiscoveryReward: (planetName: string) => {
        const state = get();
        const planet = typedPlanetsData.find(p => p.name === planetName);
        if (!planet || !state.isPlanetDiscovered(planetName)) {
          console.warn(`Cannot claim reward for ${planetName}`);
          return false;
        }

        if (state.completedChallenges.includes(planetName)) {
          console.warn(`Reward for ${planetName} already claimed`);
          return false;
        }

        set(state => ({
          completedChallenges: [...state.completedChallenges, planetName],
          totalTokens: state.totalTokens + planet.tokenReward
        }));

        console.log(`Claimed ${planet.tokenReward} STAR tokens for ${planetName}`);
        return true;
      },

      updatePassiveTokens: () => {
        const state = get();
        const now = Date.now();
        const elapsedHours = Math.floor((now - state.lastPassiveTokenUpdate) / (1000 * 60 * 60));
        const earned = elapsedHours * 5;

        set({
          passiveTokensGenerated: state.passiveTokensGenerated + earned,
          lastPassiveTokenUpdate: now
        });
      },

      updateImmortalityScore: () => {
        const state = get();
        const score = state.discoveredPlanets.length * 10 + state.dailyLoginStreak * 2;
        set({ immortalityScore: score });
      }
    }),
    {
      name: 'solar-system-store'
    }
  )
);
