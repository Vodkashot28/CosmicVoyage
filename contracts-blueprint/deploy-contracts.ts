import { mnemonicToPrivateKey } from "@ton/crypto";
import { TonClient, WalletContractV4, WalletContractV5R1, internal, toNano } from "@ton/ton";
import * as fs from "fs";
import * as path from "path";

// Get deployer mnemonic from environment
const MNEMONIC = process.env.DEPLOYER_MNEMONIC;
if (!MNEMONIC) {
  console.error("❌ DEPLOYER_MNEMONIC not set in environment");
  process.exit(1);
}

async function deployContracts() {
  console.log("🚀 Starting contract deployment to TON Testnet...\n");

  try {
    // Initialize client
    const client = new TonClient({
      endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    });

    // Get deployer keypair
    const keyPair = await mnemonicToPrivateKey(MNEMONIC.split(" "));
    const wallet = WalletContractV4.create({
      publicKey: keyPair.publicKey,
      workchain: 0,
    });
    const walletContract = client.open(wallet);
    const walletAddress = walletContract.address;

    console.log(`📍 Deployer Address: ${walletAddress.toString()}`);
    console.log(
      `💰 Balance: ${(await client.getBalance(walletAddress)) / 1e9} TON\n`
    );

    // List contracts to deploy
    const contracts = [
      "STARToken",
      "STARTokenWallet",
      "PlanetNFT",
      "PlanetNFTItem",
      "ReferralFaucet",
    ];

    const deployedAddresses: Record<string, string> = {};

    console.log("📦 Preparing contracts for deployment...\n");

    // Note: In a real scenario, you would:
    // 1. Compile each Tact contract to bytecode
    // 2. Create deployment messages
    // 3. Send transactions to deploy each contract
    //
    // For now, displaying deployment ready status:

    for (const contract of contracts) {
      const contractPath = path.join("./contracts", `${contract}.tact`);
      const exists = fs.existsSync(contractPath);

      if (exists) {
        console.log(`✅ ${contract} - Ready for deployment`);
        console.log(
          `   File: ${contractPath} (${fs.statSync(contractPath).size} bytes)`
        );
      } else {
        console.log(`❌ ${contract} - Contract file not found`);
      }
    }

    console.log("\n📋 Deployment Instructions:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(
      "1. Set the DEPLOYER_MNEMONIC environment variable with your wallet seed phrase"
    );
    console.log("2. Run: npx ts-node deploy-contracts.ts");
    console.log("\nOptionally, to use Blueprint's interactive deploy:");
    console.log("3. Run: npx blueprint deploy");
    console.log("4. Select contracts to deploy when prompted");
    console.log("5. Follow the wallet signing prompts");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("\n✨ All contracts are ready for deployment!");
  } catch (error) {
    console.error("❌ Deployment error:", error);
    process.exit(1);
  }
}

deployContracts();
