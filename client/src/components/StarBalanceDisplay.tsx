import { useGameBalance } from "@/lib/stores/useGameBalance";
import { Card } from "./ui/card";

export function StarBalanceDisplay() {
  const { starBalance, genesisClaimedAt } = useGameBalance();

  return (
    <div className="bg-slate-800/50 border border-cyan-500/30 rounded p-2 mb-2">
      <div className="text-xs text-cyan-400 uppercase mb-1 font-semibold leading-tight">Balance</div>
      <div className="px-1 py-1">
        <div className="flex items-center gap-2">
          <div className="text-lg">⭐</div>
          <div className="flex flex-col">
            <div className="text-xs text-slate-400 font-medium">STAR</div>
            <div className="text-base font-bold text-cyan-400">{starBalance}</div>
          </div>
          {genesisClaimedAt && (
            <div className="text-xs text-cyan-500 ml-auto px-1.5 py-0.5 bg-cyan-500/10 rounded whitespace-nowrap">
              ✓ Genesis
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
