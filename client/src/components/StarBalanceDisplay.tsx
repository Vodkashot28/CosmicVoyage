import { useGameBalance } from "@/lib/stores/useGameBalance";
import { Card } from "./ui/card";

export function StarBalanceDisplay() {
  const { starBalance, genesisClaimedAt } = useGameBalance();

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-4">
      <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-cyan-500/40 shadow-lg backdrop-blur-md">
        <div className="px-3 py-2 flex items-center gap-2 md:px-4 md:py-3 md:gap-3">
          <div className="text-xl md:text-2xl">⭐</div>
          <div className="flex flex-col">
            <div className="text-xs md:text-sm text-slate-400 font-medium">STAR Balance</div>
            <div className="text-lg md:text-2xl font-bold text-cyan-400">{starBalance}</div>
          </div>
          {genesisClaimedAt && (
            <div className="text-xs text-cyan-500 ml-1 md:ml-2 px-2 py-1 bg-cyan-500/10 rounded whitespace-nowrap">
              ✓ Genesis
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
