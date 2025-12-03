import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // FIX: Changed return type from 'any' to 'User | null' for type safety
  getUserByWallet(walletAddress: string): Promise<User | null>;
  // FIX: Changed return type from 'any' to 'Partial<User>' as MemStorage only returns a subset
  createPlayerWithGenesis(walletAddress: string, starBalance: number, claimedAt: Date): Promise<Partial<User>>;
  updateUserStarBalance(userId: number, starBalance: number, genesisClaimedAt?: Date): Promise<void>;
  generateReferralCode(walletAddress: string): Promise<string>;
  recordReferral(referrerWallet: string, newPlayerWallet: string, bonusAmount: number): Promise<void>;
  // FIX: Changed return type from 'any' to an object matching the returned stats
  getReferralStats(walletAddress: string): Promise<{
    referralCode: string | null;
    referralCount: number;
    referralBonusEarned: number;
    lastReferralBonus: Date | null;
    referredByWallet: string | null;
  } | null>;
}

export class MemStorage implements IStorage {
  // FIX: Changed map value type to 'User' for consistency.
  private users: Map<number, User>;
  private walletUsers: Map<string, Partial<User>>;
  currentId: number;

  constructor() {
    this.users = new Map();
    // FIX: Using Partial<User> since the in-memory user objects created here are partial
    this.walletUsers = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === username,
    );
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

  // FIX: Updated return type to User | null
  async getUserByWallet(walletAddress: string): Promise<Partial<User> | null> {
    // Return Partial<User> as objects in walletUsers are partial
    return this.walletUsers.get(walletAddress) || null;
  }

  // FIX: Updated return type to Partial<User>
  async createPlayerWithGenesis(walletAddress: string, starBalance: number, claimedAt: Date): Promise<Partial<User>> {
    const userId = this.currentId++;
    const user: Partial<User> = {
      id: userId,
      walletAddress,
      starBalance,
      genesisClaimedAt: claimedAt,
      createdAt: new Date(),
      // Adding missing optional properties to match expectations for a player
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
    // FIX: Corrected update logic to use Map's ability to hold reference to object
    const entries = Array.from(this.walletUsers.entries());
    for (const [key, user] of entries) {
      if (user.id === userId) {
        // Since `user` is an object, updates here modify the object in the map by reference
        user.starBalance = starBalance;
        if (genesisClaimedAt) {
          user.genesisClaimedAt = genesisClaimedAt;
        }
        // No need to set it again in the map, as the object reference is the same.
        // this.walletUsers.set(key, user); // Redundant
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
    // The line below is redundant because we are updating the object by reference.
    // However, for consistency and future-proofing (e.g., if using a different Map implementation), we can keep it.
    this.walletUsers.set(walletAddress, user);
    return code;
  }

  async recordReferral(referrerWallet: string, newPlayerWallet: string, bonusAmount: number): Promise<void> {
    const referrer = this.walletUsers.get(referrerWallet);
    const newPlayer = this.walletUsers.get(newPlayerWallet);

    if (referrer && newPlayer) {
      // FIX: Use optional chaining/nullish coalescing for cleaner code
      referrer.referralCount = (referrer.referralCount ?? 0) + 1;
      referrer.referralBonusEarned = (referrer.referralBonusEarned ?? 0) + bonusAmount;
      newPlayer.referredByWallet = referrerWallet;
      referrer.lastReferralBonus = new Date();
      // Updates are by reference, but re-setting is harmless here.
      this.walletUsers.set(referrerWallet, referrer);
      this.walletUsers.set(newPlayerWallet, newPlayer);
    }
  }

  // FIX: Updated return type to match the expected object structure
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
      referralCode: user.referralCode || null,
      referralCount: user.referralCount || 0,
      referralBonusEarned: user.referralBonusEarned || 0,
      lastReferralBonus: user.lastReferralBonus || null,
      referredByWallet: user.referredByWallet || null,
    };
  }
}

// Use memory store for now, can be replaced with database later
export const storage = new MemStorage();
