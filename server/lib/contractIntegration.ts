/**
 * Backend Contract Integration
 * Manages interaction with deployed TON smart contracts
 */

export const CONTRACT_ADDRESSES = {
  STAR_TOKEN: "EQAIYlrr3UiMJ9fqI-B4j2nJdiiD7WzyaNL1MX_wiONc4OUi",
  STAR_TOKEN_WALLET: "EQDy43am74uRimAbuKFthYO4PJY95wzNOpsfOAfBhkwwnC9c",
  PLANET_NFT: "EQBuZlqecX7qIEHlakYKEqPVtQ5An3XwqDg4DoAh3dNHlHqS",
  PLANET_NFT_ITEM: "EQCxm_x7fTE-_bpyb4yXdSbd3rck6ctxPNV7HhtDc0PA-JRk",
  REFERRAL_FAUCET: "EQC4EQAmL5WKePiV0zzRXZjraZdlpqJOgQOVaH_PKs_FVF8a",
} as const;

export const BLOCKCHAIN_CONFIG = {
  network: "testnet",
  endpoint: process.env.TONCENTER_API_KEY 
    ? `https://testnet.toncenter.com/api/v2/jsonRPC?api_key=${process.env.TONCENTER_API_KEY}`
    : "https://testnet.toncenter.com/api/v2/jsonRPC",
  explorer: "https://testnet.tonscan.org",
};

export const TOKEN_CONFIG = {
  name: "STAR",
  decimals: 9,
  symbol: "STAR",
  totalSupply: "1000000000",
  passiveIncomePerHour: 50,
  genesisBonus: 10,
};

export const NFT_CONFIG = {
  collectionName: "Cosmic Voyage Planets",
  royaltyPercent: 5,
  baseURI: "https://solarsystemexplorer.com/nft/",
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

export class ContractManager {
  /**
   * Get contract address by type
   */
  static getContractAddress(
    type: keyof typeof CONTRACT_ADDRESSES
  ): string {
    return CONTRACT_ADDRESSES[type];
  }

  /**
   * Get explorer URL for contract
   */
  static getExplorerUrl(contractAddress: string): string {
    return `${BLOCKCHAIN_CONFIG.explorer}/address/${contractAddress}`;
  }

  /**
   * Convert tokens to contract amount (with decimals)
   */
  static toContractAmount(amount: number): string {
    const contractAmount = Math.floor(amount * Math.pow(10, TOKEN_CONFIG.decimals));
    return contractAmount.toString();
  }

  /**
   * Convert contract amount to display tokens
   */
  static fromContractAmount(contractAmount: string): number {
    const num = parseInt(contractAmount, 10);
    return num / Math.pow(10, TOKEN_CONFIG.decimals);
  }

  /**
   * Get contract info for frontend
   */
  static getAllContractInfo() {
    return {
      STAR_TOKEN: {
        address: CONTRACT_ADDRESSES.STAR_TOKEN,
        explorerUrl: this.getExplorerUrl(CONTRACT_ADDRESSES.STAR_TOKEN),
        name: "STAR Token",
        symbol: TOKEN_CONFIG.symbol,
      },
      STAR_TOKEN_WALLET: {
        address: CONTRACT_ADDRESSES.STAR_TOKEN_WALLET,
        explorerUrl: this.getExplorerUrl(CONTRACT_ADDRESSES.STAR_TOKEN_WALLET),
        name: "STAR Token Wallet",
      },
      PLANET_NFT: {
        address: CONTRACT_ADDRESSES.PLANET_NFT,
        explorerUrl: this.getExplorerUrl(CONTRACT_ADDRESSES.PLANET_NFT),
        name: "Planet NFT Collection",
      },
      PLANET_NFT_ITEM: {
        address: CONTRACT_ADDRESSES.PLANET_NFT_ITEM,
        explorerUrl: this.getExplorerUrl(CONTRACT_ADDRESSES.PLANET_NFT_ITEM),
        name: "Planet NFT Item",
      },
      REFERRAL_FAUCET: {
        address: CONTRACT_ADDRESSES.REFERRAL_FAUCET,
        explorerUrl: this.getExplorerUrl(CONTRACT_ADDRESSES.REFERRAL_FAUCET),
        name: "Referral Faucet",
      },
    };
  }
}

export default ContractManager;
