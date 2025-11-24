/**
 * Smart Contract Addresses for Solar System Explorer
 * Network: TON Testnet
 * Deployment Date: 2025-11-23
 * Deployer: 0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01
 */

export const CONTRACT_ADDRESSES = {
  starToken: "EQ33b0000000000000000000000000000000000000000000000000000000000000",
  starTokenWallet: "EQ5a40000000000000000000000000000000000000000000000000000000000000",
  planetNFT: "EQ34c0000000000000000000000000000000000000000000000000000000000000",
  planetNFTItem: "EQ4db0000000000000000000000000000000000000000000000000000000000000",
  referralFaucet: "EQ58b0000000000000000000000000000000000000000000000000000000000000",
} as const;

/**
 * Get contract address by name (returns string address)
 */
export function getContractAddress(
  name: keyof typeof CONTRACT_ADDRESSES
): string {
  return CONTRACT_ADDRESSES[name];
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
    address: CONTRACT_ADDRESSES.starToken,
    network: "testnet",
  },
  starTokenWallet: {
    name: "STAR Token Wallet",
    description: "User wallet for STAR token holdings",
    address: CONTRACT_ADDRESSES.starTokenWallet,
    network: "testnet",
  },
  planetNFT: {
    name: "Planet NFT Collection",
    description: "NFT collection for celestial objects",
    address: CONTRACT_ADDRESSES.planetNFT,
    network: "testnet",
  },
  planetNFTItem: {
    name: "Planet NFT Item",
    description: "Individual NFT items for planets",
    address: CONTRACT_ADDRESSES.planetNFTItem,
    network: "testnet",
  },
  referralFaucet: {
    name: "Referral Faucet",
    description: "Tiered referral rewards system (5-50 STAR)",
    address: CONTRACT_ADDRESSES.referralFaucet,
    network: "testnet",
  },
} as const;

/**
 * Verify all contracts are deployed
 */
export function verifyContracts(): {
  ready: boolean;
  missing: string[];
} {
  const missing: string[] = [];

  (Object.keys(CONTRACT_ADDRESSES) as Array<keyof typeof CONTRACT_ADDRESSES>).forEach(
    (key) => {
      const address = CONTRACT_ADDRESSES[key];
      if (!address || address.includes("0000000000000000")) {
        missing.push(key);
      }
    }
  );

  return {
    ready: missing.length === 0,
    missing,
  };
}

/**
 * Export all addresses as environment constants
 */
export const CONTRACTS = {
  STAR_TOKEN_ADDRESS: CONTRACT_ADDRESSES.starToken,
  STAR_TOKEN_WALLET_ADDRESS: CONTRACT_ADDRESSES.starTokenWallet,
  PLANET_NFT_ADDRESS: CONTRACT_ADDRESSES.planetNFT,
  PLANET_NFT_ITEM_ADDRESS: CONTRACT_ADDRESSES.planetNFTItem,
  REFERRAL_FAUCET_ADDRESS: CONTRACT_ADDRESSES.referralFaucet,
} as const;
