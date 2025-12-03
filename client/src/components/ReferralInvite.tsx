
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share2, Twitter } from "lucide-react";
import { toast } from "sonner";
import { useReferral } from "@/lib/stores/useReferral";
import { useGameBalance } from "@/lib/stores/useGameBalance";
import { useEffect } from "react";

export function ReferralInvite() {
  const { walletAddress } = useGameBalance();
  const { referralStats, loadReferralStats } = useReferral();

  useEffect(() => {
    if (walletAddress) {
      loadReferralStats(walletAddress);
    }
  }, [walletAddress, loadReferralStats]);

  const referralCode = walletAddress ? walletAddress.slice(0, 8).toUpperCase() : "CONNECT_WALLET";
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
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
            <div className="text-2xl font-bold text-cyan-400">+{referralStats.bonus} STAR</div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300 font-medium">Your Referral Link</label>
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="bg-slate-800 border-purple-500/30 text-white font-mono text-xs"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-purple-600 hover:bg-purple-700"
              size="icon"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={shareOnTwitter}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Twitter className="w-4 h-4 mr-2" />
            Share on Twitter
          </Button>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="flex-1 border-purple-500/30 hover:bg-purple-500/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Copy Link
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
