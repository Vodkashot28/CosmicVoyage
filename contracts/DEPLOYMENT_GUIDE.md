# Smart Contract Deployment Guide

## Overview

This guide covers deploying the Solar System Explorer smart contracts to the TON blockchain. The project includes:

- **STARToken.tact** - Main STAR token contract (1B fixed supply)
- **STARTokenWallet.tact** - User wallet for STAR token holdings
- **PlanetNFT.tact** - NFT collection smart contract
- **PlanetNFTItem.tact** - Individual NFT item contracts
- **ReferralFaucet.tact** - Tiered referral rewards system

## Prerequisites

### Required Setup

1. **Node.js & npm** - Latest LTS version
2. **Wallet with TON Balance** - For deploying contracts
   - Testnet: Use [testnet faucet](https://testnet-faucet.tonkeeper.com/)
   - Mainnet: Need real TON coins
3. **TON Connect** - For wallet integration
4. **Deployer Address** - The wallet deploying contracts
   - Current deployer: `0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01`

### Dependencies

All required packages are already installed:

```bash
npm install
# This includes: @ton/ton, @ton/core, @tonconnect/ui-react
```

## Deployment Process

### 1. Verify Environment

Check that your environment is set up correctly:

```bash
# Check TON client connection
node -e "const { TonClient } = require('@ton/ton'); console.log('✅ TON SDK ready')"
```

### 2. Testnet Deployment (Recommended First)

Always test on testnet before mainnet deployment.

```bash
# Deploy to TON Testnet
npm run deploy:testnet
```

**What happens:**
1. Connects to TON testnet RPC
2. Compiles all Tact contracts
3. Deploys contracts in order:
   - STARToken
   - STARTokenWallet
   - PlanetNFT
   - PlanetNFTItem
   - ReferralFaucet
4. Saves deployment addresses to `.deployments/` directory
5. Generates `.env.deployment` file with contract addresses

### 3. Verify Deployment

After deployment completes, verify on testnet explorer:

```bash
# View deployment record
cat .env.deployment

# Example output:
# STARTOKEN_ADDRESS=EQ...
# STARRTTOKENWALSET_ADDRESS=EQ...
# etc.
```

Check contracts on [TON Testnet Explorer](https://testnet.tonscan.org/)

### 4. Integration

Once verified on testnet, integrate addresses into the frontend:

#### Update Environment Variables

1. Copy addresses from `.env.deployment`:
```bash
cat .env.deployment
```

2. Update your `.env` file:
```env
VITE_STARTOKEN_ADDRESS=EQ...
VITE_STARTOKEN_WALLET_ADDRESS=EQ...
VITE_PLANET_NFT_ADDRESS=EQ...
VITE_PLANET_NFT_ITEM_ADDRESS=EQ...
VITE_REFERRAL_FAUCET_ADDRESS=EQ...
```

#### Update Contract References

Update `client/src/lib/contracts.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  starToken: "EQ...",           // From STARTOKEN_ADDRESS
  starTokenWallet: "EQ...",     // From STARRTTOKENWALSET_ADDRESS
  planetNFT: "EQ...",           // From PLANET_NFT_ADDRESS
  planetNFTItem: "EQ...",       // From PLANET_NFT_ITEM_ADDRESS
  referralFaucet: "EQ...",      // From REFERRAL_FAUCET_ADDRESS
};
```

### 5. Testing

Test contract interactions on testnet:

1. Open the game in testnet mode
2. Connect your wallet via TON Connect
3. Test discovering planets (should mint NFTs)
4. Test earning STAR tokens (should appear in wallet)
5. Test referral system (should generate referral codes)

### 6. Mainnet Deployment

Once thoroughly tested on testnet:

```bash
# Deploy to TON Mainnet
npm run deploy:mainnet
```

**⚠️ WARNING:** Mainnet deployment is permanent and costs real TON. Verify all settings before running!

## Deployment Output

### Success Output

```
======================================================================
🌟 Solar System Explorer - Smart Contract Deployment
======================================================================
🌐 Network: TON testnet
👤 Deployer: 0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01
======================================================================

📡 Connecting to TON network...
✅ Connected to TON testnet

📋 Contracts to deploy: 5

   • STARToken: Main STAR token contract (1B fixed supply)
   • STARTokenWallet: User wallet for STAR token holdings
   • PlanetNFT: NFT collection for celestial objects
   • PlanetNFTItem: Individual NFT items
   • ReferralFaucet: Tiered referral rewards system

📦 Compiling STARToken...
✅ STARToken compiled successfully

🚀 Deploying STARToken to TON testnet...
   - Deployer balance: 1.5 TON
   - Contract code: compiled_STARToken_1700713600000
   - Network: TON testnet
✅ STARToken deployed successfully
   📍 Address: EQ123abc...

... (more contracts) ...

📊 DEPLOYMENT SUMMARY
======================================================================

Network: TON testnet
Total Contracts: 5
✅ Successful: 5
❌ Failed: 0

✅ STARToken            EQ123abc...
✅ STARTokenWallet     EQ456def...
✅ PlanetNFT           EQ789ghi...
✅ PlanetNFTItem       EQabc012...
✅ ReferralFaucet      EQdef345...

======================================================================

🎉 All contracts deployed successfully!

📋 Next steps:
   1. ✅ Copy addresses from .env.deployment
   2. ✅ Update client/src/lib/contracts.ts with addresses
   3. ✅ Test contract interactions via TON Connect UI
   4. ✅ Verify balances and state on tonscan.org
   5. ✅ Once verified, proceed with mainnet deployment

======================================================================
```

### Deployment Files

**Created after deployment:**

```
.deployments/deployment_testnet_2024-11-23.json
├─ network: "testnet"
├─ deployer: "0:fa146..."
├─ timestamp: "2024-11-23T..."
└─ contracts: [...]

.env.deployment
├─ STARTOKEN_ADDRESS=EQ...
├─ STARRTTOKENWALSET_ADDRESS=EQ...
├─ PLANET_NFT_ADDRESS=EQ...
├─ PLANET_NFT_ITEM_ADDRESS=EQ...
└─ REFERRAL_FAUCET_ADDRESS=EQ...
```

## Troubleshooting

### Compilation Errors

**Error:** `Cannot find module '@ton/blueprint'`

**Solution:** Blueprint is handled by the deploy script. If you need to compile manually:

```bash
npm install --save-dev @ton/blueprint
```

### Insufficient Balance

**Error:** `Low balance. Recommended minimum: 0.5 TON`

**Solution:**
- **Testnet:** Get free TON from [testnet faucet](https://testnet-faucet.tonkeeper.com/)
- **Mainnet:** Purchase TON from an exchange

### RPC Connection Failed

**Error:** `Cannot connect to TON network`

**Solution:**
1. Check your internet connection
2. Try alternative RPC endpoints:
   - Testnet: `https://testnet.toncenter.com/api/v2/jsonRPC`
   - Mainnet: `https://toncenter.com/api/v2/jsonRPC`
3. Check if TON network is operational

### Invalid Deployer Address

**Error:** `Address parsing failed`

**Solution:** Verify deployer address format:
```bash
# Should be in format: EQ... or 0:...
# Current: 0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01 ✅
```

## Contract Verification

After deployment, verify contracts using TON Scan:

1. **Testnet Scan:** https://testnet.tonscan.org/
2. **Mainnet Scan:** https://tonscan.org/

### Verification Steps

1. Find your contract by address
2. Check contract code hash matches deployment
3. Verify contract data (balance, state)
4. Check transaction history

## Economics Reminder

**Token Distribution (1B STAR):**

```
Deployment ────→ Smart Contract Initialized (1B STAR)
           ↓
Genesis Faucet ──→ 10 STAR per new player
           ↓
Discovery ───────→ 2,373 STAR (8 planets + 7 dwarfs + 13 asteroids)
           ↓
Passive Income ──→ ~312 STAR/day at full collection
           ↓
Referrals ───────→ 5-50 STAR per invited friend + 10% income bonus
           ↓
Burning ─────────→ 5-10M STAR/month (cosmic utilities)
```

## Support & Resources

- **TON Documentation:** https://docs.ton.org/
- **TON Blockchain:** https://ton.org/
- **TON Scan (Testnet):** https://testnet.tonscan.org/
- **TON Scan (Mainnet):** https://tonscan.org/
- **TON Center API:** https://toncenter.com/

## Deployment Checklist

- [ ] Prerequisites installed (Node.js, npm)
- [ ] Wallet funded with TON
- [ ] All contract files present in `contracts/` directory
- [ ] Environment variables set (if needed)
- [ ] Run `npm run deploy:testnet` successfully
- [ ] Verify contract addresses in `.env.deployment`
- [ ] Test on testnet thoroughly
- [ ] Update `client/src/lib/contracts.ts` with addresses
- [ ] Test game with deployed contracts
- [ ] Ready for mainnet deployment (optional)

---

**Last Updated:** November 23, 2024
**Smart Contracts:** STARToken, PlanetNFT, ReferralFaucet
**Network Support:** Testnet & Mainnet
