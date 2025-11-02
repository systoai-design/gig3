import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Checking for expired subscriptions...');

    // Find all active subscriptions that have passed their end_date
    const { data: expiredSubs, error: fetchError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .lt('end_date', new Date().toISOString());

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${expiredSubs?.length || 0} expired subscriptions`);

    if (expiredSubs && expiredSubs.length > 0) {
      // Update all expired subscriptions
      const { error: updateError } = await supabaseClient
        .from('subscriptions')
        .update({ status: 'expired' })
        .in('id', expiredSubs.map(sub => sub.id));

      if (updateError) {
        throw updateError;
      }

      console.log(`Updated ${expiredSubs.length} subscriptions to expired status`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        expired_count: expiredSubs?.length || 0,
        checked_at: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error checking expired subscriptions:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});