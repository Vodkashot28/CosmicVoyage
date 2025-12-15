// client/src/lib/config.ts

// API base URL: switches between local dev and production

// Recommended approach: Use a relative path /api for production if the frontend 
// and backend are hosted on the same domain (solar-system.xyz), and use 
// the full URL for local development if you are testing against the live server.
//
// NOTE: Based on your domain, we assume the API lives at the root /api path.
// If the API and client are served from the same domain, using '/api' is safest.
// For explicit control, we set the production URL fully.

const PRODUCTION_API_BASE = "https://solar-system.xyz/api";
const DEVELOPMENT_API_BASE = "/api"; // Relies on dev server (like Vite) proxying /api to localhost:5000

export const API_BASE =
  import.meta.env.MODE === "production"
    ? PRODUCTION_API_BASE
    : DEVELOPMENT_API_BASE;


// Contract addresses pulled from Vite env vars
export const CONTRACT_ADDRESSES = {
  // Ensure these VITE variables hold the TON MAINNET addresses for production
  STAR_TOKEN: import.meta.env.VITE_STAR_TOKEN_ADDRESS,
  STAR_TOKEN_WALLET: import.meta.env.VITE_STAR_TOKEN_WALLET_ADDRESS,
  PLANET_NFT: import.meta.env.VITE_PLANET_NFT_ADDRESS,
  PLANET_NFT_ITEM: import.meta.env.VITE_PLANET_NFT_ITEM_ADDRESS,
  REFERRAL_FAUCET: import.meta.env.VITE_REFERRAL_FAUCET_ADDRESS,
};
