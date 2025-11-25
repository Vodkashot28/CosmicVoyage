// drizzle.config.ts
// Regenerated: 2025-11-23
// Cleaned merge conflict markers and added NFT schema

import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config(); // Load .env variables

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Ensure the database is provisioned and .env is set.");
}

export default defineConfig({
  out: "./migrations",
  schema: [
    "./shared/schema.ts",   // Users, referrals, leaderboard
    "./shared/nftSchema.ts" // PlanetNFT records and metadata
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
