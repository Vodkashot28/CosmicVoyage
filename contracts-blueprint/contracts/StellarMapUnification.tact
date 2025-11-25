import "@stdlib/deploy";
import "@stdlib/stoppable";

message UnifyForImmortal {
    mainPlanetNames: String;
    dwarfPlanetNames: String;
    starAmount: Int;
}

contract StellarMapUnification with Deployable {
    const BURN_ADDRESS: Address = address("UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASJLM");
    const UNIFICATION_COST: Int = 2500;
    const PRESTIGE_BONUS_BASIS_POINTS: Int = 10; // 0.1% = 10 basis points out of 10000
    
    owner: Address;
    hasAchievedImmortal: Bool = false;
    immortalAchievedAt: Int = 0;
    mainPlanetsUsed: String = "";
    dwarfPlanetsUsed: String = "";
    
    init() {
        self.owner = sender();
    }
    
    fun isImmortal(): Bool {
        return self.hasAchievedImmortal;
    }
    
    fun getPrestigeBonus(): Int {
        return self.hasAchievedImmortal ? PRESTIGE_BONUS_BASIS_POINTS : 0;
    }
    
    fun countCommaElements(str: String): Int {
        let count: Int = 1;
        let i: Int = 0;
        while (i < str.length()) {
            if (str.charAt(i) == ",") {
                count = count + 1;
            }
            i = i + 1;
        }
        return count;
    }
    
    receive(msg: UnifyForImmortal) {
        require(sender() == self.owner, "Only owner can unify");
        require(!self.hasAchievedImmortal, "Already achieved immortal status");
        require(msg.starAmount >= UNIFICATION_COST, "Insufficient STAR for unification");
        
        // Count planets in the provided strings
        let mainCount: Int = self.countCommaElements(msg.mainPlanetNames);
        let dwarfCount: Int = self.countCommaElements(msg.dwarfPlanetNames);
        
        require(mainCount >= 3, "Need at least 3 main planets");
        require(dwarfCount >= 2, "Need at least 2 dwarf planets");
        
        // Burn STAR tokens
        send(SendParameters{
            to: self.BURN_ADDRESS,
            amount: UNIFICATION_COST * 1000000000,
            mode: SendIgnore
        });
        
        self.hasAchievedImmortal = true;
        self.immortalAchievedAt = now();
        self.mainPlanetsUsed = msg.mainPlanetNames;
        self.dwarfPlanetsUsed = msg.dwarfPlanetNames;
        
        emit "ImmortalStatusGranted(" + self.owner.toString() + ", " + self.immortalAchievedAt.toString() + ")";
    }
    
    get fun immortalStatus(): Bool {
        return self.hasAchievedImmortal;
    }
    
    get fun prestigeBonus(): Int {
        return self.getPrestigeBonus();
    }
    
    get fun unificationInfo(): String {
        if (!self.hasAchievedImmortal) {
            return "Not yet achieved";
        }
        return "Achieved at " + self.immortalAchievedAt.toString();
    }
}
