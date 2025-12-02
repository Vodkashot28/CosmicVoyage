
# Smart Contract Deployment

## Quick Deploy

```bash
# Testnet (recommended first)
npm run deploy:testnet

# Mainnet (after verification)
npm run deploy:mainnet
```

## Contracts Deployed
1. **STARToken** - 1B fixed supply token
2. **STARTokenWallet** - User wallet contract
3. **PlanetNFT** - NFT collection
4. **PlanetNFTItem** - Individual NFTs
5. **ReferralFaucet** - Tiered referral rewards

## Post-Deployment

### 1. Copy Addresses
```bash
cat .env.deployment
```

### 2. Update Environment
Create `.env`:
```env
VITE_STARTOKEN_ADDRESS=EQ...
VITE_PLANET_NFT_ADDRESS=EQ...
VITE_REFERRAL_FAUCET_ADDRESS=EQ...
```

### 3. Update Contract Config
Edit `client/src/lib/contracts.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  starToken: "EQ...",
  planetNFT: "EQ...",
  referralFaucet: "EQ...",
};
```

## Verification
Check contracts on [TON Testnet Scanner](https://testnet.tonscan.org/)

## Troubleshooting
- **Low balance?** Get TON from [testnet faucet](https://testnet-faucet.tonkeeper.com/)
- **RPC failed?** Verify internet connection
- **Contract not found?** Check `.deployments/` logs

**Full Guide:** See original `SMART_CONTRACT_DEPLOYMENT.md` for detailed troubleshooting
