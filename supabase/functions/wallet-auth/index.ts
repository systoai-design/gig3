import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';
import nacl from 'https://esm.sh/tweetnacl@1.0.3?bundle';
import bs58 from 'https://esm.sh/bs58@5.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { walletAddress, signature, message, name, username, isSignup } = await req.json();

    console.log('Wallet auth request:', { 
      walletAddress: walletAddress.substring(0, 8) + '...', 
      isSignup,
      timestamp: new Date().toISOString()
    });

    // Verify signature
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(walletAddress);
    
    const verified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
    
    if (!verified) {
      console.error('Signature verification failed for wallet:', walletAddress.substring(0, 8) + '...');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Signature verified successfully');

    // Create Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Check if wallet exists
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('wallet_address', walletAddress)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profile:', profileError);
      throw profileError;
    }
    
    if (existingProfile && !isSignup) {
      // User exists - create session using admin powers
      console.log('Existing wallet user logging in');
      
      const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(
        existingProfile.id
      );

      if (userError || !user) {
        console.error('Error fetching user:', userError);
        throw userError || new Error('User not found');
      }

      // Update password to ensure we can sign in
      const tempPassword = crypto.randomUUID();
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: tempPassword,
        email_confirm: true  // Ensure email is confirmed
      });

      if (updateError) {
        console.error('Error updating user password:', updateError);
        throw updateError;
      }

      // Wait a moment for the password update to propagate
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create a separate client for signing in (not the admin client)
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!
      );

      // Sign in with the temporary password to get valid session tokens
      const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email: user.email || `${walletAddress}@wallet.gig3.io`,
        password: tempPassword
      });

      if (signInError || !signInData.session) {
        console.error('Error signing in:', signInError);
        throw signInError || new Error('Failed to create session');
      }

      console.log('Session created successfully');
      
      return new Response(
        JSON.stringify({ 
          access_token: signInData.session.access_token,
          refresh_token: signInData.session.refresh_token,
          user: signInData.user,
          is_new_account: false
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (isSignup) {
      if (existingProfile) {
        console.log('Wallet already registered, rejecting duplicate signup');
        return new Response(
          JSON.stringify({ error: 'Wallet already registered. Please sign in.' }), 
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // New user - create auth account
      console.log('Creating new wallet account');
      
      const dummyEmail = `${walletAddress}@wallet.gig3.io`;
      const randomPassword = crypto.randomUUID();

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: dummyEmail,
        password: randomPassword,
        email_confirm: true, // Auto-confirm wallet users
        user_metadata: {
          wallet_address: walletAddress,
          name: name || 'Anonymous User',
          username: username || `user_${walletAddress.substring(0, 8)}`
        }
      });

      if (authError) {
        console.error('Error creating user:', authError);
        throw authError;
      }

      console.log('User created successfully:', authData.user.id);

      // Sign in immediately to get valid tokens
      const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
        email: dummyEmail,
        password: randomPassword
      });

      if (signInError || !signInData.session) {
        console.error('Error signing in new user:', signInError);
        throw signInError || new Error('Failed to create session');
      }

      console.log('Session created for new user');
      
      return new Response(
        JSON.stringify({ 
          access_token: signInData.session.access_token,
          refresh_token: signInData.session.refresh_token,
          user: signInData.user,
          is_new_account: true
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Wallet not found and not signup request
    console.log('Wallet not registered, rejecting login attempt');
    return new Response(
      JSON.stringify({ 
        error: 'Wallet not registered. Please sign up first.',
        registered: false,
        walletAddress: walletAddress
      }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in wallet-auth function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
