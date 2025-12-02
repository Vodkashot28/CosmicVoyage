// Planet NFT Contract Integration
// Handles interaction with the Planet NFT collection on TON blockchain
// @ton/core is lazy-loaded only when needed to avoid Buffer polyfill issues

// Function to get collection address at runtime (avoids process.env access at module load time)
export function getCollectionAddress(): string {
  const envAddress = import.meta.env.VITE_PLANET_NFT_ADDRESS;
  if (!envAddress) {
    throw new Error("Planet NFT collection address not set in environment variables");
  }
  return envAddress;
}

export const PLANET_NFT_CONFIG = {
  name: "Solar System Planets",
  symbol: "PLANET",
  description: "Discover and own planets in the Solar System Explorer game",

  get collectionAddress() {
    return getCollectionAddress();
  },
  collectionMainnet: "0:PLANET_NFT_MAINNET_ADDRESS",

  deployerAddress: import.meta.env.VITE_NFT_DEPLOYER,
  baseMetadataURI: "https://solarsystemexplorer.com/nft/",
  royaltyPercent: 5,
  royaltyDenominator: 100,
};

export const TON_CONFIG = {
  testnet: {
    endpoint: "https://testnet.toncenter.com/api/v2/",
    explorerUrl: "https://testnet.tonscan.org",
  },
};

// Interfaces
export interface PlanetNFT {
  planetName: string;
  tokenId: number;
  metadataURI: string;
  timestamp: number;
  discoveryOrder: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  glowColor: string;
  traits: { size: number; orbitRadius: number };
}

export interface NFTMintParams {
  planetName: string;
  receiverAddress: string;
  discoveryOrder: number;
  glowColor: string;
}

export interface NFTTransferParams {
  nftId: number;
  fromAddress: string;
  toAddress: string;
}

export const DEPLOYER_ADDRESS = import.meta.env.VITE_NFT_DEPLOYER;
export const CONTRACT_ADDRESS = getCollectionAddress();

// Rarity helpers
export function getPlanetRarity(discoveryOrder: number): "common" | "rare" | "epic" | "legendary" {
  if (discoveryOrder === 1) return "common";
  if (discoveryOrder <= 3) return "rare";
  if (discoveryOrder <= 6) return "epic";
  return "legendary";
}

export function getAsteroidRarity(asteroidName: string): "common" | "uncommon" | "rare" | "epic" | "legendary" {
  const asteroidRarities: Record<string, string> = {
    Vesta: "common",
    Pallas: "common",
    Juno: "uncommon",
    Hygiea: "uncommon",
    Astraea: "uncommon",
    Apophis: "rare",
    Bennu: "rare",
    Itokawa: "rare",
    Eros: "epic",
    Psyche: "epic",
    Varda: "epic",
    Oumuamua: "legendary",
    "Comet Halley (Core)": "legendary",
    Chiron: "legendary",
  };
  return (asteroidRarities[asteroidName] as any) || "common";
}

export function getGlowColorForPlanet(planetName: string): string {
  const glowColors: Record<string, string> = {
    Mercury: "#FFD700",
    Venus: "#FFD700",
    Earth: "#00D9FF",
    Mars: "#FF8C00",
    Jupiter: "#FFD700",
    Saturn: "#FFD700",
    Uranus: "#00D9FF",
    Neptune: "#0099FF",
  };
  return glowColors[planetName] || "#FFD700";
}

// Metadata generation
export function generatePlanetNFTMetadata(planetName: string, discoveryOrder: number, planetData: any) {
  const rarity = getPlanetRarity(discoveryOrder);
  const glowColor = getGlowColorForPlanet(planetName);

  return {
    name: `Planet ${planetName} #${discoveryOrder}`,
    description: `A discovered planet in the Solar System Explorer game. Rarity: ${rarity}. Earns 0.5 STAR per hour.`,
    image: `${PLANET_NFT_CONFIG.baseMetadataURI}${planetName.toLowerCase()}.png`,
    attributes: [
      { trait_type: "Planet Name", value: planetName },
      { trait_type: "Discovery Order", value: discoveryOrder.toString() },
      { trait_type: "Rarity", value: rarity },
      { trait_type: "Glow Color", value: glowColor },
      { trait_type: "Size", value: planetData.size.toString() },
      { trait_type: "Orbit Radius", value: planetData.orbitRadius.toString() },
      { trait_type: "Token Reward", value: planetData.tokenReward.toString() },
      { trait_type: "Passive Income", value: "+0.5 STAR/hour" },
    ],
    properties: {
      earnsPassiveIncome: true,
      passiveIncomeRate: "0.5 STAR/hour",
      transferable: true,
    },
  };
}

