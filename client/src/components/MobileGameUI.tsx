import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { Coins, Sparkles, Volume2, VolumeX, Gift, Gem, Menu, X, Zap, Flame, Send } from "lucide-react";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { useAudio } from "@/lib/stores/useAudio";
import { planetsData } from "@/data/planets";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Challenges } from "@/components/Challenges";
import { TokenEconomyInfo } from "@/components/TokenEconomyInfo";
import { NFTBenefits } from "@/components/NFTBenefits";
import { NFTCollectionModal } from "@/components/NFTCollectionModal";
import { EarningGuide } from "@/components/EarningGuide";
import { NFTGallery } from "@/components/NFTGallery";
import { CosmicBurnDashboard } from "@/components/CosmicBurnDashboard";
import { TokenTransfer } from "@/components/TokenTransfer";
import { toast } from "sonner";

export function GameUI() {
  const [showNFTCollection, setShowNFTCollection] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<"game" | "collection" | "challenges" | "economy" | "earn" | "burn" | "transfer">("game");
  const walletAddress = useTonAddress();
  const { 
    discoveredPlanets, 
    totalTokens,
    bonusTokens,
    mintedNFTCount,
    ownedNFTs,
    claimedRewards,
    setWalletAddress,
    getNextPlanetToDiscover,
    claimRewards
  } = useSolarSystem();
  const { isMuted, toggleMute } = useAudio();
  
  useEffect(() => {
    setWalletAddress(walletAddress || null);
  }, [walletAddress, setWalletAddress]);
  
  const nextPlanet = getNextPlanetToDiscover();
  const allDiscovered = discoveredPlanets.length === planetsData.length;

  const handleClaimRewards = () => {
    if (bonusTokens > 0) {
      claimRewards();
      toast.success(`ðŸ’Ž ${bonusTokens} tokens transferred to your wallet!`);
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <>
      <div className="fixed inset-0 pointer-events-none">
        {/* Top Bar - Always Visible */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-slate-900/90 to-slate-900/50 backdrop-blur-md border-b border-purple-500/30 pointer-events-auto">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold text-base md:text-lg truncate">Solar System</span>
              <span className="hidden sm:inline text-white/60 text-sm">Explorer</span>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-1 bg-black/40 px-2 md:px-3 py-1 rounded">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm md:text-base">{totalTokens}</span>
              </div>

              {ownedNFTs.length > 0 && (
                <div className="hidden sm:flex items-center gap-1 bg-black/40 px-2 md:px-3 py-1 rounded">
                  <Gem className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-bold text-sm">{ownedNFTs.length}/8</span>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:bg-white/10"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>

              {/* TON Wallet Button - Visible on all devices */}
              <div className="hidden sm:block">
                <TonConnectButton />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMenu(!showMenu)}
                className="text-white hover:bg-white/10 md:hidden"
              >
                {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMenu && (
            <div className="md:hidden border-t border-purple-500/30 p-3 space-y-2 bg-slate-900/80 backdrop-blur-sm">
              {/* Wallet Button - Mobile only */}
              <div className="bg-slate-800/50 border border-purple-500/40 rounded p-2 mb-2">
                <TonConnectButton />
              </div>

              {/* Music Toggle Button */}
              <Button
                onClick={toggleMute}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white mb-2 flex items-center justify-center gap-2"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Sound: OFF</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Sound: ON</span>
                  </>
                )}
              </Button>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => { setActiveTab("game"); setShowMenu(false); }}
                  className={`text-xs ${activeTab === "game" ? "bg-blue-600" : "bg-white/10"}`}
                >
                  Game
                </Button>
                {ownedNFTs.length > 0 && (
                  <Button
                    onClick={() => { setActiveTab("collection"); setShowMenu(false); }}
                    className={`text-xs ${activeTab === "collection" ? "bg-purple-600" : "bg-white/10"}`}
                  >
                    Collection
                  </Button>
                )}
                <Button
                  onClick={() => { setActiveTab("transfer"); setShowMenu(false); }}
                  className={`text-xs ${activeTab === "transfer" ? "bg-emerald-600" : "bg-white/10"}`}
                >
                  Transfer
                </Button>
                <Button
                  onClick={() => { setActiveTab("challenges"); setShowMenu(false); }}
                  className={`text-xs ${activeTab === "challenges" ? "bg-orange-600" : "bg-white/10"}`}
                >
                  Challenges
                </Button>
                <Button
                  onClick={() => { setActiveTab("economy"); setShowMenu(false); }}
                  className={`text-xs ${activeTab === "economy" ? "bg-yellow-600" : "bg-white/10"}`}
                >
                  Economy
                </Button>
                <Button
                  onClick={() => { setActiveTab("earn"); setShowMenu(false); }}
                  className={`text-xs ${activeTab === "earn" ? "bg-green-600" : "bg-white/10"}`}
                >
                  Earn Guide
                </Button>
                <Button
                  onClick={() => { setActiveTab("burn"); setShowMenu(false); }}
                  className={`text-xs ${activeTab === "burn" ? "bg-red-600" : "bg-white/10"}`}
                >
                  Burn
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Top Bar Content */}
        <div className="hidden md:block absolute top-20 left-4 right-4 pointer-events-auto">
          <div className="flex gap-3 flex-wrap">
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-900/70 backdrop-blur-md border-purple-500/40 p-3 flex-1 min-w-64">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-bold text-sm">Game Status</span>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Coins className="w-3 h-3" />
                  <span className="font-semibold">{totalTokens} StarTokens</span>
                </div>
                
                {mintedNFTCount > 0 && (
                  <div className="flex items-center gap-2 text-purple-400">
                    <Gem className="w-3 h-3" />
                    <span className="font-semibold">{mintedNFTCount} NFTs Minted</span>
                  </div>
                )}

                <div className="text-white/80 text-xs">
                  Discovered: {discoveredPlanets.length}/{planetsData.length}
                </div>
                
                {!allDiscovered && nextPlanet && (
                  <div className="text-cyan-400 text-xs">Next: {nextPlanet}</div>
                )}
              </div>
            </Card>

            <NFTBenefits />
            
            {ownedNFTs.length > 0 && (
              <Button
                onClick={() => setShowNFTCollection(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white gap-2 text-sm"
              >
                <Gem className="w-4 h-4" />
                Collection ({ownedNFTs.length}/8)
              </Button>
            )}
            
            <Challenges />
            
            <TokenEconomyInfo />
            
            {bonusTokens > 0 && (
              <Button
                onClick={handleClaimRewards}
                className="bg-green-600 hover:bg-green-700 text-white gap-2 animate-pulse text-sm"
              >
                <Gift className="w-4 h-4" />
                Claim {bonusTokens}
              </Button>
            )}
            
            <Card className="bg-black/80 backdrop-blur-sm border-white/20 p-2">
              <TonConnectButton />
            </Card>
          </div>
        </div>

        {/* Mobile Bottom Panels */}
        {showMenu && (
          <div className="absolute top-32 left-4 right-4 bottom-4 md:hidden overflow-y-auto pointer-events-auto">
            {/* Game Status Panel */}
            {activeTab === "game" && (
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-900/80 backdrop-blur-md border-purple-500/40 p-4 space-y-3">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Game Status
                </h2>
                
                <div className="space-y-2">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 text-sm mb-1">StarTokens</div>
                    <div className="text-yellow-400 font-bold text-xl flex items-center gap-2">
                      <Coins className="w-5 h-5" />
                      {totalTokens}
                    </div>
                  </div>

                  {bonusTokens > 0 && (
                    <Button
                      onClick={handleClaimRewards}
                      className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                      <Gift className="w-4 h-4" />
                      Claim {bonusTokens} Tokens
                    </Button>
                  )}

                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 text-sm mb-1">Planets Discovered</div>
                    <div className="text-white font-bold text-lg">{discoveredPlanets.length}/{planetsData.length}</div>
                    {!allDiscovered && nextPlanet && (
                      <div className="text-cyan-400 text-sm mt-1">Next: {nextPlanet}</div>
                    )}
                  </div>

                  {mintedNFTCount > 0 && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-white/60 text-sm mb-1">NFTs Minted</div>
                      <div className="text-purple-400 font-bold text-lg flex items-center gap-2">
                        <Gem className="w-5 h-5" />
                        {mintedNFTCount}
                      </div>
                    </div>
                  )}
                </div>

                <Card className="bg-slate-900/80 border-purple-500/40 backdrop-blur-sm p-3">
                  <TonConnectButton />
                </Card>
              </Card>
            )}

            {/* Collection Panel */}
            {activeTab === "collection" && ownedNFTs.length > 0 && (
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-900/80 backdrop-blur-md border-purple-500/40 p-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
                  <Gem className="w-5 h-5 text-purple-400" />
                  Your Collection
                </h2>
                
                <Button
                  onClick={() => { setShowNFTCollection(true); setShowMenu(false); }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-4"
                >
                  View Full Collection
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  {ownedNFTs.map(name => {
                    const planet = planetsData.find(p => p.name === name);
                    return (
                      <div key={name} className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{backgroundColor: planet?.color}} />
                        <div className="text-white text-sm font-semibold">{name}</div>
                        <div className="text-white/60 text-xs">NFT âœ“</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Challenges Panel */}
            {activeTab === "challenges" && (
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-900/80 backdrop-blur-md border-purple-500/40 p-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-orange-400" />
                  Challenges
                </h2>
                <Challenges />
              </Card>
            )}

            {/* Economy Panel */}
            {activeTab === "economy" && (
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-900/80 backdrop-blur-md border-purple-500/40 p-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-yellow-400" />
                  Token Economy
                </h2>
                <TokenEconomyInfo />
              </Card>
            )}

            {/* Earning Guide Panel */}
            {activeTab === "earn" && (
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-900/80 backdrop-blur-md border-purple-500/40 p-4 max-h-96 overflow-y-auto">
                <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  Earn Guide
                </h2>
                <EarningGuide />
              </Card>
            )}

            {/* Burn Dashboard Panel */}
            {activeTab === "burn" && (
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-900/80 backdrop-blur-md border-purple-500/40 p-4 max-h-96 overflow-y-auto">
                <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-red-400" />
                  Cosmic Utilities
                </h2>
                <CosmicBurnDashboard />
              </Card>
            )}

            {/* Token Transfer Panel */}
            {activeTab === "transfer" && (
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-900/80 backdrop-blur-md border-purple-500/40 p-4 max-h-96 overflow-y-auto">
                <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
                  <Send className="w-5 h-5 text-emerald-400" />
                  Transfer STAR Tokens
                </h2>
                <TokenTransfer />
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <NFTCollectionModal isOpen={showNFTCollection} onClose={() => setShowNFTCollection(false)} />

      {/* Instructions - Desktop Only */}
      <div className="hidden md:block fixed bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/40 p-3 text-white/70 text-sm text-center">
          <div>Use mouse to rotate â€¢ Scroll to zoom â€¢ Click planets to discover</div>
        </Card>
      </div>

      {/* Mobile Instructions */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 pointer-events-auto">
        <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/40 p-2 text-white/70 text-xs text-center">
          <div>Tap planets to discover â€¢ Use menu for economy & challenges</div>
        </Card>
      </div>
    </>
  );
}
