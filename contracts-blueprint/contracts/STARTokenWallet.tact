import "@stdlib/deploy";

/*
  STAR Token Wallet Contract
  - User-owned wallet for holding STAR tokens
  - Can receive, send, and burn tokens
  - Tracks token balance
  - Integrates with STARToken contract
*/

message TokenTransfer {
    queryId: UInt64;
    amount: Int;
    destination: Address;
    responseDestination: Address;
    customPayload: Cell?;
    forwardTonAmount: Int;
    forwardPayload: Cell;
}

message TokenBurn {
    queryId: UInt64;
    amount: Int;
    responseDestination: Address;
    customPayload: Cell?;
}

message TokenNotification {
    queryId: UInt64;
    amount: Int;
    from: Address;
    forwardPayload: Cell;
}

message BurnCosmicUtility {
    queryId: UInt64;
    utilityType: String; // "cosmic-boost", "void-jump", "celestial-shield", etc.
    amount: Int;
}

contract STARTokenWallet with Deployable {
    // Token contract address
    tokenContract: Address;
    
    // Wallet owner
    owner: Address;
    
    // Balance of STAR tokens
    tokenBalance: Int = 0;
    
    // Daily earned tokens (for passive income tracking)
    dailyEarned: Int = 0;
    lastClaimTime: Int = 0;
    
    // Burned tokens (permanent record)
    totalBurned: Int = 0;
    
    // Passive income per hour (from NFT ownership)
    passiveIncomePerHour: Int = 0; // 0.5 STAR per hour = 50 (in smallest units if decimals)
    nftOwnedCount: Int = 0;
    
    // Cosmic utility burn history
    cosmicBurns: map<String, Int> = emptyMap();
    
    init(owner: Address, tokenContract: Address) {
        self.owner = owner;
        self.tokenContract = tokenContract;
        self.lastClaimTime = now();
    }
    
    // Get wallet balance
    fun getBalance(): Int {
        return self.tokenBalance;
    }
    
    // Get passive income info
    fun getPassiveIncomePerHour(): Int {
        return self.passiveIncomePerHour;
    }
    
    fun getNFTOwnedCount(): Int {
        return self.nftOwnedCount;
    }
    
    fun getDailyEarned(): Int {
        return self.dailyEarned;
    }
    
    // Get burn history for specific utility
    fun getCosimicBurnHistory(utility: String): Int {
        return self.cosmicBurns.get(utility) ?? 0;
    }
    
    // Get total burned
    fun getTotalBurned(): Int {
        return self.totalBurned;
    }
    
    // Receive tokens from token contract
    receive(msg: TokenNotification) {
        require(sender() == self.tokenContract, "Only token contract can notify");
        self.tokenBalance += msg.amount;
        emit("Received " + msg.amount.toString() + " STAR tokens");
    }
    
    // Transfer tokens to another wallet
    fun transfer(destination: Address, amount: Int) {
        require(self.tokenBalance >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be positive");
        require(sender() == self.owner, "Only owner can transfer");
        
        self.tokenBalance -= amount;
        
        // Send to destination wallet
        emit("Transferred " + amount.toString() + " STAR tokens to " + destination.toString());
    }
    
    // Burn tokens (cosmic utilities)
    fun burnForUtility(utility: String, amount: Int) {
        require(self.tokenBalance >= amount, "Insufficient balance to burn");
        require(amount > 0, "Burn amount must be positive");
        require(sender() == self.owner, "Only owner can burn");
        
        self.tokenBalance -= amount;
        self.totalBurned += amount;
        
        let burnCount = self.cosmicBurns.get(utility) ?? 0;
        self.cosmicBurns.set(utility, burnCount + amount);
        
        emit("Burned " + amount.toString() + " STAR for " + utility);
    }
    
    // Claim passive income from NFT ownership
    fun claimPassiveIncome(): Int {
        require(sender() == self.owner, "Only owner can claim");
        require(self.nftOwnedCount > 0, "No NFTs owned");
        
        let timeSinceLastClaim = now() - self.lastClaimTime;
        let hoursElapsed = timeSinceLastClaim / 3600;
        
        let earned = hoursElapsed * self.passiveIncomePerHour * self.nftOwnedCount;
        
        self.tokenBalance += earned;
        self.dailyEarned += earned;
        self.lastClaimTime = now();
        
        emit("Claimed " + earned.toString() + " STAR from passive income");
        
        return earned;
    }
    
    // Admin update: Update NFT count and passive income rate
    fun updateNFTOwnership(nftCount: Int) {
        require(sender() == self.owner, "Only owner can update NFT ownership");
        self.nftOwnedCount = nftCount;
        
        // Set passive income per hour: 0.5 STAR/hour per NFT
        self.passiveIncomePerHour = 50; // in basis points if decimals needed
        
        emit("NFT ownership updated: " + nftCount.toString() + " NFTs");
    }
    
    // Emergency withdraw (owner only)
    fun emergencyWithdraw(amount: Int) {
        require(sender() == self.owner, "Only owner can withdraw");
        require(self.tokenBalance >= amount, "Insufficient balance");
        self.tokenBalance -= amount;
        emit("Emergency withdrawal: " + amount.toString() + " STAR");
    }
    
    // Receive TON for gas
    receive() {
        emit("Wallet received TON for gas");
    }
}
