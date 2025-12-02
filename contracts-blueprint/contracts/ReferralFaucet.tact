// Enhanced Referral Faucet Contract
// Rewards both new players and referrers with tiered bonuses

import "@stdlib/deploy";

contract ReferralFaucet with Deployable {
    address starToken;
    int giftAmount;           // e.g. 10 STAR for new player
    int referralBonus;        // e.g. 5 STAR per referral
    int maxReferralBonus;     // e.g. 50 STAR max bonus (10 referrals)
    int passiveIncomeBonusPercent; // e.g. 10% of referee's passive income for 30 days

    map<address, bool> claimed;
    map<address, int> referralCount;        // How many people referred this user
    map<address, address> referredBy;        // Who referred this user
    map<address, int> referralBonusEarned;  // Total bonus earned

    init(address _starToken, int _giftAmount, int _referralBonus, int _maxReferralBonus) {
        starToken = _starToken;
        giftAmount = _giftAmount;              // 10 STAR
        referralBonus = _referralBonus;        // 5 STAR per referral
        maxReferralBonus = _maxReferralBonus;  // 50 STAR max
        passiveIncomeBonusPercent = 10;        // 10% passive bonus
    }

    // Claim faucet with optional referral code
    receive("ClaimFaucet") {
        let sender = context().sender;
        let referral = context().body.get("referral") as address?;

        // Prevent double claim
        if (claimed.get(sender) == true) {
            throw("Already claimed faucet");
        }

        // Mark sender as claimed
        claimed.set(sender, true);

        // Send gift to new player
        send(starToken, {
            $$type: "Transfer",
            to: sender,
            amount: giftAmount
        });

        // If valid referral provided
        if (referral != null && referral != sender && claimed.get(referral) == true) {
            // Increment referral count
            let count = referralCount.get(referral) ?: 0;
            referralCount.set(referral, count + 1);

            // Track who referred this player
            referredBy.set(sender, referral);

            // Calculate bonus with tier scaling
            // Tier 1: 1-3 referrals = 5 STAR each
            // Tier 2: 4-7 referrals = 7 STAR each
            // Tier 3: 8+ referrals = 10 STAR each
            let bonus: int;
            if (count < 3) {
                bonus = referralBonus;  // 5 STAR
            } else if (count < 7) {
                bonus = referralBonus + 2;  // 7 STAR
            } else {
                bonus = referralBonus + 5;  // 10 STAR
            }

            // Cap total bonus earned
            let currentBonus = referralBonusEarned.get(referral) ?: 0;
            let totalBonus = currentBonus + bonus;
            if (totalBonus > maxReferralBonus) {
                bonus = maxReferralBonus - currentBonus;
            }

            referralBonusEarned.set(referral, totalBonus);

            // Send referral bonus to referrer
            if (bonus > 0) {
                send(starToken, {
                    $$type: "Transfer",
                    to: referral,
                    amount: bonus
                });
            }
        }
    }

    // Get referral info for a user
    get fun getReferralInfo(user: address): (int, int, address?) {
        return (
            referralCount.get(user) ?: 0,
            referralBonusEarned.get(user) ?: 0,
            referredBy.get(user)
        );
    }
}
