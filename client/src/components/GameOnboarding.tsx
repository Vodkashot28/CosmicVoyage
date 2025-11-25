import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useGameBalance } from "@/lib/stores/useGameBalance";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { EmailVerification } from "./EmailVerification";

export function GameOnboarding() {
  const wallet = useTonWallet();
  const { walletAddress, starBalance, genesisClaimedAt, setWalletAddress, setStarBalance, setGenesisClaimedAt } = useGameBalance();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When wallet connects, update the game balance store
    if (wallet?.account.address && wallet.account.address !== walletAddress) {
      setWalletAddress(wallet.account.address);
      // Check if this wallet already has genesis claimed
      checkGenesisStatus(wallet.account.address);
    }
  }, [wallet?.account.address, walletAddress, setWalletAddress]);

  useEffect(() => {
    // Show email verification if wallet connected but no email verified yet
    if (walletAddress && !verifiedEmail && showEmailVerification === false) {
      setShowEmailVerification(true);
    }
  }, [walletAddress, verifiedEmail]);

  useEffect(() => {
    // Show onboarding if email verified but no genesis bonus claimed
    if (verifiedEmail && !genesisClaimedAt && showOnboarding === false) {
      setShowOnboarding(true);
    }
  }, [verifiedEmail, genesisClaimedAt]);

  const checkGenesisStatus = async (address: string) => {
    try {
      const response = await fetch(`/api/player/genesis-status/${address}`);
      const data = await response.json();
      
      if (data.claimed) {
        setStarBalance(data.starBalance);
        setGenesisClaimedAt(data.claimedAt ? new Date(data.claimedAt) : new Date());
      }
    } catch (error) {
      console.error("Failed to check genesis status:", error);
    }
  };

  const handleClaimGenesis = async () => {
    if (!walletAddress) {
      toast.error("Connect wallet first");
      return;
    }

    if (!verifiedEmail) {
      toast.error("Verify email first");
      setShowOnboarding(false);
      setShowEmailVerification(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/player/claim-genesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, email: verifiedEmail }),
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
        setShowOnboarding(false);
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
    <>
      <EmailVerification
        open={showEmailVerification}
        onVerified={(email) => {
          setVerifiedEmail(email);
          setShowEmailVerification(false);
        }}
      />
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            ✨ Welcome to Solar System Explorer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <DialogDescription className="text-center text-slate-300 mt-4">
            <div className="text-lg font-semibold text-cyan-300 mb-3">
              Claim Your Genesis Bootstrap
            </div>
            
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 text-left space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">⭐</span>
                <div className="flex-1">
                  <div className="font-bold text-2xl text-cyan-300">10 STAR</div>
                  <div className="text-sm text-slate-400">One-time genesis bonus</div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-3 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-cyan-400">→</span>
                  <span className="text-slate-300">Claim 10 STAR (exactly enough for Mercury)</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-cyan-400">→</span>
                  <span className="text-slate-300">Mint Mercury NFT (costs 10 STAR)</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-cyan-400">→</span>
                  <span className="text-slate-300">Start earning 0.5 STAR/hour passively</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-cyan-400">→</span>
                  <span className="text-slate-300">Progress to 27 more celestial objects</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-lg p-3 mt-4">
              <div className="text-sm text-blue-300">
                <strong>💡 Pro Tip:</strong> This is the bootstrapping mechanism that solves the chicken-and-egg problem. You get free STAR to start, then planets generate STAR passively!
              </div>
            </div>
          </DialogDescription>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={handleClaimGenesis}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 text-lg"
          >
            {loading ? "Claiming..." : "✨ Claim 10 STAR"}
          </Button>
        </div>

        <div className="text-xs text-slate-400 text-center mt-3">
          Connected wallet: {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-4)}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
