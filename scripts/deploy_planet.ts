import { NetworkProvider } from '@ton/blueprint';
import { PlanetNFT } from '../contracts/PlanetNFT.compile';

export async function run(provider: NetworkProvider) {
    const planet = provider.open(PlanetNFT.create());
    await planet.sendDeploy(provider.sender(), provider.value(0.05));
    console.log("PlanetNFT deployed at:", planet.address.toString());
}
