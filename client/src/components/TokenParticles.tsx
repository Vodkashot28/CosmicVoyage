import { useEffect, useRef } from "react";

export function TokenParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTokenEarned = (event: CustomEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = rect.width / 2;
      const y = rect.height / 2;

      for (let i = 0; i < 8; i++) {
        const particle = document.createElement("div");
        const angle = (i / 8) * Math.PI * 2;
        const velocity = 3 + Math.random() * 2;
        
        particle.className = "absolute pointer-events-none";
        particle.innerHTML = `
          <div class="text-yellow-400 font-bold text-lg">⭐</div>
        `;
        
        particle.style.left = x + "px";
        particle.style.top = y + "px";
        particle.style.animation = `burst-particle ${1.5}s ease-out forwards`;
        particle.style.setProperty("--angle", angle.toString());
        particle.style.setProperty("--velocity", velocity.toString());
        
        containerRef.current.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1500);
      }
    };

    window.addEventListener("token-earned" as any, handleTokenEarned);
    
    return () => {
      window.removeEventListener("token-earned" as any, handleTokenEarned);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes burst-particle {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: 
              translate(
                calc(cos(var(--angle)) * var(--velocity) * 80px),
                calc(sin(var(--angle)) * var(--velocity) * 80px)
              )
              scale(0);
          }
        }
      `}</style>
      <div ref={containerRef} className="fixed inset-0 pointer-events-none" />
    </>
  );
}
