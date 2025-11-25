import { TonClient, WalletContractV4 } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import fs from "fs";
import path from "path";

async function deployAll() {
  console.log("🚀 Deploying Cosmic Voyage Contracts to TON Testnet\n");

  const contracts = [
    "STARToken",
    "STARTokenWallet",
    "PlanetNFT",
    "PlanetNFTItem",
    "ReferralFaucet",
  ];

  const network = process.env.NETWORK || "testnet";
  const mnemonic = process.env.WALLET_MNEMONIC;
  const walletVersion = process.env.WALLET_VERSION || "v4R2";

  let walletAddress: string | undefined;

  try {
    const client = new TonClient({
      endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    });

    if (mnemonic) {
      console.log("🔑 Using mnemonic deployer...\n");
      const keyPair = await mnemonicToPrivateKey(mnemonic.split(" "));
      const wallet = WalletContractV4.create({
        publicKey: keyPair.publicKey,
        workchain: 0,
      });
      walletAddress = wallet.address.toString();
      console.log(`📍 Wallet (mnemonic): ${walletAddress}`);
    } else {
      console.log("🔗 Falling back to TonConnect mode...\n");
      console.log("👉 Please connect via Tonkeeper when prompted.");
    }

    console.log(`🌐 Network: ${network}\n`);

    for (const name of contracts) {
      const contractPath = path.join("./contracts", `${name}.tact`);
      if (fs.existsSync(contractPath)) {
        const size = fs.statSync(contractPath).size;
        console.log(`📦 ${name} - Ready for deployment (${size} bytes)`);
      } else {
        console.log(`❌ ${name} - Contract file not found`);
      }
    }

    console.log("\n✅ Deployment preparation complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Next steps:");
    console.log("1. Ensure your wallet has testnet TON.");
    if (mnemonic) {
      console.log("2. Run: npx ts-node scripts/deployAll.ts");
    } else {
      console.log("2. Run: npx blueprint run deployAll");
      console.log("   → Select TonConnect wallet and approve transactions.");
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Deployment error:", error);
    process.exit(1);
  }
}

deployAll();
