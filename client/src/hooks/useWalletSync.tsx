import { useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useGameBalance } from "@/lib/stores/useGameBalance";
import { useReferral } from "@/lib/stores/useReferral";
import { api } from "@/lib/api";

export function useWalletSync() {
  const [tonConnectUI] = useTonConnectUI();
  const { setStarBalance } = useGameBalance();
  const { setReferralStats } = useReferral();

  useEffect(() => {
    const syncWalletData = async () => {
      const wallet = tonConnectUI?.wallet;
      if (!wallet?.account?.address) return;

      const walletAddress = wallet.account.address;

      try {
        // Sync STAR balance
        const balanceData = await api.getStarBalance(walletAddress);
        if (balanceData && typeof balanceData.starBalance === 'number') {
          setStarBalance(balanceData.starBalance);
        }

        // Sync referral stats
        const referralData = await api.getReferralStats(walletAddress);
        if (referralData) {
          setReferralStats(referralData);
        }
      } catch (error) {
        console.error("Failed to sync wallet data:", error);
      }
    };

    syncWalletData();
  }, [tonConnectUI?.wallet?.account?.address, setStarBalance, setReferralStats]);
}