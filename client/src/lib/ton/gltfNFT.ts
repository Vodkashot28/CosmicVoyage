// glTF 3D Model NFT Generation

export interface GLTFNFTModel {
  planetName: string;
  discoveryOrder: number;
  modelUrl: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    external_url: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

// Map planets to 3D model assets
export const PLANET_3D_MODELS: Record<string, string> = {
  Mercury: '/models/mercury.glb',
  Venus: '/models/venus.glb',
  Earth: '/models/earth.glb',
  Mars: '/models/mars.glb',
  Jupiter: '/models/jupiter.glb',
  Saturn: '/models/saturn.glb',
  Uranus: '/models/uranus.glb',
  Neptune: '/models/neptune.glb'
};

// Generate glTF NFT metadata for IPFS
export function generateGLTFNFTMetadata(
  planetName: string,
  discoveryOrder: number,
  planetData: any
): GLTFNFTModel {
  const modelUrl = PLANET_3D_MODELS[planetName] || '/models/default.glb';
  
  return {
    planetName,
    discoveryOrder,
    modelUrl,
    metadata: {
      name: `${planetName} Planet NFT #${discoveryOrder}`,
      description: `A unique 3D representation of the planet ${planetName}, discovered as the #${discoveryOrder}th planet in the Solar System Explorer game. This NFT contains a detailed 3D model and complete astronomical data.`,
      image: `ipfs://QmPlanet${planetName}Discovery${discoveryOrder}`,
      external_url: `https://solarsystem-explorer.app/planet/${planetName}`,
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
          trait_type: 'Size (relative)',
          value: planetData.size.toString()
        },
        {
          trait_type: 'Orbit Radius (million km)',
          value: planetData.orbitRadius.toString()
        },
        {
          trait_type: 'Token Reward',
          value: planetData.tokenReward.toString()
        },
        {
          trait_type: 'Model Format',
          value: 'glTF 2.0 (GLB)'
        },
        {
          trait_type: 'Rarity',
          value: getRarityTier(discoveryOrder)
        }
      ]
    }
  };
}

// Get rarity tier based on discovery order
function getRarityTier(discoveryOrder: number): string {
  if (discoveryOrder === 1) return 'Common';
  if (discoveryOrder <= 3) return 'Uncommon';
  if (discoveryOrder <= 6) return 'Rare';
  if (discoveryOrder <= 8) return 'Legendary';
  return 'Mythic';
}

// NFT Storage on IPFS (Pinata or similar service)
export async function uploadNFTToIPFS(nftData: GLTFNFTModel): Promise<string> {
  try {
    // In production, this would upload to Pinata or similar IPFS service
    // For now, we return a mock IPFS hash
    const mockHash = `QmPlanet${nftData.planetName}${Date.now()}`;
    console.log(`NFT metadata uploaded to IPFS: ${mockHash}`, nftData);
    return mockHash;
  } catch (error) {
    console.error('Failed to upload NFT to IPFS:', error);
    throw error;
  }
}

// Create NFT smart contract call data
export function createNFTMintCallData(
  walletAddress: string,
  gltfNFT: GLTFNFTModel,
  ipfsHash: string
) {
  return {
    to: walletAddress,
    amount: '50000000', // 0.05 TON gas
    payload: {
      type: 'nft-mint',
      planetName: gltfNFT.planetName,
      discoveryOrder: gltfNFT.discoveryOrder,
      ipfsHash,
      modelUrl: gltfNFT.modelUrl,
      metadata: gltfNFT.metadata
    }
  };
}
