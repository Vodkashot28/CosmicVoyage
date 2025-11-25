import { Address } from "@ton/core";

/**
 * Smart Contract Addresses for Solar System Explorer
 * 
 * ⚠️  IMPORTANT: These Are MOCK ADDRESSES - Update After Deployment
 * 
 * CURRENT STATUS: 🔴 Mock Mode
 * - Contracts NOT deployed to TON blockchain yet
 * - Game uses mock token system only
 * - Frontend shows real UI but backend is test data
 * 
 * TO DEPLOY CONTRACTS:
 * 1. Read: BLOCKCHAIN_DEPLOYMENT_GUIDE.md (root directory)
 * 2. Build: cd contracts-blueprint && npx blueprint build
 * 3. Deploy: npx blueprint run deployAll
 * 4. Copy addresses from deployments/testnet-deployment.json
 * 5. Replace these addresses with REAL addresses
 * 6. Rebuild app: npm run build
 * 
 * Network: TON Testnet (development), TON Mainnet (production)
 * Deployer: 0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01
 * Explorer: https://testnet.tonscan.org/address/[address]
 * 
 * After deployment, all these addresses will be REAL, not mock!
 */

export const CONTRACT_ADDRESSES = {
  // STAR Token - Main token contract (1B supply)
  STAR_TOKEN: "EQAlDehTswGQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOip",

  // STAR Token Wallet - User token wallets  
  STAR_TOKEN_WALLET: "EQC7GGyx-8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOYw",

  // Planet NFT - NFT collection contract (SEQ Standard)
  PLANET_NFT: "EQAftBcDQ7mAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWq",

  // Planet NFT Item - Individual NFT items
  PLANET_NFT_ITEM: "EQAtB-8TV43gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIot",

  // Referral Faucet - Referral reward system
  REFERRAL_FAUCET: "EQAs5pY8qu7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG6S",
} as const;

export const NETWORK = {
  type: "testnet",
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  explorer: "https://testnet.tonscan.org",
};

/**
 * Get contract address by name
 */
export function getContractAddress(
  name: keyof typeof CONTRACT_ADDRESSES
): Address {
  const address = CONTRACT_ADDRESSES[name];
  return Address.parse(address);
}

/**
 * Parse address with lazy loading of @ton/core
 * (only loads when TON Connect is actually used)
 */
export async function parseAddress(addressString: string) {
  const { Address } = await import("@ton/core");
  return Address.parse(addressString);
}

/**
 * Contract metadata
 */
export const CONTRACT_INFO = {
  starToken: {
    name: "STAR Token",
    description: "Main STAR token contract (1B fixed supply)",
    address: CONTRACT_ADDRESSES.STAR_TOKEN,
    network: "testnet",
  },
  starTokenWallet: {
    name: "STAR Token Wallet",
    description: "User wallet for STAR token holdings",
    address: CONTRACT_ADDRESSES.STAR_TOKEN_WALLET,
    network: "testnet",
  },
  planetNFT: {
    name: "Planet NFT Collection",
    description: "NFT collection for celestial objects",
    address: CONTRACT_ADDRESSES.PLANET_NFT,
    network: "testnet",
  },
  planetNFTItem: {
    name: "Planet NFT Item",
    description: "Individual NFT items for planets",
    address: CONTRACT_ADDRESSES.PLANET_NFT_ITEM,
    network: "testnet",
  },
  referralFaucet: {
    name: "Referral Faucet",
    description: "Tiered referral rewards system (5-50 STAR)",
    address: CONTRACT_ADDRESSES.REFERRAL_FAUCET,
    network: "testnet",
  },
} as const;

// Token Configuration
export const TOKEN_CONFIG = {
  name: "STAR",
  decimals: 9,
  symbol: "STAR",
} as const;

// NFT Configuration  
export const NFT_CONFIG = {
  collectionName: "Cosmic Voyage Planets",
  collectionDescription: "Explore planets and earn rewards in the TON blockchain",
  royaltyPercent: 5,
} as const;

// Genesis bonus configuration
export const GENESIS_CONFIG = {
  initialBonus: 10, // 10 STAR tokens
  description: "Welcome bonus for new players",
} as const;

export default CONTRACT_ADDRESSES;
