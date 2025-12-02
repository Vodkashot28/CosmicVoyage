# Solar System Explorer - TON Crypto Game

## Overview
Solar System Explorer is an interactive 3D space exploration game built with React, Three.js, and integrated with the TON blockchain. Players discover planets, learn astronomy, and earn cryptocurrency rewards. The game features a dual-token economy (STAR utility and GOV governance tokens), NFT ownership, and a comprehensive reward system. The project's vision is to "learn astronomy, earn crypto, own the cosmos" through daily logins, passive income from NFTs, and various token burning utilities, enhancing engagement and value.

**Current Status**: 🚀 MVP Development - All 28 celestial objects generated and ready for dynamic orbit visualization.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is a component-based React 18 application with TypeScript, utilizing React Three Fiber and React Three Drei for declarative 3D rendering. It features a full-viewport 3D canvas with overlaid UI components, styled with Radix UI and Tailwind CSS. Vite is used for building. Authentication is handled via TONCONNECT for wallet-based login. State management uses Zustand for game progression, audio, game phases, balance, and referrals. Data for celestial objects is stored in static TypeScript structures. Analytics uses a device ID-based tracking system that works without a wallet requirement.

### 3D Scene Architecture
The 3D scene, built with React Three Fiber, includes a `Canvas` root, a `SolarSystem` container, a `Sun`, and reusable `CelestialObject` components. It renders 28 celestial objects (8 Planets, 7 Dwarf Planets, 13 Asteroids) with individual rotation, orbital motion, and inclination. Orbital mechanics include realistic orbital periods based on Kepler's laws and accurate axial tilt visualization. Interactive orbital information is displayed on hover. `OrbitControls` manage camera manipulation, and animations are driven by `useFrame` hooks.

**Cosmic Visualization Enhancements** (In Progress):
- **OrbitLine.tsx**: Shader-based dynamic orbit visualization with energy trail effects
- Pulsating glow tied to NFT discovery/ownership status (undiscovered → faint, discovered → moderate, owned → vibrant)
- Shimmer animation for visual appeal and dynamic energy feel
- Gradient fade effects along orbital paths

### Backend Architecture
The backend uses an Express.js server with Drizzle ORM and PostgreSQL. The database schema includes tables for users, email verifications, daily login rewards, discoveries, NFTs, and analytics events. Key API routes handle email verification, daily login claims, analytics, player profiles, genesis claims, planet discovery, and NFT minting.

### Token Economics
The game features a fixed supply STAR token (1 billion) with a deflationary burn mechanism. Distribution occurs through genesis faucet claims, planet discovery rewards, daily logins, educational quizzes, passive income from NFTs, and referrals. Strategic allocation covers gameplay rewards, burn reserve, liquidity, development, DAO governance, marketing, and airdrops. Burn utilities include NFT upgrades (CosmicRefinement), prestige achievements (StellarMapUnification), and consumable modules (SatelliteModuleBlueprints).

### Smart Contracts (TON Blockchain)
- **STARToken.tact**: Main token contract for balance, transfers, burn mechanics, admin minting, and passive income distribution.
- **STARTokenWallet.tact**: User wallet contract for individual balances, burn history, and passive income claiming.
- **CosmicRefinement.tact**: NFT upgrade system for passive income multipliers.
- **StellarMapUnification.tact**: Prestige burn mechanic for achievements.
- **SatelliteModuleBlueprints.tact**: Consumable token contracts.
- **StellarImmortalityLedger.tact**: Analytics contract for burn transactions and leaderboards.

### Game Progression & Content
The game features 28 celestial objects across three phases:
- **Phase 1 (Main Planets)**: 8 planets (Mercury to Neptune) with sequential unlock.
- **Phase 2 (Dwarf Planets)**: 7 dwarf planets (Pluto, Ceres, etc.), unlocked after Neptune.
- **Phase 3 (Asteroids)**: 13 asteroids across 5 rarity tiers, unlocked progressively.
3D representation uses high-fidelity .glb models with automatic fallback to geometric shapes.

### 3D Models Infrastructure
**Status**: ✅ 28/28 Celestial Objects Generated! (8 planets, 7 dwarf planets, 13 asteroids)

**Model Generation Details**:
- **PlanetModel.tsx**: Reusable component for loading and rendering .glb models with auto-fallback to geometric shapes
- **planetModels.ts**: Asset manager with configuration for all 28 objects (scale, rotation speed, model paths)
- **draco-setup.ts**: Initializes Draco decoder for compressed .glb decompression on client devices
- **Models Directory**: `client/public/models/` - Contains 28 high-quality .glb celestial object models
- **Total Model Size**: ~389MB (pre-compression), suitable for Draco Level 10 optimization
- **Generated Models**: 
  - **8 Main Planets**: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune (scientifically accurate colors, sizes, surface features)
    - Mercury: Gray cratered surface (~0.4x Earth)
    - Venus: Yellow cloudy atmosphere (~0.95x Earth)
    - Earth: Blue oceans, green continents, cloud layers (1.0x reference)
    - Mars: Red rocky surface with polar ice caps (~0.53x Earth)
    - Jupiter: Brown/white cloud bands with Great Red Spot (~2.5x Earth)
    - Saturn: Golden with prominent ring system (~2.2x Earth)
    - Uranus: Pale cyan ice giant with axial tilt (~1.8x Earth)
    - Neptune: Deep blue ice giant with storm features (~1.7x Earth)
  - **7 Dwarf Planets**: Pluto, Ceres, Eris, Haumea, Makemake, Gonggong, Orcus (icy, cratered, smaller scales)
  - **13 Asteroids**: Vesta, Pallas, Juno, Hygiea, Astraea, Apophis, Bennu, Itokawa, Eros, Psyche (metallic), Varda, Oumuamua (elongated), Halley (comet)

