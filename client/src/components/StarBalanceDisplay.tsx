import { useGameBalance } from "@/lib/stores/useGameBalance";
import { Card } from "./ui/card";

export function StarBalanceDisplay() {
  const { starBalance, genesisClaimedAt } = useGameBalance();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/50 shadow-lg">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="text-2xl">⭐</div>
          <div className="flex flex-col">
            <div className="text-sm text-slate-400 font-medium">STAR Balance</div>
            <div className="text-2xl font-bold text-cyan-400">{starBalance}</div>
          </div>
          {genesisClaimedAt && (
            <div className="text-xs text-cyan-500 ml-2 px-2 py-1 bg-cyan-500/10 rounded">
              ✓ Genesis
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
