<<<<<<< HEAD
// TON NFT Contract Configuration for Planet NFTs
// Contract should be deployed on TON testnet
=======
// Planet NFT Contract Integration
// Handles interaction with the Planet NFT collection on TON blockchain

import { Address, beginCell, Cell, toNano } from "@ton/core";

export const PLANET_NFT_CONFIG = {
  // Collection Metadata
  name: "Solar System Planets",
  symbol: "PLANET",
  description: "Discover and own planets in the Solar System Explorer game",
  
  // Contract Addresses
  collectionAddress: process.env.VITE_PLANET_NFT_ADDRESS || "0:PLANET_NFT_ADDRESS_PLACEHOLDER",
  collectionMainnet: "0:PLANET_NFT_MAINNET_ADDRESS",
  
  // Deployer
  deployerAddress: "0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01",
  
  // Metadata Base URI
  baseMetadataURI: "https://solarsystemexplorer.com/nft/",
  
  // Royalty Configuration
  royaltyPercent: 5,
  royaltyDenominator: 100,
};
>>>>>>> 0b64c5e (Updates)

export const TON_CONFIG = {
  testnet: {
    endpoint: 'https://testnet.toncenter.com/api/v2/',
    explorerUrl: 'https://testnet.tonviewer.com'
  }
};

// Planet NFT Contract Interface
export interface PlanetNFT {
  planetName: string;
  tokenId: number;
  metadataURI: string;
  timestamp: number;
<<<<<<< HEAD
  traits: {
    size: number;
    orbitRadius: number;
    discoveryOrder: number;
  };
}

// Mock contract address - user should deploy their own
export const CONTRACT_ADDRESS = (import.meta.env.VITE_NFT_CONTRACT_ADDRESS as string) || 
  'kQDf5lsW7dnyJ9Bv3cU8S-RVRDq9i8YhXPePQvbKUJl70LB'; // Example placeholder

export const DEPLOYER_ADDRESS = '0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01';

// Helper to generate planet NFT metadata
export function generatePlanetNFTMetadata(planetName: string, discoveryOrder: number, planetData: any) {
  return {
    name: `Planet ${planetName}`,
    description: `Discovered planet ${planetName} in order #${discoveryOrder}`,
    image: `ipfs://QmPlanet${planetName}`, // Would point to actual IPFS image
=======
  discoveryOrder: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  glowColor: string;
  traits: {
    size: number;
    orbitRadius: number;
  };
}

// NFT Mint Parameters
export interface NFTMintParams {
  planetName: string;
  receiverAddress: string;
  discoveryOrder: number;
  glowColor: string;
}

// NFT Transfer Parameters
export interface NFTTransferParams {
  nftId: number;
  fromAddress: string;
  toAddress: string;
}

export const DEPLOYER_ADDRESS = '0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01';
export const CONTRACT_ADDRESS = process.env.VITE_PLANET_NFT_ADDRESS || PLANET_NFT_CONFIG.collectionAddress;

// Get rarity based on discovery order for planets/dwarf planets
// First discovered = easiest = common
// Last discovered = hardest = legendary
export function getPlanetRarity(discoveryOrder: number): "common" | "rare" | "epic" | "legendary" {
  if (discoveryOrder === 1) return "common"; // Mercury: everyone gets this
  if (discoveryOrder <= 3) return "rare"; // Venus, Earth
  if (discoveryOrder <= 6) return "epic"; // Mars, Jupiter, Saturn
  return "legendary"; // Uranus, Neptune, dwarf planets: rarest
}

// Get rarity for asteroids based on their tier
export function getAsteroidRarity(asteroidName: string): "common" | "uncommon" | "rare" | "epic" | "legendary" {
  const asteroidRarities: Record<string, string> = {
    // Common
    "Vesta": "common",
    "Pallas": "common",
    // Uncommon
    "Juno": "uncommon",
    "Hygiea": "uncommon",
    "Astraea": "uncommon",
    // Rare
    "Apophis": "rare",
    "Bennu": "rare",
    "Itokawa": "rare",
    // Epic
    "Eros": "epic",
    "Psyche": "epic",
    "Varda": "epic",
    // Legendary
    "Oumuamua": "legendary",
    "Comet Halley (Core)": "legendary",
    "Chiron": "legendary",
  };
  return (asteroidRarities[asteroidName] as any) || "common";
}

// Get glow color for planet
export function getGlowColorForPlanet(planetName: string): string {
  const glowColors: Record<string, string> = {
    "Mercury": "#FFD700",
    "Venus": "#FFD700",
    "Earth": "#00D9FF",
    "Mars": "#FF8C00",
    "Jupiter": "#FFD700",
    "Saturn": "#FFD700",
    "Uranus": "#00D9FF",
    "Neptune": "#0099FF",
  };
  return glowColors[planetName] || "#FFD700";
}

// Generate planet NFT metadata
export function generatePlanetNFTMetadata(planetName: string, discoveryOrder: number, planetData: any) {
  const rarity = getPlanetRarity(discoveryOrder);
  const glowColor = getGlowColorForPlanet(planetName);
  
  return {
    name: `Planet ${planetName} #${discoveryOrder}`,
    description: `A discovered planet in the Solar System Explorer game. Rarity: ${rarity}. Earns 0.5 STAR per hour.`,
    image: `${PLANET_NFT_CONFIG.baseMetadataURI}${planetName.toLowerCase()}.png`,
>>>>>>> 0b64c5e (Updates)
    attributes: [
      {
        trait_type: 'Planet Name',
        value: planetName
      },
      {
        trait_type: 'Discovery Order',
        value: discoveryOrder.toString()
      },
      {
<<<<<<< HEAD
=======
        trait_type: 'Rarity',
        value: rarity
      },
      {
        trait_type: 'Glow Color',
        value: glowColor
      },
      {
>>>>>>> 0b64c5e (Updates)
        trait_type: 'Size',
        value: planetData.size.toString()
      },
      {
        trait_type: 'Orbit Radius',
        value: planetData.orbitRadius.toString()
      },
      {
        trait_type: 'Token Reward',
        value: planetData.tokenReward.toString()
<<<<<<< HEAD
      }
    ]
  };
}

// Helper to construct NFT minting message
export function createNFTMintMessage(planetName: string, discoveryOrder: number, walletAddress: string) {
  return {
    to: CONTRACT_ADDRESS,
    amount: '50000000', // 0.05 TON for gas
    init: null,
    body: {
      $$type: 'MintPlanetNFT' as const,
      recipient: walletAddress,
      planetName,
      discoveryOrder
    }
  };
}
=======
      },
      {
        trait_type: 'Passive Income',
        value: '+0.5 STAR/hour'
      }
    ],
    properties: {
      earnsPassiveIncome: true,
      passiveIncomeRate: "0.5 STAR/hour",
      transferable: true,
    }
  };
}

