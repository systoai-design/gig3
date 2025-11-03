# GIG3 Solana Escrow Program

Full Web3 escrow smart contract for secure freelance payments on Solana.

## Features

- **Trustless Escrow**: Funds held in Program Derived Addresses (PDAs)
- **Automatic Release**: Buyer approval triggers instant release to seller
- **Platform Fees**: Configurable basis points (default 5%)
- **Admin Intervention**: Dispute resolution with partial/full refunds
- **Security**: Admin whitelist and escrow state validation

## Architecture

```
Buyer → Escrow PDA → [Mutual Approval OR Admin] → Seller (95%) + Platform (5%)
                   ↓
              [Dispute] → Admin Refund → Buyer
```

## Deployment Instructions

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Build & Deploy

```bash
cd solana-program

# Build program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet (production)
anchor deploy --provider.cluster mainnet
```

### Initialize Admin Config

After deployment, initialize the admin configuration:

```bash
anchor run initialize-admin
```

## Integration

Update `src/lib/solana/escrow.ts` with your deployed program ID:

```typescript
export const ESCROW_PROGRAM_ID = new PublicKey('YOUR_DEPLOYED_PROGRAM_ID');
```

## Security Considerations

1. **Program ID**: Change before deployment (line 4 in lib.rs)
2. **Admin Keys**: Store securely, rotate regularly
3. **Platform Treasury**: Use multisig wallet for production
4. **Audits**: Get professional security audit before mainnet
5. **Testing**: Extensive testing on devnet first

## Cost Estimates

- Initialize Escrow: ~0.002 SOL (rent)
- Release Escrow: ~0.00001 SOL (transaction)
- Refund Escrow: ~0.00001 SOL (transaction)

## Support

For issues or questions about the Solana program, contact the GIG3 development team.
