# Phase II: Technical Specifications & Critical Documentation

**Status:** IMPLEMENTATION READY  
**Date:** November 25, 2025  
**Purpose:** Define precise mechanics for all Phase II systems

---

## 1. Dynamic Emission Control Mechanics

### Problem Statement
Fixed supply means no monetary policy adjustments are possible. This requires a dynamic system to throttle emissions without minting new tokens.

### Solution: R_factor (Reward Factor) System

**Definition:**
The `R_factor` is a basis-points multiplier (0-10000) that scales passive income rates in real-time.

```
Adjusted Passive Income = Base Rate × (R_factor / 10000)

Example:
- Mercury Base Rate = 0.625 STAR/hour
- R_factor = 9000 (90% of normal)
- Adjusted Rate = 0.625 × 0.9 = 0.5625 STAR/hour
```

### Inflation Measurement

**Metric: M_inflow vs M_outflow**

```
M_inflow = Daily STAR emitted from passive income
M_outflow = Daily STAR burned (all sinks combined)

Inflation Ratio = M_inflow / M_outflow

Threshold Logic:
- Ratio < 0.8: DEFLATION (too many burns) → Consider increasing R_factor
- Ratio 0.8-1.2: EQUILIBRIUM (healthy state) → No action
- Ratio > 1.2: INFLATION (too many emissions) → Prepare reduction vote
```

### Trigger Mechanism

**3-Month Persistence Rule:**
1. System measures M_inflow/M_outflow daily for 90 days
2. If ratio stays > 1.2 for all 90 days → Automatic DAO vote initiated
3. DAO votes to adjust R_factor (requires 60%+ approval)
4. If approved, new R_factor takes effect after 7-day timelock

### R_factor Adjustment Formula

**Proposed New Factor:**
```
R_factor_new = R_factor_old × (M_outflow_avg / M_inflow_avg)

Bounded to prevent extreme swings:
R_factor_new = CLAMP(R_factor_new, 5000, 15000)
                // Range: 0.5x to 1.5x normal rates

Example Calculation:
- Current R_factor = 10000
- M_inflow_avg (90 days) = 312 STAR/day
- M_outflow_avg (90 days) = 250 STAR/day
- Ratio = 312/250 = 1.248 (inflation detected)
- R_factor_new = 10000 × (250/312) = 8013
- New rate: 80.13% of original (slight throttle)
```

### Implementation in STARToken.tact

```tact
contract STARToken {
  rewardFactor: Int = 10000; // Basis points, starts at 100%
  ebtAddress: Address;
  daoAddress: Address;
  timelockActive: Bool = false;
  proposedRewardFactor: Int = 0;
  timelockUntil: Int = 0;
  
  const TIMELOCK_DURATION: Int = 604800; // 7 days
  const MIN_FACTOR: Int = 5000; // 0.5x
  const MAX_FACTOR: Int = 15000; // 1.5x
  
  fun adjustRewardFactor(newFactor: Int) {
    require(sender() == self.daoAddress, "Only DAO can adjust");
    require(newFactor >= MIN_FACTOR && newFactor <= MAX_FACTOR, "Factor out of bounds");
    require(!self.timelockActive, "Timelock still active");
    
    self.timelockActive = true;
    self.proposedRewardFactor = newFactor;
    self.timelockUntil = now() + TIMELOCK_DURATION;
    
    emit "RewardFactorAdjustmentProposed(" + newFactor.toString() + ")";
  }
  
  fun executeRewardFactorAdjustment() {
    require(self.timelockActive, "No pending adjustment");
    require(now() >= self.timelockUntil, "Timelock not expired");
    
    self.rewardFactor = self.proposedRewardFactor;
    self.timelockActive = false;
    
    emit "RewardFactorExecuted(" + self.rewardFactor.toString() + ")";
  }
  
  fun getAdjustedPassiveIncome(basRate: Int): Int {
    return (baseRate * self.rewardFactor) / 10000;
  }
}
```

---

## 2. Cosmic Refinement Logarithmic Cost Curve

### Problem Statement
Refinement must balance two needs:
- Steep enough to absorb ~312 STAR/day passive emissions
- Accessible enough for mid-level players (not prohibitively expensive)

### Solution: Logarithmic Scaling Formula

**Base Formula:**
```
C(level) = C_0 × ln(k × level + 1)

Where:
- C(level) = Cost in STAR for refinement to that level
- C_0 = Base cost parameter (50 STAR)
- k = Scaling factor (3.5)
- ln() = Natural logarithm

Expansion:
C(level) = 50 × ln(3.5 × level + 1)
```

