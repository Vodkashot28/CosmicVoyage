// Planet NFT Contract Integration
// Handles interaction with the Planet NFT collection on TON blockchain
// @ton/core and @ton/ton are lazy-loaded only when needed

import { Address, Cell, Contract, ContractProvider, beginCell, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";

// --- TEMPORARY FIX: LOCAL NFT COLLECTION WRAPPER (to resolve TS2339) ---
// This class replaces the external NftCollection import that failed and implements
// the minimal Contract interface and the required getter method.
class NftCollection implements Contract {
    readonly address: Address;
    readonly init?: { code: Cell; data: Cell; };

    constructor(address: Address, init?: { code: Cell; data: Cell }) {
        this.address = address;
        this.init = init;
    }

    static create(address: Address, init?: { code: Cell; data: Cell }) {
        return new NftCollection(address, init);
    }

    // This method is required by your existing code (getNFTAddressByIndex)
    async getNftAddressByIndex(provider: ContractProvider, itemIndex: bigint): Promise<Address> {
        //
        // Calls the smart contract's getter method 'get_nft_address_by_index'
        const { stack } = await provider.get("get_nft_address_by_index", [{
            type: 'int',
            value: itemIndex, // 🌟 FIXED: Passing bigint directly instead of itemIndex.toString()
        }]);
        return stack.readAddress();
    }
}
// --- END OF LOCAL WRAPPER FIX ---


// --- CONFIGURATION ---

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
  baseMetadataURI: "https://solar-system.xyz/models/",
  royaltyPercent: 5,
  royaltyDenominator: 100,

  // Increased gas constants for safer transactions
  gasConstants: {
    mint: "0.5",       // Increased amount for minting (covers item contract init and gas)
    transfer: "0.1",   // Increased amount for transfer (covers item contract fee)
    forward: "0.01",   // Forward amount for notification
  }
};

export const TON_CONFIG = {
  testnet: {
    endpoint: import.meta.env.VITE_TON_RPC_ENDPOINT || "https://testnet.toncenter.com/api/v2/",
    explorerUrl: "https://testnet.tonscan.org",
  },
};

// --- INTERFACES & ADDRESS UTILITIES ---

let tonClient: TonClient | null = null; // Type safety applied here

async function getTonClient(): Promise<TonClient> {
  if (tonClient) return tonClient;
  // TonClient is now imported at the top
  tonClient = new TonClient({
    endpoint: TON_CONFIG.testnet.endpoint,
  });
  return tonClient;
}

// Interfaces (Unchanged from original)
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
  // NOTE: itemIndex and itemContentCell are now needed for the mint message
}

export interface NFTTransferParams {
  nftIndex: number; // Use index to look up the actual NFT address
  fromAddress: string;
  toAddress: string;
}

export const DEPLOYER_ADDRESS = import.meta.env.VITE_NFT_DEPLOYER;
export const CONTRACT_ADDRESS = getCollectionAddress();

/**
 * Looks up the specific NFT Item Contract address by its index.
 * This is required before attempting to transfer the NFT.
 */
export async function getNFTAddressByIndex(itemIndex: number): Promise<string> {
  // 💡 FIX: Address is now consistently pulled from @ton/core
  const { Address } = await import("@ton/core");
  const client = await getTonClient();

  const collectionAddress = Address.parse(PLANET_NFT_CONFIG.collectionAddress);
  // NftCollection is the local class defined above.
  const collectionContract = client.open(NftCollection.create(collectionAddress));

  // Use the standard get_nft_address_by_index method
  const nftItemAddress = await collectionContract.getNftAddressByIndex(BigInt(itemIndex));

  return nftItemAddress.toString();
}

// --- METADATA & RARITY HELPERS (Unchanged for brevity) ---
// ... (Your existing helper functions like getPlanetRarity, getGlowColorForPlanet, etc. go here) ...
export function getPlanetRarity(discoveryOrder: number): "common" | "rare" | "epic" | "legendary" {
  if (discoveryOrder === 1) return "common";
  if (discoveryOrder <= 3) return "rare";
  if (discoveryOrder <= 6) return "epic";
  return "legendary";
}
// ... (All other helpers) ...

// --- TRANSACTION CREATORS (CRITICAL FIXES APPLIED) ---

/**
 * Generates the correct TEP-62 NFT Mint Message.
 * This function must be called with the next index and the Cell containing the NFT metadata.
 */
export async function createNFTMintMessage(
  params: NFTMintParams,
  itemIndex: number,
  itemContentCell: Cell // Cell from @ton/core containing the metadata link
) {
  const { Address } = await import("@ton/core");

  // Standard TEP-62 Mint OP is 0x00000001 (1)
  const MINT_OP = 1;

  // 1. Create the content cell for the individual NFT item
  const itemMessage = beginCell()
      .storeAddress(Address.parse(params.receiverAddress)) // New item owner
      .storeRef(itemContentCell) // Reference to the metadata (e.g., IPFS URI Cell)
      .endCell();

  // 2. Create the overall message body sent to the Collection Contract
  const body = beginCell()
    .storeUint(MINT_OP, 32) // op::mint_nft
    .storeUint(0, 64)      // queryId
    .storeUint(itemIndex, 64) // NFT item index
    .storeCoins(toNano(PLANET_NFT_CONFIG.gasConstants.forward)) // Forward amount to new NFT contract
    .storeRef(itemMessage) // Reference to the item data
    .endCell();

  return {
    to: PLANET_NFT_CONFIG.collectionAddress, // Target is the Collection Contract (correct for minting)
    amount: toNano(PLANET_NFT_CONFIG.gasConstants.mint).toString(), // Higher amount for safety
    body,
  };
}

/**
 * Generates the correct TEP-62 NFT Transfer Message.
 * The destination is now the specific NFT Item Contract address.
 */
export async function createNFTTransferMessage(params: NFTTransferParams) {
  // Address is now consistently pulled from @ton/core
  const { Address } = await import("@ton/core");

  // 1. CRITICAL: Get the specific NFT Item Address
  const nftItemAddress = await getNFTAddressByIndex(params.nftIndex);

  // Standard TEP-62 Transfer Op is 0x5fcc3d14
  const TRANSFER_OP = 0x5fcc3d14;

  const body = beginCell()
    .storeUint(TRANSFER_OP, 32)
    .storeUint(0, 64) // queryId
    .storeAddress(Address.parse(params.toAddress)) // New owner
    .storeAddress(Address.parse(params.fromAddress)) // Response destination
    .storeUint(0, 1) // customPayload (null)
    .storeCoins(toNano(PLANET_NFT_CONFIG.gasConstants.forward)) // Forward amount
    .storeUint(0, 1) // forwardPayload (empty)
    .endCell();

  return {
    to: nftItemAddress, // CORRECT TARGET: The specific NFT Item Contract
    amount: toNano(PLANET_NFT_CONFIG.gasConstants.transfer).toString(), // Sufficient gas
    body,
  };
}


// --- LEGACY HELPER (Still uses legacy structure, keep for reference) ---
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

// --- BONUS & DISPLAY HELPERS (Unchanged for brevity) ---
// ... (The rest of your code: calculateSetBonuses, formatNFTName, etc.) ...
// ... (The ABI is correct for standard TEP-62 functions) ...
