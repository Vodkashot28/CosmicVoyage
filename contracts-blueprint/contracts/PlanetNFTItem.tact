import "@stdlib/deploy";

message Transfer {
    queryId: Int;
    newOwner: Address;
    responseDestination: Address;
    customPayload: Cell?;
    forwardAmount: Int;
    forwardPayload: Cell;
}

message GetStaticData {
    queryId: Int;
}

struct NFTData {
    planetName: String;
    rarity: String;
    itemIndex: Int;
    glowColor: String;
    imageURI: String;
}

struct PassiveIncomeData {
    earnsPassiveIncome: Bool;
    passiveIncomeRate: Int;
    discoveredAt: Int;
}

contract PlanetNFTItem with Deployable {
    itemIndex: Int;
    collectionAddress: Address;
    owner: Address;
    planetName: String;
    discoveryOrder: Int;
    discoveredAt: Int;
    rarity: String;
    glowColor: String;
    earnsPassiveIncome: Bool = true;
    passiveIncomeRate: Int = 50;
    imageURI: String = "";
    
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
        self.imageURI = "https://solarsystemexplorer.com/nft/planet.json";
        
        if (discoveryOrder == 1) {
            self.rarity = "common";
        } else if (discoveryOrder <= 3) {
            self.rarity = "rare";
        } else if (discoveryOrder <= 6) {
            self.rarity = "epic";
        } else {
            self.rarity = "legendary";
        }
    }
    
    fun getNFTData(): NFTData {
        let data: NFTData = NFTData{
            planetName: self.planetName,
            rarity: self.rarity,
            itemIndex: self.itemIndex,
            glowColor: self.glowColor,
            imageURI: self.imageURI
        };
        return data;
    }
    
    fun getOwner(): Address {
        return self.owner;
    }
    
    fun getCollectionAddress(): Address {
        return self.collectionAddress;
    }
    
    fun getPassiveIncomeInfo(): PassiveIncomeData {
        let data: PassiveIncomeData = PassiveIncomeData{
            earnsPassiveIncome: self.earnsPassiveIncome,
            passiveIncomeRate: self.passiveIncomeRate,
            discoveredAt: self.discoveredAt
        };
        return data;
    }
    
    receive(msg: Transfer) {
        require(sender() == self.owner, "Only owner can transfer");
        self.owner = msg.newOwner;
    }
    
    receive(msg: GetStaticData) {
    }
    
    fun setPassiveIncomeStatus(enabled: Bool) {
        require(sender() == self.owner || sender() == self.collectionAddress, "Unauthorized");
        self.earnsPassiveIncome = enabled;
    }
    
    fun getMetadataJSON(): String {
        return "{\"name\":\"Planet\",\"rarity\":\"legendary\",\"image\":\"planet.json\"}";
    }
    
    receive() {
    }
}
