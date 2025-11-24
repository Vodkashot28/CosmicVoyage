import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function NFTBenefits() {
  const { ownedNFTs, getPassiveIncomeFromNFTs, getSetBonusTokens } = useSolarSystem();
  const income = getPassiveIncomeFromNFTs();
  const bonuses = getSetBonusTokens();

  if (ownedNFTs.length === 0 && bonuses.innerPlanets === 0 && bonuses.outerPlanets === 0 && bonuses.allPlanets === 0) {
    return null;
  }

  const totalBonusAvailable = bonuses.innerPlanets + bonuses.outerPlanets + bonuses.allPlanets;

  return (
    <Card className="bg-white/5 border-white/10 p-3">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-green-400" />
        <span className="text-white font-semibold text-sm">NFT Benefits</span>
      </div>

      {income.tokensPerHour > 0 && (
        <div className="mb-2 bg-green-900/20 border border-green-500/20 rounded p-2">
          <div className="text-green-400 text-xs font-semibold">
            💚 {income.tokensPerHour.toFixed(1)} tokens/hour
          </div>
          <div className="text-white/60 text-xs">Passive income from NFTs</div>
        </div>
      )}

      {totalBonusAvailable > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
          <div className="text-yellow-400 text-xs font-semibold">
            ✨ +{totalBonusAvailable} Set Bonuses
          </div>
        </div>
      )}
    </Card>
  );
}
