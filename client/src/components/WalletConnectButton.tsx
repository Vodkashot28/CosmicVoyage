import { TonConnectButton, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect } from "react";
import { useGameBalance } from "@/lib/stores/useGameBalance";

/**
 * Wrapper component to ensure TonConnect button is always visible
 * and properly styled on both desktop and mobile
 */
export function WalletConnectButton() {
  const address = useTonAddress();
  const { fetchBalance } = useGameBalance();
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    // Restore connection on mount
    tonConnectUI.connectionRestored.then(() => {
      if (tonConnectUI.connected && tonConnectUI.wallet) {
        console.log("Wallet connection restored");
      }
    });
  }, [tonConnectUI]);

  useEffect(() => {
    if (address) {
      console.log("Wallet connected:", address);
      fetchBalance(address);
    } else {
      console.log("Wallet disconnected or not connected");
    }
  }, [address, fetchBalance]);

  return (
    <div className="flex items-center justify-center">
      <div className="tonconnect-wrapper">
        <TonConnectButton />
      </div>
    </div>
  );
}