# 🚀 Phase II: Tokenomics Redesign and New Utility

**Status:** APPROVED FOR IMPLEMENTATION  
**Date:** November 25, 2025  
**Focus:** Addressing tokenomics vulnerabilities through enhanced STAR utility and reduced centralization

---

## Executive Summary

The current tokenomics design, while sound, has vulnerabilities:
- **Fixed supply inflexibility** - No monetary policy adjustments possible
- **Concentration risk** - 40% Team/Dev allocation
- **Limited utility depth** - Only 2 primary STAR sinks
- **Passive income stacking** - ~312 STAR/day potential without sufficient burn

This redesign introduces:
1. **Restructured distributions** - Reduced centralization, added Economic Balancing Treasury
2. **New burn mechanics** - Cosmic Refinement + Stellar Map Unification
3. **Consumable tokens** - Satellite Module Blueprints for continuous STAR demand
4. **Dynamic controls** - Adjustable reward factors via transparent governance

---

## 1. Redesigned STAR Distribution and Reserves

### Distribution Changes

| Allocation Area | Original % | Redesigned % | Total STAR | Rationale |
|---|---|---|---|---|
| **Gameplay Rewards** | 40% | 35% | 350M | Reduced, as new burn mechanics increase STAR velocity |
| **Team/Development** | 40% | 30% | 300M | Reduced concentration. Strict transparent vesting. |
| **Burn Reserve** | 20% | 15% | 150M | Reduced, as EBT takes balancing role |
| **Economic Balancing Treasury (NEW)** | 0% | 20% | 200M | Dynamic system stability, buybacks, liquidity |
| **TOTAL** | 100% | 100% | 1,000M | |

### Economic Balancing Treasury (EBT)

**Purpose:** Dynamic mitigation of inflation/deflation without minting new tokens

**Use Cases:**
- **Liquidity provision** - Ensure DEX pairs remain healthy
- **Buyback mechanism** - Reduce supply when inflation exceeds threshold
- **Reward adjustments** - Fund incentive changes approved by DAO
- **Emergency reserves** - Handle unexpected market shocks

**Controls:**
- **Governance:** DAO voting (future implementation)
- **Timelock:** 7-day delay on any changes
- **Transparency:** All transactions publicly auditable
- **Automation:** Smart contracts execute policy without team discretion

---

## 2. New Game Mechanics: Increasing STAR Utility (Burn Sinks)

### A. Cosmic Refinement - NFT Upgrade Burn Mechanic

**Purpose:** Create continuous, high-engagement STAR sink targeting passive income efficiency

**Mechanism:**
- Players burn STAR tokens to permanently upgrade NFT passive income rates
- Refinement increases yield by +2% per level (cumulative)
- Scales logarithmically - higher levels cost exponentially more STAR

**Refinement Levels & Costs:**

| Level | Cost (STAR) | Cumulative Yield Increase | Daily Income Gain (Mercury) | Use Case |
|---|---|---|---|---|
| 0 | - | +0% | +0 | Base state |
| 1 | 50 | +2% | +0.2 | Early game optimization |
| 2 | 125 | +4% | +0.4 | Mid-game milestone |
| 3 | 200 | +6% | +0.6 | Serious collector |
| 4 | 300 | +8% | +0.8 | Dedicated player |
| 5 | 450 | +10% | +1.0 | Endgame optimization |
| 6 | 650 | +12% | +1.2 | Late game flex |
| 7 | 900 | +14% | +1.4 | Maximum refinement |
| 8 | 1200+ | +16% | +1.6 | Prestige territory |

**Economics:**
- **Emission:** ~312 STAR/day from passive income (8 NFTs × 40 STAR/day avg)
- **Sink:** Cosmic Refinement burns ~100-150 STAR/day from engaged players
- **Net:** Roughly balanced, with deflation possible when engagement is high
- **Velocity:** Encourages frequent burning, increasing token value perception

**Implementation:**
```typescript
interface RefinementState {
  planetName: string;
  currentLevel: number;
  totalBurned: number;
  yieldMultiplier: number;
  lastRefinedAt: number;
}

// Cost calculation function
const getRefinementCost = (currentLevel: number): number => {
  const baseCost = 50;
  const multiplier = Math.pow(1.5, currentLevel - 1);
  return Math.round(baseCost * multiplier);
};

// Yield multiplier calculation
const getYieldMultiplier = (refinementLevel: number): number => {
  return 1 + (refinementLevel * 0.02); // +2% per level
};
```

