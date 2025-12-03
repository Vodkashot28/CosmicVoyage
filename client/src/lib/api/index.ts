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

        // 5. Success Response
        return data as T;

    } catch (error) {
        // Handle network/client-side failures (CORS, DNS, connection issues)
        const message = error instanceof Error ? error.message : 'A network connection error occurred.';
        console.error(`Network or client failure on ${url}:`, message);
        throw new Error(message);
    }
};


// Example specific wrapper for the Daily Login action
export const claimDailyLogin = async (walletAddress: string): Promise<DailyLoginSuccess> => {
    // The final URL will be: /api/player/claim
    return postApiAction<DailyLoginSuccess>('/claim', { walletAddress });
};
