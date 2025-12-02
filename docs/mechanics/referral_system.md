
# Referral System

## Overview
Tiered viral referral system incentivizing player growth.

## Rewards Structure

### For New Players
- 10 STAR Genesis Bonus (unchanged)
- Can use referral code at signup
- Receives own unique 8-character code

### For Referrers (Tiered)
```
1-3 friends:   5 STAR each
4-7 friends:   7 STAR each
8+ friends:    10 STAR each
MAX CAP:       50 STAR total
```

### Passive Income Bonus
- Referrer gets 10% of referee's passive income for 30 days
- Example: Friend owns 3 planets (1.5 STAR/day) → +0.15 STAR/day to referrer

## Implementation

### Smart Contract
**File**: `contracts-blueprint/contracts/ReferralFaucet.tact`

Key functions:
```tact
receive(msg: ClaimFaucet) {
  // Validates referral code
  // Applies tiered bonus
  // Tracks passive income split
}
```

### API Endpoints
```typescript
POST /api/player/claim-genesis-with-referral
GET /api/player/referral-stats/:wallet
GET /api/leaderboard/referrals
```

### Frontend Integration
**Component**: `client/src/components/ReferralInvite.tsx`  
**Store**: `client/src/lib/stores/useReferral.tsx`

## Anti-Abuse
- 50 STAR max cap
- No self-referral
- One code per new player
- Referrer must exist (claimed genesis)

**See:** [API Guide](../api/api_guide.md#referral-endpoints)
