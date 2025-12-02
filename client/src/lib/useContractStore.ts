/**
 * Contract State Management Store
 * Manages contract addresses and blockchain interactions
 */

import { create } from "zustand";
import { CONTRACT_ADDRESSES } from "./contracts";

interface ContractStore {
  // Contract Addresses
  contracts: typeof CONTRACT_ADDRESSES;

  // Contract states
  isContractReady: Record<keyof typeof CONTRACT_ADDRESSES, boolean>;

  // Methods
  getContractAddress: (name: keyof typeof CONTRACT_ADDRESSES) => string;
  setContractReady: (name: keyof typeof CONTRACT_ADDRESSES, ready: boolean) => void;
  verifyAllContracts: () => Promise<boolean>;
}

export const useContractStore = create<ContractStore>((set, get) => ({
  contracts: CONTRACT_ADDRESSES,
  isContractReady: {
    starToken: false,
    starTokenWallet: false,
    planetNFT: false,
    planetNFTItem: false,
    referralFaucet: false,
  },

  getContractAddress: (name: keyof typeof CONTRACT_ADDRESSES) => {
    return get().contracts[name];
  },

  setContractReady: (name: keyof typeof CONTRACT_ADDRESSES, ready: boolean) => {
    set((state) => ({
      isContractReady: {
        ...state.isContractReady,
        [name]: ready,
      },
    }));
  },

  verifyAllContracts: async () => {
    try {
      const response = await fetch("/api/blockchain/contracts");
      const data = await response.json();

      if (data.success) {
        const allReady = Object.keys(data.contracts).every((name) => {
          set((state) => ({
            isContractReady: {
              ...state.isContractReady,
              [name]: true,
            },
          }));
          return true;
        });
        return allReady;
      }
      return false;
    } catch (error) {
      console.error("Failed to verify contracts:", error);
      return false;
    }
  },
}));