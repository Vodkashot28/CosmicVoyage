# Planet NFT Contract Specification

## Overview
The Planet NFT system uses SEQ standard contracts on the TON blockchain to manage unique planet discoveries as tradeable NFTs.

## Contract Structure

### PlanetNFT.tact (Collection)
Main contract managing:
- Collection metadata (Solar System Planets)
- Minting authorization
- NFT ownership tracking
- Royalty distribution (5% to game treasury)
- Discovery order recording

**Key Functions**:
- `mint()` - Create new planet NFT
- `transfer()` - Transfer NFT ownership
- `getCollectionInfo()` - Retrieve metadata
- `getNFTMetadataURI()` - Get metadata JSON path
- `addMinter()` - Authorize minter address
- `setRoyalty()` - Update royalty percentage

### PlanetNFTItem.tact (Individual NFT)
Contract for each planet NFT:
- Stores planet-specific metadata
- Rarity assignment (legendary/epic/rare/common)
- Passive income property
- Glow color and visual traits
- Ownership management

**Key Functions**:
- `transfer()` - Change ownership
- `getOwner()` - Retrieve current owner
- `getPassiveIncomeInfo()` - Passive income details
- `getNFTData()` - Full metadata retrieval
- `setPassiveIncomeStatus()` - Enable/disable income
- `setAttribute()` - Update custom attributes

## NFT Properties

### Rarity System
```
Legendary  → 1st discovered planet (1 NFT max)
Epic       → 2nd-3rd discovered (2 NFTs max)
Rare       → 4th-6th discovered (3 NFTs max)
Common     → 7th+ discovered (unlimited)
```

### Passive Income
- Base: 0.5 STAR per hour per NFT
- Inner planets bonus: +25 STAR/day
- Outer planets bonus: +50 STAR/day
- All planets bonus: +100 STAR/day

### Visual Traits
```
Mercury  - Golden glow (#FFD700)
Venus    - Golden glow (#FFD700)
Earth    - Cyan glow (#00D9FF)
Mars     - Orange glow (#FF8C00)
Jupiter  - Golden glow (#FFD700)
Saturn   - Golden glow (#FFD700)
Uranus   - Cyan glow (#00D9FF)
Neptune  - Blue glow (#0099FF)
```

## Minting Workflow

1. **Discovery** - Player discovers planet sequentially
2. **Validation** - Game confirms discovery eligibility
3. **NFT Creation** - `PlanetNFT.mint()` called with:
   - Planet name
   - Player wallet address
   - Discovery order (1-8)
4. **Metadata** - JSONdescription generated:
   - Name, rarity, image
   - Discovery order
   - Glow color
   - Passive income property
5. **Distribution** - Token rewards awarded to player

## Metadata Structure

```json
{
  "name": "Planet Mercury #1",
  "description": "Discovered in Solar System Explorer. Rarity: Legendary",
  "image": "https://solarsystemexplorer.com/nft/mercury.png",
  "attributes": [
    {"trait_type": "Planet", "value": "Mercury"},
    {"trait_type": "Discovery Order", "value": "1"},
    {"trait_type": "Rarity", "value": "Legendary"},
    {"trait_type": "Glow Color", "value": "#FFD700"},
    {"trait_type": "Passive Income", "value": "+0.5 STAR/hour"}
  ]
}
```

## Royalty System

**Configuration**:
- Rate: 5% of secondary sales
- Receiver: Game treasury address
- Smart contract enforces automatically

**Example**:
- NFT trades for 1000 STAR
- Royalty: 50 STAR → Game treasury
- Seller receives: 950 STAR

## Integration with STAR Token

**Discovery Flow**:
```
Player discovers planet
    ↓
Game calls PlanetNFT.mint()
    ↓
NFT created with metadata
    ↓
Game calls STARToken.mint()
    ↓
Rewards distributed to player
    ↓
Player wallet updated
    ↓
Passive income begins accruing
```

**Passive Income**:
```
1 NFT owned
    ↓
0.5 STAR accrued per hour
    ↓
Player claims via STARTokenWallet
    ↓
+0.5 STAR × hours elapsed added
    ↓
Set bonuses applied if applicable
```

## SEQ Standard Compliance

✅ Implements TON SEQ NFT standard:
- Unique sequential IDs
- Metadata URI per NFT
- Owner tracking and transfers
- Royalty support
- Burn capability

## Security

- Owner validation on all transfers
- Admin-only minting authorization
- Royalty enforcement
- Metadata immutability
- Burn prevention (permanent records)

## Deployment Addresses

**Testnet**:
- Collection: (to be deployed)
- Royalty destination: (game treasury)

**Mainnet**:
- Collection: (post-validation)
- Royalty destination: (game treasury)

## Gas Costs

- Mint: ~0.1 TON
- Transfer: ~0.05 TON
- Metadata query: ~0.01 TON
