// scripts/deploy.ts
import { NetworkProvider } from '@ton/blueprint';
import { STARToken } from '../contracts/STARToken.compile';
import { PlanetNFT } from '../contracts/PlanetNFT.compile';
import { toNano } from '@ton/core';

export async function run(provider: NetworkProvider) {
    // Deploy STARToken
    const star = provider.open(STARToken.create());
    await star.sendDeploy(provider.sender(), toNano('0.05'));
    console.log("✅ STARToken deployed at:", star.address.toString());

    // Deploy PlanetNFT
    const planet = provider.open(PlanetNFT.create());
    await planet.sendDeploy(provider.sender(), toNano('0.05'));
    console.log("✅ PlanetNFT deployed at:", planet.address.toString());
}
