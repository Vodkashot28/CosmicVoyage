import express from "express";
import { getDb } from "../db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";

export const orbitalRouter = express.Router();

// Save orbital offsets when user connects wallet
orbitalRouter.post("/save", async (req, res) => {
  const { walletAddress, orbitalOffsets } = req.body;

  if (!walletAddress || !orbitalOffsets) {
    return res.status(400).json({ error: "Missing walletAddress or orbitalOffsets" });
  }

  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    const orbitalOffsetsJson = JSON.stringify(orbitalOffsets);
    
    // Update user with orbital offsets
    await db
      .update(users)
      .set({ orbitalOffsets: orbitalOffsetsJson })
      .where(eq(users.walletAddress, walletAddress));

    res.json({ success: true });
  } catch (error) {
    console.error("[ORBITAL] Error saving orbital offsets:", error);
    res.status(500).json({ error: "Failed to save orbital offsets" });
  }
});

// Load orbital offsets when user reconnects
orbitalRouter.get("/load/:walletAddress", async (req, res) => {
  const { walletAddress } = req.params;

  if (!walletAddress) {
    return res.status(400).json({ error: "Missing walletAddress" });
  }

  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress))
      .limit(1);

    if (user.length === 0 || !user[0].orbitalOffsets) {
      return res.json({ orbitalOffsets: {} });
    }

    const orbitalOffsets = JSON.parse(user[0].orbitalOffsets);
    res.json({ orbitalOffsets });
  } catch (error) {
    console.error("[ORBITAL] Error loading orbital offsets:", error);
    res.status(500).json({ error: "Failed to load orbital offsets" });
  }
});
