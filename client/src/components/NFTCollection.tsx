import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { planetsData } from "@/data/planets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem, Trophy } from "lucide-react";

export function NFTCollection() {
  const { ownedNFTs, getSetBonusTokens } = useSolarSystem();
  const bonuses = getSetBonusTokens();
  
  const innerPlanets = ['Mercury', 'Venus', 'Earth', 'Mars'];
  const outerPlanets = ['Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  
  const innerCount = innerPlanets.filter(p => ownedNFTs.includes(p)).length;
  const outerCount = outerPlanets.filter(p => ownedNFTs.includes(p)).length;
  
  if (ownedNFTs.length === 0) {
    return (
      <Card className="bg-black/80 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Gem className="w-5 h-5 text-purple-400" />
            Your NFT Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/60 text-sm">
            No NFTs yet. Discover planets and mint them as NFTs to start collecting!
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-black/80 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Gem className="w-5 h-5 text-purple-400" />
          Your NFT Collection ({ownedNFTs.length}/8)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Owned NFTs Grid */}
        <div>
          <h3 className="text-white/80 font-semibold mb-2 text-sm">Owned Planets</h3>
          <div className="grid grid-cols-2 gap-2">
            {ownedNFTs.map(planetName => {
              const planet = planetsData.find(p => p.name === planetName);
              if (!planet) return null;
              
              return (
                <div
                  key={planetName}
                  className="bg-white/5 border border-white/20 rounded p-3 flex items-center gap-2"
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: planet.color }}
                  />
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{planetName}</div>
                    <div className="text-white/60 text-xs">NFT Owned</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Set Bonuses */}
        {(bonuses.innerPlanets > 0 || bonuses.outerPlanets > 0 || bonuses.allPlanets > 0) && (
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-white/80 font-semibold mb-3 text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              Set Bonuses Unlocked
            </h3>
            <div className="space-y-2">
              {bonuses.innerPlanets > 0 && (
                <div className="bg-blue-900/20 border border-blue-500/20 rounded p-2">
                  <div className="text-blue-400 font-semibold text-sm">Inner Planets Set</div>
                  <div className="text-white/60 text-xs">Mercury • Venus • Earth • Mars</div>
                  <div className="text-yellow-400 font-bold text-sm mt-1">+{bonuses.innerPlanets} tokens</div>
                </div>
              )}
              
              {bonuses.outerPlanets > 0 && (
                <div className="bg-orange-900/20 border border-orange-500/20 rounded p-2">
                  <div className="text-orange-400 font-semibold text-sm">Outer Planets Set</div>
                  <div className="text-white/60 text-xs">Jupiter • Saturn • Uranus • Neptune</div>
                  <div className="text-yellow-400 font-bold text-sm mt-1">+{bonuses.outerPlanets} tokens</div>
                </div>
              )}
              
              {bonuses.allPlanets > 0 && (
                <div className="bg-purple-900/20 border border-purple-500/20 rounded p-2">
                  <div className="text-purple-400 font-semibold text-sm">Cosmic Master</div>
                  <div className="text-white/60 text-xs">Own all 8 planets!</div>
                  <div className="text-yellow-400 font-bold text-sm mt-1">+{bonuses.allPlanets} tokens</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Set Progress */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm">Inner Planets Set</span>
              <span className="text-white font-semibold text-sm">{innerCount}/4</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${(innerCount / 4) * 100}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm">Outer Planets Set</span>
              <span className="text-white font-semibold text-sm">{outerCount}/4</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${(outerCount / 4) * 100}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm">Cosmic Master</span>
              <span className="text-white font-semibold text-sm">{ownedNFTs.length}/8</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${(ownedNFTs.length / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
