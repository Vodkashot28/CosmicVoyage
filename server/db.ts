import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn("DATABASE_URL not set, using in-memory storage");
}

let db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!db && DATABASE_URL) {
    try {
      const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      });

      db = drizzle(pool);
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Failed to connect to database:", error);
    }
  }
  return db;
}

export async function initializeDatabase() {
  const database = await getDb();
  if (!database) {
    console.warn("Database not available, skipping initialization");
    return;
  }

  try {
    // Create analytics_events table if it doesn't exist
    await database.execute(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        device_id VARCHAR(255),
        wallet_address VARCHAR(255),
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    await database.execute(`CREATE INDEX IF NOT EXISTS idx_device_id ON analytics_events(device_id);`);
    await database.execute(`CREATE INDEX IF NOT EXISTS idx_wallet_address ON analytics_events(wallet_address);`);
    await database.execute(`CREATE INDEX IF NOT EXISTS idx_event_type ON analytics_events(event_type);`);
    await database.execute(`CREATE INDEX IF NOT EXISTS idx_created_at ON analytics_events(created_at);`);

    // Create daily_stats table if it doesn't exist
    await database.execute(`
      CREATE TABLE IF NOT EXISTS daily_analytics_stats (
        id SERIAL PRIMARY KEY,
        date DATE UNIQUE,
        total_new_players INT DEFAULT 0,
        total_discoveries INT DEFAULT 0,
        total_nfts_minted INT DEFAULT 0,
        total_star_distributed INT DEFAULT 0,
        total_star_burned INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Analytics tables initialized successfully");
  } catch (error) {
    console.error("Failed to initialize analytics tables:", error);
  }
}
