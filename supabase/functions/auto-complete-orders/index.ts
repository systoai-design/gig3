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

    console.log('Running auto-complete check for delivered orders...');

    // Find orders that have been delivered for more than 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'delivered')
      .lt('delivered_at', threeDaysAgo.toISOString());

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${orders?.length || 0} orders ready for auto-completion`);

    if (!orders || orders.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No orders to auto-complete', count: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Get platform fee
    const { data: settings } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'platform_fee_percentage')
      .single();

    const platformFeePercentage = settings?.value ? Number(settings.value) : 5;

    // Auto-complete each order
    const completedOrders = [];
    for (const order of orders) {
      const platformFee = (order.amount_sol * platformFeePercentage) / 100;
      
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          platform_fee_sol: platformFee
        })
        .eq('id', order.id);

      if (!updateError) {
        completedOrders.push(order.id);
        console.log(`Auto-completed order: ${order.id}`);
      } else {
        console.error(`Failed to complete order ${order.id}:`, updateError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Auto-completed ${completedOrders.length} orders`,
        completedOrders
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