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
        self.allowedMinters[owner] = true;
    }
    
    // Get collection info
    fun getCollectionInfo(): (String, String, String, Int, Int) {
        return (self.name, self.symbol, self.description, self.nextNFTId, self.totalMinted);
    }
    
    // Get metadata URI for specific NFT
    fun getNFTMetadataURI(nftId: Int): String {
        return self.baseURI + nftId.toString() + ".json";
    }
    
    // Get owner of NFT
    fun getNFTOwner(nftId: Int): Address {
        return self.nftOwners.get(nftId) ?? sender();
    }
    
    // Get planet mint count
    fun getPlanetMintCount(planet: String): Int {
        return self.planetMintCount.get(planet) ?? 0;
    }
    
    // Get total supply
    fun getTotalSupply(): Int {
        return self.totalMinted;
    }
    
    // Mint new planet NFT (only allowed minters)
    receive(msg: Mint) {
        require(self.allowedMinters.get(sender()) ?? false || sender() == self.owner, "Not authorized to mint");
        require(msg.amount == 1, "Can only mint 1 NFT at a time");
        
        // Increment IDs
        let newNFTId = self.nextNFTId;
        self.nextNFTId += 1;
        self.totalMinted += 1;
        
        // Track planet mint count
        let planetCount = self.planetMintCount.get(msg.planet) ?? 0;
        self.planetMintCount[msg.planet] = planetCount + 1;
        
        // Store owner and metadata
        self.nftOwners[newNFTId] = msg.receiver;
        self.nftMetadata[newNFTId] = msg.planet;
        self.discoveryOrder[newNFTId] = msg.planet;
        
        emit("Planet NFT minted: " + msg.planet + " (ID: " + newNFTId.toString() + ") for " + msg.receiver.toString());
    }
    
    // Transfer NFT to new owner
    receive(msg: TokenTransfer) {
        require(self.nftOwners.get(msg.nftId) ?? sender() == msg.receiver, "Not NFT owner");
        self.nftOwners[msg.nftId] = msg.receiver;
        emit("NFT transferred: ID " + msg.nftId.toString() + " to " + msg.receiver.toString());
    }
    
    // Add minter address (only owner)
    fun addMinter(minter: Address) {
        require(sender() == self.owner, "Only owner can add minters");
        self.allowedMinters[minter] = true;
    }
    
    // Remove minter (only owner)
    fun removeMinter(minter: Address) {
        require(sender() == self.owner, "Only owner can remove minters");
        self.allowedMinters[minter] = false;
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
    fun getRoyaltyInfo(): (Int, Int, Address) {
        return (self.royaltyNumerator, self.royaltyDenominator, self.royaltyDestination);
    }
    
    // Emergency: Allow contract to receive TON
    receive() {
        emit("Collection received TON");
    }
}

message TokenTransfer {
    nftId: Int;
    receiver: Address;
}
