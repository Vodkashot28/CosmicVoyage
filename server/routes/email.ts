import { Router } from "express";
import type { Request, Response } from "express";
import { getDb } from "../db";
import { users, emailVerifications } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

// Generate random verification token
function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * POST /email/request-verification
 * Request email verification - sends code (in dev, logs it)
 */
router.post("/request-verification", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    // Check if email already verified
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].emailVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    // Create or update verification token
    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Delete old verification if exists
    await db
      .delete(emailVerifications)
      .where(eq(emailVerifications.email, email));

    // Create new verification
    await db.insert(emailVerifications).values({
      email,
      token,
      expiresAt,
    });

    console.log(
      `📧 Email verification token for ${email}: ${token}`
    );

    // In production, send email. For dev, return token for testing
    res.json({
      success: true,
      message: "Verification email would be sent",
      verificationToken: token, // Dev only - remove in production
    });
  } catch (error) {
    console.error("Email request error:", error);
    res.status(500).json({ error: "Failed to request verification" });
  }
});

/**
 * POST /email/verify
 * Verify email with token
 */
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ error: "Email and token required" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    // Find verification
    const verification = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.email, email),
          eq(emailVerifications.token, token)
        )
      )
      .limit(1);

    if (verification.length === 0) {
      return res.status(400).json({ error: "Invalid verification token" });
    }

    // Check if expired
    if (new Date() > verification[0].expiresAt) {
      return res.status(400).json({ error: "Verification token expired" });
    }

    // Check if already verified
    if (verification[0].verifiedAt) {
      return res.status(400).json({ error: "Email already verified" });
    }

    // Mark as verified
    await db
      .update(emailVerifications)
      .set({ verifiedAt: new Date() })
      .where(eq(emailVerifications.id, verification[0].id));

    // Create or update user
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length === 0) {
      // Create new user
      await db.insert(users).values({
        email,
        emailVerified: true,
      });
    } else {
      // Update existing user
      await db
        .update(users)
        .set({ emailVerified: true })
        .where(eq(users.email, email));
    }

    console.log(`✅ Email verified: ${email}`);

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Failed to verify email" });
  }
});

/**
 * GET /email/verify-status/:email
 * Check email verification status
 */
router.get("/verify-status/:email", async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    res.json({
      email,
      verified: user.length > 0 && user[0].emailVerified,
      userId: user.length > 0 ? user[0].id : null,
    });
  } catch (error) {
    console.error("Verify status error:", error);
    res.status(500).json({ error: "Failed to check verification status" });
  }
});

export default router;
