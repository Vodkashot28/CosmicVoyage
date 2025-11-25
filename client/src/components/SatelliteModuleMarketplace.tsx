import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ShoppingCart, Zap, Clock, Gift } from "lucide-react";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";

interface SatelliteModuleMarketplaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const SMB_MODULES = [
  {
    id: "boost",
    name: "Cosmic Boost+",
    description: "+50% passive income for 24 hours",
    directCost: 250,
    stakedCost: 0,
    duration: "24h",
    cooldown: 0,
  },
  {
    id: "jump",
    name: "Void Jump+",
    description: "+2 jump range for 48 hours",
    directCost: 250,
    stakedCost: 0,
    duration: "48h",
    cooldown: 0,
  },
  {
    id: "discovery",
    name: "Discovery Accelerant",
    description: "50% faster planet discovery",
    directCost: 200,
    stakedCost: 0,
    duration: "1 use",
    cooldown: 0,
  },
  {
    id: "refinement",
    name: "Refinement Catalyst",
    description: "30% cheaper next refinement",
    directCost: 300,
    stakedCost: 0,
    duration: "1 use",
    cooldown: 0,
  },
  {
    id: "lucky",
    name: "Lucky Draw",
    description: "Chance for 2x passive reward",
    directCost: 150,
    stakedCost: 0,
    duration: "1 draw",
    cooldown: 0,
  },
];

export function SatelliteModuleMarketplace({ isOpen, onClose }: SatelliteModuleMarketplaceProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseMethod, setPurchaseMethod] = useState<"direct" | "stake">("direct");
  const { totalTokens, ownedNFTs } = useSolarSystem();

  const module = SMB_MODULES.find((m) => m.id === selectedModule);

  const handlePurchase = async () => {
    if (!module) return;

    const cost = purchaseMethod === "direct" ? module.directCost : 50;

    if (totalTokens < cost) {
      toast.error("Insufficient STAR", {
        description: `You need ${cost} STAR (have ${totalTokens})`,
      });
      return;
    }

    if (purchaseMethod === "stake" && ownedNFTs.length === 0) {
      toast.error("No NFTs to stake", {
        description: "You need at least one NFT to use staking method",
      });
      return;
    }

    setIsPurchasing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(`${module.name} Acquired! 🎁`, {
        description: purchaseMethod === "direct" ? `Purchased for ${cost} STAR` : `Staking initiated (7 days)`,
      });

      setSelectedModule(null);
    } catch (error) {
      toast.error("Purchase failed", {
        description: "Please try again",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-slate-900/95 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-purple-400" />
            Satellite Module Marketplace
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Acquire premium modules to enhance your gameplay
          </DialogDescription>
        </DialogHeader>

        {!selectedModule ? (
          <div className="space-y-3 py-4">
            {/* Marketplace Info */}
            <Card className="bg-purple-900/30 border-purple-500/30 p-4">
              <p className="text-sm text-purple-300">
                💫 Modules can be acquired via: <span className="font-bold">Direct Purchase (250 STAR)</span> or{" "}
                <span className="font-bold">NFT Staking (50 STAR + 7 days)</span>
              </p>
            </Card>

            {/* Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SMB_MODULES.map((mod) => (
                <Card
                  key={mod.id}
                  className="bg-slate-800/50 border-slate-700 p-4 cursor-pointer hover:border-purple-500 transition-colors"
                  onClick={() => setSelectedModule(mod.id)}
                >
                  <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    {mod.name}
                  </h3>
                  <p className="text-sm text-slate-300 mb-3">{mod.description}</p>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-purple-300">
                      <ShoppingCart className="w-3 h-3" />
                      {mod.directCost} STAR
                    </div>
                    <div className="flex items-center gap-1 text-blue-300">
                      <Clock className="w-3 h-3" />
                      {mod.duration}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white text-xs"
                    onClick={() => setSelectedModule(mod.id)}
                  >
                    View Details
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        ) : module ? (
          <div className="space-y-4 py-4">
            {/* Module Details */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                {module.name}
              </h2>
              <p className="text-sm text-slate-300 mb-4">{module.description}</p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="text-xs text-slate-400">Duration</div>
                  <div className="font-bold text-white">{module.duration}</div>
                </div>
                <div className="bg-slate-700/50 p-2 rounded">
                  <div className="text-xs text-slate-400">Type</div>
                  <div className="font-bold text-white">Premium Module</div>
                </div>
              </div>
            </Card>

            {/* Purchase Method Selection */}
            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm">Acquisition Method</h3>

              <div className="grid grid-cols-2 gap-3">
                {/* Direct Purchase */}
                <Card
                  className={`p-3 cursor-pointer border-2 transition-colors ${
                    purchaseMethod === "direct"
                      ? "bg-blue-900/30 border-blue-500"
                      : "bg-slate-800/30 border-slate-700"
                  }`}
                  onClick={() => setPurchaseMethod("direct")}
                >
                  <div className="font-bold text-white mb-1">Direct Purchase</div>
                  <p className="text-xs text-slate-300 mb-2">Instant delivery</p>
                  <div className="text-lg font-bold text-blue-300">{module.directCost} STAR</div>
                  <div className={`text-xs mt-1 ${totalTokens >= module.directCost ? "text-green-400" : "text-red-400"}`}>
                    {totalTokens >= module.directCost ? "✓ Affordable" : `✗ Need ${module.directCost - totalTokens} more`}
                  </div>
                </Card>

                {/* NFT Staking */}
                <Card
                  className={`p-3 cursor-pointer border-2 transition-colors ${
                    purchaseMethod === "stake"
                      ? "bg-green-900/30 border-green-500"
                      : "bg-slate-800/30 border-slate-700"
                  }`}
                  onClick={() => setPurchaseMethod("stake")}
                >
                  <div className="font-bold text-white mb-1">NFT Staking</div>
                  <p className="text-xs text-slate-300 mb-2">Delivered in 7 days</p>
                  <div className="text-lg font-bold text-green-300">50 STAR</div>
                  <div className={`text-xs mt-1 ${ownedNFTs.length > 0 ? "text-green-400" : "text-red-400"}`}>
                    {ownedNFTs.length > 0 ? `✓ ${ownedNFTs.length} NFT(s) available` : "✗ No NFTs to stake"}
                  </div>
                </Card>
              </div>
            </div>

            {/* Benefits */}
            <Card className="bg-amber-900/20 border-amber-600/30 p-3">
              <p className="text-xs text-amber-200">
                🎁 <span className="font-semibold">Pro Tip:</span> Using NFT staking costs less STAR and helps with
                long-term planning. Direct purchase gives instant access.
              </p>
            </Card>
          </div>
        ) : null}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => (selectedModule ? setSelectedModule(null) : onClose())}
            disabled={isPurchasing}
            className="bg-slate-800 border-slate-600 hover:bg-slate-700"
          >
            {selectedModule ? "Back" : "Close"}
          </Button>
          {selectedModule && (
            <Button
              onClick={handlePurchase}
              disabled={isPurchasing || totalTokens < (purchaseMethod === "direct" ? module!.directCost : 50)}
              className={`flex-1 ${
                totalTokens >= (purchaseMethod === "direct" ? module!.directCost : 50)
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-600 opacity-50"
              }`}
            >
              {isPurchasing ? "Processing..." : `Acquire (${purchaseMethod === "direct" ? module!.directCost : 50} STAR)`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
