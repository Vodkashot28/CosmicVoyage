import { Address } from "@ton/core";

/**
 * Solar System Explorer - Smart Contract Addresses
 * ✅ PRODUCTION ADDRESSES - Deployed to TON Testnet Dec 2, 2025
 */

export const CONTRACT_ADDRESSES = {
  // STAR Token - Main token contract (1B supply)
  STAR_TOKEN: "EQAIYlrr3UiMJ9fqI-B4j2nJdiiD7WzyaNL1MX_wiONc4OUi",

  // STAR Token Wallet - User token wallets  
  STAR_TOKEN_WALLET: "EQDy43am74uRimAbuKFthYO4PJY95wzNOpsfOAfBhkwwnC9c",

  // Planet NFT - NFT collection contract (SEQ Standard)
  PLANET_NFT: "EQBuZlqecX7qIEHlakYKEqPVtQ5An3XwqDg4DoAh3dNHlHqS",

  // Planet NFT Item - Individual NFT items
  PLANET_NFT_ITEM: "EQCxm_x7fTE-_bpyb4yXdSbd3rck6ctxPNV7HhtDc0PA-JRk",

  // Referral Faucet - Referral reward system
  REFERRAL_FAUCET: "EQC4EQAmL5WKePiV0zzRXZjraZdlpqJOgQOVaH_PKs_FVF8a",
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
    deployedAt: "2025-12-01T00:00:00Z",
  },
  starTokenWallet: {
    name: "STAR Token Wallet",
    description: "User wallet for STAR token holdings & passive income",
    address: CONTRACT_ADDRESSES.STAR_TOKEN_WALLET,
    network: "testnet",
    deployedAt: "2025-12-02T00:59:33Z",
  },
  planetNFT: {
    name: "Planet NFT Collection",
    description: "NFT collection for celestial objects",
    address: CONTRACT_ADDRESSES.PLANET_NFT,
    network: "testnet",
    deployedAt: "2025-12-02T01:00:06Z",
  },
  planetNFTItem: {
    name: "Planet NFT Item",
    description: "Individual NFT items for planets (Earth reference)",
    address: CONTRACT_ADDRESSES.PLANET_NFT_ITEM,
    network: "testnet",
    deployedAt: "2025-12-02T01:00:40Z",
  },
  referralFaucet: {
    name: "Referral Faucet",
    description: "Tiered referral rewards system (5-50 STAR per tier)",
    address: CONTRACT_ADDRESSES.REFERRAL_FAUCET,
    network: "testnet",
    deployedAt: "2025-12-02T01:01:13Z",
  },
} as const;

// Token Configuration
export const TOKEN_CONFIG = {
  name: "STAR",
  decimals: 9,
  symbol: "STAR",
  totalSupply: "1000000000", // 1B tokens
  passiveIncomePerHour: 50, // 50 STAR per hour per NFT
} as const;

// NFT Configuration  
export const NFT_CONFIG = {
  collectionName: "Cosmic Voyage Planets",
  collectionDescription: "Explore planets and earn rewards in the TON blockchain",
  royaltyPercent: 5,
  baseURI: "https://solarsystemexplorer.com/nft/",
} as const;

// Genesis bonus configuration
export const GENESIS_CONFIG = {
  initialBonus: 10, // 10 STAR tokens
  description: "Welcome bonus for new players",
} as const;

// Referral Configuration
export const REFERRAL_CONFIG = {
  giftAmount: 10, // 10 STAR base gift
  referralBonus: 5, // 5 STAR base bonus
  tier1: { min: 0, max: 3, bonus: 5 },
  tier2: { min: 3, max: 7, bonus: 7 },
  tier3: { min: 7, max: 100, bonus: 10 },
  maxReferralBonus: 50, // 50 STAR max per referrer
} as const;

export default CONTRACT_ADDRESSES;
