import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { useAudio } from "@/lib/stores/useAudio";
import type { PlanetData } from "@/data/planets";
import { Zap, Coins } from "lucide-react";

interface PlanetMintModalProps {
  planet: PlanetData | null;
  isOpen: boolean;
  onClose: () => void;
  onMintConfirm: (planetName: string) => void;
}

export function PlanetMintModal({
  planet,
  isOpen,
  onClose,
  onMintConfirm,
}: PlanetMintModalProps) {
  const [isMinting, setIsMinting] = useState(false);
  const { claimDiscoveryReward, markNFTMinted } = useSolarSystem();
  const { playSuccess } = useAudio();

  if (!planet) return null;

  const getMintingCost = () => {
    if (planet.type === "dwarfPlanet") {
      return {
        star: 200,
        ton: 0.15,
        description: "Unlock cost (200 STAR burn) + gas fee",
      };
    }
    return {
      star: 0,
      ton: planet.mintingCost || 0.1,
      description: "Gas fee only (covers blockchain transaction)",
    };
  };

  const getCelestialShieldAlternative = () => {
    if (planet.type === "dwarfPlanet") {
      return {
        available: false,
        reason: "Dwarf planets require STAR unlock",
      };
    }
    return {
      available: true,
      cost: 75,
      description: "Use Celestial Shield to mint for free (burn 75 STAR)",
    };
  };

  const cost = getMintingCost();
  const shield = getCelestialShieldAlternative();

  const handleMintConfirm = async () => {
    setIsMinting(true);
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mark NFT as minted
      markNFTMinted(planet.name, `tx_${Date.now()}`);

      // Claim the discovery reward (award tokens)
      const rewarded = claimDiscoveryReward(planet.name);

      if (rewarded) {
        playSuccess();
        toast.success(`${planet.name} NFT Minted! 🎉`, {
          description: `You earned ${planet.tokenReward} STAR tokens`,
        });
        onMintConfirm(planet.name);
        onClose();
      } else {
        toast.error("Failed to claim reward");
      }
    } catch (error) {
      toast.error("Minting failed", {
        description: "Please try again",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900/95 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            Mint {planet.name} NFT
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Confirm the details and cost to mint this planet as a permanent NFT
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Planet Info */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg" style={{ color: planet.color }}>
                  {planet.name}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {planet.facts.description}
                </p>
              </div>
            </div>
          </div>

          {/* Reward Info */}
          <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-green-400" />
              <span className="font-bold text-green-400">Your Reward</span>
            </div>
            <p className="text-xl font-bold text-green-300">
              +{planet.tokenReward} STAR tokens
            </p>
            <p className="text-sm text-green-300/70 mt-1">
              Once minted, this NFT will earn {planet.passiveIncomeRate}/hour passive income
            </p>
          </div>

          {/* Minting Cost */}
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-blue-400">Minting Cost</span>
            </div>

            {cost.star > 0 && (
              <p className="text-sm text-blue-300 mb-2">
                🔥 {cost.star} STAR (burn - permanent removal from supply)
              </p>
            )}

            {cost.ton > 0 && (
              <p className="text-sm text-blue-300 mb-2">
                ⛽ {cost.ton} TON (gas fee - blockchain transaction)
              </p>
            )}

            <p className="text-xs text-blue-300/70">{cost.description}</p>
          </div>

          {/* Celestial Shield Alternative */}
          {shield.available && (
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
              <p className="text-sm text-purple-300">
                💫 <span className="font-bold">Alternative:</span> {shield.description}
              </p>
              <p className="text-xs text-purple-300/70 mt-2">
                Recommended if you have extra STAR and are low on TON
              </p>
            </div>
          )}

          {/* Passive Income Info */}
          <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-600/30">
            <p className="text-xs text-amber-200">
              📊 <span className="font-semibold">With this NFT:</span> You'll earn approximately{" "}
              <span className="font-bold">
                {(planet.passiveIncomeRate! * 24).toFixed(1)} STAR/day
              </span>{" "}
              from passive income
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isMinting}
            className="bg-slate-800 border-slate-600 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleMintConfirm}
            disabled={isMinting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isMinting ? "Minting..." : `Confirm & Mint (${planet.tokenReward} STAR)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
