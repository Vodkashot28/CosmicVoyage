
# Smart Contract Deployment

## Prerequisites

Before deploying, ensure you have the required secrets configured in Replit:

### Required Secrets (Add via Secrets Tool)

Navigate to **Tools > Secrets** and add:

| Secret Key | Description | Example Value |
|------------|-------------|---------------|
| `TON_MNEMONIC` | TON wallet mnemonic (24 words) | `word1 word2 word3...` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |

**Never commit these values to version control!**

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

### 2. Update Environment Variables

The deployment script automatically updates contract addresses. To add custom environment variables:

**For Development (Replit Secrets):**
- Open **Tools > Secrets**
- Add your environment variables (e.g., `VITE_TON_TESTNET_ENDPOINT`)
- Variables are automatically loaded via `process.env`

**For Production:**
Variables are set in Replit's deployment configuration.

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
