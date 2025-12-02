// Token Economy System - Earning, Minting, and Burning

// ============================================
// STAR TOKEN CONFIGURATION
// ============================================
export const STAR_TOKEN = {
  name: "STAR Token",
  symbol: "STAR",
  logo: "⭐",
  description: "The utility token for Solar System Explorer. Earn STAR by discovering planets and completing challenges.",

  // Supply
  totalSupply: 1_000_000_000,
  decimals: 0,
  supplyType: "fixed",

  // Allocation
  allocation: {
    gameplayRewards: 400_000_000,
    burnReserve: 200_000_000,
    liquidityDex: 100_000_000,
    devTreasury: 100_000_000,
    daoGovernance: 100_000_000,
    marketingPartnerships: 50_000_000,
    communityAirdrops: 50_000_000,
  },

  // Distribution
  distribution: {
    discovery: "45%",
    challenges: "20%",
    dailyLogin: "10%",
    passiveIncome: "15%",
    eventRewards: "10%",
  },

  // Burn Mechanics
  burnMechanics: {
    estimatedMonthlyBurn: { min: 5_000_000, max: 10_000_000 },
    deflationCycleYears: { min: 200, max: 400 },
    prestigeLoop: "Burning STAR unlocks rare cosmetics, NFT variants, and exclusive lore",
    economicImpact: "Increases token scarcity and value over time",
  },

  // Progression
  gameProgression: {
    earlyGame: "Abundant STAR rewards, low burn costs, focus on education",
    midGame: "Balanced earning vs. burning, passive income acceleration",
    lateGame: "Scarcity-driven trading, prestige crafting, DAO governance",
  },

  mythicFraming:
    "A billion stars scattered across the cosmos, each one a fragment of discovery, ownership, and legacy. Burn them to bend reality. Earn them to immortalize your journey.",
} as const;

// ============================================
// ECONOMY INTERFACE
// ============================================
export interface TokenEconomy {
  name: string;
  discoveryReward: number;
  challengeBonus: number;
  nftMintCost: number;
  tokenBurnUtility: string;
}

export const TOKEN_ECONOMY: TokenEconomy = {
  name: STAR_TOKEN.name,
  discoveryReward: 10,
  challengeBonus: 5,
  nftMintCost: 0,
  tokenBurnUtility: "cosmicboost",
};

// ============================================
// EARNING MECHANICS
// ============================================
export const TOKEN_EARNING_MECHANICS = {
  planetDiscovery: {
    mercury: 10,
    venus: 15,
    earth: 20,
    mars: 25,
    jupiter: 50,
    saturn: 75,
    uranus: 100,
    neptune: 150,
  },
  challengeRewards: {
    firstLight: 10,
    spaceExplorer: 25,
    solarMaster: 100,
  },
  baseTokenPerDiscovery: 10,
  bonusPerChallenge: 5,
};

// ============================================
// BURN UTILITIES
// ============================================
export const TOKEN_BURN_UTILITIES = {
  cosmicBoost: { cost: 25, effect: "2x token rewards for 24 hours", duration: 24, name: "Cosmic Boost" },
  voidJump: { cost: 50, effect: "Instantly jump to next planet", duration: 1, name: "Void Jump" },
  celestialShield: { cost: 30, effect: "Protect your tokens from loss", duration: 24, name: "Celestial Shield" },
  asteroidMining: { cost: 40, effect: "Mine bonus tokens from asteroids", duration: 1, name: "Asteroid Mining" },
  dwarfPlanetUnlock: { cost: 200, effect: "Unlock Pluto as a dwarf planet NFT", duration: 1, name: "Dwarf Planet Unlock" },
  supernovaMode: { cost: 75, effect: "3x token multiplier for 1 hour", duration: 1, name: "Supernova Mode" },
  wormholeMode: { cost: 100, effect: "Skip to any discovered planet", duration: 1, name: "Wormhole Mode" },
  cosmicForgeMode: { cost: 150, effect: "Create custom planet NFTs", duration: 1, name: "Cosmic Forge Mode" },
} as const;

// ============================================
// NFT MINTING
// ============================================
export const NFT_MINTING = {
  costInTokens: 0,
  gasRequired: "50000000",
  requiresWallet: true,
  metadata: {
    includeGLTF: true,
    storage: "ipfs",
  },
};

// ============================================
// ECONOMY FUNCTIONS
// ============================================
export function calculateTokensEarned(
  discoveredCount: number,
  challengesCompleted: number,
  boostedRewards: boolean = false
): number {
  const discoveries = Object.values(TOKEN_EARNING_MECHANICS.planetDiscovery)
    .slice(0, discoveredCount)
    .reduce((a, b) => a + b, 0);

  const challenges = challengesCompleted * TOKEN_EARNING_MECHANICS.bonusPerChallenge;
  const total = discoveries + challenges;
  return boostedRewards ? Math.floor(total * 2) : total;
}

export function canAffordAction(
  currentTokens: number,
  action: "mint-nft" | "cosmic-boost" | "void-jump" | "celestial-shield"
): boolean {
  const costs = {
    "mint-nft": NFT_MINTING.costInTokens,
    "cosmic-boost": TOKEN_BURN_UTILITIES.cosmicBoost.cost,
    "void-jump": TOKEN_BURN_UTILITIES.voidJump.cost,
    "celestial-shield": TOKEN_BURN_UTILITIES.celestialShield.cost,
  };
  return currentTokens >= costs[action];
}

export function getBurnUtilityInfo(utilityId: string) {
  const utilities: Record<string, any> = {
    "cosmic-boost": TOKEN_BURN_UTILITIES.cosmicBoost,
    "void-jump": TOKEN_BURN_UTILITIES.voidJump,
    "celestial-shield": TOKEN_BURN_UTILITIES.celestialShield,
    "asteroid-mining": TOKEN_BURN_UTILITIES.asteroidMining,
    "dwarf-planet-unlock": TOKEN_BURN_UTILITIES.dwarfPlanetUnlock,
    "supernova-mode": TOKEN_BURN_UTILITIES.supernovaMode,
    "wormhole-mode": TOKEN_BURN_UTILITIES.wormholeMode,
    "cosmic-forge-mode": TOKEN_BURN_UTILITIES.cosmicForgeMode,
  };
  return utilities[utilityId];
}

// ============================================
// CONTRACT ADDRESSES
// ============================================
export const TOKEN_CONTRACT = {
  name: STAR_TOKEN.name,
  symbol: STAR_TOKEN.symbol,
  decimals: STAR_TOKEN.decimals,
  totalSupply: STAR_TOKEN.totalSupply,
  deployerAddress: import.meta.env.VITE_NFT_DEPLOYER,
  testnetAddress: import.meta.env.VITE_STAR_TOKEN_ADDRESS,
  mainnetAddress: import.meta.env.VITE_TOKEN_MAINNET_ADDRESS,
} as const;
