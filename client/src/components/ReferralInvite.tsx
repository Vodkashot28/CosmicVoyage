import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useGameBalance } from "@/lib/stores/useGameBalance";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export function ReferralInvite() {
  const { walletAddress } = useGameBalance();
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralLink, setReferralLink] = useState<string>("");
  const [referralStats, setReferralStats] = useState({
    count: 0,
    bonus: 0,
  });

  useEffect(() => {
    if (walletAddress) {
      generateReferralCode(walletAddress);
      fetchReferralStats(walletAddress);
    }
  }, [walletAddress]);

  const generateReferralCode = (wallet: string) => {
    // Create a shorter, readable referral code
    const code = wallet.slice(0, 4).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralCode(code);
    const link = `${window.location.origin}?ref=${code}`;
    setReferralLink(link);
  };

  const fetchReferralStats = async (wallet: string) => {
    try {
      const response = await fetch(`/api/player/referral-stats/${wallet}`);
      if (response.ok) {
        const data = await response.json();
        setReferralStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch referral stats:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("✓ Referral link copied!");
  };

  const shareOnTwitter = () => {
    const text = `Join me in Solar System Explorer! Claim 10 STAR and start your cosmic journey. Use my referral code for a bonus!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + referralLink)}`;
    window.open(url, "_blank");
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/30 p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">🎯</span>
          <div>
            <h3 className="text-lg font-bold text-purple-300">Referral Program</h3>
            <p className="text-sm text-slate-400">Earn STAR rewards for inviting friends</p>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/50 border border-purple-500/20 rounded p-3">
            <div className="text-xs text-slate-400">Friends Referred</div>
            <div className="text-2xl font-bold text-purple-400">{referralStats.count}</div>
          </div>
          <div className="bg-slate-800/50 border border-purple-500/20 rounded p-3">
            <div className="text-xs text-slate-400">Bonus Earned</div>
            <div className="text-2xl font-bold text-cyan-400">+{referralStats.bonus}</div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="bg-slate-800/50 border border-purple-500/20 rounded p-3">
          <div className="text-xs text-slate-400 mb-2">Your Referral Code</div>
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-900 rounded px-3 py-2 border border-slate-700">
              <code className="text-purple-300 font-mono font-bold text-sm">{referralCode}</code>
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(referralCode);
                toast.success("✓ Code copied!");
              }}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-2">
          <Button
            onClick={copyToClipboard}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold"
          >
            📋 Copy Referral Link
          </Button>
          <Button
            onClick={shareOnTwitter}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          >
            𝕏 Share on Twitter
          </Button>
        </div>

        {/* Reward Tiers */}
        <div className="bg-slate-800/50 border border-purple-500/20 rounded p-3">
          <div className="text-xs font-semibold text-purple-300 mb-2">💎 Reward Tiers</div>
          <div className="space-y-1 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>1-3 friends:</span>
              <span className="text-purple-400 font-semibold">5 STAR each</span>
            </div>
            <div className="flex justify-between">
              <span>4-7 friends:</span>
              <span className="text-purple-400 font-semibold">7 STAR each</span>
            </div>
            <div className="flex justify-between">
              <span>8+ friends:</span>
              <span className="text-purple-400 font-semibold">10 STAR each</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-700">
            <div className="flex justify-between text-xs">
              <span>Cap:</span>
              <span className="text-cyan-400 font-semibold">50 STAR max</span>
            </div>
          </div>
        </div>

        {/* Bonus Info */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30 rounded p-3">
          <div className="text-xs text-purple-300">
            <strong>🌟 Plus:</strong> Get 10% of each friend's passive income for 30 days!
          </div>
        </div>
      </div>
    </Card>
  );
}