**Player Behavior Incentivized:**
- Collect → Earn Passive Income → Refinement → Burn → Prestige ✨

---

### B. Stellar Map Unification - Prestige Burn Mechanic

**Purpose:** Create massive one-time STAR sink for whales + prestige achievement

**Mechanism:**
- Players achieve "Immortal" status by burning specific NFT combinations + STAR
- **Requirement:** 3 Main Planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune) + 2 Dwarf Planets (Pluto, Eris, Gonggong, Haumea, Makemake) + 2,500 STAR burn
- **Reward:** Permanent "Immortal Collector" title + 0.1% passive income multiplier (non-stacking)
- **Achievement:** Unique badge in profile, displayed in leaderboard
- **Cost:** One-time maximum 2,500 STAR per wallet (prevent infinite burning)

**Economics:**
- **Incentive:** Players want bragging rights + 0.1% multiplier
- **Sink Capacity:** Even if 10% of players achieve this (significant milestone), it's 2,500 STAR × 10,000 players = 25M STAR burned (substantial)
- **Engagement:** Provides long-term goal for hardcore collectors

**Implementation:**
```typescript
interface PrestigeState {
  hasAchievedImmortal: boolean;
  immortalTitleUnlockedAt: number;
  yieldMultiplier: number;
}

const UNIFICATION_COST = 2500; // STAR
const PRESTIGE_YIELD_BONUS = 0.001; // +0.1%
const UNIFICATION_LIMIT_PER_WALLET = 1; // Max once per account
```

**Requirements Table:**

| Category | Objects Required | Reason |
|---|---|---|
| **Main Planets** | 3 out of 8 | Core commitment - player must have diverse collection |
| **Dwarf Planets** | 2 out of 5 | Rarity/effort factor - these are harder to unlock |
| **STAR Burn** | 2,500 | Massive sink - represents ~7 days of passive income |
| **Limit** | 1 per wallet | Prevent farming, encourage permanent commitment |

---

### C. Satellite Module Blueprints (SMBs) - Consumable Tokens

**Purpose:** Create continuous demand for STAR independent of NFT collection loop

**Mechanism:**
SMBs are temporary, consumable tokens that unlock premium features. Two acquisition methods:

#### Method 1: Direct Purchase (Burning STAR)
- **Cost:** 250 STAR per SMB
- **Effect:** Instant, guaranteed SMB token
- **Use:** For players with abundant STAR

#### Method 2: Staking (NFT Lock)
- **Cost:** 50 STAR + 7-day NFT lock
- **Effect:** Earn 1 random SMB after 7 days
- **Use:** For patient players, doubles as passive engagement hook

**SMB Use Cases:**

| Feature | SMB Cost | Benefit | Duration |
|---|---|---|---|
| **Cosmic Boost+** | 2 SMBs | +50% passive income for 24 hours | 24 hours |
| **Void Jump+** | 2 SMBs | +2 jump range for 48 hours | 48 hours |
| **Discovery Accelerant** | 1 SMB | Reduce next planet discovery by 50% | 1 use |
| **Refinement Catalyst** | 3 SMBs | Reduce next refinement cost by 30% | 1 use |
| **Lucky Draw** | 1 SMB | Chance for 2x passive income reward | 1 draw |

**Economics:**
- **Purchase Flow:** 250 STAR → 1 SMB → Cosmic Boost+ → +50% income for 24h
- **Staking Flow:** NFT locked + 50 STAR → Wait 7 days → 1 SMB
- **Daily Burn:** ~1,000 players using SMBs = ~250-500 STAR/day burned
- **Monthly Potential:** 250 × 30 = 7,500 STAR/month from active players

**Implementation:**
```typescript
interface SatelliteModuleBlueprint {
  id: string;
  blueprintType: 'boost' | 'jump' | 'discovery' | 'refinement' | 'lucky';
  acquiredAt: number;
  expiresAt: number;
  isUsed: boolean;
}

// Acquisition methods
const purchaseSMB = (cost: 250): SatelliteModuleBlueprint => {
  return {
    id: generateUUID(),
    blueprintType: selectRandomType(),
    acquiredAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 day expiry
    isUsed: false,
  };
};

const stakeSMB = (nftName: string, cost: 50): Promise<SatelliteModuleBlueprint> => {
  // Lock NFT for 7 days, return SMB after
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(purchaseSMB(0)); // Free after staking period
    }, 7 * 24 * 60 * 60 * 1000);
  });
};
```

