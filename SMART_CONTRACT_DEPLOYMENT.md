# 🚀 Smart Contract Deployment Guide

## Quick Start

Deploy all Solar System Explorer smart contracts to TON blockchain in one command:

```bash
# Deploy to TON Testnet (recommended first)
npm run deploy:testnet

# Deploy to TON Mainnet (after testnet verification)
npm run deploy:mainnet
```

## What Gets Deployed

| Contract | Purpose | Network |
|----------|---------|---------|
| **STARToken** | 1B fixed supply STAR token | Both |
| **STARTokenWallet** | User wallet for STAR holdings | Both |
| **PlanetNFT** | NFT collection contract | Both |
| **PlanetNFTItem** | Individual NFT items | Both |
| **ReferralFaucet** | Tiered referral rewards (5-50 STAR) | Both |

## Deployment Flow

```
npm run deploy:testnet
       ↓
   Connect to TON Testnet RPC
       ↓
   Compile 5 Contracts
       ↓
   Deploy in Order:
   ├─ STARToken
   ├─ STARTokenWallet
   ├─ PlanetNFT
   ├─ PlanetNFTItem
   └─ ReferralFaucet
       ↓
   Save Addresses to .deployments/
   Save ENV to .env.deployment
       ↓
   Verify Deployments
       ↓
   Print Summary
```

## Output Files

After successful deployment:

```
.deployments/deployment_testnet_2024-11-23.json
├─ Network: testnet
├─ Deployer: 0:fa146...
├─ Timestamp: 2024-11-23T...
└─ Contracts: [
    { name, address, success, message }
  ]

.env.deployment
├─ STARTOKEN_ADDRESS=EQ...
├─ STARRTTOKENWALSET_ADDRESS=EQ...
├─ PLANET_NFT_ADDRESS=EQ...
├─ PLANET_NFT_ITEM_ADDRESS=EQ...
└─ REFERRAL_FAUCET_ADDRESS=EQ...
```

## Integration Steps

### 1. Copy Addresses

```bash
cat .env.deployment
# Copy the addresses displayed
```

### 2. Update Environment

Create/update `.env` file:

```env
VITE_STARTOKEN_ADDRESS=EQ...
VITE_STARTOKEN_WALLET_ADDRESS=EQ...
VITE_PLANET_NFT_ADDRESS=EQ...
VITE_PLANET_NFT_ITEM_ADDRESS=EQ...
VITE_REFERRAL_FAUCET_ADDRESS=EQ...
```

### 3. Update Contract References

Edit `client/src/lib/contracts.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  starToken: "EQ...",           // From STARTOKEN_ADDRESS
  starTokenWallet: "EQ...",     // From STARRTTOKENWALSET_ADDRESS
  planetNFT: "EQ...",           // From PLANET_NFT_ADDRESS
  planetNFTItem: "EQ...",       // From PLANET_NFT_ITEM_ADDRESS
  referralFaucet: "EQ...",      // From REFERRAL_FAUCET_ADDRESS
};
```

### 4. Test

1. Restart the game: `npm run dev`
2. Connect wallet via TON Connect
3. Test discovering planets (should mint NFTs)
4. Check STAR token balance
5. Test referral system

## Prerequisites

- **Node.js** installed
- **Wallet with TON**:
  - Testnet: Get free TON from [testnet faucet](https://testnet-faucet.tonkeeper.com/)
  - Mainnet: Real TON coins required
- **Internet connection** to reach TON RPC

## Deployment Checklist

### Pre-Deployment
- [ ] All contract files exist in `contracts/`
- [ ] Node.js and npm installed
- [ ] Wallet funded with TON (≥0.5 TON recommended)
- [ ] Internet connection stable

### Testnet Deployment
- [ ] Run `npm run deploy:testnet`
- [ ] Check output for success messages
- [ ] Verify `.env.deployment` file created
- [ ] Check contract addresses on [TON Testnet Scanner](https://testnet.tonscan.org/)

### Integration & Testing
- [ ] Update `.env` with contract addresses
- [ ] Update `client/src/lib/contracts.ts`
- [ ] Run `npm run dev`
- [ ] Connect wallet and test discovering planets
- [ ] Check STAR token balance appears
- [ ] Test referral system

### Mainnet Deployment (Optional)
- [ ] Testnet thoroughly verified
- [ ] Run `npm run deploy:mainnet`
- [ ] Verify all contracts on [TON Mainnet Scanner](https://tonscan.org/)
- [ ] Update production environment variables

## Troubleshooting

### Issue: Low Balance
```
⚠️ Low balance. Recommended minimum: 0.5 TON
```
**Fix:** Get more TON from faucet (testnet) or exchange (mainnet)

### Issue: RPC Connection Failed
```
Cannot connect to TON network
```
**Fix:** Check internet, verify TON network is operational

### Issue: Contract Not Found
```
⚠️ Contract file not found: contracts/STARToken.tact
```
**Fix:** Ensure all contract files are in the `contracts/` directory

## Advanced Usage

### Custom Network Endpoint

```bash
# Use custom RPC endpoint
TON_NETWORK=testnet npm run deploy:testnet

# Available: testnet, mainnet
```

### View Deployment History

```bash
# List all past deployments
ls .deployments/

# View specific deployment
cat .deployments/deployment_testnet_2024-11-23.json
```

## Network Details

| Network | RPC Endpoint | Explorer |
|---------|------------|----------|
| Testnet | `https://testnet.toncenter.com/api/v2/jsonRPC` | [testnet.tonscan.org](https://testnet.tonscan.org/) |
| Mainnet | `https://toncenter.com/api/v2/jsonRPC` | [tonscan.org](https://tonscan.org/) |

## Security Notes

⚠️ **Important:**

1. **Never share private keys** - deployment uses only public addresses
2. **Testnet first** - always test contracts before mainnet
3. **Verify addresses** - double-check contract addresses in explorers
4. **Keep backups** - save deployment records
5. **Monitor gas** - keep deployer wallet funded

## More Information

- Full deployment guide: [`contracts/DEPLOYMENT_GUIDE.md`](./contracts/DEPLOYMENT_GUIDE.md)
- TON Documentation: https://docs.ton.org/
- TON SDKs: https://ton.org/docs/#/

## Support

For issues or questions:
1. Check `contracts/DEPLOYMENT_GUIDE.md` for detailed troubleshooting
2. Review TON documentation at https://docs.ton.org/
3. Check contract logs in `.deployments/` directory

---

**Version:** 1.0
**Last Updated:** November 23, 2024
**Deployer Address:** `0:fa146529b8e269ffcd7a5eacf9473b641e35389c302d7e8c3df56eb3de9c7f01`
