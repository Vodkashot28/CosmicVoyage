import { BlueprintConfig } from "@ton/blueprint";

const config: BlueprintConfig = {
  contracts: [
    {
      name: "STARToken",
      path: "./contracts/STARToken.tact",
    },
    {
      name: "STARTokenWallet",
      path: "./contracts/STARTokenWallet.tact",
    },
    {
      name: "PlanetNFT",
      path: "./contracts/PlanetNFT.tact",
    },
    {
      name: "PlanetNFTItem",
      path: "./contracts/PlanetNFTItem.tact",
    },
    {
      name: "ReferralFaucet",
      path: "./contracts/ReferralFaucet.tact",
    },
  ],
  plugins: [], // ✅ must be an array, even if empty
};

export default config; // ✅ default export required