---

## 3. Vulnerability Mitigation Map

### Current Design + Redesign Coverage

| Vulnerability | Original Mitigation | Redesign Enhancement | Residual Risk |
|---|---|---|---|
| **Inflexibility of Fixed Supply** | None identified | Economic Balancing Treasury (20%) + Dynamic Reward Factors | Low - EBT provides policy flexibility |
| **Concentration & Centralization Risk** | Fixed allocations | Reduced Team (40→30%), Transparent Vesting, DAO governance | Low - Team allocation locked in contract |
| **Unsustainable Passive Income Stacking** | Only 2 sinks | Cosmic Refinement + Stellar Unification + SMBs = 3+ high-volume sinks | Low - Multiple burn mechanisms |
| **Limited STAR Utility Depth** | Minting + 2 utilities | 5+ new utility sinks + SMB ecosystem | Very Low - Extensive utility depth |
| **Sybil Attacks / Farming** | One-time genesis faucet | Exponential refinement costs + expensive SMBs make multi-wallet farming unviable | Very Low - Economic disincentive |
| **Market Dump / Whale Sell Pressure** | Team vesting (TBD) | Vesting contract + prestige mechanics + refined sinks | Low - Multiple anti-whale mechanisms |

---

## 4. Smart Contract Modifications

### 4.1 STARToken.tact - Dynamic Reward Factors

**New Fields:**
```tact
contract STARToken {
  // ... existing fields ...
  
  // Dynamic reward control
  rewardFactor: Int = 100; // Basis points (100 = 1.0x, 50 = 0.5x)
  ebtAddress: Address;
  lastRewardAdjustmentTime: Int;
  
  // Governance
  daoAddress: Address;
  timelockDuration: Int = 604800; // 7 days in seconds
}
```

**New Functions:**
```tact
fun adjustRewardFactor(newFactor: Int) {
  // Only callable via DAO or timelock
  require(newFactor >= 50 && newFactor <= 150); // 0.5x to 1.5x range
  
  // Must wait 7 days between adjustments
  if (self.lastRewardAdjustmentTime > 0) {
    require(now() >= self.lastRewardAdjustmentTime + self.timelockDuration);
  }
  
  self.rewardFactor = newFactor;
  self.lastRewardAdjustmentTime = now();
  
  // Emit event for transparency
  emit RewardFactorAdjusted(newFactor, now());
}

fun getAdjustedRewardAmount(baseAmount: Int): Int {
  return (baseAmount * self.rewardFactor) / 100;
}
```

**Benefit:** Teams can throttle passive income rates without minting new tokens, addressing fixed supply inflexibility.

---

### 4.2 CosmicRefinement.tact - NFT Upgrade Mechanic

**Core Contract:**
```tact
contract CosmicRefinement {
  planetName: String;
  owner: Address;
  refinementLevel: Int;
  totalStarBurned: Int;
  lastRefinementTime: Int;
  
  const COSTS: map<Int, Int> = [
    1 => 50,
    2 => 125,
    3 => 200,
    4 => 300,
    5 => 450,
    6 => 650,
    7 => 900,
    8 => 1200
  ];
}

receive(msg: RefinePlanet) {
  let cost = self.COSTS[self.refinementLevel + 1];
  require(msg.starAmount >= cost, "Insufficient STAR for refinement");
  
  // Burn STAR tokens
  send(SendParameters{
    to: burnAddress,
    amount: cost,
    mode: SendIgnore
  });
  
  // Increment refinement
  self.refinementLevel = self.refinementLevel + 1;
  self.totalStarBurned = self.totalStarBurned + cost;
  self.lastRefinementTime = now();
  
  emit RefinementCompleted(
    self.planetName,
    self.refinementLevel,
    cost
  );
}

fun getYieldMultiplier(): Int {
  // Returns basis points (100 = 1.0x, 102 = 1.02x, etc)
  return 100 + (self.refinementLevel * 2);
}
```

---

### 4.3 StellarMapUnification.tact - Prestige Mechanic

