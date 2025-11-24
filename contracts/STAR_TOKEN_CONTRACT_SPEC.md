# STAR Token Contract Specification

## Overview
The STAR Token is a fixed-supply token on the TON blockchain for the Solar System Explorer game. It implements a prestige-based economy with burn mechanics and passive income distribution.

## Contract Files
- `STARToken.tact` - Main token contract
- `STARTokenWallet.tact` - User wallet for token management

## Token Properties
- **Name**: STAR Token
- **Symbol**: STAR
- **Total Supply**: 1,000,000,000 (1 Billion)
- **Decimals**: 0 (whole tokens only)
- **Type**: Fixed supply (no minting after initial deployment)

## Strategic Allocation (1B STAR)
```
Gameplay Rewards:        400,000,000 (40%)
Burn Reserve:            200,000,000 (20%)
Liquidity & DEX:         100,000,000 (10%)
Development Treasury:    100,000,000 (10%)
DAO Governance:          100,000,000 (10%)
Marketing & Partnerships: 50,000,000 (5%)
Community Airdrops:       50,000,000 (5%)
```

## Core Functions

### STARToken Contract

#### Transfers
- `TokenTransfer`: Transfer tokens between addresses
- Requires sufficient balance
- Emits transfer event

#### Burning
- `TokenBurn`: Permanently remove tokens from circulation
- Increases prestige of token holder
- Tracked in `totalBurned` metric
- Fuel for cosmic utilities

#### Minting (Admin Only)
- `MintTokens`: Distribute tokens to players/addresses
- Only deployer can mint
- Depletes admin reserve balance
- Used for rewards, airdrops, liquidity

#### Passive Income Distribution
- `DistributePassiveIncome`: Distribute income to NFT holders
- Admin-triggered daily distribution
- Tracks total per address
- Powered by burn reserve allocation

#### Admin Functions
- `SetAdmin`: Transfer admin privileges
- Admin-only operations

### STARTokenWallet Contract

#### Balance Management
- `getBalance()`: Check token balance
- `transfer()`: Send tokens to another wallet
- `emergencyWithdraw()`: Emergency token removal

#### Cosmic Utility Burning
- `burnForUtility()`: Burn tokens for in-game utilities
  - Cosmic Boost: 2x rewards (25 STAR)
  - Void Jump: Skip planet (50 STAR)
  - Celestial Shield: Protect tokens (30 STAR)
  - Asteroid Mining: Mine bonus (40 STAR)
  - Supernova Mode: 3x multiplier (75 STAR)
  - Wormhole Mode: Fast travel (100 STAR)
  - Cosmic Forge: Create NFTs (150 STAR)
  - Dwarf Planet Unlock: Pluto NFT (200 STAR)

#### Passive Income
- `claimPassiveIncome()`: Claim hourly NFT rewards
- Rate: 0.5 STAR/hour per NFT
- Set bonuses apply for collections:
  - Inner planets (4): +25 STAR
  - Outer planets (4): +50 STAR
  - All planets (8): +100 STAR
- `updateNFTOwnership()`: Track NFT holdings

## Economic Parameters

### Burn Rate
- Estimated: 5-10 million STAR/month
- Deflation cycle: 200-400 years
- Creates scarcity pressure over time

### Distribution Model
- Discovery: 45%
- Challenges: 20%
- Daily Login: 10%
- Passive Income: 15%
- Events: 10%

## Deployment

### Testnet
```
Network: TON Testnet
Deployer: 0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01
```

### Initialize
```
STARToken(admin: deployer_address)
```

The deployer receives all 1 billion STAR tokens initially, which are then distributed via game mechanics.

## Security Features
- Admin-only minting
- Owner validation for transfers/burns
- Balance verification on all operations
- Burn tracking for transparency
- Emergency withdrawal capabilities

## Integration Points

### With Game (via API)
1. Player discovers planet → Award STAR tokens
2. Daily login → Distribute login rewards
3. Challenge completion → Award bonus tokens
4. NFT minting → Deduct gameplay reward amount
5. Cosmic utility use → Trigger burn transaction
6. Passive income claim → Distribute from burn reserve

### With Wallet (TonConnect)
1. Player connects wallet
2. Game queries token balance
3. Player can transfer/burn tokens
4. Wallet displays NFT passive income
5. Historical burn activity tracked

### With DEX
1. Liquidity pool for STAR/TON pair
2. Market price discovery
3. Player swaps for other tokens
4. Governance token distribution

## Events Emitted
- Transfer: Token movement between addresses
- Burn: Tokens permanently removed
- Mint: New tokens distributed
- PassiveIncome: NFT holder rewards
- UtilityBurn: Cosmic utility activation
- AdminChange: New admin address set

## Future Enhancements
- Governance voting with DAO tokens
- Staking mechanism for increased rewards
- Cross-chain bridge to other blockchains
- DeFi lending protocol integration
- Automated market maker (AMM) liquidity
