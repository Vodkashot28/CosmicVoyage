# 🚀 Blockchain Deployment Guide - Cosmic Voyage

## Current Status

**❌ MOCK MODE (Current)**
- Contract addresses are hardcoded placeholder values
- No actual on-chain contracts deployed
- Game uses mock token system only

**✅ PRODUCTION MODE (Target)**
- Contracts compiled and deployed to TON testnet
- Real on-chain addresses stored in environment
- Full blockchain integration active

---

## Prerequisites

### 1. Install Dependencies
```bash
cd contracts-blueprint
npm install
```

### 2. Set Up Mnemonic (Secret)
Your deployment account needs TON testnet funds. The TON_MNEMONIC secret should contain your 24-word BIP39 seed phrase:

```bash
# This is already set in Replit secrets tab
TON_MNEMONIC=<24-word seed phrase>
```

**Current Deployer Wallet:**
- Address: `0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01`
- Status: Has ~50 TON on testnet ✓

---

## Step 1: Compile Contracts

Compile all Tact contracts to bytecode:

```bash
cd contracts-blueprint
npx blueprint build
```

**Output:** Compiled cells in `build/` directory

**What happens:**
- Tact compiler validates all contract files
- Generates bytecode cells for each contract
- Creates wrapper TypeScript code for deployment

---

## Step 2: Deploy to TON Testnet

### Option A: Interactive Deployment (Recommended for Testing)
```bash
npx blueprint run deployAll
```

This uses Blueprint's interactive mode:
1. Reads your deployer account from the Replit secrets (TON_MNEMONIC)
2. Deploys each contract sequentially
3. Captures real on-chain addresses
4. Saves addresses to `deployments/testnet-deployment.json`

### Option B: Automated Deployment (CI/CD)
```bash
TON_MNEMONIC="your 24 words" npx blueprint run deployAll
```

---

## Step 3: Capture Contract Addresses

After deployment, you'll get:

```json
{
  "network": "testnet",
  "deployer": "0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01",
  "timestamp": "2025-11-25T12:00:00Z",
  "contracts": {
    "STARToken": "EQA1234...",           // Real address from chain
    "STARTokenWallet": "EQB5678...",     // Real address from chain
    "PlanetNFT": "EQC9012...",           // Real address from chain
    "PlanetNFTItem": "EQD3456...",       // Real address from chain
    "ReferralFaucet": "EQE7890..."       // Real address from chain
  }
}
```

---

## Step 4: Update Client Configuration

Update `client/src/lib/contracts.ts` with real addresses:

```typescript
export const CONTRACT_ADDRESSES = {
  // Replace these with real deployed addresses from Step 3
  STAR_TOKEN: "EQA1234...",           // Real address
  STAR_TOKEN_WALLET: "EQB5678...",    // Real address
  PLANET_NFT: "EQC9012...",           // Real address
  PLANET_NFT_ITEM: "EQD3456...",      // Real address
  REFERRAL_FAUCET: "EQE7890..."       // Real address
} as const;
```

---

## Step 5: Test On-Chain Integration

### Test 1: Check Contract Balance
```bash
# Get STAR token balance
curl -X POST https://testnet.toncenter.com/api/v2/jsonRPC \
  -H "Content-Type: application/json" \
  -d '{
    "method": "runGetMethod",
    "params": {
      "address": "EQA1234...",  # STAR_TOKEN address
      "method": "get_supply"
    }
  }'
```

### Test 2: Mint NFT
Use the app to:
1. Connect wallet
2. Discover first planet (should mint NFT on-chain)
3. Check explorer: `https://testnet.tonscan.org/address/EQC9012...`

### Test 3: Transfer Tokens
1. Complete discovery chain
2. Receive STAR tokens on-chain
3. Try token transfer via in-app "Transfer STAR" panel

---

## Deployment Architecture

