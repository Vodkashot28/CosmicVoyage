import { CONTRACT_ADDRESS, DEPLOYER_ADDRESS, generatePlanetNFTMetadata } from "./nftContract";

export class PlanetNFTMinter {
  private endpoint: string;

  constructor(endpoint: string = import.meta.env.VITE_TON_RPC_ENDPOINT || "https://testnet.toncenter.com/api/v2/") {
    this.endpoint = endpoint;
  }

  /**
   * Mint a planet NFT to a wallet address
   * Note: This requires the contract to be deployed and callable via TON Connect
   */
  async mintPlanetNFT(
    walletAddress: string,
    planetName: string,
    discoveryOrder: number,
    planetData: any
  ): Promise<string> {
    try {
      console.log(`Initiating NFT mint for ${planetName} to ${walletAddress}`);

      // Generate metadata
      const metadata = generatePlanetNFTMetadata(planetName, discoveryOrder, planetData);

      // TODO: integrate with TON Connect / tonweb to send actual mint transaction
      // For now, return a mock tx hash
      const mockTxHash = `${planetName.toLowerCase()}_nft_${Date.now()}`;

      console.log("Planet NFT metadata prepared:", metadata);
      console.log("Ready for minting with tx hash:", mockTxHash);
      console.log("Contract address for deployment:", CONTRACT_ADDRESS);

      return mockTxHash;
    } catch (error) {
      console.error("Failed to mint planet NFT:", error);
      throw error;
    }
  }

  /**
   * Get NFTs owned by an address
   */
  async getNFTsByAddress(address: string): Promise<any[]> {
    try {
      console.log(`Fetching NFTs for address: ${address}`);

      const response = await fetch(`${this.endpoint}/getAccountState?address=${address}`);
      const data = await response.json();

      console.log("NFT query result:", data);

      // TODO: parse NFT items from contract state once deployed
      return [];
    } catch (error) {
      console.error("Failed to fetch NFTs:", error);
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
