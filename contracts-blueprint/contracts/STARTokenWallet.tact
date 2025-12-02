import "@stdlib/deploy";

/*
  STAR Token Wallet Contract
  - User-owned wallet for holding STAR tokens
  - Can receive, send, and burn tokens
  - Tracks token balance
  - Integrates with STARToken contract
*/

message TokenTransfer {
    queryId: Int;
    amount: Int;
    destination: Address;
    responseDestination: Address;
    customPayload: Cell?;
    forwardTonAmount: Int;
    forwardPayload: Cell;
}

message TokenBurn {
    queryId: Int;
    amount: Int;
    responseDestination: Address;
    customPayload: Cell?;
}

message TokenNotification {
    queryId: Int;
    amount: Int;
    from: Address;
    forwardPayload: Cell;
}

message BurnCosmicUtility {
    queryId: Int;
    utilityType: String;
    amount: Int;
}

struct PassiveIncomeInfo {
    perHour: Int;
    nftCount: Int;
    dailyEarned: Int;
}

contract STARTokenWallet with Deployable {
    tokenContract: Address;
    owner: Address;
    tokenBalance: Int = 0;
    dailyEarned: Int = 0;
    lastClaimTime: Int = 0;
    totalBurned: Int = 0;
    passiveIncomePerHour: Int = 0;
    nftOwnedCount: Int = 0;
    cosmicBurns: map<Address, Int> = emptyMap();
    
    init(owner: Address, tokenContract: Address) {
        self.owner = owner;
        self.tokenContract = tokenContract;
        self.lastClaimTime = now();
    }
    
    fun getBalance(): Int {
        return self.tokenBalance;
    }
    
    fun getPassiveIncomeInfo(): PassiveIncomeInfo {
        let info: PassiveIncomeInfo = PassiveIncomeInfo{ 
            perHour: self.passiveIncomePerHour, 
            nftCount: self.nftOwnedCount, 
            dailyEarned: self.dailyEarned 
        };
        return info;
    }
    
    fun getTotalBurned(): Int {
        return self.totalBurned;
    }
    
    receive(msg: TokenNotification) {
        require(sender() == self.tokenContract, "Only token contract can notify");
        self.tokenBalance += msg.amount;
    }
    
    fun transfer(destination: Address, amount: Int) {
        require(self.tokenBalance >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be positive");
        require(sender() == self.owner, "Only owner can transfer");
        self.tokenBalance -= amount;
    }
    
    fun burnForUtility(utility: String, amount: Int) {
        require(self.tokenBalance >= amount, "Insufficient balance to burn");
        require(amount > 0, "Burn amount must be positive");
        require(sender() == self.owner, "Only owner can burn");
        self.tokenBalance -= amount;
        self.totalBurned += amount;
    }
    
    fun claimPassiveIncome(): Int {
        require(sender() == self.owner, "Only owner can claim");
        require(self.nftOwnedCount > 0, "No NFTs owned");
        let timeSinceLastClaim = now() - self.lastClaimTime;
        let hoursElapsed = timeSinceLastClaim / 3600;
        let earned = hoursElapsed * self.passiveIncomePerHour * self.nftOwnedCount;
        self.tokenBalance += earned;
        self.dailyEarned += earned;
        self.lastClaimTime = now();
        return earned;
    }
    
    fun updateNFTOwnership(nftCount: Int) {
        require(sender() == self.owner, "Only owner can update NFT ownership");
        self.nftOwnedCount = nftCount;
        self.passiveIncomePerHour = 50;
    }
    
    fun emergencyWithdraw(amount: Int) {
        require(sender() == self.owner, "Only owner can withdraw");
        require(self.tokenBalance >= amount, "Insufficient balance");
        self.tokenBalance -= amount;
    }
    
    receive() {
    }
}
