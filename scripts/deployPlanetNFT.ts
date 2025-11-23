import { toNano } from '@ton/core';
import { PlanetNFT } from '../build/PlanetNFT/PlanetNFT_PlanetNFT';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const planetNFT = provider.open(await PlanetNFT.fromInit());

    await planetNFT.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(planetNFT.address);

    // run methods on `planetNFT`
}
