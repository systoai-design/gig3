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

    const { orderId } = await req.json();

    console.log('Releasing escrow for order:', orderId);

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, gigs(*), profiles!seller_id(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // Verify order is in delivered status
    if (order.status !== 'delivered') {
      throw new Error('Order must be delivered before releasing escrow');
    }

    // Get platform fee settings
    const { data: settings } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'platform_fee_percentage')
      .single();

    const platformFeePercentage = settings?.value ? Number(settings.value) : 5;
    const platformFee = (order.amount_sol * platformFeePercentage) / 100;
    const sellerAmount = order.amount_sol - platformFee;

    console.log(`Platform fee: ${platformFee} SOL, Seller receives: ${sellerAmount} SOL`);

    // Update order status to completed
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        platform_fee_sol: platformFee
      })
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }

    console.log('Escrow released successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Escrow released successfully',
        platformFee,
        sellerAmount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error releasing escrow:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});