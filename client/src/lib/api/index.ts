/**
 * API Service - Centralized API calls for all backend endpoints
 * All endpoints from server/routes.ts are wrapped here
 */

const API_BASE = "/api";

// --- REFACTOR: CENTRALIZED HELPER FUNCTION ---

// Use Omit to ensure our custom body type (Record<string, any>)
// does not conflict with the built-in RequestInit's body type (BodyInit | null | undefined).
interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, any>;
}

/**
 * Executes a centralized API fetch call with unified error handling.
 * @param endpoint The API endpoint path (e.g., '/player/profile/...')
 * @param options Fetch options including method, headers, and body data.
 * @returns The JSON response data.
 */
async function apiFetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  // FIX: Destructure the custom 'body' object away from the rest of the options
  // to avoid the TS2322 conflict when spreading into RequestInit.
  const { body: requestBodyObject, ...restOfOptions } = options;

  // fetchOptions is now correctly inferred as RequestInit compatible
  const fetchOptions: RequestInit = {
    ...restOfOptions, // Spreading the safe part of the options
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // Convert the body object to a JSON string if present and for methods that require a body
  if (requestBodyObject && options.method !== 'GET' && options.method !== 'HEAD') {
    // Now assigning a string (BodyInit) to RequestInit.body
    fetchOptions.body = JSON.stringify(requestBodyObject);
  } else {
    // Ensure GET/HEAD requests don't have a body property
    delete fetchOptions.body;
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      // Attempt to parse a structured error response from the server
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If JSON parsing fails (e.g., server returned plain text or no body)
        throw new Error(`HTTP Error ${response.status}: Failed to parse error response.`);
      }

      // Throw the specific error message provided by the server, or a generic one
      throw new Error(errorData.error || `HTTP Error ${response.status}`);
    }

    // Only attempt to parse JSON if the response has content
    if (response.status === 204 || response.headers.get('Content-Length') === '0') {
      return {} as T; // Return empty object for no-content responses (e.g., 204)
    }

    return response.json();
  } catch (error) {
    // Re-throw the error after logging/handling client-side issues (e.g., network error)
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
