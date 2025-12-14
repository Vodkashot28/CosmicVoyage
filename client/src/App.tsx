import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useMemo, useEffect } from "react";
import { TonConnectUIProvider, CHAIN } from "@tonconnect/ui-react";
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
import { useWalletSync } from "@/hooks/useWalletSync";

function App() {
  const [activeTab, setActiveTab] = useState("game");

  useEffect(() => {
    initDracoDecoder();
  }, []);

  useWalletSync();

  const manifestUrl = useMemo(() => {
    if (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      return `${window.location.origin}/tonconnect-manifest.json`;
    }
    return "https://solar-system.xyz/tonconnect-manifest.json";
  }, []);

  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      network={CHAIN.TESTNET} // ✅ switched to Testnet
      actionsConfiguration={{
        // keep valid keys only here if needed
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only fixed top-4 left-4 z-[9999] bg-cyan-600 p-2 text-white rounded-md"
        >
          Skip to Main Content
        </a>

        {activeTab === "game" ? (
          <>
            <main id="main-content" tabIndex={-1}>
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
            </main>

            <CollapsibleGameMenu position="right" />
            <PlanetCard />
          </>
        ) : (
          <main
            id="main-content"
            tabIndex={-1}
            className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-auto p-4"
          >
            <div className="max-w-2xl mx-auto">
              <ReferralInvite />
            </div>
          </main>
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
