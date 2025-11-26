import type { PlanetData } from "@/data/planets";

interface OrbitalInfoProps {
  data: PlanetData;
  hovered: boolean;
}

export function OrbitalInfo({ data, hovered }: OrbitalInfoProps) {
  if (!hovered || !data || !data.facts) return null;

  try {
    const orbitalDays = data.facts.orbitalPeriod?.split(" ")[0] || "Unknown";
    const axialTiltDegrees = data.axialTilt ? Math.round((data.axialTilt * 180) / Math.PI * 10) / 10 : 0;

    return (
      <div className="fixed bottom-8 left-8 bg-slate-900/90 border border-cyan-500/50 rounded-lg p-4 max-w-sm z-50 pointer-events-none">
        <h3 className="text-cyan-400 font-semibold text-lg mb-2">{data.name}</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <div>
            <span className="text-cyan-400">Orbital Period:</span> {data.facts.orbitalPeriod}
          </div>
          <div>
            <span className="text-cyan-400">Axial Tilt:</span> {axialTiltDegrees}°
          </div>
          {data.axialTilt !== undefined && (
            <div className="text-yellow-400 text-xs pt-2 border-t border-slate-700 mt-2 pt-2">
              {data.name === "Earth" && "Earth's tilt causes seasons - 23.5° toward the sun = summer"}
              {data.name === "Mars" && "Mars has a similar tilt to Earth, creating seasons"}
              {data.name === "Uranus" && "Uranus rotates on its side - 98° tilt!"}
              {data.name === "Venus" && "Venus spins backward with extreme tilt"}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering orbital info:", error);
    return null;
  }
}
