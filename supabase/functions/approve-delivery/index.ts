import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.77.0";

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

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Unauthorized - No auth header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Get the user from the token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized - Invalid token');
    }

    // Get order details with seller wallet
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        gigs!orders_gig_id_fkey(
          seller_id,
          profiles!gigs_seller_id_fkey(wallet_address)
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // Verify user is the buyer
    if (order.buyer_id !== user.id) {
      throw new Error('Only the buyer can approve delivery');
    }

    // Check if proof was submitted
    if (order.status !== 'proof_submitted' && order.status !== 'delivered') {
      throw new Error('Order must have proof submitted before approval');
    }

    // Calculate platform fee (5%) and seller amount
    const platformFee = order.amount_sol * 0.05;
    const sellerAmount = order.amount_sol - platformFee;

    // Update order status to completed
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'completed',
        escrow_released: true,
        completed_at: new Date().toISOString(),
        platform_fee_sol: platformFee
      })
      .eq('id', orderId);

    if (updateError) {
      throw new Error('Failed to update order status');
    }

    // Log escrow transaction
    const { data: escrowTx, error: escrowError } = await supabaseAdmin
      .from('escrow_transactions')
      .insert({
        order_id: orderId,
        amount_sol: sellerAmount,
        transaction_type: 'release',
        approved_by: user.id,
      })
      .select()
      .single();

    if (escrowError) {
      console.error('Escrow transaction log failed:', escrowError);
    }

    console.log('Escrow released for order:', orderId);
    console.log('Seller receives:', sellerAmount, 'SOL');
    console.log('Platform fee:', platformFee, 'SOL');
    
    // Get seller wallet address
    const sellerWallet = (order.gigs as any).profiles.wallet_address;
    console.log('Seller wallet:', sellerWallet);
    
    // TODO: Implement actual Solana transfer using escrow program
    // This will be handled by the Solana escrow program integration
    // For now, this marks the escrow as released in the database
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Delivery approved and escrow released',
        sellerAmount,
        platformFee,
        sellerWallet,
        transactionId: escrowTx?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Approve delivery error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
