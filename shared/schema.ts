import { pgTable, text, serial, integer, boolean, timestamp, varchar, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";


export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").unique(),
  starBalance: integer("star_balance").default(0),
  genesisClaimedAt: timestamp("genesis_claimed_at"),
  referralCode: text("referral_code").unique(),
  referredByWallet: text("referred_by_wallet"),
  referralCount: integer("referral_count").default(0),
  referralBonusEarned: integer("referral_bonus_earned").default(0),
  lastReferralBonus: timestamp("last_referral_bonus"),
  totalPassiveIncomeClaimed: integer("total_passive_income_claimed").default(0),
  lastPassiveIncomeClaim: timestamp("last_passive_income_claim"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ============ DISCOVERIES TABLE ============
// Track which celestial objects each player has discovered
export const discoveries = pgTable("discoveries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  celestialObjectName: text("celestial_object_name").notNull(),
  discoveryOrder: integer("discovery_order").notNull(), // Sequential order of discovery (1-28)
  objectType: varchar("object_type", { length: 20 }).notNull(), // "planet" | "dwarf_planet" | "asteroid"
  tokenRewardAwarded: integer("token_reward_awarded").notNull(),
  discoveredAt: timestamp("discovered_at").defaultNow(),
});

export const insertDiscoverySchema = createInsertSchema(discoveries);
export type InsertDiscovery = z.infer<typeof insertDiscoverySchema>;
export type Discovery = typeof discoveries.$inferSelect;

// ============ NFTS TABLE ============
// Track player-owned NFTs (minted celestial objects)
export const nfts = pgTable("nfts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  tokenId: text("token_id").unique().notNull(), // Unique NFT token ID
  celestialObjectName: text("celestial_object_name").notNull(),
  objectType: varchar("object_type", { length: 20 }).notNull(), // "planet" | "dwarf_planet" | "asteroid"
  discoveryOrder: integer("discovery_order").notNull(),
  rarity: varchar("rarity", { length: 20 }).notNull(), // "common" | "rare" | "epic" | "legendary"
  glowColor: text("glow_color"),
  passiveIncomeRate: doublePrecision("passive_income_rate").default(0.5), // STAR per hour
  mintedAt: timestamp("minted_at").defaultNow(),
  lastPassiveIncomeClaim: timestamp("last_passive_income_claim"),
});

export const insertNFTSchema = createInsertSchema(nfts);
export type InsertNFT = z.infer<typeof insertNFTSchema>;
export type NFT = typeof nfts.$inferSelect;

// ============ PASSIVE INCOME TABLE ============
// Track passive income claims from mi NFT holdings
export const passiveIncomeRecords = pgTable("passive_income_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  nftCount: integer("nft_count").notNull(), // Number of NFTs owned at time of claim
  hoursElapsed: doublePrecision("hours_elapsed").notNull(),
  incomeEarned: integer("income_earned").notNull(), // STAR tokens earned
  claimedAt: timestamp("claimed_at").defaultNow(),
});

export const insertPassiveIncomeSchema = createInsertSchema(passiveIncomeRecords);
export type InsertPassiveIncomeRecord = z.infer<typeof insertPassiveIncomeSchema>;
export type PassiveIncomeRecord = typeof passiveIncomeRecords.$inferSelect;

// ============ BURN HISTORY TABLE ============
// Track STAR token burns for cosmic utilities
export const burnHistory = pgTable("burn_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  utility: varchar("utility", { length: 50 }).notNull(), // e.g., "cosmic-boost", "void-jump", etc.
  amountBurned: integer("amount_burned").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  description: text("description"),
  burnedAt: timestamp("burned_at").defaultNow(),
});

export const insertBurnHistorySchema = createInsertSchema(burnHistory);
export type InsertBurnHistory = z.infer<typeof insertBurnHistorySchema>;
export type BurnHistory = typeof burnHistory.$inferSelect;

// ============ REFERRAL TRANSACTIONS TABLE ============
// Detailed tracking of referral rewards
export const referralTransactions = pgTable("referral_transactions", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull(),
  referrerWallet: text("referrer_wallet").notNull(),
  referredId: integer("referred_id").notNull(),
  referredWallet: text("referred_wallet").notNull(),
  bonusAwarded: integer("bonus_awarded").notNull(),
  tier: integer("tier").notNull(), // 1-3 based on referral count
  referralCode: text("referral_code"),
  claimedAt: timestamp("claimed_at").defaultNow(),
});

export const insertReferralTransactionSchema = createInsertSchema(referralTransactions);
export type InsertReferralTransaction = z.infer<typeof insertReferralTransactionSchema>;
export type ReferralTransaction = typeof referralTransactions.$inferSelect;

// ============ SET BONUSES TABLE ============
// Track collection achievements and set bonuses
export const setBonuses = pgTable("set_bonuses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  bonusName: varchar("bonus_name", { length: 100 }).notNull(), // "Inner Planets Master", "Solar System Explorer", etc.
  description: text("description"),
  nftCount: integer("nft_count").notNull(), // Number of NFTs required for bonus
  dailyBonus: integer("daily_bonus").notNull(), // STAR per day bonus
  achievedAt: timestamp("achieved_at").defaultNow(),
  active: boolean("active").default(true),
});

export const insertSetBonusSchema = createInsertSchema(setBonuses);
export type InsertSetBonus = z.infer<typeof insertSetBonusSchema>;
export type SetBonus = typeof setBonuses.$inferSelect;

// ============ GAME PROGRESS TABLE ============
// Track player game progression state
export const gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  walletAddress: text("wallet_address").notNull().unique(),
  totalDiscovered: integer("total_discovered").default(0),
  totalNFTsMinted: integer("total_nfts_minted").default(0),
  totalStarEarned: integer("total_star_earned").default(0),
  totalStarBurned: integer("total_star_burned").default(0),
  currentPhase: varchar("current_phase", { length: 20 }).default("phase1"), // phase1, phase2, phase3
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGameProgressSchema = createInsertSchema(gameProgress);
export type InsertGameProgress = z.infer<typeof insertGameProgressSchema>;
export type GameProgress = typeof gameProgress.$inferSelect;

// ============ DAILY STATS TABLE ============
// Aggregate daily statistics for analytics
export const dailyStats = pgTable("daily_stats", {
  id: serial("id").primaryKey(),
  date: timestamp("date").defaultNow(),
  totalNewPlayers: integer("total_new_players").default(0),
  totalDiscoveries: integer("total_discoveries").default(0),
  totalNFTsMinted: integer("total_nfts_minted").default(0),
  totalStarDistributed: integer("total_star_distributed").default(0),
  totalStarBurned: integer("total_star_burned").default(0),
  totalPassiveIncomeClaimed: integer("total_passive_income_claimed").default(0),
});

export const insertDailyStatsSchema = createInsertSchema(dailyStats);
export type InsertDailyStats = z.infer<typeof insertDailyStatsSchema>;
export type DailyStats = typeof dailyStats.$inferSelect;
=======
>>>>>>> c297bfc4245e6f3d5429419ed9a7c68f69074ccc
