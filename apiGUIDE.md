# API Integration Guide

This guide shows where to apply each GET/POST API from `server/routes.ts` in your frontend.

## Quick Integration Map

### 1. **useGameBalance Store** - STAR Token Management
**Location:** `client/src/lib/stores/useGameBalance.tsx`

**APIs to integrate:**
```typescript
// When player connects wallet
getStarBalance(walletAddress)          // GET /api/player/star-balance/:wallet
getPlayerProfile(walletAddress)        // GET /api/player/profile/:wallet

// When player earns STAR
updateStarBalance(wallet, amount)      // POST /api/player/update-star-balance

// When player burns STAR for utilities
burnStar(wallet, amount, utility)      // POST /api/player/burn-star
```

**Example usage in store:**
```typescript
export const useGameBalance = create<GameBalanceStore>()(
  persist(
    (set, get) => ({
      // ... existing code ...
      
      // New methods to add:
      loadBalance: async (walletAddress: string) => {
        try {
          const data = await getStarBalance(walletAddress);
          set({ starBalance: data.starBalance });
        } catch (error) {
          console.error("Failed to load balance:", error);
        }
      },

      burnStarForUtility: async (walletAddress: string, amount: number, utility: string) => {
        try {
          const data = await burnStar(walletAddress, amount, utility);
          set({ starBalance: data.starBalance });
        } catch (error) {
          console.error("Failed to burn star:", error);
        }
      },
    }),
    { name: 'game-balance-storage' }
  )
);
```

---

### 2. **useSolarSystem Store** - Discoveries & Progression
**Location:** `client/src/lib/stores/useSolarSystem.tsx`

**APIs to integrate:**
```typescript
// When player discovers a planet
recordDiscovery(wallet, planetName, order, reward)  // POST /api/discovery/record
getDiscoveryList(walletAddress)                     // GET /api/discovery/list/:wallet

// When player mints NFT
recordNFTMint(wallet, objectName, order, tokenId)  // POST /api/nft/mint
getNFTList(walletAddress)                          // GET /api/nft/list/:wallet
```

**Example usage in store:**
```typescript
discoverPlanet: async (planetName: string) => {
  const state = get();
  const wallet = state.walletAddress;
  const planet = planetsData.find(p => p.name === planetName);
  
  if (!planet || !wallet) return;

  // Record in backend
  await recordDiscovery(wallet, planetName, planet.discoveryOrder, planet.tokenReward);
  
  // Update local state
  set((state) => ({
    discoveredPlanets: [...state.discoveredPlanets, {
      planetName,
      timestamp: Date.now(),
      tokensEarned: planet.tokenReward,
    }],
    totalTokens: state.totalTokens + planet.tokenReward,
  }));
},

mintNFT: async (planetName: string) => {
  const state = get();
  const wallet = state.walletAddress;
  
  if (!wallet) return;

  // Record in backend
  await recordNFTMint(wallet, planetName, discoveryOrder, tokenId);
  
  // Update local state
  set((state) => ({
    ownedNFTs: [...state.ownedNFTs, planetName],
    mintedNFTCount: state.mintedNFTCount + 1,
  }));
},
```

---

### 3. **useReferral Store** - Referral System
**Location:** `client/src/lib/stores/useReferral.tsx`

**APIs to integrate:**
```typescript
// On initial join with referral code
claimGenesisWithReferral(wallet, referralCode)     // POST /api/player/claim-genesis-with-referral

// Get referral stats
getReferralStats(walletAddress)                    // GET /api/player/referral-stats/:wallet

// Fetch leaderboard
getReferralLeaderboard()                           // GET /api/leaderboard/referrals
```

**Example usage in store:**
```typescript
claimGenesisWithReferral: async (wallet: string, code?: string) => {
  try {
    const data = await claimGenesisWithReferral(wallet, code);
    set({
      referralCode: data.referralCode,
      referralStats: { count: 0, bonus: 0 },
    });
    return data;
  } catch (error) {
    console.error("Failed to claim with referral:", error);
  }
},

loadReferralStats: async (wallet: string) => {
  try {
    const stats = await getReferralStats(wallet);
    set({ referralStats: stats });
  } catch (error) {
    console.error("Failed to load referral stats:", error);
  }
},
```

---

### 4. **Genesis Claim** - On Player Onboarding
**Location:** Components that handle wallet connection (e.g., `App.tsx` or connection modal)

**APIs to integrate:**
```typescript
// First time player connection
claimGenesis(walletAddress)                        // POST /api/player/claim-genesis
getGenesisStatus(walletAddress)                    // GET /api/player/genesis-status/:wallet
```

**Example usage in component:**
```typescript
const handleWalletConnect = async (wallet: string) => {
  // Check if already claimed
  const status = await getGenesisStatus(wallet);
  
  if (!status.claimed) {
    // Claim genesis bonus
    const result = await claimGenesis(wallet);
    console.log("Genesis claimed:", result.starBalance, "STAR");
    
    // Update stores
    useGameBalance.setState({ starBalance: result.starBalance });
    useSolarSystem.setState({ walletAddress: wallet });
  } else {
    console.log("Genesis already claimed at:", status.claimedAt);
  }
};
```

---

### 5. **Passive Income** - NFT Rewards
**Location:** `client/src/lib/stores/useSolarSystem.tsx` or new `usePassiveIncome.tsx` store

**APIs to integrate:**
```typescript
// Claim accumulated passive income
claimPassiveIncome(walletAddress)                  // POST /api/passive-income/claim

// Get passive income stats
getPassiveIncomeStats(walletAddress)               // GET /api/passive-income/stats/:wallet
```

