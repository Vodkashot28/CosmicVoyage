import "@stdlib/deploy";

/*
  Planet NFT Item Contract (Individual NFT)
  - Represents single planet NFT
  - Stores planet metadata
  - Handles ownership and transfers
  - Tracks NFT traits and discovery order
*/

message Transfer {
    queryId: UInt64;
    newOwner: Address;
    responseDestination: Address;
    customPayload: Cell?;
    forwardAmount: Int;
    forwardPayload: Cell;
}

message GetStaticData {
    queryId: UInt64;
}

contract PlanetNFTItem with Deployable {
    // NFT Properties
    itemIndex: Int;
    collectionAddress: Address;
    owner: Address;
    
    // Planet Data
    planetName: String;
    discoveryOrder: Int; // Sequential discovery number
    discoveredAt: Int; // Timestamp of discovery
    
    // Traits
    rarity: String; // "common", "rare", "epic", "legendary"
    glowColor: String; // Hex color of glow ring
    
    // Passive Income Status
    earnsPassiveIncome: Bool = true;
    passiveIncomeRate: Int = 50; // 0.5 STAR per hour (in basis points)
    
    // Metadata
    imageURI: String;
    attributes: map<String, String> = emptyMap();
    
    init(
        itemIndex: Int,
        collectionAddress: Address,
        owner: Address,
        planetName: String,
        discoveryOrder: Int,
        glowColor: String
    ) {
        self.itemIndex = itemIndex;
        self.collectionAddress = collectionAddress;
        self.owner = owner;
        self.planetName = planetName;
        self.discoveryOrder = discoveryOrder;
        self.glowColor = glowColor;
        self.discoveredAt = now();
        
        // Assign rarity based on discovery order
        // First discovered = easiest to get = common
        // Last discovered = hardest to get = legendary
        if (discoveryOrder == 1) {
            self.rarity = "common"; // Mercury: everyone gets this first
        } else if (discoveryOrder <= 3) {
            self.rarity = "rare"; // Venus, Earth
        } else if (discoveryOrder <= 6) {
            self.rarity = "epic"; // Mars, Jupiter, Saturn
        } else {
            self.rarity = "legendary"; // Uranus, Neptune, Pluto: hardest to reach
        }
        
        // Set image URI
        self.imageURI = "https://solarsystemexplorer.com/nft/" + itemIndex.toString() + ".json";
        
        // Initialize attributes
        self.attributes["planet"] = planetName;
        self.attributes["rarity"] = self.rarity;
        self.attributes["glowColor"] = glowColor;
        self.attributes["discoveryOrder"] = discoveryOrder.toString();
        self.attributes["discoveredAt"] = now().toString();
    }
    
    // Get NFT metadata
    fun getNFTData(): (String, String, Int, String, String) {
        return (self.planetName, self.rarity, self.itemIndex, self.glowColor, self.imageURI);
    }
    
    // Get owner
    fun getOwner(): Address {
        return self.owner;
    }
    
    // Get collection address
    fun getCollectionAddress(): Address {
        return self.collectionAddress;
    }
    
    // Get passive income info
    fun getPassiveIncomeInfo(): (Bool, Int, Int) {
        return (self.earnsPassiveIncome, self.passiveIncomeRate, self.discoveredAt);
    }
    
    // Transfer ownership
    receive(msg: Transfer) {
        require(sender() == self.owner, "Only owner can transfer");
        self.owner = msg.newOwner;
        emit("NFT transferred from " + sender().toString() + " to " + msg.newOwner.toString());
    }
    
    // Get static data (metadata)
    receive(msg: GetStaticData) {
        emit("Planet: " + self.planetName + ", Rarity: " + self.rarity + ", Index: " + self.itemIndex.toString());
    }
    
    // Set custom attribute
    fun setAttribute(key: String, value: String) {
        require(sender() == self.owner || sender() == self.collectionAddress, "Unauthorized");
        self.attributes[key] = value;
    }
    
    // Get attribute
    fun getAttribute(key: String): String {
        return self.attributes.get(key) ?? "";
    }
    
    // Enable/disable passive income
    fun setPassiveIncomeStatus(enabled: Bool) {
        require(sender() == self.owner || sender() == self.collectionAddress, "Unauthorized");
        self.earnsPassiveIncome = enabled;
    }
    
    // Get full metadata JSON
    fun getMetadataJSON(): String {
        return "{\"name\":\"" + self.planetName + "\",\"rarity\":\"" + self.rarity + 
               "\",\"glowColor\":\"" + self.glowColor + "\",\"image\":\"" + self.imageURI + "\"}";
    }
    
    // Emergency: Allow contract to receive TON
    receive() {
        emit("NFT item received TON");
    }
}