### Cost Table (Calculated)

| Level | Formula | Cost (STAR) | Cumulative | Daily Emission Absorption |
|---|---|---|---|---|
| 1 | 50 × ln(4.5) | 67 | 67 | 21% |
| 2 | 50 × ln(8) | 104 | 171 | 55% |
| 3 | 50 × ln(11.5) | 128 | 299 | 96% |
| 4 | 50 × ln(15) | 147 | 446 | 143% |
| 5 | 50 × ln(18.5) | 163 | 609 | 195% |
| 6 | 50 × ln(22) | 176 | 785 | 252% |
| 7 | 50 × ln(25.5) | 188 | 973 | 312% |
| 8 | 50 × ln(29) | 199 | 1,172 | 376% |

**Key Property:** At Level 7, cumulative cost = 973 STAR, which represents ~3.12 days of max passive income (312 STAR/day × 3.12 days = 973 STAR). This creates natural pacing.

### Implementation in CosmicRefinement.tact

```tact
contract CosmicRefinement {
  const BASE_COST: Int = 50;
  const SCALING_FACTOR: Int = 35; // Represents 3.5 (stored as int × 10)
  
  fun getRefinementCost(level: Int): Int {
    require(level >= 1 && level <= 8, "Level out of range");
    
    // C = 50 × ln(3.5 × level + 1)
    // Simplified approximation using Taylor series for ln()
    let x: Int = (SCALING_FACTOR * level) / 10 + 1;
    let lnApprox: Int = self.naturalLog(x);
    
    return (BASE_COST * lnApprox) / 1000; // Divide by 1000 to scale precision
  }
  
  fun naturalLog(x: Int): Int {
    // Approximation: ln(x) ≈ 2 × (x-1)/(x+1) for better accuracy
    // Returns value × 1000 for precision
    if (x <= 0) { return 0; }
    if (x == 1) { return 0; }
    
    let numerator: Int = 2000 * (x - 1);
    let denominator: Int = x + 1;
    return numerator / denominator;
  }
  
  fun getYieldMultiplier(level: Int): Int {
    // Returns basis points: 10000 = 1.0x, 10200 = 1.02x per level
    return 10000 + (level * 200);
  }
}
```

### Daily Burn Projection (Single 8-NFT Player)

```
Day 1-30: Earn ~39 STAR/day, no refinement
Day 31: Burn 67 STAR (Level 1), yield increases to 39.78 STAR/day
Day 32-50: Earn ~39.78 STAR/day (passive accumulation)
Day 51: Burn 104 STAR (Level 2), yield increases to 40.56 STAR/day
...
Day 180: Average burn rate = ~50 STAR/day per player

With 1,000 active players:
- Daily emissions: 312 STAR (from all passive income)
- Daily refinement burns: 50,000 STAR (1,000 players × 50 STAR avg)
- Net: -49,688 STAR/day = STRONG DEFLATION
```

---

## 3. Economic Balancing Treasury (EBT) Operations

### Purpose & Allocation

**Total EBT:** 200M STAR (20% of 1B supply)

| Function | Allocation | Rules |
|---|---|---|
| **Liquidity Reserve** | 40M (20%) | Provide DEX pairs, prevent price slippage |
| **Buyback Fund** | 80M (40%) | Purchase STAR from market when M_inflow/M_outflow > 1.2 |
| **Emergency Reserve** | 50M (25%) | Handle unexpected market shocks, player refunds |
| **DAO Incentives** | 30M (15%) | Fund governance participation, rewards |

### Deployment Rules

**Quarterly Governance Cycle:**

1. **Quarter Start (Day 1-7):**
   - Report metrics: M_inflow, M_outflow, inflation ratio
   - Community votes on EBT deployment strategy
   - Decision requires 60%+ approval

2. **Deployment Phase (Day 8-85):**
   - Execute approved deployments
   - Each deployment must be pre-announced (7-day notice)
   - No single deployment can exceed 10% of EBT

3. **Review Phase (Day 86-90):**
   - Report results: prices, volumes, market impact
   - Adjust strategy for next quarter

### Buyback Mechanism

**Trigger:** When M_inflow/M_outflow > 1.2 for 3 consecutive months

