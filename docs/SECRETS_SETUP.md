
# Secrets & Environment Variables Setup

This guide explains how to configure all required secrets and environment variables for Solar System Explorer.

## Using Replit Secrets

Replit provides encrypted storage for sensitive data. Access it via:
1. Click **Tools** in the sidebar
2. Select **Secrets**
3. Add key-value pairs

## Required Secrets

### 1. Database Configuration

```
DATABASE_URL
```

**Description**: PostgreSQL connection string  
**Example**: `postgresql://user:password@host.region.aws.neon.tech/dbname?sslmode=require`  
**Used by**: Backend server, database migrations  
**Required for**: All database operations

### 2. Blockchain Deployment

```
TON_MNEMONIC
```

**Description**: 24-word TON wallet mnemonic for contract deployment  
**Example**: `word1 word2 word3 ... word24`  
**Used by**: Contract deployment scripts  
**Required for**: Deploying smart contracts to TON blockchain

⚠️ **Critical**: Keep this mnemonic secure! It controls the wallet deploying contracts.

## Auto-Configured Variables

These are set automatically after running deployment scripts:

```bash
VITE_STAR_TOKEN_ADDRESS=EQ...
VITE_STAR_TOKEN_WALLET_ADDRESS=EQ...
VITE_PLANET_NFT_ADDRESS=EQ...
VITE_PLANET_NFT_ITEM_ADDRESS=EQ...
VITE_REFERRAL_FAUCET_ADDRESS=EQ...
```

## Optional Configuration

### Development

```
VITE_TON_TESTNET_ENDPOINT=https://testnet.toncenter.com/api/v2/jsonRPC
VITE_TON_EXPLORER=https://testnet.tonscan.org
```

### Production

```
NODE_ENV=production
```

## Accessing Secrets in Code

### Frontend (Vite)

```typescript
// Prefix with VITE_ for frontend access
const tokenAddress = import.meta.env.VITE_STAR_TOKEN_ADDRESS;
```

### Backend (Node.js)

```typescript
// Direct access via process.env
const dbUrl = process.env.DATABASE_URL;
const mnemonic = process.env.TON_MNEMONIC;
```

## Security Best Practices

1. ✅ **Use Replit Secrets** - Never hardcode sensitive data
2. ✅ **Separate environments** - Use different mnemonics for testnet/mainnet
3. ✅ **Rotate secrets** - Update database passwords periodically
4. ✅ **Limit access** - Only share secrets with trusted collaborators
5. ❌ **Never commit** - Ensure `.env` files are in `.gitignore`

## Verification Checklist

Before running the application:

- [ ] `DATABASE_URL` is set in Secrets
- [ ] `TON_MNEMONIC` is set in Secrets (for deployment)
- [ ] Contract addresses are configured (after deployment)
- [ ] No secrets are committed to git
- [ ] `.env.local` files are gitignored

## Troubleshooting

### "Environment variable not found"

**Solution**: Add the missing variable to Replit Secrets and restart the application.

### "Cannot connect to database"

**Solution**: Verify `DATABASE_URL` format and check Neon database status.

### "Deployment failed - insufficient funds"

**Solution**: Ensure the wallet (from `TON_MNEMONIC`) has enough TON for gas fees.

## Reference

- [Replit Secrets Documentation](https://docs.replit.com/programming-ide/workspace-features/secrets)
- [Smart Contract Deployment Guide](blockchain/smart_contract_deployment.md)
- [API Integration Guide](api/api_guide.md)

---

**Last Updated**: December 2025  
**Status**: Production Ready

