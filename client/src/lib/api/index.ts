/**
 * API Service - Centralized API calls for all backend endpoints
 * All endpoints from server/routes.ts are wrapped here
 */

import { API_BASE } from "../config";

// Use Omit to ensure our custom body type (Record<string, any>)
// does not conflict with the built-in RequestInit's body type (BodyInit | null | undefined).
interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, any>;
}

/**
 * Executes a centralized API fetch call with unified error handling.
 * @param endpoint The API endpoint path (e.g., '/player/profile/...')
 * @param options Fetch options including method, headers, and body data.
 * @returns The JSON response data.
 */
async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const { body: requestBodyObject, ...restOfOptions } = options;

  const fetchOptions: RequestInit = {
    ...restOfOptions,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  if (requestBodyObject && options.method !== "GET" && options.method !== "HEAD") {
    fetchOptions.body = JSON.stringify(requestBodyObject);
  } else {
    delete fetchOptions.body;
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        throw new Error(`HTTP Error ${response.status}: Failed to parse error response.`);
      }
      throw new Error(errorData.error || `HTTP Error ${response.status}`);
    }

    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`API Call failed for ${url}:`, error.message);
    } else {
      console.error(`API Call failed for ${url}:`, error);
    }
    throw error;
  }
}

// ============ GENESIS FAUCET ENDPOINTS ============

export async function claimGenesis(walletAddress: string) {
  return apiFetch("/player/claim-genesis", {
    method: "POST",
    body: { walletAddress },
  });
}

export async function getGenesisStatus(walletAddress: string) {
  return apiFetch(`/player/genesis-status/${walletAddress}`);
}

// ============ PLAYER PROFILE ENDPOINTS ============

export async function getPlayerProfile(walletAddress: string) {
  return apiFetch(`/player/profile/${walletAddress}`);
}

// ============ STAR TOKEN ENDPOINTS ============

export async function getStarBalance(walletAddress: string) {
  return apiFetch(`/player/star-balance/${walletAddress}`);
}

export async function updateStarBalance(walletAddress: string, amount: number) {
  return apiFetch("/player/update-star-balance", {
    method: "POST",
    body: { walletAddress, amount },
  });
}

export async function burnStar(walletAddress: string, amount: number, utility: string) {
  return apiFetch("/player/burn-star", {
    method: "POST",
    body: { walletAddress, amount, utility },
  });
}

// ============ DISCOVERY ENDPOINTS ============

export async function recordDiscovery(
  walletAddress: string,
  celestialObjectName: string,
  discoveryOrder: number,
  tokenReward: number
) {
  return apiFetch("/discovery/record", {
    method: "POST",
    body: { walletAddress, celestialObjectName, discoveryOrder, tokenReward },
  });
}

export async function getDiscoveryList(walletAddress: string) {
  return apiFetch(`/discovery/list/${walletAddress}`);
}

// ============ NFT ENDPOINTS ============

export async function recordNFTMint(
  walletAddress: string,
  celestialObjectName: string,
  discoveryOrder: number,
  tokenId: string
) {
  return apiFetch("/nft/mint", {
    method: "POST",
    body: { walletAddress, celestialObjectName, discoveryOrder, tokenId },
  });
}

export async function getNFTList(walletAddress: string) {
  return apiFetch(`/nft/list/${walletAddress}`);
}

// ============ PASSIVE INCOME ENDPOINTS ============

export async function claimPassiveIncome(walletAddress: string) {
  return apiFetch("/passive-income/claim", {
    method: "POST",
    body: { walletAddress },
  });
}

export async function getPassiveIncomeStats(walletAddress: string) {
  return apiFetch(`/passive-income/stats/${walletAddress}`);
}

// ============ REFERRAL ENDPOINTS ============

export async function claimGenesisWithReferral(walletAddress: string, referralCode?: string) {
  return apiFetch("/player/claim-genesis-with-referral", {
    method: "POST",
    body: { walletAddress, referralCode },
  });
}

export async function getReferralStats(walletAddress: string) {
  return apiFetch(`/player/referral-stats/${walletAddress}`);
}

// ============ LEADERBOARD ENDPOINTS ============

export async function getReferralLeaderboard() {
  return apiFetch("/leaderboard/referrals");
}

export async function getDiscoveryLeaderboard() {
  return apiFetch("/leaderboard/discoveries");
}

export async function getCollectionLeaderboard() {
  return apiFetch("/leaderboard/collections");
}

// ============ HEALTH CHECK ============

export async function checkHealth() {
  return apiFetch("/health");
}
