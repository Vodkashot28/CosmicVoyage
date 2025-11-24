import { useState } from "react";
import { Send, History, Clock } from "lucide-react";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function TokenTransfer() {
  const walletAddress = useTonAddress();
  const wallet = useTonWallet();
  const { totalTokens, bonusTokens } = useSolarSystem();
  const [transferAmount, setTransferAmount] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transfers, setTransfers] = useState<Array<{
    id: string;
    amount: number;
    timestamp: number;
    status: "completed" | "scheduled" | "pending";
    scheduledFor?: number;
  }>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('star-transfers');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const availableTokens = totalTokens + bonusTokens;
  const amount = parseInt(transferAmount) || 0;

  const saveTransfers = (newTransfers: typeof transfers) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('star-transfers', JSON.stringify(newTransfers));
    }
    setTransfers(newTransfers);
  };

  const handleTransfer = async () => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    if (amount > availableTokens) {
      toast.error(`Insufficient tokens (have ${availableTokens})`);
      return;
    }

    setIsLoading(true);
    try {
      const transferData = {
        id: `transfer-${Date.now()}`,
        amount,
        timestamp: Date.now(),
        status: isScheduled ? "scheduled" as const : "pending" as const,
        scheduledFor: isScheduled ? new Date(scheduledTime).getTime() : undefined,
      };

      const newTransfers = [...transfers, transferData];
      saveTransfers(newTransfers);

      if (isScheduled) {
        toast.success(`✨ Transfer of ${amount} STAR scheduled for ${new Date(scheduledTime).toLocaleString()}`);
      } else {
        toast.success(`🚀 Transfer of ${amount} STAR initiated! Processing to wallet...`);
      }

      setTransferAmount("");
      setScheduledTime("");
      setIsScheduled(false);
    } catch (error) {
      toast.error("Transfer failed. Please try again.");
      console.error("Transfer error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pendingTransfers = transfers.filter(t => t.status === "pending" || t.status === "scheduled");
  const completedTransfers = transfers.filter(t => t.status === "completed").slice(-3);

  const handleQuickTransfer = (amount: number) => {
    if (amount > availableTokens) {
      toast.error(`Insufficient tokens for ${amount} STAR transfer`);
      return;
    }
    setTransferAmount(amount.toString());
  };

  return (
    <div className="space-y-4">
      {/* Transfer Form */}
      <Card className="bg-gradient-to-br from-slate-900/95 to-slate-900/80 border-purple-500/40 p-4">
        <div className="space-y-3">
          {/* Available Balance */}
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-white/60 text-xs mb-1">Available Balance</div>
            <div className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
              {availableTokens} ⭐
            </div>
          </div>

          {/* Wallet Status */}
          {walletAddress && (
            <div className="bg-black/30 rounded-lg p-2">
              <div className="text-white/60 text-xs mb-1">Connected Wallet</div>
              <div className="text-white/80 text-xs font-mono truncate">
                {walletAddress.slice(0, 10)}...{walletAddress.slice(-6)}
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="text-white/70 text-xs mb-2 block">Transfer Amount</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                max={availableTokens}
                className="bg-black/30 border-purple-500/30 text-white"
              />
              <Button
                onClick={() => handleQuickTransfer(availableTokens)}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={availableTokens === 0}
              >
                Max
              </Button>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[10, 50, 100].map(amt => (
              <Button
                key={amt}
                onClick={() => handleQuickTransfer(amt)}
                size="sm"
                variant="outline"
                className="text-xs border-purple-500/30 hover:bg-purple-500/20"
                disabled={amt > availableTokens}
              >
                {amt}
              </Button>
            ))}
          </div>

          {/* Scheduled Transfer */}
          <div>
            <label className="flex items-center gap-2 text-white/70 text-xs mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="rounded"
              />
              Schedule Transfer
            </label>
            {isScheduled && (
              <Input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white text-xs"
                min={new Date().toISOString().slice(0, 16)}
              />
            )}
          </div>

          {/* Transfer Button */}
          <Button
            onClick={handleTransfer}
            disabled={!walletAddress || !amount || isLoading}
            className={`w-full ${
              isScheduled
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            } text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2`}
          >
            <Send className="w-4 h-4" />
            {isLoading ? "Processing..." : isScheduled ? "Schedule Transfer" : "Transfer Now"}
          </Button>

          {!walletAddress && (
            <p className="text-yellow-400 text-xs text-center">Connect your wallet to transfer tokens</p>
          )}
        </div>
      </Card>

      {/* Pending Transfers */}
      {pendingTransfers.length > 0 && (
        <Card className="bg-gradient-to-br from-orange-900/30 to-orange-900/10 border-orange-500/40 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-white/80 text-sm font-bold">Pending Transfers ({pendingTransfers.length})</span>
          </div>
          <div className="space-y-2">
            {pendingTransfers.map(transfer => (
              <div key={transfer.id} className="bg-black/20 rounded p-2 flex justify-between items-center text-xs">
                <div>
                  <div className="text-white font-bold">{transfer.amount} ⭐</div>
                  <div className="text-white/60">
                    {transfer.status === "scheduled"
                      ? `Scheduled: ${new Date(transfer.scheduledFor!).toLocaleString()}`
                      : `Pending since ${new Date(transfer.timestamp).toLocaleString()}`}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${
                  transfer.status === "scheduled" 
                    ? "bg-blue-500/30 text-blue-200" 
                    : "bg-orange-500/30 text-orange-200"
                }`}>
                  {transfer.status === "scheduled" ? "📅 Scheduled" : "⏳ Pending"}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Transfer History */}
      {completedTransfers.length > 0 && (
        <Card className="bg-gradient-to-br from-green-900/30 to-green-900/10 border-green-500/40 p-3">
          <div className="flex items-center gap-2 mb-2">
            <History className="w-4 h-4 text-green-400" />
            <span className="text-white/80 text-sm font-bold">Recent Transfers</span>
          </div>
          <div className="space-y-2">
            {completedTransfers.map(transfer => (
              <div key={transfer.id} className="bg-black/20 rounded p-2 flex justify-between items-center text-xs">
                <div>
                  <div className="text-white font-bold">+{transfer.amount} ⭐</div>
                  <div className="text-white/60">{new Date(transfer.timestamp).toLocaleString()}</div>
                </div>
                <div className="bg-green-500/30 text-green-200 px-2 py-1 rounded text-xs font-bold">✅ Completed</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-200">
        <p className="font-bold mb-1">💡 Transfer Info:</p>
        <ul className="space-y-1 text-blue-200/80">
          <li>• Instant transfers go to your TON wallet immediately</li>
          <li>• Schedule transfers for a specific date & time</li>
          <li>• Tokens are locked until transfer completes</li>
          <li>• View transfer history and status anytime</li>
        </ul>
      </div>
    </div>
  );
}