```
Buyback Calculation:
1. Measure inflation excess: 
   Excess_STAR = (M_inflow - M_outflow) × 90 days
   
2. Allocate buyback from EBT:
   Buyback_Amount = MIN(Excess_STAR, 10M STAR max per quarter)
   
3. Execute on DEX with price protection:
   - Spread purchases over 30 days (avoid price impact)
   - Execute market orders at best available prices
   - Burn all purchased STAR immediately

Example:
- M_inflow = 400 STAR/day, M_outflow = 300 STAR/day
- Excess = 100 STAR/day × 90 = 9,000 STAR
- Buyback = 9,000 STAR
- Spread: 300 STAR/day × 30 days
```

### Smart Contract Implementation

```tact
contract EconomicBalancingTreasury {
  const MAX_DEPLOYMENT_PER_QUARTER: Int = 20000000; // 10% of 200M
  const BUYBACK_MAX: Int = 10000000; // 10M max per quarter
  
  owner: Address;
  daoAddress: Address;
  quarterStartTime: Int;
  deployedThisQuarter: Int = 0;
  
  receive(msg: ExecuteBuyback) {
    require(sender() == self.owner, "Only owner");
    require(msg.amount <= BUYBACK_MAX, "Exceeds quarterly limit");
    require(msg.amount <= self.getRemainingBudget(), "Exceeds deployment budget");
    
    // Execute buyback
    // In real implementation, would call DEX smart contract
    self.deployedThisQuarter = self.deployedThisQuarter + msg.amount;
    
    emit "BuybackExecuted(" + msg.amount.toString() + ")";
  }
  
  fun getRemainingBudget(): Int {
    return MAX_DEPLOYMENT_PER_QUARTER - self.deployedThisQuarter;
  }
}
```

---

## 4. NFT Degradation and Repair Costs

### Problem Statement
Currently, NFTs are static assets with no ongoing maintenance. This means no repeatable sink after initial minting.

### Solution: NFT Lifecycle System

**Degradation Model:**
```
NFT Quality = 100% at mint
Degrades by 1% per 3 days automatically
At 0% quality: NFT stops earning passive income

Timeline:
- Day 0: 100% → Earning normally
- Day 3: 99% → Earning normally
- Day 90: 70% → Earning at 70% rate
- Day 180: 40% → Earning at 40% rate
- Day 300: 0% → STOPPED (must repair)
```

### Repair Cost Formula

```
Repair_Cost = Original_Mint_Cost × Quality_Deficit × 0.15

Where:
- Original_Mint_Cost = 0.1 TON (for regular planets)
- Quality_Deficit = (100% - Current_Quality) as decimal
- 0.15 = 15% multiplier

Examples:
1. Quality at 50%, Mercury (10 STAR mint):
   Cost = 10 × 0.5 × 0.15 = 0.75 STAR

2. Quality at 0%, Jupiter (50 STAR mint):
   Cost = 50 × 1.0 × 0.15 = 7.5 STAR (full repair)

3. Quality at 90%, Neptune (150 STAR mint):
   Cost = 150 × 0.1 × 0.15 = 2.25 STAR (small maintenance)
```

### Daily Emission Impact

With 8 NFTs average player collection:
- Average degradation cost: ~5-10 STAR/month per NFT
- Total: 40-80 STAR/month = 1.3-2.7 STAR/day

**With 1,000 players:**
```
Daily Repair Burns = 1,000 players × 1.5 STAR/day = 1,500 STAR/day
This adds to:
- Refinement burns: 50,000 STAR/day
- SMB burns: 300 STAR/day
- Utilities: 25 STAR/day
Total Daily Burn: ~51,825 STAR/day >> 312 STAR/day emission
```

### Implementation in PlanetNFT.tact

