/**
 * routes/index.tsx — Solar System Explorer main route
 *
 * Full-screen canvas mount + HUD overlay.
 * SEO meta is managed via react-helmet-async (HelmetProvider lives in App.tsx).
 */

import { Helmet } from 'react-helmet-async';
import { SolarSystem } from '@/components/solar-system/SolarSystem';
import { TourHUD } from '@/components/solar-system/CinematicTour';

export default function SolarSystemRoute() {
  return (
    <>
      <Helmet>
        <title>Solar System Explorer — Learn Astronomy, Earn Crypto</title>
        <meta
          name="description"
          content="Explore all 8 planets of our solar system in an interactive 3D scene. Discover worlds, mint NFTs, and earn STAR tokens on the TON blockchain."
        />
        <meta property="og:title"       content="Solar System Explorer" />
        <meta property="og:description" content="Interactive 3D solar system powered by Three.js and TON blockchain." />
        <meta property="og:type"        content="website" />
        <meta name="theme-color"        content="#000008" />
      </Helmet>

      {/* Full-screen container */}
      <div
        style={{
          width:    '100vw',
          height:   '100dvh',
          overflow: 'hidden',
          position: 'relative',
          background: '#000008',
        }}
      >
        {/* 3-D canvas fills the whole viewport */}
        <SolarSystem />

        {/* HUD overlays (HTML, positioned fixed) */}
        <TourHUD />
      </div>
    </>
  );
}
