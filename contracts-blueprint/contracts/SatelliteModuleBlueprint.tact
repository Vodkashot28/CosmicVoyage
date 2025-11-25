import "@stdlib/deploy";
import "@stdlib/stoppable";

message PurchaseSMB {
    blueprintType: String;
    starAmount: Int;
}

message StakeSMBRequest {
    nftName: String;
    starAmount: Int;
    stakeDuration: Int;
}

message ClaimSMBReward {
    stakingId: String;
}

contract SatelliteModuleBlueprint with Deployable {
    const BURN_ADDRESS: Address = address("UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASJLM");
    const SMB_DIRECT_COST: Int = 250; // STAR
    const SMB_STAKE_COST: Int = 50; // STAR
    const SMB_STAKE_DURATION: Int = 604800; // 7 days in seconds
    const SMB_DEFAULT_DURATION: Int = 2592000; // 30 days default
    
    owner: Address;
    totalSMBsPurchased: Int = 0;
    totalSMBsStaked: Int = 0;
    
    // Maps to track staking status
    stakingMap: map<String, Int> = emptyMap();
    stakingStartTime: map<String, Int> = emptyMap();
    
    init() {
        self.owner = sender();
    }
    
    fun validateBlueprintType(typeStr: String): Bool {
        return typeStr == "boost" || 
               typeStr == "jump" || 
               typeStr == "discovery" || 
               typeStr == "refinement" || 
               typeStr == "lucky";
    }
    
    receive(msg: PurchaseSMB) {
        require(sender() == self.owner, "Only owner can purchase SMBs");
        require(msg.starAmount >= SMB_DIRECT_COST, "Insufficient STAR for SMB purchase");
        require(self.validateBlueprintType(msg.blueprintType), "Invalid blueprint type");
        
        // Burn STAR tokens
        send(SendParameters{
            to: self.BURN_ADDRESS,
            amount: SMB_DIRECT_COST * 1000000000,
            mode: SendIgnore
        });
        
        self.totalSMBsPurchased = self.totalSMBsPurchased + 1;
        
        emit "SMBPurchased(" + msg.blueprintType + ", " + SMB_DIRECT_COST.toString() + ")";
    }
    
    receive(msg: StakeSMBRequest) {
        require(sender() == self.owner, "Only owner can stake for SMB");
        require(msg.starAmount >= SMB_STAKE_COST, "Insufficient STAR for staking");
        require(msg.nftName.length() > 0, "NFT name required for staking");
        
        // Lock STAR and NFT
        send(SendParameters{
            to: self.BURN_ADDRESS,
            amount: SMB_STAKE_COST * 1000000000,
            mode: SendIgnore
        });
        
        // Create unique staking ID
        let stakingId: String = msg.nftName + "_" + now().toString();
        self.stakingMap.set(stakingId, 1); // 1 = active stake
        self.stakingStartTime.set(stakingId, now());
        
        self.totalSMBsStaked = self.totalSMBsStaked + 1;
        
        emit "SMBStakingInitiated(" + stakingId + ", " + SMB_STAKE_DURATION.toString() + ")";
    }
    
    receive(msg: ClaimSMBReward) {
        require(sender() == self.owner, "Only owner can claim reward");
        
        let stakingStatus: Int? = self.stakingMap.get(msg.stakingId);
        require(stakingStatus != null, "Staking ID not found");
        require(stakingStatus == 1, "Staking already claimed or invalid");
        
        let startTime: Int? = self.stakingStartTime.get(msg.stakingId);
        require(startTime != null, "Start time not found");
        require(now() >= startTime!! + SMB_STAKE_DURATION, "Staking period not yet complete");
        
        // Mark as claimed
        self.stakingMap.set(msg.stakingId, 2); // 2 = claimed
        
        emit "SMBClaimed(" + msg.stakingId + ")";
    }
    
    get fun isPurchasable(): Bool {
        return true;
    }
    
    get fun isStakingAvailable(): Bool {
        return true;
    }
    
    get fun getTotalPurchased(): Int {
        return self.totalSMBsPurchased;
    }
    
    get fun getTotalStaked(): Int {
        return self.totalSMBsStaked;
    }
    
    get fun getDirectCost(): Int {
        return SMB_DIRECT_COST;
    }
    
    get fun getStakeCost(): Int {
        return SMB_STAKE_COST;
    }
}
