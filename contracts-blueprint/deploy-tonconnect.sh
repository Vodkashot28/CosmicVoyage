#!/bin/bash
set -e

echo "🚀 TON Contract Deployment via Blueprint"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Deployment Process:"
echo "1. Network: testnet"
echo "2. Wallet: TON Connect (scan QR with Tonkeeper)"
echo "3. Contracts: All 5 will be deployed"
echo ""
echo "Starting deployment..."
echo ""

# Run blueprint deploy with testnet selection
# The interactive prompts will appear for user to interact with
npx blueprint deploy

