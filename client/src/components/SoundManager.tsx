import { useEffect } from "react";
import { useAudio } from "@/lib/stores/useAudio";

export function SoundManager() {
  const { 
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound,
    backgroundMusic,
    isMuted 
  } = useAudio();
  
  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);
    
    const hitAudio = new Audio("/sounds/hit.mp3");
    setHitSound(hitAudio);
    
    const successAudio = new Audio("/sounds/success.mp3");
    setSuccessSound(successAudio);
    
    return () => {
      bgMusic.pause();
      bgMusic.src = "";
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);
  
  useEffect(() => {
    if (backgroundMusic) {
      if (!isMuted) {
        backgroundMusic.play().catch(error => {
          console.log("Background music autoplay prevented:", error);
        });
      } else {
        backgroundMusic.pause();
      }
    }
  }, [isMuted, backgroundMusic]);
  
  return null;
}
