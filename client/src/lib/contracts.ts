// ============================================
// CONTRACT ADDRESSES - TESTNET DEPLOYMENT
// ============================================
// Updated: 2025-11-25
// Network: TON Testnet
// Deployer: 0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01

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
