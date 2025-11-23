import { toNano } from '@ton/core';
import { STARToken } from '../build/STARToken/STARToken_STARToken';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const sTARToken = provider.open(await STARToken.fromInit());

    await sTARToken.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(sTARToken.address);

    // run methods on `sTARToken`
}
