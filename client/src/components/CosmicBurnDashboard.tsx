import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { Zap, Flame, Sparkles, TrendingUp, AlertCircle, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BurnMode {
  id: string;
  name: string;
  cost: number;
  description: string;
  effect: string;
  icon: React.ReactNode;
  color: string;
  estimatedReturn?: number;
  requiresFragment?: boolean;
}

export function CosmicBurnDashboard() {
  const { totalTokens, getPassiveIncomeFromNFTs } = useSolarSystem();
  const [selectedMode, setSelectedMode] = useState<BurnMode | null>(null);
  const [showROI, setShowROI] = useState(false);
  const passiveIncome = getPassiveIncomeFromNFTs();

  const burnModes: BurnMode[] = [
    {
      id: "cosmic-boost",
      name: "Cosmic Boost",
      cost: 50,
      description: "2× token rewards for next 5 discoveries",
      effect: "Double your earnings temporarily",
      icon: <Zap className="w-5 h-5" />,
      color: "from-yellow-600 to-orange-600",
      estimatedReturn: 250
    },
    {
      id: "void-jump",
      name: "Void Jump",
      cost: 100,
      description: "Skip next planet requirement (mint out of order)",
      effect: "Unlock sequence flexibility",
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-purple-600 to-indigo-600",
      estimatedReturn: 150
    },
    {
      id: "celestial-shield",
      name: "Celestial Shield",
      cost: 75,
      description: "Free NFT minting (no gas fee)",
      effect: "Mint planets without blockchain fees",
      icon: <Flame className="w-5 h-5" />,
      color: "from-cyan-600 to-blue-600",
      estimatedReturn: 120
    },
    {
      id: "asteroid-mining",
      name: "Asteroid Mining",
      cost: 75,
      description: "Unlock asteroid loot session (cosmetics/fragments)",
      effect: "Access rare collectibles",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-amber-600 to-orange-600",
      estimatedReturn: 180
    },
    {
      id: "dwarf-unlock",
      name: "Dwarf Planet Unlock",
      cost: 200,
      description: "Mint rare dwarf planet NFT (Pluto, Ceres, etc.)",
      effect: "0.75 STAR/hour passive income",
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-emerald-600 to-teal-600",
      estimatedReturn: 540
    },
    {
      id: "supernova",
      name: "Supernova Mode",
      cost: 150,
      description: "3× token rewards for next 3 discoveries",
      effect: "Extreme earning boost",
      icon: <Flame className="w-5 h-5" />,
      color: "from-red-600 to-pink-600",
      estimatedReturn: 450
    },
    {
      id: "wormhole",
      name: "Wormhole Mode",
      cost: 250,
      description: "Skip up to 3 planets in sequence",
      effect: "Major sequence flexibility",
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-violet-600 to-purple-600",
      estimatedReturn: 300
    },
    {
      id: "cosmic-forge",
      name: "Cosmic Forge",
      cost: 100,
      description: "Craft prestige cosmetics from fragments",
      effect: "Create unique cosmetic NFTs",
      icon: <Zap className="w-5 h-5" />,
      color: "from-fuchsia-600 to-rose-600",
      estimatedReturn: 0,
      requiresFragment: true
    }
  ];

  const availableModes = burnModes.filter(mode => totalTokens >= mode.cost);
  const lockedModes = burnModes.filter(mode => totalTokens < mode.cost);

  const handleActivate = (mode: BurnMode) => {
    if (totalTokens >= mode.cost) {
      console.log(`Activated ${mode.name}! Burned ${mode.cost} STAR`);
      // State update would happen here in full implementation
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with Lore */}
      <Card className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-purple-500/40 p-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Flame className="w-8 h-8 text-orange-400" />
            Cosmic Utilities
          </h1>
          <p className="text-purple-200 italic text-sm">
            "The stars whisper to those who burn. Every token sacrificed bends the fabric of space, unlocking paths unseen and treasures unclaimed."
          </p>
        </div>
      </Card>

      {/* Your Stats Section */}
      <Card className="bg-slate-900/50 border-purple-500/30 p-6">
        <h2 className="text-white font-bold mb-4">Your STAR Balance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-black/40 rounded p-4">
            <p className="text-white/60 text-xs mb-1">STAR Available</p>
            <p className="text-3xl font-bold text-yellow-400">{totalTokens}</p>
          </div>
          <div className="bg-black/40 rounded p-4">
            <p className="text-white/60 text-xs mb-1">Passive Rate</p>
            <p className="text-3xl font-bold text-green-400">{passiveIncome.tokensPerHour.toFixed(2)}</p>
            <p className="text-xs text-white/40">/hour</p>
          </div>
          <div className="bg-black/40 rounded p-4">
            <p className="text-white/60 text-xs mb-1">Can Afford</p>
            <p className="text-2xl font-bold text-blue-400">{availableModes.length}</p>
            <p className="text-xs text-white/40">utilities</p>
          </div>
          <div className="bg-black/40 rounded p-4">
            <p className="text-white/60 text-xs mb-1">Locked</p>
            <p className="text-2xl font-bold text-red-400">{lockedModes.length}</p>
            <p className="text-xs text-white/40">utilities</p>
          </div>
        </div>
      </Card>

      {/* Burn Modes Tabs */}
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700 w-full grid grid-cols-2">
          <TabsTrigger value="available">Available ({availableModes.length})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({lockedModes.length})</TabsTrigger>
        </TabsList>

        {/* Available Modes */}
        <TabsContent value="available" className="mt-6">
          {availableModes.length === 0 ? (
            <Card className="bg-slate-900/50 border-purple-500/30 p-12 text-center">
              <Zap className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No burn modes available yet</p>
              <p className="text-white/40 text-sm mt-2">Discover more planets and earn tokens to unlock cosmic utilities</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableModes.map((mode) => (
                <BurnModeCard
                  key={mode.id}
                  mode={mode}
                  isAvailable={true}
                  isSelected={selectedMode?.id === mode.id}
                  onSelect={() => {
                    setSelectedMode(mode);
                    setShowROI(true);
                  }}
                  onActivate={() => handleActivate(mode)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Locked Modes */}
        <TabsContent value="locked" className="mt-6">
          {lockedModes.length === 0 ? (
            <Card className="bg-slate-900/50 border-purple-500/30 p-12 text-center">
              <Sparkles className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">You've unlocked all burn modes!</p>
              <p className="text-white/40 text-sm mt-2">Keep exploring to discover more powerful utilities</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lockedModes.map((mode) => (
                <BurnModeCard
                  key={mode.id}
                  mode={mode}
                  isAvailable={false}
                  onSelect={() => setSelectedMode(mode)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ROI Estimator */}
      <AnimatePresence>
        {showROI && selectedMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            <Card className={`bg-gradient-to-r ${selectedMode.color} bg-opacity-10 border-opacity-40 border p-6`}>
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                ROI Estimator: {selectedMode.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 rounded p-4">
                  <p className="text-white/60 text-xs mb-1">Initial Cost</p>
                  <p className="text-2xl font-bold text-red-400">-{selectedMode.cost} STAR</p>
                </div>
                <div className="bg-black/30 rounded p-4">
                  <p className="text-white/60 text-xs mb-1">Est. Return</p>
                  <p className="text-2xl font-bold text-green-400">
                    +{selectedMode.estimatedReturn || 0} STAR
                  </p>
                </div>
                <div className="bg-black/30 rounded p-4">
                  <p className="text-white/60 text-xs mb-1">Net Gain</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {(selectedMode.estimatedReturn || 0) - selectedMode.cost} STAR
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500/30 rounded">
                <p className="text-white/80 text-sm">
                  <span className="font-semibold text-blue-400">💡 Recommendation:</span> Ideal for earning STAR before discovering Mars–Jupiter region
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Burn History (Placeholder) */}
      <Card className="bg-slate-900/50 border-purple-500/30 p-6">
        <h3 className="text-white font-bold mb-3">Recent Burns</h3>
        <div className="text-white/60 text-sm p-4 bg-black/30 rounded text-center">
          No burns yet. Unlock utilities and start bending reality!
        </div>
      </Card>
    </div>
  );
}

interface BurnModeCardProps {
  mode: BurnMode;
  isAvailable: boolean;
  isSelected?: boolean;
  onSelect: () => void;
  onActivate?: () => void;
}

function BurnModeCard({
  mode,
  isAvailable,
  isSelected,
  onSelect,
  onActivate
}: BurnModeCardProps) {
  return (
    <motion.div
      whileHover={isAvailable ? { scale: 1.02 } : {}}
      onClick={onSelect}
      className="cursor-pointer"
    >
      <Card
        className={`relative p-6 transition-all ${
          isAvailable
            ? `bg-gradient-to-br ${mode.color} bg-opacity-10 border-opacity-40 ${
                isSelected ? "border-2 border-opacity-100" : ""
              }`
            : "bg-slate-900/30 border-slate-700/50 opacity-60"
        }`}
      >
        {!isAvailable && (
          <div className="absolute top-3 right-3">
            <Lock className="w-5 h-5 text-red-400" />
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${mode.color} text-white`}>
            {mode.icon}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-400">{mode.cost}</p>
            <p className="text-xs text-white/60">STAR</p>
          </div>
        </div>

        <h3 className="text-white font-bold mb-1">{mode.name}</h3>
        <p className="text-white/70 text-sm mb-3">{mode.description}</p>

        <div className="bg-black/30 rounded p-3 mb-4">
          <p className="text-xs text-white/60 mb-1">Effect</p>
          <p className="text-sm text-white font-semibold">{mode.effect}</p>
        </div>

        {isAvailable ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onActivate?.();
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
          >
            Activate {mode.name}
          </Button>
        ) : (
          <Button disabled className="w-full bg-slate-700 text-white/50 cursor-not-allowed">
            <Lock className="w-4 h-4 mr-2" />
            Locked
          </Button>
        )}

        {isSelected && (
          <motion.div
            layoutId="selection"
            className="absolute inset-0 border-2 border-purple-400 rounded-lg pointer-events-none"
          />
        )}
      </Card>
    </motion.div>
  );
}
