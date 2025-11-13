# GIG3 Mainnet Migration Plan (Simplified - No Smart Contracts)

## Overview
This plan migrates the GIG3 platform from Solana **devnet** to **mainnet-beta** using the existing manual escrow wallet system. No smart contract deployment required.

---

## Current Setup (Devnet)
- **Escrow Wallet**: `W6Qe25zGpwRpt7k8Hrg2RANF7N88XP7JU5BEeKaTrJ2`
- **Network**: Devnet
- **RPC Endpoint**: `https://api.devnet.solana.com`
- **Explorer**: `https://explorer.solana.com/?cluster=devnet`

---

## Target Setup (Mainnet)

### Option A: Use Current Wallet on Mainnet
⚠️ **Important**: The current devnet wallet (`W6Qe25zGpwRpt7k8Hrg2RANF7N88XP7JU5BEeKaTrJ2`) can technically work on mainnet if you have the private key, BUT you need to ensure:
- You have the private key for this wallet
- This wallet is funded with real SOL on mainnet
- You're comfortable using this wallet for production

### Option B: Create New Mainnet Wallet (Recommended)
Create a fresh mainnet escrow wallet:
```bash
solana-keygen new --outfile mainnet-escrow-keypair.json
```
This will output:
- **Public Key**: Your new mainnet escrow wallet address
- **Private Key**: Stored in the keypair file

---

## Files to Update

### 1. **Frontend Files** (2 files)

#### `src/lib/solana/escrow.ts`
```typescript
// CHANGE FROM:
export const ESCROW_WALLET = new PublicKey('W6Qe25zGpwRpt7k8Hrg2RANF7N88XP7JU5BEeKaTrJ2');
export const PLATFORM_TREASURY = new PublicKey('W6Qe25zGpwRpt7k8Hrg2RANF7N88XP7JU5BEeKaTrJ2');

// CHANGE TO:
export const ESCROW_WALLET = new PublicKey('YOUR_MAINNET_WALLET_ADDRESS');
export const PLATFORM_TREASURY = new PublicKey('YOUR_MAINNET_WALLET_ADDRESS');
```

#### `src/contexts/WalletProvider.tsx`
```typescript
// CHANGE FROM:
const network = WalletAdapterNetwork.Devnet;

// CHANGE TO:
const network = WalletAdapterNetwork.Mainnet;
```

### 2. **Backend Edge Functions** (2 files)

#### `supabase/functions/create-order/index.ts`
```typescript
// CHANGE FROM:
const ESCROW_WALLET = 'W6Qe25zGpwRpt7k8Hrg2RANF7N88XP7JU5BEeKaTrJ2';
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// CHANGE TO:
const ESCROW_WALLET = 'YOUR_MAINNET_WALLET_ADDRESS';
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
```

#### `supabase/functions/release-escrow-payment/index.ts`
```typescript
// CHANGE FROM:
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// CHANGE TO:
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
```

---

## Supabase Secret Update

### Update `ESCROW_WALLET_PRIVATE_KEY`
The existing secret needs to be updated with your **mainnet** wallet's private key.

**Format options:**
1. **Base58 encoded** (recommended): `5J7x...ABC`
2. **JSON array**: `[123, 45, 67, ...]` (64-byte array)

---

## Pre-Migration Checklist

- [ ] **Mainnet wallet created** (or existing wallet confirmed)
- [ ] **Private key secured** (backed up safely)
- [ ] **Mainnet wallet funded** with at least 5-10 SOL for:
  - Order payouts to sellers
  - Transaction fees (~0.000005 SOL per transaction)
- [ ] **Private key ready** to update in Supabase secrets
- [ ] **Tested on mainnet** (optional: create test order)

---

## Migration Steps

### Step 1: Confirm Wallet Address
Please provide your **mainnet escrow wallet address**:
- Current devnet: `W6Qe25zGpwRpt7k8Hrg2RANF7N88XP7JU5BEeKaTrJ2`
- Mainnet: `_________________________`

### Step 2: Code Updates
I will update all 4 files with the mainnet wallet address and RPC endpoints.

### Step 3: Secret Update
You will update the `ESCROW_WALLET_PRIVATE_KEY` secret with the mainnet private key.

### Step 4: Fund Wallet
Transfer SOL to the mainnet escrow wallet (recommended: 10+ SOL to start).

### Step 5: Deploy & Test
- Code deploys automatically
- Create a test order to verify mainnet transactions work

---

## Explorer Links Update

All transaction links will automatically use mainnet explorer:
- Devnet: `https://explorer.solana.com/tx/{signature}?cluster=devnet`
- Mainnet: `https://explorer.solana.com/tx/{signature}` (no cluster param needed)

---

## Risk Assessment

### Low Risk ✅
- No smart contracts to deploy
- Simple wallet address changes
- Reversible (can switch back to devnet if needed)

### Medium Risk ⚠️
- Real SOL is at stake on mainnet
- Escrow wallet private key must be kept secure
- Need sufficient balance for payouts

### High Risk ❌
- None (no complex migrations or data changes)

---

## Rollback Plan

If issues occur on mainnet:
1. Revert 4 files to devnet configuration
2. Switch secret back to devnet private key
3. Redeploy (automatic)

---

## Next Steps

**Please confirm:**
1. Do you want to use the existing wallet (`W6Qe25zGpwRpt7k8Hrg2RANF7N88XP7JU5BEeKaTrJ2`) on mainnet?
2. Or should I help you set up a new mainnet wallet?
3. Once confirmed, I'll update all 4 files immediately.

---

## Summary

**Total Changes:**
- 4 files to update
- 1 secret to update
- 0 smart contracts to deploy
- ~5 minutes to complete

**Cost:**
- No deployment costs
- Only need SOL in escrow wallet for operations
