// STAR Token Contract Integration
// Handles interaction with the STAR token contract on TON blockchain
// @ton/core is lazy-loaded only when needed to avoid Buffer polyfill issues

// Function to get testnet address at runtime (avoids process.env access at module load time)
export function getStarTokenAddress(): string {
  const envAddress = import.meta.env.VITE_STAR_TOKEN_ADDRESS;
  if (!envAddress) {
    throw new Error("STAR token address not set in environment variables");
  }
  return envAddress;
}

export const STAR_TOKEN_CONFIG = {
  // Token Properties
  name: "STAR Token",
  symbol: "STAR",
  decimals: 0,
  totalSupply: 1_000_000_000, // 1 billion

  // Contract Addresses
  get testnetAddress() {
    return getStarTokenAddress();
  },
  mainnetAddress: "0:STAR_TOKEN_MAINNET_ADDRESS",

  // Deployer (same as NFT deployer)
  deployerAddress: "0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01",
};

// Interfaces
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
export async function createTokenTransferMessage(
  destination: string,
  amount: number,
  walletAddress: string
) {
  const { Address, beginCell, toNano } = await import("@ton/core");

  const body = beginCell()
    .storeUint(0x0f8a7ea5, 32) // op::transfer
    .storeUint(0, 64) // queryId
    .storeCoins(toNano(amount.toString()))
    .storeAddress(Address.parse(destination))
    .storeAddress(Address.parse(walletAddress)) // responseDestination
    .storeUint(0, 1) // customPayload (null)
    .storeCoins(toNano("0.001")) // forwardTonAmount
    .storeUint(0, 1) // forwardPayload (empty)
    .endCell();

  return {
    to: STAR_TOKEN_CONFIG.testnetAddress,
    amount: toNano("0.05").toString(), // gas fee
    body,
  };
}

// Create token burn message
export async function createTokenBurnMessage(
  amount: number,
  walletAddress: string,
  utility?: string
) {
  const { Address, beginCell, toNano } = await import("@ton/core");

  const body = beginCell()
    .storeUint(0x595f07f9, 32) // op::burn
    .storeUint(0, 64) // queryId
    .storeCoins(toNano(amount.toString()))
    .storeAddress(Address.parse(walletAddress))
    .storeUint(0, 1) // customPayload
    .endCell();

  return {
    to: STAR_TOKEN_CONFIG.testnetAddress,
    amount: toNano("0.05").toString(),
    body,
  };
}

// Cosmic Utility Burn Amounts
export const COSMIC_UTILITY_COSTS = {
  "cosmic-boost": 25,
  "void-jump": 50,
  "celestial-shield": 30,
  "asteroid-mining": 40,
  "supernova-mode": 75,
  "wormhole-mode": 100,
  "cosmic-forge-mode": 150,
  "dwarf-planet-unlock": 200,
} as const;

// Passive income calculations
export function calculatePassiveIncome(nftCount: number, hoursElapsed: number): number {
  const baseRate = 0.5; // 0.5 STAR per hour per NFT
  return Math.floor(nftCount * baseRate * hoursElapsed);
}

export function getRarityBonus(nftCount: number): number {
  if (nftCount === 4) return 25; // Inner planets
  if (nftCount === 8) return 100; // All planets
  if (nftCount >= 4) return 50; // Outer planets
  return 0;
}

export function canAffordAction(balance: number, actionCost: number): boolean {
  return balance >= actionCost;
}

// Token info
export function getTokenInfo() {
  return {
    name: STAR_TOKEN_CONFIG.name,
    symbol: STAR_TOKEN_CONFIG.symbol,
    decimals: STAR_TOKEN_CONFIG.decimals,
    totalSupply: STAR_TOKEN_CONFIG.totalSupply,
  };
}

// Mint message (admin only)
export async function createMintMessage(receiver: string, amount: number) {
  const { Address, beginCell, toNano } = await import("@ton/core");

  const body = beginCell()
    .storeUint(0x642bda77, 32) // op::mint
    .storeUint(0, 64) // queryId
    .storeCoins(toNano(amount.toString()))
    .storeAddress(Address.parse(receiver))
    .storeCoins(toNano("0.001")) // forwardTonAmount
    .storeUint(0, 1) // forwardPayload (empty)
    .endCell();

  return {
    to: STAR_TOKEN_CONFIG.testnetAddress,
    amount: toNano("0.05").toString(),
    body,
  };
}

// Passive income distribution (admin only)
export async function createDistributePassiveIncomeMessage(nftHolder: string, amount: number) {
  const { Address, beginCell, toNano } = await import("@ton/core");

  const body = beginCell()
    .storeUint(0x50a73359, 32) // op::distributePassiveIncome
    .storeUint(0, 64) // queryId
    .storeAddress(Address.parse(nftHolder))
    .storeCoins(toNano(amount.toString()))
    .endCell();

  return {
    to: STAR_TOKEN_CONFIG.testnetAddress,
    amount: toNano("0.05").toString(),
    body,
  };
}

// Helpers
export function formatTokenAmount(amount: number): string {
  return `${amount.toLocaleString()} ⭐`;
}

export function isValidTokenAmount(amount: number): boolean {
  return Number.isInteger(amount) && amount > 0 && amount <= STAR_TOKEN_CONFIG.totalSupply;
}

// Contract ABI
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
