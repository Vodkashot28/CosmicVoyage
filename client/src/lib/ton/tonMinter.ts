import { CONTRACT_ADDRESS, createNFTMintMessage, NFTMintParams } from "./nftContract";
import { generateGLTFNFTMetadata, uploadNFTToIPFS } from "./gltfNFT";
import { beginCell } from "@ton/core"; // Requires @ton/core to be installed

export class PlanetNFTMinter {
  private endpoint: string;

  constructor(endpoint: string = import.meta.env.VITE_TON_RPC_ENDPOINT || "https://testnet.toncenter.com/api/v2/") {
    this.endpoint = endpoint;
  }

  /**
   * Helper to create the standard TEP-62 off-chain content cell (URI format)
   * This Cell holds the link to the NFT's IPFS metadata JSON.
   */
  private async createContentCell(ipfsHash: string) {
    // TEP-62 standard: The content cell must be prefixed by 01 for off-chain content URI
    const fullUri = `https://ipfs.io/ipfs/${ipfsHash}`;

    // Lazy-load for safety
    const { beginCell } = await import("@ton/core");

    return beginCell()
        .storeUint(1, 8) // Indicator for off-chain content URI
        .storeStringRefTail(fullUri)
        .endCell();
  }

  /**
   * Mint a planet NFT to a wallet address
   * This function now returns the TON Connect compatible payload.
   * NOTE: The client must use this payload to send the transaction.
   */
  async mintPlanetNFT(
    walletAddress: string,
    planetName: string,
    discoveryOrder: number,
    planetData: any
  ) {
    try {
      console.log(`[MINTER] Initiating NFT mint for ${planetName} to ${walletAddress}`);

      // 1. Generate Metadata (using gltfNFT.ts logic)
      const gltfMetadata = generateGLTFNFTMetadata(planetName, discoveryOrder, planetData);

      // 2. Upload Metadata to IPFS (using gltfNFT.ts logic)
      // CRITICAL: Ensure uploadNFTToIPFS is fully implemented to return a real hash
      const ipfsHash = await uploadNFTToIPFS(gltfMetadata);

      // 3. Prepare the Content Cell (CRITICAL for TEP-62 compatibility)
      const itemContentCell = await this.createContentCell(ipfsHash);

      // 4. Determine the next NFT index
      // TODO: Implement actual lookup (e.g., call get_collection_data to get next index).
      // Using discoveryOrder as a placeholder, but this must be reliable in production.
      const itemIndex = discoveryOrder;

      // 5. Create the TON Connect payload using the refactored function from nftContract.ts
      const mintParams: NFTMintParams = {
        planetName,
        receiverAddress: walletAddress,
        discoveryOrder,
        glowColor: gltfMetadata.metadata.attributes.find(a => a.trait_type === 'Glow Color')?.value || '#FFFFFF'
      };

      const mintPayload = await createNFTMintMessage(
        mintParams,
        itemIndex,
        itemContentCell
      );

      console.log(`[MINTER] Ready to send mint transaction to ${mintPayload.to}`);
      console.log("[MINTER] TON Connect Payload:", mintPayload);

      return mintPayload; // TON Connect compatible payload
    } catch (error) {
      console.error("[MINTER] Failed to mint planet NFT:", error);
      throw error;
    }
  } // <-- FIX: Removed the extraneous 'a'

  /**
   * Get NFTs owned by an address
   * CRITICAL FIX: Uses a dedicated TON indexer endpoint for reliable NFT retrieval.
   */
  async getNFTsByAddress(address: string): Promise<any[]> {
    try {
      console.log(`[MINTER] Fetching NFTs for address: ${address}`);

      // FIX: Replace generic getAccountState with a specialized indexer
      // NOTE: This endpoint assumes you have access to a better v2/v3 indexer (like TonAPI)
      const indexerEndpoint = `https://tonapi.io/v2/nfts/collections/${CONTRACT_ADDRESS}/items?owner=${address}`;

      const response = await fetch(indexerEndpoint);
      if (!response.ok) {
        throw new Error(`Indexer API failed with status ${response.status}`);
      }
      const data = await response.json();

      console.log("[MINTER] NFT query result:", data);

      // Assuming the indexer returns an array of items under 'nft_items'
      return data.nft_items || [];
    } catch (error) {
      console.error("[MINTER] Failed to fetch NFTs:", error);
      return [];
    }
  }

  /**
   * Verify contract is deployed
   */
  async verifyContractDeployed(): Promise<boolean> {
    try {
      const response = await fetch(`${this.endpoint}/getContractState?address=${CONTRACT_ADDRESS}`);
      const data = await response.json();

      if (!data.ok) {
        console.warn(`Contract ${CONTRACT_ADDRESS} not found on testnet`);
        return false;
      }

      console.log(`Contract verification successful for ${CONTRACT_ADDRESS}`);
      return true;
    } catch (error) {
      console.error("Contract verification failed:", error);
      return false;
    }
  }
}

export const nftMinter = new PlanetNFTMinter();
