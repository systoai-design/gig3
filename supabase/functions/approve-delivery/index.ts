import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

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

    console.log('Approving delivery for order:', orderId);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.id);

    // Create admin client for privileged operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Order fetch error:', orderError);
      throw new Error('Order not found');
    }

    console.log('Order found:', order);

    // Verify user is the buyer
    if (order.buyer_id !== user.id) {
      throw new Error('Only the buyer can approve delivery');
    }

    // Verify order status
    if (order.status !== 'delivered') {
      throw new Error('Order must be in delivered status to approve');
    }

    // Verify proof has been submitted
    if (!order.proof_files || order.proof_files.length === 0) {
      throw new Error('Seller must submit proof of work before approval');
    }

    console.log('Order eligible for approval, releasing escrow...');

    // Release escrow funds to seller
    const { data: releaseData, error: releaseError } = await supabaseAdmin.functions.invoke(
      'release-escrow-payment',
      {
        body: { orderId }
      }
    );

    if (releaseError) {
      console.error('Failed to release escrow:', releaseError);
      throw new Error('Failed to release payment to seller: ' + releaseError.message);
    }

    console.log('Escrow released:', releaseData);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Delivery approved and payment released to seller',
        transactionSignature: releaseData.signature,
        amountSent: releaseData.amountSent,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Approve delivery error:', error);
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
