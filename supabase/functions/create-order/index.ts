import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.77.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-payment',
};

interface OrderRequest {
  gigId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if payment header exists
    const paymentHeader = req.headers.get('x-payment');
    
    if (!paymentHeader) {
      // No payment provided - respond with 402 Payment Required
      const orderData: OrderRequest = await req.json();
      
      // Fetch gig details for payment instructions
      const { data: gig, error: gigError } = await supabaseAdmin
        .from('gigs')
        .select('*, profiles!gigs_seller_id_fkey(wallet_address)')
        .eq('id', orderData.gigId)
        .single();

      if (gigError || !gig) {
        throw new Error('Gig not found');
      }

      const sellerWallet = (gig.profiles as any)?.wallet_address;
      if (!sellerWallet) {
        throw new Error('Seller wallet not configured');
      }

      // Updated escrow system - all funds go to escrow wallet
      const escrowWallet = 'BBRKYbrTZc1toK1R7E4WeZWiiAhY4vNJSaW4Bd3uiPgR';
      
      // x402 payment instructions - payment goes to escrow
      const paymentInstructions = {
        protocol: 'x402',
        version: '1.0',
        blockchain: 'solana',
        network: 'devnet', // Change to 'mainnet' for production
        token: 'USDC',
        amount: orderData.amount.toString(),
        recipients: [
          {
            address: escrowWallet,
            amount: orderData.amount.toString(),
            label: 'GIG3 Escrow - Secure Payment Holding'
          }
        ],
        metadata: {
          gigId: orderData.gigId,
          buyerId: orderData.buyerId,
          sellerId: orderData.sellerId,
          orderId: crypto.randomUUID(), // Temporary order ID for tracking
        }
      };

      console.log('Responding with 402 Payment Required', paymentInstructions);

      return new Response(
        JSON.stringify(paymentInstructions),
        {
          status: 402,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-Payment-Required': 'solana-x402',
          },
        }
      );
    }

    // Payment provided - verify and create order
    console.log('Payment received, verifying...');
    const paymentProof = JSON.parse(paymentHeader);
    const orderData: OrderRequest = await req.json();

    // Verify payment on Solana blockchain
    // In production, this would call x402 facilitator API
    const isPaymentValid = await verifyPayment(paymentProof);

    if (!isPaymentValid) {
      return new Response(
        JSON.stringify({ error: 'Payment verification failed' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create order in database with escrow tracking
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        gig_id: orderData.gigId,
        buyer_id: orderData.buyerId,
        seller_id: orderData.sellerId,
        amount_sol: orderData.amount,
        status: 'in_progress',
        transaction_signature: paymentProof.signature,
        escrow_account: 'BBRKYbrTZc1toK1R7E4WeZWiiAhY4vNJSaW4Bd3uiPgR',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error('Failed to create order');
    }

    // Log escrow transaction
    await supabaseAdmin
      .from('escrow_transactions')
      .insert({
        order_id: order.id,
        amount_sol: orderData.amount,
        transaction_type: 'deposit',
        transaction_signature: paymentProof.signature,
      });

    console.log('Order created successfully:', order.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        order,
        message: 'Payment verified and order created'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in create-order function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Verify payment on Solana blockchain
async function verifyPayment(paymentProof: any): Promise<boolean> {
  try {
    // TODO: Integrate with x402 facilitator for production
    // For now, basic validation
    console.log('Verifying payment proof:', paymentProof);
    
    // Check if signature exists
    if (!paymentProof.signature || typeof paymentProof.signature !== 'string') {
      console.error('Invalid signature format');
      return false;
    }

    // In production, call CDP facilitator API or community facilitator
    // Example: POST https://facilitator.x402.dev/verify
    // with paymentProof data
    
    // For devnet testing, accept any valid-looking signature
    return paymentProof.signature.length > 50;
    
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
}
