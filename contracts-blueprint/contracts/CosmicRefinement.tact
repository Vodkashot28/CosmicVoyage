import "@stdlib/deploy";
import "@stdlib/stoppable";

message RefinePlanet {
    planetName: String;
    starAmount: Int;
}

contract CosmicRefinement with Deployable {
    const BURN_ADDRESS: Address = address("UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASJLM");
    
    owner: Address;
    planetName: String;
    refinementLevel: Int = 0;
    totalStarBurned: Int = 0;
    lastRefinementTime: Int = 0;
    
    init(planetName: String) {
        self.owner = sender();
        self.planetName = planetName;
        self.lastRefinementTime = now();
    }
    
    fun getRefinementCost(level: Int): Int {
        if (level == 1) { return 50; }
        if (level == 2) { return 125; }
        if (level == 3) { return 200; }
        if (level == 4) { return 300; }
        if (level == 5) { return 450; }
        if (level == 6) { return 650; }
        if (level == 7) { return 900; }
        if (level == 8) { return 1200; }
        return 0;
    }
    
    fun getYieldMultiplier(): Int {
        // Returns basis points (10000 = 1.0x)
        // Each level adds 2% (200 basis points)
        return 10000 + (self.refinementLevel * 200);
    }
    
    fun getNextRefinementCost(): Int {
        if (self.refinementLevel >= 8) {
            return 0; // Max level reached
        }
        return self.getRefinementCost(self.refinementLevel + 1);
    }
    
    fun canRefine(): Bool {
        return self.refinementLevel < 8;
    }
    
    receive(msg: RefinePlanet) {
        require(sender() == self.owner, "Only owner can refine");
        require(self.refinementLevel < 8, "Max refinement level reached");
        
        let requiredCost: Int = self.getRefinementCost(self.refinementLevel + 1);
        require(msg.starAmount >= requiredCost, "Insufficient STAR for refinement");
        
        // Burn STAR tokens by sending to burn address
        send(SendParameters{
            to: self.BURN_ADDRESS,
            amount: requiredCost * 1000000000, // Convert to nanotons (1 STAR = 1e9 units in simulation)
            mode: SendIgnore
        });
        
        self.refinementLevel = self.refinementLevel + 1;
        self.totalStarBurned = self.totalStarBurned + requiredCost;
        self.lastRefinementTime = now();
        
        // Emit event-like log
        emit "RefinementCompleted(" + self.planetName + ", " + self.refinementLevel.toString() + ", " + requiredCost.toString() + ")";
    }
    
    get fun currentLevel(): Int {
        return self.refinementLevel;
    }
    
    get fun yieldMultiplier(): Int {
        return self.getYieldMultiplier();
    }
    
    get fun nextCost(): Int {
        return self.getNextRefinementCost();
    }
}
