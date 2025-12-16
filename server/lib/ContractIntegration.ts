/**
 * ContractIntegration.ts
 * Canonical Contract Integration Layer
 * Provides typed access to TON smart contracts, tokens, NFTs, and referral logic
 */

export const CONTRACT_ADDRESSES = {
  STAR_TOKEN: "EQAIYlrr3UiMJ9fqI-B4j2nJdiiD7WzyaNL1MX_wiONc4OUi",
  STAR_TOKEN_WALLET: "EQDy43am74uRimAbuKFthYO4PJY95wzNOpsfOAfBhkwwnC9c",
  PLANET_NFT: "EQBuZlqecX7qIEHlakYKEqPVtQ5An3XwqDg4DoAh3dNHlHqS",
  PLANET_NFT_ITEM: "EQCxm_x7fTE-_bpyb4yXdSbd3rck6ctxPNV7HhtDc0PA-JRk",
  REFERRAL_FAUCET: "EQC4EQAmL5WKePiV0zzRXZjraZdlpqJOgQOVaH_PKs_FVF8a",
} as const;

export const BLOCKCHAIN_CONFIG = {
  network: process.env.TON_NETWORK ?? "testnet",
  endpoint: process.env.TONCENTER_API_KEY
    ? `https://${process.env.TON_NETWORK ?? "testnet"}.toncenter.com/api/v2/jsonRPC?api_key=${process.env.TONCENTER_API_KEY}`
    : `https://${process.env.TON_NETWORK ?? "testnet"}.toncenter.com/api/v2/jsonRPC`,
  explorer:
    process.env.TON_NETWORK === "mainnet"
      ? "https://tonscan.org"
      : "https://testnet.tonscan.org",
};

export const TOKEN_CONFIG = {
  name: "STAR",
  symbol: "STAR",
  decimals: 9,
  totalSupply: "1000000000",
  passiveIncomePerHour: 50,
  genesisBonus: 10,
};

export const NFT_CONFIG = {
  collectionName: "Cosmic Voyage Planets",
  royaltyPercent: 5,
  baseURI: "https://solar-system.xyz/nft/",
  assetsURI: "https://solar-system.xyz/models/",
};

export const REFERRAL_CONFIG = {
  giftAmount: 10,
  baseReferralBonus: 5,
  maxReferralBonus: 50,
  tiers: [
    { min: 0, max: 3, bonus: 5 },
    { min: 3, max: 7, bonus: 7 },
    { min: 7, max: 100, bonus: 10 },
  ],
};

export default class ContractManager {
  /** Get contract address by type */
  static getContractAddress(type: keyof typeof CONTRACT_ADDRESSES): string {
    return CONTRACT_ADDRESSES[type];
  }

  /** Get explorer URL for contract */
  static getExplorerUrl(contractAddress: string): string {
    return `${BLOCKCHAIN_CONFIG.explorer}/address/${contractAddress}`;
  }

  /** Convert tokens to contract amount (with decimals) */
  static toContractAmount(amount: number): string {
    return Math.floor(amount * Math.pow(10, TOKEN_CONFIG.decimals)).toString();
  }

  /** Convert contract amount to display tokens */
  static fromContractAmount(contractAmount: string): number {
    const num = parseInt(contractAmount, 10);
    return num / Math.pow(10, TOKEN_CONFIG.decimals);
  }

  /** Get all contract info for frontend */
  static getAllContractInfo() {
    return Object.entries(CONTRACT_ADDRESSES).reduce((acc, [key, address]) => {
      acc[key as keyof typeof CONTRACT_ADDRESSES] = {
        address,
        explorerUrl: this.getExplorerUrl(address),
        name: key.replace(/_/g, " "),
      };
      return acc;
    }, {} as Record<
      keyof typeof CONTRACT_ADDRESSES,
      { address: string; explorerUrl: string; name: string }
    >);
  }

  /** Build NFT metadata URL for a given planet */
  static getNftMetadataUrl(planet: string): string {
    return `${NFT_CONFIG.baseURI}${planet}.json`;
  }

  /** Build NFT asset URL for a given planet model */
  static getNftAssetUrl(planet: string): string {
    return `${NFT_CONFIG.assetsURI}${planet}.glb`;
  }
}
