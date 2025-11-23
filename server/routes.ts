import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Genesis Faucet: New players get 10 STAR to bootstrap
  app.post("/api/player/claim-genesis", async (req, res) => {
    try {
      const { walletAddress } = req.body;

      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      // Check if player already claimed genesis bonus
      const existingUser = await storage.getUserByWallet(walletAddress);

      if (existingUser?.genesisClaimedAt) {
        return res.status(409).json({
          error: "Genesis bonus already claimed",
          starBalance: existingUser.starBalance,
          claimedAt: existingUser.genesisClaimedAt,
        });
      }

      if (existingUser) {
        // Update existing user with genesis bonus
        await storage.updateUserStarBalance(existingUser.id, 10, new Date());
        return res.json({
          success: true,
          starBalance: 10,
          message: "Genesis bonus claimed! You got 10 STAR.",
        });
      }

      // Create new user with genesis bonus
      const newUser = await storage.createPlayerWithGenesis(
        walletAddress,
        10, // 10 STAR genesis bonus
        new Date()
      );

      res.json({
        success: true,
        userId: newUser.id,
        starBalance: 10,
        message: "Welcome! You got 10 STAR genesis bonus to mint Mercury.",
      });
    } catch (error) {
      console.error("Genesis claim error:", error);
      res.status(500).json({ error: "Failed to claim genesis bonus" });
    }
  });

  // Check genesis claim status
  app.get("/api/player/genesis-status/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWallet(walletAddress);

      res.json({
        claimed: !!user?.genesisClaimedAt,
        starBalance: user?.starBalance || 0,
        claimedAt: user?.genesisClaimedAt,
      });
    } catch (error) {
      console.error("Genesis status error:", error);
      res.status(500).json({ error: "Failed to check genesis status" });
    }
  });

  // Get player STAR balance
  app.get("/api/player/star-balance/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWallet(walletAddress);

      res.json({
        starBalance: user?.starBalance || 0,
        walletAddress,
      });
    } catch (error) {
      console.error("Star balance error:", error);
      res.status(500).json({ error: "Failed to get star balance" });
    }
  });

  // Update STAR balance (after minting planet)
  app.post("/api/player/update-star-balance", async (req, res) => {
    try {
      const { walletAddress, amount } = req.body;

      if (!walletAddress || typeof amount !== "number") {
        return res.status(400).json({ error: "Wallet address and amount required" });
      }

      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const newBalance = Math.max(0, (user.starBalance || 0) + amount);
      await storage.updateUserStarBalance(user.id, newBalance);

      res.json({
        success: true,
        starBalance: newBalance,
      });
    } catch (error) {
      console.error("Update balance error:", error);
      res.status(500).json({ error: "Failed to update star balance" });
    }
  });

  // Referral endpoints
  app.post("/api/player/claim-genesis-with-referral", async (req, res) => {
    try {
      const { walletAddress, referralCode } = req.body;

      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      // Check if already claimed
      let user = await storage.getUserByWallet(walletAddress);
      if (user?.genesisClaimedAt) {
        return res.status(409).json({
          error: "Genesis bonus already claimed",
          starBalance: user.starBalance,
        });
      }

      // Create player with 10 STAR
      if (!user) {
        user = await storage.createPlayerWithGenesis(walletAddress, 10, new Date());
      }

      // Generate referral code for this player
      const playerReferralCode = await storage.generateReferralCode(walletAddress);

      // Handle referral if code provided
      let bonusApplied = false;
      if (referralCode) {
        // Find referrer by code
        const entries = Array.from((storage as any).walletUsers?.entries?.() || []);
        for (const [, referrer] of entries) {
          if (referrer.referralCode === referralCode && referrer.walletAddress !== walletAddress) {
            // Calculate tiered bonus
            const count = referrer.referralCount || 0;
            let bonus = 5;
            if (count >= 4 && count < 7) bonus = 7;
            if (count >= 8) bonus = 10;

            // Cap at 50 STAR max
            const earned = referrer.referralBonusEarned || 0;
            if (earned + bonus > 50) {
              bonus = Math.max(0, 50 - earned);
            }

            if (bonus > 0) {
              await storage.recordReferral(referrer.walletAddress, walletAddress, bonus);
              bonusApplied = true;
            }
            break;
          }
        }
      }

      res.json({
        success: true,
        starBalance: 10,
        referralApplied: bonusApplied,
        referralCode: playerReferralCode,
        message: bonusApplied
          ? "Genesis claimed with referral bonus!"
          : `Welcome! Your referral code: ${playerReferralCode}`,
      });
    } catch (error) {
      console.error("Referral claim error:", error);
      res.status(500).json({ error: "Failed to process referral" });
    }
  });

  // Get referral stats
  app.get("/api/player/referral-stats/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const stats = await storage.getReferralStats(walletAddress);

      if (!stats) {
        return res.status(404).json({ error: "Player not found" });
      }

      res.json(stats);
    } catch (error) {
      console.error("Referral stats error:", error);
      res.status(500).json({ error: "Failed to get referral stats" });
    }
  });

  // Leaderboard
  app.get("/api/leaderboard/referrals", async (req, res) => {
    try {
      const entries = Array.from((storage as any).walletUsers?.entries?.() || []);
      const leaderboard = entries
        .map(([, user]) => ({
          wallet: user.walletAddress,
          code: user.referralCode,
          count: user.referralCount || 0,
          bonus: user.referralBonusEarned || 0,
        }))
        .filter((u) => u.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      res.json(leaderboard);
    } catch (error) {
      console.error("Leaderboard error:", error);
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