// Create NFT mint message
export function createNFTMintMessage(params: NFTMintParams): {
  to: string;
  amount: string;
  body: Cell;
} {
  const body = beginCell()
    .storeUint(0x642bda77, 32) // op::mint
    .storeUint(0, 64) // queryId
    .storeStringTail(params.planetName)
    .storeAddress(Address.parse(params.receiverAddress))
    .storeCoins(toNano("1")) // amount (1 NFT)
    .endCell();

  return {
    to: PLANET_NFT_CONFIG.collectionAddress,
    amount: toNano("0.1").toString(), // gas fee for minting
    body: body,
  };
}

// Create NFT transfer message
export function createNFTTransferMessage(params: NFTTransferParams): {
  to: string;
  amount: string;
  body: Cell;
} {
  const body = beginCell()
    .storeUint(0x5fcc3d14, 32) // op::transfer
    .storeUint(0, 64) // queryId
    .storeInt(params.nftId, 256)
    .storeAddress(Address.parse(params.toAddress))
    .storeAddress(Address.parse(params.fromAddress)) // responseDestination
    .storeUint(0, 1) // customPayload
    .storeCoins(toNano("0.001")) // forwardTonAmount
    .storeUint(0, 1) // forwardPayload
    .endCell();

  return {
    to: PLANET_NFT_CONFIG.collectionAddress,
    amount: toNano("0.05").toString(),
    body: body,
  };
}

// Helper to construct NFT minting message (legacy)
export function createNFTMintMessageLegacy(planetName: string, discoveryOrder: number, walletAddress: string) {
  return {
    to: PLANET_NFT_CONFIG.collectionAddress,
    amount: '100000000', // 0.1 TON for gas
    init: null,
    body: {
      $$type: 'Mint' as const,
      planet: planetName,
      receiver: walletAddress,
      amount: 1
    }
  };
}

// Calculate set bonuses for NFT collections
export interface SetBonus {
  name: string;
  description: string;
  nftCount: number;
  dailyBonus: number; // STAR per day
}

export function calculateSetBonuses(ownedPlanets: string[]): SetBonus[] {
  const innerPlanets = ["Mercury", "Venus", "Earth", "Mars"];
  const outerPlanets = ["Jupiter", "Saturn", "Uranus", "Neptune"];
  
  const bonuses: SetBonus[] = [];
  
  // Check inner planets set
  const innerCount = ownedPlanets.filter(p => innerPlanets.includes(p)).length;
  if (innerCount === 4) {
    bonuses.push({
      name: "Inner Planets Master",
      description: "Own all inner planets",
      nftCount: 4,
      dailyBonus: 25,
    });
  }
  
  // Check outer planets set
  const outerCount = ownedPlanets.filter(p => outerPlanets.includes(p)).length;
  if (outerCount === 4) {
    bonuses.push({
      name: "Outer Planets Master",
      description: "Own all outer planets",
      nftCount: 4,
      dailyBonus: 50,
    });
  }
  
  // Check all planets set
  if (innerCount === 4 && outerCount === 4) {
    bonuses.push({
      name: "Solar System Explorer",
      description: "Own all 8 planets",
      nftCount: 8,
      dailyBonus: 100,
    });
  }
  
  return bonuses;
}

// Format NFT display name
export function formatNFTName(planetName: string, discoveryOrder: number): string {
  const rarity = getPlanetRarity(discoveryOrder);
  const rarityEmoji: Record<string, string> = {
    "common": "⚪",
    "rare": "🔵",
    "epic": "🟣",
    "legendary": "🟡",
  };
  return `${rarityEmoji[rarity]} ${planetName} NFT #${discoveryOrder}`;
}

// Contract ABI for reference
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
>>>>>>> 0b64c5e (Updates)
