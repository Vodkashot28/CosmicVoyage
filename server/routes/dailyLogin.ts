import { Router } from "express";
import type { Request, Response } from "express";
import { getDb } from "../db";
import { users, dailyLoginRewards } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Daily rewards: Day 1-6 = 1 STAR, Day 7 = 5 STAR bonus
function getRewardForDay(day: number): number {
  if (day % 7 === 0) return 5; // Bonus on day 7
  return 1; // Regular reward days
}

/**
 * POST /daily-login/claim
 * Claim daily login reward
 */
router.post("/claim", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address required" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress))
      .limit(1);

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user[0].id;

    // Get or create daily login record
    let loginRecord = await db
      .select()
      .from(dailyLoginRewards)
      .where(eq(dailyLoginRewards.userId, userId))
      .limit(1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (loginRecord.length === 0) {
      // First login ever
      const newRecord = await db
        .insert(dailyLoginRewards)
        .values({
          userId,
          walletAddress,
          streak: 1,
          totalLoginDays: 1,
        })
        .returning();

      const reward = getRewardForDay(1);
      const newBalance = (user[0].starBalance || 0) + reward;

      await db
        .update(users)
        .set({ starBalance: newBalance })
        .where(eq(users.id, userId));

      return res.json({
        success: true,
        reward,
        streak: 1,
        message: "🎉 Day 1: +1 STAR! Keep it up for a 7-day streak bonus!",
      });
    }

    const loginRecordData = loginRecord[0];

    // Check if already claimed today
    const lastLogin = new Date(loginRecordData.lastLoginDate!);
    lastLogin.setHours(0, 0, 0, 0);

    if (lastLogin.getTime() === today.getTime()) {
      return res.status(409).json({
        error: "Already claimed today",
        streak: loginRecordData.streak,
        nextClaimTime: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      });
    }

    // Calculate new streak
    const yesterdayTime = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const isConsecutive =
      lastLogin.getTime() === yesterdayTime.getTime() ||
      lastLogin.getTime() === today.getTime();

    const newStreak = isConsecutive ? loginRecordData.streak! + 1 : 1;
    const newTotalDays = loginRecordData.totalLoginDays! + 1;
    const reward = getRewardForDay(newStreak);

    // Update login record
    await db
      .update(dailyLoginRewards)
      .set({
        streak: newStreak,
        lastLoginDate: today,
        totalLoginDays: newTotalDays,
        totalRewardsClaimed: (loginRecordData.totalRewardsClaimed || 0) + reward,
        lastClaimedAt: new Date(),
      })
      .where(eq(dailyLoginRewards.id, loginRecordData.id));

    // Update user balance
    const newBalance = (user[0].starBalance || 0) + reward;
    await db
      .update(users)
      .set({ starBalance: newBalance })
      .where(eq(users.id, userId));

    const streakMessage =
      newStreak === 7
        ? "🌟 7-DAY STREAK! +5 STAR BONUS! 🌟"
        : `Day ${newStreak}: +${reward} STAR`;

    return res.json({
      success: true,
      reward,
      streak: newStreak,
      totalClaimed: (loginRecordData.totalRewardsClaimed || 0) + reward,
      message: streakMessage,
    });
  } catch (error) {
    console.error("Daily login error:", error);
    res.status(500).json({ error: "Failed to claim daily reward" });
  }
});

/**
 * GET /daily-login/status/:walletAddress
 * Get daily login status
 */
router.get("/status/:walletAddress", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { walletAddress } = req.params;

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress))
      .limit(1);

    if (user.length === 0) {
      return res.json({
        hasClaimed: false,
        streak: 0,
        totalClaimed: 0,
      });
    }

    const loginRecord = await db
      .select()
      .from(dailyLoginRewards)
      .where(eq(dailyLoginRewards.userId, user[0].id))
      .limit(1);

    if (loginRecord.length === 0) {
      return res.json({
        hasClaimed: false,
        streak: 0,
        totalClaimed: 0,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastLogin = new Date(loginRecord[0].lastLoginDate!);
    lastLogin.setHours(0, 0, 0, 0);
    const claimedToday = lastLogin.getTime() === today.getTime();

    res.json({
      hasClaimed: claimedToday,
      streak: loginRecord[0].streak,
      totalClaimed: loginRecord[0].totalRewardsClaimed,
      totalLoginDays: loginRecord[0].totalLoginDays,
    });
  } catch (error) {
    console.error("Daily login status error:", error);
    res.status(500).json({ error: "Failed to get status" });
  }
});

export default router;
