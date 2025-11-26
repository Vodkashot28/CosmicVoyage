import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Crown, Gem, Zap } from "lucide-react";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { planetsData } from "@/data/planets";

interface StellarMapUnificationUIProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StellarMapUnificationUI({ isOpen, onClose }: StellarMapUnificationUIProps) {
  const [isUnifying, setIsUnifying] = useState(false);
  const [hasImmortal, setHasImmortal] = useState(false);
  const { ownedNFTs, totalTokens } = useSolarSystem();

  const UNIFICATION_COST = 2500;
  const PRESTIGE_BONUS = 0.001; // +0.1%

  const mainPlanets = planetsData.filter((p) => p.type === "planet");
  const dwarfPlanets = planetsData.filter((p) => p.type === "dwarfPlanet");

  const mainPlanetsOwned = mainPlanets.filter((p) => ownedNFTs.includes(p.name)).length;
  const dwarfPlanetsOwned = dwarfPlanets.filter((p) => ownedNFTs.includes(p.name)).length;

  const canUnify =
    mainPlanetsOwned >= 3 && dwarfPlanetsOwned >= 2 && totalTokens >= UNIFICATION_COST && !hasImmortal;

  const handleUnify = async () => {
    if (!canUnify) {
      if (hasImmortal) {
        toast.error("Already achieved", {
          description: "You have already achieved Immortal status",
        });
      } else if (mainPlanetsOwned < 3) {
        toast.error("Missing main planets", {
          description: `You need 3 main planets (have ${mainPlanetsOwned})`,
        });
      } else if (dwarfPlanetsOwned < 2) {
        toast.error("Missing dwarf planets", {
          description: `You need 2 dwarf planets (have ${dwarfPlanetsOwned})`,
        });
      } else if (totalTokens < UNIFICATION_COST) {
        toast.error("Insufficient STAR", {
          description: `You need ${UNIFICATION_COST} STAR (have ${totalTokens})`,
        });
      }
      return;
    }

    setIsUnifying(true);
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setHasImmortal(true);
      toast.success("🎉 Immortal Status Achieved!", {
        description: `Your legacy is now eternal. +${(PRESTIGE_BONUS * 100).toFixed(1)}% passive income multiplier`,
      });
    } catch (error) {
      toast.error("Unification failed", {
        description: "Please try again",
      });
    } finally {
      setIsUnifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-slate-900/95 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            Stellar Map Unification
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Achieve Immortal status by unifying your greatest discoveries
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Requirements Overview */}
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Gem className="w-5 h-5 text-purple-400" />
              Requirements for Immortality
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className={`p-3 rounded border ${mainPlanetsOwned >= 3 ? "bg-green-900/30 border-green-500/50" : "bg-red-900/30 border-red-500/50"}`}>
                <div className="text-sm text-white/70">Main Planets</div>
                <div className="text-2xl font-bold">
                  {mainPlanetsOwned} <span className="text-sm text-white/50">/ 3</span>
                </div>
                <div className="text-xs mt-1 text-white/60">Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune</div>
              </div>

              <div className={`p-3 rounded border ${dwarfPlanetsOwned >= 2 ? "bg-green-900/30 border-green-500/50" : "bg-red-900/30 border-red-500/50"}`}>
                <div className="text-sm text-white/70">Dwarf Planets</div>
                <div className="text-2xl font-bold">
                  {dwarfPlanetsOwned} <span className="text-sm text-white/50">/ 2</span>
                </div>
                <div className="text-xs mt-1 text-white/60">Pluto, Eris, Gonggong, Haumea, Makemake</div>
              </div>
            </div>

            <div className={`p-3 rounded border ${totalTokens >= UNIFICATION_COST ? "bg-green-900/30 border-green-500/50" : "bg-red-900/30 border-red-500/50"}`}>
              <div className="text-sm text-white/70">STAR Burn Cost</div>
              <div className="text-2xl font-bold">
                {totalTokens >= UNIFICATION_COST ? (
                  <span className="text-green-300">{UNIFICATION_COST} STAR</span>
                ) : (
                  <span className="text-red-300">
                    {UNIFICATION_COST - totalTokens} more needed
                  </span>
                )}
              </div>
              <div className="text-xs mt-1 text-white/60">
                You have: <span className="font-semibold">{totalTokens} STAR</span>
              </div>
            </div>
          </Card>

          {/* Immortality Benefits */}
          <Card className="bg-amber-900/20 border-amber-600/30 p-4">
            <h3 className="font-bold text-amber-200 mb-2 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Immortal Collector Benefits
            </h3>
            <ul className="space-y-2 text-sm text-amber-100/80">
              <li>✨ Permanent "Immortal Collector" title in your profile</li>
              <li>🏆 Unique badge displayed on leaderboard</li>
              <li>📈 +{(PRESTIGE_BONUS * 100).toFixed(1)}% passive income multiplier</li>
              <li>🎖️ Placed in Stellar Immortality Ledger forever</li>
              <li>👑 Access to exclusive achievements and cosmetics (future)</li>
            </ul>
          </Card>

          {/* Owned Collections */}
          <div className="space-y-2">
            <h3 className="font-bold text-white">Your Collection</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded p-3">
                <div className="text-sm text-white/70 mb-2">Main Planets Owned:</div>
                <div className="flex flex-wrap gap-1">
                  {mainPlanets.map((planet) =>
                    ownedNFTs.includes(planet.name) ? (
                      <div
                        key={planet.name}
                        className="bg-green-600/30 border border-green-500 rounded px-2 py-1 text-xs text-green-300"
                      >
                        {planet.name}
                      </div>
                    ) : null
                  )}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded p-3">
                <div className="text-sm text-white/70 mb-2">Dwarf Planets Owned:</div>
                <div className="flex flex-wrap gap-1">
                  {dwarfPlanets.map((planet) =>
                    ownedNFTs.includes(planet.name) ? (
                      <div
                        key={planet.name}
                        className="bg-purple-600/30 border border-purple-500 rounded px-2 py-1 text-xs text-purple-300"
                      >
                        {planet.name}
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          {hasImmortal && (
            <Card className="bg-gold-900/30 border-gold-500/50 p-4">
              <p className="text-center text-gold-300 font-bold">
                ✨ You have achieved Immortal Collector status! ✨
              </p>
            </Card>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUnifying}
            className="bg-slate-800 border-slate-600 hover:bg-slate-700"
          >
            Close
          </Button>
          <Button
            onClick={handleUnify}
            disabled={isUnifying || !canUnify || hasImmortal}
            className={`flex-1 ${canUnify && !hasImmortal ? "bg-amber-600 hover:bg-amber-700" : "bg-gray-600 opacity-50"}`}
          >
            {isUnifying ? "Achieving Immortality..." : hasImmortal ? "Already Immortal ✨" : "Achieve Immortality"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
