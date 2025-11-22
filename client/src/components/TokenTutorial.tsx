import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TokenTutorial() {
  const [expanded, setExpanded] = useState(false);

  const steps = [
    {
      title: "🪐 Discover Planets",
      description: "Click on planets to discover them in order (Mercury → Neptune). Each discovery earns tokens!",
      tokens: "10-150 tokens per planet"
    },
    {
      title: "⭐ Complete Challenges",
      description: "Click the Challenges button to complete discovery milestones and earn bonus tokens.",
      tokens: "5-100 bonus tokens per challenge"
    },
    {
      title: "🎨 Mint NFTs",
      description: "After discovering a planet, open its details and click 'Mint as NFT' to create a 3D glTF NFT on TON blockchain.",
      tokens: "Free to mint (costs only gas)"
    },
    {
      title: "💎 Claim Rewards",
      description: "Once you have bonus tokens, click 'Claim' to transfer them to your TON wallet.",
      tokens: "Transfers all pending tokens"
    },
    {
      title: "🔥 Burn for Utilities",
      description: "Click 'Economy' to burn tokens for special utilities like Cosmic Boost (2x rewards), Void Jump (skip restrictions), or Celestial Shield (free NFT minting).",
      tokens: "50-100 tokens per utility"
    }
  ];

  return (
    <div className="fixed bottom-20 right-4 w-96 pointer-events-auto z-30 hidden md:block">
      <Button
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 mb-2"
      >
        <BookOpen className="w-4 h-4" />
        How to Earn & Burn Tokens
        {expanded ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
      </Button>

      {expanded && (
        <Card className="bg-slate-900 border-blue-500/30 p-4 space-y-3 max-h-96 overflow-y-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
              <h3 className="text-white font-semibold mb-1">{step.title}</h3>
              <p className="text-white/70 text-sm mb-2">{step.description}</p>
              <div className="text-yellow-400 text-xs font-semibold">{step.tokens}</div>
            </div>
          ))}

          <div className="bg-green-900/20 border border-green-500/30 rounded p-3 mt-4">
            <p className="text-green-400 text-sm">
              💡 <strong>Pro Tip:</strong> Discover all planets to unlock the "Solar Master" challenge and earn 100 bonus tokens!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
