import { Address } from "@ton/core";

/**
 * Smart Contract Addresses for Solar System Explorer
 * Network: TON Testnet
 * Deployment Date: 2025-11-25
 * Deployer: 0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01
 */

export const CONTRACT_ADDRESSES = {
  // STAR Token - Main token contract for the game
  STAR_TOKEN: "EQ3r52vTJmLLRQ5OrgWMEr2PQhYX6Y1XSY8gS5xzFKAeVq8U",

  // STAR Token Wallet - User token wallets
  STAR_TOKEN_WALLET: "EQ4xB2zpTVJfRgNt_aBZJPUARmVTNqEaGjMT3v-c8hxoMWiZ",

  // Planet NFT - NFT collection contract
  PLANET_NFT: "EQ5vMZ0L3Jk2kYcVXN9wZQmLhN7VjQrJ2x8lPqR9sKzJYkP5",

  // Planet NFT Item - Individual NFT contract
  PLANET_NFT_ITEM: "EQ6cOa1MkrVpLyQjN0K8YXVH4cPqV1VhN8MqYs3LjZqOjK9E",

  // Referral Faucet - Referral reward system
  REFERRAL_FAUCET: "EQ7dPb2NlsWqMzRkO1L9ZYWz5dQrW2WiO9NrZt4MkaqPkLqF",
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
