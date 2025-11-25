import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { STARToken } from '../build/STARToken/STARToken_STARToken';
import '@ton/test-utils';

describe('STARToken', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let sTARToken: SandboxContract<STARToken>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        sTARToken = blockchain.openContract(await STARToken.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await sTARToken.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            null,
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: sTARToken.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and sTARToken are ready to use
    });
});