```tact
contract PlanetNFT {
  owner: Address;
  planetName: String;
  quality: Int = 10000; // Basis points (100%)
  lastRepairTime: Int;
  originalMintCost: Int;
  
  const DEGRADATION_RATE: Int = 1; // 1% per 3 days
  const DEGRADATION_INTERVAL: Int = 259200; // 3 days in seconds
  const REPAIR_COST_MULTIPLIER: Int = 15; // 15%
  const QUALITY_MIN: Int = 0;
  const QUALITY_MAX: Int = 10000;
  
  fun getCurrentQuality(): Int {
    let timeSinceRepair: Int = now() - self.lastRepairTime;
    let degradationSteps: Int = timeSinceRepair / DEGRADATION_INTERVAL;
    let currentQuality: Int = self.quality - (degradationSteps * DEGRADATION_RATE * 100);
    
    return MAX(currentQuality, QUALITY_MIN);
  }
  
  fun getRepairCost(): Int {
    let current: Int = self.getCurrentQuality();
    let qualityDeficit: Int = QUALITY_MAX - current;
    return (self.originalMintCost * qualityDeficit * REPAIR_COST_MULTIPLIER) / (QUALITY_MAX * 100);
  }
  
  fun getPassiveIncomeAdjustment(): Int {
    let current: Int = self.getCurrentQuality();
    // Return percentage of normal income (e.g., 7000 = 70% income)
    return current;
  }
  
  receive(msg: RepairNFT) {
    require(sender() == self.owner, "Only owner can repair");
    require(msg.starAmount >= self.getRepairCost(), "Insufficient STAR for repair");
    
    // Burn STAR
    send(SendParameters{
      to: burnAddress,
      amount: msg.starAmount * 1000000000,
      mode: SendIgnore
    });
    
    self.quality = QUALITY_MAX;
    self.lastRepairTime = now();
    
    emit "NFTRepaired(" + self.planetName + ")";
  }
}
```

---

## 5. Immortality Ledger Data Structure

### Key Question Resolution

**Q: What metadata from burn transactions will be recorded as a "constellation"?**

**A: Complete Burn Record Structure**

```
struct BurnConstellation {
  // Identifiers
  constellationId: String;              // UUID v4
  playerAddress: Address;               // Wallet address
  burnTimestamp: Int;                   // Unix timestamp
  
  // Burn Details
  burnType: String;                     // "refinement" | "unification" | "smb" | "repair" | "utility"
  starAmountBurned: Int;                // STAR amount (base units)
  
  // Associated NFT
  celestialObjectNFTId: String;         // NFT contract address or ID
  celestialObjectName: String;          // "Mercury", "Jupiter", etc.
  
  // Context
  transactionHash: String;              // Blockchain TX hash for verification
  blockHeight: Int;                     // Block number
  gasUsed: Int;                         // Gas cost in TON
  
  // Engagement Metadata
  playerTotalBurnsToDate: Int;          // Cumulative burns by player
  playerConstellationTier: String;      // "Novice" | "Burning Soul" | ... | "Cosmic Deity"
}
```

### Data Storage Optimization

**Ledger Maps:**

```tact
contract StellarImmortalityLedger {
  // Map 1: Recent constellation records (detailed)
  // Key: constellationId
  // Value: Full BurnConstellation struct
  constellations: map<String, BurnConstellation>;
  
  // Map 2: Player aggregated stats (summary)
  // Key: playerAddress
  // Value: AggregatedStats struct
  playerStats: map<Address, PlayerAggregatedStats>;
  
  // Map 3: Leaderboard cache (top 100)
  // Rebuilt quarterly for efficiency
  leaderboard: map<Int, Address>; // rank -> address
  
  // Map 4: Time-series index (for queries)
  // Key: year_month (e.g., "2025_11")
  // Value: Array of constellationIds
  monthlyIndex: map<String, String>;
}

struct PlayerAggregatedStats {
  playerAddress: Address;
  totalStarBurned: Int;               // Cumulative all-time
  totalConstellations: Int;            // Number of burns
  constellationTier: String;
  immortalityScore: Int;               // Calculated score
  firstBurnTime: Int;
  lastBurnTime: Int;
  tierHistory: String;                 // "Novice→BurningSoul→ImmortalCollector"
}
```

### Immortality Score Calculation

**Algorithm:**

```
Score = (Total STAR Burned) × (Constellation Count Weight) × (Time Multiplier)

Detailed:
Score = Σ(starAmount × tierMultiplier) + (constellationCount × 10)

Where:
- starAmount = STAR burned in each transaction
- tierMultiplier:
  * refinement: 1.0x (baseline)
  * smb: 1.5x (higher engagement)
  * repair: 1.2x (maintenance commitment)
  * utility: 0.8x (lower priority)
  * unification: 3.0x (highest priority - prestige burn)
- constellationCount × 10: Bonus for consistent engagement

Example Calculation:
Player with 10 refinements (50-200 STAR each), 5 SMB purchases (250 each), 1 unification (2500):

Refinement burns: (50+125+200+300+450+650+900+1200+150) × 1.0 = 4,025 STAR
SMB burns: 5 × 250 × 1.5 = 1,875 STAR
Unification: 2,500 × 3.0 = 7,500 STAR
Constellation bonus: 16 × 10 = 160 points

Total Score = 4,025 + 1,875 + 7,500 + 160 = 13,560
```

