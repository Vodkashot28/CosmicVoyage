import { Router } from "express";
import type { Request, Response } from "express";
import { getDb } from "../db";

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
          await db.execute(`
            INSERT INTO analytics_events (device_id, wallet_address, event_type, event_data)
            VALUES ($1, $2, $3, $4)
          `, [
            event.deviceId,
            event.walletAddress || null,
            event.eventType,
            JSON.stringify(event.data),
          ]);
        }
        console.log(`[DB] Stored ${events.length} analytics events`);
      } catch (dbError) {
        console.error("Database storage error, falling back to memory:", dbError);
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
