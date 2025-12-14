// server/index-prod.ts
// Optimized for Vercel Serverless Function deployment

import { type Express } from "express";

// IMPORTANT: We assume that the 'runApp' import is refactored 
// in its source file (e.g., server/app.ts) to:
// 1. NOT call app.listen()
// 2. Return the configured Express app instance (app)
// 3. The 'serveStatic' function passed here is now a no-op 
//    since Vercel handles static file serving.
import getApp from "./app"; 

// 1. Define a simple handler that satisfies the expected argument type of getApp (if needed)
// On Vercel, static files are served directly, so this function does nothing.
const noopStaticHandler = async (app: Express, server: any) => {
    console.log("Static file serving skipped: Vercel handles static assets.");
    // You could put Vercel-specific logging/setup here if needed.
};

// 2. Execute the app setup function to get the Express app instance.
// We use await since the setup is async (e.g., database connection).
const app = await getApp(noopStaticHandler);

// 3. CRITICAL FIX: Export the Express app instance as the default export 
// required by the Vercel Node.js serverless runtime.
export default app;
