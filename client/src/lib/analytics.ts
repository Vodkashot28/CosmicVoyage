/**
 * Analytics Event Tracking
 * Sends all player actions to backend for persistent tracking
 */

import { getDeviceId } from "./deviceId";

export enum EventType {
  // Discovery Events
  PLANET_DISCOVERED = "planet_discovered",
  PLANET_MINTED = "planet_minted",
  
  // Earning Events
  PASSIVE_INCOME_CLAIMED = "passive_income_claimed",
  DAILY_LOGIN = "daily_login",
  REFERRAL_BONUS_EARNED = "referral_bonus_earned",
  
  // Burning Events
  STAR_BURNED = "star_burned",
  NFT_REFINED = "nft_refined",
  PRESTIGE_ACHIEVED = "prestige_achieved",
  SMB_PURCHASED = "smb_purchased",
  
  // Progression Events
  SET_BONUS_ACHIEVED = "set_bonus_achieved",
  PHASE_COMPLETED = "phase_completed",
  IMMORTALITY_TIER_UP = "immortality_tier_up",
}

export interface AnalyticsEvent {
  eventType: EventType;
  deviceId: string;
  walletAddress?: string | null;
  timestamp: number;
  data: Record<string, any>;
}

class AnalyticsTracker {
  private queue: AnalyticsEvent[] = [];
  private isOnline = true;

  constructor() {
    // Monitor connectivity
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.flush();
    });
    window.addEventListener("offline", () => {
      this.isOnline = false;
    });
    
    // Flush queue periodically
    setInterval(() => this.flush(), 30000);
    
    // Flush on page unload
    window.addEventListener("beforeunload", () => this.flush());
  }

  track(
    eventType: EventType,
    data: Record<string, any>,
    walletAddress?: string | null
  ) {
    const event: AnalyticsEvent = {
      eventType,
      deviceId: getDeviceId(),
      walletAddress: walletAddress || undefined,
      timestamp: Date.now(),
      data,
    };

    this.queue.push(event);

    // Auto-flush if queue is large
    if (this.queue.length >= 10) {
      this.flush();
    }
  }

  async flush() {
    if (this.queue.length === 0 || !this.isOnline) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        // Re-queue events if failed
        this.queue = events.concat(this.queue);
        console.error("Failed to send analytics events");
      }
    } catch (error) {
      // Re-queue events if network error
      this.queue = events.concat(this.queue);
      console.error("Analytics network error:", error);
    }
  }
}

export const analytics = new AnalyticsTracker();

// Convenience functions
export function trackDiscovery(planet: string, reward: number, walletAddress?: string | null) {
  analytics.track(
    EventType.PLANET_DISCOVERED,
    { planet, reward },
    walletAddress
  );
}

export function trackMint(planet: string, nftId: string, walletAddress?: string | null) {
  analytics.track(
    EventType.PLANET_MINTED,
    { planet, nftId },
    walletAddress
  );
}

export function trackBurn(
  burnType: string,
  amount: number,
  context: string,
  walletAddress?: string | null
) {
  analytics.track(
    EventType.STAR_BURNED,
    { burnType, amount, context },
    walletAddress
  );
}

export function trackPassiveIncome(
  amount: number,
  nftCount: number,
  walletAddress?: string | null
) {
  analytics.track(
    EventType.PASSIVE_INCOME_CLAIMED,
    { amount, nftCount },
    walletAddress
  );
}

export function trackDailyLogin(streak: number, walletAddress?: string | null) {
  analytics.track(
    EventType.DAILY_LOGIN,
    { streak },
    walletAddress
  );
}

export function trackImmortalityTier(tier: string, score: number, walletAddress?: string | null) {
  analytics.track(
    EventType.IMMORTALITY_TIER_UP,
    { tier, score },
    walletAddress
  );
}
