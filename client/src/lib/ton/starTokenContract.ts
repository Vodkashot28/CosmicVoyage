// STAR Token Contract Integration
// This module handles interaction with the STAR token contract on TON blockchain

import { Address, beginCell, Cell, toNano } from "@ton/core";

export const STAR_TOKEN_CONFIG = {
  // Token Properties
  name: "STAR Token",
  symbol: "STAR",
  decimals: 0,
  totalSupply: 1_000_000_000, // 1 billion
  
  // Contract Addresses (to be updated after deployment)
  testnetAddress: process.env.VITE_STAR_TOKEN_ADDRESS || "0:STAR_TOKEN_ADDRESS_PLACEHOLDER",
  mainnetAddress: "0:STAR_TOKEN_MAINNET_ADDRESS",
  
  // Deployer (same as NFT deployer)
  deployerAddress: "0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01",
};

export interface TokenBalance {
  address: string;
  amount: number;
  lastUpdated: number;
}

export interface BurnRecord {
  timestamp: number;
  amount: number;
  utility: string;
  reason: string;
}

export interface PassiveIncomeRecord {
  nftAddress: string;
  hourlyRate: number; // 0.5 STAR per hour
  nftCount: number;
  totalEarned: number;
  lastClaimed: number;
}

// Create token transfer message
export function createTokenTransferMessage(
  destination: Address,
  amount: number,
  walletAddress: Address
): {
  to: Address;
  amount: string;
  init?: Cell;
  body: Cell;
} {
  const body = beginCell()
    .storeUint(0x0f8a7ea5, 32) // op::transfer
    .storeUint(0, 64) // queryId
    .storeCoins(toNano(amount.toString()))
    .storeAddress(destination)
    .storeAddress(walletAddress) // responseDestination
    .storeUint(0, 1) // customPayload (null)
    .storeCoins(toNano("0.001")) // forwardTonAmount
    .storeUint(0, 1) // forwardPayload (empty)
    .endCell();

  return {
    to: Address.parse(STAR_TOKEN_CONFIG.testnetAddress),
    amount: toNano("0.05").toString(), // gas fee
    body: body,
  };
}

// Create token burn message
export function createTokenBurnMessage(
  amount: number,
  walletAddress: Address,
  utility?: string
): {
  to: Address;
  amount: string;
  body: Cell;
} {
  const body = beginCell()
    .storeUint(0x595f07f9, 32) // op::burn
    .storeUint(0, 64) // queryId
    .storeCoins(toNano(amount.toString()))
    .storeAddress(walletAddress)
    .storeUint(0, 1) // customPayload
    .endCell();

  return {
    to: Address.parse(STAR_TOKEN_CONFIG.testnetAddress),
    amount: toNano("0.05").toString(),
    body: body,
  };
}

// Cosmic Utility Burn Amounts
export const COSMIC_UTILITY_COSTS = {
  "cosmic-boost": 25, // 2x rewards for 24 hours
  "void-jump": 50, // Skip to next planet
  "celestial-shield": 30, // Protect tokens
  "asteroid-mining": 40, // Mine bonus tokens
  "supernova-mode": 75, // 3x multiplier for 1 hour
  "wormhole-mode": 100, // Fast travel to any discovered planet
  "cosmic-forge-mode": 150, // Create custom planet NFTs
  "dwarf-planet-unlock": 200, // Unlock Pluto
} as const;

// Calculate passive income from NFT ownership
export function calculatePassiveIncome(
  nftCount: number,
  hoursElapsed: number
): number {
  const baseRate = 0.5; // 0.5 STAR per hour per NFT
  return Math.floor(nftCount * baseRate * hoursElapsed);
}

// Get rarity bonus
export function getRarityBonus(nftCount: number): number {
  if (nftCount === 4) return 25; // Inner planets
  if (nftCount === 8) return 100; // All planets
  if (nftCount >= 4) return 50; // Outer planets
  return 0;
}

// Verify token balance is sufficient for action
export function canAffordAction(
  balance: number,
  actionCost: number
): boolean {
  return balance >= actionCost;
}

// Get token info for display
export function getTokenInfo(): {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
} {
  return {
    name: STAR_TOKEN_CONFIG.name,
    symbol: STAR_TOKEN_CONFIG.symbol,
    decimals: STAR_TOKEN_CONFIG.decimals,
    totalSupply: STAR_TOKEN_CONFIG.totalSupply,
  };
}

// Create mint message (admin only)
export function createMintMessage(
  receiver: Address,
  amount: number
): {
  to: Address;
  amount: string;
  body: Cell;
} {
  const body = beginCell()
    .storeUint(0x642bda77, 32) // op::mint
    .storeUint(0, 64) // queryId
    .storeCoins(toNano(amount.toString()))
    .storeAddress(receiver)
    .storeCoins(toNano("0.001")) // forwardTonAmount
    .storeUint(0, 1) // forwardPayload (empty)
    .endCell();

  return {
    to: Address.parse(STAR_TOKEN_CONFIG.testnetAddress),
    amount: toNano("0.05").toString(),
    body: body,
  };
}

// Create passive income distribution message (admin only)
export function createDistributePassiveIncomeMessage(
  nftHolder: Address,
  amount: number
): {
  to: Address;
  amount: string;
  body: Cell;
} {
  const body = beginCell()
    .storeUint(0x50a73359, 32) // op::distributePassiveIncome
    .storeUint(0, 64) // queryId
    .storeAddress(nftHolder)
    .storeCoins(toNano(amount.toString()))
    .endCell();

  return {
    to: Address.parse(STAR_TOKEN_CONFIG.testnetAddress),
    amount: toNano("0.05").toString(),
    body: body,
  };
}

// Helper: Format token amount for display
export function formatTokenAmount(amount: number): string {
  return `${amount.toLocaleString()} ⭐`;
}

// Helper: Check if amount is valid
export function isValidTokenAmount(amount: number): boolean {
  return Number.isInteger(amount) && amount > 0 && amount <= STAR_TOKEN_CONFIG.totalSupply;
}

// Contract ABI for ethers.js / web3.js style calls
export const STAR_TOKEN_ABI = {
  methods: {
    transfer: ["destination:Address", "amount:Int"],
    burn: ["amount:Int"],
    balanceOf: ["address:Address"],
    mint: ["receiver:Address", "amount:Int"],
    distributePassiveIncome: ["nftHolder:Address", "amount:Int"],
    getBalance: ["returns:Int"],
    getTotalBurned: ["returns:Int"],
    getPassiveIncomeInfo: ["returns:(Int, Int, Int)"],
  },
};
