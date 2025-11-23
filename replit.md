# Solar System Explorer - TON Crypto Game

## Overview

Solar System Explorer is an interactive 3D space exploration game where players discover planets sequentially, learning about the solar system while earning cryptocurrency rewards. Built with React and Three.js, and integrated with the TON blockchain, the game offers an immersive educational experience, gamifying astronomy through a dual-token economy (STAR utility and GOV governance tokens), NFT ownership, and a comprehensive reward system. The project aims to "learn astronomy, earn crypto, own the cosmos" with features like daily logins, passive income from NFTs, and various burning utilities to enhance engagement and value.

## User Preferences

Preferred communication style: Simple, everyday language.

## Token Economics & Allocation

### STAR Token Overview
- **Total Supply**: 1 billion STAR tokens (fixed with burn deflation)
- **Bootstrap System**: Genesis faucet gives 10 STAR to all new players (no wallet pre-req)
- **Referral Rewards**: 5-50 STAR per referral with tiered bonuses + 10% passive income bonus for 30 days
- **Distribution Model**: 
  - Genesis: 10 STAR per new player
  - Discovery: 2,373 STAR total (8 planets + 7 dwarfs + 13 asteroids)
  - Passive income: ~312 STAR/day at full collection
  - Referrals: 5-50 STAR per friend invited
- **Burn Rate**: 5-10 million STAR/month (estimated, creates 200-400 year deflation cycle)
- **Economic Philosophy**: Early abundant rewards → Mid balanced economy → Late scarcity-driven prestige

### Strategic Allocation (1B STAR)
1. **Gameplay Rewards** (400M): Discovery, challenges, passive income from NFTs
2. **Burn Reserve** (200M): Fuel for cosmic utilities (Boost, Jump, Shield, Mining, Forge, etc.)
3. **Liquidity & DEX** (100M): Initial liquidity pools and trading pairs
4. **Development Treasury** (100M): Team, audits, infrastructure
5. **DAO Governance** (100M): Community voting, proposals, treasury control
6. **Marketing & Partnerships** (50M): Influencer campaigns, educational outreach
7. **Community Airdrops** (50M): Early adopters, referral bonuses

### Burn Utilities Impact
Burning STAR creates prestige loops:
- Players burn tokens to unlock rare cosmetics, NFT variants, and exclusive lore
- Token scarcity increases value over time
- Late-game progression driven by strategic burning decisions

## System Architecture

### Frontend Architecture

The frontend is built as a component-based application using React 18 with TypeScript. It leverages React Three Fiber and React Three Drei for declarative 3D rendering, creating a full-viewport 3D canvas with overlaid UI components. Radix UI provides accessible interface primitives, and Tailwind CSS is used for styling with custom space-themed design tokens. Vite serves as the build tool, ensuring a fast development experience. State management is handled by Zustand, with separate stores for game progression (`useSolarSystem`), audio controls (`useAudio`), game phases (`useGame`), game balance (`useGameBalance`), and referral tracking (`useReferral`), utilizing persistence for game progress. Data architecture relies on static TypeScript data structures (`planetsData`, `asteroidData`, `allCelestialObjects`) for celestial object properties and educational content, enforcing sequential discovery.

### 3D Scene Architecture

The 3D scene is constructed with React Three Fiber, featuring a `Canvas` root, a `SolarSystem` container, a `Sun` with a pulsing glow, and reusable `CelestialObject` components with orbital groups, hover effects, and click handlers. The scene renders all 28 celestial objects:
- **8 Planets**: Sphere geometry with glowing halos
- **7 Dwarf Planets**: Sphere geometry, smaller scale than planets
- **13 Asteroids**: Box geometry (1×0.8×0.6 ratio) for irregular appearance

Objects animate with individual rotation, orbital motion, and orbital inclination for varied orbital planes. `OrbitControls` manage camera manipulation. Animations are driven by `useFrame` hooks, optimized with Suspense boundaries.

### Backend Architecture

