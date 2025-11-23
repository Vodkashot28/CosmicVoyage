<<<<<<< HEAD
import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
=======
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
>>>>>>> 0b64c5e (Updates)
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
<<<<<<< HEAD
=======
  walletAddress: text("wallet_address"),
  starBalance: integer("star_balance").default(0),
  genesisClaimedAt: timestamp("genesis_claimed_at"),
  referralCode: text("referral_code"),
  referredByWallet: text("referred_by_wallet"),
  referralCount: integer("referral_count").default(0),
  referralBonusEarned: integer("referral_bonus_earned").default(0),
  lastReferralBonus: timestamp("last_referral_bonus"),
>>>>>>> 0b64c5e (Updates)
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
