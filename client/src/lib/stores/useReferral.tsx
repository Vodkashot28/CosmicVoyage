import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReferralStore {
  referralCode: string | null;
  referrerWallet: string | null;
  referralStats: {
    count: number;
    bonus: number;
  };

  setReferralCode: (code: string) => void;
  setReferrerWallet: (wallet: string) => void;
  setReferralStats: (stats: { count: number; bonus: number }) => void;
  incrementReferralCount: () => void;
  
  // New API methods
  loadReferralStats: (walletAddress: string) => Promise<void>;
  claimGenesisWithReferral: (walletAddress: string, referralCode?: string) => Promise<void>;
}

export const useReferral = create<ReferralStore>()(
  persist(
    (set, get) => ({
      referralCode: null,
      referrerWallet: null,
      referralStats: { count: 0, bonus: 0 },

      setReferralCode: (code) => set({ referralCode: code }),
      setReferrerWallet: (wallet) => set({ referrerWallet: wallet }),
      setReferralStats: (stats) => set({ referralStats: stats }),
      
      incrementReferralCount: () => set((state) => ({
        referralStats: {
          count: state.referralStats.count + 1,
          bonus: state.referralStats.bonus,
        },
      })),
      
      // Load referral stats from backend
      loadReferralStats: async (walletAddress: string) => {
        try {
          const response = await fetch(`/api/player/referral-stats/${walletAddress}`);
          if (response.ok) {
            const data = await response.json();
            set({
              referralCode: data.referralCode,
              referralStats: {
                count: data.referralCount,
                bonus: data.bonusEarned,
              },
            });
          }
        } catch (error) {
          console.error('Failed to load referral stats:', error);
        }
      },
      
      // Claim genesis with referral code
      claimGenesisWithReferral: async (walletAddress: string, referralCode?: string) => {
        try {
          const response = await fetch('/api/player/claim-genesis-with-referral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress, referralCode }),
          });
          
          if (response.ok) {
            const data = await response.json();
            set({ referralCode: data.referralCode });
          }
        } catch (error) {
          console.error('Failed to claim genesis with referral:', error);
        }
      },
    }),
    {
      name: 'referral-storage',
      version: 1,
    }
  )
);
