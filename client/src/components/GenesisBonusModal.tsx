import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import * as THREE from "three";

interface GenesisBonusModalProps {
  open: boolean;
  walletAddress: string | null;
  onClaimed: (starBalance: number) => void;
}

export function GenesisBonusModal({ open, walletAddress, onClaimed }: GenesisBonusModalProps) {
  const [loading, setLoading] = useState(false);

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
        } else {
          toast.error(data.error || "Failed to claim bonus");
        }
        return;
      }

      toast.success("🎉 Genesis bonus claimed! You got 10 STAR!");
      onClaimed(data.starBalance);
    } catch (error) {
      console.error("Genesis claim error:", error);
      toast.error("Failed to claim genesis bonus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            ✨ Welcome to Solar System Explorer
          </DialogTitle>
          <DialogDescription className="text-center text-slate-300 mt-4">
            <div className="space-y-4">
              <div className="text-lg font-semibold text-cyan-300">
                Claim Your Genesis Bonus
              </div>
              
              <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 text-left space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <div className="font-semibold text-cyan-300">10 STAR Tokens</div>
                    <div className="text-sm text-slate-400">Bootstrap to mint Mercury</div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-3">
                  <div className="text-sm font-semibold text-slate-300 mb-2">How it works:</div>
                  <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                    <li>Claim 10 STAR genesis bonus</li>
                    <li>Mint Mercury for 10 STAR</li>
                    <li>Earn 0.5 STAR/hour passive income</li>
                    <li>Progress to Venus, Earth, Mars...</li>
                  </ol>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="text-sm text-blue-300">
                  💡 <strong>Tip:</strong> After claiming, you'll have exactly enough to mint Mercury and start your journey!
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={handleClaimGenesis}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold"
          >
            {loading ? "Claiming..." : "Claim 10 STAR Bonus"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
