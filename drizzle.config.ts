import { defineConfig } from "drizzle-kit";
<<<<<<< HEAD
import * as dotenv from "dotenv";

dotenv.config(); // Load .env variables
=======
>>>>>>> 0b64c5e (Updates)

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
