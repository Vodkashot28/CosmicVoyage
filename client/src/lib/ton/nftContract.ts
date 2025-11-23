// TON NFT Contract Configuration for Planet NFTs
// Contract should be deployed on TON testnet

export const TON_CONFIG = {
  testnet: {
    endpoint: 'https://testnet.toncenter.com/api/v2/',
    explorerUrl: 'https://testnet.tonviewer.com'
  }
};

// Planet NFT Contract Interface
export interface PlanetNFT {
  planetName: string;
  tokenId: number;
  metadataURI: string;
  timestamp: number;
  traits: {
    size: number;
    orbitRadius: number;
    discoveryOrder: number;
  };
}

// Mock contract address - user should deploy their own
export const CONTRACT_ADDRESS = (import.meta.env.VITE_NFT_CONTRACT_ADDRESS as string) ||
  'kQDf5lsW7dnyJ9Bv3cU8S-RVRDq9i8YhXPePQvbKUJl70LB'; // Example placeholder

export const DEPLOYER_ADDRESS = '0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01';

// Helper to generate planet NFT metadata
export function generatePlanetNFTMetadata(planetName: string, discoveryOrder: number, planetData: any) {
  return {
    name: `Planet ${planetName}`,
    description: `Discovered planet ${planetName} in order #${discoveryOrder}`,
    image: `ipfs://QmPlanet${planetName}`, // Would point to actual IPFS image
    attributes: [
      {
        trait_type: 'Planet Name',
        value: planetName
      },
      {
        trait_type: 'Discovery Order',
        value: discoveryOrder.toString()
      },
      {
        trait_type: 'Size',
        value: planetData.size.toString()
      },
      {
        trait_type: 'Orbit Radius',
        value: planetData.orbitRadius.toString()
      },
      {
        trait_type: 'Token Reward',
        value: planetData.tokenReward.toString()
      }
    ]
  };
}

// Helper to construct NFT minting message
export function createNFTMintMessage(planetName: string, discoveryOrder: number, walletAddress: string) {
  return {
    to: CONTRACT_ADDRESS,
    amount: '50000000', // 0.05 TON for gas
    init: null,
    body: {
      $$type: 'MintPlanetNFT' as const,
      recipient: walletAddress,
      planetName,
      discoveryOrder
    }
  };
}
