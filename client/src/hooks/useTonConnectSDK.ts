import { useEffect, useState, useCallback } from 'react';
import TonConnect from '@tonconnect/sdk';
import { useSolarSystem } from '@/lib/stores/useSolarSystem';

interface ConnectedAddress {
  address: string;
  balance?: string;
  connectedAt: number;
}

export function useTonConnectSDK() {
  const [connector, setConnector] = useState<TonConnect | null>(null);
  const [connectedAddresses, setConnectedAddresses] = useState<ConnectedAddress[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { setWalletAddress } = useSolarSystem();

  useEffect(() => {
    const initConnector = async () => {
      try {
        const tc = new TonConnect({
          manifestUrl: `${window.location.origin}/tonconnect-manifest.json`
        });

        // Restore previous connection if exists
        await tc.restoreConnection();

        // Subscribe to connection status changes
        tc.onStatusChange((walletInfo) => {
          if (walletInfo) {
            const address = walletInfo.account?.address;
            if (address) {
              setWalletAddress(address);
              setConnectedAddresses((prev) => {
                const existing = prev.find(a => a.address === address);
                if (existing) return prev;
                return [...prev, {
                  address,
                  connectedAt: Date.now()
                }];
              });
              setIsConnected(true);
              console.log('[SDK] Wallet connected:', address);
            }
          } else {
            setIsConnected(false);
            setWalletAddress(null);
            console.log('[SDK] Wallet disconnected');
          }
        });

        setConnector(tc);
      } catch (error) {
        console.error('[SDK] Failed to initialize TonConnect:', error);
      }
    };

    initConnector();
  }, [setWalletAddress]);

  const sendTransaction = useCallback(async (
    toAddress: string,
    amountNano: string,
    payload?: string
  ) => {
    if (!connector || !isConnected) {
      throw new Error('Wallet not connected');
    }

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
      messages: [
        {
          address: toAddress,
          amount: amountNano,
          ...(payload && { payload })
        }
      ]
    };

    try {
      const result = await connector.sendTransaction(transaction);
      console.log('[SDK] Transaction sent:', result);
      return result;
    } catch (error) {
      console.error('[SDK] Transaction failed:', error);
      throw error;
    }
  }, [connector, isConnected]);

  const signData = useCallback(async (data: any) => {
    if (!connector || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const result = await connector.signData(data);
      console.log('[SDK] Data signed:', result);
      return result;
    } catch (error) {
      console.error('[SDK] Signing failed:', error);
      throw error;
    }
  }, [connector, isConnected]);

  const getConnectedWallets = useCallback(async () => {
    if (!connector) return [];
    try {
      const wallets = await connector.getWallets();
      return wallets;
    } catch (error) {
      console.error('[SDK] Failed to fetch wallets:', error);
      return [];
    }
  }, [connector]);

  return {
    connector,
    connectedAddresses,
    isConnected,
    sendTransaction,
    signData,
    getConnectedWallets
  };
}
