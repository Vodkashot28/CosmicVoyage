import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { PlanetNFT } from '../build/PlanetNFT/PlanetNFT_PlanetNFT';
import '@ton/test-utils';

describe('PlanetNFT', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let planetNFT: SandboxContract<PlanetNFT>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        planetNFT = blockchain.openContract(await PlanetNFT.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await planetNFT.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            null,
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: planetNFT.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and planetNFT are ready to use
    });
});
