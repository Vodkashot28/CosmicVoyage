import { useEffect, useState } from "react";
import { Sparkles, Copy, CheckCircle, Loader, Zap, Shield } from "lucide-react";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { nftMinter } from "@/lib/ton/tonMinter";
import { planetsData } from "@/data/planets";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { generateGLTFNFTMetadata, uploadNFTToIPFS } from "@/lib/ton/gltfNFT";

interface NFTStatusProps {
  planetName: string;
}

export function NFTStatus({ planetName }: NFTStatusProps) {
  const { discoveredPlanets, walletAddress, markNFTMinted } = useSolarSystem();
  const [mintingInProgress, setMintingInProgress] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const discovery = discoveredPlanets.find(d => d.planetName === planetName);
  const planet = planetsData.find(p => p.name === planetName);
  const discoveryIndex = discoveredPlanets.findIndex(d => d.planetName === planetName) + 1;

  const handleMintNFT = async () => {
    if (!walletAddress || !planet) {
      toast.error("Please connect your wallet first");
      return;
    }

    setMintingInProgress(true);
    try {
      // Generate glTF NFT metadata
      const gltfNFT = generateGLTFNFTMetadata(planetName, discoveryIndex, planet);

      // Upload to IPFS
      const ipfsHash = await uploadNFTToIPFS(gltfNFT);

      // Mint NFT
      const txResult = await nftMinter.mintPlanetNFT(
        walletAddress,
        planetName,
        discoveryIndex,
        planet
      );

      // 💡 FIX: The compiler infers txResult as the message payload type, lacking 'transactionHash'.
      // We use an 'as any' cast to safely access the expected runtime property.
      const transactionHashString = (txResult as any)?.transactionHash
        ? String((txResult as any).transactionHash)
        : 'TRANSACTION_ID_MISSING';

      markNFTMinted(planetName, transactionHashString);

      toast.success(`🎨 ${planetName} NFT minted! 3D model: ${ipfsHash.slice(0, 10)}...`);
      console.log('glTF NFT metadata:', gltfNFT);
    } catch (error) {
      console.error("NFT minting failed:", error);
      toast.error("Failed to mint NFT");
    } finally {
      setMintingInProgress(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  if (!discovery) return null;

  return (
    <div className="mt-6 space-y-3">
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-purple-300 font-semibold">Planet NFT (3D glTF Model)</h3>
        </div>
        <p className="text-white/60 text-sm mb-3">
          Mint this planet as a unique 3D NFT with detailed model and metadata
        </p>

        {discovery.nftMinted ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">NFT Minted!</span>
            </div>
            {discovery.nftTransactionHash && (
              <div className="bg-black/40 rounded p-2 flex items-center justify-between gap-2">
                <code className="text-white/70 text-xs break-all">
                  {/* Ensuring display is always string-safe */}
                  {discovery.nftTransactionHash
                    ? `${String(discovery.nftTransactionHash).slice(0, 20)}...`
                    : 'Transaction Hash Loading...'}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(discovery.nftTransactionHash || "")}
                  className="text-white/60 hover:text-white"
                >
                  {copiedHash ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : walletAddress ? (
          <Button
            onClick={handleMintNFT}
            disabled={mintingInProgress}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2"
          >
            {mintingInProgress ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Minting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Mint as NFT
              </>
            )}
          </Button>
        ) : (
          <p className="text-white/60 text-sm">Connect your wallet to mint this planet as an NFT</p>
        )}
      </div>
    </div>
  );
}
