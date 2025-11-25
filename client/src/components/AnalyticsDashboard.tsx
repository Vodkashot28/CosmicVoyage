import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Users, Zap, Award, Flame } from "lucide-react";

interface LeaderboardEntry {
  walletAddress: string;
  username: string;
  totalDiscovered: number;
  totalNFTsMinted: number;
  totalStarEarned: number;
  totalStarBurned: number;
}

interface GlobalStats {
  today?: {
    totalNewPlayers: number;
    totalDiscoveries: number;
    totalNFTsMinted: number;
    totalStarDistributed: number;
    totalStarBurned: number;
  };
  allTime?: {
    totalUsers: number;
    totalDiscovered: number;
    totalNFTsMinted: number;
    totalStarEarned: number;
    totalStarBurned: number;
  };
}

export function AnalyticsDashboard() {
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const [statsRes, lbRes] = await Promise.all([
        fetch("/api/analytics/stats/global"),
        fetch("/api/analytics/leaderboard/star_earned?limit=10"),
      ]);

      if (statsRes.ok) {
        const stats = await statsRes.json();
        setGlobalStats(stats);
      }

      if (lbRes.ok) {
        const lb = await lbRes.json();
        setLeaderboard(lb);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-slate-300">Loading analytics...</div>;
  }

  const allTime = globalStats?.allTime || {};
  const today = globalStats?.today || {};

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-8 h-8 text-purple-400" />
        Game Analytics
      </h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          title="Total Players"
          value={allTime.totalUsers || 0}
          color="blue"
        />
        <MetricCard
          icon={<Award className="w-5 h-5" />}
          title="Total Discoveries"
          value={allTime.totalDiscovered || 0}
          color="purple"
        />
        <MetricCard
          icon={<Zap className="w-5 h-5" />}
          title="Total STAR Earned"
          value={`${allTime.totalStarEarned || 0}`}
          color="yellow"
        />
        <MetricCard
          icon={<Flame className="w-5 h-5" />}
          title="Total STAR Burned"
          value={`${allTime.totalStarBurned || 0}`}
          color="red"
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600">
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-purple-600">
            Trends
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* STAR Economy Distribution */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                STAR Economy
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Earned:</span>
                  <span className="text-yellow-300 font-bold">{allTime.totalStarEarned || 0} STAR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Burned:</span>
                  <span className="text-red-300 font-bold">{allTime.totalStarBurned || 0} STAR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Net Supply:</span>
                  <span className="text-green-300 font-bold">
                    {(allTime.totalStarEarned || 0) - (allTime.totalStarBurned || 0)} STAR
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <div className="text-xs text-slate-400">
                    Burn Rate: {((allTime.totalStarBurned || 0) / (allTime.totalStarEarned || 1) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </Card>

            {/* Collection Stats */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                Collection Progress
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Total NFTs Minted:</span>
                  <span className="text-purple-300 font-bold">{allTime.totalNFTsMinted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Avg NFTs per Player:</span>
                  <span className="text-purple-300 font-bold">
                    {((allTime.totalNFTsMinted || 0) / (allTime.totalUsers || 1)).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Discoveries:</span>
                  <span className="text-blue-300 font-bold">{allTime.totalDiscovered || 0}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Today's Activity */}
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <h2 className="font-bold text-white mb-4">Today&apos;s Activity</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              <div className="bg-slate-700/30 p-2 rounded">
                <div className="text-slate-400 text-xs">New Players</div>
                <div className="text-white font-bold">{today.totalNewPlayers || 0}</div>
              </div>
              <div className="bg-slate-700/30 p-2 rounded">
                <div className="text-slate-400 text-xs">Discoveries</div>
                <div className="text-white font-bold">{today.totalDiscoveries || 0}</div>
              </div>
              <div className="bg-slate-700/30 p-2 rounded">
                <div className="text-slate-400 text-xs">NFTs Minted</div>
                <div className="text-white font-bold">{today.totalNFTsMinted || 0}</div>
              </div>
              <div className="bg-slate-700/30 p-2 rounded">
                <div className="text-slate-400 text-xs">STAR Earned</div>
                <div className="text-yellow-300 font-bold">{today.totalStarDistributed || 0}</div>
              </div>
              <div className="bg-slate-700/30 p-2 rounded">
                <div className="text-slate-400 text-xs">STAR Burned</div>
                <div className="text-red-300 font-bold">{today.totalStarBurned || 0}</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Top STAR Earners
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-700/50 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-slate-300">Rank</th>
                    <th className="px-4 py-2 text-left text-slate-300">Player</th>
                    <th className="px-4 py-2 text-right text-yellow-300">STAR Earned</th>
                    <th className="px-4 py-2 text-right text-red-300">Burned</th>
                    <th className="px-4 py-2 text-right text-purple-300">NFTs</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.walletAddress} className="border-b border-slate-700 hover:bg-slate-700/20">
                      <td className="px-4 py-2">
                        <span className="font-bold text-white">{index + 1}</span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-white font-semibold">{entry.username}</div>
                        <div className="text-xs text-slate-400">{entry.walletAddress.substring(0, 8)}...</div>
                      </td>
                      <td className="px-4 py-2 text-right text-yellow-300">{entry.totalStarEarned}</td>
                      <td className="px-4 py-2 text-right text-red-300">{entry.totalStarBurned}</td>
                      <td className="px-4 py-2 text-right text-purple-300">{entry.totalNFTsMinted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <p className="text-slate-400">Trends analysis coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-900/20 border-blue-600/30",
    purple: "bg-purple-900/20 border-purple-600/30",
    yellow: "bg-yellow-900/20 border-yellow-600/30",
    red: "bg-red-900/20 border-red-600/30",
  };

  const iconClasses: Record<string, string> = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
  };

  return (
    <Card className={`${colorClasses[color]} border p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`${iconClasses[color]} opacity-50`}>{icon}</div>
      </div>
    </Card>
  );
}
