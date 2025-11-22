// NFT-related data schemas for type safety

export interface PlanetNFTRecord {
  id: string;
  planetName: string;
  walletAddress: string;
  nftTokenId: string;
  transactionHash: string;
  metadataURI: string;
  discoveryTimestamp: number;
  chainStatus: 'pending' | 'minted' | 'failed';
  blockHeight?: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}
