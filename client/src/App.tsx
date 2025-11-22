import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import "@fontsource/inter";
import { SolarSystem } from "./components/SolarSystem";
import { GameUI } from "./components/MobileGameUI";
import { PlanetCard } from "./components/PlanetCard";
import { SoundManager } from "./components/SoundManager";
import { TokenParticles } from "./components/TokenParticles";
import { TokenTutorial } from "./components/TokenTutorial";
import { Toaster } from "./components/ui/sonner";

const manifestUrl = "https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json";

function App() {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <Canvas
          camera={{
            position: [0, 30, 60],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "high-performance"
          }}
        >
          <Suspense fallback={null}>
            <SolarSystem />
          </Suspense>
        </Canvas>
        
        <GameUI />
        <PlanetCard />
        <SoundManager />
        <TokenParticles />
        <TokenTutorial />
        <Toaster />
      </div>
    </TonConnectUIProvider>
  );
}

export default App;
