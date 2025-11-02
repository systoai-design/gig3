import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';
import { Connection, PublicKey } from 'https://esm.sh/@solana/web3.js@1.98.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubscriptionRequest {
  action: 'create' | 'verify' | 'cancel';
  transactionSignature?: string;
  walletAddress?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const body: SubscriptionRequest = await req.json();
    console.log('Subscription request:', { action: body.action, userId: user.id });

    // Check if user is a seller
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isSeller = roles?.some(r => r.role === 'seller' || r.role === 'admin');
    if (!isSeller) {
      return new Response(
        JSON.stringify({ error: 'Only sellers can subscribe to Pro' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (body.action) {
      case 'create': {
        // Return payment instructions for x402 protocol
        const walletAddress = body.walletAddress;
        if (!walletAddress) {
          throw new Error('Wallet address required');
        }

        const amount = 0.5; // 0.5 SOL for Pro subscription
        
        return new Response(
          JSON.stringify({
            success: true,
            payment: {
              amount_sol: amount,
              recipient: Deno.env.get('PAYMENT_WALLET_ADDRESS') || 'YOUR_WALLET_ADDRESS',
              message: `GIG3 Pro Subscription - User ${user.id}`,
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'verify': {
        const { transactionSignature } = body;
        if (!transactionSignature) {
          throw new Error('Transaction signature required');
        }

        console.log('Verifying transaction:', transactionSignature);

        // Connect to Solana devnet
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        
        try {
          const tx = await connection.getTransaction(transactionSignature, {
            maxSupportedTransactionVersion: 0
          });

          if (!tx) {
            throw new Error('Transaction not found');
          }

          console.log('Transaction verified');

          // Calculate subscription period (30 days)
          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 30);

          // Check if subscription already exists
          const { data: existingSub } = await supabaseClient
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('plan', 'pro')
            .single();

          if (existingSub) {
            // Update existing subscription (renewal)
            const { data: subscription, error: subError } = await supabaseClient
              .from('subscriptions')
              .update({
                status: 'active',
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                transaction_signature: transactionSignature,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existingSub.id)
              .select()
              .single();

            if (subError) throw subError;

            // Record payment
            await supabaseClient
              .from('subscription_payments')
              .insert({
                subscription_id: subscription.id,
                amount_sol: 0.5,
                transaction_signature: transactionSignature,
                period_start: startDate.toISOString(),
                period_end: endDate.toISOString(),
              });

            console.log('Subscription renewed successfully');

            return new Response(
              JSON.stringify({ success: true, subscription, renewed: true }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          } else {
            // Create new subscription
            const { data: subscription, error: subError } = await supabaseClient
              .from('subscriptions')
              .insert({
                user_id: user.id,
                plan: 'pro',
                status: 'active',
                amount_sol: 0.5,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                transaction_signature: transactionSignature,
              })
              .select()
              .single();

            if (subError) throw subError;

            // Record payment
            await supabaseClient
              .from('subscription_payments')
              .insert({
                subscription_id: subscription.id,
                amount_sol: 0.5,
                transaction_signature: transactionSignature,
                period_start: startDate.toISOString(),
                period_end: endDate.toISOString(),
              });

            console.log('Subscription created successfully');

            return new Response(
              JSON.stringify({ success: true, subscription, renewed: false }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        } catch (txError) {
          console.error('Transaction verification failed:', txError);
          throw new Error('Invalid transaction');
        }
      }

      case 'cancel': {
        // Cancel active subscription
        const { data: subscription, error: cancelError } = await supabaseClient
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('user_id', user.id)
          .eq('plan', 'pro')
          .eq('status', 'active')
          .select()
          .single();

        if (cancelError) throw cancelError;

        console.log('Subscription cancelled');

        return new Response(
          JSON.stringify({ success: true, subscription }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});