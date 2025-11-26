import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { StarBalanceDisplay } from "./StarBalanceDisplay";
import { PlayerStatsPanel } from "./PlayerStatsPanel";
import { GameUI } from "./MobileGameUI";

export function CollapsibleGameMenu({ position = "right" }: { position?: "left" | "right" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`fixed top-0 ${position === "right" ? "right-0" : "left-0"} h-screen flex z-40`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-10 h-10 ${
          position === "right" ? "rounded-l-lg" : "rounded-r-lg"
        } bg-gradient-to-b from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-500/60 transition-all backdrop-blur-sm ${
          isOpen ? "opacity-60" : "opacity-100"
        }`}
        title={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          position === "right" ? (
            <ChevronRight size={18} className="text-cyan-400" />
          ) : (
            <ChevronLeft size={18} className="text-cyan-400" />
          )
        ) : (
          position === "right" ? (
            <ChevronLeft size={18} className="text-cyan-400" />
          ) : (
            <ChevronRight size={18} className="text-cyan-400" />
          )
        )}
      </button>

      {/* Sliding Menu */}
      {isOpen && (
        <div
          className={`w-72 h-full bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border-l border-cyan-500/20 overflow-y-auto backdrop-blur-sm animate-in slide-in-from-right`}
        >
          <div className="p-2 space-y-2 pt-3">
            {/* STAR Balance Section */}
            <StarBalanceDisplay />

            {/* Player Stats Section */}
            <PlayerStatsPanel />

            {/* Game Controls Section */}
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded p-2">
              <div className="text-xs text-cyan-400 uppercase mb-1 font-semibold leading-tight">
                Game
              </div>
              <div className="scale-75 origin-top-left -ml-1 -mt-1">
                <GameUI />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
