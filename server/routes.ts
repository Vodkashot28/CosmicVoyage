import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import dotenv from "dotenv";

import emailRouter from "./routes/email";
import dailyLoginRouter from "./routes/dailyLogin";
import analyticsRouter from "./routes/analytics";
import { orbitalRouter } from "./routes/orbital";
import blockchainRouter from "./routes/blockchain";

dotenv.config({ path: ".env.local" });

export async function registerRoutes(app: Express): Promise<Server> {
  // ============ EMAIL VERIFICATION ROUTES ============
  app.use("/api/email", emailRouter);

  // ============ DAILY LOGIN ROUTES ============
  app.use("/api/daily-login", dailyLoginRouter);

  // ============ ANALYTICS ROUTES ============
  app.use("/api/analytics", analyticsRouter);

  // ============ ORBITAL ROUTES ============
  app.use("/api/orbital", orbitalRouter);

  // ============ BLOCKCHAIN ROUTES ============
  app.use("/api/blockchain", blockchainRouter);

  // ============ GENESIS FAUCET ROUTES ============
  app.post("/api/player/claim-genesis", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
      const { walletAddress } = req.body;
      if (!walletAddress) return res.status(400).json({ error: "Wallet address required" });

      const existingUser = await storage.getUserByWallet(walletAddress);
      if (existingUser?.genesisClaimedAt) {
        return res.status(409).json({
          error: "Genesis bonus already claimed",
          starBalance: existingUser.starBalance,
          claimedAt: existingUser.genesisClaimedAt,
        });
      }

      const newUser = await storage.createUser({
        walletAddress,
        starBalance: 10,
        genesisClaimedAt: new Date(),
      });

      return res.json(newUser);
    } catch (err) {
      console.error("Claim genesis error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/player/claim-genesis-with-referral", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
      const { walletAddress, referralCode } = req.body;
      if (!walletAddress) return res.status(400).json({ error: "Wallet address required" });

      const existingUser = await storage.getUserByWallet(walletAddress);
      if (existingUser?.genesisClaimedAt) {
        return res.status(409).json({ error: "Genesis bonus already claimed" });
      }

      if (referralCode) {
        await storage.recordReferral(walletAddress, referralCode);
      }

      const newUser = await storage.createUser({
        walletAddress,
        starBalance: 10,
        genesisClaimedAt: new Date(),
      });

      return res.json(newUser);
    } catch (err) {
      console.error("Claim genesis with referral error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============ PLAYER PROFILE & STAR TOKEN ROUTES ============
  app.get("/api/player/profile/:walletAddress", async (req, res) => {
    try {
      const user = await storage.getUserByWallet(req.params.walletAddress);
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.json(user);
    } catch (err) {
      console.error("Profile error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/player/star-balance/:walletAddress", async (req, res) => {
    try {
      const user = await storage.getUserByWallet(req.params.walletAddress);
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.json({ starBalance: user.starBalance });
    } catch (err) {
      console.error("Star balance error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/player/update-star-balance", async (req, res) => {
    try {
      const { walletAddress, amount } = req.body;
      const updated = await storage.updateStarBalance(walletAddress, amount);
      return res.json(updated);
    } catch (err) {
      console.error("Update star balance error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/player/burn-star", async (req, res) => {
    try {
      const { walletAddress, amount, utility } = req.body;
      const result = await storage.burnStar(walletAddress, amount, utility);
      return res.json(result);
    } catch (err) {
      console.error("Burn star error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============ REFERRAL ROUTES ============
  app.get("/api/player/referral-stats/:walletAddress", async (req, res) => {
    try {
      const stats = await storage.getReferralStats(req.params.walletAddress);
      return res.json(stats);
    } catch (err) {
      console.error("Referral stats error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============ DISCOVERY ROUTES ============
  app.post("/api/discovery/record", async (req, res) => {
    try {
      const { walletAddress, celestialObjectName, discoveryOrder, tokenReward } = req.body;
      const result = await storage.recordDiscovery(walletAddress, celestialObjectName, discoveryOrder, tokenReward);
      return res.json(result);
    } catch (err) {
      console.error("Record discovery error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/discovery/list/:walletAddress", async (req, res) => {
    try {
      const list = await storage.getDiscoveryList(req.params.walletAddress);
      return res.json(list);
    } catch (err) {
      console.error("Discovery list error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============ NFT ROUTES ============
  app.post("/api/nft/mint", async (req, res) => {
    try {
      const { walletAddress, celestialObjectName, discoveryOrder, tokenId } = req.body;
      const result = await storage.recordNFTMint(walletAddress, celestialObjectName, discoveryOrder, tokenId);
      return res.json(result);
    } catch (err) {
      console.error("NFT mint error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/nft/list/:walletAddress", async (req, res) => {
    try {
      const list = await storage.getNFTList(req.params.walletAddress);
      return res.json(list);
    } catch (err) {
      console.error("NFT list error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============ PASSIVE INCOME ROUTES ============
  app.post("/api/passive-income/claim", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      const result = await storage.claimPassiveIncome(walletAddress);
      return res.json(result);
    } catch (err) {
      console.error("Claim passive income error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/passive-income/stats/:walletAddress", async (req, res) => {
    try {
      const stats = await storage.getPassiveIncomeStats(req.params.walletAddress);
      return res.json(stats);
    } catch (err) {
      console.error("Passive income stats error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============ LEADERBOARD ROUTES ============
  app.get("/api/leaderboard/referrals", async (_req, res) => {
    try {
      const leaderboard = await storage.getReferralLeaderboard();
      return res.json(leaderboard);
    } catch (err) {
      console.error("Referral leaderboard error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/leaderboard/discoveries", async (_req, res) => {
    try {
      const leaderboard = await storage.getDiscoveryLeaderboard();
      return res.json(leaderboard);
    } catch (err) {
      console.error("Discovery leaderboard error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/leaderboard/collections", async (_req, res) => {
    try {
      const leaderboard = await storage.getCollectionLeaderboard();
      return res.json(leaderboard);
    } catch (err) {
      console.error("Collection leaderboard error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============ HEALTH CHECK ============
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Finalize and return HTTP server
  return createServer(app);
}	
