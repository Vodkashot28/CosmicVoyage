import { useState, useEffect } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useGameBalance } from "@/lib/stores/useGameBalance";

export function PlayerStatsPanel() {
  const wallet = useTonWallet();
  const { starBalance } = useGameBalance();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!wallet?.account.address) return;

    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/analytics/player-stats/${wallet.account.address}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [wallet?.account.address]);

  if (!stats) return null;

  const discoveryProgress = ((stats.discoveredCount || 0) / 28) * 100;
  const passiveIncomePerHour = (stats.nftCount || 0) * 0.5;
  const passiveIncomePerDay = passiveIncomePerHour * 24;

  return (
    <div className="space-y-2">
      {/* Discovery Progress */}
      <div className="bg-slate-800/50 border border-purple-500/30 rounded p-2">
        <div className="flex justify-between items-center mb-1">
          <div className="text-purple-300 text-xs font-bold">🪐 Discovered</div>
          <div className="text-purple-300 text-xs">
            {stats.discoveredCount || 0}/28
          </div>
        </div>
        <div className="w-full bg-slate-600/50 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all"
            style={{ width: `${discoveryProgress}%` }}
          />
        </div>
      </div>

      {/* NFT Ownership */}
      <div className="bg-slate-800/50 border border-purple-500/30 rounded p-2">
        <div className="text-purple-300 text-xs font-bold">🎨 NFTs Owned</div>
        <div className="text-sm font-bold text-purple-400">{stats.nftCount || 0}</div>
        {stats.nftCount > 0 && (
          <div className="text-xs text-slate-400 mt-1">
            Earn {passiveIncomePerDay.toFixed(1)} STAR/day
          </div>
        )}
      </div>

      {/* Total Earned */}
      <div className="bg-slate-800/50 border border-blue-500/30 rounded p-2">
        <div className="text-blue-300 text-xs font-bold">📈 Total Earned</div>
        <div className="text-sm font-bold text-blue-400">{stats.totalEarned || 0} STAR</div>
      </div>
    </div>
  );
}
