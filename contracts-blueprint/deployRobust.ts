import { mnemonicToPrivateKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal, toNano, fromNano, Address } from "@ton/ton";
import * as fs from "fs";
import * as path from "path";
import { STARTokenWallet } from "./build/STARTokenWallet/STARTokenWallet_STARTokenWallet";
import { PlanetNFT } from "./build/PlanetNFT/PlanetNFT_PlanetNFT";
import { PlanetNFTItem } from "./build/PlanetNFTItem/PlanetNFTItem_PlanetNFTItem";
import { ReferralFaucet } from "./build/ReferralFaucet/ReferralFaucet_ReferralFaucet";

const MNEMONIC = process.env.TON_MNEMONIC;
if (!MNEMONIC) {
  console.error("❌ TON_MNEMONIC not set in environment");
  process.exit(1);
}

const STAR_TOKEN_ADDRESS = "EQAIYlrr3UiMJ9fqI-B4j2nJdiiD7WzyaNL1MX_wiONc4OUi";

interface DeploymentRecord {
  contractName: string;
  address: string;
  deployedAt: string;
  network: string;
  explorerUrl: string;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 5,
  delay: number = 5000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      if (attempt === maxRetries) throw error;
      if (error.code === "ERR_BAD_REQUEST" && error.response?.status === 429) {
        console.log(`⏱️  Rate limited. Waiting ${delay}ms before retry ${attempt}/${maxRetries}...`);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

async function deployAllContracts() {
  console.log("🚀 Deploying All Contracts to TON Testnet\n");
  console.log("═══════════════════════════════════════════════════════════");

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
  
  const balance = await retryOperation(() => client.getBalance(walletAddress));

  console.log(`📍 Deployer Wallet: ${walletAddress.toString()}`);
  console.log(`💰 Balance: ${fromNano(balance)} TON\n`);

  if (balance < toNano("1.5")) {
    console.error("❌ Insufficient balance! Need at least 1.5 TON for 4 deployments");
    process.exit(1);
  }

  const deployedContracts: DeploymentRecord[] = [];

  try {
    // 1. Deploy STARTokenWallet
    console.log("\n📦 Contract 1/4: STARTokenWallet");
    console.log("─────────────────────────────────");
    
    const userAddress = walletAddress;
    const starTokenWallet = await STARTokenWallet.fromInit(
      userAddress,
      Address.parse(STAR_TOKEN_ADDRESS)
    );
    const walletContractAddr = starTokenWallet.address;

    console.log(`Address: ${walletContractAddr.toString()}`);
    const walletState = await retryOperation(() => client.getContractState(walletContractAddr));
    
    if (walletState.state === "uninitialized") {
      const seqno = await retryOperation(() => walletContract.getSeqno());
      await retryOperation(() =>
        walletContract.sendTransfer({
          seqno: seqno,
          secretKey: keyPair.secretKey,
          messages: [
            internal({
              to: walletContractAddr,
              value: toNano("0.2"),
              init: starTokenWallet.init,
              body: null,
            }),
          ],
        })
      );
      console.log("✅ Tx sent");
      await sleep(20000);
      
      const finalState = await retryOperation(() => client.getContractState(walletContractAddr));
      if (finalState.state === "active") {
        console.log("✅ Deployed!");
        deployedContracts.push({
          contractName: "STARTokenWallet",
          address: walletContractAddr.toString(),
          deployedAt: new Date().toISOString(),
          network: "testnet",
          explorerUrl: `https://testnet.tonscan.org/address/${walletContractAddr.toString()}`,
        });
      }
    } else {
      console.log("⚠️  Already deployed");
      deployedContracts.push({
        contractName: "STARTokenWallet",
        address: walletContractAddr.toString(),
        deployedAt: new Date().toISOString(),
        network: "testnet",
        explorerUrl: `https://testnet.tonscan.org/address/${walletContractAddr.toString()}`,
      });
    }

    // 2. Deploy PlanetNFT
    console.log("\n📦 Contract 2/4: PlanetNFT");
    console.log("─────────────────────────────────");
    
    const planetNFT = await PlanetNFT.fromInit(userAddress, userAddress);
    const nftAddr = planetNFT.address;

    console.log(`Address: ${nftAddr.toString()}`);
    const nftState = await retryOperation(() => client.getContractState(nftAddr));
    
    if (nftState.state === "uninitialized") {
      const seqno = await retryOperation(() => walletContract.getSeqno());
      await retryOperation(() =>
        walletContract.sendTransfer({
          seqno: seqno,
          secretKey: keyPair.secretKey,
          messages: [
            internal({
              to: nftAddr,
              value: toNano("0.2"),
              init: planetNFT.init,
              body: null,
            }),
          ],
        })
      );
      console.log("✅ Tx sent");
      await sleep(20000);
      
      const finalState = await retryOperation(() => client.getContractState(nftAddr));
      if (finalState.state === "active") {
        console.log("✅ Deployed!");
        deployedContracts.push({
          contractName: "PlanetNFT",
          address: nftAddr.toString(),
          deployedAt: new Date().toISOString(),
          network: "testnet",
          explorerUrl: `https://testnet.tonscan.org/address/${nftAddr.toString()}`,
        });
      }
    } else {
      console.log("⚠️  Already deployed");
      deployedContracts.push({
        contractName: "PlanetNFT",
        address: nftAddr.toString(),
        deployedAt: new Date().toISOString(),
        network: "testnet",
        explorerUrl: `https://testnet.tonscan.org/address/${nftAddr.toString()}`,
      });
    }

    // 3. Deploy PlanetNFTItem
    console.log("\n📦 Contract 3/4: PlanetNFTItem");
    console.log("─────────────────────────────────");
    
    const planetNFTItem = await PlanetNFTItem.fromInit(
      BigInt(0),
      nftAddr,
      userAddress,
      "Earth",
      BigInt(1),
      "#00ff00"
    );
    const itemAddr = planetNFTItem.address;

    console.log(`Address: ${itemAddr.toString()}`);
    const itemState = await retryOperation(() => client.getContractState(itemAddr));
    
    if (itemState.state === "uninitialized") {
      const seqno = await retryOperation(() => walletContract.getSeqno());
      await retryOperation(() =>
        walletContract.sendTransfer({
          seqno: seqno,
          secretKey: keyPair.secretKey,
          messages: [
            internal({
              to: itemAddr,
              value: toNano("0.2"),
              init: planetNFTItem.init,
              body: null,
            }),
          ],
        })
      );
      console.log("✅ Tx sent");
      await sleep(20000);
      
      const finalState = await retryOperation(() => client.getContractState(itemAddr));
      if (finalState.state === "active") {
        console.log("✅ Deployed!");
        deployedContracts.push({
          contractName: "PlanetNFTItem",
          address: itemAddr.toString(),
          deployedAt: new Date().toISOString(),
          network: "testnet",
          explorerUrl: `https://testnet.tonscan.org/address/${itemAddr.toString()}`,
        });
      }
    } else {
      console.log("⚠️  Already deployed");
      deployedContracts.push({
        contractName: "PlanetNFTItem",
        address: itemAddr.toString(),
        deployedAt: new Date().toISOString(),
        network: "testnet",
        explorerUrl: `https://testnet.tonscan.org/address/${itemAddr.toString()}`,
      });
    }

    // 4. Deploy ReferralFaucet
    console.log("\n📦 Contract 4/4: ReferralFaucet");
    console.log("─────────────────────────────────");
    
    const referralFaucet = await ReferralFaucet.fromInit(
      Address.parse(STAR_TOKEN_ADDRESS),
      toNano("10"),
      toNano("5"),
      toNano("50")
    );
    const faucetAddr = referralFaucet.address;

    console.log(`Address: ${faucetAddr.toString()}`);
    const faucetState = await retryOperation(() => client.getContractState(faucetAddr));
    
    if (faucetState.state === "uninitialized") {
      const seqno = await retryOperation(() => walletContract.getSeqno());
      await retryOperation(() =>
        walletContract.sendTransfer({
          seqno: seqno,
          secretKey: keyPair.secretKey,
          messages: [
            internal({
              to: faucetAddr,
              value: toNano("0.2"),
              init: referralFaucet.init,
              body: null,
            }),
          ],
        })
      );
      console.log("✅ Tx sent");
      await sleep(20000);
      
      const finalState = await retryOperation(() => client.getContractState(faucetAddr));
      if (finalState.state === "active") {
        console.log("✅ Deployed!");
        deployedContracts.push({
          contractName: "ReferralFaucet",
          address: faucetAddr.toString(),
          deployedAt: new Date().toISOString(),
          network: "testnet",
          explorerUrl: `https://testnet.tonscan.org/address/${faucetAddr.toString()}`,
        });
      }
    } else {
      console.log("⚠️  Already deployed");
      deployedContracts.push({
        contractName: "ReferralFaucet",
        address: faucetAddr.toString(),
        deployedAt: new Date().toISOString(),
        network: "testnet",
        explorerUrl: `https://testnet.tonscan.org/address/${faucetAddr.toString()}`,
      });
    }

    // Summary
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("🎉 All Deployments Complete!");
    console.log("═══════════════════════════════════════════════════════════\n");

    deployedContracts.forEach((contract) => {
      console.log(`✅ ${contract.contractName}`);
      console.log(`   📍 ${contract.address}`);
      console.log(`   🔗 ${contract.explorerUrl}\n`);
    });

    const deploymentInfo = {
      deployedAt: new Date().toISOString(),
      network: "testnet",
      contracts: deployedContracts,
    };

    fs.writeFileSync(
      path.join(__dirname, "deployment-info.json"),
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("✅ Saved to deployment-info.json");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

deployAllContracts();
