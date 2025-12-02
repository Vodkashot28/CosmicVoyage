import "@stdlib/deploy";

message Mint {
    queryId: Int;
    planet: String;
    receiver: Address;
    amount: Int;
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
    name: String = "Solar System Planets";
    symbol: String = "PLANET";
    description: String = "Discover and own planets in the Solar System Explorer game";
    owner: Address;
    nextNFTId: Int = 0;
    totalMinted: Int = 0;
    baseURI: String = "https://solarsystemexplorer.com/nft/";
    royaltyNumerator: Int = 5;
    royaltyDenominator: Int = 100;
    royaltyDestination: Address;
    
    nftOwners: map<Int, Address> = emptyMap();
    allowedMinters: map<Address, Bool> = emptyMap();
    
    init(owner: Address, royaltyDestination: Address) {
        self.owner = owner;
        self.royaltyDestination = royaltyDestination;
        self.allowedMinters.set(owner, true);
    }
    
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
    
    fun getNFTMetadataURI(nftId: Int): String {
        return "https://solarsystemexplorer.com/nft/metadata.json";
    }
    
    fun getNFTOwner(nftId: Int): Address {
        let owner = self.nftOwners.get(nftId);
        if (owner == null) {
            return sender();
        } else {
            return owner!!;
        }
    }
    
    fun getTotalSupply(): Int {
        return self.totalMinted;
    }
    
    receive(msg: Mint) {
        let isAllowed = self.allowedMinters.get(sender());
        let allowed: Bool = false;
        if (isAllowed != null) {
            allowed = isAllowed!!;
        }
        
        require(allowed || sender() == self.owner, "Not authorized to mint");
        require(msg.amount == 1, "Can only mint 1 NFT at a time");
        
        let newNFTId = self.nextNFTId;
        self.nextNFTId += 1;
        self.totalMinted += 1;
        
        self.nftOwners.set(newNFTId, msg.receiver);
    }
    
    receive(msg: TokenTransfer) {
        let owner = self.nftOwners.get(msg.nftId);
        let nftOwner: Address = sender();
        if (owner != null) {
            nftOwner = owner!!;
        }
        require(nftOwner == msg.receiver, "Not NFT owner");
        self.nftOwners.set(msg.nftId, msg.receiver);
    }
    
    fun addMinter(minter: Address) {
        require(sender() == self.owner, "Only owner can add minters");
        self.allowedMinters.set(minter, true);
    }
    
    fun removeMinter(minter: Address) {
        require(sender() == self.owner, "Only owner can remove minters");
        self.allowedMinters.set(minter, false);
    }
    
    receive(msg: SetBaseURI) {
        require(sender() == self.owner, "Only owner can set base URI");
        self.baseURI = msg.newBaseURI;
    }
    
    receive(msg: SetRoyalty) {
        require(sender() == self.owner, "Only owner can set royalty");
        self.royaltyNumerator = msg.numerator;
        self.royaltyDenominator = msg.denominator;
    }
    
    fun getRoyaltyInfo(): RoyaltyInfo {
        let info: RoyaltyInfo = RoyaltyInfo{
            numerator: self.royaltyNumerator,
            denominator: self.royaltyDenominator,
            destination: self.royaltyDestination
        };
        return info;
    }
    
    receive() {
    }
}
