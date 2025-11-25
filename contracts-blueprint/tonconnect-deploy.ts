import { TonClient, WalletContractV4 } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";

async function deployWithTonConnect() {
  console.log("🚀 TON Contract Deployment via TonConnect\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const contracts = [
    "STARToken",
    "STARTokenWallet",
    "PlanetNFT",
    "PlanetNFTItem",
    "ReferralFaucet",
  ];

  console.log("📋 Contracts Ready for Deployment:\n");
  contracts.forEach((name) => {
    console.log(`  ✓ ${name}`);
  });

  console.log(
    "\n📖 Instructions for TON Connect Deployment:\n"
  );
  console.log(
    "1. Open TON Console: https://testnet.tonconsole.com/"
  );
  console.log("2. Get testnet TON if needed from the faucet");
  console.log(
    "3. Run Blueprint: npx blueprint deploy"
  );
  console.log("4. Select 'testnet' network");
  console.log("5. Choose 'TON Connect compatible mobile wallet'");
  console.log("6. Scan QR code with Tonkeeper or similar wallet");
  console.log(
    "7. Approve the deployment transactions in your wallet\n"
  );

  console.log(
    "🌐 Or use mnemonic for direct deployment:\n"
  );
  console.log(
    "1. Set DEPLOYER_MNEMONIC environment variable"
  );
  console.log("2. Run: npx ts-node tonconnect-deploy.ts --mnemonic\n");

  // Check if running with mnemonic flag
  if (process.argv.includes("--mnemonic")) {
    const mnemonic = process.env.DEPLOYER_MNEMONIC;
    if (!mnemonic) {
      console.error(
        "❌ DEPLOYER_MNEMONIC environment variable not set"
      );
      process.exit(1);
    }

    try {
      const keyPair = await mnemonicToPrivateKey(
        mnemonic.split(" ")
      );
      const wallet = WalletContractV4.create({
        publicKey: keyPair.publicKey,
        workchain: 0,
      });

      console.log(`📍 Wallet: ${wallet.address}`);
      console.log("🎯 Ready to deploy contracts!\n");
    } catch (error) {
      console.error("❌ Invalid mnemonic:", error);
      process.exit(1);
    }
  }

  console.log(
    "✅ Setup complete! Use Blueprint to finalize deployment."
  );
}

deployWithTonConnect().catch(console.error);
