# Solar System Explorer 🌌

**Learn astronomy, earn crypto, own the cosmos.**  
Solar System Explorer is an interactive 3D space exploration game built with React, Three.js, and the TON blockchain. Players discover planets one by one, collect NFTs, and earn STAR tokens while learning about the solar system. The game combines education, play, and crypto rewards in a dual‑token economy (STAR utility + GOV governance).

---

## 🚀 Features
- Sequential planet discovery with educational content
- 3D interactive solar system (React Three Fiber + Drei)
- Dual‑token economy: STAR (utility) & GOV (governance)
- NFT ownership for planets and rare variants
- Daily login rewards and passive NFT income
- Burn utilities (Boost, Jump, Shield, Mining, Forge) for prestige loops
- DAO governance for community proposals

---

## 💰 Tokenomics

### STAR Token
- **Total Supply**: 1,000,000,000 STAR (fixed, deflationary)
- **Distribution**:
  - 45% gameplay rewards (discovery, challenges, passive NFT income)
  - 20% burn reserve (utilities)
  - 10% daily logins
  - 10% events
  - 15% other allocations (treasury, liquidity, governance, marketing, airdrops)
- **Burn Rate**: 5–10M STAR/month → 200–400 year deflation cycle
- **Philosophy**: Early abundance → Mid balance → Late scarcity prestige

### GOV Token
- Anchors governance and DAO voting
- Controls treasury and community proposals

---

## 🛠 Architecture

### Frontend
- **React 18 + TypeScript**
- **React Three Fiber/Drei** for 3D rendering
- **Radix UI + Tailwind CSS** for interface
- **Zustand** for state management (progress, audio, phases)
- **Vite** for fast builds

### Backend
- **Express.js** server (static + dev middleware)
- **Drizzle ORM** schema (`shared/schema.ts`)
- **Neon Serverless Postgres** (future expansion easy migration to persistent storage

### Blockchain
- **TON Connect** for wallet integration
- **Custom TON NFT system** (planet NFTs with dynamic metadata)
- **TON SDKs** for minting and contract verification

---

## 🎨 Burn Utilities
Players burn STAR to unlock:
- **Exploration**: Boost, Jump
- **Defense**: Shield
- **Creation**: Mining, Forge

Burning creates scarcity, prestige, and late‑game strategy.

---

## 📦 Dependencies
- React, React Three Fiber, Drei, Postprocessing
- Vite + plugins (GLSL, React)
- Radix UI, Tailwind CSS, Sonner
- Framer Motion (UI animations)
- TON SDKs (`@ton/ton`, `@ton/core`)
- Drizzle ORM + Neon Postgres

---

## 🧭 Restorationist Notes
- **Build Anchors**: Regenerate `vite.config.ts` and `index.ts` each deployment for artifact hygiene.
- **Schema Rituals**: Replay migrations from `shared/schema.ts` for reproducibility.
- **Compatibility Anchors**: Tested with Node 20.19.0, Vite 7.2.4, React 18.2.0.
- **Token Lifecycle**: STAR → Earn → Burn → Scarcity → GOV anchors governance.

---

## 📖 Getting Started
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

This is a test PR to validate CodeRabbit + Sourcery integration.
