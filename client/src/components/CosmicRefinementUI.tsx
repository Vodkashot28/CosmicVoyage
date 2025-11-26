import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import type { PlanetData } from "@/data/planets";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";

interface CosmicRefinementUIProps {
  planet: PlanetData;
  isOpen: boolean;
  onClose: () => void;
}

export function CosmicRefinementUI({ planet, isOpen, onClose }: CosmicRefinementUIProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isRefining, setIsRefining] = useState(false);
  const { totalTokens } = useSolarSystem();

  const getRefinementCost = (level: number): number => {
    const costs: Record<number, number> = {
      1: 50,
      2: 125,
      3: 200,
      4: 300,
      5: 450,
      6: 650,
      7: 900,
      8: 1200,
    };
    return costs[level] || 0;
  };

  const getYieldMultiplier = (level: number): number => {
    return 1 + level * 0.02; // +2% per level
  };

  const nextCost = getRefinementCost(currentLevel + 1);
  const nextMultiplier = getYieldMultiplier(currentLevel + 1);
  const canRefine = currentLevel < 8 && totalTokens >= nextCost;
  const maxLevel = currentLevel >= 8;

  const handleRefine = async () => {
    if (!canRefine) {
      toast.error("Cannot refine", {
        description: maxLevel ? "Max refinement reached" : "Insufficient STAR tokens",
      });
      return;
    }

    setIsRefining(true);
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCurrentLevel(currentLevel + 1);
      toast.success(`${planet.name} refined to Level ${currentLevel + 1}!`, {
        description: `Passive income now +${(nextMultiplier - 1) * 100}%`,
      });
    } catch (error) {
      toast.error("Refinement failed", {
        description: "Please try again",
      });
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900/95 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Cosmic Refinement
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Upgrade {planet.name}'s passive income by burning STAR tokens
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Planet Info */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg" style={{ color: planet.color }}>
                  {planet.name}
                </h3>
                <p className="text-sm text-slate-400 mt-1">{planet.facts.description}</p>
              </div>
              <div className="text-2xl font-bold text-amber-400">Lvl {currentLevel}</div>
            </div>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-blue-900/30 border-blue-500/30 p-4">
              <div className="text-sm text-blue-300/70 mb-1">Current Yield</div>
              <div className="text-xl font-bold text-blue-300">
                {planet.passiveIncomeRate} STAR/hour
              </div>
              <div className="text-xs text-blue-300/50 mt-1">
                ×{getYieldMultiplier(currentLevel).toFixed(2)} multiplier
              </div>
            </Card>

            <Card className="bg-green-900/30 border-green-500/30 p-4">
              <div className="text-sm text-green-300/70 mb-1">Next Yield</div>
              <div className="text-xl font-bold text-green-300">
                {((planet.passiveIncomeRate ?? 0) * nextMultiplier).toFixed(2)} STAR/hour
              </div>
              <div className="text-xs text-green-300/50 mt-1">
                ×{nextMultiplier.toFixed(2)} multiplier
              </div>
            </Card>
          </div>

          {/* Refinement Cost */}
          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-purple-400">Next Refinement Cost</span>
            </div>

            {!maxLevel ? (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-purple-300">{nextCost} STAR</p>
                <div className="text-xs text-purple-300/70">
                  {totalTokens >= nextCost ? (
                    <span className="text-green-400">✓ You have sufficient STAR</span>
                  ) : (
                    <span className="text-red-400">
                      ✗ Need {nextCost - totalTokens} more STAR
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-amber-300">🎉 Maximum refinement level reached!</p>
            )}
          </div>

          {/* Refinement Path */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Refinement Path
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
                <div
                  key={level}
                  className={`text-center rounded p-2 text-xs font-semibold ${
                    level <= currentLevel
                      ? "bg-green-600 text-white"
                      : level === currentLevel + 1
                        ? "bg-blue-600 text-white border border-blue-400"
                        : "bg-slate-700 text-slate-300"
                  }`}
                >
                  <div>Lv{level}</div>
                  <div className="text-xs opacity-70">{getRefinementCost(level)} ✦</div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-600/30">
            <p className="text-xs text-amber-200">
              💫 <span className="font-semibold">Benefits:</span> Each refinement increases passive
              income by 2% cumulatively. At max level 8, earn {(((planet.passiveIncomeRate ?? 0) * 1.16)).toFixed(2)} STAR/hour
              ({(((planet.passiveIncomeRate ?? 0) * 1.16 * 24)).toFixed(1)} daily)
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isRefining}
            className="bg-slate-800 border-slate-600 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRefine}
            disabled={isRefining || !canRefine}
            className={`flex-1 ${canRefine && !maxLevel ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 opacity-50"}`}
          >
            {isRefining ? "Refining..." : maxLevel ? "Max Level Reached" : `Refine Level ${currentLevel + 1}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
