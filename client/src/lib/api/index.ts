/**
 * API Service - Centralized API calls for all backend endpoints
 * All endpoints from server/routes.ts are wrapped here
 */

const API_BASE = "/api";

// ============ GENESIS FAUCET ENDPOINTS ============

export async function claimGenesis(walletAddress: string) {
  try {
    const response = await fetch(`${API_BASE}/player/claim-genesis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Genesis claim failed:", error);
    throw error;
  }
}

export async function getGenesisStatus(walletAddress: string) {
  const response = await fetch(`${API_BASE}/player/genesis-status/${walletAddress}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// ============ PLAYER PROFILE ENDPOINTS ============

export async function getPlayerProfile(walletAddress: string) {
  const response = await fetch(`${API_BASE}/player/profile/${walletAddress}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// ============ STAR TOKEN ENDPOINTS ============

export async function getStarBalance(walletAddress: string) {
  const response = await fetch(`${API_BASE}/player/star-balance/${walletAddress}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function updateStarBalance(walletAddress: string, amount: number) {
  const response = await fetch(`${API_BASE}/player/update-star-balance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, amount }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function burnStar(walletAddress: string, amount: number, utility: string) {
  const response = await fetch(`${API_BASE}/player/burn-star`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, amount, utility }),
  });
  return response.json();
}

// ============ DISCOVERY ENDPOINTS ============

export async function recordDiscovery(
  walletAddress: string,
  celestialObjectName: string,
  discoveryOrder: number,
  tokenReward: number
) {
  const response = await fetch(`${API_BASE}/discovery/record`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, celestialObjectName, discoveryOrder, tokenReward }),
  });
  return response.json();
}

export async function getDiscoveryList(walletAddress: string) {
  const response = await fetch(`${API_BASE}/discovery/list/${walletAddress}`);
  return response.json();
}

// ============ NFT ENDPOINTS ============

export async function recordNFTMint(
  walletAddress: string,
  celestialObjectName: string,
  discoveryOrder: number,
  tokenId: string
) {
  const response = await fetch(`${API_BASE}/nft/mint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, celestialObjectName, discoveryOrder, tokenId }),
  });
  return response.json();
}

export async function getNFTList(walletAddress: string) {
  const response = await fetch(`${API_BASE}/nft/list/${walletAddress}`);
  return response.json();
}

// ============ PASSIVE INCOME ENDPOINTS ============

export async function claimPassiveIncome(walletAddress: string) {
  const response = await fetch(`${API_BASE}/passive-income/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  return response.json();
}

export async function getPassiveIncomeStats(walletAddress: string) {
  const response = await fetch(`${API_BASE}/passive-income/stats/${walletAddress}`);
  return response.json();
}

// ============ REFERRAL ENDPOINTS ============

export async function claimGenesisWithReferral(walletAddress: string, referralCode?: string) {
  const response = await fetch(`${API_BASE}/player/claim-genesis-with-referral`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, referralCode }),
  });
  return response.json();
}

export async function getReferralStats(walletAddress: string) {
  const response = await fetch(`${API_BASE}/player/referral-stats/${walletAddress}`);
  return response.json();
}

// ============ LEADERBOARD ENDPOINTS ============

export async function getReferralLeaderboard() {
  const response = await fetch(`${API_BASE}/leaderboard/referrals`);
  return response.json();
}

export async function getDiscoveryLeaderboard() {
  const response = await fetch(`${API_BASE}/leaderboard/discoveries`);
  return response.json();
}

export async function getCollectionLeaderboard() {
  const response = await fetch(`${API_BASE}/leaderboard/collections`);
  return response.json();
}

// ============ HEALTH CHECK ============

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`);
  return response.json();
}
