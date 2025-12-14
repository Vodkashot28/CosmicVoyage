// client/src/lib/config.ts

// API base URL: switches between local dev and production
export const API_BASE =
  import.meta.env.MODE === "production"
    ? "http://localhost:5000/api"
    : "https://solar-system.xyz/api";

// Contract addresses pulled from Vite env vars
export const CONTRACT_ADDRESSES = {
  STAR_TOKEN: import.meta.env.VITE_STAR_TOKEN_ADDRESS,
  STAR_TOKEN_WALLET: import.meta.env.VITE_STAR_TOKEN_WALLET_ADDRESS,
  PLANET_NFT: import.meta.env.VITE_PLANET_NFT_ADDRESS,
  PLANET_NFT_ITEM: import.meta.env.VITE_PLANET_NFT_ITEM_ADDRESS,
  REFERRAL_FAUCET: import.meta.env.VITE_REFERRAL_FAUCET_ADDRESS,
};
