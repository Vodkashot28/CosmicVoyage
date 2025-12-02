
# API Integration Guide

## Quick Reference

### Balance Management
```typescript
GET  /api/player/star-balance/:wallet
POST /api/player/update-star-balance
POST /api/player/burn-star
```

### Discovery & NFTs
```typescript
POST /api/discovery/record
GET  /api/discovery/list/:wallet
POST /api/nft/mint
GET  /api/nft/list/:wallet
```

### Referrals
```typescript
POST /api/player/claim-genesis-with-referral
GET  /api/player/referral-stats/:wallet
GET  /api/leaderboard/referrals
```

### Passive Income
```typescript
POST /api/passive-income/claim
GET  /api/passive-income/stats/:wallet
```

## Integration by Store

### useGameBalance
```typescript
import { useGameBalance } from '@/lib/stores/useGameBalance';

// Load balance on wallet connect
const loadBalance = useGameBalance((state) => state.loadBalance);
useEffect(() => {
  if (walletAddress) loadBalance(walletAddress);
}, [walletAddress]);

// Burn STAR for utility
const burnStar = useGameBalance((state) => state.burnStarForUtility);
await burnStar(wallet, 50, 'cosmic-boost');
```

### useSolarSystem
```typescript
import { useSolarSystem } from '@/lib/stores/useSolarSystem';

// Discovery auto-syncs with backend
const discoverPlanet = useSolarSystem((state) => state.discoverPlanet);
await discoverPlanet('Mercury');

// NFT minting auto-syncs
const markNFTMinted = useSolarSystem((state) => state.markNFTMinted);
await markNFTMinted('Mercury', txHash);
```

### useReferral
```typescript
import { useReferral } from '@/lib/stores/useReferral';

// Claim genesis with referral
const claimGenesis = useReferral((state) => state.claimGenesisWithReferral);
await claimGenesis(wallet, referralCode);

// Load stats
const loadStats = useReferral((state) => state.loadReferralStats);
await loadStats(wallet);
```

## Error Handling
```typescript
try {
  await fetch('/api/endpoint', { ... });
} catch (error) {
  console.error('API call failed:', error);
  toast.error('Failed to process request');
}
```

**See:** [Error Handling Guide](error_handling.md)
