import { mnemonicToPrivateKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal, toNano, fromNano } from "@ton/ton";
import * as fs from "fs";
import * as path from "path";
import { STARToken } from "./build/STARToken/STARToken_STARToken";

const MNEMONIC = process.env.TON_MNEMONIC;
if (!MNEMONIC) {
  console.error("❌ TON_MNEMONIC not set in environment");
  process.exit(1);
}

async function deploySTARToken() {
  console.log("🚀 Deploying STARToken to TON Testnet...\n");

  try {
    // Initialize client for testnet
    const client = new TonClient({
      endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    });

    // Get deployer keypair from mnemonic
    const keyPair = await mnemonicToPrivateKey((MNEMONIC as string).split(" "));
    const wallet = WalletContractV4.create({
      publicKey: keyPair.publicKey,
      workchain: 0,
    });

    const walletContract = client.open(wallet);
    const walletAddress = walletContract.address;
    const balance = await client.getBalance(walletAddress);

    console.log(`📍 Deployer Wallet Address: ${walletAddress.toString()}`);
    console.log(`💰 Wallet Balance: ${fromNano(balance)} TON\n`);

    if (balance < toNano("0.5")) {
      console.error("❌ Insufficient balance! Need at least 0.5 TON for deployment + fees");
      console.error(`   Current balance: ${fromNano(balance)} TON`);
      process.exit(1);
    }

    // Initialize STARToken contract
    console.log("📦 Initializing STARToken contract...");
    const starToken = await STARToken.fromInit();
    const contractAddress = starToken.address;

    console.log(`✅ STARToken address: ${contractAddress.toString()}`);

    // Check if contract already deployed
    const contractData = await client.getContractState(contractAddress);
    if (contractData.state !== "uninitialized") {
      console.log("⚠️  Contract already deployed at this address!");
      console.log("📊 Contract State:", contractData.state);
      process.exit(0);
    }

    // Deploy the contract
    console.log("\n📡 Sending deployment transaction...");
    
    const deployResult = await walletContract.sendTransfer({
      seqno: await walletContract.getSeqno(),
      secretKey: keyPair.secretKey,
      messages: [
        internal({
          to: contractAddress,
          value: toNano("0.2"),
          init: starToken.init,
          body: null,
        }),
      ],
    });

    console.log(`✅ Deployment transaction sent: ${deployResult}`);
    console.log("\n⏳ Waiting for transaction confirmation (30 seconds)...");

    // Wait for deployment
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Verify deployment
    const deployedState = await client.getContractState(contractAddress);
    
    if (deployedState.state === "active") {
      console.log("\n🎉 STARToken Successfully Deployed!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📍 Contract Address: ${contractAddress.toString()}`);
      console.log(`🔗 Testnet Explorer: https://testnet.tonscan.org/address/${contractAddress.toString()}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Save deployment info
      const deploymentInfo = {
        contractName: "STARToken",
        address: contractAddress.toString(),
        deployedAt: new Date().toISOString(),
        network: "testnet",
        explorerUrl: `https://testnet.tonscan.org/address/${contractAddress.toString()}`,
      };

      fs.writeFileSync(
        path.join(__dirname, "deployment-info.json"),
        JSON.stringify(deploymentInfo, null, 2)
      );
      console.log("\n✅ Deployment info saved to deployment-info.json");
    } else {
      console.error("\n❌ Deployment verification failed!");
      console.error(`   Contract state: ${deployedState.state}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Deployment error:", error);
    process.exit(1);
  }
}

deploySTARToken();
