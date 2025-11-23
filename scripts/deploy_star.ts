import { NetworkProvider } from '@ton/blueprint';
import { STARToken } from '../contracts/STARToken.compile';

export async function run(provider: NetworkProvider) {
    const star = provider.open(STARToken.create());
    await star.sendDeploy(provider.sender(), provider.value(0.05));
    console.log("STARToken deployed at:", star.address.toString());
}