```
┌─────────────────────────────┐
│   Tact Smart Contracts      │
│  (contracts/*.tact)         │
└──────────────┬──────────────┘
               │
      npx blueprint build
               │
        ▼──────────────┐
    ┌────────────┐    │
    │ Bytecode   │◄───┘
    │  Cells     │
    └────────────┘
         │
      npx blueprint run deployAll
         │
        ▼──────────────────────────┐
┌──────────────────────────────────┴───┐
│    TON Testnet Blockchain            │
│  - STARToken deployed                │
│  - PlanetNFT deployed                │
│  - Referral Faucet deployed          │
│  - Real on-chain addresses received  │
└──────────────────────────────────────┘
         │
    Real Addresses
         │
        ▼──────────────────────┐
┌────────────────────────────┐ │
│ client/src/lib/contracts.ts│◄┘
│   (Update CONTRACT_ADDRESSES)
└────────────────────────────┘
         │
    Ready for Production
```

---

## Files to Update for Production

### 1. ✅ Already Done
- `contracts-blueprint/contracts/*.tact` - All contract files ready
- `contracts-blueprint/blueprint.config.ts` - Configuration complete
- `client/src/lib/contracts.ts` - Has structure, needs real addresses

### 2. 🔄 Next Step
- `contracts-blueprint/scripts/deploy.ts` - Replace mock with real deployment logic
- `deployments/testnet-deployment.json` - Will be auto-generated after real deployment

### 3. 📝 Environment Variables
Ensure these are set:
```bash
# Replit Secrets Tab
TON_MNEMONIC = <your 24-word seed>

# Client Environment (.env.local)
VITE_STAR_TOKEN = <real address from deployment>
VITE_PLANET_NFT = <real address from deployment>
```

---

## Troubleshooting

### Issue: "Contract deployment failed"
**Cause:** Low balance on deployer wallet
**Fix:** Ensure deployer wallet has >10 TON on testnet
```bash
# Check balance
curl -X POST https://testnet.toncenter.com/api/v2/jsonRPC \
  -H "Content-Type: application/json" \
  -d '{"method": "getAddress", "params": {"address": "0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01"}}'
```

### Issue: "TON_MNEMONIC not found"
**Cause:** Secret not set in Replit
**Fix:** Go to Replit Secrets tab → Add `TON_MNEMONIC`

### Issue: "Tact compiler error"
**Cause:** Invalid Tact syntax in contract
**Fix:** Check contract file syntax in `contracts-blueprint/contracts/`

---

## Command Reference

```bash
# Build contracts
npx blueprint build

# Deploy all contracts (interactive)
npx blueprint run deployAll

# Deploy specific contract
npx blueprint run deploy STARToken

# List compiled contracts
ls build/

# Check deployment history
cat deployments/testnet-deployment.json
```

---

## What's Next After Deployment

1. ✅ Contracts deployed to testnet
2. ✅ Addresses captured in `deployments/testnet-deployment.json`
3. ✅ Client updated with real addresses
4. 🎯 **Test full game flow on-chain**
   - Discover planets → NFTs created on-chain
   - Collect tokens → Real STAR tokens received
   - Burn utilities → Transactions on-chain
5. 🎯 **Deploy to mainnet** (same process, different network)

---

## Network Configuration

### Testnet (Current)
- **RPC:** https://testnet.toncenter.com/api/v2/
- **Explorer:** https://testnet.tonscan.org
- **API Key:** Built into Blueprint

### Mainnet (Future)
- **RPC:** https://toncenter.com/api/v2/
- **Explorer:** https://tonscan.org
- **Requires:** Mainnet TON in deployer wallet

---

## Security Checklist

- [ ] TON_MNEMONIC stored in Replit Secrets (never in code)
- [ ] Deployer wallet address verified
- [ ] Test deployments on testnet first
- [ ] Contract addresses captured from real blockchain
- [ ] Client updated with real addresses
- [ ] Tested full game flow on-chain
- [ ] Ready for mainnet deployment

---

## Support

For issues:
1. Check TON docs: https://ton.org/docs/
2. Check Tact docs: https://docs.tact-lang.org/
3. Check Blueprint: https://github.com/ton-org/blueprint

