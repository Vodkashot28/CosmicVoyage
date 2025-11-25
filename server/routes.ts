import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getDb } from "./db";
import { users } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import analyticsRouter from "./routes/analytics";
import emailRouter from "./routes/email";
import dailyLoginRouter from "./routes/dailyLogin";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============ EMAIL VERIFICATION ROUTES ============
  app.use("/api/email", emailRouter);

  // ============ DAILY LOGIN ROUTES ============
  app.use("/api/daily-login", dailyLoginRouter);

  // ============ ANALYTICS ROUTES ============
  app.use("/api/analytics", analyticsRouter);

  // ============ GENESIS FAUCET ROUTES ============

  // Claim genesis bonus (10 STAR for new players)
  // Requires email verification + wallet address for anti-sybil protection
  app.post("/api/player/claim-genesis", async (req, res) => {
    try {
      const { walletAddress, email } = req.body;

      if (!walletAddress || !email) {
        return res.status(400).json({ error: "Wallet address and verified email required" });
      }

      // Verify email is actually verified
      const db = await getDb();
      if (db) {
        const verifiedEmail = await db
          .select()
          .from(users)
          .where(and(eq(users.email, email), eq(users.emailVerified, true)))
          .limit(1);

        if (verifiedEmail.length === 0) {
          return res.status(400).json({ error: "Email not verified" });
        }
      }

      const existingUser = await storage.getUserByWallet(walletAddress);

      if (existingUser?.genesisClaimedAt) {
        return res.status(409).json({
          error: "Genesis bonus already claimed",
          starBalance: existingUser.starBalance,
          claimedAt: existingUser.genesisClaimedAt,
        });
      }

      if (existingUser) {
        await storage.updateUserStarBalance(existingUser.id, existingUser.starBalance + 10);
        return res.json({
          success: true,
          starBalance: existingUser.starBalance + 10,
          message: "Genesis bonus claimed! You got 10 STAR.",
        });
      }

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

  // ============ PLAYER PROFILE ROUTES ============

  // Get player profile
  app.get("/api/player/profile/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWallet(walletAddress);

      if (!user) {
        return res.status(404).json({ error: "Player not found" });
      }

      res.json({
        walletAddress: user.walletAddress,
        starBalance: user.starBalance || 0,
        genesisClaimedAt: user.genesisClaimedAt,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ error: "Failed to get player profile" });
    }
  });

  // ============ STAR TOKEN ROUTES ============

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

  // Update STAR balance
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

  // Burn STAR tokens for utilities
  app.post("/api/player/burn-star", async (req, res) => {
    try {
      const { walletAddress, amount, utility } = req.body;

      if (!walletAddress || typeof amount !== "number" || !utility) {
        return res.status(400).json({ error: "Wallet address, amount, and utility required" });
      }

      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if ((user.starBalance || 0) < amount) {
        return res.status(400).json({ error: "Insufficient STAR balance" });
      }

      const newBalance = (user.starBalance || 0) - amount;
      await storage.updateUserStarBalance(user.id, newBalance);

      res.json({
        success: true,
        starBalance: newBalance,
        burnedAmount: amount,
        utility,
      });
    } catch (error) {
      console.error("Burn star error:", error);
      res.status(500).json({ error: "Failed to burn STAR" });
    }
  });

  // ============ DISCOVERY & PROGRESSION ROUTES ============

  // Record celestial object discovery
  app.post("/api/discovery/record", async (req, res) => {
    try {
      const { walletAddress, celestialObjectName, discoveryOrder, tokenReward } = req.body;

      if (!walletAddress || !celestialObjectName || !discoveryOrder) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Award tokens
      const newBalance = (user.starBalance || 0) + (tokenReward || 0);
      await storage.updateUserStarBalance(user.id, newBalance);

      res.json({
        success: true,
        discovered: celestialObjectName,
        rewardAwarded: tokenReward || 0,
        starBalance: newBalance,
      });
    } catch (error) {
      console.error("Discovery error:", error);
      res.status(500).json({ error: "Failed to record discovery" });
    }
  });

  // Get player discoveries
  app.get("/api/discovery/list/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWallet(walletAddress);

      if (!user) {
        return res.status(404).json({ error: "Player not found" });
      }

      // TODO: Fetch discovery data from database when storage is fully implemented
      res.json({
        walletAddress,
        discoveries: [],
        totalDiscovered: 0,
      });
    } catch (error) {
      console.error("Discovery list error:", error);
      res.status(500).json({ error: "Failed to get discoveries" });
    }
  });

  // ============ NFT ROUTES ============

  // Record NFT mint
  app.post("/api/nft/mint", async (req, res) => {
    try {
      const { walletAddress, celestialObjectName, discoveryOrder, tokenId } = req.body;

      if (!walletAddress || !celestialObjectName) {
        return res.status(400).json({ error: "Wallet address and object name required" });
      }

      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        success: true,
        walletAddress,
        nftMinted: celestialObjectName,
        tokenId,
      });
    } catch (error) {
      console.error("NFT mint error:", error);
      res.status(500).json({ error: "Failed to record NFT mint" });
    }
  });

  // Get player NFTs
  app.get("/api/nft/list/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWallet(walletAddress);

      if (!user) {
        return res.status(404).json({ error: "Player not found" });
      }

      res.json({
        walletAddress,
        nfts: [],
        totalNFTs: 0,
      });
    } catch (error) {
      console.error("NFT list error:", error);
      res.status(500).json({ error: "Failed to get NFTs" });
    }
  });

  // ============ PASSIVE INCOME ROUTES ============

  // Claim passive income from NFTs
  app.post("/api/passive-income/claim", async (req, res) => {
    try {
      const { walletAddress } = req.body;

      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // TODO: Calculate passive income from NFT holdings
      const passiveIncome = 0;

      if (passiveIncome > 0) {
        const newBalance = (user.starBalance || 0) + passiveIncome;
        await storage.updateUserStarBalance(user.id, newBalance);
      }

      res.json({
        success: true,
        passiveIncomeClaimed: passiveIncome,
        starBalance: (user.starBalance || 0) + passiveIncome,
      });
    } catch (error) {
      console.error("Passive income claim error:", error);
      res.status(500).json({ error: "Failed to claim passive income" });
    }
  });

  // Get passive income stats
  app.get("/api/passive-income/stats/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWallet(walletAddress);

      if (!user) {
        return res.status(404).json({ error: "Player not found" });
      }

      res.json({
        walletAddress,
        nftCount: 0,
        hourlyRate: 0,
        totalEarned: 0,
        lastClaimed: null,
      });
    } catch (error) {
      console.error("Passive income stats error:", error);
      res.status(500).json({ error: "Failed to get passive income stats" });
    }
  });

  // ============ REFERRAL ROUTES ============

  // Claim genesis with referral
  app.post("/api/player/claim-genesis-with-referral", async (req, res) => {
    try {
      const { walletAddress, referralCode } = req.body;

      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      let user = await storage.getUserByWallet(walletAddress);
      if (user?.genesisClaimedAt) {
        return res.status(409).json({
          error: "Genesis bonus already claimed",
          starBalance: user.starBalance,
        });
      }

      if (!user) {
        user = await storage.createPlayerWithGenesis(walletAddress, 10, new Date());
      }

      const playerReferralCode = await storage.generateReferralCode(walletAddress);

      let bonusApplied = false;
      if (referralCode) {
        const entries = Array.from((storage as any).walletUsers?.entries?.() || []) as [string, any][];
        for (const [, referrer] of entries) {
          if (referrer.referralCode === referralCode && referrer.walletAddress !== walletAddress) {
            const count = referrer.referralCount || 0;
            let bonus = 5;
            if (count >= 4 && count < 7) bonus = 7;
            if (count >= 8) bonus = 10;

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

  // ============ LEADERBOARD ROUTES ============

  // Get referral leaderboard
  app.get("/api/leaderboard/referrals", async (req, res) => {
    try {
      const entries = Array.from((storage as any).walletUsers?.entries?.() || []) as [string, any][];
      const leaderboard = entries
        .map(([, user]: [string, any]) => ({
          wallet: user.walletAddress,
          code: user.referralCode,
          count: user.referralCount || 0,
          bonus: user.referralBonusEarned || 0,
        }))
        .filter((u: any) => u.count > 0)
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 10);

      res.json(leaderboard);
    } catch (error) {
      console.error("Leaderboard error:", error);
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  // Get discovery leaderboard
  app.get("/api/leaderboard/discoveries", async (req, res) => {
    try {
      // TODO: Implement discovery leaderboard when storage is ready
      res.json([]);
    } catch (error) {
      console.error("Discovery leaderboard error:", error);
      res.status(500).json({ error: "Failed to get discovery leaderboard" });
    }
  });

  // Get collection leaderboard (by NFT count)
  app.get("/api/leaderboard/collections", async (req, res) => {
    try {
      // TODO: Implement collection leaderboard when storage is ready
      res.json([]);
    } catch (error) {
      console.error("Collection leaderboard error:", error);
      res.status(500).json({ error: "Failed to get collection leaderboard" });
    }
  });

  // ============ TONCONNECT MANIFEST ============
  
  // Dynamic TonConnect manifest that works on both localhost and production
  app.get("/tonconnect-manifest.json", (req, res) => {
    // Get the protocol and host from the request
    const protocol = req.protocol || "https";
    const host = req.get("host") || "solar-system.xyz";
    const appUrl = `${protocol}://${host}`;
    
    const manifest = {
      url: appUrl,
      name: "Cosmic Voyage",
      iconUrl: `${appUrl}/icons/sun.png`,
      termsOfUseUrl: `${appUrl}/terms.html`,
      privacyPolicyUrl: `${appUrl}/privacy.html`,
      manifestVersion: 2,
    };
    
    res.setHeader("Content-Type", "application/json");
    res.json(manifest);
  });

  // ============ HEALTH CHECK ============

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
