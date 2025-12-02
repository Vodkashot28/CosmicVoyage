import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameBalanceStore {
  starBalance: number;
  walletAddress: string | null;
  genesisClaimedAt: Date | null;
  isLoading: boolean;
  
  setWalletAddress: (address: string | null) => void;
  setStarBalance: (balance: number) => void;
  addStarBalance: (amount: number) => void;
  subtractStarBalance: (amount: number) => void;
  setGenesisClaimedAt: (date: Date | null) => void;
  
  // New API methods
  loadBalance: (walletAddress: string) => Promise<void>;
  burnStarForUtility: (walletAddress: string, amount: number, utility: string) => Promise<void>;
  syncWithBackend: (walletAddress: string) => Promise<void>;
}

export const useGameBalance = create<GameBalanceStore>()(
  persist(
    (set, get) => ({
      starBalance: 0,
      walletAddress: null,
      genesisClaimedAt: null,
      isLoading: false,
      
      setWalletAddress: (address) => {
        set({ walletAddress: address });
        if (address) {
          get().syncWithBackend(address);
        }
      },
      
      setStarBalance: (balance) => set({ starBalance: Math.max(0, balance) }),
      
      addStarBalance: (amount) => set((state) => ({
        starBalance: Math.max(0, state.starBalance + amount),
      })),
      
      subtractStarBalance: (amount) => set((state) => ({
        starBalance: Math.max(0, state.starBalance - amount),
      })),
      
      setGenesisClaimedAt: (date) => set({ genesisClaimedAt: date }),
      
      // Load balance from backend
      loadBalance: async (walletAddress: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`/api/player/star-balance/${walletAddress}`);
          if (response.ok) {
            const data = await response.json();
            set({ starBalance: data.starBalance, isLoading: false });
          }
        } catch (error) {
          console.error('Failed to load balance:', error);
          set({ isLoading: false });
        }
      },
      
      // Burn STAR and sync
      burnStarForUtility: async (walletAddress: string, amount: number, utility: string) => {
        try {
          const response = await fetch('/api/player/burn-star', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress, amount, utility }),
          });
          
          if (response.ok) {
            const data = await response.json();
            set({ starBalance: data.starBalance });
          }
        } catch (error) {
          console.error('Failed to burn STAR:', error);
        }
      },
      
      // Full sync with backend
      syncWithBackend: async (walletAddress: string) => {
        await get().loadBalance(walletAddress);
      },
    }),
    {
      name: 'game-balance-storage',
      version: 1,
    }
  )
);
