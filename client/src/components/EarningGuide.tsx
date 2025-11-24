import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Gift, TrendingUp, Calendar, Users, Trophy } from "lucide-react";

export function EarningGuide() {
  const earningMethods = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Planet Discovery",
      description: "Discover planets in order from Mercury to Neptune",
      reward: "10-150 STAR per planet",
      total: "445 STAR (all 8 planets)",
      color: "from-blue-600 to-cyan-600"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Daily Login",
      description: "Login once every 24 hours to claim your reward",
      reward: "10 STAR per day",
      total: "300 STAR per month",
      color: "from-yellow-600 to-orange-600"
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Login Streaks",
      description: "Maintain consecutive daily logins",
      reward: "7-day: 25 bonus | 30-day: 100 bonus",
      total: "125+ STAR per month",
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Passive Income",
      description: "Mint planets as NFTs and earn while you're away",
      reward: "0.5 STAR per hour per planet NFT",
      total: "120 STAR/month (4 NFTs)",
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Challenges",
      description: "Complete discovery milestones",
      reward: "10-100 STAR per challenge",
      total: "135 STAR (all challenges)",
      color: "from-red-600 to-rose-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Referrals",
      description: "Invite friends to join the game",
      reward: "25 STAR for inviter + invitee each",
      total: "Unlimited with friends",
      color: "from-indigo-600 to-violet-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-purple-500/30 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">How to Earn STAR Tokens</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-white/60 text-sm">First Month Potential</p>
            <p className="text-3xl font-bold text-yellow-400">~555+ STAR</p>
            <p className="text-xs text-white/40 mt-2">Without heavy gameplay</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-white/60 text-sm">Monthly Passive</p>
            <p className="text-3xl font-bold text-green-400">~360 STAR</p>
            <p className="text-xs text-white/40 mt-2">4 NFTs (auto-generated)</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-white/60 text-sm">Total Monthly</p>
            <p className="text-3xl font-bold text-blue-400">~1,315+ STAR</p>
            <p className="text-xs text-white/40 mt-2">Active + Passive combined</p>
          </div>
        </div>
      </Card>

      {/* Earning Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {earningMethods.map((method, idx) => (
          <Card key={idx} className="bg-slate-900/50 border-purple-500/20 p-6 hover:border-purple-400/40 transition">
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${method.color} text-white mb-4`}>
              {method.icon}
            </div>
            <h3 className="text-white font-bold mb-2">{method.title}</h3>
            <p className="text-white/60 text-sm mb-3">{method.description}</p>
            <div className="bg-black/30 rounded p-3">
              <p className="text-xs text-white/60 mb-1">Reward</p>
              <p className="text-white font-semibold text-sm">{method.reward}</p>
              <p className="text-xs text-purple-400 mt-2">{method.total}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Guide Tabs */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700 w-full">
          <TabsTrigger value="daily">Daily Routine</TabsTrigger>
          <TabsTrigger value="passive">Passive Income</TabsTrigger>
          <TabsTrigger value="burn">Burn Utilities</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4 mt-4">
          <Card className="bg-slate-900/50 border-purple-500/20 p-6">
            <h3 className="text-white font-bold mb-4">Your Daily Routine</h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-600 text-white font-bold">1</div>
                </div>
                <div>
                  <p className="text-white font-semibold">Daily Login (30 seconds)</p>
                  <p className="text-white/60 text-sm">Open the app and claim your 10 STAR daily reward</p>
                  <p className="text-yellow-400 text-sm font-semibold mt-1">+10 STAR</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">2</div>
                </div>
                <div>
                  <p className="text-white font-semibold">Discovery (5 minutes optional)</p>
                  <p className="text-white/60 text-sm">Click a planet to discover it once per game</p>
                  <p className="text-blue-400 text-sm font-semibold mt-1">+10-150 STAR (varies by planet)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 text-white font-bold">3</div>
                </div>
                <div>
                  <p className="text-white font-semibold">Passive Income (automatic)</p>
                  <p className="text-white/60 text-sm">Your NFTs generate tokens while you're away</p>
                  <p className="text-green-400 text-sm font-semibold mt-1">+0.5-0.75/hour per NFT</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 font-semibold text-sm">💡 Pro Tip: Even just logging in daily earns ~300 STAR/month!</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="passive" className="space-y-4 mt-4">
          <Card className="bg-slate-900/50 border-purple-500/20 p-6">
            <h3 className="text-white font-bold mb-4">Passive Income System</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">How It Works</h4>
                <p className="text-white/70 text-sm">When you mint a planet as an NFT, it starts generating tokens automatically:</p>
                <div className="mt-3 p-3 bg-black/30 rounded text-white/80 text-sm font-mono">
                  • Each planet NFT: 0.5 STAR/hour<br/>
                  • Each dwarf planet: 0.75 STAR/hour<br/>
                  • Each rare asteroid: 0.1-0.5 STAR/hour<br/>
                  • Generates 24/7, even when offline
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">Example: 4 Planet NFTs</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded p-3">
                    <p className="text-white/60 text-xs">Hourly</p>
                    <p className="text-xl font-bold text-yellow-400">2.0 STAR</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded p-3">
                    <p className="text-white/60 text-xs">Daily</p>
                    <p className="text-xl font-bold text-green-400">48 STAR</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded p-3">
                    <p className="text-white/60 text-xs">Monthly</p>
                    <p className="text-xl font-bold text-blue-400">1,440 STAR</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded p-3">
                    <p className="text-white/60 text-xs">Yearly</p>
                    <p className="text-xl font-bold text-purple-400">17,280 STAR</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 font-semibold text-sm">📈 Compound Growth: The more NFTs you own, the faster you earn!</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="burn" className="space-y-4 mt-4">
          <Card className="bg-slate-900/50 border-purple-500/20 p-6">
            <h3 className="text-white font-bold mb-4">Burn Utilities (Advanced)</h3>
            <p className="text-white/70 text-sm mb-4">Use your earned STAR for special abilities and cosmetics:</p>
            <div className="space-y-3">
              <div className="bg-black/30 rounded p-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded bg-orange-600/30 flex items-center justify-center text-lg">⭐</div>
                  <div>
                    <p className="text-white font-semibold">Dwarf Planet Unlock (200 STAR)</p>
                    <p className="text-white/60 text-sm">Unlock Pluto, Ceres, Eris, Haumea, or Makemake</p>
                    <p className="text-green-400 text-xs mt-1">Benefit: 0.75/hour passive (vs 0.5 for planets)</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/30 rounded p-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded bg-yellow-600/30 flex items-center justify-center text-lg">⚡</div>
                  <div>
                    <p className="text-white font-semibold">Cosmic Boost (50 STAR)</p>
                    <p className="text-white/60 text-sm">2x token rewards for next 5 discoveries</p>
                    <p className="text-blue-400 text-xs mt-1">Best for: Rapid collection building</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/30 rounded p-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded bg-purple-600/30 flex items-center justify-center text-lg">💎</div>
                  <div>
                    <p className="text-white font-semibold">Asteroid Mining (75 STAR)</p>
                    <p className="text-white/60 text-sm">Unlock mining session for rare asteroid NFTs</p>
                    <p className="text-yellow-400 text-xs mt-1">Benefit: Rare collectibles (0.3-0.5/hour)</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Player Path */}
      <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30 p-6">
        <h3 className="text-white font-bold mb-4">📋 Your First Month</h3>
        <div className="space-y-2 text-white/80 text-sm">
          <p><span className="font-semibold text-green-400">Week 1:</span> Daily logins + discover Mercury & Venus = ~85 STAR</p>
          <p><span className="font-semibold text-green-400">Week 2-3:</span> Continue discoveries + passive income starts = ~150 STAR</p>
          <p><span className="font-semibold text-green-400">Week 4:</span> Discover remaining planets + 7-day login bonus = ~170 STAR</p>
          <p className="mt-3 pt-3 border-t border-green-500/20"><span className="font-semibold text-green-400">Total Month 1:</span> ~555+ STAR earned</p>
          <p className="text-xs text-white/60 mt-2">This is WITHOUT spending much time! Passive income continues growing as you mint more NFTs.</p>
        </div>
      </Card>
    </div>
  );
}
