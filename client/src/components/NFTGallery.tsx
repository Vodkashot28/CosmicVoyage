import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { planetsData, dwarfPlanets } from "@/data/planets";
import { Package, Star, Zap } from "lucide-react";

export function NFTGallery() {
  const { ownedNFTs, getPassiveIncomeFromNFTs } = useSolarSystem();
  const passiveIncome = getPassiveIncomeFromNFTs();

  const ownedPlanets = planetsData.filter(p => ownedNFTs.includes(p.name) && p.type === "planet");
  const ownedDwarfs = planetsData.filter(p => ownedNFTs.includes(p.name) && p.type === "dwarfPlanet");

  const planetCount = ownedNFTs.length;
  const totalPassivePerHour = (ownedPlanets.length * 0.5) + (ownedDwarfs.length * 0.75);
  const totalPassivePerDay = totalPassivePerHour * 24;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-purple-500/30 rounded-lg p-8">
        <h1 className="text-4xl font-bold text-white mb-2">Your Collection</h1>
        <p className="text-white/60">Discover, mint, and display your beautiful planetary NFTs</p>

        {/* Collection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-black/40 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-blue-400" />
              <p className="text-white/60 text-sm">Total NFTs</p>
            </div>
            <p className="text-3xl font-bold text-blue-400">{planetCount}</p>
          </div>
          <div className="bg-black/40 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <p className="text-white/60 text-sm">Hourly Passive</p>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{totalPassivePerHour.toFixed(2)}</p>
            <p className="text-xs text-white/40 mt-1">STAR/hour</p>
          </div>
          <div className="bg-black/40 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-400" />
              <p className="text-white/60 text-sm">Daily Passive</p>
            </div>
            <p className="text-3xl font-bold text-green-400">{totalPassivePerDay.toFixed(0)}</p>
            <p className="text-xs text-white/40 mt-1">STAR/day</p>
          </div>
          <div className="bg-black/40 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-purple-400" />
              <p className="text-white/60 text-sm">Set Bonuses</p>
            </div>
            <p className="text-3xl font-bold text-purple-400">{ownedPlanets.length === 4 && ownedDwarfs.length === 5 ? 175 : ownedPlanets.length === 4 ? 25 : ownedDwarfs.length === 4 ? 50 : 0}</p>
            <p className="text-xs text-white/40 mt-1">bonus STAR</p>
          </div>
        </div>
      </div>

      {/* Gallery Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700 w-full grid grid-cols-3">
          <TabsTrigger value="all">All NFTs ({planetCount})</TabsTrigger>
          <TabsTrigger value="planets">Planets ({ownedPlanets.length})</TabsTrigger>
          <TabsTrigger value="dwarf">Dwarf Planets ({ownedDwarfs.length})</TabsTrigger>
        </TabsList>

        {/* All NFTs */}
        <TabsContent value="all" className="mt-6">
          {planetCount === 0 ? (
            <Card className="bg-slate-900/50 border-purple-500/30 p-12 text-center">
              <Package className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">You haven't minted any NFTs yet!</p>
              <p className="text-white/40 text-sm mt-2">Discover planets and mint them as beautiful 3D NFTs to start earning passive income.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...ownedPlanets, ...ownedDwarfs].map((planet) => (
                <NFTCard key={planet.name} planet={planet} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Planets Only */}
        <TabsContent value="planets" className="mt-6">
          {ownedPlanets.length === 0 ? (
            <Card className="bg-slate-900/50 border-purple-500/30 p-12 text-center">
              <Package className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No planet NFTs owned yet</p>
              <p className="text-white/40 text-sm mt-2">Discover and mint the 8 main planets to complete your solar system collection.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownedPlanets.map((planet) => (
                <NFTCard key={planet.name} planet={planet} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Dwarf Planets */}
        <TabsContent value="dwarf" className="mt-6">
          {ownedDwarfs.length === 0 ? (
            <Card className="bg-slate-900/50 border-purple-500/30 p-12 text-center">
              <Star className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No dwarf planet NFTs owned yet</p>
              <p className="text-white/40 text-sm mt-2">Unlock dwarf planets (Pluto, Ceres, Eris, Haumea, Makemake) to earn 0.75 STAR/hour per NFT.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownedDwarfs.map((planet) => (
                <NFTCard key={planet.name} planet={planet} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Info Banner */}
      {planetCount > 0 && (
        <Card className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-500/30 p-6">
          <h3 className="text-white font-semibold mb-3">📊 Your Passive Income</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-white/60 mb-1">Per Hour</p>
              <p className="text-2xl font-bold text-blue-400">{totalPassivePerHour.toFixed(2)} STAR</p>
            </div>
            <div>
              <p className="text-white/60 mb-1">Per Day</p>
              <p className="text-2xl font-bold text-green-400">{totalPassivePerDay.toFixed(0)} STAR</p>
            </div>
            <div>
              <p className="text-white/60 mb-1">Per Year</p>
              <p className="text-2xl font-bold text-purple-400">{(totalPassivePerDay * 365).toFixed(0)} STAR</p>
            </div>
          </div>
          <p className="text-white/50 text-xs mt-4">💡 Tokens are earned automatically, even when you're offline!</p>
        </Card>
      )}
    </div>
  );
}

interface NFTCardProps {
  planet: typeof planetsData[0];
}

function NFTCard({ planet }: NFTCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const passiveRate = planet.passiveIncomeRate || 0;
  const dailyPassive = passiveRate * 24;
  const yearlyPassive = dailyPassive * 365;

  return (
    <Card 
      className="bg-gradient-to-br from-slate-900 to-slate-800 border-purple-500/30 p-6 cursor-pointer hover:border-purple-400/50 transition-all hover:scale-105"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {!isFlipped ? (
        <div className="text-center">
          {/* Planet Visual */}
          <div className="flex items-center justify-center h-32 mb-4">
            <div 
              className="rounded-full shadow-lg"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: planet.color,
                boxShadow: `0 0 30px ${planet.color}40, inset 0 0 30px rgba(0,0,0,0.5)`
              }}
            />
          </div>

          {/* Name & Type */}
          <h3 className="text-white font-bold text-lg mb-1">{planet.name}</h3>
          <p className="text-white/60 text-xs mb-3">
            {planet.type === "planet" ? "Planet" : planet.type === "dwarfPlanet" ? "Dwarf Planet" : "Asteroid"}
          </p>

          {/* Passive Income */}
          <div className="bg-black/30 rounded p-3 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-xs">Passive Income</span>
              <span className="text-yellow-400 font-bold">{passiveRate} STAR/h</span>
            </div>
          </div>

          {/* Rarity */}
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-600/30 border border-purple-400/50 text-purple-400">
            {planet.type === "planet" ? "Rare" : "Epic"}
          </div>

          <p className="text-white/40 text-xs mt-4">Click to see details →</p>
        </div>
      ) : (
        <div>
          {/* Details Side */}
          <h3 className="text-white font-bold text-lg mb-3">{planet.name}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/70">
              <span>Diameter</span>
              <span className="text-white font-semibold">{planet.facts.diameter}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Distance from Sun</span>
              <span className="text-white font-semibold">{planet.facts.distanceFromSun}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Orbital Period</span>
              <span className="text-white font-semibold">{planet.facts.orbitalPeriod}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Moons</span>
              <span className="text-white font-semibold">{planet.facts.moons}</span>
            </div>
          </div>

          {/* Passive Income Details */}
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded p-3 mt-4">
            <p className="text-white/60 text-xs mb-2">Passive Income Generation</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-white/40">Daily</p>
                <p className="text-green-400 font-bold">{dailyPassive.toFixed(0)} STAR</p>
              </div>
              <div>
                <p className="text-white/40">Yearly</p>
                <p className="text-green-400 font-bold">{yearlyPassive.toFixed(0)} STAR</p>
              </div>
            </div>
          </div>

          <p className="text-white/40 text-xs mt-4 text-center">Click to see visual →</p>
        </div>
      )}
    </Card>
  );
}
