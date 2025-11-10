import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';

// Escrow wallet for manual escrow (devnet)
export const ESCROW_WALLET = new PublicKey('W6Qe25zGpwRpt7k8Hrg2RANF7N88XP7JU5BEeKaTrJ2');
export const PLATFORM_TREASURY = new PublicKey('W6Qe25zGpwRpt7k8Hrg2RANF7N88XP7JU5BEeKaTrJ2');

export interface EscrowAccount {
  orderId: string;
  buyer: PublicKey;
  seller: PublicKey;
  amount: number;
  platformFeeBps: number;
  isReleased: boolean;
}

/**
 * Helper function to create a simple SOL transfer transaction
 * Used for manual escrow system
 */
export async function createEscrowTransfer(
  connection: Connection,
  from: PublicKey,
  to: PublicKey,
  amountSol: number
): Promise<Transaction> {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports: amountSol * 1_000_000_000, // Convert SOL to lamports
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = from;

  return transaction;
}
