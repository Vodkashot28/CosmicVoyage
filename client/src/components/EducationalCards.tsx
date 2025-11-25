import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface PlanetInfo {
  name: string;
  emoji: string;
  color: string;
  facts: string[];
  distanceFromSun: string;
  diameter: string;
  interesting: string;
}

const planetData: Record<string, PlanetInfo> = {
  Mercury: {
    name: "Mercury",
    emoji: "☿️",
    color: "gray",
    distanceFromSun: "57.9M km",
    diameter: "4,879 km",
    interesting: "Smallest planet & closest to the Sun. No atmosphere!",
    facts: [
      "Mercury is the fastest planet, orbiting the Sun in just 88 days",
      "It has extreme temperature swings: -173°C at night, +427°C during day",
      "One day on Mercury lasts 59 Earth days",
      "It's named after the Roman messenger god due to its swift movement",
    ],
  },
  Venus: {
    name: "Venus",
    emoji: "♀️",
    color: "yellow",
    distanceFromSun: "108.2M km",
    diameter: "12,104 km",
    interesting: "Hottest planet with a thick toxic atmosphere",
    facts: [
      "Venus rotates backwards compared to most planets (retrograde rotation)",
      "A day on Venus (243 Earth days) is longer than its year (225 days)",
      "Surface temperature: 465°C - hot enough to melt lead",
      "Named after the Roman goddess of love and beauty",
    ],
  },
  Earth: {
    name: "Earth",
    emoji: "🌍",
    color: "blue",
    distanceFromSun: "149.6M km",
    diameter: "12,742 km",
    interesting: "Our home! Only known planet with life",
    facts: [
      "Earth is the only planet known to have life and liquid water on surface",
      "Our planet rotates at 1,670 km/h at the equator",
      "Earth's atmosphere is 78% nitrogen, 21% oxygen",
      "One moon orbits Earth, creating tides and stabilizing our climate",
    ],
  },
  Mars: {
    name: "Mars",
    emoji: "♂️",
    color: "red",
    distanceFromSun: "227.9M km",
    diameter: "6,779 km",
    interesting: "The Red Planet - target for future human exploration",
    facts: [
      "Mars appears reddish due to iron oxide (rust) on its surface",
      "It has the largest volcano in the solar system: Olympus Mons",
      "Mars has a thin atmosphere composed mainly of carbon dioxide",
      "Named after the Roman god of war due to its blood-red color",
    ],
  },
};

interface EducationalCardsProps {
  planet: string;
  onClose: () => void;
}

export function EducationalCard({ planet, onClose }: EducationalCardsProps) {
  const data = planetData[planet];
  const [quizMode, setQuizMode] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  if (!data) return null;

  const correctFactIndex = Math.floor(Math.random() * data.facts.length);
  const wrongFacts = data.facts.filter((_, i) => i !== correctFactIndex);
  const quizOptions = [data.facts[correctFactIndex], ...wrongFacts].sort(
    () => Math.random() - 0.5
  );

  const handleQuizAnswer = (index: number) => {
    setSelectedAnswer(index);
    setAnswered(true);
    const isCorrect = quizOptions[index] === data.facts[correctFactIndex];
    if (isCorrect) {
      toast.success("✅ Correct! +2 STAR bonus!");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">
            <span className="text-5xl">{data.emoji}</span> {data.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!quizMode ? (
            <>
              {/* Planet Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-700/50 rounded p-3">
                  <div className="text-slate-400 text-xs">Distance from Sun</div>
                  <div className="text-cyan-300 font-bold">{data.distanceFromSun}</div>
                </div>
                <div className="bg-slate-700/50 rounded p-3">
                  <div className="text-slate-400 text-xs">Diameter</div>
                  <div className="text-cyan-300 font-bold">{data.diameter}</div>
                </div>
              </div>

              {/* Key Fact */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-cyan-400/30 rounded-lg p-4">
                <div className="text-cyan-300 font-bold mb-2">🔭 Key Feature</div>
                <div className="text-slate-300">{data.interesting}</div>
              </div>

              {/* Facts List */}
              <div>
                <div className="text-slate-400 text-sm mb-3">📚 Did You Know?</div>
                <ul className="space-y-2">
                  {data.facts.map((fact, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-300">
                      <span className="text-cyan-400">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setQuizMode(true)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  🎯 Take Quiz (+2 STAR)
                </Button>
                <Button onClick={onClose} variant="outline" className="flex-1">
                  Close
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Quiz Mode */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="text-purple-300 font-bold mb-3">Question: Which fact about {data.name} is true?</div>
                <div className="space-y-2">
                  {quizOptions.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => !answered && handleQuizAnswer(i)}
                      disabled={answered}
                      className={`w-full p-3 rounded text-left text-sm transition ${
                        answered
                          ? i === quizOptions.indexOf(data.facts[correctFactIndex])
                            ? "bg-green-500/30 border border-green-500/50"
                            : selectedAnswer === i
                              ? "bg-red-500/30 border border-red-500/50"
                              : "bg-slate-700/30"
                          : "bg-slate-700/30 hover:bg-slate-600/30 border border-slate-600/30"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setQuizMode(false);
                    setAnswered(false);
                    setSelectedAnswer(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button onClick={onClose} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
