import { useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";

export function useWalletSync() {
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        console.log("[WalletSync] Wallet connected:", wallet.account.address);
      } else {
        console.log("[WalletSync] Wallet disconnected");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI]);
}
