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

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { orderId, action, reason, refundPercentage } = await req.json();

    console.log('Handling dispute:', { orderId, action, reason });

    // Check if user is admin
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!adminRole) {
      throw new Error('Only admins can resolve disputes');
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'disputed') {
      throw new Error('Order is not in disputed status');
    }

    let updateData: any = {
      dispute_resolved_at: new Date().toISOString(),
      dispute_reason: reason
    };

    if (action === 'refund') {
      // Calculate refund amount
      const refundAmount = (order.amount_sol * (refundPercentage || 100)) / 100;
      updateData.status = 'cancelled';
      updateData.refund_amount_sol = refundAmount;
      
      console.log(`Refunding ${refundAmount} SOL to buyer`);
    } else if (action === 'release') {
      // Release to seller
      const platformFeePercentage = 5; // Get from settings
      const platformFee = (order.amount_sol * platformFeePercentage) / 100;
      
      updateData.status = 'completed';
      updateData.completed_at = new Date().toISOString();
      updateData.platform_fee_sol = platformFee;
      
      console.log('Releasing funds to seller');
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Dispute resolved: ${action}`,
        order: updateData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error handling dispute:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});