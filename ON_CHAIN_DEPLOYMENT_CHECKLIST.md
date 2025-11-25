# ✅ On-Chain Deployment Checklist

## Current Status: 🔴 Mock Mode
- ❌ Contracts NOT deployed to TON blockchain
- ❌ Using placeholder/mock addresses
- ❌ Game cannot mint real NFTs or transfer real tokens

---

## ✅ What's Already Done

1. **Smart Contracts Created** ✓
   - ✅ STARToken.tact (1B supply, burnable, transfers)
   - ✅ STARTokenWallet.tact (user wallets, passive income)
   - ✅ PlanetNFT.tact (NFT collection, SEQ standard)
   - ✅ PlanetNFTItem.tact (individual NFTs)
   - ✅ ReferralFaucet.tact (referral rewards)

2. **Blueprint Setup** ✓
   - ✅ blueprint.config.ts configured
   - ✅ Tact compiler ready
   - ✅ Deployment scripts prepared

3. **Frontend Integration** ✓
   - ✅ TonConnect wallet integration
   - ✅ UI for blockchain operations
   - ✅ Contract address file structure

4. **Documentation** ✓
   - ✅ BLOCKCHAIN_INTEGRATION_SUMMARY.md
   - ✅ BLOCKCHAIN_DEPLOYMENT_GUIDE.md (NEW)
   - ✅ Contract specifications

---

## 🎯 TODO: Deploy Contracts to TON Testnet

### Phase 1: Local Setup (5 minutes)
- [ ] Read: `BLOCKCHAIN_DEPLOYMENT_GUIDE.md`
- [ ] Verify: TON_MNEMONIC is set in Replit Secrets
- [ ] Check: Deployer wallet has >10 TON on testnet

### Phase 2: Build Contracts (2 minutes)
```bash
cd contracts-blueprint
npx blueprint build
```
- [ ] No compilation errors
- [ ] Build/ directory created with bytecode

### Phase 3: Deploy to Testnet (10 minutes)
```bash
npx blueprint run deployAll
```
- [ ] All 5 contracts deployed successfully
- [ ] Real addresses generated from blockchain
- [ ] Saved to: `deployments/testnet-deployment.json`

### Phase 4: Update Client (5 minutes)
- [ ] Copy addresses from `deployments/testnet-deployment.json`
- [ ] Update `client/src/lib/contracts.ts` with real addresses
- [ ] Change `CONTRACT_ADDRESSES` object values
- [ ] Rebuild frontend

### Phase 5: Test On-Chain (15 minutes)
- [ ] Connect wallet to game at solar-system.xyz
- [ ] Discover first planet → Check NFT on explorer
- [ ] Earn tokens → Check balance on explorer
- [ ] Burn utility → Check transaction on explorer
- [ ] Verify all on: https://testnet.tonscan.org

---

## Files Modified/Created

### New Files
1. `BLOCKCHAIN_DEPLOYMENT_GUIDE.md` ⭐ **START HERE**
   - Complete deployment instructions
   - Prerequisites, step-by-step commands
   - Troubleshooting guide

2. `ON_CHAIN_DEPLOYMENT_CHECKLIST.md` (this file)
   - Task tracking
   - Status overview

### Updated Files
1. `BLOCKCHAIN_INTEGRATION_SUMMARY.md`
   - Updated with deployment guide reference
   - Quick start commands added

2. `contracts-blueprint/scripts/deployAll.ts`
   - Improved script with better logging
   - Added mnemonic support
   - Saves deployment results

3. `client/src/lib/contracts.ts`
   - Added detailed comments about mock status
   - Instructions for updating with real addresses

---

## How to Deploy (Quick Version)

### Prerequisites
```bash
# 1. Check TON_MNEMONIC is set
echo $TON_MNEMONIC  # Should show 24 words

# 2. Check deployer balance
# Address: 0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01
# Needs: >10 TON on testnet
```

### Deploy
```bash
cd contracts-blueprint
npx blueprint build          # Compile
npx blueprint run deployAll  # Deploy
```

### Update App
```bash
# Get addresses from:
cat deployments/testnet-deployment.json

# Then update client/src/lib/contracts.ts:
# Replace CONTRACT_ADDRESSES with real addresses

# Rebuild and redeploy frontend
npm run build
```

---

## Expected Results After Deployment

### ✅ On-Chain
- 5 contracts deployed to TON testnet
- Real contract addresses generated
- Stored in `deployments/testnet-deployment.json`
- Viewable on https://testnet.tonscan.org

### ✅ In-App (After updating addresses)
- Players discover planets → Real NFTs created on-chain
- Players earn tokens → Real STAR tokens transferred
- Token transfers work → Real on-chain transactions
- All activity visible on blockchain explorer

### ✅ Metrics
- Token transactions trackable
- NFT ownership verifiable
- Passive income calculations on-chain
- Burn events visible

---

## Resources

### Documentation
- 📖 **BLOCKCHAIN_DEPLOYMENT_GUIDE.md** - Full deployment guide
- 📖 **BLOCKCHAIN_INTEGRATION_SUMMARY.md** - Integration overview
- 📖 **TOKENOMICS.md** - Token economy details

### Tools
- 🔗 TON Documentation: https://ton.org/docs/
- 🔗 Tact Language: https://docs.tact-lang.org/
- 🔗 Blueprint CLI: https://github.com/ton-org/blueprint
- 🔗 Testnet Explorer: https://testnet.tonscan.org/

### Accounts
- 💼 Deployer Wallet: `0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01`
- 🌐 Network: TON Testnet (development)
- 📊 RPC: https://testnet.toncenter.com/api/v2/

---

## Next After Deployment

1. **Test on Testnet** (1 day)
   - Full game flow on-chain
   - All features functional
   - No bugs or issues

2. **Deploy to Mainnet** (1 day)
   - Use same scripts, change network
   - Requires mainnet TON for gas fees
   - Update production contract addresses

3. **Go Live** 🚀
   - Update solar-system.xyz to use mainnet
   - Monitor on-chain activity
   - Community can trade NFTs and tokens

---

## Summary

**Current:** 🔴 Mock contracts (placeholder addresses)
**Target:** 🟢 Real contracts deployed to TON

**Time to Deploy:** ~30-45 minutes
**Difficulty:** Medium (just running commands)
**Impact:** Game becomes truly on-chain

⭐ **Start with:** Read `BLOCKCHAIN_DEPLOYMENT_GUIDE.md`
