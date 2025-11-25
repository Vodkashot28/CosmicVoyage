import { TonConnectButton } from "@tonconnect/ui-react";

/**
 * Wrapper component to ensure TonConnect button is always visible
 * and properly styled on both desktop and mobile
 */
export function WalletConnectButton() {
  return (
    <div className="flex items-center justify-center">
      <div className="tonconnect-wrapper">
        <TonConnectButton />
      </div>
    </div>
  );
}
