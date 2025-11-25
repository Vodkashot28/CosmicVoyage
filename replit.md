# Solar System Explorer - TON Crypto Game

## Overview
Solar System Explorer is an interactive 3D space exploration game built with React, Three.js, and integrated with the TON blockchain. Players discover planets, learn astronomy, and earn cryptocurrency rewards. The game features a dual-token economy (STAR utility and GOV governance tokens), NFT ownership, and a comprehensive reward system. The project's vision is to "learn astronomy, earn crypto, own the cosmos" through daily logins, passive income from NFTs, and various token burning utilities, enhancing engagement and value.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is a component-based React 18 application with TypeScript, utilizing React Three Fiber and React Three Drei for declarative 3D rendering. It features a full-viewport 3D canvas with overlaid UI components, styled with Radix UI and Tailwind CSS. Vite is used for building. Authentication is handled via TONCONNECT for wallet-based login. State management uses Zustand for game progression, audio, game phases, balance, and referrals. Data for celestial objects is stored in static TypeScript structures. Analytics uses a device ID-based tracking system that works without a wallet requirement.

### 3D Scene Architecture
The 3D scene, built with React Three Fiber, includes a `Canvas` root, a `SolarSystem` container, a `Sun`, and reusable `CelestialObject` components. It renders 28 celestial objects (8 Planets, 7 Dwarf Planets, 13 Asteroids) with individual rotation, orbital motion, and inclination. Orbital mechanics include realistic orbital periods based on Kepler's laws and accurate axial tilt visualization. Interactive orbital information is displayed on hover. `OrbitControls` manage camera manipulation, and animations are driven by `useFrame` hooks.

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
3D representation currently uses simple geometric shapes for most objects with new detailed .glb models for Mercury, Venus, and Earth.

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

### Animation
- **Framer Motion**: UI animations and transitions.

### Audio Management
- **HTML5 Audio API**: Background music and sound effects.

### Development Tools
- **Vite**: Build tool.
- `@replit/vite-plugin-runtime-error-modal`: Development error handling.