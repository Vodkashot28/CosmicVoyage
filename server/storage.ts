import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserByWallet(walletAddress: string): Promise<any>;
  createPlayerWithGenesis(walletAddress: string, starBalance: number, claimedAt: Date): Promise<any>;
  updateUserStarBalance(userId: number, starBalance: number, genesisClaimedAt?: Date): Promise<void>;
  generateReferralCode(walletAddress: string): Promise<string>;
  recordReferral(referrerWallet: string, newPlayerWallet: string, bonusAmount: number): Promise<void>;
  getReferralStats(walletAddress: string): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private walletUsers: Map<string, any>;
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
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      walletAddress: null,
      starBalance: 0,
      genesisClaimedAt: null,
      referralCode: null,
      referredByWallet: null,
      referralCount: 0,
      referralBonusEarned: 0,
      lastReferralBonus: null,
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByWallet(walletAddress: string): Promise<any> {
    return this.walletUsers.get(walletAddress) || null;
  }

  async createPlayerWithGenesis(walletAddress: string, starBalance: number, claimedAt: Date): Promise<any> {
    const userId = this.currentId++;
    const user = {
      id: userId,
      walletAddress,
      starBalance,
      genesisClaimedAt: claimedAt,
      createdAt: new Date(),
    };
    this.walletUsers.set(walletAddress, user);
    return user;
  }

  async updateUserStarBalance(userId: number, starBalance: number, genesisClaimedAt?: Date): Promise<void> {
    // Find user by ID in wallet map
    const entries = Array.from(this.walletUsers.entries());
    for (const [key, user] of entries) {
      if (user.id === userId) {
        user.starBalance = starBalance;
        if (genesisClaimedAt) {
          user.genesisClaimedAt = genesisClaimedAt;
        }
        this.walletUsers.set(key, user);
        return;
      }
    }
  }

  async generateReferralCode(walletAddress: string): Promise<string> {
    const user = this.walletUsers.get(walletAddress);
    if (!user) return "";

    // Generate 8-char code: first 4 of wallet + random 4
    const code = walletAddress.slice(2, 6).toUpperCase() +
      Math.random().toString(36).substring(2, 6).toUpperCase();
    user.referralCode = code;
    this.walletUsers.set(walletAddress, user);
    return code;
  }

  async recordReferral(referrerWallet: string, newPlayerWallet: string, bonusAmount: number): Promise<void> {
    const referrer = this.walletUsers.get(referrerWallet);
    const newPlayer = this.walletUsers.get(newPlayerWallet);

    if (referrer && newPlayer) {
      referrer.referralCount = (referrer.referralCount || 0) + 1;
      referrer.referralBonusEarned = (referrer.referralBonusEarned || 0) + bonusAmount;
      newPlayer.referredByWallet = referrerWallet;

      this.walletUsers.set(referrerWallet, referrer);
      this.walletUsers.set(newPlayerWallet, newPlayer);
    }
  }

  async getReferralStats(walletAddress: string): Promise<any> {
    const user = this.walletUsers.get(walletAddress);
    if (!user) return null;

    return {
      referralCode: user.referralCode,
      count: user.referralCount || 0,
      bonusEarned: user.referralBonusEarned || 0,
      maxBonus: 50,
      referredBy: user.referredByWallet,
    };
  }
}

export const storage = new MemStorage();
