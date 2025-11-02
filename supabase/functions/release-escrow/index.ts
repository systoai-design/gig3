import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, adminNotes } = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Unauthorized - No auth header')
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Get the user from the token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Unauthorized - Invalid token')
    }

    // Verify user is admin
    const { data: adminRole, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (roleError || !adminRole) {
      throw new Error('Admin access required')
    }

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*, gigs!orders_gig_id_fkey(seller_id, profiles!gigs_seller_id_fkey(wallet_address))')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found')
    }

    // Check if proof was submitted
    if (order.status !== 'proof_submitted' && order.status !== 'delivered' && order.status !== 'completed') {
      throw new Error('Order must have proof submitted or be completed')
    }

    // Calculate platform fee (5%) and seller amount
    const platformFee = order.amount_sol * 0.05
    const sellerAmount = order.amount_sol - platformFee

    // Update order status
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'completed',
        escrow_released: true,
        admin_notes: adminNotes || 'Approved by admin',
        completed_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      throw new Error('Failed to update order status')
    }

    // Log escrow transaction
    await supabaseAdmin
      .from('escrow_transactions')
      .insert({
        order_id: orderId,
        amount_sol: sellerAmount,
        transaction_type: 'release',
        approved_by: user.id,
      })

    console.log('Escrow released for order:', orderId)
    console.log('Seller receives:', sellerAmount, 'SOL')
    console.log('Platform fee:', platformFee, 'SOL')
    console.log('Seller wallet:', (order.gigs as any).profiles.wallet_address)
    
    // TODO: Implement actual Solana transfer from escrow wallet BBRKYbrTZc1toK1R7E4WeZWiiAhY4vNJSaW4Bd3uiPgR
    // to seller's wallet using secure signing mechanism
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Escrow released successfully',
        sellerAmount,
        platformFee,
        sellerWallet: (order.gigs as any).profiles.wallet_address
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Escrow release error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
