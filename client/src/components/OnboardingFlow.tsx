import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useGameBalance } from "@/lib/stores/useGameBalance";
import { useTonConnectUI } from "@tonconnect/ui-react";

export function OnboardingFlow() {
  const { walletAddress, starBalance, genesisClaimedAt, setStarBalance, setGenesisClaimedAt } = useGameBalance();
  const [tonConnectUI] = useTonConnectUI();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show onboarding if wallet connected but no genesis bonus claimed
    if (walletAddress && !genesisClaimedAt) {
      setShowOnboarding(true);
    }
  }, [walletAddress, genesisClaimedAt]);

  const handleClaimGenesis = async () => {
    if (!walletAddress) {
      toast.error("Connect wallet first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/player/claim-genesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.error("Genesis bonus already claimed!");
          setGenesisClaimedAt(new Date());
          setStarBalance(data.starBalance);
        } else {
          toast.error(data.error || "Failed to claim bonus");
        }
        return;
      }

      toast.success("🎉 Genesis bonus claimed! You got 10 STAR!");
      setStarBalance(data.starBalance);
      setGenesisClaimedAt(new Date());
      setShowOnboarding(false);
    } catch (error) {
      console.error("Genesis claim error:", error);
      toast.error("Failed to claim genesis bonus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            ✨ Welcome Cosmic Explorer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <DialogDescription className="text-center text-slate-300 mt-4">
            <div className="text-lg font-semibold text-cyan-300 mb-3">
              Your Genesis Adventure Begins
            </div>
            
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 text-left space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">⭐</span>
                <div className="flex-1">
                  <div className="font-bold text-2xl text-cyan-300">10 STAR</div>
                  <div className="text-sm text-slate-400">Genesis Bootstrap</div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-3 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span className="text-slate-300"><strong>Claim 10 STAR</strong> - Your bootstrap reward</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span className="text-slate-300"><strong>Mint Mercury</strong> - Costs exactly 10 STAR</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span className="text-slate-300"><strong>Earn Passive</strong> - 0.5 STAR/hour from Mercury</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span className="text-slate-300"><strong>Explore All</strong> - Discover 28 celestial objects</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-lg p-3 mt-4">
              <div className="text-sm text-cyan-300">
                <strong>🎯 The Bootstrap Loop:</strong> Genesis gift → Mercury mint → Passive income → Progression
              </div>
            </div>
          </DialogDescription>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={handleClaimGenesis}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2"
          >
            {loading ? "Claiming..." : "Claim 10 STAR Bonus"}
          </Button>
        </div>

        <div className="text-xs text-slate-400 text-center mt-3">
          ✓ One-time genesis bonus per wallet • Can only be claimed once
        </div>
      </DialogContent>
    </Dialog>
  );
}
