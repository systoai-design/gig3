import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.77.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Running auto-release escrow check for proof submitted orders...');

    // Find orders that have been in proof_submitted status for more than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('id, gig_id, buyer_id, seller_id, amount_sol, delivered_at, status, escrow_released, gigs(seller_id), profiles!orders_seller_id_fkey(wallet_address)')
      .in('status', ['proof_submitted', 'delivered'])
      .eq('escrow_released', false)
      .lt('delivered_at', sevenDaysAgo.toISOString())
      .not('delivered_at', 'is', null);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${orders?.length || 0} orders ready for auto-release`);

    if (!orders || orders.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No orders to auto-release', count: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Platform fee is 5%
    const platformFeePercentage = 5;

    // Auto-release escrow for each order
    const completedOrders = [];
    const failedOrders = [];

    for (const order of orders) {
      try {
        console.log(`Processing auto-release for order ${order.id}...`);

        const platformFee = (order.amount_sol * platformFeePercentage) / 100;
        const sellerAmount = order.amount_sol - platformFee;

        // Update order to completed and mark escrow as released
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            platform_fee_sol: platformFee,
            escrow_released: true,
          })
          .eq('id', order.id);

        if (updateError) {
          console.error(`Failed to update order ${order.id}:`, updateError);
          failedOrders.push({ orderId: order.id, error: updateError.message });
          continue;
        }

        // Log escrow transaction
        const { error: logError } = await supabase
          .from('escrow_transactions')
          .insert({
            order_id: order.id,
            amount_sol: sellerAmount,
            transaction_type: 'auto_release',
            approved_by: null, // System auto-release, no user approval
          });

        if (logError) {
          console.error(`Failed to log escrow transaction for ${order.id}:`, logError);
        }

        completedOrders.push(order.id);
        console.log(`✓ Auto-released escrow for order ${order.id}: ${sellerAmount.toFixed(4)} SOL to seller, ${platformFee.toFixed(4)} SOL platform fee`);
      } catch (error: any) {
        console.error(`Error processing order ${order.id}:`, error);
        failedOrders.push({ orderId: order.id, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Auto-released escrow for ${completedOrders.length} order(s)`,
        completedOrders,
        failedOrders: failedOrders.length > 0 ? failedOrders : undefined,
        totalProcessed: orders.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in auto-complete:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});