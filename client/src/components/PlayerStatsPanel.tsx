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
    <div className="fixed top-20 right-4 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border border-cyan-500/30 rounded-lg p-4 w-80 max-w-sm backdrop-blur-sm">
      {/* Title */}
      <div className="text-cyan-400 font-bold text-sm mb-4 flex items-center gap-2">
        <span>📊</span> Player Stats
      </div>

      {/* STAR Balance */}
      <div className="bg-slate-700/30 rounded p-3 mb-3">
        <div className="text-yellow-400 text-xs font-bold">⭐ STAR Balance</div>
        <div className="text-2xl font-bold text-yellow-300">{starBalance} STAR</div>
      </div>

      {/* Discovery Progress */}
      <div className="bg-slate-700/30 rounded p-3 mb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="text-cyan-300 text-xs font-bold">🪐 Discovered</div>
          <div className="text-cyan-300 text-xs">
            {stats.discoveredCount || 0}/28
          </div>
        </div>
        <div className="w-full bg-slate-600/50 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${discoveryProgress}%` }}
          />
        </div>
        <div className="text-slate-400 text-xs mt-1">{Math.round(discoveryProgress)}% Complete</div>
      </div>

      {/* NFT Ownership */}
      <div className="bg-slate-700/30 rounded p-3 mb-3">
        <div className="text-purple-300 text-xs font-bold">🎨 NFTs Owned</div>
        <div className="text-xl font-bold text-purple-400">{stats.nftCount || 0}</div>
        <div className="text-slate-400 text-xs mt-1">
          {stats.nftCount ? `Earn ${passiveIncomePerDay.toFixed(1)} STAR/day` : "Mint planets to earn passive income"}
        </div>
      </div>

      {/* Passive Income */}
      {stats.nftCount ? (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded p-3 mb-3">
          <div className="text-green-300 text-xs font-bold mb-2">💰 Passive Income</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-slate-400">/hour</div>
              <div className="text-green-400 font-bold">{passiveIncomePerHour.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-400">/day</div>
              <div className="text-green-400 font-bold">{passiveIncomePerDay.toFixed(1)}</div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Total Earned */}
      <div className="bg-slate-700/30 rounded p-3">
        <div className="text-blue-300 text-xs font-bold">📈 Total Earned</div>
        <div className="text-lg font-bold text-blue-400">{stats.totalEarned || 0} STAR</div>
        <div className="text-slate-400 text-xs mt-1">
          All-time rewards from discoveries
        </div>
      </div>

      {/* Tip */}
      <div className="mt-4 text-xs text-slate-400 text-center">
        💡 Mint planets to unlock passive income!
      </div>
    </div>
  );
}