The backend utilizes an Express.js server, currently configured for static file serving in production and integrated with Vite middleware for development. While currently using in-memory storage, the system is designed with a storage interface to easily transition to PostgreSQL using Drizzle ORM. The database schema, defined in `shared/schema.ts`, includes a basic user table. Future expansion points include user authentication, leaderboards, and TON blockchain transaction recording.

## STAR Token Smart Contracts

### Token Contracts
- **STARToken.tact**: Main token contract (1B fixed supply, 0 decimals)
  - Balance tracking and transfers
  - Burn mechanics for cosmic utilities
  - Admin minting from reserves
  - Passive income distribution to NFT holders
  
- **STARTokenWallet.tact**: User wallet contract
  - Individual token balance management
  - Cosmic utility burning history
  - Passive income claiming (0.5 STAR/hour per NFT)
  - Set bonus tracking (inner/outer/all planets)

### Deployment Status
- ✅ STAR Token contracts written in Tact language
- ✅ Planet NFT contracts written in Tact language
- ✅ Frontend integration modules ready (`starTokenContract.ts`, `nftContract.ts`)
- ✅ Environment variables configured with Testnet API key
- ⏳ Testnet deployment pending (compile & deploy with Blueprint)

## Game Progression & Content

### 28 Celestial Objects (3 Phases)
**Phase 1 - Main Planets (Required):**
- Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune
- Sequential unlock, essential for game completion
- Reward: 710 STAR total + 4 STAR/day passive

**Phase 2 - Dwarf Planets (Optional, after Neptune):**
- Pluto, Ceres, Eris, Haumea, Makemake, Gonggong, Orcus
- Unlock after Neptune discovery
- Reward: 1,410 STAR total + 4.9 STAR/day passive

**Phase 3 - Asteroids (Optional, progressive):**
- 13 asteroids across 5 rarity tiers (common→legendary)
- Unlock throughout mid/late game
- Reward: 253 STAR total + 3.25 STAR/day passive

### 3D Representation Strategy
- **Current**: Simple geometric shapes for fast iteration
  - Planets/Dwarfs: Spheres with glowing halos
  - Asteroids: Box geometry (irregular appearance)
  - All with proper colors, sizes, and orbital parameters
- **Future**: Replace with detailed .glb models per object type

## External Dependencies

### Blockchain Integration

- **TON Connect**: Used for wallet connection, NFT minting, and token distribution.
- **TON NFT System (Custom)**: Manages SEQ-based planet NFTs with dynamic metadata, deployed on the TON testnet. Minting occurs upon celestial object discovery.
- **TON STAR Token (Custom)**: Fixed-supply token contract with burn mechanics and passive income distribution.
- **TON Referral Faucet (Tact)**: Tiered referral rewards with 10% passive income bonus for 30 days.
- **TON SDKs (`@ton/ton`, `@ton/core`)**: Facilitate interaction with the TON blockchain API for contract deployment and transaction execution.

### Database

- **Neon Serverless Postgres**: Configured for a serverless PostgreSQL database (currently uses in-memory storage for development).
- **Drizzle ORM**: Used for database schema definition (`shared/schema.ts`), migrations, and type-safe interactions with PostgreSQL.

### UI Component Library

- **Radix UI**: Provides unstyled, accessible UI primitives for components like Dialog, Popover, Tooltip, Accordion, Tabs, and form controls.
- **Tailwind CSS**: Utility-first CSS framework for styling, including custom design tokens and dark mode support.
- **Sonner**: Integrated for toast notifications.

### 3D Graphics

- **Three.js Ecosystem**:
    - `@react-three/fiber`: React renderer for Three.js.
    - `@react-three/drei`: Helper components for 3D elements (Stars, OrbitControls).
    - `@react-three/postprocessing`: Post-processing effects.
    - `vite-plugin-glsl`: Support for GLSL shader files.

### Animation

- **Framer Motion**: Used for UI animations, including modal transitions and spring-based physics.

### Audio Management

- **HTML5 Audio API**: Manages background music and sound effects with volume control and mute functionality.

### Development Tools

- **Vite**: Build tool with React plugin, TypeScript, PostCSS, and esbuild.
- `@replit/vite-plugin-runtime-error-modal`: For development error handling.