**Compression Strategy**: 
- Generated models ready for Draco Level 10 compression (maximum bandwidth reduction for mobile)
- Fallback strategy: Level 7 if client decompression causes loading pause
- Quantize settings optimized for celestial object geometry

**PBR Material Setup**: 
- Generated models include proper material setup for realistic rendering
- Base Color: sRGB color space (diffuse texture)
- Normal/Roughness/Metallic: Non-Color space (surface detail textures)
- Emissive mapping for discovered objects

**Orbital Motion**: 
- ✅ Enabled at 0.1x speed multiplier - planets visibly orbit around Sun
- Orbital inclination angles configured per object (realistic tilts)
- Axial tilt visualization for Earth-like rotation

**Performance Optimizations**:
- Draco decoder auto-initialization on app load
- Geometry fallback system prevents rendering failures
- Lazy loading ready for future phase-based unlocks

### Cosmic Visualization System (MVP Phase)
**Current Implementation**:
- Simple white orbit lines with opacity based on discovery status
- Basic color coding for celestial objects
- Pulsing glow effects for discovered objects

**Planned Enhancements**:
- **Dynamic Orbit Lines**: Replace simple `Line` component with shader-based `OrbitLine` component
- **Energy Trail Effects**: Pulsating glows at STAR token colors (purple/gold gradient)
- **NFT Ownership Visualization**: Orbits glow intensely when NFT is minted/owned
- **Discovery State Feedback**: Undiscovered → faint/broken line, discovered → solid, owned → vibrant with shimmer
- **Interactive Highlighting**: Hover effects on orbits with visual feedback

## External Dependencies

### Blockchain Integration
- **TON Connect**: Wallet connection, NFT minting, token distribution.
- **TON NFT System (Custom)**: Manages SEQ-based planet NFTs with dynamic metadata.
- **TON STAR Token (Custom)**: Fixed-supply token contract.
- **TON Referral Faucet (Tact)**: Tiered referral rewards.
- **TON SDKs (`@ton/ton`, `@ton/core`)**: Interaction with TON blockchain API.

### Database
- **Neon Serverless Postgres**: Serverless PostgreSQL database.
- **Drizzle ORM**: Database schema definition and interaction.

### UI Component Library
- **Radix UI**: Accessible UI primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Sonner**: Toast notifications.

### 3D Graphics
- **Three.js Ecosystem**: `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `vite-plugin-glsl`.
- **Draco Compression**: Client-side decompression for .glb models (Level 10 optimal for mobile).

### Animation
- **Framer Motion**: UI animations and transitions.

### Audio Management
- **HTML5 Audio API**: Background music and sound effects.

### Development Tools
- **Vite**: Build tool.
- `@replit/vite-plugin-runtime-error-modal`: Development error handling.

## Recent Changes (Session December 2, 2025)

### Compilation Status ✅
| Contract | Status | Deployed |
|----------|--------|----------|
| STARToken | ✅ Compiled | Dec 1 |
| STARTokenWallet | ✅ Compiled | Dec 2 |
| PlanetNFT | ✅ Compiled | Dec 2 |
| PlanetNFTItem | ✅ Compiled | Dec 2 |
| ReferralFaucet | ✅ Compiled | Dec 2 |

### Completed Tasks
- ✅ Fixed all Tact v1.6.13 syntax errors (5/5 contracts)
- ✅ Deployed all 5 smart contracts to TON Testnet
- ✅ Integrated contract addresses into frontend (contracts.ts, contractConfig.json)
- ✅ Created contractInteraction.ts utility class for blockchain calls
- ✅ Set environment variables for all contract addresses
- ✅ Updated replit.md with production deployment info

## Deployment Status (December 2, 2025)
- **Local Testing**: ✅ Game running on localhost:5000
- **Frontend/Backend**: Ready for publishing (awaiting Core plan or alternative)
- **Smart Contracts**: ✅ ALL 5 DEPLOYED TO TON TESTNET
  - **STARToken**: ✅ EQAIYlrr3UiMJ9fqI-B4j2nJdiiD7WzyaNL1MX_wiONc4OUi
  - **STARTokenWallet**: ✅ EQDy43am74uRimAbuKFthYO4PJY95wzNOpsfOAfBhkwwnC9c
  - **PlanetNFT**: ✅ EQBuZlqecX7qIEHlakYKEqPVtQ5An3XwqDg4DoAh3dNHlHqS
  - **PlanetNFTItem**: ✅ EQCxm_x7fTE-_bpyb4yXdSbd3rck6ctxPNV7HhtDc0PA-JRk
  - **ReferralFaucet**: ⏳ EQC4EQAmL5WKePiV0zzRXZjraZdlpqJOgQOVaH_PKs_FVF8a (deployed, confirming)
- **Database**: Development database ready, migrations current

## Performance Targets
- Model load time: <2s per batch (with Draco compression)
- FPS: 60fps on mobile devices (three.js instancing ready)
- Memory: <100MB for 28 models (Draco compression target)
- Bundle size: <5MB initial (models lazy-loaded)

## Next Steps (Post MVP)
1. Complete OrbitLine integration with NFT ownership states
2. Test 28-object performance on low-end mobile devices
3. Implement Draco Level 10 compression on all models
4. Deploy smart contracts to TON testnet
5. Run end-to-end game flow testing (discovery → mint → passive income)
6. Optimize UI/UX based on user feedback
