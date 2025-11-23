# Enhanced Referral System Specification

## Overview

The referral system incentivizes viral growth by rewarding both new players and those who invite them. It includes tiered bonuses, referral code tracking, leaderboards, and 30-day passive income bonuses.

## Features

### 1. Referral Codes
- Each player gets unique 8-character code (e.g., "0FA1K2PQ")
- Shareable via link: `solarsystemexplorer.com?ref=0FA1K2PQ`
- One-time use per new player
- Can only be used if referrer has already claimed genesis

### 2. Tiered Rewards

**New Player Bonus:**
- Gets 10 STAR genesis gift (same as regular)
- No reduction for using referral code

**Referrer Bonuses (Tiered by referral count):**
```
1-3 friends:   5 STAR per referral
4-7 friends:   7 STAR per referral  
8+ friends:    10 STAR per referral
Cap:           50 STAR maximum
```

**Passive Income Bonus (NEW!):**
- Referrer gets 10% of referee's passive income for first 30 days
- Example: Friend owns 3 planets (1.5 STAR/day) → Referrer gets +0.15 STAR/day
- Stacks with other bonuses
- Expires after 30 days (referee becomes independent)

### 3. Database Schema

```typescript
users table additions:
- referralCode: string (unique)
- referredByWallet: string (who invited this player)
- referralCount: number (how many friends referred)
- referralBonusEarned: number (total bonus in STAR)
- lastReferralBonus: timestamp (last bonus claim)
```

### 4. API Endpoints

#### `POST /api/player/claim-genesis-with-referral`
```json
{
  "walletAddress": "0:abc123...",
  "referralCode": "0FA1K2PQ"  // optional
}
```

Response:
```json
{
  "success": true,
  "starBalance": 10,
  "referralApplied": true,
  "bonusMessage": "You were invited! Use code YOURCODE to get bonuses."
}
```

#### `GET /api/player/referral-stats/:walletAddress`
```json
{
  "referralCode": "0FA1K2PQ",
  "count": 5,
  "bonusEarned": 30,
  "maxBonus": 50,
  "referredBy": "0:xyz789..."
}
```

#### `POST /api/player/claim-referral-bonus`
```json
{
  "walletAddress": "0:abc123..."
}
```

Response:
```json
{
  "success": true,
  "bonusAmount": 12,
  "newBalance": 22,
  "message": "Claimed referral bonuses from your 3 active referrals!"
}
```

#### `GET /api/leaderboard/referrals`
Returns top 10 referrers with their stats

### 5. Frontend Integration

**ReferralInvite Component:**
- Shows referral code in large, copyable format
- Display referral stats (friends, bonus earned)
- Share buttons (copy link, Twitter)
- Visual reward tier guide
- Shows passive income bonus info

**GameOnboarding Enhanced:**
- Check for ?ref= query parameter
- Display: "You were invited by [wallet]! Get 10 STAR bonus!"
- Apply referral code automatically

**Leaderboard Component:**
- Weekly referral rankings
- Top referrers get special badge/glow
- Monthly champions get achievement title

### 6. Security

✅ **One Referral Per New Player** - Can only use referral code once
✅ **No Self-Referral** - Can't refer yourself
✅ **Referrer Must Exist** - Can only use active referral code from existing player
✅ **No Chaining Abuse** - 50 STAR cap prevents infinite loops
✅ **Passive Income Capped** - 10% bonus expires after 30 days

### 7. Economics Impact

**For New Players:**
- Same 10 STAR genesis gift
- Feels "special" if invited (social proof)
- Incentivized to invite friends back

**For Referrers:**
- Additional 5-10 STAR per invite
- Long-term passive income boost
- Scales to 50 STAR max (roughly 10 friends)
- Total earning potential: 10 (genesis) + 50 (referral) = 60 STAR from bonuses

**For Game:**
- Viral loop incentive
- Player retention (friends playing together)
- Network effects (friend groups cluster)
- Cheap acquisition vs traditional marketing

**Example Economics:**
```
Month 1: 1,000 new players
- 200 use referral codes (20% adoption)
- Avg 4 referrals per referrer = 5 STAR average bonus
- Total cost: 200 × 5 = 1,000 STAR
- vs. typical CAC of $1-5 = 1,000 STAR is cheap

Plus: 200 more players who stayed because friends invited them
Plus: 40 STAR/month passive bonus distributed to active referrers
```

### 8. Leaderboard System

**Weekly Rankings:**
1. Most new referrals (last 7 days)
2. Highest referral bonus earned
3. Most active referrals (friends still playing)

**Rewards:**
- Top 3: Special badge on profile
- Top 1: Weekly "🏆 Cosmic Ambassador" title
- Seasonal: Top 10 get exclusive NFT variant

### 9. Implementation Status

✅ Smart contract (Tact) - Ready
✅ API endpoints - Ready
✅ Database schema - Ready  
✅ Frontend component - Ready
✅ Zustand store - Ready

📋 Next steps:
- Add referral code generation logic
- Implement leaderboard query
- Add 30-day passive income tracking
- Integration testing

---

**Total Impact**: Referral system can drive 20-30% of new player acquisition while keeping per-user acquisition cost to <10 STAR.