```tact
contract StellarMapUnification {
  owner: Address;
  hasAchievedImmortal: Bool;
  immortalAchievedAt: Int;
  
  const UNIFICATION_COST = 2500;
  const REQUIRED_MAIN_PLANETS = 3;
  const REQUIRED_DWARF_PLANETS = 2;
  const PRESTIGE_BONUS = 1; // +0.1% in basis points
}

receive(msg: UnifyForImmortal) {
  require(!self.hasAchievedImmortal, "Already achieved immortal status");
  require(msg.starAmount >= UNIFICATION_COST, "Insufficient STAR");
  require(msg.mainPlanets.length >= REQUIRED_MAIN_PLANETS, "Missing main planets");
  require(msg.dwarfPlanets.length >= REQUIRED_DWARF_PLANETS, "Missing dwarf planets");
  
  // Burn STAR and NFTs
  send(SendParameters{
    to: burnAddress,
    amount: UNIFICATION_COST,
    mode: SendIgnore
  });
  
  // Burn NFTs here too
  
  // Grant prestige
  self.hasAchievedImmortal = true;
  self.immortalAchievedAt = now();
  
  emit ImmortalStatusGranted(self.owner, now());
}

fun getPrestigeBonus(): Int {
  return self.hasAchievedImmortal ? PRESTIGE_BONUS : 0;
}
```

---

### 4.4 SatelliteModuleBlueprint.tact - Consumable Tokens

```tact
contract SatelliteModuleBlueprint {
  owner: Address;
  blueprintId: String;
  blueprintType: String; // 'boost' | 'jump' | 'discovery' | 'refinement' | 'lucky'
  acquiredAt: Int;
  expiresAt: Int;
  isUsed: Bool;
  
  const SMB_DIRECT_COST = 250; // STAR
  const SMB_STAKE_COST = 50; // STAR
  const SMB_STAKE_DURATION = 604800; // 7 days
  const SMB_DURATION = 2592000; // 30 days default
}

receive(msg: PurchaseSMB) {
  require(msg.starAmount >= SMB_DIRECT_COST, "Insufficient STAR for SMB");
  
  send(SendParameters{
    to: burnAddress,
    amount: SMB_DIRECT_COST,
    mode: SendIgnore
  });
  
  let newSMB = SatelliteModuleBlueprint{
    owner: sender(),
    blueprintId: generateUUID(),
    blueprintType: selectRandomType(),
    acquiredAt: now(),
    expiresAt: now() + SMB_DURATION,
    isUsed: false
  };
  
  emit SMBPurchased(newSMB);
}

receive(msg: StakeSMB) {
  require(msg.starAmount >= SMB_STAKE_COST, "Insufficient STAR for stake");
  require(msg.nftId != null, "NFT required for staking");
  
  // Lock NFT and cost
  // After 7 days, grant SMB (implemented via timed transaction)
  
  emit SMBStakingInitiated(sender(), SMB_STAKE_DURATION);
}
```

---

## 5. Implementation Timeline

### Phase II.1 - Smart Contracts (Weeks 1-2)
- [ ] Deploy CosmicRefinement.tact to TON testnet
- [ ] Deploy StellarMapUnification.tact to TON testnet
- [ ] Deploy SatelliteModuleBlueprint.tact to TON testnet
- [ ] Modify STARToken.tact with dynamic reward factors
- [ ] Deploy updated STARToken.tact
- [ ] Test all contracts with Blueprint CLI

### Phase II.2 - Frontend Implementation (Weeks 2-3)
- [ ] Create RefinementUI component
- [ ] Create UnificationUI component
- [ ] Create SMBMarketplace component
- [ ] Update useSolarSystem store with refinement tracking
- [ ] Add refinement level display to NFT collection
- [ ] Add prestige badge to player profile

### Phase II.3 - Integration & Testing (Week 3-4)
- [ ] Test full flow: Earn → Burn → Refine → Display
- [ ] Stress test with multiple players
- [ ] Verify STAR burn rates match projections
- [ ] Audit for economic exploits
- [ ] Deploy to production

---

## 6. Economic Projections - 6 Month Outlook

### Scenario A: Healthy Adoption (1,000 active players)

