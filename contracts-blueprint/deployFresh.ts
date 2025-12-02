import { mnemonicToPrivateKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal, toNano, fromNano, Cell, beginCell } from "@ton/ton";
import * as fs from "fs";
import * as path from "path";

const MNEMONIC = process.env.TON_MNEMONIC;
if (!MNEMONIC) {
  console.error("❌ TON_MNEMONIC not set");
  process.exit(1);
}

async function deployFreshSTARToken() {
  console.log("🚀 Deploying Fresh STARToken to TON Testnet...\n");

  try {
    const client = new TonClient({
      endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    });

    const keyPair = await mnemonicToPrivateKey((MNEMONIC as string).split(" "));
    const wallet = WalletContractV4.create({
      publicKey: keyPair.publicKey,
      workchain: 0,
    });

    const walletContract = client.open(wallet);
    const walletAddress = walletContract.address;
    const balance = await client.getBalance(walletAddress);

    console.log(`📍 Deployer: ${walletAddress.toString()}`);
    console.log(`💰 Balance: ${fromNano(balance)} TON\n`);

    if (balance < toNano("0.5")) {
      console.error("❌ Insufficient balance!");
      process.exit(1);
    }

    // Load compiled code and data
    const codeBoc = fs.readFileSync(path.join(__dirname, "build/STARToken/STARToken_STARToken.code.boc"));
    const code = Cell.fromBoc(Buffer.from(codeBoc, "hex"))[0];
    
    // Create init data
    const data = beginCell()
      .storeUint(0, 1) // initialized
      .storeAddress(walletAddress) // admin
      .storeCoins(1000000000n * 1000000000n) // total supply (1B * 10^9)
      .storeUint(0, 1) // burned
      .endCell();

    const stateInit = { code, data };
    const address = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 }).address;

    console.log(`📍 STARToken will deploy to: ${address.toString()}`);
    console.log("📡 Sending deployment transaction...\n");

    const seqno = await walletContract.getSeqno();
    const txSeqno = await walletContract.sendTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages: [
        internal({
          to: address,
          value: toNano("0.3"),
          init: stateInit,
          body: null,
        }),
      ],
    });

    console.log(`✅ Transaction sent (seqno: ${txSeqno})`);
    console.log("⏳ Waiting 45 seconds for confirmation...");
    await new Promise(resolve => setTimeout(resolve, 45000));

    const state = await client.getContractState(address);
    console.log(`\n📊 Contract State: ${state.state}`);

    if (state.state === "active") {
      console.log("\n🎉 STARToken Successfully Deployed!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📍 Address: ${address.toString()}`);
      console.log(`🔗 Explorer: https://testnet.tonscan.org/address/${address.toString()}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      fs.writeFileSync(
        path.join(__dirname, "deployment-fresh.json"),
        JSON.stringify({
          contractName: "STARToken",
          address: address.toString(),
          deployedAt: new Date().toISOString(),
          network: "testnet",
          explorerUrl: `https://testnet.tonscan.org/address/${address.toString()}`,
        }, null, 2)
      );
    } else {
      console.error(`\n❌ Deployment failed - state: ${state.state}`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

deployFreshSTARToken();
