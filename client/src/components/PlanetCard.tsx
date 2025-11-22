import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Circle } from "lucide-react";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { planetsData } from "@/data/planets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NFTStatus } from "@/components/NFTStatus";

export function PlanetCard() {
  const { selectedPlanet, setSelectedPlanet, isPlanetDiscovered } = useSolarSystem();
  
  const planet = planetsData.find(p => p.name === selectedPlanet);
  const isDiscovered = selectedPlanet ? isPlanetDiscovered(selectedPlanet) : false;
  const isOpen = !!selectedPlanet && isDiscovered;
  
  useEffect(() => {
    if (!isDiscovered && selectedPlanet) {
      setSelectedPlanet(null);
    }
  }, [isDiscovered, selectedPlanet, setSelectedPlanet]);
  
  if (!planet) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={() => setSelectedPlanet(null)}
          />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative pointer-events-auto max-w-2xl w-full mx-4"
          >
            <Card className="bg-black/90 backdrop-blur-md border-white/20">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white text-2xl">
                    <Circle 
                      className="w-6 h-6" 
                      style={{ color: planet.color }}
                      fill={planet.color}
                    />
                    {planet.name}
                    <span className="ml-2 px-2 py-1 text-xs bg-purple-600 rounded-full">
                      {planet.tokenReward} ⭐
                    </span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedPlanet(null)}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4 text-yellow-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">+{planet.tokenReward} StarTokens Earned!</span>
                </div>
                
                <p className="text-white/90 text-base mb-6">
                  {planet.facts.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 mb-1">Diameter</div>
                    <div className="text-white font-semibold">{planet.facts.diameter}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 mb-1">Distance from Sun</div>
                    <div className="text-white font-semibold">{planet.facts.distanceFromSun}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 mb-1">Orbital Period</div>
                    <div className="text-white font-semibold">{planet.facts.orbitalPeriod}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 mb-1">Day Length</div>
                    <div className="text-white font-semibold">{planet.facts.dayLength}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3 col-span-2">
                    <div className="text-white/60 mb-1">Moons</div>
                    <div className="text-white font-semibold">{planet.facts.moons}</div>
                  </div>
                </div>
                
                <div className="mt-6 bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                  <div className="text-cyan-400 font-semibold mb-2">Fun Fact</div>
                  <div className="text-white/80 text-sm">{planet.facts.funFact}</div>
                </div>

                <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="text-green-400 font-semibold mb-2">Passive Income</div>
                  <div className="text-white/80 text-sm">
                    Owning this NFT yields <strong>+0.5 STAR/hour</strong>. Set bonuses apply if part of a collection.
                  </div>
                </div>

                <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="text-yellow-400 font-semibold mb-2">Burn Utilities</div>
                  <ul className="text-white/80 text-sm space-y-2">
                    <li>🔥 <strong>Cosmic Boost</strong>: 2× rewards for 24 hours (25 STAR)</li>
                    <li>🚀 <strong>Void Jump</strong>: Skip to next planet (50 STAR)</li>
                    <li>🛡️ <strong>Celestial Shield</strong>: Protect your tokens (30 STAR)</li>
                    <li>🪨 <strong>Asteroid Mining</strong>: Mine bonus tokens (40 STAR)</li>
                    <li>🌑 <strong>Dwarf Planet Unlock</strong>: Mint Pluto (200 STAR)</li>
                  </ul>
                </div>

                {selectedPlanet && <NFTStatus planetName={selectedPlanet} />}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
