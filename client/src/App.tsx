import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useMemo, useEffect } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Analytics } from "@vercel/analytics/react";
import "@fontsource/inter";
import { SolarSystem } from "./components/SolarSystem";
import { PlanetCard } from "./components/PlanetCard";
import { SoundManager } from "./components/SoundManager";
import { TokenParticles } from "./components/TokenParticles";
import { TokenTutorial } from "./components/TokenTutorial";
import { GameOnboarding } from "./components/GameOnboarding";
import { DailyLoginReward } from "./components/DailyLoginReward";
import { AudioManager } from "./components/AudioManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/sonner";
import { CollapsibleGameMenu } from "./components/CollapsibleGameMenu";
import { ReferralInvite } from "./components/ReferralInvite";
import { initDracoDecoder } from "./lib/draco-setup";
import { ModelDiagnostics } from "@/components/ModelDiagnostics";
import { APIHealthCheck } from "@/components/APIHealthCheck";
import { useWalletSync } from "@/hooks/useWalletSync"; // Import useWalletSync hook

function App() {
  const [activeTab, setActiveTab] = useState("game");

  // Initialize Draco decoder for compressed .glb models
  useEffect(() => {
    initDracoDecoder();
  }, []);

  // Auto-sync stores when wallet connects
  useWalletSync();

  // Dynamically construct manifest URL based on environment
  const manifestUrl = useMemo(() => {
    // Use current origin for development, production domain in production
    if (typeof window !== 'undefined') {
      const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      return isDev
        ? `${window.location.origin}/tonconnect-manifest.json`
        : "https://solar-system.xyz/tonconnect-manifest.json";
    }
    return "/tonconnect-manifest.json";
  }, []);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {activeTab === "game" ? (
          <>
            <Canvas
              style={{ width: "100%", height: "100%", display: "block" }}
              camera={{
                position: [0, 30, 60],
                fov: 60,
                near: 0.1,
                far: 1000,
              }}
              gl={{
                antialias: true,
                powerPreference: "high-performance",
                alpha: true,
              }}
            >
              <Suspense fallback={null}>
                <SolarSystem />
              </Suspense>
            </Canvas>

            <CollapsibleGameMenu position="right" />
            <PlanetCard />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-auto p-4">
            <div className="max-w-2xl mx-auto">
              <ReferralInvite />
            </div>
          </div>
        )}

        <div className="fixed bottom-4 left-4 z-50">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="bg-slate-900/80 border border-cyan-500/30 rounded-lg"
          >
            <TabsList className="bg-slate-800 p-1">
              <TabsTrigger
                value="game"
                className="data-[state=active]:bg-cyan-600"
              >
                🎮 Game
              </TabsTrigger>
              <TabsTrigger
                value="referral"
                className="data-[state=active]:bg-purple-600"
              >
                🎯 Referral
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <GameOnboarding />
        <DailyLoginReward />
        <AudioManager />
        <SoundManager />
        <TokenParticles />
        <TokenTutorial />
        <ModelDiagnostics />
        <APIHealthCheck />
        <Toaster />
        <Analytics />
      </div>
    </TonConnectUIProvider>
  );
}

export default App;