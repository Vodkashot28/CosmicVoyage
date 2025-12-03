import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share2, Twitter } from "lucide-react";
import { toast } from "sonner";
import { useReferral } from "@/lib/stores/useReferral";
import { useGameBalance } from "@/lib/stores/useGameBalance";

export function ReferralInvite() {
  const { walletAddress } = useGameBalance();
  const { referralStats } = useReferral();

  const referralCode = walletAddress ? walletAddress.slice(0, 8) : "CONNECT_WALLET";
  const referralLink = `https://solar-system.xyz?ref=${referralCode}`;

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
            <div className="text-2xl font-bold text-cyan-400">+{referralStats.bonus}</div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Your Referral Link</label>
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="bg-slate-800 border-purple-500/30 text-white"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-purple-600 hover:bg-purple-700"
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
            className="flex-1 border-purple-500/30"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Link
          </Button>
        </div>

        {/* Rewards Info */}
        <div className="bg-slate-800/50 border border-purple-500/20 rounded p-3">
          <h4 className="font-semibold text-purple-300 mb-2">How it works:</h4>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Share your referral link with friends</li>
            <li>• They get 10 STAR when they sign up</li>
            <li>• You get 5 STAR for each referral</li>
            <li>• Both earn bonus rewards from their activity</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}