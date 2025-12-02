import "@stdlib/deploy";

/*
  Planet NFT Collection Contract (SEQ Standard)
  For Solar System Explorer game
  - Manages planet NFT collection metadata
  - Controls minting permissions
  - Stores collection-level data
  - Tracks total planets minted
*/

message Mint {
    queryId: UInt64;
    planet: String; // Planet name (Mercury, Venus, Earth, etc.)
    receiver: Address;
    amount: Int; // Should be 1 for NFTs
}

message SetBaseURI {
    newBaseURI: String;
}

message SetRoyalty {
    numerator: Int;
    denominator: Int;
}

message TokenTransfer {
    nftId: Int;
    receiver: Address;
}

struct CollectionInfo {
    name: String;
    symbol: String;
    description: String;
    nextNFTId: Int;
    totalMinted: Int;
}

struct RoyaltyInfo {
    numerator: Int;
    denominator: Int;
    destination: Address;
}

contract PlanetNFT with Deployable {
    // Collection Metadata
    name: String = "Solar System Planets";
    symbol: String = "PLANET";
    description: String = "Discover and own planets in the Solar System Explorer game";
    
    // Collection Owner (Game Master)
    owner: Address;
    
    // NFT Counter
    nextNFTId: Int = 0;
    totalMinted: Int = 0;
    
    // Base URI for metadata
    baseURI: String = "https://solarsystemexplorer.com/nft/";
    
    // Royalty Configuration (5% to game treasury)
    royaltyNumerator: Int = 5;
    royaltyDenominator: Int = 100;
    royaltyDestination: Address;
    
    // Planet Metadata Storage
    planetMintCount: map<String, Int> = emptyMap();
    nftOwners: map<Int, Address> = emptyMap();
    nftMetadata: map<Int, String> = emptyMap();
    
    // Discovery tracking
    discoveryOrder: map<Int, String> = emptyMap();
    
    // Allowed minters (game contract address)
    allowedMinters: map<Address, Bool> = emptyMap();
    
    init(owner: Address, royaltyDestination: Address) {
        self.owner = owner;
        self.royaltyDestination = royaltyDestination;
        self.allowedMinters.set(owner, true);
    }
    
    // Get collection info
    fun getCollectionInfo(): CollectionInfo {
        let info: CollectionInfo = CollectionInfo{
            name: self.name,
            symbol: self.symbol,
            description: self.description,
            nextNFTId: self.nextNFTId,
            totalMinted: self.totalMinted
        };
        return info;
    }
    
    // Get metadata URI for specific NFT
    fun getNFTMetadataURI(nftId: Int): String {
        return self.baseURI + nftId.toString() + ".json";
    }
    
    // Get owner of NFT
    fun getNFTOwner(nftId: Int): Address {
        let owner = self.nftOwners.get(nftId);
        if (owner == null) {
            return sender();
        } else {
            return owner!!;
        }
    }
    
    // Get planet mint count
    fun getPlanetMintCount(planet: String): Int {
        let count = self.planetMintCount.get(planet);
        if (count == null) {
            return 0;
        } else {
            return count!!;
        }
    }
    
    // Get total supply
    fun getTotalSupply(): Int {
        return self.totalMinted;
    }
    
    // Mint new planet NFT (only allowed minters)
    receive(msg: Mint) {
        let isAllowed = self.allowedMinters.get(sender());
        let allowed: Bool = false;
        if (isAllowed == null) {
            allowed = false;
        } else {
            allowed = isAllowed!!;
        }
        
        require(allowed || sender() == self.owner, "Not authorized to mint");
        require(msg.amount == 1, "Can only mint 1 NFT at a time");
        
        // Increment IDs
        let newNFTId = self.nextNFTId;
        self.nextNFTId += 1;
        self.totalMinted += 1;
        
        // Track planet mint count
        let planetCountOpt = self.planetMintCount.get(msg.planet);
        let planetCount: Int = 0;
        if (planetCountOpt == null) {
            planetCount = 0;
        } else {
            planetCount = planetCountOpt!!;
        }
        self.planetMintCount.set(msg.planet, planetCount + 1);
        
        // Store owner and metadata
        self.nftOwners.set(newNFTId, msg.receiver);
        self.nftMetadata.set(newNFTId, msg.planet);
        self.discoveryOrder.set(newNFTId, msg.planet);
        
        emit("Planet NFT minted: " + msg.planet + " (ID: " + newNFTId.toString() + ") for " + msg.receiver.toString());
    }
    
    // Transfer NFT to new owner
    receive(msg: TokenTransfer) {
        let owner = self.nftOwners.get(msg.nftId);
        let nftOwner: Address = sender();
        if (owner == null) {
            nftOwner = sender();
        } else {
            nftOwner = owner!!;
        }
        require(nftOwner == msg.receiver, "Not NFT owner");
        self.nftOwners.set(msg.nftId, msg.receiver);
        emit("NFT transferred: ID " + msg.nftId.toString() + " to " + msg.receiver.toString());
    }
    
    // Add minter address (only owner)
    fun addMinter(minter: Address) {
        require(sender() == self.owner, "Only owner can add minters");
        self.allowedMinters.set(minter, true);
    }
    
    // Remove minter (only owner)
    fun removeMinter(minter: Address) {
        require(sender() == self.owner, "Only owner can remove minters");
        self.allowedMinters.set(minter, false);
    }
    
    // Set new base URI (only owner)
    receive(msg: SetBaseURI) {
        require(sender() == self.owner, "Only owner can set base URI");
        self.baseURI = msg.newBaseURI;
    }
    
    // Update royalty (only owner)
    receive(msg: SetRoyalty) {
        require(sender() == self.owner, "Only owner can set royalty");
        self.royaltyNumerator = msg.numerator;
        self.royaltyDenominator = msg.denominator;
    }
    
    // Get royalty info
    fun getRoyaltyInfo(): RoyaltyInfo {
        let info: RoyaltyInfo = RoyaltyInfo{
            numerator: self.royaltyNumerator,
            denominator: self.royaltyDenominator,
            destination: self.royaltyDestination
        };
        return info;
    }
    
    // Emergency: Allow contract to receive TON
    receive() {
        emit("Collection received TON");
    }
}
