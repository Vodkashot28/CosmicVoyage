/**
 * Contract Interaction Utilities
 * Handles communication with deployed TON smart contracts
 */

import { TonClient, Address, toNano } from "@ton/ton";
import { CONTRACT_ADDRESSES, NETWORK } from "./contracts";

export class ContractInteraction {
  private client: TonClient;

  constructor() {
    this.client = new TonClient({
      endpoint: NETWORK.endpoint,
    });
  }

  /**
   * Get STAR token balance for a wallet
   */
  async getSTARBalance(walletAddress: string): Promise<string> {
    try {
      const address = Address.parse(walletAddress);
      const balance = await this.client.getBalance(address);
      return balance.toString();
    } catch (error) {
      console.error("Failed to get STAR balance:", error);
      throw error;
    }
  }

  /**
   * Get contract state from chain
   */
  async getContractState(contractName: keyof typeof CONTRACT_ADDRESSES) {
    try {
      const address = Address.parse(CONTRACT_ADDRESSES[contractName]);
      const state = await this.client.getContractState(address);
      return {
        address: address.toString(),
        state: state.state,
        balance: state.balance,
      };
    } catch (error) {
      console.error(`Failed to get state for ${contractName}:`, error);
      throw error;
    }
  }

  /**
   * Verify all contracts are deployed and active
   */
  async verifyAllContractsDeployed(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    const contracts = Object.keys(CONTRACT_ADDRESSES) as Array<keyof typeof CONTRACT_ADDRESSES>;

    for (const contract of contracts) {
      try {
        const state = await this.getContractState(contract);
        results[contract] = state.state === "active";
      } catch (error) {
        results[contract] = false;
      }
    }

    return results;
  }

  /**
   * Get explorer URL for contract
   */
  getExplorerUrl(contractName: keyof typeof CONTRACT_ADDRESSES): string {
    return `${NETWORK.explorer}/address/${CONTRACT_ADDRESSES[contractName]}`;
  }

  /**
   * Format token amount to display
   */
  formatTokenAmount(amount: string | number, decimals: number = 9): string {
    const num = typeof amount === "string" ? BigInt(amount) : BigInt(amount);
    const divisor = BigInt(10 ** decimals);
    const wholePart = num / divisor;
    const fractionalPart = num % divisor;
    
    if (fractionalPart === BigInt(0)) {
      return wholePart.toString();
    }
    
    const fractional = fractionalPart.toString().padStart(decimals, "0").replace(/0+$/, "");
    return `${wholePart}.${fractional}`;
  }

  /**
   * Convert display amount to contract amount
   */
  toContractAmount(displayAmount: string | number, decimals: number = 9): string {
    const num = typeof displayAmount === "string" ? parseFloat(displayAmount) : displayAmount;
    const multiplier = BigInt(10 ** decimals);
    const contractAmount = BigInt(Math.floor(num * (10 ** decimals)));
    return contractAmount.toString();
  }
}

// Singleton instance
export const contractInteraction = new ContractInteraction();

/**
 * Contract deployment info
 */
export const DEPLOYMENT_INFO = {
  network: "testnet",
  deploymentDate: "2025-12-02",
  deployer: "EQD6FGUpuOJp_816Xqz5RztkHjU4nDAtfow99W6z3px_AeLH",
  explorerBase: "https://testnet.tonscan.org/address/",
  contracts: {
    starToken: {
      name: "STARToken",
      address: CONTRACT_ADDRESSES.STAR_TOKEN,
      deployedAt: "2025-12-01",
      status: "active",
    },
    starTokenWallet: {
      name: "STARTokenWallet",
      address: CONTRACT_ADDRESSES.STAR_TOKEN_WALLET,
      deployedAt: "2025-12-02T00:59:33Z",
      status: "active",
    },
    planetNFT: {
      name: "PlanetNFT",
      address: CONTRACT_ADDRESSES.PLANET_NFT,
      deployedAt: "2025-12-02T01:00:06Z",
      status: "active",
    },
    planetNFTItem: {
      name: "PlanetNFTItem",
      address: CONTRACT_ADDRESSES.PLANET_NFT_ITEM,
      deployedAt: "2025-12-02T01:00:40Z",
      status: "active",
    },
    referralFaucet: {
      name: "ReferralFaucet",
      address: CONTRACT_ADDRESSES.REFERRAL_FAUCET,
      deployedAt: "2025-12-02T01:01:13Z",
      status: "active",
    },
  },
} as const;
