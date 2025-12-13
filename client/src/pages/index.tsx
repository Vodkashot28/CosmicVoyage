import { useCallback, useEffect, useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { toast } from "sonner";

import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { useNFTMinter } from "@/lib/stores/useNFTMinter";
import { mintPlanetNFT } from "@/lib/ton/tonMinter"; // Correct import

import { FullscreenCanvas } from "@/components/canvas/FullscreenCanvas";
import { Navbar } from "@/components/Navbar";
import { MintOverlay } from "@/components/MintOverlay";
import { Button } from "@/components/ui/button";

// A complex scene likely needs a large component to manage the 3D aspects
import { SolarSystemScene } from "@/components/SolarSystemScene"; // Placeholder for your 3D canvas component

// Types for your planet data (assuming defined elsewhere or imported)
interface PlanetData {
  name: string;
  order: number;
  // ... other data needed for metadata generation
}

export default function HomePage() {
  const [tonConnectUI] = useTonConnectUI();
  const { isConnected, userAddress } = useSolarSystem();
  const { currentPlanet, discoveryOrder, isMinting, setIsMinting, planetData } = useNFTMinter();
  const [isMintSuccessful, setIsMintSuccessful] = useState(false);

  // --- TON Connect & Minting Logic ---

  const handleMintNFT = useCallback(async () => {
    if (!userAddress || !currentPlanet || !planetData) {
      toast.error("Wallet not connected or planet data is missing.");
      return;
    }

    setIsMinting(true);
    toast.info(`Preparing to mint NFT for ${currentPlanet}...`);

    try {
      // 1. Create the TON Connect payload
      const payload = await mintPlanetNFT(
        userAddress,
        currentPlanet,
        discoveryOrder,
        planetData
      );

      // 2. Send the transaction using TON Connect UI
      const result = await tonConnectUI.sendTransaction({
        messages: [{
          address: payload.to,
          amount: payload.amount,
          payload: payload.body?.toBoc().toString('base64'), // Pass the Cell as base64 BOC
        }],
        validUntil: Date.now() + 120000, // 2 minutes timeout
      });

      // Transaction was sent successfully
      console.log("Transaction result:", result);

      // TODO: Implement server-side logic to verify the mint and record the tokenId
      
      toast.success(`Successfully sent transaction! Your NFT is minting.`);
      setIsMintSuccessful(true);

    } catch (error) {
      console.error("NFT Minting failed:", error);
      // Check for user-cancelled transaction
      if (error instanceof Error && error.message.includes('User closed the modal')) {
        toast.warning("Minting cancelled by user.");
      } else {
        toast.error("Minting failed. See console for details.");
      }
      
    } finally {
      setIsMinting(false);
    }
  }, [userAddress, currentPlanet, discoveryOrder, planetData, tonConnectUI, setIsMinting]);


  // --- UI/View Logic ---

  // Reset mint status when the planet or address changes
  useEffect(() => {
    setIsMintSuccessful(false);
  }, [currentPlanet, userAddress]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Main 3D Scene */}
      <FullscreenCanvas>
        <SolarSystemScene />
      </FullscreenCanvas>

      {/* Mint Overlay for discovered/selected planet */}
      {currentPlanet && (
        <MintOverlay
          planetName={currentPlanet}
          discoveryOrder={discoveryOrder}
          planetData={planetData as PlanetData}
          onMint={handleMintNFT}
          isConnected={isConnected}
          isMinting={isMinting}
          isMinted={isMintSuccessful} // Use this state to change the button text/action
        />
      )}

      {/* Connection Prompt (if not connected and no planet is selected) */}
      {!isConnected && !currentPlanet && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center bg-gray-900/80 p-6 rounded-xl shadow-2xl backdrop-blur-sm">
            <h1 className="text-3xl font-bold text-white mb-4">
              Explore the Cosmos
            </h1>
            <p className="text-gray-300 mb-6">
              Connect your TON wallet to begin your journey and discover new planets.
            </p>
            <Button
              size="lg"
              onClick={() => tonConnectUI.openModal()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
