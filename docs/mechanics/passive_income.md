
# Passive Income System

## How It Works
NFT owners earn STAR tokens automatically every hour, even while offline.

## Rates

### Base Rates
| NFT Type | Rate | Daily | Monthly |
|----------|------|-------|---------|
| Planet | 0.5 STAR/hr | 12 | 360 |
| Dwarf Planet | 0.75 STAR/hr | 18 | 540 |
| Asteroid (Common) | 0.1 STAR/hr | 2.4 | 72 |
| Asteroid (Legendary) | 0.5 STAR/hr | 12 | 360 |

### Stacked Collection Example
```
4 Planets: 2 STAR/hr = 48 STAR/day = 1,440/month
2 Dwarfs: 1.5 STAR/hr = 36 STAR/day = 1,080/month
Total: 3.5 STAR/hr = 84 STAR/day = 2,520/month
```

## Set Bonuses
Permanent one-time bonuses for completing collections:
- Inner Planets (4): +25 STAR
- Outer Planets (4): +50 STAR
- All Planets (8): +100 STAR

## Refinement System (Phase II)
Burn STAR to upgrade passive income multipliers:

| Level | Cost | Yield Increase |
|-------|------|---------------|
| 1 | 50 STAR | +2% |
| 2 | 125 STAR | +4% |
| 3 | 200 STAR | +6% |
| 4 | 300 STAR | +8% |
| 5 | 450 STAR | +10% |
| 6 | 650 STAR | +12% |
| 7 | 900 STAR | +14% |
| 8 | 1200 STAR | +16% |

## Implementation

### Contract
**File**: `contracts-blueprint/contracts/STARToken.tact`

Passive income distributed via:
```tact
receive(msg: DistributePassiveIncome) {
  // Admin-only, scheduled hourly
  // Transfers accumulated tokens to NFT holder
}
```

### Claiming
Players claim via API:
```typescript
POST /api/passive-income/claim
```

**Store**: `useSolarSystem.tsx` tracks `lastPassiveTokenUpdate`

**See:** [Tokenomics](../strategy/tokenomics.md#passive-income-economics)
