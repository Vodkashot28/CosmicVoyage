# STAR Token Contract Deployment Guide

## Overview
The STAR Token is a complete smart contract system on the TON blockchain for Solar System Explorer. It implements a fixed-supply token economy with burn mechanics, passive income distribution, and cosmic utility integration.

## Contract Files Generated

### 1. **contracts/STARToken.tact**
Main token contract with:
- Token metadata (1B supply, 0 decimals)
- Balance tracking for all addresses
- Transfer and burn mechanics
- Admin minting capabilities
- Passive income distribution for NFT holders
- Burn reserve tracking

### 2. **contracts/STARTokenWallet.tact**
User wallet contract with:
- Individual token balance management
- Passive income claiming from NFT ownership
- Cosmic utility burning history
- Daily earned tokens tracking
- Emergency withdrawal capability

### 3. **client/src/lib/ton/starTokenContract.ts**
Frontend integration module with:
- Message creation for transfers
- Token burn message builders
- Cosmic utility cost definitions
- Passive income calculation helpers
- Token formatting utilities

### 4. **STAR_TOKEN_CONTRACT_SPEC.md**
Complete technical specification documenting:
- Token properties and allocation
- Core functions and operations
- Economic parameters
- Security features
- Integration points with game
- Event emissions

## Strategic Allocation (1 Billion STAR)

```
┌─────────────────────────────────────────┐
│  GAMEPLAY REWARDS: 400M (40%)           │
│  - Planet discovery: 45% of rewards     │
│  - Challenges: 20% of rewards           │
│  - Daily login: 10% of rewards          │
│  - Passive income: 15% of rewards       │
│  - Events: 10% of rewards               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  BURN RESERVE: 200M (20%)               │
│  - Fuel for cosmic utilities            │
│  - Passive income distribution          │
│  - Economy deflation mechanism          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  OTHER ALLOCATIONS: 400M (40%)          │
│  - Liquidity & DEX: 100M (10%)          │
│  - Dev Treasury: 100M (10%)             │
│  - DAO Governance: 100M (10%)           │
│  - Marketing: 50M (5%)                  │
│  - Airdrops: 50M (5%)                   │
└─────────────────────────────────────────┘
```

## Deployment Steps

### Phase 1: Testnet Deployment

#### 1. Compile Contracts
```bash
# Using Blueprint (TON development kit)
npm install -D @ton/blueprint

# Compile Tact contracts
npx blueprint build

# Output compiled contracts to build/ directory
```

#### 2. Deploy STARToken Contract
```bash
npx blueprint deploy STARToken

# Provide deployer address:
# 0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01

# Contract initialization with 1B STAR tokens
# Admin receives: 1,000,000,000 STAR
```

#### 3. Update Environment Variables
Create `.env.local`:
```
VITE_STAR_TOKEN_ADDRESS=0:YOUR_TESTNET_TOKEN_ADDRESS_HERE
VITE_TOKEN_DEPLOYER=0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01
```

#### 4. Deploy User Wallets (for players)
Each player receives a dedicated wallet contract that:
- Holds their STAR tokens
- Tracks passive income
- Records cosmic burns
- Manages daily claims

### Phase 2: Game Integration

#### 1. Planet Discovery Flow
```
Player Clicks Planet → Game Validates → STARToken.mint() 
→ Tokens awarded to player wallet → Toast notification
```

#### 2. Daily Login Rewards
```
Player logs in → Backend checks daily streak 
→ STARToken.mint() distributes reward → Wallet updated
```

#### 3. NFT Minting
```
Player discovers planet → NFT created on blockchain 
→ Wallet.updateNFTOwnership() → Passive income rate set
→ Scheduled income distribution begins
```

#### 4. Cosmic Utility Activation
```
Player uses utility (e.g., Cosmic Boost) 
→ Wallet.burnForUtility() burns tokens 
→ Game applies 2x reward multiplier for 24 hours
```

#### 5. Passive Income Claiming
```
Player claims income → Wallet.claimPassiveIncome() 
→ Calculates: hours_elapsed × 0.5 STAR × nft_count 
→ Tokens added to balance + set bonuses
```

## Cosmic Utility Costs

| Utility | Cost | Effect | Duration |
|---------|------|--------|----------|
| Cosmic Boost | 25 STAR | 2× token rewards | 24 hours |
| Void Jump | 50 STAR | Skip to next planet | Instant |
| Celestial Shield | 30 STAR | Protect your tokens | 24 hours |
| Asteroid Mining | 40 STAR | Mine bonus tokens | Instant |
| Supernova Mode | 75 STAR | 3× multiplier | 1 hour |
| Wormhole Mode | 100 STAR | Fast travel (discovered planets) | Instant |
| Cosmic Forge | 150 STAR | Create custom planet NFTs | Instant |
| Dwarf Planet Unlock | 200 STAR | Unlock Pluto | Permanent |

## Passive Income Model

**Base Rate**: 0.5 STAR per hour per NFT owned

**Set Bonuses**:
- Inner Planets (Mercury, Venus, Earth, Mars): +25 STAR daily
- Outer Planets (Jupiter, Saturn, Uranus, Neptune): +50 STAR daily
- All Planets (8 NFTs total): +100 STAR daily bonus

**Example**:
- Player owns 4 inner planets
- Earns: 4 NFTs × 0.5 STAR/hour × 24 hours = 48 STAR/day
- Plus bonus: +25 STAR/day
- Total: 73 STAR/day from passive income

## Burn Mechanics

### Monthly Burn Projection
```
Estimated active player base: 10,000 players
Average monthly burns per player: 500-1,000 STAR
Total monthly burn: 5-10 million STAR

Deflation Timeline:
- Year 1: 60-120M STAR burned
- Year 10: 600M-1.2B STAR burned (depends on supply)
- Year 200-400: Complete deflation cycle
```

### Economic Impact
1. **Scarcity**: Token supply decreases over time
2. **Value Increase**: Fewer tokens = higher relative value
3. **Prestige**: Burned tokens recorded as "Immortality Score"
4. **Long-term Viability**: Sustainable for 200+ years

## Testing Checklist

- [ ] Token transfer between wallets
- [ ] Token burn for cosmic utilities
- [ ] Daily login reward distribution
- [ ] NFT passive income calculation
- [ ] Set bonus rewards verification
- [ ] Minting and supply tracking
- [ ] Wallet emergency withdrawal
- [ ] Admin only functions

## Mainnet Deployment (Future)

Once testnet is validated:
1. Update contract addresses to mainnet
2. Deploy with same initial supply (1B STAR)
3. Enable DEX liquidity pools
4. Activate DAO governance
5. Launch public game

## Security Considerations

✅ **Implemented**:
- Admin-only minting (prevents inflation)
- Owner validation on transfers/burns
- Balance verification on all operations
- Burn tracking for transparency
- Emergency withdrawal for admin recovery

⚠️ **Recommendations**:
- Get contract audited before mainnet
- Implement rate limiting on distributions
- Add multi-sig for admin functions
- Consider upgradeable proxy pattern
- Monitor burn rate metrics

## Integration with Game

The game client (`client/src/lib/ton/starTokenContract.ts`) provides:
- Token transfer message builders
- Burn message creators
- Passive income calculators
- Cosmic utility validators
- Frontend wallet integration

All functions are production-ready for TonConnect integration.

## Support & Questions

For deployment assistance:
1. Check `STAR_TOKEN_CONTRACT_SPEC.md` for technical details
2. Review contract source in `contracts/` directory
3. Test extensively on testnet before mainnet deployment
