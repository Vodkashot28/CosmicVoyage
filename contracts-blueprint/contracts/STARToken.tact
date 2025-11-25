import "@stdlib/deploy";

/*
  STAR Token Contract for Solar System Explorer
  - 1 Billion fixed supply
  - 0 decimals (whole tokens only)
  - Mintable only by deployer initially
  - Burnable by token holders
  - Transferable to other wallets
  - Supports passive income distribution via NFT ownership
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

message MintTokens {
    queryId: UInt64;
    amount: Int;
    receiver: Address;
    forwardTonAmount: Int;
    forwardPayload: Cell;
}

message BurnTokens {
    queryId: UInt64;
    amount: Int;
    owner: Address;
}

message SetAdmin {
    newAdmin: Address;
}

message DistributePassiveIncome {
    queryId: UInt64;
    nftHolder: Address;
    amount: Int;
}

contract STARToken with Deployable {
    // Token Metadata
    name: String = "STAR Token";
    symbol: String = "STAR";
    decimals: Int = 0; // 0 decimals = whole tokens only
    
    // Total Supply
    totalSupply: Int = 1_000_000_000; // 1 billion STAR tokens
    
    // Strategic Allocation
    gameplayRewards: Int = 400_000_000;
    burnReserve: Int = 200_000_000;
    liquidityDex: Int = 100_000_000;
    devTreasury: Int = 100_000_000;
    daoGovernance: Int = 100_000_000;
    marketingPartnerships: Int = 50_000_000;
    communityAirdrops: Int = 50_000_000;
    
    // Balances mapping: Address -> Balance
    balances: map<Address, Int> = emptyMap();
    
    // Allowances: (Owner, Spender) -> Amount
    allowances: map<(Address, Address), Int> = emptyMap();
    
    // Admin wallet (deployer)
    admin: Address;
    
    // Burn tracking
    totalBurned: Int = 0;
    
    // Passive income tracking for NFT holders
    nftHolderPassiveIncome: map<Address, Int> = emptyMap();
    
    // Contract deployment
    init(admin: Address) {
        self.admin = admin;
        
        // Initialize total supply in gameplay rewards wallet
        self.balances[admin] = self.totalSupply;
        
        emit("STAR Token initialized with 1 billion total supply");
    }
    
    // Get balance of an address
    fun balanceOf(address: Address): Int {
        return self.balances.get(address) ?? 0;
    }
    
    // Get total burned tokens
    fun getTotalBurned(): Int {
        return self.totalBurned;
    }
    
    // Get token info
    fun getTokenInfo(): (String, String, Int, Int, Int) {
        return (self.name, self.symbol, self.decimals, self.totalSupply, self.balanceOf(sender()));
    }
    
    // Get supply metrics
    fun getSupplyMetrics(): (Int, Int, Int, Int, Int, Int, Int, Int) {
        return (
            self.totalSupply,
            self.gameplayRewards,
            self.burnReserve,
            self.liquidityDex,
            self.devTreasury,
            self.daoGovernance,
            self.marketingPartnerships,
            self.communityAirdrops
        );
    }
    
    // Owner: transfer tokens to another address
    receive(msg: TokenTransfer) {
        require(self.balanceOf(sender()) >= msg.amount, "Insufficient balance");
        require(msg.amount > 0, "Amount must be positive");
        
        let balance = self.balanceOf(sender());
        balance -= msg.amount;
        self.balances[sender()] = balance;
        
        let receiverBalance = self.balanceOf(msg.destination);
        receiverBalance += msg.amount;
        self.balances[msg.destination] = receiverBalance;
        
        emit("Transfer from " + sender().toString() + " to " + msg.destination.toString() + ": " + msg.amount.toString());
    }
    
    // Burn tokens (remove from circulation)
    receive(msg: TokenBurn) {
        require(self.balanceOf(sender()) >= msg.amount, "Insufficient balance to burn");
        require(msg.amount > 0, "Burn amount must be positive");
        
        let balance = self.balanceOf(sender());
        balance -= msg.amount;
        self.balances[sender()] = balance;
        
        self.totalBurned += msg.amount;
        
        emit("Tokens burned by " + sender().toString() + ": " + msg.amount.toString());
    }
    
    // Admin: Mint tokens (only deployer can mint, fixed supply)
    receive(msg: MintTokens) {
        require(sender() == self.admin, "Only admin can mint tokens");
        require(self.balanceOf(self.admin) >= msg.amount, "Not enough tokens in admin reserve");
        
        // Transfer from admin to receiver
        let adminBalance = self.balanceOf(self.admin);
        adminBalance -= msg.amount;
        self.balances[self.admin] = adminBalance;
        
        let receiverBalance = self.balanceOf(msg.receiver);
        receiverBalance += msg.amount;
        self.balances[msg.receiver] = receiverBalance;
        
        emit("Tokens minted to " + msg.receiver.toString() + ": " + msg.amount.toString());
    }
    
    // Distribute passive income to NFT holders (called by off-chain service)
    receive(msg: DistributePassiveIncome) {
        require(sender() == self.admin, "Only admin can distribute passive income");
        require(msg.amount > 0, "Distribution amount must be positive");
        
        // Transfer from admin reserve to NFT holder
        let adminBalance = self.balanceOf(self.admin);
        require(adminBalance >= msg.amount, "Insufficient admin balance for distribution");
        
        adminBalance -= msg.amount;
        self.balances[self.admin] = adminBalance;
        
        let holderBalance = self.balanceOf(msg.nftHolder);
        holderBalance += msg.amount;
        self.balances[msg.nftHolder] = holderBalance;
        
        self.nftHolderPassiveIncome[msg.nftHolder] = (self.nftHolderPassiveIncome.get(msg.nftHolder) ?? 0) + msg.amount;
        
        emit("Passive income distributed to " + msg.nftHolder.toString() + ": " + msg.amount.toString());
    }
    
    // Admin: Set new admin address
    receive(msg: SetAdmin) {
        require(sender() == self.admin, "Only current admin can set new admin");
        self.admin = msg.newAdmin;
        emit("Admin changed to " + msg.newAdmin.toString());
    }
    
    // Emergency: Allow contract to receive TON
    receive() {
        emit("Contract received TON");
    }
}
