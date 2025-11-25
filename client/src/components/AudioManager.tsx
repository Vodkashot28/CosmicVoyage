import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";

export function AudioManager() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
    audio.loop = true;

    // Start playing on first interaction
    const playAudio = () => {
      audio.play().catch((e) => console.log("Audio autoplay blocked:", e));
      document.removeEventListener("click", playAudio);
    };

    document.addEventListener("click", playAudio);
    return () => document.removeEventListener("click", playAudio);
  }, [isMuted, volume]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/sounds/background.mp3"
        onError={() => console.log("Audio file not found")}
      />

      {/* Floating audio control */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-cyan-500/30 rounded-lg p-2 backdrop-blur-sm z-40">
        <Button
          onClick={toggleMute}
          variant="ghost"
          size="sm"
          className="text-cyan-400 hover:text-cyan-300 p-2"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </Button>

        {!isMuted && (
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
            className="w-24 h-1 accent-cyan-500"
          />
        )}
      </div>
    </>
  );
}
