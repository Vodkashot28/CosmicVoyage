import { users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserByWallet(walletAddress: string): Promise<Partial<User> | null>;
  createPlayerWithGenesis(walletAddress: string, starBalance: number, claimedAt: Date): Promise<Partial<User>>;
  updateUserStarBalance(userId: number, starBalance: number, genesisClaimedAt?: Date): Promise<void>;
  updateStarBalance(walletAddress: string, amount: number): Promise<Partial<User> | null>;
  burnStar(walletAddress: string, amount: number, utility: string): Promise<{ success: boolean; newBalance: number }>;
  generateReferralCode(walletAddress: string): Promise<string>;
  recordReferral(referrerWallet: string, newPlayerWallet: string, bonusAmount: number): Promise<void>;
  getReferralStats(walletAddress: string): Promise<{
    referralCode: string | null;
    referralCount: number;
    referralBonusEarned: number;
    lastReferralBonus: Date | null;
    referredByWallet: string | null;
  } | null>;
  recordDiscovery(walletAddress: string, celestialObjectName: string, discoveryOrder: number, tokenReward: number): Promise<{ success: boolean }>;
  getDiscoveryList(walletAddress: string): Promise<{ celestialObjectName: string; discoveryOrder: number; discoveredAt: Date }[]>;
  recordNFTMint(walletAddress: string, celestialObjectName: string, discoveryOrder: number, tokenId: string): Promise<{ success: boolean }>;
  getNFTList(walletAddress: string): Promise<{ tokenId: string; celestialObjectName: string; mintedAt: Date }[]>;
  claimPassiveIncome(walletAddress: string): Promise<{ incomeEarned: number; newBalance: number }>;
  getPassiveIncomeStats(walletAddress: string): Promise<{ totalClaimed: number; lastClaim: Date | null } | null>;
  getReferralLeaderboard(): Promise<{ walletAddress: string; referralCount: number }[]>;
  getDiscoveryLeaderboard(): Promise<{ walletAddress: string; totalDiscovered: number }[]>;
  getCollectionLeaderboard(): Promise<{ walletAddress: string; nftCount: number }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private walletUsers: Map<string, Partial<User>>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.walletUsers = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      emailVerified: false,
      walletAddress: null,
      starBalance: 0,
      genesisClaimedAt: null,
      referralCode: null,
      referredByWallet: null,
      referralCount: 0,
      referralBonusEarned: 0,
      lastReferralBonus: null,
      totalPassiveIncomeClaimed: 0,
      lastPassiveIncomeClaim: null,
      orbitalOffsets: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByWallet(walletAddress: string): Promise<Partial<User> | null> {
    return this.walletUsers.get(walletAddress) || null;
  }

  async createPlayerWithGenesis(walletAddress: string, starBalance: number, claimedAt: Date): Promise<Partial<User>> {
    const userId = this.currentId++;
    const user: Partial<User> = {
      id: userId,
      walletAddress,
      starBalance,
      genesisClaimedAt: claimedAt,
      createdAt: new Date(),
      referralCode: null,
      referredByWallet: null,
      referralCount: 0,
      referralBonusEarned: 0,
      lastReferralBonus: null,
    };
    this.walletUsers.set(walletAddress, user);
    return user;
  }

  async updateUserStarBalance(userId: number, starBalance: number, genesisClaimedAt?: Date): Promise<void> {
    for (const [, user] of Array.from(this.walletUsers.entries())) {
      if (user.id === userId) {
        user.starBalance = starBalance;
        if (genesisClaimedAt) user.genesisClaimedAt = genesisClaimedAt;
        return;
      }
    }
  }

  async updateStarBalance(walletAddress: string, amount: number): Promise<Partial<User> | null> {
    const user = this.walletUsers.get(walletAddress);
    if (!user) return null;
    user.starBalance = (user.starBalance ?? 0) + amount;
    return user;
  }

  async burnStar(walletAddress: string, amount: number, _utility: string): Promise<{ success: boolean; newBalance: number }> {
    const user = this.walletUsers.get(walletAddress);
    if (!user || (user.starBalance ?? 0) < amount) return { success: false, newBalance: user?.starBalance ?? 0 };
    user.starBalance = (user.starBalance ?? 0) - amount;
    return { success: true, newBalance: user.starBalance };
  }

  async generateReferralCode(walletAddress: string): Promise<string> {
    const user = this.walletUsers.get(walletAddress);
    if (!user) return "";
    const code = walletAddress.slice(2, 6).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    user.referralCode = code;
    this.walletUsers.set(walletAddress, user);
    return code;
  }

  async recordReferral(referrerWallet: string, newPlayerWallet: string, bonusAmount: number): Promise<void> {
    const referrer  = this.walletUsers.get(referrerWallet);
    const newPlayer = this.walletUsers.get(newPlayerWallet);
    if (referrer && newPlayer) {
      referrer.referralCount        = (referrer.referralCount ?? 0) + 1;
      referrer.referralBonusEarned  = (referrer.referralBonusEarned ?? 0) + bonusAmount;
      referrer.lastReferralBonus    = new Date();
      newPlayer.referredByWallet    = referrerWallet;
      this.walletUsers.set(referrerWallet, referrer);
      this.walletUsers.set(newPlayerWallet, newPlayer);
    }
  }

  async getReferralStats(walletAddress: string): Promise<{
    referralCode: string | null;
    referralCount: number;
    referralBonusEarned: number;
    lastReferralBonus: Date | null;
    referredByWallet: string | null;
  } | null> {
    const user = this.walletUsers.get(walletAddress);
    if (!user) return null;
    return {
      referralCode:        user.referralCode        ?? null,
      referralCount:       user.referralCount        ?? 0,
      referralBonusEarned: user.referralBonusEarned  ?? 0,
      lastReferralBonus:   user.lastReferralBonus    ?? null,
      referredByWallet:    user.referredByWallet     ?? null,
    };
  }

  // ── Stub implementations for game-feature endpoints ──────────────────────
  async recordDiscovery(_walletAddress: string, _celestialObjectName: string, _discoveryOrder: number, _tokenReward: number): Promise<{ success: boolean }> {
    return { success: true };
  }

  async getDiscoveryList(_walletAddress: string): Promise<{ celestialObjectName: string; discoveryOrder: number; discoveredAt: Date }[]> {
    return [];
  }

  async recordNFTMint(_walletAddress: string, _celestialObjectName: string, _discoveryOrder: number, _tokenId: string): Promise<{ success: boolean }> {
    return { success: true };
  }

  async getNFTList(_walletAddress: string): Promise<{ tokenId: string; celestialObjectName: string; mintedAt: Date }[]> {
    return [];
  }

  async claimPassiveIncome(walletAddress: string): Promise<{ incomeEarned: number; newBalance: number }> {
    const user = this.walletUsers.get(walletAddress);
    return { incomeEarned: 0, newBalance: user?.starBalance ?? 0 };
  }

  async getPassiveIncomeStats(_walletAddress: string): Promise<{ totalClaimed: number; lastClaim: Date | null } | null> {
    return { totalClaimed: 0, lastClaim: null };
  }

  async getReferralLeaderboard(): Promise<{ walletAddress: string; referralCount: number }[]> {
    return Array.from(this.walletUsers.values())
      .filter((u) => u.walletAddress)
      .sort((a, b) => (b.referralCount ?? 0) - (a.referralCount ?? 0))
      .slice(0, 20)
      .map((u) => ({ walletAddress: u.walletAddress!, referralCount: u.referralCount ?? 0 }));
  }

  async getDiscoveryLeaderboard(): Promise<{ walletAddress: string; totalDiscovered: number }[]> {
    return [];
  }

  async getCollectionLeaderboard(): Promise<{ walletAddress: string; nftCount: number }[]> {
    return [];
  }
}

export const storage = new MemStorage();
