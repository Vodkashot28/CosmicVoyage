// Enhanced Referral Faucet Contract
// Rewards both new players and referrers with tiered bonuses

import "@stdlib/deploy";

message ClaimFaucet {
    referral: Address?;
}

struct ReferralInfo {
    referralCount: Int;
    bonusEarned: Int;
    referredBy: Address?;
}

contract ReferralFaucet with Deployable {
    starToken: Address;
    giftAmount: Int;
    referralBonus: Int;
    maxReferralBonus: Int;
    passiveIncomeBonusPercent: Int;

    claimed: map<Address, Bool> = emptyMap();
    referralCount: map<Address, Int> = emptyMap();
    referredBy: map<Address, Address> = emptyMap();
    referralBonusEarned: map<Address, Int> = emptyMap();

    init(starToken: Address, giftAmount: Int, referralBonus: Int, maxReferralBonus: Int) {
        self.starToken = starToken;
        self.giftAmount = giftAmount;
        self.referralBonus = referralBonus;
        self.maxReferralBonus = maxReferralBonus;
        self.passiveIncomeBonusPercent = 10;
    }

    // Claim faucet with optional referral code
    receive(msg: ClaimFaucet) {
        let senderAddress = sender();
        
        // Prevent double claim
        let hasClaimed = self.claimed.get(senderAddress);
        if (hasClaimed != null && hasClaimed!!) {
            require(false, "Already claimed faucet");
        }

        // Mark sender as claimed
        self.claimed.set(senderAddress, true);

        // Send gift to new player
        emit("Claimed faucet: " + self.giftAmount.toString() + " STAR");

        // If valid referral provided
        if (msg.referral != null && msg.referral!! != senderAddress) {
            let referralAddr = msg.referral!!;
            let referralClaimed = self.claimed.get(referralAddr);
            let isReferralValid: Bool = false;
            if (referralClaimed == null) {
                isReferralValid = false;
            } else {
                isReferralValid = referralClaimed!!;
            }
            
            if (isReferralValid) {
                // Increment referral count
                let countOpt = self.referralCount.get(referralAddr);
                let count: Int = 0;
                if (countOpt == null) {
                    count = 0;
                } else {
                    count = countOpt!!;
                }
                self.referralCount.set(referralAddr, count + 1);

                // Track who referred this player
                self.referredBy.set(senderAddress, referralAddr);

                // Calculate bonus with tier scaling
                let bonus: Int = 0;
                if (count < 3) {
                    bonus = self.referralBonus;
                } else if (count < 7) {
                    bonus = self.referralBonus + 2;
                } else {
                    bonus = self.referralBonus + 5;
                }

                // Cap total bonus earned
                let currentBonusOpt = self.referralBonusEarned.get(referralAddr);
                let currentBonus: Int = 0;
                if (currentBonusOpt == null) {
                    currentBonus = 0;
                } else {
                    currentBonus = currentBonusOpt!!;
                }
                
                let totalBonus = currentBonus + bonus;
                if (totalBonus > self.maxReferralBonus) {
                    bonus = self.maxReferralBonus - currentBonus;
                }

                self.referralBonusEarned.set(referralAddr, currentBonus + bonus);

                // Send referral bonus to referrer
                if (bonus > 0) {
                    emit("Referral bonus: " + bonus.toString() + " STAR to " + referralAddr.toString());
                }
            }
        }
    }

    // Get referral info for a user
    fun getReferralInfo(user: Address): ReferralInfo {
        let countOpt = self.referralCount.get(user);
        let count: Int = 0;
        if (countOpt == null) {
            count = 0;
        } else {
            count = countOpt!!;
        }
        
        let bonusOpt = self.referralBonusEarned.get(user);
        let bonus: Int = 0;
        if (bonusOpt == null) {
            bonus = 0;
        } else {
            bonus = bonusOpt!!;
        }
        
        let referredByOpt = self.referredBy.get(user);
        let info: ReferralInfo = ReferralInfo{
            referralCount: count,
            bonusEarned: bonus,
            referredBy: referredByOpt
        };
        return info;
    }
}
