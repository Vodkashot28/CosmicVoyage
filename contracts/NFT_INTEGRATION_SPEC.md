# NFT Integration Specification

## Frontend Module: nftContract.ts

### Configuration
```typescript
PLANET_NFT_CONFIG {
  name: "Solar System Planets"
  symbol: "PLANET"
  collectionAddress: (from env)
  baseMetadataURI: "https://solarsystemexplorer.com/nft/"
  royaltyPercent: 5
}
```

### Key Functions

#### Metadata Generation
```typescript
generatePlanetNFTMetadata(planetName, discoveryOrder, planetData)
  → Generates complete metadata JSON with attributes
```

#### Mint Message Creation
```typescript
createNFTMintMessage(params: NFTMintParams)
  → Returns TonConnect transaction message
  → Gas: 0.1 TON
```

#### Transfer Message Creation
```typescript
createNFTTransferMessage(params: NFTTransferParams)
  → Returns TonConnect transaction message
  → Gas: 0.05 TON
```

#### Utility Functions
```typescript
getPlanetRarity(discoveryOrder)
  → Returns rarity tier

getGlowColorForPlanet(planetName)
  → Returns hex color code

calculateSetBonuses(ownedPlanets: string[])
  → Calculates earned bonuses for collections

formatNFTName(planetName, discoveryOrder)
  → Returns formatted display name with emoji
```

## Game Integration Points

### 1. Planet Discovery
```typescript
// In PlanetCard.tsx or Game logic
const mintNFT = async () => {
  const params = {
    planetName: planet.name,
    receiverAddress: walletAddress,
    discoveryOrder: discoveryIndex,
    glowColor: getGlowColorForPlanet(planet.name)
  };
  
  const message = createNFTMintMessage(params);
  await tonConnectUI.sendTransaction(message);
};
```

### 2. Metadata Display
```typescript
// In PlanetCard or NFT display component
const metadata = generatePlanetNFTMetadata(
  planetName,
  discoveryOrder,
  planetData
);

// Display metadata:
// - Rarity badge
// - Glow color indicator
// - Passive income info
// - Transfer ability
```

### 3. NFT Management UI
```typescript
// In Inventory/Collection page
const bonuses = calculateSetBonuses(ownedPlanets);

// Display:
// - NFT collection with rarity colors
// - Set completion progress
// - Bonus tracking
// - Transfer/marketplace integration
```

### 4. Passive Income Tracking
```typescript
// In game store or dashboard
const nftPassiveIncome = {
  baseRate: 0.5 * nftCount, // STAR per hour
  setBonus: calculateSetBonuses(ownedPlanets),
  totalDaily: calculateDaily(nftCount, bonuses)
};
```

## Data Flow

```
User connects wallet (TonConnect)
    ↓
Game queries user's NFTs
    ↓
Display inventory with metadata
    ↓
User discovers planet
    ↓
Game validates discovery
    ↓
createNFTMintMessage() builds transaction
    ↓
tonConnectUI.sendTransaction() executes
    ↓
PlanetNFT.mint() called on-chain
    ↓
NFT created with metadata
    ↓
Game backend records discovery
    ↓
STARToken.mint() called
    ↓
Rewards distributed
    ↓
Passive income begins accruing
    ↓
UI updates with new NFT
```

## Environment Variables

```
VITE_PLANET_NFT_ADDRESS=0:YOUR_TESTNET_NFT_COLLECTION
VITE_STAR_TOKEN_ADDRESS=0:YOUR_TESTNET_STAR_TOKEN
VITE_NFT_DEPLOYER=0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01
VITE_TONCENTER_API_KEY=your_testnet_api_key
```

## Error Handling

```typescript
try {
  const message = createNFTMintMessage(params);
  await tonConnectUI.sendTransaction(message);
} catch (error) {
  if (error.type === 'USER_REJECTED') {
    toast.error('Transaction rejected');
  } else if (error.type === 'INSUFFICIENT_BALANCE') {
    toast.error('Not enough TON for gas');
  } else {
    toast.error(`Minting failed: ${error.message}`);
  }
}
```

## Testing

- [ ] Mint first NFT (Legendary Mercury)
- [ ] Verify metadata displays correctly
- [ ] Claim passive income
- [ ] Transfer NFT to another wallet
- [ ] Verify set bonuses calculate correctly
- [ ] Test marketplace integration
- [ ] Validate royalty distribution
