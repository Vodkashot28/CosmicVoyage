// src/lib/api/index.ts

const API_BASE_URL = '/api/player'; // Maps to how you mount the router in app.ts/routes.ts

// Generic type for a successful API response (adapt this for specific endpoints)
interface ApiResponse<T> {
    success: boolean;
    data: T;
}

// Type definition for the Daily Login successful response
interface DailyLoginSuccess {
    reward: number;
    streak: number;
    message: string;
    totalClaimed: number;
    // Assuming you skip the transactionHash on the client to keep it clean
}

/**
 * Executes a stable POST request to a game API endpoint.
 * @param endpoint The specific path (e.g., '/claim' or '/mint').
 * @param body The JavaScript object to send as JSON in the request body.
 * @returns A promise that resolves with the server's successful JSON response data.
 * @throws An Error if the request fails, times out, or the server returns an error status.
 */
export const postApiAction = async <T>(endpoint: string, body: object): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                // FIX 1: Essential for the server to parse the body as JSON
                'Content-Type': 'application/json',
                // Add Authorization if needed here
            },
            // FIX 2: Ensures the body is a stringified JSON payload
            body: JSON.stringify(body),
        });

<<<<<<< HEAD
        // Attempt to parse the response body first, whether success or error
        let data: any;
        try {
            data = await response.json();
        } catch (e) {
            // FIX 3: Handles cases where the server returns non-JSON data (The original SyntaxError!)
            throw new Error(`Server returned a non-JSON response (Status: ${response.status}).`);
        }

        // 4. Handle Non-200 Responses (Errors)
        if (!response.ok) {
            // Use the structured error message from the server's JSON response
            const errorMessage = data.message || data.error || `Unknown API Error (${response.status})`;
            console.error(`API Error on ${url}:`, errorMessage, data);
            throw new Error(errorMessage);
        }

<<<<<<< HEAD
        // 5. Success Response
        return data as T;

    } catch (error) {
        // Handle network/client-side failures (CORS, DNS, connection issues)
        const message = error instanceof Error ? error.message : 'A network connection error occurred.';
        console.error(`Network or client failure on ${url}:`, message);
        throw new Error(message);
    }
};
=======
export async function claimGenesis(walletAddress: string) {
=======
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

>>>>>>> 96b2ad9b94c94a209902dbbb49ed5d3a9858ab35
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
>>>>>>> d66ef91 (Assistant checkpoint: Wire frontend-backend with CORS and health check)


<<<<<<< HEAD
// Example specific wrapper for the Daily Login action
export const claimDailyLogin = async (walletAddress: string): Promise<DailyLoginSuccess> => {
    // The final URL will be: /api/player/claim
    return postApiAction<DailyLoginSuccess>('/claim', { walletAddress });
};
=======
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
>>>>>>> d66ef91 (Assistant checkpoint: Wire frontend-backend with CORS and health check)
