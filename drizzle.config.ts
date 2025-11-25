<<<<<<< HEAD
// drizzle.config.ts
// Regenerated: 2025-11-23
// Cleaned merge conflict markers and added NFT schema

import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config(); // Load .env variables

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Ensure the database is provisioned and .env is set.");
=======
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
>>>>>>> c297bfc4245e6f3d5429419ed9a7c68f69074ccc
}

export default defineConfig({
  out: "./migrations",
<<<<<<< HEAD
  schema: [
    "./shared/schema.ts",   // Users, referrals, leaderboard
    "./shared/nftSchema.ts" // PlanetNFT records and metadata
  ],
=======
  schema: "./shared/schema.ts",
>>>>>>> c297bfc4245e6f3d5429419ed9a7c68f69074ccc
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
