
import { useEffect } from 'react';
import { useGameBalance } from '@/lib/stores/useGameBalance';
import { useSolarSystem } from '@/lib/stores/useSolarSystem';
import { useReferral } from '@/lib/stores/useReferral';

export function useWalletSync() {
  const walletAddress = useGameBalance((state) => state.walletAddress);
  const loadBalance = useGameBalance((state) => state.loadBalance);
  const loadReferralStats = useReferral((state) => state.loadReferralStats);
  
  useEffect(() => {
    if (walletAddress) {
      // Sync all stores when wallet connects
      loadBalance(walletAddress);
      loadReferralStats(walletAddress);
      
      // Validate and fix solar system state
      const validateAndFixState = useSolarSystem.getState().validateAndFixState;
      validateAndFixState();
      
      console.log('[WalletSync] Synced all stores for wallet:', walletAddress);
    }
  }, [walletAddress, loadBalance, loadReferralStats]);
}
