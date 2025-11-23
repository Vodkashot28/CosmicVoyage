import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameBalanceStore {
  starBalance: number;
  walletAddress: string | null;
  genesisClaimedAt: Date | null;
  
  setWalletAddress: (address: string | null) => void;
  setStarBalance: (balance: number) => void;
  addStarBalance: (amount: number) => void;
  subtractStarBalance: (amount: number) => void;
  setGenesisClaimedAt: (date: Date | null) => void;
}

export const useGameBalance = create<GameBalanceStore>()(
  persist(
    (set) => ({
      starBalance: 0,
      walletAddress: null,
      genesisClaimedAt: null,
      
      setWalletAddress: (address) => set({ walletAddress: address }),
      
      setStarBalance: (balance) => set({ starBalance: Math.max(0, balance) }),
      
      addStarBalance: (amount) => set((state) => ({
        starBalance: Math.max(0, state.starBalance + amount),
      })),
      
      subtractStarBalance: (amount) => set((state) => ({
        starBalance: Math.max(0, state.starBalance - amount),
      })),
      
      setGenesisClaimedAt: (date) => set({ genesisClaimedAt: date }),
    }),
    {
      name: 'game-balance-storage',
      version: 1,
    }
  )
);
