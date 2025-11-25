import { create } from "zustand";
import { persist } from "zustand/middleware";
import { planetsData } from "@/data/planets";
import { analytics, trackDiscovery, trackMint, trackPassiveIncome, trackDailyLogin, trackImmortalityTier } from "@/lib/analytics";

export interface Discovery {
  planetName: string;
  timestamp: number;
  tokensEarned: number;
  nftMinted?: boolean;
  nftTransactionHash?: string;
}

interface SolarSystemState {
  discoveredPlanets: Discovery[];
  totalTokens: number;
  bonusTokens: number;
  walletAddress: string | null;
  selectedPlanet: string | null;
  completedChallenges: string[];
  claimedRewards: boolean;
  mintedNFTCount: number;
  ownedNFTs: string[]; // planets minted as NFTs
  lastPassiveTokenUpdate: number; // timestamp of last passive token calculation
  passiveTokensGenerated: number; // total tokens from passive generation
  lastDailyLoginTime: number; // timestamp of last daily login claim
  dailyLoginStreak: number; // consecutive days logged in
  totalDailyLoginsEarned: number; // total STAR earned from daily logins
  refinementLevels: Record<string, number>; // planet -> refinement level
  immortalStatus: boolean; // achieved immortal collector status
  immortalityScore: number; // cumulative burn score from ledger
  totalStarBurned: number; // total STAR burned across all mechanics
  