// Mint & transfer messages
export async function createNFTMintMessage(params: NFTMintParams) {
  const { Address, beginCell, toNano } = await import("@ton/core");

  const body = beginCell()
    .storeUint(0x642bda77, 32)
    .storeUint(0, 64)
    .storeStringTail(params.planetName)
    .storeAddress(Address.parse(params.receiverAddress))
    .storeCoins(toNano("1"))
    .endCell();

  return {
    to: PLANET_NFT_CONFIG.collectionAddress,
    amount: toNano("0.1").toString(),
    body,
  };
}

export async function createNFTTransferMessage(params: NFTTransferParams) {
  const { Address, beginCell, toNano } = await import("@ton/core");

  const body = beginCell()
    .storeUint(0x5fcc3d14, 32)
    .storeUint(0, 64)
    .storeInt(params.nftId, 256)
    .storeAddress(Address.parse(params.toAddress))
    .storeAddress(Address.parse(params.fromAddress))
    .storeUint(0, 1)
    .storeCoins(toNano("0.001"))
    .storeUint(0, 1)
    .endCell();

  return {
    to: PLANET_NFT_CONFIG.collectionAddress,
    amount: toNano("0.05").toString(),
    body,
  };
}

// Legacy mint helper
export function createNFTMintMessageLegacy(planetName: string, discoveryOrder: number, walletAddress: string) {
  return {
    to: PLANET_NFT_CONFIG.collectionAddress,
    amount: "100000000",
    init: null,
    body: {
      $$type: "Mint" as const,
      planet: planetName,
      receiver: walletAddress,
      amount: 1,
    },
  };
}

// Set bonuses
export interface SetBonus {
  name: string;
  description: string;
  nftCount: number;
  dailyBonus: number;
}

export function calculateSetBonuses(ownedPlanets: string[]): SetBonus[] {
  const innerPlanets = ["Mercury", "Venus", "Earth", "Mars"];
  const outerPlanets = ["Jupiter", "Saturn", "Uranus", "Neptune"];

  const bonuses: SetBonus[] = [];

  if (innerPlanets.every(p => ownedPlanets.includes(p))) {
    bonuses.push({
      name: "Inner Planets Master",
      description: "Own all inner planets",
      nftCount: 4,
      dailyBonus: 25,
    });
  }

  if (outerPlanets.every(p => ownedPlanets.includes(p))) {
    bonuses.push({
      name: "Outer Planets Master",
      description: "Own all outer planets",
      nftCount: 4,
      dailyBonus: 50,
    });
  }

  if (innerPlanets.every(p => ownedPlanets.includes(p)) && outerPlanets.every(p => ownedPlanets.includes(p))) {
    bonuses.push({
      name: "Solar System Explorer",
      description: "Own all 8 planets",
      nftCount: 8,
      dailyBonus: 100,
    });
  }

  return bonuses;
}

// Display formatting
export function formatNFTName(planetName: string, discoveryOrder: number): string {
  const rarity = getPlanetRarity(discoveryOrder);
  const rarityEmoji: Record<string, string> = {
    common: "⚪",
    rare: "🔵",
    epic: "🟣",
    legendary: "🟡",
  };
  return `${rarityEmoji[rarity]} ${planetName} NFT #${discoveryOrder}`;
}

// Contract ABI
export const PLANET_NFT_ABI = {
  methods: {
    mint: ["planet:String", "receiver:Address", "amount:Int"],
    transfer: ["nftId:Int", "receiver:Address"],
    burn: ["nftId:Int"],
    getNFTOwner: ["nftId:Int", "returns:Address"],
    getNFTMetadataURI: ["nftId:Int", "returns:String"],
    getCollectionInfo: ["returns:(String, String, String, Int, Int)"],
  },
};
