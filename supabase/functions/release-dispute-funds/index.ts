import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "npm:@solana/web3.js@1.98.4";
import * as bs58 from "npm:bs58@5.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLATFORM_TREASURY = new PublicKey('W6Qe25zGpwRpt7k8Hrg2RANF7N88XP7JU5BEeKaTrJ2');
const HELIUS_RPC = 'https://mainnet.helius-rpc.com/?api-key=a181d89a-54f8-4a83-a857-a760d595180f';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, buyerWallet, sellerWallet, totalAmount, refundPercentage } = await req.json();

    console.log('Release dispute funds:', { orderId, buyerWallet, sellerWallet, totalAmount, refundPercentage });

    // Load escrow wallet keypair
    const privateKeyBase58 = Deno.env.get('ESCROW_WALLET_PRIVATE_KEY');
    if (!privateKeyBase58) {
      throw new Error('Escrow wallet private key not configured');
    }

    const privateKeyBytes = bs58.default.decode(privateKeyBase58);
    const escrowKeypair = Keypair.fromSecretKey(privateKeyBytes);

    // Connect to Solana
    const connection = new Connection(HELIUS_RPC, 'confirmed');

    // Create transaction
    const transaction = new Transaction();

    const refundPercent = refundPercentage || 0;
    const refundAmountLamports = Math.floor((totalAmount * 1_000_000_000 * refundPercent) / 100);
    const sellerPercent = 100 - refundPercent;
    
    // If partial refund, calculate seller and platform amounts
    if (sellerPercent > 0) {
      const sellerAmount = (totalAmount * sellerPercent) / 100;
      const platformFeePercent = 5;
      const platformFeeLamports = Math.floor((sellerAmount * 1_000_000_000 * platformFeePercent) / 100);
      const sellerNetLamports = Math.floor(sellerAmount * 1_000_000_000) - platformFeeLamports;

      // Transfer to seller
      if (sellerNetLamports > 0) {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: escrowKeypair.publicKey,
            toPubkey: new PublicKey(sellerWallet),
            lamports: sellerNetLamports,
          })
        );
      }

      // Transfer platform fee
      if (platformFeeLamports > 0) {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: escrowKeypair.publicKey,
            toPubkey: PLATFORM_TREASURY,
            lamports: platformFeeLamports,
          })
        );
      }
    }

    // Refund to buyer if applicable
    if (refundAmountLamports > 0) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: escrowKeypair.publicKey,
          toPubkey: new PublicKey(buyerWallet),
          lamports: refundAmountLamports,
        })
      );
    }

    // Get recent blockhash and send transaction
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = escrowKeypair.publicKey;

    // Sign and send
    transaction.sign(escrowKeypair);
    const signature = await connection.sendRawTransaction(transaction.serialize());

    // Confirm transaction
    await connection.confirmTransaction(signature, 'confirmed');

    console.log('Dispute funds released:', signature);

    return new Response(
      JSON.stringify({
        success: true,
        signature,
        refundAmount: refundAmountLamports / 1_000_000_000,
        sellerAmount: sellerPercent > 0 ? (totalAmount * sellerPercent) / 100 : 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error releasing dispute funds:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
