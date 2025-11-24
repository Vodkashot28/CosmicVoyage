import { motion, AnimatePresence } from "framer-motion";
import { X, Gem, Trophy, TrendingUp } from "lucide-react";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { planetsData } from "@/data/planets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NFTCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NFTCollectionModal({ isOpen, onClose }: NFTCollectionModalProps) {
  const { ownedNFTs, getSetBonusTokens, getPassiveIncomeFromNFTs } = useSolarSystem();
  const bonuses = getSetBonusTokens();
  const income = getPassiveIncomeFromNFTs();
  
  const innerPlanets = ['Mercury', 'Venus', 'Earth', 'Mars'];
  const outerPlanets = ['Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  
  const innerCount = innerPlanets.filter(p => ownedNFTs.includes(p)).length;
  const outerCount = outerPlanets.filter(p => ownedNFTs.includes(p)).length;
  const totalBonusAvailable = bonuses.innerPlanets + bonuses.outerPlanets + bonuses.allPlanets;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative pointer-events-auto max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <Card className="bg-black/90 backdrop-blur-md border-white/20">
              <CardHeader className="border-b border-white/10 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white text-2xl">
                  <Gem className="w-6 h-6 text-purple-400" />
                  Your NFT Collection ({ownedNFTs.length}/8)
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {/* Passive Income Stats */}
                {income.tokensPerHour > 0 && (
                  <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <h3 className="text-green-400 font-semibold">Passive Income</h3>
                    </div>
                    <div className="text-white text-lg font-bold">{income.tokensPerHour.toFixed(1)} StarTokens/hour</div>
                    <div className="text-white/60 text-sm mt-1">Earned automatically from owning {ownedNFTs.length} planet NFTs</div>
                  </div>
                )}
                
                {/* Owned NFTs Grid */}
                {ownedNFTs.length > 0 && (
                  <div>
                    <h3 className="text-white/80 font-semibold mb-3 text-lg">Owned Planets</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {ownedNFTs.map(planetName => {
                        const planet = planetsData.find(p => p.name === planetName);
                        if (!planet) return null;
                        
                        return (
                          <motion.div
                            key={planetName}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/5 border border-white/20 rounded-lg p-4 text-center hover:bg-white/10 transition-colors"
                          >
                            <div
                              className="w-12 h-12 rounded-full mx-auto mb-2"
                              style={{ backgroundColor: planet.color }}
                            />
                            <div className="text-white font-semibold">{planetName}</div>
                            <div className="text-white/60 text-xs mt-1">NFT Owned ✓</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {ownedNFTs.length === 0 && (
                  <div className="bg-white/5 border border-white/20 rounded-lg p-6 text-center">
                    <Gem className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <div className="text-white/80">No NFTs yet</div>
                    <div className="text-white/60 text-sm mt-1">Discover planets and mint them as NFTs to start collecting</div>
                  </div>
                )}
                
                {/* Set Bonuses */}
                {totalBonusAvailable > 0 && (
                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-white font-semibold text-lg">Set Bonuses Unlocked</h3>
                    </div>
                    <div className="space-y-3">
                      {bonuses.innerPlanets > 0 && (
                        <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="text-blue-400 font-semibold">Inner Planets Set ✓</div>
                              <div className="text-white/60 text-sm">Mercury • Venus • Earth • Mars</div>
                            </div>
                            <div className="text-yellow-400 font-bold text-xl">+{bonuses.innerPlanets}</div>
                          </div>
                        </div>
                      )}
                      
                      {bonuses.outerPlanets > 0 && (
                        <div className="bg-orange-900/20 border border-orange-500/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="text-orange-400 font-semibold">Outer Planets Set ✓</div>
                              <div className="text-white/60 text-sm">Jupiter • Saturn • Uranus • Neptune</div>
                            </div>
                            <div className="text-yellow-400 font-bold text-xl">+{bonuses.outerPlanets}</div>
                          </div>
                        </div>
                      )}
                      
                      {bonuses.allPlanets > 0 && (
                        <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="text-purple-400 font-semibold">Cosmic Master ✓</div>
                              <div className="text-white/60 text-sm">Own all 8 planets!</div>
                            </div>
                            <div className="text-yellow-400 font-bold text-xl">+{bonuses.allPlanets}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Set Progress */}
                <div className="border-t border-white/10 pt-6 space-y-4">
                  <h3 className="text-white font-semibold">Collection Progress</h3>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80">Inner Planets</span>
                      <span className="text-white font-semibold">{innerCount}/4</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all"
                        style={{ width: `${(innerCount / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80">Outer Planets</span>
                      <span className="text-white font-semibold">{outerCount}/4</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full transition-all"
                        style={{ width: `${(outerCount / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80">Cosmic Master</span>
                      <span className="text-white font-semibold">{ownedNFTs.length}/8</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full transition-all"
                        style={{ width: `${(ownedNFTs.length / 8) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Retention Benefits Explanation */}
                <div className="border-t border-white/10 pt-6 bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-4">
                  <h3 className="text-cyan-400 font-semibold mb-2">Why Collect NFTs?</h3>
                  <ul className="text-white/60 text-sm space-y-2">
                    <li>💚 Earn passive StarTokens every hour just by owning NFTs</li>
                    <li>✨ Collect sets (Inner/Outer planets) for bonus tokens</li>
                    <li>👑 Become a Cosmic Master by collecting all 8 planets (+100 tokens)</li>
                    <li>🎯 NFTs are permanent assets on the TON blockchain</li>
                    <li>📈 Watch your collection grow in value as you earn more tokens</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
