import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTonWallet } from "@tonconnect/ui-react";
import { useGameBalance } from "@/lib/stores/useGameBalance";

export function DailyLoginReward() {
  const wallet = useTonWallet();
  const { addStarBalance } = useGameBalance();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (!wallet?.account.address) return;

    const checkDailyLogin = async () => {
      try {
        const response = await fetch(`/api/daily-login/status/${wallet.account.address}`);
        const data = await response.json();
        setStatus(data);

        // Show modal if hasn't claimed today
        if (!data.hasClaimed && data.streak !== undefined) {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Failed to check daily login:", error);
      }
    };

    checkDailyLogin();
  }, [wallet?.account.address]);

  const handleClaimReward = async () => {
    if (!wallet?.account.address) {
      toast.error("Connect wallet first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/daily-login/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: wallet.account.address }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.error("Already claimed today! Come back tomorrow.");
        } else {
          toast.error(data.error || "Failed to claim reward");
        }
        setShowModal(false);
        return;
      }

      toast.success(data.message);
      setStatus(data);
      setShowModal(false);

      // Update balance store immediately
      if (data.reward) {
        addStarBalance(data.reward);
      }
    } catch (error) {
      console.error("Claim error:", error);
      toast.error("Failed to claim reward");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            <span className="text-3xl">📅</span> Daily Login Bonus
          </DialogTitle>
          <DialogDescription className="text-center text-slate-300">
            Claim your daily reward and build your login streak!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-center">
          {status && (
            <>
              <div className="text-4xl font-bold text-purple-400">
                Day {status.streak || 1}
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">Reward:</div>
                <div className="text-3xl font-bold text-yellow-400">
                  {status.streak === 7 ? "✨ 5 STAR ✨" : `+1 STAR`}
                </div>
                {status.streak === 7 && (
                  <div className="text-sm text-yellow-300 mt-2">
                    🌟 7-DAY STREAK BONUS! 🌟
                  </div>
                )}
              </div>

              <div className="text-slate-300 text-sm space-y-1">
                <div>Total Rewards: {status.totalClaimed} STAR</div>
                <div>Login Days: {status.totalLoginDays}</div>
              </div>

              {status.streak && status.streak < 7 && (
                <div className="text-xs text-slate-400">
                  Keep the streak alive! {7 - status.streak} more days for bonus 🔥
                </div>
              )}
            </>
          )}

          <Button
            onClick={handleClaimReward}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 text-lg"
          >
            {loading ? "Claiming..." : "Claim Daily Reward"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
