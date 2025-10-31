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

    console.log('Checking for overdue deliveries...');

    // Get all in-progress orders with their gig delivery times
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('*, gigs(delivery_days)')
      .eq('status', 'in_progress');

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Checking ${orders?.length || 0} in-progress orders`);

    if (!orders || orders.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No orders to check', count: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const overdueOrders = [];
    const now = new Date();

    for (const order of orders) {
      if (!order.payment_confirmed_at || !order.gigs) continue;

      const confirmedDate = new Date(order.payment_confirmed_at);
      const deliveryDeadline = new Date(confirmedDate);
      deliveryDeadline.setDate(deliveryDeadline.getDate() + order.gigs.delivery_days);

      if (now > deliveryDeadline) {
        overdueOrders.push({
          orderId: order.id,
          daysOverdue: Math.floor((now.getTime() - deliveryDeadline.getTime()) / (1000 * 60 * 60 * 24))
        });
        console.log(`Order ${order.id} is overdue by ${overdueOrders[overdueOrders.length - 1].daysOverdue} days`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Found ${overdueOrders.length} overdue orders`,
        overdueOrders
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error checking delivery deadlines:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});