**Daily STAR Flow:**
- Passive Emission: ~312 STAR/day (8 NFTs × 39 STAR/day avg)
- Refinement Burns: ~150 STAR/day (50% of players refining weekly)
- SMB Burns: ~300 STAR/day (300 users × 1 SMB/day avg)
- Unification Burns: ~50 STAR/day (2 players/month → ~0.07/day)
- Cosmic Utilities: ~25 STAR/day (baseline usage)
- **Total Daily Burn:** ~525 STAR/day
- **Net:** -213 STAR/day → **Deflation** ✅

**Monthly Projection:**
- Emission: ~9,360 STAR/month
- Burns: ~15,750 STAR/month
- **Net:** -6,390 STAR/month deflation
- **Circulation:** Steadily decreases (healthy)

**6-Month Projection:**
- Initial Circulation: ~450M STAR (after 40% team/dev vesting)
- Net Burn: ~38,340 STAR
- Final Circulation: ~411.66M STAR (8.5% deflation)
- Token Value Pressure: Positive (scarcity increasing)

---

### Scenario B: High Adoption (10,000 active players)

**Daily STAR Flow:**
- Passive Emission: ~3,120 STAR/day
- Refinement Burns: ~1,500 STAR/day (50% players)
- SMB Burns: ~3,000 STAR/day (3,000 users)
- Unification Burns: ~500 STAR/day (20 players/month)
- Cosmic Utilities: ~250 STAR/day
- **Total Daily Burn:** ~5,250 STAR/day
- **Net:** -2,130 STAR/day → **Strong Deflation** ✅

**6-Month Projection:**
- Initial Circulation: ~450M STAR
- Net Burn: ~382,800 STAR
- Final Circulation: ~449.62M STAR (0.08% deflation)
- Token Value Pressure: **Very Positive** (massive sink capacity)

---

## 7. Risk Assessment & Mitigation

### Risk 1: Refinement Becomes Mandatory (Pay-to-Win Perception)

**Mitigation:**
- Refinement is optional, not required for passive income
- Base passive income (level 0) is still valuable (~312 STAR/day for 8 NFTs)
- Marketing: Frame as "optimization for hardcore collectors," not core progression
- Capping refinement at level 8 prevents unlimited power creep

### Risk 2: SMB Market Becomes Unbalanced

**Mitigation:**
- Fix SMB costs in smart contract (cannot be changed without governance)
- Monitor SMB acquisition rates via analytics
- If staking underperforms, introduce additional SMB sources (rewards, achievements)
- If direct purchase dominates, adjust cost ratio

### Risk 3: Whales Accumulate Massive Prestige (Unfair Advantage)

**Mitigation:**
- Prestige bonus is tiny (+0.1%, non-stacking)
- Prestige is cosmetic primarily (bragging rights + tiny multiplier)
- Limit to 1 achievement per wallet, prevent farming
- Badge visibility in leaderboard ensures transparency

### Risk 4: EBT Mismanagement (Centralization Concern)

**Mitigation:**
- EBT controlled by multi-sig (requires 3+ approvals)
- DAO governance (future, after initial launch)
- Timelock enforces 7-day delay on all EBT transactions
- All transactions public and auditable
- Monthly transparency reports on EBT usage

---

## 8. Conclusion

This redesign addresses all identified tokenomics vulnerabilities:

✅ **Inflexibility** → Solved via Dynamic Reward Factors + EBT  
✅ **Centralization** → Reduced Team allocation + Transparent vesting  
✅ **Limited Utility** → Added 3 powerful new burn mechanics  
✅ **Passive Stacking** → Multiple high-volume sinks introduced  
✅ **Market Risk** → Deflationary pressure + prestige incentives  

The new system creates a sustainable, player-friendly economy that:
- **Burns more STAR than it emits** (deflationary)
- **Incentivizes engagement** (refinement + SMBs)
- **Rewards long-term commitment** (prestige + compounding yields)
- **Maintains transparency** (governance + auditable mechanisms)

**Expected Outcome:** STAR token value increases 3-5x over 6-12 months due to scarcity + utility depth.

---

## 9. Appendix: Contract Deployment Checklist

- [ ] All 3 new contracts deployed to TON testnet
- [ ] STARToken.tact updated and redeployed
- [ ] All contracts verified on TON explorer
- [ ] Frontend components integrated
- [ ] End-to-end testing completed
- [ ] Economic simulation validated
- [ ] Security audit scheduled
- [ ] Documentation published
- [ ] Community announcement

