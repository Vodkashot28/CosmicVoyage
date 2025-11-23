# Planet NFT Contract Deployment Guide

## Overview
The Planet NFT system manages SEQ-standard NFTs for the Solar System Explorer game. Each planet discovery results in a unique, tradeable NFT with passive income properties.

## Contract Files Generated

### 1. **contracts/PlanetNFT.tact**
Main NFT collection contract:
- Collection metadata management
- Minting authorization control
- NFT tracking and ownership
- Royalty configuration (5% to game treasury)
- Discovery order tracking
- Base URI management

### 2. **contracts/PlanetNFTItem.tact**
Individual NFT item contract:
- Planet metadata storage
- Rarity assignment based on discovery order
- Passive income property
- Glow color and visual traits
- Ownership transfer
- Dynamic attribute system

### 3. **client/src/lib/ton/nftContract.ts**
Frontend integration module:
- Mint message builders
- Transfer message creators
- Metadata JSON generators
- Set bonus calculators
- NFT validation helpers
- Rarity and display utilities

## NFT Properties

### Rarity Tiers
```
Legendary: 1st planet discovered (Mercury)
Epic:     2nd-3rd planets (Venus, Earth)
Rare:     4th-6th planets (Mars, Jupiter, Saturn)
Common:   7th+ planets (Uranus, Neptune)
```

### Glow Colors
```
Mercury, Venus, Jupiter, Saturn: Golden (#FFD700)
Earth, Uranus: Cyan (#00D9FF)
Mars: Orange (#FF8C00)
Neptune: Blue (#0099FF)
```

### Passive Income
- Base rate: 0.5 STAR per hour per NFT
- Increases with collection sets
- Claimable via STARTokenWallet

## Deployment Steps

### Phase 1: Compile Contracts

```bash
# Compile NFT contracts
npx blueprint build PlanetNFT
npx blueprint build PlanetNFTItem

# Generates contract code in build/ directory
```

### Phase 2: Deploy to Testnet

#### 1. Deploy Collection Contract
```bash
npx blueprint deploy PlanetNFT

# Configuration:
# - Owner: 0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01
# - Royalty Destination: (game treasury address)
# - Base URI: https://solarsystemexplorer.com/nft/
```

#### 2. Set Game as Minter
After deployment, authorize the game contract to mint:
```bash
# Call addMinter on collection
# Address: game contract address
```

#### 3. Update Environment Variables
```
VITE_PLANET_NFT_ADDRESS=0:YOUR_TESTNET_NFT_ADDRESS
VITE_NFT_DEPLOYER=0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01
```

### Phase 3: Integration with Game

#### 1. Planet Discovery Flow
```
Player clicks planet
→ Game validates discovery
→ Game calls PlanetNFT.mint()
→ NFT created with metadata
→ PlanetNFTItem contract deployed
→ STARToken.mint() distributes rewards
→ Toast: "You discovered Mercury! NFT minted!"
```

#### 2. NFT Metadata Generation
Each NFT includes:
- Planet name and image
- Rarity (legendary/epic/rare/common)
- Glow color (matching game visual)
- Discovery order
- Passive income property
- Collection set bonuses

#### 3. Set Bonuses

**Inner Planets (4 NFTs)**
```
Mercury + Venus + Earth + Mars
= +25 STAR daily passive income bonus
= 0.6M STAR/year additional
```

**Outer Planets (4 NFTs)**
```
Jupiter + Saturn + Uranus + Neptune
= +50 STAR daily passive income bonus
= 1.2M STAR/year additional
```

**All Planets (8 NFTs)**
```
All 8 planets collected
= +100 STAR daily passive income bonus
= 2.4M STAR/year additional
```

## Minting Process

### Requirements
- Player must discover planet sequentially
- Player wallet must be connected via TonConnect
- Sufficient TON for gas (≈0.1 TON per mint)
- STAR token reward must be available

### Message Structure
```javascript
{
  "to": collectionAddress,
  "amount": "100000000", // 0.1 TON for gas
  "body": {
    "op": 0x642bda77,    // mint operation
    "queryId": 0,
    "planet": "Mercury",
    "receiver": playerAddress,
    "amount": 1
  }
}
```

### Metadata Stored On-Chain
```json
{
  "name": "Planet Mercury #1",
  "description": "A discovered planet in Solar System Explorer",
  "image": "https://solarsystemexplorer.com/nft/mercury.png",
  "attributes": [
    {"trait_type": "Planet", "value": "Mercury"},
    {"trait_type": "Discovery Order", "value": "1"},
    {"trait_type": "Rarity", "value": "Legendary"},
    {"trait_type": "Glow Color", "value": "#FFD700"},
    {"trait_type": "Passive Income", "value": "Yes (+0.5 STAR/hour)"}
  ]
}
```

## NFT Transfer

Players can transfer NFTs to other wallets:

```javascript
{
  "to": collectionAddress,
  "amount": "50000000", // 0.05 TON for gas
  "body": {
    "op": 0x5fcc3d14,      // transfer operation
    "queryId": 0,
    "nftId": 1,
    "newOwner": recipientAddress,
    "responseDestination": senderAddress
  }
}
```

## Royalty Configuration

### Game Treasury Receives
- 5% of all secondary market sales
- Directed to: (game treasury address)
- Used for: Game development, liquidity pools, marketing

### Calculation Example
```
NFT sells for 1000 STAR
Game treasury receives: 50 STAR (5%)
Seller receives: 950 STAR
```

## SEQ Standard Compliance

The contract follows TON's SEQ NFT standard:
- ✅ Unique NFT IDs (sequential)
- ✅ Metadata URI per NFT
- ✅ Owner tracking
- ✅ Transfer capability
- ✅ Royalty support
- ✅ Burn capability

## Security Features

✅ **Implemented**:
- Owner-only minting authorization
- Royalty enforcement on transfers
- Metadata immutability
- Burn prevention (NFTs permanent)
- Gas-efficient storage

⚠️ **Recommendations**:
- Audit before mainnet
- Set metadata URI as immutable after validation
- Implement rate limiting on mints
- Monitor minting volume metrics

## Testing Checklist

- [ ] Mint first planet NFT
- [ ] Verify metadata displays correctly
- [ ] Transfer NFT to another wallet
- [ ] Check set bonus calculations
- [ ] Verify passive income accrual
- [ ] Test NFT marketplace integration
- [ ] Validate royalty transfers

## Marketplace Integration

NFTs are compatible with TON marketplaces:
- Getgems
- Fragment.com
- Custom in-game marketplace

Use standard TON NFT transfer messages for seamless trading.

## Metadata Updates

Update NFT metadata via:
```javascript
// SetMetadata message
{
  "op": 0x55e9d66f,
  "newMetadataURI": "https://solarsystemexplorer.com/nft/updated/"
}
```

## Future Enhancements

- [ ] Dynamic metadata with achievement badges
- [ ] NFT evolution/leveling system
- [ ] Trading post for NFT swaps
- [ ] Fusion mechanics (combine NFTs)
- [ ] Limited edition seasonal NFTs