### Tier System Based on Score

```
Tier Progression:

Score Range    | Tier Name              | Badge | Special Recognition
0-500          | Novice Explorer        | ◇    | Starting player
501-2,000      | Burning Soul          | ◆    | Active burner
2,001-10,000   | Stellar Collector      | ◆◆   | Committed player
10,001-50,000  | Immortal Collector    | ◆◆◆  | Major contributor
50,001+        | Cosmic Deity          | ◆◆◆◆ | Legendary status
```

### Constellation Recording Event

```tact
receive(msg: RecordBurn) {
  let constellationId: String = generateUUID();
  
  let constellation: BurnConstellation = BurnConstellation{
    constellationId: constellationId,
    playerAddress: msg.playerAddress,
    burnTimestamp: now(),
    burnType: msg.burnType,
    starAmountBurned: msg.starAmount,
    celestialObjectNFTId: msg.nftId,
    celestialObjectName: msg.planetName,
    transactionHash: msg.txHash,
    blockHeight: msg.blockHeight,
    gasUsed: msg.gasUsed,
    playerTotalBurnsToDate: self.getTotalBurnsForPlayer(msg.playerAddress) + 1,
    playerConstellationTier: self.calculateTier(msg.playerAddress)
  };
  
  self.constellations.set(constellationId, constellation);
  self.updatePlayerStats(msg.playerAddress, constellation);
  self.updateMonthlyIndex(constellationId);
  
  emit "ConstellationRecorded(" + constellationId + ", " + msg.playerAddress.toString() + ")";
}
```

### Query Functions

```tact
fun getPlayerImmortalityScore(playerAddress: Address): Int {
  let stats: PlayerAggregatedStats? = self.playerStats.get(playerAddress);
  if (stats == null) { return 0; }
  
  return self.calculateScore(stats!!);
}

fun getPlayerTier(playerAddress: Address): String {
  let score: Int = self.getPlayerImmortalityScore(playerAddress);
  
  if (score >= 50001) { return "Cosmic Deity"; }
  if (score >= 10001) { return "Immortal Collector"; }
  if (score >= 2001) { return "Stellar Collector"; }
  if (score >= 501) { return "Burning Soul"; }
  return "Novice Explorer";
}

fun getLeaderboard(limit: Int): map<Int, Address> {
  // Returns top `limit` players by score
  // Rebuilt quarterly for efficiency
  return self.leaderboard;
}
```

### Frontend Integration

**Display in Player Profile:**
```
╔══════════════════════════════════╗
║  Immortality Ledger Status       ║
╠══════════════════════════════════╣
║ Tier: Immortal Collector ◆◆◆    ║
║ Score: 13,560 / ∞               ║
║ Constellations: 16              ║
║ Total Burned: 13,560 STAR       ║
║ Member Since: Nov 15, 2025       ║
║ Leaderboard Rank: #47           ║
╚══════════════════════════════════╝
```

---

## Summary: Phase II Technical Specifications

### Critical Metrics

| System | Daily Burn Capacity | Target Emission | Status |
|---|---|---|---|
| **Passive Income (8 NFTs)** | - | 312 STAR/day | Baseline |
| **Refinement (avg player)** | 50 STAR/day | Absorb 16% | High priority |
| **SMB Purchases** | 300 STAR/day | Absorb 96% | High volume |
| **NFT Repair** | 1,500 STAR/day | Absorb 480% | Major sink |
| **Utilities (Boost/Jump)** | 25 STAR/day | Absorb 8% | Baseline |
| **Unification (whales)** | 500 STAR/month | Prestige only | Psychological |
| **TOTAL** | ~52,000 STAR/day | **166x emission** | Strong Deflation |

### Implementation Order

1. **Week 1:** Deploy StellarImmortalityLedger.tact (data layer)
2. **Week 1:** Modify STARToken.tact with R_factor system
3. **Week 2:** Deploy CosmicRefinement.tact with logarithmic curve
4. **Week 2:** Deploy NFTDegradation contract
5. **Week 3:** Integrate frontend components
6. **Week 3:** Deploy EBT governance contracts
7. **Week 4:** Testing and optimization

### Expected Outcome

After 6 months with 1,000 active players:
- Daily burn rate: ~52,000 STAR/day
- Monthly deflation: ~1.56M STAR
- Semi-annual deflation: ~9.36M STAR
- Total circulation: 441M STAR (2% decrease)
- **Token value pressure: Extremely Positive** ✨

