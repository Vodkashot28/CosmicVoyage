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

    receive(msg: ClaimFaucet) {
        let senderAddress = sender();
        
        let hasClaimed = self.claimed.get(senderAddress);
        let alreadyClaimed: Bool = false;
        if (hasClaimed != null) {
            alreadyClaimed = hasClaimed!!;
        }
        require(!alreadyClaimed, "Already claimed faucet");

        self.claimed.set(senderAddress, true);

        if (msg.referral != null) {
            let referralAddr = msg.referral!!;
            if (referralAddr != senderAddress) {
                let referralClaimedOpt = self.claimed.get(referralAddr);
                let isReferralValid: Bool = false;
                if (referralClaimedOpt != null) {
                    isReferralValid = referralClaimedOpt!!;
                }
                
                if (isReferralValid) {
                    let countOpt = self.referralCount.get(referralAddr);
                    let count: Int = 0;
                    if (countOpt != null) {
                        count = countOpt!!;
                    }
                    self.referralCount.set(referralAddr, count + 1);

                    self.referredBy.set(senderAddress, referralAddr);

                    let bonus: Int = 0;
                    if (count < 3) {
                        bonus = self.referralBonus;
                    } else if (count < 7) {
                        bonus = self.referralBonus + 2;
                    } else {
                        bonus = self.referralBonus + 5;
                    }

                    let bonusOpt = self.referralBonusEarned.get(referralAddr);
                    let currentBonus: Int = 0;
                    if (bonusOpt != null) {
                        currentBonus = bonusOpt!!;
                    }
                    
                    let totalBonus = currentBonus + bonus;
                    if (totalBonus > self.maxReferralBonus) {
                        bonus = self.maxReferralBonus - currentBonus;
                    }

                    self.referralBonusEarned.set(referralAddr, currentBonus + bonus);
                }
            }
        }
    }

    fun getReferralInfo(user: Address): ReferralInfo {
        let countOpt = self.referralCount.get(user);
        let count: Int = 0;
        if (countOpt != null) {
            count = countOpt!!;
        }
        
        let bonusOpt = self.referralBonusEarned.get(user);
        let bonus: Int = 0;
        if (bonusOpt != null) {
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
