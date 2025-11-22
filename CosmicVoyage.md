# Solar System Explorer - TON Crypto Game

## Overview

Solar System Explorer is an interactive 3D space exploration game where players discover planets sequentially, learning about the solar system while earning cryptocurrency rewards. Built with React and Three.js, and integrated with the TON blockchain, the game offers an immersive educational experience, gamifying astronomy through a dual-token economy (STAR utility and GOV governance tokens), NFT ownership, and a comprehensive reward system. The project aims to "learn astronomy, earn crypto, own the cosmos" with features like daily logins, passive income from NFTs, and various burning utilities to enhance engagement and value.

## User Preferences

Preferred communication style: Simple, everyday language.

## Token Economics & Allocation

### STAR Token Overview
- **Total Supply**: 1 billion STAR tokens (fixed with burn deflation)
- **Distribution Model**: 45% discovery, 20% challenges, 10% daily logins, 15% passive income, 10% events
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

The frontend is built as a component-based application using React 18 with TypeScript. It leverages React Three Fiber and React Three Drei for declarative 3D rendering, creating a full-viewport 3D canvas with overlaid UI components. Radix UI provides accessible interface primitives, and Tailwind CSS is used for styling with custom space-themed design tokens. Vite serves as the build tool, ensuring a fast development experience. State management is handled by Zustand, with separate stores for game progression (`useSolarSystem`), audio controls (`useAudio`), and game phases (`useGame`), utilizing persistence for game progress. Data architecture relies on static TypeScript data structures (`planetsData`) for planet properties and educational content, enforcing sequential planet discovery.

### 3D Scene Architecture

The 3D scene is constructed with React Three Fiber, featuring a `Canvas` root, a `SolarSystem` container, a `Sun` with a pulsing glow, and reusable `Planet` components with orbital groups, hover effects, and click handlers. `OrbitControls` manage camera manipulation. Animations are driven by `useFrame` hooks for individual planet rotation and orbital motion, optimized with Suspense boundaries and asset preloading.

### Backend Architecture

The backend utilizes an Express.js server, currently configured for static file serving in production and integrated with Vite middleware for development. While currently using in-memory storage, the system is designed with a storage interface to easily transition to PostgreSQL using Drizzle ORM. The database schema, defined in `shared/schema.ts`, includes a basic user table. Future expansion points include user authentication, leaderboards, and TON blockchain transaction recording.

## External Dependencies

### Blockchain Integration

- **TON Connect**: Used for wallet connection, NFT minting, and token distribution.
- **TON NFT System (Custom)**: Manages SEQ-based planet NFTs with dynamic metadata, deployed on the TON testnet. Minting occurs upon planet discovery.
- **TON SDKs (`@ton/ton`, `@ton/core`)**: Facilitate interaction with the TON blockchain API for NFT minting and contract verification.

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