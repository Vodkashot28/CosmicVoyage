import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import "@fontsource/inter";
import { SolarSystem } from "./components/SolarSystem";
import { GameUI } from "./components/MobileGameUI";
import { PlanetCard } from "./components/PlanetCard";
import { SoundManager } from "./components/SoundManager";
import { TokenParticles } from "./components/TokenParticles";
import { TokenTutorial } from "./components/TokenTutorial";
import { GameOnboarding } from "./components/GameOnboarding";
import { StarBalanceDisplay } from "./components/StarBalanceDisplay";
import { ReferralInvite } from "./components/ReferralInvite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/sonner";

const manifestUrl = "/tonconnect-manifest.json";

function App() {
  const [activeTab, setActiveTab] = useState("game");

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
              camera={{
                position: [0, 30, 60],
                fov: 60,
                near: 0.1,
                far: 1000,
              }}
              gl={{
                antialias: true,
                powerPreference: "high-performance",
              }}
            >
              <Suspense fallback={null}>
                <SolarSystem />
              </Suspense>
            </Canvas>

            <StarBalanceDisplay />
            <GameUI />
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
        <SoundManager />
        <TokenParticles />
        <TokenTutorial />
        <Toaster />
      </div>
    </TonConnectUIProvider>
  );
}

export default App;
