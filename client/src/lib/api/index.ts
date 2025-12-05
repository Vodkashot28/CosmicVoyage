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
>>>>>>> d66ef91 (Assistant checkpoint: Wire frontend-backend with CORS and health check)


<<<<<<< HEAD
// Example specific wrapper for the Daily Login action
export const claimDailyLogin = async (walletAddress: string): Promise<DailyLoginSuccess> => {
    // The final URL will be: /api/player/claim
    return postApiAction<DailyLoginSuccess>('/claim', { walletAddress });
};
=======
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
>>>>>>> d66ef91 (Assistant checkpoint: Wire frontend-backend with CORS and health check)
