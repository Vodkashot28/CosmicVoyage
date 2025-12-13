import { CompilerConfig } from "@ton/blueprint";

const config: BlueprintConfig = {
    lang: "tact",
    targets: [
        {
            name: "STARToken",
            // ✅ THE FIX: Use '../contracts/'
            path: "../contracts/STARToken.tact", 
        },
        {
            name: "STARTokenWallet",
            path: "../contracts/STARTokenWallet.tact",
        },
        {
            name: "PlanetNFT",
            path: "../contracts/PlanetNFT.tact",
        },
        {
            name: "PlanetNFTItem",
            path: "../contracts/PlanetNFTItem.tact",
        },
        {
            name: "ReferralFaucet",
            path: "../contracts/ReferralFaucet.tact",
        },
        {
            name: "CosmicRefinement",
            path: "../contracts/CosmicRefinement.tact",
        },
        {
            name: "SatelliteModuleBlueprint",
            path: "../contracts/SatelliteModuleBlueprint.tact",
        },
        {
            name: "StellarImmortalityLedger",
            path: "../contracts/StellarImmortalityLedger.tact",
        },
        {
            name: "StellarMapUnification",
            path: "../contracts/StellarMapUnification.tact",
        },
    ],
    output: "wrappers",
};

export default compile;