**Example usage:**
```typescript
claimPassiveIncome: async (wallet: string) => {
  try {
    const data = await claimPassiveIncome(wallet);
    
    // Update STAR balance
    useGameBalance.setState((state) => ({
      starBalance: state.starBalance + data.passiveIncomeClaimed,
    }));
    
    console.log("Passive income claimed:", data.passiveIncomeClaimed);
  } catch (error) {
    console.error("Failed to claim passive income:", error);
  }
},

loadPassiveIncomeStats: async (wallet: string) => {
  try {
    const stats = await getPassiveIncomeStats(wallet);
    set({ passiveIncomeStats: stats });
  } catch (error) {
    console.error("Failed to load passive income stats:", error);
  }
},
```

---

### 6. **Leaderboards** - Rankings Display
**Location:** Leaderboard components (new or existing)

**APIs to integrate:**
```typescript
getReferralLeaderboard()                           // GET /api/leaderboard/referrals
getDiscoveryLeaderboard()                          // GET /api/leaderboard/discoveries
getCollectionLeaderboard()                         // GET /api/leaderboard/collections
```

**Example usage in component:**
```typescript
export function ReferralLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function loadLeaderboard() {
      const data = await getReferralLeaderboard();
      setLeaderboard(data);
    }
    loadLeaderboard();
  }, []);

  return (
    <div>
      {leaderboard.map((entry, idx) => (
        <div key={idx}>
          {idx + 1}. {entry.wallet.slice(0, 6)}... - {entry.count} referrals - {entry.bonus} STAR
        </div>
      ))}
    </div>
  );
}
```

---

### 7. **Analytics & User Tracking** - Event Tracking & Stats (NEW!)
**Location:** All game stores + `AnalyticsDashboard.tsx`

**APIs to integrate:**
```typescript
// Track player events (automatic batching)
POST /api/analytics/events
// Payload: { events: AnalyticsEvent[] }
// Tracks: discoveries, mints, burns, passive income, achievements

// Get user profile stats (device ID or wallet)
GET /api/analytics/profile/:identifier?type=device|wallet

// Get global game statistics
GET /api/analytics/stats/global
// Returns: today's activity + all-time stats

// Get leaderboards
GET /api/analytics/leaderboard/:metric
// Metrics: star_earned | star_burned | discoveries | nfts
```

**Key Features:**
- **Device ID Tracking**: Automatically identifies users without wallet requirement
- **Event Queue**: Events batch automatically every 30 seconds or when queue reaches 10
- **Offline Support**: Events re-queue if network fails
- **No Wallet Dependency**: Works alongside wallet login for guest tracking

**Example usage in stores:**
```typescript
import { trackDiscovery, trackMint, trackPassiveIncome, trackDailyLogin, trackImmortalityTier } from "@/lib/analytics";

// When player discovers planet
discoverPlanet: (planetName: string) => {
  const state = get();
  trackDiscovery(planetName, reward, state.walletAddress);
  set(state => ({
    discoveredPlanets: [...state.discoveredPlanets, {...}]
  }));
},

// When player mints NFT
mintNFT: (planetName: string) => {
  trackMint(planetName, nftId, state.walletAddress);
},

// When player claims passive income
collectPassiveTokens: () => {
  trackPassiveIncome(amount, nftCount, state.walletAddress);
},

// When player logs in daily
claimDailyLogin: () => {
  trackDailyLogin(streak, state.walletAddress);
},

// When player achieves new tier
addImmortalityScore: (amount, burnType) => {
  trackImmortalityTier(tier, score, state.walletAddress);
},
```

**Example usage in components:**
```typescript
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

// Display analytics dashboard
export function AdminPanel() {
  return <AnalyticsDashboard />;
}
```

**Achievement System** (`shared/achievements.ts`):
```typescript
import { getUnlockedAchievements, getNextAchievements, getAchievementProgress } from "@/shared/achievements";

// Get all unlocked achievements for player
const unlockedAchievements = getUnlockedAchievements(playerStats);

// Get next 5 achievable milestones
const nextMilestones = getNextAchievements(playerStats).slice(0, 5);

// Show progress bar
const progress = getAchievementProgress(playerStats); // 0-100%
```

---

## Integration Checklist

- [ ] Import API functions in stores
- [ ] Add async methods to fetch data on mount
- [ ] Call APIs when critical events occur (discovery, mint, burn)
- [ ] Add error handling for all API calls
- [ ] Show loading states during API calls
- [ ] Sync backend state with local state
- [ ] Test with real backend responses

---

## Flow Example: New Player Journey

```typescript
// 1. Player connects wallet
const wallet = "0x...";

// 2. Check genesis status
const status = await getGenesisStatus(wallet);

// 3. If not claimed, claim genesis
if (!status.claimed) {
  const genesisResult = await claimGenesis(wallet);
  // Get 10 STAR
}

// 4. Player discovers Mercury
await recordDiscovery(wallet, "Mercury", 1, 1);
// Get 1 STAR more (total 11)

// 5. Player mints Mercury NFT
await recordNFTMint(wallet, "Mercury", 1, "tokenId123");

// 6. Player earns passive income
const passiveStats = await getPassiveIncomeStats(wallet);
// ~0.5 STAR per hour per NFT

// 7. Later, player claims passive income
await claimPassiveIncome(wallet);
// Receive accumulated STAR
```

---

## Error Handling Pattern

```typescript
async function apiCallWithErrorHandling<T>(
  apiCall: () => Promise<T>
): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error) {
    console.error("API call failed:", error);
    // Show toast notification to user
    toast.error("Failed to process request");
    return null;
  }
}

// Usage:
const balance = await apiCallWithErrorHandling(() => 
  getStarBalance(wallet)
);
```
