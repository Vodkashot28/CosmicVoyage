import "@stdlib/deploy";

message RecordBurn {
    playerAddress: Address;
    burnAmount: Int;
    burnType: String; // 'refinement', 'unification', 'smb', 'repair'
    planetName: String;
}

message QueryBurnHistory {
    playerAddress: Address;
}

contract StellarImmortalityLedger with Deployable {
    const CONSTELLATION_THRESHOLD: Int = 1000; // 1000 STAR = 1 constellation marker
    const MAX_CONSTELLATION_LORE: String = "Immortal Collector";
    
    owner: Address;
    totalBurnsRecorded: Int = 0;
    totalSTARBurned: Int = 0;
    
    // Maps to track burn history
    playerBurnTotals: map<Address, Int> = emptyMap();
    playerConstellationCount: map<Address, Int> = emptyMap();
    burnRecords: map<String, String> = emptyMap(); // timestampId -> burn details
    
    init() {
        self.owner = sender();
    }
    
    fun getConstellationCount(playerAddress: Address): Int {
        let total: Int? = self.playerBurnTotals.get(playerAddress);
        if (total == null) {
            return 0;
        }
        return total!! / CONSTELLATION_THRESHOLD;
    }
    
    fun getImmortality Score(playerAddress: Address): Int {
        let total: Int? = self.playerBurnTotals.get(playerAddress);
        return total == null ? 0 : total!!;
    }
    
    fun getPlayerLore(playerAddress: Address): String {
        let constellations: Int = self.getConstellationCount(playerAddress);
        let total: Int = self.getImmortality Score(playerAddress);
        
        if (constellations >= 100) {
            return "Cosmic Deity ✨✨✨";
        }
        if (constellations >= 50) {
            return "Stellar Legend ✨✨";
        }
        if (constellations >= 10) {
            return "Immortal Collector ✨";
        }
        if (total >= 1000) {
            return "Burning Soul";
        }
        return "Novice Explorer";
    }
    
    receive(msg: RecordBurn) {
        require(sender() == self.owner, "Only owner can record burns");
        require(msg.burnAmount > 0, "Burn amount must be positive");
        
        // Update player totals
        let currentTotal: Int? = self.playerBurnTotals.get(msg.playerAddress);
        let newTotal: Int = currentTotal == null ? msg.burnAmount : currentTotal!! + msg.burnAmount;
        self.playerBurnTotals.set(msg.playerAddress, newTotal);
        
        // Update constellation count
        let constellations: Int = self.getConstellationCount(msg.playerAddress);
        self.playerConstellationCount.set(msg.playerAddress, constellations);
        
        // Record the burn event
        let recordId: String = msg.playerAddress.toString() + "_" + now().toString();
        let recordData: String = msg.burnType + "|" + msg.burnAmount.toString() + "|" + msg.planetName + "|" + now().toString();
        self.burnRecords.set(recordId, recordData);
        
        // Update totals
        self.totalBurnsRecorded = self.totalBurnsRecorded + 1;
        self.totalSTARBurned = self.totalSTARBurned + msg.burnAmount;
        
        emit "BurnRecorded(" + msg.playerAddress.toString() + ", " + msg.burnAmount.toString() + ", " + msg.burnType + ")";
    }
    
    get fun getTopConstelations(): String {
        return "Leaderboard querying not yet implemented";
    }
    
    get fun getTotalBurns(): Int {
        return self.totalBurnsRecorded;
    }
    
    get fun getTotalSTARBurned(): Int {
        return self.totalSTARBurned;
    }
    
    get fun getPlayerStats(playerAddress: Address): String {
        let total: Int = self.getImmortality Score(playerAddress);
        let constellations: Int = self.getConstellationCount(playerAddress);
        let lore: String = self.getPlayerLore(playerAddress);
        
        return "Total Burned: " + total.toString() + " | Constellations: " + constellations.toString() + " | Lore: " + lore;
    }
}
