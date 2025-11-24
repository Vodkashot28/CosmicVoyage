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
}

export const useReferral = create<ReferralStore>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'referral-storage',
      version: 1,
    }
  )
);
