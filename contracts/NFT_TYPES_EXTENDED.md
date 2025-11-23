# Extended NFT Types Specification

## NFT Categories

### Category 1: Main Planets (8 NFTs)
**Type**: `planet`
**Structure**:
```json
{
  "type": "planet",
  "name": "Planet [Name]",
  "discoveryOrder": 1-8,
  "rarity": "common|rare|epic|legendary",
  "reward": 10-150 STAR,
  "passiveIncome": 0.5 STAR/hour,
  "transferable": true,
  "burnCost": null
}
```

**Rarity Logic**:
- #1 (Mercury): Common
- #2-3 (Venus, Earth): Rare
- #4-6 (Mars, Jupiter, Saturn): Epic
- #7-8 (Uranus, Neptune): Legendary

### Category 2: Dwarf Planets (7 NFTs)
**Type**: `dwarfPlanet`
**Structure**:
```json
{
  "type": "dwarfPlanet",
  "name": "Dwarf Planet [Name]",
  "reward": 180-220 STAR,
  "passiveIncome": 0.7-0.75 STAR/hour,
  "rarity": "legendary",
  "transferable": true,
  "collectionBonus": 200 STAR,
  "unlockOrder": "after Neptune"
}
```

**Objects**:
1. Pluto - 200 STAR, 0.75/hr
2. Ceres - 180 STAR, 0.75/hr
3. Eris - 220 STAR, 0.75/hr
4. Haumea - 210 STAR, 0.75/hr
5. Makemake - 215 STAR, 0.75/hr
6. Gonggong - 190 STAR, 0.7/hr
7. Orcus - 185 STAR, 0.7/hr

### Category 3: Asteroids (13 NFTs)
**Type**: `asteroid`
**Structure**:
```json
{
  "type": "asteroid",
  "name": "Asteroid [Name]",
  "reward": 5-35 STAR,
  "passiveIncome": 0.1-0.5 STAR/hour,
  "rarity": "common|uncommon|rare|epic|legendary",
  "transferable": true,
  "marketable": true,
  "discoveryMethod": "random"
}
```

**Rarity Distribution**:
- Common (2): 5 STAR, 0.1/hr
- Uncommon (3): 8 STAR, 0.15/hr
- Rare (3): 12 STAR, 0.2/hr
- Epic (3): 18 STAR, 0.3/hr
- Legendary (3): 35 STAR, 0.5/hr

## Smart Contract Messages

### Mint Planet NFT
```
{
  "op": 0x642bda77,
  "planet": "Mercury",
  "discoveryOrder": 1,
  "receiver": userAddress,
  "amount": 1,
  "rarity": "common"
}
```

### Mint Dwarf Planet NFT
```
{
  "op": 0x642bda77,
  "celestialBody": "Pluto",
  "type": "dwarfPlanet",
  "receiver": userAddress,
  "amount": 1,
  "rarity": "legendary"
}
```

### Mint Asteroid NFT
```
{
  "op": 0x642bda77,
  "asteroid": "Bennu",
  "type": "asteroid",
  "receiver": userAddress,
  "amount": 1,
  "rarity": "rare"
}
```

## Metadata JSON Examples

### Planet NFT Metadata
```json
{
  "name": "Planet Mercury #1",
  "description": "The first discovered planet in Solar System Explorer. Common rarity.",
  "image": "https://solarsystemexplorer.com/nft/mercury.png",
  "attributes": [
    {"trait_type": "Type", "value": "Planet"},
    {"trait_type": "Name", "value": "Mercury"},
    {"trait_type": "Discovery Order", "value": "1"},
    {"trait_type": "Rarity", "value": "Common"},
    {"trait_type": "Passive Income", "value": "0.5 STAR/hour"}
  ]
}
```

### Dwarf Planet Metadata
```json
{
  "name": "Dwarf Planet Pluto",
  "description": "A legendary dwarf planet in the Kuiper Belt. Earned high prestige.",
  "image": "https://solarsystemexplorer.com/nft/pluto.png",
  "attributes": [
    {"trait_type": "Type", "value": "Dwarf Planet"},
    {"trait_type": "Name", "value": "Pluto"},
    {"trait_type": "Rarity", "value": "Legendary"},
    {"trait_type": "Passive Income", "value": "0.75 STAR/hour"},
    {"trait_type": "Unlocked After", "value": "Neptune Discovery"}
  ]
}
```

### Asteroid Metadata
```json
{
  "name": "Asteroid Bennu",
  "description": "A carbonaceous asteroid studied by NASA. Rare collectible.",
  "image": "https://solarsystemexplorer.com/nft/bennu.png",
  "attributes": [
    {"trait_type": "Type", "value": "Asteroid"},
    {"trait_type": "Name", "value": "Bennu"},
    {"trait_type": "Rarity", "value": "Rare"},
    {"trait_type": "Passive Income", "value": "0.2 STAR/hour"},
    {"trait_type": "Discovery", "value": "Random Find"}
  ]
}
```

## Collection Set Bonuses

### Main Planets Set (8/8)
- **Bonus**: +100 STAR daily
- **Achievement**: "Solar System Explorer"
- **Requirement**: All 8 planets discovered

### Dwarf Planets Set (7/7)
- **Bonus**: +200 STAR one-time
- **Achievement**: "Dwarf Planet Master"
- **Requirement**: All 7 dwarf planets discovered

### Asteroids Set (13/13)
- **Bonus**: +150 STAR one-time
- **Achievement**: "Asteroid Collector"
- **Requirement**: All 13 asteroids discovered

### Cosmic Mastery (28/28)
- **Bonus**: +500 STAR prestige + legendary title
- **Achievement**: "Cosmic Curator"
- **Special Effect**: Legendary glow on profile

## Rarity Color Coding

```
Common (🟢):     #50C878 (Green)
Uncommon (🔵):   #4169E1 (Blue)
Rare (🟣):       #9370DB (Purple)
Epic (🟣):       #FF6B9D (Pink)
Legendary (🟡):  #FFD700 (Gold)
```

## Marketplace Integration

All NFTs support:
- ✅ Transfer to other wallets
- ✅ Market listing
- ✅ Royalty distribution (5% to game)
- ✅ Passive income while owned
- ✅ Set bonus calculation

## Database Schema Extension

```typescript
interface CelestialNFT {
  tokenId: number;
  type: "planet" | "dwarfPlanet" | "asteroid";
  name: string;
  owner: Address;
  rarity: string;
  discoveredAt: number;
  reward: number;
  passiveIncomeRate: number;
  transferable: boolean;
  royaltyPercent: number;
  metadata: JSON;
}
```