  discoverPlanet: (planetName: string) => void;
  claimDiscoveryReward: (planetName: string) => boolean; // Award tokens after minting
  setWalletAddress: (address: string | null) => void;
  setSelectedPlanet: (planetName: string | null) => void;
  isPlanetDiscovered: (planetName: string) => boolean;
  canDiscoverPlanet: (planetName: string) => boolean;
  getNextPlanetToDiscover: () => string | null;
  completeChallenge: (challengeId: string) => void;
  isChallengeCompleted: (challengeId: string) => boolean;
  claimRewards: () => void;
  getTotalClaimableTokens: () => number;
  markNFTMinted: (planetName: string, txHash: string) => void;
  getNFTMintedCount: () => number;
  isNFTOwned: (planetName: string) => boolean;
  getPassiveTokenRate: () => number; // tokens per hour per NFT
  getPassiveIncomeFromNFTs: () => { tokensPerHour: number; nextUpdateTime: number };
  getSetBonusTokens: () => { innerPlanets: number; outerPlanets: number; allPlanets: number };
  collectPassiveTokens: () => void;
  resetProgress: () => void;
  validateAndFixState: () => void;
  claimDailyLogin: () => boolean; // returns true if claimed, false if already claimed today
  getStreakBonus: () => number; // returns bonus tokens based on current streak
  refineNFT: (planetName: string, starCost: number) => boolean; // Burn STAR for refinement
  getRefinementLevel: (planetName: string) => number;
  getRefinementYieldMultiplier: (planetName: string) => number; // 1.0 + 0.02 per level
  achieveImmortal: () => boolean; // Burn STAR + NFTs for prestige
  addImmortalityScore: (amount: number, burnType: string) => void; // Record burn to ledger
}

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
  
  for (let i = 0; i < planetsData.length; i++) {
    const planet = planetsData[i];
    const discovery = discoveryMap.get(planet.name);
    
    if (!discovery) {
      break;
    }
    
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
    const planet = planetsData.find(p => p.name === d.planetName);
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
      
      discoverPlanet: (planetName: string) => {
        const state = get();
        const planet = planetsData.find(p => p.name === planetName);
        
        if (!planet || state.isPlanetDiscovered(planetName)) {
          return;
        }
        
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
        
        set(state => ({
          discoveredPlanets: [...state.discoveredPlanets, discovery]
          // NOTE: Tokens NOT awarded on discovery - must mint NFT first!
        }));
        
        console.log(`Discovered ${planetName}! Must mint NFT to claim ${planet.tokenReward} STAR tokens`);
      },
      
      claimDiscoveryReward: (planetName: string) => {
        const state = get();
        const planet = planetsData.find(p => p.name === planetName);
        
        if (!planet || !state.isPlanetDiscovered(planetName)) {
          console.warn(`Cannot claim reward for ${planetName}`);
          return false;
        }
        
        // Award tokens for discovery
        set(state => ({
          totalTokens: state.totalTokens + planet.tokenReward
        }));
        
        console.log(`Claimed reward for ${planetName}! Earned ${planet.tokenReward} STAR tokens`);
        return true;
      },
      
      setWalletAddress: (address: string | null) => {
        set({ walletAddress: address });
        console.log(address ? "Wallet address connected" : "Wallet address disconnected");
      },
      
      setSelectedPlanet: (planetName: string | null) => {
        set({ selectedPlanet: planetName });
      },
      
      isPlanetDiscovered: (planetName: string): boolean => {
        const state = get();
        return state.discoveredPlanets.some(d => d.planetName === planetName);
      },
      
      canDiscoverPlanet: (planetName: string): boolean => {
        const state = get();
        const planetIndex = planetsData.findIndex(p => p.name === planetName);
        
        if (planetIndex === -1) return false;
        if (planetIndex === 0) return true; // Mercury is always available
        
        return state.isPlanetDiscovered(planetsData[planetIndex - 1].name);
      },
      
      getNextPlanetToDiscover: (): string | null => {
        const state = get();
        for (const planet of planetsData) {
          if (!state.isPlanetDiscovered(planet.name)) {
            return planet.name;
          }
        }
        return null;
      },
      
      completeChallenge: (challengeId: string) => {
        set(state => ({
          completedChallenges: [...state.completedChallenges, challengeId]
        }));
      },
      
      isChallengeCompleted: (challengeId: string): boolean => {
        const state = get();
        return state.completedChallenges.includes(challengeId);
      },
      
      claimRewards: () => {
        set({ claimedRewards: true });
      },
      
      getTotalClaimableTokens: (): number => {
        const state = get();
        return state.totalTokens + state.bonusTokens + state.passiveTokensGenerated;
      },
      
      markNFTMinted: (planetName: string, txHash: string) => {
        set(state => {
          const updatedDiscoveries = state.discoveredPlanets.map(d => 
            d.planetName === planetName 
              ? { ...d, nftMinted: true, nftTransactionHash: txHash }
              : d
          );
          
          return {
            discoveredPlanets: updatedDiscoveries,
            ownedNFTs: [...state.ownedNFTs, planetName],
            mintedNFTCount: state.mintedNFTCount + 1,
            lastPassiveTokenUpdate: Date.now()
          };
        });
      },
      
      getNFTMintedCount: (): number => {
        return get().mintedNFTCount;
      },
      
      isNFTOwned: (planetName: string): boolean => {
        return get().ownedNFTs.includes(planetName);
      },
      
      getPassiveTokenRate: (): number => {
        // Planets: 0.5/hour, Dwarf Planets: 0.75/hour
        const state = get();
        let rate = 0;
        
        for (const planetName of state.ownedNFTs) {
          const planet = planetsData.find(p => p.name === planetName);
          if (planet?.passiveIncomeRate) {
            rate += planet.passiveIncomeRate;
          }
        }
        
        return rate;
      },
      
      getPassiveIncomeFromNFTs: () => {
        const state = get();
        const tokensPerHour = state.getPassiveTokenRate();
        const nextUpdateTime = state.lastPassiveTokenUpdate + (3600 * 1000);
        
        return {
          tokensPerHour,
          nextUpdateTime
        };
      },
      
      getSetBonusTokens: () => {
        const state = get();
        const innerPlanets = ['Mercury', 'Venus', 'Earth', 'Mars'];
        const outerPlanets = ['Jupiter', 'Saturn', 'Uranus', 'Neptune'];
        
        const hasAllInner = innerPlanets.every(p => state.ownedNFTs.includes(p));
        const hasAllOuter = outerPlanets.every(p => state.ownedNFTs.includes(p));
        const hasAllPlanets = state.ownedNFTs.length === 8;
        
        return {
          innerPlanets: hasAllInner ? 25 : 0,
          outerPlanets: hasAllOuter ? 50 : 0,
          allPlanets: hasAllPlanets ? 100 : 0
        };
      },
      
      collectPassiveTokens: () => {
        const state = get();
        const income = state.getPassiveIncomeFromNFTs();
        const bonuses = state.getSetBonusTokens();
        
        // Check if enough time has passed (1 hour)
        const timeSinceLastUpdate = Date.now() - state.lastPassiveTokenUpdate;
        const hoursElapsed = timeSinceLastUpdate / (3600 * 1000);
        
        if (hoursElapsed >= 1) {
          const passiveTokens = Math.floor(income.tokensPerHour * hoursElapsed);
          const totalBonus = bonuses.innerPlanets + bonuses.outerPlanets + bonuses.allPlanets;
          const tokensToAdd = passiveTokens + totalBonus;
          
          set(state => ({
            totalTokens: state.totalTokens + tokensToAdd,
            passiveTokensGenerated: state.passiveTokensGenerated + tokensToAdd,
            lastPassiveTokenUpdate: Date.now()
          }));
          
          console.log(`Collected ${tokensToAdd} passive tokens from ${state.ownedNFTs.length} NFTs`);
        }
      },
      
      claimDailyLogin: (): boolean => {
        const state = get();
        const now = Date.now();
        const lastLogin = state.lastDailyLoginTime;
        const DAILY_REWARD = 10; // 10 STAR per day
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        
        // Check if 24 hours have passed since last login
        if (lastLogin && (now - lastLogin) < TWENTY_FOUR_HOURS) {
          console.log("Daily login already claimed today");
          return false;
        }
        
        // Calculate streak
        let newStreak = 1;
        if (lastLogin && (now - lastLogin) < TWENTY_FOUR_HOURS * 1.5) {
          // User logged in within 36 hours, so streak continues
          newStreak = state.dailyLoginStreak + 1;
        } else {
          // Streak broken, reset to 1
          newStreak = 1;
        }
        
        // Calculate streak bonus
        let bonusTokens = 0;
        if (newStreak === 7) {
          bonusTokens = 25; // 7-day bonus
        } else if (newStreak === 30) {
          bonusTokens = 100; // 30-day bonus
        }
        
        const totalReward = DAILY_REWARD + bonusTokens;
        
        set(state => ({
          totalTokens: state.totalTokens + totalReward,
          totalDailyLoginsEarned: state.totalDailyLoginsEarned + totalReward,
          lastDailyLoginTime: now,
          dailyLoginStreak: newStreak
        }));
        
        const bonusStr = bonusTokens > 0 ? ` + ${bonusTokens} bonus` : "";
        console.log(`Daily login claimed: +${DAILY_REWARD} STAR${bonusStr} (Day ${newStreak} streak)`);
        
        return true;
      },
      
      getStreakBonus: (): number => {
        const state = get();
        if (state.dailyLoginStreak === 7) {
          return 25;
        } else if (state.dailyLoginStreak === 30) {
          return 100;
        }
        return 0;
      },
      
      resetProgress: () => {
        set({
          discoveredPlanets: [],
          totalTokens: 0,
          bonusTokens: 0,
          selectedPlanet: null,
          completedChallenges: [],
          claimedRewards: false,
          mintedNFTCount: 0,
          ownedNFTs: [],
          lastPassiveTokenUpdate: Date.now(),
          passiveTokensGenerated: 0,
          lastDailyLoginTime: 0,
          dailyLoginStreak: 0,
          totalDailyLoginsEarned: 0
        });
        console.log('Progress reset');
      },
      
      validateAndFixState: () => {
        const state = get();
        const validatedDiscoveries = validateDiscoveries(state.discoveredPlanets);
        const recalculatedTokens = calculateTotalTokens(validatedDiscoveries);
        
        if (validatedDiscoveries.length !== state.discoveredPlanets.length || 
            recalculatedTokens !== state.totalTokens) {
          console.log("Validated and corrected persisted state");
          set({
            discoveredPlanets: validatedDiscoveries,
            totalTokens: recalculatedTokens
          });
        }
      },
      
      refineNFT: (planetName: string, starCost: number) => {
        const state = get();
        if (state.totalTokens < starCost) return false;
        
        const currentLevel = state.refinementLevels[planetName] || 0;
        if (currentLevel >= 8) return false;
        
        set(s => ({
          refinementLevels: { ...s.refinementLevels, [planetName]: currentLevel + 1 },
          totalTokens: s.totalTokens - starCost,
          totalStarBurned: s.totalStarBurned + starCost
        }));
        
        console.log(`Refined ${planetName} to level ${currentLevel + 1}`);
        return true;
      },
      
      getRefinementLevel: (planetName: string) => {
        return get().refinementLevels[planetName] || 0;
      },
      
      getRefinementYieldMultiplier: (planetName: string) => {
        const level = get().getRefinementLevel(planetName);
        return 1 + (level * 0.02);
      },
      
      achieveImmortal: () => {
        const state = get();
        if (state.immortalStatus || state.totalTokens < 2500) return false;
        
        set(s => ({
          immortalStatus: true,
          totalTokens: s.totalTokens - 2500,
          totalStarBurned: s.totalStarBurned + 2500,
          immortalityScore: s.immortalityScore + 7500
        }));
        
        console.log("Achieved Immortal Collector status!");
        return true;
      },
      
      addImmortalityScore: (amount: number, burnType: string) => {
        const multipliers: Record<string, number> = {
          refinement: 1.0,
          smb: 1.5,
          repair: 1.2,
          utility: 0.8,
          unification: 3.0
        };
        
        const multiplier = multipliers[burnType] || 1.0;
        set(s => ({
          immortalityScore: s.immortalityScore + Math.round(amount * multiplier * 100),
          totalStarBurned: s.totalStarBurned + amount
        }));
      }
    }),
    {
      name: "solar-system-storage",
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Failed to rehydrate state:", error);
            return;
          }
          if (state) {
            const validatedDiscoveries = validateDiscoveries(state.discoveredPlanets);
            const recalculatedTokens = calculateTotalTokens(validatedDiscoveries);
            
            if (validatedDiscoveries.length !== state.discoveredPlanets.length || 
                recalculatedTokens !== state.totalTokens) {
              console.log("Validated and corrected persisted state on rehydration");
              useSolarSystem.setState({
                discoveredPlanets: validatedDiscoveries,
                totalTokens: recalculatedTokens
              });
            }
          }
        };
      }
    }
  )
);
