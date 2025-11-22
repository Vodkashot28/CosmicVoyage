import { useState } from "react";
import { Zap, Target, Star } from "lucide-react";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  reward: number;
}

const challenges: Challenge[] = [
  {
    id: "discover-mercury",
    title: "First Light",
    description: "Discover Mercury",
    icon: <Zap className="w-4 h-4" />,
    reward: 10
  },
  {
    id: "discover-three-planets",
    title: "Space Explorer",
    description: "Discover 3 planets",
    icon: <Target className="w-4 h-4" />,
    reward: 25
  },
  {
    id: "discover-all-planets",
    title: "Solar Master",
    description: "Discover all 8 planets",
    icon: <Star className="w-4 h-4" />,
    reward: 100
  }
];

export function Challenges() {
  const [open, setOpen] = useState(false);
  const { discoveredPlanets, completedChallenges, completeChallenge, isChallengeCompleted, bonusTokens } = useSolarSystem();

  const getAvailableChallenges = () => {
    return challenges.filter(c => {
      if (isChallengeCompleted(c.id)) return false;
      
      if (c.id === "discover-mercury" && discoveredPlanets.length >= 1) return true;
      if (c.id === "discover-three-planets" && discoveredPlanets.length >= 3) return true;
      if (c.id === "discover-all-planets" && discoveredPlanets.length >= 8) return true;
      
      return false;
    });
  };

  const handleCompleteChallenge = (challengeId: string) => {
    completeChallenge(challengeId);
  };

  const availableChallenges = getAvailableChallenges();

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
      >
        <Zap className="w-4 h-4" />
        Challenges {availableChallenges.length > 0 && <span className="ml-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">{availableChallenges.length}</span>}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border-purple-500/20">
          <DialogHeader>
            <DialogTitle className="text-purple-400 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Challenges
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {availableChallenges.length > 0 ? (
              availableChallenges.map(challenge => (
                <Card key={challenge.id} className="bg-slate-800/50 border-purple-500/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {challenge.icon}
                        <h3 className="text-purple-300 font-semibold">{challenge.title}</h3>
                      </div>
                      <p className="text-white/60 text-sm">{challenge.description}</p>
                      <p className="text-yellow-400 text-sm mt-2 font-semibold">+{challenge.reward} Bonus Tokens</p>
                    </div>
                    <Button
                      onClick={() => handleCompleteChallenge(challenge.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      size="sm"
                    >
                      Claim
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-white/60 text-center py-4">
                Discover more planets to unlock challenges!
              </p>
            )}

            {bonusTokens > 0 && (
              <Card className="bg-green-900/20 border-green-500/50 p-4 mt-4">
                <div className="text-green-400 font-semibold mb-2">Unclaimed Rewards: {bonusTokens} tokens</div>
                <p className="text-white/70 text-sm">Complete challenges to earn bonus tokens and claim them in the rewards section!</p>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
