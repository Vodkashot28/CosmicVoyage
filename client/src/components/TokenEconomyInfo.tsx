import { useState } from "react";
import { Coins, Flame, Zap, Shield, Info } from "lucide-react";
import { TOKEN_EARNING_MECHANICS, TOKEN_BURN_UTILITIES, canAffordAction } from "@/lib/ton/tokenEconomy";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export function TokenEconomyInfo() {
  const [open, setOpen] = useState(false);
  const { totalTokens, bonusTokens } = useSolarSystem();

  const burnUtilities = [
    {
      id: 'cosmic-boost',
      name: 'Cosmic Boost',
      icon: <Zap className="w-4 h-4" />,
      cost: TOKEN_BURN_UTILITIES.cosmicBoost.cost,
      effect: TOKEN_BURN_UTILITIES.cosmicBoost.effect
    },
    {
      id: 'void-jump',
      name: 'Void Jump',
      icon: <Shield className="w-4 h-4" />,
      cost: TOKEN_BURN_UTILITIES.voidJump.cost,
      effect: TOKEN_BURN_UTILITIES.voidJump.effect
    },
    {
      id: 'celestial-shield',
      name: 'Celestial Shield',
      icon: <Flame className="w-4 h-4" />,
      cost: TOKEN_BURN_UTILITIES.celestialShield.cost,
      effect: TOKEN_BURN_UTILITIES.celestialShield.effect
    }
  ];

  const handleBurnTokens = (utilityId: string, cost: number) => {
    if (totalTokens >= cost) {
      toast.success(`🔥 ${cost} tokens burned! Utility activated.`);
      setOpen(false);
    } else {
      toast.error(`Need ${cost} tokens, but only have ${totalTokens}`);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 gap-2"
      >
        <Coins className="w-4 h-4" />
        Economy
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border-yellow-500/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-yellow-400 flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Token Economy
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* How to Earn */}
            <Card className="bg-slate-800/50 border-green-500/20 p-4">
              <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                How to Earn Tokens
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Planet Discovery:</span>
                  <span className="text-green-400 font-semibold">+{TOKEN_EARNING_MECHANICS.baseTokenPerDiscovery}-{150} tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Challenge Completion:</span>
                  <span className="text-green-400 font-semibold">+{TOKEN_EARNING_MECHANICS.bonusPerChallenge} bonus tokens each</span>
                </div>
                <div className="text-white/60 text-xs mt-2">
                  Discover planets in order to earn StarTokens. Complete challenges for bonus tokens. Claim bonus tokens to transfer to your wallet.
                </div>
              </div>
            </Card>

            {/* Current Balance */}
            <Card className="bg-slate-800/50 border-yellow-500/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Your Balance:</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-400">{totalTokens}</div>
                  {bonusTokens > 0 && (
                    <div className="text-sm text-green-400">+{bonusTokens} pending claim</div>
                  )}
                </div>
              </div>
            </Card>

            {/* Token Burning Utilities */}
            <Card className="bg-slate-800/50 border-red-500/20 p-4">
              <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Burn Tokens for Utilities
              </h3>
              <div className="space-y-2">
                {burnUtilities.map(utility => (
                  <div key={utility.id} className="bg-slate-900/50 p-3 rounded border border-red-500/20">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-white font-semibold mb-1">
                          {utility.icon}
                          {utility.name}
                        </div>
                        <p className="text-white/70 text-sm">{utility.effect}</p>
                      </div>
                      <div className="text-right">
                        <Button
                          onClick={() => handleBurnTokens(utility.id, utility.cost)}
                          disabled={!canAffordAction(totalTokens, utility.id as any)}
                          size="sm"
                          className={`gap-1 ${
                            canAffordAction(totalTokens, utility.id as any)
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-red-900/50'
                          }`}
                        >
                          <Flame className="w-3 h-3" />
                          {utility.cost}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* NFT Minting */}
            <Card className="bg-slate-800/50 border-purple-500/20 p-4">
              <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                NFT Minting
              </h3>
              <p className="text-white/70 text-sm mb-2">
                When you discover a planet, you can mint it as a 3D NFT on TON. Each NFT includes a unique 3D model and metadata.
              </p>
              <div className="bg-slate-900/50 p-2 rounded text-yellow-400 text-sm">
                💡 Cost: Free • Gas: 0.05 TON • Format: .glTF
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
