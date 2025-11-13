import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';
import { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram, 
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL
} from 'https://esm.sh/@solana/web3.js@1.98.4';
import bs58 from 'https://esm.sh/bs58@5.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    console.log('Releasing escrow for order:', orderId);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get order details with seller wallet
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        seller:profiles!orders_seller_id_fkey(wallet_address)
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Order fetch error:', orderError);
      throw new Error('Order not found');
    }

    console.log('Order found:', order);

    // Idempotency: if already released, return success immediately
    if (order.escrow_released) {
      console.log('Escrow already released, returning cached data');
      return new Response(
        JSON.stringify({ 
          success: true,
          signature: 'already-released',
          sellerWallet: order.seller?.wallet_address,
          amountSent: order.amount_sol,
          platformFee: 0,
          message: 'Escrow already released'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }

    // Verify order is eligible for release
    if (order.status !== 'delivered' && order.status !== 'completed') {
      throw new Error('Order must be delivered before releasing escrow');
    }

    const sellerWallet = order.seller?.wallet_address;
    if (!sellerWallet) {
      throw new Error('Seller wallet address not found');
    }

    // Validate seller wallet is a valid Solana public key
    let sellerPublicKey: PublicKey;
    try {
      sellerPublicKey = new PublicKey(sellerWallet);
    } catch (error) {
      console.error('Invalid seller wallet:', sellerWallet, error);
      throw new Error('Seller wallet address is not a valid Solana public key');
    }

    console.log('Seller wallet:', sellerWallet);

    // Load escrow private key from secrets
    const privateKeyBase58 = Deno.env.get('ESCROW_WALLET_PRIVATE_KEY');
    if (!privateKeyBase58) {
      throw new Error('Escrow private key not configured');
    }

    // Decode private key with hardened parsing
    let privateKeyBytes: Uint8Array;
    try {
      // Check if key is JSON array format
      if (privateKeyBase58.trim().startsWith('[')) {
        const keyArray = JSON.parse(privateKeyBase58);
        privateKeyBytes = new Uint8Array(keyArray);
      } else {
        // Assume base58 format
        privateKeyBytes = bs58.decode(privateKeyBase58);
      }
      
      // Validate key length (must be 64 bytes for Solana keypair)
      if (privateKeyBytes.length !== 64) {
        throw new Error(`Invalid key length: ${privateKeyBytes.length} bytes (expected 64)`);
      }
    } catch (error) {
      console.error('Failed to parse escrow private key:', error);
      throw new Error('Escrow private key format is invalid');
    }

    const escrowKeypair = Keypair.fromSecretKey(privateKeyBytes);

    console.log('Escrow wallet loaded:', escrowKeypair.publicKey.toBase58());

    // Connect to Solana mainnet
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

    // Calculate amount to send (100% to seller, 0% platform fee)
    const amountToSend = order.amount_sol;
    const amountLamports = Math.floor(amountToSend * LAMPORTS_PER_SOL);

    // Preflight check: verify escrow wallet has sufficient balance
    const escrowBalance = await connection.getBalance(escrowKeypair.publicKey);
    const requiredBalance = amountLamports + 5000; // amount + ~5000 lamports for fees
    
    console.log('Escrow balance check:', {
      balance: escrowBalance / LAMPORTS_PER_SOL,
      required: requiredBalance / LAMPORTS_PER_SOL,
      sufficient: escrowBalance >= requiredBalance
    });

    if (escrowBalance < requiredBalance) {
      throw new Error(
        `Insufficient escrow funds: has ${(escrowBalance / LAMPORTS_PER_SOL).toFixed(4)} SOL, ` +
        `needs ${(requiredBalance / LAMPORTS_PER_SOL).toFixed(4)} SOL`
      );
    }

    console.log('Releasing escrow:', {
      orderId: order.id,
      sellerWallet,
      amount: amountToSend,
      platformFee: 0,
    });

    // Create transfer transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: escrowKeypair.publicKey,
        toPubkey: sellerPublicKey,
        lamports: amountLamports,
      })
    );

    console.log('Sending transaction to Solana...');

    // Send and confirm transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [escrowKeypair],
      { commitment: 'confirmed' }
    );

    console.log('Escrow released! Signature:', signature);

    // Update order status
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        escrow_released: true,
        completed_at: new Date().toISOString(),
        status: 'completed',
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Failed to update order:', updateError);
      throw new Error('Failed to update order status');
    }

    console.log('Order updated to completed');

    // Log escrow release transaction
    await supabaseAdmin
      .from('escrow_transactions')
      .insert({
        order_id: orderId,
        amount_sol: amountToSend,
        transaction_type: 'release',
        transaction_signature: signature,
      });

    console.log('Escrow transaction logged');

    return new Response(
      JSON.stringify({ 
        success: true,
        signature,
        sellerWallet,
        amountSent: amountToSend,
        platformFee: 0,
        message: 'Escrow released successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Release escrow error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
