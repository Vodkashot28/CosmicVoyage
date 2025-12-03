import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

const DATABASE_URL = process.env.DATABASE_URL;
// Check if running in a production-like environment to recommend stricter SSL
const IS_PRODUCTION = process.env.NODE_ENV === "production";

if (!DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set - analytics will not persist");
}

let db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!db && DATABASE_URL) {
    try {
      // FIX: Added logic to conditionally set 'rejectUnauthorized' based on environment/config.
      // For production, rejectUnauthorized should ideally be true or the connection string should handle SSL.
      const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: IS_PRODUCTION ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
      });

      // Original code had:
      // ssl: {
      //   rejectUnauthorized: false, // ⚠️ WARNING: Insecure for production without proper validation
      // },

      db = drizzle(pool, { schema });
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Failed to connect to database:", error);
    }
  }
  return db;
}

/**
 * Initialize database - run Drizzle migrations via drizzle-kit
 * Tables are created via migrations, not in code
 */
export async function initializeDatabase() {
  const database = await getDb();
  if (!database) {
    console.warn("⚠️  Database not available, analytics will use fallback mode");
    return;
  }

  try {
    console.log("✅ Database initialized (tables created by drizzle-kit migrations)");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
}
