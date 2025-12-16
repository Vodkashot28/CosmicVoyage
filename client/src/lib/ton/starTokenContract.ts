// STAR Token Contract Integration
// Handles interaction with the STAR token contract on TON blockchain
// @ton/core and @ton/ton are lazy-loaded to avoid Buffer polyfill issues

// --- CONFIGURATION ---

export function getStarTokenAddress(): string {
  const envAddress = import.meta.env.VITE_STAR_TOKEN_ADDRESS;
  if (!envAddress) {
    console.error("STAR token address missing. Check .env file.");
    throw new Error("STAR token address not set in environment variables");
  }
  return envAddress;
}

export const STAR_TOKEN_CONFIG = {
  name: "STAR Token",
  symbol: "STAR",
  decimals: 0,
  totalSupply: 1_000_000_000, 

  // Dynamic getter ensures runtime access to env
  get testnetAddress() {
    return getStarTokenAddress();
  },
  
  // Hardcoded gas constants (NanoTON) to prevent 'Out of Gas' errors
  gasConstants: {
    transfer: "0.1",       // Gas for transfer operation (increased for safety)
    burn: "0.05",          // Gas for burn operation
    forward: "0.01",       // Amount forwarded to recipient for notifications
  },

  // Deployer (same as NFT deployer)
  deployerAddress: "0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01",
};

// --- CLIENT & ADDRESS UTILITIES ---

let tonClient: any = null;

// Lazy load the TON client to avoid initialization errors
async function getTonClient() {
  if (tonClient) return tonClient;
  
  const { TonClient } = await import("@ton/ton");
  // Default to testnet center for development
  tonClient = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC", 
  });
  return tonClient;
}

/**
 * CRITICAL: Calculates the User's Jetton Wallet Address.
 * Transfers and Burns MUST be sent to this address, NOT the Master address.
 */
export async function getUserJettonWallet(userWalletAddress: string): Promise<string> {
  const { Address, JettonMaster } = await import("@ton/ton");
  const client = await getTonClient();

  const masterAddress = Address.parse(STAR_TOKEN_CONFIG.testnetAddress);
  const userAddress = Address.parse(userWalletAddress);

  // Open the Master Contract instance
  const masterContract = client.open(JettonMaster.create(masterAddress));
  
  // Ask the Master Contract: "What is the wallet address for this user?"
  const jettonWalletAddress = await masterContract.getWalletAddress(userAddress);
  
  return jettonWalletAddress.toString();
}

// --- INTERFACES ---

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

// --- TRANSACTION CREATORS ---

// Create token transfer message
export async function createTokenTransferMessage(
  destination: string,
  amount: number,
  senderWalletAddress: string // Needed to calculate the sender's Jetton Wallet
) {
  const { Address, beginCell, toNano } = await import("@ton/core");

  // 1. Get the Sender's Jetton Wallet Address (The actual target for transfers)
  const senderJettonWallet = await getUserJettonWallet(senderWalletAddress);

  const body = beginCell()
    .storeUint(0x0f8a7ea5, 32) // op::transfer
    .storeUint(0, 64)          // queryId
    .storeCoins(toNano(amount.toString())) // Amount of Jettons
    .storeAddress(Address.parse(destination)) // Recipient
    .storeAddress(Address.parse(senderWalletAddress)) // Response destination
    .storeUint(0, 1) // customPayload (null)
    .storeCoins(toNano(STAR_TOKEN_CONFIG.gasConstants.forward)) // Forward amount
    .storeUint(0, 1) // forwardPayload (empty)
    .endCell();

  return {
    to: senderJettonWallet, // TARGET IS USER'S JETTON WALLET
    amount: toNano(STAR_TOKEN_CONFIG.gasConstants.transfer).toString(), 
    body,
  };
}

// Create token burn message
export async function createTokenBurnMessage(
  amount: number,
  senderWalletAddress: string,
  utility?: string
) {
  const { Address, beginCell, toNano } = await import("@ton/core");

  // 1. Get the Sender's Jetton Wallet Address (The actual target for burns)
  const senderJettonWallet = await getUserJettonWallet(senderWalletAddress);

  const body = beginCell()
    .storeUint(0x595f07f9, 32) // op::burn
    .storeUint(0, 64)          // queryId
    .storeCoins(toNano(amount.toString()))
    .storeAddress(Address.parse(senderWalletAddress)) // Response destination
    .storeUint(0, 1) // customPayload
    .endCell();

  return {
    to: senderJettonWallet, // TARGET IS USER'S JETTON WALLET
    amount: toNano(STAR_TOKEN_CONFIG.gasConstants.burn).toString(),
    body,
  };
}

// --- GAMEPLAY UTILITIES ---

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

export function getTokenInfo() {
  return {
    name: STAR_TOKEN_CONFIG.name,
    symbol: STAR_TOKEN_CONFIG.symbol,
    decimals: STAR_TOKEN_CONFIG.decimals,
    totalSupply: STAR_TOKEN_CONFIG.totalSupply,
  };
}

// --- ADMIN FUNCTIONS ---
// (These correctly target the Master Contract as only Admin can mint)

export async function createMintMessage(receiver: string, amount: number) {
  const { Address, beginCell, toNano } = await import("@ton/core");

  const body = beginCell()
    .storeUint(0x642bda77, 32) // op::mint
    .storeUint(0, 64)          // queryId
    .storeCoins(toNano(amount.toString()))
    .storeAddress(Address.parse(receiver))
    .storeCoins(toNano("0.001")) // forwardTonAmount
    .storeUint(0, 1)             // forwardPayload (empty)
    .endCell();

  return {
    to: STAR_TOKEN_CONFIG.testnetAddress, // Minting TARGETS Master Contract
    amount: toNano("0.05").toString(),
    body,
  };
}

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

export function formatTokenAmount(amount: number): string {
  return `${amount.toLocaleString()} ⭐`;
}

export function isValidTokenAmount(amount: number): boolean {
  return Number.isInteger(amount) && amount > 0 && amount <= STAR_TOKEN_CONFIG.totalSupply;
}

// Contract ABI (Reference)
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
