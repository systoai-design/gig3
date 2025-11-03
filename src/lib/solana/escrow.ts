import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';

// This will be replaced with the actual program ID after deployment
export const ESCROW_PROGRAM_ID = new PublicKey('GIG3EscrowProgramIDChangeBeforeDeployment11111');
export const PLATFORM_TREASURY = new PublicKey('BBRKYbrTZc1toK1R7E4WeZWiiAhY4vNJSaW4Bd3uiPgR');

export interface EscrowAccount {
  orderId: string;
  buyer: PublicKey;
  seller: PublicKey;
  amount: number;
  platformFeeBps: number;
  isReleased: boolean;
}

/**
 * Find the PDA for an escrow account
 */
export function findEscrowPDA(orderId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('escrow'), Buffer.from(orderId)],
    ESCROW_PROGRAM_ID
  );
}

/**
 * Find the admin config PDA
 */
export function findAdminConfigPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('admin_config')],
    ESCROW_PROGRAM_ID
  );
}

/**
 * Initialize escrow for an order
 * This creates a PDA that holds the buyer's SOL until delivery is approved
 */
export async function initializeEscrow(
  connection: Connection,
  buyer: PublicKey,
  seller: PublicKey,
  orderId: string,
  amountLamports: number,
  platformFeeBps: number = 500 // 5% default
): Promise<Transaction> {
  const [escrowPDA] = findEscrowPDA(orderId);

  // Create instruction data buffer
  const orderIdBuffer = Buffer.from(orderId);
  const amountBuffer = Buffer.alloc(8);
  amountBuffer.writeBigUInt64LE(BigInt(amountLamports));
  const feeBuffer = Buffer.alloc(2);
  feeBuffer.writeUInt16LE(platformFeeBps);
  
  const data = Buffer.concat([
    Buffer.from([0]), // instruction discriminator
    orderIdBuffer,
    amountBuffer,
    seller.toBuffer(),
    feeBuffer,
  ]);

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: escrowPDA, isSigner: false, isWritable: true },
      { pubkey: buyer, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: ESCROW_PROGRAM_ID,
    data,
  });

  const transaction = new Transaction().add(instruction);
  return transaction;
}

/**
 * Release escrow to seller
 * Called by buyer when approving delivery or by admin for manual intervention
 */
export async function releaseEscrow(
  connection: Connection,
  signer: PublicKey,
  orderId: string,
  sellerWallet: PublicKey
): Promise<Transaction> {
  const [escrowPDA] = findEscrowPDA(orderId);
  const [adminConfigPDA] = findAdminConfigPDA();

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: escrowPDA, isSigner: false, isWritable: true },
      { pubkey: sellerWallet, isSigner: false, isWritable: true },
      { pubkey: PLATFORM_TREASURY, isSigner: false, isWritable: true },
      { pubkey: signer, isSigner: true, isWritable: false },
      { pubkey: adminConfigPDA, isSigner: false, isWritable: false },
    ],
    programId: ESCROW_PROGRAM_ID,
    data: Buffer.from([1]), // instruction index for release_escrow
  });

  const transaction = new Transaction().add(instruction);
  return transaction;
}

/**
 * Refund escrow to buyer
 * Admin-only function for dispute resolution
 */
export async function refundEscrow(
  connection: Connection,
  admin: PublicKey,
  orderId: string,
  buyerWallet: PublicKey,
  sellerWallet: PublicKey,
  refundPercentage: number = 10000 // 100% = full refund
): Promise<Transaction> {
  const [escrowPDA] = findEscrowPDA(orderId);
  const [adminConfigPDA] = findAdminConfigPDA();

  const refundBuffer = Buffer.alloc(2);
  refundBuffer.writeUInt16LE(refundPercentage);
  
  const data = Buffer.concat([
    Buffer.from([2]), // instruction discriminator
    refundBuffer,
  ]);

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: escrowPDA, isSigner: false, isWritable: true },
      { pubkey: buyerWallet, isSigner: false, isWritable: true },
      { pubkey: sellerWallet, isSigner: false, isWritable: true },
      { pubkey: admin, isSigner: true, isWritable: false },
      { pubkey: adminConfigPDA, isSigner: false, isWritable: false },
    ],
    programId: ESCROW_PROGRAM_ID,
    data,
  });

  const transaction = new Transaction().add(instruction);
  return transaction;
}

/**
 * Fetch escrow account data
 */
export async function getEscrowAccount(
  connection: Connection,
  orderId: string
): Promise<EscrowAccount | null> {
  try {
    const [escrowPDA] = findEscrowPDA(orderId);
    const accountInfo = await connection.getAccountInfo(escrowPDA);
    
    if (!accountInfo) {
      return null;
    }

    // Parse account data (simplified - in production use IDL)
    const data = accountInfo.data;
    
    // Read amount as little-endian 64-bit unsigned integer
    const amountBuffer = data.slice(72, 80);
    const amount = Number(amountBuffer.readBigUInt64LE());
    
    // Read fee basis points as little-endian 16-bit unsigned integer
    const feeBps = data.readUInt16LE(80);
    
    return {
      orderId,
      buyer: new PublicKey(data.slice(8, 40)),
      seller: new PublicKey(data.slice(40, 72)),
      amount,
      platformFeeBps: feeBps,
      isReleased: data[82] === 1,
    };
  } catch (error) {
    console.error('Error fetching escrow account:', error);
    return null;
  }
}

/**
 * Check if escrow program is deployed and accessible
 */
export async function checkEscrowProgramDeployed(
  connection: Connection
): Promise<boolean> {
  try {
    const programInfo = await connection.getAccountInfo(ESCROW_PROGRAM_ID);
    return programInfo !== null && programInfo.executable;
  } catch (error) {
    console.error('Error checking escrow program:', error);
    return false;
  }
}
