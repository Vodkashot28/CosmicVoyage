import { Router } from "express";
import type { Request, Response } from "express";
import { getDb } from "../db";
import { analyticsEvents, users, discoveries, nfts } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Track analytics events
router.post("/events", async (req, res) => {
  try {
    const { events } = req.body;

    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: "Invalid events data" });
    }

    const db = await getDb();

    // Store events in database if available
    if (db) {
      try {
        for (const event of events) {
          await db.insert(analyticsEvents).values({
            deviceId: event.deviceId,
            walletAddress: event.walletAddress || null,
            eventType: event.eventType,
            eventData: JSON.stringify(event.data),
            createdAt: new Date(),
          });
        }
        console.log(`✅ [DB] Stored ${events.length} analytics events`);
      } catch (dbError) {
        console.error("❌ Database storage error:", dbError);
        // Fallback: log to console
        events.forEach((event: any) => {
          console.log(
            `[ANALYTICS] ${event.eventType} - Device: ${event.deviceId} - Wallet: ${event.walletAddress || "N/A"}`
          );
        });
      }
    } else {
      // Fallback: log to console
      events.forEach((event: any) => {
        console.log(
          `[ANALYTICS] ${event.eventType} - Device: ${event.deviceId} - Wallet: ${event.walletAddress || "N/A"}`
        );
      });
    }

    res.json({ success: true, eventsProcessed: events.length });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to process events" });
  }
});

// Get player stats (discoveries, NFTs, earnings)
router.get("/player-stats/:walletAddress", async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    const db = await getDb();

    if (!db) {
      return res.json({
        walletAddress,
        discoveredCount: 0,
        nftCount: 0,
        totalEarned: 0,
        passiveIncomePerDay: 0,
      });
    }

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress))
      .limit(1);

    if (user.length === 0) {
      return res.json({
        walletAddress,
        discoveredCount: 0,
        nftCount: 0,
        totalEarned: 0,
        passiveIncomePerDay: 0,
      });
    }

    // Get discoveries count
    const discoveryList = await db
      .select()
      .from(discoveries)
      .where(eq(discoveries.walletAddress, walletAddress));

    // Get NFTs count
    const nftList = await db
      .select()
      .from(nfts)
      .where(eq(nfts.walletAddress, walletAddress));

    const passiveIncomePerDay = nftList.length * 0.5 * 24; // 0.5 STAR per hour per NFT

    return res.json({
      walletAddress,
      discoveredCount: discoveryList.length,
      nftCount: nftList.length,
      totalEarned: discoveryList.reduce(
        (sum, d) => sum + (d.tokenRewardAwarded || 0),
        0
      ),
      passiveIncomePerDay,
    });
  } catch (error) {
    console.error("Player stats error:", error);
    res.status(500).json({ error: "Failed to fetch player stats" });
  }
});

// Get user profile (by device ID or wallet)
router.get("/profile/:identifier", async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const { type = "device" } = req.query; // device or wallet

    // Return mock profile for now - can be connected to DB later
    return res.json({
      identifier,
      type,
      totalDiscovered: 0,
      totalNFTsMinted: 0,
      totalStarEarned: 0,
      totalStarBurned: 0,
      achievements: [],
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Get global statistics
router.get("/stats/global", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    
    let todayStats = {
      totalNewPlayers: 0,
      totalDiscoveries: 0,
      totalNFTsMinted: 0,
      totalStarDistributed: 0,
      totalStarBurned: 0,
    };

    if (db) {
      try {
        const result = await db.execute(`
          SELECT 
            COUNT(DISTINCT CASE WHEN event_type = 'planet_discovered' THEN wallet_address END) as total_discoveries,
            COUNT(DISTINCT CASE WHEN event_type = 'planet_minted' THEN wallet_address END) as total_nfts_minted,
            COUNT(DISTINCT CASE WHEN event_type LIKE 'star_burned%' THEN wallet_address END) as total_star_burned
          FROM analytics_events
          WHERE DATE(created_at) = CURRENT_DATE
        `);
        
        if (result.rows && result.rows.length > 0) {
          const row = result.rows[0];
          todayStats = {
            totalNewPlayers: 0, // Would need user registration tracking
            totalDiscoveries: row.total_discoveries || 0,
            totalNFTsMinted: row.total_nfts_minted || 0,
            totalStarDistributed: 0, // Would sum from passive_income_claimed events
            totalStarBurned: row.total_star_burned || 0,
          };
        }
      } catch (dbError) {
        console.error("Database query error:", dbError);
      }
    }

    // Mock data fallback
    const allTimeStats = {
      totalUsers: 145,
      totalDiscovered: 1250,
      totalNFTsMinted: 800,
      totalStarEarned: 125000,
      totalStarBurned: 35000,
    };

    res.json({
      today: todayStats,
      allTime: allTimeStats,
    });
  } catch (error) {
    console.error("Global stats error:", error);
    res.status(500).json({ error: "Failed to fetch global stats" });
  }
});

// Get leaderboard
router.get("/leaderboard/:metric", async (req: Request, res: Response) => {
  try {
    const { metric } = req.params;

    // Mock leaderboard data
    const mockLeaderboard = [
      {
        walletAddress: "EQA1234567890abcdef",
        username: "CosmicVoyager",
        totalDiscovered: 28,
        totalNFTsMinted: 28,
        totalStarEarned: 15000,
        totalStarBurned: 5000,
      },
      {
        walletAddress: "EQB2345678901bcdefg",
        username: "StellarExplorer",
        totalDiscovered: 25,
        totalNFTsMinted: 24,
        totalStarEarned: 12500,
        totalStarBurned: 3500,
      },
      {
        walletAddress: "EQC3456789012cdefgh",
        username: "PlanetHunter",
        totalDiscovered: 20,
        totalNFTsMinted: 18,
        totalStarEarned: 10000,
        totalStarBurned: 2000,
      },
    ];

    res.json(mockLeaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;
