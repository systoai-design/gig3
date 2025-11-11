import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';
import { Connection, PublicKey } from 'https://esm.sh/@solana/web3.js@1.98.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ESCROW_WALLET = 'W6Qe25zGpwRpt7k8Hrg2RANF7N88XP7JU5BEeKaTrJ2';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      gigId, 
      buyerId, 
      sellerId, 
      amount, 
      deliveryDays,
      packageIndex,
      transactionSignature,
      escrowWallet 
    } = await req.json();

    console.log('Creating order:', { gigId, buyerId, sellerId, amount, transactionSignature });

    // Verify escrow wallet matches
    if (escrowWallet !== ESCROW_WALLET) {
      throw new Error('Invalid escrow wallet');
    }

    // Connect to Solana devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

    console.log('Verifying transaction on Solana:', transactionSignature);

    // Verify transaction exists and is confirmed
    const txInfo = await connection.getTransaction(transactionSignature, {
      maxSupportedTransactionVersion: 0
    });

    if (!txInfo) {
      throw new Error('Transaction not found on blockchain');
    }

    console.log('Transaction found:', txInfo);

    // Verify transaction was successful
    if (txInfo.meta?.err) {
      throw new Error('Transaction failed on blockchain');
    }

    // Get the transfer instruction
    const instructions = txInfo.transaction.message.compiledInstructions;
    if (!instructions || instructions.length === 0) {
      throw new Error('No instructions found in transaction');
    }

    // For SystemProgram transfer, lamports are in the instruction data
    // The amount transferred is visible in the balance changes
    const preBalances = txInfo.meta?.preBalances || [];
    const postBalances = txInfo.meta?.postBalances || [];
    
    // Calculate the amount transferred (difference in escrow wallet balance)
    // Escrow wallet should be the recipient (usually index 1)
    let transferAmount = 0;
    if (postBalances.length > 1 && preBalances.length > 1) {
      transferAmount = (postBalances[1] - preBalances[1]) / 1000000000; // Convert lamports to SOL
    }

    console.log('Transfer amount:', transferAmount, 'SOL');

    if (Math.abs(transferAmount - amount) > 0.0001) {
      throw new Error(`Amount mismatch: expected ${amount} SOL, got ${transferAmount} SOL`);
    }

    // Verify recipient is escrow wallet
    const accountKeys = txInfo.transaction.message.staticAccountKeys;
    if (accountKeys && accountKeys.length > 1) {
      const recipientKey = accountKeys[1].toBase58();
      if (recipientKey !== ESCROW_WALLET) {
        throw new Error('Transaction not sent to escrow wallet');
      }
    } else {
      throw new Error('Could not verify transaction recipient');
    }

    console.log('Transaction verified successfully');

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create order in database with 'pending' status first
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        gig_id: gigId,
        buyer_id: buyerId,
        seller_id: sellerId,
        amount_sol: amount,
        status: 'pending',
        escrow_account: ESCROW_WALLET,
        transaction_signature: transactionSignature,
        platform_fee_sol: 0, // 0% platform fee
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw orderError;
    }

    console.log('Order created:', order.id);

    // Update to 'in_progress' to trigger payment_confirmed_at timestamp
    const { error: confirmError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'in_progress' })
      .eq('id', order.id);

    if (confirmError) {
      console.error('Payment confirmation error:', confirmError);
      throw confirmError;
    }

    console.log('Payment confirmed for order:', order.id);

    // Log escrow transaction
    await supabaseAdmin
      .from('escrow_transactions')
      .insert({
        order_id: order.id,
        amount_sol: amount,
        transaction_type: 'deposit',
        transaction_signature: transactionSignature,
      });

    console.log('Escrow transaction logged');

    return new Response(
      JSON.stringify({ 
        success: true,
        orderId: order.id,
        transactionSignature,
        message: 'Order created and payment verified'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Create order error:', error);
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
